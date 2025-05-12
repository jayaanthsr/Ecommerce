import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import axios from 'axios';
import '../../styles/Login.css'

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
      localStorage.setItem('userRole', response.data.role);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('email', response.data.email);
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
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon-wrapper">
              <Lock size={20} />
            </div>
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Sign in to your account</p>
          </div>

          {error && (
              <div className="login-error">
                {error}
              </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label className="login-label">
                Username
              </label>
              <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="login-input"
                  placeholder="Enter your username"
                  required
              />
            </div>

            <div className="login-form-group">
              <label className="login-label">
                Password
              </label>
              <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="login-input"
                  placeholder="Enter your password"
                  required
              />
            </div>

            <button
                type="submit"
                className="login-button"
            >
              Sign In
            </button>
          </form>

          <div className="login-footer">
            Don't have an account?{' '}
            <span
                onClick={() => navigate('/register')}
                className="login-link"
            >
            Register
          </span>
          </div>
        </div>
      </div>
  );
};

export default Login;