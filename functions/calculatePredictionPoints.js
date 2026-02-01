// functions/calculatePredictionPoints.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");

const db = admin.firestore();

const SCORING_VERSION = 2;

exports.calculatePredictionPoints = functions.firestore
  .document("matches/{matchId}")
  .onUpdate(async (change, context) => {
    const matchBefore = change.before.data();
    const matchAfter = change.after.data();

    // Only process if status changed to FINISHED
    if (matchBefore.status !== "FINISHED" && matchAfter.status === "FINISHED") {
      const matchId = context.params.matchId;
      const actualScore = matchAfter.actualScore;

      if (!actualScore || typeof actualScore.home === 'undefined' || typeof actualScore.away === 'undefined') {
        console.error(`Invalid actualScore for match ${matchId}:`, actualScore);
        return;
      }

      const OUTCOME_POINTS = 5;
      const EXACT_SCORE_POINTS = 10;

      // Get all predictions for this match
      const predictionsSnapshot = await db
        .collection("predictions")
        .where("matchId", "==", matchId)
        .get();

      const batch = db.batch();
      const pointsMap = {}; // Track points per user

      predictionsSnapshot.forEach((doc) => {
        const prediction = doc.data();
        const userId = prediction.userId;

        // Skip already-awarded predictions (avoid double-counting)
        if (prediction.pointsAwarded === true) {
          return;
        }
        
        // Calculate points based on accuracy
        let points = 0;

        const predictedHome = prediction.predictedScore?.home ?? prediction.homeScore;
        const predictedAway = prediction.predictedScore?.away ?? prediction.awayScore;
        if (typeof predictedHome === 'undefined' || typeof predictedAway === 'undefined') {
          return;
        }

        const isExact = predictedHome === actualScore.home && predictedAway === actualScore.away;
        const isOutcomeCorrect = isExact || (
          (predictedHome > predictedAway && actualScore.home > actualScore.away) ||
          (predictedHome < predictedAway && actualScore.home < actualScore.away) ||
          (predictedHome === predictedAway && actualScore.home === actualScore.away)
        );

        const outcomePoints = isOutcomeCorrect ? OUTCOME_POINTS : 0;
        const exactScorePoints = isExact ? EXACT_SCORE_POINTS : 0;
        points = outcomePoints + exactScorePoints;

        // Update prediction
        batch.update(doc.ref, {
          points: points,
          pointsAwarded: true,
          pointBreakdown: {
            outcomePoints: outcomePoints,
            exactScorePoints: exactScorePoints,
          },
          scoringVersion: SCORING_VERSION,
          scoringRules: {
            outcomePoints: OUTCOME_POINTS,
            exactScorePoints: EXACT_SCORE_POINTS,
            stacked: true,
          },
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Track user points
        pointsMap[userId] = (pointsMap[userId] || 0) + points;
      });

      // Update leaderboard entries
      for (const userId in pointsMap) {
        const leaderboardRef = db.collection("leaderboard").doc(userId);
        batch.update(leaderboardRef, {
          totalPoints: admin.firestore.FieldValue.increment(pointsMap[userId]),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      await batch.commit();
      console.log(`Points calculated for match ${matchId}`);
    }
  });