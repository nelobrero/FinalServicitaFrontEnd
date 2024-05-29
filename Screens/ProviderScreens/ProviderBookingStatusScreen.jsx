import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Image, TouchableOpacity, TextInput, Modal, Alert} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Button from './../../components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Border, FontSize, FontFamily, Color } from "./../../GlobalStyles";
import { ScrollView } from 'react-native-gesture-handler';
import MapPage from './../MapPage';
import RealTimeInfoSeeker from "../../components/RealTimeInfoSeeker";
import firestore from '@react-native-firebase/firestore';
import axios from 'axios';
import { createdAt } from 'expo-updates';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendPushNotification } from '../NotificationScreen';
import { COLORS, FONTS } from "../../constants/theme";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function ProviderBookingStatusScreen({ navigation, route }) {

  const { data, userData} = route.params;

    const [statusText, setStatusText] = useState(data.status);
    // const [statusText, setStatusText] = useState("En Route");
    const [serviceName, setServiceName] = useState(data.serviceName);
    const [buttonsVisible, setButtonsVisible] = useState(true);
    const [buttonsVisible2, setButtonsVisible2] = useState(true);
    const [startPressed, setStartPressed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [hasReported, setHasReported] = useState(null);
    const [complaint, setComplaint] = useState('');
    const [startButtonDisabled, setStartButtonDisabled] = useState(false);


    const handleBackPress = () => {
      navigation.goBack();
    };
    const handleAccept = async () => {
      setIsLoading(true);
      //Wait for promise of firestore update
      await firestore().collection('bookings').doc(data.bookingId).update({ status: 'Accepted' });
      setStatusText("Accepted");
      setButtonsVisible(false);
      for (const token of data.seekerExpoTokens) {
        sendPushNotification(token, 'Booking Accepted', `${data.providerName} has accepted your booking!`, data.providerId);
      }
      setIsLoading(false);
  };

  const handleDecline = async () => {
      setIsLoading(true);
      await firestore().collection('bookings').doc(data.bookingId).update({ status: 'Rejected' });
      setStatusText("Rejected");
      setButtonsVisible(false);
      for (const token of data.seekerExpoTokens) {
        sendPushNotification(token, 'Booking Declined', `${data.providerName} has declined your booking.`, data.providerId);
      }
      setIsLoading(false);

      
  };
  const handleCancel = async () => {
      setIsLoading(true);
      await firestore().collection('bookings').doc(data.bookingId).update({ status: 'Canceled' });
      setStatusText("Canceled");
      setButtonsVisible(false);
      for (const token of data.seekerExpoTokens) {
        sendPushNotification(token, 'Booking Canceled', `${data.providerName} has canceled your booking.`, data.providerId);
      }
      
      setIsLoading(false);

      
  };
  const handleStart = async () => {
    setIsLoading(true);
    await firestore().collection('bookings').doc(data.bookingId).update({ status: 'En Route' });
    setStatusText("En Route");
    setStartPressed(true);
    for (const token of data.seekerExpoTokens) {
      sendPushNotification(token, 'Provider En Route', `${data.providerName} is on the way to your location.`, data.providerId);
    }
    
    setIsLoading(false);
    
  };
  const handleCompleted = async () => {
    setIsLoading(true);
    setStatusText("Completed");
    setButtonsVisible2(false);
    await firestore().collection('bookings').doc(data.bookingId).update({ status: 'Completed' });
    const providerRef = firestore().collection('providers').doc(data.providerId);
    const providerDoc = await providerRef.get();
    const bookingsCompleted = providerDoc.data().completedServices + 1;
    await providerRef.update({ completedServices: bookingsCompleted });
    const seekerRef = firestore().collection('seekers').doc(data.seekerId);
    const seekerDoc = await seekerRef.get();
    const bookingsCompletedSeeker = seekerDoc.data().servicesAvailed + 1;
    await seekerRef.update({ servicesAvailed: bookingsCompletedSeeker });
    const locationRef = firestore().collection('locations').doc(data.bookingId);
    await locationRef.delete();
    for (const token of data.seekerExpoTokens) {
      sendPushNotification(token, 'Service Completed', `${data.providerName} has completed your booking!`, data.providerId);
    }
    setIsLoading(false);
  };
  const handleStopService = async () => {
    setIsLoading(true);
    setStatusText("Failed");
    setButtonsVisible2(false);
    await firestore().collection('bookings').doc(data.bookingId).update({ status: 'Failed' });
    const locationRef = firestore().collection('locations').doc(data.bookingId);
    await locationRef.delete();
    for (const token of data.seekerExpoTokens) {
      sendPushNotification(token, 'Service Failed', `${data.providerName} has stopped the service.`, data.providerId);
    }
    setIsLoading(false);
  };

  const handleReport = () => {
    setModalVisible(true);
  };
  
  const handleReportModalClose = () => {
    setComplaint('');
    setModalVisible(false);
  };
  
  const checkForStartButton = () => {
    const currentTime = new Date();
    const expiresAt = data.expiresAt.toDate();
    const diff = expiresAt - currentTime;
    console.log(diff);
    if (diff >= 3600000) {
      setStartButtonDisabled(true);
    } else {
      setStartButtonDisabled(false);
    }
  };
  
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
          text: `Hello, ${data.seekerName}!`,
          createdAt: new Date(),
          user: {
            _id: data.providerId,
          },
          _id: `${data.providerId}_${data.seekerId}_${new Date().getTime()}_${data.providerId}`,
        },
      ],
    }
    try {
      firestore().collection('chats').where('users', '==', [data.seekerId, data.providerId]).get().then((querySnapshot) => {
        if (querySnapshot.empty) {
          firestore().collection('chats').doc(`${data.seekerId}_${data.providerId}`).set(messagesData);
          for (const token of data.seekerExpoTokens) {
            sendPushNotification(token, 'New Conversation', `${data.providerName} has started a conversation with you.`, data.providerId);
          }
          navigation.navigate('Chat', { userId: data.providerId, userName: data.providerName, chatId: `${data.seekerId}_${data.providerId}`, otherUserName: data.seekerName, otherUserImage: data.seekerImage, role: 'Provider', otherUserMobile: data.seekerMobile, admin: false, otherUserTokens: data.seekerExpoTokens });
        } else {
          querySnapshot.forEach((doc) => {
            navigation.navigate('Chat', { userId: data.providerId, userName: data.providerName, chatId: doc.id, otherUserName: data.seekerName, otherUserImage: data.seekerImage, role: 'Provider', otherUserMobile: data.seekerMobile, admin: false, otherUserTokens: data.seekerExpoTokens });
          });
        }
      }
      );
    }
    catch (error) {
      console.error('Error creating chat:', error);
    }
  };



  const handleSubmit = async () => {
    setIsLoading(true);
    const reportData = {
      reporterId: data.providerId,
      reportedId: data.seekerId,
      bookingId: data.bookingId,
      reason: complaint,
      status: 'PENDING',
    }
    await axios.post("http://192.168.1.7:5000/report/createReport", reportData);
    const seekerRef = firestore().collection('seekers').doc(data.seekerId);
    const seekerDoc = await seekerRef.get();
    const reportsReceived = seekerDoc.data().reportsReceived + 1;
    await seekerRef.update({ reportsReceived });
    setIsLoading(false);
    alert('Report submitted successfully! The Servicita team will review your report.');
    setComplaint('');
    const notification = {
      userId: "66111acbea0491231d30d8a7",
      message: `User ${data.providerId} has reported user ${data.seekerId} for the booking ${data.bookingId}.`,
      title: "New Report to Review",
      otherUserId: data.providerId,
    };
    await axios.post("http://192.168.1.7:5000/notifications/create", notification)
    setModalVisible(false);
    
    navigation.goBack();
};

