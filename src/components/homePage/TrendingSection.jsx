/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import CardMedia from '@mui/material/CardMedia';
import Skeleton from '@mui/material/Skeleton';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CardActionArea from '@mui/material/CardActionArea';

import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

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
  let articles = articles_raw?.[0]
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

  const getExcerpt = (item) => {
    const text = typeof item?.body_content === 'string' ? item.body_content : '';
    if (!text) return '';
    return text.length <= 80 ? text : `${text.slice(0, 80)}...`;
  };

  const FeaturedCard = ({ item }) => (
    <Card
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
    // let part_size = articles_length ? Math.ceil(articles_length/3): 0;
        border: `1px solid ${theme.colors.divider}`,
        backgroundColor: theme.colors.background,
      }}
    >
      <CardActionArea
        to={`/${item.id}`}
        component={Link}
        sx={{
          display: 'block',
          position: 'relative',
          '&:hover .ts-media': { transform: 'scale(1.03)' },
        }}
      >
        <Box sx={{ position: 'relative', height: { sm: 320, md: 360, lg: 420, xl: 460 } }}>
          {item?.url?.[0] ? (
            <CardMedia
              component='img'
              className='ts-media'
              loading='lazy'
              src={item.url[0]}
              alt={item.alt || item.title}
              sx={{
                height: '100%',
                width: '100%',
                objectFit: 'cover',
                transition: 'transform 200ms ease',
              }}
            />
          ) : (
            <Skeleton variant='rectangular' width='100%' height='100%' />
          )}

          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.65) 72%, rgba(0,0,0,0.85) 100%)',
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              p: 2.25,
              color: theme.colors.textInverse,
            }}
          >
            <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 1 }}>
              <Chip
                label={(item?.type || 'News').toUpperCase()}
                size='small'
                sx={{
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.textInverse,
                  fontWeight: 900,
                }}
              />
              <Typography sx={{ fontSize: 12, opacity: 0.9 }}>
                {item.time}
              </Typography>
            </Stack>

            <Typography
              sx={{
                fontWeight: 900,
                fontSize: { sm: 22, md: 26, lg: 30, xl: 32 },
                lineHeight: 1.15,
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
              }}
            >
              {item.title}
            </Typography>

            <Typography
              sx={{
                mt: 1,
                fontSize: { xs: 13, md: 14, lg: 15 },
                opacity: 0.95,
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
              }}
            >
              {getExcerpt(item)}
            </Typography>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );

  const CompactCard = ({ item }) => (
    <Card
      sx={{
        borderRadius: 2.5,
        overflow: 'hidden',
        boxShadow: '0 10px 24px rgba(0,0,0,0.10)',
        border: `1px solid ${theme.colors.divider}`,
        backgroundColor: theme.colors.background,
      }}
    >
      <CardActionArea
        to={`/${item.id}`}
        component={Link}
        sx={{
          display: 'flex',
          gap: 1.5,
          p: 1.25,
          alignItems: 'center',
          '&:hover': { backgroundColor: theme.colors.lightGray },
        }}
      >
        <Box
          sx={{
            width: { xs: 92, md: 104, lg: 112 },
            height: { xs: 72, md: 80, lg: 86 },
            flex: '0 0 auto',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {item?.url?.[0] ? (
            <CardMedia
              component='img'
              loading='lazy'
              src={item.url[0]}
              alt={item.alt || item.title}
              sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Skeleton variant='rectangular' width='100%' height='100%' />
          )}
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction='row' spacing={1} alignItems='center'>
            <Typography
              sx={{
                fontSize: { xs: 11, md: 12, lg: 12 },
                fontWeight: 900,
                color: theme.colors.secondary,
                textTransform: 'uppercase',
              }}
            >
              {(item?.type || 'News').toUpperCase()}
            </Typography>
            <Divider orientation='vertical' flexItem />
            <Typography sx={{ fontSize: { xs: 11, md: 12, lg: 12 }, color: theme.colors.textTertiary }}>
              {item.time}
            </Typography>
          </Stack>

          <Typography
            sx={{
              mt: 0.25,
              fontWeight: 900,
              fontSize: { xs: 14, md: 15, lg: 16 },
              color: theme.colors.textPrimary,
              lineHeight: 1.2,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              overflow: 'hidden',
            }}
          >
            {item.title}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );


  const desktopItems = Array.isArray(articles) ? articles : null;
  const featured = desktopItems?.[0];
  const rest = desktopItems?.slice(1) ?? [];

  return (
    <Box sx={{ backgroundColor: {xs: theme.colors.surface, sm: 'transparent'} }} marginBottom={4} >  

      {level == 'second'? '':level == 'third'? '':level == 'fourth'? '':level == 'fifth'? '':(
        <Stack marginBottom={{xs: 2}}>
          <Stack direction='row' spacing={1.5} alignItems='center' sx={{ px: { xs: 2, sm: 2 }, pt: { xs: 2.5, sm: 3 } }}>
            <Box sx={{ width: 10, height: 28, borderRadius: 99, backgroundColor: theme.colors.secondary }} />
            <Typography
              sx={{
                color: theme.colors.textPrimary,
                fontSize: { xs: 16, sm: 22, md: 24, lg: 26 },
                fontWeight: 900,
                letterSpacing: { xs: 0.5, sm: 2 },
                textTransform: 'uppercase',
              }}
            >
              What’s New
            </Typography>
          </Stack>
        </Stack>
      )}

      

      <Box marginTop={2}>

        <Box direction={{ xs: 'column', sm: 'row' }} sx={{ display: { sm: 'flex' }, flexDirection: 'row' }}>

          {/* Mobile: modern compact list */}
          <Stack
            display={{ sm:'none'}}
            direction='column'
            spacing={1.5}
            width={{xs: '92%'}}
            margin={{xs:'auto'}}
          >
            {articles ? (
              articles.map((item) => (
                <CompactCard key={item.id} item={item} />
              ))
            ) : (
              <Skeleton variant="rectangular" width='100%' height={120} />
            )}
          </Stack>


          {/* Desktop: featured + list */}
          <Grid
            display={{ xs:'none', sm: 'grid'}}
            container
            spacing={2}
            marginX={2}
            paddingRight={2}
            sx={{ flex: '1 1 auto', minWidth: 0 }}
          >
            {featured ? (
              <>
                <Grid item xs={12} md={7}>
                  <FeaturedCard item={featured} />
                </Grid>
                <Grid item xs={12} md={5}>
                  <Stack spacing={1.5}>
                    {rest.length > 0 ? rest.map((item) => (
                      <CompactCard key={item.id} item={item} />
                    )) : null}
                  </Stack>
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <Skeleton variant="rectangular" width='100%' height={260} />
              </Grid>
            )}
          </Grid>

          {/* Side panel in the homepage */}
          {showSidePanel ? (
            level === 'first' ? (
              <Stack width={{ sm:'380px', md: '400px', lg: '460px', xl: '520px' }} display={{xs:'none', sm:'inherit'}}
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

TrendingSection.propTypes = {
  level: PropTypes.string,
  showSidePanel: PropTypes.bool,
};