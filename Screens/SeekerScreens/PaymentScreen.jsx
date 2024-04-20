
import { Button, NativeBaseProvider } from "native-base";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Text, Image} from "react-native";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../constants";
import { TouchableOpacity } from "react-native-gesture-handler";  
import { SafeAreaView } from "react-native-safe-area-context";
const { width, height } = Dimensions.get("window");

export default PaymentScreen = ({navigation, route}) => {
  
  const { bookingData } = route.params;
  const [gcashClicked, setGcashClicked] = useState(false);
  const [paymayaClicked, setPaymayaClicked] = useState(false);
  const [grabpayClicked, setGrabPayClicked] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentUrl, setPaymentUrl] = useState(null);


  const handleGcashClick = () => {
    setGcashClicked(!gcashClicked);
    setPaymayaClicked(false);
    setGrabPayClicked(false);
  };

  const handlePaymayaClick = () => {
    setPaymayaClicked(!paymayaClicked);
    setGcashClicked(false);
    setGrabPayClicked(false);
  };

  const handleGrabPayClick = () => {
    setGrabPayClicked(!grabpayClicked);
    setGcashClicked(false);
    setPaymayaClicked(false);

  };

  useEffect(() => {
    if (gcashClicked) {
      setPaymentMethod("gcash");
    } else if (paymayaClicked) {
      setPaymentMethod("paymaya_wallet");
    } else if (grabpayClicked) {
      setPaymentMethod("grabpay_ph");
    } else {
      setPaymentMethod("");
    }
    
  }, [gcashClicked, paymayaClicked, grabpayClicked]);

  const handleContinue = async () => {
    const finalBookingData = {
      ...bookingData,
      paymentMethod: paymentMethod
    }
    try {
      const response = await axios.post("http://192.168.1.17:5000/payment/initiatePayment", { value: bookingData.price, type: paymentMethod });
      if (response.status === 200) {
        setPaymentUrl(response.data.action.url);
        console.log("Payment URL:", response.data.action.url);
      } else {
        // Handle other cases (e.g., payment initiation failed)
        alert("Payment initiation failed. Please try again later.");
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Payment initiation failed. Please try again later.");
    }
  }
  return (
    <NativeBaseProvider>
        <SafeAreaView>
  
      <View style={[styles.container, { height: height / 2 }]}>
      <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
                position: 'absolute',
                zIndex: 1,
                right: width * 0.4
            }}
        >
            <MaterialIcons name="arrow-back-ios" size={20} color={COLORS.white} />
            </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            Start {"\n"}
            Booking...
          </Text>
        </View>
        <View style={styles.container2}>
          <Text style={styles.text2}>Choose Payment Method</Text>
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
                styles.button3,
                paymayaClicked && styles.button3Clicked,
              ]}
              onPress={handlePaymayaClick}
            >
              <Image 
                source={require("./../../assets/maya.png")}
                style={styles.buttonImageMaya}
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

          <View style={styles.buttonContainer}>
            <Button 
              onPress={handleContinue}
              style={[styles.button, {opacity: !(gcashClicked ^ paymayaClicked ^ grabpayClicked) ? 0.5 : 1}]}
              disabled={!(gcashClicked ^ paymayaClicked ^ grabpayClicked)}
            >
              <Text style={styles.buttonText}>Confirm Booking</Text>
            </Button>
          </View>

  
    </SafeAreaView>
    </NativeBaseProvider>
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

  text2: {
    fontSize: 20,
    marginTop: 10,
    color: "black",
    justifyContent: "center"
  },

  container2: {
    backgroundColor: "white",
    width: 330,
    height: 450,
    position: "absolute",
    top: 190,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
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
    marginTop: height * 0.4,
  },
  buttonContainer2: {
    alignItems: "center",
    marginTop: 5,
  },
  
  button: {
    backgroundColor: "#07374D",
    width: 330,
    height: 50,
    borderRadius: 5,
  },
  buttonClicked: {
    backgroundColor: "white",
    borderColor: "#07374D",
  },

  button2: {
    backgroundColor: "white",
    width: 250,
    height: 88,
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
    width: 245,
    height: 255,
    resizeMode: "contain", // or 'contain'
    
  },

  buttonImageMaya: {
    width: 245,
    height: 80,
    resizeMode: "cover", // or 'contain'
  },

  buttonImage2: {
    width: 245,
    height: 85,
    resizeMode: "cover", // or 'contain'
  },

  button3: {
    backgroundColor: "white",
    width: 250,
    height: 88,
    margin: 10,
    borderRadius: 5,
    fontWeight:"bold",
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
    width: 250,
    height: 90,
    margin: 10,
    borderRadius: 10,
    fontWeight:"bold",
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
});
