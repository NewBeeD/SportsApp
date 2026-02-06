/**
 * DFA Homepage - Unified Responsive Component
 * Replaces both DFA.jsx and DfaPageLargeScreens.jsx
 * Responsive layout for all device sizes: mobile, tablet, desktop, large screens
 */

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useTheme, useMediaQuery } from '@mui/material';

import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import qs from 'qs';
import axios from "axios";



import '../../css/DfaMainPage.css';

// Data and components
import GetDFA from "../../modules/DFA/AllDfaData";
import AllTeamsDataStructure from "../../components/DFAPage/AllTeamsPage/AllTeamsDataStructure";
import { queryParams_dfa_teams } from "../../modules/DFA/QueryParams";

// UI Components
import DfaArticles from "../../components/DFAPage/DfaArticles";
import Points_Table from "../../components/homePage/Points_Table";
import FixturesData from "../../components/homePage/Fixtures";
import FeaturedPlayer from '../../components/homePage/FeaturedPlayer';
import MainNews from '../../components/homePage/MainNews';
import TopStories from '../../components/homePage/TopStories';
import CommunityPredictionsHome from '../../components/homePage/CommunityPredictionsHome';
import Video from "../../components/Video";

const DfaHomepage = () => {
  // Responsive breakpoints
  const muiTheme = useTheme();
  const isLargeScreen = useMediaQuery(muiTheme.breakpoints.up('md'));
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  // Redux data
  GetDFA();
  useSelector((state) => state.DfaPlayers);

  // State for tabs and navigation
  const [value, setValue] = useState('1');

  // Fetch teams data on mount (optional - remove if not needed)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryString = qs.stringify(queryParams_dfa_teams);
        const apiUrl = `https://strapi-dominica-sport.onrender.com/api/dfa-teams?${queryString}`;
        const response = await axios.get(apiUrl);

        if (response.status !== 200) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.data.data;
        AllTeamsDataStructure(result);
      } catch (error) {
        console.error('Error fetching teams:', error.message);
      }
    };

    fetchData();
  }, []);

  // Tab handler
  const handleChangeTableFixtures = (event, newValue) => {
    setValue(newValue);
  };

  // MOBILE LAYOUT
  if (isMobile) {
    return (
      <Box sx={{ paddingY: 0 }}>
        <MainNews league="DFA" />

        <Box marginTop={2}>
          <TopStories count={5} league="DFA" />
        </Box>

        {/* Video Section - Featured at top */}
        <Box marginY={2}>
          <Video VideoLocation="Homepage1" />
        </Box>

        <Box marginTop={3} height="100%">
          <TabContext value={value}>
            <TabList onChange={handleChangeTableFixtures} aria-label="tabs example" centered>
              <Tab label="Table" value="1" />
              <Tab label="Fixtures" value="2" />
            </TabList>

            <TabPanel value="1">
              <Points_Table page="Homepage" />
            </TabPanel>

            <TabPanel value="2">
              <FixturesData page="home" type="now" league="DFA" />
            </TabPanel>
          </TabContext>
        </Box>

        <Box marginTop={2}>
          <CommunityPredictionsHome limit={5} />
        </Box>

        <DfaArticles level="first" size="small" />
        <DfaArticles level="second" size="small" />
        <DfaArticles level="third" size="small" />
        <DfaArticles level="fourth" size="small" />
        <DfaArticles level="fifth" size="small" />


      </Box>
    );
  }

  // LARGE SCREEN LAYOUT (Tablet & Desktop)
  return (
    <Box paddingTop={10}>
      <Box
        sx={{
          width: '100%',
          maxWidth: { sm: 1100, md: 1400, lg: 1680, xl: 1920 },
          mx: 'auto',
          px: { sm: 2, md: 2 },
        }}
      >

        <Grid container spacing={{ xs: 2, md: 3, lg: 4 }}>
          {/* Left: Hero + content */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <MainNews league="DFA" />
              </Grid>
            </Grid>

            <Box marginTop={2}>
              <Video VideoLocation="Homepage1" />
            </Box>

            <Box marginTop={2}>
              <DfaArticles level="first" />
            </Box>
          </Grid>

          {/* Right rail: Table/Fixtures + Featured Player */}
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <Box height="100%">
                <TabContext value={value}>
                  <TabList onChange={handleChangeTableFixtures} aria-label="tabs example" centered>
                    <Tab label="Table" value="1" />
                    <Tab label="Fixtures" value="2" />
                  </TabList>

                  <TabPanel value="1">
                    <Points_Table page="DfaHomepage" />
                  </TabPanel>

                  <TabPanel value="2">
                    <FixturesData page="Dfahome" type="now" league="DFA" />
                  </TabPanel>
                </TabContext>
              </Box>

              <Box sx={{ display: { xs: "none", lg: "block" } }}>
                <TopStories count={5} league="DFA" />
              </Box>

              <Box>
                <Typography fontWeight={900} textAlign="left" paddingLeft={1}>
                  Featured Player
                </Typography>
                <FeaturedPlayer />
              </Box>

              <CommunityPredictionsHome limit={5} />
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DfaHomepage;
