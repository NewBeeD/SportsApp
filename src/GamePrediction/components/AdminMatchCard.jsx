// src/GamePrediction/components/AdminMatchCard.jsx
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Box,
  Button,
  Chip,
  Stack,
  Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';

const AdminMatchCard = ({ match, onEdit, onDelete }) => {
  const isFinished = match.status === 'FINISHED';
  const scheduledTime = match.scheduledTime
    ? new Date(match.scheduledTime.seconds * 1000).toLocaleString()
    : 'N/A';

  const getStatusColor = (status) => {
    switch (status) {
      case 'UPCOMING':
        return 'warning';
      case 'LIVE':
        return 'info';
      case 'FINISHED':
        return 'success';
      default:
        return 'default';
    }
  };

  const getLeagueLabel = (league) => {
    const labels = {
      PREMIER: '🏆 Premier',
      DIV_ONE: '🥈 Div One',
      WOMEN: '👩 Women',
      CUP: '🏅 Cup',
    };
    return labels[league] || league;
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: isFinished ? '4px solid #4caf50' : '4px solid #ff9800',
      }}
    >
      <CardHeader
        title={
          <Box>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <Chip
                label={match.status}
                size="small"
                color={getStatusColor(match.status)}
                variant="outlined"
              />
              <Chip
                label={getLeagueLabel(match.league)}
                size="small"
                variant="outlined"
              />
            </Stack>
          </Box>
        }
        subheader={
          <Stack direction="row" alignItems="center" spacing={1}>
            <ScheduleIcon sx={{ fontSize: '1rem' }} />
            <Typography variant="caption">{scheduledTime}</Typography>
          </Stack>
        }
      />

      <CardContent sx={{ flexGrow: 1 }}>
        {/* Match Title */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
          {match.homeTeamName} vs {match.awayTeamName}
        </Typography>

        {/* Score Display */}
        {isFinished && match.actualScore ? (
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={4}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {match.homeTeamName}
                </Typography>
                <Typography variant="h5" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                  {match.actualScore.home}
                </Typography>
              </Grid>

              <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircleIcon sx={{ color: '#4caf50', fontSize: '2rem' }} />
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {match.awayTeamName}
                </Typography>
                <Typography variant="h5" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                  {match.actualScore.away}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mb: 2 }}>
            Score not set yet
          </Typography>
        )}

        {/* Predictions Count */}
        {match.totalPredictions > 0 && (
          <Typography variant="caption" color="textSecondary">
            📊 {match.totalPredictions} predictions made
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ gap: 1, justifyContent: 'flex-end' }}>
        <Button
          size="small"
          color="primary"
          startIcon={<EditIcon />}
          onClick={() => onEdit(match)}
        >
          Edit
        </Button>
        <Button
          size="small"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(match.id)}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default AdminMatchCard;