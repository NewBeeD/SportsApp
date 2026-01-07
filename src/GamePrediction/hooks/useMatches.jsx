// src/GamePrediction/hooks/useMatches.js
/**
 * Custom hook for fetching matches
 * Fixed: Prevents infinite loop by properly managing dependencies
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import { getUpcomingMatches, getFinishedMatches } from '../services/matchService';

export const useMatches = (status = 'UPCOMING', options = {}) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize options to prevent re-creates on every render
  const memoizedOptions = useMemo(() => options, [JSON.stringify(options)]);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let data;
      if (status === 'UPCOMING') {
        data = await getUpcomingMatches(memoizedOptions);
      } else if (status === 'FINISHED') {
        data = await getFinishedMatches(memoizedOptions);
      }

      setMatches(data || []);
    } catch (err) {
      console.error(`Error fetching ${status} matches:`, err);
      setError(err.message);
      setMatches([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [status, memoizedOptions]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { matches, loading, error, refetch: fetch };
};