import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import UserOptions from './UserOptions';
import UserOrders from './UserOrders';
import OrderDetails from './OrderDetails';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login/>} />
        <Route path="register" element={<Register />} />
        <Route path="user-options" element={<UserOptions />} />
        <Route path="user-orders" element={<UserOrders />} />
        <Route path="order-details" element={<OrderDetails />} />
        <Route
          path="*"
          element={
            <main className="container text-center mt-5">
              <h2>404 - Page Not Found</h2>
            </main>
          }
        />
      </Route>
    </Routes>
  </Router>
);
