import React from 'react';
import ReactDOM from 'react-dom/client';
// Thay đổi ở dòng này: sử dụng dấu ngoặc nhọn {}
import { App } from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
