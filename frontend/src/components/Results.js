// src/components/Results.js
import React, { useState } from 'react';
import './Results.css';

const Results = ({ data }) => {
  const [activeTab, setActiveTab] = useState('summary');

  // Eğer data (sonuçlar) henüz yoksa, bu bileşen hiç görünmesin.
  if (!data) return null;

  // Her sekmenin içeriğini render edecek fonksiyonlar
  const renderSummary = () => (
    <div className="summary-content">
      <h3>Metin Özeti</h3>
      <p>{data.summary?.summary_text || "Özet bulunamadı."}</p>
    </div>
  );

  const renderSentiment = () => {
    const sentiment = data.sentiment;
    if (!sentiment) return <p>Duygu analizi sonucu bulunamadı.</p>;
    const emoji = sentiment.label === 'positive' ? '😊' : sentiment.label === 'negative' ? '😞' : '😐';
    return (
      <div className="sentiment-content">
        <h3>Duygu Analizi</h3>
        <div className="sentiment-result">
            <span className="sentiment-emoji">{emoji}</span>
            <span className="sentiment-label">{sentiment.label.toUpperCase()}</span>
            <span className="sentiment-score">({(sentiment.score * 100).toFixed(2)}% güvenle)</span>
        </div>
      </div>
    );
  };

  const renderNer = () => (
    <div className="ner-content">
      <h3>Tanınan Varlıklar</h3>
      {data.ner?.entities.length > 0 ? (
        <ul>
          {data.ner.entities.map((entity, index) => (
            <li key={index} className={`entity-chip ${entity.entity_group}`}>
              <strong>{entity.word}</strong> ({entity.entity_group})
            </li>
          ))}
        </ul>
      ) : <p>Metinde tanınabilir bir varlık bulunamadı.</p>}
    </div>
  );

  return (
    <div className="results-container">
      <div className="tabs">
        <button className={activeTab === 'summary' ? 'active' : ''} onClick={() => setActiveTab('summary')}>Özet</button>
        <button className={activeTab === 'sentiment' ? 'active' : ''} onClick={() => setActiveTab('sentiment')}>Duygu Analizi</button>
        <button className={activeTab === 'ner' ? 'active' : ''} onClick={() => setActiveTab('ner')}>Varlık Tanıma</button>
      </div>
      <div className="tab-content">
        {activeTab === 'summary' && renderSummary()}
        {activeTab === 'sentiment' && renderSentiment()}
        {activeTab === 'ner' && renderNer()}
      </div>
    </div>
  );
};

export default Results;