import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiService from "../services/apiService";
import "../css/EventDetails.css";
import bannerImage from "../assets/test.png";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const eventData = await apiService.getEvent(id);
      setEvent(eventData);
      setError("");
    } catch (error) {
      console.error('Failed to fetch event details:', error);
      setError('Failed to load event details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyTicket = () => {
    if (event) {
      sessionStorage.setItem('selectedEvent', JSON.stringify(event));
      navigate('/checkout');
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = event?.title || 'Check out this event!';
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this event: ${url}`)}`;
        break;
      default:
        break;
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
        <p>Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="error-container" style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#dc3545'
      }}>
        <h3>Event Not Found</h3>
        <p>{error || 'The event you are looking for does not exist.'}</p>
        <button 
          onClick={() => navigate('/')}
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
          Browse Events
        </button>
        <button 
          onClick={fetchEventDetails}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="event-details-container">
      <div className="event-header">
        <img 
          src={bannerImage} 
          alt={event.title} 
          className="event-banner" 
        />
        <div className="event-header-content">
          <span className="event-category-badge">{event.category}</span>
          <h1>{event.title}</h1>
          <div className="event-meta">
            <p><span className="icon">📅</span> {event.date} • {event.startTime} - {event.endTime}</p>
            <p><span className="icon">📍</span> {event.location}</p>
            <p><span className="icon">👤</span> Organized by {event.organizer}</p>
            {event.availableTickets !== undefined && (
              <p><span className="icon">🎟️</span> {event.availableTickets} tickets available</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="event-details-content">
        <div className="event-description-section">
          <h2>About This Event</h2>
          <p>{event.long_description}</p>
        </div>
        
        <div className="event-sidebar">
          <div className="ticket-card">
            <h3>Tickets</h3>
            <div className="ticket-price">
              <span className="price-value">{event.price}</span>
              <span className="per-person">per person</span>
            </div>
            
            {event.availableTickets === 0 ? (
              <button className="buy-ticket-button sold-out" disabled>
                Sold Out
              </button>
            ) : (
              <button className="buy-ticket-button" onClick={handleBuyTicket}>
                Buy Tickets
              </button>
            )}
            
            {event.availableTickets && event.availableTickets < 10 && event.availableTickets > 0 && (
              <p className="low-stock-warning" style={{ 
                color: '#dc3545', 
                fontSize: '14px', 
                textAlign: 'center', 
                marginTop: '10px' 
              }}>
                Only {event.availableTickets} tickets left!
              </p>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}