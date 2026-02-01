import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

// Consider lightweight alternatives:
import Stack from '@mui/material/Stack';          
import CardHeader from '@mui/material/CardHeader'; 
import CardContent from '@mui/material/CardContent'; 
import CardMedia from '@mui/material/CardMedia';   
import CardActions from '@mui/material/CardActions'; 
import Skeleton from '@mui/material/Skeleton';     

import { Link } from 'react-router-dom';
import Divider from '@mui/material/Divider';

// Function to fetch article data and structured data
import GetArticles from '../../modules/Homepage/TrendingSection/TrendingSectionDataFetch'

// Redux
import { useSelector } from 'react-redux';

import theme from '../../css/theme';

import VideoHighlights from '../Video';
import FixturesData from './Fixtures';







const TrendingSection = ({ level, showSidePanel = true }) => {

  // This function fetches the data on strapi and then structures it, then passes it to redux state
  GetArticles()

  const articles_raw = useSelector((state) => state.articles)
  let articles = articles_raw[0]


  let articles_length = articles && articles_raw[0] ? articles.length: 0;
  let part_size = articles_length ? Math.ceil(articles_length/3): 0;


  // TODO: Set up articles in slices


  switch(level){

    case 'first':
      articles = articles ? articles.slice(0, 3): null;
      break;
    
    case 'second':
      articles = articles ? articles.slice(3, 6): null;
      break;
    
    case 'third':
      articles = articles ? articles.slice(6, 9): null;
      break;

    case 'fourth':
      articles = articles ? articles.slice(9, 15): null;
      break;
    
    case 'fifth':
      articles = articles ? articles.slice(15): null;
      break;
  }


  return (
    
    <Box sx={{ backgroundColor: {xs: 'F7F8FA', sm: 'white'}}} marginBottom={4} >  

      {level == 'second'? '':level == 'third'? '':level == 'fourth'? '':level == 'fifth'? '':(<Stack marginBottom={{xs: 2}}>

        <Typography style={{ color: `var(--color-color2, ${theme.colors.color2})`}} width={85} marginLeft={2} marginTop={{xs: 2.5, sm: 3}}   fontSize={{xs: 16, sm: 30}} sx={{ letterSpacing: {xs:0, sm: 5}, fontWeight: {xs: '900', sm: '900'}}}>
          WHAT'S 
        </Typography>

        <Typography style={{ color: `var(--color-color3, ${theme.colors.color3})`}} width={85} marginTop={{xs:-1.2, sm:-2.5}} marginLeft={{xs: 4, sm: 6.5}} fontSize={{xs: 16, sm: 30}} sx={{ letterSpacing: {xs:0, sm: 5}, fontWeight: 900 }}>
          NEW
        </Typography>

      </Stack>)}

      

      <Box marginTop={2}>

        <Box direction={{ xs: 'column', sm: 'row' }} sx={{ display: { sm: 'flex' }, flexDirection: 'row' }}>

          <Stack display={{ sm:'none'}} direction='column' spacing={2} width={{xs: '90%'}} margin={{xs:'auto'}} divider={<Divider orientation='horizontal' flexItem />} >

            {articles ? articles.map((item, idx) => {

            return (
            <Box key={idx}>
              
              <Card sx={{ boxShadow: 'none', backgroundColor: 'white', border: '1px solid #86C232'}}>

                <CardActions>

                  <Stack>

                    {/* TODO: Link this page to the premiere league home page */}

                    <Link to={`/${item.league}/Home`}>

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

                 <CardMedia component='img' loading='lazy' height={200} src={item.url[0]} alt={item.alt}/>
                 
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
              <Grid item key={idx} xs={12} sm={5} md={4} lg={4}>
              
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


                  <CardMedia component='img' loading='lazy' height={200} src={item.url[0]} alt={item.alt}/>

                  <CardContent>
                    <Typography sx={{ color: 'black', fontSize: {xs: 13}}}>
                      {item.body_content.length < 25? item.body_content: (item.body_content.substr(0, 50) + "...")}
                    </Typography>
                  </CardContent>

                </Card>
              </Grid>
            )) : <Skeleton variant="rectangular" width='100%' height={60} />}

          </Grid>

          {/* Side panel in the homepage */}
          {showSidePanel ? (
            level === 'first' ? (
              <Stack width={{ sm:'380px', md: '400px' }} display={{xs:'none', sm:'inherit'}}
              direction='column'
              justifyContent='center'
              alignItems='center'
              spacing={0}
              sx={{ backgroundColor: `var(--color-color3, ${theme.colors.color3})`, borderRadius: '8px'}}
              height={{ sm: '450px'}}>

                {/* <Typography  variant='h3'>Ad Space here</Typography> */}
                <Typography variant='h4' color='white' padding={0} sx={{ paddingTop: 2}}>The Video of The Day</Typography>

                <VideoHighlights VideoLocation='Homepage1' />
                
              </Stack>
            ) : level === 'second' ? (
              <Box display={{ xs: 'none'}}>
                <FixturesData page='home' type='sm' />
              </Box>
            ) : (
              ''
            )
          ) : null}


        </Box>

      </Box>

    </Box>
  )
}

export default TrendingSection 