
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';

import Tab from '@mui/material/Tab';

import { TabContext, TabList, TabPanel } from "@mui/lab";

import { useState } from "react";

import NavBar from "../../components/homePage/NavBar"
import Points_Table from "../../components/homePage/Points_Table"

const LeagueStanding = () => {

  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  


  return (
    <Box >

      <NavBar />

      <Box paddingTop={{ sm: 10}} height='100%'>

        <TabContext value={value}>

          <TabList onChange={handleChange} aria-label="tabs example" centered>
                    <Tab label='Premier' value='1' />
                    <Tab label='Division One' value='2' />
                    <Tab label='Women' value='3' />
          </TabList>


          <TabPanel  value='1'>
            <Points_Table page='dfa' />
          </TabPanel>

          <TabPanel  value='2'>
            <Points_Table page='div_1' />
          </TabPanel>

          <TabPanel  value='3'>

            <Box textAlign='center' paddingY={20}>

              <Typography variant="h2">Soon Populated</Typography>
            </Box>
          </TabPanel>

        </TabContext>

      </Box>



      
    </Box>
  )
}

export default LeagueStanding