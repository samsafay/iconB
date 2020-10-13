import {
  RENDER_SEARCH_BUTTON,
  NAME_RIGHT_BUTTON_COLOR,
  NAME_RIGHT_BUTTON_STATUS,
  STATUS_BAR_CONFIG
} from '../actions/types';

const INITIAL_STATE = {
  renderSearch: null,
  nameRightButtonColor: 'gray',
  nameRightButtonStatus: true,
  statusBarConfig: {
    hidden: false,
    style: 'light-content'
  }
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case RENDER_SEARCH_BUTTON:
      return { ...state, renderSearch: action.payload };
    case NAME_RIGHT_BUTTON_COLOR:
      return { ...state, nameRightButtonColor: action.payload };
    case NAME_RIGHT_BUTTON_STATUS:
      return { ...state, nameRightButtonStatus: action.payload };
    case STATUS_BAR_CONFIG:
      return { ...state, statusBarConfig: action.payload };
    default:
      return state;
  }
}

