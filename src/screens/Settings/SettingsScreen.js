import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  View,
  ScrollView,
  Text,
  AsyncStorage,
  // SafeAreaView
  StatusBar
} from 'react-native';
import { Avatar, List, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import {
  WebBrowser,
  // Constants 
} from 'expo';
import firebase from 'firebase';
import * as actions from '../../actions';
import InfoText from '../../components/InfoText';
import NavigationBar from '../../components/navBar/NavigationBar';
import { HEIGHT } from '../../config/utils';


class SettingsScreen extends Component {
  async componentWillMount() {
    // this.props.statusBarChange({
    //   hidden: false,
    //   style: 'light-content'
    // });
    await this.props.loginStatus();
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content');
    });
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  _onSignOutPress = async () => {
    if (this.props.auth_user) {
      await firebase.auth().signOut();
      await AsyncStorage.clear();
    } else {
      this.props.navigation.navigate('Auth');
    }
  }
  _onPolicyPress = async () => {
    WebBrowser.openBrowserAsync('https://sitdownplease.org/privacy-policy.html');
  }

  _onTOSPress = async () => {
    WebBrowser.openBrowserAsync('https://sitdownplease.org/terms-of-service.html');
  }

  _onTOUPress = async () => {
    WebBrowser.openBrowserAsync('https://sitdownplease.org/terms-of-use.html');
  }

  render() {
    const titleConfig = {
      title: 'USER PROFILE AND SETTINGS',
    };
    const name = this.props.auth_user ? this.props.auth_user.providerData[0].displayName : null;
    const email = this.props.auth_user ? this.props.auth_user.providerData[0].email : null;
    const avatar = this.props.auth_user ? this.props.auth_user.providerData[0].photoURL : null;
    // console.log('from settings', this.props.statusBarConfig);
    return (
      <View style={{ flex: 1 }}>
        <NavigationBar
          style={styles.navBar}
          title={titleConfig}
        //statusBar={{ hidden: this.props.statusBarConfig.hidden }}
        />
        <ScrollView style={styles.scroll}>
          {
            avatar ? (
              <View>
                <InfoText text="Account" />
                <View style={styles.userRow}>
                  <View style={styles.userImage}>
                    <Avatar
                      large
                      rounded
                      source={{
                        uri: avatar,
                      }}
                    />
                  </View>
                  <View>
                    <Text style={{ fontSize: 16 }}>{name || null}</Text>
                    <Text
                      style={{
                        color: 'gray',
                        fontSize: 16,
                      }}
                    >
                      {email || null}
                    </Text>
                  </View>
                </View>
              </View>
            ) : null
          }
          <InfoText text="Preferences" />
          <List containerStyle={styles.listContainer}>
            <ListItem
              title="Navigation"
              rightTitle={this.props.nav_pref}
              onPress={() => this.props.navigation.navigate('NavPref')}
              containerStyle={styles.listItemContainer}
            />
          </List>
          <InfoText text="More" />
          <List containerStyle={styles.listContainer}>
            <ListItem
              title="Privacy Policy"
              onPress={() => this._onPolicyPress()}
              containerStyle={styles.listItemContainer}
            />
            <ListItem
              title="Terms of Service"
              onPress={() => this._onTOSPress()}
              containerStyle={styles.listItemContainer}
            />
            <ListItem
              title="Terms of Use"
              onPress={() => this._onTOUPress()}
              containerStyle={styles.listItemContainer}
            />
          </List>
          <InfoText text="" />
          <List containerStyle={styles.listContainer}>
            <ListItem
              hideChevron
              title={this.props.auth_user ? 'Sign Out' : 'Sign In'}
              onPress={this._onSignOutPress}
              containerStyle={styles.listItemContainer}
            />
          </List>
        </ScrollView>
      </View>
    );
  }
}


const styles = EStyleSheet.create({
  scroll: {
    backgroundColor: '#F4F5F4',
  },
  userRow: {
    backgroundColor: 'white',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 6,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
  },
  userImage: {
    marginRight: 12,
  },
  listContainer: {
    marginBottom: 0,
    marginTop: 0,
    borderTopWidth: 0,
  },
  listItemContainer: {
    borderBottomColor: '#ECECEC',
  },
  navBar: {
    marginTop: HEIGHT === 812 ? null : 20,
    borderBottomColor: '$borderColor',
    borderBottomWidth: 0.5,
  },
});

// place is the list of businesses that we show to the user to choose
const mapStateToProps = state => {
  return {
    nav_pref: state.user.nav_pref,
    auth_user: state.auth.auth_user,
    statusBarConfig: state.ui.statusBarConfig
  };
};

export default connect(mapStateToProps, actions)(SettingsScreen);
