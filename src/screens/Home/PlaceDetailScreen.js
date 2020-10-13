import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  View,
  Text,
  TouchableHighlight,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connectActionSheet } from '@expo/react-native-action-sheet';
import moment from 'moment';
import StarRating from 'react-native-star-rating';
import { Button, List, ListItem, Icon, Rating } from 'react-native-elements';
import {
  MapView
} from 'expo';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import NavigationBar from '../../components/navBar/NavigationBar';
import * as actions from '../../actions';
// import Icon from '../../components/Icon';
import InfoText from '../../components/InfoText';
import { HEIGHT, WIDTH } from '../../config/utils';


const latitudeDelta = 0.0125;
const longitudeDelta = (WIDTH / HEIGHT) * latitudeDelta;

@connectActionSheet
class PlaceDetailScreen extends Component {
  componentWillMount() {
    this.props.fetchPlaceReviews(this.props.navigation.state.params.objectID);
    this.props.searchRestaurants('', 30);
    if (HEIGHT === 812) {
      this.props.statusBarChange({
        style: 'dark-content'
      });
    } else {
      this.props.statusBarChange({
        hidden: true
      });
    }
  }

  _onCommentChange = text => {
    this.props.placeCommentChanged(text);
  }

  _onAddRatingPress = () => {
    this.props.navigation.navigate('ratingDetailHome');
  }

  _navPress = _geoloc => {
    this.props.jumpToNav(_geoloc, this.props.navPref);
  }

  _reviewButtonPress = () => {
    const placeReview = {
      placeID: this.props.navigation.state.params.objectID,
      rating: this.props.place_rating,
      comment: this.props.place_comment ? this.props.place_comment : null
    };
    if (this.props.place_rating) {
      this.props.updateRestaurantRating(placeReview);
    } else {
      Alert.alert('Please add your rating from 1 to 5. We cannot accept your review without your rating!');
    }
  }