const handleArrivedPress = async () => {
  setIsLoading(true);

  //Alert prompt if the provider is sure to change the status to In Progress
  Alert.alert(
    "Arrived",
    "Are you sure you have arrived at the location?",
    [
      {
        text: "Cancel",
        onPress: () => setIsLoading(false),
        style: "cancel"
      },
      { text: "Yes", onPress: async () => {
        await firestore().collection('bookings').doc(data.bookingId).update({ status: 'In Progress' });
        setStatusText("In Progress");
        for (const token of data.seekerExpoTokens) {
          sendPushNotification(token, 'Provider Arrived', `${data.providerName} has arrived at the location.`, data.providerId);
        }
        setIsLoading(false);
      }}
    ]
  );
};
 



useEffect(() => {
  const checkForReport = async () => {
    const response = await axios.post("http://192.168.1.7:5000/report/getReportByBookingId", { bookingId: data.bookingId, reporterId: data.providerId });
    setHasReported(response.data);
}
checkForReport();
if (statusText === "Accepted") {
  checkForStartButton();
}
}
, [statusText]);


if (hasReported == null) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.secondaryGray}} >
        <Image source={require('../../assets/loading.gif')} style={{width: 200, height: 200}} />
    </View>
  );
}

if (isLoading) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.secondaryGray}} >
        <Image source={require('../../assets/loading.gif')} style={{width: 200, height: 200}} />
    </View>
  );
}

  
  return (
    <SafeAreaView style={{ flex: 1}}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[styles.bookingscreen2]}>
      
      <View style={styles.header}>
      <Pressable onPress={handleBackPress}>
        <AntDesign name="left" size={24} color="white" style={styles.icon} />
      </Pressable>
        <Text style={styles.title}>{statusText}</Text>
      </View>

    {statusText === "In Progress" && (
      <View>
      <View style={styles.containerGif}>
      <Text style={styles.sched}>Schedule</Text>
      <Text style={styles.time}>{data.time}</Text>
      
      <Image
        source={require('./../../assets/1400px.gif')}
        style={styles.gif}
      />


      <Text style={styles.wonderful}>Work hard for</Text>
      <Text style={styles.servicitime}> Servicita!</Text>
    </View>
      
      <View  style={styles.centeredContainer1}>
              
      


      <View style={{top: windowHeight * 0.67 }} >
    <View style={{ marginVertical: windowHeight * 0.01 }}>
      <Button 
        title="Completed" 
        filled 
        Color={Color.colorWhite} 
        style={{ 
          height: 53,
          width: windowWidth * 0.890, 
          //top: 540,
          position: "relative", 
        }} 
        onPress={handleCompleted}
      />
      </View>
      <View style={{ marginBottom: windowHeight * 0.01 }}>
      <Button 
        title="Report" 
        filled={false}
        style={{ 
          height: 53,
          width: windowWidth * 0.890, 
          //top: 600,
          position: "relative", 
        }} 
        onPress={handleReport}
      />
      </View>
    </View>

        </View>
      </View>
    )}

    

    {statusText !== "En Route" &&  statusText !== "In Progress" && (
    <View  style={styles.centeredContainer1}>

<View style={[styles.servicecontainer2, styles.servicecontainer2Layout]}>
        <Image
          style={[styles.serviceimage2Icon, styles.servicecontainer2Layout]}
          contentFit="cover"
          source={{uri: data.imageSource}}
        />
        <View style={[styles.serviceinfo2, styles.serviceinfo2Layout]}>
          <View >
            <Text style={[styles.servicename2]}>
              {serviceName}
            </Text>
          </View>
          
          <TouchableOpacity onPress={messageSeeker}>
          <View style={[styles.message2, styles.message2Layout]}>
            <View style={[styles.message2Child, styles.message2Layout]} />
            <Text style={[styles.role2, styles.role2FlexBox]}>
              Message Seeker
            </Text>
            <Image
              style={styles.lettericon2}
              contentFit="cover"
              source={require("./../../assets/letter.png")}
            />
          </View>
          </TouchableOpacity>
        </View>
      </View>

     



      <View style={[styles.bookingdets, styles.bookingdetsLayout]}>
        <View style={[styles.bookingdetsChild, styles.bookingdetsLayout]} />
        <Text
          style={[styles.bookingIdSeeker, styles.bookingPosition]}
        >{`Booking ID
Seeker
Contact
Location (Tap to View)
Date`}</Text>
        
        <Text style={[styles.booking, styles.bookingPosition]}>
    {`${data.bookingId}
${data.seekerName}
${data.seekerMobile}`}
  </Text>

    <TouchableOpacity style={[styles.bookings, styles.bookingPositions]} onPress={() => navigation.navigate('ProviderBookingPage', { locationData: { latitude: data.location.latitude, longitude: data.location.longitude } })}>
      <Text style={styles.bookings}>{data.location.address}</Text>
      </TouchableOpacity>

  <Text style={[styles.booking, styles.bookingPosition]}>
    {`
    
    
    
    ${data.date}, ${data.time}`}
  </Text>
      </View>
   
      <View style={[styles.transactionDets, styles.transactionLayout1]}>
        <View style={[styles.transactionDetsChild, styles.childShadowBox]} />
        <Text
          style={[styles.transactionIdBooking, styles.transactionLayout]}
        >{`Transaction ID
Created At
Expires At
Payment Method
Amount

`}</Text>
        <Text style={[styles.transaction, styles.bookingTypo]}>{`${data.paymentId}
${data.createdAt.toDate().toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
${data.expiresAt.toDate().toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
${data.paymentMethod === 'gcash' ? 'GCash' : data.paymentMethod === 'grab_pay' ? 'GrabPay' : 'Paymaya'}
₱${data.price}

`}</Text>
      </View>
      </View>

    )}
    <View style={styles.centeredContainer}>

      {buttonsVisible && statusText === "Pending" && (
          <>
            
            <View style={{bottom:windowHeight > 732 ? windowHeight * -0.34 : windowHeight * -0.375  }} >
            {/* height: windowHeight > 808 ? windowHeight : 770, */}
            
            <Button 
              title="Accept" 
              filled 
              Color={Color.colorWhite} 
              style={{ 
                height: 53,
                width: windowWidth * 0.890, 
                // top: 540,
                // bottom: windowHeight * 0.12, 
                position: "relative", 
              }} 
              onPress={handleAccept} 
            />
            <View style={{ marginBottom: 10 }} />
            <Button 
              title="Decline" 
              filled={false}
              style={{ 
                height: 53,
                width: windowWidth * 0.890, 
                // top: 600,
                // bottom: windowHeight * 0.05, 
                position: "relative", 
                
              }} 
              onPress={handleDecline} 
            />
            </View>
          </>
        )}
        
        {statusText === "Accepted" && (
          <>


          
          <View style={{bottom:windowHeight > 732 ? windowHeight * -0.362 : windowHeight * -0.375  }} >
            <Button 
              title="Start" 
              filled 
              Color={Color.colorWhite} 
              style={{ 
                height: 53,
                width: windowWidth * 0.890, 
                opacity: startButtonDisabled ? 0.5 : 1,
                position: "relative", 
              }} 
              disabled={startButtonDisabled}
              onPress={handleStart} 
            />
            <View style={{ marginBottom: 10 }} />
            <Button 
              title="Cancel" 
              filled={false}
              style={{ 
                height: 53,
                width: windowWidth * 0.890, 
                // top: 600,
                position: "relative", 
              }} 
              onPress={handleCancel} 
            />
          </View>
          </>
        )}
        {statusText === "En Route" && (
  <>
  
    <View style={styles.container01}>
      <View style={styles.seekerInfo}>
        <RealTimeInfoSeeker seekerName={data.seekerName} location={data.location.address} seekerImage={data.seekerImage} data={data} />
      </View>
    </View>
          
    <View style={styles.mapContainer}>
          <MapPage locationData={data.location} role="Provider" bookingId={data.bookingId} />
    </View>
    
    

    <View style={{bottom:windowHeight > 732 ? windowHeight * -0.362 : windowHeight * -0.375}} >
    <View style={{ marginVertical: windowHeight * 0.01 }}>
      <Button 
        title="Arrived" 
        filled 
        Color={Color.colorWhite} 
        style={{ 
          height: 53,
          width: windowWidth * 0.890, 
          //top: 540,
          position: "relative", 
        }} 
        onPress={handleArrivedPress} 
      />
      </View>
      <View style={{ marginBottom: windowHeight * 0.01 }}>
      <Button 
        title="Stop Service" 
        filled={false}
        style={{ 
          height: 53,
          width: windowWidth * 0.890, 
          //top: 600,
          position: "relative", 
        }} 
        onPress={handleStopService} 
      />
      </View>
    </View>
  </>
)}

        {(statusText === "Completed" || statusText === "Failed" || statusText === "Canceled" || statusText === "Rejected" || statusText === "Expired") && (
          // <View style={{top: windowHeight * 0.37}} >
          <View style={{bottom:windowHeight > 732 ? windowHeight * -0.385 : windowHeight * -0.42  }} > 
          <Button 
            title="Report" 
            filled={false}
            style={{ 
              height: 53,
              width: windowWidth * 0.890, 
              opacity: hasReported ? 0.5 : 1,
              position: "relative", 
            }} 
            onPress={handleReport} 
            disabled={hasReported}
          />
          </View>
        )}
  </View>
  <Modal
  visible={modalVisible}
  animationType="slide"
  transparent={true}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <TouchableOpacity onPress={handleReportModalClose} style={styles.closeIcon}>
        <AntDesign name="close" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.modalHeader}>Report</Text>
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
      />
    </View>
  </View>
