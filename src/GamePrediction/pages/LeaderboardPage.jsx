// src/GamePrediction/pages/LeaderboardPage.jsx
import React from 'react';
import { Box, AppBar, Toolbar, Typography, Container } from '@mui/material';
import Leaderboard from '../components/Leaderboard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const LeaderboardPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Toolbar />

      <Container 
        maxWidth="lg" 
        sx={{ 
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: '1px', sm: 2 },
          width: { xs: '99vw', sm: '100%' },
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