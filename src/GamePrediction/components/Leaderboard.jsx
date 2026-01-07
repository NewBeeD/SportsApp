// src/GamePrediction/components/Leaderboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Chip,
  Stack,
  Avatar,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { useLeaderboard, useUserLeaderboardPosition } from '../hooks/useLeaderboard.jsx';
import { getAllGameweeks, getGameweekLeaderboard } from '../services/gameweekService';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';

/**
 * Unified Leaderboard Component
 * Displays both season-wide and per-gameweek rankings
 * Toggle between "All Time" and individual gameweeks
 */
const Leaderboard = ({ topN = 50, enableRealtime = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down(360));

  const [currentUser, setCurrentUser] = useState(null);
  const [viewMode, setViewMode] = useState(0); // 0 = All Time, 1 = Gameweek
  const [gameweeks, setGameweeks] = useState([]);
  const [selectedGameweek, setSelectedGameweek] = useState(null);
  const [gameweekData, setGameweekData] = useState([]);
  const [gameweekLoading, setGameweekLoading] = useState(false);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch available gameweeks
  useEffect(() => {
    const fetchGameweeks = async () => {
      try {
        const gws = await getAllGameweeks();
        setGameweeks(gws);
        if (gws.length > 0) {
          setSelectedGameweek(gws[gws.length - 1]); // Default to latest
        }
      } catch (error) {
        console.error('Error fetching gameweeks:', error);
      }
    };
    fetchGameweeks();
  }, []);

  // Fetch gameweek data when selected gameweek changes
  useEffect(() => {
    if (viewMode !== 1 || !selectedGameweek) return;

    const fetchGameweekData = async () => {
      setGameweekLoading(true);
      try {
        const data = await getGameweekLeaderboard(selectedGameweek, topN);
        setGameweekData(data);
      } catch (error) {
        console.error(`Error fetching gameweek ${selectedGameweek} data:`, error);
      } finally {
        setGameweekLoading(false);
      }
    };

    fetchGameweekData();
  }, [viewMode, selectedGameweek, topN]);

  // Fetch seasonal leaderboard data
  const { data: leaderboardData, loading, error, lastUpdated } = useLeaderboard(topN, {
    enableRealtime,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch current user's position
  const { position: userPosition } = useUserLeaderboardPosition(
    currentUser?.uid || null
  );

  const isLoading = viewMode === 0 ? loading : gameweekLoading;
  const displayData = viewMode === 0 ? leaderboardData : gameweekData;

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (viewMode === 0 && error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load leaderboard: {error}
      </Alert>
    );
  }

  if (!displayData || displayData.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No leaderboard data available yet
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 1.5, sm: 2, md: 4 }, px: { xs: 1, sm: 2 } }}>
      {/* Header Section */}
      <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
        <Stack
          direction={isMobile ? 'column' : 'row'}
          spacing={isMobile ? 1 : 2}
          alignItems={isMobile ? 'flex-start' : 'center'}
          sx={{ mb: 2 }}
        >
          <TrophyIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: '#ffd700' }} />
          <Box>
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              component="h1"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Prediction Leaderboard
            </Typography>
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
              {viewMode === 0
                ? `Top ${displayData.length} Players by Total Points`
                : `Gameweek ${selectedGameweek} Rankings`}
            </Typography>
          </Box>
        </Stack>

        {/* View Mode Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs
            value={viewMode}
            onChange={(e, newValue) => setViewMode(newValue)}
            variant={isMobile ? 'fullWidth' : 'standard'}
            sx={{
              '& .MuiTab-root': {
                fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                fontWeight: 500,
                minHeight: { xs: 40, sm: 48 },
              },
            }}
          >
            <Tab label="All Time" />
            <Tab label="By Gameweek" />
          </Tabs>
        </Box>

        {/* Gameweek Selector (only show when viewing gameweeks) */}
        {viewMode === 1 && gameweeks.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <FormControl sx={{ minWidth: { xs: '100%', sm: 150 } }}>
              <InputLabel sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                Select Gameweek
              </InputLabel>
              <Select
                value={selectedGameweek || ''}
                onChange={(e) => setSelectedGameweek(e.target.value)}
                label="Select Gameweek"
                sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                {gameweeks.map((gw) => (
                  <MenuItem key={gw} value={gw}>
                    Gameweek {gw}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Last Updated */}
        {viewMode === 0 && lastUpdated && (
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ mb: 2, display: 'block', fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
          >
            Last updated: {lastUpdated.toLocaleTimeString()}
          </Typography>
        )}
      </Box>

      {/* User's Current Position (if logged in and ranked) */}
      {currentUser && userPosition && (
        <UserPositionCard userPosition={userPosition} theme={theme} isMobile={isMobile} />
      )}

      {/* Main Leaderboard - RESPONSIVE LAYOUT */}
      {isMobile ? (
        // MOBILE CARD LAYOUT
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {displayData.map((user, index) => {
            const isCurrentUser = currentUser && user.userId === currentUser.uid;
            const isMedal = index < 3;

            return (
              <Card
                key={user.userId}
                sx={{
                  backgroundColor: isCurrentUser ? 'rgba(102, 126, 234, 0.1)' : isMedal ? 'rgba(255, 215, 0, 0.05)' : 'inherit',
                  borderLeft: isCurrentUser ? '4px solid #667eea' : 'none',
                  borderRadius: 1.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: 2,
                    backgroundColor: isCurrentUser ? 'rgba(102, 126, 234, 0.15)' : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
                  <Stack spacing={1}>
                    {/* Rank + Name + You Badge */}
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      {/* Rank/Medal */}
                      <Box sx={{ minWidth: 45, textAlign: 'center' }}>
                        {isMedal ? (
                          <MedalIcon rank={index + 1} />
                        ) : (
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            #{user.rank || index + 1}
                          </Typography>
                        )}
                      </Box>

                      {/* Avatar + Name */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                        <Avatar
                          src={user.profilePicture}
                          alt={user.displayName}
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: '#667eea',
                          }}
                        >
                          {user.displayName?.charAt(0) || 'U'}
                        </Avatar>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: isCurrentUser ? 'bold' : '500',
                                color: isCurrentUser ? '#667eea' : 'inherit',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flex: 1,
                              }}
                            >
                              {user.displayName || 'Unknown'}
                            </Typography>
                            {isCurrentUser && (
                              <Chip
                                label="You"
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ height: 18, fontSize: '0.65rem' }}
                              />
                            )}
                          </Stack>
                          <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.7rem' }}>
                            {user.correctPredictions || 0} correct
                            {user.exactScorePredictions > 0 && ` • ${user.exactScorePredictions} exact`}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>

                    {/* Stats Row */}
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        backgroundColor: 'rgba(0,0,0,0.02)',
                        p: 1,
                        borderRadius: 1,
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box sx={{ textAlign: 'center', flex: 1 }}>
                        <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#666' }}>
                          Predictions
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                          {user.totalPredictions || 0}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center', flex: 1 }}>
                        <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#666' }}>
                          Points
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#667eea' }}
                        >
                          {user.totalPoints || 0}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      ) : (
        // DESKTOP TABLE LAYOUT
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: 3,
            overflow: 'auto',
          }}
        >
          <Table stickyHeader sx={{ minWidth: isTablet ? 500 : 750 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 'bold',
                    width: { sm: '70px', md: '100px' },
                    fontSize: { sm: '0.875rem', md: '1rem' },
                    padding: { sm: '8px', md: '12px' },
                  }}
                >
                  Rank
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    flex: 1,
                    fontSize: { sm: '0.875rem', md: '1rem' },
                    padding: { sm: '8px', md: '12px' },
                  }}
                >
                  Player
                </TableCell>

                {!isTablet && (
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      padding: '12px',
                    }}
                  >
                    Predictions
                  </TableCell>
                )}

                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 'bold',
                    width: { sm: '100px', md: '120px' },
                    fontSize: { sm: '0.875rem', md: '1rem' },
                    padding: { sm: '8px', md: '12px' },
                  }}
                >
                  Points
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {displayData.map((user, index) => {
                const isCurrentUser = currentUser && user.userId === currentUser.uid;
                const isMedal = index < 3;

                return (
                  <TableRow
                    key={user.userId}
                    sx={{
                      backgroundColor: isCurrentUser
                        ? 'rgba(102, 126, 234, 0.1)'
                        : isMedal
                        ? 'rgba(255, 215, 0, 0.05)'
                        : 'inherit',
                      borderLeft: isCurrentUser ? `4px solid #667eea` : 'none',
                      '&:hover': {
                        backgroundColor: isCurrentUser
                          ? 'rgba(102, 126, 234, 0.15)'
                          : 'rgba(0, 0, 0, 0.04)',
                      },
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    {/* Rank Cell */}
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: { sm: '1rem', md: '1.1rem' },
                        padding: { sm: '8px', md: '12px' },
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        {isMedal ? (
                          <MedalIcon rank={index + 1} />
                        ) : (
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            #{user.rank || index + 1}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>

                    {/* Player Name Cell */}
                    <TableCell
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: { sm: 1, md: 2 },
                        py: { sm: 1.5, md: 2 },
                        px: { sm: 1, md: 2 },
                        fontSize: { sm: '0.875rem', md: '1rem' },
                      }}
                    >
                      {/* Avatar */}
                      <Avatar
                        src={user.profilePicture}
                        alt={user.displayName}
                        sx={{
                          width: { sm: 36, md: 40 },
                          height: { sm: 36, md: 40 },
                          backgroundColor: '#667eea',
                        }}
                      >
                        {user.displayName?.charAt(0) || 'U'}
                      </Avatar>

                      {/* Name and Stats */}
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            variant={isTablet ? 'body2' : 'body1'}
                            sx={{
                              fontWeight: isCurrentUser ? 'bold' : 'normal',
                              color: isCurrentUser ? '#667eea' : 'inherit',
                            }}
                          >
                            {user.displayName || 'Unknown Player'}
                          </Typography>
                          {isCurrentUser && (
                            <Chip
                              label="You"
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ height: 20 }}
                            />
                          )}
                        </Box>
                        <Typography variant="caption" color="textSecondary">
                          {user.correctPredictions || 0} correct
                          {user.exactScorePredictions > 0 &&
                            ` • ${user.exactScorePredictions} exact`}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Predictions Cell (Tablet & Desktop) */}
                    {!isTablet && (
                      <TableCell
                        align="center"
                        sx={{
                          padding: '12px',
                        }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          {user.totalPredictions || 0}
                        </Typography>
                      </TableCell>
                    )}

                    {/* Points Cell */}
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 'bold',
                        padding: { sm: '8px', md: '12px' },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        <TrendingIcon
                          sx={{
                            fontSize: { sm: '1rem', md: '1.2rem' },
                            color: '#667eea',
                          }}
                        />
                        <Typography
                          variant={isTablet ? 'body2' : 'body1'}
                          sx={{
                            fontWeight: 'bold',
                            color: '#667eea',
                            fontSize: { sm: '1rem', md: '1.1rem' },
                          }}
                        >
                          {user.totalPoints || 0}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Footer Info */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="caption" color="textSecondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
          📊 Leaderboard updates every 5 minutes
        </Typography>
      </Box>

      {/* Not Ranked Info */}
      {currentUser && !userPosition && (
        <Alert severity="info" sx={{ mt: 3, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
          📈 You're not on the leaderboard yet. Make predictions to climb the ranks!
        </Alert>
      )}
    </Container>
  );
};

/**
 * Medal Icon Component for Top 3
 */
function MedalIcon({ rank }) {
  const medals = {
    1: { emoji: '🥇', color: '#ffd700', label: '1st' },
    2: { emoji: '🥈', color: '#c0c0c0', label: '2nd' },
    3: { emoji: '🥉', color: '#cd7f32', label: '3rd' },
  };

  const medal = medals[rank];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.5,
      }}
    >
      <Typography sx={{ fontSize: '1.5rem' }}>{medal.emoji}</Typography>
      <Typography
        variant="caption"
        sx={{
          fontWeight: 'bold',
          color: medal.color,
          fontSize: '0.75rem',
        }}
      >
        {medal.label}
      </Typography>
    </Box>
  );
}

/**
 * User Position Card Component
 * Shows current user's rank and stats
 */
function UserPositionCard({ userPosition, theme, isMobile }) {
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Card
      sx={{
        mb: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : isTablet ? '1fr 1fr 1fr' : '1fr 1fr 1fr 1fr',
            gap: { xs: 1.5, sm: 2 },
            textAlign: 'center',
          }}
        >
          {/* Your Rank */}
          <Box>
            <Typography
              variant="overline"
              sx={{
                opacity: 0.8,
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
              }}
            >
              Your Rank
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              }}
            >
              #{userPosition.rank || '-'}
            </Typography>
          </Box>

          {/* Your Points */}
          <Box>
            <Typography
              variant="overline"
              sx={{
                opacity: 0.8,
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
              }}
            >
              Your Points
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              }}
            >
              {userPosition.totalPoints || 0}
            </Typography>
          </Box>

          {/* Predictions */}
          {!isMobile && (
            <Box>
              <Typography
                variant="overline"
                sx={{
                  opacity: 0.8,
                  fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.875rem' },
                }}
              >
                Predictions
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { sm: '1.25rem', md: '1.5rem' },
                }}
              >
                {userPosition.totalPredictions || 0}
              </Typography>
            </Box>
          )}

          {/* Accuracy */}
          {!isTablet && (
            <Box>
              <Typography
                variant="overline"
                sx={{
                  opacity: 0.8,
                  fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.875rem' },
                }}
              >
                Correct
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { sm: '1.25rem', md: '1.5rem' },
                }}
              >
                {userPosition.correctPredictions || 0}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default Leaderboard;
