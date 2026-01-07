// src/features/PredictionGame/PredictionSlice.js
/**
 * Redux Slice for Score Prediction Game
 * Manages UI state: form loading, errors, filters, etc.
 * NOT for data fetching (use React Query/hooks for that)
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Form state
  form: {
    isSubmitting: false,
    submitError: null,
    successMessage: null,
  },

  // Filter state
  filters: {
    matchStatus: 'UPCOMING', // 'UPCOMING', 'LIVE', 'FINISHED'
    leagueId: null,
    sortBy: 'scheduledTime', // 'scheduledTime', 'points'
  },

  // Tab state
  activeTab: 0,

  // Notification state
  notification: {
    isOpen: false,
    message: '',
    severity: 'info', // 'info', 'success', 'warning', 'error'
  },

  // Modal state
  modal: {
    isOpen: false,
    type: null, // 'prediction', 'results', 'leaderboard'
    data: null,
  },

  // Loading state
  loading: {
    matches: false,
    predictions: false,
    leaderboard: false,
  },
};

const predictionSlice = createSlice({
  name: 'prediction',
  initialState,

  reducers: {
    // ===== FORM ACTIONS =====
    setFormSubmitting: (state, action) => {
      state.form.isSubmitting = action.payload;
    },

    setFormError: (state, action) => {
      state.form.submitError = action.payload;
    },

    clearFormError: (state) => {
      state.form.submitError = null;
    },

    setSuccessMessage: (state, action) => {
      state.form.successMessage = action.payload;
    },

    clearSuccessMessage: (state) => {
      state.form.successMessage = null;
    },

    // ===== FILTER ACTIONS =====
    setMatchStatusFilter: (state, action) => {
      state.filters.matchStatus = action.payload;
    },

    setLeagueFilter: (state, action) => {
      state.filters.leagueId = action.payload;
    },

    setSortBy: (state, action) => {
      state.filters.sortBy = action.payload;
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    // ===== TAB ACTIONS =====
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },

    // ===== NOTIFICATION ACTIONS =====
    showNotification: (state, action) => {
      const { message, severity = 'info' } = action.payload;
      state.notification = {
        isOpen: true,
        message,
        severity,
      };
    },

    hideNotification: (state) => {
      state.notification.isOpen = false;
    },

    // ===== MODAL ACTIONS =====
    openModal: (state, action) => {
      const { type, data = null } = action.payload;
      state.modal = {
        isOpen: true,
        type,
        data,
      };
    },

    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        data: null,
      };
    },

    // ===== LOADING STATE ACTIONS =====
    setMatchesLoading: (state, action) => {
      state.loading.matches = action.payload;
    },

    setPredictionsLoading: (state, action) => {
      state.loading.predictions = action.payload;
    },

    setLeaderboardLoading: (state, action) => {
      state.loading.leaderboard = action.payload;
    },
  },
});

// Export actions
export const {
  setFormSubmitting,
  setFormError,
  clearFormError,
  setSuccessMessage,
  clearSuccessMessage,
  setMatchStatusFilter,
  setLeagueFilter,
  setSortBy,
  resetFilters,
  setActiveTab,
  showNotification,
  hideNotification,
  openModal,
  closeModal,
  setMatchesLoading,
  setPredictionsLoading,
  setLeaderboardLoading,
} = predictionSlice.actions;

// Export selectors
export const selectPredictionForm = (state) => state.prediction.form;
export const selectPredictionFilters = (state) => state.prediction.filters;
export const selectActiveTab = (state) => state.prediction.activeTab;
export const selectNotification = (state) => state.prediction.notification;
export const selectModal = (state) => state.prediction.modal;
export const selectLoading = (state) => state.prediction.loading;

// Export reducer
export default predictionSlice.reducer;