import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";
import SearchBar from "./SearchBar";

const events = [
  {
    id: 1,
    title: "Summer Music Festival",
    date: "June 21, 2025",
    location: "Central Park, NYC",
    description: "A full-day event with live performances by top artists.",
    price: "$49.99",
    category: "Music",
    image: "/api/placeholder/300/180"
  },
  {
    id: 2,
    title: "Tech Innovators Conference",
    date: "July 10, 2025",
    location: "San Francisco, CA",
    description: "Meet industry leaders and explore the future of tech.",
    price: "$199.00",
    category: "Technology",
    image: "/api/placeholder/300/180"
  },
  {
    id: 3,
    title: "Food & Wine Expo",
    date: "August 5, 2025",
    location: "Chicago, IL",
    description: "Taste gourmet dishes and world-class wines.",
    price: "$29.00",
    category: "Food",
    image: "/api/placeholder/300/180"
  },
  {
    id: 4,
    title: "Annual Comic Convention",
    date: "September 15, 2025",
    location: "Los Angeles, CA",
    description: "Celebrate comics, movies, and pop culture with fellow fans.",
    price: "$45.00",
    category: "Entertainment",
    image: "/api/placeholder/300/180"
  },
  {
    id: 5,
    title: "Marathon City Run",
    date: "October 10, 2025",
    location: "Boston, MA",
    description: "Join thousands of runners in this exciting city marathon.",
    price: "$75.00",
    category: "Sports",
    image: "/api/placeholder/300/180"
  }
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  // Filter events based on search term
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleBuyTicket = (eventId) => {
    // Store selected event in sessionStorage
    const selectedEvent = events.find(event => event.id === eventId);
    sessionStorage.setItem('selectedEvent', JSON.stringify(selectedEvent));
    navigate('/checkout');
  };
  
  return (
    <div className="container">
      <h1 className="heading">Discover Amazing Events</h1>
      
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      {filteredEvents.length === 0 ? (
        <div className="no-results">
          <h3>No events found matching "{searchTerm}"</h3>
          <p>Try adjusting your search terms or browse all events by clearing the search.</p>
          <button className="clear-search" onClick={() => setSearchTerm("")}>
            Clear Search
          </button>
        </div>
      ) : (
        <div className="event-grid">
          {filteredEvents.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-image">
                <img src={event.image} alt={event.title} />
                <span className="event-category">{event.category}</span>
              </div>
              <h2 className="event-title">{event.title}</h2>
              <p className="event-info">📅 {event.date}</p>
              <p className="event-info">📍 {event.location}</p>
              <p className="event-description">{event.description}</p>
              <div className="event-footer">
                <span className="event-price">{event.price}</span>
                <button 
                  className="buy-button"
                  onClick={() => handleBuyTicket(event.id)}
                >
                  Buy Ticket 🎫
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}