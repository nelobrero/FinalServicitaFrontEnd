//Service Top

import * as React from "react";
import { Text, StyleSheet, View, Image, Dimensions, TouchableOpacity } from "react-native";
import { Color, FontFamily, FontSize, Border } from "../GlobalStyles";
import  { useState } from "react";
import ServiceImage from './ServiceImage'; 
import RatingStars from './RatingStars';
import firestore from '@react-native-firebase/firestore';
import { Entypo, Ionicons  } from '@expo/vector-icons';



const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const ServiceTop= ({data, navigation, userData, messagesData}) => {

  const [price, setPrice] = useState(`${data.minprice} - ₱${data.maxprice}`);
  const [serviceName, setServiceName] = useState(data.service);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(data.ratingStar);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };


  const messageProvider = () => {
    const messageData = {
      users: [messagesData.seekerData.id, messagesData.providerData.id],
      usersOnline: { seeker: true, provider: true },
      usersFullName: { seeker: `${messagesData.seekerData.name.firstName} ${messagesData.seekerData.name.lastName}`, provider: `${messagesData.providerData.name.firstName} ${messagesData.providerData.name.lastName}`},
      usersImage: { seeker: messagesData.seekerData.image, provider: messagesData.providerData.image},
      usersNumbers: { seeker: messagesData.seekerData.mobile, provider: messagesData.providerData.mobile},
      lastMessage: '',
      lastSeen: { seeker: false, provider: true },
      createdAt: new Date(),
      lastMessageTime: new Date(),
      messages: [ 
        {
          text: 'Hello! I would like to inquire about your service.',
          createdAt: new Date(),
          user: {
            _id: messagesData.seekerData.id,
          },
          _id: `${messagesData.seekerData.id}_${messagesData.providerData.id}_${new Date().getTime()}_${messagesData.seekerData.id}`,
        }
      ]
    }
    try {
      firestore().collection('chats').where('users', '==', [messagesData.seekerData.id, messagesData.providerData.id]).get().then((querySnapshot) => {
        if (querySnapshot.empty) {
          firestore().collection('chats').doc(`${messagesData.seekerData.id}_${messagesData.providerData.id}`).set(messageData);
          for (const token of messagesData.providerData.expoPushTokens) {
            sendPushNotification(token, 'New Conversation', `${messagesData.seekerData.name.firstName} ${messagesData.seekerData.name.lastName} has started a conversation with you.`, messagesData.seekerData.id);
          }
          navigation.navigate('Chat', { userId: messagesData.seekerData.id, userName: `${messagesData.seekerData.name.firstName} ${messagesData.seekerData.name.lastName}`, chatId: `${messagesData.seekerData.id}_${messagesData.providerData.id}`, otherUserName: `${messagesData.providerData.name.firstName} ${messagesData.providerData.name.lastName}`, otherUserImage: messagesData.providerData.image, role: 'Seeker', otherUserMobile: messagesData.providerData.mobile, admin: false, otherUserTokens: messagesData.providerData.expoTokens, otherUserId: messagesData.providerData.id });
        } else {
          querySnapshot.forEach((doc) => {
            navigation.navigate('Chat', { userId: messagesData.seekerData.id, userName: `${messagesData.seekerData.name.firstName} ${messagesData.seekerData.name.lastName}`, chatId: doc.id, otherUserName: `${messagesData.providerData.name.firstName} ${messagesData.providerData.name.lastName}`, otherUserImage: messagesData.providerData.image, role: 'Seeker', otherUserMobile: messagesData.providerData.mobile, admin: false, otherUserTokens: messagesData.providerData.expoTokens, otherUserId: messagesData.providerData.id });
          });
        }
      }
      );
    }
    catch (error) {
      console.error('Error creating chat:', error);
    }
  };


  return (
    
    <View style={styles.serviceview}>

      <View style={styles.serviceImageContainer}>
        <ServiceImage imageData = {data} />
      </View>
      
      <Text style={[styles.service]}>
        {serviceName}
      </Text>

      <View style={styles.positioncontainer}>

        <Text style={styles.price}>
            <Text style={styles.sign}>₱</Text>
            <Text style={styles.Price}>{price}</Text>
        </Text>

        
        <View style={styles.ratingContainer}>
          <RatingStars rating={rating} />
        </View>

      </View>

      <TouchableOpacity onPress={messageProvider}>
        <View style={[styles.message, styles.bookPosition2]}>
          <View style={[styles.messageChild, styles.childShadowBox]} />
          <Entypo name="message" size={20} color="#07374d" style={styles.messageicon} />
          <Text style={[styles.message1, styles.message1Position]}>Message</Text>
        </View>
      </TouchableOpacity>


      <TouchableOpacity onPress={() => navigation.navigate('Booking', {data: data, userData: userData})}>
        <View style={[styles.book, styles.bookPosition]}>
          <View style={[styles.bookChild, styles.childShadowBox]}/>
            
              <Ionicons name="calendar-clear-sharp" size={18} color= "#07374D" style={[styles.bookicon, styles.bookiconLayout]} />
            
            <Text style={[styles.bookNow]}>Book</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleFavorite}>
        <View style={[styles.favoriteContainer]}>
          <Image
            style={[styles.favoriteIcon]}
            source={isFavorite ? require("../assets/filledHeartIcon.png") : require("../assets/unfilledHeartIcon.png")}
          /> 
          <Text style={[styles.addToFavorites, styles.serviceTypo]}>
            Add to Favorites
        </Text>
          
        </View>
        
      </TouchableOpacity>


      
    </View>
  );
};

