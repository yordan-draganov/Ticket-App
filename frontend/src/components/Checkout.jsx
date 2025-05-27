import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Checkout.css";

export default function Checkout() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve selected event from sessionStorage
    const eventData = sessionStorage.getItem('selectedEvent');
    if (eventData) {
      setSelectedEvent(JSON.parse(eventData));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Payment successful! Your tickets have been sent to your email.");
    // Clear the form and sessionStorage
    setCardNumber("");
    setExpiry("");
    setCvv("");
    setName("");
    sessionStorage.removeItem('selectedEvent');
    // Redirect to home page
    navigate('/');
  };

  const formatCardNumber = (value) => {
    // Format the card number with spaces every 4 digits
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
    // Format expiry date as MM/YY
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

  return (
    <div className="checkout-container">
      {selectedEvent ? (
        <div className="checkout-wrapper">
          <div className="event-summary">
            <h3>Order Summary</h3>
            <div className="event-info-checkout">
              <img 
                src={selectedEvent.image} 
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
                    >
                      -
                    </button>
                    <span className="quantity-value">{quantity}</span>
                    <button 
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="quantity-btn"
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
              </div>
            </div>
          </div>
          
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2>Payment Details</h2>
            <input
              type="text"
              placeholder="Cardholder Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength="19"
              required
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
              />
              <input
                type="text"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                maxLength="3"
                required
                className="cvv-input"
              />
            </div>
            <button type="submit">Complete Purchase</button>
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