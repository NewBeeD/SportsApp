import {  Box, Typography, Stack, Button, Card, CardHeader, CardContent, CardMedia, CardActions, Grid, Skeleton, Divider, Menu, MenuItem, Paper, FormControl, Select, InputLabel } from '@mui/material'

import HomeIcon from '@mui/icons-material/Home';

import theme from '../../css/theme';

const TeamPlayer = () => {
  
  
  
  return (

    <Box width={{xs:'100%', sm: 800}} sx={{margin: {xs: 0, sm: 'auto'}}}>
    
    <Stack marginTop={2} direction='row' justifyContent='center' alignContent='center'>

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

    </Stack>

      

      {players.length > 0 ? players[0].filter(item => item.Current_Team == team && item.League === 'DFA').map((item, idx) => {

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
      }): <Skeleton />}

      <Box marginTop={7} />
      
  
      <Paper style={{ backgroundColor: `var(--color-color1, ${theme.colors.color1})`}} sx={{ width: '100%', height: '50px', position: 'fixed', bottom: 0, display: {xs: 'flex', sm: 'none'}, justifyContent: 'center'}}>
  
        <Stack justifyContent='center' alignItems='center' direction='row' spacing={1.8}>

  
          <Box >
            <Button 
            aria-controls="simple-menu" 
            aria-haspopup="true" 
            onClick={handleClick}
            endIcon={<KeyboardArrowUpIcon style={{ color: 'white'}} />}
            style={{fontWeight: 900, textTransform: 'capitalize', fontSize: '15px', color: `var(--color-color3, ${theme.colors.color3})`, padding: '0px'}}
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
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Men')}>Men</MenuItem>
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Women')}>Women</MenuItem>
              <MenuItem style={{ color: `var(--color-color3, ${theme.colors.color3})`}} onClick={() => handleMenuItemClick('Div 1')}>Division 1</MenuItem>
            </Menu>
          </Box>
  
          <Box>
            <Button onClick={() => handleFixturesClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }}>
              <Typography style={{ fontSize: '16px', fontWeight: 'bold', color: `var(--color-color4, ${theme.colors.color3})` }}>Fixtures</Typography>
            </Button>
          </Box>
  
          
  
          <Box>
            <Button onClick={() => handleTableClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }}>
              <Typography style={{ fontSize: '16px', fontWeight: 'bold', color: `var(--color-color4, ${theme.colors.color3})`}}>Tables</Typography>
            </Button>
          </Box>

          <Box>
            <Button onClick={() => handleStatsClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }}>
              <Typography style={{ fontSize: '16px', fontWeight: 'bold', color: `var(--color-color4, ${theme.colors.color3})`}}>Stats</Typography>
            </Button>
          </Box>
  
          <Box>
            <Button onClick={() => handlePlayersClick()} size='small' style={{ textTransform: 'capitalize',  padding: 0, minWidth: 'inherit' }}>
              <Typography style={{ fontSize: '16px', fontWeight: 'bold', color: `var(--color-color4, ${theme.colors.color3})`}}>Players</Typography>
            </Button>
          </Box>
  
  
        </Stack>
  
      </Paper>
    </Box>


  )
}

export default TeamPlayer