import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/signup', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="form-container">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎫</div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.5rem'
          }}>EventHub Pro</h1>
          <p style={{ color: '#718096', fontSize: '0.95rem' }}>Create Organizer Account</p>
        </div>
        
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#2d3748' }}>Join as Organizer</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="organizer@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              minLength="6"
              required
            />
            <small style={{ color: '#718096', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>Password must be at least 6 characters</small>
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? '🔄 Creating Account...' : '🚀 Create Account'}
          </button>
        </form>
        <div className="text-link" style={{ marginTop: '1.5rem' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: '600' }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
