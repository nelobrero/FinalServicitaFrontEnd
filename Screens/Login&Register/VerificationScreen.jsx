import React, { useState, useEffect, useRef } from "react";
import { Text, StyleSheet, View, TextInput, Alert, Dimensions, Pressable, Image, SafeAreaView, ScrollView} from "react-native";
import { Color, FontFamily, FontSize, Border } from "../../GlobalStyles";
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import Button from "../../components/Button";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


function VerificationScreen({ navigation, route, props }) {
    
    const [timer, setTimer] = useState(300);
    const [code, setCode] = useState(['', '', '', '']);
    const inputRefs = useRef([]);


    const { email, userId } = route?.params;
    
    const [finalUserId, setUserId] = useState(userId);
    const [finalBirthDate, setBirthDate] = useState(new Date());
    const [storeData, setStoreData] = useState({});
    
    useEffect(() => {
        
        fetchTempData();
        fetchServerTime();
        
        const interval = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer <= 0) {
                    return prevTimer;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [finalUserId, timer]);



    const fetchTempData = async () => {
        try {
            await axios.post(`http://192.168.1.14:5000/user/getTempDetails`, {userId: finalUserId}).then((res) => {
                console.log(res.data);
                setStoreData(res.data);
                setBirthDate(res.data.birthDate);
            })
          } catch (error) {
            console.error('Error getting temporary user data:', error);
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
            const response = await axios.get(`http://192.168.1.14:5000/email_verification_otp/getRemainingCurrentTime/${finalUserId}`);
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

    const saveDetails = async () => {
        try{
            if (storeData.role === 'Seeker') {
                await firestore().collection('seekers').doc(finalUserId).set({
                    name: storeData.name,
                    address: storeData.address,
                    birthDate: firestore.Timestamp.fromDate(new Date(finalBirthDate)),
                })
            } else if (storeData.role === 'Provider') {
                await firestore().collection('providers').doc(finalUserId).set({
                    name: storeData.name,
                    address: storeData.address,
                    birthDate: firestore.Timestamp.fromDate(new Date(finalBirthDate)),
                    service: storeData.service,
                })
            }
            console.log('User details saved to Firestore!');
        } catch (error) {
            console.error('Error saving or deleting details in Firestore:', error);
            
        }
    }

    const handleVerifyPress = () => {
        if (timer <= 0) {
            Alert.alert('Error', 'Verification code has expired. Please request a new one.', [{ text: 'OK' }]);
            return;
        }
        const userData = {
            userId: finalUserId,
            otp: code.join(''),
        }
        
          axios.post("http://192.168.1.14:5000/email_verification_otp/verifyOTP", userData).then((res) => {
          console.log(res.data);
          if (res.data.status === 'SUCCESS') {
            saveDetails();
            Alert.alert('Success', 'Your account has been verified successfully. Please login.', [{ text: 'OK', onPress: () => navigation.navigate('Login') }]);
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
    };
    
    const handleSendAgainPress = () => {
        setTimer(1800);
        const userData = {
            userId: finalUserId,
            email: email,
          }
        axios.post("http://192.168.1.14:5000/email_verification_otp/resendOTPVerification", userData).then((res) => {
          console.log(res.data);
          if (res.data.status === 'PENDING') {
            Alert.alert('Resent', 'OTP has been resent. Please check your email.', [{ text: 'OK'}]);
          } else {
            Alert.alert('Error', 'An error occurred while processing your request. Please try again later.', [{ text: 'OK' }]);
          }}).catch((err) => {
            console.log(err);
          });
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
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"always"}>
        <View style={styles.container}>
            <Pressable onPress={() => navigation.goBack()} style={styles.arrowContainer}>
                    <Image
                    style={styles.userroleChild}
                    contentFit="cover"
                    source={require("./../../assets/arrow-1.png")}
                    />
                </Pressable>
                <View style={{ marginVertical: windowHeight * 0.04 }}>
                    <Text style={{
                        fontSize: windowWidth * 0.12,
                        fontWeight: 'bold',
                        color: Color.colorBlue,
                        bottom: windowHeight * 0.03,
                    }}>
                        Please
                        {"\n"}
                        Verify...
                    </Text>
                </View>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={[styles.text, styles.title]}>We’ve sent the code to:</Text>
                <Text style={[styles.text, styles.email]}>{email}</Text>
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
            onPress={handleVerifyPress}
            disabled={timer <= 0}
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
            
           
        </View>
        </ScrollView>
        </SafeAreaView>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Color.colorWhite,
        marginHorizontal: windowWidth * 0.05,
        flexDirection: 'column',
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
    title: {
        marginBottom: 10,
        fontWeight: 300,
        bottom: windowHeight * 0.02,
    },
    email: {
        bottom: windowHeight * 0.03,
        fontWeight: 'bold',
        marginBottom: 10,
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
    }
});

export default VerificationScreen;
