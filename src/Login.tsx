import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/login', // Backend login endpoint
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Store the token in localStorage
      localStorage.setItem('authToken', response.data.token);

      // Display success message
      setSuccess('Login successful!');
      setError('');

      // Redirect to user options page after successful login
      setTimeout(() => {
        navigate('/user-options');
      }, 2000); // Delay to show success message before redirecting

    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError('Login failed. Please check your credentials.');
        console.error('Error:', err.response ? err.response.data : err);
      } else {
        setError('An unexpected error occurred.');
        console.error('Unexpected Error:', err);
      }
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'green' }}>{success}</div>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
