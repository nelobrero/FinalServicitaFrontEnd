import { Button, NativeBaseProvider } from "native-base";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from "./../../constants/theme";
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';

const { width, height } = Dimensions.get("window");

export default PaymentScreen = ({navigation, route}) => {
  
  const { bookingData } = route.params;
  const [gcashClicked, setGcashClicked] = useState(false);
  const [grabpayClicked, setGrabPayClicked] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGcashClick = () => {
    setGcashClicked(!gcashClicked);
    setGrabPayClicked(false);
  };


  const handleGrabPayClick = () => {
    setGrabPayClicked(!grabpayClicked);
    setGcashClicked(false);
  };

  useEffect(() => {
    if (gcashClicked) {
      setPaymentMethod("gcash");
    } else if (grabpayClicked) {
      setPaymentMethod("grab_pay");
    } else {
      setPaymentMethod("");
    }
    
  }, [gcashClicked, grabpayClicked]);

    const handleContinue = async () => {
      setLoading(true);
      const paymentData = {
        type: paymentMethod,
        amount: bookingData.price,
        redirect: {
          success: "http://192.168.254.111:5001/payment/success",
          failed: "http://192.168.254.111:5001/payment/failed",
        }
      }
      try {
        const response = await axios.post('http://192.168.254.111:5001/payment/initiatePayment', paymentData);
        const paymentId = response.data.data.id;
        const result = await WebBrowser.openAuthSessionAsync(response.data.data.redirect.checkout_url);
        if (result.type === 'dismiss') {
          setTimeout(() => {
            navigation.navigate('SplashScreen', {bookingData: bookingData, paymentMethod: paymentMethod, paymentId: paymentId});
          }, 1000);
          setLoading(false);
        }

  
      } catch (error) {
        console.error("Payment initiation failed:", error);

        alert("Payment initiation failed. Please try again later.");
      } finally {
        setLoading(false);
      }
  }

  return (
    <ScrollView>
    <NativeBaseProvider>
        <SafeAreaView>
        
      <View style={[styles.container, { height: height / 1.85 }]}>
      <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
                right: width * 0.4,
                position: 'absolute',
                zIndex: 1
            }}
        >
            <MaterialIcons name="arrow-back-ios" size={20} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
          Payment {"\n"}
          Methods...
          </Text>
        </View>
        <View style={styles.container2}>
        <View style={styles.container3}>
      </View>
          
          <View style={styles.buttonContainer2}>
            <Button
              style={[
                styles.button2,
                gcashClicked && styles.button2Clicked,
              ]}
              onPress={handleGcashClick}
              
            >
              <Image 
                source={require("./../../assets/gcash.png")}
                style={styles.buttonImage}
              />
            </Button>

            <Button
              style={[
                styles.button4,
                grabpayClicked && styles.button4Clicked,
              ]}
              onPress={handleGrabPayClick}
            >
              <Image 
                source={require("./../../assets/grabpay.png")}
                style={styles.buttonImage2}
              />
            </Button>

          </View>
        </View>
      </View>
      <View style={{alignItems: 'center', top: height * 0.15}}>
        <Text style={styles.text2}>E-wallet: {paymentMethod === "" ? "None" : paymentMethod === "gcash" ? "GCash" : paymentMethod === "paymaya" ? "Paymaya" : "GrabPay"}</Text>
      </View>
      <View style={styles.buttonContainer}>

        <Button 
        onPress={()=>handleContinue()}
        style={styles.button}
        opacity={!(gcashClicked ^ grabpayClicked)  || loading ? 0.5 : 1}
        disabled={!(gcashClicked ^ grabpayClicked) || loading}
        >
          <Text style={styles.buttonText}>Confirm Booking</Text>
        </Button>
      </View>
      
    </SafeAreaView>
    </NativeBaseProvider>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#07374D",
    alignItems: "center",
  },
  textContainer: {
    marginTop: 50,
    marginLeft: 20,
  },
  text: {
    fontSize: 50,
    fontWeight: "bold",
    textAlign: "left",
    right: 60,
    color: "white",
  },

  text1: {
    fontSize: 14,
    color: "black",
  },
  text2: {
    fontSize: 18,
    marginTop: 20,
    color: "black",
  },

  container2: {
    alignItems:'center',
    backgroundColor: "white",
    width: 330,
    height: height * 0.43,
    position: "absolute",
    top: 190,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // for Android
  },


  buttonContainer: {
    alignItems: "center",
    
  },
  buttonContainer2: {
    alignItems: "center",
    position: "absolute",
    marginTop: 20,
  },
  
  button: {
    backgroundColor: "#07374D",
    width: 330,
    height: 50,
    borderRadius: 5,
    marginTop: height * 0.25,
  },
  buttonClicked: {
    backgroundColor: "white",
    borderColor: "#07374D",
  },

  button2: {
    backgroundColor: "white",
    width: 210,
    height: 75,
    margin: 10,
    borderRadius: 5,
    justifyContent: "center", // Center align content vertically
    alignItems: "center", // Center align content horizontally
    overflow: "hidden", // Ensure the image stays within button boundaries
    position: "relative", // Ensure the image stays within button boundaries
  },
  button2Clicked: {
    backgroundColor: "#2EF29E",
    
  },

  buttonImage: {
    width: 200,
    height: 70,
    resizeMode: "contain", // or 'contain'
    
  },

  buttonImageMaya: {
    width: 200,
    height: 65,
    resizeMode: "cover", // or 'contain'
  },

  buttonImage2: {
    width: 200,
    height: 70,
    resizeMode: "cover", // or 'contain'
  },

  button3: {
    backgroundColor: "white",
    width: 210,
    height: 75,
    margin: 10,
    borderRadius: 5,
    justifyContent: "center", // Center align content vertically
    alignItems: "center", // Center align content horizontally
    overflow: "hidden", // Ensure the image stays within button boundaries
    position: "relative", // Ensure the image stays within button boundaries
  },
  
  button3Clicked: {
    backgroundColor: "#2EF29E",
  },

  button4: {
    backgroundColor: "white",
    width: 210,
    height: 75,
    margin: 10,
    borderRadius: 5,
    justifyContent: "center", // Center align content vertically
    alignItems: "center", // Center align content horizontally
    overflow: "hidden", // Ensure the image stays within button boundaries
    position: "relative", // Ensure the image stays within button boundaries
  },
  button4Clicked: {
    backgroundColor: "#2EF29E",
  },

  buttonText: {
    color: "white",
    fontWeight: "normal",
    fontSize: 16,
    fontWeight:"bold"

  },
  buttonTextClicked: {
    color: "#07374D",
  },

  container3: {
    paddingHorizontal: 20,
    alignItems:'center',
  },
  input3: {
    justifyContent:'center',
    alignItems:'center',
    margin: 10,
    width: 300,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    position: 'absolute',
  },
});
