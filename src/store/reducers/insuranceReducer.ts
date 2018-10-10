import initialState from "../initialState";
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
  SEND_CERTIFICATE_ERROR,
  MEMBER_COMPANY_STATUS,
  MEMBER_COMPANY_STATUS_SUCCESS,
  MEMBER_CREATE_MODIFIED_INSURANCE,
  MEMBER_CREATE_MODIFIED_INSURANCE_SUCCESS,
  MODIFY_INSURANCE,
  MODIFY_INSURANCE_SUCCESS
} from "../constants/members";

export default function(state = initialState.insurance, action) {
  switch (action.type) {
    case SEND_CANCEL_REQUEST:
    case INSURANCE_REQUESTING:
    case INSURANCES_LIST_REQUESTING:
    case SAVE_INSURANCE_DATE:
    case SEND_CERTIFICATE:
    case MEMBER_COMPANY_STATUS:
    case MEMBER_CREATE_MODIFIED_INSURANCE:
    case MODIFY_INSURANCE:
      return {
        ...state,
        requesting: true,
        error: []
      };

    case INSURANCES_LIST_REQUEST_SUCCESS:
      return {
        ...state,
        requesting: false,
        successful: true,
        list: action.list,
        error: []
      };

    case INSURANCE_REQUEST_SUCCESS:
      return {
        ...state,
        requesting: false,
        successful: true,
        data: action.insurance,
        error: []
      };

    case MEMBER_CREATE_MODIFIED_INSURANCE_SUCCESS:
      return {
        ...state,
        requesting: false,
        successful: true,
        list: [...state.list, action.updatedProduct],
        error: []
      };

    case INSURANCE_ERROR:
      return {
        ...state,
        requesting: false,
        data: null,
        error: [...state.error, action.error]
      };

    case SAVE_ACTIVATION_DATE_SUCCESS:
      return {
        ...state,
        requesting: false,
        data: { ...state.data, insuranceActiveFrom: action.activationDate }
      };

    case SAVE_CANCELLATION_DATE_SUCCESS:
      return {
        ...state,
        requesting: false,
        data: { ...state.data, insuranceActiveTo: action.cancellationDate }
      };

    case SEND_CANCEL_REQUEST_SUCCESS:
      return {
        ...state,
        requesting: false,
        data: { ...state.data, cancellationEmailSent: true }
      };

    case SEND_CERTIFICATE_SUCCESS:
      return {
        ...state,
        requesting: false,
        data: { ...state.data, certificateUploaded: true }
      };

    case MEMBER_COMPANY_STATUS_SUCCESS:
      return {
        ...state,
        requesting: false,
        data: { ...state.data, insuredAtOtherCompany: action.value }
      };

    case SEND_CERTIFICATE_ERROR:
      return {
        ...state,
        requesting: false
      };

    case MODIFY_INSURANCE_SUCCESS:
    default:
      return state;
  }
}
