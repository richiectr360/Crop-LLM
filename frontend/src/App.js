import React, { useState } from 'react';
import MapComponent from './components/MapComponent';
import ChatBotComponent from './components/ChatBotComponent';
import { Box } from '@mui/material';
import './App.css';

function App() {
  const [marker, setMarker] = useState(null);

  return (
    <div className="App">
      <img src="/logo.jpeg" alt="Header" className="header-image" />
      <h2 className="header-text">Crop Yield Prediction App</h2>
      
      {/* Existing map and controls */}
      <div className="box-flex">
        <div className="map-container">
          <h3 className="map-header">Select a location on the map to get started!</h3>
          <MapComponent marker={marker} setMarker={setMarker} />
        </div>
        <Box className="chat-container">
          <h3 className="chat-header">Chat with our Expert!</h3>
          { marker && <ChatBotComponent marker={marker} /> }
        </Box>

      </div>

    </div>
);

}

export default App;
