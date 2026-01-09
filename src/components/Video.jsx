import PropTypes from 'prop-types';

import {  Box } from '@mui/material'
import Typography from '@mui/material/Typography';
import StarIcon from '@mui/icons-material/Star';


import { useEffect, useState } from 'react';


import axios from 'axios'

import Youtube from 'react-youtube'
import MuxPlayer from '@mux/mux-player-react'

import VideoStructure from '../modules/Video/VideoStructure';




// Video player component that supports both YouTube and Mux videos
// Automatically detects video type and uses appropriate player

const Video = ({ VideoLocation }) => {

  let videoLocate = VideoLocation

  const [video, setVideo] = useState(null);
  const [videoTitle, setVideoTitle] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {

        // Your API endpoint URL
        const apiUrl = 'https://strapi-dominica-sport.onrender.com/api/videos';
  

        // Make the fetch request
        const response = await axios.get(apiUrl);

        // Check if the request was successful (status code 2xx)
        if (response.status !== 200) {
          throw new Error(`Error: ${response.statusText}`);
        }

        // Parse the JSON data
        const result = await response.data.data;

        let final_data = VideoStructure(result)

        // console.log(final_data);

        final_data = final_data.filter(item => item.Location === videoLocate)
        
        // Only set data if a matching video is found
        if (final_data.length > 0) {
          setVideo(final_data[0].VideoId);
          setVideoTitle(final_data[0].Title);
        } else {
          // No video found for this location - hide component
          setVideo(null);
          setVideoTitle('');
        }
      } catch (error) {
        console.error('Error fetching video:', error.message);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, [videoLocate]);



  return(
    // Only render if a video was found
    !video ? null : (
    <Box display='flex' justifyContent='center' alignItems='center' width={{xs: 'inherit'}} >

      <Box width="100%">
        {/* Video Title - Modern Gradient Card Design */}
        {videoTitle && (
          <Box
            sx={{
              marginBottom: 2,
              padding: '20px 24px',
              background: '#fff',
              borderRadius: '16px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              position: 'relative',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #00D4FF 0%, #7C3AED 50%, #EC4899 100%)',
                borderRadius: '16px 16px 0 0',
              },
              '&:hover': {
                boxShadow: '0 20px 60px rgba(124, 58, 237, 0.15)',
                transform: 'translateY(-8px)',
                border: '1px solid rgba(124, 58, 237, 0.1)',
              }
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <StarIcon 
                sx={{ 
                  color: '#7C3AED',
                  fontSize: '26px',
                  transition: 'all 0.4s ease',
                }} 
              />
              <Box flex={1}>
                <Typography 
                  sx={{
                    fontSize: { xs: '12px', sm: '13px' },
                    color: '#7C3AED',
                    fontWeight: 600,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    marginBottom: '4px'
                  }}
                >
                  Featured Video
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{
                    color: '#1a1a1a',
                    fontWeight: 700,
                    letterSpacing: '0.2px',
                    fontSize: { xs: '16px', sm: '18px' },
                    background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {videoTitle}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Video Player Container - Maintains aspect ratio naturally */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000',
            borderRadius: '0px',
            overflow: 'hidden',
            '& iframe': {
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
            },
            '& video': {
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
            }
          }}
        >
          {/* Video Player */}
          {video && video.length > 0 ? (
            // Try to detect if it's a Mux playback ID or YouTube ID
            video.includes('youtube') || video.match(/^[a-zA-Z0-9_-]{11}$/) ? (
              // YouTube video
              <Youtube
                videoId={video}
                opts={{ 
                  playerVars: {
                    autoplay: 0,
                    controls: 1,
                    fs: 1,
                    iv_load_policy: 3,
                    loop: 1,
                  },
                  width: '100%', 
                  height: 'auto'
                }}
                onReady={(event) => {
                  event.target.pauseVideo();
                }}
                onEnd={(event) => {
                  event.target.seekTo(0);
                }}
              />
            ) : (
              // Mux video - maintains natural aspect ratio
              <MuxPlayer
                playbackId={video}
                style={{ 
                  width: '100%',
                  maxWidth: '100%',
                  height: 'auto'
                }}
                autoPlay={false}
                controls
                theme="light"
              />
            )
          ) : ''}
        </Box>
      </Box>

    </Box>
    )
  )

}

export default Video;

Video.propTypes = {
  VideoLocation: PropTypes.string.isRequired,
};