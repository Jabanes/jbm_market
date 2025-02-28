import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App'; // Main App Component
import Home from './Home'; // Home Component
import Login from './Login'; // Login Component
import Register from './Register'; // Register Component
import UserOptions from './UserOptions'; // UserOptions Component

// Create a root element to render your app
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Home />} />

        {/* Main app route with nested routes */}
        <Route path="/app" element={<App />}>
          {/* Nested routes for login, register, and user options */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="user-options" element={<UserOptions />} />
        </Route>

        {/* Fallback route for undefined paths */}
        <Route
          path="*"
          element={
            <main style={{ padding: '1rem' }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
    </Router>
  </React.StrictMode>
);
