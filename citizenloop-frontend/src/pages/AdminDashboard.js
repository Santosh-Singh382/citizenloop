import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as adminService from "../services/adminService";
import '../styles/ui.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  // Redirect if not admin
  useEffect(() => {
    if (role !== 'ADMIN') {
      navigate('/');
    }
  }, [role, navigate]);

  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [error, setError] = useState(null);

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch complaints
      const complaintRes = await adminService.getAllComplaints();
      if (complaintRes.success) {
        setComplaints(complaintRes.complaints || []);
      }

      // Fetch stats
      const statsRes = await adminService.getDashboardStats();
      if (statsRes.success) {
        setStats(statsRes.stats);
      }
    } catch (err) {
      setError(err?.message || 'Failed to load dashboard');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await adminService.updateComplaintStatus(id, status);
      if (res.success) {
        // Update local state
        setComplaints(complaints.map(c => 
          c.id === id ? { ...c, status: status } : c
        ));
        // Refresh stats
        const statsRes = await adminService.getDashboardStats();
        if (statsRes.success) {
          setStats(statsRes.stats);
        }
      }
    } catch (err) {
      alert('Failed to update status: ' + err?.message);
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

  // Apply filters
  const filteredComplaints = complaints.filter(c => {
    const statusMatch = filterStatus === 'ALL' || c.status === filterStatus;
    const categoryMatch = filterCategory === 'ALL' || c.category === filterCategory;
    return statusMatch && categoryMatch;
  });

  const categories = [...new Set(complaints.map(c => c.category))];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>📊 Admin Operational Dashboard</h2>
        <p>Manage and monitor all citizen complaints and municipal operations</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Statistics Cards */}
      {stats && !loading && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Complaints</div>
            <div className="stat-value">{stats.totalComplaints}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#f39c12' }}>
            <div className="stat-label">Pending</div>
            <div className="stat-value" style={{ color: '#f39c12' }}>{stats.pendingComplaints}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#3498db' }}>
            <div className="stat-label">In Progress</div>
            <div className="stat-value" style={{ color: '#3498db' }}>{stats.inProgressComplaints}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#27ae60' }}>
            <div className="stat-label">Resolved</div>
            <div className="stat-value" style={{ color: '#27ae60' }}>{stats.resolvedComplaints}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#9b59b6' }}>
            <div className="stat-label">Avg Resolution Time</div>
            <div className="stat-value" style={{ color: '#9b59b6', fontSize: '1.8rem' }}>
              {Math.round(stats.averageResolutionTime)} days
            </div>
          </div>
        </div>
      )}

      {/* Filter Controls */}
      <div className="filter-controls">
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="ALL">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <button className="btn btn-primary" onClick={fetchData}>
          🔄 Refresh
        </button>

        <span style={{ marginLeft: 'auto', color: '#7f8c8d' }}>
          Found: {filteredComplaints.length} complaints
        </span>
      </div>

      {/* Complaints Table */}
      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading complaints...</p>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No complaints matching the selected filters</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="complaints-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>SDG Goal</th>
                <th>Location</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((complaint) => (
                <tr key={complaint.id}>
                  <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {complaint.complaintId}
                  </td>
                  <td>
                    <strong>{complaint.title}</strong>
                    <div style={{ fontSize: '0.85rem', color: '#7f8c8d', marginTop: '0.25rem' }}>
                      {complaint.description.substring(0, 50)}...
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">{complaint.category}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusColor(complaint.status)}`}>
                      {getStatusLabel(complaint.status)}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>
                    {complaint.sdgGoal || '-'}
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>
                    {complaint.latitude?.toFixed(4)}, {complaint.longitude?.toFixed(4)}
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {complaint.status !== 'IN_PROGRESS' && (
                        <button 
                          className="action-btn"
                          onClick={() => updateStatus(complaint.id, 'IN_PROGRESS')}
                        >
                          Start
                        </button>
                      )}
                      {complaint.status !== 'RESOLVED' && (
                        <button 
                          className="action-btn"
                          onClick={() => updateStatus(complaint.id, 'RESOLVED')}
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Category Distribution */}
      {stats && stats.categoryCount && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h3>📁 Complaint Distribution by Category</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            {Object.entries(stats.categoryCount).map(([category, count]) => (
              <div key={category} style={{ padding: '1rem', backgroundColor: '#f5f7fa', borderRadius: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{count}</div>
                <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>{category}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
