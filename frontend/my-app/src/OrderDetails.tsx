import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface OrderDetails {
  id: number;
  user_id: number;
  order_date: string;
  total_amount: number;
  status: string;
  items: { 
    product_name: string; 
    quantity: number; 
    price: number 
  }[];
}

const OrderDetails: React.FC = () => {
  const { userId, orderId } = useParams<{ userId: string; orderId: string }>();
  const [order, setOrder] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get(`http://127.0.0.1:8000/orders/${userId}/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setOrder(response.data);
        })
        .catch((error) => {
          console.error("Error fetching order details:", error);
        });
    } else {
      console.log("Token not found in localStorage");
    }
  }, [userId, orderId]);

  if (!order) {
    return <p>Loading order details...</p>;
  }

  return (
    <div className="container">
      <h2>Order Details</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Order #{order.id}</h5>
          <p><strong>Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> ${order.total_amount.toFixed(2)}</p>
          <p className={`card-text ${order.status === "pending" ? "text-warning" : "text-success"}`}>
            <strong>Status:</strong> {order.status}
          </p>
          <h5>Order Items</h5>
          <ul className="list-group">
            {order.items.map((item, index) => (
              <li key={index} className="list-group-item">
                <strong>{item.product_name}</strong> - {item.quantity} x ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
