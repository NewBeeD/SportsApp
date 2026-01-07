// Core imports (keep these - relatively small)
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';


// Heavy imports to replace:
import Stack from '@mui/material/Stack';          // ~35KB

import Skeleton from '@mui/material/Skeleton';     // ~40KB


import qs from 'qs'
import axios from 'axios'


import NavBar from '../../components/homePage/NavBar'

import { queryParams_fixtures } from '../../modules/DFA/QueryParams'
import GroupingFixturesByDate from '../../modules/Homepage/Fixtures/FixturesDisplay'

import { useState, useEffect } from 'react'

import Footer from '../../components/Footer/Footer'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

const FixturesPage = () => {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [type, setType] = useState('now')

  // console.log('data', data);



  useEffect(()=>{

    const fetchData = async () => {
      try {
        // Set loading to true when starting the fetch
        setLoading(true);

        const queryString = qs.stringify(queryParams_fixtures);

        // Your API endpoint URL
        const apiUrl = `https://strapi-dominica-sport.onrender.com/api/fixtures?${queryString}`;
  

        // Make the fetch request
        const response = await axios.get(apiUrl);

        // Check if the request was successful (status code 2xx)
        if (response.status !== 200) {
          throw new Error(`Error: ${response.statusText}`);
        }

        // Parse the JSON data
        const result = await response.data;

        let final_data = GroupingFixturesByDate(result)

        // console.log(final_data);


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


  }, [])

  return (

    <Box>

      <NavBar />

      <Box width={{sm: 800, md: 900}} margin='auto' paddingTop={3}>

      <Typography paddingBottom={3} variant="h4" sx={{ textAlign: 'center', color: 'blue', fontWeight: 900}}>Game Fixtures</Typography>

        <Box marginTop={2.3} width={{ xs: '95%'}} marginX='auto' sx={{ backgroundColor: {xs: '#F9F9F9', sm: 'white'}, border: '1px solid #D3E1FF', borderRadius: {xs: '4px'}}}>
      

          {data && type === 'now' ? (data.filter(item => item.Complete != 'Yes').map((item, idx) => {

            return(
              
              <Box key={idx} width={{xs: '100%'}} margin={{xs:'auto'}}>

                <Card sx={{ marginY: {xs: 0}, height: 'auto', boxShadow: 'none', borderBottom: {xs: '1px solid #D3E1FF'}, borderRadius: {xs: '4px'}}}>

                  <Stack direction={{xs: 'row'}} justifyContent='space-between' marginX={2} paddingTop={1}>

                    <Stack direction='column' spacing={0.5}>

                      <Typography style={{ fontSize: 12, fontWeight: 900 }}>{item.Home}</Typography>
                      <Typography style={{ fontSize: 12, fontWeight: 900 }}>{item.Away}</Typography>

                    </Stack>

                    <Stack direction='column' spacing={0.5}>
                    {item.HomeScore ? (<Typography style={{ fontSize: 13, fontWeight:900, color: 'blue' }}>{item.HomeScore}</Typography>) : item.HomeScore === 0 && item.AwayScore != 0? (<Typography style={{ fontSize: 13, fontWeight: 900, color: 'blue' }}>0</Typography>):(<Typography style={{ fontSize: 12, fontWeight: 900 }}>{item.Date}</Typography>)}
  
                    {item.AwayScore? (<Typography style={{ fontSize: 13, fontWeight: 900, color: 'blue' }}>{item.AwayScore}</Typography>): item.AwayScore === 0 && item.HomeScore != 0? (<Typography style={{ fontSize: 13, fontWeight: 900, color: 'blue' }}>0</Typography>):(<Typography  fontStyle={{ fontWeight: 900, fontSize: 12.5}}>{item.Time}</Typography>)}
                    </Stack>

                  </Stack>

                  <Stack marginLeft={2}>

                    
                    {item.Game_Info != undefined ? (<Stack>

                      <Box marginTop={2}>
                        <Typography>Goals</Typography>

                      </Box>

                      <Stack direction='row' justifyContent='space-between' marginRight={2} paddingTop={1}>
                        <Box>Home</Box>
                        <Box>Away</Box>
                      </Stack>

                      <Stack direction='row' justifyContent='space-between' marginRight={2} paddingTop={1}>

                        <Box paddingTop={1}>
                        {item.Game_Info.Goal_Scorers_Home.map((data_point, key_value) => {

                          return(
                            <Stack key={key_value} direction='row' alignItems='center' spacing={0.5}>


                              <Box>
                                <SportsSoccerIcon fontSize='2px'/>
                              </Box>

                              <Box>
                                <Typography variant='caption'>{data_point}</Typography>
                              </Box>


                            </Stack>
                          )
                        })}  
                        </Box>

                        <Box paddingTop={1}>
                        {item.Game_Info.Goal_Scorers_Away.map((data_point, key_value) => {

                          return(
                            <Stack key={key_value} direction='row' alignItems='center' spacing={0.5}>


                              <Box>
                                <SportsSoccerIcon fontSize='2px'/>
                              </Box>

                              <Box>
                                <Typography variant='caption'>{data_point}</Typography>
                              </Box>


                            </Stack>
                          )
                        })}  
                        </Box>


                      </Stack>


                                      

                    </Stack>): ''}
                  </Stack>

                  <Box >

                    <Typography style={{ fontSize: 12 }} sx={{ textAlign: 'center', color: 'blue'}}>{item.Cancelled === 'Yes'? '': item.League_fullName} | {item.Cancelled === 'Yes'? 'Cancelled': item.Venue}</Typography>

                  </Box>

                  

                </Card>
                
              </Box>

            )})): type === 'past'? (data.filter(item => item.Complete === 'Yes').map((item, idx) => {

              return(
                
                <Box key={idx} width={{xs: '100%'}} margin={{xs:'auto'}}>

                  <Card sx={{ marginY: {xs: 0}, height: 'auto', boxShadow: 'none', borderBottom: {xs: '1px solid #D3E1FF'}, borderRadius: {xs: '4px'}}}>

                    <Box marginTop={1} sx={{ display: {xs: 'flex'}, justifyContent: 'center'}}>

                      <Typography>
                        {type === 'past'? <Typography style={{ fontSize: 12, fontWeight: 900 }}>{item.Date}</Typography>: ''}
                      </Typography>
                      
                    </Box>


                    <Stack direction={{xs: 'row'}} justifyContent='space-between' marginX={2} paddingTop={1}>

                      <Stack direction='column' spacing={0.5}>

                        <Typography style={{ fontSize: 12, fontWeight: 900 }}>{item.Home}</Typography>
                        <Typography style={{ fontSize: 12, fontWeight: 900 }}>{item.Away}</Typography>

                      </Stack>


                      <Stack direction='column' spacing={0.5}>

                        <Typography style={{ fontSize: 13, fontWeight:900, color: 'blue' }}>{item.HomeScore}</Typography>

                        <Typography style={{ fontSize: 13, fontWeight: 900, color: 'blue' }}>{item.AwayScore}</Typography>
                      </Stack>

                    </Stack>

                    
                    <Stack marginLeft={2}>
                      {item.Game_Info != undefined ? (<Stack>

                        <Box marginTop={2}>
                          <Typography>Goals</Typography>

                        </Box>

                        <Stack direction='row' justifyContent='space-between' marginRight={2} paddingTop={1}>
                          <Box>Home</Box>
                          <Box>Away</Box>
                        </Stack>

                        <Stack direction='row' justifyContent='space-between' marginRight={2} paddingTop={1}>

                          <Box paddingTop={1}>
                          {item.Game_Info.Goal_Scorers_Home.map((data_point, key_value) => {

                            return(
                              <Stack key={key_value} direction='row' alignItems='center' spacing={0.5}>


                                <Box>
                                  <SportsSoccerIcon fontSize='2px'/>
                                </Box>

                                <Box>
                                  <Typography variant='caption'>{data_point}</Typography>
                                </Box>


                              </Stack>
                            )
                          })}  
                          </Box>

                          <Box paddingTop={1}>
                          {item.Game_Info.Goal_Scorers_Away.map((data_point, key_value) => {

                            return(
                              <Stack key={key_value} direction='row' alignItems='center' spacing={0.5}>


                                <Box>
                                  <SportsSoccerIcon fontSize='2px'/>
                                </Box>

                                <Box>
                                  <Typography variant='caption'>{data_point}</Typography>
                                </Box>


                              </Stack>
                            )
                          })}  
                          </Box>


                        </Stack>


                                        

                      </Stack>): ''}
                    </Stack>


                    <Box marginBottom={1}>

                      <Typography style={{ fontSize: 12 }} sx={{ textAlign: 'center', color: 'blue'}}>{item.Cancelled === 'Yes'? 'Cancelled': item.League_fullName} | {item.Cancelled === 'Yes'? '': item.Venue} </Typography>

                    </Box>

                    

                  </Card>
                  
                </Box>

              )})): <Skeleton variant="rectangular" width={310} height={60} />}     


        </Box>

        <Stack justifyContent='center' direction='row' marginTop={3} marginBottom={8}>

          {type != 'now' ? <Button variant="outlined" onClick={() => setType('now')} size="small">
            Upcoming Fixtures
          </Button>: ''}

          {type != 'past' ? <Button variant="outlined" onClick={() => setType('past')} size="small">
            Past Results
          </Button>: ''}
        </Stack>

      </Box>



      <Footer />

    </Box>
  )
}

export default FixturesPage