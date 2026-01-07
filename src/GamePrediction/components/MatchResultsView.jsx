// src/GamePrediction/components/MatchResultsView.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Stack,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { formatScore } from '../utils/pointsCalculator';

const MatchResultsView = ({ prediction, match }) => {
  if (!match || !match.actualScore || prediction.points === undefined) {
    return null;
  }

  const { outcomePoints, exactScorePoints } = prediction.pointBreakdown || {};
  const outcomeCorrect = outcomePoints > 0;
  const scoreCorrect = exactScorePoints > 0;

  return (
    <Card
      sx={{
        backgroundColor: prediction.points > 0 ? '#e8f5e9' : '#ffebee',
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Your Prediction
            </Typography>
            <Typography variant="h6">
              {formatScore(prediction.predictedScore)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Actual Result
            </Typography>
            <Typography variant="h6">
              {formatScore(match.actualScore)}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Chip
              icon={outcomeCorrect ? <CheckCircleIcon /> : <CancelIcon />}
              label={`Outcome: ${outcomePoints || 0} pts`}
              color={outcomeCorrect ? 'success' : 'default'}
              variant="outlined"
            />

            <Chip
              icon={scoreCorrect ? <CheckCircleIcon /> : <CancelIcon />}
              label={`Score: ${exactScorePoints || 0} pts`}
              color={scoreCorrect ? 'success' : 'default'}
              variant="outlined"
            />
          </Stack>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="overline" color="textSecondary">
              Points Earned
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: prediction.points > 0 ? '#2e7d32' : '#c62828',
                fontWeight: 'bold',
              }}
            >
              {prediction.points}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default MatchResultsView;