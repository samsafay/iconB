import {
  FETCH_RESTAURANTS,
  MANUAL_ADDRESS_CHANGED_BOX,
  SEARCH_RESTAURANTS
} from '../actions/types';

const INITIAL_STATE = {
  hits: null,
  address_hits: null,
  location_hits: null
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_RESTAURANTS:
      return { ...state, hits: action.payload };
    case SEARCH_RESTAURANTS:
      return { ...state, location_hits: action.payload };
    case MANUAL_ADDRESS_CHANGED_BOX:
      return { ...state, address_hits: action.payload };
    default:
      return state;
  }
}
