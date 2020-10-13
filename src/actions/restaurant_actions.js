import firebase from "firebase";
import "firebase/firestore";
import { Location, Permissions } from "expo";
import axios from "axios";
import algoliasearch from "algoliasearch/reactnative";
import haversine from "haversine";
import { Alert } from "react-native";
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
  FETCH_RESTAURANTS,
  RESTAURANT_ADD_SUCCESS,
  RATING_ADD_SUCCESS,
  RESET_PLACE_NAME,
  SEARCH_RESTAURANTS,
  MANUAL_PLACE_NAME_CHANGED,
  MANUAL_ADDRESS_CHANGED,
  MANUAL_CITY_CHANGED,
  MANUAL_ZIPCODE_CHANGED,
  MANUAL_ADDRESS_CHANGED_BOX,
  REVERSED_ADDRESS,
  DESTINATION_CHANGED,
  PLACE_REVIEWS_FETCH_SUCCESS,
} from "./types";
import {
  GOOGLE_DIRECTIONS_API,
  ALGOLIA_APP_ID,
  ALGOLIA_API,
  ALGOLIA_APP_ID_2,
  ALGOLIA_API_2,
} from "../config/apiKeys";

const getTimestamp = () => {
  return firebase.firestore.FieldValue.serverTimestamp();
};

const getUserLocation = async () => {
  const { status } = await Permissions.askAsync(Permissions.LOCATION);
  //TODO: a check mechanism in props to see if the user has allowed location accesss
  if (status !== "granted") {
    Alert.alert(
      "We need to know your location, to show you the nearby places..."
    );
  }
  const location = await Location.getCurrentPositionAsync({
    enableHighAccuracy: true,
  });
  const lat = location.coords.latitude;
  const lng = location.coords.longitude;
  const _geoloc = {
    lat,
    lng,
  };
  return _geoloc;
};

const decode = (t, e) => {
  let n;
  let o;
  let u = 0;
  let l = 0;
  let r = 0;
  let d = [];
  let h = 0;
  let i = 0;
  let a = null;
  let c = Math.pow(10, e || 5);
  for (
    n,
      o,
      u = 0,
      l = 0,
      r = 0,
      d = [],
      h = 0,
      i = 0,
      a = null,
      c = Math.pow(10, e || 5);
    u < t.length;

  ) {
    a = null;
    h = 0;
    i = 0;
    do {
      a = t.charCodeAt(u++) - 63;
      i |= (31 & a) << h;
      h += 5;
    } while (a >= 32);
    n = 1 & i ? ~(i >> 1) : i >> 1;
    h = i = 0;
    do {
      a = t.charCodeAt(u++) - 63;
      i |= (31 & a) << h;
      h += 5;
    } while (a >= 32);
    o = 1 & i ? ~(i >> 1) : i >> 1;
    l += n;
    r += o;
    d.push([l / c, r / c]);
  }

  const dArray = d.map((ti) => {
    return {
      latitude: ti[0],
      longitude: ti[1],
    };
  });
  return dArray;
};

export const fetchPlaceReviews = (placeID) => async (dispatch) => {
  try {
    await firebase
      .firestore()
      .collection("places")
      .doc(placeID)
      .collection("ratings")
      .onSnapshot((docSnapshot) => {
        const reviews = docSnapshot.docs.map((doc, i) => {
          return { ...doc.data(), id: doc.id, i };
        });
        dispatch({ type: PLACE_REVIEWS_FETCH_SUCCESS, payload: reviews });
      });
  } catch (err) {
    Alert.alert(err.message);
  }
};

export const updateRestaurantRating = ({ placeID, rating, comment }) => async (
  dispatch
) => {
  try {
    //Todo: check if the user is located and get his position
    // console.log('[updateRestaurantRating] comment', comment);
    if (firebase.auth().currentUser) {
      const {
        currentUser: { uid, photoURL, displayName },
      } = firebase.auth();
      await firebase
        .firestore()
        .collection("places")
        .doc(placeID)
        .collection("ratings")
        .doc(`${placeID}_${uid}`)
        .set({
          displayName,
          uid,
          photoURL,
          rating,
          comment,
          dateAdded: getTimestamp(),
        });
      dispatch({ type: RESTAURANT_ADD_SUCCESS });
    } else {
      Alert.alert(
        "In order for us to take your review, we need you to signup!"
      );
    }
  } catch (err) {
    Alert.alert(err.message);
  }
};

