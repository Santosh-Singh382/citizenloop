import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as citizenService from '../services/citizenService';

const COMPLAINT_CATEGORIES = {
  WASTE: { label: '♻️ Waste Management', value: 'WASTE' },
  WATER: { label: '💧 Water Leakage', value: 'WATER' },
  ROAD: { label: '🛣️ Road Damage', value: 'ROAD' },
  STREETLIGHT: { label: '💡 Street Light', value: 'STREETLIGHT' },
  HAZARD: { label: '⚠️ Public Hazard', value: 'HAZARD' }
};

export default function ComplaintFormComponent({ onSubmitted }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'WASTE',
    latitude: '',
    longitude: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Get user's geolocation on component mount
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/');
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData(prev => ({
            ...prev,
            latitude: pos.coords.latitude.toFixed(6),
            longitude: pos.coords.longitude.toFixed(6)
          }));
          setGeoLoading(false);
        },
        (err) => {
          console.log('Geolocation error:', err);
          setGeoLoading(false);
        }
      );
    } else {
      setGeoLoading(false);
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you'd upload to cloud storage
      // For now, we'll just store the filename
      setFormData(prev => ({
        ...prev,
        imageUrl: file.name
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate form
      if (!formData.title.trim() || !formData.description.trim()) {
        setError('Title and description are required');
        setLoading(false);
        return;
      }

      if (!formData.latitude || !formData.longitude) {
        setError('Unable to get location. Please refresh and try again.');
        setLoading(false);
        return;
      }

      const userId = localStorage.getItem('userId');
      const complaintData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        imageUrl: formData.imageUrl || null
      };

      const response = await citizenService.submitComplaint(userId, complaintData);

      if (response.success) {
        setSuccess(`Complaint submitted successfully! Your Complaint ID is: ${response.complaintId}`);
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: 'WASTE',
          latitude: formData.latitude,
          longitude: formData.longitude,
          imageUrl: ''
        });
        setImagePreview(null);

        // Call callback if provided
        if (onSubmitted) onSubmitted(response.complaint);

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(response.message || 'Failed to submit complaint');
      }
    } catch (err) {
      setError(err?.message || 'Failed to submit complaint. Please try again.');
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="complaint-form-container">
      <div className="form-card">
        <h2>📝 Report a Public Issue</h2>
        <p className="form-subtitle">Help us improve your city by reporting civic issues</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="complaint-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Issue Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Broken pothole on Main Street"
              required
              disabled={loading}
              maxLength="100"
            />
            <small>{formData.title.length}/100</small>
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              disabled={loading}
            >
              {Object.values(COMPLAINT_CATEGORIES).map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Detailed Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide detailed information about the issue..."
              rows="5"
              required
              disabled={loading}
              maxLength="1000"
            />
            <small>{formData.description.length}/1000</small>
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label htmlFor="image">Upload Image (optional)</label>
            <div className="image-upload">
              <input
                id="image"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <small>Image selected</small>
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="latitude">Latitude</label>
              <input
                id="latitude"
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                placeholder="Auto-detected"
                step="0.000001"
                disabled={loading}
              />
              {geoLoading && <small>Detecting location...</small>}
            </div>

            <div className="form-group">
              <label htmlFor="longitude">Longitude</label>
              <input
                id="longitude"
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                placeholder="Auto-detected"
                step="0.000001"
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={loading || geoLoading}
            >
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="form-info">
          <p><strong>ℹ️ What happens next:</strong></p>
          <ul>
            <li>Your complaint will be assigned a unique ID</li>
            <li>Municipal departments will review and prioritize</li>
            <li>You can track status in your dashboard</li>
            <li>We aim to resolve within 30 days</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

