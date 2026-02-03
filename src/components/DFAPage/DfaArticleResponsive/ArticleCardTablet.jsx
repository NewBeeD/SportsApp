import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import CardActionArea from '@mui/material/CardActionArea';
import { Link } from 'react-router-dom';

const ArticleCardTablet = ({ item, theme }) => {
  const imageUrl = item?.url?.[0];

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        border: `1px solid ${theme.colors.divider}`,
        backgroundColor: theme.colors.background,
        boxShadow: '0 10px 24px rgba(0,0,0,0.10)',
        transition: 'transform 150ms ease, box-shadow 150ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 14px 34px rgba(0,0,0,0.13)',
        },
      }}
    >
      <CardActionArea component={Link} to={`/${item.id}`} sx={{ display: 'block' }}>
        <Box sx={{ position: 'relative', height: 180 }}>
          {imageUrl ? (
            <CardMedia
              component="img"
              image={imageUrl}
              alt={item?.alt || item?.title}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Skeleton variant="rectangular" width="100%" height="100%" />
          )}

          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.7) 100%)',
            }}
          />

          <Stack direction="row" spacing={1} alignItems="center" sx={{ position: 'absolute', left: 10, bottom: 10 }}>
            <Chip
              size="small"
              label={(item?.type || 'News').toUpperCase()}
              sx={{
                backgroundColor: theme.colors.secondary,
                color: theme.colors.textInverse,
                fontWeight: 900,
              }}
            />
            <Typography sx={{ color: theme.colors.textInverse, fontSize: { sm: 11, md: 12 }, opacity: 0.9 }}>
              {item?.time}
            </Typography>
          </Stack>
        </Box>

        <Box sx={{ p: 1.75 }}>
          <Typography
            sx={{
              color: theme.colors.textPrimary,
              fontWeight: 900,
              fontSize: { sm: 14, md: 15 },
              lineHeight: 1.2,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              overflow: 'hidden',
            }}
          >
            {item?.title}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default ArticleCardTablet;