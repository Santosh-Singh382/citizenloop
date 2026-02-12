import React, { useState, useEffect } from 'react';
import * as publicService from '../services/publicService';
import '../styles/ui.css';

export default function PublicMap() {
  const [stats, setStats] = useState(null);
  const [sdgAnalytics, setSdgAnalytics] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterSDG, setFilterSDG] = useState('ALL');

  useEffect(() => {
    fetchPublicData();
  }, []);

  const fetchPublicData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch public stats
      const statsRes = await publicService.getDashboardStats();
      if (statsRes.success) {
        setStats(statsRes.stats);
      }

      // Fetch SDG analytics
      const sdgRes = await publicService.getSDGAnalytics();
      if (sdgRes.success) {
        setSdgAnalytics(sdgRes.sdgImpact);
      }

      // Fetch all complaints for map
      const complaintRes = await publicService.getAllComplaints();
      if (complaintRes.success) {
        setComplaints(complaintRes.complaints || []);
      }
    } catch (err) {
      setError(err?.message || 'Failed to load public data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getComplaintsBySDG = () => {
    if (filterSDG === 'ALL') return complaints;
    return complaints.filter(c => c.sdgGoal === filterSDG);
  };

  const filteredComplaints = getComplaintsBySDG();
  const resolvedComplaints = filteredComplaints.filter(c => c.status === 'RESOLVED');

  return (
    <div className="public-dashboard">
      <div className="dashboard-title">
        <h1>🌍 Public Transparency Dashboard</h1>
        <p>Citizen-Generated Data for Municipal Accountability & Sustainable Development</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading transparency dashboard...</p>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          {stats && (
            <div className="transparency-section">
              <h2>📊 City-Level Sustainability Progress</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Issues Reported</div>
                  <div className="stat-value">{stats.totalComplaints}</div>
                </div>
                <div className="stat-card" style={{ borderLeftColor: '#27ae60' }}>
                  <div className="stat-label">Resolved Issues</div>
                  <div className="stat-value" style={{ color: '#27ae60' }}>
                    {stats.resolvedComplaints}
                  </div>
                </div>
                <div className="stat-card" style={{ borderLeftColor: '#9b59b6' }}>
                  <div className="stat-label">Resolution Rate</div>
                  <div className="stat-value" style={{ color: '#9b59b6' }}>
                    {Math.round(stats.resolutionRate)}%
                  </div>
                </div>
                <div className="stat-card" style={{ borderLeftColor: '#e74c3c' }}>
                  <div className="stat-label">Avg Resolution Time</div>
                  <div className="stat-value" style={{ color: '#e74c3c' }}>
                    {Math.round(stats.averageResolutionTime)} days
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SDG Impact Analytics */}
          {stats && stats.categoryDistribution && (
            <div className="transparency-section">
              <h2>🎯 UN Sustainable Development Goals (SDG) Impact</h2>
              <div className="charts-grid">
                <div className="chart-container">
                  <div className="chart-title">Issue Distribution by Category</div>
                  <div style={{ padding: '1rem' }}>
                    {Object.entries(stats.categoryDistribution).map(([category, count]) => (
                      <div key={category} style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <strong>{category}</strong>
                          <span>{count} issues</span>
                        </div>
                        <div style={{ width: '100%', height: '20px', backgroundColor: '#ecf0f1', borderRadius: '4px', overflow: 'hidden' }}>
                          <div 
                            style={{ 
                              width: `${Math.round((count / stats.totalComplaints) * 100)}%`, 
                              height: '100%', 
                              backgroundColor: '#3498db',
                              transition: 'width 0.3s ease'
                            }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {sdgAnalytics && (
                  <div className="chart-container">
                    <div className="chart-title">SDG-wise Impact</div>
                    <div style={{ padding: '1rem' }}>
                      {Object.entries(sdgAnalytics).map(([sdg, data]) => (
                        <div key={sdg} style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f5f7fa', borderRadius: '6px' }}>
                          <strong>{data.sdg}</strong>
                          <div style={{ fontSize: '0.85rem', color: '#7f8c8d', marginTop: '0.25rem' }}>
                            Total: {data.totalComplaints} | Resolved: {data.resolved} | Pending: {data.pending}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Filter and Resolved Complaints */}
          <div className="transparency-section">
            <h2>✅ Resolved Issues (Public View)</h2>
            
            {sdgAnalytics && (
              <div className="filter-controls">
                <label htmlFor="sdg-filter">Filter by SDG Goal:</label>
                <select 
                  id="sdg-filter"
                  value={filterSDG}
                  onChange={(e) => setFilterSDG(e.target.value)}
                >
                  <option value="ALL">All Issues</option>
                  {Object.keys(sdgAnalytics).map(sdg => (
                    <option key={sdg} value={sdgAnalytics[sdg].sdg}>
                      {sdgAnalytics[sdg].sdg}
                    </option>
                  ))}
                </select>
                <button className="btn btn-primary" onClick={fetchPublicData}>
                  🔄 Refresh
                </button>
              </div>
            )}

            {loading ? (
              <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                <p>Loading issues...</p>
              </div>
            ) : resolvedComplaints.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                <p>No resolved issues found for this filter</p>
              </div>
            ) : (
              <div className="complaints-list">
                {resolvedComplaints.slice(0, 10).map((complaint) => (
                  <div key={complaint.id} className="complaint-item">
                    <div className="complaint-header">
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem 0' }}>{complaint.title}</h4>
                        <div className="complaint-id">ID: {complaint.complaintId}</div>
                      </div>
                      <span className="status-badge status-resolved">✅ Resolved</span>
                    </div>

                    <div style={{ marginBottom: '0.75rem' }}>
                      <span className="category-badge">📁 {complaint.category}</span>
                      {complaint.sdgGoal && (
                        <span className="category-badge" style={{ backgroundColor: '#e8f8f5' }}>
                          🎯 {complaint.sdgGoal}
                        </span>
                      )}
                    </div>

                    <p style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                      {complaint.description}
                    </p>

                    {complaint.latitude && complaint.longitude && (
                      <div style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>
                        📍 {complaint.latitude.toFixed(4)}, {complaint.longitude.toFixed(4)}
                      </div>
                    )}

                    {complaint.resolvedAt && (
                      <div style={{ fontSize: '0.85rem', color: '#7f8c8d', marginTop: '0.5rem' }}>
                        ✓ Resolved: {new Date(complaint.resolvedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}

                {resolvedComplaints.length > 10 && (
                  <div style={{ textAlign: 'center', padding: '1rem', color: '#7f8c8d' }}>
                    Showing 10 of {resolvedComplaints.length} resolved issues
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Impact Summary */}
          <div className="transparency-section">
            <div className="card">
              <h3>📈 Transparency & Impact Summary</h3>
              <p>
                This public dashboard demonstrates municipal commitment to transparency and sustainable urban development. 
                Citizen-reported data drives municipal planning and resource allocation toward achieving UN Sustainable Development Goals.
              </p>
              <ul style={{ marginTop: '1rem' }}>
                <li><strong>Accountability:</strong> Real-time tracking of issue resolution</li>
                <li><strong>Transparency:</strong> Public access to all resolved issues and performance metrics</li>
                <li><strong>Sustainability:</strong> Data-driven approach to urban development aligned with UN SDGs</li>
                <li><strong>Citizen Engagement:</strong> Direct impact of citizen participation on policy decisions</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
