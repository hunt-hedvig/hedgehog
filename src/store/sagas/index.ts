import AuthSaga from './authSaga'

export default function* IndexSaga() {
  yield [AuthSaga()]
}
