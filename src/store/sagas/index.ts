import AuthSaga from './authSaga'
import ClaimsSaga from './claimsSaga'
import MembersSaga from './membersSaga'
import PayoutSaga from './payoutSaga'

export default function* IndexSaga() {
  yield [AuthSaga(), MembersSaga(), ClaimsSaga(), PayoutSaga()]
}
