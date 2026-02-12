import api from './api';

const publicBase = '/public';

/**
 * Get public dashboard statistics
 */
export async function getDashboardStats() {
  try {
    const res = await api.get(`${publicBase}/dashboard/stats`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

/**
 * Get all resolved complaints
 */
export async function getResolvedComplaints() {
  try {
    const res = await api.get(`${publicBase}/complaints/resolved`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

/**
 * Get complaints for map visualization
 */
export async function getComplaintsForMap() {
  try {
    const res = await api.get(`${publicBase}/complaints/map`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

/**
 * Get SDG analytics
 */
export async function getSDGAnalytics() {
  try {
    const res = await api.get(`${publicBase}/sdg-analytics`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

/**
 * Get complaints by SDG goal
 */
export async function getComplaintsBySDG(sdgGoal) {
  try {
    const res = await api.get(`${publicBase}/complaints/sdg/${encodeURIComponent(sdgGoal)}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

/**
 * Get all complaints (public view)
 */
export async function getAllComplaints() {
  try {
    const res = await api.get(`${publicBase}/complaints/resolved`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}
