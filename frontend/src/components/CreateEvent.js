import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function CreateEvent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    ticketLimit: '',
    approvalMode: 'auto'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/events', formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav className="navbar">
        <div className="navbar-content">
          <h1>✨ Create New Event</h1>
          <button onClick={() => navigate('/')}>← Back to Dashboard</button>
        </div>
      </nav>

      <div className="container">
        <div className="form-container">
          <h2 style={{ textAlign: 'center' }}>Event Details</h2>
          <p style={{ textAlign: 'center', color: '#718096', marginBottom: '2rem', fontSize: '0.95rem' }}>Fill in the information below to create your event</p>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Professional Networking Summit 2026"
              required
            />
          </div>
          <div className="form-group">
            <label>Event Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Join us for an exclusive professional event featuring industry leaders, networking opportunities, and insightful discussions.&#10;&#10;This comprehensive program includes:&#10;• Keynote presentations from industry experts&#10;• Interactive workshops and hands-on sessions&#10;• Networking opportunities with professionals&#10;• Q&A panels and collaborative discussions&#10;&#10;Whether you're a seasoned professional or just starting your journey, this event offers valuable insights and connections to elevate your career."
              required
              style={{ minHeight: '160px', fontFamily: 'inherit' }}
            />
            <small style={{ color: '#718096', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block', lineHeight: '1.5' }}>
              💡 <strong>Tip:</strong> Use multiple paragraphs for better readability. Press Enter twice for paragraph breaks. Include key highlights, agenda items, and what attendees will gain.
            </small>
          </div>
          <div className="form-group">
            <label>Event Date</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Venue</label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Ticket Limit</label>
            <input
              type="number"
              name="ticketLimit"
              value={formData.ticketLimit}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>Approval Mode</label>
            <select
              name="approvalMode"
              value={formData.approvalMode}
              onChange={handleChange}
              required
            >
              <option value="auto">Auto Approval</option>
              <option value="manual">Manual Approval</option>
            </select>
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}

export default CreateEvent;
