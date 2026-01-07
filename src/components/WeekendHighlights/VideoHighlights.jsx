import {  Box } from '@mui/material'


import { useEffect, useRef, useState } from 'react';


import axios from 'axios'

import Youtube from 'react-youtube'

import VideoStructure from '../../modules/Video/VideoStructure';




// TODO: Set up this component to recieve the video/media type (name) you want to use

const VideoHighlights = ({ VideoLocation }) => {

  let videoLocate = VideoLocation



  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let width;
  let height;



  const getVideoDimensions = () => {
    
    const windowWidth = window.innerWidth;

    let width = windowWidth-20;
    let height;

    // return {width: windowWidth-20, height: '290'}

    // Adjust these values based on your layout and design preferences
    if (windowWidth >= 1200) {
      height= '300'
    } else if (windowWidth >= 768) {
      height= '290'
    }else if (windowWidth >= 530) {
      height= '280'
    }else if (windowWidth >= 400) {
     height= '270'
    }else if (windowWidth >= 350) {
     height= '260'
    }
    else if (windowWidth >= 300) {
     height= '250'
    } 
    else {
      height= '450'
    }

    return {width: width, height: height}
  };

  switch(VideoLocation){

    case 'Homepage1':
    case 'Homepage2':
    case 'Homepage3':
      width = '100%'
      height = '300px'
      break;
    
    default:
      ({width, height} = getVideoDimensions())
    
  }


  const opts = {
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      controls: 1,
      fs: 1,
      iv_load_policy: 3,
      loop: 1,

    },
  };

  const onEnd = (event) => {
    // Manually seek to the beginning when the video ends
    event.target.seekTo(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Set loading to true when starting the fetch
        setLoading(true);

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
        
        // Set the data state
        setVideo(final_data[0].VideoId);
      } catch (error) {
        // Set the error state if there's an issue
        setError(error.message);
      } finally {
        // Set loading to false regardless of success or failure
        setLoading(false);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, []);



  return(

    <Box display='flex' justifyContent='center' alignItems='center' width={{xs: 'inherit'}} style={{ height: '100%'}} >

        {video && video.length > 0 ? <Youtube
        videoId={video}
        opts={{ ...opts, width, height }}
        onReady={(event) => {
          event.target.pauseVideo();
        }}
        onEnd={onEnd}

        />: ''}

    </Box>

  )

}

export default VideoHighlights