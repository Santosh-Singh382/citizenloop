import React, { useEffect, useRef, useState } from 'react';
import publicService from '../services/publicService';

// This component dynamically loads Leaflet from CDN and renders markers.
export default function MapView() {
  const mapRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await publicService.getResolvedComplaints();
        setPoints(data || []);
      } catch (e) {
        setError('Failed to load map points');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    // inject Leaflet only in browser runtime
    if (typeof window === 'undefined') return;

    if (!window.L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (!window.L) return;
      // avoid re-init
      if (mapRef.current && mapRef.current._leaflet_id) return;

      const map = window.L.map('citizen-map').setView([0, 0], 2);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // add markers
      points.forEach((p) => {
        if (p.latitude && p.longitude) {
          const m = window.L.marker([p.latitude, p.longitude]).addTo(map);
          const title = p.title || 'Resolved complaint';
          m.bindPopup(`<strong>${title}</strong><br/>${p.category || ''}`);
        }
      });

      mapRef.current = map;
      if (points.length > 0) {
        const group = window.L.featureGroup(points.filter(p=>p.latitude && p.longitude).map(p => window.L.marker([p.latitude, p.longitude])));
        map.fitBounds(group.getBounds().pad(0.5));
      }
    }
  }, [points]);

  if (loading) return <div>Loading map...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Resolved Complaints Map</h3>
      <div id="citizen-map" className="map-container" />
    </div>
  );
}
