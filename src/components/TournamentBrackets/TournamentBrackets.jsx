import { useEffect, useMemo, useState } from 'react';

// import '../../css/TournamentRounds.css'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import { Stack } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ShieldIcon from '@mui/icons-material/Shield';
import FlagIcon from '@mui/icons-material/Flag';
import appTheme from '../../css/theme';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

const roundLabelMap = {
  1: 'Quarterfinals',
  2: 'Semifinals',
  3: 'Final',
  4: 'Round of 16',
};

const getRoundLabel = (match) => {
  const round = match?.round ?? Number(match?.tournamentRoundText) ?? null;
  if (!round) return 'Round';
  return roundLabelMap[round] || `Round ${round}`;
};


const FifaMatch = ({ match, topParty, bottomParty, onMatchClick }) => {
  const getPartyName = (party) =>
    party?.name || party?.team?.name || party?.participant?.name || 'TBD';
  const getPartyScore = (party) => party?.resultText ?? party?.score ?? '';

  const renderRow = (party) => {
    const isWinner = party?.isWinner;
    return (
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 1.1,
          py: 0.6,
          borderRadius: 1,
          backgroundColor: isWinner ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255,255,255,0.06)',
          transition: 'background-color 0.2s ease',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {isWinner ? (
            <EmojiEventsIcon sx={{ color: '#FFD700', fontSize: 18 }} />
          ) : (
            <SportsSoccerIcon sx={{ color: 'rgba(255,255,255,0.75)', fontSize: 18 }} />
          )}
          <Typography
            variant="caption"
            sx={{
              color: '#FFFFFF',
              fontWeight: isWinner ? 700 : 500,
              fontFamily: '"Poppins", "Inter", "Roboto", sans-serif',
            }}
          >
            {getPartyName(party)}
          </Typography>
        </Stack>
        <Typography
          variant="caption"
          sx={{
            color: isWinner ? '#FFD700' : 'rgba(255,255,255,0.9)',
            fontWeight: 700,
            fontFamily: '"Poppins", "Inter", "Roboto", sans-serif',
          }}
        >
          {getPartyScore(party)}
        </Typography>
      </Stack>
    );
  };

  return (
    <Paper
      elevation={4}
      onClick={() => onMatchClick?.(match)}
      sx={{
        width: 220,
        height: 'auto',
        background: 'linear-gradient(135deg, rgba(20,24,38,0.98), rgba(10,12,20,0.98))',
        border: `1px solid ${appTheme.colors.secondary}`,
        borderRadius: 2.2,
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(0,0,0,0.35)',
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 14px 30px rgba(0,0,0,0.45)',
          borderColor: '#FFD700',
        },
        '@keyframes liveGlow': {
          '0%': { boxShadow: '0 0 0 rgba(41,182,246,0.0)' },
          '50%': { boxShadow: '0 0 20px rgba(41,182,246,0.4)' },
          '100%': { boxShadow: '0 0 0 rgba(41,182,246,0.0)' },
        },
      }}
    >
      <Stack spacing={0.6} sx={{ p: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <ShieldIcon sx={{ color: appTheme.colors.secondary, fontSize: 18 }} />
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                fontFamily: '"Poppins", "Inter", "Roboto", sans-serif',
                fontWeight: 700,
              }}
            >
              {getRoundLabel(match)}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <FlagIcon sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 16 }} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              {match?.name || 'Match'}
            </Typography>
          </Stack>
        </Stack>
        {renderRow(topParty ?? match?.participants?.[0])}
        {renderRow(bottomParty ?? match?.participants?.[1])}
      </Stack>
    </Paper>
  );
};

