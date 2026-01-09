


// Core imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';          
import CardContent from '@mui/material/CardContent'; 
import CardMedia from '@mui/material/CardMedia';
import Tab from '@mui/material/Tab';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';

import qs from 'qs';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo, useCallback, memo } from 'react';

import { queryParams_dfa_teams } from '../../modules/DFA/QueryParams';
import AllTeamsDataStructure from '../../components/DFAPage/AllTeamsPage/AllTeamsDataStructure';
import Footer from '../../components/Footer/Footer';
import theme from '../../css/theme';

// Constants
const LEAGUE_OPTIONS = [
  { key: 'DFA_Premier_League_Men', label: 'Premier League' },
  { key: 'DFA_Division_One', label: 'Division One' },
  { key: 'DFA_Women', label: 'Women Division' }
];

const SKELETON_COUNT = 6;
const GRID_SPACING = { xs: 1, md: 2 };
const CARD_HEIGHT = { xs: 250, md: 270 };
const CARD_CREST_HEIGHT = 200;

// Memoized TeamCard Component
const TeamCard = memo(({ team }) => (
  <Link
    to={`/DFA/Home/Team/${team.ID}`}
    style={{ textDecoration: 'none' }}
    aria-label={`View ${team.Team} team details`}
  >
    <Card 
      sx={{ 
        height: CARD_HEIGHT,
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        backgroundColor: `rgba(34, 38, 41, 0.95)`,
        border: `1px solid rgba(${theme.colors.secondary}, 0.2)`,
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 12px 40px rgba(${theme.colors.secondary}, 0.25)`,
          borderColor: theme.colors.secondary,
          backgroundColor: 'rgba(34, 38, 41, 1)'
        }
      }}
    >
      <Stack direction="column" height="100%">
        <CardMedia
          component="img"
          height={CARD_CREST_HEIGHT}
          image={team.team_crest}
          alt={`${team.Team} crest`}
          sx={{ 
            objectFit: 'contain',
            p: 2,
            backgroundColor: 'white'
          }}
        />
        <CardContent sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Typography
            textAlign="center"
            sx={{ 
              fontWeight: 900,
              width: '100%',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              color: 'white'
            }}
          >
            {team.Team}
          </Typography>
        </CardContent>
      </Stack>
    </Card>
  </Link>
));

TeamCard.displayName = 'TeamCard';

// Memoized SkeletonCard Component
const SkeletonCard = memo(() => (
  <Card sx={{ height: CARD_HEIGHT, backgroundColor: 'rgba(34, 38, 41, 0.95)' }}>
    <Stack direction="column" height="100%">
      <Skeleton 
        variant="rectangular" 
        height={CARD_CREST_HEIGHT}
        sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <Skeleton 
          variant="text" 
          width="80%" 
          height={30}
          sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', mx: 'auto' }}
        />
      </CardContent>
    </Stack>
  </Card>
));

SkeletonCard.displayName = 'SkeletonCard';

const AllTeamsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLeague, setSelectedLeague] = useState('DFA_Premier_League_Men');

  // Fetch team data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const queryString = qs.stringify(queryParams_dfa_teams);
        const apiUrl = `https://strapi-dominica-sport.onrender.com/api/dfa-teams?${queryString}`;
        
        const response = await axios.get(apiUrl);
        
        if (response.status !== 200) {
          throw new Error(`Error: ${response.statusText}`);
        }
        
        const result = response.data.data;
        const finalData = AllTeamsDataStructure(result);
        setData(finalData);
      } catch (error) {
        console.error('Error fetching teams data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Memoized league name getter
  const getLeagueName = useCallback((leagueKey) => {
    const league = LEAGUE_OPTIONS.find(opt => opt.key === leagueKey);
    return league?.label || leagueKey;
  }, []);

  // Handle league change
  const handleLeagueChange = useCallback((event, newValue) => {
    setSelectedLeague(newValue);
  }, []);

  // Memoized filtered data
  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.filter(team => team.League === selectedLeague);
  }, [data, selectedLeague]);

  // Render content based on state
  const renderContent = useCallback(() => {
    if (loading) {
      return (
        <Grid container spacing={GRID_SPACING} justifyContent="center">
          {Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
            <Grid key={idx} item xs={6} sm={6} md={4}>
              <SkeletonCard />
            </Grid>
          ))}
        </Grid>
      );
    }

    if (error) {
      return (
        <Box textAlign="center" py={4}>
          <Typography color="error" variant="h6" sx={{ mb: 2 }}>
            Error loading teams: {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ backgroundColor: theme.colors.color1 }}
          >
            Retry
          </Button>
        </Box>
      );
    }

    if (filteredData.length === 0) {
      const isWomenLeague = selectedLeague === 'DFA_Women';
      return (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" sx={{ color: theme.colors.lightGray, mb: 2 }}>
            {isWomenLeague 
              ? "Women's teams will be updated at a later date" 
              : `No teams found for ${getLeagueName(selectedLeague)}`}
          </Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={GRID_SPACING} justifyContent="center">
        {filteredData.map((team) => (
          <Grid key={team.ID} item xs={6} sm={6} md={4}>
            <TeamCard team={team} />
          </Grid>
        ))}
      </Grid>
    );
  }, [loading, error, filteredData, selectedLeague, getLeagueName]);

  return (
    <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center" minHeight="100vh">
      <Box width={{ xs: '100%', sm: 800, md: 900 }} px={2} py={4}>
        <Box marginTop={4}>
          <Typography
            variant="h4"
            sx={{
              color: 'black',
              fontWeight: 700,
              textAlign: 'center',
              mb: 3
            }}
          >
            Teams
          </Typography>

          {/* League Tabs */}
          <TabContext value={selectedLeague}>
            <TabList
              onChange={handleLeagueChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="league selection"
              sx={{
                mb: 3,
                borderBottom: 1,
                borderColor: 'divider',
                display: 'flex',
                justifyContent: { xs: 'flex-start', sm: 'center' },
                position: 'sticky',
                top: 0,
                zIndex: 10,
                '& .MuiTabScrollButtonForward, & .MuiTabScrollButtonBack': {
                  display: { xs: 'flex', sm: 'none' }
                },
                '& .MuiTab-root': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  minWidth: { xs: 'auto', sm: '140px' },
                  padding: { xs: '8px 6px', sm: '12px 16px' },
                  color: 'black',
                  '&.Mui-selected': {
                    color: 'black',
                    fontWeight: 700
                  }
                }
              }}
            >
              {LEAGUE_OPTIONS.map(league => (
                <Tab 
                  key={league.key}
                  label={league.label} 
                  value={league.key}
                  aria-label={`Filter by ${league.label}`}
                />
              ))}
            </TabList>

            {LEAGUE_OPTIONS.map(league => (
              <TabPanel key={league.key} value={league.key} sx={{ p: 0 }}>
                <Box marginTop={2} minHeight={600}>
                  {renderContent()}
                </Box>
              </TabPanel>
            ))}
          </TabContext>
        </Box>
      </Box>
    </Box>
  );
};

export default memo(AllTeamsPage);