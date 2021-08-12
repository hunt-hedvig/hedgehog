import { AuthState } from 'store/actions/auth'

export interface BackofficeStore {
  auth: {
    state: AuthState
    scopes: ReadonlyArray<string>
    id?: string
    email?: string
  }
  payoutDetails: any
}
