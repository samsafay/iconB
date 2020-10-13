import React from "react";
import EStyleSheet from "react-native-extended-stylesheet";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
// import { AppLoading, Asset, FileSystem } from 'expo';
// import { StatusBar } from 'react-native';
import {
  Provider,
  // connect
} from "react-redux";
// import { addNavigationHelpers } from 'react-navigation';

import firebase from "firebase";
import store from "./src/store";
import RootStack from "./src/config/instaTab";
import { FIREBASE_CONFIG_API } from "../config/apiKeys";

EStyleSheet.build({
  $mainColor: "#b6d6ef",
  $activeTintColor: "#3478f6",
  $starColor: "#F6BA00",
  $white: "#ffffff",
  $inputText: "#797979",
  $primaryText: "#262626",
  $subtleText: "#9a9a9a",
  $sText: "#737373",
  $primaryFont: 16,
  $secondaryFont: 14,
  $borderColor: "#c7c7c7",
  $lightGray: "#f0f0f0",
  $chatSubtleText: "#959595",
  $chatReplyColor: "#0285C9",
  $chatReplyHighlight: "#ECF5FE",
  $chatPrimaryText: "#27282C",
  $chatBodyText: "#303032",
  $chatHashTagColor: "#606062",
  $avatarRadius: 5,
  $chatRowTime: "#A9A9A9",
  // $outline: 1
});

const settings = {
  timestampsInSnapshots: true,
};

// // Old:
// const date = snapshot.get('created_at');
// // New:
// const timestamp = snapshot.get('created_at');
// const date = timestamp.toDate();

// const AppReduxComponent = ({ dispatch, nav }) => (
//   <RootStack
//     navigation={addNavigationHelpers({
//       dispatch,
//       state: nav
//     })}
//   />
// );

// const mapStateToProps = (state) => ({
//   nav: state.nav
// });

// const AppWithReduxNavigation = connect(mapStateToProps)(AppReduxComponent);

export default class App extends React.Component {
  state = {
    facebookToken: null,
    firebaseUser: "",
    uid: "",
    isLoadingComplete: false,
  };

  async componentWillMount() {
    try {
      await firebase.initializeApp(FIREBASE_CONFIG_API);
      await firebase.firestore().settings(settings);
      // firebase.firestore.setLogLevel('debug');
      // StatusBar.setHidden(false);
      // StatusBar.setBarStyle('light-content');
      // console.disableYellowBox = true;
      // await firebase.auth().signInAnonymously();
    } catch (err) {
      console.log("err", err);
    }
  }

  render() {
    return (
      <ActionSheetProvider>
        <Provider store={store}>
          <RootStack />
        </Provider>
      </ActionSheetProvider>
    );
  }
}
