




import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { trackTeamViewed } from "../../utils/analyticsEvents"
import qs from 'qs'
import axios from "axios"

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';

import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Container from '@mui/material/Container';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import IconButton from '@mui/material/IconButton';


import {
  TabContext,
  TabList,
  TabPanel
} from "@mui/lab"
import { Link } from "react-router-dom"
import {
  Home as HomeIcon,
  SportsSoccer as SoccerIcon,
  People as PeopleIcon,
  Groups as GroupsIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material'

import NavBar from "../../components/homePage/NavBar"
import { queryParams_dfa_teams } from "../../modules/DFA/QueryParams"
import TeamDataStructure from "../../modules/DFA/TeamPage/TeamDataStructure"

// Loading skeleton components
const TeamHeaderSkeleton = () => (
  <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center" sx={{ mb: 4 }}>
    <Skeleton variant="circular" width={120} height={120} />
    <Box sx={{ flex: 1 }}>
      <Skeleton variant="text" width="60%" height={40} />
      <Skeleton variant="text" width="40%" height={24} />
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Skeleton variant="rounded" width={100} height={32} />
        <Skeleton variant="rounded" width={100} height={32} />
      </Stack>
    </Box>
  </Stack>
)

const PlayerCardSkeleton = () => (
  <Card sx={{ height: '100%', transition: 'transform 0.2s' }}>
    <Skeleton variant="rectangular" height={200} />
    <CardContent>
      <Skeleton variant="text" />
      <Skeleton variant="text" width="60%" />
    </CardContent>
  </Card>
)

// Reusable Player Card Component
const PlayerCard = ({ player }) => (
  <Card
    sx={{
      height: '100%',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 4
      }
    }}
  >
    <Link to={`/DFA/Home/Player/${player.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <CardMedia
        component='img'
        loading="lazy"
        image={player.profile_pic}
        alt={`${player.FirstName} ${player.Last_Name}`}
        sx={{
          height: 200,
          objectFit: 'cover',
          objectPosition: 'center top'
        }}
      />
      <CardContent>
        <Typography variant="h6" fontWeight={600} noWrap>
          {player.FirstName} {player.Last_Name}
        </Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
          <Chip
            label={player.Position}
            size="small"
            color="primary"
            variant="outlined"
          />
          {player.jerseyNumber && (
            <Typography variant="body2" color="text.secondary">
              #{player.jerseyNumber}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Link>
  </Card>
)

// Reusable Staff Card Component
const StaffCard = ({ staff }) => (
  <Card sx={{ display: 'flex', mb: 2, transition: 'transform 0.2s' }}>
    <Avatar
      src={staff.staff_member_img}
      sx={{ width: 80, height: 80, m: 2 }}
      alt={staff.staff_member_name}
    />
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 2 }}>
      <Typography variant="h6" fontWeight={600}>
        {staff.staff_member_name}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 1 }}>
        {staff.staff_member_title}
      </Typography>
      {staff.staff_member_bio && (
        <Typography variant="body2" color="text.secondary">
          {staff.staff_member_bio}
        </Typography>
      )}
    </Box>
  </Card>
)

const TeamPage = () => {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const queryString = qs.stringify(queryParams_dfa_teams)
        const apiUrl = `https://strapi-dominica-sport.onrender.com/api/dfa-teams/${id}?${queryString}`
        
        const response = await axios.get(apiUrl)
        
        if (response.status !== 200) {
          throw new Error(`Error: ${response.statusText}`)
        }

        const result = TeamDataStructure(response.data.data)
        setData(result)
        trackTeamViewed(result.name, 'DFA')
      } catch (error) {
        setError(error.message)
        console.error('Error fetching team data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

if (error) {
  return (
    <Box>
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            Team profiles are being updated
          </Typography>
          <Typography variant="body2">
            We're adding the latest team information. Please try again soon!
          </Typography>
        </Alert>
        
        <Link to="/DFA/Teams" style={{ textDecoration: 'none' }}>
          <IconButton>
            <ArrowBackIcon />
            <Typography sx={{ ml: 1 }}>Back to Teams</Typography>
          </IconButton>
        </Link>
      </Container>
    </Box>
  )
}

  const positionGroups = {
    goalkeepers: ['GK'],
    defenders: ['CB', 'LB', 'RB', 'LWB', 'RWB'],
    midfielders: ['CM', 'CDM', 'CAM', 'LM', 'RM'],
    forwards: ['ST', 'CF', 'LW', 'RW']
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <NavBar />
      
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <HomeIcon fontSize="small" />
              <Typography>Home</Typography>
            </Stack>
          </Link>
          
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <SoccerIcon fontSize="small" />
              <Typography>Teams</Typography>
            </Stack>

          <Typography color="text.primary" fontWeight={600}>
            {loading ? 'Loading...' : data?.Team}
          </Typography>
        </Breadcrumbs>

        {/* Team Header */}
        {loading ? (
          <TeamHeaderSkeleton />
        ) : data && (
          <Paper
            elevation={2}
            sx={{
              p: { xs: 2, md: 4 },
              mb: 4,
              borderRadius: 2,
              bgcolor: 'background.paper'
            }}
          >
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  src={data.team_crest}
                  alt={data.Team}
                  sx={{
                    width: { xs: 100, md: 140 },
                    height: { xs: 100, md: 140 },
                    border: '2px solid',
                    borderColor: 'primary.main'
                  }}
                />
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" fontWeight={800} gutterBottom>
                  {data.Team}
                </Typography>
                
                <Stack direction={{xs:"column", sm: "row"}} spacing={2} flexWrap="wrap" sx={{ mb: 2 }}>
                  <Chip
                    icon={<LocationIcon />}
                    label={data.Community}
                    variant="outlined"
                  />
                  <Chip
                    icon={<CalendarIcon />}
                    label={`Est. ${data.est}`}
                    variant="outlined"
                  />
                  <Chip
                    icon={<PeopleIcon />}
                    label={`${data.Players?.length || 0} Players`}
                    variant="outlined"
                  />
                </Stack>
                
                {data.motto && (
                  <Typography
                    variant="body1"
                    fontStyle="italic"
                    color="text.secondary"
                    sx={{ borderLeft: '3px solid', borderColor: 'primary.main', pl: 2 }}
                  >
                    "{data.motto}"
                  </Typography>
                )}
              </Box>
              
              {data.Team_Photo && (
                <Box sx={{ width: { xs: '100%', md: 400 } }}>
                  <img
                    src={data.Team_Photo}
                    alt={`${data.Team} Team Photo`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 8,
                      boxShadow: 3
                    }}
                    loading="lazy"
                  />
                </Box>
              )}
            </Stack>
          </Paper>
        )}

        {/* Tabs Section */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <TabContext value={activeTab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
              <TabList
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    py: 2,
                    minHeight: 'auto'
                  }
                }}
              >
                <Tab
                  icon={<SoccerIcon />}
                  iconPosition="start"
                  label="Overview"
                  value="overview"
                />
                <Tab
                  icon={<GroupsIcon />}
                  iconPosition="start"
                  label="Staff"
                  value="staff"
                />
                <Tab
                  icon={<PersonIcon />}
                  iconPosition="start"
                  label="Squad"
                  value="squad"
                />
              </TabList>
            </Box>

            {/* Overview Tab */}
            <TabPanel value="overview" sx={{ p: 3 }}>
              {loading ? (
                <Stack spacing={2}>
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                </Stack>
              ) : (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      About the Team
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {data.description || `Welcome to the official page of ${data.Team}, 
                      based in ${data.Community}. Founded in ${data.est}, 
                      we're proud to compete in the Dominica Football Association.`}
                    </Typography>
                    
                    {/* Team Stats */}
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        Team Stats
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6} md={3}>
                          <Box textAlign="center">
                            <Typography variant="h4" color="primary" fontWeight={800}>
                              {data.Players?.length || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Players
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Box textAlign="center">
                            <Typography variant="h4" color="primary" fontWeight={800}>
                              {data.staff_imgs?.length || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Staff
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        Contact Information
                      </Typography>
                      {data.contactInfo ? (
                        Object.entries(data.contactInfo).map(([key, value]) => (
                          <Typography key={key} variant="body2" sx={{ mb: 1 }}>
                            <strong>{key}:</strong> {value}
                          </Typography>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Contact information coming soon
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              )}
            </TabPanel>

            {/* Staff Tab */}
            <TabPanel value="staff" sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight={700} sx={{ mb: 3 }}>
                Team Staff
              </Typography>
              
              {loading ? (
                <Stack spacing={2}>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} variant="rectangular" height={100} />
                  ))}
                </Stack>
              ) : data?.staff_imgs?.length > 0 ? (
                <Grid container spacing={2}>
                  {data.staff_imgs.map((staff, idx) => (
                    <Grid item xs={12} key={idx}>
                      <StaffCard staff={staff} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info">
                  No staff information available at the moment.
                </Alert>
              )}
            </TabPanel>

            {/* Squad Tab */}
            <TabPanel value="squad" sx={{ p: 3 }}>
              {loading ? (
                <Grid container spacing={3}>
                  {[1, 2, 3, 4].map((i) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                      <PlayerCardSkeleton />
                    </Grid>
                  ))}
                </Grid>
              ) : data?.Players?.length > 0 ? (
                Object.entries(positionGroups).map(([group, positions]) => {
                  const players = data.Players.filter(player => 
                    positions.includes(player.Position)
                  )
                  
                  if (players.length === 0) return null
                  
                  return (
                    <Box key={group} sx={{ mb: 4 }}>
                      <Typography variant="h6" fontWeight={700} gutterBottom sx={{ 
                        mb: 3,
                        pb: 1,
                        borderBottom: '2px solid',
                        borderColor: 'primary.main'
                      }}>
                        {group.charAt(0).toUpperCase() + group.slice(1)}
                        <Chip
                          label={`${players.length} players`}
                          size="small"
                          sx={{ ml: 2 }}
                        />
                      </Typography>
                      
                      <Grid container spacing={3}>
                        {players.map((player) => (
                          <Grid item xs={12} sm={6} md={4} lg={3} key={player.id}>
                            <PlayerCard player={player} />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )
                })
              ) : (
                <Alert severity="info">
                  No player information available at the moment.
                </Alert>
              )}
            </TabPanel>
          </TabContext>
        </Paper>
        
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
                Loading team data...
              </Typography>
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default TeamPage