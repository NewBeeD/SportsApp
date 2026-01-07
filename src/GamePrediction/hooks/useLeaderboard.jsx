// src/GamePrediction/hooks/useLeaderboard.js
/**
 * Custom hook for fetching leaderboard
 */

import { useEffect, useState, useCallback } from 'react';
import { getTopLeaderboardUsers, getUserLeaderboardPosition } from '../services/leaderboardService';

export const useLeaderboard = (topN = 50, options = {}) => {
  const { refetchInterval = 5 * 60 * 1000 } = options;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const leaderboardData = await getTopLeaderboardUsers(topN);
      setData(leaderboardData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [topN]);

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, refetchInterval);
    return () => clearInterval(interval);
  }, [fetch, refetchInterval]);

  return { data, loading, error, refetch: fetch };
};

export const useUserLeaderboardPosition = (userId) => {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setPosition(null);
      setLoading(false);
      return;
    }

    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);

        const userPosition = await getUserLeaderboardPosition(userId);
        setPosition(userPosition);
      } catch (err) {
        console.error('Error fetching user position:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetch();

    const interval = setInterval(fetch, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [userId]);

  return { position, loading, error };
};