
import { Link } from "react-router-dom"

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

// Conditional imports for less critical components
import Skeleton from '@mui/material/Skeleton'; // Can be heavy - use sparingly

// These two have bundle impact - verify if truly needed
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';


import {
  ArrowForward as ArrowForwardIcon,
  SportsSoccer as SoccerIcon,
  EmojiEvents as TrophyIcon,
  TrendingUp as TrendingUpIcon,
  Shield as ShieldIcon
} from '@mui/icons-material'

const StatCard = ({ title, value, imageUrl, link, statType = "player", loading = false }) => {
  const theme = useTheme()
  
  if (loading) {
    return (
      <Card sx={{ height: '100%', minHeight: 250 }}>
        <Skeleton variant="rectangular" height={170} />
        <CardContent>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" height={40} />
        </CardContent>
      </Card>
    )
  }

  const getStatColor = () => {
    switch(statType) {
      case 'goals': return theme.palette.success.main
      case 'assists': return theme.palette.info.main
      case 'cleanSheets': return theme.palette.warning.main
      case 'team': return theme.palette.primary.main
      default: return theme.palette.primary.main
    }
  }

  const getStatIcon = () => {
    switch(statType) {
      case 'goals': return '⚽'
      case 'assists': return '🎯'
      case 'cleanSheets': return '🛡️'
      case 'team': return '🏆'
      default: return '📊'
    }
  }

  return (
    <Card
      component={Link}
      to={link}
      sx={{
        height: '100%',
        minHeight: 250,
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
          backgroundColor: alpha(theme.palette.primary.light, 0.05)
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          image={imageUrl}
          alt={title}
          sx={{
            height: 170,
            width: '100%',
            objectFit: 'cover',
            objectPosition: 'center top'
          }}
          loading="lazy"
        />
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: alpha('#000', 0.7),
            borderRadius: '50%',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}
        >
          {getStatIcon()}
        </Box>
      </Box>
      <CardContent sx={{ textAlign: 'center', p: 2 }}>
        <Typography variant="body1" fontWeight={600} sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography 
          variant="h3" 
          fontWeight={800}
          sx={{ color: getStatColor() }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  )
}

const StatsDashboard = ({ playerStats, teamMostGoals, loading }) => {
  const theme = useTheme()
  
  if (!playerStats || playerStats.length === 0 || loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: alpha(theme.palette.info.light, 0.1),
            borderRadius: 3
          }}
        >
          <TrendingUpIcon sx={{ fontSize: 60, color: 'info.main', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
            📊 Stats Coming Soon
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Statistics will be populated as the league progresses.
          </Typography>
        </Paper>
      </Container>
    )
  }

  const statsConfig = [
    {
      title: 'Top Scorer',
      value: playerStats[0]?.top_scorer_prem_goals || '0',
      imageUrl: playerStats[0]?.top_scorer_prem_url,
      link: '/DFA/Home/PlayerGoals',
      statType: 'goals'
    },
    {
      title: 'Top Assister',
      value: playerStats[0]?.top_assist_prem_assist || '0',
      imageUrl: playerStats[0]?.top_assist_prem_url,
      link: '/DFA/Home/PlayerAssists',
      statType: 'assists'
    },
    {
      title: 'Team Goals',
      value: teamMostGoals[0]?.totalGoals || '0',
      imageUrl: playerStats[0]?.top_scorer_prem_url,
      link: '/DFA/Home/TeamGoals',
      statType: 'team'
    },
    {
      title: 'Clean Sheets',
      value: playerStats[0]?.top_clean_sheet_prem_clean_sheets || '0',
      imageUrl: playerStats[0]?.top_clean_sheet_prem_url,
      link: '/DFA/Home/TeamCleanSheets',
      statType: 'cleanSheets'
    }
  ]

  return (
    <>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 4, textAlign: 'center' }}>
        <TrophyIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
        Premier League Stats
      </Typography>
      
      <Grid container spacing={3}>
        {statsConfig.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 6, mb: 4 }}>
        <Button
          component={Link}
          to="/DFA/Stats"
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1.5,
            backgroundColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            View Full Season Stats
          </Typography>
        </Button>
      </Box>
    </>
  )
}

export default StatsDashboard