/**
 * DFA Homepage - Unified Responsive Component
 * Replaces both DFA.jsx and DfaPageLargeScreens.jsx
 * Responsive layout for all device sizes: mobile, tablet, desktop, large screens
 */

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
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
import HeadlineFeature from "../../components/DFAPage/Headline/HeadlineFeature";
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
        <HeadlineFeature />

        

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

        <DfaArticles level="first" size="small" />


        <Box marginY={2}>
          <Video VideoLocation="Homepage1" />
        </Box>



        <DfaArticles level="second" size="small" />


      </Box>
    );
  }

  // LARGE SCREEN LAYOUT (Tablet & Desktop)
  return (
    <Box paddingTop={10}>
      <Box maxWidth={isLargeScreen ? 1400 : 1100} margin="auto">
        
        {/* Sidebar + Articles Layout */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          margin={{ xs: 'auto' }}
          divider={<Divider orientation={isLargeScreen ? 'vertical' : 'horizontal'} flexItem />}
        >
          
          {/* SIDEBAR - Left Side (Visible on tablet & above) */}
          <Box flex={isLargeScreen ? '0 0 350px' : '1'}>
            <Stack spacing={3} width={isLargeScreen ? '350px' : 'auto'}>
              
              {/* Points Table */}
              <Box>
                <Points_Table page="DfaHomepage" />
              </Box>

              {/* Fixtures */}
              <Box>
                <FixturesData page="Dfahome" type="now" league="DFA" />
              </Box>

              {/* Featured Players - Only on larger screens */}
              {isLargeScreen && (
                <>
                  <Typography fontWeight={900} textAlign="left" paddingY={2} paddingLeft={1}>
                    Featured Players
                  </Typography>
                  <FeaturedPlayer />
                  <FeaturedPlayer />
                  <FeaturedPlayer />
                  <FeaturedPlayer />
                  <FeaturedPlayer />
                </>
              )}
            </Stack>
          </Box>

          {/* MAIN CONTENT - Right Side */}
          <Stack flex="1" spacing={3} padding={2}>
            
            {/* Headline Feature */}
            <Box>
              <HeadlineFeature />
            </Box>

            {/* Video Section */}
            <Box>
              <Video VideoLocation="Homepage1" />
            </Box>

            <Divider sx={{ width: '100%' }} />

            {/* Articles */}
            <DfaArticles level="first" />
          </Stack>

        </Stack>

        <Divider sx={{ marginTop: 4 }} />
      </Box>
    </Box>
  );
};

export default DfaHomepage;
