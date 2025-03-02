import React from 'react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ service }) => {
  const { title, description, icon, path } = service;
  
  return (
    <div className="service-card">
      <div className="service-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <Link to={path} className="btn btn-primary">
        Get Started
      </Link>
    </div>
  );
};

export default ServiceCard; 