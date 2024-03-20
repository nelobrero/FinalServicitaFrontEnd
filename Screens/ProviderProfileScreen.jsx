import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, Image, ScrollView, StyleSheet, Pressable } from "react-native";
import { Color, FontSize, FontFamily } from "../GlobalStyles";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

function ProviderProfileScreen(props) {
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
      if (exitLoggedIn) {
        await AsyncStorage.removeItem('exitButLoggedIn');
        navigation.navigate('Login')
      } else {
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
      const { name, shopName, service, email, mobile: contactNumber, birthdate, address } = route.params.userData;
      setStoreData({ name, shopName, service, email, mobile: contactNumber, birthdate, address });
    } else {
      getUserData();
    }
  }, [route.params]);

  const goTo = () => {
    // Handle navigation logic here
    navigation.navigate("EditProfile"); // Replace "NextScreen" with the name of the screen you want to navigate to
  };
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.providerProfileScreen}>
        <View
            style={[styles.providerProfileScreenChild, styles.settingsPosition]}
        />
        <Image
            style={styles.providerProfileScreenItem}
            contentFit="cover"
            source={require("../assets/rectangle-373.png")}
        />
        <Text style={[styles.euniceEnreraMakeup, styles.hairAndMakeTypo]}>
        {storeData && storeData.shopName ? storeData.shopName : "Shop Name"}
        </Text>
        <Text style={[styles.hairAndMake, styles.hairAndMakeTypo]}>
        {storeData && storeData.service ? storeData.service : "Service"}
        </Text>
        <Text style={[styles.promos, styles.promosTypo]}>Promos</Text>
        <Text style={[styles.general, styles.promosTypo]}>General</Text>
        <Text style={[styles.logOut, styles.logOutTypo]} onPress={signOut}>Log out</Text>
        <Image
            style={styles.providerProfileScreenInner}
            contentFit="cover"
            source={require("../assets/rectangle-468.png")}
        />
        <View style={[styles.lineView, styles.providerChildLayout]} />
        <View
            style={[styles.providerProfileScreenChild1, styles.providerChildLayout]}
        />
        <View
            style={[styles.providerProfileScreenChild2, styles.providerChildLayout]}
        />
        <View style={[styles.settingsParent, styles.parentLayout1]}>
            <Text style={[styles.settings, styles.logOutTypo]}>Settings</Text>
            <Image
            style={[styles.image130Icon, styles.iconLayout]}
            contentFit="cover"
            source={require("../assets/image-127.png")}
            />
        </View>
        <View style={[styles.helpCenterParent, styles.parentLayout]}>
            <Text style={[styles.settings, styles.logOutTypo]}>Help Center</Text>
            <Image
            style={[styles.image131Icon, styles.iconLayout]}
            contentFit="cover"
            source={require("../assets/image-127.png")}
            />
        </View>
        <View style={[styles.timeSlotParent, styles.parentLayout1]}>
            <Text style={[styles.settings, styles.logOutTypo]}>Time Slot</Text>
            <Image
            style={[styles.image130Icon, styles.iconLayout]}
            contentFit="cover"
            source={require("../assets/image-127.png")}
            />
        </View>
        <View style={[styles.bookingScheduledParent, styles.parentLayout1]}>
            <Text style={[styles.settings, styles.logOutTypo]}>
            Booking Scheduled
            </Text>
            <Image
            style={[styles.image133Icon, styles.iconLayout]}
            contentFit="cover"
            source={require("../assets/image-127.png")}
            />
        </View>
        <View style={[styles.incomeParent, styles.parentLayout1]}>
            <Text style={[styles.settings, styles.logOutTypo]}>Income</Text>
            <Image
            style={[styles.image130Icon, styles.iconLayout]}
            contentFit="cover"
            source={require("../assets/image-127.png")}
            />
        </View>
        <View style={[styles.reviewsParent, styles.parentLayout1]}>
            <Text style={[styles.settings, styles.logOutTypo]}>{`Reviews `}</Text>
            <Image
            style={[styles.image135Icon, styles.iconLayout]}
            contentFit="cover"
            source={require("../assets/image-127.png")}
            />
        </View>
        <Pressable onPress={goTo}>
            <View style={[styles.myAccountParent, styles.parentLayout]}>
                <Text style={[styles.myAccount, styles.promosTypo]}>My Account</Text>
                <Image
                style={[styles.image131Icon, styles.iconLayout]}
                contentFit="cover"
                source={require("../assets/image-127.png")}
                />
            </View>
        </Pressable>
        <View style={[styles.shareFeedbackParent, styles.parentLayout1]}>
            <Text style={[styles.settings, styles.logOutTypo]}>Share Feedback</Text>
            <Image
            style={[styles.image130Icon, styles.iconLayout]}
            contentFit="cover"
            source={require("../assets/image-127.png")}
            />
        </View>
        <View style={styles.termsConditionsParent}>
            <Text
            style={[styles.settings, styles.logOutTypo]}
            >{`Terms & Conditions`}</Text>
            <Image
            style={[styles.image130Icon, styles.iconLayout]}
            contentFit="cover"
            source={require("../assets/image-127.png")}
            />
        </View>
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  settingsPosition: {
    left: 0,
    top: 0,
  },
  hairAndMakeTypo: {
    textAlign: "left",
    fontFamily: FontFamily.quicksandBold,
    fontWeight: "700",
    lineHeight: 15,
    left: 179,
    position: "absolute",
  },
  promosTypo: {
    color: Color.colorBlack,
    fontFamily: FontFamily.quicksandSemiBold,
    fontWeight: "600",
    fontSize: FontSize.size_sm,
    textAlign: "left",
    position: "absolute",
  },
  logOutTypo: {
    color: Color.colorDarkgray,
    fontFamily: FontFamily.quicksandRegular,
    fontSize: FontSize.size_sm,
    textAlign: "left",
    position: "absolute",
  },
  providerChildLayout: {
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
    position: "absolute",
  },
  parentLayout: {
    width: 359,
    height: 18,
    left: 43,
    position: "absolute",
  },
  providerProfileScreenChild: {
    backgroundColor: Color.colorDarkslategray_100,
    width: 430,
    height: 151,
    position: "absolute",
  },
  providerProfileScreenItem: {
    top: 78,
    width: 143,
    height: 146,
    left: 27,
    position: "absolute",
  },
  euniceEnreraMakeup: {
    top: 112,
    fontSize: 15,
    letterSpacing: 0.8,
    color: Color.colorWhite,
    width: 239,
  },
  hairAndMake: {
    top: 159,
    fontSize: 12,
    letterSpacing: 0.6,
    color: "#002f45",
    width: 261,
  },
  promos: {
    left: 43,
    color: Color.colorBlack,
    fontFamily: FontFamily.quicksandSemiBold,
    fontWeight: "600",
    fontSize: FontSize.size_sm,
    top: 263,
  },
  general: {
    top: 572,
    left: 44,
  },
  logOut: {
    top: 777,
    left: 44,
  },
  providerProfileScreenInner: {
    left: 368,
    width: 34,
    height: 20,
    top: 263,
    position: "absolute",
  },
  lineView: {
    top: 305,
    left: 27,
  },
  providerProfileScreenChild1: {
    top: 351,
    left: 27,
  },
  providerProfileScreenChild2: {
    top: 540,
    left: 25,
  },
  settings: {
    left: 0,
    top: 0,
  },
  image130Icon: {
    left: 354,
    height: 14,
    width: 4,
    top: 2,
  },
  settingsParent: {
    top: 654,
  },
  image131Icon: {
    left: 355,
    top: 2,
  },
  helpCenterParent: {
    top: 613,
  },
  timeSlotParent: {
    top: 492,
  },
  image133Icon: {
    top: 1,
    left: 354,
    height: 14,
    width: 4,
  },
  bookingScheduledParent: {
    top: 451,
  },
  incomeParent: {
    top: 410,
  },
  image135Icon: {
    left: 354,
    height: 14,
    width: 4,
    top: 0,
  },
  reviewsParent: {
    top: 369,
  },
  myAccount: {
    left: 0,
    top: 0,
  },
  myAccountParent: {
    top: 319,
  },
  shareFeedbackParent: {
    top: 736,
  },
  termsConditionsParent: {
    top: 695,
    height: 23,
    width: 358,
    left: 44,
    position: "absolute",
  },
  providerProfileScreen: {
    backgroundColor: Color.colorWhite,
    flex: 1,
    width: "100%",
    height: 932,
    overflow: "hidden",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProviderProfileScreen;