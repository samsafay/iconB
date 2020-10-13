import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  View,
  ScrollView,
  Text,
  TouchableHighlight,
  Alert,
  Switch,
  TextInput,
} from 'react-native';
import StarRating from 'react-native-star-rating';
import { NavigationActions } from 'react-navigation';
import {
  Location,
  Permissions,
} from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import NavigationBar from '../../components/navBar/NavigationBar';
import * as actions from '../../actions';
import ListItemSearchBarComponent from '../../components/ListItemSearchBarComponent';

class ReportScreen extends Component {
  componentWillMount() {
    this.props.searchRestaurants('', 30);
  }
  _getAddressGeo = async (address) => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      Alert.alert('We need to know your location, to show you the nearby places...');
    }
    const location = await Location.geocodeAsync(address);
    if (location.length === 0) {
      return null;
    } else {
      const lat = location[0].latitude;
      const lng = location[0].longitude;
      const _geoloc = {
        lat,
        lng
      };
      return _geoloc;
    }
  };
  _onCommentChange = text => {
    this.props.placeCommentChanged(text);
  }
  _onAddRatingPress = () => {
    this.props.navigation.navigate('ratingDetail');
  }
  // _onAddLocationPress = () => {
  //   this.props.navigation.navigate('placeSearch');
  // }
  _onAddFacebookPress = () => {
    Alert.alert('I am add facebook Pressd');
  }
  _onAddManualPress = () => {
    this.props.navigation.navigate('addPlace');
  }
  _onSharePress = async () => {
    this.props.statusBarChange({
      hidden: false,
      style: 'light-content'
    });
    const resetAction = NavigationActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: 'Tabs' })],
    });

    const place = {
      rating: this.props.place_rating,
      is_user_at_location: this.props.place_is_user_at_location,
      name: this.props.place_name,
      address: this.props.place_address,
      city: this.props.place_city,
      comment: this.props.place_comment ? this.props.place_comment : '',
    };

    if (this.props.place_name) {
      if (this.props.place_address === this.props.place_selected_address) {
        place.placeID = this.props.place_id;
        // console.log(place);
        this.props.updateRestaurantRating(place);
        this.props.navigation.dispatch(resetAction);
      } else {
        // we check to see if the user is at the location
        if (this.props.place_is_user_at_location === false) {
          //if user is not at the location we take the address and convert it to latitude and longtitude
          const _geoloc = await this._getAddressGeo(`${this.props.place_address}, ${this.props.place_city}`);
          if (_geoloc !== null) {
            //if the user did put a right address we added the lat, lng to the place object
            place._geoloc = _geoloc;
            this.props.addNewRestaurantAndRatingWithAddress(place);
            this.props.navigation.dispatch(resetAction);
          } else {
            // in case of wrong address or no address we alert the user
            Alert.alert('Check your Address, we think you put a wrong address');
          }
        } else {
          //in case where the user is at the location we get the user location in the action
          this.props.addNewRestaurantAndRatingWithGeo(place);
          this.props.navigation.dispatch(resetAction);
        }
      }
    } else {
      Alert.alert('We need to know the name of the place you are reporting on?');
    }
  }

  _resetPlaceName = () => {
    this.props.placeNameChanged('');
    this.props.placeAddressNameChanged('');
    this.props.placeCityNameChanged('');
  }

  _onSwitchPress = val => {
    this.props.placeUserLocationChanged(val);
  }

  render() {
    const rightButtonConfig = {
      title: 'Share',
      handler: this._onSharePress,
    };

    const leftButtonConfig = {
      title: 'Back',
      handler: () => this.props.navigation.goBack(null),
    };

    const titleConfig = {
      title: 'Final Review',
    };
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <NavigationBar
          style={styles.navBar}
          title={titleConfig}
          rightButton={rightButtonConfig}
          leftButton={leftButtonConfig}
          statusBar={{ hidden: true, hideAnimation: 'slide' }}
        />
        <View style={styles.rowContainer}>
          <TextInput
            underlineColorAndroid={'transparent'}
            style={styles.commentInput}
            onChangeText={this._onCommentChange}
            multiline
            value={this.props.place_comment}
            numberOfLines={4}
            placeholder={'Write your review...'}
          />
        </View>
        <ScrollView style={styles.container} scrollEnabled={false}>
          <View style={styles.container}>
            <TouchableHighlight underlayColor={'rgba(154, 154, 154, 0.25)'} onPress={this._onAddRatingPress}>
              <View style={styles.rowContainer}>
                <Text style={styles.rowText}>Add Rating</Text>
                <View style={{ marginLeft: 20 }}>
                  <StarRating
                    starStyle={{}}
                    buttonStyle={{ paddingHorizontal: 4 }}
                    starSize={15}
                    emptyStarColor={'#F6BA00'}
                    fullStarColor={'#F6BA00'}
                    disabled={false}
                    maxStars={5}
                    rating={this.props.place_rating}
                    selectedStar={() => this.props.navigation.navigate('ratingDetail')}
                  />
                </View>
                <View style={styles.iconContainer}>
                  <Ionicons name='ios-arrow-forward' size={25} style={{ alignSelf: 'flex-end' }} color='#c7c7c7' />
                </View>
              </View>
            </TouchableHighlight>
            {
              !this.props.place_name ?
                <TouchableHighlight underlayColor={'rgba(154, 154, 154, 0.25)'}>
                  <View style={styles.mainContainer}>
                    <View style={styles.locationRow}>
                      <Text style={styles.rowText}>Add Location</Text>
                      <View style={styles.iconContainer}>
                        <Ionicons name='ios-arrow-forward' size={25} style={{ alignSelf: 'flex-end' }} color='#c7c7c7' />
                      </View>
                    </View>
                    <View style={styles.rowOption}>
                      <ListItemSearchBarComponent />
                    </View>
                  </View>
                </TouchableHighlight>
                :
                <View style={styles.mainContainer}>
                  <View style={styles.locationRow}>
                    <View>
                      <Text style={styles.rowText}>{this.props.place_name}</Text>
                      <Text style={styles.rowText1}>{this.props.place_address}</Text>
                    </View>
                    <View style={styles.iconContainer}>
                      <Ionicons name='ios-close-circle' size={30} style={{ alignSelf: 'flex-end', marginRight: 20 }} color='#c7c7c7' onPress={this._resetPlaceName} />
                    </View>
                  </View>
                </View>
            }
            <View style={styles.rowContainer}>
              <Text style={styles.rowText}>Are you currently at the place?</Text>
              <View style={styles.iconContainer}>
                <Switch
                  style={{ alignSelf: 'flex-end' }}
                  value={this.props.place_is_user_at_location}
                  onValueChange={this._onSwitchPress}
                />
              </View>
            </View>

            <TouchableHighlight underlayColor={'rgba(154, 154, 154, 0.25)'} onPress={this._onAddManualPress}>
              <View style={styles.rowContainer1}>
                <Text style={styles.rowText2}>Manually Enter a Business</Text>
                <Ionicons name='ios-arrow-forward' size={16} style={{ marginLeft: 5, marginTop: 2 }} color='#c7c7c7' />
              </View>
            </TouchableHighlight>

          </View>
        </ScrollView>
      </View>
    );
  }
}


