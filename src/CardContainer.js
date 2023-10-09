import React, { useEffect, useState } from 'react';
import Card from './Card';
import Chat from './Chat';
import TextArea from './TextArea';
import './CardContainer.css'; 
import './SendButton.css';

const SERVER = 'http://localhost:5001';

const CardContainer = () => {
  const [cards, setCards] = useState([]);
  const [prefixes, setPrefixes] = useState([]);
  const [selectedPrefix, setSelectedPrefix] = useState("");
  const [userText, setUserText] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  const [fontNames, setFontNames] = useState([]);

  const useGoogleFont = (fontNames) => {
    useEffect(() => {
      fontNames.forEach(fontName => {
        if (fontName) {
          const link = document.createElement('link');
          link.href = `https://fonts.googleapis.com/css?family=${fontName.replace(' ', '+')}&display=swap`;
          link.rel = 'stylesheet';
          document.head.appendChild(link);
        }
      });
    }, [fontNames]);
  };





  const getCards = async (n = 3) => {
    try {
      const response = await fetch(`${SERVER}/api/cards?n=${n}`);
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      const data = await response.json();
      setCards(cards => data);  
    } catch (error) {
      console.error('Fetch failed:', error.message);
    }
  };

  const concludeScene = async () => {
    if (isLoading) return;  // Avoid sending multiple requests at the same time

    setLoading(true);
    setError(null);

    try {
        const response = await fetch(`${SERVER}/api/generateTextures`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userText, selectedCard })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        
        const data = await response.json();
        setCards(data.cards);
        // Handle the response data here (update state or perform other actions)

    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
};


  // Add this function
  const getPrefixes = async (n = 10) => {
    try {
      const response = await fetch(`${SERVER}/api/prefixes?n=${n}`);
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      console.log('RETURNED')
      const data = await response.json();
      console.log(`DATA ${data}`)
      setPrefixes(data);
    } catch (error) {
      console.error('Fetch failed:', error.message);
    }
  };

  const sendText = async (textureId = null) => {
    if (isLoading) return; // Avoid sending multiple requests at the same time

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${SERVER}/api/storytelling`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userText, textureId })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const {prefixes} = await response.json();
      console.log('DATA:', prefixes);
      setPrefixes(prefixes);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCards();  
    getPrefixes();
  }, []);

  useEffect(() => {
    // Extract unique font names from the cards
    const uniqueFontNames = [...new Set(cards.map(card => card.fontName))];
    setFontNames(uniqueFontNames);
  }, [cards]);

  // Call the useGoogleFont hook with the array of font names
  useGoogleFont(fontNames);

  
  return (
    <div className="card-container">
      <div className="card-wrapper">
        {cards.map((cardData, index) => (
          <Card
            id={cardData.id}
            key={index}
            url={cardData.url}
            fontSize={cardData.fontSize}
            title={cardData.title}
            fontName={cardData.fontName}
            fontColor={cardData.fontColor}
            selected={cardData.id === selectedCard}
            setSelectedCard={setSelectedCard}
            style={{ "--animation-order": index }}
          />
        ))}
      </div>
      <div className="prefix-container">
        {prefixes.map((prefix, index) => (
          <button
            className="prefix"
            key={index}
            onClick={() => {
              setSelectedPrefix(prefix);
              setUserText(prefix);
            }}
          >
            {prefix}
          </button>
        ))}
      </div>
      <TextArea className="send-button" text={userText} setText={setUserText} />
      <Chat fragmentText={userText} />
      <button onClick={() => sendText(selectedCard)} disabled={isLoading || !userText.trim()}>
        {isLoading ? 'Sending...' : 'Send'}
      </button>
      <button onClick={concludeScene} disabled={isLoading || !userText.trim()}>
    {isLoading ? 'Processing...' : 'Conclude Scene'}
      </button>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default CardContainer;

