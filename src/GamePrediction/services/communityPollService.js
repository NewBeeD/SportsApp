// src/GamePrediction/services/communityPollService.js
/**
 * Service for casual community polls (Home/Draw/Away)
 */

import {
  doc,
  getDoc,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../../config/firebaseConfig';

const DEFAULT_POLL = {
  home: 0,
  draw: 0,
  away: 0,
  total: 0,
};

const OUTCOME_FIELD = {
  HOME_WIN: 'home',
  DRAW: 'draw',
  AWAY_WIN: 'away',
};

export const getCommunityPoll = async (matchId) => {
  if (!matchId) return { ...DEFAULT_POLL };

  const pollRef = doc(db, 'communityPolls', matchId);
  const snap = await getDoc(pollRef);

  if (!snap.exists()) {
    return { ...DEFAULT_POLL };
  }

  const data = snap.data() || {};
  return {
    home: Number(data.home || 0),
    draw: Number(data.draw || 0),
    away: Number(data.away || 0),
    total: Number(data.total || 0),
  };
};

const getDeviceId = () => {
  const key = 'communityPollDeviceId';
  let deviceId = window.localStorage.getItem(key);
  if (!deviceId) {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      deviceId = crypto.randomUUID();
    } else {
      deviceId = `device_${Math.random().toString(36).slice(2)}${Date.now()}`;
    }
    window.localStorage.setItem(key, deviceId);
  }
  return deviceId;
};

export const submitCommunityPollVote = async (matchId, outcome) => {
  if (!matchId || !OUTCOME_FIELD[outcome]) {
    throw new Error('Invalid match or outcome');
  }

  const deviceId = getDeviceId();
  const submitVote = httpsCallable(functions, 'submitCommunityVote');
  const result = await submitVote({
    matchId,
    outcome,
    deviceId,
  });

  return result.data;
};