const styles = EStyleSheet.create({
  navBar: {
    borderBottomColor: '$borderColor',
    borderBottomWidth: 0.5,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  commentInput: {
    flex: 1,
    height: 70,
  },
  mainContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: '$borderColor',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '$borderColor',
  },
  rowContainer1: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  rowText: {
    fontSize: '$primaryFont',
    // backgroundColor: '#525252',
  },
  iconContainer: {
    flex: 1
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  rowOption: {
    // flexDirection: 'row',
    // alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  addLocationRowText: {
    fontSize: '$primaryFont',
    // backgroundColor: '#525252',
  },
  rowText1: {
    fontSize: '$secondaryFont',
    color: '$subtleText',
  },
  rowText2: {
    fontSize: 12,
    color: '$subtleText',
  },
  // listStyle: {
  //   backgroundColor: '#ffffff',
  //   primaryText: '$primaryText',
  //   subtleText: '#9a9a9a',
  //   rowUnderLay: 'rgba(154, 154, 154, 0.25)'
  // },
  searchOptionBar: {
    height: 50,
    backgroundColor: 'rgba(0,0,0,0)',
    // borderBottomColor: 'black',
    // borderBottomWidth: StyleSheet.hairlineWidth
  },
  searchOptionButton: {
    width: 80,
    height: 30,
    borderRadius: 5,
    // borderWidth: StyleSheet.hairlineWidth,
    // borderColor: 'blue',
    backgroundColor: '#efefef'
  },
  buttonText: {
    color: '$primaryText',
    fontSize: '$secondaryFont'
  },
  searchOptionBar2: {
    height: 50,
    backgroundColor: 'rgba(0,0,0,0)',
    // borderBottomColor: 'black',
    // borderBottomWidth: StyleSheet.hairlineWidth
  },
  searchOptionButton2: {
    // width: 80,
    height: 30,
    borderRadius: 5,
    // borderWidth: StyleSheet.hairlineWidth,
    // borderColor: 'blue',
    backgroundColor: '#efefef'
  },
  buttonText2: {
    color: '$primaryText',
    fontSize: '$secondaryFont',
    paddingHorizontal: 8
  }
});

// place is the list of businesses that we show to the user to choose
const mapStateToProps = state => {
  return {
    place_comment: state.restaurants.place_comment,
    place_rating: state.restaurants.place_rating,
    place_name: state.restaurants.place_name,
    place_address: state.restaurants.place_address,
    place_selected_address: state.restaurants.place_selected_address,
    place_id: state.restaurants.place_id,
    place_city: state.restaurants.place_city,
    place_is_user_at_location: state.restaurants.place_is_user_at_location
  };
};

export default connect(mapStateToProps, actions)(ReportScreen);
