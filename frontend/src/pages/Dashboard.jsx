import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get('/items');
        setItems(res.data.data);
      } catch (err) {
        console.error('Error fetching items', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold text-primary-600">CampusTrade</h1>
          <div className="hidden space-x-4 md:flex">
            <a href="#" className="font-medium text-gray-600 hover:text-primary-600">Explore</a>
            <a href="#" className="font-medium text-gray-600 hover:text-primary-600">My Listings</a>
            <a href="#" className="font-medium text-gray-600 hover:text-primary-600">My Bookings</a>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 text-sm font-medium text-white rounded bg-primary-600 hover:bg-primary-700">List an Item</button>
          <button onClick={handleLogout} className="text-sm font-medium text-gray-500 hover:text-gray-700">Log out</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-6 py-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-secondary">Available on Campus</h2>
          <div className="relative">
            <input type="text" placeholder="Search textbooks, tech..." className="px-4 py-2 border rounded-md shadow-sm w-72 focus:ring-primary-500 focus:border-primary-500" />
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading items...</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map(item => (
              <div key={item._id} className="overflow-hidden bg-white border border-gray-100 rounded-lg shadow-sm group hover:shadow-md">
                <div className="flex items-center justify-center w-full h-48 bg-gray-100">
                  {item.image_urls && item.image_urls.length > 0 ? (
                    <img src={item.image_urls[0]} alt={item.title} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-secondary line-clamp-1">{item.title}</h3>
                    <span className="font-bold text-primary-600">${item.daily_price}/d</span>
                  </div>
                  <p className="mb-4 text-sm text-gray-500 line-clamp-2">{item.description}</p>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-400">{item.accepts_barter ? 'Barter OK' : 'Fiat Only'}</span>
                    <button onClick={() => navigate(`/checkout/${item._id}`)} className="px-3 py-1.5 text-sm font-medium transition-colors border rounded border-primary-600 text-primary-600 hover:bg-primary-50">Rent Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