const styles = StyleSheet.create({
  serviceTypo: {
    color: Color.colorBlack,
    fontFamily: FontFamily.quicksandRegular,
    textAlign: "left",
    position: "absolute",
  },
  bookPosition: {
    top: windowHeight * 0.52,
    left: windowWidth * 0.48,
    right: windowWidth * - 0.65,
    height: 30,
    position: "absolute",
    
  },
  bookPosition2: {
    top: windowHeight * 0.52,
    left: windowWidth * 0.45,
    height: 30,
    position: "absolute",
    
  },
  childShadowBox: {
    shadowOpacity: 2,
    elevation: 8,
    shadowRadius: 8,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowColor: "rgba(0, 0, 0, 0.8)",
    top: 0,
    height: 30,
    width: 93,
    position: "absolute",
    backgroundColor: Color.colorWhite,
  },
  bookiconLayout: {
    width: 21,
    height: 18,
    position: "absolute",
  },
  groupItemLayout: {
    height: 5,
    width: 5,
    left: 2,
    position: "absolute",
    backgroundColor: Color.colorWhite,
  },
  groupPosition: {
    left: 14,
    height: 5,
    width: 5,
    position: "absolute",
    backgroundColor: Color.colorWhite,
  },
  groupChildPosition: {
    left: 8,
    height: 5,
    width: 5,
    position: "absolute",
    backgroundColor: Color.colorWhite,
  },
  message1Position: {
    top: 7,
    position: "absolute",
  },
  servicePosition: {
    top: 0,
    left: 0,
  },
  sign: {
    fontWeight: "500",
    fontFamily: FontFamily.quicksandMedium,
    width: "100%"
  },
  Price: {
    fontFamily: FontFamily.questrialRegular,
    width: "100%",
    fontWeight: '500'

  },

  price: {
    // bottom: windowHeight * -0.05,
    fontSize: windowHeight * 0.032,
    fontWeight: '900',
    letterSpacing: 1.6,
    lineHeight: 35,
    color: "#266f92",
    height: 30,
    textAlign: "left",
    width: windowWidth * 0.6,
    alignItems: "center",
    display: "flex",
    left: 0,
    position: "absolute",
  },
  service: {
    fontSize: windowHeight * 0.032,
    letterSpacing: 1,
    lineHeight: 30,
    width: 340,
    height: 60,
    top: 40,
    left: 0,
    color: Color.colorBlack,
    fontFamily: FontFamily.quicksandRegular,
    textAlign: "left",
    position: "absolute",
    top: windowHeight * 0.57,
    left: 25,
  },
  positioncontainer: {
    // top: windowHeight * 0.52,
    bottom: windowHeight * -0.04,
    left: 25,
    width: 380,
    height: 85,
    position: "absolute",
  },
  bookChild: {
    left: 89,
  },
  groupChild: {
    backgroundColor: "transparent",
    height: 18,
    top: 0,
    left: 0,
  },
  groupItem: {
    borderTopLeftRadius: Border.br_11xs,
    top: 5,
  },
  groupInner: {
    borderTopRightRadius: Border.br_11xs,
    top: 5,
  },
  rectangleView: {
    borderBottomLeftRadius: Border.br_11xs,
    top: 11,
  },
  groupChild1: {
    borderBottomRightRadius: Border.br_11xs,
    top: 11,
  },
  groupChild2: {
    top: 11,
  },
  groupChild3: {
    top: 2,
    left: 4,
    width: 14,
    height: 1,
    position: "absolute",
    backgroundColor: Color.colorWhite,
  },
  groupChild4: {
    top: 5,
  },
  rectangleParent: {
    height: 18,
    top: 0,
    left: 0,
  },
  bookicon: {
    left: 98,
    height: 18,
    top: windowHeight * 0.006,
  },
  bookNow: {
    top: 8,
    left: windowWidth * 0.14,
    textAlign: "center",
    fontSize: FontSize.size_xs,
    fontFamily: FontFamily.quicksandRegular,
  },
  book: {
    left: windowWidth * 0.52,
    width: windowWidth * 0.424,
  },
  messageChild: {
    left: 0,
    shadowOpacity: 1,
    elevation: 8,
    shadowRadius: 8,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowColor: "rgba(0, 0, 0, 0.5)",
  },
  message1: {
    left: windowWidth * 0.075,
    width: 52,
    textAlign: "center",
    fontSize: FontSize.size_xs,
    fontFamily: FontFamily.quicksandRegular,
  },
  messageicon: {
    left: windowWidth * 0.014,
    top: windowHeight * 0.005, 
    
    
  },
  message: {
    left: windowWidth * 0.5,
    top: windowHeight * 0.74, 
    width: 93,
    top: 450,
    
  },
  addToFavorites: {
    
    top: windowHeight * 0.53,
    left:windowWidth * 0.123,
    fontSize: 11.5,
    letterSpacing: 0.5,
    lineHeight: 13,
    width: 100,
    height: 15,
    alignItems: "center",
    display: "flex",
    color: Color.colorBlack,
    fontFamily: FontFamily.quicksandRegular,
    position:'relative'
  },
  serviceimageIcon: {
    borderBottomRightRadius: Border.br_xl,
    borderBottomLeftRadius: Border.br_xl,
    height: windowHeight * 0.5,
    position: "absolute",
    width: windowWidth,
    flex: 1, // Fill available space
    resizeMode: 'cover',
  },
  serviceview: {
    height:  windowHeight * 0.70,
    overflow: "hidden",
    backgroundColor: Color.colorWhite,
  },
  favoriteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    top: windowHeight * 0.52,
    left: windowWidth * 0.123,
  },
  serviceImageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
   
  },
  favoriteContainer: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  favoriteIcon: {
    width: 15,
    height: 15,
    marginLeft: 25,
    top: windowHeight * 0.528,
    position: 'relative',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 40,
    bottom: windowHeight * -0.015,
    right: windowWidth * - 0.65,
  },
});

export default ServiceTop;