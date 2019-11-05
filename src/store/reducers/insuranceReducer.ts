import {
  ACTIVATE_QUOTE,
  ACTIVATE_QUOTE_SUCCESS,
  INSURANCE_ERROR,
  INSURANCE_REQUEST_SUCCESS,
  INSURANCE_REQUESTING,
  INSURANCES_LIST_REQUEST_SUCCESS,
  INSURANCES_LIST_REQUESTING,
  MEMBER_COMPANY_STATUS,
  MEMBER_COMPANY_STATUS_SUCCESS,
  MEMBER_CREATE_MODIFIED_QUOTE,
  MEMBER_CREATE_MODIFIED_QUOTE_SUCCESS,
  SAVE_ACTIVATION_DATE_SUCCESS,
  SAVE_CANCELLATION_DATE_SUCCESS,
  SAVE_INSURANCE_DATE,
  SEND_CANCEL_REQUEST,
  SEND_CANCEL_REQUEST_SUCCESS,
  SEND_CERTIFICATE,
  SEND_CERTIFICATE_ERROR,
  SEND_CERTIFICATE_SUCCESS,
} from '../constants/members'
import initialState from '../initialState'

export default function(state = initialState.insurance, action) {
  switch (action.type) {
    case SEND_CANCEL_REQUEST:
    case INSURANCE_REQUESTING:
    case INSURANCES_LIST_REQUESTING:
    case SAVE_INSURANCE_DATE:
    case SEND_CERTIFICATE:
    case MEMBER_COMPANY_STATUS:
    case MEMBER_CREATE_MODIFIED_QUOTE:
    case ACTIVATE_QUOTE:
      return {
        ...state,
        requesting: true,
        error: [],
      }

    case INSURANCES_LIST_REQUEST_SUCCESS:
      return {
        ...state,
        requesting: false,
        successful: true,
        list: action.list,
        error: [],
      }

    case INSURANCE_REQUEST_SUCCESS:
      return {
        ...state,
        requesting: false,
        successful: true,
        data: action.insurance,
        error: [],
      }

    case MEMBER_CREATE_MODIFIED_QUOTE_SUCCESS:
      return {
        ...state,
        requesting: false,
        successful: true,
        list: [...state.list], // TODO how to squeeze the quote in here?
        error: [],
      }

    case INSURANCE_ERROR:
      return {
        ...state,
        requesting: false,
        data: null,
        error: [...state.error, action.error],
      }

    case SAVE_ACTIVATION_DATE_SUCCESS:
      return {
        ...state,
        requesting: false,
        data: { ...state.data, insuranceActiveFrom: action.activationDate },
      }

    case SAVE_CANCELLATION_DATE_SUCCESS:
      return {
        ...state,
        requesting: false,
        data: { ...state.data, insuranceActiveTo: action.cancellationDate },
      }

    case SEND_CANCEL_REQUEST_SUCCESS:
      return {
        ...state,
        requesting: false,
        data: { ...state.data, cancellationEmailSent: true },
      }

    case SEND_CERTIFICATE_SUCCESS:
      return {
        ...state,
        requesting: false,
        data: { ...state.data, certificateUploaded: true },
      }

    case MEMBER_COMPANY_STATUS_SUCCESS:
      return {
        ...state,
        requesting: false,
        data: { ...state.data, insuredAtOtherCompany: action.value },
      }

    case SEND_CERTIFICATE_ERROR:
      return {
        ...state,
        requesting: false,
      }

    case ACTIVATE_QUOTE_SUCCESS:
    default:
      return state
  }
}
