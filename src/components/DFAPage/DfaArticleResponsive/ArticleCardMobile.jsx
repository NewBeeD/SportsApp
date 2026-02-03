import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import CardActionArea from '@mui/material/CardActionArea';

const ArticleCardMobile = ({ item, theme }) => {
  const imageUrl = item?.url?.[0];

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        border: `1px solid ${theme.colors.divider}`,
        backgroundColor: theme.colors.background,
        boxShadow: '0 10px 24px rgba(0,0,0,0.10)',
      }}
    >
      <CardActionArea
        component={Link}
        to={`/${item.id}`}
        sx={{
          display: 'flex',
          gap: 1.5,
          p: 1.25,
          alignItems: 'center',
        }}
      >
        <Box sx={{ width: 96, height: 76, flex: '0 0 auto', borderRadius: 2, overflow: 'hidden' }}>
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
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            <Chip
              size="small"
              label={(item?.type || 'News').toUpperCase()}
              sx={{
                backgroundColor: theme.colors.secondary,
                color: theme.colors.textInverse,
                fontWeight: 900,
              }}
            />
            <Typography sx={{ fontSize: 11, color: theme.colors.textTertiary }}>
              {item?.time}
            </Typography>
          </Stack>

          <Typography
            sx={{
              color: theme.colors.textPrimary,
              fontWeight: 900,
              fontSize: 14,
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

export default ArticleCardMobile;