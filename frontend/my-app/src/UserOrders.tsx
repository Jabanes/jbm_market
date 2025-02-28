import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Order {
  id: number;
  user_id: number;
  order_date: string;
  total_amount: number;
  status: string;
}

const UserOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode JWT to get user ID
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userId = decodedToken.user_id; // Ensure this matches the claim in your token
        console.log(userId);
        
        axios
          .get(`http://127.0.0.1:8000/orders/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            
            setOrders(response.data);
          })
          .catch((error) => {
            console.error("Error fetching orders:", error);
          });
      } catch (error) {
        console.error("Invalid token format:", error);
      }
    } else {
      console.log("Token not found in localStorage");
    }
  }, []);

  return (
    <div className="container">
      <h2>Your Orders</h2>
      <div className="row">
        {orders.length === 0 ? (
          <p>No orders available</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="col-md-4">
              <div className="card mb-3" style={{ width: "18rem" }}>
                <div className="card-body">
                  <h5 className="card-title">Order id: #{order.id}</h5>
                  <p className="card-text">Date: {new Date(order.order_date).toLocaleDateString()}</p>
                  <p className="card-text">Total: ${order.total_amount.toFixed(2)}</p>
                  <p className={`card-text ${order.status === "pending" ? "text-warning" : "text-success"}`}>
                    Status: {order.status}
                  </p>
                  <button className="btn btn-primary" onClick={() => navigate(`/orders/${order.id}`)}>
                    View Order
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserOrders;
