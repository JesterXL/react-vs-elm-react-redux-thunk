import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { connect } from 'react-redux'
import Result from 'folktale/result'
import { map, chunk, isNil } from 'lodash/fp'
import fetch from 'cross-fetch'

const getAccountStateView = onPreviousClick => onNextClick => accountsState =>
  accountsState.matchWith({
    AccountsNotLoaded: () => (<div>Accounts not fetched yet.</div>),
    AccountsLoading: () => (<div>Loading accounts...</div>),
    AccountsLoadNothing: () => (<div>No accounts.</div>),
    AccountsLoadFailed: ({ error }) => (<div>Accounts failed to load: ${error.message}</div>),
    AccountsLoadSuccess: ({ accountView }) => {
      const currentPageOfAccounts = getCurrentPage(accountView.pageSize)(accountView.currentPage)(accountView.accounts)
      return getAccountsTable(onPreviousClick)(onNextClick)(accountView.totalPages)(accountView.currentPage)(currentPageOfAccounts)
    }
  })

const mainPageMarginStyle = {
  margin: '8px'
}
const titleStyle = {
  textAlign: 'left'
}
const accountsWrapperStyle = {
  display: 'flex'
}
const fetchButtonStyle = {
  padding: '8px',
  marginBottom: '8px'
}

const getCurrentPage = pageSize => currentPage => accounts => {
  const chunked = chunk(pageSize)(accounts)
  if(isNil(chunked[currentPage])) {
    return []
  }
  return chunked[currentPage]
}
  

const Cow = props => {
  return (
  <div style={mainPageMarginStyle}>
    <h1 style={titleStyle}>Accounts</h1>
    <div style={accountsWrapperStyle}>
      <button style={fetchButtonStyle} onClick={props.onClick}>Fetch Accounts</button>
    </div>
    {getAccountStateView(props.onPreviousClick)(props.onNextClick)(props.accountsState)}
  </div>
)}
const CowContainer = connect(
  state => ({ accountsState: state }),
  dispatch => {
    return {
      onClick: () => {
        dispatch({type: 'fetchAccounts'})
        fetch('http://localhost:8001/accounts')
        .then(res => {
          if (res.status !== 200) {
            return new Error(`Received status code: ${res.status}`)
          }
          return res.json()
        })
        .then(
          accountsJSON => dispatch({
            type: 'fetchAccountsResult',
            fetchResult: Result.Ok(accountsJSON)
          })
        )
        .catch(
          error => dispatch({
            type: 'fetchAccountsResult',
            fetchResult: Result.Error(new Error(`Failed to get accounts: ${error.message}`))
          })
        )
      },
      onPreviousClick: event => {
        dispatch({type: 'previousAccountPage'})
      },
      onNextClick: event => {
        dispatch({type: 'nextAccountPage'})
      }
    }
  }
)(Cow)


const accountsTableStyles = {
  width: '100%'
}

const getAccountTableRow = account => (
  <tr key={account.id}>
    <td align="left">{account.id}</td>
    <td align="left">{account.nickname}</td>
    <td align="left">{account.accountType}</td>
  </tr>
)

const getAccountsTable = onPreviousClick => onNextClick => totalPages => currentPage => accounts => (
  <div>
    <table style={accountsTableStyles}>
      <tbody>
        <tr>
          <th align="left">ID</th>
          <th align="left">Account Nickname</th>
          <th align="left">Account Type</th>
        </tr>
        {map(getAccountTableRow, accounts)}
      </tbody>
    </table>
    <br />
    {getPagination(onPreviousClick)(onNextClick)(currentPage)(totalPages)}
  </div>
)

const paginationStyle = {
  display: 'flex',
  height: '300px'
}
const innerPaginationStyle = {
  display: 'flex',
  width: '300px',
  height: '100px',
  margin: 'auto'
}
const previousPageButtonStyle = {
  disabled: false,
  flexGrow: 2
}

const PreviousButtonEnabled = ({ onClick }) => (
  <button style={previousPageButtonStyle} onClick={onClick}>&lt;</button>
)

const previousPageDisabledButtonStyle = {
  disabled: true,
  flexGrow: 2
}
const PreviousButtonDisabled = () => (
  <button style={previousPageDisabledButtonStyle}>&lt;</button>
)

const getPreviousButton = onPreviousClick => currentPage => totalPages => {
  if(currentPage === totalPages) {
    return (<PreviousButtonDisabled />)
  }
  return (<PreviousButtonEnabled onClick={onPreviousClick}/>)
}

const paginationTextStyle = {
  padding: '8px',
  width: '60px'
}

const nextButtonEnabledButtonStyle = {
  disabled: false,
  flexGrow: 2
}
const NextButtonEnabled = ({ onClick }) => (
  <button style={nextButtonEnabledButtonStyle} onClick={onClick}>&gt;</button>
)

const getPagination = onPreviousClick => onNextClick => currentPage => totalPages => (
  <div style={paginationStyle}>
    <div style={innerPaginationStyle}>
      {getPreviousButton(onPreviousClick)(currentPage)(totalPages)}
      <div style={paginationTextStyle}>{currentPage + 1} of {totalPages}</div>
      <NextButtonEnabled onClick={onNextClick} />
    </div>
  </div>
)

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
