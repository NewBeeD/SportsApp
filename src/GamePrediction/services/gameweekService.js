// src/GamePrediction/services/gameweekService.js
/**
 * Firestore service for gameweek data
 */

import {
  collection,
  query,
  orderBy,
  getDocs,
  getDoc,
  doc,
  limit,
  where,
} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

/**
 * Get all available gameweeks (based on matches with gameweek field)
 */
export const getAllGameweeks = async () => {
  try {
    const matchesSnapshot = await getDocs(collection(db, 'matches'));
    const gameweeks = new Set();

    matchesSnapshot.docs.forEach((doc) => {
      const match = doc.data();
      const gameweek = match.gameweek ?? match.gameWeek ?? match.game_week;
      if (typeof gameweek !== 'undefined' && gameweek !== null && gameweek !== '') {
        gameweeks.add(gameweek);
      }
    });

    // Convert to sorted array
    const sortedGameweeks = Array.from(gameweeks).sort((a, b) => a - b);
    return sortedGameweeks;
  } catch (error) {
    console.error('Error fetching gameweeks:', error);
    throw error;
  }
};

/**
 * Get top leaderboard users for a specific gameweek
 */
export const getGameweekLeaderboard = async (gameweek, topN = 50) => {
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
          const gameweekPoints = gwData.gameweekPoints || 0;
          const gameweekPredictions = gwData.gameweekPredictions || 0;
          const gameweekCorrect = gwData.gameweekCorrect || 0;
          const gameweekExactScores = gwData.gameweekExactScores || 0;

          gameweekScores.push({
            userId: userId,
            displayName: userData.displayName || 'Unknown Player',
            profilePicture: userData.profilePictureUrl || userData.profilePicture || null,
            gameweek: gameweek,
            // Raw gameweek fields
            gameweekPoints,
            gameweekPredictions,
            gameweekCorrect,
            gameweekExactScores,

            // Compatibility fields expected by Leaderboard.jsx UI
            totalPoints: gameweekPoints,
            totalPredictions: gameweekPredictions,
            correctPredictions: gameweekCorrect,
            exactScorePredictions: gameweekExactScores,
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
    console.error(`Error fetching gameweek ${gameweek} leaderboard:`, error);
    throw error;
  }
};

/**
 * Get user's gameweek stats
 */
export const getUserGameweekStats = async (userId, gameweek) => {
  try {
    const gameweekDocRef = doc(
      db,
      'leaderboard',
      userId,
      'gameweekStats',
      `gw${gameweek}`
    );
    const gameweekDoc = await getDoc(gameweekDocRef);

    if (!gameweekDoc.exists()) {
      return null;
    }

    return {
      userId: userId,
      gameweek: gameweek,
      ...gameweekDoc.data(),
    };
  } catch (error) {
    console.error(
      `Error fetching user ${userId} gameweek ${gameweek} stats:`,
      error
    );
    throw error;
  }
};

/**
 * Get all gameweek stats for a user
 */
export const getUserAllGameweekStats = async (userId) => {
  try {
    const gameweekStatsRef = collection(db, 'leaderboard', userId, 'gameweekStats');
    const snapshot = await getDocs(
      query(gameweekStatsRef, orderBy('gameweek', 'asc'))
    );

    return snapshot.docs.map((doc) => ({
      gameweek: doc.data().gameweek,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(`Error fetching all gameweek stats for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Get user's rank in a specific gameweek
 */
export const getUserGameweekRank = async (userId, gameweek) => {
  try {
    const leaderboard = await getGameweekLeaderboard(gameweek, 500); // Get all users
    const userRank = leaderboard.find((entry) => entry.userId === userId);
    return userRank?.rank || null;
  } catch (error) {
    console.error(
      `Error calculating rank for user ${userId} in gameweek ${gameweek}:`,
      error
    );
    throw error;
  }
};
