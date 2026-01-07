// src/GamePrediction/pages/PredictionPage.jsx
import React from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import PredictionForm from '../components/PredictionForm';
import MatchCard from '../components/MatchCard';
import { useMatches } from '../hooks/useMatches';
import { usePredictions } from "../hooks/usePrediction.jsx";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import SoccerIcon from '@mui/icons-material/SportsFootball';
import { useState, useEffect } from 'react';

const PredictionPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setCurrentUser);
    return () => unsubscribe();
  }, []);

  const { matches, loading: matchesLoading } = useMatches('UPCOMING');
  const { predictions } = usePredictions(currentUser?.uid);

  // Create map of predictions by matchId for quick lookup
  const predictionsByMatch = predictions.reduce((acc, pred) => {
    acc[pred.matchId] = pred;
    return acc;
  }, {});

  if (matchesLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 4, md: 8 } }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          width: '99%',
          py: { xs: 2, md: 4 },
          px: { xs: 1, sm: 2 },
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Alert severity="info">No upcoming matches available for predictions.</Alert>
      </Container>
    );
  }

  return (
    <Box>
      <Container
        maxWidth="lg"
        sx={{
          width: '99%',
          py: { xs: 1, sm: 2, md: 3 },
          px: { xs: 1, sm: 2 },
        }}
      >
        <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
          <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 'bold', mb: 1 }}>
            ⚽ Upcoming Matches
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            Predict match results and earn points! Correct outcome: +3 pts, Exact score: +5 pts
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
          {matches.map((match) => (
            <Grid item xs={12} sm={12} md={6} lg={4} key={match.id}>
              <PredictionForm
                match={match}
                existingPrediction={predictionsByMatch[match.id]}
                onSubmitSuccess={() => {
                  // Optionally refresh predictions
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default PredictionPage;
