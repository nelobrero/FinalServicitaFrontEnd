import { View, Text, Image, TextInput, TouchableOpacity, Pressable, StyleSheet, Dimensions, BackHandler, Alert} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { COLORS } from './../../constants/theme';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Result from "./../../components/Result";
import RecentSearch from "./../../components/RecentSearch";
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const SearchScreen = ({navigation, route}) => {

  const { userData } = route.params;
  const inputRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [serviceData, setServiceData] = useState([]);
  const [userDataFetched, setUserDataFetched] = useState(false);

  useEffect(() => {
    inputRef.current?.focus(); // Use optional chaining to prevent errors if inputRef is null
  }, []);

  async function getServiceData() {
    try {
      const services = [];
      const snapshot = await firestore().collection('services').get();
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

  const handleBackPress = () => {
    Alert.alert(
      "Exit App",
      "Exiting the application?",
      [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "Exit", onPress: () => BackHandler.exitApp() }
      ]
    );
    return true;
  }

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return() => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      }
    })
  )

  if (!userDataFetched) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.secondaryGray}} >
          <Image source={require('../../assets/loading.gif')} style={{width: 200, height: 200}} />
      </View>
    );
  }


  return (
    <SafeAreaView style ={{backgroundColor: 'white', height: '100%'}}>
      
      {/* Header */}

    <View style={styles.container}>
      <View style={styles.searchContainer}>
      <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
                marginLeft: 10,
                position: 'absolute',
                zIndex: 1
            }}
        >
            <MaterialIcons name="arrow-back-ios" size={20} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <AntDesign name="search1" size={24} color="#002D62" marginLeft={10} />
          <TextInput ref={inputRef} placeholder="Search for services or more" style={styles.searchInput} onChangeText={(text) => setSearchQuery(text)}  />
        </View>

        <Pressable onPress={()=>navigation.navigate("Filter", {filterQuery: route.params, userData: userData})}>
        <Ionicons name="filter" size={24} color="white" style={styles.filter} />
        </Pressable>
      </View>
    </View>

        <View style={{ marginTop: 15, marginBottom: 10 }}>
              

        <Text style={styles.results}>Results</Text>
        <Result navigation={navigation} searchQuery={searchQuery} filterQuery={route.params} serviceData={serviceData} userData={userData} />
          
        </View>



    </SafeAreaView>
   
  )
}


const styles = StyleSheet.create({
  container: {
   
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#07364B',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    marginHorizontal: 8, // Adjust horizontal margin to change space between search bar and filter icon
    marginRight: 50,
    marginLeft: 15
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingVertical: 8, // Adjust vertical padding to change height
    paddingHorizontal: 5,
    borderRadius: 20,
    backgroundColor: 'white',
    marginLeft: 25

  },
  searchInput: {
    flex: 1, // Take remaining space within the searchBar
    marginLeft: 8, // Adjust left margin to create space between icon and input
  },

  filter: {
    marginLeft: 15,
    
  },

  container1: {
    flexDirection: 'row',
    display:'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // Align items with space between them
    marginTop: 10,
    marginRight:20,
    marginLeft: 20,
    marginBottom: 10
  },
 
  viewAllText: {
    color: 'black',
    fontSize: 15,
    fontWeight:'bold'
  },

  categoriesText: {
    color: 'black',
    fontSize: 15,
    fontWeight:"bold"
  },
  results: {
    color: 'black',
    fontWeight:"bold",
    fontSize: 14,
    marginLeft:20,
    marginBottom:10,
  }
});

export default SearchScreen;