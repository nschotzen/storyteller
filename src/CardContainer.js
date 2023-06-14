// CardContainer.js
import React, { useEffect, useState } from 'react';
import Card from './Card';
import './CardContainer.css'; // Import the CSS

const SERVER = 'http://localhost:5001';

const CardContainer = () => {
  const [cards, setCards] = useState([]);

  const getCards = async (n = 4) => {
    try {
      const response = await fetch(`${SERVER}/api/cards?n=${n}`);
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      const data = await response.json();
      setCards(cards => data);  // Append new data to existing cards
    } catch (error) {
      console.error('Fetch failed:', error.message);
    }
  }

  useEffect(() => {
    getCards();  // Fetch cards when component mounts
  }, []);

  // Your event or condition for fetching more cards
  // const endOfTurn = () => {
  //   // Fetch more cards at the end of a turn
  //   getCards();
  // };

  return (
    <div className="card-container">
      <div className="card-wrapper">
        {cards.map((cardData, index) => (
          <Card
            key={index}
            url={cardData.url}
            fontSize={cardData.fontSize}
            title={cardData.title}
            fontName={cardData.fontName}
            fontColor={cardData.fontColor}
          />
        ))}
      </div>
      {/* <button onClick={endOfTurn}>End Turn</button> */}
    </div>
  );

};

export default CardContainer;
