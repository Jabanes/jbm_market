import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Product } from './models/Product';
import { Category } from './models/Category';

const UserOption: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [first_name, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const { categoryName } = useParams();  // Capture the category from the URL

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUsername(decodedToken.username);
      setFirstName(decodedToken.first_name);

      axios.get('http://127.0.0.1:8000/products', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));

      axios.get('http://127.0.0.1:8000/categories', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
    } else {
      console.log('Token not found in localStorage');
    }
  }, []);

  // Filter products by category
  const filteredProducts = categoryName
    ? products.filter(product => product.category === categoryName)
    : products;

  return (
    <div className="container">
      <h2>Welcome back, {first_name || username}</h2>

      {/* Category Links */}
      <div className="mb-3">
        <Link to="/user-options" className="btn btn-secondary me-2">All</Link>
        {categories.map(cat => (
          <Link
            key={cat.id}
            to={`/category/${cat.name}`}  // Pass category name in the URL path
            className="btn btn-primary me-2"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="row">
        {filteredProducts.length === 0 ? (
          <p>No products available</p>
        ) : (
          filteredProducts.map(product => (
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
};

export default UserOption;
