const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

// Calculate prediction points when a match is marked as finished
exports.calculatePredictionPoints = functions.firestore
  .document("matches/{matchId}")
  .onUpdate(async (change, context) => {
    const matchBefore = change.before.data();
    const matchAfter = change.after.data();

    // Only process if status changed to FINISHED
    if (matchBefore.status !== "FINISHED" && matchAfter.status === "FINISHED") {
      const matchId = context.params.matchId;
      const actualScore = matchAfter.actualScore;
      const gameweek = matchAfter.gameweek || 1; // Default to gameweek 1 if not specified

      // Validate actualScore exists
      if (!actualScore || typeof actualScore.home === 'undefined' || typeof actualScore.away === 'undefined') {
        console.error(`Invalid actualScore for match ${matchId}:`, actualScore);
        return;
      }

      try {
        // Get all predictions for this match
        const predictionsSnapshot = await db
          .collection("predictions")
          .where("matchId", "==", matchId)
          .get();

        console.log(`Found ${predictionsSnapshot.size} predictions for match ${matchId} (Gameweek ${gameweek})`);

        const batch = db.batch();
        const pointsMap = {}; // Track points per user
        const predictionsMap = {}; // Track total predictions per user
        const correctMap = {}; // Track correct predictions per user
        const exactScoreMap = {}; // Track exact score predictions per user

        predictionsSnapshot.forEach((doc) => {
          const prediction = doc.data();
          const userId = prediction.userId;
          
          // Validate prediction structure
          if (!prediction.predictedScore || typeof prediction.predictedScore.home === 'undefined') {
            console.warn(`Invalid prediction structure for ${doc.id}:`, prediction);
            return;
          }

          // Initialize user stats if not exists
          if (!predictionsMap[userId]) {
            predictionsMap[userId] = 0;
            correctMap[userId] = 0;
            exactScoreMap[userId] = 0;
          }

          // Increment total predictions
          predictionsMap[userId]++;

          // Calculate points based on accuracy
          let points = 0;

          if (
            prediction.predictedScore.home === actualScore.home &&
            prediction.predictedScore.away === actualScore.away
          ) {
            points = 10; // Exact score match
            exactScoreMap[userId]++; // Track exact scores
          } else if (
            (prediction.predictedScore.home > prediction.predictedScore.away &&
              actualScore.home > actualScore.away) ||
            (prediction.predictedScore.home < prediction.predictedScore.away &&
              actualScore.home < actualScore.away) ||
            (prediction.predictedScore.home === prediction.predictedScore.away &&
              actualScore.home === actualScore.away)
          ) {
            points = 5; // Correct result (win/loss/draw)
          }

          // Increment correct predictions if points > 0
          if (points > 0) {
            correctMap[userId]++;
          }

          console.log(`Prediction ${doc.id}: predicted ${prediction.predictedScore.home}-${prediction.predictedScore.away}, actual ${actualScore.home}-${actualScore.away}, points: ${points}`);

          // Update prediction with gameweek
          batch.update(doc.ref, {
            points: points,
            pointsAwarded: true,
            gameweek: gameweek,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          // Track user points
          pointsMap[userId] = (pointsMap[userId] || 0) + points;
        });

        // Update leaderboard entries (both seasonal and gameweek-specific)
        for (const userId in pointsMap) {
          const leaderboardRef = db.collection("leaderboard").doc(userId);
          const gameweekRef = db.collection("leaderboard").doc(userId).collection("gameweekStats").doc(`gw${gameweek}`);
          const leaderboardDoc = await leaderboardRef.get();
          const gameweekDoc = await gameweekRef.get();
          
          // Get user display name from Firebase Auth
          let displayName = 'Unknown Player';
          try {
            const userRecord = await admin.auth().getUser(userId);
            displayName = userRecord.displayName || userRecord.email || 'Unknown Player';
          } catch (error) {
            console.warn(`Could not fetch display name for user ${userId}:`, error);
          }
          
          if (leaderboardDoc.exists) {
            const existingData = leaderboardDoc.data();
            batch.update(leaderboardRef, {
              totalPoints: (existingData.totalPoints || 0) + pointsMap[userId],
              totalPredictions: (existingData.totalPredictions || 0) + (predictionsMap[userId] || 0),
              correctPredictions: (existingData.correctPredictions || 0) + (correctMap[userId] || 0),
              exactScorePredictions: (existingData.exactScorePredictions || 0) + (exactScoreMap[userId] || 0),
              displayName: displayName,
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
          } else {
            // Create new leaderboard entry if it doesn't exist
            batch.set(leaderboardRef, {
              userId: userId,
              displayName: displayName,
              totalPoints: pointsMap[userId],
              totalPredictions: predictionsMap[userId] || 0,
              correctPredictions: correctMap[userId] || 0,
              exactScorePredictions: exactScoreMap[userId] || 0,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
          }

          // Update or create gameweek stats
          if (gameweekDoc.exists) {
            const existingGWData = gameweekDoc.data();
            batch.update(gameweekRef, {
              gameweek: gameweek,
              gameweekPoints: (existingGWData.gameweekPoints || 0) + pointsMap[userId],
              gameweekPredictions: (existingGWData.gameweekPredictions || 0) + (predictionsMap[userId] || 0),
              gameweekCorrect: (existingGWData.gameweekCorrect || 0) + (correctMap[userId] || 0),
              gameweekExactScores: (existingGWData.gameweekExactScores || 0) + (exactScoreMap[userId] || 0),
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
          } else {
            // Create new gameweek stats entry
            batch.set(gameweekRef, {
              gameweek: gameweek,
              userId: userId,
              gameweekPoints: pointsMap[userId],
              gameweekPredictions: predictionsMap[userId] || 0,
              gameweekCorrect: correctMap[userId] || 0,
              gameweekExactScores: exactScoreMap[userId] || 0,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
          }
        }

        await batch.commit();
        console.log(`Points calculated for match ${matchId}. Updated ${Object.keys(pointsMap).length} users`);
      } catch (error) {
        console.error("Error calculating points:", error);
        throw error;
      }
    }
  });
