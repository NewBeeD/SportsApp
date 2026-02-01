const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

const SCORING_VERSION = 2;

// Calculate prediction points when a match is marked as finished
exports.calculatePredictionPoints = functions.firestore
  .document("matches/{matchId}")
  .onUpdate(async (change, context) => {
    const matchBefore = change.before.data();
    const matchAfter = change.after.data();

    // Only process finished matches
    if (matchAfter.status !== "FINISHED") {
      return;
    }

    const matchId = context.params.matchId;
    const actualScore = matchAfter.actualScore;
    const gameweek = matchAfter.gameweek || 1; // Default to gameweek 1 if not specified

    // Validate actualScore exists
    if (!actualScore || typeof actualScore.home === 'undefined' || typeof actualScore.away === 'undefined') {
      console.error(`Invalid actualScore for match ${matchId}:`, actualScore);
      return;
    }

    const OUTCOME_POINTS = 5;
    const EXACT_SCORE_POINTS = 10;

    try {
      // Get all predictions for this match
      const predictionsSnapshot = await db
        .collection("predictions")
        .where("matchId", "==", matchId)
        .get();

      console.log(`Found ${predictionsSnapshot.size} predictions for match ${matchId} (Gameweek ${gameweek})`);

      const batch = db.batch();
      const pointsDeltaMap = {}; // Track point deltas per user
      const predictionsDeltaMap = {}; // Track newly-scored predictions per user
      const correctDeltaMap = {}; // Track correct prediction deltas per user
      const exactScoreDeltaMap = {}; // Track exact score deltas per user

      predictionsSnapshot.forEach((doc) => {
        const prediction = doc.data();
        const userId = prediction.userId;

        // Support both newer schema (predictedScore) and older (homeScore/awayScore)
        const predictedHomeRaw = prediction.predictedScore?.home ?? prediction.homeScore;
        const predictedAwayRaw = prediction.predictedScore?.away ?? prediction.awayScore;
        if (typeof predictedHomeRaw === 'undefined' || typeof predictedAwayRaw === 'undefined') {
          console.warn(`Invalid prediction structure for ${doc.id}:`, prediction);
          return;
        }

        const predictedHome = Number(predictedHomeRaw);
        const predictedAway = Number(predictedAwayRaw);
        const actualHome = Number(actualScore.home);
        const actualAway = Number(actualScore.away);

        if (Number.isNaN(predictedHome) || Number.isNaN(predictedAway) || Number.isNaN(actualHome) || Number.isNaN(actualAway)) {
          console.warn(`Non-numeric score values for ${doc.id}:`, {
            predictedHome: predictedHomeRaw,
            predictedAway: predictedAwayRaw,
            actualHome: actualScore.home,
            actualAway: actualScore.away,
          });
          return;
        }

        const oldPoints = typeof prediction.points === 'number' ? prediction.points : 0;
        const wasAwarded = prediction.pointsAwarded === true;
        const oldExact = ((prediction.pointBreakdown && prediction.pointBreakdown.exactScorePoints) ? prediction.pointBreakdown.exactScorePoints : 0) > 0 || oldPoints >= 10;
        const oldCorrect = oldPoints > 0;

        const isExact = predictedHome === actualHome && predictedAway === actualAway;

        const isOutcomeCorrect = isExact || (
          (predictedHome > predictedAway && actualHome > actualAway) ||
          (predictedHome < predictedAway && actualHome < actualAway) ||
          (predictedHome === predictedAway && actualHome === actualAway)
        );

        const outcomePoints = isOutcomeCorrect ? OUTCOME_POINTS : 0;
        const exactScorePoints = isExact ? EXACT_SCORE_POINTS : 0;
        const newPoints = outcomePoints + exactScorePoints;

        const newCorrect = newPoints > 0;
        const newExact = isExact;

        const deltaPoints = newPoints - oldPoints;
        const deltaCorrect = (newCorrect ? 1 : 0) - (oldCorrect ? 1 : 0);
        const deltaExact = (newExact ? 1 : 0) - (oldExact ? 1 : 0);
        const deltaPredictions = wasAwarded ? 0 : 1;

        // Update prediction document (always keep points in sync with current rules)
        batch.update(doc.ref, {
          points: newPoints,
          pointsAwarded: true,
          gameweek: gameweek,
          pointBreakdown: {
            outcomePoints,
            exactScorePoints,
          },
          scoringVersion: SCORING_VERSION,
          scoringRules: {
            outcomePoints: OUTCOME_POINTS,
            exactScorePoints: EXACT_SCORE_POINTS,
            stacked: true,
          },
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        pointsDeltaMap[userId] = (pointsDeltaMap[userId] || 0) + deltaPoints;
        predictionsDeltaMap[userId] = (predictionsDeltaMap[userId] || 0) + deltaPredictions;
        correctDeltaMap[userId] = (correctDeltaMap[userId] || 0) + deltaCorrect;
        exactScoreDeltaMap[userId] = (exactScoreDeltaMap[userId] || 0) + deltaExact;

        console.log(
          `Prediction ${doc.id}: predicted ${predictedHome}-${predictedAway}, actual ${actualHome}-${actualAway}, oldPoints: ${oldPoints}, newPoints: ${newPoints}, delta: ${deltaPoints}, scoringVersion: ${SCORING_VERSION}`
        );
      });

      // Update leaderboard entries (both seasonal and gameweek-specific)
      for (const userId of Object.keys(pointsDeltaMap)) {
        const leaderboardRef = db.collection("leaderboard").doc(userId);
        const gameweekRef = db.collection("leaderboard").doc(userId).collection("gameweekStats").doc(`gw${gameweek}`);
        const leaderboardDoc = await leaderboardRef.get();
        const gameweekDoc = await gameweekRef.get();

        // Get user display name from Firebase Auth (only needed if we have to create)
        let displayName = null;
        if (!leaderboardDoc.exists) {
          displayName = 'Unknown Player';
          try {
            const userRecord = await admin.auth().getUser(userId);
            displayName = userRecord.displayName || userRecord.email || 'Unknown Player';
          } catch (error) {
            console.warn(`Could not fetch display name for user ${userId}:`, error);
          }
        }

        const pointsDelta = pointsDeltaMap[userId] || 0;
        const predictionsDelta = predictionsDeltaMap[userId] || 0;
        const correctDelta = correctDeltaMap[userId] || 0;
        const exactDelta = exactScoreDeltaMap[userId] || 0;

        if (leaderboardDoc.exists) {
          const existingData = leaderboardDoc.data();
          batch.update(leaderboardRef, {
            totalPoints: Math.max(0, (existingData.totalPoints || 0) + pointsDelta),
            totalPredictions: Math.max(0, (existingData.totalPredictions || 0) + predictionsDelta),
            correctPredictions: Math.max(0, (existingData.correctPredictions || 0) + correctDelta),
            exactScorePredictions: Math.max(0, (existingData.exactScorePredictions || 0) + exactDelta),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        } else {
          batch.set(leaderboardRef, {
            userId: userId,
            displayName: displayName,
            totalPoints: Math.max(0, pointsDelta),
            totalPredictions: Math.max(0, predictionsDelta),
            correctPredictions: Math.max(0, correctDelta),
            exactScorePredictions: Math.max(0, exactDelta),
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }

        // Update or create gameweek stats
        if (gameweekDoc.exists) {
          const existingGWData = gameweekDoc.data();
          batch.update(gameweekRef, {
            gameweek: gameweek,
            gameweekPoints: Math.max(0, (existingGWData.gameweekPoints || 0) + pointsDelta),
            gameweekPredictions: Math.max(0, (existingGWData.gameweekPredictions || 0) + predictionsDelta),
            gameweekCorrect: Math.max(0, (existingGWData.gameweekCorrect || 0) + correctDelta),
            gameweekExactScores: Math.max(0, (existingGWData.gameweekExactScores || 0) + exactDelta),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        } else {
          batch.set(gameweekRef, {
            gameweek: gameweek,
            userId: userId,
            gameweekPoints: Math.max(0, pointsDelta),
            gameweekPredictions: Math.max(0, predictionsDelta),
            gameweekCorrect: Math.max(0, correctDelta),
            gameweekExactScores: Math.max(0, exactDelta),
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      }

      await batch.commit();
      console.log(`Points synced for match ${matchId}. Updated ${Object.keys(pointsDeltaMap).length} users`);
    } catch (error) {
      console.error("Error calculating points:", error);
      throw error;
    }
  });
