

import { 
  Box, 
  Stack, 
  Typography, 
  Card, 
  Skeleton,
  Chip,
  Button,
  Grid,
  useMediaQuery,
  useTheme as useMuiTheme
} from "@mui/material"
import { useSelector } from 'react-redux'
import { Link } from "react-router-dom"
import { memo, useMemo, useCallback } from 'react'
import {
  SportsSoccer,
  LocationOn,
  AccessTime,
  CalendarToday,
  EmojiEvents,
  ArrowForward
} from '@mui/icons-material'
import appTheme from '../../css/theme'

// Import the fixtures data fetch
import GetFixtures from "../../modules/Homepage/Fixtures/FixturesDataFetch"

// Constants
const HOMEPAGE_FIXTURES_LIMIT = 5
const STATUS_COLORS = {
  COMPLETED: { text: 'FT', color: appTheme.colors.success },
  CANCELLED: { text: 'CANCELLED', color: appTheme.colors.error },
  UPCOMING: { text: 'VS', color: appTheme.colors.secondary }
}
const SKELETON_COUNT_HOME = 3
const SKELETON_COUNT_FULL = 5

// Helper function to determine fixture status
const getFixtureStatus = (fixture) => {
  if (fixture.Cancelled === 'Yes') return STATUS_COLORS.CANCELLED
  if (fixture.Complete === 'Yes') return STATUS_COLORS.COMPLETED
  return STATUS_COLORS.UPCOMING
}

// Helper function to format score display
const formatScoreDisplay = (fixture) => {
  if (fixture.Complete === 'Yes' && fixture.HomeScore !== null && fixture.AwayScore !== null) {
    return `${fixture.HomeScore || 0} - ${fixture.AwayScore || 0}`
  }
  return null
}

// Render team name with optional link
const renderTeamName = (teamName, teamId, isHomepage, textAlign = 'left') => {
  if (isHomepage || !teamId) {
    return (
      <Typography
        sx={{
          color: 'white',
          fontWeight: 600,
          fontSize: { xs: '0.85rem', sm: '1rem' },
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textAlign
        }}
      >
        {teamName}
      </Typography>
    )
  }

  return (
    <Link 
      to={`/DFA/Home/Team/${teamId}`} 
      style={{ textDecoration: 'none' }}
      aria-label={`View ${teamName} team profile`}
    >
      <Typography
        sx={{
          color: appTheme.colors.secondary,
          fontWeight: 600,
          fontSize: { xs: '0.85rem', sm: '1rem' },
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textAlign,
          '&:hover': {
            color: appTheme.colors.warning,
            textDecoration: 'underline'
          }
        }}
      >
        {teamName}
      </Typography>
    </Link>
  )
}

