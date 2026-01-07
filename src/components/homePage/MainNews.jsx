import {  Skeleton } from '@mui/material'
import { Link } from 'react-router-dom';

import theme from '../../css/theme';


import '../../css/MainNewsCss.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slide from '../../modules/MainHeadline/Slide';

import { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
import Slider from 'react-slick';

import '../../css/responsivenessWebApp.css'


const MainNews = () => {

  let articles = useSelector((state) => state.articles)
  articles = articles && articles[0] ? articles[0]: '';
  let headline = articles && articles[0] ? articles.filter(item => item.headline == 'Yes' && item.league == 'DFA'): '';


  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500, // Adjust the speed (in milliseconds) as needed
    cssEase: 'cubic-bezier(.76,.49,.72,.66)',

  };

  // const [headline, setHeadline] = useState(slides)
  const [newsCounter, setNewsCounter] = useState(0)


  const getVideoDimensions = () => {
    const windowWidth = window.innerWidth;

    // Adjust these values based on your layout and design preferences
    if (windowWidth >= 500) {
      return {window_width: 500}
    } else if (windowWidth >= 420) {
      return {window_width: 420}
    }else if (windowWidth >= 400) {
      return {window_width: 400}
    }else if (windowWidth >= 390) {
      return {window_width: 390}
    }else if (windowWidth >= 350) {
      return {window_width: 350}
    }
    else if (windowWidth >= 300) {
      return {window_width: 300}
    } 
    else {
      return {window_width: 280}
    }
    
  };

  const { window_width } = getVideoDimensions();



  return (

    <div >
      {headline.length > 0 ? 
        <Slider  {...settings}>
        
        {headline.map((slideData, idx) => (
          <Slide key={idx} headline={slideData} />
        ))}

        </Slider>: 
        
        <Skeleton />}

      
    </div>



  )
}

export default MainNews