import { createStore, compose, applyMiddleware } from 'redux';
// import logger from 'redux-logger';
import thunk from 'redux-thunk';
// import { composeWithDevTools } from 'redux-devtools-extension';
// import { persistStore, autoRehydrate } from 'redux-persist';
// import { AsyncStorage } from 'react-native';
import reducers from '../reducers';

// const middleware = [thunk];

// if (process.env.NODE_ENV === 'development') {
//   if (__DEV__) {
//   middleware.push(logger);
// }
const store = createStore(
  reducers,
  {},
  compose(
    applyMiddleware(thunk)
    // applyMiddleware(...middleware),
    //autoRehydrate()
  )
);

// persistStore(store, { storage: AsyncStorage, whitelist: ['likedJobs'] });

export default store;

// import { createStore, compose, applyMiddleware } from 'redux';
// import logger from 'redux-logger';
// import thunk from 'redux-thunk';
// // import { persistStore, autoRehydrate } from 'redux-persist';
// // import { AsyncStorage } from 'react-native';
// import reducers from '../reducers';

// const middleware = [thunk];

// // if (process.env.NODE_ENV === 'development') {
// if (__DEV__) {
//   middleware.push(logger);
// }
// // middleware.push(logger);
// const store = createStore(
//   reducers,
//   {},
//   compose(
//     // applyMiddleware(thunk)
//     applyMiddleware(...middleware),
//     //autoRehydrate()
//   )
// );

// // persistStore(store, { storage: AsyncStorage, whitelist: ['likedJobs'] });

// export default store;
