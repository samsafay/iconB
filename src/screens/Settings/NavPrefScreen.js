import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  View,
  Platform
} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import NavigationBar from '../../components/navBar/NavigationBar';
import * as actions from '../../actions';
import InfoText from '../../components/InfoText';

class SettingsScreen extends Component {
  _onWazePress = () => {
    this.props.navigationPref('Waze');
  }

  _onGooglePress = () => {
    this.props.navigationPref('Google');
  }

  _onApplePress = () => {
    this.props.navigationPref('Apple');
  }

  _onBackPress = () => {
    this.props.statusBarChange({
      hidden: false,
      style: 'light-content'
    });
    this.props.navigation.goBack(null);
  }

  render() {
    const leftButtonConfig = {
      title: 'Back',
      handler: this._onBackPress,
    };

    const titleConfig = {
      title: 'NAVIGATION',
    };

    return (
      <View style={styles.scroll}>
        <NavigationBar
          style={styles.navBar}
          title={titleConfig}
          leftButton={leftButtonConfig}
          statusBar={{ hidden: this.props.statusBarConfig.hidden, hideAnimation: 'slide' }}
        />
        <InfoText text="Navigation App" />
        <List containerStyle={styles.listContainer}>
          <ListItem
            chevronColor='#3478f6'
            hideChevron={this.props.nav_pref !== 'Waze'}
            title="Waze"
            containerStyle={styles.listItemContainer}
            rightIcon={this.props.nav_pref === 'Waze' ? { name: 'check' } : {}}
            onPress={this._onWazePress}
          />
          <ListItem
            chevronColor='#3478f6'
            title="Google Maps"
            hideChevron={this.props.nav_pref !== 'Google'}
            rightIcon={this.props.nav_pref === 'Google' ? { name: 'check' } : {}}
            containerStyle={styles.listItemContainer}
            onPress={this._onGooglePress}
          />
          {
            Platform.OS === 'ios' ? (
              <ListItem
                chevronColor='#3478f6'
                title="Apple Maps"
                hideChevron={this.props.nav_pref !== 'Apple'}
                rightIcon={this.props.nav_pref === 'Apple' ? { name: 'check' } : {}}
                containerStyle={styles.listItemContainer}
                onPress={this._onApplePress}
              />
            ) : null
          }
        </List>
      </View>
    );
  }
}


const styles = EStyleSheet.create({
  scroll: {
    backgroundColor: '#F4F5F4',
    flex: 1
  },
  listContainer: {
    marginBottom: 0,
    marginTop: 0,
    borderTopWidth: 0,
  },
  listItemContainer: {
    borderBottomColor: '#ECECEC',
    height: 45
  },
  navBar: {
    borderBottomColor: '$borderColor',
    borderBottomWidth: 0.5,
  },
});

// place is the list of businesses that we show to the user to choose
const mapStateToProps = state => {
  return {
    nav_pref: state.user.nav_pref,
    statusBarConfig: state.ui.statusBarConfig
  };
};

export default connect(mapStateToProps, actions)(SettingsScreen);
