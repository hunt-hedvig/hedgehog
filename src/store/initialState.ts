import { BackofficeStore } from './storeTypes'
import { PayoutRequestResult } from './types/payoutTypes'

const initialState: BackofficeStore = {
  payoutDetails: {
    data: null,
    requesting: false,
    requestResult: PayoutRequestResult.READY,
  },
}

export default initialState
