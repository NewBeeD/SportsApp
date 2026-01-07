import { useSelector } from 'react-redux'

import qs from 'qs'
import axios from "axios"

import { useState, useEffect } from 'react';

// Core imports (keep these - they're relatively small or hard to replace well)
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper'; // ~30KB - could use Box with border

// Heavy imports - consider replacing ALL of these:
import Stack from '@mui/material/Stack';          // ~35KB
import Skeleton from '@mui/material/Skeleton';     // ~40KB
import Table from '@mui/material/Table';           // ~50KB
import TableHead from '@mui/material/TableHead';   // ~20KB
import TableBody from '@mui/material/TableBody';   // ~20KB
import TableRow from '@mui/material/TableRow';     // ~25KB
import TableCell from '@mui/material/TableCell';   // ~30KB

import theme from '../../../css/theme';

import NavBar from '../../../components/homePage/NavBar';
import { queryParams_prem_players_stats } from '../../../modules/DFA/QueryParams';
import DivisionOnePlayerStatsDisplayStructure from '../../../modules/DFA/DivOne/DivisionOnePlayerStatsDisplay';


function Sort(a, b){

  return b.Assists - a.Assists
}


const DivisionOnePlayerAssists = () => {

  // let player_stats = useSelector((state) => state.DfaPlayerStats)
  // let players_data = player_stats ? player_stats[0]: []
  // players_data = players_data ? players_data.map(goals => goals).sort(Sort): []
  // // players_data = players_data ? players_data.sort(Sort): []

  // let current_season = players_data[0] ? players_data[0].Season.substring(1).replace('-', '/'): '';

  const [players_data, setPlayers_data] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        let final_data = DivisionOnePlayerStatsDisplayStructure(result)
        final_data = final_data.map(goals => goals).sort(Sort)

        setCurrentSeason(final_data[0].Season.substring(1).replace('-', '/'))
      
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


  return (
    <Box width={{xs:'100%', sm: 800}} sx={{margin: {xs: 0, sm: 'auto'}}}>

      <NavBar />

      <Box marginBottom={3} paddingLeft={{ xs: 1}} paddingTop={{ sm: 4}}>
        <Typography variant='h5' sx={{ fontWeight: 'bold'}}>Most Assists</Typography>

        <Typography>
          {currentSeason && currentSeason}
        </Typography>
      </Box>

      
      <Paper marginBottom={4} sx={{ width: {xs: '98%'}, margin: 'auto'}}>
        {players_data && (

          <Stack style={{ backgroundColor: `var(--color-color4, ${theme.colors.color4})`}} paddingY={{xs: 2}} direction='row' justifyContent='space-between' sx={{  color: 'white'}}>
            <Stack direction='column' paddingLeft={{xs: 1}}>
              <Box><Typography sx={{ fontWeight: 'bold'}}>1</Typography></Box>
              <Box><Typography sx={{ fontWeight: 'bold'}}>{players_data[0].First_Name}</Typography></Box>
              <Box><Typography sx={{ fontWeight: 'bold'}}>{players_data[0].Last_Name}</Typography></Box>
              <Box><Typography variant='caption' sx={{ fontWeight: 'bold'}}>{players_data[0].team}</Typography></Box>
              <Box><Typography variant='h5' sx={{ fontWeight: 'bold', fontSize: 27, marginTop: 2}}>{players_data[0].Assists}</Typography></Box>
            </Stack>

            <Box width={{xs: 180}}>
              <img src={players_data[0].url} width='100%' height='100%' />
            </Box>


          </Stack>

        )}
      </Paper>

      { players_data && players_data.length > 0 ? 
      
      <Paper sx={{ width: {xs: '98%'}, margin: 'auto'}}>

        <Table sx={{ marginTop: {xs: 2}}}>

          <TableHead>
            <TableRow>
              <TableCell>Pos</TableCell>
              <TableCell>Player</TableCell>
              <TableCell>Club</TableCell>
              <TableCell>Assists</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>

            {players_data && players_data.filter(item => item.Assists > 0).slice(1).map((item, idx) => {

              return (
                
                <TableRow key={idx}>

                  <TableCell sx={{ fontWeight: 'bold', paddingY: 1}}>{idx+2}</TableCell>
                  <TableCell sx={{ paddingY: 1}}>{item.Last_Name} {item.First_Name}</TableCell>
                  <TableCell sx={{ paddingY: 1}}>{item.team}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', paddingY: 1}}>{item.Assists}</TableCell>
                </TableRow>
              )
            })}

          </TableBody>
        </Table>

      </Paper>
    : <Skeleton width={300} height={500} sx={{ margin: 'auto'}}/>}




    </Box>
  )
}

export default DivisionOnePlayerAssists