import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface CartProps {
  cart: { [key: string]: number };
  setCart: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
}

const Cart: React.FC<CartProps> = ({ cart, setCart }) => {
  const [productsDetails, setProductsDetails] = useState<{ [key: string]: { name: string; price: number } }>({});

  // Function to handle the removal of an item from the cart
  const handleRemoveFromCart = (productId: string) => {
    const newCart = { ...cart };
    delete newCart[productId];
    setCart(newCart);
  };

  // Function to adjust the quantity
  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId); // Remove from cart if quantity is 0
    } else {
      setCart((prevCart) => ({
        ...prevCart,
        [productId]: quantity,
      }));
    }
  };

  // Fetch product details by productId
  const fetchProductDetails = async (productId: string) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/products/${productId}`);
      const productData = response.data;
      setProductsDetails((prevDetails) => ({
        ...prevDetails,
        [productId]: {
          name: productData.name,
          price: productData.price,
        },
      }));
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  // Fetch details for all products in the cart
  useEffect(() => {
    Object.keys(cart).forEach((productId) => {
      if (!productsDetails[productId]) {
        fetchProductDetails(productId);
      }
    });
  }, [cart, productsDetails]);

  return (
    <div className="cart-container mt-5">
      <h3>Your Cart</h3>
      {Object.entries(cart).length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {Object.entries(cart).map(([productId, quantity]) => {
            const product = productsDetails[productId]; // Get product details from the state

            // If product details are not fetched yet, skip rendering it
            if (!product) return <div key={productId}>Loading...</div>;

            return (
              <div key={productId} className="cart-item d-flex align-items-center mb-3">
                <div className="cart-item-details me-3">
                  <h5>{product.name}</h5>
                  <p>Price: ${product.price}</p>
                </div>
                <div className="cart-item-quantity d-flex align-items-center">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => handleQuantityChange(productId, quantity - 1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="form-control w-25 mx-2"
                    value={quantity}
                    min="0"
                    onChange={(e) => handleQuantityChange(productId, parseInt(e.target.value, 10))}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => handleQuantityChange(productId, quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="btn btn-danger ms-3"
                  onClick={() => handleRemoveFromCart(productId)}
                >
                  Remove from Cart
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Cart;
