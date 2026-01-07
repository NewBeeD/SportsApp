// src/GamePrediction/pages/AdminMatchManagementPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { useSnackbar } from 'notistack';
import SecurityIcon from '@mui/icons-material/Security';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MatchCard from '../components/MatchCard';

const AdminMatchManagementPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Form state
  const [formData, setFormData] = useState({
    homeTeamName: '',
    awayTeamName: '',
    scheduledTime: '',
    status: 'UPCOMING',
    league: 'PREMIER',
    gameweek: 1,
    actualScore: { home: '', away: '' },
  });


  // Check auth and subscribe to matches in realtime
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        setIsAdmin(idTokenResult.claims.admin === true);
        if (idTokenResult.claims.admin === true) {
          setLoading(true);
          // Subscribe to matches collection in realtime
          const matchesRef = collection(db, 'matches');
          const unsubscribeMatches = onSnapshot(matchesRef, (snapshot) => {
            const matchesData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setMatches(matchesData);
            setLoading(false);
          }, (error) => {
            console.error('Error fetching matches:', error);
            enqueueSnackbar('Failed to fetch matches', { variant: 'error' });
            setLoading(false);
          });
          // Clean up matches listener on unmount or logout
          return () => unsubscribeMatches();
        }
      }
    });
    // Clean up auth listener on unmount
    return () => unsubscribeAuth();
  }, []);

  // Handle form input
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name === 'homeScore' || name === 'awayScore') {
      setFormData({
        ...formData,
        actualScore: {
          ...formData.actualScore,
          [name === 'homeScore' ? 'home' : 'away']: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Open dialog for new or edit
  const handleOpenDialog = (match = null) => {
    if (match) {
      setEditingMatch(match);
      setFormData({
        homeTeamName: match.homeTeamName,
        awayTeamName: match.awayTeamName,
        scheduledTime: match.scheduledTime
          ? new Date(match.scheduledTime.seconds * 1000).toISOString().slice(0, 16)
          : '',
        status: match.status,
        league: match.league || 'PREMIER',
        gameweek: match.gameweek || 1,
        actualScore: match.actualScore || { home: '', away: '' },
      });
    } else {
      setEditingMatch(null);
      setFormData({
        homeTeamName: '',
        awayTeamName: '',
        scheduledTime: '',
        status: 'UPCOMING',
        league: 'PREMIER',
        gameweek: 1,
        actualScore: { home: '', away: '' },
      });
    }
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMatch(null);
  };

  // Save match (create or update)
  const handleSaveMatch = async () => {
    try {
      if (
        !formData.homeTeamName ||
        !formData.awayTeamName ||
        !formData.scheduledTime
      ) {
        enqueueSnackbar('Please fill in all required fields', {
          variant: 'warning',
        });
        return;
      }

      const matchData = {
        homeTeamName: formData.homeTeamName,
        awayTeamName: formData.awayTeamName,
        scheduledTime: new Date(formData.scheduledTime),
        status: formData.status,
        league: formData.league,
        gameweek: parseInt(formData.gameweek, 10),
        updatedAt: serverTimestamp(),
      };

      // Add actualScore if match is finished
      if (formData.status === 'FINISHED') {
        if (formData.actualScore.home === '' || formData.actualScore.away === '') {
          enqueueSnackbar('Please provide actual score for finished match', {
            variant: 'warning',
          });
          return;
        }
        matchData.actualScore = {
          home: parseInt(formData.actualScore.home, 10),
          away: parseInt(formData.actualScore.away, 10),
        };
        matchData.pointsAwarded = false; // Will be set by Cloud Function
      }

      if (editingMatch) {
        // Update existing match
        const matchRef = doc(db, 'matches', editingMatch.id);
        await updateDoc(matchRef, matchData);
        enqueueSnackbar('Match updated successfully!', { variant: 'success' });
      } else {
        // Create new match
        matchData.createdAt = serverTimestamp();
        matchData.pointsAwarded = false;
        await addDoc(collection(db, 'matches'), matchData);
        enqueueSnackbar('Match created successfully!', { variant: 'success' });
      }

      handleCloseDialog();
    } catch (error) {
      console.error('Error saving match:', error);
      enqueueSnackbar('Failed to save match', { variant: 'error' });
    }
  };

  // Delete match
  const handleDeleteMatch = async (matchId) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      try {
        await deleteDoc(doc(db, 'matches', matchId));
        enqueueSnackbar('Match deleted successfully!', { variant: 'success' });
      } catch (error) {
        console.error('Error deleting match:', error);
        enqueueSnackbar('Failed to delete match', { variant: 'error' });
      }
    }
  };

  // Authorization check
  if (!currentUser) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="warning">Please log in to access admin panel</Alert>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">
          ❌ You do not have admin permissions. Contact your administrator.
        </Alert>
      </Container>
    );
  }

  // Filter matches by status
  const upcomingMatches = matches.filter((m) => m.status === 'UPCOMING');
  const liveMatches = matches.filter((m) => m.status === 'LIVE');
  const finishedMatches = matches.filter((m) => m.status === 'FINISHED');

  return (
    <>
      <AppBar sx={{ background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)' }}>
        <Toolbar>
          <SecurityIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin - Match Management
          </Typography>
        </Toolbar>
      </AppBar>

      <Toolbar />

      <Container 
        maxWidth="lg" 
        sx={{ 
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: '1px', sm: 2 },
          width: { xs: '99vw', sm: '100%' },
        }}
      >
        {/* Header with Add Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: { xs: 2, sm: 4 }, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 0 } }}>
          <Box>
            <Typography variant={{ xs: 'h6', sm: 'h5' }} sx={{ fontWeight: 'bold' }}>
              📋 Match Management
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Create, edit, and manage fixtures
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            size={isMobile ? 'small' : 'large'}
          >
            {isMobile ? 'Add' : 'Add Match'}
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
                variant={isMobile ? "scrollable" : "fullWidth"}
                scrollButtons={isMobile ? "auto" : false}
                sx={{
                  '& .MuiTab-root': {
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    padding: { xs: '8px 12px', sm: '12px 16px' },
                  }
                }}
              >
                <Tab
                  label={isMobile ? `⏳ Upcoming (${upcomingMatches.length})` : `⏳ Upcoming Matches (${upcomingMatches.length})`}
                  value={0}
                />
                <Tab
                  label={isMobile ? `🔴 Live (${liveMatches.length})` : `🔴 Live Matches (${liveMatches.length})`}
                  value={1}
                />
                <Tab
                  label={isMobile ? `✅ Finished (${finishedMatches.length})` : `✅ Finished Matches (${finishedMatches.length})`}
                  value={2}
                />
              </Tabs>
            </Box>

            {/* Upcoming Matches Tab */}
            {tabValue === 0 && (
              <Box>
                {upcomingMatches.length === 0 ? (
                  <Alert severity="info">No upcoming matches</Alert>
                ) : (
                  <Grid container spacing={3}>
                    {upcomingMatches.map((match) => (
                      <Grid item xs={12} md={6} lg={4} key={match.id}>
                        <MatchCard match={match} onEdit={handleOpenDialog} onDelete={handleDeleteMatch} />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}

            {/* Live Matches Tab */}
            {tabValue === 1 && (
              <Box>
                {liveMatches.length === 0 ? (
                  <Alert severity="info">No live matches</Alert>
                ) : (
                  <Grid container spacing={3}>
                    {liveMatches.map((match) => (
                      <Grid item xs={12} md={6} lg={4} key={match.id}>
                        <MatchCard match={match} onEdit={handleOpenDialog} onDelete={handleDeleteMatch} />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}

            {/* Finished Matches Tab */}
            {tabValue === 2 && (
              <Box>
                {finishedMatches.length === 0 ? (
                  <Alert severity="info">No finished matches</Alert>
                ) : (
                  <Grid container spacing={3}>
                    {finishedMatches.map((match) => (
                      <Grid item xs={12} md={6} lg={4} key={match.id}>
                        <MatchCard match={match} onEdit={handleOpenDialog} onDelete={handleDeleteMatch} />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}
          </>
        )}
      </Container>

      {/* Dialog for Create/Edit Match */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingMatch ? '✏️ Edit Match' : '➕ Add New Match'}
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            {/* Home Team */}
            <TextField
              fullWidth
              label="Home Team Name"
              name="homeTeamName"
              value={formData.homeTeamName}
              onChange={handleFormChange}
              placeholder="e.g., Team A"
            />

            {/* Away Team */}
            <TextField
              fullWidth
              label="Away Team Name"
              name="awayTeamName"
              value={formData.awayTeamName}
              onChange={handleFormChange}
              placeholder="e.g., Team B"
            />

            {/* Scheduled Time */}
            <TextField
              fullWidth
              type="datetime-local"
              label="Scheduled Time"
              name="scheduledTime"
              value={formData.scheduledTime}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
            />

            {/* League */}
            <FormControl fullWidth>
              <InputLabel>League</InputLabel>
              <Select
                name="league"
                value={formData.league}
                onChange={handleFormChange}
                label="League"
              >
                <MenuItem value="PREMIER">Premier Division</MenuItem>
                <MenuItem value="DIV_ONE">Division One</MenuItem>
                <MenuItem value="WOMEN">Women's Division</MenuItem>
                <MenuItem value="CUP">Cup</MenuItem>
              </Select>
            </FormControl>

            {/* Gameweek */}
            <TextField
              fullWidth
              type="number"
              label="Gameweek"
              name="gameweek"
              value={formData.gameweek}
              onChange={handleFormChange}
              inputProps={{ min: 1, max: 50 }}
              helperText="Week number for this match (e.g., 1, 2, 3)"
            />

            {/* Status */}
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                label="Status"
              >
                <MenuItem value="UPCOMING">Upcoming</MenuItem>
                <MenuItem value="LIVE">Live</MenuItem>
                <MenuItem value="FINISHED">Finished</MenuItem>
              </Select>
            </FormControl>

            {/* Actual Score (only if Finished) */}
            {formData.status === 'FINISHED' && (
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Final Score
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Home Score"
                      name="homeScore"
                      value={formData.actualScore.home}
                      onChange={handleFormChange}
                      inputProps={{ min: 0, max: 20 }}
                    />
                  </Grid>

                  <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ fontWeight: 'bold' }}>-</Typography>
                  </Grid>

                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Away Score"
                      name="awayScore"
                      value={formData.actualScore.away}
                      onChange={handleFormChange}
                      inputProps={{ min: 0, max: 20 }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveMatch} variant="contained" color="primary">
            {editingMatch ? 'Update Match' : 'Create Match'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminMatchManagementPage;


