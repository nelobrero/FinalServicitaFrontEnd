import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, Image, ScrollView, StyleSheet, Pressable } from "react-native";
import { Color, FontSize, FontFamily } from "../GlobalStyles";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';


function ProfileScreen(props) {
  const navigation = useNavigation();
  const route = useRoute();
  console.log(props);
  const [userData, setUserData] = useState("");
  const [storeData, setStoreData] = useState("");



  

  const signOut = async () => {
    try {
      // Clear user data from AsyncStorage
      await AsyncStorage.removeItem('isLoggedIn');
      await AsyncStorage.removeItem('token');
  
      const exitLoggedIn = await AsyncStorage.getItem('exitButLoggedIn');
        // User exited the app but was still logged in so redirect to login screen when logging out from user opening the app again
      if (exitLoggedIn) {
        await AsyncStorage.removeItem('exitButLoggedIn');
        navigation.navigate('Login')
      } // Same Session Logout
      else {
        navigation.dispatch(CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        }));
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };


  async function getUserData() {
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    axios.post("http://172.16.3.248:5000/user/userdata", {token: token}).then((res) => {
      console.log(res.data);
      setUserData(res.data.data);
    }).catch((err) => {
      console.log(err);
    });
  }

  async function getStoreData() {
    try {
      const userRef = firestore().collection('users').doc(userData._id); // Assuming token is the document ID
      const doc = await userRef.get();
      if (doc.exists) {
        const storedData = doc.data();
        console.log(storedData);
        setStoreData(storedData);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error getting user data from Firestore:', error);
    }
  }

  useEffect(() => {
    getStoreData();
  }, [userData]);

  useEffect(() => {
    if (route.params && route.params.userData) {
      // Update state with the updated data
      const { name, email, mobile, birthdate, address } = route.params.userData;
      setStoreData({ name, email, mobile, birthdate, address });
    } else {
      getUserData();
    }
  }, [route.params]);

  

  const GoTo = () => {
    // Handle navigation logic here
    navigation.navigate("EditProfile"); // Replace "NextScreen" with the name of the screen you want to navigate to
  };
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.profileScreen}>
      <View style={styles.profileScreenChild} />
      <View style={[styles.profileScreenItem, styles.myAccountPosition]} />
      <ImageBackground
        style={styles.image14Icon}
        resizeMode="cover"
        source={require("../assets/image-14.png")}
      />
      <Text style={styles.carlWyndelAsoy}>{storeData.name}</Text>
      <Text style={[styles.rewards, styles.rewardsTypo]}>Rewards</Text>
      <Text style={styles.general}>General</Text>
      <Text style={[styles.logOut, styles.logOutTypo]} onPress={signOut}>Log out</Text>
      <Image
        style={styles.profileScreenInner}
        resizeMode="cover"
        source={require("../assets/rectangle-468.png")}
      />
      <View style={[styles.lineView, styles.lineViewLayout]} />
      <View style={[styles.profileScreenChild1, styles.lineViewLayout]} />
      <View style={[styles.termsConditionsParent, styles.parentLayout1]}>
        <Text style={[styles.termsConditions, styles.logOutTypo]}>Terms & Conditions</Text>
        <Image
          style={[styles.image127Icon, styles.iconLayout]}
          resizeMode="cover"
          source={require("../assets/image-127.png")}
        />
      </View>
      <View style={[styles.settingsParent, styles.parentLayout1]}>
        <Text style={[styles.termsConditions, styles.logOutTypo]}>Settings</Text>
        <Image
          style={[styles.image130Icon, styles.iconPosition]}
          resizeMode="cover"
          source={require("../assets/image-127.png")}
        />
      </View>
      <View style={[styles.helpCenterParent, styles.parentLayout]}>
        <Text style={[styles.termsConditions, styles.logOutTypo]}>Help Center</Text>
        <Image
          style={[styles.image131Icon, styles.iconPosition]}
          resizeMode="cover"
          source={require("../assets/image-127.png")}
        />
      </View>
      <View style={[styles.emergencyContactsParent, styles.parentLayout1]}>
        <Text style={[styles.termsConditions, styles.logOutTypo]}>Emergency Contacts</Text>
        <Image
          style={[styles.image130Icon, styles.iconPosition]}
          resizeMode="cover"
          source={require("../assets/image-127.png")}
        />
      </View>
      <View style={[styles.bookingScheduledParent, styles.parentLayout1]}>
        <Text style={[styles.termsConditions, styles.logOutTypo]}>Booking Scheduled</Text>
        <Image
          style={[styles.image133Icon, styles.iconLayout]}
          resizeMode="cover"
          source={require("../assets/image-127.png")}
        />
      </View>
      <View style={[styles.paymentMethodParent, styles.parentLayout1]}>
        <Text style={[styles.termsConditions, styles.logOutTypo]}>Payment Method</Text>
        <Image
          style={[styles.image130Icon, styles.iconPosition]}
          resizeMode="cover"
          source={require("../assets/image-127.png")}
        />
      </View>
      <View style={[styles.favouritesParent, styles.parentLayout1]}>
        <Text style={[styles.termsConditions, styles.logOutTypo]}>Favourites</Text>
        <Image
          style={[styles.image127Icon, styles.iconLayout]}
          resizeMode="cover"
          source={require("../assets/image-127.png")}
        />
      </View>
      <Pressable onPress={GoTo}>
      <View style={[styles.myAccountParent, styles.parentLayout]}>
        <Pressable onPress={GoTo} style={styles.innerPressable}>
          <Text style={[styles.myAccount, styles.rewardsTypo]}>My Account</Text>
          <Image
            style={[styles.image131Icon, styles.iconPosition]}
            resizeMode="cover"
            source={require("../assets/image-127.png")}
          />
        </Pressable>
      </View>
    </Pressable>
      <View style={[styles.shareFeedbackParent, styles.parentLayout1]}>
        <Text style={[styles.termsConditions, styles.logOutTypo]}>Share Feedback</Text>
        <Image
          style={[styles.image128Icon, styles.iconLayout]}
          resizeMode="cover"
          source={require("../assets/image-127.png")}
        />
      </View>
    </View>
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileScreen: {
    flex: 1,
    width: "100%",
    height: 932,
    overflow: "hidden",
    backgroundColor: Color.colorWhite,
  },
  myAccountPosition: {
    left: 0,
    top: 0,
  },
  rewardsTypo: {
    textAlign: "left",
    color: Color.colorBlack,
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.quicksandSemiBold,
    fontWeight: "600",
    position: "absolute",
  },
  logOutTypo: {
    color: Color.colorDarkgray,
    fontFamily: FontFamily.quicksandRegular,
    textAlign: "left",
    fontSize: FontSize.size_sm,
    position: "absolute",
  },
  lineViewLayout: {
    height: 1,
    width: 378,
    borderTopWidth: 1,
    borderColor: Color.colorSilver,
    borderStyle: "solid",
    position: "absolute",
  },
  parentLayout1: {
    height: 18,
    width: 358,
    left: 44,
    position: "absolute",
  },
  iconLayout: {
    height: 14,
    width: 4,
    left: 354,
    position: "absolute",
  },
  iconPosition: {
    top: 2,
    height: 14,
    width: 4,
    position: "absolute",
  },
  parentLayout: {
    width: 359,
    height: 18,
    left: 43,
    position: "absolute",
  },
  profileScreenChild: {
    top: 151,
    left: -3,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 1,
    width: 432,
    height: 160,
    position: "absolute",
    backgroundColor: Color.colorWhite,
  },
  profileScreenItem: {
    backgroundColor: "#05364c",
    width: 430,
    height: 151,
    position: "absolute",
  },
  image14Icon: {
    top: 76,
    width: 145,
    height: 141,
    left: 27,
    position: "absolute",
  },
  carlWyndelAsoy: {
    top: 106,
    left: 150,
    fontSize: 25,
    color: Color.colorWhite,
    textAlign: "center",
    width: 261,
    fontFamily: FontFamily.quicksandSemiBold,
    fontWeight: "600",
    position: "absolute",
  },
  rewards: {
    left: 43,
    textAlign: "left",
    color: Color.colorBlack,
    fontSize: FontSize.size_sm,
    top: 247,
  },
  general: {
    top: 572,
    left: 44,
    textAlign: "left",
    color: Color.colorBlack,
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.quicksandSemiBold,
    fontWeight: "600",
    position: "absolute",
  },
  logOut: {
    top: 777,
    left: 45,
  },
  profileScreenInner: {
    left: 368,
    width: 34,
    height: 20,
    top: 247,
    position: "absolute",
  },
  lineView: {
    top: 351,
    left: 27,
  },
  profileScreenChild1: {
    top: 540,
    left: 25,
  },
  termsConditions: {
    left: 0,
    top: 0,
  },
  image127Icon: {
    top: 0,
    height: 14,
    width: 4,
  },
  termsConditionsParent: {
    top: 695,
  },
  image130Icon: {
    left: 354,
    top: 2,
  },
  settingsParent: {
    top: 654,
  },
  image131Icon: {
    left: 355,
  },
  helpCenterParent: {
    top: 613,
  },
  emergencyContactsParent: {
    top: 492,
  },
  image133Icon: {
    top: 1,
  },
  bookingScheduledParent: {
    top: 451,
  },
  paymentMethodParent: {
    top: 410,
  },
  favouritesParent: {
    top: 369,
  },
  myAccount: {
    left: 0,
    top: 0,
  },
  myAccountParent: {
    top: 319,
  },
  image128Icon: {
    top: 4,
  },
  shareFeedbackParent: {
    top: 736,
  },
  innerPressable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProfileScreen;