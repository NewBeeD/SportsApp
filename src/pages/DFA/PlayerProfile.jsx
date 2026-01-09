
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import qs from 'qs'
import axios from "axios"
import  { Link } from 'react-router-dom'

import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Skeleton,
  Divider,
  Container,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Paper,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Tabs,
  Tab,
  alpha,
  useTheme
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  SportsSoccer as SoccerIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Flag as FlagIcon,
  Height as HeightIcon,
  FitnessCenter as WeightIcon,
  EmojiEvents as TrophyIcon,
  TrendingUp as TrendingUpIcon,
  MilitaryTech as MilitaryTechIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  DirectionsRun as RunIcon,
  Security as SecurityIcon // Added for clean sheets
} from '@mui/icons-material'

import { queryParams_prem_players } from "../../modules/DFA/QueryParams"
import { queryParams_prem_players_season_stats } from "../../modules/DFA/QueryParams"
import SinglePlayerDisplay from "../../modules/DFA/PlayerStats/SinglePlayerDispl/SinglePlayerDisplay"
import PlayerStatsDisplay from "../../modules/DFA/PlayerStatsDisplay/PlayerStatsDisplay"
import { trackPlayerProfileViewed } from "../../utils/analyticsEvents"

// Loading skeleton components
const PlayerHeaderSkeleton = () => (
  <Stack spacing={3} sx={{ mb: 4 }}>
    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
    <Box sx={{ textAlign: 'center' }}>
      <Skeleton variant="text" width="60%" height={40} sx={{ mx: 'auto' }} />
      <Skeleton variant="text" width="40%" height={24} sx={{ mx: 'auto' }} />
    </Box>
  </Stack>
)

const StatCardSkeleton = () => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="40%" height={40} />
    </CardContent>
  </Card>
)

// Reusable Stat Card Component
const StatCard = ({ label, value, icon, color = 'primary', trend = null }) => {
  const theme = useTheme()
  
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
          bgcolor: alpha(theme.palette[color].main, 0.04)
        }
      }}
    >
      <CardContent sx={{ textAlign: 'center', p: 2 }}>
        <Box sx={{ color: `${color}.main`, mb: 1 }}>
          {icon}
        </Box>
        <Typography variant="h3" fontWeight={800} color={`${color}.main`} gutterBottom>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        {trend && (
          <Chip
            label={trend}
            size="small"
            sx={{ mt: 1 }}
            color={trend.includes('+') ? 'success' : 'error'}
          />
        )}
      </CardContent>
    </Card>
  )
}

// Reusable Info Item Component
const InfoItem = ({ label, value, icon, color = 'text.secondary' }) => (
  <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 1.5 }}>
    <Box sx={{ color, width: 24 }}>
      {icon}
    </Box>
    <Typography variant="body2" sx={{ flex: 1 }} color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={600}>
      {value}
    </Typography>
  </Stack>
)

const PlayerProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const theme = useTheme()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const [seasonStats, setseasonStats] = useState(0)

  const getPositionCategory = (position) => {
    const categories = {
      'GK': { label: 'Goalkeeper', color: 'error', isGoalkeeper: true, isDefender: false },
      'CB': { label: 'Defender', color: 'warning', isGoalkeeper: false, isDefender: true },
      'LB': { label: 'Defender', color: 'warning', isGoalkeeper: false, isDefender: true },
      'RB': { label: 'Defender', color: 'warning', isGoalkeeper: false, isDefender: true },
      'CDM': { label: 'Midfielder', color: 'info', isGoalkeeper: false, isDefender: false },
      'CM': { label: 'Midfielder', color: 'info', isGoalkeeper: false, isDefender: false },
      'CAM': { label: 'Midfielder', color: 'info', isGoalkeeper: false, isDefender: false },
      'LW': { label: 'Forward', color: 'success', isGoalkeeper: false, isDefender: false },
      'RW': { label: 'Forward', color: 'success', isGoalkeeper: false, isDefender: false },
      'ST': { label: 'Forward', color: 'success', isGoalkeeper: false, isDefender: false },
      'CF': { label: 'Forward', color: 'success', isGoalkeeper: false, isDefender: false }
    }
    return categories[position] || { label: position, color: 'default', isGoalkeeper: false, isDefender: false }
  }

  const getPositionIcon = (category) => {
    const icons = {
      'Goalkeeper': '🧤',
      'Defender': '🛡️',
      'Midfielder': '⚙️',
      'Forward': '⚽'
    }
    return icons[category] || '👤'
  }


  // Fetches Player Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const queryString = qs.stringify(queryParams_prem_players)
        const apiUrl = `https://strapi-dominica-sport.onrender.com/api/dfa-players/${id}?${queryString}`
        
        const response = await axios.get(apiUrl)
        
        if (response.status !== 200) {
          throw new Error(`Error: ${response.statusText}`)
        }

        const result = SinglePlayerDisplay(response.data.data)


        
        setData(result)
        trackPlayerProfileViewed(result.name, 'DFA')
      } catch (error) {
        setError(error.message)
        console.error('Error fetching player data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])



  // Fetches Player Season Stats
  useEffect(() => {
    
    const fetchSeasonStats = async () => {
      try {
        // const queryString = qs.stringify(queryParams_prem_players_season_stats)


      const queryParams = {
        ...queryParams_prem_players_season_stats,
        filters: {
          dfa_player: {
            id: {
              $eq: id
            }
          }
          }
        };


      const queryString = qs.stringify(queryParams, {
        encodeValuesOnly: true // Important for Strapi v4!
      });





      const apiUrl = `https://strapi-dominica-sport.onrender.com/api/player-stats?${queryString}`
      
      const response = await axios.get(apiUrl)
      
      if (response.status !== 200) {
        throw new Error(`Error: ${response.statusText}`)
        }

      const result = PlayerStatsDisplay(response.data.data)

      setseasonStats(result)
        

        // Process season stats data
      } catch (error) {
        console.error('Error fetching player season stats:', error)
      }
    }

    if (data) {
      fetchSeasonStats()
    }
  }, [data])

  const handleBackClick = () => {
    window.scrollTo(0, 0)
    navigate(-1)
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  if (error) {
    return (
      <Box>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load player data: {error}
          </Alert>
          <IconButton onClick={handleBackClick}>
            <ArrowBackIcon />
            <Typography sx={{ ml: 1 }}>Back</Typography>
          </IconButton>
        </Container>
      </Box>
    )
  }

  const positionInfo = data ? getPositionCategory(data.Position) : null

  const personalInfo = data ? [
    { label: 'Date of Birth', value: data.BirthDate, icon: <CalendarIcon /> },
    { label: 'Age', value: data.Age, icon: <PersonIcon /> },
    { label: 'Club', value: data.Current_Team, icon: <SoccerIcon /> },
    { label: 'Position', value: `${data.Position} (${positionInfo.label})`, icon: <RunIcon /> },
    { label: 'Preferred Foot', value: data.Foot, icon: <FlagIcon /> },
    ...(data.Height ? [{ label: 'Height', value: data.Height, icon: <HeightIcon /> }] : []),
    ...(data.Weight ? [{ label: 'Weight', value: data.Weight, icon: <WeightIcon /> }] : []),
    ...(data.Nationality ? [{ label: 'Nationality', value: data.Nationality, icon: <FlagIcon /> }] : []),
    ...(data.BirthPlace ? [{ label: 'Birth Place', value: data.BirthPlace, icon: <LocationIcon /> }] : [])
  ] : []

  // Main stats with clean sheets conditionally added for goalkeepers
  const mainStats = data ? [
    { label: 'Appearances', value: seasonStats.Appearances, icon: <PersonIcon />, color: 'primary' },
    { label: 'Goals', value: seasonStats.Goals, icon: <SoccerIcon />, color: 'success' },
    { label: 'Assists', value: seasonStats.Assists, icon: <TrendingUpIcon />, color: 'info' },
    { label: 'Yellow Cards', value: seasonStats.YellowCards, icon: <MilitaryTechIcon />, color: 'warning' },
    { label: 'Red Cards', value: seasonStats.RedCards || 0, icon: <SecurityIcon />, color: 'error' },
    ...((positionInfo.isGoalkeeper || positionInfo.isDefender) && seasonStats.CleanSheets !== undefined && seasonStats.CleanSheets !== null ? [
      { label: 'Clean Sheets', value: seasonStats.CleanSheets, icon: <SecurityIcon />, color: 'primary' }
    ] : []),
    ...(seasonStats.MinutesPlayed ? [{ label: 'Minutes', value: seasonStats.MinutesPlayed, icon: <CalendarIcon />, color: 'secondary' }] : [])
  ] : []

  const advancedStats = data ? [
    ...(data.GoalsPerMatch ? [{ label: 'Goals per Match', value: data.GoalsPerMatch, color: 'success' }] : []),
    ...(data.AssistsPerMatch ? [{ label: 'Assists per Match', value: data.AssistsPerMatch, color: 'info' }] : []),
    ...(data.PassAccuracy ? [{ label: 'Pass Accuracy', value: `${data.PassAccuracy}%`, color: 'primary' }] : []),
    ...(data.TackleSuccess ? [{ label: 'Tackle Success', value: `${data.TackleSuccess}%`, color: 'warning' }] : []),
    // Add clean sheets per game for goalkeepers if available
    ...(positionInfo.isGoalkeeper && seasonStats.CleanSheets && seasonStats.Appearances ? [
      { label: 'Clean Sheet %', value: `${((seasonStats.CleanSheets / seasonStats.Appearances) * 100).toFixed(1)}%`, color: 'primary' }
    ] : [])
  ] : []

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', paddingTop: { sm: '18px' } }}>
      
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Breadcrumbs and Back Button */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Breadcrumbs>
            <IconButton size="small" onClick={handleBackClick} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <HomeIcon fontSize="small" />
                <Typography variant="body2">Home</Typography>
              </Stack>
            </Link>
            <Link to="/DFA/Home" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <SoccerIcon fontSize="small" />
                <Typography variant="body2">Teams</Typography>
              </Stack>
            </Link>
            {data && (
              
                <Typography variant="body2">{data.Current_Team}</Typography>

            )}
            <Typography variant="body2" color="text.primary" fontWeight={600}>
              {loading ? 'Loading...' : `${data?.FirstName} ${data?.Last_Name}`}
            </Typography>
          </Breadcrumbs>
        </Stack>

        {loading ? (
          <PlayerHeaderSkeleton />
        ) : data && (
          <>
            {/* Player Header Section */}
            <Paper
              elevation={0}
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                mb: 4,
                bgcolor: alpha(theme.palette.primary.main, 0.1)
              }}
            >
              <Grid container spacing={3} alignItems="center" sx={{ p: 3 }}>
                <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                  <Avatar
                    src={data.url}
                    alt={`${data.FirstName} ${data.Last_Name}`}
                    sx={{
                      width: 220,
                      height: 220,
                      mx: 'auto',
                      border: '4px solid white',
                      boxShadow: 3
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
                      <Typography variant="h3" fontWeight={800}>
                        {data.FirstName} {data.Last_Name}
                      </Typography>
                      {data.Kit && (
                        <Chip
                          label={`#${data.Kit}`}
                          color="primary"
                          sx={{ fontSize: '1.2rem', height: 40 }}
                        />
                      )}
                    </Stack>
                    
                    <Stack direction={{xs:"column", sm: "row"}} spacing={2} alignItems="center" flexWrap="wrap">
                      <Chip
                        icon={<span>{getPositionIcon(positionInfo.label)}</span>}
                        label={`${data.Position} - ${positionInfo.label}`}
                        color={positionInfo.color}
                        variant="outlined"
                        sx={{ fontSize: '1rem' }}
                      />
                      <Chip
                        icon={<SoccerIcon />}
                        label={data.Current_Team}
                        variant="outlined"
                      />
                      {data.Nationality && (
                        <Chip
                          icon={<FlagIcon />}
                          label={data.Nationality}
                          variant="outlined"
                        />
                      )}
                    </Stack>
                    
                    {data.playerBio && (
                      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                        {data.playerBio}
                      </Typography>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            {/* Tabs Section */}
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Overview" icon={<PersonIcon />} iconPosition="start" />
              <Tab label="Statistics" icon={<TrendingUpIcon />} iconPosition="start" />
              <Tab label="Career" icon={<TrophyIcon />} iconPosition="start" />
            </Tabs>

            {/* Overview Tab */}
            {activeTab === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                        Personal Details
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Stack spacing={0}>
                        {personalInfo.map((info, index) => (
                          <Box key={index}>
                            <InfoItem {...info} />
                            {index < personalInfo.length - 1 && <Divider />}
                          </Box>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={7}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                        Season Highlights
                      </Typography>
                      <Divider sx={{ mb: 3 }} />
                      <Grid container spacing={2}>
                        {mainStats.slice(0, 4).map((stat, index) => (
                          <Grid item xs={6} sm={3} key={index}>
                            <StatCard {...stat} />
                          </Grid>
                        ))}
                      </Grid>
                      
                      {/* Additional Stats */}
                      {advancedStats.length > 0 && (
                        <>
                          <Typography variant="h6" fontWeight={600} sx={{ mt: 4, mb: 2 }} color="primary">
                            Performance Metrics
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          <Grid container spacing={2}>
                            {advancedStats.map((stat, index) => (
                              <Grid item xs={6} sm={3} key={index}>
                                <Card>
                                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                    <Typography variant="h4" color={`${stat.color}.main`} fontWeight={800}>
                                      {stat.value}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {stat.label}
                                    </Typography>
                                  </CardContent>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}

            {/* Statistics Tab */}
            {activeTab === 1 && (
              <Grid container spacing={3}>
                {/* Main Statistics */}
                <Grid item xs={12}>
                  <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                    Season Statistics
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Grid container spacing={3}>
                    {mainStats.map((stat, index) => (
                      <Grid item xs={6} sm={4} md={3} key={index}>
                        <StatCard {...stat} />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                {/* Detailed Statistics */}
                {data.detailedStats && Object.keys(data.detailedStats).length > 0 && (
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                          Detailed Performance
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                          {Object.entries(data.detailedStats).map(([key, value], index) => (
                            <Grid item xs={6} sm={4} md={3} key={index}>
                              <Card variant="outlined">
                                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                  <Typography variant="h5" fontWeight={700}>
                                    {value}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Match Logs */}
                {data.matchLogs && data.matchLogs.length > 0 && (
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                          Recent Matches
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={1}>
                          {data.matchLogs.slice(0, 5).map((match, index) => (
                            <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="body2">
                                  {match.date} • {match.competition}
                                </Typography>
                                <Stack direction="row" spacing={2} alignItems="center">
                                  <Typography variant="body2" fontWeight={600}>
                                    {match.homeTeam} {match.homeScore} - {match.awayScore} {match.awayTeam}
                                  </Typography>
                                  <Chip
                                    label={match.result}
                                    size="small"
                                    color={match.result === 'W' ? 'success' : match.result === 'L' ? 'error' : 'warning'}
                                  />
                                </Stack>
                              </Stack>
                            </Paper>
                          ))}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            )}

            {/* Career Tab */}
            {activeTab === 2 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                    Career Timeline
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  {data.careerHistory && data.careerHistory.length > 0 ? (
                    <Stack spacing={2}>
                      {data.careerHistory.map((careerItem, index) => (
                        <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar
                              src={careerItem.teamLogo}
                              sx={{ width: 40, height: 40 }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body1" fontWeight={600}>
                                {careerItem.team}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {careerItem.period}
                              </Typography>
                            </Box>
                            <Stack alignItems="flex-end">
                              <Typography variant="body2">
                                {careerItem.appearances} Apps
                              </Typography>
                              <Typography variant="body2" color="primary">
                                {careerItem.goals} Goals
                              </Typography>
                            </Stack>
                          </Stack>
                        </Paper>
                      ))}
                    </Stack>
                  ) : (
                    <Alert severity="info">
                      Career history information coming soon.
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Loading Overlay */}
        {loading && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999
            }}
          >
            <Stack alignItems="center" spacing={2}>
              <CircularProgress size={60} />
              <Typography variant="h6" color="text.secondary">
                Loading player profile...
              </Typography>
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default PlayerProfile