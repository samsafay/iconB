import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  View,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import NavigationBar from '../../components/navBar/NavigationBar';
import * as actions from '../../actions';

const {
  width,
  // height
} = Dimensions.get('window');
class AddPlaceNameScreen extends Component {
  _onSearchName = text => {
    this.props.placeNameChanged(text);
    this.props.searchRestaurants(text, 30);
  }
  _onNameRowPress = place => {
    // console.log('_onNameRowPress', place);
    this.props.placeNameChanged(place.name);
    this.props.placeAddressNameChanged(place.address);
    this.props.placeSelectedAddressNameChanged(place.address);
    this.props.placeIdChanged(place.objectID);
    this.props.placeCityNameChanged(place.city);
    this.props.navigation.navigate('addAddress');
  }

  render() {
    const rightButtonConfig = {
      title: 'Next',
      handler: () => {
        if (!this.props.place_name) {
          Alert.alert('We need you to provide us with the name of the place you are rating!');
        } else {
          this.props.navigation.navigate('addAddress');
        }
      },
    };

    const leftButtonConfig = {
      title: 'Back',
      handler: () => this.props.navigation.goBack(null),
    };

    const titleConfig = {
      title: 'Place Name',
    };
    return (
      <View style={{ flex: 1 }}>
        <NavigationBar
          style={styles.navBar}
          title={titleConfig}
          rightButton={rightButtonConfig}
          leftButton={leftButtonConfig}
          statusBar={{ hidden: true, hideAnimation: 'slide' }}
        />
        <KeyboardAvoidingView
          style={styles.container}
          behavior="height"
        >
          <View style={styles.shadowContainer}>
            <View style={styles.subContainer}>
              <Text style={styles.primaryText}>What is the <Text style={styles.inlineText}>name</Text> of the Place you are reporting on?</Text>
              <Text style={[styles.subtleText, styles.subtleTextView]}>You can change the address on the next page, in case name doesn't match the address.</Text>
              <View style={styles.searchContainer}>
                <Image source={require('../../../assets/place_icons/ic_place.png')} style={styles.ImageStyle} />
                <TextInput
                  style={styles.addressBar}
                  onChangeText={this._onSearchName}
                  value={this.props.place_name}
                  autoCorrect={false}
                  placeholder={'Name (e.g. Tim Hortons)'}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  underlineColorAndroid={'transparent'}
                />
              </View>
              <ScrollView>
                {
                  this.props.restaurants ?
                    this.props.restaurants.hits.map(place => (
                      <TouchableOpacity onPress={() => this._onNameRowPress(place)} key={place.objectID}>
                        <View style={styles.addressRow}>
                          <Text style={styles.firstAddress}>{!('name' in place) ? null : place.name} </Text>
                          <Text style={styles.secondAddress}>{!('address' in place) ? null : place.address}, {!('city' in place) ? null : place.city}</Text>
                          {/* <Text style={styles.secondAddress}>{!('city' in place) ? null : place.city}</Text> */}
                        </View>
                      </TouchableOpacity>
                    )
                    )
                    :
                    null
                }
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}
const styles = EStyleSheet.create({
  navBar: {
    borderBottomColor: '$borderColor',
    borderBottomWidth: 0.5,
  },
  inlineText: {
    color: 'red'
  },
  addressRow: {
    paddingVertical: 8,
  },
  firstAddress: {
    color: '#212121',
    fontSize: 16,
  },
  secondAddress: {
    color: '#A7A7A7',
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f4',
    borderWidth: 0.8,
    borderColor: '#f2f2f4',
    height: 40,
    borderRadius: 6,
    margin: 10
  },
  ImageStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
    alignItems: 'center'
  },
  addressBar: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#f2f2f4',
    color: '#424242',
  },
  primaryText: {
    color: '$primaryText',
    textAlign: 'center',
    paddingVertical: 20,
    paddingHorizontal: 5,
    fontSize: width >= 375 ? 20 : 20
  },
  subtleText: {
    color: '$subtleText',
    textAlign: 'center',
    fontSize: width >= 375 ? 14 : 14,
  },
  subtleTextView: {
    paddingHorizontal: 10,
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
  },
  container: {
    backgroundColor: '$white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowContainer: {
    height: '80%',
    width: '80%',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 2,
  },
});

const mapStateToProps = state => {
  return {
    place_name: state.restaurants.place_name,
    place_selected_address: state.restaurants.place_selected_address,
    restaurants: state.algolia.location_hits,
  };
};

export default connect(mapStateToProps, actions)(AddPlaceNameScreen);
