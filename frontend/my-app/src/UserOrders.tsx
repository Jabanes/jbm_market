import React, { useEffect, useState } from "react";
import axios from "axios";

interface Order {
  id: number;
  user_id: number;
  order_date: string;
  total_amount: number;
  status: string;
}

interface OrderDetails {
  order_id: number;
  user_id: number;
  order_date: string;
  items: { product_name: string; quantity: number; price_per_unit: number; total_product_amount: number }[];
  status: string;
}

const UserOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userId = decodedToken.user_id;
        
        

        axios
          .get(`http://127.0.0.1:8000/orders/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => setOrders(response.data))
          .catch((error) => console.error("Error fetching orders:", error));
      } catch (error) {
        console.error("Invalid token format:", error);
      }
    } else {
      console.log("Token not found in localStorage");
    }
  }, []);

  const viewOrderDetails = (orderId: number) => {
    const token = localStorage.getItem("token");
    const userId = orders.find((order) => order.id === orderId)?.user_id;

    if (token && userId) {
      axios
        .get(`http://127.0.0.1:8000/orders/${userId}/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("Order Details Response:", response.data); // Log the response to check the data
          setSelectedOrder(response.data);
        })
        .catch((error) => console.error("Error fetching order details:", error));
    }
  };

  const formatAmount = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return "$0"; // Handle undefined or null amounts
    const validAmount = Number(amount); // Ensure it's a number
    if (isNaN(validAmount)) return "$0"; // Return $0 if it's invalid
    return `$${Math.round(validAmount)}`; // Use Math.round or any other rounding method if needed
  };

  return (
    <div className="container">
      <h2>Your Orders</h2>
      <div className="row">
        {selectedOrder ? (
          <div className="col-md-6 mx-auto">
            <div className="card">
              <div className="card-body">
                <button className="btn btn-light mb-2" onClick={() => setSelectedOrder(null)}>
                  ← Back to Orders
                </button>
                <h5 className="card-title">Order #{selectedOrder.order_id}</h5>
                <p><strong>Date:</strong> {new Date(selectedOrder.order_date).toLocaleDateString()}</p>
                <p><strong>Total:</strong> {formatAmount(selectedOrder.items.reduce((total, item) => total + item.total_product_amount, 0))}</p>
                <h5>Order Items</h5>
                <ul className="list-group">
                  {selectedOrder.items.map((item, index) => (
                    <li key={index} className="list-group-item">
                      <strong>{item.product_name}</strong> {formatAmount(item.price_per_unit)} x {item.quantity} = {formatAmount(item.total_product_amount)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          orders.length === 0 ? (
            <p>No orders available</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="col-md-4">
                <div className="card mb-3" style={{ width: "18rem" }}>
                  <div className="card-body">
                    <h5 className="card-title">Order #{order.id}</h5>
                    <p>Date: {new Date(order.order_date).toLocaleDateString()}</p>
                    <p>Total: {formatAmount(order.total_amount)}</p>
                    <p className={`card-text ${order.status === "pending" ? "text-warning" : "text-success"}`}>
                      Status: {order.status}
                    </p>
                    <button className="btn btn-primary" onClick={() => viewOrderDetails(order.id)}>
                      View Order
                    </button>
                  </div>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};

export default UserOrders;
