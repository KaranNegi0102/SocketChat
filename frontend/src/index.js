import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import SocketProvider from './Context/SocketContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <SocketProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
      </SocketProvider>
      
      
);