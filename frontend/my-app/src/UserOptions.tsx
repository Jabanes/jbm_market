import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserOptions: React.FC = () => {
  const navigate = useNavigate();

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove the token from localStorage
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div>
      <h1>Welcome to Your Dashboard</h1>
      <button onClick={() => navigate('/my-cart')}>My Cart</button>
      <button onClick={() => navigate('/my-orders')}>My Orders</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UserOptions;
