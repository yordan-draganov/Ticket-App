import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiService";
import "../css/Checkout.css";
import bannerImage from "../assets/test.png";

export default function Checkout() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const eventData = sessionStorage.getItem('selectedEvent');
    if (eventData) {
      setSelectedEvent(JSON.parse(eventData));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!apiService.isLoggedIn()) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError("");

    try {
      const paymentDetails = {
        cardNumber: cardNumber.replace(/\s/g, ''), 
        expiry,
        cvv,
        name
      };

      const response = await apiService.purchaseTickets(
        selectedEvent.id,
        quantity,
        paymentDetails
      );

      alert(`Payment successful! Your ${quantity} ticket(s) have been purchased. Ticket ID: ${response.ticket.id}`);
      
      setCardNumber("");
      setExpiry("");
      setCvv("");
      setName("");
      sessionStorage.removeItem('selectedEvent');
      
      navigate('/my-tickets');
    } catch (error) {
      console.error('Purchase failed:', error);
      setError(error.message || 'Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
    }
    return v;
  };

  const calculateTotal = () => {
    if (!selectedEvent) return "0.00";
    const price = parseFloat(selectedEvent.price.replace('$', ''));
    return (price * quantity).toFixed(2);
  };

  if (!apiService.isLoggedIn()) {
    return (
      <div className="checkout-container">
        <div className="login-required">
          <h3>Login Required</h3>
          <p>You need to be logged in to purchase tickets.</p>
          <button onClick={() => navigate('/login')} className="login-btn">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      {selectedEvent ? (
        <div className="checkout-wrapper">
          <div className="event-summary">
            <h3>Order Summary</h3>
            <div className="event-info-checkout">
              <img 
                src={bannerImage} 
                alt={selectedEvent.title} 
                className="event-thumbnail" 
              />
              <div className="event-details">
                <h4>{selectedEvent.title}</h4>
                <p>📅 {selectedEvent.date}</p>
                <p>📍 {selectedEvent.location}</p>
                <div className="quantity-selector">
                  <label>Tickets:</label>
                  <div className="quantity-controls">
                    <button 
                      type="button" 
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="quantity-btn"
                      disabled={loading}
                    >
                      -
                    </button>
                    <span className="quantity-value">{quantity}</span>
                    <button 
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="quantity-btn"
                      disabled={loading}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="price-info">
                  <span className="price-label">Price per ticket:</span>
                  <span className="price-value">{selectedEvent.price}</span>
                </div>
                <div className="total-info">
                  <span className="total-label">Total:</span>
                  <span className="total-value">${calculateTotal()}</span>
                </div>
                {selectedEvent.availableTickets && selectedEvent.availableTickets < quantity && (
                  <div className="availability-warning" style={{
                    color: '#dc3545',
                    fontSize: '14px',
                    marginTop: '10px',
                    padding: '10px',
                    backgroundColor: '#f8d7da',
                    borderRadius: '5px'
                  }}>
                    ⚠️ Only {selectedEvent.availableTickets} tickets available
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2>Payment Details</h2>
            
            {error && (
              <div className="error-message" style={{
                color: '#dc3545',
                backgroundColor: '#f8d7da',
                border: '1px solid #f5c6cb',
                borderRadius: '4px',
                padding: '10px',
                marginBottom: '15px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}
            
            <input
              type="text"
              placeholder="Cardholder Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength="19"
              required
              disabled={loading}
            />
            <div className="card-details">
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                maxLength="5"
                required
                className="expiry-input"
                disabled={loading}
              />
              <input
                type="text"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                maxLength="3"
                required
                className="cvv-input"
                disabled={loading}
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Complete Purchase'}
            </button>
          </form>
        </div>
      ) : (
        <div className="no-event-selected">
          <h3>No Event Selected</h3>
          <p>Please select an event from the home page first.</p>
          <button onClick={() => navigate('/')} className="browse-events-btn">
            Browse Events
          </button>
        </div>
      )}
    </div>
  );
}