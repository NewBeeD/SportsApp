import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tab from '@mui/material/Tab'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useState } from 'react'

import DivisionOnePlayerGoals from './DivisionOnePlayerGoals'
import DivisionOnePlayerAssists from './DivisionOnePlayerAssists'

const DivisionOneStatsPage = () => {
  const [value, setValue] = useState('goals')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box>
      <Box width={{ sm: 900 }} margin='auto' minHeight='100vh'>
        <Box marginTop={{ sm: 10 }}>
          <Typography variant='h2' fontWeight={900} textAlign='center'>Stats Centre</Typography>
        </Box>

        <Box marginTop={{ sm: 7 }}>
          <TabContext value={value}>
            <TabList onChange={handleChange} aria-label='Division One stats tabs' centered>
              <Tab label='Goals' value='goals' />
              <Tab label='Assists' value='assists' />
            </TabList>

            <TabPanel value='goals'>
              <DivisionOnePlayerGoals />
            </TabPanel>

            <TabPanel value='assists'>
              <DivisionOnePlayerAssists />
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    </Box>
  )
}

export default DivisionOneStatsPage