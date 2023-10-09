import React, { useState, useEffect } from 'react'; // <-- Import useEffect
import './Chat.css';

function Chat({ fragmentText }) {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {  // <-- Moved useEffect inside the Chat component
    // Generate a random sessionId when the component mounts.
    setSessionId(Math.random().toString(36).substring(2, 15));
  }, []);

  const handleSendMessage = async () => {
    const masterName = "YourMasterName"; // Replace with the desired master name
    // const response = await fetch(`http://localhost:5001/chatWithMaster?masterName=${masterName}&userInput=${userInput}&sessionId=${sessionId}`);
    const response = await fetch(`http://localhost:5001/chatWithMaster?masterName=${masterName}&userInput=${userInput}&sessionId=${sessionId}&fragmentText=${fragmentText}`);

    const data = await response.json();

    // Add user message and response to messages
    setMessages(prevMessages => [...prevMessages, { sender: 'user', text: userInput }, { sender: 'master', text: data.text }]);

    // Clear user input
    setUserInput('');
  };

  //   const handleSendMessage = () => {
//     const masterName = "YourMasterName"; // Replace with the desired master name
    
//     // Mocked response
//     const mockedResponse = {
//       text: `Hello, ${masterName}. I got your message: "${userInput}"!`
//     };

//     // Add user message and mocked response to messages
//     setMessages(prevMessages => [...prevMessages, { sender: 'user', text: userInput }, { sender: 'master', text: mockedResponse.text }]);

//     // Clear user input
//     setUserInput('');
// };




  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input value={userInput} onChange={e => setUserInput(e.target.value)} placeholder="Type your message..." />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
