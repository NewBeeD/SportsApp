import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

const ArticleCardTablet = ({ item, theme }) => {
  const excerpt = item.body_content.length > 80
    ? `${item.body_content.substring(0, 80)}...`
    : item.body_content;

  return (
    <Card sx={{
      boxShadow: 'none',
      backgroundColor: 'white',
      border: '1px solid #86C232',
      height: { sm: 'auto' },
      maxWidth: 220,
      margin: 1,
      display: 'flex',
      flexDirection: 'column',
      '&:hover': { boxShadow: 3 }
    }}>
      <Stack direction="column-reverse" sx={{ flexGrow: 1 }}>
        {/* Title */}
        <Link to={`/${item.id}`} style={{ textDecoration: 'none' }}>
          <Typography 
            sx={{ 
              color: theme.colors.color3,
              fontWeight: 900,
              fontSize: 13,
              px: 2,
              pt: 1,
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

        {/* Category */}
        <Box sx={{ px: 2, pb: 1 }}>
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
        </Box>

        {/* Image */}
        <Box sx={{ 
          position: 'relative',
          width: '100%',
          height: 200,
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
      </Stack>
    </Card>
  );
};

export default ArticleCardTablet;