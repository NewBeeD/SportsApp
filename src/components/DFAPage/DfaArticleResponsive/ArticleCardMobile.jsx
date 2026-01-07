import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import Divider from '@mui/material/Divider';

const ArticleCardMobile = ({ item, theme }) => {
  const excerpt = item.body_content.length > 100
    ? `${item.body_content.substring(0, 100)}...`
    : item.body_content;

  return (
    <Card sx={{
      boxShadow: 'none',
      backgroundColor: 'white',
      border: '1px solid #86C232',
      '&:hover': { boxShadow: 2 }
    }}>
      <CardContent>
        {/* Header with category and metadata */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Link to={`/DFA/Home`} style={{ textDecoration: 'none' }}>
            <Typography 
              sx={{ 
                color: theme.colors.color5,
                fontSize: 12,
                textDecoration: 'underline',
                fontWeight: 700,
                '&:hover': { color: theme.colors.primary || '#1976d2' }
              }}
            >
              {item.type}
            </Typography>
          </Link>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ ml: 'auto' }}>
            <Typography sx={{ color: 'text.secondary', fontSize: 10 }}>
              {item.author}
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ height: 12, mx: 0.5 }} />
            <Typography sx={{ color: 'text.secondary', fontSize: 10 }}>
              {item.time}
            </Typography>
          </Stack>
        </Stack>

        {/* Article Link */}
        <Link to={`/${item.id}`} style={{ textDecoration: 'none' }}>
          {/* Title */}
          <Typography 
            variant="h6"
            sx={{ 
              color: theme.colors.color3,
              fontWeight: 900,
              fontSize: 14,
              mb: 2,
              lineHeight: 1.3,
              '&:hover': { color: theme.colors.primary || '#1976d2' }
            }}
          >
            {item.title}
          </Typography>

          {/* Image */}
          <Box sx={{ 
            position: 'relative',
            width: '100%',
            height: 200,
            mb: 2,
            borderRadius: 1,
            overflow: 'hidden'
          }}>
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
          </Box>

          {/* Excerpt */}
          <Typography 
            variant="body2"
            sx={{ 
              color: 'text.primary',
              fontSize: 13,
              lineHeight: 1.5
            }}
          >
            {excerpt}
          </Typography>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ArticleCardMobile;