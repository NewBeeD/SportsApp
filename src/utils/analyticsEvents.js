import { logEvent } from 'firebase/analytics';
import { analytics } from '../config/firebaseConfig';

/**
 * Track user interactions and custom events
 * Usage: trackEvent('event_name', { custom_param: 'value' })
 */
export const trackEvent = (eventName, eventParams = {}) => {
  try {
    logEvent(analytics, eventName, eventParams);
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

// Specific event tracking functions
export const trackArticleView = (articleTitle, articleCategory) => {
  trackEvent('article_view', {
    article_title: articleTitle,
    article_category: articleCategory,
    timestamp: new Date().toISOString(),
  });
};

export const trackArticleShare = (articleTitle, platform) => {
  trackEvent('article_shared', {
    article_title: articleTitle,
    platform: platform, // facebook, twitter, whatsapp, etc.
    timestamp: new Date().toISOString(),
  });
};

export const trackCommentSubmitted = (articleTitle) => {
  trackEvent('comment_submitted', {
    article_title: articleTitle,
    timestamp: new Date().toISOString(),
  });
};

export const trackVideoPlay = (videoTitle) => {
  trackEvent('video_played', {
    video_title: videoTitle,
    timestamp: new Date().toISOString(),
  });
};

export const trackPredictionGameStarted = () => {
  trackEvent('prediction_game_started', {
    timestamp: new Date().toISOString(),
  });
};

export const trackPredictionSubmitted = (league, matchesCount) => {
  trackEvent('prediction_submitted', {
    league: league,
    matches_predicted: matchesCount,
    timestamp: new Date().toISOString(),
  });
};

export const trackUserLogin = (authMethod) => {
  trackEvent('user_login', {
    auth_method: authMethod, // google, email, etc.
    timestamp: new Date().toISOString(),
  });
};

export const trackUserSignUp = (authMethod) => {
  trackEvent('user_signup', {
    auth_method: authMethod,
    timestamp: new Date().toISOString(),
  });
};

export const trackTeamViewed = (teamName, league) => {
  trackEvent('team_viewed', {
    team_name: teamName,
    league: league, // DFA, DABA, DNA, etc.
    timestamp: new Date().toISOString(),
  });
};

export const trackPlayerProfileViewed = (playerName, league) => {
  trackEvent('player_profile_viewed', {
    player_name: playerName,
    league: league,
    timestamp: new Date().toISOString(),
  });
};

export const trackLeagueStandingsViewed = (league) => {
  trackEvent('league_standings_viewed', {
    league: league,
    timestamp: new Date().toISOString(),
  });
};

export const trackFixturesViewed = (league) => {
  trackEvent('fixtures_viewed', {
    league: league,
    timestamp: new Date().toISOString(),
  });
};
