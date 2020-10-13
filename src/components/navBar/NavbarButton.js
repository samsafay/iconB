import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export const NavbarButton = props => {
  return (
    <TouchableOpacity
      style={styles.navBarButton}
      onPress={props.handler}
      disabled={props.disabled}
      accessible={props.accessible}
      accessibilityLabel={props.accessibilityLabel}
    >
      <View style={props.style}>
        <Text style={[styles.navBarButtonText, { color: props.tintColor }]}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

NavbarButton.defaultProps = {
  style: {},
  title: '',
  tintColor: '#0076FF',
  disabled: false,
  handler: () => ({}),
};

const styles = EStyleSheet.create({
  navBarButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBarButtonText: {
    fontSize: 17,
    letterSpacing: 0.5,
  },
});
