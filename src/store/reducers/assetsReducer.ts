import initialState from '../initialState';
import {
    ASSET_UPDATING,
    ASSET_UPDATE_SUCCESS,
    ASSET_REQUESTING,
    ASSET_REQUEST_SUCCESS,
    ASSET_ERROR
} from '../constants/assets';
import { sortAssetsList } from '../../lib/helpers';

export default function(state = initialState.assets, action) {
    switch (action.type) {
        case ASSET_REQUESTING:
        case ASSET_UPDATING:
            return {
                ...state,
                requesting: true,
            };

        case ASSET_UPDATE_SUCCESS:
            return {
                list: state.list.map(
                    asset =>
                        asset.id === action.asset.id
                            ? { ...asset, state: action.asset.state }
                            : asset
                ),
                requesting: false,
            };

        case ASSET_REQUEST_SUCCESS:
            return {
                ...state,
                list: sortAssetsList(action.assets),
                requesting: false,
            };
        
        case ASSET_ERROR:
            return {
                ...state,
                requesting: false
            }

        default:
            return state;
    }
}
