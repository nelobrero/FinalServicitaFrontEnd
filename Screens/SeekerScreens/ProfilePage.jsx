import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Alert, Dimensions, Modal, TextInput  } from "react-native";
import React, { useState } from "react";
import { useFocusEffect } from '@react-navigation/native'
import { COLORS, FONTS } from "../../constants/theme";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import { CommonActions } from '@react-navigation/native';
import { Border, FontSize, FontFamily, Color } from "./../../GlobalStyles";
import Button from './../../components/Button';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default ProfilePage = ({ navigation, route }) => {
  
  const { userEmail } = route.params;
  const [userData, setUserData] = useState({});
  const [storeData, setStoreData] = useState({});
  const [userDataFetched, setUserDataFetched] = useState(false);
  const DEFAULT_IMAGE_URL_PROVIDER = "https://firebasestorage.googleapis.com/v0/b/servicita-signin-fa66f.appspot.com/o/ProviderDefault.png?alt=media&token=627a6ccc-3aa9-46a6-836f-0c9e4cefa3b3";
  const [modalVisible, setModalVisible] = useState(false);
  const [complaint, setComplaint] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReportLoading, setIsReportLoading] = useState(true);
  const [hasReported, setHasReported] = useState(null);
  


  async function getUserData() {
    await axios.post("http://3.26.59.191:5001/user/getUserDetailsByEmail", { email: userEmail }).then((response) => {
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
      const userRef = firestore().collection('seekers').doc(storedId);
      const doc = await userRef.get();
      if (doc.exists) {
        const storedData = doc.data();
        setStoreData(storedData);
        setUserDataFetched(true);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error getting user data from Firestore:', error);
    }
  }
  
  const handleReportModalClose = () => {
    setModalVisible(false);
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    const reportData = {
      reporterId: userData._id,
      reportedId: "1",
      bookingId: "1",
      reason: complaint,
      status: 'PENDING'
    }
    await axios.post("http://3.26.59.191:5001/report/createReport", reportData);
    setIsLoading(false);
    setComplaint('');
    const notification = {
      userId: "66111acbea0491231d30d8a7",
      message: `User ${userData._id} has reported an issue. Please review the report.`,
      title: "New Issue to Review",
      otherUserId: userData._id,
    };
  
    await axios.post("http://3.26.59.191:5001/notifications/create", notification)
    setModalVisible(false);
    Alert.alert('Report submitted successfully! The Servicita team will review your report.');
};

const checkForReport = async () => {
  setIsReportLoading(true);
  const response = await axios.post("http://3.26.59.191:5001/report/getReportByBookingId", { bookingId: '1', reporterId: userData._id });
  setHasReported(response.data);
  setIsReportLoading(false);
}



  useFocusEffect(
    React.useCallback(() => {
      getUserData();
      checkForReport();
    }, [route])
  );
  
  if (!userDataFetched || isLoading || isReportLoading) {
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
    if (hasReported) {
      Alert.alert('You have already reported an issue. Please wait for the Servicita team to review your report.');
      return;
    }
    setModalVisible(true);
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

    { icon: "security", 
      text: "Security",
      action: navigateToSecurity 
    },

    

    { icon: "lock-outline", text: "Privacy"},
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
    { icon: "people-outline", text: "Switch as Provider", action: addAccount },
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
        backgroundColor: COLORS.white,
        opacity: text !== "My Account" && text !== "Report a problem" && text !== "Log out" ? 0.2 : 1
      }}
      disabled={text === "Security" || text === "Notifications" || text === "Privacy" || text === "My Subscription" || text === "Help & Support"|| text === "Terms and Policies" || text === "Free up space"  || text === "Date saver" ||  text === "Add Account" }
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
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}
    >

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
        
        <Modal
  visible={modalVisible}
  animationType="slide"
  transparent={true}
