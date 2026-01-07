


import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import { useState, useEffect, useCallback } from 'react'
import qs from 'qs'
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

const HeadlineFeature = () => {
  const [articles, setArticles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  // Configure Embla Carousel with autoplay
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false })
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
    return summary.trim().length > 200 
      ? summary.trim().substring(0, 200) + '...' 
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
        date: attributes.createdAt || attributes.updatedAt || new Date().toISOString().split('T')[0],
        readTime: '3 min read' // Default, could be calculated from content
      };
    });
  };

  // Fallback data for football league
  const fallbackArticles = [
    {
      id: 1,
      title: "Dominica Premier League Season Kicks Off",
      summary: "The new season begins with thrilling matches and record attendance. Defending champions face tough competition from rising teams in what promises to be the most competitive season yet.",
      imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=600&fit=crop",
      category: "Premier League",
      author: "Danphil Daniel",
      date: "2024-01-15",
      readTime: "3 min read"
    },
    {
      id: 2,
      title: "New Stadium Opening Ceremony This Weekend",
      summary: "State-of-the-art football stadium with 15,000 capacity opens its doors for the first league match. Features include premium seating, advanced lighting, and fan-friendly amenities.",
      imageUrl: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=1200&h=600&fit=crop",
      category: "Facilities",
      author: "Sports Reporter",
      date: "2024-01-14",
      readTime: "4 min read"
    }
  ];

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
        
        // Updated API URL to include population of image
        const apiUrl = `https://strapi-dominica-sport.onrender.com/api/headline-features?populate=*`;
        
        const response = await axios.get(apiUrl);
        
        if (response.status !== 200) {
          throw new Error(`Error: ${response.statusText}`);
        }

        // Check if we have data in the expected format
        let data = response.data;
        
        // Handle different possible response structures
        if (data.data && Array.isArray(data.data)) {
          // Standard Strapi v4 response
          const processedData = processStrapiData(data.data);
          setArticles(processedData);
        } else if (Array.isArray(data)) {
          // Direct array response
          const processedData = processStrapiData(data);
          setArticles(processedData);
        } else {
          throw new Error('Unexpected response format');
        }
        
      } catch (error) {
        console.error("API Error, using fallback data:", error.message);
        setArticles(fallbackArticles);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        backgroundColor: '#222629'
      }}>
        <SportsSoccerIcon sx={{ fontSize: 60, color: '#FFD700', mr: 2, animation: 'spin 1s linear infinite' }} />
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
        backgroundColor: '#222629',
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
            background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
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
                              backgroundColor: '#FF6B00',
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
                            backgroundColor: 'rgba(34, 38, 41, 0.95)'
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
                              color: '#B0B0B0',
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
                                  color: '#FFD700',
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
                                  color: '#4FC3F7',
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
                                  color: '#90EE90',
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

                          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', marginBottom: {xs: 2.5} }}>
                            <Button
                              variant="contained"
                              component={Link}
                              to={`/headline/${article.id}`}
                              sx={{
                                backgroundColor: '#FF6B00',
                                color: 'white',
                                padding: '10px 24px',
                                borderRadius: '25px',
                                fontWeight: 600,
                                '&:hover': {
                                  backgroundColor: '#FF8B33',
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 6px 20px rgba(255, 107, 0, 0.3)'
                                },
                                transition: 'all 0.3s ease'
                              }}
                            >
                              Read Full Story
                            </Button>
                            
                            <Button
                              variant="outlined"
                              component={Link}
                              to="/articles"
                              sx={{
                                borderColor: '#FFD700',
                                color: '#FFD700',
                                padding: '10px 24px',
                                borderRadius: '25px',
                                fontWeight: 600,
                                '&:hover': {
                                  borderColor: '#FFED4E',
                                  color: '#FFED4E',
                                  backgroundColor: 'rgba(255, 215, 0, 0.1)'
                                }
                              }}
                            >
                              All News
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
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: '#FFD700',
                    pointerEvents: 'auto',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 107, 0, 0.8)',
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
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: '#FFD700',
                    pointerEvents: 'auto',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 107, 0, 0.8)',
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
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                zIndex: 10
              }}>
                {scrollSnaps.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => scrollTo(index)}
                    sx={{
                      width: selectedIndex === index ? 40 : 12,
                      height: 6,
                      backgroundColor: selectedIndex === index ? '#FF6B00' : 'rgba(255, 255, 255, 0.5)',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: selectedIndex === index ? '#FF8B33' : 'rgba(255, 255, 255, 0.7)'
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
              <SportsSoccerIcon sx={{ fontSize: 60, color: '#FF6B00', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                No Featured Articles Available
              </Typography>
              <Typography variant="body2" sx={{ color: '#B0B0B0' }}>
                Check back soon for the latest league headlines and updates.
              </Typography>
            </Box>
          )}
        </Box>
        
        {/* Error message display */}
        {error && (
          <Box sx={{ 
            position: 'absolute', 
            bottom: 10, 
            right: 10, 
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            padding: 1,
            borderRadius: 1
          }}>
            <Typography variant="caption" sx={{ color: '#FF6B6B' }}>
              Using fallback data
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
            background: 'linear-gradient(90deg, #FFD700 0%, #FF6B00 50%, #FFD700 100%)'
          }}
        />
      </Stack>
    </Box>
  );
};

export default HeadlineFeature;