export const addNewRestaurantAndRatingWithGeo = ({
  rating,
  is_user_at_location,
  name,
  address,
  city,
  comment,
}) => async (dispatch) => {
  try {
    //Todo: check if the user is located and get his position
    // console.log('[addNewRestaurantAndRatingWithGeo] comment', comment);
    const _geoloc = await getUserLocation(address);
    const {
      currentUser: { uid, photoURL, displayName },
    } = firebase.auth();
    await firebase
      .firestore()
      .collection("places")
      .add({
        createdby: uid,
        name,
        avgRating: rating,
        numRatings: 0,
        address,
        city,
        _geoloc,
        dateAdded: getTimestamp(),
      })
      .then((docRef) =>
        firebase
          .firestore()
          .collection("places")
          .doc(docRef.id)
          .collection("ratings")
          .doc(`${docRef.id}_${uid}`)
          .set({
            displayName,
            photoURL,
            uid,
            rating,
            comment,
            is_user_at_location,
            dateAdded: getTimestamp(),
          })
      );
    dispatch({ type: RESTAURANT_ADD_SUCCESS });
  } catch (err) {
    Alert.alert(err.message);
  }
};

export const addNewRestaurantAndRatingWithAddress = ({
  rating,
  is_user_at_location,
  name,
  address,
  city,
  comment,
  _geoloc,
}) => async (dispatch) => {
  try {
    //Todo: check if the user is located and get his position
    // console.log('[addNewRestaurantAndRatingWithAddress] comment', comment);
    const {
      currentUser: { uid, photoURL, displayName },
    } = firebase.auth();
    await firebase
      .firestore()
      .collection("places")
      .add({
        createdby: uid,
        name,
        avgRating: rating,
        numRatings: 0,
        address,
        city,
        _geoloc,
        dateAdded: getTimestamp(),
      })
      .then((docRef) =>
        firebase
          .firestore()
          .collection("places")
          .doc(docRef.id)
          .collection("ratings")
          .doc(`${docRef.id}_${uid}`)
          .set({
            displayName,
            photoURL,
            uid,
            rating,
            comment,
            is_user_at_location,
            dateAdded: getTimestamp(),
          })
      );
    dispatch({ type: RESTAURANT_ADD_SUCCESS });
  } catch (err) {
    Alert.alert(err.message);
  }
};

export const restaurantsFetch = () => async (dispatch) => {
  try {
    const response = await firebase.firestore().collection("places").get();
    // dispatch({ type: RESTAURANTS_FETCH_SUCCESS, payload: response.docs[0].data() });
    response.forEach((doc) => {
      dispatch({
        type: RESTAURANTS_FETCH_SUCCESS,
        payload: { ...doc.data(), id: doc.id },
      });
      // dispatch({ type: RESTAURANTS_FETCH_SUCCESS, payload: { [doc.id]: doc.data() } });
    });
  } catch (err) {
    Alert.alert(err.message);
  }
  // const db = firebase.firestore();
};