>
 
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"always"}>
      
      <Text style={styles.modalHeader}>Report</Text>
      <TouchableOpacity onPress={handleReportModalClose} style={styles.closeIcon}>
        <AntDesign name="close" size={24} color="#07374d" />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Enter your complaint..."
        textAlignVertical="top"
        onChangeText={(text) => setComplaint(text)}
        value={complaint}
      />
      <Button title="Submit" onPress={handleSubmit} 
      filled 
      Color={Color.colorWhite} 
      style={{ 
        backgroundColor: "#07374d",
        borderColor: "#07374d",
      }} 
      disabled={complaint === ''}
      />
      </ScrollView>
    </View>
  </View>
  
</Modal>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#07374d",
    height: Dimensions.get('window').height * 0.1, 
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  title: {
    fontSize:  23,
    lineHeight: 50,
    fontWeight: "700",
    fontFamily: "Lobster-Regular",
    color: Color.colorWhite,
    display: "flex",
    alignItems: "center",
    width: 326,
    textAlign: "left",
    position: "absolute",
    marginLeft: 45,
  },
  icon: {
    marginLeft: 10, 
  },
  acceptLayout: {
    height: 53,
    width: 371,
    left: 32,
    position: "absolute",
  },
  childLayout: {
    borderRadius: Border.br_3xs,
    left: 0,
    top: 0,
    height: 53,
    width: 371,
    position: "absolute",
  },
  accept1Typo: {
    alignItems: "center",
    display: "flex",
    color: Color.colorWhite,
    fontFamily: FontFamily.quicksandBold,
    fontWeight: "700",
    lineHeight: 50,
    position: "absolute",
  },
  transactionLayout1: {
    height: 188,
    //width: 350,
    width: windowWidth * 0.890, 
    position: "absolute",
  },
  childShadowBox: {
    borderWidth: 0.2,
    borderColor: Color.colorBlack,
    borderStyle: "solid",
    shadowOpacity: 1,
    elevation: 7,
    shadowRadius: 7,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowColor: "rgba(0, 0, 0, 0.25)",
    left: 0,
    top: 0,
    backgroundColor: Color.colorWhite,
  },
  transactionLayout: {
    height: 156,
    color: Color.colorBlack,
    lineHeight: 30,
    letterSpacing: 0.6,
    fontSize: FontSize.size_xs,
    position: "absolute",
  },
  bookingTypo: {
    textAlign: "right",
    fontFamily: FontFamily.quicksandMedium,
    fontWeight: "500",
  },
  bookingdetsLayout: {
    height: 164,
    width: windowWidth * 0.890, 
    position: "absolute",
  },
  bookingPosition: {
    lineHeight: 27,
    top: 13,
    color: Color.colorBlack,
    letterSpacing: 0.6,
    fontSize: FontSize.size_xs,
    position: "absolute",
  },
  messageLayout: {
    height: 21,
    width: 139,
    position: "relative",
  },
  servicenamePosition: {
    top: 106,
    position: "absolute",
  },
  headerPosition: {
    height: 76,
    width: 430,
    left: 0,
    top: 0,
    position: "absolute",
  },
  acceptChild: {
    backgroundColor: Color.colorDarkslategray_500,
  },
  accept1: {
    top: 1,
    left: 88,
    textAlign: "center",
    justifyContent: "center",
    width: 196,
    height: 51,
    fontSize: FontSize.size_xl,
    alignItems: "center",
    display: "flex",
    color: Color.colorWhite,
    fontFamily: FontFamily.quicksandBold,
    fontWeight: "700",
    lineHeight: 50,
  },
  accept: {
    top: 781,
  },
  cancelChild: {
    backgroundColor: Color.colorGray,
  },
  cancel: {
    top: 844,
  },
  transactionDetsChild: {
    height: 188,
    width: windowWidth * 0.890, 
    position: "absolute",
  },
  transactionIdBooking: {
    top: 17,
    width: 108,
    textAlign: "left",
    // left: 21,
    left: windowWidth * 0.051,
    fontFamily: FontFamily.quicksandBold,
    fontWeight: "700",
  },
  transaction: {
    top: 19,
    // left: 219,
    right: windowWidth * 0.051,
    width: windowWidth * 0.890,
    height: 156,
    color: Color.colorBlack,
    lineHeight: 30,
    letterSpacing: 0.6,
    fontSize: 11,
    position: "absolute",
  },
  transactionDets: {
    top: 340,
    // left: 40,
    //  justifyContent: 'center', 
    // alignItems: 'center'
  },
  bookingdetsChild: {
    borderWidth: 0.2,
    borderColor: Color.colorBlack,
    borderStyle: "solid",
    shadowOpacity: 1,
    elevation: 7,
    shadowRadius: 7,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowColor: "rgba(0, 0, 0, 0.25)",
    left: 0,
    top: 0,
    backgroundColor: Color.colorWhite,
  },
  bookingIdSeeker: {
    width: 77,
    height: 136,
    textAlign: "left",
    left: windowWidth * 0.051,
    // left: 21,
    fontFamily: FontFamily.quicksandBold,
    fontWeight: "700",
  },
  booking: {
    // left: 158,
    right: windowWidth * 0.051,
    width: 172,
    height: 142,
    textAlign: "right",
    fontFamily: FontFamily.quicksandMedium,
    fontWeight: "500",
  },
  bookingdets: {
    top: 160,
    // left: 40,
  },
  messageChild: {
    borderRadius: 4,
    backgroundColor: "#dbdbdb",
    left: 0,
    top: 0,
    height: 21,
    width: 139,
  },
  messageSeeker: {
    top: 3,
    left: 28,
    fontWeight: "600",
    fontFamily: FontFamily.quicksandSemiBold,
    color: Color.colorDarkslategray_500,
    textAlign: "left",
    lineHeight: 15,
    letterSpacing: 0.6,
    fontSize: FontSize.size_xs,
    position: "absolute",
  },
  letterIcon: {
    top: 4,
    left: 9,
    width: 17,
    height: 13,
    position: "absolute",
  },
  message: {
    top: 176,
    left: 130,
  },
  servicename: {
    left: 130,
    letterSpacing: 1,
    lineHeight: 20,
    fontFamily: FontFamily.quicksandRegular,
    width: 227,
    height: 56,
    textAlign: "left",
    color: Color.colorBlack,
    top: 106,
    alignItems: "center",
    display: "flex",
    fontSize: FontSize.size_xl,
  },
  serviceimageIcon: {
    width: 118,
    height: 118,
    left: 0,
  },
  headerChild: {
    backgroundColor: Color.colorDarkslategray_500,
  },
  chevronLeftIcon: {
    top: 14,
    left: 15,
    width: 35,
    height: 48,
    position: "absolute",
  },
  forApproval: {
    top: 12,
    left: 52,
    fontSize: FontSize.size_21xl,
    width: 326,
    textAlign: "left",
  },
  providerbookingdetails: {
    flex: 1,
    width: "100%",
    height: 932,
    overflow: "hidden",
    backgroundColor: Color.colorWhite,
  },
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    position:"relative",
    justifyContent: 'center',
},
centeredContainer1: {
  
  alignItems: 'center',
  position:"relative",
  justifyContent: 'center',
},
servicecontainerLayout: {
height: 118,
position: "absolute",

},
servicecontainer: {
    top: -80,
    width: windowWidth * 0.890, 
    
    
},
modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalContent: {
  backgroundColor: 'white',
  borderRadius: 10,
  padding: 20,
  width: '80%',
  maxHeight: '95%',
},
modalHeader: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 10,
},
input: {
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 5,
  padding: 10,
  height:200,
  maxHeight: 200,
  // minHeight: 200,
},
closeIcon: {
  position: 'absolute',
  top: 5,
  right: 5,

},
bookingscreen2: {
  flex: 1,
  width: "100%",
  height:  760,
  height: windowHeight > 732 ? windowHeight : 770,
  overflow: "hidden",
  // backgroundColor: Color.colorWhite,
  
  
},

