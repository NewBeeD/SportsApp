// src/GamePrediction/components/PredictionComparison.jsx
import React, { useEffect, useState } from 'react';
import appTheme from '../../css/theme';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Stack,
  LinearProgress,
  Chip,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EqualIcon from '@mui/icons-material/DragHandle';
import { getUserVsCommunityAverage } from '../services/communityStatsService';

const PredictionComparison = ({ userId, matchId, match, prediction }) => {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !matchId || !match?.status === 'FINISHED') {
      setLoading(false);
      return;
    }

    const fetchComparison = async () => {
      try {
        const data = await getUserVsCommunityAverage(userId, matchId);
        setComparison(data);
        setError(null);
      } catch (err) {
        setError('Failed to load prediction comparison');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [userId, matchId, match?.status]);

  if (!prediction || match?.status !== 'FINISHED') {
    return null;
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error || !comparison) {
    return null;
  }

  const userPoints = comparison.userPoints || 0;
  const communityAvg = parseFloat(comparison.communityAveragePoints) || 0;
  const difference = parseFloat(comparison.difference) || 0;
  const isOutperforming = comparison.userOutperformed;

  return (
    <Card sx={{ mt: 2, backgroundColor: appTheme.colors.lightGray, border: `1px solid ${appTheme.colors.border}` }}>
      <CardContent>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          📊 Your Prediction vs Community Average
        </Typography>

        <Grid container spacing={2}>
          {/* Your Points */}
          <Grid item xs={12} sm={5}>
            <Box sx={{ p: 1.5, backgroundColor: `${appTheme.colors.primary}15`, borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                Your Points
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: appTheme.colors.primary, mt: 0.5 }}>
                {userPoints}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                Outcome: {comparison.userPointBreakdown.outcomePoints} | Exact: {comparison.userPointBreakdown.exactScorePoints}
              </Typography>
            </Box>
          </Grid>

          {/* Comparison Icon */}
          <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              {isOutperforming ? (
                <>
                  <TrendingUpIcon sx={{ color: appTheme.colors.success, fontSize: 28 }} />
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: appTheme.colors.success, display: 'block' }}>
                    +{Math.abs(difference)}
                  </Typography>
                </>
              ) : difference === 0 ? (
                <>
                  <EqualIcon sx={{ color: appTheme.colors.warning, fontSize: 28 }} />
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: appTheme.colors.warning, display: 'block' }}>
                    Equal
                  </Typography>
                </>
              ) : (
                <>
                  <TrendingDownIcon sx={{ color: appTheme.colors.error, fontSize: 28 }} />
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: appTheme.colors.error, display: 'block' }}>
                    {difference}
                  </Typography>
                </>
              )}
            </Box>
          </Grid>

          {/* Community Average */}
          <Grid item xs={12} sm={5}>
            <Box sx={{ p: 1.5, backgroundColor: '#f3e5f5', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                Community Avg
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#7b1fa2', mt: 0.5 }}>
                {communityAvg}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                {comparison.communityPredictionsCount} predictions
              </Typography>
            </Box>
          </Grid>

          {/* Performance Meter */}
          <Grid item xs={12}>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>
                Performance
              </Typography>
              <Box sx={{ position: 'relative', height: 30, backgroundColor: '#e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
                {/* Community average indicator */}
                <LinearProgress
                  variant="determinate"
                  value={communityAvg >= 5 ? 100 : (communityAvg / 5) * 100}
                  sx={{
                    height: '100%',
                    backgroundColor: '#f3e5f5',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#7b1fa2',
                    },
                  }}
                />
                {/* Absolute position label */}
                <Typography
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontWeight: 'bold',
                    color: '#333',
                    zIndex: 1,
                  }}
                >
                  You: {userPoints} vs Avg: {communityAvg}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Status Message */}
          <Grid item xs={12}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              {isOutperforming ? (
                <>
                  <Chip
                    label="Above Average 🎉"
                    color="success"
                    size="small"
                    variant="outlined"
                  />
                  <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
                    Great prediction! You outperformed the community by {difference} points.
                  </Typography>
                </>
              ) : difference === 0 ? (
                <>
                  <Chip
                    label="On Par"
                    color="warning"
                    size="small"
                    variant="outlined"
                  />
                  <Typography variant="caption" color="warning.main" sx={{ fontWeight: 'bold' }}>
                    Your prediction matched the community average.
                  </Typography>
                </>
              ) : (
                <>
                  <Chip
                    label="Below Average"
                    color="error"
                    size="small"
                    variant="outlined"
                  />
                  <Typography variant="caption" color="error.main" sx={{ fontWeight: 'bold' }}>
                    The community averaged {Math.abs(difference)} more points. Better luck next time!
                  </Typography>
                </>
              )}
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PredictionComparison;
