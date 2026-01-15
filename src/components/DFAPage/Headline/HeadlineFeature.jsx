


import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import appTheme from '../../../css/theme'
import { useState, useEffect, useCallback, useMemo } from 'react'
import axios from "axios"
import { Link } from 'react-router-dom'

// Embla Carousel imports
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

// Icons
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import ScheduleIcon from '@mui/icons-material/Schedule'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PersonIcon from '@mui/icons-material/Person'

// Constants
const API_URL = 'https://strapi-dominica-sport.onrender.com/api/headline-features?populate=*';
const CAROUSEL_DELAY = 5000;
const SUMMARY_MAX_LENGTH = 200;
const WORDS_PER_MINUTE = 200; // Average reading speed

const HeadlineFeature = () => {
  // Helper function to parse hex color to RGB values
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [255, 107, 0]; // Default to secondary color
  };

  // Format ISO date to readable format (e.g., "Jan 20, 2025")
  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  // Calculate read time based on word count
  const calculateReadTime = (text) => {
    if (!text) return '1 min read';
    const wordCount = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
    return `${Math.max(1, minutes)} min read`;
  };

  const [articles, setArticles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  // Configure Embla Carousel with autoplay
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: CAROUSEL_DELAY, stopOnInteraction: false })
  ]);

  // Function to extract image URL from Strapi response
  const extractImageUrl = (headlineContent) => {
    if (!headlineContent || !Array.isArray(headlineContent)) return null;
    
    // Find the image block in the content
    const imageBlock = headlineContent.find(item => item.type === 'image');
    
    if (imageBlock && imageBlock.image && imageBlock.image.url) {
      // Use the large format if available, otherwise use the original
      if (imageBlock.image.formats && imageBlock.image.formats.large) {
        return imageBlock.image.formats.large.url;
      }
      return imageBlock.image.url;
    }
    
    return null;
  };

  // Function to extract summary/description from Strapi response
  const extractSummary = (headlineContent) => {
    if (!headlineContent || !Array.isArray(headlineContent)) return '';
    
    // Find paragraph or heading blocks
    const textBlocks = headlineContent.filter(item => 
      item.type === 'paragraph' || (item.type === 'heading' && item.level <= 3)
    );
    
    // Extract text from children
    let summary = '';
    textBlocks.forEach(block => {
      if (block.children && Array.isArray(block.children)) {
        block.children.forEach(child => {
          if (child.text && typeof child.text === 'string') {
            summary += child.text + ' ';
          }
        });
      }
    });
    
    // Truncate if too long
    return summary.trim().length > SUMMARY_MAX_LENGTH 
      ? summary.trim().substring(0, SUMMARY_MAX_LENGTH) + '...' 
      : summary.trim();
  };

  // Process Strapi data into our expected format
  const processStrapiData = (strapiData) => {
    if (!Array.isArray(strapiData)) return [];
    
    return strapiData.map((item, index) => {
      const attributes = item.attributes || item;
      
      return {
        id: item.id || index + 1,
        title: attributes.Title || 'Untitled Article',
        summary: extractSummary(attributes.HeadlineContent) || 
                `Read more about ${attributes.Title || 'this story'}...`,
        imageUrl: extractImageUrl(attributes.HeadlineContent) || 
                 `https://images.unsplash.com/photo-${1574629810360 + index * 100}-7efbbe195018?w=1200&h=600&fit=crop`,
        category: attributes.Type || 'News',
        author: attributes.Author || 'Staff Writer',
        date: formatDate(attributes.createdAt || attributes.updatedAt),
        readTime: calculateReadTime(extractSummary(attributes.HeadlineContent))
      };
    });
  };

  // Memoized fallback articles
  const fallbackArticles = useMemo(() => [
    {
      id: 1,
      title: "Dominica Premier League Season Kicks Off",
      summary: "The new season begins with thrilling matches and record attendance. Defending champions face tough competition from rising teams in what promises to be the most competitive season yet.",
      imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=600&fit=crop",
      category: "Premier League",
      author: "Danphil Daniel",
      date: formatDate("2024-01-15"),
      readTime: "3 min read"
    },
    {
      id: 2,
      title: "New Stadium Opening Ceremony This Weekend",
      summary: "State-of-the-art football stadium with 15,000 capacity opens its doors for the first league match. Features include premium seating, advanced lighting, and fan-friendly amenities.",
      imageUrl: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=1200&h=600&fit=crop",
      category: "Facilities",
      author: "Sports Reporter",
      date: formatDate("2024-01-14"),
      readTime: "4 min read"
    }
  ], []);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        
        if (response.status !== 200) {
          throw new Error(`API Error: ${response.statusText}`);
        }

        let data = response.data;
        let processedData = [];
        
        if (data.data && Array.isArray(data.data)) {
          processedData = processStrapiData(data.data);
        } else if (Array.isArray(data)) {
          processedData = processStrapiData(data);
        } else {
          throw new Error('Unexpected response format from API');
        }

        if (processedData.length === 0) {
          throw new Error('No articles found in API response');
        }

        setArticles(processedData);
        setError(null);
        
      } catch (error) {
        console.error("API Error:", error.message);
        setArticles(fallbackArticles);
        setError(`Unable to load articles: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Only run on component mount, allow empty dependency array since processStrapiData is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!emblaApi) return

    onSelect()
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)

    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  if (loading) {
    return (
      <Box sx={{ 
        width: '100%', 
        height: 500, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: appTheme.colors.color1
      }}>
        <SportsSoccerIcon sx={{ fontSize: 60, color: appTheme.colors.secondary, mr: 2, animation: 'spin 1s linear infinite' }} />
        <Typography variant="h5" sx={{ color: 'white' }}>
          Loading League Headlines...
        </Typography>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        width: '100%',
        backgroundColor: appTheme.colors.color1,
        paddingTop: 0,
        borderRadius: { xs: 0, sm: 2 },
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        
      }}
    >
      <Stack 
        width="100%" 
        margin="auto" 
        height={{ xs: 'auto', sm: 550, md: 600 }}
        padding={0}
        position="relative"
      >
        <Typography 
          variant="h2" 
          sx={{ 
            color: 'white', 
            padding: { xs: 2, sm: 3 },
            paddingBottom: 1,
            fontSize: { xs: '1.8rem', sm: '2.5rem' },
            fontWeight: 700,
            background: `linear-gradient(90deg, ${appTheme.colors.secondary} 0%, ${appTheme.colors.warning} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          <SportsSoccerIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          League Headlines
        </Typography>
        
        <Box sx={{ 
          width: '100%', 
          height: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {articles && articles.length > 0 ? (
            <>
              {/* Embla Carousel Container */}
              <Box 
                className="embla" 
                ref={emblaRef}
                sx={{ 
                  overflow: 'hidden',
                  height: '100%'
                }}
              >
                <Box className="embla__container" sx={{ display: 'flex', height: '100%' }}>
                  {articles.map((article) => (
                    
                    <Box 
                      key={article.id} 
                      className="embla__slide"
                      sx={{ 
                        flex: '0 0 100%',
                        minWidth: 0,
                        padding: { xs: 0, sm: 2 }
                      }}
                    >


                      <Card 
                        sx={{ 
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          backgroundColor: 'transparent',
                          boxShadow: 'none',
                          height: { xs: 'auto', sm: 450, md: 500 },
                          borderRadius: { xs: 0, sm: 2 },
                          overflow: 'hidden',
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        {/* Featured Image */}
                        <Box 
                          sx={{ 
                            width: { xs: '100%', sm: '60%' },
                            height: { xs: 300, sm: '100%' },
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          <Box
                            component="img"
                            src={article.imageUrl}
                            alt={article.title}
                            loading="lazy"
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.5s ease',
                              '&:hover': {
                                transform: 'scale(1.05)'
                              }
                            }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 20,
                              left: 20,
                              backgroundColor: appTheme.colors.secondary,
                              color: 'white',
                              padding: '6px 16px',
                              borderRadius: '20px',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                            }}
                          >
                            {article.category}
                          </Box>
                        </Box>

                        {/* Content */}
                        <Box 
                          sx={{ 
                            width: { xs: '100%', sm: '40%' },
                            padding: { xs: 3, sm: 4 },
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            backgroundColor: `rgba(34, 38, 41, 0.95)`
                          }}
                        >
                          <Typography 
                            variant="h3"
                            sx={{
                              color: 'white',
                              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                              fontWeight: 700,
                              lineHeight: 1.2,
                              marginBottom: 2
                            }}
                          >
                            {article.title}
                          </Typography>
                          
                          <Typography 
                            variant="body1"
                            sx={{
                              color: appTheme.colors.lightGray,
                              fontSize: { xs: '0.9rem', sm: '1rem' },
                              lineHeight: 1.6,
                              marginBottom: 3,
                              flexGrow: 1
                            }}
                          >
                            {article.summary}
                          </Typography>

                          <Grid container spacing={2} sx={{ marginBottom: 3 }}>
                            <Grid item>
                              <Typography 
                                variant="caption"
                                sx={{
                                  color: appTheme.colors.secondary,
                                  fontSize: '0.8rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5
                                }}
                              >
                                <CalendarTodayIcon fontSize="small" />
                                {article.date}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography 
                                variant="caption"
                                sx={{
                                  color: appTheme.colors.accent,
                                  fontSize: '0.8rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5
                                }}
                              >
                                <ScheduleIcon fontSize="small" />
                                {article.readTime}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography 
                                variant="caption"
                                sx={{
                                  color: appTheme.colors.success,
                                  fontSize: '0.8rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5
                                }}
                              >
                                <PersonIcon fontSize="small" />
                                {article.author}
                              </Typography>
                            </Grid>
                          </Grid>

                          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', marginBottom: {xs: 2.5}, justifyContent: 'center' }}>
                            <Button
                              variant="contained"
                              component={Link}
                              to={`/headline/${article.id}`}
                              sx={{
                                backgroundColor: appTheme.colors.secondary,
                                color: 'white',
                                padding: '10px 24px',
                                borderRadius: '25px',
                                fontWeight: 600,
                                '&:hover': {
                                  backgroundColor: appTheme.colors.secondary,
                                  opacity: 0.8,
                                  transform: 'translateY(-2px)',
                                  boxShadow: `0 6px 20px rgba(255, 107, 0, 0.3)`
                                },
                                transition: 'all 0.3s ease'
                              }}
                            >
                              Read Full Story
                            </Button>
                          </Box>
                        </Box>
                      </Card>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Navigation Buttons */}
              <Box sx={{ 
                position: 'absolute',
                top: '50%',
                left: { xs: 0, sm: 10 },
                right: { xs: 0, sm: 10 },
                transform: 'translateY(-50%)',
                display: 'flex',
                justifyContent: 'space-between',
                zIndex: 10,
                pointerEvents: 'none'
              }}>
                <IconButton
                  onClick={scrollPrev}
                  aria-label="Previous article"
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: appTheme.colors.secondary,
                    pointerEvents: 'auto',
                    '&:hover': {
                      backgroundColor: `rgba(255, 107, 0, 0.8)`,
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.3s ease',
                    display: { xs: 'none', sm: 'flex' }
                  }}
                >
                  <ArrowBackIosNewIcon />
                </IconButton>
                
                <IconButton
                  onClick={scrollNext}
                  aria-label="Next article"
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: appTheme.colors.secondary,
                    pointerEvents: 'auto',
                    '&:hover': {
                      backgroundColor: `rgba(255, 107, 0, 0.8)`,
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.3s ease',
                    display: { xs: 'none', sm: 'flex' }
                  }}
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              </Box>

              {/* Dots Navigation */}
              <Box sx={{ 
                position: 'absolute',
                bottom: 20,
                left: 0,
                right: 0,
                display: { xs: 'none', sm: 'flex' },
                justifyContent: 'center',
                gap: 1,
                zIndex: 10
              }}>
                {scrollSnaps.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => scrollTo(index)}
                    role="tab"
                    aria-selected={selectedIndex === index}
                    aria-label={`Go to article ${index + 1}`}
                    sx={{
                      width: selectedIndex === index ? 40 : 12,
                      height: 6,
                      backgroundColor: selectedIndex === index ? appTheme.colors.secondary : 'rgba(255, 255, 255, 0.5)',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: selectedIndex === index ? appTheme.colors.secondary : 'rgba(255, 255, 255, 0.7)'
                      }
                    }}
                  />
                ))}
              </Box>
            </>
          ) : (
            <Box sx={{ 
              padding: 4, 
              textAlign: 'center',
              color: 'white'
            }}>
              <SportsSoccerIcon sx={{ fontSize: 60, color: appTheme.colors.secondary, mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                No Featured Articles Available
              </Typography>
              <Typography variant="body2" sx={{ color: appTheme.colors.lightGray, mb: 3 }}>
                Check back soon for the latest league headlines and updates.
              </Typography>
              <Button
                component={Link}
                to="/articles"
                variant="contained"
                sx={{
                  backgroundColor: appTheme.colors.secondary,
                  color: 'white',
                  '&:hover': {
                    opacity: 0.8
                  }
                }}
              >
                Browse All Articles
              </Button>
            </Box>
          )}
        </Box>
        
        {/* Error message display */}
        {error && (
          <Box sx={{ 
            position: 'absolute', 
            bottom: 10, 
            right: 10, 
            backgroundColor: 'rgba(244, 67, 54, 0.15)',
            padding: 2,
            borderRadius: 1,
            borderLeft: `4px solid ${appTheme.colors.error}`,
            maxWidth: 300
          }}>
            <Typography variant="caption" sx={{ color: appTheme.colors.error, display: 'block' }}>
              {error}
            </Typography>
          </Box>
        )}
        
        {/* Decorative elements */}
        <Box 
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${appTheme.colors.secondary} 0%, ${appTheme.colors.secondary} 50%, ${appTheme.colors.secondary} 100%)`
          }}
        />
      </Stack>
    </Box>
  );
};

export default HeadlineFeature;