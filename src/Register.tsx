import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

// Define the types for the form data
interface FormData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });

  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({}); // For field-specific errors
  const [success, setSuccess] = useState<string>('');

  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate if the passwords match
    if (formData.password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Make sure to send the formData object directly as JSON
      const response = await axios.post(
        'http://127.0.0.1:8000/register',
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Handle successful registration
      setSuccess('Registration successful!');
      setFieldErrors({}); // Clear field-specific errors on success
      console.log('Response:', response.data);
      setTimeout(() => {
        navigate('/login'); // Redirect to login page
      }, 2000); // Delay to show success message before redirecting
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        // Reset field errors
        setFieldErrors({});
        if (err.response && err.response.data) {
          const errorData = err.response.data;

          // Check for specific validation errors in the response
          if (errorData.username) {
            setFieldErrors((prevErrors) => ({ ...prevErrors, username: errorData.username[0] }));
          }
          if (errorData.email) {
            setFieldErrors((prevErrors) => ({ ...prevErrors, email: errorData.email[0] }));
          }
          if (errorData.password) {
            setFieldErrors((prevErrors) => ({ ...prevErrors, password: errorData.password[0] }));
          }
          if (errorData.first_name) {
            setFieldErrors((prevErrors) => ({ ...prevErrors, first_name: errorData.first_name[0] }));
          }
          if (errorData.last_name) {
            setFieldErrors((prevErrors) => ({ ...prevErrors, last_name: errorData.last_name[0] }));
          }
        } else {
          setError('An unexpected error occurred.');
        }
        console.error('Error:', err.response ? err.response.data : err);
      } else {
        setError('An unexpected error occurred.');
        console.error('Unexpected Error:', err);
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {/* Display error for username if exists */}
          {fieldErrors.username && <div style={{ color: 'red' }}>{fieldErrors.username}</div>}
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {/* Display error for email if exists */}
          {fieldErrors.email && <div style={{ color: 'red' }}>{fieldErrors.email}</div>}
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {/* Display error for password if exists */}
          {fieldErrors.password && <div style={{ color: 'red' }}>{fieldErrors.password}</div>}
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
        </div>

        <div>
          <label htmlFor="first_name">First Name:</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          {/* Display error for first name if exists */}
          {fieldErrors.first_name && <div style={{ color: 'red' }}>{fieldErrors.first_name}</div>}
        </div>

        <div>
          <label htmlFor="last_name">Last Name:</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          {/* Display error for last name if exists */}
          {fieldErrors.last_name && <div style={{ color: 'red' }}>{fieldErrors.last_name}</div>}
        </div>

        {/* Display general error if applicable */}
        {error && <div style={{ color: 'red' }}>{error}</div>}

        {/* Display success message after successful registration */}
        {success && <div style={{ color: 'green' }}>{success}</div>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
