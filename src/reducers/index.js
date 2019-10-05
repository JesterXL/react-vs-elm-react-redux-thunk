import { union, derivations } from 'folktale/adt/union'
import { chunk } from 'lodash/fp'
import { map } from 'lodash/fp'

const getAccountView = accounts => currentPage => pageSize => totalPages =>
    ({
        accounts,
        currentPage,
        pageSize,
        totalPages
    })

const AccountsState = union('AccountsState', {
    AccountsNotLoaded() { return {} },
    AccountsLoading() { return {} },
    AccountsLoadNothing() { return {} },
    AccountsLoadFailed(error) { return { error } },
    AccountsLoadSuccess(accountView) { return { accountView } }
})
.derive(derivations.debugRepresentation)
export const { AccountsNotLoaded, AccountsLoading, AccountsLoadNothing, AccountsLoadFailed, AccountsLoadSuccess } = AccountsState

const parseAccountType = accountTypeString => {
  switch(accountTypeString.toLowerCase()) {
    case 'checking':
      return 'Checking'
    case 'savings':
      return 'Savings'
    case 'bond... james bond':
      return 'JamesBond'
    case 'mutaual cow':
      return 'MutualMoo'
    default:
      return 'Checking'
  }
}

const parseAccounts = accounts =>
  map(
    ({ id, nickname, type }) => ({
      id,
      nickname,
      accountType: parseAccountType(type)
    }),
    accounts
  )

  const nextPage = accountView => {
    if(accountView.currentPage < accountView.pageSize ) {
      return {...accountView, currentPage: accountView.currentPage + 1}
    }
    return accountView
  }

  const previousPage = accountView => {
    if(accountView.currentPage > 0) {
      return {...accountView, currentPage: accountView.currentPage - 1}
    }
    return accountView
  }
  
export const accounts = (state=AccountsNotLoaded(), action) => {
	switch(action.type) {
      case 'fetchAccounts':
          return AccountsLoading()
      case 'fetchAccountsResult':
          return action.fetchResult.matchWith({
              Ok: ({ value }) => {
                const accounts = parseAccounts(value)
                const desiredPageSize = 10
                const chunkedAccounts = chunk(desiredPageSize)(accounts)
                const accountView = getAccountView(accounts)(0)(desiredPageSize)(chunkedAccounts.length)
                return AccountsLoadSuccess(accountView)
            },
            Error: ({ value }) =>
              AccountsLoadFailed(value)
          })
      case 'previousAccountPage':
        console.log("AccountsLoadSuccess.hasInstance(state):", AccountsLoadSuccess.hasInstance(state))
        if(AccountsLoadSuccess.hasInstance(state)) {
          return AccountsLoadSuccess(
            previousPage(state.accountView)
          )
        }
        return state
      case 'nextAccountPage':
          if(AccountsLoadSuccess.hasInstance(state)) {
            return AccountsLoadSuccess(
              nextPage(state.accountView)
            )
          }
          return state
		default:
			return state
  }
}