/**
 * Custom hook for fetching user predictions
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import { getUserPredictions } from '../services/predictionService';

export const usePredictions = (userId, options = {}) => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize options to prevent infinite loop
  const memoizedOptions = useMemo(() => options, [JSON.stringify(options)]);

  const fetch = useCallback(async () => {
    if (!userId) {
      setPredictions([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await getUserPredictions(userId, memoizedOptions);
      setPredictions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, memoizedOptions]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { predictions, loading, error, refetch: fetch };
};