// src/GamePrediction/utils/predictionValidators.js
/**
 * Validation utilities for predictions
 */

/**
 * Validate predicted outcome
 * @param {string} outcome - Outcome to validate
 * @returns {Object} - { valid: boolean, error?: string }
 */
export const validateOutcome = (outcome) => {
  const validOutcomes = ['HOME_WIN', 'AWAY_WIN', 'DRAW'];

  if (!outcome) {
    return { valid: false, error: 'Outcome is required' };
  }

  if (!validOutcomes.includes(outcome)) {
    return { valid: false, error: `Outcome must be one of: ${validOutcomes.join(', ')}` };
  }

  return { valid: true };
};

/**
 * Validate score values
 * @param {number} home - Home team score
 * @param {number} away - Away team score
 * @returns {Object} - { valid: boolean, error?: string }
 */
export const validateScore = (home, away) => {
  if (typeof home !== 'number' || typeof away !== 'number') {
    return { valid: false, error: 'Scores must be numbers' };
  }

  if (home < 0 || away < 0) {
    return { valid: false, error: 'Scores cannot be negative' };
  }

  if (home > 99 || away > 99) {
    return { valid: false, error: 'Scores must be between 0 and 99' };
  }

  if (!Number.isInteger(home) || !Number.isInteger(away)) {
    return { valid: false, error: 'Scores must be whole numbers' };
  }

  return { valid: true };
};

/**
 * Validate entire prediction
 * @param {Object} prediction - Prediction to validate
 * @returns {Object} - { valid: boolean, errors: Object }
 */
export const validatePrediction = (prediction) => {
  const errors = {};

  if (!prediction) {
    return { valid: false, errors: { form: 'Prediction data missing' } };
  }

  // Validate outcome
  const outcomeValidation = validateOutcome(prediction.predictedOutcome);
  if (!outcomeValidation.valid) {
    errors.outcome = outcomeValidation.error;
  }

  // Validate scores
  if (prediction.predictedScore) {
    const scoreValidation = validateScore(
      prediction.predictedScore.home,
      prediction.predictedScore.away
    );
    if (!scoreValidation.valid) {
      errors.score = scoreValidation.error;
    }
  } else {
    errors.score = 'Predicted score is required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Check if prediction can be edited
 * @param {Object} prediction - Prediction to check
 * @param {Object} match - Match object with scheduledTime
 * @returns {Object} - { canEdit: boolean, reason?: string }
 */
export const canEditPrediction = (prediction, match) => {
  if (!prediction || !match) {
    return { canEdit: false, reason: 'Missing data' };
  }

  // Can't edit if already scored
  if (prediction.points !== undefined && prediction.points > 0) {
    return { canEdit: false, reason: 'Cannot edit scored predictions' };
  }

  // Can't edit if match has started
  const kickoffTime = match.scheduledTime instanceof Date
    ? match.scheduledTime
    : match.scheduledTime.toDate();

  if (new Date() >= kickoffTime) {
    return { canEdit: false, reason: 'Match has already started' };
  }

  // Can't edit if match status changed
  if (match.status !== 'UPCOMING') {
    return { canEdit: false, reason: `Cannot edit predictions for ${match.status} matches` };
  }

  return { canEdit: true };
};

/**
 * Check if prediction can be deleted
 * @param {Object} prediction - Prediction to check
 * @param {Object} match - Match object
 * @returns {Object} - { canDelete: boolean, reason?: string }
 */
export const canDeletePrediction = (prediction, match) => {
  if (!prediction || !match) {
    return { canDelete: false, reason: 'Missing data' };
  }

  // Can't delete if scored
  if (prediction.points !== undefined && prediction.points > 0) {
    return { canDelete: false, reason: 'Cannot delete scored predictions' };
  }

  // Can't delete if match started
  const kickoffTime = match.scheduledTime instanceof Date
    ? match.scheduledTime
    : match.scheduledTime.toDate();

  if (new Date() >= kickoffTime) {
    return { canDelete: false, reason: 'Match has already started' };
  }

  return { canDelete: true };
};