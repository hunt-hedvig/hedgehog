import AssetsSaga from './assetsSaga'
import ClaimDetailsSaga from './claimDetailsSaga'
import ClaimsSaga from './claimsSaga'
import InsuranceSaga from './insuranceSaga'
import LoginSaga from './loginSaga'
import MemberInsuranceSaga from './memberInsuranceSaga'
import MembersSaga from './membersSaga'
import MessagesSaga from './messagesSaga'
import NotesSaga from './notesSaga'
import PaymentsSaga from './paymentsSaga'
import PollingSaga from './pollingSaga'
import QuestionsSaga from './questionsSaga'

export default function* IndexSaga() {
  yield [
    LoginSaga(),
    AssetsSaga(),
    PollingSaga(),
    MembersSaga(),
    MessagesSaga(),
    ClaimsSaga(),
    ClaimDetailsSaga(),
    PaymentsSaga(),
    NotesSaga(),
    QuestionsSaga(),
    InsuranceSaga(),
    MemberInsuranceSaga(),
  ]
}
