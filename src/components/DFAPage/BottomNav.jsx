import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


import Stack from '@mui/material/Stack';     
import Paper from '@mui/material/Paper';      
import Menu from '@mui/material/Menu';       
import MenuItem from '@mui/material/MenuItem'; 
import { useState } from 'react'

import '../../css/DfaMainPage.css'

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


const BottomNav = () => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState('Men');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (choice) => {
    setSelectedChoice(choice);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  return (

    <Paper sx={{ width: '100%', height: '50px', position: 'fixed', bottom: 0, display: {xs: 'flex', sm: 'none'}, justifyContent: 'center', backgroundColor: 'blue'}}>

      <Stack justifyContent='center' alignItems='center' direction='row' spacing={1.3}>

        <Box>
          <Button 
          aria-controls="simple-menu" 
          aria-haspopup="true" 
          onClick={handleClick}
          endIcon={<KeyboardArrowUpIcon style={{ color: 'white'}} />}
          style={{ textTransform: 'capitalize', fontSize: '12px', color: 'white', padding: '0px'}}
          size='small'>
            {selectedChoice}
          </Button>

          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top', // Position of the anchor element
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'bottom', // Position of the menu
              horizontal: 'left',
            }}
          >
            <MenuItem onClick={() => handleMenuItemClick('Men')}>Men</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('Women')}>Women</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('Div 1')}>Division 1</MenuItem>
          </Menu>
        </Box>

        <Box>
          <Button size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }}>
            <Typography style={{ fontSize: '12px', fontWeight: 'bold', color: 'white'}}>Fixtures</Typography>
          </Button>
        </Box>

        <Box>
          <Button size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }}>
            <Typography style={{ fontSize: '12px', fontWeight: 'bold', color: 'white'}}>Results</Typography>
          </Button>
        </Box>

        <Box>
          <Button size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }}>
            <Typography style={{ fontSize: '12px', fontWeight: 'bold', color: 'white'}}>Tables</Typography>
          </Button>
        </Box>

        <Box>
          <Button size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }}>
            <Typography style={{ fontSize: '12px', fontWeight: 'bold', color: 'white'}}>Players</Typography>
          </Button>
        </Box>


      </Stack>

    </Paper>

  )
}

export default BottomNav