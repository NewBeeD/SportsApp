import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';

import Tab from '@mui/material/Tab';

import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { TabContext, TabList, TabPanel } from "@mui/lab";

import { useState, useEffect } from 'react';

import qs from 'qs'
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';

import theme from '../../css/theme';

import { queryParams_prem_players_stats } from '../../modules/DFA/QueryParams';

import StatsPageStructureData from '../../modules/DFA/StatsPage/StatsPageStructureData';
import LightweightTable from '../../components/LightweightTable';

function Sort(a, b){

  return b.Goals - a.Goals
}

function Sort_Assists(a, b){

  return b.Assists - a.Assists
}

function Sort_YellowCards(a, b){

  return b.Yellow_Cards - a.Yellow_Cards
}

function Sort_RedCards(a, b){

  return b.Red_Cards - a.Red_Cards
}

function Sort_Clean_Sheets(a, b){

  return b.Clean_Sheets - a.Clean_Sheets
}


const StatsPage = () => {

  const [players_Goals_data, setPlayers_Goals_data] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate()

  // const [players_Assists_data, setPlayers_Assists_data] = useState(null);
  // const [loading_assist, setLoading_Assits] = useState(true);
  // const [error_assists, setError_Assists] = useState(null);


  const [currentSeason, setCurrentSeason] = useState(null)

  // Menu Lists
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState('Goals');

  // League and Tab state
  const [leagueValue, setLeagueValue] = useState('1');

  const handleLeagueChange = (event, newValue) => {
    setLeagueValue(newValue);
  };

  const getLeagueFilter = () => {
    switch(leagueValue) {
      case '1':
        return 'DFA_Premier_League_Men';
      case '2':
        return 'DFA_Division_One';
      case '3':
        return 'DFA_Women';
      default:
        return 'DFA_Premier_League_Men';
    }
  };

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
  // End of menu list



  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Goals fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Set loading to true when starting the fetch
        setLoading(true);

        const queryString = qs.stringify(queryParams_prem_players_stats);

        // Your API endpoint URL
        const apiUrl = `https://strapi-dominica-sport.onrender.com/api/player-stats?${queryString}`;
  

        // Make the fetch request
        const response = await axios.get(apiUrl);

        // Check if the request was successful (status code 2xx)
        if (response.status !== 200) {
          throw new Error(`Error: ${response.statusText}`);
        }

        // Parse the JSON data
        const result = await response.data.data;

        console.log(result);
        

        let final_data = StatsPageStructureData(result)
        final_data = final_data.map(goals => goals).sort(Sort)
        

        setCurrentSeason(final_data[0].Season.substring(1).replace('-', '/'))
        
        // Set the data state
        setPlayers_Goals_data(final_data);
      } catch (error) {
        // Set the error state if there's an issue
        setError(error.message);
      } finally {
        // Set loading to false regardless of success or failure
        setLoading(false);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, []);

  





  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px)' }}>
      <Box width={{ sm: 900 }} margin='auto' flex={1}>
        <Box marginTop={{ sm: 10 }}>
          <Typography variant='h2' fontWeight={900} textAlign='center'>Stats Centre</Typography>
        </Box>

        

        <Box marginTop={{ sm: 7}} height='100%'>

          <TabContext value={value}>
          
            <TabList onChange={handleChange} aria-label="tabs example" centered>
                      <Tab label='Player Stats' value='1' />
                      <Tab label='Club Stats' value='2' />
            </TabList>

            <TabPanel  value='1'>
              <Box marginTop={3}>

                {/* League Selection Tabs */}
                <TabContext value={leagueValue}>
                  <TabList 
                    onChange={handleLeagueChange} 
                    aria-label="league tabs" 
                    centered 
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ 
                      borderBottom: 1, 
                      borderColor: 'divider', 
                      mb: 3,
                      display: 'flex',
                      justifyContent: { xs: 'flex-start', sm: 'center' },
                      '& .MuiTabScrollButtonForward, & .MuiTabScrollButtonBack': {
                        display: { xs: 'flex', sm: 'none' }
                      },
                      '& .MuiTab-root': {
                        fontSize: { xs: '0.7rem', sm: '0.875rem' },
                        minWidth: { xs: 'auto', sm: '120px' },
                        padding: { xs: '8px 6px', sm: '12px 16px' }
                      }
                    }}
                  >
                    <Tab label='Premier League' value='1' />
                    <Tab label='Division One' value='2' />
                    <Tab label='Women League' value='3' />
                  </TabList>
                </TabContext>

                <Stack direction='row' justifyContent='space-between'>

                  <Button variant='contained' size='large' aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} endIcon={<KeyboardArrowDownIcon style={{ color: 'white'}} />} sx={{ backgroundColor: `var(--color-color1, ${theme.colors.color1})`, width: {sm: 200} }}>
                  {selectedChoice}
                  </Button>

                  {/* <Box>
                    <Button size='large' variant='contained' onClick={()=> navigate('/DFA/DivisionOneStats')}>
                      Divison One
                    </Button>
                  </Box> */}

                </Stack>


                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => handleMenuItemClick("Goals")}>Goals</MenuItem>
                  <MenuItem onClick={() => handleMenuItemClick("Assists")}>Assists</MenuItem>
                  <MenuItem onClick={() => handleMenuItemClick("Clean Sheets")}>Clean Sheets</MenuItem>
                  <MenuItem onClick={() => handleMenuItemClick("Yellow Cards")}>Yellow Cards</MenuItem>
                  <MenuItem onClick={() => handleMenuItemClick("Red Cards")}>Red Cards</MenuItem>
                </Menu>

                <Box marginTop={5}>

                  { selectedChoice === 'Goals'?  (
                      
                      <Box >

                        <TableContainer component={Paper} sx={{ marginTop: {xs: 1}}} >

                          <Table >

                            <TableHead >
                              <TableRow>
                                {/* <TableCell sx={{ fontSize: {xs: 8}, fontWeight: 900}}>Pos</TableCell> */}
                                <TableCell sx={{ fontSize: {xs: 12}}}>Rank</TableCell>
                                <TableCell sx={{ fontSize: {xs: 12}, fontWeight: 900, paddingX: 0, textAlign: 'center'}}>Player</TableCell>
                                <TableCell align="center" sx={{ fontSize: {xs: 12}, fontWeight: 900, paddingX: 0}}>Club</TableCell>
                                <TableCell align="center" sx={{ fontSize: {xs: 12}, fontWeight: 900, paddingX: 0, paddingRight: {xs: 1, sm: 'inherit'}}}>Goals</TableCell>

                              </TableRow>
                            </TableHead>

                            <TableBody>

                              {players_Goals_data && players_Goals_data.sort(Sort).filter(playerGoals => playerGoals.Goals> 0 && playerGoals.league === getLeagueFilter()).map((item, idx) => {

                                return(



                                <TableRow key={idx} sx={{ border: 0}}>



                                  <TableCell sx={{ fontSize: {xs: 13}, paddingY: 0.5, fontWeight: 900, paddingLeft:2, textAlign: 'left'}}>
                                  {idx + 1}.
                                  </TableCell>
                                  

                                  <TableCell sx={{ fontSize: {xs: 13}, paddingY: 0.5, fontWeight: 'bold', paddingX:0, textAlign: 'center'}}>

                                    <Link to={`/DFA/Home/Player/${item.player_id}`} style={{ textDecoration: 'none', cursor: 'pointer'}}>
                                      {item.First_Name} {item.Last_Name}
                                    </Link>
                                  </TableCell>

                                  <TableCell align="center" sx={{ paddingX: 0, textAlign: 'center', fontSize: {xs: 13}}}>

                                    <Link to={`/DFA/Home/Team/${item.team_id}`} style={{ textDecoration: 'none', cursor: 'pointer', color: 'black', fontWeight: 900}}>
                                      {item.team}
                                    </Link>

                                  </TableCell>

                                  <TableCell align="center" sx={{ paddingX: 0, fontSize: {xs: 13}, fontWeight: 900}}>

                                    {item.Goals }

                                  </TableCell>
                                  
                                </TableRow>

                                )



                              })}

      
                            </TableBody>


                          </Table>

                        </TableContainer>



                      </Box>
                    ): selectedChoice === 'Assists'?  (
                      
                      <Box >

                        {/* <Typography>
                          Hopefully we can cover assists in the next upcoming season. Data this season was inconsistent and hard to come by. Hopefull we will develop a data collection system next season to properly cover a different aspect of the game. Assist are just as important as goals in determining a player's ability.
                        </Typography> */}

                        <TableContainer component={Paper} sx={{ marginTop: {xs: 1}}} >

                          <Table >

                            <TableHead >
                              <TableRow>

                                <TableCell sx={{ fontSize: {xs: 12}}}>Rank</TableCell>
                                <TableCell sx={{ fontSize: {xs: 12}, fontWeight: 900, paddingX: 0, textAlign: 'center'}}>Player</TableCell>
                                <TableCell align="center" sx={{ fontSize: {xs: 12}, fontWeight: 900, paddingX: 0}}>Club</TableCell>
                                <TableCell align="center" sx={{ fontSize: {xs: 12}, fontWeight: 900, paddingX: 0}}>Assists</TableCell>

                              </TableRow>
                            </TableHead>

                            <TableBody>

                              {players_Goals_data && players_Goals_data.sort(Sort_Assists).filter(playerGoals => playerGoals.Assists > 0 && playerGoals.league === getLeagueFilter()).map((item, idx) => {

                                return(


                                <TableRow key={idx} sx={{ border: 0}}>

                                  <TableCell sx={{ fontSize: {xs: 13}, paddingY: 0.5, fontWeight: 900, paddingLeft:2, textAlign: 'left'}}>
                                  {idx + 1}.
                                  </TableCell>

                                  <TableCell sx={{ fontSize: {xs: 13}, paddingY: 0.5, fontWeight: 'bold', paddingX:0, textAlign: 'center'}}>

                                    <Link to={`/DFA/Home/Player/${item.player_id}`} style={{ textDecoration: 'none', cursor: 'pointer'}}>
                                      {item.First_Name} {item.Last_Name}
                                    </Link>
                                  </TableCell>

                                  <TableCell align="center" sx={{ paddingX: 0, textAlign: 'center', fontSize: {xs: 13}}}>

                                    <Link to={`/DFA/Home/Team/${item.team_id}`} style={{ textDecoration: 'none', cursor: 'pointer', color: 'black', fontWeight: 900}}>
                                      {item.team}
                                    </Link>

                                  </TableCell>

                                  <TableCell align="center" sx={{ paddingX: 0, fontSize: {xs: 13}, fontWeight: 900}}>

                                    {item.Assists}

                                  </TableCell>
                                  
                                </TableRow>
                                )



                              })}

      
                            </TableBody>


                          </Table>

                        </TableContainer>



                      </Box>
                    ):selectedChoice === 'Clean Sheets'?  (
                      
                      <Box >

                        <TableContainer component={Paper} sx={{ marginTop: {xs: 1}}} >

                          <Table >

                            <TableHead >
                              <TableRow>
                                {/* <TableCell sx={{ fontSize: {xs: 8}, fontWeight: 900}}>Pos</TableCell> */}
                                <TableCell sx={{ fontSize: {sm: 12}}}>Rank</TableCell>
                                <TableCell sx={{ fontSize: {sm: 12}, fontWeight: 900, paddingX: 0, textAlign: 'center'}}>Player</TableCell>
                                <TableCell align="center" sx={{ fontSize: {sm: 12}, fontWeight: 900, paddingX: 0}}>Club</TableCell>
                                <TableCell align="center" sx={{ fontSize: {sm: 12}, fontWeight: 900, paddingX: 0}}>Clean Sheets</TableCell>

                              </TableRow>
                            </TableHead>

                            <TableBody>

                              {players_Goals_data && players_Goals_data.sort(Sort_Clean_Sheets).filter(playerGoals => playerGoals.Clean_Sheets> 0 && playerGoals.league === getLeagueFilter()).map((item, idx) => {

                                return(


                                <TableRow key={idx} sx={{ border: 0}}>

                                  <TableCell sx={{ fontSize: {xs: 13}, paddingY: 0.5, fontWeight: 900, paddingLeft:2, textAlign: 'left'}}>
                                  {idx + 1}.
                                  </TableCell>

                                  <TableCell sx={{ fontSize: {xs: 13}, paddingY: 0.5, fontWeight: 'bold', paddingX:0, textAlign: 'center'}}>

                                    <Link to={`/DFA/Home/Player/${item.player_id}`} style={{ textDecoration: 'none', cursor: 'pointer'}}>
                                      {item.First_Name} {item.Last_Name}
                                    </Link>
                                  </TableCell>

                                  <TableCell align="center" sx={{ paddingX: 0, textAlign: 'center', fontSize: {xs: 13}}}>

                                    <Link to={`/DFA/Home/Team/${item.team_id}`} style={{ textDecoration: 'none', cursor: 'pointer', color: 'black', fontWeight: 900}}>
                                      {item.team}
                                    </Link>

                                  </TableCell>

                                  <TableCell align="center" sx={{ paddingX: 0, fontSize: {xs: 13}, fontWeight: 900}}>

                                    {item.Clean_Sheets}

                                  </TableCell>
                                  
                                </TableRow>
                                )



                              })}

      
                            </TableBody>


                          </Table>

                        </TableContainer>



                      </Box>
                    ):selectedChoice === 'Yellow Cards'?  (
                      
                      <Box >

                        <TableContainer component={Paper} sx={{ marginTop: {xs: 1}}} >

                          <Table >

                            <TableHead >
                              <TableRow>
                                {/* <TableCell sx={{ fontSize: {xs: 8}, fontWeight: 900}}>Pos</TableCell> */}
                                <TableCell sx={{ fontSize: {sm: 12}}}>Rank</TableCell>
                                <TableCell sx={{ fontSize: {sm: 12}, fontWeight: 900, paddingX: 0, textAlign: 'center'}}>Player</TableCell>
                                <TableCell align="center" sx={{ fontSize: {sm: 12}, fontWeight: 900, paddingX: 0}}>Club</TableCell>
                                <TableCell align="center" sx={{ fontSize: {sm: 12}, fontWeight: 900, paddingX: 0}}>Cards</TableCell>

                              </TableRow>
                            </TableHead>

                            <TableBody>

                              {players_Goals_data && players_Goals_data.filter(playerGoals => playerGoals.Yellow_Cards > 0 && playerGoals.league === getLeagueFilter()).sort(Sort_YellowCards).map((item, idx) => {

                                return(


                                <TableRow key={idx} sx={{ border: 0}}>

                                  <TableCell sx={{ fontSize: {xs: 13}, paddingY: 0.5, fontWeight: 900, paddingLeft:2, textAlign: 'left'}}>
                                  {idx + 1}.
                                  </TableCell>

                                  <TableCell sx={{ fontSize: {xs: 13}, paddingY: 0.5, fontWeight: 'bold', paddingX:0, textAlign: 'center'}}>

                                    <Link to={`/DFA/Home/Player/${item.player_id}`} style={{ textDecoration: 'none', cursor: 'pointer'}}>
                                      {item.First_Name} {item.Last_Name}
                                    </Link>
                                  </TableCell>

                                  <TableCell align="center" sx={{ paddingX: 0, textAlign: 'center', fontSize: {xs: 13}}}>

                                    <Link to={`/DFA/Home/Team/${item.team_id}`} style={{ textDecoration: 'none', cursor: 'pointer', color: 'black', fontWeight: 900}}>
                                      {item.team}
                                    </Link>

                                  </TableCell>

                                  <TableCell align="center" sx={{ paddingX: 0, fontSize: {xs: 13}, fontWeight: 900}}>

                                    {item.Yellow_Cards}

                                  </TableCell>
                                  
                                </TableRow>
                                )



                              })}

      
                            </TableBody>


                          </Table>

                        </TableContainer>



                      </Box>
                    ):selectedChoice === 'Red Cards'?  (
                      
                      <Box >

                        <TableContainer component={Paper} sx={{ marginTop: {xs: 1}}} >

                          <Table >

                            <TableHead >
                              <TableRow>
                                {/* <TableCell sx={{ fontSize: {xs: 8}, fontWeight: 900}}>Pos</TableCell> */}
                                <TableCell sx={{ fontSize: {sm: 12}}}>Rank</TableCell>
                                <TableCell sx={{ fontSize: {sm: 12}, fontWeight: 900, paddingX: 0, textAlign: 'center'}}>Player</TableCell>
                                <TableCell align="center" sx={{ fontSize: {sm: 12}, fontWeight: 900, paddingX: 0}}>Club</TableCell>
                                <TableCell align="center" sx={{ fontSize: {sm: 12}, fontWeight: 900, paddingX: 0}}>Cards</TableCell>

                              </TableRow>
                            </TableHead>

                            <TableBody>

                              {players_Goals_data && players_Goals_data.filter(playerGoals => playerGoals.Red_Cards > 0 && playerGoals.league === getLeagueFilter()).sort(Sort_RedCards).map((item, idx) => {

                                return(


                                <TableRow key={idx} sx={{ border: 0}}>

                                  <TableCell sx={{ fontSize: {xs: 13}, paddingY: 0.5, fontWeight: 900, paddingLeft:2, textAlign: 'left'}}>
                                  {idx + 1}.
                                  </TableCell>

                                  <TableCell sx={{ fontSize: {xs: 13}, paddingY: 0.5, fontWeight: 'bold', paddingX:0, textAlign: 'center'}}>

                                    <Link to={`/DFA/Home/Player/${item.player_id}`} style={{ textDecoration: 'none', cursor: 'pointer'}}>
                                      {item.First_Name} {item.Last_Name}
                                    </Link>
                                  </TableCell>

                                  <TableCell align="center" sx={{ paddingX: 0, textAlign: 'center', fontSize: {xs: 13}}}>

                                    <Link to={`/DFA/Home/Team/${item.team_id}`} style={{ textDecoration: 'none', cursor: 'pointer', color: 'black', fontWeight: 900}}>
                                      {item.team}
                                    </Link>

                                  </TableCell>

                                  <TableCell align="center" sx={{ paddingX: 0, fontSize: {xs: 13}, fontWeight: 900}}>

                                    {item.Red_Cards}

                                  </TableCell>
                                  
                                </TableRow>
                                )

                              })}

      
                            </TableBody>

                          </Table>

                        </TableContainer>

                      </Box>
                    ):''}

                </Box>

              </Box>
            </TabPanel>

            <TabPanel  value='2'>
              <Typography textAlign='center'>SOON POPULATED</Typography>
            </TabPanel>

          </TabContext>

        </Box>

        
      </Box>

    </Box>
  )
  }


export default StatsPage