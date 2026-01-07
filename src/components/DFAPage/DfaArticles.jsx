


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









// import React, { useState, useEffect, useCallback } from 'react';
// import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid';
// import Stack from '@mui/material/Stack';
// import Divider from '@mui/material/Divider';
// import { useSelector } from 'react-redux';

// import GetArticles from '../../modules/Homepage/TrendingSection/TrendingSectionDataFetch';
// import theme from '../../css/theme';
// import ArticleCardMobile from '../../components/DFAPage/DfaArticleResponsive/ArticleCardMobile';
// import ArticleCardTablet from '../../components/DFAPage/DfaArticleResponsive/ArticleCardTablet';
// import ArticleCardDesktop from '../../components/DFAPage/DfaArticleResponsive/ArticleCardDesktop';
// import LoadingSkeleton from '../../components/DFAPage/DfaArticleResponsive/LoadingSkeleton';
// import useInfiniteScroll from '../../hooks/useInfiniteScroll';

// const DfaArticles = ({ level, size }) => {
//   GetArticles();

//   const articles_raw = useSelector((state) => state.articles);
//   const [displayedArticles, setDisplayedArticles] = useState([]);
//   const [page, setPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);

//   // Get all filtered articles once
//   const allArticles = React.useMemo(() => {
//     return articles_raw && articles_raw[0] 
//       ? articles_raw[0].filter(item => item.league === 'DFA' && item.headline !== 'YES')
//       : [];
//   }, [articles_raw]);

//   // Calculate initial articles per page based on screen size
//   const getInitialArticlesPerPage = () => {
//     if (size === 'small') {
//       switch(level) {
//         case 'first': return 3;
//         case 'second': return 4;
//         case 'third': return 4;
//         case 'fourth': return 2;
//         case 'fifth': return 3;
//         default: return 3;
//       }
//     } else {
//       switch(level) {
//         case 'first': return 9;
//         case 'second': return 4;
//         case 'third': return 4;
//         case 'fourth': return 4;
//         case 'fifth': return 4;
//         default: return 9;
//       }
//     }
//   };

//   const ARTICLES_PER_PAGE = getInitialArticlesPerPage();

//   // Load more articles function
//   const loadMoreArticles = useCallback(() => {
//     if (isLoading || !hasMore) return;

//     setIsLoading(true);
    
//     setTimeout(() => {
//       const nextPage = page + 1;
//       const startIndex = 0;
//       const endIndex = nextPage * ARTICLES_PER_PAGE;
      
//       if (endIndex >= allArticles.length) {
//         setHasMore(false);
//       }
      
//       setDisplayedArticles(allArticles.slice(startIndex, endIndex));
//       setPage(nextPage);
//       setIsLoading(false);
//     }, 500); // Simulate network delay
//   }, [page, isLoading, hasMore, allArticles, ARTICLES_PER_PAGE]);

//   // Initial load
//   useEffect(() => {
//     if (allArticles.length > 0) {
//       const initialArticles = allArticles.slice(0, ARTICLES_PER_PAGE);
//       setDisplayedArticles(initialArticles);
//       setHasMore(initialArticles.length < allArticles.length);
//     }
//   }, [allArticles, ARTICLES_PER_PAGE]);

//   // Setup infinite scroll
//   const loaderRef = useInfiniteScroll(loadMoreArticles);

//   // Render loading skeleton
//   const renderLoadingSkeletons = () => {
//     return Array.from({ length: ARTICLES_PER_PAGE }).map((_, index) => (
//       <Grid item xs={12} sm={6} md={4} lg={3} key={`skeleton-${index}`}>
//         <LoadingSkeleton />
//       </Grid>
//     ));
//   };

//   return (
//     <Box sx={{ py: 2 }}>
//       {displayedArticles.length > 0 ? (
//         <>
//           <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
//             {/* Mobile View */}
//             <Grid item xs={12} sx={{ display: { xs: 'block', sm: 'none' } }}>
//               <Stack 
//                 spacing={2} 
//                 divider={<Divider orientation="horizontal" flexItem />}
//                 sx={{ width: '90%', mx: 'auto' }}
//               >
//                 {displayedArticles.map((item) => (
//                   <ArticleCardMobile key={item.id} item={item} theme={theme} />
//                 ))}
//               </Stack>
//             </Grid>

//             {/* Tablet View */}
//             <Grid item xs={12} sx={{ display: { xs: 'none', sm: 'block', md: 'none' } }}>
//               <Grid container spacing={2}>
//                 {displayedArticles.map((item) => (
//                   <Grid item xs={12} sm={6} key={item.id}>
//                     <ArticleCardTablet item={item} theme={theme} />
//                   </Grid>
//                 ))}
//               </Grid>
//             </Grid>

//             {/* Desktop View */}
//             <Grid item xs={12} sx={{ display: { xs: 'none', md: 'block' } }}>
//               <Grid container spacing={3}>
//                 {displayedArticles.map((item) => (
//                   <Grid item xs={12} md={4} lg={3} key={item.id}>
//                     <ArticleCardDesktop item={item} theme={theme} />
//                   </Grid>
//                 ))}
//               </Grid>
//             </Grid>
//           </Grid>

//           {/* Loading state */}
//           {isLoading && (
//             <Grid container spacing={3} sx={{ mt: 2 }}>
//               {renderLoadingSkeletons()}
//             </Grid>
//           )}

//           {/* Sentinel element for Intersection Observer */}
//           {hasMore && !isLoading && (
//             <Box 
//               ref={loaderRef} 
//               sx={{ 
//                 height: '20px', 
//                 width: '100%',
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 my: 4
//               }}
//             >
//               <Box 
//                 sx={{ 
//                   width: '40px', 
//                   height: '40px', 
//                   borderRadius: '50%',
//                   backgroundColor: '#f0f0f0',
//                   display: 'flex',
//                   justifyContent: 'center',
//                   alignItems: 'center'
//                 }}
//               >
//                 ↓
//               </Box>
//             </Box>
//           )}

//           {/* No more articles message */}
//           {!hasMore && displayedArticles.length > 0 && (
//             <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
//               No more articles to load
//             </Box>
//           )}
//         </>
//       ) : (
//         <LoadingSkeleton />
//       )}
//     </Box>
//   );
// };

// export default DfaArticles;