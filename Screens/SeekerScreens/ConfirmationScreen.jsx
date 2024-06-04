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
    const result = await axios.post("http://3.26.59.191:5001/user/getUserDetailsById", { id: bookingData.seekerId })
    setUserRole(result.data.data.role);
    setUserEmail(result.data.data.email);
    
    const seekerName = await getSeekerData();
    const providerName = await getProviderData();
    // sendReceiptEmail(seekerName, result.data.data.email, providerName);
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
  setUserDataFetched(true);
  return providerData.data().name.firstName + ' ' + providerData.data().name.lastName;
}

async function sendReceiptEmail(seekerName, email, providerName) {
  try {
    const receiptData = {
      email: email,
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

    const response = await axios.post("http://3.26.59.191:5001/email_verification_otp/sendReceipt", receiptData);

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


  if (!userDataFetched || userRole === '' || userEmail === '') {
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
    <View style={{marginTop: 15}}>
        <Text style={{ fontSize: 30, color: 'white', alignSelf: 'center', marginTop: 163, }}>Booking Confirmed</Text>
        <Text style={{alignSelf:'center', marginTop: 1, color:'white'}}>You can view your booking details below.</Text>
      </View>
      
    </View>
    <View style={[styles.container2, { justifyContent: "center", marginTop: 225 }]}>

      <View style={{flexDirection:"row", }}>
      <Text style={styles.textBold} >Booking ID</Text>
      <Text style={styles.textRegular}>{bookingId}</Text>
      </View>

      <View style={{flexDirection:"row"}}>
      <Text style={styles.textBold}>Provider</Text>
      <Text style={styles.textRegular}>{providerData.name.firstName} {providerData.name.lastName}</Text>
      </View>

      <View style={{flexDirection:"row"}}>
      <Text style={styles.textBold}>Location</Text>
      <Text style={styles.textRegular}>{bookingData.location.address}</Text>
      </View>

      <View style={{flexDirection:"row"}}>
      <Text style={styles.textBold}>Date</Text>
      <Text style={styles.textRegular}>{bookingData.bookedDate}</Text>
      </View>

      <View style={{flexDirection:"row"}}>
      <Text style={styles.textBold}>Time</Text>
      <Text style={styles.textRegular}>{bookingData.startTime} - {bookingData.endTime}</Text>
      </View>

    </View>
    <View style={[styles.container3, { justifyContent: "center" }]}>
    <View style={{flexDirection:"row", }}>
      <Text style={styles.textBold}>Transaction ID</Text>
      <Text style={{marginTop: 8, textAlign:'right', position: 'absolute', left: windowWidth * 0.265, fontSize: windowWidth * 0.030}}>{bookingData.paymentId}</Text>
      </View>

      <View style={{flexDirection:"row"}}>
      <Text style={styles.textBold}>Created At</Text>
      <Text style={styles.textRegular}>
      {bookingData.createdAt.toDate().toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
      </Text>
      </View>

      <View style={{flexDirection:"row"}}>
      <Text style={styles.textBold}>Expires At</Text>
      <Text style={styles.textRegular}>
      {bookingData.expiresAt.toDate().toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
</Text>

      </View>

      <View style={{flexDirection:"row"}}>
      <Text style={styles.textBold}>Payment Method</Text>
      <Text style={styles.textRegular}>{bookingData.paymentMethod === 'gcash' ? 'GCash' : bookingData.paymentMethod === 'grab_pay' ? 'GrabPay' : 'Paymaya'}</Text>
      </View>

      <View style={{flexDirection:"row"}}>
      <Text style={styles.textBold}>Amount</Text>
      <Text style={styles.textRegular}>{bookingData.price}</Text>
      </View>  
    </View>

    
    <View style={styles.buttonContainer2}>
      {/* <Button  title="Go Back to Home" color={button2Color} onPress={()=>navigation.navigate("BottomTabNavigation", {userRole: userRole, userEmail: userEmail})} /> */}
      <Button 
            title="Go Back to Home" 
            filled 
            Color={Color.colorWhite} 
            style={{ 
              height: 53,
              // width: windowWidth * 0.890, 
              width: windowWidth * 0.81, 
              // top: 540,
              // bottom: windowHeight * 0.12, 
              position: "relative", 
            }} 
            onPress={()=>navigation.navigate("BottomTabNavigation", {userRole: userRole, userEmail: userEmail})}
          />
    </View>
  </SafeAreaView>

);
};



const styles = StyleSheet.create({
safeArea: {
  flex: 1,
  backgroundColor:"white"
},
container1: {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '55%',
  backgroundColor: '#07374D',
},
container2: {
  marginTop: windowHeight * 0.3,
  // width: '80%',
  width: windowWidth * 0.81, 
  // height: '25%',
  height: windowHeight * 0.25,
  alignSelf: 'center',
  backgroundColor: 'white', // For visualization
  shadowColor: '#000',
  // borderRadius:5,
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
  // width: '80%',
  width: windowWidth * 0.81, 
  // height: '25%',
  height: windowHeight * 0.25,
  alignSelf: 'center',
  backgroundColor: 'white', // For visualization
  shadowColor: '#000',
  // borderRadius:5,
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

iconContainer: {
  position: 'absolute',
  top: '25%', // Adjust to vertically center
  left: '50%', // Adjust to horizontally center
  transform: [{ translateX: -60 }, { translateY: -60 }], // Center the icon
 
},
textBold:{
  margin: 8, 
  fontWeight:'bold',
  fontSize:  windowWidth * 0.035,
  textAlign:'left',
},
textRegular:{
  marginTop: 8, 
  textAlign:'right',
  fontSize: windowWidth * 0.035,
  // left: windowWidth * 0.265,
  // right: windowWidth * 0.09,
 
  
},
buttonContainer2: {
  marginTop: windowHeight * 0.035,
 // bottom:  windowHeight * 0.03,
  marginHorizontal: 40,
},
});
