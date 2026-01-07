// src/GamePrediction/components/GameweekLeaderboard.jsx
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { getAllGameweeks, getGameweekLeaderboard } from '../services/gameweekService';

const GameweekLeaderboard = () => {
  const [gameweeks, setGameweeks] = useState([]);
  const [selectedGameweek, setSelectedGameweek] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch available gameweeks
  useEffect(() => {
    const fetchGameweeks = async () => {
      try {
        const gws = await getAllGameweeks();
        setGameweeks(gws);
        // Set to latest gameweek by default
        if (gws.length > 0) {
          setSelectedGameweek(gws[gws.length - 1]);
        }
        setError(null);
      } catch (err) {
        setError('Failed to load gameweeks');
        console.error(err);
      }
    };

    fetchGameweeks();
  }, []);

  // Fetch leaderboard for selected gameweek
  useEffect(() => {
    if (!selectedGameweek) return;

    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await getGameweekLeaderboard(selectedGameweek);
        setLeaderboardData(data);
        setError(null);
      } catch (err) {
        setError(`Failed to load gameweek ${selectedGameweek} leaderboard`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedGameweek]);

  const getRankColor = (rank) => {
    if (rank === 1) return '#FFD700'; // Gold
    if (rank === 2) return '#C0C0C0'; // Silver
    if (rank === 3) return '#CD7F32'; // Bronze
    return 'inherit';
  };

  const getRankIcon = (rank) => {
    if (rank <= 3) {
      return <EmojiEventsIcon sx={{ color: getRankColor(rank), mr: 1 }} />;
    }
    return null;
  };

  if (error) return <Alert severity="error">{error}</Alert>;
  if (gameweeks.length === 0) return <Alert severity="info">No gameweeks available yet</Alert>;

  return (
    <Box sx={{ width: '100%' }}>
      {/* Gameweek Selector */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Select Gameweek</InputLabel>
              <Select
                value={selectedGameweek || ''}
                onChange={(e) => setSelectedGameweek(e.target.value)}
                label="Select Gameweek"
              >
                {gameweeks.map((gw) => (
                  <MenuItem key={gw} value={gw}>
                    Gameweek {gw}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedGameweek && (
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                Gameweek {selectedGameweek} Standings
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Leaderboard Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : leaderboardData.length === 0 ? (
        <Alert severity="info">No predictions completed yet for this gameweek</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Player</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  Points
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  Predictions
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  Correct
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  Exact Scores
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboardData.map((entry) => (
                <TableRow
                  key={entry.userId}
                  sx={{
                    backgroundColor:
                      entry.rank <= 3
                        ? `${getRankColor(entry.rank)}20`
                        : 'transparent',
                    '&:hover': { backgroundColor: '#f5f5f5' },
                  }}
                >
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getRankIcon(entry.rank)}
                      {entry.rank}
                    </Box>
                  </TableCell>
                  <TableCell>{entry.displayName}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                    {entry.gameweekPoints}
                  </TableCell>
                  <TableCell align="right">{entry.gameweekPredictions}</TableCell>
                  <TableCell align="right">
                    {entry.gameweekCorrect}
                    {entry.gameweekPredictions > 0 && (
                      <Typography variant="caption" sx={{ display: 'block', color: '#666' }}>
                        ({((entry.gameweekCorrect / entry.gameweekPredictions) * 100).toFixed(0)}%)
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">{entry.gameweekExactScores}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default GameweekLeaderboard;
