import {
  CLAIMS_REQUESTING,
  CLAIMS_REQUEST_SUCCESS,
  CLAIM_UPDATE_SUCCESS,
  CLAIM_TYPES,
  CLAIM_TYPES_SUCCESS,
  CLAIMS_BY_MEMBER,
  CLAIMS_BY_MEMBER_SUCCESS,
  CLAIMS_ERROR,
  SORT_CLAIMS_LIST
} from "../constants/claims";

export const claimsRequest = () => ({
  type: CLAIMS_REQUESTING
});

export const claimsRequestSuccess = (claims, fieldName, isDescendingOrder) => ({
  type: CLAIMS_REQUEST_SUCCESS,
  claims,
  fieldName,
  isDescendingOrder
});

export const claimUpdateSuccess = (reqType, data) => ({
  type: CLAIM_UPDATE_SUCCESS,
  reqType,
  data
});

export const claimTypes = () => ({
  type: CLAIM_TYPES
});

export const claimsTypesSuccess = types => ({
  type: CLAIM_TYPES_SUCCESS,
  types
});

export const claimsByMember = id => ({
  type: CLAIMS_BY_MEMBER,
  id
});

export const claimsByMemberSuccess = claims => ({
  type: CLAIMS_BY_MEMBER_SUCCESS,
  claims
});

export const claimsError = error => ({
  type: CLAIMS_ERROR,
  error
});

export const sortClaimsList = (fieldName, isReverse) => ({
  type: SORT_CLAIMS_LIST,
  fieldName,
  isReverse
});