</Modal>

    
    </View>

    </ScrollView>
     
    </SafeAreaView>
  );
};

  const styles = StyleSheet.create({
  header: {
    backgroundColor: "#07374d",
    height: Dimensions.get('window').height * 0.1, // Adjust height according to screen size
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
    marginLeft: 10, // Add some space before the icon
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
  },bookingPositions: {
    lineHeight: 27,
    top: windowHeight * 0.132,
    color: Color.colorBlack,
    letterSpacing: 0.6,
    fontSize: FontSize.size_xs,
    position: "absolute",
    zIndex: 1,
  
  },
  messageLayout: {
    height: 21,
    width: 139,
    position: "absolute",
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
    width: windowWidth * 0.890,
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
    width: windowWidth * 0.890,
    height: 142,
    textAlign: "right",
    fontFamily: FontFamily.quicksandMedium,
    fontWeight: "500",
  },  bookings: {
    // left: 158,
    right: windowWidth * 0.026,
    width: windowWidth * 0.890,
    height: 142,
    textAlign: "right",
    fontFamily: FontFamily.quicksandMedium,
    fontWeight: "500",
    fontSize: FontSize.size_xs,
    position: "absolute",
    textDecorationLine: 'underline'
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
  maxHeight: '80%',
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
  marginBottom: 20,
  height:200,
  maxHeight: 200,
  // minHeight: 200,
},
closeIcon: {
  position: 'absolute',
  top: 10,
  right: 10,
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
seekerInfo: {
  position: "absolute",
  top: windowHeight* -0.355,
//  alignItems: "center",  
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


});
  



export default ProviderBookingStatusScreen;