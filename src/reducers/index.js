import { union } from 'folktale/adt/union'
import { chunk } from 'lodash/fp'

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
const { AccountsNotLoaded, AccountsLoading, AccountsLoadNothing, AccountsLoadFailed, AccountsLoadSuccess } = AccountsState

export const accounts = (state=AccountsNotLoaded(), action) => {
  switch(action.type) {
      case 'fetchAccounts':
          return AccountsLoading()
        case 'fetchAccountsResult':
           return action.fetchResult.matchWith({
               Ok: ({ accountJSONs }) => {
					   const desiredPageSize = 10
					   const chunkedAccounts = chunk(desiredPageSize)(accountJSONs)
					   const accountView = getAccountView(accountJSONs)(0)(desiredPageSize)(chunkedAccounts.length)
					return AccountsLoadSuccess(accountView)
				},
				Error: ({ error }) =>
					AccountsLoadFailed(error)
		   })
		default:
			return state
  }
}