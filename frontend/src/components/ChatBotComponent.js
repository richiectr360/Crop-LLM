import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CropYieldGraph from './CropYieldGraph';
import CropSelector from './CropSelector';


function ChatBotComponent({ marker }) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { user: 'Bot', message: 'Hi! I am the Crop Yield Prediction Bot. Please select a crop to get started.'},
    { user: 'Bot', type: 'selector', message: 'Please select a crop.' }
  ]);
  const [graphData, setGraphData] = useState(null);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [crop, setCrop] = useState('');

  const [showPredictiveButton, setShowPredictiveButton] = useState(false);
  const [isAnalysisButtonPressed, setIsAnalysisButtonPressed] = useState(false);
  const [showResetButton, setShowResetButton] = useState(false);

  const resetCrop = () => {
    setCrop('');
    setChatHistory([{ user: 'Bot', message: 'Please select a crop.' }, { user: 'Bot', type: 'selector' }]);
    // setChatHistory([...chatHistory, { user: 'Bot', message: 'Please select a crop.' }, { user: 'Bot', type: 'selector' }]);
    setShowResetButton(false);
    setIsAnalysisButtonPressed(false);
  };


  const handleCropChange = e => {
    setCrop(e.target.value);
    setShowPredictiveButton(true);
  };
  
  const fetchPrediction = () => {
    setIsAnalysisButtonPressed(true);
    setIsBotTyping(true);
    setShowResetButton(true);
    fetch('/api/get-yield-graph', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        lat: marker.lat,
        lng: marker.lng,
        crop: crop
      })
    })
    .then(response => response.json())
    .then(data => {
        const transformedData = {
            labels: data.labels,
            datasets: [{
              label: 'Yield (in tons)',
              data: data.data,
              borderColor: ['#00796b'],
              backgroundColor: ['rgba(0, 121, 107, 0.1)'],
              pointBackgroundColor: data.data.map((_, index, array) => index === array.length - 1 ? 'red' : '#00796b'),
              pointBorderColor: data.data.map((_, index, array) => index === array.length - 1 ? 'red' : '#00796b'),
              pointBorderWidth: data.data.map((_, index, array) => index === array.length - 1 ? 3 : 1)
            }]
          };
      setIsBotTyping(false);
      setGraphData(transformedData);
      setChatHistory([...chatHistory, { user: 'You', message: `Selected crop: ${crop}` }, { user: 'Bot', message: 'Here is the predicted yield for the selected crop.' }, 
      { user: 'Bot', type: 'graph', graphData: transformedData }, { user: 'Bot', message: data.response}]);
      setShowPredictiveButton(false);
    })
    .catch(error => {
      console.error("Error fetching predictive analysis:", error);
      setIsBotTyping(false);
      setChatHistory([...chatHistory, { user: 'You', message: `Selected crop: ${crop}` }, { user: 'Bot', message: 'Sorry, an error occurred. Please try again later.' }]);
      setShowPredictiveButton(false);
    });
  };
  
  const handleKeyPress = (event) => {
    if(event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevents the default action of the Enter key
      sendMessage();
    }
  };

const sendMessage = () => {
    if (message.trim()) {
      setChatHistory([...chatHistory, { user: 'You', message: message.trim() }]);
      setMessage('');
  
      setIsBotTyping(true); // bot starts "typing"
  
      fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message.trim() }) // send user's message to the server
      })
      .then(response => response.json())
      .then(data => {
        setIsBotTyping(false); // bot finished "typing"
        setChatHistory(prevChatHistory => [...prevChatHistory, { user: 'Bot', message: data.response }]);
      })
      .catch(error => {
        setIsBotTyping(false);
        console.error('Error sending message:', error);
        setChatHistory(prevChatHistory => [...prevChatHistory, { user: 'Bot', message: 'Error communicating with the server.' }]);
      });
    }
  };
  
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  return (
    <Box display="flex" flexDirection="column" className="chatbot-container">
      <Box className="chat-history">
        {chatHistory.map((chat, index) => {
        if (chat.type === 'selector') {
            return (
            <div>
                <div key={index} className="bot-message bot-selector-message">
                    <CropSelector crop={crop} handleCropChange={handleCropChange} disabled={isAnalysisButtonPressed} />
                </div>
                {
                    showPredictiveButton && 
                    <Button className='button' onClick={fetchPrediction}>Get Predictive Analysis</Button>
                }

            </div>
            );
        }
        else if (chat.type === 'graph' && graphData) {
            return (
            <div key={index} className="bot-message bot-chart-message">
                <CropYieldGraph graphData={graphData} />
            </div>
            );
        } else {
            return (
            <div key={index} className={chat.user === 'You' ? 'user-message' : 'bot-message'}>
                <span>{chat.message}</span>
            </div>
            );
        }
        })}
        {isBotTyping && 
            <div className="bot-message">
            <div className="typing-indicator">
                <span></span><span></span><span></span>
            </div>
            </div>
        }
        <div ref={messagesEndRef}></div>
      </Box>
      {
        showResetButton && 
        <Button onClick={resetCrop} variant="outlined" className="reset-crop-button">Reset Crop</Button>
      }
      <Box display="flex">
        <TextField
          fullWidth
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress} 
          placeholder="Type your message..."
        />
        <Button onClick={sendMessage}> <SendIcon /> </Button>
      </Box>
    </Box>
  );
}

export default ChatBotComponent;

