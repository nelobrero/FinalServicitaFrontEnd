import * as React from "react";
import { StyleSheet, View, Text, Image, Dimensions, TouchableOpacity, Linking, Platform } from "react-native";
import { Border, FontFamily, Color, FontSize } from "../GlobalStyles";
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height


const RealTimeInfoSeeker = ({seekerName, location, seekerImage, data}) => {

  const messageSeeker = () => {
    const messagesData = {
      users: [data.seekerId, data.providerId],
      usersOnline: { seeker: true, provider: true },
      usersFullName: { seeker: data.seekerName, provider: data.providerName},
      usersImage: { seeker: data.seekerImage, provider: data.providerImage},
      usersNumbers: { seeker: data.seekerMobile, provider: data.providerMobile },
      lastMessage: '',
      lastSeen: { seeker: false, provider: true },
      createdAt: new Date(),
      lastMessageTime: new Date(),
      messages: [
        {
          _id: `${data.providerId}_${data.seekerId}_${new Date().getTime()}_${data.providerId}`,
          text: 'Hello, How can I help you?',
          createdAt: new Date(),
          user: {
            _id: data.providerId,
          },
        },

      ],
    }
    try {
      firestore().collection('chats').where('users', '==', [data.seekerId, data.providerId]).get().then((querySnapshot) => {
        if (querySnapshot.empty) {
          firestore().collection('chats').doc(`${data.seekerId}_${data.providerId}`).set(messagesData);
          navigation.navigate('Chat', { userId: data.providerId, chatId: `${data.seekerId}_${data.providerId}`, otherUserName: data.seekerName, otherUserImage: data.seekerImage, role: 'Provider', otherUserMobile: data.seekerMobile, admin: false });
        } else {
          querySnapshot.forEach((doc) => {
            navigation.navigate('Chat', { userId: data.providerId, chatId: doc.id, otherUserName: data.seekerName, otherUserImage: data.seekerImage, role: 'Provider', otherUserMobile: data.seekerMobile, admin: false});
          });
        }
      }
      );
    }
    catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleCall = () => {
    if(Platform.OS === 'android') {
      Linking.openURL(`tel:${data.seekerMobile}`);
    } else {
      Linking.openURL(`telprompt:${data.seekerMobile}`);
    }
  }

  

  return (
    <View style={styles.seekerrealtimeinfo}>
      <View
        style={[styles.seekerrealtimeinfoChild, styles.seekerimageIconPosition]}
      />

      <View style={[styles.seekinfo, styles.seekinfoLayout]}>
        <View style={styles.information}>
          <Text style={styles.location}>{location}</Text>
          <Text style={[styles.role, styles.roleTypo]}>Seeker</Text>
          <Text style={[styles.seeker, styles.roleTypo]}>{seekerName}</Text>
        </View>
        <Image
          style={[styles.seekerimageIcon, styles.seekinfoLayout]}
          contentFit="cover"
          source={{uri: seekerImage}}
        />
      </View>
      

      {/* <View style={{right: windowWidth * 0.03, top: 12}}> */}
        <TouchableOpacity onPress={messageSeeker}>
        <View style={[styles.message, styles.messageLayout]}>
          <MaterialCommunityIcons name="message-text" size={25} color="#07374d"  style={[styles.smsIcon]} />
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCall}>
        <View style={[styles.call, styles.messageLayout]}>  
          <MaterialCommunityIcons name="phone" size={25} color="#07374d"  style={[styles.callIcon]} />
        </View>
        </TouchableOpacity>
      {/* </View> */}
      
    </View>
  );
};

const styles = StyleSheet.create({
  seekerimageIconPosition: {
    borderRadius: Border.br_mini,
    left: 0,
    top: 0,
  },
  messageLayout: {
    height: 42,
    width: 42,
    borderRadius: 25,
    position: "absolute",
    borderColor: "#07374d", // Add your desired border color here "#D9D9D9" "#07374d"
    borderWidth: 2,      // Add border width if needed
  },
  iconLayout: {
    height: 23,
    width: 23,
    top: 14,
    position: "absolute",
  },
  seekinfoLayout: {
    height: 76,
    position: "absolute",
  },
  roleTypo: {
    alignItems: "center",
    display: "flex",
    fontFamily: FontFamily.quicksandBold,
    fontWeight: "700",
    lineHeight: 19.5,
    textAlign: "left",
    left: 0,
    position: "absolute",
  },




  seekerrealtimeinfoChild: {
    shadowColor: "rgba(0, 0, 0, 0.31)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 1,
    backgroundColor: Color.colorWhite,
    position: "relative",
    borderRadius: Border.br_mini,
    height: 101,
    width: windowWidth * 0.890, 
    borderColor: "#07374d", // Add your desired border color here "#D9D9D9" "#07374d"
    borderWidth: 2,      // Add border width if needed
  },
  messageChild: {
    width: 52,
    left: 0,
    top: 0,
  },
  
  message: {
    right: windowWidth * 0.03,
    top: 45,
    width: 52,
  },
  smsIcon: {
    left: 7,
    top: 7,
  },
  callIcon: {
    left: 7,
    top: 7 ,
  },
  call: {
    right: windowWidth * 0.16,
    top: 45,
    width: 52,
  },
  location: {
    top: 48,
    fontSize: FontSize.size_xs,
    letterSpacing: 0.6,
    lineHeight: 14,
    fontWeight: "500",
    fontFamily: FontFamily.quicksandMedium,
    height: 15,
    textAlign: "left",
    color: Color.colorBlack,
    width: 240,
    left: 0,
    position: "absolute",
  },
  role: {
    top: 22,
    fontSize: FontSize.size_smi,
    color: Color.colorDarkslategray_500,
    width: 47,
    height: 16,
    
  },
  seeker: {
    fontSize: FontSize.size_xl,
    width: windowWidth * 0.8,
    height: 50,
    color: Color.colorBlack,
    alignItems: "center",
    display: "flex",
    fontFamily: FontFamily.quicksandBold,
    fontWeight: "700",
    lineHeight: 15,
    // top: 0,
  },

  

  information: {
    top: 6,
    left: 90,
    height: 61,
    width: 128,
    position: "absolute",
  },

  
  seekerimageIcon: {
    width: 76,
    borderRadius: Border.br_mini,
    left: 0,
    top: 0,
  },
  seekinfo: {
    top: 12,
    left: windowWidth * 0.03, 
    width: 250,
    
  },
  seekerrealtimeinfo: {
    height: 101,
    width: windowWidth * 0.890, 
  },
});

export default RealTimeInfoSeeker;