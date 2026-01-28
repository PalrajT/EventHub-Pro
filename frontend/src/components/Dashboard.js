import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events/my-events');
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav className="navbar">
        <div className="navbar-content">
          <h1>🎫 EventHub Pro</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ 
              fontSize: '0.95rem', 
              color: '#4a5568',
              fontWeight: '500',
              background: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>👋 {user?.name}</span>
            <button onClick={handleLogout} style={{ 
              background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
              padding: '0.65rem 1.5rem'
            }}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="container">
        {/* Hero Section */}
        <div style={{
          background: 'white',
          padding: '2.5rem',
          borderRadius: '16px',
          marginTop: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1a202c', marginBottom: '0.5rem' }}>My Events Dashboard</h2>
              <p style={{ color: '#718096', fontSize: '1rem' }}>Manage your events and track registrations</p>
            </div>
            <button className="btn" style={{ 
              width: 'auto', 
              padding: '1rem 2rem',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }} onClick={() => navigate('/create-event')}>
              ➕ Create New Event
            </button>
          </div>
          
          {/* Stats */}
          {events.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginTop: '2rem',
              paddingTop: '2rem',
              borderTop: '2px solid #f7fafc'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#667eea' }}>{events.length}</div>
                <div style={{ color: '#718096', fontSize: '0.875rem', marginTop: '0.25rem' }}>Total Events</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#48bb78' }}>
                  {events.reduce((sum, e) => sum + e.approvedCount, 0)}
                </div>
                <div style={{ color: '#718096', fontSize: '0.875rem', marginTop: '0.25rem' }}>Total Registrations</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f6ad55' }}>
                  {events.reduce((sum, e) => sum + e.ticketLimit, 0)}
                </div>
                <div style={{ color: '#718096', fontSize: '0.875rem', marginTop: '0.25rem' }}>Total Capacity</div>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔄</div>
            <div style={{ color: '#718096', fontSize: '1.1rem' }}>Loading your events...</div>
          </div>
        ) : events.length === 0 ? (
          <div style={{
            background: 'white',
            padding: '4rem 2rem',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎫</div>
            <h3 style={{ fontSize: '1.5rem', color: '#2d3748', marginBottom: '0.75rem' }}>No Events Yet</h3>
            <p style={{ color: '#718096', marginBottom: '2rem' }}>Get started by creating your first event!</p>
            <button className="btn" style={{ width: 'auto', padding: '1rem 2.5rem' }} onClick={() => navigate('/create-event')}>
              ✨ Create Your First Event
            </button>
          </div>
        ) : (
          <div className="events-grid">
            {events.map(event => (
              <div 
                key={event._id} 
                className="event-card"
              >
                <div onClick={() => navigate(`/event/${event._id}/registrations`)} style={{ cursor: 'pointer' }}>
                  <h3>{event.title}</h3>
                  <p style={{ minHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {event.description}
                  </p>
                  <div className="event-info">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                      <span>📅 {formatDate(event.date)}</span>
                      <span>📍 {event.venue}</span>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <span style={{ 
                          background: event.approvedCount >= event.ticketLimit ? '#fed7d7' : '#c6f6d5',
                          color: event.approvedCount >= event.ticketLimit ? '#c53030' : '#2f855a',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '6px',
                          fontWeight: '600',
                          fontSize: '0.85rem'
                        }}>
                          🎫 {event.approvedCount}/{event.ticketLimit}
                        </span>
                        <span style={{
                          background: event.approvalMode === 'auto' ? '#bee3f8' : '#fefcbf',
                          color: event.approvalMode === 'auto' ? '#2c5282' : '#744210',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '6px',
                          fontWeight: '600',
                          fontSize: '0.85rem'
                        }}>
                          {event.approvalMode === 'auto' ? '⚡ Auto' : '✋ Manual'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ 
                  marginTop: '1.5rem', 
                  paddingTop: '1rem', 
                  borderTop: '2px solid #f7fafc',
                  display: 'flex',
                  gap: '0.5rem'
                }}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(`${window.location.origin}/event/${event._id}`);
                      alert('Event link copied to clipboard!');
                    }}
                    style={{
                      flex: 1,
                      padding: '0.6rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    📋 Copy Link
                  </button>
                  <button 
                    onClick={() => navigate(`/event/${event._id}/registrations`)}
                    style={{
                      flex: 1,
                      padding: '0.6rem',
                      background: 'white',
                      color: '#667eea',
                      border: '2px solid #667eea',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    📊 Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
