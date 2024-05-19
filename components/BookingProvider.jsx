

import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, Dimensions, FlatList, TouchableOpacity, Alert, Pressable } from "react-native";
import { Color, FontFamily, FontSize, Border } from "./../GlobalStyles";
import { parse, set } from 'date-fns';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendPushNotification } from '../NotificationScreen';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const BookingProvider= ({ navigation, filters, bookingData, userData, onActionDoneChange }) => {

  const [actionDone, setActionDone] = useState(false);

  const data = bookingData.map((item) => ({
    id: item.id,
    bookingId: item.id,
    status: item.data.status,
    serviceName: item.serviceData.data.name,
    providerName: `${item.providerData.name.firstName} ${item.providerData.name.lastName}`,
    time: `${item.data.startTime} - ${item.data.endTime}`,
    date: item.data.bookedDate,
    convertedDate: new Date(parse(item.data.bookedDate, "MMMM d, yyyy", new Date()).setHours(item.data.startTimeValue, 0)),
    startTimeValue: item.data.startTimeValue,
    endTimeValue: item.data.endTimeValue,
    location: item.data.location,
    imageSource: item.serviceData.data.coverImage,
    seekerMobile: item.seekerMobile,
    createdAt: item.data.createdAt,
    expiresAt: item.data.expiresAt,
    paymentMethod: item.data.paymentMethod,
    price: item.data.price,
    paymentId: item.data.paymentId,
    serviceId: item.serviceData.id,
    seekerId: item.data.seekerId,
    providerId: item.data.providerId,
    seekerName: `${item.seekerData.data.name.firstName} ${item.seekerData.data.name.lastName}`,
    seekerImage: item.seekerImage,
    providerImage: item.providerImage,
    providerMobile: item.providerMobile,
    seekerExpoTokens: item.seekerData.expoTokens,
    providerExpoTokens: item.providerData.expoTokens
}));
  
  const filteredData = filters === 'All' ? data : data.filter((item) => item.status === filters);


  filteredData.sort((a, b) => {
    const now = new Date();
    const isDateAPast = a.convertedDate < now;
    const isDateBPast = b.convertedDate < now;

    // If one date is in the past and the other isn't, prioritize the one in the future
    if (isDateAPast && !isDateBPast) {
        return 1;
    } else if (!isDateAPast && isDateBPast) {
        return -1;
    }

    // If both dates are in the future, sort based on the dates
    if (a.convertedDate < b.convertedDate) {
        return -1;
    } else if (a.convertedDate > b.convertedDate) {
        return 1;
    } else {
        // If dates are equal, prioritize based on start time
        return a.startTimeValue - b.startTimeValue;
    }
});

  // Set Margin depending on status of each item


  const handleAccept = async (item, userData) => {
    // Update status of booking to 'Accepted' in firestore
    await firestore().collection('bookings').doc(item.id).update({ status: 'Accepted' });
    Alert.alert('Booking Accepted, Seeker will be notified.');
    // Send push notification to seeker
    for (const token of item.seekerExpoTokens) {
      sendPushNotification(token, 'Booking Accepted', `Your booking for ${item.serviceName} has been accepted by ${item.providerName}`);
    }
    setActionDone(true);
  };

  const handleDecline = async (item, userData) => {
    await firestore().collection('bookings').doc(item.id).update({ status: 'Declined' });
    Alert.alert('Booking Declined, Seeker will be notified.');
    for (const token of item.seekerExpoTokens) {
      sendPushNotification(token, 'Booking Declined', `Your booking for ${item.serviceName} has been declined by ${item.providerName}`);
    }
    setActionDone(true);
  };

  useEffect(() => {
    onActionDoneChange(actionDone);
    setActionDone(false);
  }, [actionDone]);


  const renderItem = ({ item, index }) => {
    
    let bookingSeekerMargin = 45;
    let bookingSeekerHeight = 231;
    
    if (item.status !== 'Pending') {
      bookingSeekerMargin = 10;
      bookingSeekerHeight = 196;
    }

    return (
    <View style={styles.container}>
      <View style={[styles.bookingseeker, { marginBottom: bookingSeekerMargin }]}>
        <View style={[styles.frame, styles.framePosition]}>
          
          <View style={[styles.frameChild, styles.frameShadowBox, { height: bookingSeekerHeight }]} />
          <View style={[styles.frameItem, styles.frameShadowBox]} />
        </View>
        <Image
          style={styles.serviceimageIcon}
          contentFit="cover"
          source={{ uri: item.imageSource }}
        />

        <View style={styles.serviceWrapper}>
          <Text style={styles.service}>{item.serviceName}</Text>
          <View style={styles.provider}>
            <Image
              style={styles.userIcon}
              contentFit="cover"
              source={require("./../assets/user.png")}
            />
            <Text style={styles.provider1}>{item.seekerName}</Text>
          </View>
        </View>
        
        <View style={[styles.status, styles.statusLayout]}>
          <Text style={[styles.bookingid, styles.status1Typo]}>{item.bookingId}</Text>
          <Text style={[styles.status1, styles.status1Typo]}>{item.status}</Text>
        </View>
        <View style={styles.bookingdetails}>
          
        
          <Text style={[styles.address, styles.dateTypo]}>{item.location.address}</Text>
          <Text style={[styles.date, styles.dateTypo]}>{item.date}</Text>
          <Text style={styles.time}>{item.time}</Text>

          
        </View>

        {item.status === 'Pending' && (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button1} onPress={() => handleAccept(item, userData)}>
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button2} onPress={() => handleDecline(item, userData)}>
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </View>
  );
  }
  
  

  return (
    <FlatList
      data={filteredData}
      renderItem={ ({ item }) => (
        <Pressable onPress={() => navigation.navigate('ProviderBookingStatus', { data: {
          bookingId: item.bookingId,
          status: item.status,
          serviceName: item.serviceName,
          providerName: item.providerName,
          time: item.time,
          date: item.date,
          location: item.location,
          imageSource: item.imageSource,
          createdAt: item.createdAt,
          expiresAt: item.expiresAt,
          paymentMethod: item.paymentMethod,
          price: item.price,
          paymentId: item.paymentId,
          serviceId: item.serviceId,
          seekerId: item.seekerId,
          providerId: item.providerId,
          seekerName: item.seekerName,
          seekerImage: item.seekerImage,
          providerImage: item.providerImage,
          seekerMobile: item.seekerMobile,
          providerMobile: item.providerMobile,
          seekerExpoTokens: item.seekerExpoTokens,
          providerExpoTokens: item.providerExpoTokens,
        },
        userData: userData,
        })}>

        {renderItem({ item })}

      </Pressable>
      )}
      keyExtractor={item => item.id}
      contentContainerStyle={{ paddingBottom: windowHeight * 0.285, paddingTop: windowHeight * 0.02 }}
      // Take into account if there are no bookings
      ListEmptyComponent={() => (
        <View style={styles.container}>
          <Text>No bookings found</Text>
        </View>
      )}
    />
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingseeker: {
    height: 196,
    position: "relative",

  },

  frameShadowBox: {
    borderWidth: 0.3,
    borderColor: Color.colorBlack,
    borderStyle: "solid",
    shadowOpacity: 1,
    elevation: 7,
    shadowRadius: 7,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowColor: "rgba(0, 0, 0, 0.5)",
    left: 0,
    top: 0,
    position: "absolute",
    width: windowWidth * 0.95,
  },
  
  frameChild: {
    borderRadius: Border.br_3xs,
    backgroundColor: Color.colorWhite,
    height: 231,
  },
  frameItem: {
    borderTopLeftRadius: Border.br_3xs,
    borderTopRightRadius: Border.br_3xs,
    backgroundColor: "#07374d",
    height: 40,
  },
  frame: {
    left: 0,
    position: "relative",
    height: windowHeight * 0.25,
    width: windowWidth * 0.95,
  },

  statusLayout: {
    height: 15,
    position: "absolute",
  },
  dateTypo: {
    width: 169,
    fontFamily: FontFamily.quicksandMedium,
    fontWeight: "500",
    letterSpacing: 0.5,
    fontSize: 11,
    alignItems: "center",
    display: "flex",
    color: Color.colorBlack,
    textAlign: "left",
    lineHeight: 15,
    left: 0,
    position: "absolute",
  },
  status1Typo: {
    color: Color.colorWhite,
    fontFamily: FontFamily.quicksandBold,
    fontWeight: "700",
    lineHeight: 15,
    letterSpacing: 0.6,
    fontSize: FontSize.size_xs,
    top: 0,
    position: "absolute",
  },

  serviceimageIcon: {
    top: 59,
    width: 118,
    height: 118,
    left: 14,
    position: "absolute",
  },
  userIcon: {
    top: 1,
    width: 13,
    height: 13,
    left: 0,
    position: "absolute",
  },
  provider1: {
    marginLeft: 13,
    fontWeight: "600",
    fontFamily: FontFamily.quicksandSemiBold,
    color: Color.colorDarkslategray_500,
    textAlign: "left",
    lineHeight: 15,
    letterSpacing: 0.6,
    fontSize: FontSize.size_xs,
  },
  userParent: {
    width: 102,
    height: 15,
    left: 0,
    top: 0,
  },
  provider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  service: {
    fontSize: FontSize.size_xl,
    letterSpacing: 1,
    lineHeight: 20,
    fontFamily: FontFamily.quicksandRegular,
    color: Color.colorBlack,
    textAlign: "left",
    width: 216.5,
    paddingBottom:4,
  },
  serviceWrapper: {
    left: 149,
    top: 60,
    position: "absolute",
  },
  time: {
    top: 107,
    width: 153,
    fontFamily: FontFamily.quicksandMedium,
    fontWeight: "500",
    letterSpacing: 0.5,
    fontSize: 11,
    alignItems: "center",
    display: "flex",
    color: Color.colorBlack,
    textAlign: "left",
    lineHeight: 15,
    height: 13,
    left: 0,
    position: "absolute",
  },
  date: {
    top: 95,
  },
  address: {
    top: 82,
  },
  bookingdetails: {
    top: 57,
    height: 123,
    width: 246,
    left: 149,
    position: "absolute",
  },
  bookingid: {
    left: windowWidth * 0.470,
    textAlign: "right",
    width: windowWidth * 0.4,
    height: windowHeight * 0.02,
  },
  status1: {
    width: 135,
    textAlign: "left",
    left: 0,
  },
  status: {
    top: 15,
    width: 380,
    left:  windowWidth * 0.04,
  },

  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    position: 'absolute', // Position the buttons absolutely
    bottom: -30, // Align buttons to the bottom
    left: 0,
    right: 0,
    paddingBottom: 10,
  },
  button1: {
    backgroundColor: "#07374d",
    paddingVertical: 5,
    paddingHorizontal: 57,
    borderRadius: 5,
    width: windowWidth * 0.4,
  },
  button2: {
    backgroundColor: "#7C7878",
    paddingVertical: 5,
    paddingHorizontal: 57,
    borderRadius: 5,
    width: windowWidth * 0.4,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    width: windowWidth * 0.4,
    alignContent: 'center',
    right: windowWidth * 0.015,
  },
});

export default BookingProvider;
