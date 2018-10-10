import {
    CLAIM_REQUESTING,
    CLAIM_REQUEST_SUCCESS,
    CLAIMS_ERROR,
    CLAIM_DETAILS_UPDATING,
    CLAIM_UPDATING,
    CLAIM_DETAILS_UPDATE_SUCCESS
} from '../constants/claims';

export const claimRequest = id => ({
    type: CLAIM_REQUESTING,
    id
});

export const claimRequestSuccess = claim => ({
    type: CLAIM_REQUEST_SUCCESS,
    claim
});

export const claimRequestError = error => ({
    type: CLAIMS_ERROR,
    error
});

export const claimDetailsUpdate = (id, data) => ({
    type: CLAIM_DETAILS_UPDATING,
    id,
    data
});

export const claimDetailsUpdateSuccess = data => ({
    type: CLAIM_DETAILS_UPDATE_SUCCESS,
    data
});

export const claimUpdate = (id, data, reqType) => ({
    type: CLAIM_UPDATING,
    id,
    data,
    reqType
});
