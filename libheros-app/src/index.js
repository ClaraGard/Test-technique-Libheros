import React from 'react';
import ReactDOM from 'react-dom/client'; // Use this import for createRoot
import App from './App';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement); // Initialize the root
root.render(<App />); // Render the app using createRoot
