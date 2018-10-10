import {
  INSURANCE_REQUESTING,
  INSURANCE_REQUEST_SUCCESS,
  INSURANCE_ERROR,
  INSURANCES_LIST_REQUESTING,
  INSURANCES_LIST_REQUEST_SUCCESS,
  SAVE_INSURANCE_DATE,
  SAVE_ACTIVATION_DATE_SUCCESS,
  SAVE_CANCELLATION_DATE_SUCCESS,
  SEND_CANCEL_REQUEST,
  SEND_CANCEL_REQUEST_SUCCESS,
  SEND_CERTIFICATE,
  SEND_CERTIFICATE_SUCCESS,
  MEMBER_COMPANY_STATUS,
  MEMBER_COMPANY_STATUS_SUCCESS,
  SEND_CERTIFICATE_ERROR,
  MEMBER_CREATE_MODIFIED_INSURANCE,
  MEMBER_CREATE_MODIFIED_INSURANCE_SUCCESS,
  MODIFY_INSURANCE,
  MODIFY_INSURANCE_SUCCESS
} from "../constants/members";

export const insuranceRequest = id => ({
  type: INSURANCE_REQUESTING,
  id
});

export const insurancesListRequest = id => ({
  type: INSURANCES_LIST_REQUESTING,
  id
});

export const insuranceGetSuccess = insurance => ({
  type: INSURANCE_REQUEST_SUCCESS,
  insurance
});

export const insurancesListGetSuccess = list => ({
  type: INSURANCES_LIST_REQUEST_SUCCESS,
  list
});

export const insuranceGetError = error => ({
  type: INSURANCE_ERROR,
  error
});

export const saveInsuranceDate = (date, changeType, memberId, insuranceId) => ({
  type: SAVE_INSURANCE_DATE,
  date,
  changeType,
  memberId,
  insuranceId
});

export const saveActivationDateSuccess = activationDate => ({
  type: SAVE_ACTIVATION_DATE_SUCCESS,
  activationDate
});

export const saveCancellationDateSuccess = cancellationDate => ({
  type: SAVE_CANCELLATION_DATE_SUCCESS,
  cancellationDate
});

export const sendCancelRequest = id => ({
  type: SEND_CANCEL_REQUEST,
  id
});

export const sendCancelRequestSuccess = () => ({
  type: SEND_CANCEL_REQUEST_SUCCESS
});

export const sendCertificate = (data, memberId) => ({
  type: SEND_CERTIFICATE,
  data,
  memberId
});

export const sendCertificateSuccess = () => ({
  type: SEND_CERTIFICATE_SUCCESS
});

export const insuranceError = () => ({
  type: SEND_CERTIFICATE_ERROR
});

export const changeCompanyStatus = (value, memberId) => ({
  type: MEMBER_COMPANY_STATUS,
  value,
  memberId
});

export const changeCompanyStatusSuccess = value => ({
  type: MEMBER_COMPANY_STATUS_SUCCESS,
  value
});

export const createModifiedInsurance = (memberId, modifiedDetails) => ({
  type: MEMBER_CREATE_MODIFIED_INSURANCE,
  modifiedDetails,
  memberId
});

export const createModifiedInsuranceSuccess = updatedProduct => ({
  type: MEMBER_CREATE_MODIFIED_INSURANCE_SUCCESS,
  updatedProduct
});

export const modifyInsurance = (memberId, request) => ({
  type: MODIFY_INSURANCE,
  memberId,
  request
});

export const modifyInsuranceSuccess = () => ({
  type: MODIFY_INSURANCE_SUCCESS
});
