import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import CardActionArea from '@mui/material/CardActionArea';
import { Link } from 'react-router-dom';

const ArticleCardDesktop = ({ item, theme }) => {
  const body = typeof item?.body_content === 'string' ? item.body_content : '';
  const excerpt = body.length <= 120 ? body : `${body.substring(0, 120)}...`;
  const imageUrl = item?.url?.[0];

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        border: `1px solid ${theme.colors.divider}`,
        backgroundColor: theme.colors.background,
        boxShadow: '0 12px 30px rgba(0,0,0,0.10)',
        transition: 'transform 150ms ease, box-shadow 150ms ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.14)',
        },
      }}
    >
      <CardActionArea component={Link} to={`/${item.id}`} sx={{ display: 'block' }}>
        <Box sx={{ position: 'relative', height: { md: 180, lg: 220, xl: 240 }, overflow: 'hidden' }}>
          {imageUrl ? (
            <CardMedia
              component="img"
              image={imageUrl}
              alt={item?.alt || item?.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 200ms ease',
              }}
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
            <Typography sx={{ color: theme.colors.textInverse, fontSize: { md: 11, lg: 12, xl: 12 }, opacity: 0.9 }}>
              {item?.time}
            </Typography>
          </Stack>
        </Box>

        <CardContent sx={{ p: 2 }}>
          <Typography
            sx={{
              color: theme.colors.textPrimary,
              fontWeight: 900,
              fontSize: { md: 15, lg: 17, xl: 18 },
              lineHeight: 1.2,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              overflow: 'hidden',
            }}
          >
            {item?.title}
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: theme.colors.textSecondary,
              fontSize: { md: 12, lg: 13, xl: 14 },
              lineHeight: 1.45,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              overflow: 'hidden',
            }}
          >
            {excerpt}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ArticleCardDesktop;