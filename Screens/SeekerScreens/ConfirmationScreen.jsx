import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Button, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import { COLORS } from "./../../constants/theme";

const windowWidth = Dimensions.get('window').width;
export default ConfirmationScreen = ({ navigation, route }) => {

  const { bookingData, bookingId } = route.params;
  const [providerData, setProviderData] = useState({});
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userDataFetched, setUserDataFetched] = useState(false);
  const [button2Color, setButton2Color] = useState('#07374D');
  const [receiptEmailSent, setReceiptEmailSent] = useState(false);
  
  useEffect(() => {
    getUserData();
    
}, []);

async function getUserData() {
    try{
    const result = await axios.post("http://3.107.4.155:5001/user/getUserDetailsById", { id: bookingData.seekerId })
    setUserRole(result.data.data.role);
    setUserEmail(result.data.data.email);
    const seekerName = await getSeekerData();
    const providerName = await getProviderData();
    sendReceiptEmail(seekerName, providerName);
    } catch (error) {
      console.error('Error getting user data from MongoDB:', error);
    }
   
}

const getSeekerData = async () => {
  const seekerData = await firestore().collection('seekers').doc(bookingData.seekerId).get();
  setUserName(seekerData.data().name.firstName + ' ' + seekerData.data().name.lastName);
  return seekerData.data().name.firstName + ' ' + seekerData.data().name.lastName;
}

const getProviderData = async () => {
  const providerData = await firestore().collection('providers').doc(bookingData.providerId).get();
  setProviderData(providerData.data());
  return providerData.data().name.firstName + ' ' + providerData.data().name.lastName;
}

async function sendReceiptEmail(seekerName, providerName) {
  try {
    const receiptData = {
      email: userEmail,
      name: seekerName,
      bookingId: bookingId,
      providerName: providerName,
      location: bookingData.location.address,
      date: bookingData.bookedDate,
      time: bookingData.startTime + ' - ' + bookingData.endTime,
      transactionId: bookingData.paymentId,
      createdAt: bookingData.createdAt.toDate().toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }),
      expiresAt: bookingData.expiresAt.toDate().toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }),
      paymentMethod: bookingData.paymentMethod === 'gcash' ? 'GCash' : bookingData.paymentMethod === 'grab_pay' ? 'GrabPay' : 'Paymaya',
      amount: bookingData.price,
    };

    const response = await axios.post("http://3.107.4.155:5001/email_verification_otp/sendReceipt", receiptData);

    if (response.data.status === 'SUCCESS') {
      setReceiptEmailSent(true);
      setUserDataFetched(true);
    } else {
      console.error('Error sending receipt email:', response.data.message);
    }
  } catch (error) {
    console.error('Error sending receipt email:', error);
  }
}


  if (!userDataFetched || userRole === '' || userEmail === '' || receiptEmailSent === false) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.secondaryGray}} >
          <Image source={require('../../assets/loading.gif')} style={{width: 200, height: 200}} />
      </View>
    );
}


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container1}>
        <View style={styles.iconContainer}>
          <Feather name="check-circle" size={120} color="white" />
        </View>
        <Text style={{ fontSize: 30, color: 'white', alignSelf: 'center', marginTop: 160 }}>Booking Confirmed</Text>
        <Text style={{alignSelf:'center', marginTop: 1, color:'white'}}>You can view your booking details below.</Text>
      </View>
      <View style={styles.container2}>

        <View style={{flexDirection:"row"}}>
        <Text style={{margin: 8, fontWeight:'bold'}}>Booking ID</Text>
        <Text style={{marginTop: 8, textAlign:'right'}}>{bookingId}</Text>
        </View>

        <View style={{flexDirection:"row"}}>
        <Text style={{margin: 8, fontWeight:'bold'}}>Provider</Text>
        <Text style={{marginTop: 8, textAlign:'right'}}>{providerData.name.firstName} {providerData.name.lastName}</Text>
        </View>

        <View style={{flexDirection:"row"}}>
        <Text style={{margin: 8, fontWeight:'bold'}}>Location</Text>
        <Text style={{marginTop: 8, textAlign:'right'}}>{bookingData.location.address}</Text>
        </View>

        <View style={{flexDirection:"row"}}>
        <Text style={{margin: 8, fontWeight:'bold'}}>Date</Text>
        <Text style={{marginTop: 8, textAlign:'right'}}>{bookingData.bookedDate}</Text>
        </View>

        <View style={{flexDirection:"row"}}>
        <Text style={{margin: 8, fontWeight:'bold'}}>Time</Text>
        <Text style={{marginTop: 8, textAlign:'right'}}>{bookingData.startTime} - {bookingData.endTime}</Text>
        </View>

      </View>
      <View style={styles.container3}>
      <View style={{flexDirection:"row"}}>
        <Text style={{margin: 8, fontWeight:'bold'}}>Transaction ID</Text>
        <Text style={{marginTop: 8, textAlign:'right', position: 'absolute', left: windowWidth * 0.265, fontSize: 13}}>{bookingData.paymentId}</Text>
        </View>

        <View style={{flexDirection:"row"}}>
        <Text style={{margin: 8, fontWeight:'bold'}}>Created At</Text>
        <Text style={{marginTop: 8, textAlign:'right'}}>
        {bookingData.createdAt.toDate().toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
        </Text>
        </View>

        <View style={{flexDirection:"row"}}>
        <Text style={{margin: 8, fontWeight:'bold'}}>Expires At</Text>
        <Text style={{marginTop: 8, textAlign:'right'}}>
        {bookingData.expiresAt.toDate().toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
</Text>

        </View>

        <View style={{flexDirection:"row"}}>
        <Text style={{margin: 8, fontWeight:'bold'}}>Payment Method</Text>
        <Text style={{marginTop: 8, textAlign:'right'}}>{bookingData.paymentMethod === 'gcash' ? 'GCash' : bookingData.paymentMethod === 'grab_pay' ? 'GrabPay' : 'Paymaya'}</Text>
        </View>

        <View style={{flexDirection:"row"}}>
        <Text style={{margin: 8, fontWeight:'bold'}}>Amount</Text>
        <Text style={{marginTop: 8, textAlign:'right'}}>{bookingData.price}</Text>
        </View>  
      </View>

      {/* <View style={styles.buttonContainer1}>
        <Button  
        title="View Bookings" color={button1Color} onPress={()=>navigation.navigate("SeekerBooking", {userEmail: userEmail})} />
      </View> */}
      <View style={styles.buttonContainer2}>
        <Button  title="Go Back to Home" color={button2Color} onPress={()=>navigation.navigate("BottomTabNavigation", {userRole: userRole, userEmail: userEmail})} />
      </View>
    </SafeAreaView>

  );
};



const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container1: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '60%',
    backgroundColor: '#07374D',
  },
  container2: {
    marginTop: 220,
    width: '80%',
    height: '25%',
    alignSelf: 'center',
    backgroundColor: 'white', // For visualization
    shadowColor: '#000',
    borderRadius:5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  container3: {
    marginTop: 10,
    width: '80%',
    height: '25%',
    alignSelf: 'center',
    backgroundColor: 'white', // For visualization
    shadowColor: '#000',
    borderRadius:5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  
  buttonContainer1: {
    marginTop: 30,
    marginHorizontal: 40,
  },
  buttonContainer2: {
    marginTop: 10,
    marginHorizontal: 40,
  },
  iconContainer: {
    position: 'absolute',
    top: '20%', // Adjust to vertically center
    left: '50%', // Adjust to horizontally center
    transform: [{ translateX: -60 }, { translateY: -60 }], // Center the icon
  },
});


