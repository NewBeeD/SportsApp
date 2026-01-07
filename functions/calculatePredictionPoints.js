// functions/calculatePredictionPoints.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");

const db = admin.firestore();

exports.calculatePredictionPoints = functions.firestore
  .document("matches/{matchId}")
  .onUpdate(async (change, context) => {
    const matchBefore = change.before.data();
    const matchAfter = change.after.data();

    // Only process if status changed to FINISHED
    if (matchBefore.status !== "FINISHED" && matchAfter.status === "FINISHED") {
      const matchId = context.params.matchId;
      const actualScore = matchAfter.actualScore;

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
        
        // Calculate points based on accuracy
        let points = 0;

        if (
          prediction.homeScore === actualScore.home &&
          prediction.awayScore === actualScore.away
        ) {
          points = 10; // Exact score match
        } else if (
          (prediction.homeScore > prediction.awayScore &&
            actualScore.home > actualScore.away) ||
          (prediction.homeScore < prediction.awayScore &&
            actualScore.home < actualScore.away) ||
          (prediction.homeScore === prediction.awayScore &&
            actualScore.home === actualScore.away)
        ) {
          points = 5; // Correct result (win/loss/draw)
        }

        // Update prediction
        batch.update(doc.ref, {
          points: points,
          pointsAwarded: true,
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