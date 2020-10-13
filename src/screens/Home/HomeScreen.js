import React from "react";
import {
  Platform,
  View,
  StatusBar,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { MapView, Location, Permissions } from "expo";
import { connect } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import * as actions from "../../actions";
import PlaceListComponent from "../../components/PlaceListComponent";
import { nightStyle } from "../../config/map_style";
import { LOCATION_API } from "../config/apiKeys";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const latitudeDelta = 0.25;
const longitudeDelta = (width / height) * latitudeDelta;

class HomeScreen extends React.Component {
  static navigationOptions = () => ({
    headerStyle: {
      position: "absolute",
      backgroundColor: "transparent",
      top: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      left: 0,
      zIndex: 100,
      right: Platform.OS === "android" ? 0 : null,
    },
    headerBackTitleStyle: {
      opacity: 0,
    },
    headerTintColor: "black",
  });

  state = {
    mapLoaded: false,
    mapFetched: false,
    ready: false,
    region: null,
  };

  async componentWillMount() {
    await this.props.loginStatus();
  }

  // async componentWillMount() {
  //   NetInfo.getConnectionInfo().then((connectionInfo) => {
  //     console.log(connectionInfo);
  //   });
  // console.log(width, height);
  // console.log(Constants, Constants.deviceYearClass);
  // console.log('[HomeScreen] I am componentWillMount');
  // }

  componentDidMount() {
    this._getUserLocation().then((region) =>
      this.props.fetchRestaurants(region)
    );
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setBarStyle("light-content");
    });
  }

  // big improvment on fps
  // returns true if the algolia hits are not equal
  // helps us avoid rerendering when the this.props.region change but the
  // algolia hits don't change

  shouldComponentUpdate(nextProps, nextState) {
    // console.log('I am hit', this.props.algolia === nextProps.algolia);
    return (
      this.props.destination !== nextProps.destination ||
      this.props.renderSearch !== nextProps.renderSearch ||
      // nextProps.renderSearch ||
      nextState.region === null ||
      this.state.region === null ||
      this.props.algolia !== nextProps.algolia ||
      this.props.statusBarConfig !== nextProps.statusBarConfig ||
      this.state.progress !== nextState.progress
    );
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  _getUserLocation = async () => {
    await Location.setApiKey(LOCATION_API);
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    // console.log(status);
    //TODO: a check mechanism in props to see if the user has allowed location accesss
    if (status !== "granted") {
      Alert.alert(
        "We need to know your location, to show you the nearby places..."
      );
    }
    const location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: false,
    });
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;
    const region = {
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta,
    };
    this.setState({
      region,
    });
    return region;
  };

  _findMe = async () => {
    const region = await this._getUserLocation();
    this.map.animateToRegion(region, 1200);
  };

  _fitAllMarkers = (restaurants) => {
    const markers = restaurants.map((restaurant) => {
      return {
        latitude: restaurant._geoloc.lat,
        longitude: restaurant._geoloc.lng,
      };
    });
    const DEFAULT_PADDING = { top: 80, right: 80, bottom: 80, left: 80 };
    this.map.fitToCoordinates(markers, {
      edgePadding: DEFAULT_PADDING,
      animated: false,
    });
  };

  _onRegionChangeComplete = (region) => {
    this.setState({ region });
    if (this.props.renderSearch === null) {
      this.props.showSearchButton(false);
    } else {
      this.props.showSearchButton(true);
    }
  };

  _refetchRestaurants = () => {
    this.props.fetchRestaurants(this.state.region);
    this.props.showSearchButton(false);
  };

  _onPressItem = (data) => {
    // console.log(data);
    this.props.navigation.navigate("PlaceDetail", data);
  };

  _renderItem = ({ item, index }) => (
    <PlaceListComponent
      data={item}
      index={index}
      onPressItem={this._onPressItem}
    />
  );

  _getItemLayout = (data, index) => ({
    length: 0.8 * width - 20,
    offset: (0.8 * width + 20) * index,
    index,
  });

  _handleMarkerPress = (e) => {
    //gets the id of the marker and converts it to number
    const index = Number(e.nativeEvent.id);
    this.flatListRef.scrollToIndex({ animated: true, index, viewPosition: 0 });
    // const decoded = this._decode(this.props.algolia[e.nativeEvent.id].polyline);
    // this.props.destinationChanged(decoded);
    this.props.getDirection(this.props.algolia[e.nativeEvent.id]._geoloc);
  };

  render() {
    if (!this.props.algolia || !this.state.region) {
      return (
        <View style={styles.ActivityContainer}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={this.props.statusBarConfig.hidden}
          barStyle={this.props.statusBarConfig.style}
        />
        <MapView
          ref={(map) => {
            this.map = map;
          }}
          //initialRegion={this.state.region}
          region={this.state.region}
          //initialRegion={this.props.region}
          //onRegionChangeComplete={region => { this._onRegionChangeComplete(region); }}
          onRegionChangeComplete={this._onRegionChangeComplete}
          style={{ flex: 1, zIndex: -1 }}
          showsUserLocation
          //showsMyLocationButton
          //followsUserLocation
          moveOnMarkerPress={Platform.OS === "android" ? false : null}
          loadingEnabled
          provider={MapView.PROVIDER_GOOGLE}
          //cacheEnabled
          tracksViewChange={false}
          customMapStyle={nightStyle}
        >
          {this.props.algolia.map((restaurant, index) => (
            <MapView.Marker
              onPress={this._handleMarkerPress}
              identifier={index.toString()}
              tracksViewChanges={false}
              key={restaurant.objectID}
              coordinate={{
                latitude: restaurant._geoloc.lat,
                longitude: restaurant._geoloc.lng,
              }}
            >
              <View style={styles.bubbleContainer}>
                <View style={styles.bubble}>
                  <Text
                    style={[styles.amount, { fontSize: 20, fontWeight: "500" }]}
                  >
                    {index < 9 ? `  ${index + 1}  ` : ` ${index + 1} `}
                  </Text>
                </View>
                <View style={styles.arrowBorder} />
                <View style={styles.arrow} />
              </View>
            </MapView.Marker>
          ))}
          {this.props.destination ? (
            <MapView.Polyline
              coordinates={this.props.destination}
              strokeWidth={7}
              strokeColor="hotpink"
            />
          ) : null}
        </MapView>
        <View style={styles.buttonWrapper}>
          <FlatList
            ref={(ref) => {
              this.flatListRef = ref;
            }}
            data={this.props.algolia}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={this._renderItem}
            keyExtractor={(item) => item.objectID}
            getItemLayout={this._getItemLayout}
            initialScrollIndex={0}
          />
        </View>
        <TouchableOpacity style={styles.findMe} onPress={this._findMe}>
          <Ionicons name="md-locate" size={60} color={"red"} />
        </TouchableOpacity>
        {this.props.renderSearch ? (
          <View style={styles.buttonWrapper1}>
            <TouchableOpacity onPress={this._refetchRestaurants}>
              <View style={styles.mainButton}>
                <Text style={styles.buttonText}>Search Here</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  buttonWrapper1: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 50,
  },
  findMe: {
    position: "absolute",
    right: 10,
    bottom: 120,
  },
  mainButton: {
    height: 30,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 100,
    marginRight: 100,
    borderRadius: 2,
    backgroundColor: "#17A8AB",
  },
  buttonText: {
    fontWeight: "bold",
    color: "#ffffff",
    fontSize: 16,
  },
  ActivityContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  buttonWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  bubbleContainer: {
    flexDirection: "column",
    alignSelf: "flex-start",
  },
  bubble: {
    flex: 0,
    flexDirection: "row",
    alignSelf: "flex-start",
    backgroundColor: "#FF5A5F",
    // backgroundColor: '#394260',
    padding: 2,
    borderRadius: 3,
    borderColor: "#D23F44",
    // borderColor: '#394260',
    borderWidth: 0.5,
  },
  amount: {
    color: "#FFFFFF",
    fontSize: 13,
  },
  arrow: {
    backgroundColor: "transparent",
    borderWidth: 4,
    borderColor: "transparent",
    borderTopColor: "#FF5A5F",
    // borderTopColor: '#394260',
    alignSelf: "center",
    marginTop: -9,
  },
  arrowBorder: {
    backgroundColor: "transparent",
    borderWidth: 4,
    borderColor: "transparent",
    borderTopColor: "#D23F44",
    // borderTopColor: '#394260',
    alignSelf: "center",
    marginTop: -0.5,
  },
});

const mapStateToProps = ({ algolia, user, auth, restaurants, ui }) => {
  return {
    algolia: algolia.hits,
    region: user.region,
    mapLoaded: auth.mapLoaded,
    destination: restaurants.destination,
    renderSearch: ui.renderSearch,
    statusBarConfig: ui.statusBarConfig,
  };
};

export default connect(mapStateToProps, actions)(HomeScreen);
