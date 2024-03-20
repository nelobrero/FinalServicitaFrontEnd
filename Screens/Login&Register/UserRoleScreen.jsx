import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Platform, Pressable, Image} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

function UserRoleScreen({navigation, route, props}){
  const [selectedRole, setSelectedRole] = useState(null);
  
  const { email, name, userId } = route.params;

  console.log(email, name, userId);
  const handleRolePress = (role) => {
    setSelectedRole(role);
  };

  const handleContinuePress = () => {
    console.log(selectedRole);
    if (selectedRole === "Seeker") {
      if (email && name && userId) {
        navigation.navigate("MissingInfo", { email: email, name: name, userId: userId, role: "Seeker" });
      } else {
        navigation.navigate("Register", { role: "Seeker" });
      }
      
    } else if (selectedRole === "Provider") {
      if (email && name && userId) {
        navigation.navigate("MissingInfo", { email: email, name: name, userId: userId, role: "Provider" });
      } else {
        navigation.navigate("Register", { role: "Provider" });
      }
    }
  };

 return (
    <View style={styles.userRoleScreen}>
       <Pressable onPress={() => navigation.goBack()} style={styles.arrowContainer}>
        <Image
          style={styles.userroleChild}
          contentFit="cover"
          source={require("./../../assets/arrow-1.png")}
        />
      </Pressable>

      <Text style={[styles.signingUpAs, styles.continueTypo]}>
        Signing Up as a...
      </Text>

      <Pressable
        style={[styles.button, styles.serviceSeekerButton, selectedRole === "Seeker" && styles.selectedButton]}
        onPress={() => handleRolePress("Seeker")}
      >
        <Text style={[styles.serviceText,selectedRole === "Seeker" && styles.selectedButtonText, {fontSize: RFValue(25), marginVertical: RFValue(-5)}]}>SERVICE</Text>
        <Text style={[styles.buttonText, selectedRole === "Seeker" && styles.selectedButtonText, {fontSize: RFValue(40), marginVertical: RFValue(-6)}]}>SEEKER</Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.serviceProviderButton, selectedRole === "Provider" && styles.selectedButton]}
        onPress={() => handleRolePress("Provider")}
      >
        <Text style={[styles.serviceText,selectedRole === "Provider" && styles.selectedButtonText, {fontSize: RFValue(25), marginVertical: RFValue(-5)}]}>SERVICE</Text>
        <Text style={[styles.buttonText, selectedRole === "Provider" && styles.selectedButtonText, {fontSize: RFValue(40), marginVertical: RFValue(-6)}]}>PROVIDER</Text>
      </Pressable>

      <LinearGradient
        style={styles.continueButton}
        locations={[0, 1]}
        colors={["#4e8daa", "#023349"]}
      >
        <TouchableOpacity
          style={[styles.continueButtonInner, !selectedRole && styles.disabled]}
          onPress={handleContinuePress}
          disabled={!selectedRole}
        >
          <Text style={styles.contText}>CONTINUE</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  userRoleScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  continueTypo: {
    textAlign: "left",
    fontWeight: "700",
    fontSize: RFValue(30),
    position: "absolute",
  },
  signingUpAs: {
    top: hp('15%'),
    color: "#1f546d",
    fontWeight: "700",
    fontSize: RFValue(30),
    textAlign: "center",
  },
  button: {
    width: wp('80%'),
    height: hp('17%'),
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.8,
    borderRadius: 3,
    borderColor: "gray",
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonText: {
    color: "#1f546d",
    textAlign: "center",
    fontWeight: "700",
  },
  serviceText: {
    color: "#1f546d",
    textAlign: "center",
    fontWeight: "700",
  },
  contText: {
    color: "white",
    fontSize: RFValue(30),
    fontWeight: "700",
  },
  selectedButton: {
    backgroundColor: "#1f546d",
  },
  selectedButtonText: {
    color: "white",
  },
  serviceSeekerButton: {
    position: "absolute",
    top: hp('32%'),
  },
  serviceProviderButton: {
    position: "absolute",
    top: hp('52%'),
  },
  continueButton: {
    width: wp('80%'),
    height: hp('8%'),
    borderRadius: 6,
    overflow: "hidden",
    position: "absolute",
    top: hp('80%'),
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  continueButtonInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  userroleChild: {
    top: hp('4%'),
    left: wp('5%'),
    maxHeight: "100%",
    width: wp('7%'),
    position: "absolute",
  },
  disabled: {
    opacity: 0.5,
  },
  arrowContainer: {
    position: "absolute",
    top: hp('3%'), // Adjust the top position as needed
    left: wp('3%'), // Adjust the left position as needed
    zIndex: 1, // Ensure the arrow stays above other components
  },
});

export default UserRoleScreen;