// Fixture card component for reusability
const FixtureCard = memo(({ fixture, showLeague = false, showVenue = true, showGoals = false, compact = false, isHomepage = false }) => {
  const muiTheme = useMuiTheme()
  
  if (!fixture) return null

  const status = getFixtureStatus(fixture)
  const scoreDisplay = formatScoreDisplay(fixture)

  return (
    <Card
      sx={{
        marginBottom: 2,
        borderRadius: 2,
        overflow: 'hidden',
        border: `1px solid rgba(${appTheme.colors.secondary}, 0.2)`,
        backgroundColor: 'rgba(34, 38, 41, 0.95)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 25px rgba(${appTheme.colors.secondary}, 0.2)`,
          borderColor: appTheme.colors.secondary
        },
      }}
    >
      {/* League header */}
      {showLeague && fixture.League && (
        <Box
          sx={{
            backgroundColor: `rgba(${appTheme.colors.secondary}, 0.1)`,
            padding: 1,
            borderBottom: `1px solid rgba(${appTheme.colors.secondary}, 0.3)`
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: appTheme.colors.secondary,
              fontWeight: 600,
              textAlign: 'center',
              display: 'block'
            }}
          >
            {fixture.League_fullName}
          </Typography>
        </Box>
      )}

      {/* Main fixture content */}
      <Box sx={{ padding: compact ? 1.5 : 2 }}>
        
        {/* Teams and scores */}
        <Grid container alignItems="center" spacing={compact ? 1 : 2}>
          {/* Home team */}
          <Grid item xs={5}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box sx={{ overflow: 'hidden', width: '100%' }}>
                {renderTeamName(fixture.Home, fixture.Home_Id, isHomepage, 'left')}
              </Box>
            </Stack>
          </Grid>

          {/* Match status and score */}
          <Grid item xs={2}>
            <Stack alignItems="center" spacing={0.5}>
              {scoreDisplay ? (
                <>
                  <Typography
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      fontSize: compact ? '1rem' : '16px',
                      background: `linear-gradient(90deg, ${appTheme.colors.secondary}, ${appTheme.colors.warning})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {scoreDisplay}
                  </Typography>

                  <Chip
                    label={status.text}
                    size="small"
                    sx={{
                      backgroundColor: `rgba(${status.color}, 0.2)`,
                      color: status.color,
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 20,
                      border: `1px solid rgba(${status.color}, 0.4)`
                    }}
                  />
                </>
              ) : (
                <Stack alignItems="center">
                  <Chip
                    label={status.text}
                    size="small"
                    sx={{
                      backgroundColor: `rgba(${appTheme.colors.secondary}, 0.2)`,
                      color: appTheme.colors.secondary,
                      fontWeight: 700,
                      border: `1px solid ${appTheme.colors.secondary}`,
                      fontSize: compact ? '0.8rem' : '0.9rem'
                    }}
                  />
                  {!compact && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: appTheme.colors.lightGray,
                        mt: 0.5,
                        textAlign: 'center'
                      }}
                    >
                      {fixture.Time}
                    </Typography>
                  )}
                </Stack>
              )}
            </Stack>
          </Grid>

          {/* Away team */}
          <Grid item xs={5}>
            <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
              <Box sx={{ overflow: 'hidden', textAlign: 'right', width: '100%' }}>
                {renderTeamName(fixture.Away, fixture.Away_Id, isHomepage, 'right')}
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {/* Match details - compact view shows less info */}
        {!compact && (
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={1} 
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            sx={{ mt: 1.5 }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              {showVenue && fixture.Venue && fixture.Venue !== 'Cancelled' && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <LocationOn fontSize="small" sx={{ color: appTheme.colors.accent, fontSize: 16 }} />

                  <Typography variant="caption" sx={{ color: appTheme.colors.lightGray }}>
                    {fixture.Venue}
                  </Typography>

                  <Typography variant="caption" fontWeight={900} sx={{ color: appTheme.colors.lightGray, paddingLeft: 2, letterSpacing: 2 }}>
                    {fixture.Time}
                  </Typography>
                </Stack>
              )}
              
              {fixture.Cancelled === 'Yes' && (
                <Chip
                  label="CANCELLED"
                  size="small"
                  sx={{
                    backgroundColor: `rgba(${appTheme.colors.error}, 0.2)`,
                    color: appTheme.colors.error,
                    fontWeight: 600,
                    fontSize: '0.7rem'
                  }}
                />
              )}
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              {!scoreDisplay && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <CalendarToday fontSize="small" sx={{ color: appTheme.colors.success, fontSize: 14 }} />
                  <Typography variant="caption" sx={{ color: appTheme.colors.lightGray }}>
                    {fixture.Date}
                  </Typography>
                </Stack>
              )}
              <Typography variant="caption" sx={{ color: appTheme.colors.secondary }}>
                {fixture.League_fullName}
              </Typography>
            </Stack>
          </Stack>
        )}

        {/* Compact view date/time */}
        {compact && !scoreDisplay && (
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <CalendarToday fontSize="small" sx={{ color: appTheme.colors.success, fontSize: 12 }} />
              <Typography variant="caption" sx={{ color: appTheme.colors.lightGray }}>
                {fixture.Date}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <AccessTime fontSize="small" sx={{ color: appTheme.colors.accent, fontSize: 12 }} />
              <Typography variant="caption" sx={{ color: appTheme.colors.lightGray }}>
                {fixture.Time}
              </Typography>
            </Stack>
          </Stack>
        )}

        {/* Goal scorers */}
        {showGoals && fixture.Game_Info && (
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: appTheme.colors.secondary,
                fontWeight: 600,
                mb: 1
              }}
            >
              Goal Scorers
            </Typography>
            
            <Grid container spacing={2}>
              {/* Home scorers */}
              <Grid item xs={6}>
                <Stack spacing={0.5}>
                  {fixture.Game_Info.Goal_Scorers_Home?.map((scorer, index) => (
                    <Stack key={index} direction="row" alignItems="center" spacing={1}>
                      <SportsSoccer sx={{ color: appTheme.colors.success, fontSize: 16 }} />
                      <Typography variant="caption" sx={{ color: 'white' }}>
                        {scorer}
                      </Typography>
                    </Stack>
                  ))}
                  {(!fixture.Game_Info.Goal_Scorers_Home || fixture.Game_Info.Goal_Scorers_Home.length === 0) && (
                    <Typography variant="caption" sx={{ color: appTheme.colors.lightGray, fontStyle: 'italic' }}>
                      No goals
                    </Typography>
                  )}
                </Stack>
              </Grid>

              {/* Away scorers */}
              <Grid item xs={6}>
                <Stack spacing={0.5} alignItems="flex-end">
                  {fixture.Game_Info.Goal_Scorers_Away?.map((scorer, index) => (
                    <Stack key={index} direction="row" alignItems="center" spacing={1}>
                      <Typography variant="caption" sx={{ color: 'white' }}>
                        {scorer}
                      </Typography>
                      <SportsSoccer sx={{ color: appTheme.colors.success, fontSize: 16 }} />
                    </Stack>
                  ))}
                  {(!fixture.Game_Info.Goal_Scorers_Away || fixture.Game_Info.Goal_Scorers_Away.length === 0) && (
                    <Typography variant="caption" sx={{ color: appTheme.colors.lightGray, fontStyle: 'italic', textAlign: 'right' }}>
                      No goals
                    </Typography>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Card>
  )
})

FixtureCard.displayName = 'FixtureCard'

// Loading skeleton component
const FixtureSkeleton = memo(({ compact = false }) => (
  <Box sx={{ width: '100%', marginBottom: 2 }}>
    <Skeleton 
      variant="rectangular" 
      width="100%" 
      height={compact ? 80 : 120}
      sx={{ 
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      }} 
    />
  </Box>
))

FixtureSkeleton.displayName = 'FixtureSkeleton'

// Main FixturesData component
const FixturesData = ({ page, type, league }) => {
  const muiTheme = useMuiTheme()
  
  // Get fixtures data
  GetFixtures()
  const fixtures_raw = useSelector((state) => state.fixtures)
  
  // Validate and process fixtures data
  const fixtures_all = useMemo(() => {
    if (!fixtures_raw || !Array.isArray(fixtures_raw) || fixtures_raw.length === 0) return []
    return fixtures_raw[0] && Array.isArray(fixtures_raw[0]) ? fixtures_raw[0] : fixtures_raw
  }, [fixtures_raw])
  
  // Filter fixtures based on league
  const fixtures_filtered = useMemo(() => {
    if (!league) return fixtures_all
    return fixtures_all.filter(item => 
      item?.League === league || item?.LeagueName === league
    )
  }, [fixtures_all, league])
  
  // Filter fixtures based on type
  const getFilteredFixtures = useCallback(() => {
    switch(type) {
      case 'now':
        const upcoming = fixtures_filtered.filter(item => 
          item?.Complete !== 'Yes' && item?.Cancelled !== 'Yes'
        )
        return page === 'home' || page === 'Dfahome' 
          ? upcoming.slice(0, HOMEPAGE_FIXTURES_LIMIT)
          : upcoming
      case 'past':
        return fixtures_filtered.filter(item => item?.Complete === 'Yes')
      default:
        return fixtures_filtered
    }
  }, [fixtures_filtered, page, type])

  const filteredFixtures = useMemo(() => getFilteredFixtures(), [getFilteredFixtures])
  const isLoading = fixtures_all.length === 0

  // Render based on page type
  const renderFixtures = useCallback(() => {
    if (isLoading) {
      const skeletonCount = page === 'home' || page === 'Dfahome' ? SKELETON_COUNT_HOME : SKELETON_COUNT_FULL
      return Array.from({ length: skeletonCount }).map((_, idx) => (
        <FixtureSkeleton key={idx} compact={page === 'home' || page === 'Dfahome'} />
      ))
    }

    if (filteredFixtures.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <EmojiEvents sx={{ fontSize: 48, color: `rgba(${appTheme.colors.secondary}, 0.3)`, mb: 2 }} />
          <Typography sx={{ color: appTheme.colors.lightGray }}>
            No fixtures available at the moment
          </Typography>
        </Box>
      )
    }

    return filteredFixtures.map((fixture, idx) => (
      <FixtureCard
        key={idx}
        fixture={fixture}
        showLeague={page === 'home' || page === 'dfa' || page === 'div_1' || page === 'daba'}
        showVenue={true}
        showGoals={type === 'past' && fixture?.Game_Info}
        compact={page === 'home' || page === 'Dfahome'}
        isHomepage={page === 'home'}
      />
    ))
  }, [isLoading, filteredFixtures, page, type])

  // Component title based on page and league
  const getTitle = useCallback(() => {
    if (page === 'home') return 'Upcoming Fixtures'
    if (page === 'Dfahome') return 'League Fixtures'
    if (type === 'now') return 'Scheduled Fixtures'
    if (type === 'past') return 'Past Fixtures'
    
    if (filteredFixtures.length > 0) {
      const leagueName = filteredFixtures[0]?.League_fullName || filteredFixtures[0]?.LeagueName
      return leagueName ? `${leagueName} Fixtures` : 'Game Fixtures'
    }
    
    return 'Game Fixtures'
  }, [page, type, filteredFixtures])

  // Determine max width based on page
  const getMaxWidth = useCallback(() => {
    switch(page) {
      case 'home':
        return 600
      case 'Dfahome':
        return 350
      default:
        return '100%'
    }
  }, [page])

  return (
    <Box 
      sx={{ 
        width: '100%',
        maxWidth: getMaxWidth(),
        margin: 'auto',
        backgroundColor: `rgba(34, 38, 41, 0.95)`,
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        border: `1px solid rgba(${appTheme.colors.secondary}, 0.2)`,
        padding: page === 'home' || page === 'Dfahome' ? { xs: 2, sm: 3 } : 2
      }}
    >
      {/* Header */}
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center"
        sx={{ 
          mb: 3,
          pb: 2,
          borderBottom: `2px solid`,
          borderColor: appTheme.colors.secondary
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            fontWeight: 700,
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <SportsSoccer sx={{ color: appTheme.colors.secondary }} />
          {getTitle()}
        </Typography>
        
        {type === 'past' && (
          <Chip
            label="COMPLETED"
            sx={{
              backgroundColor: `rgba(${appTheme.colors.success}, 0.2)`,
              color: appTheme.colors.success,
              fontWeight: 600,
              fontSize: { xs: '0.7rem', sm: '0.8rem' }
            }}
          />
        )}
      </Stack>

      {/* Fixtures list */}
      <Box>
        {renderFixtures()}
      </Box>

      {/* View All button for homepage and Dfahome */}
      {(page === 'home' || page === 'Dfahome') && filteredFixtures.length > 0 && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            component={Link}
            to="/DFA/Fixtures"
            variant="outlined"
            endIcon={<ArrowForward />}
            aria-label="View all fixtures"
            sx={{
              color: appTheme.colors.secondary,
              borderColor: appTheme.colors.secondary,
              borderRadius: '20px',
              px: 4,
              fontWeight: 600,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              '&:hover': {
                backgroundColor: `rgba(${appTheme.colors.secondary}, 0.1)`,
                borderColor: appTheme.colors.warning,
                color: appTheme.colors.warning,
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            View All Fixtures
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default FixturesData