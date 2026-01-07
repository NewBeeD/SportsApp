// src/GamePrediction/services/communityStatsService.js
/**
 * Service for analyzing community predictions and stats
 */

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

/**
 * Get all predictions for a specific match and calculate community stats with analytics
 */
export const getMatchCommunityStats = async (matchId) => {
  try {
    
    const q = query(
      collection(db, 'predictions'),
      where('matchId', '==', matchId)
    );

    const snapshot = await getDocs(q);
    
    const predictions = snapshot.docs.map((doc) => doc.data());

    if (predictions.length === 0) {
      return {
        totalPredictions: 0,
        outcomes: {
          HOME_WIN: { count: 0, percentage: 0 },
          AWAY_WIN: { count: 0, percentage: 0 },
          DRAW: { count: 0, percentage: 0 },
        },
        confidenceScore: 0,
        scoreDistribution: [],
        homeAwayBias: 0,
      };
    }

    // Count outcomes
    const outcomeCounts = {
      HOME_WIN: 0,
      AWAY_WIN: 0,
      DRAW: 0,
    };

    const scorelines = {};

    predictions.forEach((pred) => {
      if (pred.predictedOutcome && outcomeCounts.hasOwnProperty(pred.predictedOutcome)) {
        outcomeCounts[pred.predictedOutcome]++;
      }

      // Track scorelines
      if (pred.predictedScore) {
        const score = `${pred.predictedScore.home}-${pred.predictedScore.away}`;
        scorelines[score] = (scorelines[score] || 0) + 1;
      }
    });

    const total = predictions.length;

    // Calculate confidence score (how unified is the community?)
    // Higher = more unified, lower = more diverse opinions
    const maxOutcomeCount = Math.max(
      outcomeCounts.HOME_WIN,
      outcomeCounts.AWAY_WIN,
      outcomeCounts.DRAW
    );
    const confidenceScore = Math.round((maxOutcomeCount / total) * 100);

    // Get top scorelines
    const sortedScorelines = Object.entries(scorelines)
      .map(([score, count]) => ({
        score,
        count,
        percentage: ((count / total) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 scorelines

    // Calculate home/away bias
    const homeTeamPredictions = outcomeCounts.HOME_WIN;
    const awayTeamPredictions = outcomeCounts.AWAY_WIN;
    const homeAwayBias = homeTeamPredictions > awayTeamPredictions ? 
      Math.round(((homeTeamPredictions - awayTeamPredictions) / total) * 100) :
      Math.round(((awayTeamPredictions - homeTeamPredictions) / total) * 100) * -1;

    return {
      totalPredictions: total,
      outcomes: {
        HOME_WIN: {
          count: outcomeCounts.HOME_WIN,
          percentage: ((outcomeCounts.HOME_WIN / total) * 100).toFixed(1),
        },
        AWAY_WIN: {
          count: outcomeCounts.AWAY_WIN,
          percentage: ((outcomeCounts.AWAY_WIN / total) * 100).toFixed(1),
        },
        DRAW: {
          count: outcomeCounts.DRAW,
          percentage: ((outcomeCounts.DRAW / total) * 100).toFixed(1),
        },
      },
      confidenceScore, // 0-100, higher = more unified
      scoreDistribution: sortedScorelines,
      homeAwayBias, // Positive = home bias, negative = away bias
    };
  } catch (error) {
    
    throw error;
  }
};

/**
 * Calculate historical prediction accuracy for similar outcome types
 */
export const getPredictionAccuracyRate = async (outcomeType = null) => {
  try {
    const matchesQuery = query(collection(db, 'matches'), where('status', '==', 'FINISHED'));
    const matchesSnapshot = await getDocs(matchesQuery);
    const finishedMatches = matchesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (finishedMatches.length === 0) {
      return { accuracy: 0, sampleSize: 0, correctOutcomes: 0 };
    }

    let correctCount = 0;
    let totalCount = 0;

    for (const match of finishedMatches) {
      const predictionsQuery = query(
        collection(db, 'predictions'),
        where('matchId', '==', match.id)
      );
      const predictionsSnapshot = await getDocs(predictionsQuery);

      predictionsSnapshot.docs.forEach((doc) => {
        const prediction = doc.data();
        
        // Filter by outcome type if specified
        if (outcomeType && prediction.predictedOutcome !== outcomeType) {
          return;
        }

        totalCount++;

        // Check if prediction was correct
        if (prediction.predictedOutcome === match.actualOutcome) {
          correctCount++;
        }
      });
    }

    const accuracy = totalCount > 0 ? ((correctCount / totalCount) * 100).toFixed(1) : 0;

    return {
      accuracy: parseFloat(accuracy),
      sampleSize: totalCount,
      correctOutcomes: correctCount,
      outcomeType: outcomeType || 'All',
    };
  } catch (error) {
    console.error('[PredictionAccuracy] Error calculating prediction accuracy:', error);
    console.error('[PredictionAccuracy] Error code:', error.code);
    console.error('[PredictionAccuracy] Error message:', error.message);
    return { accuracy: 0, sampleSize: 0, correctOutcomes: 0, communityAccuracy: 0 };
  }
};

/**
 * Get top player (highest scorer) for a specific gameweek
 */
export const getGameweekTopPlayer = async (gameweek) => {
  try {
    const leaderboardSnapshot = await getDocs(collection(db, 'leaderboard'));
    const gameweekScores = [];

    // Fetch gameweek stats for each user
    for (const userDoc of leaderboardSnapshot.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data();

      try {
        const gameweekDocRef = doc(
          db,
          'leaderboard',
          userId,
          'gameweekStats',
          `gw${gameweek}`
        );
        const gameweekDoc = await getDoc(gameweekDocRef);

        if (gameweekDoc.exists()) {
          const gwData = gameweekDoc.data();
          gameweekScores.push({
            userId: userId,
            displayName: userData.displayName || 'Unknown Player',
            profilePictureUrl: userData.profilePictureUrl || null,
            gameweek: gameweek,
            gameweekPoints: gwData.gameweekPoints || 0,
            gameweekPredictions: gwData.gameweekPredictions || 0,
            gameweekCorrect: gwData.gameweekCorrect || 0,
            gameweekExactScores: gwData.gameweekExactScores || 0,
          });
        }
      } catch (error) {
        console.warn(`Could not fetch gameweek ${gameweek} stats for user ${userId}:`, error);
      }
    }

    // Sort by gameweekPoints descending
    gameweekScores.sort((a, b) => b.gameweekPoints - a.gameweekPoints);

    return gameweekScores.length > 0 ? gameweekScores[0] : null;
  } catch (error) {
    console.error(`Error fetching gameweek ${gameweek} top player:`, error);
    throw error;
  }
};

/**
 * Get top 3 players for a specific gameweek
 */
export const getGameweekTopPlayers = async (gameweek, topN = 3) => {
  try {
    const leaderboardSnapshot = await getDocs(collection(db, 'leaderboard'));
    const gameweekScores = [];

    // Fetch gameweek stats for each user
    for (const userDoc of leaderboardSnapshot.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data();

      try {
        const gameweekDocRef = doc(
          db,
          'leaderboard',
          userId,
          'gameweekStats',
          `gw${gameweek}`
        );
        const gameweekDoc = await getDoc(gameweekDocRef);

        if (gameweekDoc.exists()) {
          const gwData = gameweekDoc.data();
          gameweekScores.push({
            userId: userId,
            displayName: userData.displayName || 'Unknown Player',
            profilePictureUrl: userData.profilePictureUrl || null,
            gameweek: gameweek,
            gameweekPoints: gwData.gameweekPoints || 0,
            gameweekPredictions: gwData.gameweekPredictions || 0,
            gameweekCorrect: gwData.gameweekCorrect || 0,
            gameweekExactScores: gwData.gameweekExactScores || 0,
          });
        }
      } catch (error) {
        console.warn(`Could not fetch gameweek ${gameweek} stats for user ${userId}:`, error);
      }
    }

    // Sort by gameweekPoints descending and add ranks
    gameweekScores.sort((a, b) => b.gameweekPoints - a.gameweekPoints);
    gameweekScores.forEach((score, index) => {
      score.rank = index + 1;
    });

    return gameweekScores.slice(0, topN);
  } catch (error) {
    console.error(`Error fetching gameweek ${gameweek} top players:`, error);
    throw error;
  }
};

/**
 * Get user's average prediction vs community average for a match
 */
export const getUserVsCommunityAverage = async (userId, matchId) => {
  try {
    // Get all predictions for the match
    const allPredictionsQuery = query(
      collection(db, 'predictions'),
      where('matchId', '==', matchId)
    );
    const allPredSnapshot = await getDocs(allPredictionsQuery);
    const allPredictions = allPredSnapshot.docs.map((doc) => doc.data());

    // Get user's prediction
    const userPredQuery = query(
      collection(db, 'predictions'),
      where('userId', '==', userId),
      where('matchId', '==', matchId)
    );
    const userPredSnapshot = await getDocs(userPredQuery);
    
    if (userPredSnapshot.empty) {
      return null;
    }

    const userPrediction = userPredSnapshot.docs[0].data();

    // Calculate community average points (for scored predictions only)
    const scoredPredictions = allPredictions.filter((p) => p.points > 0);
    const communityAveragePoints = scoredPredictions.length > 0
      ? (scoredPredictions.reduce((sum, p) => sum + (p.points || 0), 0) / scoredPredictions.length).toFixed(1)
      : 0;

    return {
      userPoints: userPrediction.points || 0,
      userPointBreakdown: userPrediction.pointBreakdown || { outcomePoints: 0, exactScorePoints: 0 },
      communityAveragePoints,
      communityPredictionsCount: allPredictions.length,
      userOutperformed: userPrediction.points > communityAveragePoints,
      difference: (userPrediction.points - communityAveragePoints).toFixed(1),
    };
  } catch (error) {
    console.error('Error calculating user vs community average:', error);
    throw error;
  }
};
