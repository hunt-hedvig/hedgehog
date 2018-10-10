import { call, put, takeLatest } from "redux-saga/effects";
import {
  INSURANCE_REQUESTING,
  SAVE_INSURANCE_DATE,
  SEND_CANCEL_REQUEST,
  SEND_CERTIFICATE,
  MEMBER_COMPANY_STATUS,
  INSURANCES_LIST_REQUESTING,
  MEMBER_CREATE_MODIFIED_INSURANCE,
  MODIFY_INSURANCE
} from "../constants/members";
import api from "api";
import config from "api/config";
import {
  insuranceGetSuccess,
  insurancesListGetSuccess,
  insuranceGetError,
  saveActivationDateSuccess,
  saveCancellationDateSuccess,
  sendCancelRequestSuccess,
  sendCertificateSuccess,
  changeCompanyStatusSuccess,
  insuranceError,
  createModifiedInsuranceSuccess,
  modifyInsuranceSuccess
} from "../actions/insuranceActions";
import { showNotification } from "../actions/notificationsActions";
import { ACTIVATION_DATE, CANCELLATION_DATE } from "lib/messageTypes";

const STUDENT_BRF = "STUDENT_BRF";
const STUDENT_RENT = "STUDENT_RENT";
const BRF = "BRF";
const RENT = "RENT";
const SUBLET_BRF = "SUBLET_BRF";
const SUBLET_RENT = "SUBLET_RENT";

function* requestFlow({ id }) {
  try {
    const { data } = yield call(api, config.insurance.get, null, id);
    yield put(insuranceGetSuccess(data));
  } catch (error) {
    yield [put(insuranceGetError(error.message))];
  }
}

function* requestListofInsurancesFlow({ id }) {
  try {
    const requestListPath = `${id}/insurances`;

    const response = yield call(
      api,
      config.insurance.getInsurancesByMember,
      null,
      requestListPath
    );

    yield put(insurancesListGetSuccess(response.data));
  } catch (error) {
    yield [put(insuranceGetError(error.message))];
  }
}

function* createModifiedInsuranceFlow({ memberId, modifiedDetails }) {
  try {
    const path = `${memberId}/createmodifiedProduct`;

    if (!modifiedDetails.livingSpace) {
      let error = { message: "Livingspace is empty" };
      throw error;
    }

    if (
      modifiedDetails.insuranceType != BRF &&
      modifiedDetails.insuranceType != RENT &&
      modifiedDetails.insuranceType != STUDENT_BRF &&
      modifiedDetails.insuranceType != STUDENT_RENT &&
      modifiedDetails.insuranceType != SUBLET_BRF &&
      modifiedDetails.insuranceType != SUBLET_RENT
    ) {
      let error = {
        message:
          "Insurance type should be BRF, RENT, STUDENT_BRF, STUDENT_RENT, SUBLET_BRF or SUBLET_RENT"
      };
      throw error;
    }

    if (
      modifiedDetails.insuranceType === STUDENT_BRF ||
      modifiedDetails.insuranceType === STUDENT_RENT
    ) {
      let shouldThrow = false;
      let error = {
        message: "Cannot apply student policy"
      };
      if (+modifiedDetails.livingSpace > 50) {
        error = {
          message:
            error.message + " ,livingspace should be equal or less than 50 m2 "
        };
        shouldThrow = true;
      }
      if (+modifiedDetails.personsInHouseHold > 2) {
        error = {
          message: error.message + " ,the household size less than 3 people "
        };
        shouldThrow = true;
      }
      if (!modifiedDetails.isStudent) {
        error = {
          message: error.message + " ,the IsStudent box should be selected. "
        };
        shouldThrow = true;
      }
      if (shouldThrow) {
        throw error;
      }
    }

    const response = yield call(
      api,
      config.insurance.createModifiedInsurance,
      {
        idToBeReplaced: modifiedDetails.productId,
        memberId: memberId,
        street: modifiedDetails.street,
        city: modifiedDetails.city,
        zipCode: modifiedDetails.zipCode,
        floor: modifiedDetails.floor,
        livingSpace: modifiedDetails.livingSpace,
        houseType: modifiedDetails.insuranceType,
        personsInHouseHold: modifiedDetails.personsInHouseHold,
        safetyIncreasers: Array.isArray(modifiedDetails.safetyIncreasers)
          ? modifiedDetails.safetyIncreasers
          : modifiedDetails.safetyIncreasers.trim().split(","),
        isStudent: modifiedDetails.isStudent
      },
      path
    );

    yield put(createModifiedInsuranceSuccess(response.data));
  } catch (error) {
    yield [
      put(
        showNotification({
          message: error.message,
          header: "Insurance"
        })
      ),
      put(insuranceError())
    ];
  }
}

