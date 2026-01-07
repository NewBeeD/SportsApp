// src/GamePrediction/hooks/usePredictions.js
/**
 * Custom hook for fetching user's predictions
 * Note: This is plural (usePredictions) for fetching multiple predictions
 * Different from usePrediction (singular) which might be for single prediction
 */

import { useEffect, useState, useCallback } from 'react';
import { getUserPredictions } from '../services/predictionService';

/**
 * Hook to fetch user's predictions with filtering and caching
 *
 * @param {string} userId - User ID to fetch predictions for
 * @param {Object} options - Configuration options
 *   - limitResults: number (default: 100)
 *   - onlyUnscored: boolean (default: false)
 *   - refetchInterval: number in ms (default: 5 minutes)
 * @returns {Object} - { predictions, loading, error, refetch }
 */
export const usePredictions = (userId, options = {}) => {
  const {
    limitResults = 100,
    onlyUnscored = false,
    refetchInterval = 5 * 60 * 1000, // 5 minutes
  } = options;

  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchPredictions = useCallback(async () => {
    if (!userId) {
      setPredictions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getUserPredictions(userId, {
        limitResults,
        onlyUnscored,
      });

      setPredictions(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching predictions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, limitResults, onlyUnscored]);

  // Initial fetch
  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  // Set up polling interval for periodic refresh
  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(() => {
      fetchPredictions();
    }, refetchInterval);

    return () => clearInterval(interval);
  }, [userId, refetchInterval, fetchPredictions]);

  return {
    predictions,
    loading,
    error,
    lastUpdated,
    refetch: fetchPredictions,
  };
};

/**
 * Alternative hook for real-time subscriptions
 * Use this if you want live updates instead of polling
 */
export const usePredictionsRealtime = (userId) => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setPredictions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Import Firestore directly for real-time listening
      const { query, collection, where, onSnapshot } = require('firebase/firestore');
      const { db } = require('../../config/firebaseConfig');

      const q = query(
        collection(db, 'predictions'),
        where('userId', '==', userId)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            docId: doc.id,
            ...doc.data(),
          }));
          setPredictions(data);
          setLoading(false);
        },
        (err) => {
          console.error('Error subscribing to predictions:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up real-time listener:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [userId]);

  return { predictions, loading, error };
};