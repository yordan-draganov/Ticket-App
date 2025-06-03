import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiService";
import "../css/Home.css";
import SearchBar from "./SearchBar";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEventsAndCategories();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchEvents();
    }, 300); 

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedCategory]);

  const fetchEventsAndCategories = async () => {
    try {
      setLoading(true);
      const [eventsData, categoriesData] = await Promise.all([
        apiService.getEvents(),
        apiService.getCategories()
      ]);
      
      setEvents(eventsData);
      setCategories(['all', ...categoriesData]);
      setError("");
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const eventsData = await apiService.getEvents(searchTerm, selectedCategory);
      setEvents(eventsData);
      setError("");
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setError('Failed to load events. Please try again later.');
    }
  };

  const handleBuyTicket = (eventId) => {
    const selectedEvent = events.find(event => event.id === eventId);
    if (selectedEvent) {
      sessionStorage.setItem('selectedEvent', JSON.stringify(selectedEvent));
      navigate('/checkout');
    }
  };

  const handleViewDetails = (eventId) => {
    navigate(`/event/${eventId}`);
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
        <p>Loading events...</p>
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
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <button 
          onClick={fetchEventsAndCategories}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
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
    <div className="container">
      <h1 className="heading">Discover Amazing Events</h1>
      
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      {/* Category Filter */}
      <div className="category-filter" style={{
        margin: '20px 0',
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '20px',
              backgroundColor: selectedCategory === category ? '#007bff' : 'white',
              color: selectedCategory === category ? 'white' : '#333',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {category}
          </button>
        ))}
      </div>
      
      {events.length === 0 ? (
        <div className="no-results">
          <h3>No events found</h3>
          <p>
            {searchTerm || selectedCategory !== 'all' 
              ? `No events match your current filters. Try adjusting your search terms or category.`
              : 'No events available at the moment. Please check back later.'
            }
          </p>
          {(searchTerm || selectedCategory !== 'all') && (
            <button 
              className="clear-search" 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="event-grid">
          {events.map((event) => (
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
                <div className="event-buttons" style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    className="view-details-button"
                    onClick={() => handleViewDetails(event.id)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    View Details
                  </button>
                  <button 
                    className="buy-button"
                    onClick={() => handleBuyTicket(event.id)}
                  >
                    Buy Ticket 🎫
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}