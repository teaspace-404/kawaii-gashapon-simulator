import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  // StrictMode is great for development, but can cause double-init issues with Physics engines 
  // if cleanup isn't perfect. We will handle cleanup robustly in PhysicsCanvas.
  <React.StrictMode>
    <App />
  </React.StrictMode>
);