import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as citizenService from '../services/citizenService';
import '../styles/ui.css';

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    fetchProfileData();
  }, [userId, navigate]);

  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch user profile
      const profileRes = await citizenService.getProfile(userId);
      if (profileRes.success) {
        setProfile(profileRes.user);
        setEditData({ name: profileRes.user.name, email: profileRes.user.email });
      }

      // Fetch user's complaints
      const complaintsRes = await citizenService.getMyComplaints(userId);
      if (complaintsRes.success) {
        setComplaints(complaintsRes.complaints || []);
      }
    } catch (err) {
      setError(err?.message || 'Failed to load profile');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!editData.name.trim() || !editData.email.trim()) {
      setError('Name and email are required');
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      const res = await citizenService.updateProfile(userId, editData);
      
      if (res.success) {
        setProfile(res.user);
        setEditing(false);
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err?.message || 'Failed to update profile');
    }
  };

  const getGradientColor = (index) => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9'];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="dashboard-container">
        <div className="alert alert-error">Failed to load profile</div>
      </div>
    );
  }

  const stats = {
    totalComplaints: complaints.length,
    resolved: complaints.filter(c => c.status === 'RESOLVED').length,
    pending: complaints.filter(c => c.status === 'PENDING').length,
    inProgress: complaints.filter(c => c.status === 'IN_PROGRESS').length
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-title">
        <h1>👤 Your Profile</h1>
        <p>Manage your account and track your reported issues</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">{profile.name.charAt(0).toUpperCase()}</div>
          <div className="profile-info">
            <h2>{profile.name}</h2>
            <p>{profile.email}</p>
            <span className="role-badge" style={{ backgroundColor: '#3498db' }}>
              {profile.role}
            </span>
          </div>
          <button 
            className="btn btn-secondary"
            onClick={() => setEditing(!editing)}
          >
            {editing ? '✕ Cancel' : '✏️ Edit Profile'}
          </button>
        </div>

        {editing && (
          <div className="profile-edit">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                placeholder="Your full name"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-primary" onClick={handleUpdateProfile}>
                💾 Save Changes
              </button>
              <button className="btn btn-secondary" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Complaint Statistics */}
      <div className="stats-section">
        <h3>📊 Your Complaint Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Reports</div>
            <div className="stat-value">{stats.totalComplaints}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#27ae60' }}>
            <div className="stat-label">Resolved</div>
            <div className="stat-value" style={{ color: '#27ae60' }}>{stats.resolved}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#f39c12' }}>
            <div className="stat-label">In Progress</div>
            <div className="stat-value" style={{ color: '#f39c12' }}>{stats.inProgress}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#e74c3c' }}>
            <div className="stat-label">Pending</div>
            <div className="stat-value" style={{ color: '#e74c3c' }}>{stats.pending}</div>
          </div>
        </div>
      </div>

      {/* Complaint History */}
      <div className="complaints-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>📝 Your Reported Issues</h3>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/complaint-form')}
          >
            ➕ Report New Issue
          </button>
        </div>

        {complaints.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ fontSize: '1.1rem', color: '#7f8c8d' }}>
              You haven't reported any issues yet.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/complaint-form')}
              style={{ marginTop: '1rem' }}
            >
              Report Your First Issue
            </button>
          </div>
        ) : (
          <div className="complaints-list">
            {complaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((complaint, index) => {
              const daysOpen = Math.floor(
                (new Date() - new Date(complaint.createdAt)) / (1000 * 60 * 60 * 24)
              );

              return (
                <div key={complaint.id} className="complaint-timeline-item" style={{ borderLeftColor: getGradientColor(index) }}>
                  <div className="complaint-header">
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0' }}>{complaint.title}</h4>
                      <div className="complaint-id">ID: {complaint.complaintId}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className={`status-badge status-${complaint.status.toLowerCase()}`}>
                        {complaint.status === 'PENDING' && '⏳ Pending'}
                        {complaint.status === 'IN_PROGRESS' && '🔧 In Progress'}
                        {complaint.status === 'RESOLVED' && '✅ Resolved'}
                      </span>
                    </div>
                  </div>

                  <p style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                    {complaint.description}
                  </p>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    <span className="category-badge">📁 {complaint.category}</span>
                    {complaint.sdgGoal && (
                      <span className="category-badge" style={{ backgroundColor: '#e8f8f5' }}>
                        🎯 {complaint.sdgGoal}
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#7f8c8d', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                    {complaint.latitude && complaint.longitude && (
                      <div>📍 {complaint.latitude.toFixed(4)}, {complaint.longitude.toFixed(4)}</div>
                    )}
                    <div>📅 {new Date(complaint.createdAt).toLocaleDateString()}</div>
                    <div>⏱️ Open for {daysOpen} day{daysOpen !== 1 ? 's' : ''}</div>
                    {complaint.resolvedAt && (
                      <div>✓ Resolved on {new Date(complaint.resolvedAt).toLocaleDateString()}</div>
                    )}
                  </div>

                  {complaint.imageUrl && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <img 
                        src={complaint.imageUrl} 
                        alt="complaint" 
                        style={{ maxHeight: '150px', borderRadius: '4px', maxWidth: '100%' }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Account Settings */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3>⚙️ Account Settings</h3>
        <div style={{ marginTop: '1rem', color: '#7f8c8d', fontSize: '0.9rem' }}>
          <p>Account created: {new Date(profile.createdAt).toLocaleDateString()}</p>
          {profile.updatedAt && (
            <p>Last updated: {new Date(profile.updatedAt).toLocaleDateString()}</p>
          )}
        </div>
        <button 
          className="btn btn-danger"
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}
          style={{ marginTop: '1rem' }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
