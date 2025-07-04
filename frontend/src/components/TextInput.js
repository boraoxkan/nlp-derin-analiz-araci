// src/components/TextInput.js
import React from 'react';
import './TextInput.css'; // Stil dosyasını birazdan oluşturacağız

const TextInput = ({ value, onChange }) => {
  return (
    <textarea
      className="text-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Analiz edilecek metni buraya yapıştırın..."
    />
  );
};

export default TextInput;