export const fetchRestaurants = ({
  latitude,
  longitude,
  latitudeDelta,
  longitudeDelta,
}) => async (dispatch) => {
  try {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    //TODO: a check mechanism in props to see if the user has allowed location accesss
    if (status !== "granted") {
      Alert.alert(
        "We need to know your location, to show you the nearby places..."
      );
    }
    //I get the original lat and long because I want to show the route from user's
    //original location not the region changed
    const location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: false,
    });
    const originalLatitude = location.coords.latitude;
    const originalLongitude = location.coords.longitude;

    const client = algoliasearch(ALGOLIA_APP_ID_2, ALGOLIA_API_2);
    const index = client.initIndex("places");
    // const { width, height } = Dimensions.get('window');
    // const ASPECT_RATIO = width / height;
    // const latitudeDelta = 0.0922;
    // const longitudeDelta = latitudeDelta * ASPECT_RATIO;
    // const aroundLatLng = `${latitude}, ${longitude}`;
    // console.log(aroundLatLng);
    const edgeRatio = 1;
    const p1Lat =
      parseFloat(latitude) + (parseFloat(latitudeDelta) * edgeRatio) / 2;
    const p1Lng =
      parseFloat(longitude) - (parseFloat(longitudeDelta) * edgeRatio) / 2;
    const p2Lat =
      parseFloat(latitude) - (parseFloat(latitudeDelta) * edgeRatio) / 2;
    const p2Lng =
      parseFloat(longitude) + (parseFloat(longitudeDelta) * edgeRatio) / 2;
    const boundingBox = [
      p1Lat, //parseFloat(p1Lat),
      p1Lng, //parseFloat(p1Lng),
      p2Lat, //parseFloat(p2Lat),
      p2Lng, //parseFloat(p2Lng),
    ];
    const data = await index.search({
      hitsPerPage: 20,
      // aroundPrecision: 1500,
      // aroundLatLng,
      // aroundRadius: 1500,
      insideBoundingBox: [boundingBox],
    });
    //TODO: auto radius implementation in case no results
    if (data.hits.length === 0) {
      Alert.alert("Not enough results to show you!");
    }
    /*
    const newData = await Promise.all(data.hits.map(async item => {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originalLatitude},${originalLongitude}&destination=${item._geoloc.lat},${item._geoloc.lng}&key=${GOOGLE_DIRECTIONS_API}&mode=driving&language=en`;
      // console.log(url);
      const res = await axios(url);
      // console.log(res);
      const duration = res.data.routes['0'].legs['0'].duration.text;
      const distance = res.data.routes['0'].legs['0'].distance.text;
      const polyline = res.data.routes['0'].overview_polyline.points;

      const addedData = item;
      addedData.duration = duration;
      addedData.distance = distance;
      addedData.polyline = polyline;
      return addedData;
    }));
    */
    const newData = data.hits.map((item) => {
      const start = {
        latitude: originalLatitude,
        longitude: originalLongitude,
      };
      const end = {
        latitude: item._geoloc.lat,
        longitude: item._geoloc.lng,
      };
      const distance = haversine(start, end);
      const addedData = item;
      addedData.distance = distance;
      return addedData;
    });
    dispatch({ type: FETCH_RESTAURANTS, payload: newData });
  } catch (err) {
    console.log(err);
  }
};

