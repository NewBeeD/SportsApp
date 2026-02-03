const functions = require("firebase-functions");
const admin = require("firebase-admin");
const crypto = require("crypto");

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

// Casual community vote with rate limiting (one vote per device per match)
exports.submitCommunityVote = functions.https.onCall(async (data, context) => {
  const matchId = String(data?.matchId || '').trim();
  const outcome = String(data?.outcome || '').trim();
  const deviceId = String(data?.deviceId || '').trim();

  const validOutcomes = new Set(['HOME_WIN', 'DRAW', 'AWAY_WIN']);
  if (!matchId || !deviceId || !validOutcomes.has(outcome)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid match, outcome, or device');
  }

  const matchRef = db.collection('matches').doc(matchId);
  const matchSnap = await matchRef.get();
  if (!matchSnap.exists) {
    throw new functions.https.HttpsError('not-found', 'Match not found');
  }

  const matchData = matchSnap.data();
  const status = String(matchData?.status || '').toUpperCase();
  if (status !== 'UPCOMING') {
    throw new functions.https.HttpsError('failed-precondition', 'Voting closed for this match');
  }

  const scheduledTime = matchData?.scheduledTime?.toDate
    ? matchData.scheduledTime.toDate()
    : matchData?.scheduledTime
    ? new Date(matchData.scheduledTime)
    : null;

  if (scheduledTime && Date.now() >= scheduledTime.getTime()) {
    throw new functions.https.HttpsError('failed-precondition', 'Voting closed for this match');
  }

  if (context.auth?.uid) {
    const existingPredictionQuery = await db
      .collection('predictions')
      .where('userId', '==', context.auth.uid)
      .where('matchId', '==', matchId)
      .limit(1)
      .get();

    if (!existingPredictionQuery.empty) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Prediction already submitted for this match'
      );
    }
  }

  const voteKey = `${matchId}_${deviceId}`;
  const voteRef = db.collection('communityPollVotes').doc(voteKey);
  const voteSnap = await voteRef.get();
  const existingVote = voteSnap.exists ? voteSnap.data() : null;
  if (existingVote?.outcome && existingVote.outcome === outcome) {
    return { success: true, unchanged: true };
  }

  const ip = context.rawRequest?.ip || '';
  const ipHash = ip ? crypto.createHash('sha256').update(ip).digest('hex') : null;

  const pollRef = db.collection('communityPolls').doc(matchId);
  const pollSnap = await pollRef.get();

  if (!pollSnap.exists) {
    await pollRef.set(
      {
        home: 0,
        draw: 0,
        away: 0,
        total: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  }

  const fieldMap = {
    HOME_WIN: 'home',
    DRAW: 'draw',
    AWAY_WIN: 'away',
  };

  const batch = db.batch();
  const incrementUpdates = {
    [fieldMap[outcome]]: admin.firestore.FieldValue.increment(1),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  if (existingVote?.outcome && fieldMap[existingVote.outcome]) {
    incrementUpdates[fieldMap[existingVote.outcome]] = admin.firestore.FieldValue.increment(-1);
  } else {
    incrementUpdates.total = admin.firestore.FieldValue.increment(1);
  }

  batch.update(pollRef, incrementUpdates);

  batch.set(
    voteRef,
    {
      matchId,
      deviceId,
      outcome,
      ipHash,
      createdAt: existingVote?.createdAt || admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  await batch.commit();

  return { success: true };
});
