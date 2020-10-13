import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import NavigationBar from '../../components/navBar/NavigationBar';
import * as actions from '../../actions';
import TextInputComponent from '../../components/TextInputComponent';

class AddPlaceManualScreen extends Component {
  _onPlaceNameChange = text => {
    this.props.placeNameChanged(text);
  }

  _onPlaceAddressChange = text => {
    this.props.placeAddressNameChanged(text);
  }

  _onPlaceCityChange = text => {
    this.props.placeCityNameChanged(text);
  }

  render() {
    // const rightButtonConfig = {
    //   title: 'Share',
    //   handler: this._onSharePress,
    // };

    const leftButtonConfig = {
      title: 'Back',
      handler: () => this.props.navigation.goBack(null),
    };

    const titleConfig = {
      title: 'Final Review',
    };
    return (
      <ScrollView style={styles.container}>
        <NavigationBar
          style={styles.navBar}
          title={titleConfig}
          //rightButton={rightButtonConfig}
          leftButton={leftButtonConfig}
          statusBar={{ hidden: true, hideAnimation: 'slide' }}
        />
        <View>
          <View>
            <TextInputComponent
              placeholder="Business Name"
              onChangeText={this._onPlaceNameChange}
              value={this.props.place_name}
            />
          </View>
          <View>
            <TextInputComponent
              placeholder="Address Line 1"
              value={this.props.place_address}
              onChangeText={this._onPlaceAddressChange}
            />
          </View>
          <View>
            <TextInputComponent
              placeholder="City"
              onChangeText={this._onPlaceCityChange}
              value={this.props.place_city}
            />
          </View>
          {/* <View>
            <TextInputComponent
              placeholder="phone"
            />
            <TextInputComponent
              placeholder="Hours"
            />
          </View> */}
        </View>
      </ScrollView>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '$white',
  },
});
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

export default connect(mapStateToProps, actions)(AddPlaceManualScreen);
