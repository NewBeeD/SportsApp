


import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useSelector } from 'react-redux';

import GetArticles from '../../modules/Homepage/TrendingSection/TrendingSectionDataFetch';
import theme from '../../css/theme';
import ArticleCardMobile from '../../components/DFAPage/DfaArticleResponsive/ArticleCardMobile';
import ArticleCardTablet from '../../components/DFAPage/DfaArticleResponsive/ArticleCardTablet';
import ArticleCardDesktop from '../../components/DFAPage/DfaArticleResponsive/ArticleCardDesktop';
import LoadingSkeleton from '../../components/DFAPage/DfaArticleResponsive/LoadingSkeleton';

const DfaArticles = ({ level, size }) => {
  GetArticles();

  const articles_raw = useSelector((state) => state.articles);
  const players = useSelector((state) => state.DfaPlayers);

  let articles = articles_raw && articles_raw[0] 
    ? articles_raw[0].filter(item => item.league === 'DFA' && item.headline !== 'YES')
    : null;

  const articles_length = articles && articles_raw[0] ? articles.length : 0;
  const part_size = articles_length ? Math.ceil(articles_length / 3) : 0;

  // Slice articles based on level and size
  const getSlicedArticles = () => {
    if (!articles) return null;

    // const slices = {
    //   first: size === 'small' ? [0, 3] : [0, 4],
    //   second: size === 'small' ? [3, 7] : [4, 8],
    //   third: size === 'small' ? [7, 11] : [8, 12],
    //   fourth: size === 'small' ? [11, 13] : [12, 16],
    //   fifth: size === 'small' ? [13, 16] : [16, 20],
    // };
    const slices = {
      first: size === 'small' ? [0, 4] : [0, 4],
      second: size === 'small' ? [3, 7] : [4, 8],
      third: size === 'small' ? [7, 11] : [8, 12],
      fourth: size === 'small' ? [11, 13] : [12, 16],
      fifth: size === 'small' ? [13, 16] : [16, 20],
    };

    const [start, end] = slices[level] || [0, 4];
    return articles.slice(start, end);
  };

  const slicedArticles = getSlicedArticles();

  return (
    <Box sx={{ py: 2 }}>
      {articles_length > 0 && slicedArticles ? (
        <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
          
          {/* Mobile View */}
          <Grid item xs={12} sx={{ display: { xs: 'block', sm: 'none' } }}>
            <Stack 
              spacing={2} 
              divider={<Divider orientation="horizontal" flexItem />}
              sx={{ width: '90%', mx: 'auto' }}
            >
              {slicedArticles.map((item) => (
                <ArticleCardMobile key={item.id} item={item} theme={theme} />
              ))}
            </Stack>
          </Grid>

          {/* Tablet View */}
          <Grid item xs={12} sx={{ display: { xs: 'none', sm: 'block', md: 'none' } }}>
            <Grid container spacing={2}>
              {slicedArticles.map((item) => (
                <Grid item xs={12} sm={6} key={item.id}>
                  <ArticleCardTablet item={item} theme={theme} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Desktop View */}
          <Grid item xs={12} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Grid container spacing={3}>
              {articles.map((item) => (
                <Grid item xs={12} md={4} lg={4} key={item.id}>
                  <ArticleCardDesktop item={item} theme={theme} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <LoadingSkeleton />
      )}
    </Box>
  );
};

export default DfaArticles;

