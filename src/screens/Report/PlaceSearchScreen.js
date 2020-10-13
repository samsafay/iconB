import React, { Component } from 'react';
import { View, ScrollView, TextInput, Image, Text, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import NavigationBar from '../../components/navBar/NavigationBar';


class PlaceSearchScreen extends Component {
  _onTextChange = (text) => {
    this.props.placeNameChanged(text);
    this.props.searchRestaurants(text, 30);
  }

  _onPlacePress = place => {
    this.props.placeNameChanged(place.name);
    this.props.placeAddressNameChanged(place.address);
    this.props.placeSelectedAddressNameChanged(place.address);
    this.props.placeIdChanged(place.objectID);
    this.props.placeCityNameChanged(place.city);
    this.props.navigation.goBack(null);
  }

  render() {
    const rightButtonConfig = {
      title: 'Cancel',
      handler: () => this.props.navigation.goBack(null),
    };
    const titleConfig = {
      title: 'Locations',
    };
    return (
      <View style={styles.container}>
        <NavigationBar
          style={styles.navBar}
          title={titleConfig}
          rightButton={rightButtonConfig}
          statusBar={{ hidden: true, hideAnimation: 'slide' }}
        />
        <View style={styles.searchContainer}>
          <Image source={require('../../../assets/search_icons/ic_search.png')} style={styles.ImageStyle} />
          <TextInput
            style={styles.addressBar}
            onChangeText={text => this._onTextChange(text)}
            autoCorrect={false}
            placeholder={'Search for a location'}
            autoCapitalize={'none'}
            returnKeyType={'next'}
            underlineColorAndroid={'transparent'}
          />
        </View>
        <ScrollView>
          {
            this.props.restaurants ?
              this.props.restaurants.hits.map(place => (
                <TouchableOpacity onPress={() => this._onPlacePress(place)} key={place.objectID}>
                  <View style={styles.addressRow} key={place.objectID}>
                    <Text style={styles.firstAddress}>{!('name' in place) ? null : place.name} </Text>
                    <Text style={styles.secondAddress}>{!('address' in place) ? null : place.address}, {!('city' in place) ? null : place.city}</Text>
                  </View>
                </TouchableOpacity>
              )
              )
              :
              null
          }
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
  ImageStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
    alignItems: 'center'
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
  iconStyle: {
    // padding: 10,
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
  addressRow: {
    paddingHorizontal: 15,
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
  buttonContainer: {
    height: 56,
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#17A8AB'
  },
  buttonIcon: {
    marginLeft: 20
  },
  buttonText: {
    marginRight: 42,
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#ffffff'

  }
});

const mapStateToProps = ({ algolia, restaurants }) => {
  return {
    place_name: restaurants.place_name,
    place_selected_address: restaurants.place_selected_address,
    restaurants: algolia.location_hits,
  };
};

export default connect(mapStateToProps, actions)(PlaceSearchScreen);
