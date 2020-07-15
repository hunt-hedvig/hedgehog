import AuthSaga from './authSaga'
import ClaimDetailsSaga from './claimDetailsSaga'
import ClaimsSaga from './claimsSaga'
import MembersSaga from './membersSaga'
import PaymentsSaga from './paymentsSaga'
import PayoutSaga from './payoutSaga'

export default function* IndexSaga() {
  yield [
    AuthSaga(),
    MembersSaga(),
    ClaimsSaga(),
    ClaimDetailsSaga(),
    PaymentsSaga(),
    PayoutSaga(),
  ]
}
