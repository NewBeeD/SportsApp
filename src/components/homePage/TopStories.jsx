import { Box, Card, CardActionArea, CardContent, CardMedia, Stack, Typography, Divider, Skeleton } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

// Fetches articles into Redux via React Query (must be called unconditionally)
import GetArticles from "../../modules/Homepage/TrendingSection/TrendingSectionDataFetch";

import theme from "../../css/theme";

const normalizeYes = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    return v === "yes" || v === "true" || v === "1";
  }
  return false;
};

const isHeadlineYes = (article) => {
  const raw = article?.Headline ?? article?.headline;
  return normalizeYes(raw);
};

const TopStories = ({ count = 5, league }) => {
  GetArticles();

  const articlesState = useSelector((state) => state.articles);
  const articles = Array.isArray(articlesState?.[0]) ? articlesState[0] : [];

  const topStories = articles
    .filter((a) => {
      if (isHeadlineYes(a)) return false;
      if (league) return a?.league === league;
      return true;
    })
    .slice(0, count);

  return (
    <Box
      sx={{
        backgroundColor: `var(--color-color1, ${theme.colors.color1})`,
        border: `1px solid ${theme.colors.divider}`,
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
        marginTop: {xs:4, sm:2}
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.5,
          backgroundColor: theme.colors.primary,
          borderBottom: `2px solid ${theme.colors.secondary}`,
          position: 'relative',
          '&:before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            backgroundColor: theme.colors.secondary,
          },
        }}
      >
        <Typography
          sx={{
            color: theme.colors.textInverse,
            fontWeight: 900,
            letterSpacing: 1.2,
            textTransform: "uppercase",
          }}
        >
          Top Stories
        </Typography>
      </Box>

      <Stack divider={<Divider flexItem sx={{ borderColor: theme.colors.divider }} />} sx={{ p: 1.5 }} spacing={0}>
        {topStories.length > 0
          ? topStories.map((item) => (
              <Card
                key={item.id}
                sx={{
                  boxShadow: "none",
                  backgroundColor: "transparent",
                  borderRadius: 1.5,
                }}
              >
                <CardActionArea
                  component={Link}
                  to={`/${item.id}`}
                  sx={{
                    p: 1,
                    borderRadius: 1.5,
                    transition: "background-color 120ms ease, transform 120ms ease",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.06)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                    {item.url?.[0] ? (
                      <CardMedia
                        component="img"
                        image={item.url[0]}
                        alt={item.alt || item.title}
                        sx={{ width: 72, height: 56, borderRadius: 1, objectFit: "cover" }}
                        loading="lazy"
                      />
                    ) : (
                      <Skeleton variant="rectangular" width={72} height={56} sx={{ borderRadius: 1 }} />
                    )}

                    <CardContent sx={{ p: 0, "&:last-child": { pb: 0 }, flex: 1 }}>
                      <Typography
                        sx={{
                          color: theme.colors.textInverse,
                          fontWeight: 900,
                          fontSize: { xs: 14, md: 15, lg: 16 },
                          lineHeight: 1.2,
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                          overflow: 'hidden',
                        }}
                      >
                        {item.title}
                      </Typography>

                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                        <Typography sx={{ fontSize: { xs: 11, md: 12, lg: 12 }, color: theme.colors.secondaryLight, fontWeight: 900 }}>
                          {(item?.type || 'News').toUpperCase()}
                        </Typography>
                        <Divider orientation="vertical" flexItem />
                        <Typography sx={{ fontSize: { xs: 11, md: 12, lg: 12 }, color: theme.colors.textTertiary }}>
                          {item.time}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Stack>
                </CardActionArea>
              </Card>
            ))
          : Array.from({ length: count }).map((_, idx) => (
              <Box key={idx} sx={{ p: 1 }}>
                <Skeleton variant="rectangular" width="100%" height={56} />
              </Box>
            ))}
      </Stack>
    </Box>
  );
};

export default TopStories;

TopStories.propTypes = {
  count: PropTypes.number,
  league: PropTypes.string,
};
