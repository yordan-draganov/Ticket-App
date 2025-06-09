import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import '../css/Mytickets.css';
import bannerImage from '../assets/test.png';

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const fetchMyTickets = async () => {
    try {
      setLoading(true);
      setError('');
      const ticketsData = await apiService.getMyTickets();
      setTickets(ticketsData);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      setError('Failed to load your tickets. Please try again later.');
      
      if (error.message.includes('token') || error.message.includes('401')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTicket = (ticketId) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      const ticketContent = `
TICKET CONFIRMATION
═══════════════════════════════════════

Event: ${ticket.eventTitle}
Date: ${ticket.date}
Location: ${ticket.location}
Quantity: ${ticket.quantity}
Total Price: ${ticket.price}
Ticket ID: ${ticket.id}
Purchase Date: ${ticket.purchaseDate}

═══════════════════════════════════════
Please present this ticket at the venue
      `;
      
      const blob = new Blob([ticketContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket-${ticketId}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return (
      <div className="loading-container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px'
      }}>
        <div className="loading-spinner" style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>Loading your tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container" style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#dc3545'
      }}>
        <h3>Error Loading Tickets</h3>
        <p>{error}</p>
        <button 
          onClick={fetchMyTickets}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Try Again
        </button>
        <button 
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Browse Events
        </button>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="no-tickets-container">
        <div className="no-tickets-content">
          <h2>You don't have any tickets yet</h2>
          <p>Browse our events and purchase tickets to see them here.</p>
          <button className="browse-events-btn" onClick={() => navigate('/')}>
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-tickets-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>My Tickets</h1>
        <button 
          onClick={fetchMyTickets}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Refresh
        </button>
      </div>
      
      <div className="tickets-list">
        {tickets.map(ticket => (
          <div key={ticket.id} className="ticket-card">
            <div className="ticket-image">
              <img 
                src={bannerImage} 
                alt={ticket.eventTitle} 
                className="ticket-banner-image"
              />
            </div>
            <div className="ticket-content">
              <div className="ticket-header">
                <h3>{ticket.eventTitle}</h3>
                <span className="ticket-id">Ticket #{ticket.id}</span>
              </div>
              <div className="ticket-details">
                <p><span className="icon">📅</span> {ticket.date}</p>
                <p><span className="icon">📍</span> {ticket.location}</p>
                <p><span className="icon">🎟️</span> Quantity: {ticket.quantity}</p>
                <p><span className="icon">💰</span> Total: {ticket.price}</p>
                <p><span className="icon">📆</span> Purchased on: {ticket.purchaseDate}</p>
              </div>
              <div className="ticket-actions">
                <button 
                  className="view-event-btn" 
                  onClick={() => navigate(`/event/${ticket.eventId}`)}
                >
                  View Event
                </button>
                <button 
                  className="download-ticket-btn"
                  onClick={() => handleDownloadTicket(ticket.id)}
                >
                  Download Ticket
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}