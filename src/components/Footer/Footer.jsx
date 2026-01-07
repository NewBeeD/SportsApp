import { Container, Typography, Box } from "@mui/material"
import { Link } from "react-router-dom"
import theme from "../../css/theme"


import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';

import {  IconButton } from '@mui/material'

const Footer = () => {


  return (

    <footer >
      <Container maxWidth="sm" >
        <Typography variant="body1" align="center">
          © {new Date().getFullYear()} DSport
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center">
          <IconButton  color="inherit" aria-label="instagram" href="">
            <InstagramIcon />
          </IconButton>
          <IconButton  color="inherit" aria-label="facebook" href="">
            <FacebookIcon />
          </IconButton>
          <IconButton  color="inherit" aria-label="twitter" href="">
            <XIcon />
          </IconButton>
          
        </Typography>



        <Typography variant="body2" color="textSecondary" align="center" >
          {'Site by '}
          <Link color="inherit" style={{ textDecoration: 'none'}}>
            Danphil Daniel
          </Link>
          
        </Typography>

        <Box width='100%' textAlign='center'>
          <Typography variant="caption" >For any inquiries, contact me on 767-614-0626 or email : danieldanphil@gmail.com</Typography>

        </Box>

      </Container>
    </footer>
  )
}

export default Footer