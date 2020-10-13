import React, { Component } from 'react';
import {
  StatusBar,
  Text,
  View,
  Platform,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { NavbarButton } from './NavbarButton';
import { HEIGHT } from '../../config/utils';

const NAV_BAR_HEIGHT = 44;
const STATUS_BAR_HEIGHT = 20;

export default class NavigationBar extends Component {
  static defaultProps = {
    style: {},
    tintColor: '',
    leftButton: null,
    rightButton: null,
    title: null,
    statusBar: {
      style: 'default',
      hidden: false,
      hideAnimation: 'slide',
      showAnimation: 'slide',
    },
    containerStyle: {},
  };

  componentDidMount() {
    this.customizeStatusBar();
  }

  componentWillReceiveProps() {
    this.customizeStatusBar();
  }

  getButtonElement = (data, style) => {
    return (
      <View style={styles.navBarButtonContainer}>
        {(!data || data.props) ? data : (
          <NavbarButton
            title={data.title}
            style={[data.style, style]}
            tintColor={data.tintColor}
            handler={data.handler}
            accessible={data.accessible}
            accessibilityLabel={data.accessibilityLabel}
          />
        )}
      </View>
    );
  };

  getTitleElement = data => {
    if (!data || data.props) {
      return <View style={styles.customTitle}>{data}</View>;
    }

    const colorStyle = data.tintColor ? { color: data.tintColor } : null;

    return (
      <View style={styles.navBarTitleContainer}>
        <Text ellipsizeMode={data.ellipsizeMode} numberOfLines={data.numberOfLines} style={[styles.navBarTitleText, data.style, colorStyle]}>
          {data.title}
        </Text>
      </View>
    );
  };

  customizeStatusBar = () => {
    const { statusBar } = this.props;
    if (Platform.OS === 'ios') {
      if (statusBar.style) {
        StatusBar.setBarStyle(statusBar.style);
      }

      const animation = statusBar.hidden ?
        statusBar.hideAnimation : statusBar.showAnimation;

      StatusBar.showHideTransition = animation;
      StatusBar.hidden = statusBar.hidden;
    }
  }

  render() {
    const {
      containerStyle,
      tintColor,
      title,
      leftButton,
      rightButton,
      style,
    } = this.props;
    const customTintColor = tintColor ? { backgroundColor: tintColor } : null;

    // const customStatusBarTintColor = this.props.statusBar.tintColor ?
    //   { backgroundColor: this.props.statusBar.tintColor } : null;

    // let statusBar = null;

    // if (Platform.OS === 'ios') {
    //   statusBar = !this.props.statusBar.hidden ?
    //     <View style={[styles.statusBar, customStatusBarTintColor]} /> : null;
    // }

    return (
      <View style={[styles.navBarContainer, containerStyle, customTintColor]}>
        {/* {statusBar} */}
        <View style={[styles.navBar, style]}>
          {this.getTitleElement(title)}
          {this.getButtonElement(leftButton, { marginLeft: 8 })}
          {this.getButtonElement(rightButton, { marginRight: 8 })}
        </View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  navBarContainer: {
    backgroundColor: 'white',
    paddingTop: HEIGHT === 812 ? 40 : null
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT,
  },
  navBar: {
    height: NAV_BAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  customTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 7,
    alignItems: 'center',
  },
  navBarButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  navBarTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBarTitleText: {
    fontSize: 17,
    letterSpacing: 0.5,
    color: '#333',
    fontWeight: '500',
  },
});