container01: {
  // flex: 1,
  // justifyContent: "center",
  alignItems: "center",
  // backgroundColor: "#ffffff",
},
providerInfo: {
  position: "relative",
  top: windowHeight* -0.335,
//  alignItems: "center", 
},




container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalContent: {
  backgroundColor: 'white',
  borderRadius: 10,
  padding: 20,
  width: '80%',
  maxHeight: '80%',
},
modalHeader: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 10,
  textAlign: 'left',
},
input: {
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 5,
  padding: 10,
  marginBottom: 20,
  height: 200,
  maxHeight: 200,
},
cameraIconContainer: {
  position: 'absolute',
  bottom: 30,
  right: 15,
},
image: {
  width: 90,
  height: 90,
  resizeMode: 'cover',
  marginBottom: 10,
  borderRadius: 10, // Add border radius for rounded corners
  borderWidth: 1, // Add border width for a border around the image
  borderColor: '#ddd', // Set border color
},
submitButton: {
  marginTop: 30,
},
centeredView: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalView: {
  backgroundColor: "#07374d",
  borderColor:"#9F9C9C", 
  borderWidth: 17,
  borderRadius: windowWidth * 0.5,
  width: windowWidth * 0.75,
  height: windowWidth * 0.75,
  alignItems: "center",
  justifyContent: "center",
  shadowColor: "#000",
  shadowOffset: {
      width: 0,
      height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 20,
  
},
modalText: {
  textAlign: "center",
  fontSize: 50,
  fontWeight: "700",
  color: 'white',
  fontFamily: FontFamily.quicksandBold,
},
closeButton: {
  position: 'absolute',
  top: 10,
  right: 10,
},


//////////////
servicecontainer2Layout: {
  height: 118,
  position: "absolute",
},
serviceinfo2Layout: {
  width: 246,
  top: 0,
},
role2FlexBox: {
  textAlign: "left",
  position: "absolute",
},
message2Layout: {
  height: 21,
  width: 139,
  left: 0,
  // position: "absolute",
},
serviceimage2Icon: {
  width: 118,
  left: 0,
  top: 0,
},
servicename2: {
  fontSize: FontSize.size_xl,
  letterSpacing: 1,
  lineHeight: 20,
  fontFamily: FontFamily.quicksandRegular,
  color: Color.colorBlack,
  display: "flex",
  alignItems: "center",
  width: windowWidth * 0.6,
  textAlign: "left",
  
  
  paddingBottom: 1,
  
},
message2Child: {
  borderRadius: Border.br_9xs,
  backgroundColor: Color.colorGainsboro_100,
  top: 0,
},
role2: {
  top: 3,
  left: 24,
  fontSize: FontSize.size_xs,
  letterSpacing: 0.6,
  lineHeight: 15,
  fontWeight: "600",
  fontFamily: FontFamily.quicksandSemiBold,
  color: Color.colorDarkslategray_500,
},
lettericon2: {
  top: 4,
  left: 4,
  width: 17,
  height: 13,
  position: "absolute",
},
message2: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 5,
},
serviceinfo2: {
  left: 126,
  height: 85,
  position: "absolute",
},
servicecontainer2: {
  top: 20,
  width: windowWidth * 0.890, 
    
},
serviceinfo: {
  backgroundColor: Color.colorWhite,
  flex: 1,
  width: "100%",
  height: 932,
  overflow: "hidden",
},
mapContainer: {
  flex: 1,
  width: "90%",
  height: windowHeight * 0.54,
  backgroundColor: Color.colorWhite,
  borderRadius: Border.br_mini,
  position: "absolute",
  bottom: windowHeight * 0.195,
},
containerGif: {
  flex: 1,
  // justifyContent: 'center',
  paddingTop: 50,
  alignItems: 'center',
  top: windowHeight * 0.08,
},
sched: {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 10,
  position: "absolute",
  top: windowHeight * 0.02,  
},
time: {
  fontSize: 18,
  marginBottom: 20,
  position: "absolute",
  top: windowHeight * 0.07,  
},
gif: {
  width: windowWidth * 0.95,
  height: windowWidth * 0.95,
  marginBottom: 20,
},
wonderful: {
  
  fontSize: 25,
  // fontStyle: 'italic',
  position: "absolute",
  top: windowHeight * 0.52,
},
servicitime: {
  fontSize: 30,
  fontWeight: '900',
  fontStyle: 'italic',
  position: "absolute", 
  top: windowHeight * 0.565, 
},
closeButtons: {
  position: 'absolute',
  top: windowHeight * 0.02,
  right: 20,
},
});