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