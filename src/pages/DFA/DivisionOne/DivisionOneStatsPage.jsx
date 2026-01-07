import {  Box, Typography, Stack, Button, Card, CardHeader, CardContent, CardMedia, CardActions, Grid, Skeleton, Divider, Menu, MenuItem, Paper, FormControl, Select, InputLabel, AppBar, Tab } from '@mui/material'

import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, TablePagination } from "@mui/material"

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import NavBar from '../../../components/homePage/NavBar';
import { TabContext, TabList, TabPanel } from "@mui/lab";

import { useState, useEffect } from 'react';

import qs from 'qs'
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';

import theme from '../../../css/theme';


import { queryParams_prem_players_stats } from '../../../modules/DFA/QueryParams';
import DivisionOnePlayerStatsDisplayStructure from '../../../modules/DFA/DivOne/DivisionOnePlayerStatsDisplay';

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


const DivisionOneStatsPage = () => {

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

        let final_data = DivisionOnePlayerStatsDisplayStructure(result)
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

    <Box>

      <NavBar />  

      <Box width={{sm: 900}} margin='auto' height='100vh'>


        <Box marginTop={{ sm: 10}}>
          <Typography variant='h2' fontWeight={900} textAlign='center'>Stats Centre</Typography>
        </Box>

        <Box marginTop={{ sm: 7}} height='100%'>

          <TabContext value={value}>
          
            <TabList onChange={handleChange} aria-label="tabs example" centered>
                      <Tab label='Player Stats' value='1' />
                      <Tab label='Club Stats' value='2' />
            </TabList>


            <TabPanel  value='1'>

              {/* <Stack direction='column' marginTop={3}>

                <Stack direction='row' justifyContent='space-between'>
                
                  
                  <Button variant='contained' size='large' aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} endIcon={<KeyboardArrowDownIcon style={{ color: 'white'}} />} sx={{ backgroundColor: `var(--color-color1, ${theme.colors.color1})`, width: {sm: 200} }}>
                  {selectedChoice}
                  </Button>

                  <Box>
                    <Button size='large' variant='contained' onClick={()=> navigate('/DFA/Stats')}>
                      Premier League
                    </Button>
                  </Box>

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
                                
                                <TableCell sx={{ fontSize: {xs: 12}}}>Rank</TableCell>
                                <TableCell sx={{ fontSize: {xs: 12}, fontWeight: 900, paddingX: 0, textAlign: 'center'}}>Player</TableCell>
                                <TableCell align="center" sx={{ fontSize: {xs: 12}, fontWeight: 900, paddingX: 0}}>Club</TableCell>
                                <TableCell align="center" sx={{ fontSize: {xs: 12}, fontWeight: 900, paddingX: 0, paddingRight: {xs: 1, sm: 'inherit'}}}>Goals</TableCell>

                              </TableRow>
                            </TableHead>

                            <TableBody>

                              {players_Goals_data && players_Goals_data.sort(Sort).filter(playerGoals => playerGoals.Goals> 0).map((item, idx) => {

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

                              {players_Goals_data && players_Goals_data.sort(Sort_Assists).filter(playerGoals => playerGoals.Assists > 0).map((item, idx) => {

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

                                <TableCell sx={{ fontSize: {sm: 12}}}>Rank</TableCell>
                                <TableCell sx={{ fontSize: {sm: 12}, fontWeight: 900, paddingX: 0, textAlign: 'center'}}>Player</TableCell>
                                <TableCell align="center" sx={{ fontSize: {sm: 12}, fontWeight: 900, paddingX: 0}}>Club</TableCell>
                                <TableCell align="center" sx={{ fontSize: {sm: 12}, fontWeight: 900, paddingX: 0}}>Clean Sheets</TableCell>

                              </TableRow>
                            </TableHead>

                            <TableBody>

                              {players_Goals_data && players_Goals_data.sort(Sort_Clean_Sheets).filter(playerGoals => playerGoals.Clean_Sheets> 0).map((item, idx) => {

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

                                <TableCell sx={{ fontSize: {sm: 12}}}>Rank</TableCell>
                                <TableCell sx={{ fontSize: {sm: 12}, fontWeight: 900, paddingX: 0, textAlign: 'center'}}>Player</TableCell>
                                <TableCell align="center" sx={{ fontSize: {sm: 12}, fontWeight: 900, paddingX: 0}}>Club</TableCell>
                                <TableCell align="center" sx={{ fontSize: {sm: 12}, fontWeight: 900, paddingX: 0}}>Cards</TableCell>

                              </TableRow>
                            </TableHead>

                            <TableBody>

                              {players_Goals_data && players_Goals_data.filter(playerGoals => playerGoals.Yellow_Cards > 0).sort(Sort_YellowCards).map((item, idx) => {

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
  
                                <TableCell sx={{ fontSize: {sm: 12}}}>Rank</TableCell>
                                <TableCell sx={{ fontSize: {sm: 12}, fontWeight: 900, paddingX: 0, textAlign: 'center'}}>Player</TableCell>
                                <TableCell align="center" sx={{ fontSize: {sm: 12}, fontWeight: 900, paddingX: 0}}>Club</TableCell>
                                <TableCell align="center" sx={{ fontSize: {sm: 12}, fontWeight: 900, paddingX: 0}}>Cards</TableCell>

                              </TableRow>
                            </TableHead>

                            <TableBody>

                              {players_Goals_data && players_Goals_data.filter(playerGoals => playerGoals.Red_Cards > 0).sort(Sort_RedCards).map((item, idx) => {

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

              </Stack> */}

              <Box textAlign='center' marginTop={10} >

                <Typography variant="h4">
                  First division coverage will continue next season, as data collection for the league is inconsistent.  
                </Typography>

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


export default DivisionOneStatsPage