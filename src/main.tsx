import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ErrorBoundary } from './components/ui/error-boundary';
import './index.css';

// Laila Telemetry Interceptor - Fix for empty object logging and noise filtering
window.addEventListener('unhandledrejection', (event) => {
  const error = event.reason;
  const message = error instanceof Error ? error.message : (typeof error === 'object' ? JSON.stringify(error) : String(error));
  const stack = error instanceof Error ? error.stack : '';
  
  // Intelligence Filter: Ignore background noise and transient Firebase errors
  const isExtensionNoise = stack.includes('chrome-extension://') || stack.includes('moz-extension://');
  const isFirebaseOfflineLine = message.toLowerCase().includes('client is offline') || 
                                message.includes('offline') ||
                                message.includes('FirebaseError');
  
  if (message !== '{}' && !isExtensionNoise && !isFirebaseOfflineLine) {
    console.error(`[LAILA TELEMETRY] Promise rejection captured: ${message}`, stack);
  }
});

window.addEventListener('error', (event) => {
  const message = event.error instanceof Error ? event.error.message : event.message;
  const stack = event.error instanceof Error ? event.error.stack : '';
  
  const isExtensionNoise = stack?.includes('chrome-extension://') || stack?.includes('moz-extension://');
  const isFirebaseOfflineLine = message.toLowerCase().includes('client is offline') || 
                                message.includes('offline');
  
  if (message !== '{}' && !isExtensionNoise && !isFirebaseOfflineLine) {
    console.error(`[LAILA TELEMETRY] Runtime Error: ${message}`);
  }
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
