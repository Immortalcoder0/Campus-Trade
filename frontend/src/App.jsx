import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BarterRoom from './pages/BarterRoom';

// A simple PrivateRoute constraint 
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-sans text-secondary">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

          <Route path="/barter/:id" element={
            <PrivateRoute>
              <BarterRoom />
            </PrivateRoute>
          } />

          {/* Fallback to Dashboard if authenticated, else Login */}
          <Route path="*" element={
            localStorage.getItem('token') ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
