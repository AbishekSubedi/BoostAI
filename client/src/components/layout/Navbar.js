import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../services/firebase';

const Navbar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Hackathon
        </Link>
        
        <div className="navbar-menu">
          {currentUser ? (
            <>
              <Link to="/dashboard" className="navbar-item">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="navbar-item logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-item">
                Login
              </Link>
              <Link to="/register" className="navbar-item">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 