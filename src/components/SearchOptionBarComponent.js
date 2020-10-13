import React, { Component } from 'react';
import {
  View,
  ScrollView,
} from 'react-native';
import TabOptionComponent from './TabOptionComponent';

// the 'onPress' will be called with the corresponding 'options' String as the argument
// the first 'option' will be highlighted as the default selection

export default class SearchOptionBarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: this.props.option ? props.options[0] : null,
    };
  }

  selectNewTab = (option) => {
    this.setState({ selectedTab: option });
  };

  render() {
    const _this = this;
    const { onPress, buttonStyle, containerStyle, textStyle } = this.props;

    const options = this.props.options ? this.props.options.map((option, i) => {
      return (
        <TabOptionComponent
          key={i}
          index={i}
          option={option}
          selectedTab={_this.state.selectedTab}
          onPress={onPress}
          selectNewTab={_this.selectNewTab}
          buttonStyle={buttonStyle}
          textStyle={textStyle}
        />
      );
    }) : null;

    return (
      <View style={containerStyle}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={this.props.showsHorizontalScrollIndicator}
          contentContainerStyle={{ alignItems: 'center' }}
        >
          {options}
        </ScrollView>
      </View>
    );
  }
}
