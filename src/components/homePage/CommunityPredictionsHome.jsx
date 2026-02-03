import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Collapse,
  Grid,
  Stack,
  Typography,
  LinearProgress,
  Button,
  CircularProgress,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import SoccerIcon from '@mui/icons-material/SportsFootball';
import { onAuthStateChanged } from 'firebase/auth';
import { useMatches } from '../../GamePrediction/hooks/useMatches';
import { getMatchCommunityStats } from '../../GamePrediction/services/communityStatsService';
import { getCommunityPoll, submitCommunityPollVote } from '../../GamePrediction/services/communityPollService';
import { formatTimeRemaining } from '../../GamePrediction/utils/pointsCalculator';
import { auth } from '../../config/firebaseConfig';

const OUTCOME_ORDER = ['HOME_WIN', 'DRAW', 'AWAY_WIN'];
const UPCOMING_STATUSES = new Set(['UPCOMING', 'SCHEDULED', 'PENDING']);

const getVoteKey = (matchId) => `communityPollVote_${matchId}`;

const parseKickoffTime = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value?.toDate === 'function') return value.toDate();
  if (typeof value?.seconds === 'number') return new Date(value.seconds * 1000);
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
};

const getKickoffForMatch = (match) => {
  return parseKickoffTime(
    match?.scheduledTime ?? match?.kickoffTime ?? match?.kickoff ?? match?.date
  );
};

const buildCombinedStats = (gameStats, pollStats) => {
  const gameTotal = Number(gameStats?.totalPredictions || 0);
  const gameOutcomes = gameStats?.outcomes || {};

  const pollTotal = Number(pollStats?.total || 0);
  const pollOutcomes = {
    HOME_WIN: Number(pollStats?.home || 0),
    DRAW: Number(pollStats?.draw || 0),
    AWAY_WIN: Number(pollStats?.away || 0),
  };

  const total = gameTotal + pollTotal;
  const outcomes = OUTCOME_ORDER.reduce((acc, key) => {
    const count = Number(gameOutcomes[key]?.count || 0) + pollOutcomes[key];
    acc[key] = {
      count,
      percentage: total > 0 ? ((count / total) * 100).toFixed(1) : '0.0',
    };
    return acc;
  }, {});

  return {
    total,
    gameTotal,
    pollTotal,
    outcomes,
  };
};

