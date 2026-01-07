import {  Box, Typography, Stack, Button, Card, CardHeader, CardContent, CardMedia, CardActions, Grid, Skeleton, Divider, Menu, MenuItem, Paper, FormControl, Select, InputLabel } from '@mui/material'

import theme from '../../css/theme'
import { Link } from 'react-router-dom'

import GetDABA from "../../modules/DABA/AllDABAData"
import NavBar from "../../components/homePage/NavBar"
import DABAArticles from './DABAArticles'
import FixturesData from '../../components/homePage/Fixtures'
import Points_Table from '../../components/homePage/Points_Table'


import { useSelector } from "react-redux"
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Icons
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import NewspaperIcon from '@mui/icons-material/Newspaper'; //Articles
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'; //Fixtures
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'; //Tables
import AssessmentIcon from '@mui/icons-material/Assessment'; //Stats
import GroupsIcon from '@mui/icons-material/Groups'; //Players
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const DABA = () => {

  GetDABA()

  let players = useSelector((state) => state.DabaPlayers)


  const navigate = useNavigate()  
  const [page, setPage] = useState('home')
  const [team, setTeam] = useState('D-Treads Blazers 1');

  const [type, setType] = useState('now')
  
  const handleChange = (event) => {

    setTeam(event.target.value);
  };


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

  const handleNewsClick = () => {

    switch(selectedChoice){

      case 'Men':
        setPage('home');
        break;
      
      case 'Women':
        setPage('home')
        break;
      
      case 'Div 1':
        setPage('home')
        break;
      
    }
  }

  const handleFixturesClick = () => {

    switch(selectedChoice){

      case 'Men':
        setPage('fixtures_men');
        break;
      
      case 'Women':
        setPage('fixtures_women')
        break;
      
      case 'Div 1':
        setPage('fixtures_div_1')
        break;
      
    }
  }

  const handleTableClick = () => {

    switch(selectedChoice){

      case 'Men':
        setPage('tables_men');
        break;
      
      case 'Women':
        setPage('tables_women')
        break;
      
      case 'Div 1':
        setPage('tables_div_1')
      
    }
  }

  const handleStatsClick = () => {

    switch(selectedChoice){

      case 'Men':
        setPage('stats_men');
        break;
      
      case 'Women':
        setPage('stats_women')
        break;
      
      case 'Div 1':
        setPage('stats_div_1')
        break;
      
    }
  }
  const handlePlayersClick = () => {

    switch(selectedChoice){

      case 'Men':
        setPage('players_men');
        break;
      
      case 'Women':
        setPage('players_women')
        break;
      
      case 'Div 1':
        setPage('players_div_1')
        break;
      
    }
  }

  // Identifying window width
  const getVideoDimensions = () => {
    const windowWidth = window.innerWidth;

    // Adjust these values based on your layout and design preferences
    if (windowWidth >= 500) {
      return {window_width: 500}
    } else if (windowWidth >= 420) {
      return {window_width: 420}
    }else if (windowWidth >= 400) {
      return {window_width: 400}
    }else if (windowWidth >= 390) {
      return {window_width: 390}
    }else if (windowWidth >= 350) {
      return {window_width: 350}
    }
    else if (windowWidth >= 300) {
      return {window_width: 300}
    } 
    else {
      return {window_width: 280}
    }
    
  };

  const { window_width } = getVideoDimensions();




  if(page == 'home'){

    return (

        <>
          <NavBar />
    
          <Box sx={{display: 'flex', flexDirection: 'column', justify: 'center', alignItems: 'center'}}>
            <Typography style={{ color: `var(--color-color2, ${theme.colors.color2})`}} marginTop={{xs: 2}} marginBottom={{xs: 2}} variant="h5" sx={{ textAlign: 'center', fontWeight: 900}}>Dominica Amateur Basketball Association</Typography>
    
            <Box width={{xs: 100}} height={{xs: 100}}>
    
              <img src="https://res.cloudinary.com/djrkottjd/image/upload/v1711418501/Dominica_national_football_team_600e878744.png" width='100%' />
    
            </Box>
    
    
          </Box>
    
          {/* <MainNews /> */}
          <Box marginTop={2} />
    
          <DABAArticles level='first' />


          <Paper style={{ backgroundColor: `var(--color-color1, ${theme.colors.color1})`}} sx={{ width: '100%', height: '50px', position: 'fixed', bottom: 0, display: {xs: 'flex', sm: 'none'}, justifyContent: 'center'}}>
  
            <Stack justifyContent='center' alignItems='center' direction='row' spacing={window_width < 290? 1.8:window_width == 300? 2.5 : window_width == 350? 4: window_width == 390? 3.5: window_width == 400? 4.5: window_width == 420? 4.5: window_width == 500? 5: 2.5}>


              <Box >
                <Button 
                aria-controls="simple-menu" 
                aria-haspopup="true" 
                onClick={handleClick}
                endIcon={<KeyboardArrowUpIcon style={{ color: 'white'}} />}
                style={{fontWeight: 900, textTransform: 'capitalize', color: `var(--color-color3, ${theme.colors.color3})`, padding: '0px'}}
                size='small'
                sx={{ fontSize: {xs: '13px', sm: '15px'}}}>
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
                  <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Men')}>Men</MenuItem>
                  <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Women')}>Women</MenuItem>
                  <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Div 1')}>Division 1</MenuItem>
                </Menu>
              </Box>

              <Box>
                <Button onClick={() => handleNewsClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<NewspaperIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />
              </Box>

              <Box>
                <Button onClick={() => handleFixturesClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<CalendarMonthIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

              </Box>

              

              <Box>
                <Button onClick={() => handleTableClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<FormatListNumberedIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />
              </Box>

              <Box>
                <Button onClick={() => handleStatsClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<AssessmentIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

              </Box>

              <Box>
                <Button onClick={() => handlePlayersClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<GroupsIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

              </Box>


            </Stack>

        </Paper>
    
        </>

    )
  }
  else if(selectedChoice == 'Men' && page == 'fixtures_men'){

    return (
      <>
  
      <NavBar />

      <Box textAlign='center' paddingTop={30} height='100vh'>
        <Typography variant='h3'>Coming Soon</Typography>
      </Box>

      {/* <Box paddingTop={1} />
      
      <FixturesData page='daba' type={type}/>

      
      <Stack justifyContent='center' direction='row' marginTop={3} >

        {type != 'now' ? <Button variant="outlined" onClick={() => setType('now')} size="small">
          Upcoming Fixtures
        </Button>: ''}

        {type != 'past' ? <Button variant="outlined" onClick={() => setType('past')} size="small">
          Past Results
        </Button>: ''}
      </Stack>

      <Box marginTop={8} /> */}
     
  
      <Paper style={{ backgroundColor: `var(--color-color1, ${theme.colors.color1})`}} sx={{ width: '100%', height: '50px', position: 'fixed', bottom: 0, display: {xs: 'flex', sm: 'none'}, justifyContent: 'center'}}>
  
      <Stack justifyContent='center' alignItems='center' direction='row' spacing={window_width < 290? 1.8:window_width == 300? 2.5 : window_width == 350? 4: window_width == 390? 3.5: window_width == 400? 4.5: window_width == 420? 4.5: window_width == 500? 5: 2.5}>

  
          <Box >
            <Button 
            aria-controls="simple-menu" 
            aria-haspopup="true" 
            onClick={handleClick}
            endIcon={<KeyboardArrowUpIcon style={{ color: 'white'}} />}
            style={{fontWeight: 900, textTransform: 'capitalize', color: `var(--color-color3, ${theme.colors.color3})`, padding: '0px'}}
            size='small'
            sx={{ fontSize: {xs: '13px', sm: '15px'}}}>
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
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Men')}>Men</MenuItem>
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Women')}>Women</MenuItem>
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Div 1')}>Division 1</MenuItem>
            </Menu>
          </Box>

          <Box>
            <Button onClick={() => handleNewsClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<NewspaperIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />
          </Box>
  
          <Box>
            <Button onClick={() => handleFixturesClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<CalendarMonthIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>
  
          
  
          <Box>
            <Button onClick={() => handleTableClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<FormatListNumberedIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />
          </Box>

          <Box>
            <Button onClick={() => handleStatsClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<AssessmentIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>
  
          <Box>
            <Button onClick={() => handlePlayersClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<GroupsIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>
  
  
        </Stack>
  
      </Paper>
      
      </>
    )

  }
  else if(selectedChoice == 'Men' && page == 'tables_men'){

    return (
      <>
  
      <NavBar />

      {/* <Points_Table page='daba' /> */}

      <Box textAlign='center' paddingTop={30} height='100vh'>
        <Typography variant='h3'>Coming Soon</Typography>
      </Box>
      
  
      <Paper style={{ backgroundColor: `var(--color-color1, ${theme.colors.color1})`}} sx={{ width: '100%', height: '50px', position: 'fixed', bottom: 0, display: {xs: 'flex', sm: 'none'}, justifyContent: 'center'}}>
  
      <Stack justifyContent='center' alignItems='center' direction='row' spacing={window_width < 290? 1.8:window_width == 300? 2.5 : window_width == 350? 4: window_width == 390? 3.5: window_width == 400? 4.5: window_width == 420? 4.5: window_width == 500? 5: 2.5}>

  
          <Box >
            <Button 
            aria-controls="simple-menu" 
            aria-haspopup="true" 
            onClick={handleClick}
            endIcon={<KeyboardArrowUpIcon style={{ color: 'white'}} />}
            style={{fontWeight: 900, textTransform: 'capitalize', color: `var(--color-color3, ${theme.colors.color3})`, padding: '0px'}}
            size='small'
            sx={{ fontSize: {xs: '13px', sm: '15px'}}}>
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
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Men')}>Men</MenuItem>
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Women')}>Women</MenuItem>
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Div 1')}>Division 1</MenuItem>
            </Menu>
          </Box>

          <Box>
            <Button onClick={() => handleNewsClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<NewspaperIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />
          </Box>
  
          <Box>
            <Button onClick={() => handleFixturesClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<CalendarMonthIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>
  
          
  
          <Box>
            <Button onClick={() => handleTableClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<FormatListNumberedIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />
          </Box>

          <Box>
            <Button onClick={() => handleStatsClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<AssessmentIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>
  
          <Box>
            <Button onClick={() => handlePlayersClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<GroupsIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>
  
  
        </Stack>
  
      </Paper>
      
      </>
    )

  }
  else if(selectedChoice == 'Men' && page == 'stats_men'){

    return (
      <>
  
      <NavBar />

      <Box textAlign='center' paddingTop={30} height='100vh'>
        <Typography variant='h3'>Coming Soon</Typography>
      </Box>
       



        {/* <Stack marginTop={4} marginX={2} >

          <Stack justifyContent='space-between' direction='row'>

            <Typography>Season Stats</Typography>
            <ArrowRightAltIcon />

          </Stack>

            
        </Stack> */}

        <Box marginTop={8} />


            
  
      <Paper style={{ backgroundColor: `var(--color-color1, ${theme.colors.color1})`}} sx={{ width: '100%', height: '50px', position: 'fixed', bottom: 0, display: {xs: 'flex', sm: 'none'}, justifyContent: 'center'}}>

      <Stack justifyContent='center' alignItems='center' direction='row' spacing={window_width < 290? 1.8:window_width == 300? 2.5 : window_width == 350? 4: window_width == 390? 3.5: window_width == 400? 4.5: window_width == 420? 4.5: window_width == 500? 5: 2.5}>


          <Box >
            <Button 
            aria-controls="simple-menu" 
            aria-haspopup="true" 
            onClick={handleClick}
            endIcon={<KeyboardArrowUpIcon style={{ color: 'white'}} />}
            style={{fontWeight: 900, textTransform: 'capitalize', color: `var(--color-color3, ${theme.colors.color3})`, padding: '0px'}}
            size='small'
            sx={{ fontSize: {xs: '13px', sm: '15px'}}}>
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
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Men')}>Men</MenuItem>
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Women')}>Women</MenuItem>
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Div 1')}>Division 1</MenuItem>
            </Menu>
          </Box>

          <Box>
            <Button onClick={() => handleNewsClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<NewspaperIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />
          </Box>

          <Box>
            <Button onClick={() => handleFixturesClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<CalendarMonthIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>

          

          <Box>
            <Button onClick={() => handleTableClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<FormatListNumberedIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />
          </Box>

          <Box>
            <Button onClick={() => handleStatsClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<AssessmentIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>

          <Box>
            <Button onClick={() => handlePlayersClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<GroupsIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>


        </Stack>

      </Paper>
    
      </>
    )

  }
  else if(selectedChoice == 'Men' && page == 'players_men'){

    return (
      <>
  
      <NavBar />

      <Stack paddingTop={3} marginTop={2} direction='row' justifyContent='center' alignContent='center'>

        {/* Choose team */}
        <Box>
          
          {selectedChoice == 'Men'? 
          (<FormControl sx={{ m: 1, minWidth: 80 }}>
            <InputLabel id="demo-simple-select-autowidth-label">Team</InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={team}
                onChange={handleChange}
                autoWidth
                label="Team"
              >
                <MenuItem value={'D-Treads Blazers 1'}>D-Treads Blazers 1</MenuItem>
                <MenuItem value={'Dr. Darroux PSC Falcons 1'}>Dr. Darroux PSC Falcons 1</MenuItem>
                <MenuItem value={'Happi 767 Dominators'}>Happi 767 Dominators</MenuItem>
                <MenuItem value={'Lindo Mart X-Men'}>Lindo Mart X-Men</MenuItem>
                <MenuItem value={'Dr. Mac Prowlers'}>Dr. Mac Prowlers</MenuItem>
                <MenuItem value={'Marigot Sunrise'}>Marigot Sunrise</MenuItem>
                <MenuItem value={'Police Sports Club'}>Police Sports Club</MenuItem>
                <MenuItem value={'Paix Bouche Eagles'}>Paix Bouche Eagles</MenuItem>
                <MenuItem value={'BAA Sharks'}>BAA Sharks</MenuItem>
                {/* <MenuItem value={'Tranquility Beach Middleham United FC'}>Middleham FC</MenuItem> */}
              </Select>
          </FormControl>):selectedChoice == 'Women'? 
          
          (<FormControl sx={{ m: 1, minWidth: 80 }}>
            <InputLabel id="demo-simple-select-autowidth-label">Team</InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={team}
                onChange={handleChange}
                autoWidth
                label="Team"
              >
                <MenuItem value={1}>Goodwill Runner FC</MenuItem>
                <MenuItem value={2}>Bombers FC</MenuItem>
                <MenuItem value={3}>Mahaut Soca Strikers</MenuItem>
                <MenuItem value={4}>Dublanc FC</MenuItem>
                <MenuItem value={5}>Kalinago Warriors FC</MenuItem>
                <MenuItem value={6}>Mighty Avengers FC</MenuItem>
                <MenuItem value={7}>Harlem United FC</MenuItem>
                <MenuItem value={8}>All Saints FC</MenuItem>
                <MenuItem value={9}>Wooty Blazers FC</MenuItem>
                <MenuItem value={10}>Middleham FC</MenuItem>
              </Select>
          </FormControl>): 'First Division Team'}
          
        </Box>

      </Stack>

      

      {players.length > 0 ? players[0].filter(item => item.Team == team ).map((item, idx) => {

        return (
          <Paper  key={idx} sx={{ width: {xs: '93%'}, height: {xs: '100px'}, margin: 'auto', textDecoration: 'none'}}>

            <Link to={`/DABA/Home/Player/${item.id}`} style={{ textDecoration: 'none'}}>

              <Card style={{ height: '100%'}}  sx={{ display: 'flex', justifyContent: 'space-between', marginY: 2}}>
              
              <Box sx={{ display: 'flex', flexDirection: 'column'}}>

                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography style={{ color: `var(--color-color3, ${theme.colors.color3})`}} component="div" variant="h5">
                    {item.First_Name}
                  </Typography>

                  <Typography style={{ color: `var(--color-color2, ${theme.colors.color2})`}}  variant="subtitle1" color="text.secondary" component="div">
                    {item.Last_Name}
                  </Typography>

                  <Typography style={{ color: `var(--color-color1, ${theme.colors.color1})`}}  variant="caption" color="text.secondary" component="div">
                    {item.Position}
                  </Typography>

                </CardContent>

              </Box>

              <CardMedia
                component="img"
                sx={{ width: 80 }}
                image={item.url}
              />

              </Card>
            
            </Link>

            
          </Paper>
        )
      }): <Skeleton />}

      <Box marginTop={7} />
      
  
      <Paper style={{ backgroundColor: `var(--color-color1, ${theme.colors.color1})`}} sx={{ width: '100%', height: '50px', position: 'fixed', bottom: 0, display: {xs: 'flex', sm: 'none'}, justifyContent: 'center'}}>
  
      <Stack justifyContent='center' alignItems='center' direction='row' spacing={window_width < 290? 1.8:window_width == 300? 2.5 : window_width == 350? 4: window_width == 390? 3.5: window_width == 400? 4.5: window_width == 420? 4.5: window_width == 500? 5: 2.5}>

  
          <Box >
            <Button 
            aria-controls="simple-menu" 
            aria-haspopup="true" 
            onClick={handleClick}
            endIcon={<KeyboardArrowUpIcon style={{ color: 'white'}} />}
            style={{fontWeight: 900, textTransform: 'capitalize', color: `var(--color-color3, ${theme.colors.color3})`, padding: '0px'}}
            size='small'
            sx={{ fontSize: {xs: '13px', sm: '15px'}}}>
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
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Men')}>Men</MenuItem>
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Women')}>Women</MenuItem>
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Div 1')}>Division 1</MenuItem>
            </Menu>
          </Box>

          <Box>
            <Button onClick={() => handleNewsClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<NewspaperIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />
          </Box>
  
          <Box>
            <Button onClick={() => handleFixturesClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<CalendarMonthIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>
  
          
  
          <Box>
            <Button onClick={() => handleTableClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<FormatListNumberedIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />
          </Box>

          <Box>
            <Button onClick={() => handleStatsClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<AssessmentIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>
  
          <Box>
            <Button onClick={() => handlePlayersClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<GroupsIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>
  
  
        </Stack>
  
      </Paper>
      
      </>
    )

  }


  else if(selectedChoice == 'Women' && page == 'fixtures_women'){

    return (
      <>
  
      <NavBar />

      <Box paddingTop={1} />
      
      {/* <FixturesData page='dfa' type={type}/>

      
      <Stack justifyContent='center' direction='row' marginTop={7} >

        {type != 'now' ? <Button variant="outlined" onClick={() => setType('now')} size="small">
          Upcoming Fixtures
        </Button>: ''}

        {type != 'past' ? <Button variant="outlined" onClick={() => setType('past')} size="small">
          Past Results
        </Button>: ''}
      </Stack>

      <Box marginTop={8} /> */}

      <Box textAlign='center' marginTop='200px'>
        <Typography variant="h2">
          Coming Soon
        </Typography>
      </Box>
     
  
      <Paper style={{ backgroundColor: `var(--color-color1, ${theme.colors.color1})`}} sx={{ width: '100%', height: '50px', position: 'fixed', bottom: 0, display: {xs: 'flex', sm: 'none'}, justifyContent: 'center'}}>
  
      <Stack justifyContent='center' alignItems='center' direction='row' spacing={window_width < 290? 1.8:window_width == 300? 2.5 : window_width == 350? 4: window_width == 390? 3.5: window_width == 400? 4.5: window_width == 420? 4.5: window_width == 500? 5: 2.5}>

  
          <Box >
            <Button 
            aria-controls="simple-menu" 
            aria-haspopup="true" 
            onClick={handleClick}
            endIcon={<KeyboardArrowUpIcon style={{ color: 'white'}} />}
            style={{fontWeight: 900, textTransform: 'capitalize', color: `var(--color-color3, ${theme.colors.color3})`, padding: '0px'}}
            size='small'
            sx={{ fontSize: {xs: '13px', sm: '15px'}}}>
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
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Men')}>Men</MenuItem>
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Women')}>Women</MenuItem>
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Div 1')}>Division 1</MenuItem>
            </Menu>
          </Box>

          <Box>
            <Button onClick={() => handleNewsClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<NewspaperIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />
          </Box>
  
          <Box>
            <Button onClick={() => handleFixturesClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<CalendarMonthIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>
  
          
  
          <Box>
            <Button onClick={() => handleTableClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<FormatListNumberedIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />
          </Box>

          <Box>
            <Button onClick={() => handleStatsClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<AssessmentIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>
  
          <Box>
            <Button onClick={() => handlePlayersClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<GroupsIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>
  
  
        </Stack>
  
      </Paper>
      
      </>
    )

  }
  else if(selectedChoice == 'Women' && page == 'tables_women'){

    return (
      <>
  
      <NavBar />

      {/* <Points_Table page='dfa' /> */}

      <Box textAlign='center' marginTop='200px'>
        <Typography variant="h2">
          Coming Soon
        </Typography>
      </Box>
      
  
      <Paper style={{ backgroundColor: `var(--color-color1, ${theme.colors.color1})`}} sx={{ width: '100%', height: '50px', position: 'fixed', bottom: 0, display: {xs: 'flex', sm: 'none'}, justifyContent: 'center'}}>
  
      <Stack justifyContent='center' alignItems='center' direction='row' spacing={window_width < 290? 1.8:window_width == 300? 2.5 : window_width == 350? 4: window_width == 390? 3.5: window_width == 400? 4.5: window_width == 420? 4.5: window_width == 500? 5: 2.5}>

  
          <Box >
            <Button 
            aria-controls="simple-menu" 
            aria-haspopup="true" 
            onClick={handleClick}
            endIcon={<KeyboardArrowUpIcon style={{ color: 'white'}} />}
            style={{fontWeight: 900, textTransform: 'capitalize', color: `var(--color-color3, ${theme.colors.color3})`, padding: '0px'}}
            size='small'
            sx={{ fontSize: {xs: '13px', sm: '15px'}}}>
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
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Men')}>Men</MenuItem>
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Women')}>Women</MenuItem>
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Div 1')}>Division 1</MenuItem>
            </Menu>
          </Box>

          <Box>
            <Button onClick={() => handleNewsClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<NewspaperIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />
          </Box>
  
          <Box>
            <Button onClick={() => handleFixturesClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<CalendarMonthIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>
  
          
  
          <Box>
            <Button onClick={() => handleTableClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<FormatListNumberedIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />
          </Box>

          <Box>
            <Button onClick={() => handleStatsClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<AssessmentIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>
  
          <Box>
            <Button onClick={() => handlePlayersClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<GroupsIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>
  
  
        </Stack>
  
      </Paper>
      
      </>
    )

  }
  else if(selectedChoice == 'Women' && page == 'stats_women'){

    return (
      <>
  
      <NavBar />
       

        {/* {player_stats && player_stats.length > 0 ? 

          (<Box paddingTop={3} sx={{ backgroundColor: '#3C4552'}}>

            <Stack spacing={1} justifyContent='center' direction='row' paddingTop={2}>

            
                <Paper sx={{ marginTop: {xs: 10}, width: window_width<290?130:window_width==300?145:window_width==350?168:window_width==390?182:window_width==400?192:window_width==420?200:window_width==500?240:145}} >

                  <Link to='/DFA/Home/PlayerGoals' style={{ textDecoration: 'none'}}>

                    <Card >
                      
                      <CardMedia
                      component="img"
                      image={player_stats[0].top_scorer_prem_url} 
                      sx={{ width:  window_width<290?130:window_width==300?145:window_width==350?168:window_width==390?182:window_width==400?192:window_width==420?200:window_width==500?240:145 }}
                      />

                      <CardContent style={{ textAlign: 'center'}}>

                        <Typography sx={{ fontWeight: 'bold'}}>
                          Goals
                        </Typography>

                        <Typography variant="h4" sx={{ fontWeight: 'bold'}}>
                          {player_stats[0].top_scorer_prem_goals}
                        </Typography>

                      </CardContent>

                    </Card>

                  </Link>
                
                </Paper>


                <Paper sx={{ marginTop: {xs: 10}, width: window_width<290?130:window_width==300?145:window_width==350?168:window_width==390?182:window_width==400?192:window_width==420?200:window_width==500?240:145}}>

                  <Link to='/DFA/Home/PlayerAssists' style={{ textDecoration: 'none'}}>
                    <Card>
                      
                      <CardMedia
                      component="img"
                      image={player_stats[0].top_assist_prem_url} 
                      sx={{ width:  window_width<290?130:window_width==300?145:window_width==350?168:window_width==390?182:window_width==400?192:window_width==420?200:window_width==500?240:145 }}
                      />

                      <CardContent style={{ textAlign: 'center'}}>

                        <Typography sx={{ fontWeight: 'bold'}}>
                          Assists
                        </Typography>

                        <Typography variant="h4" sx={{ fontWeight: 'bold'}}>
                          {player_stats[0].top_assist_prem_assist}
                        </Typography>

                      </CardContent>

                    </Card>
                  
                  </Link>


                </Paper>
                
            </Stack>

            <Stack spacing={1} justifyContent='center' direction='row' marginTop={2} paddingBottom={1}>

              <Paper sx={{ marginTop: {xs: 10}, width: window_width<290?130:window_width==300?145:window_width==350?168:window_width==390?182:window_width==400?192:window_width==420?200:window_width==500?240:145}}>

                <Link to='/DFA/Home/TeamGoals' style={{ textDecoration: 'none'}}>
                  <Card>
                    
                    <CardMedia
                    component="img"
                    image={player_stats[0].top_scorer_prem_url} 
                    sx={{ width:  window_width<290?130:window_width==300?145:window_width==350?168:window_width==390?182:window_width==400?192:window_width==420?200:window_width==500?240:145 }}
                    />

                    <CardContent style={{ textAlign: 'center'}}>

                      <Typography sx={{ fontWeight: 'bold'}}>
                        Team Goals
                      </Typography>

                      <Typography variant="h4" sx={{ fontWeight: 'bold'}}>
                        {team_most_goals[0].totalGoals}
                      </Typography>

                    </CardContent>

                  </Card>
                </Link>
              
              </Paper>


              <Paper sx={{ marginTop: {xs: 10}, width: window_width<290?130:window_width==300?145:window_width==350?168:window_width==390?182:window_width==400?192:window_width==420?200:window_width==500?240:145}}>

                <Link to='/DFA/Home/TeamCleanSheets' style={{ textDecoration: 'none'}}>
                  <Card>

                  <CardMedia
                  component="img"
                  image={player_stats[0].top_clean_sheet_prem_url} 
                  sx={{ width:  window_width<290?130:window_width==300?145:window_width==350?168:window_width==390?182:window_width==400?192:window_width==420?200:window_width==500?240:145 }}
                  />

                  <CardContent style={{ textAlign: 'center'}}>

                    <Typography sx={{ fontWeight: 'bold'}}>
                      Clean Sheets
                    </Typography>

                    <Typography variant="h4" sx={{ fontWeight: 'bold'}}>
                      {player_stats[0].top_clean_sheet_prem_clean_sheets}
                    </Typography>

                  </CardContent>

                  </Card>
                </Link>


              </Paper>

            </Stack>
            
          </Box>)
        
          : <Skeleton width={300} height={300} sx={{ margin: 'auto'}}/>
        }

        <Stack marginTop={4} marginX={2} >

          <Stack justifyContent='space-between' direction='row'>

            <Typography>Season Stats</Typography>
            <ArrowRightAltIcon />

          </Stack>

            
        </Stack> */}

      <Box textAlign='center' marginTop='200px'>
        <Typography variant="h2">
          Coming Soon
        </Typography>
      </Box>

        <Box marginTop={8} />






            
  
      <Paper style={{ backgroundColor: `var(--color-color1, ${theme.colors.color1})`}} sx={{ width: '100%', height: '50px', position: 'fixed', bottom: 0, display: {xs: 'flex', sm: 'none'}, justifyContent: 'center'}}>

      <Stack justifyContent='center' alignItems='center' direction='row' spacing={window_width < 290? 1.8:window_width == 300? 2.5 : window_width == 350? 4: window_width == 390? 3.5: window_width == 400? 4.5: window_width == 420? 4.5: window_width == 500? 5: 2.5}>


          <Box >
            <Button 
            aria-controls="simple-menu" 
            aria-haspopup="true" 
            onClick={handleClick}
            endIcon={<KeyboardArrowUpIcon style={{ color: 'white'}} />}
            style={{fontWeight: 900, textTransform: 'capitalize', color: `var(--color-color3, ${theme.colors.color3})`, padding: '0px'}}
            size='small'
            sx={{ fontSize: {xs: '13px', sm: '15px'}}}>
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
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Men')}>Men</MenuItem>
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Women')}>Women</MenuItem>
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Div 1')}>Division 1</MenuItem>
            </Menu>
          </Box>

          <Box>
            <Button onClick={() => handleNewsClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<NewspaperIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />
          </Box>

          <Box>
            <Button onClick={() => handleFixturesClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<CalendarMonthIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>

          

          <Box>
            <Button onClick={() => handleTableClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<FormatListNumberedIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />
          </Box>

          <Box>
            <Button onClick={() => handleStatsClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<AssessmentIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>

          <Box>
            <Button onClick={() => handlePlayersClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<GroupsIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>


        </Stack>

      </Paper>
    
      </>
    )

  }
  else if(selectedChoice == 'Women' && page == 'players_women'){

    return (
      <>
  
      <NavBar />

      {/* <Stack paddingTop={3} marginTop={2} direction='row' justifyContent='center' alignContent='center'>


        <Box>
          
          {selectedChoice == 'Men'? 
          (<FormControl sx={{ m: 1, minWidth: 80 }}>
            <InputLabel id="demo-simple-select-autowidth-label">Team</InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={team}
                onChange={handleChange}
                autoWidth
                label="Team"
              >
                <MenuItem value={'CCCUL Dublanc FC'}>Dublanc Fc</MenuItem>
                <MenuItem value={'Bombers FC'}>Bombers FC</MenuItem>
                <MenuItem value={'Blue Waters Bath Estate FC'}>Bathestate FC</MenuItem>
                <MenuItem value={'Connect 767 East Central FC'}>East Central FC</MenuItem>
                <MenuItem value={'We United FC'}>We United FC</MenuItem>
                <MenuItem value={'Mahaut Soca Strikers FC'}>Mahaut FC</MenuItem>
                <MenuItem value={'Petro Caribe Point Michel FC'}>Point Michel FC</MenuItem>
                <MenuItem value={'Promex Harlem FC'}>Harlem FC</MenuItem>
                <MenuItem value={'Sagicor South East FC'}>South East FC</MenuItem>
                <MenuItem value={'Tranquility Beach Middleham United FC'}>Middleham FC</MenuItem>
              </Select>
          </FormControl>):selectedChoice == 'Women'? 
          
          (<FormControl sx={{ m: 1, minWidth: 80 }}>
            <InputLabel id="demo-simple-select-autowidth-label">Team</InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={team}
                onChange={handleChange}
                autoWidth
                label="Team"
              >
                <MenuItem value={1}>Goodwill Runner FC</MenuItem>
                <MenuItem value={2}>Bombers FC</MenuItem>
                <MenuItem value={3}>Mahaut Soca Strikers</MenuItem>
                <MenuItem value={4}>Dublanc FC</MenuItem>
                <MenuItem value={5}>Kalinago Warriors FC</MenuItem>
                <MenuItem value={6}>Mighty Avengers FC</MenuItem>
                <MenuItem value={7}>Harlem United FC</MenuItem>
                <MenuItem value={8}>All Saints FC</MenuItem>
                <MenuItem value={9}>Wooty Blazers FC</MenuItem>
                <MenuItem value={10}>Middleham FC</MenuItem>
              </Select>
          </FormControl>): 'First Division Team'}
          
        </Box>

      </Stack> */}

      

      {/* {players.length > 0 ? players[0].filter(item => item.Current_Team == team && item.League === 'DFA').map((item, idx) => {

        return (
          <Paper  key={idx} sx={{ width: {xs: '93%'}, height: {xs: '100px'}, margin: 'auto', textDecoration: 'none'}}>

            <Link to={`/DFA/Home/Player/${item.id}`} style={{ textDecoration: 'none'}}>

              <Card style={{ height: '100%'}}  sx={{ display: 'flex', justifyContent: 'space-between', marginY: 2}}>
              
              <Box sx={{ display: 'flex', flexDirection: 'column'}}>

                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography style={{ color: `var(--color-color3, ${theme.colors.color3})`}} component="div" variant="h5">
                    {item.FirstName}
                  </Typography>

                  <Typography style={{ color: `var(--color-color2, ${theme.colors.color2})`}}  variant="subtitle1" color="text.secondary" component="div">
                    {item.Last_Name}
                  </Typography>

                  <Typography style={{ color: `var(--color-color1, ${theme.colors.color1})`}}  variant="caption" color="text.secondary" component="div">
                    {item.Position}
                  </Typography>

                </CardContent>

              </Box>

              <CardMedia
                component="img"
                sx={{ width: 80 }}
                image={item.url}
              />

              </Card>
            
            </Link>

            
          </Paper>
        )
      }): <Skeleton />} */}

<Box textAlign='center' marginTop='200px'>
        <Typography variant="h2">
          Coming Soon
        </Typography>
      </Box>

      <Box marginTop={7} />
      
  
      <Paper style={{ backgroundColor: `var(--color-color1, ${theme.colors.color1})`}} sx={{ width: '100%', height: '50px', position: 'fixed', bottom: 0, display: {xs: 'flex', sm: 'none'}, justifyContent: 'center'}}>
  
      <Stack justifyContent='center' alignItems='center' direction='row' spacing={window_width < 290? 1.8:window_width == 300? 2.5 : window_width == 350? 4: window_width == 390? 3.5: window_width == 400? 4.5: window_width == 420? 4.5: window_width == 500? 5: 2.5}>

  
          <Box >
            <Button 
            aria-controls="simple-menu" 
            aria-haspopup="true" 
            onClick={handleClick}
            endIcon={<KeyboardArrowUpIcon style={{ color: 'white'}} />}
            style={{fontWeight: 900, textTransform: 'capitalize', color: `var(--color-color3, ${theme.colors.color3})`, padding: '0px'}}
            size='small'
            sx={{ fontSize: {xs: '13px', sm: '15px'}}}>
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
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Men')}>Men</MenuItem>
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Women')}>Women</MenuItem>
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Div 1')}>Division 1</MenuItem>
            </Menu>
          </Box>

          <Box>
            <Button onClick={() => handleNewsClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<NewspaperIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />
          </Box>
  
          <Box>
            <Button onClick={() => handleFixturesClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<CalendarMonthIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>
  
          
  
          <Box>
            <Button onClick={() => handleTableClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<FormatListNumberedIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />
          </Box>

          <Box>
            <Button onClick={() => handleStatsClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<AssessmentIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>
  
          <Box>
            <Button onClick={() => handlePlayersClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<GroupsIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>
  
  
        </Stack>
  
      </Paper>
      
      </>
    )

  }

  
  else if(selectedChoice == 'Div 1' && page == 'fixtures_div_1'){

    return (
      <>
  
      <NavBar />

      <Box paddingTop={1} />
      
      {/* <FixturesData page='dfa' type={type}/>

      
      <Stack justifyContent='center' direction='row' marginTop={7} >

        {type != 'now' ? <Button variant="outlined" onClick={() => setType('now')} size="small">
          Upcoming Fixtures
        </Button>: ''}

        {type != 'past' ? <Button variant="outlined" onClick={() => setType('past')} size="small">
          Past Results
        </Button>: ''}
      </Stack>

      <Box marginTop={8} /> */}

      <Box textAlign='center' marginTop='200px'>
        <Typography variant="h2">
          Coming Soon
        </Typography>
      </Box>
     
  
      <Paper style={{ backgroundColor: `var(--color-color1, ${theme.colors.color1})`}} sx={{ width: '100%', height: '50px', position: 'fixed', bottom: 0, display: {xs: 'flex', sm: 'none'}, justifyContent: 'center'}}>
  
      <Stack justifyContent='center' alignItems='center' direction='row' spacing={window_width < 290? 1.8:window_width == 300? 2.5 : window_width == 350? 4: window_width == 390? 3.5: window_width == 400? 4.5: window_width == 420? 4.5: window_width == 500? 5: 2.5}>

  
          <Box >
            <Button 
            aria-controls="simple-menu" 
            aria-haspopup="true" 
            onClick={handleClick}
            endIcon={<KeyboardArrowUpIcon style={{ color: 'white'}} />}
            style={{fontWeight: 900, textTransform: 'capitalize', color: `var(--color-color3, ${theme.colors.color3})`, padding: '0px'}}
            size='small'
            sx={{ fontSize: {xs: '13px', sm: '15px'}}}>
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
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Men')}>Men</MenuItem>
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Women')}>Women</MenuItem>
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Div 1')}>Division 1</MenuItem>
            </Menu>
          </Box>

          <Box>
            <Button onClick={() => handleNewsClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<NewspaperIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />
          </Box>
  
          <Box>
            <Button onClick={() => handleFixturesClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<CalendarMonthIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>
  
          
  
          <Box>
            <Button onClick={() => handleTableClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<FormatListNumberedIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />
          </Box>

          <Box>
            <Button onClick={() => handleStatsClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<AssessmentIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>
  
          <Box>
            <Button onClick={() => handlePlayersClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<GroupsIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>
  
  
        </Stack>
  
      </Paper>
      
      </>
    )

  }
  else if(selectedChoice == 'Div 1' && page == 'tables_div_1'){

    return (
      <>
  
      <NavBar />

      {/* <Points_Table page='dfa' /> */}

      <Box textAlign='center' marginTop='200px'>
        <Typography variant="h2">
          Coming Soon
        </Typography>
      </Box>
      
  
      <Paper style={{ backgroundColor: `var(--color-color1, ${theme.colors.color1})`}} sx={{ width: '100%', height: '50px', position: 'fixed', bottom: 0, display: {xs: 'flex', sm: 'none'}, justifyContent: 'center'}}>
  
      <Stack justifyContent='center' alignItems='center' direction='row' spacing={window_width < 290? 1.8:window_width == 300? 2.5 : window_width == 350? 4: window_width == 390? 3.5: window_width == 400? 4.5: window_width == 420? 4.5: window_width == 500? 5: 2.5}>

  
          <Box >
            <Button 
            aria-controls="simple-menu" 
            aria-haspopup="true" 
            onClick={handleClick}
            endIcon={<KeyboardArrowUpIcon style={{ color: 'white'}} />}
            style={{fontWeight: 900, textTransform: 'capitalize', color: `var(--color-color3, ${theme.colors.color3})`, padding: '0px'}}
            size='small'
            sx={{ fontSize: {xs: '13px', sm: '15px'}}}>
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
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Men')}>Men</MenuItem>
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Women')}>Women</MenuItem>
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Div 1')}>Division 1</MenuItem>
            </Menu>
          </Box>

          <Box>
            <Button onClick={() => handleNewsClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<NewspaperIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />
          </Box>
  
          <Box>
            <Button onClick={() => handleFixturesClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<CalendarMonthIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>
  
          
  
          <Box>
            <Button onClick={() => handleTableClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<FormatListNumberedIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />
          </Box>

          <Box>
            <Button onClick={() => handleStatsClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<AssessmentIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>
  
          <Box>
            <Button onClick={() => handlePlayersClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<GroupsIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>
  
  
        </Stack>
  
      </Paper>
      
      </>
    )

  }
  else if(selectedChoice == 'Div 1' && page == 'stats_div_1'){

    return (
      <>
  
      <NavBar />
       

        {/* {player_stats && player_stats.length > 0 ? 

          (<Box paddingTop={3} sx={{ backgroundColor: '#3C4552'}}>

            <Stack spacing={1} justifyContent='center' direction='row' paddingTop={2}>

            
                <Paper sx={{ marginTop: {xs: 10}, width: window_width<290?130:window_width==300?145:window_width==350?168:window_width==390?182:window_width==400?192:window_width==420?200:window_width==500?240:145}} >

                  <Link to='/DFA/Home/PlayerGoals' style={{ textDecoration: 'none'}}>

                    <Card >
                      
                      <CardMedia
                      component="img"
                      image={player_stats[0].top_scorer_prem_url} 
                      sx={{ width:  window_width<290?130:window_width==300?145:window_width==350?168:window_width==390?182:window_width==400?192:window_width==420?200:window_width==500?240:145 }}
                      />

                      <CardContent style={{ textAlign: 'center'}}>

                        <Typography sx={{ fontWeight: 'bold'}}>
                          Goals
                        </Typography>

                        <Typography variant="h4" sx={{ fontWeight: 'bold'}}>
                          {player_stats[0].top_scorer_prem_goals}
                        </Typography>

                      </CardContent>

                    </Card>

                  </Link>
                
                </Paper>


                <Paper sx={{ marginTop: {xs: 10}, width: window_width<290?130:window_width==300?145:window_width==350?168:window_width==390?182:window_width==400?192:window_width==420?200:window_width==500?240:145}}>

                  <Link to='/DFA/Home/PlayerAssists' style={{ textDecoration: 'none'}}>
                    <Card>
                      
                      <CardMedia
                      component="img"
                      image={player_stats[0].top_assist_prem_url} 
                      sx={{ width:  window_width<290?130:window_width==300?145:window_width==350?168:window_width==390?182:window_width==400?192:window_width==420?200:window_width==500?240:145 }}
                      />

                      <CardContent style={{ textAlign: 'center'}}>

                        <Typography sx={{ fontWeight: 'bold'}}>
                          Assists
                        </Typography>

                        <Typography variant="h4" sx={{ fontWeight: 'bold'}}>
                          {player_stats[0].top_assist_prem_assist}
                        </Typography>

                      </CardContent>

                    </Card>
                  
                  </Link>


                </Paper>
                
            </Stack>

            <Stack spacing={1} justifyContent='center' direction='row' marginTop={2} paddingBottom={1}>

              <Paper sx={{ marginTop: {xs: 10}, width: window_width<290?130:window_width==300?145:window_width==350?168:window_width==390?182:window_width==400?192:window_width==420?200:window_width==500?240:145}}>

                <Link to='/DFA/Home/TeamGoals' style={{ textDecoration: 'none'}}>
                  <Card>
                    
                    <CardMedia
                    component="img"
                    image={player_stats[0].top_scorer_prem_url} 
                    sx={{ width:  window_width<290?130:window_width==300?145:window_width==350?168:window_width==390?182:window_width==400?192:window_width==420?200:window_width==500?240:145 }}
                    />

                    <CardContent style={{ textAlign: 'center'}}>

                      <Typography sx={{ fontWeight: 'bold'}}>
                        Team Goals
                      </Typography>

                      <Typography variant="h4" sx={{ fontWeight: 'bold'}}>
                        {team_most_goals[0].totalGoals}
                      </Typography>

                    </CardContent>

                  </Card>
                </Link>
              
              </Paper>


              <Paper sx={{ marginTop: {xs: 10}, width: window_width<290?130:window_width==300?145:window_width==350?168:window_width==390?182:window_width==400?192:window_width==420?200:window_width==500?240:145}}>

                <Link to='/DFA/Home/TeamCleanSheets' style={{ textDecoration: 'none'}}>
                  <Card>

                  <CardMedia
                  component="img"
                  image={player_stats[0].top_clean_sheet_prem_url} 
                  sx={{ width:  window_width<290?130:window_width==300?145:window_width==350?168:window_width==390?182:window_width==400?192:window_width==420?200:window_width==500?240:145 }}
                  />

                  <CardContent style={{ textAlign: 'center'}}>

                    <Typography sx={{ fontWeight: 'bold'}}>
                      Clean Sheets
                    </Typography>

                    <Typography variant="h4" sx={{ fontWeight: 'bold'}}>
                      {player_stats[0].top_clean_sheet_prem_clean_sheets}
                    </Typography>

                  </CardContent>

                  </Card>
                </Link>


              </Paper>

            </Stack>
            
          </Box>)
        
          : <Skeleton width={300} height={300} sx={{ margin: 'auto'}}/>
        }

        <Stack marginTop={4} marginX={2} >

          <Stack justifyContent='space-between' direction='row'>

            <Typography>Season Stats</Typography>
            <ArrowRightAltIcon />

          </Stack>

            
        </Stack> */}

      <Box textAlign='center' marginTop='200px'>
        <Typography variant="h2">
          Coming Soon
        </Typography>
      </Box>

        <Box marginTop={8} />






            
  
      <Paper style={{ backgroundColor: `var(--color-color1, ${theme.colors.color1})`}} sx={{ width: '100%', height: '50px', position: 'fixed', bottom: 0, display: {xs: 'flex', sm: 'none'}, justifyContent: 'center'}}>

      <Stack justifyContent='center' alignItems='center' direction='row' spacing={window_width < 290? 1.8:window_width == 300? 2.5 : window_width == 350? 4: window_width == 390? 3.5: window_width == 400? 4.5: window_width == 420? 4.5: window_width == 500? 5: 2.5}>


          <Box >
            <Button 
            aria-controls="simple-menu" 
            aria-haspopup="true" 
            onClick={handleClick}
            endIcon={<KeyboardArrowUpIcon style={{ color: 'white'}} />}
            style={{fontWeight: 900, textTransform: 'capitalize', color: `var(--color-color3, ${theme.colors.color3})`, padding: '0px'}}
            size='small'
            sx={{ fontSize: {xs: '13px', sm: '15px'}}}>
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
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Men')}>Men</MenuItem>
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Women')}>Women</MenuItem>
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Div 1')}>Division 1</MenuItem>
            </Menu>
          </Box>

          <Box>
            <Button onClick={() => handleNewsClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<NewspaperIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />
          </Box>

          <Box>
            <Button onClick={() => handleFixturesClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<CalendarMonthIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>

          

          <Box>
            <Button onClick={() => handleTableClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<FormatListNumberedIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />
          </Box>

          <Box>
            <Button onClick={() => handleStatsClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<AssessmentIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>

          <Box>
            <Button onClick={() => handlePlayersClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<GroupsIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>


        </Stack>

      </Paper>
    
      </>
    )

  }
  else if(selectedChoice == 'Div 1' && page == 'players_div_1'){

    return (
      <>
  
      <NavBar />

      {/* <Stack paddingTop={3} marginTop={2} direction='row' justifyContent='center' alignContent='center'>


        <Box>
          
          {selectedChoice == 'Men'? 
          (<FormControl sx={{ m: 1, minWidth: 80 }}>
            <InputLabel id="demo-simple-select-autowidth-label">Team</InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={team}
                onChange={handleChange}
                autoWidth
                label="Team"
              >
                <MenuItem value={'CCCUL Dublanc FC'}>Dublanc Fc</MenuItem>
                <MenuItem value={'Bombers FC'}>Bombers FC</MenuItem>
                <MenuItem value={'Blue Waters Bath Estate FC'}>Bathestate FC</MenuItem>
                <MenuItem value={'Connect 767 East Central FC'}>East Central FC</MenuItem>
                <MenuItem value={'We United FC'}>We United FC</MenuItem>
                <MenuItem value={'Mahaut Soca Strikers FC'}>Mahaut FC</MenuItem>
                <MenuItem value={'Petro Caribe Point Michel FC'}>Point Michel FC</MenuItem>
                <MenuItem value={'Promex Harlem FC'}>Harlem FC</MenuItem>
                <MenuItem value={'Sagicor South East FC'}>South East FC</MenuItem>
                <MenuItem value={'Tranquility Beach Middleham United FC'}>Middleham FC</MenuItem>
              </Select>
          </FormControl>):selectedChoice == 'Women'? 
          
          (<FormControl sx={{ m: 1, minWidth: 80 }}>
            <InputLabel id="demo-simple-select-autowidth-label">Team</InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={team}
                onChange={handleChange}
                autoWidth
                label="Team"
              >
                <MenuItem value={1}>Goodwill Runner FC</MenuItem>
                <MenuItem value={2}>Bombers FC</MenuItem>
                <MenuItem value={3}>Mahaut Soca Strikers</MenuItem>
                <MenuItem value={4}>Dublanc FC</MenuItem>
                <MenuItem value={5}>Kalinago Warriors FC</MenuItem>
                <MenuItem value={6}>Mighty Avengers FC</MenuItem>
                <MenuItem value={7}>Harlem United FC</MenuItem>
                <MenuItem value={8}>All Saints FC</MenuItem>
                <MenuItem value={9}>Wooty Blazers FC</MenuItem>
                <MenuItem value={10}>Middleham FC</MenuItem>
              </Select>
          </FormControl>): 'First Division Team'}
          
        </Box>

      </Stack> */}

      

      {/* {players.length > 0 ? players[0].filter(item => item.Current_Team == team && item.League === 'DFA').map((item, idx) => {

        return (
          <Paper  key={idx} sx={{ width: {xs: '93%'}, height: {xs: '100px'}, margin: 'auto', textDecoration: 'none'}}>

            <Link to={`/DFA/Home/Player/${item.id}`} style={{ textDecoration: 'none'}}>

              <Card style={{ height: '100%'}}  sx={{ display: 'flex', justifyContent: 'space-between', marginY: 2}}>
              
              <Box sx={{ display: 'flex', flexDirection: 'column'}}>

                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography style={{ color: `var(--color-color3, ${theme.colors.color3})`}} component="div" variant="h5">
                    {item.FirstName}
                  </Typography>

                  <Typography style={{ color: `var(--color-color2, ${theme.colors.color2})`}}  variant="subtitle1" color="text.secondary" component="div">
                    {item.Last_Name}
                  </Typography>

                  <Typography style={{ color: `var(--color-color1, ${theme.colors.color1})`}}  variant="caption" color="text.secondary" component="div">
                    {item.Position}
                  </Typography>

                </CardContent>

              </Box>

              <CardMedia
                component="img"
                sx={{ width: 80 }}
                image={item.url}
              />

              </Card>
            
            </Link>

            
          </Paper>
        )
      }): <Skeleton />} */}

<Box textAlign='center' marginTop='200px'>
        <Typography variant="h2">
          Coming Soon
        </Typography>
      </Box>

      <Box marginTop={7} />
      
  
      <Paper style={{ backgroundColor: `var(--color-color1, ${theme.colors.color1})`}} sx={{ width: '100%', height: '50px', position: 'fixed', bottom: 0, display: {xs: 'flex', sm: 'none'}, justifyContent: 'center'}}>
  
      <Stack justifyContent='center' alignItems='center' direction='row' spacing={window_width < 290? 1.8:window_width == 300? 2.5 : window_width == 350? 4: window_width == 390? 3.5: window_width == 400? 4.5: window_width == 420? 4.5: window_width == 500? 5: 2.5}>

  
          <Box >
            <Button 
            aria-controls="simple-menu" 
            aria-haspopup="true" 
            onClick={handleClick}
            endIcon={<KeyboardArrowUpIcon style={{ color: 'white'}} />}
            style={{fontWeight: 900, textTransform: 'capitalize', color: `var(--color-color3, ${theme.colors.color3})`, padding: '0px'}}
            size='small'
            sx={{ fontSize: {xs: '13px', sm: '15px'}}}>
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
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Men')}>Men</MenuItem>
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Women')}>Women</MenuItem>
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Div 1')}>Division 1</MenuItem>
            </Menu>
          </Box>

          <Box>
            <Button onClick={() => handleNewsClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<NewspaperIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />
          </Box>
  
          <Box>
            <Button onClick={() => handleFixturesClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<CalendarMonthIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>
  
          
  
          <Box>
            <Button onClick={() => handleTableClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<FormatListNumberedIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />
          </Box>

          <Box>
            <Button onClick={() => handleStatsClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<AssessmentIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>
  
          <Box>
            <Button onClick={() => handlePlayersClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }} startIcon={<GroupsIcon style={{ color: `var(--color-color4, ${theme.colors.color3})`, fontSize: '20px' }} />} />

          </Box>
  
  
        </Stack>
  
      </Paper>
      
      </>
    )

  }


}

export default DABA