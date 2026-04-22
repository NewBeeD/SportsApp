import { Box, Typography } from '@mui/material'

const TeamPlayer = () => {
  return (
    <Box width={{ xs: '100%', sm: 800 }} sx={{ margin: { xs: 0, sm: 'auto' }, p: 3 }}>
      <Typography variant='h5' fontWeight={700} textAlign='center'>
        Team player directory is being refreshed.
      </Typography>
      <Typography textAlign='center' sx={{ mt: 2 }}>
        Use the team and player profile pages for the latest squad information.
      </Typography>
    </Box>
  )
}

export default TeamPlayer