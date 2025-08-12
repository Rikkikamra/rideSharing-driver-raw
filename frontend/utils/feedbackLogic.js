// Re‑export the trip feedback helper using the shared apiClient.  The
// previous version duplicated the implementation and hit an incorrect
// endpoint (`/trips/${tripId}/feedback`).  Use the backend’s `/feedback/:tripId`
// route instead and leverage the existing axios instance.

import apiClient from './api';

/**
 * Submit feedback for a completed trip.  See backend/routes/feedback.js
 * for validation and rate‑limiting.
 *
 * @param {string} tripId ID of the trip/ride
 * @param {object} payload Object containing rating (1–5), badges (array) and comments
 * @returns {Promise<object>} Response data from the backend
 */
export async function submitTripFeedback(tripId, payload) {
  const res = await apiClient.post(`/feedback/${tripId}`, payload);
  return res.data;
}