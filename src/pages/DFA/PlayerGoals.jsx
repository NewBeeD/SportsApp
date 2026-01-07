import { useSelector } from 'react-redux';


import qs from 'qs'
import axios from "axios"
import { Link } from 'react-router-dom';

import { queryParams_prem_players_stats } from '../../modules/DFA/QueryParams';
import PlayerStatsDisplayStructure from '../../modules/DFA/PlayerStats/PlayerStatsDisplayStructure';

import theme from '../../css/theme';


import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import Skeleton from '@mui/material/Skeleton';

import Paper from '@mui/material/Paper';

import Table from '@mui/material/Table';

import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { useState, useEffect } from 'react';


import NavBar from "../../components/homePage/NavBar"

function Sort(a, b){

  return b.Goals - a.Goals
}



const PlayerGoals = () => {


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

        let final_data = PlayerStatsDisplayStructure(result)
        
        final_data = final_data.map(goals => goals).sort(Sort)
        final_data = final_data.filter(item => item.league === 'DFA_Premier_League_Men')

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
    <Box  width={{xs:'100%', sm: 800}} sx={{margin: {xs: 0, sm: 'auto'}}}>

      <NavBar />

      

      <Box marginBottom={3} paddingLeft={{ xs: 1}} paddingTop={4}>
        <Typography variant='h5' sx={{ fontWeight: 'bold'}}>Most Goals</Typography>

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
                <Box><Typography variant='h5' sx={{ fontWeight: 'bold', fontSize: 27, marginTop: 2}}>{players_data[0].Goals}</Typography></Box>

              </Stack>

              <Link to={`/DFA/Home/Player/${players_data[0].Player_ID}`} style={{ textDecoration: 'none', color: 'black', fontWeight: 900}}>

                <Box width={{xs: 180}}>
                  <img src={players_data[0].url} width='100%' height='100%' />
                </Box>

              </Link>


          </Stack>

        )}
      </Paper>

      {players_data && players_data.length > 0 ?
      
      <Paper sx={{ width: {xs: '98%'}, margin: 'auto'}}>

        <Table sx={{ marginTop: {xs: 2}}}>

          <TableHead>
            <TableRow>
              <TableCell>Pos</TableCell>
              <TableCell>Player</TableCell>
              <TableCell>Club</TableCell>
              <TableCell>Goals</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>

            {players_data && players_data.filter(item => item.Goals > 0 ).slice(1).map((item, idx) => {

              return (
                
                <TableRow key={idx}>

                  <TableCell sx={{ fontWeight: 'bold', paddingY: 0.5}}>{idx+2}</TableCell>
                  <TableCell sx={{ paddingY: 0.5}}>

                    <Link to={`/DFA/Home/Player/${item.Player_ID}`} style={{ textDecoration: 'none', color: 'black', fontWeight: 900}}>
                    
                      {item.Last_Name} {item.First_Name}
                    </Link>
                    
                    
                    </TableCell>
                  <TableCell sx={{ paddingY: 0.5}}>{item.team}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', paddingY: 0.5}}>{item.Goals}</TableCell>
                </TableRow>
              )
            })}

          </TableBody>
        </Table>

      </Paper>
    : <Skeleton width={300} height={500} sx={{ margin: 'auto'}} />}




    </Box>
  )
}

export default PlayerGoals