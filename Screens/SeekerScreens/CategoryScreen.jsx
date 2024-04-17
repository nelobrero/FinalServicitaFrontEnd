import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Header_Category from './../../components/Header_Category';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Result from "./../../components/Result";
import { useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import CategoryFilter from './CategoryFilter';
import { SafeAreaView } from 'react-native-safe-area-context';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const CategoryScreen = ({ navigation, route }) => {

  const { serviceType } = route.params;

  const [serviceData, setServiceData] = useState([]);
  const [userDataFetched, setUserDataFetched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  async function getServiceData() {
    try {
      const services = [];
      //get all services from firestore with the serviceType of the category
      const snapshot = await firestore().collection('services').where('serviceType', '==', serviceType).get();
      snapshot.forEach(doc => {
        if (doc.data().status === 'Active') {
          services.push({ id: doc.id, data: doc.data() });
        }
      });

      setServiceData(services);
      setUserDataFetched(true);
    } catch (error) {
      console.error('Error getting user data from Firestore:', error);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      getServiceData();
    }, [route])
  );

  if (!userDataFetched || !serviceData) {
    return (
      null
    );
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>   
    <View style={{ flex: 1}}>
      <Header_Category title={serviceType} navigation={navigation} />
      <View style={styles.searchBar}>
        <MaterialIcons name="search" size={24} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search..."
          placeholderTextColor="gray"
          onChangeText={(text) => setSearchQuery(text)}
        />
        <TouchableOpacity onPress = {() => navigation.navigate('CategoryFilter' , {serviceType: serviceType, filterQuery: route.params})}>
        <Ionicons name="filter" size={24} color='black' style={styles.filter} />
        </TouchableOpacity>
      </View>
      
      {/* If serviceData.length == 0 display no results */}
      <Text style={styles.results}>Results</Text>
      {serviceData.length == 0 ? <Text style={{ textAlign: 'center', marginTop: 20 }}>No results found.</Text> :  <View style={{ marginTop: 1, marginBottom:200 }}>    
        <Result navigation={navigation} searchQuery={searchQuery} filterQuery={route.params} serviceData={serviceData} />
      </View>}

     
    </View>
    </SafeAreaView>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 20, // Adjust border radius to change the roundness
    borderWidth: 1, // Add a border
    borderColor: 'gray', // Border color
    marginVertical: 15, // Adjust vertical margin
    marginHorizontal: 20, // Adjust horizontal margin
    height: 45, // Adjust the height of the search bar
    width: '90%', // Adjust the width of the search bar
  },
  searchIcon: {
    marginRight: 5,
  },
  filterIcon: {
    
    fontSize: 55,
    height: 50,
    zIndex: 9999,
    left: 35.8, // Adjust position as needed
    paddingHorizontal: 9,
    marginHorizontal: 10, // Adjust horizontal margin
    bottom: windowHeight * 0.08, // Adjust position as needed
   transform: [{ translateY: -12 }], // Adjust to center the icon vertically

   
  },
  input: {
    flex: 1,
    height: 40,
    color: 'black',
  },
  results: {
    color: 'black',
    fontWeight:"bold",
    fontSize: 14,
    marginLeft:20,
    marginBottom:10,
    marginVertical: 10,
  }
});