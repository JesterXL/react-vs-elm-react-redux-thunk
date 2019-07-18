import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { connect } from 'react-redux'
import Result from 'folktale/result'

const getAccountStateView = accountsState =>
  accountsState.matchWith({
    AccountsNotLoaded: () => (<div>Waiting.</div>),
    AccountsLoading: () => (<div>Loading...</div>),
    AccountsLoadNothing: () => (<div>No accounts.</div>),
    AccountsLoadFailed: ({ error }) => (<div>Accounts failed to load: ${error.message}</div>),
    AccountsLoadSuccess: ({ accounts }) => (<div>Yay, accounts!</div>)
  })

const Cow = props => {
  console.log("props:", props)
  return (
  <div>
    <h2>Cow Man</h2>
    <button onClick={props.onClick}>Sup</button>
    {getAccountStateView(props.accountsState)}
  </div>
)}
const CowContainer = connect(
  state => ({ accountsState: state }),
  dispatch => {
    return {
      onClick: () => {
        console.log("dat inner")
        dispatch({type: 'fetchAccounts'})
        setTimeout(()=> {
          dispatch({
            type: 'fetchAccountsResult', 
            fetchResult: Result.Ok([
              {id: '1', nickname: 'cow', accountType: 'dd'}
            ])
          })
        }, 3 * 1000)
      }
    }
  }
)(Cow)



const OhYeah = () => (
  <h2>Now Now Oh Yeah</h2>
)
const App = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Route exact path="/" component={OhYeah} />
      <Route exact path="/cow" component={CowContainer} />
    </Router>
  </Provider>
)

export default App;
