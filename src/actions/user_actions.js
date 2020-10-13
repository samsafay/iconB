import { Alert } from 'react-native';
import { maybeOpenURL } from 'react-native-app-link';
import {
  Location,
  Permissions
} from 'expo';
import {
  REGION_CHANGED,
  NAVIGATION_PREF_CHANGED,
  JUMP_TO_NAV_SUCCESS
} from './types';

export const getUserRegion = () => async dispatch => {
  try {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      Alert.alert('We need to know your location, to show you the nearby places...');
    }
    const location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 });
    const lat = location.coords.latitude;
    const lon = location.coords.longitude;
    const accuracy = location.coords.accuracy;
    const oneDegreeOfLongitudeInMeters = 111.32;
    const circumference = 40075 / 360;
    const latDelta = accuracy * (1 / (Math.cos(lat) * circumference));
    const lonDelta = accuracy / oneDegreeOfLongitudeInMeters;
    const region = {
      latitude: lat,
      longitude: lon,
      latitudeDelta: latDelta,
      longitudeDelta: lonDelta
    };
    dispatch({ type: REGION_CHANGED, payload: region });
  } catch (e) {
    console.log(e);
  }
};

export const regionChanged = (region) => {
  return {
    type: REGION_CHANGED,
    payload: region
  };
};

export const navigationPref = pref => {
  return {
    type: NAVIGATION_PREF_CHANGED,
    payload: pref
  };
};

export const jumpToNav = (_geoloc, navPref) => {
  const googleConfig = {
    appName: 'google maps',
    appStoreId: 'id585027354',
    playStoreId: ''
  };
  const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${_geoloc.lat},${_geoloc.lng}&travelmode=driving`;
  const wazeConfig = {
    appName: 'waze',
    appStoreId: 'id323229106',
    playStoreId: ''
  };
  const wazeUrl = `https://waze.com/ul?ll=${_geoloc.lat},${_geoloc.lng}`;

  const appleConfig = {
    appName: 'apple maps',
    appStoreId: '',
    playStoreId: ''
  };
  const appleUrl = `http://maps.apple.com/?daddr=${_geoloc.lat},${_geoloc.lng}`;

  switch (navPref) {
    case 'Waze': {
      maybeOpenURL(wazeUrl, wazeConfig);
      return {
        type: JUMP_TO_NAV_SUCCESS,
      };
    }
    case 'Apple': {
      maybeOpenURL(appleUrl, appleConfig);
      return {
        type: JUMP_TO_NAV_SUCCESS,
      };
    }
    default: {
      maybeOpenURL(googleUrl, googleConfig);
      return {
        type: JUMP_TO_NAV_SUCCESS,
      };
    }
  }
};
