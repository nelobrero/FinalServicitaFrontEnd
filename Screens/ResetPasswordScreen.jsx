import React, { useState } from "react";
import { Text, StyleSheet, View, TextInput, TouchableOpacity, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo icons library
import { FontSize, Color, FontFamily, Border } from "../GlobalStyles";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"; // Import responsive screen dimensions

function ResetPasswordScreen(props) {
    const [resetPasswordInput, setResetPasswordInput] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const handlePress = (role) => {
        // Update selected role and trigger state change
        
      };

    return (
        <View style={styles.resetPasswordScreen}>
            <Text style={[styles.resetPasswordHeader, styles.passwordFlexBox]}>
                Reset Password
            </Text>
            <Text style={[styles.enterNewPassword, styles.passwordFlexBox]}>
                Enter your new password
            </Text>

            <View style={[styles.passwordInputContainer, styles.childBorder]}>
                <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={24}
                    color={Color.colorDarkslategray_200}
                    style={styles.passwordIcon}
                    onPress={togglePasswordVisibility}
                />
                <TextInput
                    style={styles.passwordInput}
                    value={resetPasswordInput}
                    onChangeText={setResetPasswordInput}
                    placeholder="New Password"
                    secureTextEntry={!showPassword}
                />
            </View>

            <LinearGradient
                style={styles.continueButton}
                locations={[0, 1]}
                colors={["#4e8daa", "#023349"]}
            >
                <TouchableOpacity
                style={styles.continueButtonInner}
                onPress={() => handlePress("SUBMIT")}
                >
                <Text style={styles.contText}>SUBMIT</Text>
                </TouchableOpacity>
            </LinearGradient>
            
        </View>
    );
};

const styles = StyleSheet.create({
    passwordFlexBox: {
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        textAlign: "center",
        lineHeight: 23,
        position: "absolute",
    },
    frameChildLayout: {
        height: hp('7%'),
        width: wp('80%'),
    },
    frameChild: {
        top: 0,
        left: 0,
        borderRadius: Border.br_7xs,
        shadowColor: "#afc7d2",
        shadowOffset: {
            width: wp('1%'),
            height: hp('1.5%'),
        },
        shadowRadius: wp('1%'),
        elevation: 3,
        shadowOpacity: 1,
        borderColor: Color.colorDarkslategray_200,
        borderWidth: 0.2,
        backgroundColor: "transparent",
        height: hp('7%'),
        width: wp('80%'),
    },
    childBorder: {
        borderStyle: "solid",
        position: "absolute",
    },
    resetPasswordHeader: {
        top: hp('22%'),
        left: wp('13%'),
        fontSize: FontSize.size_6xl,
        color: Color.colorDarkslategray_100,
        width: wp('70%'),
        height: hp('3%'),
        fontFamily: FontFamily.quicksandBold,
        fontWeight: "700",
        alignItems: "center",
        display: "flex",
        textAlign: "center",
        lineHeight: hp('4%'),
    },
    enterNewPassword: {
        top: hp('26%'),
        left: wp('3'),
        fontSize: FontSize.size_mini,
        letterSpacing: 1.1,
        fontWeight: "300",
        fontFamily: FontFamily.quicksandLight,
        color: Color.colorBlack,
        width: wp('90%'),
        height: hp('3%'),
        alignItems: "center",
        display: "flex",
        textAlign: "center",
        lineHeight: hp('3.5%'),
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Color.colorGainsboro,
        borderColor: Color.colorGray_100,
        borderWidth: 1,
        width: wp('84%'),
        height: hp('6%'),
        top: hp('34%'),
        left: wp('8%'),
        position: "absolute",
    },
    passwordInput: {
        flex: 1,
        height: '100%',
        paddingHorizontal: wp('2%'), // Add padding for text input
    },
    passwordIcon: {
        marginHorizontal: wp('2%'), // Adjust icon position
    },
    submitButtonContainer: {
        top: hp('56%'),
        left: wp('10%'),
        position: "absolute",
        width: wp('80%'),
    },
    submitButtonText: {
        top: hp('2%'),
        left: wp('9%'),
        fontSize: FontSize.size_5xl,
        color: Color.colorWhite,
        width: wp('60%'),
        height: hp('4%'),
        fontFamily: FontFamily.quicksandBold,
        fontWeight: "700",
        alignItems: "center",
        display: "flex",
        textAlign: "center",
        lineHeight: hp('4%'),
    },
    resetPasswordScreen: {
        backgroundColor: Color.colorWhite,
        flex: 1,
        width: "100%",
        height: "100%",
        overflow: "hidden",
    },
    continueButton: {
        width: wp('80%'),
        height: hp('7%'),
        borderRadius: 6,
        overflow: "hidden",
        position: "absolute",
        top: hp('85%'),
        left: wp('10%'),
        ...Platform.select({
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
      contText: {
        color: "white",
        fontSize: wp('5%'),
        fontWeight: "700",
        fontFamily: FontFamily.quicksandBold,
      },
});

export default ResetPasswordScreen;
