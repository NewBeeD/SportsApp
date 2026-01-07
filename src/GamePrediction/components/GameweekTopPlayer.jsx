// src/GamePrediction/components/GameweekTopPlayer.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Stack,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { getGameweekTopPlayer, getGameweekTopPlayers } from '../services/communityStatsService';

const GameweekTopPlayer = ({ gameweek, showTopThree = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [topPlayers, setTopPlayers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!gameweek) {
      setLoading(false);
      return;
    }

    const fetchTopPlayer = async () => {
      try {
        if (showTopThree) {
          const data = await getGameweekTopPlayers(gameweek, 3);
          setTopPlayers(data);
        } else {
          const data = await getGameweekTopPlayer(gameweek);
          setTopPlayers(data ? [data] : null);
        }
        setError(null);
      } catch (err) {
        setError('Failed to load top player');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPlayer();
  }, [gameweek, showTopThree]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !topPlayers || topPlayers.length === 0) {
    return (
      <Card sx={{ backgroundColor: '#f5f5f5' }}>
        <CardContent>
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
            No player data available for this gameweek.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const getMedalIcon = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '⭐';
    }
  };

  return (
    <Card sx={{
      background: showTopThree
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
      color: showTopThree ? 'white' : '#333',
      borderRadius: 2,
      overflow: 'hidden',
    }}>
      <CardContent>
        {/* Header */}
        <Stack direction="row" spacing={1} sx={{ mb: 3, alignItems: 'center' }}>
          <EmojiEventsIcon sx={{ fontSize: 28 }} />
          <Typography variant={showTopThree ? 'h6' : 'h5'} sx={{ fontWeight: 'bold' }}>
            {showTopThree ? '🏆 Top Predictors' : '⭐ Gameweek Star'} - GW{gameweek}
          </Typography>
        </Stack>

        {/* Single Top Player (compact) */}
        {!showTopThree && topPlayers.length > 0 && (
          <Box sx={{ textAlign: 'center' }}>
            <Avatar
              alt={topPlayers[0].displayName}
              src={topPlayers[0].profilePictureUrl || ''}
              sx={{
                width: 80,
                height: 80,
                margin: '0 auto',
                mb: 2,
                border: '4px solid rgba(255,255,255,0.5)',
              }}
            >
              {topPlayers[0].displayName?.charAt(0).toUpperCase()}
            </Avatar>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              {topPlayers[0].displayName}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', mb: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
                  Points
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {topPlayers[0].gameweekPoints}
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
                  Predictions
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {topPlayers[0].gameweekPredictions}
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
                  Correct
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {topPlayers[0].gameweekCorrect}
                </Typography>
              </Box>
            </Stack>

            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              🎯 {((topPlayers[0].gameweekCorrect / topPlayers[0].gameweekPredictions) * 100).toFixed(0)}% accuracy rate
            </Typography>
          </Box>
        )}

        {/* Top Three Players (grid layout) */}
        {showTopThree && (
          <Grid container spacing={2}>
            {topPlayers.map((player, index) => (
              <Grid item xs={12} sm={6} md={4} key={player.userId}>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 1,
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {getMedalIcon(player.rank)}
                  </Typography>

                  <Avatar
                    alt={player.displayName}
                    src={player.profilePictureUrl || ''}
                    sx={{
                      width: 60,
                      height: 60,
                      margin: '0 auto',
                      mb: 1,
                      border: '3px solid rgba(255,255,255,0.3)',
                    }}
                  >
                    {player.displayName?.charAt(0).toUpperCase()}
                  </Avatar>

                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {player.displayName}
                  </Typography>

                  <Stack spacing={0.5} sx={{ mb: 1 }}>
                    <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                      <StarIcon sx={{ fontSize: 16 }} />
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {player.gameweekPoints} pts
                      </Typography>
                    </Stack>

                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                      {player.gameweekCorrect}/{player.gameweekPredictions} correct
                    </Typography>
                  </Stack>

                  <Box sx={{
                    p: 1,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: 0.5,
                    textAlign: 'center',
                  }}>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                      🎯 {((player.gameweekCorrect / player.gameweekPredictions) * 100).toFixed(0)}% accuracy
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Recognition Message */}
        <Box sx={{ mt: 2, p: 1.5, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 1, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            🎉 Congratulations to the week's top predictor! Keep making great predictions! 🚀
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GameweekTopPlayer;
