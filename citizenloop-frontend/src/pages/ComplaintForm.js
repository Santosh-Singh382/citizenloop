import React from 'react';
import { useNavigate } from 'react-router-dom';
import ComplaintFormComponent from '../components/ComplaintFormComponent';
import '../styles/ui.css';

function ComplaintForm() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  // Redirect if not logged in
  if (!userId) {
    navigate('/');
    return null;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-title">
        <h1>📝 Report Civic Issue</h1>
        <p>Help improve our city by reporting infrastructure problems</p>
      </div>
      <ComplaintFormComponent />
    </div>
  );
}

export default ComplaintForm;
