const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
        ...options
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async login(email, password) {
    const response = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async signup(email, password, name) {
    const response = await this.makeRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    });
    
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async verifyToken() {
    try {
      const response = await this.makeRequest('/auth/verify');
      return response;
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  async getEvents(search = '', category = '') {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category && category !== 'all') params.append('category', category);
    
    const query = params.toString();
    return await this.makeRequest(`/events${query ? `?${query}` : ''}`);
  }

  async getEvent(id) {
    return await this.makeRequest(`/events/${id}`);
  }

  async getCategories() {
    return await this.makeRequest('/categories');
  }

  async purchaseTickets(eventId, quantity, paymentDetails) {
    return await this.makeRequest('/tickets/purchase', {
      method: 'POST',
      body: JSON.stringify({ eventId, quantity, paymentDetails })
    });
  }

  async getMyTickets() {
    return await this.makeRequest('/tickets/my-tickets');
  }

  async getTicket(ticketId) {
    return await this.makeRequest(`/tickets/${ticketId}`);
  }

  async healthCheck() {
    return await this.makeRequest('/health');
  }

  isLoggedIn() {
    return !!localStorage.getItem('authToken');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

export default new ApiService();