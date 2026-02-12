import api from './api';

const citizenBase = '/citizen';

/**
 * Submit a new complaint
 */
export async function submitComplaint(userId, complaintData) {
  try {
    const res = await api.post(`${citizenBase}/${userId}/complaints`, complaintData);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

/**
 * Get all complaints of the user
 */
export async function getMyComplaints(userId) {
  try {
    const res = await api.get(`${citizenBase}/${userId}/complaints`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

/**
 * Get complaint by complaint ID
 */
export async function getComplaintByComplaintId(complaintId) {
  try {
    const res = await api.get(`${citizenBase}/complaint/${complaintId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

/**
 * Track complaint status
 */
export async function trackComplaintStatus(userId, complaintId) {
  try {
    const res = await api.get(`${citizenBase}/${userId}/complaints/${complaintId}/status`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

/**
 * Update user profile
 */
export async function updateProfile(userId, userData) {
  try {
    const res = await api.put(`${citizenBase}/${userId}/profile`, userData);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

/**
 * Get user profile
 */
export async function getProfile(userId) {
  try {
    const res = await api.get(`${citizenBase}/${userId}/profile`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}
