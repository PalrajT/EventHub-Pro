import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function EventRegistrations() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEventAndRegistrations = useCallback(async () => {
    try {
      const [eventRes, regRes] = await Promise.all([
        api.get(`/events/${id}`),
        api.get(`/events/${id}/registrations`)
      ]);
      setEvent(eventRes.data);
      setRegistrations(regRes.data);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEventAndRegistrations();
  }, [fetchEventAndRegistrations]);

  const handleStatusUpdate = async (registrationId, status) => {
    try {
      await api.patch(`/registrations/${registrationId}/status`, { status });
      fetchEventAndRegistrations(); // Refresh data
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav className="navbar">
        <div className="navbar-content">
          <h1>🎫 {event?.title}</h1>
          <button onClick={() => navigate('/')}>← Back to Dashboard</button>
        </div>
      </nav>

      <div className="container">
        {event && (
          <div style={{ 
            background: 'white', 
            padding: '2.5rem', 
            borderRadius: '16px', 
            marginTop: '2rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a202c', marginBottom: '1rem' }}>Event Information</h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <p style={{ color: '#4a5568' }}><strong style={{ color: '#2d3748' }}>📅 Date:</strong> {formatDate(event.date)}</p>
                  <p style={{ color: '#4a5568' }}><strong style={{ color: '#2d3748' }}>📍 Venue:</strong> {event.venue}</p>
                  <p style={{ color: '#4a5568' }}><strong style={{ color: '#2d3748' }}>🎫 Capacity:</strong> {event.approvedCount}/{event.ticketLimit} tickets sold</p>
                  <p style={{ color: '#4a5568' }}><strong style={{ color: '#2d3748' }}>⚙️ Mode:</strong> {event.approvalMode === 'auto' ? '⚡ Auto Approval' : '✋ Manual Approval'}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/event/${event._id}`);
                  alert('Event registration link copied!');
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                📋 Copy Registration Link
              </button>
            </div>
            <div style={{ 
              padding: '1.25rem',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
              borderRadius: '12px',
              border: '1px solid #e9ecef'
            }}>
              <strong style={{ color: '#2d3748', fontSize: '0.95rem' }}>Description:</strong>
              <div style={{ color: '#4a5568', marginTop: '0.5rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>{event.description}</div>
            </div>
          </div>
        )}

        <div className="registrations-table">
          <h3 style={{ padding: '1rem', background: '#f8f9fa' }}>Registrations ({registrations.length})</h3>
          {registrations.length === 0 ? (
            <div className="empty-state">
              <p>No registrations yet</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Registered At</th>
                  <th>Ticket ID</th>
                  {event?.approvalMode === 'manual' && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {registrations.map(reg => (
                  <tr key={reg._id}>
                    <td>{reg.name}</td>
                    <td>{reg.email}</td>
                    <td>{reg.phone}</td>
                    <td>
                      <span className={`status-badge status-${reg.status}`}>
                        {reg.status.toUpperCase()}
                      </span>
                    </td>
                    <td>{formatDate(reg.createdAt)}</td>
                    <td>{reg.ticketId || '-'}</td>
                    {event?.approvalMode === 'manual' && (
                      <td>
                        {reg.status === 'pending' && (
                          <>
                            <button
                              className="btn btn-success btn-small"
                              onClick={() => handleStatusUpdate(reg._id, 'approved')}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-danger btn-small"
                              onClick={() => handleStatusUpdate(reg._id, 'rejected')}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventRegistrations;
