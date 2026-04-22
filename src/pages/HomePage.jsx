import { Box, Grid, Stack } from "@mui/material"
import MainNews from "../components/homePage/MainNews"
import TrendingSection from "../components/homePage/TrendingSection"
import Points_Table from "../components/homePage/Points_Table"
import FixturesData from "../components/homePage/Fixtures"
import FeaturedPlayer from "../components/homePage/FeaturedPlayer"
import TopStories from "../components/homePage/TopStories"
import CommunityPredictionsHome from "../components/homePage/CommunityPredictionsHome"
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

      <Box marginTop={7} />

      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', sm: 900, md: 1200, lg: 1440, xl: 1680 },
          mx: { xs: 0, sm: 'auto' },
          px: { xs: 0, sm: 2 },
        }}
      >
        <Grid container spacing={2}>
          {/* Left column: Hero + Top Stories + Latest */}
          <Grid item xs={12} md={8}>


            <Grid container spacing={2}>
              <Grid item xs={12}>
                <MainNews />
              </Grid>
            </Grid>

            <Box marginTop={2}>
              <TrendingSection level={first} showSidePanel={false} />
              <TrendingSection level={second} showSidePanel={false} />
              <TrendingSection level={third} showSidePanel={false} />
              <TrendingSection level={fourth} showSidePanel={false} />
            </Box>

          </Grid>

          {/* Right rail: Table/Fixtures + Featured Player */}
          <Grid item xs={12} md={4}>

            <Stack spacing={2}>

              {/* Tabs for fixtures and Points */}
              <Box height='100%'>

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

              <Box sx={{ display: { xs: "none", lg: "block" } }}>
                <TopStories count={5} />
              </Box>

              <FeaturedPlayer />

              <CommunityPredictionsHome limit={5} />

            </Stack>

          </Grid>
        </Grid>
      </Box>

      <Footer />
    </Box>
    
  )
}

export default HomePage