import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';

import GetArticles from '../../modules/Homepage/TrendingSection/TrendingSectionDataFetch';
import theme from '../../css/theme';

import ArticleCardMobile from './DfaArticleResponsive/ArticleCardMobile';
import ArticleCardTablet from './DfaArticleResponsive/ArticleCardTablet';
import ArticleCardDesktop from './DfaArticleResponsive/ArticleCardDesktop';
import LoadingSkeleton from './DfaArticleResponsive/LoadingSkeleton';

const normalizeYes = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    return v === 'yes' || v === 'true' || v === '1';
  }
  return false;
};

const isHeadlineYes = (article) => normalizeYes(article?.Headline ?? article?.headline);

const safeType = (article) => {
  const t = article?.type;
  return typeof t === 'string' && t.trim().length > 0 ? t.trim() : 'News';
};

const ArticlesByType = ({
  league = 'DFA',
  maxTypes = 4,
  itemsPerType = 4,
  excludeHeadlines = true,
}) => {
  // Fetches articles into Redux via React Query (must be called unconditionally)
  GetArticles();

  const articlesState = useSelector((state) => state.articles);
  const allArticles = useMemo(
    () => (Array.isArray(articlesState?.[0]) ? articlesState[0] : []),
    [articlesState]
  );

  const { typesInOrder, grouped } = useMemo(() => {
    const filtered = allArticles.filter((a) => {
      if (league && a?.league !== league) return false;
      if (excludeHeadlines && isHeadlineYes(a)) return false;
      return true;
    });

    const types = [];
    const map = new Map();

    for (const article of filtered) {
      const type = safeType(article);
      if (!map.has(type)) {
        map.set(type, []);
        types.push(type);
      }
      map.get(type).push(article);
    }

    return {
      typesInOrder: types.slice(0, maxTypes),
      grouped: map,
    };
  }, [allArticles, league, excludeHeadlines, maxTypes]);

  if (!typesInOrder.length) return <LoadingSkeleton />;

  return (
    <Box sx={{ py: 2 }}>
      {typesInOrder.map((typeName) => {
        const items = (grouped.get(typeName) || []).slice(0, itemsPerType);
        if (!items.length) return null;

        return (
          <Box key={typeName} sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ px: { xs: 2, md: 0 }, mb: 1.5 }}>
              <Box sx={{ width: 10, height: 26, borderRadius: 99, backgroundColor: theme.colors.secondary }} />
              <Typography
                sx={{
                  fontWeight: 900,
                  color: theme.colors.textPrimary,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  fontSize: { xs: 14, sm: 16 },
                }}
              >
                {typeName}
              </Typography>
            </Stack>

            <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
              {/* Mobile */}
              <Grid item xs={12} sx={{ display: { xs: 'block', sm: 'none' } }}>
                <Stack spacing={1.5} divider={<Divider orientation="horizontal" flexItem />} sx={{ width: '92%', mx: 'auto' }}>
                  {items.map((item) => (
                    <ArticleCardMobile key={item.id} item={item} theme={theme} />
                  ))}
                </Stack>
              </Grid>

              {/* Tablet */}
              <Grid item xs={12} sx={{ display: { xs: 'none', sm: 'block', md: 'none' } }}>
                <Grid container spacing={2}>
                  {items.map((item) => (
                    <Grid item xs={12} sm={6} key={item.id}>
                      <ArticleCardTablet item={item} theme={theme} />
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* Desktop */}
              <Grid item xs={12} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Grid container spacing={3}>
                  {items.map((item) => (
                    <Grid item xs={12} md={4} lg={3} key={item.id}>
                      <ArticleCardDesktop item={item} theme={theme} />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        );
      })}
    </Box>
  );
};

export default ArticlesByType;

ArticlesByType.propTypes = {
  league: PropTypes.string,
  maxTypes: PropTypes.number,
  itemsPerType: PropTypes.number,
  excludeHeadlines: PropTypes.bool,
};
