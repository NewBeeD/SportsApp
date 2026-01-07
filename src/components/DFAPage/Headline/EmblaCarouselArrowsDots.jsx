import React from 'react'
import IconButton from '@mui/material/IconButton'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

export const DotButton = ({ selected, onClick }) => (
  <Box
    component="button"
    onClick={onClick}
    sx={{
      width: selected ? 40 : 12,
      height: 6,
      backgroundColor: selected ? '#FF6B00' : 'rgba(255, 255, 255, 0.5)',
      border: 'none',
      borderRadius: '3px',
      cursor: 'pointer',
      padding: 0,
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: selected ? '#FF8B33' : 'rgba(255, 255, 255, 0.7)'
      }
    }}
  />
)

export const PrevButton = ({ enabled, onClick }) => (
  <IconButton
    onClick={onClick}
    disabled={!enabled}
    sx={{
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: '#FFD700',
      '&:hover': {
        backgroundColor: 'rgba(255, 107, 0, 0.8)',
        transform: 'scale(1.1)'
      },
      transition: 'all 0.3s ease',
      '&.Mui-disabled': {
        opacity: 0.3
      }
    }}
  >
    <ArrowBackIosNewIcon />
  </IconButton>
)

export const NextButton = ({ enabled, onClick }) => (
  <IconButton
    onClick={onClick}
    disabled={!enabled}
    sx={{
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: '#FFD700',
      '&:hover': {
        backgroundColor: 'rgba(255, 107, 0, 0.8)',
        transform: 'scale(1.1)'
      },
      transition: 'all 0.3s ease',
      '&.Mui-disabled': {
        opacity: 0.3
      }
    }}
  >
    <ArrowForwardIosIcon />
  </IconButton>
)