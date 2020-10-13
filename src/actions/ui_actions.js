import {
    RENDER_SEARCH_BUTTON,
    NAME_RIGHT_BUTTON_COLOR,
    NAME_RIGHT_BUTTON_STATUS,
    STATUS_BAR_CONFIG
} from './types';

export const showSearchButton = text => {
    return {
        type: RENDER_SEARCH_BUTTON,
        payload: text
    };
};

export const uiNameRightButtonColor = text => {
    return {
        type: NAME_RIGHT_BUTTON_COLOR,
        payload: text
    };
};

export const uiNameRightButtonStatus = text => {
    return {
        type: NAME_RIGHT_BUTTON_STATUS,
        payload: text
    };
};

export const statusBarChange = text => {
    return {
        type: STATUS_BAR_CONFIG,
        payload: text
    };
};

