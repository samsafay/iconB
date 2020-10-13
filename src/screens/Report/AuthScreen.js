import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  FontAwesome,
} from '@expo/vector-icons';
import { WebBrowser } from 'expo';
import { connect } from 'react-redux';
import StarRating from 'react-native-star-rating';
import NavigationBar from '../../components/navBar/NavigationBar';
import * as actions from '../../actions';
import { HEIGHT } from '../../config/utils';

const { width, height } = Dimensions.get('window');

class AuthScreen extends Component {
  async componentWillMount() {
    await this.props.loginStatus();
    //only hide it if the phone is not iphoneX
    if (HEIGHT !== 812) {
      this.props.statusBarChange({
        hidden: true,
        style: 'light-content'
      });
    } else {
      this.props.statusBarChange({
        style: 'dark-content'
      });
    }
  }

  _onStarRatingPress = rating => {
    this.props.placeRatingChanged(rating);
  }

  _onPolicyPress = async () => {
    WebBrowser.openBrowserAsync('https://sitdownplease.org/privacy-policy.html');
  }

  _onTOSPress = async () => {
    WebBrowser.openBrowserAsync('https://sitdownplease.org/terms-of-service.html');
  }

  _onBackPress = () => {
    this.props.statusBarChange({
      hidden: false,
      style: 'light-content'
    });
    this.props.navigation.goBack(null);
  }

  _onCancelPress = () => {
    this.props.statusBarChange({
      hidden: false,
      style: 'light-content'
    });
    this.props.navigation.goBack(null);
  }

  render() {
    const leftButtonConfig = {
      title: 'Cancel',
      handler: this._onCancelPress,
    };

    const titleConfig = {
      title: 'Login',
    };

    const ratingRightButtonConfig = {
      title: 'Next',
      handler: () => this.props.navigation.navigate('whereYouAt'),
    };

    const ratingLeftButtonConfig = {
      title: 'Back',
      handler: this._onBackPress,
    };

    const ratingTitleConfig = {
      title: 'Rating',
    };
    // console.log('after cancel signin', this.props.auth_user);
    return (
      this.props.auth_user === null ?
        (
          <View style={styles.container}>
            <NavigationBar
              title={titleConfig}
              leftButton={leftButtonConfig}
              statusBar={{ hidden: this.props.statusBarConfig.hidden }}
            />
            <View style={styles.box1}>
              <Text style={styles.mainText}>Welcome to Sit Down Please! We really appreciate that you want to report a place to us. However we need you to sign in first before reporting!</Text>
              <Text style={styles.mainText}>By signinup, you agree to the SitDownPlease <Text onPress={this._onTOSPress} style={styles.anonymousText}> Terms of Service </Text>
                and<Text onPress={this._onPolicyPress} style={styles.anonymousText}> Privacy Policy.</Text> </Text>
            </View>

            <View style={styles.box2}>
              <Text style={styles.signUpText}>Sign up or login with:</Text>

              <TouchableOpacity onPress={() => this.props.facebookLogin()}>
                <View style={styles.facebookButton}>
                  <FontAwesome style={styles.iconStyle} name="facebook-square" size={32} color="#ffffff" />
                  <Text style={styles.buttonText}>Login With Your Facebook</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.props.googleLogin()} >
                <View style={styles.googleButton}>
                  <FontAwesome style={styles.iconStyle} name="envelope-square" size={32} color="#ffffff" />
                  <Text style={styles.buttonText}>Login With Your Gmail</Text>
                </View>
              </TouchableOpacity>

              {/* <View style={styles.lastLineText}>
                <Text style={styles.lastText}>Don't know yet, you can continue </Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('ratingDetail')} >
                  <Text style={styles.anonymousText}>
                    anonymouslyy!
              </Text>
                </TouchableOpacity>
              </View> */}
            </View>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <NavigationBar
              style={styles.navBar}
              title={ratingTitleConfig}
              rightButton={ratingRightButtonConfig}
              leftButton={ratingLeftButtonConfig}
              statusBar={{ hidden: true, hideAnimation: 'slide' }}
            />
            <View style={styles.ratingContainer}>
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
        )
    );
  }
}

const styles = EStyleSheet.create({
  mainText: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    color: '$primaryText'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  box1: {
    flex: height > 480 ? height * 6 : 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box2: {
    flex: height > 480 ? height * 4 : 5,
    backgroundColor: '#ffffff'
  },
  text1: {
    fontSize: 50,
    color: '#ffffff'
  },
  signUpText: {
    marginTop: height > 480 ? 40 : 20,
    textAlign: 'center'
  },
  facebookButton: {
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#3B5998'
  },
  googleButton: {
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#dd4b39'
  },
  buttonText: {
    marginRight: 42,
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#ffffff'
  },
  iconStyle: {
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10
  },
  lastLineText: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  anonymousText: {
    color: '#17A8AB',
    fontWeight: 'bold'
  },
  lastText: {
    fontSize: width >= 375 ? null : 12
  },
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
  ratingContainer: {
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
    auth_user: state.auth.auth_user,
    rating: state.restaurants.place_rating,
    statusBarConfig: state.ui.statusBarConfig
  };
};
export default connect(mapStateToProps, actions)(AuthScreen);
