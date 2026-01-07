import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

const LoadingSkeleton = () => {
  return (
    <Box>
      {/* Mobile Skeleton */}
      <Box sx={{ display: { xs: 'block', sm: 'none' }, width: '90%', mx: 'auto' }}>
        <Stack spacing={2}>
          {[...Array(3)].map((_, index) => (
            <Card key={index} sx={{ p: 2 }}>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Skeleton variant="text" width="20%" height={20} />
                <Skeleton variant="text" width="30%" height={20} />
              </Stack>
              <Skeleton variant="text" width="90%" height={25} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="100%" height={60} />
            </Card>
          ))}
        </Stack>
      </Box>

      {/* Tablet & Desktop Skeleton */}
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <Grid container spacing={{ sm: 2, md: 3 }}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card sx={{ p: 2 }}>
                <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="90%" height={25} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="100%" height={40} />
                <Skeleton variant="text" width="80%" height={20} />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default LoadingSkeleton;