import { Platform } from 'react-native';
import {
  REGION_CHANGED,
  NAVIGATION_PREF_CHANGED
} from '../actions/types';

const INITIAL_STATE = {
  region: null,
  nav_pref: Platform.OS === 'android' ? 'Google' : 'Apple'
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case REGION_CHANGED:
      return { ...state, region: action.payload };
    case NAVIGATION_PREF_CHANGED:
      return { ...state, nav_pref: action.payload };
    default:
      return state;
  }
}
