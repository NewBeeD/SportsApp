

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
import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import appTheme from '../../css/theme'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import PersonIcon from '@mui/icons-material/Person'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

// Constants
const API_BASE_URL = 'https://strapi-dominica-sport.onrender.com/api/dfa-players'
const FADE_TIMEOUT = 800
const HOVER_ELEVATION = '-8px'
const CARD_HEIGHT = 420
const IMAGE_HEIGHT = 220
const PLAYER_BOX_WIDTH = { xs: '100%', sm: 300, md: 320 }
const FILTER_POSITIONS = ['Striker', 'Forward', 'Goalkeeper']

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
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [randomPlayer, setRandomPlayer] = useState(null)

  // Build query string from params object
  const buildQueryString = (params) => {
    const buildNestedParams = (obj, prefix = '') => {
      let result = []
      for (let key in obj) {
        let value = obj[key]
        let newKey = prefix ? `${prefix}[${key}]` : key
        if (typeof value === 'object' && value !== null) {
          result.push(...buildNestedParams(value, newKey))
        } else {
          result.push(`${newKey}=${encodeURIComponent(value)}`)
        }
      }
      return result
    }
    return buildNestedParams(params).join('&')
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryString = buildQueryString(queryParams_prem_players)
        const apiUrl = `${API_BASE_URL}?${queryString}`

        const response = await axios.get(apiUrl)
        if (response.status !== 200) {
          throw new Error(`API Error: ${response.statusText}`)
        }

        const result = response.data.data
        if (!Array.isArray(result) || result.length === 0) {
          throw new Error('No players found in API response')
        }

        setPlayers(result)

        // Filter for featured or notable players first, then random
        const notablePlayers = result.filter(player => 
          player.attributes.isFeatured || 
          FILTER_POSITIONS.includes(player.attributes.Position)
        )
        
        const chosen = notablePlayers.length > 0 
          ? notablePlayers[Math.floor(Math.random() * notablePlayers.length)]
          : result[Math.floor(Math.random() * result.length)]
        
        setRandomPlayer(chosen)
        setError(null)
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
      <Box sx={{ width: PLAYER_BOX_WIDTH }}>
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
      <Box sx={{ width: PLAYER_BOX_WIDTH }}>
        <Paper
          sx={{
            p: 3,
            textAlign: 'center',
            backgroundColor: `rgba(34, 38, 41, 0.9)`,
            borderRadius: 3,
            border: '2px solid',
            borderColor: appTheme.colors.error,
          }}
        >
          <Typography color={appTheme.colors.error} fontWeight={600}>
            {error || 'No player data available'}
          </Typography>
          <Typography variant="caption" sx={{ color: appTheme.colors.lightGray, mt: 1, display: 'block' }}>
            Unable to load featured player
          </Typography>
        </Paper>
      </Box>
    )
  }

  return (
    
    <Fade in={!loading} timeout={FADE_TIMEOUT}>
      <Box sx={{ 
        width: PLAYER_BOX_WIDTH,
        position: 'relative',
        '&:hover': {
          transform: `translateY(${HOVER_ELEVATION})`,
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
            backgroundColor: `rgba(${appTheme.colors.secondary}, 0.9)`,
            borderRadius: '20px',
            px: 2,
            py: 0.5,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: appTheme.colors.color1,
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
          aria-label={`View profile for ${randomPlayer.attributes.First_Name} ${randomPlayer.attributes.Last_Name}`}
        >
          <Card
            sx={{
              position: 'relative',
              overflow: 'visible',
              backgroundColor: `rgba(34, 38, 41, 0.95)`,
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '3px solid',
              borderColor: appTheme.colors.secondary,
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
              transition: 'all 0.3s ease',
              height: CARD_HEIGHT,
              '&:hover': {
                boxShadow: `0 16px 40px rgba(${appTheme.colors.secondary}, 0.3)`,
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
                height: IMAGE_HEIGHT,
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
                  alt={`${randomPlayer.attributes.First_Name} ${randomPlayer.attributes.Last_Name} - ${randomPlayer.attributes.Position}`}
                  loading="lazy"
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
                    backgroundColor: `rgba(${appTheme.colors.secondary}, 0.1)`
                  }}
                >
                  <PersonIcon sx={{ fontSize: 80, color: `rgba(${appTheme.colors.secondary}, 0.3)` }} />
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
                    color: appTheme.colors.success,
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
                    color: appTheme.colors.secondary,
                    fontWeight: 900,
                    lineHeight: 1.1,
                    background: `linear-gradient(90deg, ${appTheme.colors.secondary} 0%, ${appTheme.colors.warning} 100%)`,
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
                    backgroundColor: `rgba(${appTheme.colors.secondary}, 0.15)`,
                    color: appTheme.colors.secondary,
                    fontWeight: 600,
                    border: `1px solid ${appTheme.colors.secondary}`,
                    '& .MuiChip-icon': {
                      color: appTheme.colors.secondary
                    },
                    fontSize: '11px'
                  }}
                />

                <Chip
                  icon={<EmojiEventsIcon />}
                  label={randomPlayer.attributes.Position}
                  sx={{
                    backgroundColor: `rgba(${appTheme.colors.accent}, 0.15)`,
                    color: appTheme.colors.accent,
                    fontWeight: 600,
                    border: `1px solid ${appTheme.colors.accent}`,
                    '& .MuiChip-icon': {
                      color: appTheme.colors.accent
                    },
                    fontSize: '11px'
                  }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Link>
      </Box>
    </Fade>
  )
}

export default FeaturedPlayer