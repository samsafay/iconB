import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  StatusBar
} from 'react-native';
import {
  Ionicons,
  Feather,
} from '@expo/vector-icons';
import { StackNavigator, TabNavigator } from 'react-navigation';
import HomeScreen from '../screens/Home/HomeScreen';
import PlaceDetailScreen from '../screens/Home/PlaceDetailScreen';

import AuthScreen from '../screens/Report/AuthScreen';
import RatingDetailScreen from '../screens/Report/RatingDetailScreen';
import WhereYouAtScreen from '../screens/Report/WhereYouAtScreen';
import AddPlaceNameScreen from '../screens/Report/AddPlaceNameScreen';
import AddAddressScreen from '../screens/Report/AddAddressScreen';
import ReportScreen from '../screens/Report/ReportScreen';
import PlaceSearchScreen from '../screens/Report/PlaceSearchScreen';


import SettingsScreen from '../screens/Settings/SettingsScreen';
import NavPrefScreen from '../screens/Settings/NavPrefScreen';

import AddPlaceManualScreen from '../screens/Report/AddPlaceManualScreen';
import { MODEL, HEIGHT } from '../config/utils';
//console.log(MODEL, WIDTH, HEIGHT);


/*
 * Styles related to our custom tab bar
 */
const activeTintColor = '#3478f6';
const inactiveTintColor = '#929292';
const styles = StyleSheet.create({
  tabBar: {
    height: (MODEL === 'iPhone X' || HEIGHT === 812) ? 85 : 49,
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, .3)',
    backgroundColor: '#F7F7F7',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: (MODEL === 'iPhone X' || HEIGHT === 812) ? 'flex-start' : 'center',
    marginTop: (MODEL === 'iPhone X' || HEIGHT === 812) ? 10 : null
  },
});


/*
 * Ultra simple custom tabbar. This doesn't respect all the settings/options of the normal
 * TabBar component. If you want to see all that's possible with the default please check out the
 * source: https://github.com/react-community/react-navigation/blob/master/src/views/TabView/TabBarBottom.js
 *
 * This one will simply render the route name for the tab item and check if the current tab is the
 * "Capture" tab, if so then open the modal rather than jump to the index of the tab. You could make
 * this much more configurable if you wanted.
 */
class TabBar extends Component {
  renderItem = (route, index) => {
    const { navigation, jumpToIndex } = this.props;

    const isCapture = route.routeName === 'Report';

    const focused = index === navigation.state.index;
    //based on the tab focused it changes the color of the icon to active or inactive tint color
    const color = focused ? activeTintColor : inactiveTintColor;
    // This return renders the tab, checks rout name and changes the color text and its icon
    return (
      <TouchableWithoutFeedback
        key={route.key}
        style={styles.tab}
        onPress={() => isCapture ? navigation.navigate('CaptureModal') : jumpToIndex(index)}
      >
        <View style={styles.tab}>
          {route.routeName === 'Home' ? <Ionicons name="md-home" size={24} color={color} /> : null}
          {route.routeName === 'Activity' ? <Feather name="activity" size={24} color={color} /> : null}
          {route.routeName === 'Report' ? <Ionicons name="ios-add-circle" size={24} color={color} /> : null}
          {route.routeName === 'Chat' ? <Ionicons name="ios-chatboxes" size={24} color={color} /> : null}
          {route.routeName === 'Settings' ? <Ionicons name="ios-settings" size={24} color={color} /> : null}
          <Text style={{ color }}>{route.routeName}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    // console.log(this.props);
    const { navigation } = this.props;

    const { routes } = navigation.state;

    return (
      <View style={styles.tabBar}>
        {routes && routes.map(this.renderItem)}
      </View>
    );
  }
}

/*
 * Here we actuall create our TabNavigator. As you can see we're not doing anything fancy.
 * To prevent an error I've simple passed a View to the Capture tab - this won't actually be seen
 * so make it as "cheap" as possible
 */

const HomeStack = StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  PlaceDetail: {
    screen: PlaceDetailScreen,
  },
  ratingDetailHome: {
    screen: RatingDetailScreen,
  },
}, {
    headerMode: 'none',
    lazy: true
  });

const SettingsStack = StackNavigator({
  Settings: {
    screen: SettingsScreen,
  },
  NavPref: {
    screen: NavPrefScreen,
  },
  Auth: {
    screen: AuthScreen,
  },
}, {
    headerMode: 'none',
    // lazy: true
  });

const Tabs = TabNavigator(
  {
    Home: {
      screen: HomeStack,
    },
    Report: {
      screen: AuthScreen,
    },
    Settings: {
      screen: SettingsStack,
    },
  },
  {
    lazy: true,
    // Instagram has the tabbar on the bottom on iOS and Android
    tabBarPosition: 'bottom',
    // Specify our custom navbar
    tabBarComponent: TabBar,
  }
);


/*
 * Place the capture screen into a stack navigator so that we can easily use the existing header.
 * Why reinvent the wheel?
 */
const CaptureStack = StackNavigator({
  Capture: {
    screen: AuthScreen,
  },
  ratingDetail: {
    screen: RatingDetailScreen,
  },
  whereYouAt: {
    screen: WhereYouAtScreen
  },
  addPlaceName: {
    screen: AddPlaceNameScreen,
  },
  addAddress: {
    screen: AddAddressScreen,
  },
  report: {
    screen: ReportScreen,
  },
  placeSearch: {
    screen: PlaceSearchScreen,
  },
  addPlace: {
    screen: AddPlaceManualScreen,
  },
}, {
    headerMode: 'none',
    lazy: true
  }
);

/*
 * We need a root stack navigator with the mode set to modal so that we can open the capture screen
 * as a modal. Defaults to the Tabs navigator.
 */
const RootStack = StackNavigator(
  {
    Tabs: {
      screen: Tabs,
    },
    CaptureModal: {
      screen: CaptureStack,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
  },
  {
    headerMode: 'none',
    mode: 'modal',
    cardStyle: { paddingTop: StatusBar.currentHeight },
    lazy: true
  }
);

export default RootStack;
