import React, { useState, useRef, useEffect } from "react";
import { Text, StyleSheet, View, TextInput, Image, Pressable, Dimensions, SafeAreaView, Alert, Modal, ScrollView} from "react-native";
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
    const [code, setCode] = useState(["", "", "", ""]);
    const inputRefs = useRef([]);
    const [timer, setTimer] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (modalVisible !== false) {
            setTimer(300);
            const interval = setInterval(() => {
                setTimer(prevTimer => {
                    if (prevTimer <= 0) {
                        return prevTimer;
                    }
                    return prevTimer - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [modalVisible]);

    const handlePress = async () => {
        try {
            const response = await axios.post("http://192.168.1.7:5000/forgot_password_otp/request", { email: email });
            console.log(response);
            if (response.status === 202) {
                setModalVisible(true);
            } else {
                Alert.alert("An error occurred while processing your request. Please try again later.", [{ text: "OK" }]);
            }

        } catch (error) {
            if (error.response.message === "No verified account with the said email exists!") {
                Alert.alert("No verified account with the said email exists.", [{ text: "OK" }]);
            } else {
                console.log(error);
            }
        }
    };

    const hideModal = () => {
        setModalVisible(false);
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
            const response = await axios.get(`http://192.168.1.7:5000/forgot_password_otp/getRemainingCurrentTime/${email}`);
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
            email: email,
          }
        axios.post("http://192.168.1.7:5000/forgot_password_otp/request", userData).then((res) => {
          console.log(res.data);
          if (res.data.status === 'PENDING') {
            fetchServerTime();
            Alert.alert('Resent', 'OTP has been resent. Please check your email.', [{ text: 'OK'}]);
          } else {
            Alert.alert('Error', 'An error occurred while processing your request. Please try again later.', [{ text: 'OK' }]);
          }}).catch((err) => {
            console.log(err);
          });
    };

    const confirmCode = async () => {
        const userData = {
            email: email,
            otp: code.join(''),
          }
        axios.post("http://192.168.1.7:5000/forgot_password_otp/reset", userData).then((res) => {
            if (res.data.status === 'SUCCESS') {
                setModalVisible(false);
                Alert.alert('Success', 'OTP has been verified successfully. Please change your password.', [{ text: 'OK', onPress: () => navigation.navigate('ResetPassword', { email: email}) }]);
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
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"always"}>
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
            
                <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >


            <View style={styles.centeredView}>
            
              <View style={styles.modalView}>
                <FontAwesome name="close" size={24} color={Color.colorBlue} style={{alignSelf: 'flex-start', marginLeft: -windowWidth * 0.05, marginBottom: windowHeight * 0.001, bottom: windowHeight * 0.02}} onPress={() => hideModal()} />
              <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={[styles.passwordRecoverys, styles.passwordFlexBoxs]}>We’ve sent the code to:</Text>
                <Text style={[styles.enterYourEmails, styles.passwordFlexBoxs]}>{email}</Text>
                <View style={styles.timerContainer}>
                    <Text style={styles.text}>Code expires in: </Text>
                    <Text style={[styles.text, {fontWeight: '800'}]}>{formatTime(timer)}</Text>
                </View>
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
                  onPress={confirmCode}
                  disabled={timer === 0 || code.includes('')}
                  style={styles.button}
                />
                <Button
                  title="Send Again"
                  Color={Color.colorWhite}
                  onPress={handleSendAgainPress}
                  style={styles.button}
                />
              </View>
            </View>
        </Modal>


            
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
            position="absolute"
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
    container: {
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    codeInputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    codeInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        margin: 5,
        width: 50,
        textAlign: 'center',
        color: Color.colorBlue,
        borderColor: Color.colorGray,
        backgroundColor: Color.colorGainsboro,
        borderRadius: Border.br_3xs,
    },
    button: {
        marginTop: windowHeight * 0.02,
        width: windowWidth * 0.5,
        height: windowHeight * 0.08,
    },
    passwordFlexBoxs: {
        marginVertical: windowHeight * 0.001,
    },
    passwordRecoverys: {
        fontSize: windowHeight * 0.025,
        fontWeight: 'bold',
    },
    enterYourEmails: {
        fontSize: windowHeight * 0.018,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: windowHeight * 0.02,
    },
    text: {
        fontSize: windowHeight * 0.018,
    },
   
});

