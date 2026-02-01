import {  Box, Typography, Stack, Button, Skeleton } from '@mui/material'
import { Link } from 'react-router-dom';

import '../../css/MainNewsCss.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slide = ({ headline }) => {

 
  
  return (


    <Box width={{ xs:'100%'}} sx={{ display: 'flex', justifyContent: 'center', overflow: 'hidden' }} marginTop={{xs: 0, sm: 4}}>

      <Box
        width={{xs: '100%', sm: '90%'}}
        height={{xs: 330, sm: 400}}
        sx={{ position: 'relative', overflow: 'hidden' }}
      >

        <Link to={`/${headline['id']}`}>
          <img loading='lazy' src={headline.url[0]} className='mainImage'/>
        </Link>


        {/* Bottom overlay to ensure readability + prevent overflow */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            px: { xs: 1.5, sm: 2.5 },
            py: { xs: 1.5, sm: 2 },
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.82) 55%, rgba(0,0,0,0.92) 100%)',
            pointerEvents: 'none',
          }}
        >
          <Stack direction='column' sx={{ maxWidth: { xs: '100%', lg: '80%' } }}>
            <Typography
              fontSize={{xs: 10, sm: 14}}
              sx={{
                color: 'white',
                fontFamily: 'Josefin Slab',
                letterSpacing: 3,
                fontWeight: 900,
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 1,
                overflow: 'hidden',
              }}
            >
              {headline.league}
            </Typography>

            <Typography
              fontSize={{xs: 14, sm: 26, md: 30}}
              sx={{
                color: 'white',
                fontWeight: 900,
                lineHeight: 1.15,
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: { xs: 2, sm: 2, md: 2 },
                overflow: 'hidden',
              }}
            >
              {headline.title}
            </Typography>
          </Stack>
        </Box>

      </Box>

    </Box>
  )
}

export default Slide