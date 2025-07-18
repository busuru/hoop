import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Debug logging
console.log('Main.tsx loading...');

const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);

if (!rootElement) {
  console.error('Root element not found!');
} else {
  try {
    const root = createRoot(rootElement);
    console.log('React root created successfully');
    
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    console.log('App rendered successfully');
  } catch (error) {
    console.error('Error rendering app:', error);
  }
}
