import React from 'react';
const ErrorMessage = ({ message }) => (
  <div style={{
    padding: '20px',
    margin: '20px auto',
    maxWidth: '600px',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fca5a5',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '1.1rem',
  }}>
    🚨 Error: {message}
  </div>
);
export default ErrorMessage;