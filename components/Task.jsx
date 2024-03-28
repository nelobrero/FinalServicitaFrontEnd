import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Color } from '../GlobalStyles';
import Icon from 'react-native-vector-icons/FontAwesome';

const Task = (props) => {

  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <Text style={styles.itemText}>{props.text}</Text>
        
      </View>
     
      <View style={styles.itemRight}>
        <Icon name="chevron-right" size={20} color={Color.colorWhite} />
      </View>
      

    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: Color.colorBlue,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    // shadowColor: Color.colorBlack,
    // shadowOffset: {
    //   width: 4,
    //   height: 4,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
  },
  itemText: {
    maxHeight: '100%',
    maxWidth: '100%',
    color: Color.colorWhite,
  },
  rightItemText: {
    color: Color.colorWhite,
    fontWeight: 'bold', 
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '80%',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '20%',
  },
});

export default Task;