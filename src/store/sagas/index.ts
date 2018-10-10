import LoginSaga from './loginSaga';
import AssetsSaga from './assetsSaga';
import PollingSaga from './pollingSaga';
import MembersSaga from './membersSaga';
import MessagesSaga from './messagesSaga';
import ClaimsSaga from './claimsSaga';
import ClaimDetailsSaga from './claimDetailsSaga';
import PaymentsSaga from './paymentsSaga';
import NotesSaga from './notesSaga';
import QuestionsSaga from './questionsSaga';
import InsuranceSaga from './insuranceSaga';
import MemberInsuranceSaga from './memberInsuranceSaga';

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
        MemberInsuranceSaga()
    ];
}
