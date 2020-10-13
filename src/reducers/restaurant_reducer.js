import {
  PLACE_RATING_CHANGED,
  PLACE_USER_LOCATION,
  PLACE_NAME_CHANGED,
  PLACE_ADDRESS_CHANGED,
  PLACE_SELECTED_ADDRESS_CHANGED,
  PLACE_ID_CHANGED,
  PLACE_CITY_CHANGED,
  PLACE_COMMENT_CHANGED,
  RESTAURANTS_FETCH_SUCCESS,
  RESET_PLACE_NAME,
  MANUAL_PLACE_NAME_CHANGED,
  MANUAL_ADDRESS_CHANGED,
  MANUAL_CITY_CHANGED,
  MANUAL_ZIPCODE_CHANGED,
  MANUAL_ADDRESS_CHANGED_BOX,
  REVERSED_ADDRESS,
  DESTINATION_CHANGED,
  PLACE_REVIEWS_FETCH_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
  place_rating: 1,
  place_is_user_at_location: true,
  place_name: '',
  place_address: '',
  place_selected_address: '',
  place_id: '',
  place_city: '',
  place_comment: null,
  place_reviews: null,
  name: '',
  zipcode: '',
  search_hits: {},
  reverseAddress: [],
  destination: null
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case PLACE_REVIEWS_FETCH_SUCCESS:
      return { ...state, place_reviews: action.payload };
    case RESTAURANTS_FETCH_SUCCESS:
      return action.payload;
    case PLACE_RATING_CHANGED:
      return { ...state, place_rating: action.payload };
    case PLACE_USER_LOCATION:
      return { ...state, place_is_user_at_location: action.payload };
    case PLACE_NAME_CHANGED:
      return { ...state, place_name: action.payload };
    case PLACE_ADDRESS_CHANGED:
      return { ...state, place_address: action.payload };
    case PLACE_SELECTED_ADDRESS_CHANGED:
      return { ...state, place_selected_address: action.payload };
    case PLACE_ID_CHANGED:
      return { ...state, place_id: action.payload };
    case PLACE_CITY_CHANGED:
      return { ...state, place_city: action.payload };
    case PLACE_COMMENT_CHANGED:
      return { ...state, place_comment: action.payload };
    case RESET_PLACE_NAME:
      return { ...state, place: action.payload };
    case MANUAL_PLACE_NAME_CHANGED:
      return { ...state, name: action.payload };
    case MANUAL_ADDRESS_CHANGED:
      return { ...state, address: action.payload };
    case MANUAL_CITY_CHANGED:
      return { ...state, city: action.payload };
    case MANUAL_ZIPCODE_CHANGED:
      return { ...state, zipcode: action.payload };
    case MANUAL_ADDRESS_CHANGED_BOX:
      return { ...state, search_hits: action.payload };
    case REVERSED_ADDRESS:
      return { ...state, reverseAddress: action.payload };
    case DESTINATION_CHANGED:
      return { ...state, destination: action.payload };
    default:
      return state;
  }
}
