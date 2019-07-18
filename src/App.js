import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

const Cow = () => (
  <h2>Cow Man</h2>
)

const OhYeah = () => (
  <h2>Now Now Oh Yeah</h2>
)
const App = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Route exact path="/" component={OhYeah} />
      <Route exact path="/cow" component={Cow} />
    </Router>
  </Provider>
)

function Main() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
