import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';

Header = ( {navigation} ) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <AntDesign name="search1" size={24} color="#002D62" />
          <TextInput placeholder="Search for services or more" style={styles.searchInput} />
        </View>

        <Pressable onPress={()=>navigation.navigate("Filter")}>
        <Ionicons name="filter" size={24} color="white" style={styles.filter} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#07364B',
    alignItems: 'center'
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    marginHorizontal: 10, // Adjust horizontal margin to change space between search bar and filter icon
    marginRight: 30,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingVertical: 8, // Adjust vertical padding to change height
    paddingHorizontal: 5,
    borderColor: '#002147',
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginLeft: 15
  },
  searchInput: {
    flex: 1, // Take remaining space within the searchBar
    marginLeft: 8, // Adjust left margin to create space between icon and input
  },

  filter: {
    marginLeft:15
  }
});

export default Header;
