import React, { useState, useEffect, useRef } from "react";
import { Text, StyleSheet, View, TextInput, Alert, Dimensions, Pressable, Image, SafeAreaView, ScrollView, Modal, ActivityIndicator} from "react-native";
import { Color, FontFamily, FontSize, Border, errorText } from "../../GlobalStyles";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Error from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import Button from "../../components/Button";
import auth from '@react-native-firebase/auth';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { set } from "date-fns";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function VerificationScreen({ navigation, route, props }) {

    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);
    const [confirm, setConfirm] = useState(null);

    const { email } = route?.params;
    const [finalBirthDate, setBirthDate] = useState(new Date());
    const [storeData, setStoreData] = useState({});
    const [finalMobile, setFinalMobile] = useState("");
    const [mobile, setMobile] = useState("+63");
    const [mobileVerify, setMobileVerify] = useState(false);
    const [equal, setEqual] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const DEFAULT_IMAGE_URL_PROVIDER = "https://firebasestorage.googleapis.com/v0/b/servicita-signin-fa66f.appspot.com/o/DEPOLTIMEJ.jpg?alt=media&token=720651f9-4b46-4b9d-8131-ec4d8951a81b";
    const DEFAULT_IMAGE_URL_SEEKER = "https://firebasestorage.googleapis.com/v0/b/servicita-signin-fa66f.appspot.com/o/DPULTO.jpg?alt=media&token=7c029ca7-8b0c-4182-8d35-951b55281a15";
    const DEFAULT_IMAGE_SERVICE_PROFILE = "https://firebasestorage.googleapis.com/v0/b/servicita-signin-fa66f.appspot.com/o/COVERPAGE.jpg?alt=media&token=ff9d0b7b-3bc9-4d63-8aeb-2e4149583941";
                                
    useEffect(() => {
        fetchTempData();
    }, []);

    useEffect(() => {
        setEqual(checkIfMobileAndFinalMobileAreEqual());
    }, [mobile]);


    const checkIfMobileAndFinalMobileAreEqual = () => {
        if (mobile === finalMobile) {
            return true;
        } else {
            return false;
        }
    }

    const signInWithPhoneNumber = async () => {
        try {
            const confirmation = await auth().signInWithPhoneNumber(finalMobile);
            setConfirm(confirmation);
            Alert.alert("Success", "Code sent successfully.", [{ text: "OK"}]);
        } catch (error) {
            console.log(error);
        }
    }

    const confirmCode = async () => {
        const userData = {
            email: email,
            mobile: finalMobile,
            password: storeData.data.password,
            role: storeData.data.role,
            profileImage: storeData.data.role === 'Provider' ? DEFAULT_IMAGE_URL_PROVIDER : DEFAULT_IMAGE_URL_SEEKER,
        }
        try {
            await confirm.confirm(code.join(''));
            await axios.post(`http://192.168.1.7:5000/user/signup`, userData).then(async (res) => {
                if (res.status === 200) {
                    console.log("User created successfully");
                    await saveDetails(res.data.data._id);
                }
            })
            await axios.post("http://192.168.1.7:5000/user/login", {email: email, password: storeData.data.password}).then(async (res) => {
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
                navigation.navigate('App', { email: email });
            }
        })

        } catch (error) {
            if (error.code === 'auth/invalid-verification-code') {
                Alert.alert("Error", "Invalid code entered.", [{ text: "OK"}]);
                console.error('Invalid code:', error.message);
            } else if (error.code === 'auth/code-expired') {
                Alert.alert("Error", "The verification code has expired. Please request a new one.", [{ text: "OK"}]);
            } else {
                Alert.alert("Error", "An error occurred while verifying the code.", [{ text: "OK"}]);
                console.error('Error:', error.message);
            }
        }
    };

    const fetchTempData = async () => {
        try {
            await axios.post(`http://192.168.1.7:5000/user/getTempDetails`, {email : email}).then((res) => {
                setStoreData(res.data);
                setBirthDate(res.data.data.birthDate);
                setFinalMobile(res.data.data.mobile);
                setIsLoading(false);
            })
          } catch (error) {
            console.error('Error getting temporary user data:', error);
          }
    };

    const saveDetails = async (userId) => {
        setIsLoading(true);
        try {
            const userData = {
                name: {
                    firstName: storeData.data.name.firstName,
                    lastName: storeData.data.name.lastName
                },
                address: {
                    streetAddress1: storeData.data.address.streetAddress1,
                    streetAddress2: storeData.data.address.streetAddress2,
                    cityMunicipality: storeData.data.address.cityMunicipality,
                    barangay: storeData.data.address.barangay
                },
                birthDate: firestore.Timestamp.fromDate(new Date(finalBirthDate)),
                reportsReceived: 0,
                violationRecord: 0,
                expoPushTokens: [await AsyncStorage.getItem('expoPushToken')],
            };
            
            if (storeData.data.role === 'Seeker') {
                userData.servicesAvailed = 0;
            }

            if (storeData.data.role === 'Provider') {
                userData.rating = 0;
                userData.completedBookings = 0;
                userData.ratingCount = 0;
                userData.ratingNumberCount = {
                    one: 0,
                    two: 0,
                    three: 0,
                    four: 0,
                    five: 0
                };
                const serviceIds = storeData.data.services.map(services => services.serviceId);
                userData.services = serviceIds;
                for (const service of storeData.data.services) {
                    await firestore().collection('services').doc(service.serviceId).set({
                        providerId: userId,
                        coverImage: DEFAULT_IMAGE_SERVICE_PROFILE,
                        serviceType: service.serviceType,
                        name: service.name,
                        description: service.description,
                        price: service.price,
                        availability: service.availability,
                        rating: 0,
                        status: 'Pending',
                        ratingCount: 0,
                        ratingNumberCount: {
                            one: 0,
                            two: 0,
                            three: 0,
                            four: 0,
                            five: 0
                        },
                        dateSubmitted: firestore.Timestamp.now(),
                        address: {
                            cityMunicipality: storeData.data.address.cityMunicipality,
                            barangay: storeData.data.address.barangay
                        },
                        bookings: []
                    });
                }
            }
    
            if (storeData.data.role === 'Seeker') {
                await firestore().collection('seekers').doc(userId).set(userData);
            } else if (storeData.data.role === 'Provider') {
                await firestore().collection('providers').doc(userId).set(userData);
            }

            console.log('User details saved to Firestore!');
        } catch (error) {
            console.error('Error saving or deleting details in Firestore:', error);
            
        } finally {
            setIsLoading(false);
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
    
    const hideModal = () => {
        setModalVisible(false);
        setMobile("+63");
    }

    const changeNumber = () => {
        
        setModalVisible(true);
    }

    const verifyChangedNumber = async () => {
        try {
            await axios.post(`http://192.168.1.7:5000/user/getUserDetailsByMobile`, {mobile : mobile}).then(async (res) => {
                if (res.status === 200) {
                    setModalVisible(false);
                    setFinalMobile(mobile);
                    setMobile("+63");
                    setConfirm(null);
                } else {
                        Alert.alert("Error", "The mobile number you entered is already in use.", [{ text: "OK"}]);
                    }
                })
            await axios.patch(`http://192.168.1.7:5000/user/updateTempNumber`, {email : email, mobile : mobile}).then((res) => {
                    if (res.status === 200) {
                        Alert.alert("Success", "Mobile number changed successfully.", [{ text: "OK"}]);
                    }
                }
            )     
        } catch (error) {
            console.error('Error verifying changed number:', error);
        }
    }

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Color.colorBlue} />
            </View>
        );
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: Color.colorWhite}}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"always"}>
            <View style={{ flexDirection: 'column', justifyContent: 'flex-start', marginHorizontal: windowWidth * 0.05, marginTop: windowHeight * 0.07 }}>
                            <Pressable onPress={() => navigation.goBack()} style={styles.arrowContainer}>
                                            <Image
                                            style={styles.userroleChild}
                                            contentFit="cover"
                                            source={require("./../../assets/arrow-1.png")}
                                            />
                            </Pressable>
                            <View style={{ marginVertical: windowHeight * 0.02 }}>
                    <Text style={{
                        fontSize: windowWidth * 0.12,
                        fontWeight: 'bold',
                        color: Color.colorBlue,
                    }}>
                        Verify Now...
                    </Text>
                </View>
        </View>
       
        <View style={styles.container}>

                
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            { !confirm ? (
            <>  
                <Text style={[styles.passwordRecovery, styles.passwordFlexBox]}>
                    We’re going to send the code to: 
                    {"\n"}
                    {finalMobile}
                    {"\n"}
                    <Pressable onPress={() => setModalVisible(true)} style={styles.changeMobileButton}>
                    <Text style={styles.changeMobileButtonText}>Change?</Text>
                    </Pressable>
                </Text>
                
            </>    
            ) : (
            <>
                <Text style={[styles.passwordRecovery, styles.passwordFlexBox]}>
                    We’ve sent the code to:
                    {"\n"}
                    {finalMobile}
                    {"\n"} 
                    <Pressable onPress={changeNumber} style={styles.changeMobileButton}>
                    <Text style={styles.changeMobileButtonText}>Change?</Text>
                </Pressable>
                    </Text>
                
            </>
            )}
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
                            editable={confirm ? true : false} 
                        />
                    ))}
                </View>
            { !confirm ? (
                <>
                <Button
            title="Send Code"
            filled
            Color={Color.colorWhite}
            style={styles.buttones}
            onPress={signInWithPhoneNumber}
            />
                </>
            ) : (
                <>
                 <Button
            title="Verify"
            filled
            Color={Color.colorWhite}
            style={styles.button}
            onPress={confirmCode}
            disabled={code.includes('')}
            />
            <Button
            title="Send Again"
            filledColor={Color.colorWhite}
            style={styles.buttons}
            onPress={signInWithPhoneNumber}
            />
                </>
            )}
            
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
              <View flexDirection='row' style={{ borderBottomColor: Color.colorBlue, borderBottomWidth: 1, alignItems: 'center', justifyContent: 'space-between', marginVertical: windowHeight * 0.01 }}>
                            <Text style={{
                                    fontSize: windowWidth * 0.06,
                                    fontWeight: '400',
                                    marginVertical: windowHeight * 0.01,
                                    color: Color.colorBlue,
                                    marginLeft: windowWidth * 0.05 
                                }}>Verify Code</Text>
                            <AntDesignIcon style = {{ marginRight: windowWidth * 0.05 }} name="close" size= {windowWidth * 0.06} color={Color.colorBlue} onPress={() => hideModal()} />
                            </View>
              <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <View style={{ marginBottom: windowHeight * 0.04, justifyContent: 'center', marginHorizontal: windowWidth * 0.05 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: '400',
                        marginVertical: windowHeight * 0.01,
                        color: Color.colorBlue

                    }}>Mobile Number</Text>

                    <View style={{
                        width: '100%',
                        height: windowHeight * 0.06,
                        borderColor: mobile === null || mobile.length <= 3 ? Color.colorBlue1 : mobileVerify && !equal  ? Color.colorGreen : Color.colorRed,
                        borderWidth: 1,
                        borderRadius: windowHeight * 0.015,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: windowWidth * 0.05,
                        flexDirection: 'row'
                        
                    }}>
                        <FontAwesome name="phone" color={mobile === null || mobile.length <= 3 ? Color.colorBlue1 : mobileVerify && !equal ? Color.colorGreen : Color.colorRed} style={{ marginRight: 7, fontSize: 24}} />
                        <TextInput
                        placeholder='+63'
                        placeholderTextColor={Color.colorBlue1}
                        keyboardType='numeric'
                        style={{
                            width: "12%",
                            borderRightWidth: 1,
                            borderColor: mobile === null || mobile.length <= 3 ? Color.colorBlue1 : mobileVerify && !equal ? Color.colorGreen : Color.colorRed,
                            height: "100%",
                            right: windowWidth * 0.02,
                        }}
                        color={mobile === null || mobile.length <= 3 ? Color.colorBlue1 : mobileVerify && !equal ? Color.colorGreen : Color.colorRed}
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
                                left: windowWidth * 0.005,
                            }}
                            onChangeText={(text) => {
                                const formattedMobile = "+63" + text;
                                setMobile(formattedMobile);
                                setMobileVerify(text.length > 1 && /^(\+63[89])[0-9]{9}$/.test(formattedMobile));
                            }}
                        />
                        {mobile.length < 4 ? null : mobileVerify && !equal ? (
                            <Feather name="check-circle" color="green" size={24} style={{ position: "absolute", right: 12 }}/>
                        ) : (
                            <Error name="error" color="red" size={24} style={{ position: "absolute", right: 12 }}/>
                        )}
                    </View>
                    {mobile.length < 4 ? null : mobileVerify ? null : (
                        <Text style={errorText}>Please enter a valid Philippine mobile number in the format +63*********.</Text>
                    )}

                {(equal) ? (
                    <Text style={errorText}>You cannot use the same mobile number.</Text>
                ) : null} 
                </View>
                </View>
                <Button
                  title="Change Number"
                  filled
                  Color={Color.colorWhite}
                  onPress={verifyChangedNumber}
                  style={styles.buttonis}
                  disabled={!mobileVerify || equal}
                />
              </View>
            </View>
        </Modal>
            
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
        marginHorizontal: windowWidth * 0.025,
        flexDirection: 'column',
        position: 'absolute',
        top: windowHeight * 0.3
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
        marginVertical: windowHeight * 0.04,
        alignItems: 'center',
    },
    codeInput: {
        width: windowWidth * 0.13,
        height: windowHeight * 0.08,
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
        fontSize: FontSize.size_xl,
        color: Color.colorDarkslategray_100,
        fontFamily: FontFamily.quicksandBold,
        fontWeight: "700",
        alignItems: "center",
        display: "flex",
        textAlign: "center",
        lineHeight: windowHeight * 0.1,
    },
    changeMobileButton: {
        marginTop: windowHeight * 0.09,
        top: windowHeight * 0.02,
    },
    changeMobileButtonText: {
        color: Color.colorBlue,
        textDecorationLine: 'underline',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: 'white', 
        width: '85%',
        maxHeight: '90%',
        borderRadius: 10,
    },
    button: {
        marginBottom: windowHeight * 0.02,
        width: windowWidth * 0.85,
        height: windowHeight * 0.08,
        alignSelf: 'center',
        marginTop: windowHeight * 0.08, 
    },
    buttons: {
        marginVertical: windowHeight * 0.02,
        width: windowWidth * 0.85,
        height: windowHeight * 0.08,
        alignSelf: 'center',    
    },
    buttones: {
        top: windowHeight * 0.23,
        marginVertical: windowHeight * 0.02,
        width: windowWidth * 0.85,
        height: windowHeight * 0.08,
        alignSelf: 'center',
    },
    buttonis:
    {
        width: windowWidth * 0.7,
        height: windowHeight * 0.08,
        alignSelf: 'center',
        marginVertical: windowHeight * 0.02,
    },

});

