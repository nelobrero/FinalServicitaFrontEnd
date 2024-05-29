import React, { useState, useRef } from "react";
import { Text, StyleSheet, View, TextInput, Alert, Dimensions, Pressable, Image, SafeAreaView } from "react-native";
import { Color, FontFamily, FontSize, Border, errorText } from "./../../GlobalStyles";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import Error from '@expo/vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import axios from "axios";
import Button from "../../components/Button";
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import * as Notifications from 'expo-notifications';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function MobileLogin({navigation}) {
    const [mobile, setMobile] = useState('+63');
    const [mobileVerify, setMobileVerify] = useState(false);
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);
    const [confirm, setConfirm] = useState(null);


    const signInWithPhoneNumber = async () => {
        try {
            const mobileExists = await checkIfMobileExists(mobile);
            if(mobileExists) {
                const confirmation = await auth().signInWithPhoneNumber(mobile);
                setConfirm(confirmation);
            } else {
                Alert.alert("Mobile Number not found", "The mobile number you entered is not registered.");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const confirmCode = async () => {
        try {
            await confirm.confirm(code.join(''));
            await axios.post("http://192.168.1.7:5000/user/loginUsingMobile", { mobile: mobile }).then(async (res) => {
        console.log(res.data)
        if (res.data.status === 'SUCCESS') {
            Alert.alert('Success', 'You have successfully logged in.', [{ text: 'OK' }]);
            await AsyncStorage.setItem('token', res.data.data);
            await AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
            await AsyncStorage.setItem('userId', res.data.userId);
            const expoToken = await Notifications.getExpoPushTokenAsync();         
                                            let userDoc = null;                                            
                                            if (res.data.role === "Seeker") {
                                                userDoc = await firestore().collection('seekers').doc(res.data.userId).get();
                                            } else {
                                                userDoc = await firestore().collection('providers').doc(res.data.userId).get();
                                            }
                                            if (userDoc.exists) {
                                                const user = userDoc.data();                                             
                                                if (user.expoPushTokens.includes(expoToken.data)) {
                                                    console.log('ExpoToken already exists');
                                                } else {
                                                    user.expoPushTokens.push(expoToken.data);
                                                    if (res.data.role === "Seeker") {
                                                        await firestore().collection('seekers').doc(res.data.userId).update({ expoTokens: user.expoPushTokens });
                                                    } else {
                                                        await firestore().collection('providers').doc(res.data.userId).update({ expoTokens: user.expoPushTokens });
                                                    }
                                                    console.log('ExpoToken added');
                                                }
                                            }
            navigation.navigate('Tab');
        }
    }). catch((error) => {
        console.log(error);
    })
           
        } catch (error) {
            if (error.code === 'auth/invalid-verification-code'){
                Alert.alert("Error", "Invalid verification code. Please try again.", [{ text: "OK"}]);
            } else if (error.code === 'auth/code-expired') {
                Alert.alert("Error", "The verification code has expired. Please request a new one.", [{ text: "OK"}]);
            } else  {
                Alert.alert("Error", "An error occurred while verifying the code. Please try again or login using other options", [{ text: "OK"}]);
            }
        }
    };

    const checkIfMobileExists = async (mobile) => {
        try {
            const response = await axios.post("http://192.168.1.7:5000/user/getActualUserDetailsByMobile", { mobile });
            
            if(response.data.data) {
                return true;
            } else {
                return false;
            }
            
        } catch (error) {
            console.log(error);
            return false;
        }
    };

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

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: Color.colorWhite}}>
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
                <Text style={[styles.passwordRecovery, styles.passwordFlexBox]}>
                                Mobile Login
                            </Text>
                            <Text style={[styles.enterYourEmail, styles.passwordFlexBox]}>
                                Enter your number to login
                            </Text>
                
                {!confirm ? (
                    <>
                    <View style={{marginTop: windowHeight * 0.05, width: windowWidth * 0.90 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: '400',
                        marginVertical: windowHeight * 0.01,
                        color: Color.colorBlue

                    }}>Mobile Number</Text>

                    <View style={{
                        width: '100%',
                        height: windowHeight * 0.06,
                        borderColor: mobile === null || mobile.length <= 3 ? Color.colorBlue1 : mobileVerify ? Color.colorGreen : Color.colorRed,
                        borderWidth: 1,
                        borderRadius: windowHeight * 0.015,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingLeft: windowWidth * 0.05,
                        paddingHorizontal: windowWidth * 0.13,
                        flexDirection: 'row'
                    }}>
                        <FontAwesome name="phone" color={mobile === null || mobile.length <= 3 ? Color.colorBlue1 : mobileVerify ? Color.colorGreen : Color.colorRed} style={{ marginRight: 5, fontSize: 24}} />
                        <TextInput
                        placeholder='+63'
                        placeholderTextColor={Color.colorBlue1}
                        keyboardType='numeric'
                        style={{
                            width: "12%",
                            borderRightWidth: 1,
                            borderColor: mobile === null || mobile.length <= 3 ? Color.colorBlue1 : mobileVerify ? Color.colorGreen : Color.colorRed,
                            height: "100%",
                        }}
                        color={mobile === null || mobile.length <= 3 ? Color.colorBlue1 : mobileVerify ? Color.colorGreen : Color.colorRed}
                        defaultValue='+63'
                        editable={false}
                        />
                        <TextInput
                            placeholder='Enter your phone number'
                            placeholderTextColor={Color.colorBlue}
                            keyboardType='numeric'
                            style={{
                                width: "80%",
                                marginRight: 10,
                                left: 10
                            }}
                            onChangeText={(text) => {
                                const formattedMobile = "+63" + text;
                                setMobile(formattedMobile);
                                setMobileVerify(text.length > 1 && /^(\+63[89])[0-9]{9}$/.test(formattedMobile));
                            }}
                        />
                        {mobile.length < 4 ? null : mobileVerify ? (
                            <Feather name="check-circle" color="green" size={24} style={{ position: "absolute", right: 12 }}/>
                        ) : (
                            <Error name="error" color="red" size={24} style={{ position: "absolute", right: 12 }}/>
                        )}
                    </View>
                    {mobile.length < 4 ? null : mobileVerify ? null : (
                        <Text style={errorText}>Please enter a valid Philippine mobile number in the format +63*********.</Text>
                    )}
                </View>
                <View style={{ marginBottom: windowHeight * 0.01, alignItems: 'center' }}>
                <Button
                    title="Send Code"
                    filled
                    Color={Color.colorWhite}
                    style={{
                        marginTop: windowHeight * 0.07,
                        marginBottom: windowHeight * 0.05,
                        width: windowWidth * 0.87,
                        height: windowHeight * 0.08,
                        top: windowHeight * 0.1,
                    }}
                    disabled={!mobileVerify}
                    onPress={signInWithPhoneNumber}
                />
                </View>
                    </>
                ) : (
                    <>
                    <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <View style = {{ marginBottom: windowHeight * 0.03 }}>
                <Text style={[styles.passwordRecovery, styles.passwordFlexBox]}>We’ve sent the code to:</Text>
                <Text style={[styles.enterYourEmail, styles.passwordFlexBox]}>{mobile}</Text>
                </View>
                
                    <View style={styles.codeInputContainer}>
                        {[0, 1, 2, 3, 4, 5].map((index) => (
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
                                            updateCode(index, '');
                                            inputRefs.current[index - 1].focus();
                                        }
                                    } else if (!isNaN(nativeEvent.key) && code[index] && index !== 5) {
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
            disabled={code.includes('')}
            />
            <Button
            title="Send Again"
            filledColor={Color.colorWhite}
            style={{
                marginTop: windowHeight * 0.07,
                marginBottom: windowHeight * 0.05,
                width: windowWidth * 0.87,
                height: windowHeight * 0.08,
            }}
            onPress={signInWithPhoneNumber}
            />
                </View>
                    </>
                   
                )}


                </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Color.colorWhite,
        marginHorizontal: windowWidth * 0.05,
        flexDirection: 'column',
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
    text: {
        fontFamily: FontFamily.quicksandLight,
        fontSize: FontSize.size_mini,
        color: Color.colorBlack,
    },
    timerContainer: {
        marginBottom: 10,
        flexDirection: 'row'
    },
    codeInputContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    codeInput: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: Color.colorGray,
        backgroundColor: Color.colorGainsboro,
        borderRadius: Border.br_3xs,
        marginHorizontal: 5,
        textAlign: 'center',
        fontSize: FontSize.size_5xl,
        paddingHorizontal: 10,
        color: Color.colorBlue,
    },
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
});