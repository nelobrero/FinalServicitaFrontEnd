import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, Platform, Pressable, Image} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useNotifications, createNotifications } from 'react-native-notificated';
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from '@expo/vector-icons';

function UserRoleScreen({navigation, route}){
  const { NotificationsProvider } = createNotifications({
    multiline : true,
  })

  const { notify } = useNotifications();
  
  const [selectedRole, setSelectedRole] = useState(null);
  
 
  const { email, firstName, lastName, userId } = route.params;

  

  const handleRolePress = (role) => {
    setSelectedRole(role);
  };

  useEffect(() => {
    notify('info', {
      params: {
        title: 'Choose Your Role',
        description: 'Sign up as a Seeker or Provider.',
      },
    });
  }, [])

  useEffect(() => {
    if (selectedRole) {
      notify('info', {
        params: {
          title: 'Role Selected',
          description: `You are signing up as a ${selectedRole}.`
        },
      });
    }
  }, [selectedRole]);

  const handleContinuePress = () => {
    console.log(selectedRole);
    if (selectedRole === "Seeker") {
      if (email && firstName && lastName && userId) {
        navigation.navigate("MissingInfo", { email: email, firstName: firstName, lastName: lastName, userId: userId, role: "Seeker" });
      } else {
        navigation.navigate("Register", { role: "Seeker" });
      }
      
    } else if (selectedRole === "Provider") {
      if (email && firstName && lastName && userId) {
        navigation.navigate("MissingInfo", { email: email, firstName: firstName, lastName: lastName, userId: userId, role: "Provider" });
      } else {
        navigation.navigate("Register", { role: "Provider" });
      }
    }
  };

 return (
    <SafeAreaView style={styles.userRoleScreen}>
       <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.arrowContainer}
        >
            <MaterialIcons name="arrow-back-ios" size={20} color={"#07374d"} />
            </TouchableOpacity>

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
          <Text style={styles.contText}>Continue</Text>
        </TouchableOpacity>
      </LinearGradient>
      <NotificationsProvider/>
    </SafeAreaView>
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
    color: "#07374d",
    fontWeight: "700",
    fontSize: RFValue(30),
    textAlign: "center",
  },
  button: {
    width: wp('80%'),
    height: hp('20%'),
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.8,
    borderRadius: 15,
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
    color: "#07374d",
    textAlign: "center",
    fontWeight: "700",
  },
  serviceText: {
    color: "#07374d",
    textAlign: "center",
    fontWeight: "700",
  },
  contText: {
    color: "white",
    fontSize: RFValue(30),
    fontWeight: "700",
  },
  selectedButton: {
    backgroundColor: "#07374d",
  },
  selectedButtonText: {
    color: "white",
  },
  serviceSeekerButton: {
    position: "absolute",
    top: hp('30%'),
  },
  serviceProviderButton: {
    position: "absolute",
    top: hp('53%'),
  },
  continueButton: {
    width: wp('80%'),
    height: hp('8%'),
    borderRadius: 12,
    overflow: "hidden",
    position: "absolute",
    bottom: hp('5%'),
    
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
    backgroundColor: "#07374d"
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
    top: hp('5%'),
    left: wp('5%'),
    zIndex: 2,
  },
});

export default UserRoleScreen;