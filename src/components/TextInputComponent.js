import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { View, TextInput } from 'react-native';

const TextInputComponent = (props) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        autoCorrect={false}
        autoCapitalize={'none'}
        returnKeyType={'next'}
        underlineColorAndroid={'transparent'}
        {...props}
      />
    </View>
  );
};

const styles = EStyleSheet.create({
  container: {
    marginLeft: 20,
    marginRight: 20,
    borderColor: '$primaryText',
    borderWidth: 1,
    marginTop: 15,
    backgroundColor: '$white',
    borderRadius: 2
  },
  input: {
    height: 40,
    width: '100%',
  },
});

export default TextInputComponent;
