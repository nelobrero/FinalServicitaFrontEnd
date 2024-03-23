import React, { useState, useRef, useEffect } from "react";
import { Text, StyleSheet, View, TextInput, Image, Pressable, Dimensions, SafeAreaView, ScrollView, Alert } from "react-native";
import { FontSize, Color, FontFamily, errorText, Border } from "../../GlobalStyles";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import Error from '@expo/vector-icons/MaterialIcons';
import Button from "../../components/Button";
import axios from "axios";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ForgotPasswordScreen({navigation}) {
    const [email, setEmail] = useState("");
    const [emailVerify, setEmailVerify] = useState(false);
    const [confirm, setConfirm] = useState(null);
    const [code, setCode] = useState(["", "", "", ""]);
    const inputRefs = useRef([]);
    const [timer, setTimer] = useState(300);
    const [finalUserId, setUserId] = useState("");

    useEffect(() => {
        
        
        fetchServerTime();
        getUserId();
        
        const interval = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer <= 0) {
                    return prevTimer;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const handlePress = async () => {
        try {
            const response = await axios.post("http://192.168.1.14:5000/forgot_password_otp/request", { email: email });
            console.log(response);
            if (response.status === 202) {
                setConfirm(true);
                console.log("SUCCESS");
            } else {
                Alert.alert("An error occurred while processing your request. Please try again later.", [{ text: "OK" }]);
            }

        } catch (error) {
            if (error.response.message === "No account with the said email exists!") {
                Alert.alert("No account with the said email exists. Please register.", [ { text: "Yes", onPress: () => navigation.navigate("UserRole", {email: '', name: '', userId: ''}) }]);
            } else if (error.response.message === "Email hasn't been verified yet. Check your inbox.") {
                Alert.alert("Email has not been verified yet. Please verify your email.", [ { text: "Yes", onPress: () => navigation.navigate("VerificationScreen", {email: email, userId: finalUserId}) }]);
            } else {
                console.log(error);
            }
        }
    };

    const getUserId = async () => {
        try {
            const response = await axios.post("http://192.168.1.14:5000/user/getUserDetailsByEmail", { email: email });
            setUserId(response.data.data._id);
        } catch (error) {
            console.log(error);
        }
    }

    const updateCode = (index, value) => {
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        console.log(newCode);
    
        if (value === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        } else if (value !== '' && index < code.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        return formattedTime;
    };

    const fetchServerTime = async () => {
        try {
            console.log('Fetching server time...');
            const response = await axios.get(`http://192.168.1.14:5000/forgot_password_otp/getRemainingCurrentTime/${finalUserId}`);
            const remainingTime = Math.floor(response.data.remainingTime / 1000);
            if (remainingTime <= 0) {
                setTimer(0);
            } else {
                setTimer(remainingTime);
            }
            
            console.log('Server time fetched:', remainingTime)
        } catch (error) {
            console.log('Error fetching server time:', error);
        }
    };

    const handleSendAgainPress = () => {
        setTimer(300);
        const userData = {
            userId: finalUserId,
            email: email,
          }
        axios.post("http://192.168.1.14:5000/forgot_password_otp/resendOTPPasswordReset", userData).then((res) => {
          console.log(res.data);
          if (res.data.status === 'PENDING') {
            Alert.alert('Resent', 'OTP has been resent. Please check your email.', [{ text: 'OK'}]);
          } else {
            Alert.alert('Error', 'An error occurred while processing your request. Please try again later.', [{ text: 'OK' }]);
          }}).catch((err) => {
            console.log(err);
          });
    };

    const confirmCode = async () => {
        const userData = {
            userId: finalUserId,
            otp: code.join(''),
            newPassword: "password",
          }
        axios.post("http://192.168.1.14:5000/forgot_password_otp/reset", userData).then((res) => {
            if (res.data.status === 'SUCCESS') {
                Alert.alert('Success', 'OTP has been verified successfully. Please change your password.', [{ text: 'OK', onPress: () => navigation.navigate('ResetPassword', { userId: finalUserId}) }]);
              } else {
                Alert.alert('Error', 'An error occurred while processing your request. Please try again later.', [{ text: 'OK' }]);
              }}).catch((err) => {
                if(err.response.data.message === "Invalid code passed."){
                  Alert.alert('Error', 'Invalid code passed.', [{ text: 'OK'}]);
                } else {
                  Alert.alert('Error', 'An error occurred while processing your request. Please try again later.', [{ text: 'OK' }]);
                  console.log(err.response.data.message);
                } 
              });
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Color.colorWhite }}>
        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', marginHorizontal: windowWidth * 0.05, marginTop: windowHeight * 0.07 }}>
                            <Pressable onPress={() => navigation.goBack()} style={styles.arrowContainer}>
                                            <Image
                                            style={styles.userroleChild}
                                            contentFit="cover"
                                            source={require("./../../assets/arrow-1.png")}
                                            />
                            </Pressable>
        </View>
        <View style={styles.container}>
        {!confirm ? (
            <>
            <Text style={[styles.passwordRecovery, styles.passwordFlexBox]}>
                Forgot Password
            </Text>
            <Text style={[styles.enterYourEmail, styles.passwordFlexBox]}>
                Enter your email to change your password
            </Text>

            <View style={{ marginTop: windowHeight * 0.05, width: windowWidth * 0.90 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: '400',
                        marginVertical: windowHeight * 0.01,
                        color: Color.colorBlue,
                        
                    }}>Email address</Text>

                    <View style={{
                        width: '100%',
                        height: windowHeight * 0.06,
                        borderColor: email === null || email === '' ? Color.colorBlue1 : emailVerify ? Color.colorGreen : Color.colorRed,
                        borderWidth: 1,
                        borderRadius: windowHeight * 0.015,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingLeft: windowWidth * 0.05,
                        paddingHorizontal: windowWidth * 0.14,
                        flexDirection: 'row'                   
                    }}>
                        <FontAwesome name="envelope" color = {email === null || email === '' ? Color.colorBlue1 : emailVerify ? Color.colorGreen : Color.colorRed} style={{marginRight: 5, fontSize: 24}} />
                        <TextInput
                            placeholder='Enter your email address'
                            placeholderTextColor={Color.colorBlue}
                            keyboardType='email-address'
                            style={{
                                width: '100%'
                            }}
                            onChange={(e) => {
                                const trimmedEmail = e.nativeEvent.text.trim();
                                setEmail(trimmedEmail);
                                setEmailVerify(trimmedEmail.length > 1 && /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/.test(trimmedEmail));
                            }}
                        />
                        {email.length < 1 ? null : emailVerify ? (
                            <Feather name="check-circle" color="green" size={24} style={{ position: "absolute", right: 12 }}/>
                        ) : (
                            <Error name="error" color="red" size={24} style={{ position: "absolute", right: 12 }}/>
                        )}
                    </View>
                    {email.length < 1 ? null : emailVerify ? null : (
                        <Text style={errorText}>Please enter a valid email address.</Text>
                    )}
                </View>

            
            <Button
            title="Send OTP"
            filled
            Color={Color.colorWhite}
            style={{
                marginTop: windowHeight * 0.07,
                marginBottom: windowHeight * 0.05,
                width: windowWidth * 0.87,
                height: windowHeight * 0.08,
                top: windowHeight * 0.1,
            }}
            onPress={handlePress}
            disabled={!emailVerify}
           />
            </>
        ) : (
            <>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={[styles.passwordRecovery, styles.passwordFlexBox]}>We’ve sent the code to:</Text>
                <Text style={[styles.enterYourEmail, styles.passwordFlexBox]}>{email}</Text>
                <View style={styles.timerContainer}>
                    <Text style={styles.text}>Code expires in: </Text>
                    <Text style={[styles.text, {fontWeight: '800'}]}>{formatTime(timer)}</Text>
                </View>
                    <View style={styles.codeInputContainer}>
                        {[0, 1, 2, 3].map((index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => (inputRefs.current[index] = ref)}
                                style={styles.codeInput}
                                keyboardType="numeric"
                                maxLength={1}
                                onKeyPress={({ nativeEvent }) => {
                                    console.log(nativeEvent.key);
                                    if (nativeEvent.key === 'Backspace' && code[index] === '') {
                                        if (index !== 0) {
                                            inputRefs.current[index - 1].focus();
                                        }
                                    } else if (!isNaN(nativeEvent.key) && code[index] && index !== 3) {
                                        inputRefs.current[index + 1].setNativeProps({ text: nativeEvent.key });
                                        updateCode(index + 1, nativeEvent.key);
                                    }
                                }}
                                onChange={(e) => updateCode(index, e.nativeEvent.text)}
                            />
                        ))}
                    </View>
                    <Button
            title="Verify"
            filled
            Color={Color.colorWhite}
            style={{
                marginTop: windowHeight * 0.07,
                marginBottom: windowHeight * 0.05,
                width: windowWidth * 0.87,
                height: windowHeight * 0.08,
            }}
            onPress={confirmCode}
            disabled={code.includes('') || timer <= 0}
            />
            <Button
            title="Send Again"
            filledColor={Color.colorWhite}
            style={{
                marginTop: windowHeight * 0.001,
                marginBottom: windowHeight * 0.05,
                width: windowWidth * 0.87,
                height: windowHeight * 0.08,
            }}
            onPress={handleSendAgainPress}
            />
                </View>
            </>
        )}
        </View>
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
        fontSize: FontSize.size_6xl,
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
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Color.colorWhite,
        marginHorizontal: windowWidth * 0.05,
        flexDirection: 'column',
        alignItems: 'center',
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
    codeInputContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    codeInput: {
        width: 70,
        height: 70,
        borderWidth: 1,
        borderColor: Color.colorGray,
        backgroundColor: Color.colorGainsboro,
        borderRadius: Border.br_3xs,
        marginHorizontal: 5,
        textAlign: 'center',
        fontSize: FontSize.size_5xl,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        color: Color.colorBlue,
    },
    timerContainer: {
        marginBottom: 10,
        flexDirection: 'row'
    },
});

