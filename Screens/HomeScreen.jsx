import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image,  ScrollView, BackHandler, Alert } from "react-native";
import { Color, FontFamily, FontSize, Border} from "../GlobalStyles";
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';

function HomeScreen({navigation, props}) {
  const route = useRoute();
  const [userData, setUserData] = useState("");
  const [storeData, setStoreData] = useState("");

  async function getUserData() {
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    axios.post("http://192.168.1.14:5000/user/userData", {token: token}).then((res) => {
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
    getUserData();
  }, [storeData]);
  
  useEffect(() => {
    if (route.params && route.params.userData) {
      setUserData(route.params.userData);
      navigation.setParams({ userData: route.params.userData });
    } else {
      getUserData();
    }
  }
  , [route.params]);

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

  

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.homescreen}>
      <Image
        style={styles.image20Icon}
        contentFit="cover"
        source={require("../assets/image-20.png")}
      />
      <Text style={[styles.categories, styles.viewAllTypo]}>Categories</Text>
      <Text style={[styles.popularServices, styles.homescreenItemPosition]}>
        Popular Services
      </Text>
      <Text style={[styles.viewAll, styles.viewAllTypo]}>View All</Text>
      <Text style={styles.cebuCity}>Cebu City</Text>
      <Image
        style={styles.homescreenChild}
        contentFit="cover"
        source={require("../assets/frame-1.png")}
      />
      <View style={[styles.vectorParent, styles.frameChildLayout1]}>
        <Image
          style={[styles.frameChild, styles.frameChildLayout1]}
          contentFit="cover"
          source={require("../assets/rectangle-15.png")}
        />
        <Text style={styles.search}>Search</Text>
        <Image
          style={styles.searchIcon}
          contentFit="cover"
          source={require("../assets/search.png")}
        />
      </View>
      <View style={[styles.image13Parent, styles.parentLayout2]}>
        <Image
          style={[styles.image13Icon, styles.iconPosition1]}
          contentFit="cover"
          source={require("../assets/image-13.png")}
        />
        <Text style={[styles.p450, styles.p450Layout]}>P 450</Text>
        <Text style={[styles.manicure, styles.p450Layout]}>Manicure</Text>
        <View style={[styles.frameItem, styles.frameShadowBox]} />
        <Text style={[styles.bookNow, styles.bookTypo]}>Book Now</Text>
        <View style={styles.maskGroupParent}>
          <Image
            style={[styles.maskGroupIcon, styles.maskGroupLayout]}
            contentFit="cover"
            source={require("../assets/mask-group.png")}
          />
          <Image
            style={[styles.groupChild, styles.groupIconLayout]}
            contentFit="cover"
            source={require("../assets/group-14.png")}
          />
          <Text style={[styles.carlWyndelAsoy, styles.carlLayout]}>
            Carl Wyndel Asoy
          </Text>
        </View>
        <Image
          style={[styles.iconStarHalfAlt, styles.groupIconLayout]}
          contentFit="cover"
          source={require("../assets/-icon-starhalfalt.png")}
        />
        <Text style={[styles.loremIpsumDolor, styles.loremLayout]}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
          sollicitudin elit vitae efficitur maximus. In hac habitasse platea
          dictumst. Sed ullamcorper dignissim tortor vitae venenatis. Nulla nec
          lacus quis magna congue tincidunt a eget dolor.
        </Text>
      </View>
      <View style={styles.image12Parent}>
        <Image
          style={[styles.image12Icon, styles.iconPosition1]}
          contentFit="cover"
          source={require("../assets/image-12.png")}
        />
        <Text style={[styles.p300, styles.p300Position]}>P 300</Text>
        <Text style={[styles.handWashLaudry, styles.p450Layout]}>
          Hand Wash Laudry
        </Text>
        <View style={[styles.frameInner, styles.frameShadowBox]} />
        <Text style={[styles.bookNow1, styles.bookTypo]}>Book Now</Text>
        <Image
          style={[styles.groupIcon, styles.groupIconLayout]}
          contentFit="cover"
          source={require("../assets/group-141.png")}
        />
        <Text style={[styles.kentJohnDico, styles.carlLayout]}>
          Kent John Dico
        </Text>
        <Image
          style={[styles.maskGroupIcon1, styles.maskGroupLayout]}
          contentFit="cover"
          source={require("../assets/mask-group1.png")}
        />
        <Text style={[styles.loremIpsumDolor1, styles.p300Position]}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
          sollicitudin elit vitae efficitur maximus. In hac habitasse platea
          dictumst. Sed ullamcorper dignissim tortor vitae venenatis. Nulla nec
          lacus quis magna congue tincidunt a eget dolor.
        </Text>
      </View>
      <View style={[styles.image11Parent, styles.image11Layout]}>
        <Image
          style={[styles.image11Icon, styles.image11Layout]}
          contentFit="cover"
          source={require("../assets/image-11.png")}
        />
        <Text style={[styles.sinkRepair, styles.p450Layout]}>Sink Repair</Text>
        <Text style={[styles.p1299, styles.p450Layout]}>P 1, 299</Text>
        <View style={[styles.rectangleView, styles.frameShadowBox]} />
        <Text style={[styles.bookNow, styles.bookTypo]}>Book Now</Text>
        <View style={[styles.maskGroupGroup, styles.maskGroupLayout]}>
          <Image
            style={[styles.maskGroupIcon2, styles.maskGroupLayout]}
            contentFit="cover"
            source={require("../assets/mask-group.png")}
          />
          <Image
            style={[styles.groupItem, styles.groupIconLayout]}
            contentFit="cover"
            source={require("../assets/group-142.png")}
          />
          <Text style={[styles.carlWyndelAsoy1, styles.carlLayout]}>
            Carl Wyndel Asoy
          </Text>
        </View>
        <Text style={styles.loremIpsumDolor2}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
          sollicitudin elit vitae efficitur maximus. In hac habitasse platea
          dictumst. Sed ullamcorper dignissim tortor vitae venenatis. Nulla nec
          lacus quis magna congue tincidunt a eget dolor.
        </Text>
      </View>
      <View style={[styles.cleaningParent, styles.parentLayout]}>
        <Text style={[styles.cleaning, styles.cleaningTypo]}>Cleaning</Text>
        <View style={[styles.frameChild1, styles.frameChildLayout]} />
        <Image
          style={[styles.image38Icon, styles.iconPosition]}
          contentFit="cover"
          source={require("../assets/image-38.png")}
        />
      </View>
      <View style={[styles.manicureParent, styles.parentLayout1]}>
        <Text style={[styles.manicure1, styles.manicure1Layout]}>Manicure</Text>
        <View style={[styles.frameChild1, styles.frameChildLayout]} />
        <Image
          style={styles.image41Icon}
          contentFit="cover"
          source={require("../assets/image-41.png")}
        />
      </View>
      <View style={[styles.hairAndMakeUpParent, styles.parentLayout1]}>
        <Text style={[styles.hairAndMake, styles.cleaningTypo]}>{`Hair and
 Make Up`}</Text>
        <View style={[styles.frameChild1, styles.frameChildLayout]} />
        <Image
          style={[styles.image39Icon, styles.iconPosition]}
          contentFit="cover"
          source={require("../assets/image-39.png")}
        />
      </View>
      <View style={[styles.plumbingParent, styles.parentLayout]}>
        <Text style={[styles.plumbing, styles.cleaningTypo]}>Plumbing</Text>
        <View style={[styles.frameChild1, styles.frameChildLayout]} />
        <Image
          style={[styles.image42Icon, styles.manicure1Layout]}
          contentFit="cover"
          source={require("../assets/image-42.png")}
        />
      </View>
      <View style={[styles.electricianParent, styles.parentLayout1]}>
        <Text style={[styles.electrician, styles.cleaningTypo]}>
          Electrician
        </Text>
        <View style={[styles.frameChild5, styles.frameChildLayout]} />
        <Image
          style={styles.image43Icon}
          contentFit="cover"
          source={require("../assets/image-43.png")}
        />
      </View>
      <View style={[styles.homescreenItem, styles.homescreenItemPosition]} />
      <Image
        style={[styles.image61Icon, styles.carlLayout]}
        contentFit="cover"
        source={require("../assets/image-61.png")}
      />
      <View style={[styles.rectangleParent, styles.frameChild6Layout]}>
        <View style={[styles.frameChild6, styles.frameChild6Layout]} />
        <Image
          style={styles.image87Icon}
          contentFit="cover"
          source={require("../assets/image-87.png")}
        />
      </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  viewAllTypo: {
    height: 21,
    textAlign: "left",
    color: Color.colorBlack,
    fontFamily: FontFamily.didactGothicRegular,
    fontSize: FontSize.size_mini,
  },
  homescreenItemPosition: {
    left: 18,
    position: "absolute",
  },
  frameChildLayout1: {
    height: 49,
    width: 412,
    position: "absolute",
  },
  parentLayout2: {
    width: 370,
    left: 25,
  },
  iconPosition1: {
    borderRadius: Border.br_8xs,
    left: 0,
    top: 0,
  },
  p450Layout: {
    height: 27,
    textAlign: "left",
  },
  frameShadowBox: {
    width: 72,
    shadowOpacity: 1,
    elevation: 1,
    shadowRadius: 1,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: "rgba(0, 0, 0, 0.25)",
    height: 22,
    borderRadius: Border.br_8xs,
    position: "absolute",
    backgroundColor: Color.colorWhite,
  },
  bookTypo: {
    height: 17,
    textAlign: "center",
    width: 71,
    fontFamily: FontFamily.quicksandBold,
    fontWeight: "700",
    fontSize: FontSize.size_xs,
    position: "absolute",
  },
  maskGroupLayout: {
    height: 20,
    position: "absolute",
  },
  groupIconLayout: {
    maxHeight: "100%",
    maxWidth: "100%",
    position: "absolute",
    overflow: "hidden",
  },
  carlLayout: {
    height: 9,
    position: "absolute",
  },
  loremLayout: {
    height: 39,
    width: 217,
    textAlign: "justify",
    fontSize: FontSize.size_6xs,
    color: Color.colorBlack,
  },
  p300Position: {
    left: 154,
    fontFamily: FontFamily.didactGothicRegular,
    position: "absolute",
  },
  image11Layout: {
    height: 130,
    position: "absolute",
  },
  parentLayout: {
    height: 81,
    width: 62,
    top: 324,
    position: "absolute",
  },
  cleaningTypo: {
    fontFamily: FontFamily.quicksandRegular,
    fontSize: FontSize.size_3xs,
    textAlign: "center",
    color: Color.colorBlack,
  },
  frameChildLayout: {
    height: 58,
    backgroundColor: Color.colorSkyblue,
    width: 62,
    borderRadius: Border.br_8xs,
    left: 0,
    position: "absolute",
  },
  iconPosition: {
    height: 47,
    top: 5,
    position: "absolute",
  },
  parentLayout1: {
    width: 62,
    position: "absolute",
  },
  manicure1Layout: {
    width: 43,
    position: "absolute",
  },
  frameChild6Layout: {
    height: 46,
    width: 87,
    position: "absolute",
  },
  image20Icon: {
    left: -19,
    width: 465,
    height: 244,
    top: 0,
    position: "absolute",
  },
  categories: {
    left: 15,
    width: 114,
    height: 21,
    textAlign: "left",
    top: 293,
    position: "absolute",
  },
  popularServices: {
    top: 424,
    height: 21,
    textAlign: "left",
    color: Color.colorBlack,
    fontFamily: FontFamily.didactGothicRegular,
    fontSize: FontSize.size_mini,
    width: 114,
  },
  viewAll: {
    left: 366,
    width: 55,
    height: 21,
    textAlign: "left",
    top: 293,
    position: "absolute",
  },
  cebuCity: {
    top: 429,
    left: 345,
    width: 71,
    fontFamily: FontFamily.quicksandBold,
    fontWeight: "700",
    fontSize: FontSize.size_xs,
    height: 21,
    textAlign: "left",
    color: Color.colorBlack,
    position: "absolute",
  },
  homescreenChild: {
    top: 202,
    left: 197,
    width: 35,
    height: 8,
    position: "absolute",
  },
  frameChild: {
    borderRadius: Border.br_5xs,
    left: 0,
    top: 0,
  },
  search: {
    top: 14,
    left: 13,
    color: Color.colorGray,
    height: 21,
    width: 114,
    textAlign: "left",
    fontFamily: FontFamily.didactGothicRegular,
    fontSize: FontSize.size_mini,
    position: "absolute",
  },
  searchIcon: {
    top: 10,
    left: 373,
    width: 31,
    height: 29,
    position: "absolute",
  },
  vectorParent: {
    top: 235,
    left: 9,
  },
  image13Icon: {
    width: 143,
    height: 122,
    position: "absolute",
  },
  p450: {
    width: 96,
    height: 27,
    color: Color.colorSteelblue,
    fontSize: FontSize.size_sm,
    left: 152,
    top: 99,
    fontFamily: FontFamily.didactGothicRegular,
    position: "absolute",
  },
  manicure: {
    top: 9,
    width: 96,
    height: 27,
    left: 152,
    color: Color.colorBlack,
    fontSize: FontSize.size_mini,
    fontFamily: FontFamily.didactGothicRegular,
    position: "absolute",
  },
  frameItem: {
    height: 22,
    left: 298,
    top: 100,
    width: 72,
    shadowOpacity: 1,
    elevation: 1,
    shadowRadius: 1,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: "rgba(0, 0, 0, 0.25)",
  },
  bookNow: {
    left: 299,
    top: 103,
  },
  maskGroupIcon: {
    width: 20,
    height: 20,
    top: 2,
    left: 0,
  },
  groupChild: {
    height: "31.36%",
    width: "44.88%",
    top: "54.55%",
    right: "22.2%",
    bottom: "14.09%",
    left: "32.93%",
  },
  carlWyndelAsoy: {
    left: 30,
    width: 52,
    fontSize: FontSize.size_6xs,
    height: 9,
    color: Color.colorGray,
    textAlign: "left",
    fontFamily: FontFamily.didactGothicRegular,
    top: 0,
  },
  maskGroupParent: {
    top: 29,
    width: 82,
    left: 153,
    height: 22,
    position: "absolute",
  },
  iconStarHalfAlt: {
    height: "5.48%",
    width: "1.89%",
    top: "32.54%",
    right: "39.46%",
    bottom: "61.98%",
    left: "58.65%",
  },
  loremIpsumDolor: {
    top: 54,
    left: 153,
    fontFamily: FontFamily.didactGothicRegular,
    position: "absolute",
  },
  image13Parent: {
    top: 722,
    height: 126,
    position: "absolute",
  },
  image12Icon: {
    width: 144,
    height: 123,
    position: "absolute",
  },
  p300: {
    top: 102,
    height: 27,
    textAlign: "left",
    width: 96,
    color: Color.colorSteelblue,
    fontSize: FontSize.size_sm,
  },
  handWashLaudry: {
    top: 11,
    width: 148,
    left: 153,
    color: Color.colorBlack,
    fontSize: FontSize.size_mini,
    fontFamily: FontFamily.didactGothicRegular,
    position: "absolute",
  },
  frameInner: {
    left: 299,
    height: 22,
    top: 99,
  },
  bookNow1: {
    left: 300,
    top: 102,
  },
  groupIcon: {
    height: "5.35%",
    width: "12.67%",
    top: "32.09%",
    right: "39.08%",
    bottom: "62.56%",
    left: "48.25%",
  },
  kentJohnDico: {
    top: 33,
    left: 179,
    width: 52,
    fontSize: FontSize.size_6xs,
    height: 9,
    color: Color.colorGray,
    textAlign: "left",
    fontFamily: FontFamily.didactGothicRegular,
  },
  maskGroupIcon1: {
    top: 32,
    width: 20,
    height: 20,
    left: 153,
  },
  loremIpsumDolor1: {
    top: 57,
    height: 39,
    width: 217,
    textAlign: "justify",
    fontSize: FontSize.size_6xs,
    color: Color.colorBlack,
  },
  image12Parent: {
    top: 589,
    left: 24,
    width: 371,
    height: 129,
    position: "absolute",
  },
  image11Icon: {
    width: 141,
    borderRadius: Border.br_8xs,
    left: 0,
    top: 0,
  },
  sinkRepair: {
    top: 3,
    width: 96,
    height: 27,
    left: 152,
    color: Color.colorBlack,
    fontSize: FontSize.size_mini,
    fontFamily: FontFamily.didactGothicRegular,
    position: "absolute",
  },
  p1299: {
    left: 153,
    top: 103,
    width: 96,
    height: 27,
    color: Color.colorSteelblue,
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.didactGothicRegular,
    position: "absolute",
  },
  rectangleView: {
    height: 22,
    left: 298,
    top: 100,
    width: 72,
    shadowOpacity: 1,
    elevation: 1,
    shadowRadius: 1,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: "rgba(0, 0, 0, 0.25)",
  },
  maskGroupIcon2: {
    width: 20,
    height: 20,
    left: 0,
    top: 0,
  },
  groupItem: {
    height: "34.5%",
    width: "61.04%",
    top: "65%",
    right: "6.49%",
    bottom: "0.5%",
    left: "32.47%",
  },
  carlWyndelAsoy1: {
    top: 1,
    width: 52,
    fontSize: FontSize.size_6xs,
    height: 9,
    color: Color.colorGray,
    textAlign: "left",
    fontFamily: FontFamily.didactGothicRegular,
    left: 25,
  },
  maskGroupGroup: {
    top: 25,
    width: 77,
    left: 152,
  },
  loremIpsumDolor2: {
    top: 58,
    width: 217,
    textAlign: "justify",
    fontSize: FontSize.size_6xs,
    left: 153,
    color: Color.colorBlack,
    fontFamily: FontFamily.didactGothicRegular,
    position: "absolute",
  },
  image11Parent: {
    top: 451,
    width: 370,
    left: 25,
  },
  cleaning: {
    left: 2,
    width: 58,
    top: 59,
    fontSize: FontSize.size_3xs,
    height: 22,
    position: "absolute",
  },
  frameChild1: {
    top: 0,
  },
  image38Icon: {
    right: 7,
    width: 47,
  },
  cleaningParent: {
    left: 29,
  },
  manicure1: {
    top: 60,
    left: 10,
    fontFamily: FontFamily.quicksandRegular,
    fontSize: FontSize.size_3xs,
    textAlign: "center",
    color: Color.colorBlack,
    height: 22,
  },
  image41Icon: {
    right: 20,
    width: 22,
    height: 50,
    top: 2,
    position: "absolute",
  },
  manicureParent: {
    left: 103,
    height: 82,
    top: 324,
    width: 62,
  },
  hairAndMake: {
    top: 65,
    letterSpacing: 0.1,
    left: 9,
    position: "absolute",
  },
  image39Icon: {
    right: 16,
    width: 29,
  },
  hairAndMakeUpParent: {
    left: 346,
    height: 75,
    top: 324,
    width: 62,
  },
  plumbing: {
    left: 5,
    width: 51,
    top: 59,
    fontSize: FontSize.size_3xs,
    height: 22,
    position: "absolute",
  },
  image42Icon: {
    top: 6,
    right: 10,
    height: 42,
  },
  plumbingParent: {
    left: 184,
  },
  electrician: {
    top: 64,
    left: 8,
    width: 48,
    height: 22,
    position: "absolute",
  },
  frameChild5: {
    top: 4,
  },
  image43Icon: {
    right: 11,
    width: 40,
    height: 65,
    top: 0,
    position: "absolute",
  },
  electricianParent: {
    top: 320,
    left: 265,
    height: 86,
  },
  homescreenItem: {
    top: 418,
    borderStyle: "solid",
    borderColor: "#a4a0a0",
    borderTopWidth: 1,
    width: 391,
    height: 1,
  },
  image61Icon: {
    top: 432,
    left: 334,
    width: 9,
  },
  frameChild6: {
    borderRadius: Border.br_xl,
    left: 0,
    top: 0,
    backgroundColor: Color.colorWhite,
    width: 87,
  },
  image87Icon: {
    width: 36,
    height: 36,
    top: 5,
    left: 9,
    position: "absolute",
  },
  rectangleParent: {
    top: 133,
    left: 376,
  },
  homescreen: {
    flex: 1,
    width: "100%",
    height: 932,
    overflow: "hidden",
    backgroundColor: Color.colorWhite,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default HomeScreen;