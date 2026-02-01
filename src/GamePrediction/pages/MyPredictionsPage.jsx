// src/GamePrediction/pages/MyPredictionsPage.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Paper,
  Stack,
  Chip,
  useTheme,
  useMediaQuery,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Divider,
  LinearProgress,
  Fade,
} from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { usePredictions } from '../hooks/usePrediction';
import { useMatches } from '../hooks/useMatches';
import { getMatch } from '../services/matchService';
import MatchCard from '../components/MatchCard';
import MatchResultsView from '../components/MatchResultsView';
import UserStatsCard from '../components/UserStatsCard';
import {
  Assignment,
  CheckCircle,
  Pending,
  TrendingUp,
  Search,
  EmojiEvents,
  Scoreboard,
  Timer,
  Refresh,
  Close,
  Visibility,
  VisibilityOff,
  BarChart,
  SportsSoccer,
} from '@mui/icons-material';

const MyPredictionsPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [leagueFilter, setLeagueFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('DATE');
  const [showStats, setShowStats] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setCurrentUser);
    return () => unsubscribe();
  }, []);

  const { predictions, loading: predictionsLoading } = usePredictions(currentUser?.uid);
  const { matches: finishedMatches, loading: matchesLoading } = useMatches('FINISHED');
  const { matches: upcomingMatches } = useMatches('UPCOMING');

  const [matchMapState, setMatchMapState] = useState({});
  const fetchingMatchIdsRef = useRef(new Set());

  // Seed match map with the cached lists (fast path)
  useEffect(() => {
    const seeded = {
      ...finishedMatches.reduce((acc, match) => { acc[match.id] = match; return acc; }, {}),
      ...upcomingMatches.reduce((acc, match) => { acc[match.id] = match; return acc; }, {})
    };

    setMatchMapState((prev) => ({ ...prev, ...seeded }));
  }, [finishedMatches, upcomingMatches]);

  // Ensure we have match data for every prediction (avoid "Pending" for finished matches outside the last 20)
  useEffect(() => {
    if (!predictions || predictions.length === 0) return;

    const uniqueMatchIds = Array.from(new Set(predictions.map((p) => p.matchId).filter(Boolean)));
    const missing = uniqueMatchIds.filter((id) => !matchMapState[id] && !fetchingMatchIdsRef.current.has(id));
    if (missing.length === 0) return;

    missing.forEach((id) => fetchingMatchIdsRef.current.add(id));

    (async () => {
      try {
        const fetched = await Promise.all(missing.map((id) => getMatch(id)));
        const fetchedMap = fetched
          .filter(Boolean)
          .reduce((acc, match) => {
            acc[match.id] = match;
            return acc;
          }, {});

        setMatchMapState((prev) => ({ ...prev, ...fetchedMap }));
      } finally {
        missing.forEach((id) => fetchingMatchIdsRef.current.delete(id));
      }
    })();
  }, [predictions, matchMapState]);

  const matchMap = useMemo(() => matchMapState, [matchMapState]);

  const isMatchFinished = (match) => {
    return !!match && (match.status === 'FINISHED' || !!match.actualScore);
  };

  const getPredictionStatus = (prediction, match) => {
    // Primary source of truth: Cloud Function sets pointsAwarded when match is scored
    if (prediction?.pointsAwarded === true) return 'SCORED';

    // If match is finished, treat it as not-pending in UI (even if scoring is delayed)
    if (isMatchFinished(match)) return 'FINISHED';

    // Only count as pending when we can confirm match is not finished
    if (match) return 'PENDING';

    // Match not loaded yet; don't count it as pending
    return 'UNKNOWN';
  };

  // Pending should only include predictions you actually made for matches not yet finished.
  // Missing a match (no prediction doc) will never create a pending entry.
  const unscoredPredictions = predictions.filter((p) => {
    const match = matchMap[p.matchId];
    return getPredictionStatus(p, match) === 'PENDING';
  });

  // Everything else is "not pending" (scored or finished)
  const scoredPredictions = predictions.filter((p) => {
    const match = matchMap[p.matchId];
    const status = getPredictionStatus(p, match);
    return status === 'SCORED' || status === 'FINISHED';
  });

  // Filter predictions based on search and filters
  const getFilteredPredictions = (predictionsList) => {
    return predictionsList
      .filter(pred => {
        const match = matchMap[pred.matchId];
        // If match data isn't loaded yet, still show it unless user is filtering/searching
        if (!match) {
          if (searchQuery) return false;
          if (leagueFilter !== 'ALL') return false;
          return true;
        }
        
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            match.homeTeamName.toLowerCase().includes(query) ||
            match.awayTeamName.toLowerCase().includes(query) ||
            match.league.toLowerCase().includes(query)
          );
        }
        
        if (leagueFilter !== 'ALL' && match.league !== leagueFilter) return false;
        
        return true;
      })
      .sort((a, b) => {
        const matchA = matchMap[a.matchId];
        const matchB = matchMap[b.matchId];

        // Put items with missing match data at the end
        if (!matchA && !matchB) return 0;
        if (!matchA) return 1;
        if (!matchB) return -1;
        
        switch(sortBy) {
          case 'DATE':
            return new Date(matchB.scheduledTime?.seconds * 1000) - new Date(matchA.scheduledTime?.seconds * 1000);
          case 'POINTS':
            return b.points - a.points;
          case 'LEAGUE':
            return matchA.league.localeCompare(matchB.league);
          default:
            return 0;
        }
      });
  };

  const filteredUnscored = getFilteredPredictions(unscoredPredictions);
  const filteredScored = getFilteredPredictions(scoredPredictions);

  const getPredictionStats = () => {
    const totalPredictions = predictions.length;
    const totalPoints = scoredPredictions.reduce((sum, pred) => sum + pred.points, 0);
    const averagePoints = scoredPredictions.length > 0 ? (totalPoints / scoredPredictions.length).toFixed(1) : 0;
    const correctPredictions = scoredPredictions.filter(p => p.points >= 5).length;
    const exactPredictions = scoredPredictions.filter(p => (p.pointBreakdown?.exactScorePoints || 0) > 0 || p.points >= 10).length;
    const successRate = scoredPredictions.length > 0 ? Math.round((correctPredictions / scoredPredictions.length) * 100) : 0;

    return {
      totalPredictions,
      totalPoints,
      averagePoints,
      correctPredictions,
      exactPredictions,
      successRate,
      pending: unscoredPredictions.length,
      scored: scoredPredictions.length
    };
  };

  const stats = getPredictionStats();

  if (!currentUser) {
    return (
      <Container 
        sx={{
          width: '99%',
          py: { xs: 3, md: 6 },
          px: { xs: 1, sm: 2, md: 3 },
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Alert severity="warning" sx={{ width: '100%', borderRadius: 2 }}>
          <Typography variant={isMobile ? 'body2' : 'h6'} fontWeight="600" gutterBottom>
            🔒 Authentication Required
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please log in to view your predictions and track your performance.
          </Typography>
        </Alert>
      </Container>
    );
  }

  if (predictionsLoading || matchesLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 4, md: 8 } }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Container
        maxWidth="lg"
        sx={{
          width: '99%',
          py: { xs: 1.5, sm: 2, md: 3 },
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        {/* Header */}
        <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
          <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 'bold', mb: 1 }}>
            📊 My Predictions
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            Track your prediction history and performance metrics
          </Typography>
        </Box>

        {/* Stats Section */}
        {showStats && (
          <Fade in={showStats}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1.5, sm: 2, md: 3 },
                mb: { xs: 2, sm: 3 },
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper'
              }}
            >
              <Grid container spacing={{ xs: 1, sm: 2 }}>
                {/* Total Points */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: 'primary.lighter', borderRadius: 2, height: '100%' }}>
                    <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                      <Stack spacing={1}>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <EmojiEvents sx={{ fontSize: { xs: 16, sm: 20 } }} />
                          <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }} color="text.secondary">
                            Total Points
                          </Typography>
                        </Stack>
                        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="800">
                          {stats.totalPoints}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Success Rate */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: 'success.lighter', borderRadius: 2, height: '100%' }}>
                    <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                      <Stack spacing={1}>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <TrendingUp sx={{ fontSize: { xs: 16, sm: 20 } }} />
                          <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }} color="text.secondary">
                            Success Rate
                          </Typography>
                        </Stack>
                        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="800">
                          {stats.successRate}%
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Correct Predictions */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: 'warning.lighter', borderRadius: 2, height: '100%' }}>
                    <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                      <Stack spacing={1}>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <CheckCircle sx={{ fontSize: { xs: 16, sm: 20 } }} />
                          <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }} color="text.secondary">
                            Correct
                          </Typography>
                        </Stack>
                        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="800">
                          {stats.correctPredictions}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Exact Scores */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: 'info.lighter', borderRadius: 2, height: '100%' }}>
                    <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                      <Stack spacing={1}>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Scoreboard sx={{ fontSize: { xs: 16, sm: 20 } }} />
                          <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }} color="text.secondary">
                            Exact Scores
                          </Typography>
                        </Stack>
                        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="800">
                          {stats.exactPredictions}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Fade>
        )}

        {/* Filters */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 1.5, sm: 2 },
            mb: { xs: 2, sm: 3 },
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper'
          }}
        >
          <Grid container spacing={{ xs: 1, sm: 2 }} alignItems="center">
            {/* Search */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                placeholder="Search predictions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ fontSize: { xs: 18, sm: 20 } }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchQuery('')}>
                        <Close />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                size="small"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              />
            </Grid>

            {/* League Filter */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>League</InputLabel>
                <Select
                  value={leagueFilter}
                  onChange={(e) => setLeagueFilter(e.target.value)}
                  label="League"
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                >
                  <MenuItem value="ALL">All Leagues</MenuItem>
                  <MenuItem value="PREMIER">Premier</MenuItem>
                  <MenuItem value="DIV_ONE">Div One</MenuItem>
                  <MenuItem value="WOMEN">Women's</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Sort By */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Sort</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort"
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                >
                  <MenuItem value="DATE">Date</MenuItem>
                  <MenuItem value="POINTS">Points</MenuItem>
                  <MenuItem value="LEAGUE">League</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Actions */}
            <Grid item xs={12} sm={6} md={4}>
              <Stack direction="row" spacing={1} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                <IconButton
                  onClick={() => setShowStats(!showStats)}
                  size="small"
                  title={showStats ? 'Hide stats' : 'Show stats'}
                >
                  {showStats ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabs */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons={isMobile ? "auto" : false}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  py: { xs: 1.5, sm: 2 },
                  minHeight: { xs: 48, sm: 64 }
                }
              }}
            >
              <Tab 
                icon={<Pending />}
                iconPosition="start"
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <span>{isMobile ? 'Pending' : 'Pending'}</span>
                  </Box>
                }
              />
              <Tab 
                icon={<CheckCircle />}
                iconPosition="start"
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <span>{isMobile ? 'Scored' : 'Scored'}</span>
                  </Box>
                }
              />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
            {/* Pending Tab */}
            {tabValue === 0 && (
              <>
                {filteredUnscored.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: { xs: 4, md: 6 } }}>
                    <Timer sx={{ fontSize: { xs: 60, md: 80 }, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
                    <Typography variant={isMobile ? 'body1' : 'h6'} fontWeight="600" gutterBottom>
                      No Pending Predictions
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {searchQuery || leagueFilter !== 'ALL'
                        ? 'No predictions match your filters'
                        : 'All your predictions have been scored!'
                      }
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
                    {filteredUnscored.map((pred) => (
                      <Grid item xs={12} sm={6} lg={4} key={pred.docId}>
                        <Paper
                          elevation={0}
                          sx={{
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'warning.light',
                            overflow: 'hidden'
                          }}
                        >
                          <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: 'warning.light' }}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <Timer sx={{ fontSize: { xs: 14, sm: 16 } }} />
                              <Typography variant="caption" fontWeight="600" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                                Pending
                              </Typography>
                            </Stack>
                          </Box>
                          <Box sx={{ p: { xs: 1, sm: 1.5 } }}>
                            {matchMap[pred.matchId] ? (
                              <MatchCard match={matchMap[pred.matchId]} prediction={pred} />
                            ) : (
                              <Box>
                                <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                                  Loading match details…
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Match ID: {pred.matchId}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </>
            )}

            {/* Scored Tab */}
            {tabValue === 1 && (
              <>
                {filteredScored.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: { xs: 4, md: 6 } }}>
                    <EmojiEvents sx={{ fontSize: { xs: 60, md: 80 }, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
                    <Typography variant={isMobile ? 'body1' : 'h6'} fontWeight="600" gutterBottom>
                      No Scored Predictions Yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchQuery || leagueFilter !== 'ALL'
                        ? 'No scored predictions match your filters'
                        : 'Predictions will be scored after matches finish'
                      }
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
                    {filteredScored.map((pred) => {
                      const isExact = (pred.pointBreakdown?.exactScorePoints || 0) > 0 || pred.points >= 10;

                      return (
                        <Grid item xs={12} sm={6} lg={4} key={pred.docId}>
                          <Paper
                            elevation={0}
                            sx={{
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: isExact ? 'success.light' : 'primary.light',
                              overflow: 'hidden',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: theme.shadows[2]
                              }
                            }}
                          >
                            {/* Points Badge */}
                            <Box sx={{ position: 'relative', p: { xs: 1, sm: 1.5 } }}>
                              <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                <Chip
                                  label={`+${pred.points} pts`}
                                  size="small"
                                  color={isExact ? 'success' : 'primary'}
                                  sx={{ fontWeight: 600, fontSize: '0.65rem' }}
                                />
                              </Box>
                              <Box sx={{ pt: 1.5 }}>
                                {matchMap[pred.matchId] ? (
                                  <MatchCard match={matchMap[pred.matchId]} prediction={pred} />
                                ) : (
                                  <Box>
                                    <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                                      Loading match details…
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      Match ID: {pred.matchId}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default MyPredictionsPage;
