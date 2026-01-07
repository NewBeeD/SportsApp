import { useParams } from "react-router-dom"

import { useState, useEffect } from "react"

import qs from 'qs'
import axios from "axios"

import theme from "../../css/theme"

import { queryParams_daba_players } from "../../modules/DFA/QueryParams"

import DABASinglePlayerDisplay from "../../modules/DABA/DabaPlayerProfile/DABASinglePlayerDisplay"



import {  Box, Typography, Stack, Button, Card, CardHeader, CardContent, CardMedia, CardActions, Grid, Skeleton, Divider, Menu, MenuItem, Paper, FormControl, Select, InputLabel } from '@mui/material'

// import getPlayInfo from "../../modules/DFA/PlayerStats/PlayerProfileReload"

import NavBar from "../../components/homePage/NavBar"




const DABASinglePlayer = () => {

  const { id } = useParams()

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Set loading to true when starting the fetch
        setLoading(true);

        const queryString = qs.stringify(queryParams_daba_players);

        // Your API endpoint URL
        const apiUrl = `https://strapi-dominica-sport.onrender.com/api/daba-players/${id}?${queryString}`;
  

        // Make the fetch request
        const response = await axios.get(apiUrl);

        // Check if the request was successful (status code 2xx)
        if (response.status !== 200) {
          throw new Error(`Error: ${response.statusText}`);
        }

        // Parse the JSON data
        const result = await response.data.data;

        let final_data = DABASinglePlayerDisplay(result)
        
        // Set the data state
        setData(final_data);
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


      {data ? (
        <Box sx={{ display: 'flex' , flexDirection: 'column' ,justifyContent: 'center'}}>

          <Typography  style={{ backgroundColor: `var(--color-color4, ${theme.colors.color4})`}} paddingLeft={{ xs: 2}} paddingY={2} height={60} sx={{ fontWeight: 900, color: 'white'}}>{data.First_Name} {data.Last_Name}</Typography>

          <Box style={{ backgroundColor: `var(--color-color4, ${theme.colors.color4})`}} paddingLeft={{ xs: 2}} sx={{ color: 'white'}}>

                <Typography>
                  {data.Position}
                </Typography>

            </Box>

          <Box width='100%' style={{ backgroundColor: `var(--color-color4, ${theme.colors.color4})`}} sx={{ color: 'white', display: 'flex', justifyContent: 'center'}}>
            

            <Stack direction='column' justifyContent='center'  >

              <Box width={{xs:280}} height='auto' >

                <img src={data.img_url} width='100%' />

              </Box>

            </Stack>

          </Box>


          <Card sx={{ marginTop: {xs: '10px'}, width: {xs: '95%'}, margin: 'auto', paddingY: {xs: '5px'}}}>

            <Typography style={{ color: `var(--color-color3, ${theme.colors.color3})`}} marginLeft={2} variant="h5" sx={{ fontWeight: 900}}>Personal Details</Typography>

            <Stack paddingX={{xs: 2}} marginTop={2}>
              <Stack justifyContent='space-between' direction='row'>
                <Typography>Date of Birth:</Typography>
                <Typography style={{ color: `var(--color-color3, ${theme.colors.color3})`}} sx={{ fontWeight: 900}}>{data.Birth_Date}</Typography>
              </Stack>

              <Divider />

              <Stack justifyContent='space-between' direction='row'>
                <Typography>Age:</Typography>
                <Typography style={{ color: `var(--color-color3, ${theme.colors.color3})`}} sx={{ fontWeight: 900}}>{data.Age}</Typography>
              </Stack>

              <Divider />

              <Stack justifyContent='space-between' direction='row'>
                <Typography>Gender:</Typography>
                <Typography style={{ color: `var(--color-color3, ${theme.colors.color3})`}} sx={{ fontWeight: 900}}>{data.Gender}</Typography>
              </Stack>

              <Divider />

              <Stack justifyContent='space-between' direction='row'>
                <Typography>Height:</Typography>
                <Typography style={{ color: `var(--color-color3, ${theme.colors.color3})`}} sx={{ fontWeight: 900}}>{data.Height}</Typography>
              </Stack>

              <Divider />

              <Stack justifyContent='space-between' direction='row'>
                <Typography>Weight:</Typography>
                <Typography style={{ color: `var(--color-color3, ${theme.colors.color3})`}} sx={{ fontWeight: 900}}>{data.Weight}</Typography>
              </Stack>

              <Divider />

              <Stack justifyContent='space-between' direction='row'>
                <Typography>Club:</Typography>
                <Typography style={{ color: `var(--color-color3, ${theme.colors.color3})`}} sx={{ fontWeight: 900}}>{data.Team}</Typography>
              </Stack>

              <Divider />

              <Stack justifyContent='space-between' direction='row'>
                <Typography>Position:</Typography>
                <Typography style={{ color: `var(--color-color3, ${theme.colors.color3})`}} sx={{ fontWeight: 900}}>{data.Position}</Typography>
              </Stack>

            </Stack>
          
          </Card>

          {/* <Box marginTop={2} paddingX={{ xs: 2}} >

            <Typography style={{ color: `var(--color-color3, ${theme.colors.color3})`}} variant="h6" sx={{ fontWeight: 900}}>Premier League Record</Typography>

            <Stack marginTop={2} direction='row' justifyContent='space-between' >

              <Card>

                <Stack width={150} height={80} direction='column' sx={{  textAlign: 'center'}}>
                  <Typography>Games Played</Typography>
                  <Typography style={{ color: `var(--color-color3, ${theme.colors.color3})`}} variant="h3" sx={{ fontWeight: 'bold'}}>{data.Points}</Typography>
                  
                </Stack>
              </Card>

              <Card>
                <Stack width={150} height={80} direction='column' sx={{ textAlign: 'center'}}>
                  <Typography>Assists</Typography>
                  <Typography style={{ color: `var(--color-color3, ${theme.colors.color3})`}} variant="h3" sx={{ fontWeight: 'bold'}}>{data.Goals}</Typography>
                  
                </Stack>
              </Card>

            </Stack>

            <Stack marginTop={1} direction='row' justifyContent='space-between'>

              <Card>

                <Stack width={150} height={80} justifyContent='space-between' direction='column' sx={{textAlign: 'center'}}>
                  <Typography>Assists</Typography>
                  <Typography style={{ color: `var(--color-color3, ${theme.colors.color3})`}} variant="h3" sx={{ fontWeight: 'bold'}}>{data.Assists}</Typography>
                </Stack>
              </Card>

              <Card>

                <Stack width={150} height={80} direction='column' sx={{ textAlign: 'center'}}>
                  <Typography>Yellow Cards</Typography>
                  <Typography style={{ color: `var(--color-color3, ${theme.colors.color3})`}} variant="h3" sx={{ fontWeight: 'bold'}}>{data.YellowCards}</Typography>
                  
                </Stack>
              </Card>

            </Stack>

            <Stack marginTop={2} direction='row' justifyContent='space-between' >

              <Card>

                <Stack width={150} height={80} direction='column' sx={{  textAlign: 'center'}}>
                  <Typography>Appearances</Typography>
                  <Typography style={{ color: `var(--color-color3, ${theme.colors.color3})`}} variant="h3" sx={{ fontWeight: 'bold'}}>{data.Appearances}</Typography>
                  
                </Stack>
              </Card>

              <Card>
                <Stack width={150} height={80} direction='column' sx={{ textAlign: 'center'}}>
                  <Typography>Goals</Typography>
                  <Typography style={{ color: `var(--color-color3, ${theme.colors.color3})`}} variant="h3" sx={{ fontWeight: 'bold'}}>{data.Goals}</Typography>
                  
                </Stack>
              </Card>

            </Stack>

            <Stack marginTop={1} direction='row' justifyContent='space-between'>

            <Card>

              <Stack width={150} height={80} justifyContent='space-between' direction='column' sx={{textAlign: 'center'}}>
                <Typography>Assists</Typography>
                <Typography style={{ color: `var(--color-color3, ${theme.colors.color3})`}} variant="h3" sx={{ fontWeight: 'bold'}}>{data.Assists}</Typography>
              </Stack>
            </Card>

            <Card>

              <Stack width={150} height={80} direction='column' sx={{ textAlign: 'center'}}>
                <Typography>Yellow Cards</Typography>
                <Typography style={{ color: `var(--color-color3, ${theme.colors.color3})`}} variant="h3" sx={{ fontWeight: 'bold'}}>{data.YellowCards}</Typography>
                
              </Stack>
            </Card>

            </Stack>

            <Stack marginTop={1} direction='row' justifyContent='space-between'>

              <Card>

                <Stack width={150} height={80} justifyContent='space-between' direction='column' sx={{textAlign: 'center'}}>
                  <Typography>Assists</Typography>
                  <Typography style={{ color: `var(--color-color3, ${theme.colors.color3})`}} variant="h3" sx={{ fontWeight: 'bold'}}>{data.Assists}</Typography>
                </Stack>
              </Card>

              <Card>

                <Stack width={150} height={80} direction='column' sx={{ textAlign: 'center'}}>
                  <Typography>Yellow Cards</Typography>
                  <Typography style={{ color: `var(--color-color3, ${theme.colors.color3})`}} variant="h3" sx={{ fontWeight: 'bold'}}>{data.YellowCards}</Typography>
                  
                </Stack>
              </Card>

            </Stack>

          </Box> */}

          
        </Box>
      ): <Skeleton width='100%' height='500px' variant="rectangular" sx={{ marginTop: 4}} />}

      <Box width='100%' height={50} marginTop={{xs:3}} sx={{ backgroundColor: 'black'}}/>

    </Box>
  )
}

export default DABASinglePlayer