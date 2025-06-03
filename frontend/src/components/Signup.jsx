import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiService from "../services/apiService";
import "../css/Signup.css";

const SignupForm = ({ onSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiService.signup(email, password, name);
      
      onSignup();
      
      navigate('/');
    } catch (error) {
      console.error('Signup failed:', error);
      setError(error.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2 className="signup-text">Sign Up</h2>
        
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
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          minLength="6"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
        <p className="redirect-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;