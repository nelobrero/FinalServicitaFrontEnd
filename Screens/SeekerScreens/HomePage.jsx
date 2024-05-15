import { View, Text, Image, TextInput, TouchableOpacity, Pressable, StyleSheet, BackHandler, Alert, ScrollView, Dimensions} from 'react-native';
import React, {useState } from 'react';
import ImageSlider from './../../components/ImageSlider'; 
import { AntDesign, Ionicons } from '@expo/vector-icons';
import PopularServices from './PopularServices';
import { useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default HomePage = ({navigation, route}) => {

  const { userEmail } = route.params;

  const [userData, setUserData] = useState({});
  const [serviceData, setServiceData] = useState({});
  const [userDataFetched, setUserDataFetched] = useState(false);
  

  async function getUserData() {
    try {
      await axios.post("http://172.16.9.33:5000/user/getUserDetailsByEmail", { email: userEmail }).then((response) => {
        setUserData(response.data.data);
      }
      );

    } catch (error) {
      AsyncStorage.removeItem('isLoggedIn');
      console.error('Error getting user data from MongoDB:', error);
    }
  }



  async function getServiceData() {
    try {
      const services = [];
      const snapshot = await firestore().collection('services').get();
      snapshot.forEach((doc) => {
        if (doc.data().status === 'Active') {
          services.push({ id: doc.id, data: doc.data() });
        }
      });
      getUserData();
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

  if (!userDataFetched || !userData || !serviceData) {
    return (
      null
    );
  }

  return (
    <SafeAreaView style={{ flex: 1}}>
    <ScrollView  >
    <View style={styles.container}>
      
      <View style={styles.searchContainer}>
        <TouchableOpacity onPress={()=>navigation.navigate("Search", {userData: userData})} style={styles.searchTouchable}>
        <View style={styles.searchBar}>
       
          <AntDesign name="search1" size={24} color="#002D62" />
          
          <TextInput placeholder="Search for services or more" style={styles.searchInput} editable={false} />
          
        </View>
       </TouchableOpacity>
      </View>
    </View>


    {/* IMAGE SLIDER */}
      <View style={{marginTop:15}}>
        <ImageSlider />
        
      
    {/* Categories */}
<View>
<View style={styles.container1}>
  <View>
    <Text style={styles.categoriesText}>Services</Text>
  </View> 

  <View>
  <TouchableOpacity
  onPress={()=>navigation.navigate("Services")}>
      <Text style={styles.viewAllText}>View All</Text>
    </TouchableOpacity>
  </View> 
</View>
<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
<View  style={{flexDirection: "row", alignItems: "center", justifyContent:"center", flexWrap:'wrap' }}>

<View>
<TouchableOpacity
  onPress={()=>navigation.navigate("CategoryScreen", {serviceType: "Home Cleaner Service", userData: userData})}>
  <Image 
    source={require("./../../assets/Cleaning.png")}
    style={{
      height: 100,
      width: 93,
      resizeMode:'contain',
      marginRight: 2,
      marginLeft: 2
    }}
  />
</TouchableOpacity>
</View>

{/* Second Image */}
<View>
  <TouchableOpacity
  onPress={()=>navigation.navigate("CategoryScreen", {serviceType: "Manicure/Pedicure Service", userData: userData})}>
  <Image
    source={require("./../../assets/Manicure.png")}
    style={{
      height: 100,
      width: 93,
      resizeMode:'contain',
      marginRight: 2,
      marginLeft: 2
    }}
  />
  </TouchableOpacity>
</View>

{/* Third Image */}
<View>
  <TouchableOpacity
  onPress={()=>navigation.navigate("CategoryScreen", {serviceType: "Electrical Service", userData: userData})}>
  <Image
    source={require("./../../assets/Electric.png")}
    style={{
      height: 100,
      width: 93,
      resizeMode:'contain',
      marginRight: 2,
      marginLeft: 2
    }}
  />
  </TouchableOpacity>
</View>

{/* Fourth Image */}
<View>
  <TouchableOpacity
  onPress={()=>navigation.navigate("CategoryScreen", {serviceType: "Hair and Makeup Service", userData: userData})}>
  <Image
    source={require("./../../assets/Beauty.png")}
    style={{
      height: 100,
      width: 93,
      resizeMode:'contain',
      marginRight: 2,
      marginLeft: 2
    }}
  />
  </TouchableOpacity>
</View>

{/* Fifth Image */}
<View>
  <TouchableOpacity
  onPress={()=>navigation.navigate("CategoryScreen", {serviceType: "Catering Service", userData: userData})}>
  <Image
    source={require("./../../assets/Catering.png")}
    style={{
      height: 100,
      width: 93,
      resizeMode:'contain',
      marginRight: 2,
      marginLeft: 2
    }}
  />
  </TouchableOpacity>
</View>

{/* Sixth Image */}
<View>
  <TouchableOpacity
  onPress={()=>navigation.navigate("CategoryScreen", {serviceType: "Septic Tank Service", userData: userData})}>
  <Image
    source={require("./../../assets/Septic.png")}
    style={{
      height: 100,
      width: 93,
      resizeMode:'contain',
      marginRight: 2,
      marginLeft: 2
    }}
  />
  </TouchableOpacity>
</View>

{/* Seventh Image */}
<View>
  <TouchableOpacity
  onPress={()=>navigation.navigate("CategoryScreen", {serviceType: "Massage Service", userData: userData})}>
  <Image
    source={require("./../../assets/Massage.png")}
    style={{
      height: 100,
      width: 93,
      resizeMode:'contain',
      marginRight: 2,
      marginLeft: 2
    }}
  />
  </TouchableOpacity>
</View>

{/* Eight Image */}
<View>
  <TouchableOpacity
  onPress={()=>navigation.navigate("CategoryScreen", {serviceType: "Plumbing Service", userData: userData})}>
  <Image
    source={require("./../../assets/Plumbing.png")}
    style={{
      height: 100,
      width: 93,
      resizeMode:'contain',
      marginRight: 2,
      marginLeft: 2
    }}
  />
  </TouchableOpacity>
</View>

{/* Ninth Image */}
<View>
  <TouchableOpacity
  onPress={()=>navigation.navigate("CategoryScreen", {serviceType: "Tutoring Service", userData: userData})}>
  <Image
    source={require("./../../assets/Tutoring.png")}
    style={{
      height: 100,
      width: 93,
      resizeMode:'contain',
      marginRight: 2,
      marginLeft: 2
    }}
  />
  </TouchableOpacity>
</View>

</View>
</ScrollView>
</View>

    <View>
      <View style={{
    marginLeft: 20,
    marginBottom: 10}}>
    <Text style={{color: 'black',
    fontSize: 15,
    fontWeight:'bold'
    }}>Popular Services</Text>
    </View> 
    </View>
    </View>
    <PopularServices serviceData={serviceData} navigation={navigation} userData={userData} />
    </ScrollView>
    </SafeAreaView>

  )
}



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

    marginRight: 20,
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
  searchTouchable: {
    flexDirection: 'row',
    alignItems: 'center',

  }
});
 
  