function* modifyInsuranceFlow({ memberId, request }) {
  try {
    const path = `${memberId}/modifyProduct`;

    const response = yield call(
      api,
      config.insurance.modifyProduct,
      request,
      path
    );

    yield put(modifyInsuranceSuccess(response.data));
  } catch (error) {
    yield [
      put(
        showNotification({
          message: error.message,
          header: "Insurance"
        })
      ),
      put(insuranceError())
    ];
  }
}

function* saveDateFlow({ memberId, insuranceId, date, changeType }) {
  try {
    switch (changeType) {
      case ACTIVATION_DATE: {
        const activationPath = `${memberId}/activate`;
        yield call(
          api,
          config.insurance.setDate,
          { insuranceId, activationDate: date },
          activationPath
        );
        yield put(saveActivationDateSuccess(date));
        break;
      }
      case CANCELLATION_DATE: {
        const cancellationPath = `${memberId}/cancel`;
        yield call(
          api,
          config.insurance.setDate,
          {
            memberId,
            insuranceId,
            cancellationDate: date
          },
          cancellationPath
        );
        yield put(saveCancellationDateSuccess(date));
        break;
      }
      default:
        throw "Function: saveDateFlow ErrorMessage: Not valid changeType";
    }
  } catch (error) {
    yield [
      put(
        showNotification({
          message: error.message,
          header: "Insurance"
        })
      ),
      put(insuranceError())
    ];
  }
}

function* cancelRequestFlow({ id }) {
  try {
    const path = `${id}/sendCancellationEmail`;
    yield call(api, config.insurance.cancel, null, path);
    yield [
      put(sendCancelRequestSuccess()),
      put(
        showNotification({
          message: "Success",
          header: "Send cancellation email to existing insurer",
          type: "olive"
        })
      )
    ];
  } catch (error) {
    yield [
      put(
        showNotification({
          message: error.message,
          header: "Insurance"
        })
      ),
      put(insuranceError())
    ];
  }
}

function* sendCertificateFlow({ data, memberId }) {
  try {
    const path = `${memberId}/certificate`;
    yield call(api, config.insurance.cert, data, path);
    yield [
      put(sendCertificateSuccess()),
      put(
        showNotification({
          message: "Success",
          header: "Upload insurance certificate",
          type: "olive"
        })
      )
    ];
  } catch (error) {
    yield [
      put(
        showNotification({
          message: error.message,
          header: "Insurance"
        })
      ),
      put(insuranceError())
    ];
  }
}

function* changeCompanyStatusFlow({ value, memberId }) {
  try {
    const path = `${memberId}/insuredAtOtherCompany`;
    yield call(
      api,
      config.insurance.companyStatus,
      { insuredAtOtherCompany: value },
      path
    );
    yield [
      put(changeCompanyStatusSuccess(value)),
      put(
        showNotification({
          message: "Success",
          header: '"Insured at other company" field changed',
          type: "olive"
        })
      )
    ];
  } catch (error) {
    yield [
      put(
        showNotification({
          message: error.message,
          header: "Insurance"
        })
      ),
      put(insuranceError())
    ];
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
    takeLatest(MEMBER_CREATE_MODIFIED_INSURANCE, createModifiedInsuranceFlow),
    takeLatest(MODIFY_INSURANCE, modifyInsuranceFlow)
  ];
}

export default insuranceWatcher;
