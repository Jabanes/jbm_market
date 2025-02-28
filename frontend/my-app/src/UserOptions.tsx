// src/components/UserOption.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Product } from './models/Product';  // Import the updated Product model

const UserOption: React.FC = () => {
  // State to store products
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, fetch the products
    if (token) {
      axios
        .get('http://127.0.0.1:8000/products', {
          headers: {
            Authorization: `Bearer ${token}`,  // Use the token in Authorization header
            
          }
        })
        .then(response => {
          console.log(response.data);
          
          
          setProducts(response.data);  // Set products in state
        })
        .catch(error => {
          console.error('There was an error fetching the products!', error);
        });
    } else {
      console.log('Token not found in localStorage');
    }
  }, []); // Empty dependency array to run the effect once on mount

  return (
    <div className="container">
      <h2>User Options</h2>
      <div className="row">
        {products.length === 0 ? (
          <p>No products available</p>
        ) : (
          products.map(product => (
            <div key={product.id} className="col-md-4">
              <div className="card" style={{ width: '18rem' }}>
                <img src={product.image} className="card-img-top" alt={product.name} />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">Category: {product.category}</p>
                  <p className="card-text">Price: ${product.price}</p>
                  <p className="card-text">{parseInt(product.stock.toString(), 10)} Left!</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserOption;
