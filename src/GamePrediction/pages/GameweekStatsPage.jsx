// src/GamePrediction/pages/GameweekStatsPage.jsx
import React, { useEffect, useState } from 'react';
import appTheme from '../../css/theme';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { getUserAllGameweekStats } from '../services/gameweekService';
import GameweekTopPlayer from '../components/GameweekTopPlayer';

const GameweekStatsPage = ({ userId }) => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const data = await getUserAllGameweekStats(userId);
        setStats(data);
        setError(null);
      } catch (err) {
        setError('Failed to load gameweek statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  if (!userId) {
    return <Alert severity="warning" sx={{ m: { xs: 1, sm: 2 } }}>Please log in to view gameweek statistics.</Alert>;
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 4, md: 8 } }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ m: { xs: 1, sm: 2 } }}>{error}</Alert>;
  }

  if (stats.length === 0) {
    return <Alert severity="info" sx={{ m: { xs: 1, sm: 2 } }}>No gameweek statistics available yet.</Alert>;
  }

  // Calculate summary stats
  const totalGameweekPoints = stats.reduce((sum, gw) => sum + (gw.gameweekPoints || 0), 0);
  const totalGameweekPredictions = stats.reduce((sum, gw) => sum + (gw.gameweekPredictions || 0), 0);
  const totalGameweekCorrect = stats.reduce((sum, gw) => sum + (gw.gameweekCorrect || 0), 0);
  const avgGameweekPoints = stats.length > 0 ? (totalGameweekPoints / stats.length).toFixed(1) : 0;

  return (
    <Box sx={{ width: '100%', px: { xs: 1, sm: 2, md: 3 } }}>
      {/* Get the latest gameweek from stats */}
      {stats.length > 0 && (
        <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
          <GameweekTopPlayer 
            gameweek={stats[stats.length - 1]?.gameweek} 
            showTopThree={true}
          />
        </Box>
      )}

      {/* Summary Cards */}
      <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ textAlign: 'center', p: { xs: 1.5, sm: 2 } }}>
              <Typography color="textSecondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }} gutterBottom>
                Gameweeks Played
              </Typography>
              <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 'bold', color: appTheme.colors.primary }}>
                {stats.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ textAlign: 'center', p: { xs: 1.5, sm: 2 } }}>
              <Typography color="textSecondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }} gutterBottom>
                Total Gameweek Points
              </Typography>
              <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 'bold', color: appTheme.colors.success }}>
                {totalGameweekPoints}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ textAlign: 'center', p: { xs: 1.5, sm: 2 } }}>
              <Typography color="textSecondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }} gutterBottom>
                Avg Points/GW
              </Typography>
              <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 'bold', color: appTheme.colors.warning }}>
                {avgGameweekPoints}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ textAlign: 'center', p: { xs: 1.5, sm: 2 } }}>
              <Typography color="textSecondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }} gutterBottom>
                Accuracy
              </Typography>
              <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 'bold', color: appTheme.colors.accent }}>
                {totalGameweekPredictions > 0
                  ? ((totalGameweekCorrect / totalGameweekPredictions) * 100).toFixed(0)
                  : 0}
                %
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Gameweek Table */}
      <Card sx={{ borderRadius: 2, overflow: 'auto' }}>
        <CardContent sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <TrendingUpIcon sx={{ color: appTheme.colors.primary, fontSize: { xs: 20, sm: 24 } }} />
            <Typography variant={isMobile ? 'body1' : 'h6'} sx={{ fontWeight: 'bold' }}>
              Gameweek Performance
            </Typography>
          </Stack>

          <Box sx={{ overflowX: 'auto' }}>
            <TableContainer component={Paper}>
              <Table size={isMobile ? 'small' : 'medium'}>
                <TableHead sx={{ backgroundColor: appTheme.colors.lightGray }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>Gameweek</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                      Points
                    </TableCell>
                    {!isMobile && <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                      Predictions
                    </TableCell>}
                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                      Correct
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                      Accuracy
                    </TableCell>
                    {!isTablet && <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                      Exact Scores
                    </TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.map((gw) => (
                    <TableRow key={gw.gameweek} sx={{ '&:hover': { backgroundColor: appTheme.colors.lightGray } }}>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        GW {gw.gameweek}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: appTheme.colors.success, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {gw.gameweekPoints || 0}
                      </TableCell>
                      {!isMobile && <TableCell align="right" sx={{ fontSize: '0.875rem' }}>{gw.gameweekPredictions || 0}</TableCell>}
                      <TableCell align="right" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        <Stack sx={{ alignItems: 'flex-end' }}>
                          <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{gw.gameweekCorrect || 0}</Typography>
                          {gw.gameweekPredictions > 0 && (
                            <Typography variant="caption" sx={{ color: '#666', fontSize: { xs: '0.6rem', sm: '0.7rem' } }}>
                              ({((gw.gameweekCorrect / gw.gameweekPredictions) * 100).toFixed(0)}%)
                            </Typography>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {gw.gameweekPredictions > 0
                          ? ((gw.gameweekCorrect / gw.gameweekPredictions) * 100).toFixed(0)
                          : 0}
                        %
                      </TableCell>
                      {!isTablet && <TableCell align="right" sx={{ fontSize: '0.875rem' }}>{gw.gameweekExactScores || 0}</TableCell>}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default GameweekStatsPage;
