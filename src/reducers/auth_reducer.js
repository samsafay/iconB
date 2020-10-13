import {
  FACEBOOK_LOGIN_SUCCESS,
  FACEBOOK_LOGIN_FAIL,
  FACEBOOK_LOGIN_INFO,
  GOOGLE_LOGIN_SUCCESS,
  GOOGLE_LOGIN_FAIL,
  NAME_CHANGED,
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  LOGIN_USER_SUCCESS,
  CREATE_USER_SUCCESS,
  MAP_LOADED,
  AUTH_USER
} from '../actions/types';

const INITIAL_STATE = {
  response: {
    gender: '',
    id: '',
    name: 'Guest User',
    picture: {
      data: {
        is_silhouette: false,
        url: 'https://facebook.github.io/react/img/logo_og.png'
      }
    }
  },
  token: '',
  name: '',
  email: '',
  password: '',
  user: null,
  newuser: null,
  cancelled: false,
  mapLoaded: false,
  auth_user: null
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_USER:
    return { ...state, auth_user: action.payload };
    case FACEBOOK_LOGIN_SUCCESS:
      return { ...state, token: action.payload };
    case FACEBOOK_LOGIN_FAIL:
      return { token: null };
    case FACEBOOK_LOGIN_INFO:
      return { ...state, response: action.payload };
    case GOOGLE_LOGIN_SUCCESS:
      return { ...state, token: action.payload };
    case GOOGLE_LOGIN_FAIL:
      return { ...state, cancelled: true };
    case NAME_CHANGED:
      return { ...state, name: action.payload };
    case EMAIL_CHANGED:
      return { ...state, email: action.payload };
    case PASSWORD_CHANGED:
      return { ...state, password: action.payload };
    case LOGIN_USER_SUCCESS:
      return { ...state, user: action.payload };
    case CREATE_USER_SUCCESS:
      return { ...state, newuser: action.payload };
    case MAP_LOADED:
      return { ...state, mapLoaded: true };

    default:
      return state;
  }
}

