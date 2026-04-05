import React from 'react';
import {createRoot} from 'react-dom/client';
import {Wordy} from './Wordy';
import './index.css';

window.addEventListener('load', () => {
  createRoot(document.querySelector('#app')).render(<Wordy />);
});
