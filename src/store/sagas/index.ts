import PayoutSaga from './payoutSaga'

export default function* IndexSaga() {
  yield [PayoutSaga()]
}
