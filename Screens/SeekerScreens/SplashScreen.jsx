import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import React, { useState, useEffect }from 'react';


const { width, height } = Dimensions.get('window');

export default SplashScreen1 = ({navigation, route}) => {
  
  const {bookingData, paymentMethod, paymentId} = route.params;
  let intervalId = null;

  function generateBookingId() {
    const timestamp = new Date().getTime().toString(36);
    const random = Math.random().toString(36).substr(2, 6);
    const moreRandom = Math.random().toString(36).substr(2, 6);
    const bookingId = timestamp + random + moreRandom;
    return bookingId;
  }

  useEffect(() => {
    listenToPaymentStatus();
    return () => clearInterval(intervalId); // Clear the interval on unmount
  }, []); // Run only once when component mounts

  const listenToPaymentStatus = () => {
    try {
      intervalId = setInterval(() => {
        axios.post("http://192.168.1.7:5000/payment/retrievePayment", { id: paymentId })
          .then((response) => {
            if (response.data.data.status === "paid") {
              const bookingId = generateBookingId();
              const submissionData = {
                seekerId: bookingData.seekerId,
                providerId: bookingData.providerId,
                serviceId: bookingData.serviceId,
                location: bookingData.location,
                paymentMethod: paymentMethod,
                bookedDate: bookingData.bookedDate,
                price: bookingData.price,
                startTime: bookingData.startTime,
                endTime: bookingData.endTime,
                startTimeValue: bookingData.startTimeValue,
                endTimeValue: bookingData.endTimeValue,
                expiresAt: bookingData.expiresAt,
                createdAt: firestore.Timestamp.now(),
                status: "Pending",
                paymentId: paymentId,
              };

              firestore().collection('bookings').doc(bookingId).set(submissionData).then(() => {
                firestore().collection('services').doc(bookingData.serviceId).update({
                  bookings: firestore.FieldValue.arrayUnion(bookingId)
                }).then(() => {
                  clearInterval(intervalId);
                  navigation.navigate("Confirmation", { bookingData: submissionData, bookingId: bookingId });
                }
                )
              }
              );
              
            } else if (response.data.data.status === "chargeable") {
              console.log("Payment is chargeable. Waiting.");
            } else {
              alert("Payment failed. Please try again.");
              clearInterval(intervalId); // Clear the interval
              navigation.navigate("Payment", { bookingData: bookingData });
            }
          })
          .catch((error) => {
            console.log("Error:", error.message);
          });
      }, 4000);
    } catch (error) {
      console.log(error.message);
    }
  };


  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
      <Image source={require('./../../assets/splash1.png')} style={styles.image} />
      <Text style={styles.text}>Service {"\n"}
      Confirming...</Text>
    
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#07374D', // Background color added here
  },
  image: {
    width: width * 0.2, // Adjust the width of the image as needed
    height: width * 0.5, // Adjust the height of the image as needed
    marginRight: 20,
    resizeMode: 'contain', // Adjust the resizeMode property as needed
  },
  text: {
    color: 'white',
    fontSize: width * 0.09, // Adjust the font size based on screen width
  },
});