const TournamentBrackets = () => {






  


  // const GlootTheme = createTheme({
  //   textColor: { main: "#000000", highlighted: "#F4F2FE", dark: "#707582" },

  //   matchBackground: { wonColor: "#2D2D59", lostColor: "#1B1D2D" },

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

  // Use 8 or 16 teams. Trim this list to 8 to render a smaller bracket.
  const initialTeams = [
    { id: 'team-1', name: 'TBD' },
    { id: 'team-2', name: 'TBD' },
    { id: 'team-3', name: 'TBD' },
    { id: 'team-4', name: 'TBD' },
    { id: 'team-5', name: 'TBD' },
    { id: 'team-6', name: 'TBD' },
    { id: 'team-7', name: 'TBD' },
    { id: 'team-8', name: 'TBD' },
    { id: 'team-9', name: 'TBD' },
    { id: 'team-10', name: 'TBD' },
    { id: 'team-11', name: 'TBD' },
    { id: 'team-12', name: 'TBD' },
    { id: 'team-13', name: 'TBD' },
    { id: 'team-14', name: 'TBD' },
    { id: 'team-15', name: 'TBD' },
    { id: 'team-16', name: 'TBD' },
  ];

  const [matches, setMatches] = useState(() => buildSingleElimMatches(initialTeams));
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const rounds = useMemo(() => {
    const grouped = matches.reduce((acc, match) => {
      const round = match.round ?? Number(match.tournamentRoundText) ?? 1;
      if (!acc[round]) acc[round] = [];
      acc[round].push(match);
      return acc;
    }, {});

    return Object.keys(grouped)
      .map(Number)
      .sort((a, b) => a - b)
      .map((round) => ({
        round,
        label: roundLabelMap[round] || `Round ${round}`,
        matches: grouped[round].sort((a, b) => (a.roundIndex ?? 0) - (b.roundIndex ?? 0)),
      }));
  }, [matches]);

  const roundColumns = useMemo(() => {
    if (rounds.length <= 1) return { left: [], right: [], final: rounds[0] || null };
    const finalRound = rounds[rounds.length - 1];
    const sideRounds = rounds.slice(0, -1).map((round) => {
      const half = Math.floor(round.matches.length / 2);
      return {
        ...round,
        leftMatches: round.matches.slice(0, half),
        rightMatches: round.matches.slice(half),
      };
    });
    return {
      left: sideRounds,
      right: [...sideRounds].reverse(),
      final: finalRound,
    };
  }, [rounds]);


  const handleHorizontalWheel = (event) => {
    if (event.shiftKey) return;
    const container = event.currentTarget;
    const delta = event.deltaY || event.deltaX;
    if (delta) {
      container.scrollLeft += delta;
    }
  };

  useEffect(() => {
    const cupRef = doc(db, 'cupBrackets', 'presidents-cup');
    const unsubscribe = onSnapshot(
      cupRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (Array.isArray(data?.matches) && data.matches.length > 0) {
            setMatches(data.matches);
          }
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error loading cup bracket:', error);
        setLoadError('Unable to load the cup bracket from Firebase. Showing local fallback.');
        setMatches(buildSingleElimMatches(initialTeams));
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);
  

  // const roundOneMatches = tournamentBracket.filter(
  //   (match) => parseInt(match.tournamentRoundText, 10) === 1
  // );
  return (

    <Box
      minHeight="100vh"
      sx={{
        backgroundImage: `linear-gradient(180deg, rgba(11, 13, 19, 0.95) 0%, rgba(11, 13, 19, 0.85) 60%, rgba(11, 13, 19, 0.95) 100%), url("https://cdn.britannica.com/69/228369-050-0B18A1F6/Asian-Cup-Final-2019-Hasan-Al-Haydos-Qatar-Japan-Takumi-Minamino.jpg")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: { xs: 'scroll', md: 'fixed' }
      }}
    >
      <Container maxWidth="xl" sx={{ pt: { xs: 6, md: 8 }, pb: { xs: 8, md: 10 } }}>
        <Stack spacing={2} alignItems="center" textAlign="center">
          <Typography color="white" fontWeight={900} variant="h3">
            President&apos;s Cup
          </Typography>
          <Typography color="rgba(255,255,255,0.75)" maxWidth={720}>
            Follow every round in one place. Scroll horizontally on mobile or drag to explore the full bracket.
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
            <Chip label="Single Elimination" sx={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'white' }} />
            <Chip label="Live Updates" sx={{ backgroundColor: 'rgba(255,107,0,0.2)', color: '#FFD700' }} />
            <Chip label="Tap a match" sx={{ backgroundColor: 'rgba(134,194,50,0.2)', color: '#A5D6A7' }} />
          </Stack>
        </Stack>

        <Paper
          elevation={6}
          sx={{
            mt: { xs: 4, md: 6 },
            p: { xs: 2, md: 3 },
            backgroundColor: 'rgba(15, 18, 28, 0.9)',
            borderRadius: 3,
            border: `1px solid rgba(255, 107, 0, 0.35)`,
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)'
          }}
        >
          <Stack spacing={2}>
            {loading && (
              <Alert severity="info">Loading cup bracket...</Alert>
            )}
            {loadError && (
              <Alert severity="error">{loadError}</Alert>
            )}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
              <Typography color="white" fontWeight={700} variant="h6">
                Tournament Bracket
              </Typography>
              <Typography color="rgba(255,255,255,0.6)" variant="body2">
                Scroll to view all rounds
              </Typography>
            </Stack>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

            <Box
              sx={{
                width: '100%',
                overflowX: 'auto',
                overflowY: 'auto',
                pb: 4,
                pt: 1,
                overscrollBehavior: 'contain'
              }}
              onWheel={handleHorizontalWheel}
            >
              <Stack
                direction="row"
                spacing={4}
                alignItems="center"
                sx={{
                  minWidth: { xs: 380, sm: 500 },
                  width: 'max-content',
                  px: { xs: 1, sm: 2 },
                  display: { xs: 'none', md: 'flex' },
                }}
              >
                <Stack direction="row" spacing={4} alignItems="center">
                  {roundColumns.left.map((roundData) => (
                    <Stack
                      key={roundData.round}
                      spacing={2}
                      sx={{ minWidth: 260 }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <ShieldIcon sx={{ color: appTheme.colors.secondary, fontSize: 18 }} />
                        <Typography
                          color="rgba(255,255,255,0.85)"
                          fontWeight={700}
                          variant="subtitle2"
                        >
                          {roundData.label}
                        </Typography>
                      </Stack>
                      {roundData.leftMatches.map((match) => (
                        <FifaMatch key={match.id} match={match} />
                      ))}
                    </Stack>
                  ))}
                </Stack>

                {roundColumns.final && (
                  <Stack spacing={2} alignItems="center" sx={{ minWidth: 260 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ShieldIcon sx={{ color: appTheme.colors.secondary, fontSize: 20 }} />
                      <Typography
                        color="rgba(255,255,255,0.9)"
                        fontWeight={800}
                        variant="subtitle1"
                      >
                        {roundColumns.final.label}
                      </Typography>
                    </Stack>
                    {roundColumns.final.matches.map((match) => (
                      <FifaMatch key={match.id} match={match} />
                    ))}
                  </Stack>
                )}

                <Stack direction="row" spacing={4} alignItems="center">
                  {roundColumns.right.map((roundData) => (
                    <Stack
                      key={`right-${roundData.round}`}
                      spacing={2}
                      sx={{ minWidth: 260 }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                        <Typography
                          color="rgba(255,255,255,0.85)"
                          fontWeight={700}
                          variant="subtitle2"
                        >
                          {roundData.label}
                        </Typography>
                        <ShieldIcon sx={{ color: appTheme.colors.secondary, fontSize: 18 }} />
                      </Stack>
                      {roundData.rightMatches.map((match) => (
                        <FifaMatch key={match.id} match={match} />
                      ))}
                    </Stack>
                  ))}
                </Stack>
              </Stack>

              <Stack
                direction="row"
                spacing={4}
                sx={{
                  minWidth: { xs: 380, sm: 500 },
                  width: 'max-content',
                  px: { xs: 1, sm: 2 },
                  display: { xs: 'flex', md: 'none' },
                }}
              >
                {rounds.map((roundData) => (
                  <Stack
                    key={roundData.round}
                    spacing={2}
                    sx={{ minWidth: 260 }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ShieldIcon sx={{ color: appTheme.colors.secondary, fontSize: 18 }} />
                      <Typography
                        color="rgba(255,255,255,0.85)"
                        fontWeight={700}
                        variant="subtitle2"
                      >
                        {roundData.label}
                      </Typography>
                    </Stack>
                    {roundData.matches.map((match) => (
                      <FifaMatch key={match.id} match={match} />
                    ))}
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>



  )
}

export default TournamentBrackets