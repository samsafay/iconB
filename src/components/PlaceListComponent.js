import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { View, Text, TouchableOpacity } from 'react-native';
import { Rating } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { WIDTH, HEIGHT, DIRECTIONS_ICON_SIZE } from '../config/utils';

const flatCardWidth = WIDTH * 0.8;
const flatCardHeight = WIDTH > 350 ? HEIGHT * 0.15 : HEIGHT * 0.20;

class PlaceListComponent extends Component {
  _onPress = () => {
    this.props.onPressItem(this.props.data);
  };

  _navPress = _geoloc => {
    this.props.jumpToNav(_geoloc, this.props.navPref);
  }

  render() {
    const { data: { name, address, numRatings, avgRating, distance, _geoloc } } = this.props;
    const index = this.props.index;

    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={styles.slideContainer}>
          <View style={styles.detailContainer}>
            <Text numberOfLines={1} style={[styles.flatCardText, styles.primaryText]}>{`${index + 1}. ${name}`}</Text>
            <View style={styles.ratingContainer}>
              <View style={styles.ratingNumberContainer}>
                <Text style={[styles.flatCardText, styles.ratingText, { flex: 1 }]}>{avgRating}</Text>
              </View>
              <View style={styles.starStyle}>
                {/* <StarRating
                  starSize={STAR_SIZE}
                  emptyStarColor={'#F6BA00'}
                  fullStarColor={'#F6BA00'}
                  disabled={false}
                  maxStars={5}
                  rating={avgRating}
                /> */}
                <Rating 
                  imageSize={15}
                  readonly
                  startingValue={avgRating}
                />
              </View>
              <View style={styles.reviewNumberContainer}>
                <Text style={[styles.flatCardText, styles.secondaryText]}>{`(${numRatings})`}</Text>
              </View>
            </View>
            <Text style={[styles.flatCardText, styles.secondaryText]}>{address}</Text>
            <Text style={[styles.flatCardText, styles.secondaryText]}>Toronto, Ontario</Text>
          </View>
          <View style={styles.directionContainer}>
            <View style={styles.innerDirectionContainer}>
              <Text style={[styles.flatCardText, styles.secondaryText, { fontWeight: 'bold', color: '#3478f6' }]}>{`${Math.round(distance * 10) / 10}`} km</Text>
              <MaterialCommunityIcons onPress={() => this._navPress(_geoloc)} name="directions" size={DIRECTIONS_ICON_SIZE} color={'#3478f6'} />
              <Text style={[styles.flatCardText, styles.primaryText, { fontSize: 8, color: '#3478f6' }]}>DIRECTION</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}


const styles = EStyleSheet.create({
  innerDirectionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15
  },
  ratingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  ratingNumberContainer: {
    //width: 20,
    //height: 15
  },
  starStyle: {
    //width: 60,
    //height: 15
  },
  reviewNumberContainer: {
    marginLeft: 5,
    height: 15
  },
  flatCardText: {
    flex: 1
  },
  primaryText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  ratingText: {
    marginRight: 5,
    fontSize: 13,
    color: '#F6BA00',
    fontWeight: 'bold'
  },
  secondaryText: {
    color: '$sText',
    fontSize: 13
  },
  detailContainer: {
    flex: WIDTH > 350 ? 6 : 5.5,
    padding: 15
  },
  directionContainer: {
    flex: WIDTH > 350 ? 4 : 4.5,
    flexDirection: 'column',
  },
  slideContainer: {
    flexDirection: 'row',
    marginLeft: 20,
    marginBottom: 10,
    width: flatCardWidth,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    overflow: 'hidden',
    height: HEIGHT === 812 ? 105 : flatCardHeight
  },
});

const mapStateToProps = ({ restaurants, user }) => {
  return {
    tripInfo: restaurants.trip_info,
    navPref: user.nav_pref
  };
};

export default connect(mapStateToProps, actions)(PlaceListComponent);
