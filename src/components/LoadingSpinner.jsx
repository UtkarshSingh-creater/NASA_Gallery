import React from 'react';
import './LoadingSpinner.css'; 

const LoadingSpinner = ({ text = 'Loading data...' }) => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>{text}</p>
  </div>
);

export default LoadingSpinner;