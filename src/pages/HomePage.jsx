import { Box, Stack } from "@mui/material"
import NavBar from "../components/homePage/NavBar"
import MainNews from "../components/homePage/MainNews"
import TrendingSection from "../components/homePage/TrendingSection"
import Points_Table from "../components/homePage/Points_Table"
import FixturesData from "../components/homePage/Fixtures"
import Footer from "../components/Footer/Footer"

import Tab from "@mui/material/Tab"; 

import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useState } from "react"


const HomePage = () => {

  
  // const [leagueNames, setLeagueNames] = useState(['dfa', 'daba'])

  let first = 'first';
  let second = 'second';
  let third = 'third';
  let fourth = 'fourth';

  const [value, setValue] = useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (

    <Box >

      <NavBar />
      <Box marginTop={7} />

      <Box width={{xs:'100%', sm: 800, md: 1200}} sx={{margin: {xs: 0, sm: 'auto'}}}>

        <MainNews />
        <TrendingSection level={first}/>
        {/* <Stack direction='row'>
          <FixturesData page='home' />
        </Stack> */}
        <TrendingSection level={second}/>

        {/* Tabs for fixtures and Points */}
        <Box marginTop={{ sm: 7}} height='100%'>

          <TabContext value={value}>

            <TabList onChange={handleChange} aria-label="tabs example" centered >
                      <Tab label='Table' value={1}  />
                      <Tab label='Fixtures' value={2}  />
            </TabList>


            <TabPanel  value={1}>

              <Points_Table page='Homepage'/>

            </TabPanel>

            <TabPanel  value={2}>

              <FixturesData page='home' type="now" league='DFA' />
              
            </TabPanel>

          </TabContext>

        </Box>
        
        <TrendingSection level={third}/>
        <TrendingSection level={fourth}/>

      </Box>

      <Footer />
    </Box>
    
  )
}

export default HomePage