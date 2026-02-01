// src/GamePrediction/utils/pointsCalculator.js
/**
 * Utility functions for calculating expected points
 * Used for UI display only - actual points awarded by Cloud Function
 */

/**
 * Derive match outcome from final score
 * @param {Object} score - {home: number, away: number}
 * @returns {string} - 'HOME_WIN' | 'AWAY_WIN' | 'DRAW'
 */
export const deriveOutcome = (score) => {
  if (score.home > score.away) {
    return 'HOME_WIN';
  } else if (score.home < score.away) {
    return 'AWAY_WIN';
  } else {
    return 'DRAW';
  }
};

/**
 * Calculate expected points for a prediction (for UI display)
 * Note: Actual points awarded by Cloud Function only
 * 
 * @param {Object} prediction - User's prediction
 * @param {Object} actualScore - Actual final score (or null if not finished)
 * @returns {Object} - Points breakdown
 */
export const calculateExpectedPoints = (prediction, actualScore) => {
  if (!actualScore) {
    return {
      total: 0,
      outcomePoints: 0,
      exactScorePoints: 0,
      isCorrectOutcome: null,
      isCorrectScore: null,
    };
  }

  let outcomePoints = 0;
  let exactScorePoints = 0;

  const actualOutcome = deriveOutcome(actualScore);

  const OUTCOME_POINTS = 5;
  const EXACT_SCORE_POINTS = 10;

  // Check outcome
  if (prediction.predictedOutcome === actualOutcome) {
    outcomePoints = OUTCOME_POINTS;
  }

  // Check exact score (exact score still implies correct outcome)
  if (
    prediction.predictedScore.home === actualScore.home &&
    prediction.predictedScore.away === actualScore.away
  ) {
    exactScorePoints = EXACT_SCORE_POINTS;
  }

  return {
    // Cloud Function awards outcome + exact score (exact implies outcome)
    total: outcomePoints + exactScorePoints,
    outcomePoints,
    exactScorePoints,
    isCorrectOutcome: outcomePoints > 0,
    isCorrectScore: exactScorePoints > 0,
  };
};

/**
 * Format score string
 * @param {Object} score - {home: number, away: number}
 * @returns {string} - "2-1"
 */
export const formatScore = (score) => {
  if (!score) return 'N/A';
  return `${score.home}-${score.away}`;
};

/**
 * Get outcome label
 * @param {string} outcome - 'HOME_WIN' | 'AWAY_WIN' | 'DRAW'
 * @param {Object} match - Match object with team names
 * @returns {string} - "Team A Win" or "Draw"
 */
export const getOutcomeLabel = (outcome, match) => {
  if (!match) return outcome;

  switch (outcome) {
    case 'HOME_WIN':
      return `${match.homeTeamName} Win`;
    case 'AWAY_WIN':
      return `${match.awayTeamName} Win`;
    case 'DRAW':
      return 'Draw';
    default:
      return outcome;
  }
};

/**
 * Check if time has passed (for kickoff checking)
 * @param {Object} timestamp - Firestore timestamp or Date
 * @returns {boolean} - true if time has passed
 */
export const hasTimePasssed = (timestamp) => {
  if (!timestamp) return false;

  const time = timestamp instanceof Date ? timestamp : timestamp.toDate();
  return new Date() >= time;
};

/**
 * Format time remaining until kickoff
 * @param {Object} timestamp - Firestore timestamp
 * @returns {string} - "2h 30m" or "Kickoff soon!"
 */
export const formatTimeRemaining = (timestamp) => {
  if (!timestamp) return 'N/A';

  const kickoff = timestamp instanceof Date ? timestamp : timestamp.toDate();
  const now = new Date();
  const diff = kickoff - now;

  if (diff <= 0) return 'Match started';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

/**
 * Get color for points display
 * @param {number} points - Points earned
 * @returns {string} - Color code
 */
export const getPointsColor = (points) => {
  if (points >= 10) return '#4caf50'; // Green (exact score total is 15)
  if (points >= 5) return '#2196f3'; // Blue
  if (points > 0) return '#ff9800'; // Orange
  return '#999'; // Gray
};