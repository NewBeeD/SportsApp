import {  Box, Typography, Stack, Button, Card, CardHeader, CardContent, CardMedia, CardActions, Grid, Skeleton, Divider, Menu, MenuItem, Paper, FormControl, Select, InputLabel } from '@mui/material'

import GetArticles from "../../modules/Homepage/TrendingSection/TrendingSectionDataFetch"
import VideoHighlights from '../../components/WeekendHighlights/VideoHighlights';

import theme from '../../css/theme';

import { Link } from "react-router-dom";

// Redux
import { useSelector } from 'react-redux';

const DABAArticles = ({ level }) => {

  GetArticles()

  const articles_raw = useSelector((state) => state.articles)
  let articles = articles_raw && articles_raw[0] ? articles_raw[0].filter(item => item.league == 'DABA' && item.headline != 'YES') : null;

  let articles_length = articles && articles_raw[0] ? articles.length: 0;
  let part_size = articles_length ? Math.ceil(articles_length/3): 0;


  // TODO: Set up articles in slices


  switch(level){

    case 'first':
      articles = articles ? articles.slice(0, part_size): null;
      break;
    
    case 'second':
      articles = articles ? articles.slice(part_size, 2*part_size): null;
      break;
    
    case 'third':
      articles = articles ? articles.slice(2*part_size): null;
  }

  
  return (
    <Box marginTop={2}>

      <Stack direction='column' spacing={2} width={{xs: '95%'}} margin={{xs:'auto'}} divider={<Divider orientation='horizontal' flexItem />} >


          <Box direction={{ xs: 'column', sm: 'row' }} sx={{ display: { sm: 'flex' }, flexDirection: 'row' }}>

            <Stack display={{ sm:'none'}} direction='column' spacing={2} width={{xs: '90%'}} margin={{xs:'auto'}} divider={<Divider orientation='horizontal' flexItem />} >

              {articles ? articles.map((item, idx) => {

              return (
              <Box key={idx}>
                
                <Card sx={{ boxShadow: 'none', backgroundColor: 'white', border: '1px solid #86C232'}}>

                  <CardActions>

                    <Stack>

                      {/* TODO: Link this page to the premiere league home page */}

                      <Link to='/DFA/Home'>
                      <Typography style={{ color: `var(--color-color5, ${theme.colors.color5})`}} sx={{ fontSize: {xs: 13}, textDecoration: 'underline', fontWeight: 900}}>{item.league}</Typography>
                      </Link>


                      <Stack direction='row' spacing={0.5}>
                        <Typography style={{ color: `var(--color-color3, ${theme.colors.color3})`}} sx={{ fontSize: {xs: 9}}}>{item.author}</Typography>
                        <Divider orientation='vertical' flexItem />
                        <Typography style={{ color: `var(--color-color3, ${theme.colors.color3})`}} sx={{ fontSize: {xs: 9}}}>{item.time}</Typography>
                      </Stack>


                    </Stack>

                  </CardActions>

                  <Link to={`/${item.id}`} style={{ textDecoration: 'none'}}>
                    <CardHeader titleTypographyProps={{variant:'body2', fontWeight: 900 }} title={item.title} style={{ color: `var(--color-color3, ${theme.colors.color3})`}}/>
                  </Link>


                  <Link to={`/${item.id}`} style={{ textDecoration: 'none'}}>
                  <CardMedia component='img' height={200} src={item.url[0]} alt={item.alt}/>
                  </Link>

                  <Link to={`/${item.id}`} style={{ textDecoration: 'none'}}>
                    <CardContent>
                      <Typography sx={{ color: 'black', fontSize: {xs: 13}}}>
                        {item.body_content.length < 25? item.body_content: (item.body_content.substr(0, 50) + "...")}
                      </Typography>
                    </CardContent>
                  </Link>



                  
                </Card>

              </Box>)

            }): <Skeleton variant="rectangular" width='100%' height={60} />}
                      

            </Stack>


            <Grid display={{ xs:'none', sm: 'inherit'}}  container spacing={2} direction={{ xs: 'column', sm: 'row' }} justifyContent="left" marginX={2} paddingRight={2} width={{sm:600, md:700, lg:800}} >

              {articles ? articles.map((item, idx) => (
                <Grid item key={idx} xs={12} sm={5} md={4} lg={6}>
                
                  <Card sx={{ boxShadow: 'none', backgroundColor: 'white', border: '1px solid #86C232', height: 450}}>

                    <CardActions>

                      <Stack>

                        {/* TODO: Link this page to the premiere league home page */}

                        <Link to='/DFA/Home'>
                        <Typography style={{ color: `var(--color-color5, ${theme.colors.color5})`}} sx={{ fontSize: {xs: 13}, textDecoration: 'underline', fontWeight: 900}}>{item.league}</Typography>
                        </Link>


                        <Stack direction='row' spacing={0.5}>
                          <Typography style={{ color: `var(--color-color3, ${theme.colors.color3})`}} sx={{ fontSize: {xs: 9}}}>{item.author}</Typography>
                          <Divider orientation='vertical' flexItem />
                          <Typography style={{ color: `var(--color-color3, ${theme.colors.color3})`}} sx={{ fontSize: {xs: 9}}}>{item.time}</Typography>
                        </Stack>


                      </Stack>

                    </CardActions>

                    <Link to={`/${item.id}`} style={{ textDecoration: 'none'}}>
                      <CardHeader titleTypographyProps={{variant:'body2', fontWeight: 900 }} title={item.title} style={{ color: `var(--color-color3, ${theme.colors.color3})`}}/>
                    </Link>


                    <CardMedia component='img' height={200} src={item.url[0]} alt={item.alt}/>

                    <CardContent>
                      <Typography sx={{ color: 'black', fontSize: {xs: 13}}}>
                        {item.body_content.length < 25? item.body_content: (item.body_content.substr(0, 90) + "...")}
                      </Typography>
                    </CardContent>

                  </Card>
                </Grid>
              )) : <Skeleton variant="rectangular" width='100%' height={60} />}

            </Grid>

            {/* Side panel in the homepage */}
            {level === 'first'?<Stack width={{ sm:'380px', md: '400px' }} display={{xs:'none', sm:'inherit'}}
            direction='column'
            justifyContent='center'
            alignItems='center'
            spacing={0}
            sx={{ backgroundColor: `var(--color-color3, ${theme.colors.color3})`, borderRadius: '8px'}}
            height={{ sm: '450px'}}>

              {/* <Typography  variant='h3'>Ad Space here</Typography> */}
              <Typography variant='h4' color='white' padding={0} sx={{ paddingTop: 2}}>Weekend Highlights</Typography>

              <VideoHighlights VideoLocation='Homepage2' />
              
            </Stack>: ''}


          </Box>

                

      </Stack>

    </Box>
  )
}

export default DABAArticles