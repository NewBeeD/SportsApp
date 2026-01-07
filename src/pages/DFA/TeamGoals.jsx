import { useSelector } from 'react-redux';

import qs from 'qs'
import axios from "axios"

import { useState, useEffect } from 'react';

import { queryParams_prem_players_stats, queryParams_dfa_teams } from '../../modules/DFA/QueryParams';
import PlayerStatsDisplayStructure from '../../modules/DFA/PlayerStats/PlayerStatsDisplayStructure';

import MostTeamGoals from '../../modules/DFA/PlayerStats/MostTeamGoals'
import Combine_Team_Crest from '../../modules/DFA/TeamPage/Combine_Team_Crest';

import theme from '../../css/theme';
import TeamGoalsAssists from '../../modules/DFA/TeamGoalsandAssist/TeamGoalsAssists_Img';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import Paper from '@mui/material/Paper';

import Table from '@mui/material/Table';

import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';



import NavBar from "../../components/homePage/NavBar"




const TeamGoals = () => {


  const [players_data, setPlayers_data] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [team_data, setTeam_data] = useState(null);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamError, setTeamError] = useState(null);

  const [combineData, setCombineData] = useState(null)


  const [currentSeason, setCurrentSeason] = useState(null)

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

        let final_data = PlayerStatsDisplayStructure(result)
        setCurrentSeason(final_data[0].Season.substring(1).replace('-', '/'))
        final_data = MostTeamGoals(final_data)
        // Set the data state
        setPlayers_data(final_data);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Set loading to true when starting the fetch
        setTeamLoading(true);

        const queryString = qs.stringify(queryParams_dfa_teams);

        // Your API endpoint URL
        const apiUrl = `https://strapi-dominica-sport.onrender.com/api/dfa-teams?${queryString}`;
  

        // Make the fetch request
        const response = await axios.get(apiUrl);

        // Check if the request was successful (status code 2xx)
        if (response.status !== 200) {
          throw new Error(`Error: ${response.statusText}`);
        }

        // Parse the JSON data
        const result = await response.data.data;

        let final_data = TeamGoalsAssists(result)

        // Set the data state
        setTeam_data(final_data);
      } catch (error) {
        // Set the error state if there's an issue
        setTeamError(error.message);
      } finally {
        // Set loading to false regardless of success or failure
        setTeamLoading(false);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, []); 

  useEffect(() => {

    let final_data = Combine_Team_Crest(players_data, team_data)
    setCombineData(final_data)    
  }, [team_data, players_data]); 








  return (
    <Box width={{xs:'100%', sm: 800}} sx={{margin: {xs: 0, sm: 'auto'}}}>

    <NavBar />


    <Box marginBottom={3} paddingLeft={{ xs: 1}} paddingTop={4}>
      <Typography variant='h5' sx={{ fontWeight: 'bold'}}>Goals</Typography>

      <Typography>
        {currentSeason && currentSeason}
      </Typography>
    </Box>

    
    <Paper marginBottom={4} sx={{ width: {xs: '98%'}, margin: 'auto'}}>
      {combineData && (

        <Stack style={{ backgroundColor: `var(--color-color4, ${theme.colors.color4})`}} paddingY={{xs: 2}} direction='row' justifyContent='space-between' sx={{ color: 'white'}}>
          <Stack direction='column' paddingLeft={{xs: 1}}>

            <Box><Typography sx={{ fontWeight: 'bold'}}>1</Typography></Box>

            <Box><Typography sx={{ fontWeight: 'bold'}}>{combineData[0].teamName}</Typography></Box>

            <Box marginTop={3}><Typography variant='h4' sx={{ fontWeight: 'bold'}}>{combineData[0].totalGoals}</Typography></Box>
          </Stack>

          <Box width={{xs: 130}}>
            <img src={combineData[0].team_crest_url} width='100%' height='100%' />
          </Box>


        </Stack>

      )}
    </Paper>

    <Paper sx={{ width: {xs: '98%'}, margin: 'auto'}}>

      <Table sx={{ marginTop: {xs: 2}}}>

        <TableHead>
          <TableRow>
            <TableCell>Pos</TableCell>
            <TableCell>Club</TableCell>
            <TableCell>Goals</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>

          {combineData && combineData.slice(1).map((item, idx) => {

            return (
              
              <TableRow key={idx} sx={{ textAlign: 'center'}}>

                <TableCell sx={{ fontWeight: 'bold', paddingY: 0.5, textAlign: 'center'}}>{idx+2}</TableCell>
                <TableCell sx={{ paddingY: 0.5}}>{item.teamName}</TableCell>
                <TableCell sx={{ fontWeight: 'bold', paddingY: 0.5, textAlign: 'center'}}>{item.totalGoals}</TableCell>
              </TableRow>
            )
          })}

        </TableBody>
      </Table>

    </Paper>

    <Box textAlign='center' paddingTop={8} paddingBottom={8}>
      <Typography variant='caption' color='red' letterSpacing={3}>
        Own goals are not included.
      </Typography>
    </Box>



  </Box>
  )
}

export default TeamGoals