export const getDirection = (destination) => async (dispatch) => {
  const origin = await getUserLocation();
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=${GOOGLE_DIRECTIONS_API}&mode=driving&language=en`;
  const res = await axios(url);
  const polyline = res.data.routes["0"].overview_polyline.points;
  const decoded = decode(polyline);
  dispatch({ type: DESTINATION_CHANGED, payload: decoded });
};

export const getReversedAddress = () => async (dispatch) => {
  try {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    //TODO: a check mechanism in props to see if the user has allowed location accesss
    if (status !== "granted") {
      Alert.alert(
        "We need to know your location, to show you the nearby places..."
      );
    }
    const location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;
    const reversedLocation = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    //TODO: auto radius implementation in case no results
    // if (data.hits.length === 0) { Alert.alert('Not enough results to show you!'); }
    dispatch({ type: REVERSED_ADDRESS, payload: reversedLocation });
  } catch (err) {
    console.log(err);
  }
};

export const algoliaSearchPlace = (query) => async (dispatch) => {
  try {
    // mechanism to not allow empty string to return geberish from algolia place api
    if (query === "") {
      dispatch({ type: MANUAL_ADDRESS_CHANGED_BOX, payload: "" });
    } else {
      const places = await algoliasearch.initPlaces(
        ALGOLIA_APP_ID,
        ALGOLIA_API
      );
      const data = await places.search({
        query: query,
        type: "address",
        hitsPerPage: 5,
      });
      // const results = { address_hits: [...data.hits] };
      if (data.hits.length === 0) {
        Alert.alert("Not enough results to show you!");
      }
      dispatch({ type: MANUAL_ADDRESS_CHANGED_BOX, payload: data });
    }
  } catch (err) {
    // console.log(err);
  }
};

export const searchRestaurants = (text, hitNumber) => async (dispatch) => {
  try {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    //TODO: a check mechanism in props to see if the user has allowed location accesss
    if (status !== "granted") {
      Alert.alert(
        "We need to know your location, to show you the nearby places..."
      );
    }
    const location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;

    const client = algoliasearch(ALGOLIA_APP_ID_2, ALGOLIA_API_2);
    const index = client.initIndex("places");
    // const { width, height } = Dimensions.get('window');
    // const ASPECT_RATIO = width / height;
    // const latitudeDelta = 0.0922;
    // const longitudeDelta = latitudeDelta * ASPECT_RATIO;
    const aroundLatLng = `${latitude}, ${longitude}`;
    // console.log(aroundLatLng);
    const data = await index.search(text, {
      hitsPerPage: hitNumber,
      // aroundPrecision: 1500,
      aroundLatLng,
      // aroundRadius: 800,
    });
    //TODO: auto radius implementation in case no results
    // if (data.hits.length === 0) { Alert.alert('Not enough results to show you!'); }
    // const { hits: results } = data;
    // const results = { location: [...data.hits] };
    dispatch({ type: SEARCH_RESTAURANTS, payload: data });
  } catch (err) {
    // console.log(err);
  }
};

// export const addRating = ({ rating, comment, dateAdded }) => async (
//   dispatch
// ) => {
//   try {
//     const restaurantID = "0DZ2DKcO4TvqPt96j6Le";
//     const { currentUser } = firebase.auth();
//     // Custom doc ID for relationship
//     const ratingPath = `ratings/${currentUser.uid}_${restaurantID}`;
//     await firebase.firestore().doc(ratingPath).set({
//       rating,
//       comment,
//       dateAdded,
//       restaurantID,
//       userID: currentUser.uid,
//     });
//     // await firebase.firestore().collection('ratings').add({ rating, comment, dateAdded });
//     dispatch({ type: RATING_ADD_SUCCESS });
//   } catch (err) {
//     Alert.alert(err.message);
//   }
// };

// export const addRatingAndUpdateAverageRating = ({
//   rating,
//   comment,
//   dateAdded,
// }) => async (dispatch) => {
//   const restaurantID = "0DZ2DKcO4TvqPt96j6Le";
//   const { currentUser } = await firebase.auth();
//   const ratingPath = `ratings/${currentUser.uid}_${restaurantID}`;
//   // await firebase.firestore().collection('places').doc(restaurantID).collection('ratings').add(rating);

//   // const collection = firebase.firestore().collection('places');
//   // const document = collection.doc(restaurantID);

//   const collection = await firebase
//     .firestore()
//     .collection("places")
//     .doc(restaurantID);
//   const document = await firebase.firestore().doc(ratingPath);
//   // await document.set({ rating, comment, dateAdded });

//   document.set({ rating, comment, dateAdded }).then(() => {
//     return firebase.firestore().runTransaction((transaction) => {
//       return transaction.get(collection).then((doc) => {
//         const data = doc.data();

//         const newAverage =
//           (data.numRatings * data.avgRating + rating) / (data.numRatings + 1);

//         return transaction.update(collection, {
//           numRatings: data.numRatings + 1,
//           avgRating: newAverage,
//           comment,
//         });
//       });
//     });
//   });
//   dispatch({ type: RATING_ADD_SUCCESS });
// };

// export const destinationChanged = text => {
//   return {
//     type: DESTINATION_CHANGED,
//     payload: text
//   };
// };

export const placeRatingChanged = (text) => {
  return {
    type: PLACE_RATING_CHANGED,
    payload: text,
  };
};

export const placeUserLocationChanged = (text) => {
  return {
    type: PLACE_USER_LOCATION,
    payload: text,
  };
};

export const placeNameChanged = (text) => {
  return {
    type: PLACE_NAME_CHANGED,
    payload: text,
  };
};

export const placeAddressNameChanged = (text) => {
  return {
    type: PLACE_ADDRESS_CHANGED,
    payload: text,
  };
};

export const placeSelectedAddressNameChanged = (text) => {
  return {
    type: PLACE_SELECTED_ADDRESS_CHANGED,
    payload: text,
  };
};

export const placeIdChanged = (text) => {
  return {
    type: PLACE_ID_CHANGED,
    payload: text,
  };
};

export const placeCityNameChanged = (text) => {
  return {
    type: PLACE_CITY_CHANGED,
    payload: text,
  };
};

export const placeCommentChanged = (text) => {
  return {
    type: PLACE_COMMENT_CHANGED,
    payload: text,
  };
};

export const resetPlaceName = () => {
  return {
    type: RESET_PLACE_NAME,
    payload: null,
  };
};

export const manualPlaceNameChanged = (text) => {
  return {
    type: MANUAL_PLACE_NAME_CHANGED,
    payload: text,
  };
};

//in use
export const manualAddressChanged = (text) => {
  return {
    type: MANUAL_ADDRESS_CHANGED,
    payload: text,
  };
};

export const manualCityChanged = (text) => {
  return {
    type: MANUAL_CITY_CHANGED,
    payload: text,
  };
};

export const manualZipcodeChanged = (text) => {
  return {
    type: MANUAL_ZIPCODE_CHANGED,
    payload: text,
  };
};
