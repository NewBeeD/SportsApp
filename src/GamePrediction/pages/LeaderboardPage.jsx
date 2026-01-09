// src/GamePrediction/pages/LeaderboardPage.jsx
import React from 'react';
import appTheme from '../../css/theme';
import { Box, AppBar, Toolbar, Typography, Container } from '@mui/material';
import Leaderboard from '../components/Leaderboard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const LeaderboardPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: appTheme.colors.lightGray }}>
      <Toolbar />

      <Container 
        maxWidth="lg" 
        sx={{ 
          width: '99%',
          py: { xs: 0, sm: 3, md: 4 },
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <Typography sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' }, fontWeight: 'bold', mb: 1 }}>
            🏆 Leaderboard
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            Top 50 predictors by points
          </Typography>
        </Box>

        <Leaderboard topN={50} enableRealtime={true} />
      </Container>
    </Box>
  );
};

export default LeaderboardPage;