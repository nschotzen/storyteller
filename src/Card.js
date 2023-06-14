// Card.js
import React, { useState } from 'react';
import './Card.css'; // Import the CSS

const Card = ({ url, title, fontName, fontSize, fontColor }) => {
  const [isFlipped, setIsFlipped] = useState(true); // initial state is false to show the front side of the card

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  function splitCamelCaseText(input) {
    return input
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, function(str){ return str.toUpperCase(); })
  }


  return (
    <div
      className={`card${isFlipped ? ' flipped' : ''}`}
      onClick={handleFlip}
    >
      <div className="card-inner">
        <div className="card-face card-front">
          {/* The front of the card can be left blank or display some static content */}
          <div className="card-front-content">
            {/* Static content goes here */}
          </div>
        </div>
        <div className="card-face card-back" style={{backgroundImage: `url(http://localhost:5001${url})`}}>
          <div className="card-back-title" style={{color: fontColor, fontFamily: fontName, fontSize: fontSize}}>
            {splitCamelCaseText(title)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
