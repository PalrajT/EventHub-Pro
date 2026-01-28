import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function CheckRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    eventId: '',
    email: ''
  });
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setRegistration(null);
    setLoading(true);

    try {
      const response = await api.get(`/registrations/check/${formData.eventId}/${formData.email}`);
      setRegistration(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration not found');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US');
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav className="navbar">
        <div className="navbar-content">
          <h1>🔍 Check Registration Status</h1>
          <button onClick={() => navigate('/')}>← Home</button>
        </div>
      </nav>

      <div className="container">
        <div className="form-container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎫</div>
          </div>
          <h2 style={{ textAlign: 'center' }}>Find Your Registration</h2>
          <p style={{ textAlign: 'center', color: '#718096', marginBottom: '2rem' }}>Enter your details to check your event registration status</p>
          {error && <div className="error-message">{error}</div>}
        
          <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event ID</label>
            <input
              type="text"
              name="eventId"
              value={formData.eventId}
              onChange={handleChange}
              placeholder="Enter Event ID from URL"
              required
            />
            <small style={{ color: '#7f8c8d' }}>
              Example: If event URL is /event/abc123, enter "abc123"
            </small>
          </div>
          <div className="form-group">
            <label>Your Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email used for registration"
              required
            />
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Checking...' : 'Check Status'}
          </button>
        </form>

        {registration && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '1rem' }}>Registration Details</h3>
            <p><strong>Event:</strong> {registration.event?.title}</p>
            <p><strong>Name:</strong> {registration.name}</p>
            <p><strong>Email:</strong> {registration.email}</p>
            <p><strong>Phone:</strong> {registration.phone}</p>
            <p><strong>Registered At:</strong> {formatDate(registration.createdAt)}</p>
            <p>
              <strong>Status:</strong>{' '}
              <span className={`status-badge status-${registration.status}`}>
                {registration.status.toUpperCase()}
              </span>
            </p>
            
            {registration.status === 'approved' && registration.ticketId && (
              <div style={{ marginTop: '1.5rem' }}>
                <button 
                  className="btn btn-success"
                  onClick={() => navigate(`/ticket/${registration.ticketId}`)}
                >
                  View Ticket
                </button>
              </div>
            )}

            {registration.status === 'pending' && (
              <p style={{ marginTop: '1rem', color: '#f39c12' }}>
                ⏳ Your registration is pending organizer approval. Please check back later.
              </p>
            )}

            {registration.status === 'rejected' && (
              <p style={{ marginTop: '1rem', color: '#e74c3c' }}>
                ❌ Your registration was not approved by the organizer.
              </p>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default CheckRegistration;
