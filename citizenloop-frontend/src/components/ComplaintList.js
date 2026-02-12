import React, { useEffect, useState } from 'react';
import citizenService from '../services/citizenService';

export default function ComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await citizenService.getMyComplaints();
      setComplaints(data || []);
    } catch (err) {
      setError('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  if (loading) return <div>Loading complaints...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h3>My Complaints</h3>
      {complaints.length === 0 && <div className="muted">No complaints yet.</div>}

      <div className="complaint-grid">
        {complaints.map((c) => (
          <div key={c.id} className="card complaint-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700 }}>{c.title}</div>
              <div>
                {c.status === 'PENDING' && <span className="status-pill status-pending">PENDING</span>}
                {c.status === 'IN_PROGRESS' && <span className="status-pill status-inprogress">IN PROGRESS</span>}
                {c.status === 'RESOLVED' && <span className="status-pill status-resolved">RESOLVED</span>}
              </div>
            </div>

            <div className="small muted">{new Date(c.createdAt || c.date || Date.now()).toLocaleString()}</div>
            <div>{c.description}</div>
            <div className="small">Category: <strong>{c.category}</strong></div>
            <div className="small">SDG: {c.sdgGoal || '-'}</div>
            <div className="small">Location: {c.latitude}, {c.longitude}</div>
            {c.imageUrl && <img src={`http://localhost:8080${c.imageUrl}`} alt="img" style={{ maxWidth: 220, borderRadius: 6 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}
