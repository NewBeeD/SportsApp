

import { 
  Box, 
  Stack, 
  Paper, 
  Card, 
  Typography, 
  Skeleton,
  Button,
  CardContent,
  CardMedia,
  Chip,
  Fade,
  Avatar,
  AvatarGroup
} from "@mui/material"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import qs from 'qs'
import axios from "axios"
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import PersonIcon from '@mui/icons-material/Person'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

const queryParams_prem_players = {
  populate: {
    dfa_team: {
      populate: true
    },
    all_league: {
      populate: true
    },
    Profile_Pic: {
      populate: true
    }
  }   
}

const FeaturedPlayer = () => { 

  const [players, setPlayers] = useState([])
  const [error, setError] = useState()
  const [loading, setLoading] = useState(true)
  const [randomPlayer, setRandomPlayer] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryString = qs.stringify(queryParams_prem_players)
        const apiUrl = `https://strapi-dominica-sport.onrender.com/api/dfa-players?${queryString}`

        const response = await axios.get(apiUrl)
        if (response.status !== 200) {
          throw new Error(`Error: ${response.statusText}`)
        }

        const result = response.data.data
        setPlayers(result)

        if (result.length > 0) {
          // Filter for featured or notable players first, then random
          const notablePlayers = result.filter(player => 
            player.attributes.isFeatured || 
            player.attributes.Position === 'Striker' ||
            player.attributes.Position === 'Forward'
          )
          
          const chosen = notablePlayers.length > 0 
            ? notablePlayers[Math.floor(Math.random() * notablePlayers.length)]
            : result[Math.floor(Math.random() * result.length)]
          
          setRandomPlayer(chosen)
        }
      } catch (error) {
        setError(error.message)
        console.error("Error fetching players:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <Box sx={{ width: { xs: '100%', sm: 300, md: 350 } }}>
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height={400}
          sx={{ 
            borderRadius: 3,
            bgcolor: 'rgba(255, 255, 255, 0.1)'
          }} 
        />
      </Box>
    )
  }

  if (error || !randomPlayer) {
    return (
      <Box sx={{ width: { xs: '100%', sm: 300, md: 350 } }}>
        <Paper
          sx={{
            p: 3,
            textAlign: 'center',
            backgroundColor: 'rgba(34, 38, 41, 0.9)',
            borderRadius: 3,
            border: '2px solid',
            borderImage: 'linear-gradient(135deg, #FFD700 0%, #FF6B00 100%) 1',
          }}
        >
          <Typography color="#FF6B6B" fontWeight={600}>
            {error || 'No player data available'}
          </Typography>
        </Paper>
      </Box>
    )
  }

  return (
    
    <Fade in={!loading} timeout={800}>
      <Box sx={{ 
        width: { xs: '100%', sm: 300, md: 320 },
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-8px)',
          transition: 'transform 0.3s ease'
        }
      }}>
        {/* Featured Player Badge */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            right: 16,
            zIndex: 2,
            backgroundColor: 'rgba(255, 215, 0, 0.9)',
            borderRadius: '20px',
            px: 2,
            py: 0.5,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: '#222629',
              fontWeight: 900,
              letterSpacing: 1,
              textTransform: 'uppercase',
              fontSize: '0.7rem'
            }}
          >
            ⭐ Featured Player
          </Typography>
        </Box>

        <Link 
          to={`/DFA/Home/Player/${randomPlayer.id}`} 
          style={{ textDecoration: 'none' }}
        >
          <Card
            sx={{
              position: 'relative',
              overflow: 'visible',
              backgroundColor: 'rgba(34, 38, 41, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '3px solid',
              borderImage: 'linear-gradient(135deg, #FFD700 0%, #FF6B00 50%, #FFD700 100%) 1',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
              transition: 'all 0.3s ease',
              height: 420,
              '&:hover': {
                boxShadow: '0 16px 40px rgba(255, 107, 0, 0.3)',
                '& .player-image': {
                  transform: 'scale(1.05)',
                },
                '& .view-details': {
                  opacity: 1,
                  transform: 'translateY(0)'
                }
              }
            }}
          >
            {/* Player Image */}
            <Box
              sx={{
                position: 'relative',
                height: 220,
                overflow: 'hidden',
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                backgroundColor: 'rgba(0, 0, 0, 0.2)'
              }}
            >
              {randomPlayer.attributes.Profile_Pic?.data?.attributes?.formats?.small?.url ? (
                <CardMedia
                  component="img"
                  className="player-image"
                  image={randomPlayer.attributes.Profile_Pic.data.attributes.formats.small.url}
                  alt={`${randomPlayer.attributes.First_Name} ${randomPlayer.attributes.Last_Name}`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                    filter: 'brightness(0.9)'
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)'
                  }}
                >
                  <PersonIcon sx={{ fontSize: 80, color: 'rgba(255, 215, 0, 0.3)' }} />
                </Box>
              )}

              {/* Gradient Overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '60%',
                  background: 'linear-gradient(to top, rgba(34, 38, 41, 0.9) 0%, transparent 100%)'
                }}
              />
            </Box>

            <CardContent sx={{ p: 3 }}>
              {/* Player Name */}
              <Stack direction="column" spacing={0.5}>
                
                <Typography
                  variant="body1"
                  sx={{
                    color: '#86C232',
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    fontSize: '0.9rem'
                  }}
                >
                  {randomPlayer.attributes.First_Name}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    color: '#FFD700',
                    fontWeight: 900,
                    lineHeight: 1.1,
                    background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {randomPlayer.attributes.Last_Name}
                </Typography>
              </Stack>

              {/* Team and Position */}
              <Stack direction="column" spacing={2} sx={{ mt: 2, mb: 2 }}>
                
                <Chip
                  icon={<SportsSoccerIcon />}
                  label={randomPlayer.attributes.dfa_team?.data?.attributes?.Name || 'No Team'}
                  sx={{
                    backgroundColor: 'rgba(255, 107, 0, 0.15)',
                    color: '#FFED4E',
                    fontWeight: 600,
                    border: '1px solid #FF6B00',
                    '& .MuiChip-icon': {
                      color: '#FFD700'
                    },
                    fontSize: '11px'
                  }}
                />

                <Chip
                  icon={<EmojiEventsIcon />}
                  label={randomPlayer.attributes.Position}
                  sx={{
                    backgroundColor: 'rgba(134, 194, 50, 0.15)',
                    color: '#86C232',
                    fontWeight: 600,
                    border: '1px solid #86C232',
                    '& .MuiChip-icon': {
                      color: '#86C232'
                    },
                    fontSize: '11px'
                  }}
                />
              </Stack>

              {/* Stats/Details */}
              {/* <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                {randomPlayer.attributes.Goals && (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: '#FFD700',
                        fontWeight: 900
                      }}
                    >
                      {randomPlayer.attributes.Goals}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#CCCCCC',
                        textTransform: 'uppercase',
                        fontWeight: 600
                      }}
                    >
                      Goals
                    </Typography>
                  </Box>
                )}

                {randomPlayer.attributes.Assists && (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: '#86C232',
                        fontWeight: 900
                      }}
                    >
                      {randomPlayer.attributes.Assists}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#CCCCCC',
                        textTransform: 'uppercase',
                        fontWeight: 600
                      }}
                    >
                      Assists
                    </Typography>
                  </Box>
                )}

                {randomPlayer.attributes.Matches && (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: '#FFFFFF',
                        fontWeight: 900
                      }}
                    >
                      {randomPlayer.attributes.Matches}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#CCCCCC',
                        textTransform: 'uppercase',
                        fontWeight: 600
                      }}
                    >
                      Matches
                    </Typography>
                  </Box>
                )}
              </Stack> */}

              {/* View Details Button (shown on hover) */}
              {/* <Box
                className="view-details"
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  right: 20,
                  opacity: 0,
                  transform: 'translateY(10px)',
                  transition: 'all 0.3s ease'
                }}
              >
                <Button
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    color: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    border: '1px solid #FFD700',
                    borderRadius: '20px',
                    px: 2,
                    py: 0.5,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 215, 0, 0.2)',
                      transform: 'translateX(4px)'
                    }
                  }}
                >
                  View Profile
                </Button>
              </Box> */}
            </CardContent>
          </Card>
        </Link>
      </Box>
    </Fade>
  )
}

export default FeaturedPlayer