import AuthSaga from './authSaga'
import ClaimDetailsSaga from './claimDetailsSaga'
import ClaimsSaga from './claimsSaga'
import MembersSaga from './membersSaga'
import NotesSaga from './notesSaga'
import PaymentsSaga from './paymentsSaga'
import PayoutSaga from './payoutSaga'
import PollingSaga from './pollingSaga'

export default function* IndexSaga() {
  yield [
    AuthSaga(),
    PollingSaga(),
    MembersSaga(),
    ClaimsSaga(),
    ClaimDetailsSaga(),
    PaymentsSaga(),
    PayoutSaga(),
    NotesSaga(),
  ]
}
