import firebase from 'firebase';
import 'firebase/firestore';
import { AsyncStorage, Alert } from 'react-native';
import { Facebook, Google } from 'expo';
import axios from 'axios';
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
  AUTH_USER,
  MAP_LOADED
} from './types';

// How to use AsyncStorage:
// AsyncStorage.setItem('fb_token', token);
// AsyncStorage.getItem('fb_token');
const getTimestamp = () => {
  return firebase.firestore.FieldValue.serverTimestamp();
};

export const loginStatus = () => async dispatch => {
  await firebase.auth().onAuthStateChanged(user => {
    dispatch({ type: AUTH_USER, payload: user });
  });
};

export const facebookLogin = () => async dispatch => {
  const token = await AsyncStorage.getItem('fb_token');

  if (token) {
    // Dispatch an action saying FB login is done
    dispatch({ type: FACEBOOK_LOGIN_SUCCESS, payload: token });
  } else {
    // Start up FB Login process
    doFacebookLogin(dispatch);
  }
};

export const googleLogin = () => async dispatch => {
  const token = await AsyncStorage.getItem('goog_token');

  if (token) {
    // Dispatch an action saying FB login is done
    dispatch({ type: GOOGLE_LOGIN_SUCCESS, payload: token });
  } else {
    // Start up FB Login process
    doGoogleLogin(dispatch);
  }
};

const doGoogleLogin = async dispatch => {
  try {
    const { type, idToken, accessToken } = await Google.logInAsync({
      iosStandaloneAppClientId: '97832581295-s77dvnqlp4bf9vu8uv2h9vlr08l3vpti.apps.googleusercontent.com',
      androidStandaloneAppClientId: '97832581295-ak5vu9dd8qdodpmkv9mofgedba0e80rk.apps.googleusercontent.com',
      webClientId: '97832581295-d2fr68nuq7nl8oqjdqsgnsvak9hvakrf.apps.googleusercontent.com',
      androidClientId: '1055955162844-65b7lpg0fie9agsj11n4gvlngojklu3s.apps.googleusercontent.com',
      iosClientId: '97832581295-mh0c168kaotj4pag54f26oliutliui51.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
    });

    if (type === 'success') {
      await AsyncStorage.setItem('goog_token', accessToken);
      // const idToken = '1055955162844-0e77ndlnt8i7pk14lue6rjkkm4mtjkdi.apps.googleusercontent.com';
      const credential = await firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
      await firebase.auth().signInAndRetrieveDataWithCredential(credential);
      const { currentUser: { uid, displayName, email, photoURL } } = firebase.auth();
      await firebase.firestore().collection('users').doc(uid).set({ displayName, email, photoURL, dateAdded: getTimestamp() });
      dispatch({ type: GOOGLE_LOGIN_SUCCESS, payload: accessToken });
    }

    if (type === 'cancel') {
      return dispatch({ type: GOOGLE_LOGIN_FAIL, payload: true });
    }
  } catch (err) {
    Alert.alert(err.message);
  }
};

const doFacebookLogin = async dispatch => {
  try {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync('507732326287067', {
      permissions: ['public_profile', 'email'],
      behavior: 'system'
    });

    if (type === 'cancel') {
      return dispatch({ type: FACEBOOK_LOGIN_FAIL });
    }

    await AsyncStorage.setItem('fb_token', token);
    const credential = await firebase.auth.FacebookAuthProvider.credential(token);
    await firebase.auth().signInAndRetrieveDataWithCredential(credential);
    const { currentUser: { uid, displayName, email, photoURL } } = firebase.auth();
    await firebase.firestore().collection('users').doc(uid).set({ displayName, email, photoURL, dateAdded: getTimestamp() });
    dispatch({ type: FACEBOOK_LOGIN_SUCCESS, payload: token });
  } catch (error) {
    Alert.alert(error.message);
  }
};

export const facebookLoginInfo = () => async dispatch => {
  const token = await AsyncStorage.getItem('fb_token');

  if (token) {
    // Dispatch an action saying FB login is done
    const response = await axios(`https://graph.facebook.com/me?fields=name,gender,picture&access_token=${token}`);
    dispatch({ type: FACEBOOK_LOGIN_INFO, payload: response.data });
    // todo: status 200 check if something elese show an error
  }
};

export const nameChanged = (text) => {
  return {
    type: NAME_CHANGED,
    payload: text
  };
};

export const emailChanged = (text) => {
  return {
    type: EMAIL_CHANGED,
    payload: text
  };
};

export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text
  };
};

export const loginUser = ({ email, password }) => async dispatch => {
  try {
    const user = await firebase.auth().signInWithEmailAndPassword(email, password);
    dispatch({ type: LOGIN_USER_SUCCESS, payload: user });
  } catch (e) {
    Alert.alert(e.message);
  }
};

export const createUser = ({ email, password, name }) => async dispatch => {
  try {
    const user = await firebase.auth().createUserWithEmailAndPassword(email, password);
    user.updateProfile({ displayName: name });
    firebase.database().ref(`/users/${user.uid}`).set({ name, email, emailVerified: user.emailVerified });
    dispatch({ type: CREATE_USER_SUCCESS, payload: user });
  } catch (e) {
    Alert.alert(e.message);
  }
};

export const setMapLoaded = () => {
  return {
    type: MAP_LOADED,
    payload: true
  };
};
