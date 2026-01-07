
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Tab from '@mui/material/Tab'

import { TabContext, TabList, TabPanel } from "@mui/lab";

import { useState } from "react";

import NavBar from '../../components/homePage/NavBar';
import FixturesData from '../../components/homePage/Fixtures';


const AllTeamsFixtures = () => {


    const [valueFixtures, setValueFixtures] = useState('1');
    const [type, setType] = useState('now')

    
  
    const handleChangeTabsPrem = (event, newValue) => {
      setValueFixtures(newValue);
    };

    const handleType = () => {

      if(type === 'past'){
        setType('now')
      }
    }
  
  
  
  return (
    <>


    <NavBar />



    <Stack paddingTop={4} margin='auto' maxWidth={1200}>

      <TabContext value={valueFixtures} >

        <TabList onChange={handleChangeTabsPrem} aria-label="tabs example" centered sx={{ paddingBottom: 2 }}>

          <Tab label='Premier' value='1' onClick={() => handleType()}/>

          <Tab label='First Division' value='2' onClick={() => handleType()}/>

          <Tab label='Women' value='3' onClick={() => handleType()}/>

        </TabList>



        <TabPanel value="1" sx={{ padding: "6px"}}>

          <FixturesData page='dfa' type={type} league="DFA_Premier_League_Men"/>

        </TabPanel>

        <TabPanel value="2" sx={{ padding: "6px"}}>

          <FixturesData page='div_1' type={type} league="DFA_Division_One"/>
          
        </TabPanel>

        <TabPanel value="3" sx={{ padding: "6px"}}>

          <FixturesData page='dfa' type={type} league="DFA_Women"/>

        </TabPanel>

      </TabContext>

    </Stack>     


    <Stack justifyContent='center' direction='row' marginTop={3} >

      {type != 'now' ? <Button variant="outlined" onClick={() => setType('now')} size="small">
        Upcoming Fixtures
      </Button>: ''}

      {type != 'past' ? <Button variant="outlined" onClick={() => setType('past')} size="small">
        Past Results
      </Button>: ''}
    </Stack>

    <Box marginTop={8} />
    
    </>
  )
}

export default AllTeamsFixtures