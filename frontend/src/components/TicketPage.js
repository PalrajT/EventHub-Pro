import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

function TicketPage() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTicket = useCallback(async () => {
    try {
      const response = await api.get(`/registrations/ticket/${ticketId}`);
      setTicket(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Ticket not found');
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

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

  if (loading) return <div className="loading">Loading ticket...</div>;
  if (error) return (
    <div>
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Ticket</h1>
        </div>
      </nav>
      <div className="error-message" style={{ margin: '2rem' }}>{error}</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav className="navbar">
        <div className="navbar-content">
          <h1>🎫 Your Event Ticket</h1>
        </div>
      </nav>

      <div className="container">
        <div className="ticket-container">
          <div className="ticket-header">
            <h2>🎟️ Event Ticket</h2>
            <p>Your ticket has been approved!</p>
          </div>
          
          <div className="ticket-body">
            <div className="ticket-info-row">
              <span className="ticket-label">Event Name</span>
              <span className="ticket-value" style={{ fontWeight: '600', fontSize: '1.05rem' }}>{ticket?.event?.title}</span>
            </div>
            
            <div style={{ 
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
              borderRadius: '12px',
              border: '1px solid #e9ecef',
              marginBottom: '1.25rem'
            }}>
              <div className="ticket-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Event Description</div>
              <div style={{ 
                color: '#2d3748', 
                fontSize: '0.95rem',
                lineHeight: '1.7',
                whiteSpace: 'pre-line',
                textAlign: 'justify'
              }}>
                {ticket?.event?.description}
              </div>
            </div>
            
            <div className="ticket-info-row">
              <span className="ticket-label">Date & Time</span>
              <span className="ticket-value">{formatDate(ticket?.event?.date)}</span>
            </div>
            
            <div className="ticket-info-row">
              <span className="ticket-label">Venue</span>
              <span className="ticket-value">{ticket?.event?.venue}</span>
            </div>
            
            <div className="ticket-info-row">
              <span className="ticket-label">Attendee Name</span>
              <span className="ticket-value">{ticket?.name}</span>
            </div>
            
            <div className="ticket-info-row">
              <span className="ticket-label">Email</span>
              <span className="ticket-value">{ticket?.email}</span>
            </div>
            
            <div className="ticket-info-row">
              <span className="ticket-label">Phone</span>
              <span className="ticket-value">{ticket?.phone}</span>
            </div>

            <div className="ticket-id">
              Ticket ID: {ticket?.ticketId}
            </div>

            <p style={{ textAlign: 'center', color: '#7f8c8d', marginTop: '1.5rem', fontSize: '0.9rem' }}>
              Please present this ticket at the venue. Save this page or take a screenshot.
            </p>

            <button 
              className="btn" 
              style={{ marginTop: '1.5rem' }}
              onClick={() => window.print()}
            >
              Print Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketPage;
