import React, { useEffect, useState } from 'react';
import Card from './Card';
import Chat from './Chat';
import TextArea from './TextArea';
import StoryFragmentComponent from './StoryFragment'
import './CardContainer.css'; 
import './SendButton.css';

const SERVER = 'http://localhost:5001';

const CardContainer = () => {
  const [cards, setCards] = useState([]);
  const [fade, setFade] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [prefixes, setPrefixes] = useState([]);
  const [selectedPrefix, setSelectedPrefix] = useState("");
  const [userText, setUserText] = useState("");
  const [timer, setTimer] = useState(null);

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [sessionId, setSessionId] = useState(Math.random().toString(36).substring(2, 15));
  const [selectedFragment, setSelectedFragment] = useState(null)
  const [previousFragment, setPreviousFragment] = useState("");

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

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${SERVER}/api/cards`);
        if (!response.ok) {
          throw new Error('HTTP error ' + response.status);
        }
        const data = await response.json();
        setCards(data);
      } catch (error) {
        console.error('Fetch failed:', error.message);
      }
    };

    fetchBooks();
  }, []);



useEffect(() => {
  const interval = setInterval(() => {
    setFade(true); // Start fade out
    setTimeout(() => {
      setFade(false); // Reset fade for next image
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
    }, 1000); // Change book after fade-out, time should match fade effect duration
  }, 10000); // Change book every 10 seconds

  return () => clearInterval(interval);
}, [cards, currentCardIndex]);



  const onSelectFragment = (fragment) => {
    setSelectedPrefix(fragment);

    const newText = previousFragment
      ? userText.replace(previousFragment, fragment)
      : userText + fragment;

    setUserText(newText);
    setPreviousFragment(fragment); // Update the previous fragment
    startTimer(30); // Start the timer
  };
  

  const onChangeInput = (event) => {
    setUserText(event.target.value);
    // Additional logic for input change
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

  const [textShadow, setTextShadow] = useState('');

  
  const getTextShadow = (time) => {
    if (time > 27) {
      return '0em 0em 0.12em rgba(0,0,0,0.75)'; // Least blur
    } else if (time > 24) {
      return '0em 0em 0.14em rgba(0,0,0,0.75)';
    } else if (time > 21) {
      return '0em 0em 0.16em rgba(0,0,0,0.75)';
    } else if (time > 18) {
      return '0em 0em 0.18em rgba(0,0,0,0.75)';
    } else if (time > 15) {
      return '0em 0em 0.20em rgba(0,0,0,0.75)';
    } else if (time > 12) {
      return '0em 0em 0.21em rgba(0,0,0,0.75)';
    } else if (time > 9) {
      return '0em 0em 0.22em rgba(0,0,0,0.75)';
    } else if (time > 6) {
      return '0em 0em 0.23em rgba(0,0,0,0.75)';
    } else if (time > 3) {
      return '0em 0em 0.24em rgba(0,0,0,0.75)';
    } else {
      return '0em 0em 0.25em rgba(0,0,0,0.75)'; // Most blur
    }
  };
  
  

const startTimer = (duration) => {
  setTimer(duration);
  setTextShadow(getTextShadow(duration)); // Set initial text shadow

  const countdown = setInterval(() => {
    setTimer((prevTime) => {
      if (prevTime === 1) {
        clearInterval(countdown);
        setTextShadow(''); // Clear the text shadow when the timer ends
        return null;
      }

      setTextShadow(getTextShadow(prevTime)); // Update text shadow based on remaining time
      return prevTime - 1;
    });
  }, 1000);
};

  
  const resetTimer = () => {
    clearInterval(timer); // Clear existing timer
    setTimer(null); // Reset timer state
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
            body: JSON.stringify({ userText, selectedCard, sessionId})
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
        body: JSON.stringify({ userText, textureId, sessionId })
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


  const loadGoogleFont = (fontName) => {
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css?family=${fontName.replace(' ', '+')}:400,700&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  };
  
  useEffect(() => {
    prefixes.forEach(prefix => {
      loadGoogleFont(prefix.fontName);
    });
  }, [prefixes]);
  
  console.log(JSON.stringify(prefixes)); 
  return (
    <div className="card-container">
      {cards.length > 0 && (
        <div className="book-image-container">
          <div
            className={`book-image fade-out`}
            style={{ backgroundImage: `url(${SERVER}${cards[currentCardIndex].url})` }}
          />
          <div
            className={`book-image fade-in`}
            style={{ backgroundImage: `url(${SERVER}${cards[(currentCardIndex + 1) % cards.length].url})` }}
          />
          <div className="overlay-content">
          {Array.isArray(prefixes) && (
          <>
            <div className="left-prefix-container">
              
            <StoryFragmentComponent
              fragments={prefixes.slice(0,3)}
              onSelectFragment={onSelectFragment}
              userInput={userText}
              onChangeInput={(e) => setUserText(e.target.value)}
              selectedFragment={selectedPrefix}
              resetTimer={resetTimer}
              textShadow={textShadow}
            />
            </div>
            <div className="right-prefix-container">
            <StoryFragmentComponent
              fragments={prefixes.slice(3)}
              onSelectFragment={onSelectFragment}
              userInput={userText}
              onChangeInput={(e) => setUserText(e.target.value)}
              selectedFragment={selectedPrefix}
              resetTimer={resetTimer}
              textShadow={textShadow}
            />
            </div>
            </>
        )}
            <div className="text-area-container">
              <TextArea className="text-area" text={userText} setText={setUserText} />
              <button className="send-button" onClick={() => sendText(selectedCard)} disabled={isLoading || !userText.trim()}>
                {isLoading ? 'Sending...' : 'Send'}
              </button>
              <button onClick={concludeScene} disabled={isLoading || !userText.trim()}>
                {isLoading ? 'Processing...' : 'Conclude Scene'}
            </button>
            </div>
          </div>
        </div>
      )}
  
      <Chat fragmentText={userText} sessionId={sessionId} />
      
      {error && <div className="error">{error}</div>}
    </div>
  );
  
  
  
};

export default CardContainer;

