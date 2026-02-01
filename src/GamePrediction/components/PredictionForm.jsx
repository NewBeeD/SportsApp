// src/GamePrediction/components/PredictionForm.jsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  Divider,
  Paper,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { validatePrediction } from '../utils/predictionValidators';
import { usePredictionMutation } from '../hooks/usePredictionMutation';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CommunityPredictions from './CommunityPredictions';
import PredictionComparison from './PredictionComparison';

const PredictionForm = ({ match, onSubmitSuccess, existingPrediction = null }) => {
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [predictedOutcome, setPredictedOutcome] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [kickoffPassed, setKickoffPassed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [predictionScored, setPredictionScored] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { enqueueSnackbar } = useSnackbar();
  const { submit, loading } = usePredictionMutation();

  // Monitor auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Check if prediction is already scored (cannot edit scored predictions)
  useEffect(() => {
    if (existingPrediction && existingPrediction.points > 0) {
      setPredictionScored(true);
      setSubmitted(true);
    } else if (existingPrediction) {
      setHomeScore(existingPrediction.predictedScore?.home || '');
      setAwayScore(existingPrediction.predictedScore?.away || '');
      setPredictedOutcome(existingPrediction.predictedOutcome || '');
      setSubmitted(true);
    }
  }, [existingPrediction]);

  // Check kickoff time and match status
  useEffect(() => {
    if (!match?.scheduledTime) return;

    const checkKickoff = () => {
      const kickoffTime = new Date(match.scheduledTime.seconds * 1000);
      const hasKickoffPassed = new Date() >= kickoffTime;
      // Block edits if match is LIVE or FINISHED
      const isMatchLiveOrFinished = match.status === 'LIVE' || match.status === 'FINISHED';
      setKickoffPassed(hasKickoffPassed || isMatchLiveOrFinished);
    };

    checkKickoff();
    const timer = setInterval(checkKickoff, 60000);

    return () => clearInterval(timer);
  }, [match]);

  // Derive outcome from scores
  useEffect(() => {
    if (homeScore === '' || awayScore === '') {
      setPredictedOutcome('');
      return;
    }

    const home = parseInt(homeScore, 10);
    const away = parseInt(awayScore, 10);

    if (home > away) {
      setPredictedOutcome('HOME_WIN');
    } else if (home < away) {
      setPredictedOutcome('AWAY_WIN');
    } else {
      setPredictedOutcome('DRAW');
    }
  }, [homeScore, awayScore]);

  const validateForm = () => {
    const newErrors = {};

    if (homeScore === '') {
      newErrors.homeScore = 'Home score is required';
    } else {
      const home = parseInt(homeScore, 10);
      if (home < 0 || home > 20) {
        newErrors.homeScore = 'Score must be 0-20';
      }
    }

    if (awayScore === '') {
      newErrors.awayScore = 'Away score is required';
    } else {
      const away = parseInt(awayScore, 10);
      if (away < 0 || away > 20) {
        newErrors.awayScore = 'Score must be 0-20';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      enqueueSnackbar('Please fix form errors', { variant: 'warning' });
      return;
    }

    if (!currentUser) {
      enqueueSnackbar('Please log in to make a prediction', { variant: 'error' });
      return;
    }

    // ✅ Use match.id or match.matchId
    if (!match?.id && !match?.matchId) {
      enqueueSnackbar('Match data is invalid', { variant: 'error' });
      return;
    }

    try {
      await submit(currentUser.uid, match.id || match.matchId, {
        predictedOutcome,
        predictedScore: {
          home: parseInt(homeScore, 10),
          away: parseInt(awayScore, 10),
        },
      });

      setSubmitted(true);
      setEditing(false);
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error('Error submitting prediction:', error);
    }
  };

  const handleClear = () => {
    setHomeScore('');
    setAwayScore('');
    setPredictedOutcome('');
    setErrors({});
    setEditing(false);
  };

  if (!match) {
    return (
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography color="error" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Match data not available</Typography>
        </CardContent>
      </Card>
    );
  }

  // If kickoff has passed or match is live/finished, show prediction in read-only mode
  if (kickoffPassed) {
    const isMatchLiveOrFinished = match.status === 'LIVE' || match.status === 'FINISHED';
    const hasPrediction = submitted && homeScore !== '' && awayScore !== '';

    return (
      <Box>
        {/* Show user's prediction if they made one */}
        {hasPrediction && (
          <Card sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', mb: 2 }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
              <Alert severity="info" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, mb: 2 }}>
                ⏰ {isMatchLiveOrFinished ? `Match ${match.status.toUpperCase()} - Your prediction is locked.` : 'Kickoff has started. Predictions locked.'}
              </Alert>

              {/* Display predicted scores and teams - READ ONLY */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
                  📊 Your Prediction
                </Typography>
                <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }}>
                  <Grid container spacing={{ xs: 1, sm: 2 }} alignItems="center" justifyContent="center">
                    <Grid item xs={12} sm="auto" sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ opacity: 0.8, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {match.homeTeamName}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                        {homeScore}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm="auto" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, opacity: 0.8 }}>
                        VS
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm="auto" sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ opacity: 0.8, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {match.awayTeamName}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                        {awayScore}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Box sx={{ textAlign: 'center', mt: 1.5 }}>
                    <Chip
                      label={
                        predictedOutcome === 'HOME_WIN'
                          ? `${match.homeTeamName} Win`
                          : predictedOutcome === 'AWAY_WIN'
                          ? `${match.awayTeamName} Win`
                          : 'Draw'
                      }
                      color={
                        predictedOutcome === 'HOME_WIN' || predictedOutcome === 'AWAY_WIN'
                          ? 'success'
                          : 'warning'
                      }
                      variant="filled"
                      size={isMobile ? 'small' : 'medium'}
                      sx={{
                        fontSize: { xs: '0.7rem', sm: '0.875rem' },
                      }}
                    />
                  </Box>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Show message if no prediction was made */}
        {!hasPrediction && (
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
              <Alert severity="warning" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                ⏰ {isMatchLiveOrFinished ? `Match ${match.status.toUpperCase()} - Predictions locked.` : 'Kickoff has started. Predictions closed.'}
              </Alert>
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, color: 'text.secondary' }}>
                  You did not make a prediction for this match.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Show Community Predictions after kickoff */}
        <Box sx={{ mt: { xs: 1.5, sm: 2 } }}>
          <CommunityPredictions matchId={match.id || match.matchId} match={match} currentUser={currentUser} />
        </Box>
      </Box>
    );
  }

  // If submitted and not editing, show prediction details with community data
  if (submitted && !editing) {
    return (
      <Box>
        <Card sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
            <Alert severity={predictionScored ? 'info' : 'success'} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, mb: 2 }}>
              {predictionScored 
                ? '✅ Prediction scored! Your score has been calculated.' 
                : '✅ Prediction submitted!'}
            </Alert>

            {/* Display predicted scores and teams */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
                📊 Your Prediction
              </Typography>
              <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }}>
                <Grid container spacing={{ xs: 1, sm: 2 }} alignItems="center" justifyContent="center">
                  <Grid item xs={12} sm="auto" sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ opacity: 0.8, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      {match.homeTeamName}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                      {homeScore}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm="auto" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, opacity: 0.8 }}>
                      VS
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm="auto" sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ opacity: 0.8, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      {match.awayTeamName}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                      {awayScore}
                    </Typography>
                  </Grid>
                </Grid>
                <Box sx={{ textAlign: 'center', mt: 1.5 }}>
                  <Chip
                    label={
                      predictedOutcome === 'HOME_WIN'
                        ? `${match.homeTeamName} Win`
                        : predictedOutcome === 'AWAY_WIN'
                        ? `${match.awayTeamName} Win`
                        : 'Draw'
                    }
                    color={
                      predictedOutcome === 'HOME_WIN' || predictedOutcome === 'AWAY_WIN'
                        ? 'success'
                        : 'warning'
                    }
                    variant="filled"
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      fontSize: { xs: '0.7rem', sm: '0.875rem' },
                    }}
                  />
                </Box>
              </Paper>
            </Box>

            {!predictionScored && (
              <Box sx={{ textAlign: 'center' }}>
                <Button 
                  variant="outlined" 
                  onClick={() => setEditing(true)} 
                  size={isMobile ? 'small' : 'medium'}
                  sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.5)', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  Edit Prediction
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Show comparison when prediction is scored */}
        {predictionScored && (
          <Box sx={{ mt: { xs: 1.5, sm: 2 } }}>
            <PredictionComparison 
              userId={currentUser?.uid}
              matchId={match.id || match.matchId}
              match={match}
              prediction={existingPrediction}
            />
          </Box>
        )}

        {/* Show Community Predictions, Key Analytics, and Top Scorelines */}
        <Box sx={{ mt: { xs: 1.5, sm: 2 } }}>
          <CommunityPredictions matchId={match.id || match.matchId} match={match} currentUser={currentUser} />
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Card
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <CardHeader
          title={
            <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' }, fontWeight: 'bold' }}>
              {`${match.homeTeamName || 'Home'} vs ${match.awayTeamName || 'Away'}`}
            </Typography>
          }
          subheader={
            match.scheduledTime && (
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                {new Date(match.scheduledTime.seconds * 1000).toLocaleString()}
              </Typography>
            )
          }
          sx={{ textAlign: 'center', p: { xs: 1.5, sm: 2 } }}
        />

        <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={{ xs: 1.5, sm: 2, md: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 1.5, sm: 2, md: 3 },
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
                  📊 Predict the Final Score
                </Typography>

                <Grid container spacing={{ xs: 1, sm: 2 }} alignItems="flex-start">
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Home"
                      value={homeScore}
                      onChange={(e) => setHomeScore(e.target.value)}
                      inputProps={{ min: 0, max: 20 }}
                      error={!!errors.homeScore}
                      helperText={errors.homeScore}
                      disabled={kickoffPassed || loading || predictionScored}
                      size={isMobile ? 'small' : 'medium'}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        },
                        '& .MuiInputBase-input': {
                          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                          textAlign: 'center',
                          fontWeight: 'bold',
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pt: { xs: 2, sm: 3 } }}>
                    <Typography variant={isMobile ? 'body2' : 'h5'} sx={{ fontWeight: 'bold', opacity: 0.8 }}>
                      VS
                    </Typography>
                  </Grid>

                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Away"
                      value={awayScore}
                      onChange={(e) => setAwayScore(e.target.value)}
                      inputProps={{ min: 0, max: 20 }}
                      error={!!errors.awayScore}
                      helperText={errors.awayScore}
                      disabled={kickoffPassed || loading || predictionScored}
                      size={isMobile ? 'small' : 'medium'}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        },
                        '& .MuiInputBase-input': {
                          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                          textAlign: 'center',
                          fontWeight: 'bold',
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>

              <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />

              {predictedOutcome && (
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 1, sm: 1.5 },
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: 2,
                    textAlign: 'center',
                  }}
                >

                  <Chip
                    icon={<EmojiEventsIcon />}
                    label={
                      predictedOutcome === 'HOME_WIN'
                        ? `${match.homeTeamName} Win`
                        : predictedOutcome === 'AWAY_WIN'
                        ? `${match.awayTeamName} Win`
                        : 'Draw'
                    }
                    color={
                      predictedOutcome === 'HOME_WIN' || predictedOutcome === 'AWAY_WIN'
                        ? 'success'
                        : 'warning'
                    }
                    variant="filled"
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      fontSize: { xs: '0.7rem', sm: '0.875rem' },
                      height: 'auto',
                      py: { xs: 1, sm: 1.5 },
                      mt: 0.5
                    }}
                  />
                </Paper>
              )}

              <Paper
                elevation={0}
                sx={{
                  p: { xs: 1, sm: 1.5 },
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                }}
              >
                <Stack direction="row" spacing={1}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ opacity: 0.8, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                      Correct Outcome
                    </Typography>
                    <Typography variant={isMobile ? 'body2' : 'h6'} sx={{ fontWeight: 'bold' }}>
                      +5 pts
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ opacity: 0.8, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                      Exact Score
                    </Typography>
                    <Typography variant={isMobile ? 'body2' : 'h6'} sx={{ fontWeight: 'bold' }}>
                      +10 pts
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>

            <CardActions sx={{ justifyContent: 'flex-end', gap: 1, pt: { xs: 1.5, sm: 2 }, px: { xs: 1, sm: 2 } }}>
              <Button
                variant="outlined"
                onClick={handleClear}
                disabled={loading || kickoffPassed || predictionScored}
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
                Clear
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={loading || kickoffPassed || !currentUser || predictionScored}
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={16} sx={{ mr: 0.5, color: 'white' }} />
                    {isMobile ? 'Saving...' : 'Submit Prediction'}
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </CardActions>

            {!currentUser && (
              <Alert severity="warning" sx={{ mt: 2, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                Please log in to make a prediction
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Show Community Predictions below the form */}
      <Box sx={{ mt: { xs: 1.5, sm: 2, md: 3 } }}>
        <CommunityPredictions matchId={match.id || match.matchId} match={match} currentUser={currentUser} />
      </Box>
    </Box>
  );
};

export default PredictionForm;



