// src/GamePrediction/services/matchService.js - UPDATE THIS
/**
 * Firestore service for matches
 */

import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  doc,
  limit,
} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

/**
 * Get upcoming matches
 */
export const getUpcomingMatches = async (options = {}) => {
  try {
    const { limitResults = 20, league = null } = options;

    const q = query(
      collection(db, 'matches'),
      where('status', '==', 'UPCOMING'),
      limit(limitResults)
    );

    const snapshot = await getDocs(q);
    let results = snapshot.docs.map((doc) => ({
      id: doc.id,  // ✅ This is the correct ID field
      matchId: doc.id,  // ✅ Also add as matchId for compatibility
      ...doc.data(),
    }));

    // Sort client-side
    results.sort((a, b) => {
      const aTime = a.scheduledTime?.seconds || a.scheduledTime || 0;
      const bTime = b.scheduledTime?.seconds || b.scheduledTime || 0;
      return aTime - bTime;
    });

    if (league) {
      results = results.filter((m) => m.league === league);
    }

    return results;
  } catch (error) {
    console.error('Error fetching upcoming matches:', error);
    throw error;
  }
};

/**
 * Get finished matches
 */
export const getFinishedMatches = async (options = {}) => {
  try {
    const { limitResults = 20 } = options;

    const q = query(
      collection(db, 'matches'),
      where('status', '==', 'FINISHED'),
      limit(limitResults)
    );

    const snapshot = await getDocs(q);
    let results = snapshot.docs.map((doc) => ({
      id: doc.id,  // ✅ Correct ID field
      matchId: doc.id,  // ✅ Also add as matchId for compatibility
      ...doc.data(),
    }));

    // Sort client-side
    results.sort((a, b) => {
      const aTime = a.scheduledTime?.seconds || a.scheduledTime || 0;
      const bTime = b.scheduledTime?.seconds || b.scheduledTime || 0;
      return bTime - aTime;
    });

    return results;
  } catch (error) {
    console.error('Error fetching finished matches:', error);
    throw error;
  }
};

/**
 * Get match by ID
 */
export const getMatch = async (matchId) => {
  try {
    const docSnapshot = await getDoc(doc(db, 'matches', matchId));

    if (!docSnapshot.exists()) {
      return null;
    }

    return {
      id: docSnapshot.id,  // ✅ Correct ID field
      matchId: docSnapshot.id,  // ✅ Also add as matchId
      ...docSnapshot.data(),
    };
  } catch (error) {
    console.error('Error fetching match:', error);
    throw error;
  }
};