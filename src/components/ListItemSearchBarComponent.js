import React, { Component } from 'react';
import {
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';
import SearchOptionBarComponent from '../components/SearchOptionBarComponent';


class ListItemSearchBarComponent extends Component {
  _onPlaceNameChanged = opt => {
    // console.log('[SearchOptionBarComponent]', opt);
    this.props.placeNameChanged(opt.name);
    this.props.placeAddressNameChanged(opt.address);
    this.props.placeCityNameChanged(opt.city);
  };


  render() {
    //opt is the option object that pass in to the props when user presses on the bubble
    // onPress={(opt) => this._onPlaceNameChanged(opt)}
    // a mechanism to show something until data is load in the props
    // try to implement activity indicator before loading instaed of const loading
    // const loading = ['Loading'];
    return (
      <SearchOptionBarComponent
        onPress={this._onPlaceNameChanged}
        options={this.props.restaurants ? this.props.restaurants.hits : null}
        containerStyle={styles.searchOptionBar}
        buttonStyle={styles.searchOptionButton}
        textStyle={styles.buttonText}
        showsHorizontalScrollIndicator={false}
      />
    );
  }
}

const styles = StyleSheet.create({
  searchOptionBar: {
    height: 50,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  searchOptionButton: {
    height: 30,
    borderRadius: 5,
    backgroundColor: '#efefef'
  },
  buttonText: {
    color: '#262626',
    fontSize: 14,
    paddingHorizontal: 8
  }
});

const mapStateToProps = ({ algolia }) => {
  return {
    restaurants: algolia.location_hits,
  };
};

export default connect(mapStateToProps, actions)(ListItemSearchBarComponent);
