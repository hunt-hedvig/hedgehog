import {
    ASSET_UPDATING,
    ASSET_UPDATE_SUCCESS,
    ASSET_REQUESTING,
    ASSET_REQUEST_SUCCESS,
    ASSET_ERROR
} from '../constants/assets';

export const assetUpdate = (assetId, assetState) => ({
    type: ASSET_UPDATING,
    assetId,
    assetState
});

export const assetUpdateSuccess = asset => ({
    type: ASSET_UPDATE_SUCCESS,
    asset
});

export const assetRequest = () => ({
    type: ASSET_REQUESTING
});

export const assetRequestSuccess = assets => ({
    type: ASSET_REQUEST_SUCCESS,
    assets
});

export const assetRequestError = error => ({
    type: ASSET_ERROR,
    error
});
