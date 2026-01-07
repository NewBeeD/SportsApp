// src/GamePrediction/components/UserStatsCard.jsx
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

const UserStatsCard = ({ userId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        // Try to fetch from leaderboard first (where stats are tracked)
        const leaderboardDoc = await getDoc(doc(db, 'leaderboard', userId));
        if (leaderboardDoc.exists()) {
          setStats(leaderboardDoc.data());
        } else {
          // Fallback to users collection if not on leaderboard yet
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            setStats(userDoc.data());
          }
        }
      } catch (err) {
        setError('Failed to load statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!stats) return <Alert severity="info">No statistics available</Alert>;

  const accuracy = stats.totalPredictions > 0
    ? ((stats.correctPredictions / stats.totalPredictions) * 100).toFixed(1)
    : 0;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Points
            </Typography>
            <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
              {stats.totalPoints || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Predictions
            </Typography>
            <Typography variant="h4">
              {stats.totalPredictions || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Accuracy
            </Typography>
            <Typography variant="h4">
              {accuracy}%
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {stats.correctPredictions || 0} correct
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Exact Scores
            </Typography>
            <Typography variant="h4">
              {stats.exactScorePredictions || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default UserStatsCard;
