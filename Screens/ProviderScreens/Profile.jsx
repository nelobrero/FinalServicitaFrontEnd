import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { useFocusEffect } from '@react-navigation/native'
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS } from "./../../constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import { CommonActions } from '@react-navigation/native';


export default Profile = ({ navigation, route }) => {
  
  const { userEmail } = route.params;
  const [userData, setUserData] = useState({});
  const [storeData, setStoreData] = useState({});
  const [serviceData, setServiceData] = useState({});
  const [userDataFetched, setUserDataFetched] = useState(false);
  const DEFAULT_IMAGE_URL_PROVIDER = "https://firebasestorage.googleapis.com/v0/b/servicita-signin-fa66f.appspot.com/o/DEPOLTIMEJ.jpg?alt=media&token=720651f9-4b46-4b9d-8131-ec4d8951a81b";

  async function getUserData() {
    await axios.post("http://192.168.1.7:5000/user/getUserDetailsByEmail", { email: userEmail }).then((response) => {
        setUserData(response.data.data);
      const storedId = response.data.data._id;
      getStoreData(storedId);
    }).catch(async (err) => {
      await AsyncStorage.removeItem('isLoggedIn');
      console.log(err);
    });
  }

  async function getStoreData(storedId) {
    try {
      const userRef = firestore().collection('providers').doc(storedId);
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
          services.push(doc.data());
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
  
  if (!userDataFetched) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.secondaryGray}} >
          <Image source={require('../../assets/loading.gif')} style={{width: 200, height: 200}} />
      </View>
    );
  }

  const navigateToEditProfile = () => {
    navigation.navigate("EditProfile", {userData: userData, storeData: storeData});
  };

  const navigateToSecurity = () => {
    console.log("Security function");
  };

  const navigateToNotifications = () => {
    console.log("Notifications function");
  };

  const navigateToPrivacy = () => {
    console.log("Privacy function");
  };

  const navigateToSubscription = () => {
    console.log("Subscription function")
  }

  const navigateToSupport= () => {
    console.log("Support function")
  }

  const navigateToTermsAndPolicies = () => {
    console.log("Terms and Policies function")
  }

  const navigateToFreeSpace = () => {
    console.log("Free Space function")
  }

  const navigateToDateSaver = () => {
    console.log("Date saver")
  }

  const navigateToReportProblem = () => {
    console.log("Report a problem")
  }

  const addAccount = () => {
    console.log("Add account")
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('isLoggedIn');
      await AsyncStorage.removeItem('token');
  
    
        navigation.dispatch(CommonActions.reset({
          index: 0,
          routes: [{ name: 'LoginNav' }],
        }));
      
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  const accountItems = [
    {
      icon: "person-outline",
      text: "My Account",
      action: navigateToEditProfile,
    },

    { icon: "security", text: "Security", action: navigateToSecurity },

    {
      icon: "notifications-none",
      text: "Notifications",
      action: navigateToNotifications,
    },

    { icon: "lock-outline", text: "Privacy", action: navigateToPrivacy },
  ];

  const supportItems = [
    {
        icon: "credit-card",
        text: "My Subscription",
        action: navigateToSubscription,
      },

      { icon: "help-outline", text: "Help & Support", action: navigateToSupport },

      {
        icon: "info-outline",
        text: "Terms and Policies",
        action: navigateToTermsAndPolicies,
      },
  ];

  const cacheAndCellularItems = [
    {icon: "delete-outline", text: "Free up space", action: navigateToFreeSpace},
    {icon: "save-alt", text: "Date saver", action: navigateToDateSaver},
  ];

  const actionsItems = [
    {icon: "outlined-flag", text: "Report a problem", action: navigateToReportProblem},
    { icon: "people-outline", text: "Add Account", action: addAccount },
    {icon: "logout", text: "Log out", action: logout},
  ]

  const renderSettingsItem = ({ icon, text, action }) => (
    <TouchableOpacity
      onPress={action}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingLeft: 12,
        backgroundColor: COLORS.white
      }}
    >
      <MaterialIcons name={icon} size={24} color="black" />
      <Text
        style={{
          marginLeft: 36,
          ...FONTS.semiBold,
          fontWeight: 600,
          fontSize: 16,
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
  return (
    

    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View
            style={{
              flexDirection:"row",
              marginVertical: 22,
              marginLeft: 50,
              marginTop: 50,
            }}
          >
              <Image
                source={{ uri: userData.profileImage ? userData.profileImage : DEFAULT_IMAGE_URL_PROVIDER }}
                style={{
                  height: 100,
                  width: 100,
                  borderColor: COLORS.primary,
                }}
              />
            <View>
            <Text style ={{
              color: COLORS.primary,
              marginTop:20,
              marginLeft: 30,
              fontSize: 16,
              fontWeight:"bold"
            }}
            
            >
                {storeData.name.firstName} {storeData.name.lastName}
            </Text>
            <Text style ={{
              color: COLORS.primary,
              marginLeft: 33,
              fontSize: 12
            }}
            
            >
              {userData.role}
            </Text>
            </View>
          </View>





      <ScrollView style={{ marginHorizontal: 12 }}>
        
        {/* ACCOUNT SETTINGS */}

        <View style={{ marginBottom: 12 }}>
          <Text style={{ ...FONTS.h4, marginVertical: 10 }}>Account</Text>
          <View
            style={{
              borderRadius: 12,
              backgroundColor: COLORS.white,
            }}
          >
            {accountItems.map((item, index) => (
              <React.Fragment key={index}>
                {renderSettingsItem(item)}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Support and About Settings */}
            
        <View style={{ marginBottom: 12 }}>
          <Text style={{ ...FONTS.h4, marginVertical: 10 }}>Support & About</Text>
          <View
            style={{
              borderRadius: 12,
              backgroundColor: COLORS.white,
            }}
          >
            {supportItems.map((item, index) => (
              <React.Fragment key={index}>
                {renderSettingsItem(item)}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Cache and Cellular */}

        <View style={{ marginBottom: 12 }}>
          <Text style={{ ...FONTS.h4, marginVertical: 10 }}>Cache & Cellular</Text>
          <View
            style={{
              borderRadius: 12,
              backgroundColor: COLORS.white,
            }}
          >
            {cacheAndCellularItems.map((item, index) => (
              <React.Fragment key={index}>
                {renderSettingsItem(item)}
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={{ marginBottom: 60 }}>
          <Text style={{ ...FONTS.h4, marginVertical: 10 }}>Actions</Text>
          <View
            style={{
              borderRadius: 12,
              backgroundColor: COLORS.white,
            }}
          >
            {actionsItems.map((item, index) => (
              <React.Fragment key={index}>
                {renderSettingsItem(item)}
              </React.Fragment>
            ))}
          </View>
        </View>


      </ScrollView>
   </View>
  );
};