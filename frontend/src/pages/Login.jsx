import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-center text-primary-600">CampusTrade</h2>
        <p className="text-center text-gray-500">Log in to your student account</p>

        {error && <div className="p-3 text-sm text-red-600 bg-red-100 rounded">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">University Email</label>
            <input
              type="email"
              required
              placeholder="student@adityauniversity.in"
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white transition-colors bg-primary-600 rounded-md hover:bg-primary-700"
          >
            Sign In
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Don't have an account? <span onClick={() => navigate('/register')} className="cursor-pointer text-primary-600 hover:text-primary-500">Register</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
