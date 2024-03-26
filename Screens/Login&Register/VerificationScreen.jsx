import React, { useState, useEffect, useRef } from "react";
import { Text, StyleSheet, View, TextInput, Alert, Dimensions, Pressable, Image, SafeAreaView, ScrollView, Modal} from "react-native";
import { Color, FontFamily, FontSize, Border, errorText } from "../../GlobalStyles";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Error from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import Button from "../../components/Button";
import auth from '@react-native-firebase/auth';

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
    const [modalVisible, setModalVisible] = useState(false);
    
    useEffect(() => {
        fetchTempData();
    }, []);

    const signInWithPhoneNumber = async () => {
        try {
            const confirmation = await auth().signInWithPhoneNumber(finalMobile);
            setConfirm(confirmation);
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
        }
        try {
            await confirm.confirm(code.join(''));
            await axios.post(`http://192.168.1.14:5000/user/signup`, userData).then(async (res) => {
                if (res.status === 200) {
                    console.log("User created successfully");
                    await saveDetails(res.data.data._id);
                    Alert.alert("Success", "You have successfully verified your account. Please login again.", [{ text: "OK", onPress: () => navigation.navigate("Login")}]);
                }
            })
        } catch (error) {
            Alert.alert("Error", "An error occurred while verifying the code.", [{ text: "OK"}]);
            console.error('Invalid code:', error.message);
        }
    };

    const fetchTempData = async () => {
        try {
            await axios.post(`http://192.168.1.14:5000/user/getTempDetails`, {email : email}).then((res) => {
                setStoreData(res.data);
                setBirthDate(res.data.data.birthDate);
                setFinalMobile(res.data.data.mobile);
            })
          } catch (error) {
            console.error('Error getting temporary user data:', error);
          }
    };

    const saveDetails = async (userId) => {
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
                birthDate: firestore.Timestamp.fromDate(new Date(finalBirthDate))
            };
    
            if (storeData.data.role === 'Provider') {
                const serviceIds = storeData.data.service.map(service => service.serviceId);
                userData.serviceIds = serviceIds;
                for (const service of storeData.data.service) {
                    await firestore().collection('services').doc(service.serviceId).set({
                        type: service.type,
                        name: service.name,
                        description: service.description,
                        price: service.price,
                        availability: service.availability,
                        verified: false
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
    }

    const changeNumber = () => {
        setConfirm(null);
        setModalVisible(true);
    }

    const verifyChangedNumber = async () => {
        try {
            await axios.post(`http://192.168.1.14:5000/user/getUserDetailsByMobile`, {mobile : mobile}).then(async (res) => {
                if (res.status === 200) {
                    setModalVisible(false);
                    setFinalMobile(mobile);
                    setMobile("+63");
                } else {
                        Alert.alert("Error", "The mobile number you entered is already in use.", [{ text: "OK"}]);
                    }
                })
            await axios.patch(`http://192.168.1.14:5000/user/updateTempNumber`, {email : email, mobile : mobile}).then((res) => {
                    if (res.status === 200) {
                        Alert.alert("Success", "Mobile number changed successfully.", [{ text: "OK"}]);
                    }
                }
            )     
        } catch (error) {
            console.error('Error verifying changed number:', error);
        }
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
                    <Pressable onPress={() => setModalVisible(true)} style={styles.changeMobileButton}>
                    <Text style={styles.changeMobileButtonText}>  Change?</Text>
                    </Pressable>
                </Text>
                
            </>    
            ) : (
            <>
                <Text style={[styles.passwordRecovery, styles.passwordFlexBox]}>
                    We’ve sent the code to:
                    {"\n"}
                    {finalMobile} 
                    <Pressable onPress={changeNumber} style={styles.changeMobileButton}>
                    <Text style={styles.changeMobileButtonText}>  Change?</Text>
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
                                        inputRefs.current[index - 1].focus();
                                    }
                                } else if (!isNaN(nativeEvent.key) && code[index] && index !== 3) {
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
            style={{
                marginTop: windowHeight * 0.1,
                marginBottom: windowHeight * 0.05,
                width: windowWidth * 0.87,
                height: windowHeight * 0.08,
            }}
            onPress={signInWithPhoneNumber}
            />
                </>
            ) : (
                <>
                 <Button
            title="Verify"
            filled
            Color={Color.colorWhite}
            style={{
                marginTop: windowHeight * 0.1,
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
                marginTop: windowHeight * 0.001,
                marginBottom: windowHeight * 0.05,
                width: windowWidth * 0.87,
                height: windowHeight * 0.08,
            }}
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
                <FontAwesome name="close" size={24} color={Color.colorBlue} style={{alignSelf: 'flex-start', marginLeft: -windowWidth * 0.05, marginBottom: windowHeight * 0.001, bottom: windowHeight * 0.02}} onPress={() => hideModal()} />
              <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <View style={{ marginBottom: windowHeight * 0.04, justifyContent: 'center' }}>
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
                </View>
                <Button
                  title="Change Number"
                  filled
                  Color={Color.colorWhite}
                  onPress={verifyChangedNumber}
                  style={styles.button}
                  disabled={!mobileVerify}
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
        marginHorizontal: windowWidth * 0.05,
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
        marginBottom: windowHeight * 0.09,
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
    button: {
        width: windowWidth * 0.7,
        height: windowHeight * 0.08,
    }
});

