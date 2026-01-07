


// Core imports (keep these)
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

// Heavy imports (replace these with lightweight versions)
import Stack from '@mui/material/Stack';          
import CardContent from '@mui/material/CardContent'; 
import CardMedia from '@mui/material/CardMedia';   
import Menu from '@mui/material/Menu';             
import MenuItem from '@mui/material/MenuItem';     

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import qs from 'qs';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { queryParams_dfa_teams } from '../../modules/DFA/QueryParams';
import AllTeamsDataStructure from '../../components/DFAPage/AllTeamsPage/AllTeamsDataStructure';
import NavBar from '../../components/homePage/NavBar';
import Footer from '../../components/Footer/Footer';
import theme from '../../css/theme';

const AllTeamsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState('DFA_Premier_League_Men');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (choice) => {
    setSelectedChoice(choice);
    handleClose();
  };

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

  const getLeagueName = (choice) => {
    const leagueNames = {
      'DFA_Premier_League_Men': 'Premier League',
      'DFA_Division_One': 'Division One',
      'DFA_Women': 'Women Division'
    };
    return leagueNames[choice] || choice;
  };

  const filteredData = data?.filter(team => team.League === selectedChoice) || [];

  return (
    <>
      <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center" minHeight="100vh">
        <NavBar />
        
        <Box width={{ xs: '100%', sm: 800, md: 900 }} px={2} py={4}>
          <Box marginTop={4} display="flex" justifyContent="center">
            <Button
              variant="contained"
              size="large"
              aria-controls="league-menu"
              aria-haspopup="true"
              onClick={handleClick}
              endIcon={<KeyboardArrowDownIcon style={{ color: 'white' }} />}
              sx={{ backgroundColor: `var(--color-color1, ${theme.colors.color1})` }}
            >
              {getLeagueName(selectedChoice)}
            </Button>
            
            <Menu
              id="league-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <MenuItem onClick={() => handleMenuItemClick('DFA_Premier_League_Men')}>
                Premier League
              </MenuItem>
              <MenuItem onClick={() => handleMenuItemClick('DFA_Division_One')}>
                Division One
              </MenuItem>
              <MenuItem onClick={() => handleMenuItemClick('DFA_Women')}>
                Women Division
              </MenuItem>
            </Menu>
          </Box>

          <Box marginTop={3}>
            {loading ? (
              <Grid container spacing={{ xs: 1, md: 2 }} justifyContent="center">
                {[...Array(6)].map((_, idx) => (
                  <Grid key={idx} item xs={6} sm={6} md={4}>
                    <Card sx={{ height: { xs: 250, md: 270 } }}>
                      <Stack direction="column">
                        <CardMedia
                          component="div"
                          sx={{
                            height: 200,
                            backgroundColor: 'grey.300',
                          }}
                        />
                        <CardContent>
                          <Typography textAlign="center" sx={{ fontWeight: 900 }}>
                            Loading...
                          </Typography>
                        </CardContent>
                      </Stack>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : error ? (
              <Box textAlign="center" py={4}>
                <Typography color="error" variant="h6">
                  Error loading teams: {error}
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => window.location.reload()}
                  sx={{ mt: 2 }}
                >
                  Retry
                </Button>
              </Box>
            ) : filteredData.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography variant="h6">
                  No teams found for {getLeagueName(selectedChoice)}
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={{ xs: 1, md: 2 }} justifyContent="center">
                {filteredData.map((item) => (
                  <Grid key={item.ID} item xs={6} sm={6} md={4}>
                    <Link
                      to={`/DFA/Home/Team/${item.ID}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Card 
                        sx={{ 
                          height: { xs: 250, md: 270 },
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: 6
                          }
                        }}
                      >
                        <Stack direction="column" height="100%">
                          <CardMedia
                            component="img"
                            height="200"
                            image={item.team_crest}
                            alt={`${item.Team} crest`}
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
                                fontSize: { xs: '0.9rem', sm: '1rem' }
                              }}
                            >
                              {item.Team}
                            </Typography>
                          </CardContent>
                        </Stack>
                      </Card>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>
        
        {/* <Footer /> */}
      </Box>
    </>
  );
};

export default AllTeamsPage;