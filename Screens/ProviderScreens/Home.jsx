import { View, Text, Image, StyleSheet, ScrollView, BackHandler, Alert, Dimensions, Pressable, TouchableOpacity } from "react-native";
import { useFocusEffect } from '@react-navigation/native'
import React, { useState } from "react";
import { COLORS, FONTS } from "../../constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons, AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';

const { width, height } = Dimensions.get("window");

export default Home = ({ navigation, route }) => {

  const { userEmail } = route.params;
  const [userData, setUserData] = useState({});
  const [storeData, setStoreData] = useState({});
  const [serviceData, setServiceData] = useState({});
  const [userDataFetched, setUserDataFetched] = useState(false);

  const DEFAULT_IMAGE_URL_PROVIDER = "https://firebasestorage.googleapis.com/v0/b/servicita-signin-fa66f.appspot.com/o/DEPOLTIMEJ.jpg?alt=media&token=720651f9-4b46-4b9d-8131-ec4d8951a81b";

  async function getUserData() {
    await axios.post("http://192.168.1.7:5000/user/getUserDetailsByEmail", { email: userEmail }).then((response) => {
      setUserData(response.data.data);
      const roleText = response.data.data.role === 'Seeker' ? 'seekers' : 'providers';
      const storedId = response.data.data._id;
      getStoreData(roleText, storedId);
    }).catch(async (err) => {
      await AsyncStorage.removeItem('isLoggedIn');
      console.log(err);
    });
  }

  async function getStoreData(roleText, storedId) {
    try {
      const userRef = firestore().collection(roleText).doc(storedId);
      const doc = await userRef.get();
      if (doc.exists) {
        const storedData = doc.data();
        setStoreData(storedData);
        getServiceData(storedData);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error getting user data from Firestore:', error);
    }
  }
  
  async function getServiceData(providerData) {
    try {
      const services = [];
      for (let i = 0; i < providerData.services.length; i++) {
        const serviceRef = firestore().collection('services').doc(providerData.services[i]);
        const doc = await serviceRef.get();
        if (doc.exists) {
          services.push({ id: doc.id, data: doc.data() });
        } else {
          console.log('No such document!');
        }
      }
      setServiceData(services);
      setUserDataFetched(true);
    } catch (error) {
      console.error('Error getting user data from Firestore:', error);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      getUserData();
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

  // Use loading gif file

  if (!userDataFetched) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.secondaryGray}} >
          <Image source={require('../../assets/loading.gif')} style={{width: 200, height: 200}} />
      </View>
    );
  }

  return (

    <ScrollView>
      {/* Notification Button */}
      <View style={styles.notificationButton}>
        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
        <Ionicons name="notifications" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={{ flex: 1, alignItems: "center", marginTop: height * 0.02 }}>
          <Image
            source={{ uri: userData.profileImage ? userData.profileImage : DEFAULT_IMAGE_URL_PROVIDER }}
            resizeMode="cover"
            style={{
              height: 155,
              width: 155,
              borderRadius: 999,
              borderColor: COLORS.primary,
              borderWidth: 2,
            
            }}
          />
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 30,
              color: COLORS.primary,
              marginTop: 30,
            }}
          > {storeData.name.firstName} {storeData.name.lastName}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            paddingHorizontal: width * 0.1,
            marginVertical: height * 0.02,
            flexWrap: "wrap",
          }}
        >
          {serviceData.map((service, index) => {
            return (
              <View
                key={index}
                style={{
                  backgroundColor: COLORS.gray,
                  borderRadius: width * 0.1,
                  padding: width * 0.025,
                  margin: width * 0.02,
                }}
              >
                <Text
                  style={{
                    color: COLORS.primary
                  }}
                >
                  {service.data.serviceType}
                </Text>
              </View>
            );
          }
          )}
        </View>
        </View>
      <View style={styles.container2}>
        <View
          style={{
            marginTop: height * 0.005,
            justifyContent: "space-between",
            paddingHorizontal: width * 0.05,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
              marginTop: height * 0.01,
              color: COLORS.primary,
            }}
          >
            Contact Details:
          </Text>

        </View>
      </View>

      <View
        style={{
          marginTop: 20,  
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 50,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            marginVertical: 6,
            alignItems: "center",
          }}
        >
          <MaterialIcons name="location-on" size={20} color="black" />
          <Text
            style={{
              ...FONTS.body4,
              marginLeft: 4,
            }}
          >
            {storeData.address.cityMunicipality}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginVertical: 6,
            alignItems: "center",
          }}
        >
          <AntDesign name="phone" size={20} color="black" />
        <Text
          style={{
            ...FONTS.body4,
            marginLeft: 4,
          }}
        >
          {userData.mobile}
        </Text>
        </View>
      </View>

      <View
        style={{
          paddingHorizontal: 50,
          flexDirection: "row",
          marginVertical: height * 0.01,
          marginBottom: height * 0.03,
          alignItems: "center",
        }}
      >
        

        <Feather name="mail" size={20} color="black" />
          <Text
            style={{
              ...FONTS.body4,
              marginLeft: 4,
            }}
          >
            {userData.email}
          </Text>
      </View>

      <View style={styles.container2}>
      <View
          style={{
            marginTop: height * 0.005,
            justifyContent: "space-between",
            paddingHorizontal: width * 0.05,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
              marginTop: height * 0.01,
              color: COLORS.primary,
            }}
          >
          
            Manage Your Services:
          </Text>
          </View>
          
          </View>
          <View style={{marginBottom: height * 0.085 }}>
            {serviceData.map((service, index) => {
              return (
                <View
                  key={index}
                  style={{
                    top: height * 0.009,
                    padding: width * 0.04,
                    paddingHorizontal: width * 0.07,
                    borderBottomWidth: 0.2,
                    borderBottomColor: COLORS.primary,
                  }}
                >
                <Pressable onPress={() => navigation.navigate('ServicePage', {service: service, storeData: storeData, userData: userData})}>
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                 
                  <Text
                    style={{
                      color: COLORS.primary
                    }}
                  >
                    {service.data.name}
                  </Text>
                  <AntDesign name="right" size={20} color={COLORS.primary} />
                  
                </View>
                </Pressable>
                </View>
              );
            }
            
           

            )}

<View style={{flexDirection: "row", justifyContent: "space-between", paddingHorizontal: width * 0.07, padding: width * 0.04, borderBottomWidth: 0.2, borderBottomColor: COLORS.primary, top: height * 0.009,}}>
              <Pressable onPress={() => navigation.navigate('Create', {userEmail})}>
                <Text style={{color: COLORS.primary}}>Create a new service</Text>
              </Pressable>
              <AntDesign name="plus" size={20} color={COLORS.primary} />
            </View>
            </View>
            
        
    
   
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff", // Change this to your desired background color
    shadowColor: "#000",
    paddingBottom: height * 0.001,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 4,
    shadowRadius: 3.84,
    elevation: 5,
  },

  container1: {
    width: 136, 
    height: 40, 
    borderWidth: 2, 
    borderColor: COLORS.primary,
    alignItems:"center",
    textAlignVertical:"center",
    justifyContent:"center",
    textAlign:"center"
  },

  container2: {
    backgroundColor: "#ffffff", // Change this to your desired background color
    shadowColor: "#000",
    paddingBottom: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderTopWidth: 1, // Adjust this value to control the "shadow" thickness
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  notificationButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },

});
