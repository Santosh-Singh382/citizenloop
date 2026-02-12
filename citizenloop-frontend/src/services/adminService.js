import api from './api';

const adminBase = '/admin';

/**
 * Get all complaints
 */
export async function getAllComplaints() {
  try {
    const res = await api.get(`${adminBase}/complaints`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

/**
 * Get complaints by status
 */
export async function getComplaintsByStatus(status) {
  try {
    const res = await api.get(`${adminBase}/complaints/status/${status}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

/**
 * Get complaints by category
 */
export async function getComplaintsByCategory(category) {
  try {
    const res = await api.get(`${adminBase}/complaints/category/${category}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

/**
 * Get complaints by category and status
 */
export async function getComplaintsByCategoryAndStatus(category, status) {
  try {
    const res = await api.get(`${adminBase}/complaints/category/${category}/status/${status}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

/**
 * Update complaint status
 */
export async function updateComplaintStatus(id, status) {
  try {
    const res = await api.put(`${adminBase}/complaint/${id}/status`, { status });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats() {
  try {
    const res = await api.get(`${adminBase}/dashboard/stats`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

/**
 * Get all users
 */
export async function getAllUsers() {
  try {
    const res = await api.get(`${adminBase}/users`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId) {
  try {
    const res = await api.get(`${adminBase}/users/${userId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

/**
 * Get user complaints
 */
export async function getUserComplaints(userId) {
  try {
    const res = await api.get(`${adminBase}/users/${userId}/complaints`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}
