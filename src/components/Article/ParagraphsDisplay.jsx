import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


const ParagraphsDisplay = ({ paragraphs }) => {



  const paragraph = paragraphs.split('\n');


  return (
    <div>
      {paragraph.map((item, idx) => {
         return (

          <Box key={idx} marginTop={2.5}> 
            <Typography>
              {item}
            </Typography>
          </Box>)
        
      })}
    </div>
  )
}

ParagraphsDisplay.propTypes = {
  paragraphs: PropTypes.string.isRequired,
};

export default ParagraphsDisplay