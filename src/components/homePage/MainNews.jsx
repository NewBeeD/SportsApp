import { Skeleton } from '@mui/material'
import PropTypes from 'prop-types'

import '../../css/MainNewsCss.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slide from '../../modules/MainHeadline/Slide';

import { useSelector } from 'react-redux';
import Slider from 'react-slick';

import '../../css/responsivenessWebApp.css'


const MainNews = ({ league }) => {

  const articlesState = useSelector((state) => state.articles)
  const articles = Array.isArray(articlesState?.[0]) ? articlesState[0] : [];

  const normalizeYes = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    if (typeof value === 'string') {
      const v = value.trim().toLowerCase();
      return v === 'yes' || v === 'true' || v === '1';
    }
    return false;
  };

  const headline = articles.filter((item) => {
    if (!normalizeYes(item?.Headline ?? item?.headline)) return false;
    if (league) return item?.league === league;
    return true;
  });


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

MainNews.propTypes = {
  league: PropTypes.string,
}