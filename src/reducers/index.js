import { combineReducers } from 'redux';
import auth from './auth_reducer';
import RestaurantReducer from './restaurant_reducer';
import algolia from './algolia_reducer';
import user from './user_reducer';
import ui from './ui_reducer';
import nav from './nav_reducer';

export default combineReducers({
    auth: auth,
    restaurants: RestaurantReducer,
    algolia,
    user,
    ui,
    nav
});
