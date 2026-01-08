// src/GamePrediction/pages/PredictionGameDashboard.jsx
import React, { useState, useEffect } from 'react';
import { trackPredictionGameStarted } from '../../utils/analyticsEvents';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../config/firebaseConfig';
import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Stack,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import SoccerIcon from '@mui/icons-material/SportsFootball';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// Import individual components
import PredictionPage from './PredictionPage';
import MyPredictionsPage from './MyPredictionsPage';
import LeaderboardPage from './LeaderboardPage';
import GameweekStatsPage from './GameweekStatsPage';
import { useUserLeaderboardPosition } from '../hooks/useLeaderboard.jsx';

const PredictionGameDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentUser, setCurrentUser] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [userPosition, setUserPosition] = useState(null);

  // Monitor auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Track prediction game visit
  useEffect(() => {
    if (currentUser) {
      trackPredictionGameStarted();
    }
  }, [currentUser]);

  // Track tab changes
  useEffect(() => {
    const tabNames = ['Predictions', 'MyPredictions', 'Leaderboard', 'GameweekStats'];
    logEvent(analytics, 'prediction_tab_change', {
      tab_name: tabNames[tabValue],
      tab_index: tabValue,
    });
  }, [tabValue]);

  // Fetch user's leaderboard position for stats
  const { position: leaderboardPosition } = useUserLeaderboardPosition(
    currentUser?.uid || null
  );

  useEffect(() => {
    if (leaderboardPosition) {
      setUserPosition(leaderboardPosition);
    }
  }, [leaderboardPosition]);

  if (!currentUser) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          width: '99%',
          py: { xs: 2, md: 4 },
          px: { xs: 1, sm: 2 },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{ mt: {xs:10, sm: 20} }}>
          <Alert severity="warning">Please log in to access the Prediction Game.</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>

      {/* Header Section */}
      <Box 
      component="header"
      sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: { xs: 2, sm: 2.5 },
        px: { xs: 2, sm: 3, md: 4 },
        color: 'white',
        boxShadow: 1,
        marginTop: { sm: 4}
      }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          maxWidth: 'lg',
          mx: 'auto'
        }}>
          <SoccerIcon sx={{ 
            mr: { xs: 1.5, sm: 2 }, 
            fontSize: { xs: 28, md: 32 } 
          }} />
          
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant={isMobile ? 'h6' : 'h5'} 
              component="h1" 
              sx={{ 
                fontWeight: 'bold',
                lineHeight: 1.2
              }}
            >
              ⚽ Prediction Game
            </Typography>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                opacity: 0.9, 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                lineHeight: 1.3,
                mt: 0.5
              }}
            >
              Make predictions • Track results • Climb the ranks
            </Typography>
          </Box>
        </Box>
      </Box>


      <Container
        maxWidth="lg"
        sx={{
          width: '99%',
          py: { xs: 1.5, sm: 2, md: 4 },
          px: { xs: 1, sm: 2, md: 3 },
          overflow: 'hidden'
        }}
      >
        {/* User Stats Card */}
        {userPosition && (
          <Card
            sx={{
              mb: { xs: 2, sm: 3, md: 4 },
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: { xs: 1, md: 2 },
            }}
          >
            <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
              <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
                <Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="overline"
                    sx={{ opacity: 0.8, fontSize: { xs: '0.65rem', sm: '0.75rem' }, display: 'block' }}
                  >
                    Your Rank
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, mt: 0.5 }}
                  >
                    #{userPosition.rank || '-'}
                  </Typography>
                </Grid>

                <Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="overline"
                    sx={{ opacity: 0.8, fontSize: { xs: '0.65rem', sm: '0.75rem' }, display: 'block' }}
                  >
                    Total Points
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, mt: 0.5 }}
                  >
                    {userPosition.totalPoints || 0}
                  </Typography>
                </Grid>

                {!isMobile && (
                  <>
                    <Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
                      <Typography variant="overline" sx={{ opacity: 0.8, display: 'block' }}>
                        Predictions
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 'bold', fontSize: { sm: '1.25rem', md: '1.5rem' }, mt: 0.5 }}
                      >
                        {userPosition.totalPredictions || 0}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
                      <Typography variant="overline" sx={{ opacity: 0.8, display: 'block' }}>
                        Correct
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 'bold', fontSize: { sm: '1.25rem', md: '1.5rem' }, mt: 0.5 }}
                      >
                        {userPosition.correctPredictions || 0}
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            mb: { xs: 0, sm: 3, md: 4 },
            backgroundColor: 'white',
            borderRadius: { xs: '0 0 0 0', sm: '8px 8px 0 0' },
          }}
        >
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            variant={isMobile ? 'fullWidth' : 'standard'}
            scrollButtons={isMobile ? 'auto' : false}
            sx={{
              '& .MuiTab-root': {
                fontSize: { xs: '0.65rem', sm: '0.875rem', md: '1rem' },
                fontWeight: 500,
                minHeight: { xs: 40, sm: 48, md: 56 },
                px: { xs: 0.5, sm: 1, md: 2 },
              },
            }}
          >
            <Tab
              icon={<SoccerIcon sx={{ fontSize: { xs: 18, sm: 20 }, mr: { xs: 0.25, sm: 0.5 } }} />}
              iconPosition="start"
              label={isMobile ? 'Predict' : 'Make Predictions'}
            />
            <Tab
              icon={<AssignmentIcon sx={{ fontSize: { xs: 18, sm: 20 }, mr: { xs: 0.25, sm: 0.5 } }} />}
              iconPosition="start"
              label={isMobile ? 'My Calls' : 'My Predictions'}
            />
            <Tab
              icon={<EmojiEventsIcon sx={{ fontSize: { xs: 18, sm: 20 }, mr: { xs: 0.25, sm: 0.5 } }} />}
              iconPosition="start"
              label={isMobile ? 'Board' : 'Leaderboard'}
            />
            <Tab
              icon={<TrendingUpIcon sx={{ fontSize: { xs: 18, sm: 20 }, mr: { xs: 0.25, sm: 0.5 } }} />}
              iconPosition="start"
              label={isMobile ? 'Stats' : 'Gameweek Stats'}
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: { xs: '0 0 0 0', sm: '0 0 8px 8px' },
            p: { xs: 1, sm: 2, md: 3 },
          }}
        >
          {tabValue === 0 && <PredictionPage />}
          {tabValue === 1 && <MyPredictionsPage />}
          {tabValue === 2 && <LeaderboardPage />}
          {tabValue === 3 && currentUser && <GameweekStatsPage userId={currentUser.uid} />}
        </Box>
      </Container>
    </Box>
  );
};

export default PredictionGameDashboard;

