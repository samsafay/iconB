import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { View, Text, Dimensions } from 'react-native';
import StarRating from 'react-native-star-rating';
import { connect } from 'react-redux';
import NavigationBar from '../../components/navBar/NavigationBar';
import * as actions from '../../actions';

const {
  width,
} = Dimensions.get('window');

class RatingDetailScreen extends Component {
  _onStarRatingPress = rating => {
    this.props.placeRatingChanged(rating);
  }

  render() {
    const rightButtonConfig = {
      title: 'Done',
      handler: () => this.props.navigation.goBack(null),
    };

    const leftButtonConfig = {
      title: 'Back',
      handler: () => this.props.navigation.goBack(null),
    };

    const titleConfig = {
      title: 'Rating',
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
        <View style={styles.container}>
          <View style={styles.shadowContainer}>
            <View style={styles.subContainer}>
              <Text style={styles.primaryText}>How was your overall experience?</Text>
              <Text style={[styles.subtleText, styles.subtleTextView]}>Your feedback is very important to your community!</Text>
              <View style={styles.starView}>
                <StarRating
                  starStyle={{}}
                  buttonStyle={{ paddingHorizontal: 4 }}
                  starSize={width >= 375 ? 50 : 40}
                  emptyStarColor={'#F6BA00'}
                  fullStarColor={'#F6BA00'}
                  disabled={false}
                  maxStars={5}
                  rating={this.props.rating}
                  selectedStar={this._onStarRatingPress}
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
    borderBottomColor: '$borderColor',
    borderBottomWidth: 0.5,
  },
  primaryText: {
    color: '$primaryText',
    textAlign: 'center',
    fontSize: width >= 375 ? 30 : 22
  },
  subtleText: {
    color: '$subtleText',
    textAlign: 'center',
    fontSize: width >= 375 ? 20 : 14,
  },
  subtleTextView: {
    paddingVertical: 20,
    paddingHorizontal: 5,
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
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
    rating: state.restaurants.place_rating,
  };
};

export default connect(mapStateToProps, actions)(RatingDetailScreen);
