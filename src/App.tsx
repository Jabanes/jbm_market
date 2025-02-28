import React from 'react';
import { Link, Outlet } from 'react-router-dom'; // Import Outlet to render nested routes

const App: React.FC = () => {
  return (
    <div>
      <nav>
        <Link to="/app/login">Login</Link> | 
        <Link to="/app/register">Register</Link> | 
        <Link to="/app/user-options">User Options</Link>
      </nav>

      {/* The Outlet component renders the matched nested route */}
      <Outlet />
    </div>
  );
};

export default App;
