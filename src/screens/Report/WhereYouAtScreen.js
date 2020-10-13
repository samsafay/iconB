import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  View,
  Text,
  Dimensions,
  Switch
} from 'react-native';
import { connect } from 'react-redux';
import NavigationBar from '../../components/navBar/NavigationBar';
// import Switch from '../../components/Buttons/Switch';
import * as actions from '../../actions';

const {
  width,
} = Dimensions.get('window');

class WhereYouAtScreen extends Component {
  _onSwitchPress = val => {
    this.props.placeUserLocationChanged(val);
  }

  render() {
    if (this.props.place_is_user_at_location === undefined) {
      this.props.placeUserLocationChanged(true);
      // console.log('[WhereYouAtScreen] from render', this.props.place_is_user_at_location);
    }
    const rightButtonConfig = {
      title: 'Next',
      handler: () => this.props.navigation.navigate('addPlaceName'),
    };

    const leftButtonConfig = {
      title: 'Back',
      handler: () => this.props.navigation.goBack(null),
    };

    const titleConfig = {
      title: 'Current Location',
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
              <View>
                <Text style={styles.primaryText}>Are you currently</Text>
                <Text style={styles.primaryText}>located at the place?</Text>
              </View>
              <View style={styles.subtleTextView}>
                <Switch
                  value={this.props.place_is_user_at_location}
                  onValueChange={this._onSwitchPress}
                  disabled={false}
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
    paddingVertical: 20
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
    place_is_user_at_location: state.restaurants.place_is_user_at_location,
  };
};

export default connect(mapStateToProps, actions)(WhereYouAtScreen);
