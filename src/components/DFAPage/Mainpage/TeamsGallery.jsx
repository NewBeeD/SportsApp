import React from 'react'
import { Link } from "react-router-dom"
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Skeleton,
  useTheme,
  alpha
} from '@mui/material'
import { Stadium as StadiumIcon } from '@mui/icons-material'

const TeamCard = ({ team }) => {
  const theme = useTheme()
  
  return (
    <Card
      component={Link}
      to={`/DFA/Home/Team/${team.ID}`}
      sx={{
        height: '100%',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
          backgroundColor: alpha(theme.palette.primary.light, 0.05)
        }
      }}
    >
      <Box sx={{ 
        width: '100%', 
        height: 180, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        bgcolor: alpha(theme.palette.primary.main, 0.05)
      }}>
        <CardMedia
          component="img"
          sx={{ 
            maxHeight: 140, 
            maxWidth: '100%', 
            objectFit: 'contain' 
          }}
          image={team.team_crest}
          alt={team.Team}
        />
      </Box>
      <CardContent sx={{ 
        height: 80, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: 2
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700, 
            textAlign: 'center',
            color: 'text.primary'
          }}
        >
          {team.Team}
        </Typography>
      </CardContent>
    </Card>
  )
}

const TeamsGallery = ({ teams, loading }) => {
  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Grid item xs={6} sm={4} md={3} key={i}>
            <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
    )
  }

  if (!teams || teams.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <StadiumIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No teams found
        </Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={3}>
      {teams.map((team, index) => (
        <Grid item xs={6} sm={4} md={3} key={index}>
          <TeamCard team={team} />
        </Grid>
      ))}
    </Grid>
  )
}

export default TeamsGallery