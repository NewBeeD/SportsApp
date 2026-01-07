// src/GamePrediction/hooks/usePredictionMutation.js
/**
 * Custom hook for creating/updating predictions
 */

import { useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import {
  createPrediction,
  updatePrediction,
  deletePrediction,
  getExistingPrediction,
} from '../services/predictionService';

export const usePredictionMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const submit = useCallback(
    async (userId, matchId, predictionData) => {
      setLoading(true);
      setError(null);

      try {
        // Check for existing prediction
        const existing = await getExistingPrediction(userId, matchId);

        if (existing) {
          // Update existing
          await updatePrediction(existing.docId, predictionData);
          enqueueSnackbar('Prediction updated successfully!', { variant: 'success' });
          return { success: true, isUpdate: true, predictionId: existing.docId };
        } else {
          // Create new
          const result = await createPrediction(userId, matchId, predictionData);
          enqueueSnackbar('Prediction saved successfully!', { variant: 'success' });
          return { ...result, isUpdate: false };
        }
      } catch (err) {
        const message = err.message || 'Failed to save prediction';
        setError(message);
        enqueueSnackbar(message, { variant: 'error' });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  const deleteP = useCallback(
    async (predictionId) => {
      setLoading(true);
      setError(null);

      try {
        await deletePrediction(predictionId);
        enqueueSnackbar('Prediction deleted successfully!', { variant: 'success' });
        return { success: true };
      } catch (err) {
        const message = err.message || 'Failed to delete prediction';
        setError(message);
        enqueueSnackbar(message, { variant: 'error' });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  return { submit, delete: deleteP, loading, error };
};