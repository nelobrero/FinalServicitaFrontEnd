import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Pressable, StyleSheet, Dimensions, SafeAreaView, Alert, ScrollView } from 'react-native'
import { FontSize, Color, FontFamily, errorText } from "../../GlobalStyles";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons } from "@expo/vector-icons";
import Button from "../../components/Button"
import axios from 'axios';
import Addition from '@expo/vector-icons/MaterialCommunityIcons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ResetPasswordScreen({navigation, route, params}) {
    const [password, setPassword] = useState('');
    const [passwordVerify, setPasswordVerify] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordVerify, setConfirmPasswordVerify] = useState(false);
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);

    const { email } = route.params;

    useEffect(() => {
        setConfirmPasswordVerify(confirmPassword === password);
    }, [confirmPassword, password]);


    const handleSubmit  = () => {
        const userData = {
            email: email,
            newPassword: password,
          }
          axios.patch("http://192.168.1.7:5000/forgot_password_otp/actualReset", userData).then((res) => {
            if (res.data.status === 'SUCCESS') {
                Alert.alert('Success', 'Password Reset Successful. Please Login Again', [{ text: 'OK', onPress: () => navigation.navigate('Login') }]);
              } else {
                Alert.alert('Error', 'An error occurred while processing your request. Please try again later.', [{ text: 'OK' }]);
              }}).catch((err) => {
                  Alert.alert('Error', 'An error occurred while processing your request. Please try again later.', [{ text: 'OK' }]);
                  console.log(err.response.data.message);
              });
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: Color.colorWhite}}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"always"}>
        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', marginHorizontal: windowWidth * 0.05, marginTop: windowHeight * 0.07 }}>
                            <Pressable onPress={() => navigation.navigation("Login")} style={styles.arrowContainer}>
                                            <Image
                                            style={styles.userroleChild}
                                            contentFit="cover"
                                            source={require("./../../assets/arrow-1.png")}
                                            />
                            </Pressable>
        </View>
        
        <View style={styles.resetPasswordScreen}>
            <Text style={[styles.passwordRecovery, styles.passwordFlexBox]}>
                Reset Password
            </Text>
            <Text style={[styles.enterYourEmail, styles.passwordFlexBox]}>
                Enter your new password
            </Text>

            <View style={{  marginTop: windowHeight * 0.05, width: windowWidth * 0.9 }}>
                <Text style={{
                    fontSize: windowWidth * 0.05,
                    fontWeight: '400',
                    marginVertical: windowHeight * 0.01,
                    color: Color.colorBlue
                }}>Password</Text>

                <View style={{
                    width: '100%',
                    height: windowHeight * 0.06,
                    borderColor: password === null || password === '' ? Color.colorBlue1 : passwordVerify ? Color.colorGreen : Color.colorRed,
                    borderWidth: 1,
                    borderRadius: windowHeight * 0.015,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingLeft: windowWidth * 0.05,
                    paddingHorizontal: windowWidth * 0.14,
                    flexDirection: 'row'
                }}>
                    <FontAwesome name="lock" color={password === null || password === '' ? Color.colorBlue1 : passwordVerify ? Color.colorGreen : Color.colorRed} style={{marginRight: 5, fontSize: 24}} />
                    <TextInput
                        placeholder='Enter your password'
                        placeholderTextColor={Color.colorBlue}
                        secureTextEntry={isPasswordShown}
                        style={{
                            width: "100%"
                        }}
                        onChange={(e) => {
                            const passwordInput = e.nativeEvent.text;
                            setPassword(passwordInput);
                            setPasswordVerify(passwordInput.length > 1 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(passwordInput));
                        }}
                    />
                    <TouchableOpacity onPress={() => setIsPasswordShown(!isPasswordShown)} style={{ position: "absolute", right: 12 }}>
                        <Ionicons name={isPasswordShown ? "eye-off" : "eye"} size={24} color={password === null || password === '' ? Color.colorBlue1 : passwordVerify ? 'green' : 'red'} />
                    </TouchableOpacity>
                </View>
                {password.length < 1 ? null : passwordVerify ? null : (
                    <Text style={errorText}>Password must be at least 8 characters long and include at least one uppercase letter and one digit.</Text>
                )}
            </View>

             <View style={ { marginTop: windowHeight * 0.03, width: windowWidth * 0.90} }>
                <Text style={{
                    fontSize: windowWidth * 0.05,
                    fontWeight: '400',
                    marginVertical: windowHeight * 0.01,
                    color: Color.colorBlue
                }}>Confirm Password</Text>

                <View style={{
                    width: '100%',
                    height: windowHeight * 0.06,
                    borderColor: confirmPassword === null || confirmPassword === '' ? Color.colorBlue1 : confirmPasswordVerify ? Color.colorGreen : Color.colorRed,
                    borderWidth: 1,
                    borderRadius: windowHeight * 0.015,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingLeft: windowWidth * 0.05,
                    paddingHorizontal: windowWidth * 0.14,
                    flexDirection: 'row'
                }}>
                    <Addition name="lock-check" color={confirmPassword === null || confirmPassword === '' ? Color.colorBlue1 : confirmPasswordVerify ? Color.colorGreen : Color.colorRed} style={{marginRight: 5, fontSize: 24}} />
                    <TextInput
                     placeholder='Confirm password'
                     placeholderTextColor={Color.colorBlue}
                     secureTextEntry={isConfirmPasswordShown}
                     style={{
                        width: "100%"
                     }}
                     onChange={(e) => {
                        const confirmPasswordInput = e.nativeEvent.text;
        setConfirmPassword(confirmPasswordInput);
                    }}
                    />
                    <TouchableOpacity onPress={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)} style={{ position: "absolute", right: 12 }}>
                        <Ionicons name={isConfirmPasswordShown ? "eye-off" : "eye"} size={24} color={confirmPassword === null || confirmPassword === '' ? Color.colorBlue1 : confirmPasswordVerify ? 'green' : 'red'} />
                    </TouchableOpacity>
                </View>
                {confirmPassword.length < 1 ? null : confirmPasswordVerify ? null : (
                    <Text style={errorText}>Password should be 8 characters long and should match the password entered above.</Text>
                )}
            </View> 
            
            <Button
                    title="Submit"
                    filled
                    Color={Color.colorWhite}
                    style={{
                        marginTop: windowHeight * 0.07,
                        marginBottom: windowHeight * 0.05,
                        width: windowWidth * 0.87,
                        height: windowHeight * 0.08,
                        top: windowHeight * 0.03,
                    }}
                    onPress={handleSubmit}
                    disabled={!passwordVerify || !confirmPasswordVerify}
                />
            
        </View>
        </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    passwordFlexBox: {
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        textAlign: "center",
        lineHeight: 23,
        marginBottom: windowHeight * 0.04,
    },
    passwordRecovery: {
        fontSize: FontSize.size_5xl,
        color: Color.colorDarkslategray_100,
        fontFamily: FontFamily.quicksandBold,
        fontWeight: "700",
        alignItems: "center",
        display: "flex",
        textAlign: "center",
        lineHeight: windowHeight * 0.1,
    },
    enterYourEmail: {
        fontSize: FontSize.size_mini,
        letterSpacing: 0.5,
        fontWeight: "300",
        fontFamily: FontFamily.quicksandLight,
        color: Color.colorBlack,
        alignItems: "center",
        display: "flex",
        textAlign: "center",
        lineHeight: windowHeight * 0.05,
        bottom: windowHeight * 0.02,
    },
    resetPasswordScreen: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Color.colorWhite,
        marginHorizontal: windowWidth * 0.05,
        flexDirection: 'column',
        alignItems: 'center',
        position: 'absolute',
        top: windowHeight * 0.2,
    },
    arrowContainer: {
        bottom: windowHeight * 0.02,
        left: windowWidth * 0.01,
    },
    userroleChild: {
        top: windowHeight * 0.003,
        left: windowWidth * 0.001,
        maxHeight: "100%",
        width: windowWidth * 0.07,
    },
});