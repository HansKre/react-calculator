import React from 'react';
import logo from './logo.svg';
import './App.css';
import Calculator from './Calculator';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="Header-And-Logo">
          <h1>The React Calculator
            <img src={logo} className="App-logo" alt="logo" />
          </h1>
        </div>
        <Calculator></Calculator>
        <p className='github'>
          This project's code on<code> GitHub </code>
          <a
            className="App-link"
            href="https://github.com/HansKre/react-calculator"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
        </a>
        </p>
      </header>
    </div>
  );
}

export default App;