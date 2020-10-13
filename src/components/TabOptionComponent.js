import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { debounce } from 'lodash';

export default class TabOptionComponent extends Component {

  constructor(props) {
    super(props);
    this.handlePress = debounce(this.handlePress.bind(this), 200, { leading: true });
  }

  handlePress() {
    const option = this.props.option;
    this.props.onPress(option);
    this.props.selectNewTab(option);
  }

  render() {
    const { buttonStyle, textStyle, option } = this.props;
    return (
      <View style={{ paddingHorizontal: 4 }}>
        <TouchableOpacity
          onPress={this.handlePress}
          style={[{
            alignItems: 'center',
            justifyContent: 'center',
          }, buttonStyle]}
        >
          <Text style={[textStyle]} >
            {option.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
