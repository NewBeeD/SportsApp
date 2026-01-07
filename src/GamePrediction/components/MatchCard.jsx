// src/GamePrediction/components/MatchCard.jsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Stack,
  Chip,
  Avatar,
  Grid,
  CircularProgress,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatScore, formatTimeRemaining, hasTimePasssed } from '../utils/pointsCalculator';
import SoccerIcon from '@mui/icons-material/SportsFootball';
import TimerIcon from '@mui/icons-material/Timer';

const MatchCard = ({ match, prediction, onEdit, onDelete }) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isKickoff, setIsKickoff] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!match?.scheduledTime) return;

    const updateTime = () => {
      setTimeRemaining(formatTimeRemaining(match.scheduledTime));
      setIsKickoff(hasTimePasssed(match.scheduledTime));
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);

    return () => clearInterval(timer);
  }, [match]);

  if (!match) return null;

  return (
    <Card
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        borderLeft: prediction ? { xs: '3px', sm: '4px' } : 'none',
        borderLeftColor: prediction ? '#667eea' : 'transparent',
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: { xs: 1, sm: 2 } }}>
            <SoccerIcon sx={{ color: '#667eea', fontSize: { xs: 18, sm: 20 } }} />
            <Typography variant={isMobile ? 'body2' : 'h6'} sx={{ fontSize: { xs: '0.85rem', sm: '1rem' }, fontWeight: 'bold' }}>
              {isMobile ? `${match.homeTeamName?.slice(0, 3)} vs ${match.awayTeamName?.slice(0, 3)}` : `${match.homeTeamName} vs ${match.awayTeamName}`}
            </Typography>
            {/* Admin Edit/Delete Buttons */}
            {(onEdit || onDelete) && (
              <Box sx={{ marginLeft: 'auto', display: 'flex', gap: 0.5 }}>
                {onEdit && (
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => onEdit(match)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                {onDelete && (
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => onDelete(match.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            )}
          </Box>
        }
        subheader={
          <Stack direction={isMobile ? 'column' : 'row'} spacing={isMobile ? 0.5 : 1.5} sx={{ mt: 1 }}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <TimerIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} />
              <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                {timeRemaining} {!isMobile && (isKickoff ? '- Started' : '- to kickoff')}
              </Typography>
            </Stack>
            <Chip
              label={match.status}
              size="small"
              color={match.status === 'FINISHED' ? 'success' : 'warning'}
              variant="outlined"
              sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, height: { xs: 20, sm: 24 } }}
            />
          </Stack>
        }
        sx={{ pb: { xs: 1, sm: 1.5 } }}
      />

      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Grid container spacing={{ xs: 1, sm: 2 }}>
          {/* Score Section */}
          <Grid item xs={12}>
            {match.status === 'FINISHED' && match.actualScore ? (
              <Box sx={{ textAlign: 'center', p: { xs: 1, sm: 2 }, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="caption" color="textSecondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                  Final Score
                </Typography>
                <Typography variant={isMobile ? 'body1' : 'h4'} sx={{ fontWeight: 'bold', fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
                  {formatScore(match.actualScore)}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                In progress...
              </Typography>
            )}
          </Grid>

          {/* User Prediction */}
          {prediction && (
            <>
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 0.5, fontSize: { xs: '0.75rem', sm: '0.85rem' }, display: 'block' }}>
                  Your Prediction
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ p: { xs: 0.75, sm: 1 }, backgroundColor: '#f5f5f5', borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                    Score
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                    {formatScore(prediction.predictedScore)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ p: { xs: 0.75, sm: 1 }, backgroundColor: '#f5f5f5', borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                    Outcome
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: { xs: '0.7rem', sm: '0.8rem' }, display: 'block' }}>
                    {prediction.predictedOutcome === 'HOME_WIN'
                      ? 'Home Win'
                      : prediction.predictedOutcome === 'AWAY_WIN'
                      ? 'Away Win'
                      : 'Draw'}
                  </Typography>
                </Box>
              </Grid>

              {prediction.points > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ p: { xs: 0.75, sm: 1 }, backgroundColor: '#e8f5e9', borderRadius: 1, textAlign: 'center' }}>
                    <Typography variant="caption" color="textSecondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                      Points
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 'bold',
                        color: '#2e7d32',
                        fontSize: { xs: '0.9rem', sm: '1.1rem' }
                      }}
                    >
                      +{prediction.points} pts
                    </Typography>
                  </Box>
                </Grid>
              )}
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default MatchCard;


