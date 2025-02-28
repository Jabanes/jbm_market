import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar"; // Import the Navbar component
import "bootstrap/dist/css/bootstrap.min.css";

const App: React.FC = () => {
  return (
    <div>
      <Navbar /> {/* Render Navbar at the top */}
      <div className="container mt-4">
        <Outlet /> {/* Render child routes here */}
      </div>
    </div>
  );
};

export default App;
