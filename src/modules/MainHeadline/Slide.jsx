import {  Box, Typography, Stack, Button, Skeleton } from '@mui/material'
import { Link } from 'react-router-dom';

import '../../css/MainNewsCss.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slide = ({ headline }) => {

 
  
  return (


    <Box width={{ xs:'100%'}}  sx={{ display: 'flex', justifyContent: 'center', overflow: 'hidden'}} marginTop={{xs: 0, sm: 4}}>

      
      
      <Box width={{xs: '100%', sm: '90%'}} height={{xs: 330, sm: 400}} sx={{ position: {xs: 'relative', sm: 'static'}}}>

        <Link to={`/${headline['id']}`}>
          <img loading='lazy' src={headline.url[0]} className='mainImage'/>
        </Link>


        <Box paddingLeft={{sm: 1.5}} sx={{ position: {xs: 'absolute', sm: 'absolute'},  bottom: {xs: 18, sm: 0}, left: {xs: 12, sm: 'inherit'}, display: {sm: 'flex'}, justifyContent: {sm: 'center'} }}>

          <Stack direction='column'>

            <Box>
              <Typography fontSize={{xs: 10, sm: 14}} sx={{ color: 'white', fontFamily: 'Josefin Slab', letterSpacing: 3, textAlign: {xs: 'none'}, fontWeight: 900}}>{headline.league}</Typography>
            </Box>

            <Box>
              <Typography fontSize={{xs: 12, sm: 25}} sx={{ color: {xs:'white', sm: 'white', fontWeight: 900}}}>{headline.title}</Typography>
            </Box>

          </Stack>      

        </Box>

      </Box>

    </Box>
  )
}

export default Slide