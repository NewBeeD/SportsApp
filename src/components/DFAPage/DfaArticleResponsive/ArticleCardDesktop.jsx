import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

const ArticleCardDesktop = ({ item, theme }) => {
  const excerpt = item.body_content.length < 25
    ? item.body_content
    : `${item.body_content.substring(0, 80)}...`;

  return (
    <Card sx={{
      boxShadow: 'none',
      backgroundColor: 'white',
      border: '1px solid #86C232',
      height: { sm: '380px' },
      maxWidth: 260,
      margin: 1,
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease',
      '&:hover': { 
        boxShadow: 4,
        transform: 'translateY(-4px)'
      }
    }}>
      {/* Category */}
      <CardActions>
        <Stack>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Typography 
              sx={{ 
                color: theme.colors.color5,
                fontSize: 13,
                textDecoration: 'underline',
                fontWeight: 900,
                '&:hover': { color: theme.colors.primary || '#1976d2' }
              }}
            >
              {item.type}
            </Typography>
          </Link>
        </Stack>
      </CardActions>

      {/* Title */}
      <Link to={`/${item.id}`} style={{ textDecoration: 'none' }}>
        <Typography 
          sx={{ 
            color: theme.colors.color3,
            fontWeight: 900,
            fontSize: 14,
            px: 2,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            '&:hover': { color: theme.colors.primary || '#1976d2' }
          }}
        >
          {item.title}
        </Typography>
      </Link>

      {/* Image */}
      <Box sx={{ 
        position: 'relative',
        width: '100%',
        height: 200,
        mt: 2,
        overflow: 'hidden'
      }}>
        <Link to={`/${item.id}`} style={{ textDecoration: 'none' }}>
          <CardMedia 
            component="img"
            image={item.url[0]}
            alt={item.alt}
            sx={{ 
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: '50% 50%',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.05)' }
            }}
          />
        </Link>
      </Box>

      {/* Excerpt */}
      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Typography 
          sx={{ 
            color: 'text.primary',
            fontSize: 11,
            lineHeight: 1.5
          }}
        >
          {excerpt}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ArticleCardDesktop;