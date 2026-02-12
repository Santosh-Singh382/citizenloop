import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as citizenService from '../services/citizenService';
import '../styles/ui.css';

function Dashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }

    fetchComplaints();
  }, [userId, navigate]);

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await citizenService.getMyComplaints(userId);
      if (response.success) {
        setComplaints(response.complaints || []);
      } else {
        setError(response.message || 'Failed to load complaints');
      }
    } catch (err) {
      setError(err?.message || 'Failed to load complaints');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'status-pending';
      case 'IN_PROGRESS':
        return 'status-in-progress';
      case 'RESOLVED':
        return 'status-resolved';
      default:
        return '';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING':
        return '⏳ Pending';
      case 'IN_PROGRESS':
        return '🔄 In Progress';
      case 'RESOLVED':
        return '✅ Resolved';
      default:
        return status;
    }
  };

  const filteredComplaints = filter === 'ALL' 
    ? complaints 
    : complaints.filter(c => c.status === filter);

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'PENDING').length,
    inProgress: complaints.filter(c => c.status === 'IN_PROGRESS').length,
    resolved: complaints.filter(c => c.status === 'RESOLVED').length,
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>📋 My Complaints Dashboard</h2>
        <p>Track your reported civic issues and their resolution status</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Complaints</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#f39c12' }}>
          <div className="stat-label">Pending</div>
          <div className="stat-value" style={{ color: '#f39c12' }}>{stats.pending}</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#3498db' }}>
          <div className="stat-label">In Progress</div>
          <div className="stat-value" style={{ color: '#3498db' }}>{stats.inProgress}</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#27ae60' }}>
          <div className="stat-label">Resolved</div>
          <div className="stat-value" style={{ color: '#27ae60' }}>{stats.resolved}</div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Filter Controls */}
      <div className="filter-controls">
        <label htmlFor="status-filter">Filter by Status:</label>
        <select 
          id="status-filter"
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">All Complaints</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
        <button className="btn btn-primary" onClick={fetchComplaints}>
          🔄 Refresh
        </button>
      </div>

      {/* Complaints List */}
      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading your complaints...</p>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No complaints found. Create your first complaint to get started!</p>
          <button className="btn btn-primary" onClick={() => navigate('/complaint-form')}>
            ➕ Report an Issue
          </button>
        </div>
      ) : (
        <div className="complaints-list">
          {filteredComplaints.map((complaint) => (
            <div key={complaint.id} className="complaint-item">
              <div className="complaint-header">
                <div>
                  <h3 className="complaint-title">{complaint.title}</h3>
                  <div className="complaint-id">ID: {complaint.complaintId}</div>
                </div>
                <span className={`status-badge ${getStatusColor(complaint.status)}`}>
                  {getStatusLabel(complaint.status)}
                </span>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <span className="category-badge">📁 {complaint.category}</span>
                {complaint.sdgGoal && (
                  <span className="category-badge" style={{ backgroundColor: '#e8f8f5' }}>
                    🎯 {complaint.sdgGoal}
                  </span>
                )}
              </div>

              <p style={{ marginBottom: '1rem' }}>{complaint.description}</p>

              {complaint.latitude && complaint.longitude && (
                <div style={{ fontSize: '0.9rem', color: '#7f8c8d', marginBottom: '1rem' }}>
                  📍 Location: {complaint.latitude.toFixed(4)}, {complaint.longitude.toFixed(4)}
                </div>
              )}

              <div style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>
                <div>📅 Submitted: {new Date(complaint.createdAt).toLocaleDateString()}</div>
                {complaint.resolvedAt && (
                  <div>✓ Resolved: {new Date(complaint.resolvedAt).toLocaleDateString()}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