  _onOpenActionSheet = reviewID => {
    //Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = ['Report as Inappropriate', 'Cancel'];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;
    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      buttonIndex => {
        // Do something here depending on the button index selected
        if (buttonIndex === 0) {
          Linking.openURL(`mailto:samsafay@gmail.com?Subject=Report Review&body=I'd like to report that this review violates your terms of use
          ${reviewID}`);
        }
      }
    );
  };

  _onBackPress = () => {
    this.props.statusBarChange({
      hidden: false,
      style: 'light-content'
    });
    //console.log('iidas');
    this.props.navigation.goBack(null);
  }

  render() {
    const { _geoloc, objectID, name, address, city, numRatings, avgRating, distance } = this.props.navigation.state.params;
    const roundedDistance = `${Math.round(distance * 10) / 10} km`;
    const region = {
      latitude: _geoloc.lat,
      longitude: _geoloc.lng,
      latitudeDelta,
      longitudeDelta
    };

    const leftButtonConfig = {
      title: 'Back',
      handler: this._onBackPress,
    };

    const titleConfig = {
      title: `${name}`,
    };

    const timeFormat = {
      sameDay: '[Today at] hh:mm a',
      lastDay: '[Yesterday at] hh:mm a',
      lastWeek: '[Last] dddd [at] hh:mm a',
      sameElse: 'MMM Do [at] hh:mm a'
    };

    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <NavigationBar
          style={styles.navBar}
          title={titleConfig}
          leftButton={leftButtonConfig}
        />
        <KeyboardAwareScrollView
          style={styles.scroll}
        >
          <MapView
            style={{ width: '100%', height: (HEIGHT * 35) / 100 }}
            region={region}
            provider={MapView.PROVIDER_GOOGLE}
            cacheEnabled
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            showsUserLocation
          >
            <MapView.Marker
              tracksViewChanges={false}
              key={objectID}
              coordinate={{
                latitude: _geoloc.lat,
                longitude: _geoloc.lng
              }}
            />
          </MapView>
          <InfoText text="Info" />
          <List containerStyle={styles.listContainer}>
            <ListItem
              hideChevron
              title={name}
              subtitle={
                <View style={[styles.subtitleView, { flexDirection: 'column', paddingTop: 5 }]}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ paddingTop: 2, fontWeight: 'bold' }}>{avgRating}</Text>
                    <StarRating
                      disabled
                      containerStyle={{ paddingLeft: 5, width: 110 }}
                      starSize={20}
                      emptyStarColor={'#F6BA00'}
                      fullStarColor={'#F6BA00'}
                      disabled={false}
                      maxStars={5}
                      rating={avgRating}
                    />
                  </View>
                  <Text style={[styles.ratingText, { paddingTop: 5, paddingLeft: 0 }]}>({numRatings}) reviews</Text>
                </View>
              }
              containerStyle={styles.listItemContainer}
              leftIcon={
                <Icon
                  icon={{
                    type: 'MaterialIcons',
                    name: 'star',
                  }}
                />
              }
            />
            <ListItem
              hideChevron
              title={address}
              containerStyle={styles.listItemContainer}
              leftIcon={
                <Icon
                  icon={{
                    type: 'MaterialIcons',
                    name: 'location-on',
                  }}
                />
              }
            />
            <ListItem
              hideChevron
              title={city}
              containerStyle={styles.listItemContainer}
              leftIcon={
                <Icon
                  icon={{
                    type: 'material',
                    name: 'location-city',
                  }}
                />
              }
            />
            <ListItem
              title="Direction to Here"
              rightTitle={roundedDistance}
              onPress={() => this._navPress(_geoloc)}
              containerStyle={styles.listItemContainer}
              leftIcon={
                <Icon
                  color='#3478f6'
                  icon={{
                    type: 'MaterialIcons',
                    name: 'directions',
                  }}
                />
              }
            />
          </List>
          <InfoText text="All the reviews" />
          <List containerStyle={styles.listContainer}>
            {
              this.props.place_reviews ? (
                this.props.place_reviews.map(doc =>
                  <ListItem
                    key={doc.id}
                    roundAvatar
                    containerStyle={styles.listItemContainer}
                    titleNumberOfLines={100}
                    avatar={doc.photoURL}
                    //avatarContainerStyle={{ paddingTop: -20, backgroundColor: 'green' }}
                    //avatarOverlayContainerStyle={{ top: 0 }}
                    rightIcon={
                      <MaterialIcons
                        onPress={() => this._onOpenActionSheet(doc.id)}
                        name='more-horiz'
                        size={25}
                        style={styles.reportIcon}
                      />
                    }
                    title={doc.displayName}
                    titleStyle={{ fontWeight: 'bold' }}
                    subtitle={
                      <View style={[styles.subtitleView, { flexDirection: 'column', paddingTop: 5 }]}>
                        <View style={{ flexDirection: 'row' }}>
                          <Rating
                            imageSize={12}
                            readonly
                            startingValue={doc.rating}
                            style={{ paddingLeft: 10 }}
                          />
                          <Text numberOfLines={1} style={styles.ratingText}>{moment(doc.dateAdded.toDate()).calendar(null, timeFormat)}</Text>
                        </View>
                        <Text style={[styles.ratingText, { paddingTop: 5, paddingLeft: 10 }]}>{doc.comment}</Text>
                      </View>
                    }
                  />
                )
              ) : null
            }
          </List>
          <InfoText text="Add Your Own Rating" />
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
                  selectedStar={() => this.props.navigation.navigate('ratingDetailHome')}
                />
              </View>
              <View style={styles.iconContainer}>
                <Ionicons name='ios-arrow-forward' size={25} style={{ alignSelf: 'flex-end' }} color='#c7c7c7' />
              </View>
            </View>
          </TouchableHighlight>
          <Button
            color='#262626'
            style={styles.button}
            title='Submit Your Review'
            onPress={this._reviewButtonPress}
            buttonStyle={styles.buttonStyle}
          />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  reportIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  buttonStyle: {
    backgroundColor: '$mainColor',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 5
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
  },
  subtitleView: {
    flexDirection: 'row',
  },
  subtitleRating: {
    paddingLeft: 10,
  },
  ratingText: {
    paddingLeft: 10,
    color: 'grey',
  },
  scroll: {
    backgroundColor: 'white',
  },
  listContainer: {
    marginBottom: 0,
    marginTop: 0,
    borderTopWidth: 0,
  },
  listItemContainer: {
    // justifyContent: 'flex-start',
    borderBottomColor: '#ECECEC',
  },
  navBar: {
    borderBottomColor: '$borderColor',
    borderBottomWidth: 0.5,
  },
  commentInput: {
    flex: 1,
    height: 70,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '$borderColor',
  },
  rowText: {
    fontSize: '$primaryFont',
  },
  iconContainer: {
    flex: 1
  },
});

const mapStateToProps = ({ restaurants, user, ui }) => {
  return {
    place_comment: restaurants.place_comment,
    place_rating: restaurants.place_rating,
    place_reviews: restaurants.place_reviews,
    navPref: user.nav_pref,
    statusBarConfig: ui.statusBarConfig
  };
};

export default connect(mapStateToProps, actions)(PlaceDetailScreen);
