// Card.js
import React, { useState } from 'react';
import './Card.css'; // Import the CSS

const Card = ({ id, url, title, fontName, fontSize, fontColor, selected, selectCard, setSelectedCard }) => {
  const [isFlipped, setIsFlipped] = useState(true); // initial state is false to show the front side of the card

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSelect = () => {
    setSelectedCard(id);
  };


  const handleClick = (e) => {
    e.stopPropagation();  // prevent the flip action when clicking to select a card
    selectCard(id);
  }

  function splitCamelCaseText(input) {
    return input
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, function (str) { return str.toUpperCase(); })
  }

  return (
    <div
      className={`card${isFlipped ? ' flipped' : ''}${selected ? ' selected' : ''}`}
      onClick={handleSelect}
      onDoubleClick={handleClick} // double click to select a card
    >
      <div className="card-inner">
        <div className="card-face card-front">
          {/* The front of the card can be left blank or display some static content */}
          <div className="card-front-content">
            {/* Static content goes here */}
          </div>
        </div>
        <div className="card-face card-back">
          <div className="card-image" style={{ backgroundImage: `url(http://localhost:5001${url})` }}></div>
          {/* <div className="card-image" style={{ backgroundImage: `url(${url})` }}></div> */}

          <div className="card-back-title" style={{ color: fontColor, fontFamily: fontName, fontSize: fontSize }}>
            {splitCamelCaseText(title)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
