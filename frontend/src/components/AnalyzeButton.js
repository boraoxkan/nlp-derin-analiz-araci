// src/components/AnalyzeButton.js
import React from 'react';
import './AnalyzeButton.css';

const AnalyzeButton = ({ onClick, isLoading }) => {
  return (
    <button 
      className="analyze-button" 
      onClick={onClick} 
      disabled={isLoading}
    >
      {isLoading ? 'Analiz Ediliyor...' : 'Analiz Et'}
    </button>
  );
};

export default AnalyzeButton;