import React from 'react'
import ReactDOM from 'react-dom/client'
import AppWrapper from './App.jsx';
import { store } from './redux/store.js'; 
import { Provider } from 'react-redux';
import './index.css'
import axios from 'axios'

axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  </React.StrictMode>
);
