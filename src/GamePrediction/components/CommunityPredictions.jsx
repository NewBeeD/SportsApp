// src/GamePrediction/components/CommunityPredictions.jsx
import React, { useEffect, useState } from 'react';
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { getMatchCommunityStats, getPredictionAccuracyRate } from '../services/communityStatsService';

const CommunityPredictions = ({ matchId, match }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [stats, setStats] = useState(null);
  const [accuracyRate, setAccuracyRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPredictions, setShowPredictions] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showScorelines, setShowScorelines] = useState(false);

  useEffect(() => {
    if (!matchId) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const data = await getMatchCommunityStats(matchId);
        const accuracy = await getPredictionAccuracyRate();
        setStats(data);
        setAccuracyRate(accuracy);
        setError(null);
      } catch (err) {
        setError('Failed to load community predictions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [matchId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error || !stats) {
    return null;
  }

  if (stats.totalPredictions === 0) {
    return (
      <Card sx={{ mt: 2, backgroundColor: '#f5f5f5' }}>
        <CardContent>
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
            No community predictions yet for this match.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Find the most predicted outcome
  const outcomes = [
    { key: 'HOME_WIN', label: `${match?.homeTeamName} Win`, emoji: '🏠' },
    { key: 'AWAY_WIN', label: `${match?.awayTeamName} Win`, emoji: '✈️' },
    { key: 'DRAW', label: 'Draw', emoji: '🤝' },
  ];

  const outcomesData = outcomes.map((outcome) => ({
    ...outcome,
    ...stats.outcomes[outcome.key],
  }));

  const mostPredicted = outcomesData.reduce((prev, current) =>
    current.count > prev.count ? current : prev
  );

  // Get confidence color based on score
  const getConfidenceColor = (score) => {
    if (score >= 70) return '#4caf50'; // Green - High confidence
    if (score >= 50) return '#ff9800'; // Orange - Medium confidence
    return '#f44336'; // Red - Low confidence
  };

  // Get bias color and direction
  const getBiasLabel = (bias) => {
    if (bias > 0) return `${bias}% Home Bias 🏠`;
    if (bias < 0) return `${Math.abs(bias)}% Away Bias ✈️`;
    return 'No Bias 🤝';
  };

  // Helper component for collapsible section header
  const CollapsibleHeader = ({ title, icon, isOpen, onClick }) => (
    <Box 
      onClick={onClick}
      sx={{ 
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: isOpen ? 1.5 : 0,
        transition: 'all 0.3s ease',
        '&:hover': {
          opacity: 0.8,
        }
      }}
    >
      <Stack direction={isMobile ? 'column' : 'row'} spacing={1} sx={{ alignItems: 'flex-start', flex: 1 }}>
        <Box sx={{ fontSize: { xs: 20, sm: 24 } }}>{icon}</Box>
        <Typography variant={isMobile ? 'body2' : 'subtitle2'} sx={{ fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '0.95rem' } }}>
          {title}
        </Typography>
      </Stack>
      <IconButton 
        size="small" 
        sx={{ 
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
          transition: 'transform 0.3s ease',
          ml: 1,
        }}
      >
        {isOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
      </IconButton>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 0.8, sm: 1 } }}>
      {/* COMMUNITY PREDICTIONS SECTION */}
      <Card sx={{ 
        backgroundColor: '#f9f9f9', 
        borderLeft: { xs: '3px', sm: '4px' },
        borderLeftColor: '#667eea',
        borderRadius: 2,
      }}>
        <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
          <CollapsibleHeader 
            title={`🌍 Community Predictions (${stats.totalPredictions} ${stats.totalPredictions === 1 ? 'vote' : 'votes'})`}
            isOpen={showPredictions}
            onClick={() => setShowPredictions(!showPredictions)}
          />

          {showPredictions && (
            <>
              {/* MAIN PREDICTION OUTCOMES */}
              <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
          {outcomesData.map((outcome) => (
            <Grid item xs={12} sm={4} key={outcome.key}>
              <Box
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  backgroundColor: outcome.key === mostPredicted.key ? '#e3f2fd' : '#fff',
                  border: outcome.key === mostPredicted.key ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  borderRadius: 1,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  },
                }}
              >
                {/* <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ mb: 0.5 }}>
                  {outcome.emoji}
                </Typography> */}
                <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '0.7rem', sm: '0.875rem' }, display: 'block' }}>
                  {outcome.label}
                </Typography>

                {/* Percentage Bar */}
                <Box sx={{ mb: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={parseFloat(outcome.percentage)}
                    sx={{
                      height: { xs: 6, sm: 8 },
                      borderRadius: 4,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor:
                          outcome.key === 'HOME_WIN'
                            ? '#1976d2'
                            : outcome.key === 'AWAY_WIN'
                            ? '#f44336'
                            : '#ff9800',
                      },
                    }}
                  />
                </Box>

                {/* Percentage and Count */}
                <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant={isMobile ? 'body2' : 'h6'} sx={{ fontWeight: 'bold', color: '#333', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    {outcome.percentage}%
                  </Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                    ({outcome.count})
                  </Typography>
                </Stack>

                {/* Most Predicted Badge */}
                {outcome.key === mostPredicted.key && (
                  <Chip
                    label="Most Predicted 🔥"
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ mt: 1, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                  />
                )}
              </Box>
            </Grid>
          ))}
              </Grid>
            </>
          )}
        </CardContent>
      </Card>

      {/* KEY ANALYTICS SECTION */}
      <Card sx={{ 
        backgroundColor: '#f0f7ff', 
        borderLeft: { xs: '3px', sm: '4px' },
        borderLeftColor: '#2196f3',
        borderRadius: 2,
      }}>
        <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
          <CollapsibleHeader 
            title="📊 Key Analytics"

            isOpen={showAnalytics}
            onClick={() => setShowAnalytics(!showAnalytics)}
          />

          {showAnalytics && (
            <Box sx={{ mt: 1.5 }}>
              <Grid container spacing={{ xs: 1, sm: 2 }}>
            {/* 1. Confidence Score */}
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold', display: 'block', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                  Community Unity
                </Typography>
                <Box sx={{ mt: 1, mb: 0.5 }}>
                  <Box
                    sx={{
                      width: { xs: 50, sm: 60 },
                      height: { xs: 50, sm: 60 },
                      borderRadius: '50%',
                      background: `conic-gradient(${getConfidenceColor(stats.confidenceScore)} 0deg ${stats.confidenceScore * 3.6}deg, #e0e0e0 ${stats.confidenceScore * 3.6}deg)`,
                      margin: '0 auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#333', fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                      {stats.confidenceScore}%
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', fontSize: { xs: '0.6rem', sm: '0.7rem' } }}>
                  agree on outcome
                </Typography>
              </Box>
            </Grid>

            {/* 2. Prediction Accuracy Rate */}
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold', display: 'block', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                  Community Accuracy
                </Typography>
                <Box sx={{ mt: 1, p: 1, backgroundColor: '#fff', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    {accuracyRate?.communityAccuracy?.toFixed(1)}%
                  </Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.25, fontSize: { xs: '0.6rem', sm: '0.7rem' } }}>
                    past accuracy
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* 3. Community Bias Analysis */}
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold', display: 'block', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                  Bias Analysis
                </Typography>
                <Box sx={{ mt: 1, p: 1, backgroundColor: '#fff', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#ff9800', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                    {getBiasLabel(stats.biasPercentage)}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* 4. Consensus Strength */}
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold', display: 'block', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                  Consensus
                </Typography>
                <Box sx={{ mt: 1, p: 1, backgroundColor: '#fff', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#667eea', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    {mostPredicted.percentage}%
                  </Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.25, fontSize: { xs: '0.6rem', sm: '0.7rem' } }}>
                    agree
                  </Typography>
                </Box>
              </Box>
            </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* TOP SCORELINES SECTION */}
      {stats.scoreDistribution && stats.scoreDistribution.length > 0 && (
        <Card sx={{ 
          backgroundColor: '#fff9e6', 
          borderLeft: { xs: '3px', sm: '4px' },
          borderLeftColor: '#fbc02d',
          borderRadius: 2,
        }}>
          <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
            <CollapsibleHeader 
              title="📊 Top Scorelines"
              isOpen={showScorelines}
              onClick={() => setShowScorelines(!showScorelines)}
            />

            {showScorelines && (
              <Box sx={{ width: '100%', mt: 1.5 }}>
                {stats.scoreDistribution.map((scoreline, idx) => (
                  <Stack
                    key={idx}
                    direction="row"
                    spacing={1}
                    sx={{
                      alignItems: 'center',
                      mb: 1,
                      p: { xs: 1, sm: 1.5 },
                      backgroundColor: '#f5f5f5',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: { xs: 35, sm: 50 }, textAlign: 'center', fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                      {scoreline.score}
                    </Typography>
                    <Box sx={{ flex: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={parseFloat(scoreline.percentage)}
                        sx={{
                          height: { xs: 6, sm: 8 },
                          borderRadius: 4,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#fbc02d',
                          },
                        }}
                      />
                    </Box>
                    <Stack direction="row" spacing={0.5} sx={{ minWidth: { xs: 60, sm: 80 }, textAlign: 'right' }}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                        {scoreline.percentage}%
                      </Typography>
                      <Typography variant="caption" color="textSecondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                        ({scoreline.count})
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Summary Text */}
      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', textAlign: 'center', mt: 1, mb: 1, fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
        {mostPredicted.percentage}% of the community think <strong>{mostPredicted.label}</strong> will happen
      </Typography>
    </Box>
  );
};

export default CommunityPredictions;
