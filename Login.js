import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is already logged in, redirect to the dashboard
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error message

    // Log email and password values before sending request
    console.log('Logging in with:', email, password);

    try {
      // Send login request to backend
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const { token, user } = res.data; // Extract token and user from response
      console.log('Login successful, received token:', token); // Debugging line
      console.log('User data:', user); // Debugging line

      localStorage.setItem('token', token); // Store token in localStorage
      login(token, user); // Use context's login method to store token and user in context
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (err) {
      console.error('Error during login:', err); // Log detailed error
      setError('Invalid email or password'); // Display error message
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3584/3584670.png"
          alt="Login Banner"
          className="login-image"
        />
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        {/* Display error message if login fails */}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
