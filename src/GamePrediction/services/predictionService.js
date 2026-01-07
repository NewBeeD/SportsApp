// src/GamePrediction/services/predictionService.js
/**
 * Firestore service for predictions
 * Handles all prediction-related queries and mutations
 */

import {
  collection,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  limit,
} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

/**
 * Create a new prediction
 */
export const createPrediction = async (userId, matchId, predictionData) => {
  try {
    const docRef = await addDoc(collection(db, 'predictions'), {
      userId,
      matchId,
      predictedOutcome: predictionData.predictedOutcome,
      predictedScore: {
        home: predictionData.predictedScore.home,
        away: predictionData.predictedScore.away,
      },
      points: 0,
      pointBreakdown: {
        outcomePoints: 0,
        exactScorePoints: 0,
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      predictionId: docRef.id,
    };
  } catch (error) {
    console.error('Error creating prediction:', error);
    throw error;
  }
};

/**
 * Get user's predictions
 */
export const getUserPredictions = async (userId, options = {}) => {
  try {
    const { limitResults = 100, onlyUnscored = false } = options;

    let q;
    if (onlyUnscored) {
      q = query(
        collection(db, 'predictions'),
        where('userId', '==', userId),
        where('points', '==', 0),
        limit(limitResults)
      );
    } else {
      q = query(
        collection(db, 'predictions'),
        where('userId', '==', userId),
        limit(limitResults)
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching user predictions:', error);
    throw error;
  }
};

/**
 * Get existing prediction for match
 */
export const getExistingPrediction = async (userId, matchId) => {
  try {
    const q = query(
      collection(db, 'predictions'),
      where('userId', '==', userId),
      where('matchId', '==', matchId),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return {
        docId: snapshot.docs[0].id,
        ...snapshot.docs[0].data(),
      };
    }

    return null;
  } catch (error) {
    console.error('Error checking existing prediction:', error);
    throw error;
  }
};

/**
 * Update a prediction
 */
export const updatePrediction = async (predictionId, updateData) => {
  try {
    // First get the existing document to preserve userId and matchId
    const predRef = doc(db, 'predictions', predictionId);
    const existingDoc = await getDoc(predRef);
    
    if (!existingDoc.exists()) {
      throw new Error('Prediction not found');
    }

    // Check if the match status allows edits
    const matchId = existingDoc.data().matchId;
    const matchRef = doc(db, 'matches', matchId);
    const matchDoc = await getDoc(matchRef);

    if (!matchDoc.exists()) {
      throw new Error('Match not found');
    }

    const matchStatus = matchDoc.data().status;
    
    // Prevent edits if match is LIVE or FINISHED
    if (matchStatus === 'LIVE' || matchStatus === 'FINISHED') {
      throw new Error(`Cannot edit prediction for a ${matchStatus.toLowerCase()} match`);
    }

    await updateDoc(predRef, {
      userId: existingDoc.data().userId, // Preserve userId for rule check
      matchId: existingDoc.data().matchId, // Preserve matchId for rule check
      predictedOutcome: updateData.predictedOutcome,
      predictedScore: {
        home: updateData.predictedScore.home,
        away: updateData.predictedScore.away,
      },
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating prediction:', error);
    throw error;
  }
};

/**
 * Delete a prediction
 */
export const deletePrediction = async (predictionId) => {
  try {
    await deleteDoc(doc(db, 'predictions', predictionId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting prediction:', error);
    throw error;
  }
};

/**
 * Get match predictions stats
 */
export const getMatchPredictionStats = async (matchId) => {
  try {
    const predictions = await getDocs(
      query(collection(db, 'predictions'), where('matchId', '==', matchId))
    );

    const stats = {
      totalPredictions: predictions.size,
      homeWinPredictions: 0,
      drawPredictions: 0,
      awayWinPredictions: 0,
    };

    predictions.forEach((doc) => {
      const pred = doc.data();
      switch (pred.predictedOutcome) {
        case 'HOME_WIN':
          stats.homeWinPredictions++;
          break;
        case 'DRAW':
          stats.drawPredictions++;
          break;
        case 'AWAY_WIN':
          stats.awayWinPredictions++;
          break;
        default:
          break;
      }
    });

    return stats;
  } catch (error) {
    console.error('Error fetching prediction stats:', error);
    throw error;
  }
};