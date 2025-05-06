import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import axios from 'axios';

const Login = ({ setIsAuthenticated, setUserRole }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', formData);
      localStorage.setItem('userRole', formData.username==='admin' ? 'admin' : 'user' );
      localStorage.setItem('username', response.data.username);
      setIsAuthenticated(true);
      setUserRole(response.data.role);
      
      if (response.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-blue-100 text-blue-600 mb-4">
            <Lock size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-blue-600 hover:text-blue-800"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;