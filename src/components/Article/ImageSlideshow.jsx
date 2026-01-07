import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, Slide } from '@mui/material';

import '../../css/TrendingNewsCss.css'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ImageSlideshow = ({ images }) => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClickOpen = (index) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div>
      {images.map((imageUrl, index) => (
        <img
          key={index}
          src={imageUrl}
          alt={`Image ${index + 1}`}
          onClick={() => handleClickOpen(index)}
          style={{ cursor: 'pointer', margin: '5px', maxWidth: '100%' }}
          loading='lazy'
        />
      ))}

      <Dialog 
      open={open} 
      TransitionComponent={Transition} 
      onClose={handleClose}
      maxWidth='lg'
      fullWidth={true}>
        {/* <DialogTitle>{`Image Slideshow (${currentIndex + 1}/${images.length})`}</DialogTitle> */}
        <DialogContent>
          <img
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePrev}>Previous</Button>
          <Button onClick={handleNext}>Next</Button>
          {/* <Button onClick={handleClose}>Close</Button> */}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ImageSlideshow;
