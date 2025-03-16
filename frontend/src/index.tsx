import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AudioTranscriptionApp from "./AudioTranscriptionApp";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <AudioTranscriptionApp />
);