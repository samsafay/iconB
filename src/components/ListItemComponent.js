import React, { Component } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import * as actions from '../actions';
import ListItemSearchBarComponent from '../components/ListItemSearchBarComponent';

class ListItemComponent extends Component {
  _handleRowPress = () => {
    this.props.navigation.navigate('ratingDetail');
  };

  render() {
    const { listItem, onPress } = this.props;
    let SearchBar;
    let RowText = <Text style={styles.rowText}>{listItem}</Text>;
    let RowIcon = <Ionicons name='ios-arrow-forward' size={25} style={{ alignSelf: 'flex-end' }} color='#c7c7c7' />;
    if (listItem === 'Add Location') {
      SearchBar = <View style={styles.rowOption}><ListItemSearchBarComponent /></View>;
    } if (this.props.place && listItem === 'Add Location') {
      RowText = <View><Text style={styles.rowText}>{this.props.place.name}</Text><Text style={styles.rowText1}>{this.props.place.address}</Text></View>;
      SearchBar = null;
      RowIcon = <Ionicons name='ios-close-circle' size={30} style={{ alignSelf: 'flex-end', marginRight: 20 }} color='#c7c7c7' onPress={() => this.props.resetPlaceName()} />;
    }

    return (
      <View style={styles.container}>
        <TouchableHighlight
          onPress={onPress}
          underlayColor={'rgba(154, 154, 154, 0.25)'}
        >
          <View>
            <View style={styles.row}>
              {RowText}
              <View style={styles.iconContainer}>
                {RowIcon}
              </View>
            </View>
          </View>
        </TouchableHighlight>
        {SearchBar}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#c7c7c7',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,

  },
  rowOption: {
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  addLocationRowText: {
    fontSize: 16,
  },
  rowText: {
    fontSize: 16,
  },
  rowText1: {
    fontSize: 14,
    color: '#9a9a9a',
  },
  iconContainer: {
    flex: 1
  },
  searchOptionBar: {
    height: 50,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  searchOptionButton: {
    width: 80,
    height: 30,
    borderRadius: 5,
    backgroundColor: '#efefef'
  },
  buttonText: {
    color: '#262626',
    fontSize: 14
  }
});

const mapStateToProps = (state) => {
  return {
    place: state.restaurants.place,
  };
};

export default connect(mapStateToProps, actions)(ListItemComponent);
