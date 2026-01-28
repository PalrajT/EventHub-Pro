import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function PublicEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [registrationResult, setRegistrationResult] = useState(null);

  const fetchEvent = useCallback(async () => {
    try {
      const response = await api.get(`/events/${id}`);
      setEvent(response.data);
    } catch (err) {
      setError('Event not found');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const response = await api.post('/registrations', {
        eventId: id,
        ...formData
      });
      
      setRegistrationResult(response.data);
      
      if (response.data.status === 'approved') {
        setSuccess('Registration successful! Your ticket has been approved.');
        setTimeout(() => {
          navigate(`/ticket/${response.data.ticketId}`);
        }, 2000);
      } else {
        setSuccess('Registration submitted! Waiting for organizer approval.');
        setFormData({ name: '', email: '', phone: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="loading">Loading event...</div>;
  if (error && !event) return <div className="error-message" style={{ margin: '2rem' }}>{error}</div>;

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav className="navbar">
        <div className="navbar-content">
          <h1>✨ Event Registration Portal</h1>
          <button onClick={() => navigate('/check-registration')}>Check Registration Status</button>
        </div>
      </nav>

      <div className="container">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {event && (
            <div style={{ 
              background: 'white', 
              padding: '2.5rem', 
              borderRadius: '16px', 
              marginBottom: '2rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(0,0,0,0.05)'
            }}>
              <div style={{ 
                borderBottom: '3px solid transparent',
                borderImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderImageSlice: 1,
                paddingBottom: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <h2 style={{ 
                  fontSize: '2rem', 
                  fontWeight: '700',
                  color: '#1a202c',
                  marginBottom: '1rem',
                  letterSpacing: '-0.02em'
                }}>{event.title}</h2>
                <div style={{ 
                  color: '#2d3748', 
                  fontSize: '1.0625rem',
                  lineHeight: '1.8',
                  whiteSpace: 'pre-line',
                  textAlign: 'justify',
                  padding: '1.25rem',
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                  borderRadius: '12px',
                  border: '1px solid #e9ecef',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                }}>
                  {event.description}
                </div>
              </div>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.25rem',
                marginTop: '1.5rem'
              }}>
                <div style={{ 
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📅</div>
                  <div style={{ fontSize: '0.825rem', color: '#718096', fontWeight: '600', marginBottom: '0.25rem' }}>Event Date</div>
                  <div style={{ fontSize: '0.9rem', color: '#2d3748', fontWeight: '500' }}>{formatDate(event.date)}</div>
                </div>
                <div style={{ 
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📍</div>
                  <div style={{ fontSize: '0.825rem', color: '#718096', fontWeight: '600', marginBottom: '0.25rem' }}>Venue</div>
                  <div style={{ fontSize: '0.9rem', color: '#2d3748', fontWeight: '500' }}>{event.venue}</div>
                </div>
                <div style={{ 
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎫</div>
                  <div style={{ fontSize: '0.825rem', color: '#718096', fontWeight: '600', marginBottom: '0.25rem' }}>Available Seats</div>
                  <div style={{ fontSize: '0.9rem', color: '#2d3748', fontWeight: '500' }}>{event.ticketLimit - event.approvedCount} / {event.ticketLimit}</div>
                </div>
                <div style={{ 
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✅</div>
                  <div style={{ fontSize: '0.825rem', color: '#718096', fontWeight: '600', marginBottom: '0.25rem' }}>Approval Type</div>
                  <div style={{ fontSize: '0.9rem', color: '#2d3748', fontWeight: '500' }}>{event.approvalMode === 'auto' ? 'Instant Confirmation' : 'Manual Review'}</div>
                </div>
              </div>
            </div>
          )}

          <div className="form-container" style={{ margin: 0 }}>
            <h2>Register for This Event</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            {!registrationResult && (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
                <button type="submit" className="btn" disabled={submitting}>
                  {submitting ? 'Processing Registration...' : 'Complete Registration'}
                </button>
              </form>
            )}

            {registrationResult && registrationResult.status === 'pending' && (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <h3 style={{ color: '#f39c12' }}>⏳ Pending Approval</h3>
                <p style={{ marginTop: '1rem', color: '#7f8c8d' }}>
                  Your registration has been submitted and is waiting for organizer approval.
                  <br />
                  Check your registration status using your email: <strong>{registrationResult.email}</strong>
                </p>
                <button 
                  className="btn" 
                  style={{ marginTop: '1.5rem' }}
                  onClick={() => navigate('/check-registration')}
                >
                  Check Registration Status
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicEventPage;
