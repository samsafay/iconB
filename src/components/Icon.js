import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 18,
    width: 34,
  },
});

const BaseIcon = ({ containerStyle, icon }) => (
  <View style={[styles.container, containerStyle]}>
    <Icon
      size={24}
      type="material"
      name="notifications"
      {...icon}
    />
  </View>
);

export default BaseIcon;
