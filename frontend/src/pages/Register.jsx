import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { name, email, password });
      setSuccess(res.data.message || 'OTP sent to email. Please verify.');
      setOtpSent(true);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/verify', { email, otp });
      setSuccess('Verification successful! You can now log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-center text-primary-600">CampusTrade</h2>
        <p className="text-center text-gray-500">Create a student account</p>

        {error && <div className="p-3 text-sm text-red-600 bg-red-100 rounded">{error}</div>}
        {success && <div className="p-3 text-sm text-green-600 bg-green-100 rounded">{success}</div>}

        {!otpSent ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" required className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">University Email</label>
              <input type="email" required placeholder="student@adityauniversity.in" className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" required className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <button type="submit" className="w-full px-4 py-2 font-medium text-white transition-colors bg-primary-600 rounded-md hover:bg-primary-700">Create Account</button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <input type="text" required placeholder="123456" className="w-full px-3 py-2 mt-1 tracking-widest text-center border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength="6" />
            </div>
            <button type="submit" className="w-full px-4 py-2 font-medium text-white transition-colors bg-primary-600 rounded-md hover:bg-primary-700">Verify Email</button>
          </form>
        )}

        <p className="text-sm text-center text-gray-600">
          Already have an account? <span onClick={() => navigate('/login')} className="cursor-pointer text-primary-600 hover:text-primary-500">Log in</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
