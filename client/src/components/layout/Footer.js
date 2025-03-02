import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} Hackathon. All rights reserved.</p>
        <p>Powered by AI to help you succeed</p>
      </div>
    </footer>
  );
};

export default Footer; 