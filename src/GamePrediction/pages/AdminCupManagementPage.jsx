import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../config/firebaseConfig';
import appTheme from '../../css/theme';

const DEFAULT_TEAM_COUNT = 16;

const buildSingleElimMatches = (teams) => {
  const teamCount = teams.length;
  if (![8, 16].includes(teamCount)) {
    throw new Error('Only 8 or 16 teams supported.');
  }

  const rounds = Math.log2(teamCount);
  let matchId = 1;
  const roundMatches = [];

  for (let round = 1; round <= rounds; round += 1) {
    const matchesInRound = teamCount / Math.pow(2, round);
    const matches = Array.from({ length: matchesInRound }, (_, index) => ({
      id: matchId++,
      name: `Round ${round} - Match ${index + 1}`,
      nextMatchId: null,
      nextLooserMatchId: null,
      tournamentRoundText: String(round),
      startTime: null,
      state: 'SCHEDULED',
      participants: [],
      round,
      roundIndex: index,
    }));
    roundMatches.push(matches);
  }

  for (let round = 0; round < rounds - 1; round += 1) {
    roundMatches[round].forEach((match, index) => {
      match.nextMatchId = roundMatches[round + 1][Math.floor(index / 2)].id;
    });
  }

  roundMatches[0].forEach((match, index) => {
    match.participants = [teams[index * 2], teams[index * 2 + 1]].filter(Boolean);
  });

  return roundMatches.flat();
};

const buildDefaultTeams = (count) =>
  Array.from({ length: count }, (_, index) => ({
    id: `team-${index + 1}`,
    name: '',
  }));

const AdminCupManagementPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cupError, setCupError] = useState(null);
  const [teams, setTeams] = useState(() => buildDefaultTeams(DEFAULT_TEAM_COUNT));
  const [matches, setMatches] = useState(() => buildSingleElimMatches(buildDefaultTeams(DEFAULT_TEAM_COUNT)));
  const [scoreByMatch, setScoreByMatch] = useState({});
  const [selectedRound, setSelectedRound] = useState(1);
  const [savingMatchId, setSavingMatchId] = useState(null);
  const [savedMatchId, setSavedMatchId] = useState(null);

  const textFieldSx = {
    '& .MuiInputBase-root': {
      color: '#FFFFFF',
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      fontFamily: '"Poppins", "Inter", "Roboto", sans-serif',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: appTheme.colors.secondary,
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.7)',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#FFD700',
    },
    '& .MuiInputBase-input::placeholder': {
      color: 'rgba(255, 255, 255, 0.5)',
      opacity: 1,
    },
  };

  const selectSx = {
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    fontFamily: '"Poppins", "Inter", "Roboto", sans-serif',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: appTheme.colors.secondary,
    },
    '& .MuiSvgIcon-root': {
      color: 'rgba(255, 255, 255, 0.7)',
    },
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const idTokenResult = await user.getIdTokenResult(true);
      const admin = idTokenResult.claims.admin === true;
      setIsAdmin(admin);

      if (!admin) {
        setLoading(false);
        return;
      }

      const cupRef = doc(db, 'cupBrackets', 'presidents-cup');
      const unsubscribeCup = onSnapshot(
        cupRef,
        async (snapshot) => {
          if (!snapshot.exists()) {
            const initialTeams = buildDefaultTeams(DEFAULT_TEAM_COUNT);
            const initialMatches = buildSingleElimMatches(initialTeams);
            await setDoc(cupRef, {
              title: 'President\'s Cup',
              teamCount: DEFAULT_TEAM_COUNT,
              teams: initialTeams,
              matches: initialMatches,
              updatedAt: serverTimestamp(),
            });
            setTeams(initialTeams);
            setMatches(initialMatches);
            setLoading(false);
            return;
          }

          const data = snapshot.data();
          if (Array.isArray(data?.teams)) {
            setTeams(data.teams);
          }
          if (Array.isArray(data?.matches)) {
            setMatches(data.matches);
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error loading cup admin data:', error);
          setCupError('Unable to load cup data. Check Firestore rules or admin permissions.');
          setLoading(false);
        }
      );

      return () => unsubscribeCup();
    });

    return () => unsubscribeAuth();
  }, []);

  const teamCount = teams.length;

  const handleTeamCountChange = (event) => {
    const nextCount = Number(event.target.value);
    const nextTeams = buildDefaultTeams(nextCount).map((team, index) => {
      if (teams[index]) {
        return { ...team, name: teams[index].name || team.name };
      }
      return team;
    });
    setTeams(nextTeams);
    setSelectedRound(1);
  };

  const handleTeamNameChange = (index, value) => {
    setTeams((prev) =>
      prev.map((team, i) => (i === index ? { ...team, name: value } : team))
    );
  };

  const handleSaveTeams = async () => {
    if (![8, 16].includes(teams.length)) {
      return;
    }

    const sanitizedTeams = teams.map((team, index) => ({
      id: team.id || `team-${index + 1}`,
      name: team.name?.trim() || 'TBD',
    }));

    const newMatches = buildSingleElimMatches(sanitizedTeams);
    setMatches(newMatches);
    setScoreByMatch({});
    setSelectedRound(1);

    try {
      const cupRef = doc(db, 'cupBrackets', 'presidents-cup');
      await updateDoc(cupRef, {
        teamCount: sanitizedTeams.length,
        teams: sanitizedTeams,
        matches: newMatches,
        updatedAt: serverTimestamp(),
      });
      setCupError(null);
    } catch (error) {
      console.error('Error saving teams:', error);
      setCupError('Failed to save teams. Check Firestore permissions.');
    }
  };

  const handleScoreChange = (matchId, side, value) => {
    setScoreByMatch((prev) => ({
      ...prev,
      [`${matchId}-${side}`]: value,
    }));
  };

  const handleParticipantNameChange = (matchId, slotIndex, value) => {
    setMatches((prev) =>
      prev.map((match) => {
        if (match.id !== matchId) return match;
        const participantA = match.participants?.[0] ?? { id: `custom-${matchId}-0`, name: '' };
        const participantB = match.participants?.[1] ?? { id: `custom-${matchId}-1`, name: '' };
        const nextParticipants = [participantA, participantB];

        nextParticipants[slotIndex] = {
          id: nextParticipants[slotIndex]?.id || `custom-${matchId}-${slotIndex}`,
          name: value,
          resultText: nextParticipants[slotIndex]?.resultText ?? null,
          isWinner: nextParticipants[slotIndex]?.isWinner ?? false,
          status: nextParticipants[slotIndex]?.status ?? null,
        };

        return {
          ...match,
          participants: nextParticipants,
        };
      })
    );
  };

  const saveMatchUpdate = async (matchId) => {
    setSavingMatchId(matchId);
    const updated = matches.map((match) => ({
      ...match,
      participants: match.participants ? [...match.participants] : [],
    }));

    const match = updated.find((m) => m.id === matchId);
    if (!match || !match.participants || match.participants.length < 2) {
      setSavingMatchId(null);
      return;
    }

    const scoreA = Number.parseInt(scoreByMatch[`${matchId}-a`], 10);
    const scoreB = Number.parseInt(scoreByMatch[`${matchId}-b`], 10);
    if (Number.isFinite(scoreA) && Number.isFinite(scoreB) && scoreA !== scoreB) {
      const winnerIndex = scoreA > scoreB ? 0 : 1;
      match.participants = match.participants.map((participant, index) => ({
        ...participant,
        resultText: index === 0 ? String(scoreA) : String(scoreB),
        isWinner: index === winnerIndex,
        status: 'PLAYED',
      }));
      match.state = 'SCORE_DONE';

      if (match.nextMatchId) {
        const nextMatch = updated.find((m) => m.id === match.nextMatchId);
        if (nextMatch) {
          const slotIndex = match.roundIndex % 2;
          const winner = match.participants[winnerIndex];
          const nextParticipants = [
            nextMatch.participants?.[0] ?? { id: `tbd-${nextMatch.id}-0`, name: 'TBD' },
            nextMatch.participants?.[1] ?? { id: `tbd-${nextMatch.id}-1`, name: 'TBD' },
          ];

          nextParticipants[slotIndex] = {
            id: winner.id,
            name: winner.name,
            picture: winner.picture ?? null,
            resultText: null,
            isWinner: false,
            status: null,
          };

          nextMatch.participants = nextParticipants;
        }
      }
    }

    setMatches(updated);
    try {
      const cupRef = doc(db, 'cupBrackets', 'presidents-cup');
      await updateDoc(cupRef, {
        matches: updated,
        updatedAt: serverTimestamp(),
      });
      setCupError(null);
      setSavedMatchId(matchId);
      setTimeout(() => setSavedMatchId((prev) => (prev === matchId ? null : prev)), 2000);
    } catch (error) {
      console.error('Error saving scores:', error);
      setCupError('Failed to save scores. Check Firestore permissions.');
    } finally {
      setSavingMatchId((prev) => (prev === matchId ? null : prev));
    }
  };

  const maxRound = useMemo(() => {
    if (matches.length === 0) return 1;
    return Math.max(...matches.map((match) => match.round ?? Number(match.tournamentRoundText) ?? 1));
  }, [matches]);

  const rounds = useMemo(
    () => Array.from({ length: maxRound }, (_, index) => index + 1),
    [maxRound]
  );

  const roundMatches = useMemo(
    () => matches.filter((match) => (match.round ?? Number(match.tournamentRoundText)) === selectedRound),
    [matches, selectedRound]
  );

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#0B0D13',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container>
          <Typography color="white">Loading...</Typography>
        </Container>
      </Box>
    );
  }

  if (!currentUser || !isAdmin) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#0B0D13',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container>
          <Alert severity="error">Admin access required.</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0B0D13' }}>
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Stack spacing={3}>
          <Typography variant="h4" fontWeight={800} color="white">
            Cup Admin Settings
          </Typography>
          {cupError && <Alert severity="error">{cupError}</Alert>}

        <Paper sx={{ p: 3, backgroundColor: 'rgba(15, 18, 28, 0.9)' }}>
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <FormControl sx={{ minWidth: 200 }} size="small">
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Teams</InputLabel>
                <Select value={teamCount} label="Teams" onChange={handleTeamCountChange} sx={selectSx}>
                  <MenuItem value={8}>8 teams</MenuItem>
                  <MenuItem value={16}>16 teams</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                onClick={handleSaveTeams}
                sx={{ backgroundColor: appTheme.colors.secondary }}
              >
                Save Teams
              </Button>
            </Stack>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
            <Stack spacing={2}>
              {teams.map((team, index) => (
                <TextField
                  key={team.id}
                  label={`Team ${index + 1}`}
                  value={team.name}
                  onChange={(event) => handleTeamNameChange(index, event.target.value)}
                  size="small"
                  sx={textFieldSx}
                />
              ))}
            </Stack>
          </Stack>
        </Paper>

        <Paper sx={{ p: 3, backgroundColor: 'rgba(15, 18, 28, 0.9)' }}>
          <Stack spacing={2}>
            <Typography color="white" fontWeight={700} variant="h6">
              Bracket Management
            </Typography>
            <Tabs
              value={selectedRound}
              onChange={(event, value) => setSelectedRound(value)}
              textColor="inherit"
              indicatorColor="secondary"
              variant="scrollable"
              sx={{
                '& .MuiTab-root': { color: 'rgba(255,255,255,0.6)' },
                '& .Mui-selected': { color: '#FFD700' },
              }}
            >
              {rounds.map((round) => (
                <Tab key={round} value={round} label={`Round ${round}`} />
              ))}
            </Tabs>
            <Stack spacing={1.5}>
              {roundMatches.map((match) => {
                const teamA = match.participants?.[0];
                const teamB = match.participants?.[1];
                const scoreA =
                  scoreByMatch[`${match.id}-a`] ?? match.participants?.[0]?.resultText ?? '';
                const scoreB =
                  scoreByMatch[`${match.id}-b`] ?? match.participants?.[1]?.resultText ?? '';
                const hasTeamNames = Boolean(teamA?.name && teamB?.name);
                const hasScores = scoreA !== '' && scoreB !== '';
                const scoresDifferent = scoreA !== scoreB;
                const canSubmit = hasTeamNames && hasScores && scoresDifferent;
                const isSaving = savingMatchId === match.id;
                const isSaved = savedMatchId === match.id;

                return (
                  <Paper
                    key={match.id}
                    sx={{
                      p: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    <Stack spacing={1.5}>
                      <Typography color="white" fontWeight={600} variant="subtitle1">
                        {match.name}
                      </Typography>
                      <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={2}
                        alignItems={{ xs: 'stretch', md: 'center' }}
                      >
                          <TextField
                            size="small"
                            label="Team A"
                            value={teamA?.name ?? ''}
                            onChange={(event) =>
                              handleParticipantNameChange(match.id, 0, event.target.value)
                            }
                            sx={{ ...textFieldSx, minWidth: 200 }}
                          />
                        <TextField
                          size="small"
                          type="number"
                          value={scoreA}
                          onChange={(event) => handleScoreChange(match.id, 'a', event.target.value)}
                          inputProps={{ min: 0 }}
                          sx={{ ...textFieldSx, maxWidth: 120 }}
                        />
                        <Typography color="rgba(255,255,255,0.6)">vs</Typography>
                        <TextField
                          size="small"
                          type="number"
                          value={scoreB}
                          onChange={(event) => handleScoreChange(match.id, 'b', event.target.value)}
                          inputProps={{ min: 0 }}
                          sx={{ ...textFieldSx, maxWidth: 120 }}
                        />
                          <TextField
                            size="small"
                            label="Team B"
                            value={teamB?.name ?? ''}
                            onChange={(event) =>
                              handleParticipantNameChange(match.id, 1, event.target.value)
                            }
                            sx={{ ...textFieldSx, minWidth: 200 }}
                          />
                        <Button
                          variant="contained"
                            onClick={() => saveMatchUpdate(match.id)}
                            disabled={!canSubmit || isSaving}
                          sx={{
                            backgroundColor: isSaved || isSaving ? '#1E88E5' : appTheme.colors.secondary,
                            '&:hover': {
                              backgroundColor: isSaved || isSaving ? '#1565C0' : appTheme.colors.secondaryDark,
                            },
                          }}
                          startIcon={isSaving ? <CircularProgress size={16} sx={{ color: '#FFFFFF' }} /> : null}
                        >
                            {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save Match'}
                        </Button>
                      </Stack>
                        {canSubmit ? null : (
                          <Typography color="rgba(255,255,255,0.55)" variant="caption">
                            Enter both team names and non-tied scores to save and auto-advance the winner.
                          </Typography>
                        )}
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          </Stack>
        </Paper>
        </Stack>
      </Container>
    </Box>
  );
};

export default AdminCupManagementPage;
