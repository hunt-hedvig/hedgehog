import api from 'api'
import config from 'api/config'
import { ACTIVATION_DATE, CANCELLATION_DATE } from 'lib/messageTypes'
import { call, put, takeLatest } from 'redux-saga/effects'
import {
  changeCompanyStatusSuccess,
  insuranceError,
  insuranceGetError,
  insuranceGetSuccess,
  insurancesListGetSuccess,
  saveActivationDateSuccess,
  modifyInsuranceSuccess,
  saveCancellationDateSuccess,
  sendCancelRequestSuccess,
  sendCertificateSuccess,
} from '../actions/insuranceActions'
import { showNotification } from '../actions/notificationsActions'
import {
  INSURANCE_REQUESTING,
  INSURANCES_LIST_REQUESTING,
  MEMBER_COMPANY_STATUS, MODIFY_INSURANCE,
  SAVE_INSURANCE_DATE,
  SEND_CANCEL_REQUEST,
  SEND_CERTIFICATE,
} from '../constants/members'

function* requestFlow({ id }) {
  try {
    const { data } = yield call(api, config.insurance.get, null, id)
    yield put(insuranceGetSuccess(data))
  } catch (error) {
    yield [put(insuranceGetError(error.message))]
  }
}

function* requestListofInsurancesFlow({ id }) {
  try {
    const requestListPath = `${id}/insurances`

    const response = yield call(
      api,
      config.insurance.getInsurancesByMember,
      null,
      requestListPath,
    )

    yield put(insurancesListGetSuccess(response.data))
  } catch (error) {
    yield [put(insuranceGetError(error.message))]
  }
}

function* saveDateFlow({ memberId, insuranceId, date, changeType }) {
  try {
    switch (changeType) {
      case ACTIVATION_DATE: {
        const activationPath = `${memberId}/activate`
        yield call(
          api,
          config.insurance.setDate,
          { insuranceId, activationDate: date },
          activationPath,
        )
        yield put(saveActivationDateSuccess(date))
        break
      }
      case CANCELLATION_DATE: {
        const cancellationPath = `${memberId}/cancel`
        yield call(
          api,
          config.insurance.setDate,
          {
            memberId,
            insuranceId,
            cancellationDate: date,
          },
          cancellationPath,
        )
        yield put(saveCancellationDateSuccess(date))
        break
      }
      default:
        throw new Error(
          'Function: saveDateFlow ErrorMessage: Not valid changeType',
        )
    }
  } catch (error) {
    yield [
      put(
        showNotification({
          message: error.message,
          header: 'Insurance',
        }),
      ),
      put(insuranceError()),
    ]
  }
}

function* modifyInsuranceFlow({ memberId, request }) {
  try {
    const path = `${memberId}/modifyProduct`

    const response = yield call(
      api,
      config.insurance.modifyProduct,
      request,
      path,
    )

    yield put(modifyInsuranceSuccess(response.data))
    window.location.reload() // Sorry
  } catch (error) {
    yield [
      put(
        showNotification({
          message: error.message,
          header: 'Insurance',
        }),
      ),
      put(insuranceError()),
      console.error(error)
    ]
  }
}

function* cancelRequestFlow({ id }) {
  try {
    const path = `${id}/sendCancellationEmail`
    yield call(api, config.insurance.cancel, null, path)
    yield [
      put(sendCancelRequestSuccess()),
      put(
        showNotification({
          message: 'Success',
          header: 'Send cancellation email to existing insurer',
          type: 'olive',
        }),
      ),
    ]
  } catch (error) {
    yield [
      put(
        showNotification({
          message: error.message,
          header: 'Insurance',
        }),
      ),
      put(insuranceError()),
    ]
  }
}

function* sendCertificateFlow({ data, memberId }) {
  try {
    const path = `${memberId}/certificate`
    yield call(api, config.insurance.cert, data, path)
    yield [
      put(sendCertificateSuccess()),
      put(
        showNotification({
          message: 'Success',
          header: 'Upload insurance certificate',
          type: 'olive',
        }),
      ),
    ]
  } catch (error) {
    yield [
      put(
        showNotification({
          message: error.message,
          header: 'Insurance',
        }),
      ),
      put(insuranceError()),
    ]
  }
}

function* changeCompanyStatusFlow({ value, memberId }) {
  try {
    const path = `${memberId}/insuredAtOtherCompany`
    yield call(
      api,
      config.insurance.companyStatus,
      { insuredAtOtherCompany: value },
      path,
    )
    yield [
      put(changeCompanyStatusSuccess(value)),
      put(
        showNotification({
          message: 'Success',
          header: '"Insured at other company" field changed',
          type: 'olive',
        }),
      ),
    ]
  } catch (error) {
    yield [
      put(
        showNotification({
          message: error.message,
          header: 'Insurance',
        }),
      ),
      put(insuranceError()),
    ]
  }
}

function* insuranceWatcher() {
  yield [
    takeLatest(INSURANCE_REQUESTING, requestFlow),
    takeLatest(SAVE_INSURANCE_DATE, saveDateFlow),
    takeLatest(SEND_CANCEL_REQUEST, cancelRequestFlow),
    takeLatest(SEND_CERTIFICATE, sendCertificateFlow),
    takeLatest(MEMBER_COMPANY_STATUS, changeCompanyStatusFlow),
    takeLatest(INSURANCES_LIST_REQUESTING, requestListofInsurancesFlow),
    takeLatest(MODIFY_INSURANCE, modifyInsuranceFlow),
  ]
}

export default insuranceWatcher