const CommunityPredictionsHome = ({ limit = 2, league = null }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { matches, loading: matchesLoading } = useMatches('UPCOMING', { limitResults: limit, league });
  const [statsByMatch, setStatsByMatch] = useState({});
  const [votesByMatch, setVotesByMatch] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [showTotalsByMatch, setShowTotalsByMatch] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState(null);

  const visibleMatches = useMemo(() => {
    return (matches || []).filter((match) => {
      const status = String(match.status || '').toUpperCase();
      if (status && !UPCOMING_STATUSES.has(status)) return false;
      const kickoff = getKickoffForMatch(match);
      if (!kickoff) return true;
      return Date.now() < kickoff.getTime();
    });
  }, [matches]);

  useEffect(() => {
    const storedVotes = {};
    visibleMatches.forEach((match) => {
      const matchId = match?.id || match?.matchId;
      if (!matchId) return;
      const existing = window.localStorage.getItem(getVoteKey(matchId));
      if (existing) storedVotes[matchId] = existing;
    });
    setVotesByMatch(storedVotes);
  }, [visibleMatches]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setCurrentUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let active = true;

    const fetchStats = async () => {
      if (visibleMatches.length === 0) {
        setStatsByMatch({});
        setLoadingStats(false);
        return;
      }

      setLoadingStats(true);
      setError(null);

      try {
        const results = await Promise.all(
          visibleMatches.map(async (match) => {
            const matchId = match?.id || match?.matchId;
            const [gameStats, pollStats] = await Promise.all([
              getMatchCommunityStats(matchId),
              getCommunityPoll(matchId),
            ]);

            return [matchId, buildCombinedStats(gameStats, pollStats)];
          })
        );

        if (!active) return;

        const statsMap = results.reduce((acc, [matchId, stats]) => {
          acc[matchId] = stats;
          return acc;
        }, {});

        setStatsByMatch(statsMap);
      } catch (err) {
        if (!active) return;
        setError('Failed to load community predictions');
      } finally {
        if (active) setLoadingStats(false);
      }
    };

    fetchStats();

    return () => {
      active = false;
    };
  }, [visibleMatches]);

  const handleVote = async (matchId, outcome) => {
    if (!matchId) return;
    if (votesByMatch[matchId] === outcome) return;

    try {
      await submitCommunityPollVote(matchId, outcome);
      window.localStorage.setItem(getVoteKey(matchId), outcome);

      const previousOutcome = votesByMatch[matchId];
      setVotesByMatch((prev) => ({ ...prev, [matchId]: outcome }));
      setStatsByMatch((prev) => {
        const current = prev[matchId];
        if (!current) return prev;

        const updatedOutcomes = {
          ...current.outcomes,
          [outcome]: {
            count: Number(current.outcomes[outcome]?.count || 0) + 1,
            percentage: current.outcomes[outcome]?.percentage || '0.0',
          },
        };

        if (previousOutcome && previousOutcome !== outcome) {
          updatedOutcomes[previousOutcome] = {
            count: Math.max(0, Number(current.outcomes[previousOutcome]?.count || 0) - 1),
            percentage: current.outcomes[previousOutcome]?.percentage || '0.0',
          };
        }

        const total = previousOutcome ? Number(current.total || 0) : Number(current.total || 0) + 1;
        OUTCOME_ORDER.forEach((key) => {
          const count = Number(updatedOutcomes[key]?.count || 0);
          updatedOutcomes[key] = {
            ...updatedOutcomes[key],
            percentage: total > 0 ? ((count / total) * 100).toFixed(1) : '0.0',
          };
        });

        return {
          ...prev,
          [matchId]: {
            ...current,
            total,
            pollTotal: previousOutcome ? Number(current.pollTotal || 0) : Number(current.pollTotal || 0) + 1,
            outcomes: updatedOutcomes,
          },
        };
      });
    } catch (err) {
      setError('Failed to submit your vote');
    }
  };

  const toggleTotalVotes = (matchId) => {
    if (!matchId) return;
    setShowTotalsByMatch((prev) => ({
      ...prev,
      [matchId]: !prev[matchId],
    }));
  };

  if (matchesLoading || loadingStats) {
    return (
      <Card sx={{ borderRadius: 2 }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress size={24} />
        </CardContent>
      </Card>
    );
  }

  if (visibleMatches.length === 0) {
    return null;
  }

  const matchesWithTotals = visibleMatches.map((match) => {
    const matchId = match?.id || match?.matchId;
    const totalVotes = Number(statsByMatch[matchId]?.total || 0);
    return { match, totalVotes };
  });

  matchesWithTotals.sort((a, b) => b.totalVotes - a.totalVotes);

  const teaserMatch = matchesWithTotals[0]?.match;
  const remainingMatches = matchesWithTotals.slice(1).map((item) => item.match);

  return (
    <Card
      sx={{
        borderRadius: 3,
        background: 'linear-gradient(180deg, #f7f9ff 0%, #ffffff 100%)',
        border: '1px solid #e6e9f5',
        boxShadow: '0 6px 20px rgba(30, 60, 114, 0.08)',
      }}
    >
      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Stack spacing={isMobile ? 1.25 : 2}>
          <Box
            onClick={() => setIsExpanded((prev) => !prev)}
            sx={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'} sx={{ fontWeight: 'bold', color: '#1e3c72' }}>
              Weekend Games Prediction
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {isExpanded ? 'Tap to collapse' : 'Tap to expand'}
            </Typography>
          </Box>
          {teaserMatch && (
            <Stack spacing={isMobile ? 1.25 : 2}>
              {(() => {
                const match = teaserMatch;
        const matchId = match?.id || match?.matchId;
        const stats = statsByMatch[matchId];
        const voteChoice = votesByMatch[matchId];
        const hasVoted = Boolean(voteChoice);
        const isPredictionUser = Boolean(currentUser);
        const kickoff = getKickoffForMatch(match);
        const timeRemaining = kickoff ? formatTimeRemaining(kickoff) : 'Kickoff TBD';
        const outcomes = stats?.outcomes || {};
        const totalVotes = stats?.total || 0;

        return (
          <Card
            key={matchId}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid #eef1f7',
              boxShadow: '0 4px 14px rgba(20, 30, 60, 0.08)',
              background: '#fff',
            }}
          >
            <CardContent sx={{ p: { xs: 0.9, sm: 2 } }}>
              <Stack spacing={isMobile ? 1 : 1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <SoccerIcon sx={{ color: '#667eea', fontSize: 16 }} />
                  <Typography variant={isMobile ? 'body2' : 'subtitle2'} sx={{ fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '0.95rem' } }}>
                    {match.homeTeamName} vs {match.awayTeamName}
                  </Typography>
                  <Chip
                    size="small"
                    label={timeRemaining}
                    sx={{ ml: 'auto', fontSize: '0.65rem', height: 20, backgroundColor: '#eef2ff' }}
                  />
                </Stack>


                {!hasVoted && !isPredictionUser ? (
                  <Typography variant={isMobile ? 'caption' : 'body2'} color="textSecondary">
                    Choose your prediction to see community results.
                  </Typography>
                ) : totalVotes === 0 ? (
                  <Typography variant={isMobile ? 'caption' : 'body2'} color="textSecondary">
                    No votes yet. Be the first to predict!
                  </Typography>
                ) : isMobile ? (
                  <Grid container spacing={1}>
                    {OUTCOME_ORDER.map((key) => {
                      const label =
                        key === 'HOME_WIN'
                          ? `${match.homeTeamName} Win`
                          : key === 'AWAY_WIN'
                          ? `${match.awayTeamName} Win`
                          : 'Draw';
                      const color =
                        key === 'HOME_WIN'
                          ? '#1976d2'
                          : key === 'AWAY_WIN'
                          ? '#f44336'
                          : '#ff9800';

                      return (
                        <Grid item xs={4} key={key}>
                          <Box
                            sx={{
                              p: 0.5,
                              border: '1px solid #e9edf5',
                              borderRadius: 1,
                              backgroundColor: '#fafbff',
                              textAlign: 'center',
                            }}
                          >
                            <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.25 }}>
                              {label}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={parseFloat(outcomes[key]?.percentage || 0)}
                              sx={{
                                height: 3,
                                borderRadius: 4,
                                backgroundColor: '#e8ebf5',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: color,
                                },
                              }}
                            />
                            <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mt: 0.25 }}>
                              {outcomes[key]?.percentage || '0.0'}%
                            </Typography>
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                ) : (
                  <Grid container spacing={1}>
                    {OUTCOME_ORDER.map((key) => {
                      const label =
                        key === 'HOME_WIN'
                          ? `${match.homeTeamName} Win`
                          : key === 'AWAY_WIN'
                          ? `${match.awayTeamName} Win`
                          : 'Draw';
                      const color =
                        key === 'HOME_WIN'
                          ? '#1976d2'
                          : key === 'AWAY_WIN'
                          ? '#f44336'
                          : '#ff9800';

                      return (
                        <Grid item xs={12} sm={4} key={key}>
                          <Box
                            sx={{
                              p: 1.2,
                              border: '1px solid #e9edf5',
                              borderRadius: 1.5,
                              backgroundColor: '#fafbff',
                            }}
                          >
                            <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                              {label}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={parseFloat(outcomes[key]?.percentage || 0)}
                              sx={{
                                height: 6,
                                borderRadius: 4,
                                backgroundColor: '#e8ebf5',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: color,
                                },
                              }}
                            />
                            <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'space-between', mt: 0.5 }}>
                              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                                {outcomes[key]?.percentage || '0.0'}%
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {outcomes[key]?.count || 0}
                              </Typography>
                            </Stack>
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}

                {hasVoted && (
                  <Stack direction={{ xs: 'row', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
                    <Chip
                      size="small"
                      color="success"
                      label={`Your vote: ${voteChoice === 'HOME_WIN' ? match.homeTeamName : voteChoice === 'AWAY_WIN' ? match.awayTeamName : 'Draw'}`}
                      sx={{ ml: { sm: 'auto' }, height: 20, fontSize: '0.65rem' }}
                    />
                  </Stack>
                )}

                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => toggleTotalVotes(matchId)}
                    sx={{ fontSize: '0.7rem', textTransform: 'none', p: 0, minWidth: 0 }}
                  >
                    {showTotalsByMatch[matchId] ? 'Hide total votes' : 'Show total votes'}
                  </Button>
                  {showTotalsByMatch[matchId] && (
                    <Typography variant="caption" color="textSecondary">
                      Total votes: {totalVotes}
                    </Typography>
                  )}
                </Stack>

                {!hasVoted && !isPredictionUser && (
                  <Stack
                    direction={{ xs: 'row', sm: 'row' }}
                    spacing={0.5}
                    sx={{ flexWrap: 'wrap' }}
                  >
                    <Button
                      size="small"
                      variant={voteChoice === 'HOME_WIN' ? 'contained' : 'outlined'}
                      onClick={() => handleVote(matchId, 'HOME_WIN')}
                      sx={{
                        minWidth: 0,
                        flex: { xs: '1 1 30%', sm: '0 1 auto' },
                        borderRadius: 1,
                        px: 0.5,
                        fontSize: '0.7rem',
                      }}
                    >
                      {match.homeTeamName} Win
                    </Button>
                    <Button
                      size="small"
                      variant={voteChoice === 'DRAW' ? 'contained' : 'outlined'}
                      onClick={() => handleVote(matchId, 'DRAW')}
                      sx={{
                        minWidth: 0,
                        flex: { xs: '1 1 30%', sm: '0 1 auto' },
                        borderRadius: 1,
                        px: 0.5,
                        fontSize: '0.7rem',
                      }}
                    >
                      Draw
                    </Button>
                    <Button
                      size="small"
                      variant={voteChoice === 'AWAY_WIN' ? 'contained' : 'outlined'}
                      onClick={() => handleVote(matchId, 'AWAY_WIN')}
                      sx={{
                        minWidth: 0,
                        flex: { xs: '1 1 30%', sm: '0 1 auto' },
                        borderRadius: 1,
                        px: 0.5,
                        fontSize: '0.7rem',
                      }}
                    >
                      {match.awayTeamName} Win
                    </Button>
                  </Stack>
                )}

                {error && (
                  <Typography variant="caption" color="error">
                    {error}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        );
              })()}
            </Stack>
          )}
          {remainingMatches.length > 0 && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Stack spacing={isMobile ? 1.25 : 2}>
                {remainingMatches.map((match) => {
                  const matchId = match?.id || match?.matchId;
                  const stats = statsByMatch[matchId];
                  const voteChoice = votesByMatch[matchId];
                  const hasVoted = Boolean(voteChoice);
                  const isPredictionUser = Boolean(currentUser);
                  const kickoff = getKickoffForMatch(match);
                  const timeRemaining = kickoff ? formatTimeRemaining(kickoff) : 'Kickoff TBD';
                  const outcomes = stats?.outcomes || {};
                  const totalVotes = stats?.total || 0;

                  return (
                    <Card
                      key={matchId}
                      sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '1px solid #eef1f7',
                        boxShadow: '0 4px 14px rgba(20, 30, 60, 0.08)',
                        background: '#fff',
                      }}
                    >
                      <CardContent sx={{ p: { xs: 0.9, sm: 2 } }}>
                        <Stack spacing={isMobile ? 1 : 1.5}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <SoccerIcon sx={{ color: '#667eea', fontSize: 16 }} />
                            <Typography variant={isMobile ? 'body2' : 'subtitle2'} sx={{ fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '0.95rem' } }}>
                              {match.homeTeamName} vs {match.awayTeamName}
                            </Typography>
                            <Chip
                              size="small"
                              label={timeRemaining}
                              sx={{ ml: 'auto', fontSize: '0.65rem', height: 20, backgroundColor: '#eef2ff' }}
                            />
                          </Stack>

                          {!hasVoted && !isPredictionUser ? (
                            <Typography variant={isMobile ? 'caption' : 'body2'} color="textSecondary">
                              Choose your prediction to see community results.
                            </Typography>
                          ) : totalVotes === 0 ? (
                            <Typography variant={isMobile ? 'caption' : 'body2'} color="textSecondary">
                              No votes yet. Be the first to predict!
                            </Typography>
                          ) : isMobile ? (
                            <Grid container spacing={1}>
                              {OUTCOME_ORDER.map((key) => {
                                const label =
                                  key === 'HOME_WIN'
                                    ? `${match.homeTeamName} Win`
                                    : key === 'AWAY_WIN'
                                    ? `${match.awayTeamName} Win`
                                    : 'Draw';
                                const color =
                                  key === 'HOME_WIN'
                                    ? '#1976d2'
                                    : key === 'AWAY_WIN'
                                    ? '#f44336'
                                    : '#ff9800';

                                return (
                                  <Grid item xs={4} key={key}>
                                    <Box
                                      sx={{
                                        p: 0.5,
                                        border: '1px solid #e9edf5',
                                        borderRadius: 1,
                                        backgroundColor: '#fafbff',
                                        textAlign: 'center',
                                      }}
                                    >
                                      <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.25 }}>
                                        {label}
                                      </Typography>
                                      <LinearProgress
                                        variant="determinate"
                                        value={parseFloat(outcomes[key]?.percentage || 0)}
                                        sx={{
                                          height: 3,
                                          borderRadius: 4,
                                          backgroundColor: '#e8ebf5',
                                          '& .MuiLinearProgress-bar': {
                                            backgroundColor: color,
                                          },
                                        }}
                                      />
                                      <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mt: 0.25 }}>
                                        {outcomes[key]?.percentage || '0.0'}%
                                      </Typography>
                                    </Box>
                                  </Grid>
                                );
                              })}
                            </Grid>
                          ) : (
                            <Grid container spacing={1}>
                              {OUTCOME_ORDER.map((key) => {
                                const label =
                                  key === 'HOME_WIN'
                                    ? `${match.homeTeamName} Win`
                                    : key === 'AWAY_WIN'
                                    ? `${match.awayTeamName} Win`
                                    : 'Draw';
                                const color =
                                  key === 'HOME_WIN'
                                    ? '#1976d2'
                                    : key === 'AWAY_WIN'
                                    ? '#f44336'
                                    : '#ff9800';

                                return (
                                  <Grid item xs={12} sm={4} key={key}>
                                    <Box
                                      sx={{
                                        p: 1.2,
                                        border: '1px solid #e9edf5',
                                        borderRadius: 1.5,
                                        backgroundColor: '#fafbff',
                                      }}
                                    >
                                      <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                                        {label}
                                      </Typography>
                                      <LinearProgress
                                        variant="determinate"
                                        value={parseFloat(outcomes[key]?.percentage || 0)}
                                        sx={{
                                          height: 6,
                                          borderRadius: 4,
                                          backgroundColor: '#e8ebf5',
                                          '& .MuiLinearProgress-bar': {
                                            backgroundColor: color,
                                          },
                                        }}
                                      />
                                      <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'space-between', mt: 0.5 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                                          {outcomes[key]?.percentage || '0.0'}%
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                          {outcomes[key]?.count || 0}
                                        </Typography>
                                      </Stack>
                                    </Box>
                                  </Grid>
                                );
                              })}
                            </Grid>
                          )}

                          {hasVoted && (
                            <Stack direction={{ xs: 'row', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
                              <Chip
                                size="small"
                                color="success"
                                label={`Your vote: ${voteChoice === 'HOME_WIN' ? match.homeTeamName : voteChoice === 'AWAY_WIN' ? match.awayTeamName : 'Draw'}`}
                                sx={{ ml: { sm: 'auto' }, height: 20, fontSize: '0.65rem' }}
                              />
                            </Stack>
                          )}

                          <Stack direction="row" spacing={1} alignItems="center">
                            <Button
                              size="small"
                              variant="text"
                              onClick={() => toggleTotalVotes(matchId)}
                              sx={{ fontSize: '0.7rem', textTransform: 'none', p: 0, minWidth: 0 }}
                            >
                              {showTotalsByMatch[matchId] ? 'Hide total votes' : 'Show total votes'}
                            </Button>
                            {showTotalsByMatch[matchId] && (
                              <Typography variant="caption" color="textSecondary">
                                Total votes: {totalVotes}
                              </Typography>
                            )}
                          </Stack>

                          {!hasVoted && !isPredictionUser && (
                            <Stack
                              direction={{ xs: 'row', sm: 'row' }}
                              spacing={0.5}
                              sx={{ flexWrap: 'wrap' }}
                            >
                              <Button
                                size="small"
                                variant={voteChoice === 'HOME_WIN' ? 'contained' : 'outlined'}
                                onClick={() => handleVote(matchId, 'HOME_WIN')}
                                sx={{
                                  minWidth: 0,
                                  flex: { xs: '1 1 30%', sm: '0 1 auto' },
                                  borderRadius: 1,
                                  px: 0.5,
                                  fontSize: '0.7rem',
                                }}
                              >
                                {match.homeTeamName} Win
                              </Button>
                              <Button
                                size="small"
                                variant={voteChoice === 'DRAW' ? 'contained' : 'outlined'}
                                onClick={() => handleVote(matchId, 'DRAW')}
                                sx={{
                                  minWidth: 0,
                                  flex: { xs: '1 1 30%', sm: '0 1 auto' },
                                  borderRadius: 1,
                                  px: 0.5,
                                  fontSize: '0.7rem',
                                }}
                              >
                                Draw
                              </Button>
                              <Button
                                size="small"
                                variant={voteChoice === 'AWAY_WIN' ? 'contained' : 'outlined'}
                                onClick={() => handleVote(matchId, 'AWAY_WIN')}
                                sx={{
                                  minWidth: 0,
                                  flex: { xs: '1 1 30%', sm: '0 1 auto' },
                                  borderRadius: 1,
                                  px: 0.5,
                                  fontSize: '0.7rem',
                                }}
                              >
                                {match.awayTeamName} Win
                              </Button>
                            </Stack>
                          )}

                          {error && (
                            <Typography variant="caption" color="error">
                              {error}
                            </Typography>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            </Collapse>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CommunityPredictionsHome;
