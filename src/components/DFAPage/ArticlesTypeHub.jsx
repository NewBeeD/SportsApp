import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';

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

const a11yProps = (index) => ({
  id: `type-tab-${index}`,
  'aria-controls': `type-tabpanel-${index}`,
});

const ArticlesTypeHub = ({
  league = 'DFA',
  maxTypes = 6,
  excludeHeadlines = true,
  title = 'Browse by Type',
}) => {
  // Fetches articles into Redux via React Query (must be called unconditionally)
  GetArticles();

  const isMdUp = useMediaQuery('(min-width:900px)');
  const articlesState = useSelector((state) => state.articles);

  const allArticles = useMemo(
    () => (Array.isArray(articlesState?.[0]) ? articlesState[0] : []),
    [articlesState]
  );

  const { types, grouped } = useMemo(() => {
    const filtered = allArticles.filter((a) => {
      if (league && a?.league !== league) return false;
      if (excludeHeadlines && isHeadlineYes(a)) return false;
      return true;
    });

    const map = new Map();
    const order = [];

    for (const article of filtered) {
      const type = safeType(article);
      if (!map.has(type)) {
        map.set(type, []);
        order.push(type);
      }
      map.get(type).push(article);
    }

    return {
      types: order.slice(0, maxTypes),
      grouped: map,
    };
  }, [allArticles, league, excludeHeadlines, maxTypes]);

  const [activeTab, setActiveTab] = useState(0);
  const [visibleCount, setVisibleCount] = useState(isMdUp ? 8 : 6);

  // Reset pagination when switching tabs.
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setVisibleCount(isMdUp ? 8 : 6);
  };

  if (!types.length) return <LoadingSkeleton />;

  const activeType = types[Math.min(activeTab, types.length - 1)];
  const items = grouped.get(activeType) || [];
  const displayItems = items.slice(0, visibleCount);

  const canShowMore = items.length > displayItems.length;

  const Featured = ({ item }) => (
    <Box sx={{ width: '100%' }}>
      <ArticleCardDesktop item={item} theme={theme} />
    </Box>
  );

  Featured.propTypes = {
    item: PropTypes.object.isRequired,
  };

  return (
    <Box
      sx={{
        borderRadius: 3,
        border: `1px solid ${theme.colors.divider}`,
        backgroundColor: theme.colors.background,
        overflow: 'hidden',
        boxShadow: '0 12px 28px rgba(0,0,0,0.10)',
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: { xs: 2, md: 2.5 },
          py: 1.75,
          background: `linear-gradient(90deg, ${theme.colors.primary} 0%, ${theme.colors.color1} 55%, ${theme.colors.primary} 100%)`,
          borderBottom: `1px solid ${theme.colors.divider}`,
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box sx={{ width: 10, height: 26, borderRadius: 99, backgroundColor: theme.colors.secondary }} />
          <Typography
            sx={{
              color: theme.colors.textInverse,
              fontWeight: 900,
              letterSpacing: 1,
              textTransform: 'uppercase',
              fontSize: { xs: 14, sm: 16 },
            }}
          >
            {title}
          </Typography>
        </Stack>
        <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>
          {activeType}
        </Typography>
      </Stack>

      {/* Tabs */}
      <Box sx={{ px: { xs: 1, md: 2 }, pt: 1.25, pb: 0.5 }}>
        <Tabs
          value={Math.min(activeTab, types.length - 1)}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          TabIndicatorProps={{
            style: {
              height: 4,
              borderRadius: 99,
              backgroundColor: theme.colors.secondary,
            },
          }}
          sx={{
            minHeight: 44,
            '& .MuiTab-root': {
              minHeight: 44,
              textTransform: 'uppercase',
              fontWeight: 900,
              letterSpacing: 1,
              fontSize: 12,
              color: theme.colors.textTertiary,
            },
            '& .MuiTab-root.Mui-selected': {
              color: theme.colors.textPrimary,
            },
          }}
        >
          {types.map((t, idx) => (
            <Tab
              key={t}
              label={`${t} (${(grouped.get(t) || []).length})`}
              {...a11yProps(idx)}
            />
          ))}
        </Tabs>
      </Box>

      {/* Content */}
      <Box sx={{ px: { xs: 2, md: 2.5 }, pb: 2.5, pt: 1.5 }}>
        {/* Mobile list */}
        <Box sx={{ display: { xs: 'block', sm: 'none' } }} role="tabpanel" id="type-tabpanel-0">
          <Stack spacing={1.5} sx={{ width: '100%' }}>
            {displayItems.map((item) => (
              <ArticleCardMobile key={item.id} item={item} theme={theme} />
            ))}
          </Stack>
        </Box>

        {/* Tablet grid */}
        <Box sx={{ display: { xs: 'none', sm: 'block', md: 'none' } }}>
          <Grid container spacing={2}>
            {displayItems.map((item) => (
              <Grid item xs={12} sm={6} key={item.id}>
                <ArticleCardTablet item={item} theme={theme} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Desktop: featured + grid */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          {items[0] ? (
            <Box sx={{ mb: 2 }}>
              <Featured item={items[0]} />
            </Box>
          ) : null}

          <Grid container spacing={3}>
            {displayItems
              .slice(items[0] ? 1 : 0)
              .map((item) => (
                <Grid item xs={12} md={4} lg={3} key={item.id}>
                  <ArticleCardDesktop item={item} theme={theme} />
                </Grid>
              ))}
          </Grid>
        </Box>

        {canShowMore ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => setVisibleCount((c) => c + (isMdUp ? 8 : 6))}
              sx={{
                borderRadius: 99,
                fontWeight: 900,
                textTransform: 'uppercase',
                backgroundColor: theme.colors.secondary,
                color: theme.colors.textInverse,
                '&:hover': { backgroundColor: theme.colors.secondaryDark || theme.colors.secondary },
              }}
            >
              Show more
            </Button>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

ArticlesTypeHub.propTypes = {
  league: PropTypes.string,
  maxTypes: PropTypes.number,
  excludeHeadlines: PropTypes.bool,
  title: PropTypes.string,
};

export default ArticlesTypeHub;
