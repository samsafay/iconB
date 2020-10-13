import React, { Component } from "react";
import EStyleSheet from "react-native-extended-stylesheet";
import { View, Text, Dimensions, Image, TextInput, Alert } from "react-native";
import { connect } from "react-redux";
import NavigationBar from "../../components/navBar/NavigationBar";
import * as actions from "../../actions";

const {
  width,
  // height
} = Dimensions.get("window");
class AddAddressScreen extends Component {
  _onSearchAddress = (text) => {
    this.props.placeAddressNameChanged(text);
  };

  _onSearchCity = (text) => {
    this.props.placeCityNameChanged(text);
  };

  render() {
    const rightButtonConfig = {
      title: "Next",
      handler: () => {
        if (
          !this.props.place_address &&
          this.props.place_is_user_at_location === false
        ) {
          Alert.alert(
            "We need you to provide us with the address of the place, if currently you are not at the location!"
          );
        } else {
          this.props.navigation.navigate("report");
        }
      },
    };

    const leftButtonConfig = {
      title: "Back",
      handler: () => this.props.navigation.goBack(null),
    };

    const titleConfig = {
      title: "Place Address",
    };
    return (
      <View style={{ flex: 1 }}>
        <NavigationBar
          style={styles.navBar}
          title={titleConfig}
          rightButton={rightButtonConfig}
          leftButton={leftButtonConfig}
          statusBar={{ hidden: true, hideAnimation: "slide" }}
        />
        <View style={styles.container}>
          <View style={styles.shadowContainer}>
            <View style={styles.subContainer}>
              <Text style={styles.primaryText}>
                Can you provide us with the location's{" "}
                <Text style={styles.inlineText}>address</Text>?
              </Text>
              {this.props.place_is_user_at_location === true ? (
                <Text style={[styles.subtleText, styles.subtleTextView]}>
                  This is Optional but helps the community in a great way!
                </Text>
              ) : (
                <Text style={[styles.subtleText, styles.subtleTextView]}>
                  If you are no at the place, we need you to provide us with the
                  address!
                </Text>
              )}
              <View style={styles.searchContainer}>
                <Image
                  source={require("../../../assets/place_icons/ic_place.png")}
                  style={styles.ImageStyle}
                />
                <TextInput
                  style={styles.addressBar}
                  onChangeText={this._onSearchAddress}
                  value={this.props.place_address}
                  autoCorrect={false}
                  placeholder={"Address (e.g. 100 Main Street)"}
                  autoCapitalize={"none"}
                  returnKeyType={"next"}
                  underlineColorAndroid={"transparent"}
                />
              </View>
              <View style={styles.searchContainer}>
                <Image
                  source={require("../../../assets/place_icons/ic_place.png")}
                  style={styles.ImageStyle}
                />
                <TextInput
                  style={styles.addressBar}
                  onChangeText={this._onSearchCity}
                  value={this.props.place_city}
                  autoCorrect={false}
                  placeholder={"City (e.g. Toronto)"}
                  autoCapitalize={"none"}
                  returnKeyType={"next"}
                  underlineColorAndroid={"transparent"}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
const styles = EStyleSheet.create({
  navBar: {
    borderBottomColor: "$borderColor",
    borderBottomWidth: 0.5,
  },
  inlineText: {
    color: "red",
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f4",
    borderWidth: 0.8,
    borderColor: "#f2f2f4",
    height: 40,
    borderRadius: 6,
    margin: 10,
  },
  ImageStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: "stretch",
    alignItems: "center",
  },
  addressBar: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "#f2f2f4",
    color: "#424242",
  },
  primaryText: {
    color: "$primaryText",
    textAlign: "center",
    paddingVertical: 20,
    paddingHorizontal: 5,
    fontSize: width >= 375 ? 20 : 20,
  },
  subtleText: {
    color: "$subtleText",
    textAlign: "center",
    fontSize: width >= 375 ? 14 : 14,
  },
  subtleTextView: {
    // paddingVertical: 20,
    paddingHorizontal: 10,
  },
  subContainer: {
    flex: 1,
    alignItems: "center",
    // justifyContent: 'center'
  },
  container: {
    // paddingTop: 20,
    backgroundColor: "$white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  shadowContainer: {
    height: "80%",
    width: "80%",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 2,
  },
});

const mapStateToProps = (state) => {
  return {
    place_address: state.restaurants.place_address,
    place_city: state.restaurants.place_city,
    place_is_user_at_location: state.restaurants.place_is_user_at_location,
  };
};

export default connect(mapStateToProps, actions)(AddAddressScreen);
