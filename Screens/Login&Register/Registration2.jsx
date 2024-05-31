import { View, Text, TextInput, TouchableOpacity, Image, Pressable, StyleSheet, Dimensions, ScrollView, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { Color, errorText } from '../../GlobalStyles';
import { Ionicons } from "@expo/vector-icons";
import Checkbox  from "expo-checkbox"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import Error from '@expo/vector-icons/MaterialIcons';
import Addition from '@expo/vector-icons/MaterialCommunityIcons';
import Button from '../../components/Button';
import { AccessToken, GraphRequest, GraphRequestManager, LoginManager} from 'react-native-fbsdk-next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function RegisterPage2 ({navigation, route, props}) {
    const [mobile, setMobile] = useState('+63');
    const [mobileVerify, setMobileVerify] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordVerify, setPasswordVerify] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordVerify, setConfirmPasswordVerify] = useState(false);
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [birthday, setBirthday] = useState('');
    

    const { firstName, lastName, email, role, streetAddress1, streetAddress2, city, barangay, birthDate } = route.params;
    const [roleText, setRoleText] = useState(role === 'Seeker' ? 'Seeking' : 'Servicing');

    useEffect(() => {
        convertDate(birthDate);
    }, [birthDate]);

    useEffect(() => {
        setConfirmPasswordVerify(confirmPassword === password);
    }, [confirmPassword, password]);

    const validateFields = () => {
        return mobileVerify  && passwordVerify && confirmPasswordVerify && isChecked;
    }
    
    const convertDate = (date) => {
        try {
            const dateParts = date.split('/');
            const month = parseInt(dateParts[0], 10);
            const day = parseInt(dateParts[1], 10);
            const year = parseInt(dateParts[2], 10);
            const birthdayDate = new Date(year, month - 1, day)
            setBirthday(birthdayDate);
        } catch (error) {
            console.error('Error converting date:', error);
        }
    }

    const onFacebookButtonPress = async () => {
        try {
          const loginResult = await LoginManager.logInWithPermissions(['public_profile', 'email']);
          
          if (loginResult.isCancelled) {
            console.log('Facebook login canceled');
          } else {
            const accessTokenData = await AccessToken.getCurrentAccessToken();
            const { accessToken } = accessTokenData;
            console.log(accessToken);
  
            const infoRequest = new GraphRequest('/me?fields=email,first_name,last_name', null, (error, result) => {
              if (error) {
                console.error('Error fetching user data from Facebook:', error);
              } else {
                console.log('Facebook user data:', result);
                const userData = {
                  email: result.email,
                  userId: result.id,
                  firstName: result.first_name,
                  lastName: result.last_name, 
                };
                checkIfEmailExists(userData.email)
                  .then((emailExists) => {
                    if (emailExists) {
                        if (emailExists) {
                            Alert.alert('Error', 'An account with this email already exists. Please login again using Facebook', [{ text: 'OK' , onPress: () => navigation.navigate('Login') }]);
                        } else {
                            navigation.navigate('MissingInfo', { email: userData.email, firstName: userData.firstName, lastName: userData.lastName, userId: userData.userId, role: role });
                        }
                    }
                  })
                  .catch((error) => {
                    console.error('Error checking if email exists:', error);
                  })
                  .finally(() => {
                    FacebookLogOut();
                    console.log('Facebook has been logged out');
                  });
              }
            });
      
            new GraphRequestManager().addRequest(infoRequest).start();
          }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while trying to sign in with Facebook. Please try again.', [{ text: 'OK' }]);
            console.error('Error during Facebook login:', error);
        }
    };

    const GoogleSignIn = async () => {
        try {

          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          const userData = {
            userId: userInfo.user.id,
            firstName: userInfo.user.givenName,
            lastName: userInfo.user.familyName,
            email: userInfo.user.email,
          };
          const emailExists = await checkIfEmailExists(userData.email);
          if (emailExists) {
            GoogleLogOut();
            Alert.alert('Error', 'An account with this email already exists. Please login again using Google.', [{ text: 'OK' , onPress: () => navigation.navigate('Login') }]);
          } else {
            GoogleLogOut();
            navigation.navigate('MissingInfo', { email: userData.email, firstName: userData.firstName, lastName: userData.lastName, userId: userData.userId, role: role });
          }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while trying to sign in with Google. Please try again.', [{ text: 'OK' }]);
            console.log(error)
        }
    }
      
    const FacebookLogOut = () => {
        try {
          LoginManager.logOut();
        } catch (error) {
          console.log(error);
        }
    }

    const GoogleLogOut = () => {
        try {
            GoogleSignin.revokeAccess();
            GoogleSignin.signOut();
        } catch (error) {
          console.log(error);
        }
    }
    
    const checkIfEmailExists = async (email) => {
        try {
            const userData = {
                email: email,
            }
            const res = await axios.post("http://192.168.1.9:5000/user/getUserDetailsByEmail", userData);
            if (res.data.status === 'SUCCESS') {
                return true;
            }
          } catch (error) {
            if (error.response.data.message === "User not found!") {
                return false;
            }
          }
    }

    const saveTempDetails = async () => {
        try{
            const userData = { 
                email,
                mobile,
                password,
                role,
                name: {
                    firstName: firstName,
                    lastName: lastName
                },
                address: {
                    streetAddress1: streetAddress1,
                    streetAddress2: streetAddress2,
                    cityMunicipality: city,
                    barangay: barangay
                },
                birthDate,
            }
            await axios.post("http://192.168.1.9:5000/user/addTempDetails", userData).then(async (res) => {
                const result = res.data;
                const { data, message, status } = result
                if (status === 'SUCCESS') {
                    console.log('Temporary details saved successfully:', data);
                } else {
                    console.error('Error saving temporary details:', message);
                }
            })
        } catch (error) {
            if (error.response.data.message === "Temporary user already exists with the given email.") {
                Alert.alert('Error', 'Email has recently been verified but has not finished the registration process yet.', [{ text: 'OK'}]);
            } else if (error.response.data.message === "Temporary user already exists with the given mobile number.") {
                Alert.alert('Error', 'A user with this mobile number is currently undergoing the registration process.', [{ text: 'OK' }]);
            } else if (error.response.data.message === "User already exists with the given email.") { 
                Alert.alert('Error', 'An account with this email already exists.', [{ text: 'OK' }]);
            } else if (error.response.data.message === "User already exists with the given mobile number.") { 
                Alert.alert('Error', 'An account with this mobile number already exists.', [{ text: 'OK'}]);
            } else {
                Alert.alert('Error', 'An error occurred while trying to sign up. Please try again.', [{ text: 'OK' }]);
                console.error('Error saving temporary details:', error);
            }
        }
    }

    const renderButton = () => {
        if (role === 'Seeker') {
            return (
                <Button
                    title="Sign Up"
                    filled
                    Color={Color.colorWhite}
                    style={{
                        marginTop: windowHeight * 0.02,
                        marginBottom: windowHeight * 0.05,
                    }}
                    onPress={handleSubmit}
                    disabled={!validateFields()}
                />
            );
        } else {
            return (
                <Button
                    title="Next"
                    filled
                    Color={Color.colorWhite}
                    style={{
                        marginTop: windowHeight * 0.02,
                        marginBottom: windowHeight * 0.05,
                    }}
                    onPress={() => navigation.navigate('ProviderPrefer', { firstName: firstName, lastName: lastName, email: email, role: role, streetAddress1: streetAddress1, streetAddress2: streetAddress2, city: city, barangay: barangay, birthDate: birthDate, mobile: mobile, password: password })}
                    disabled={!validateFields()}
                />
            );
        }
    };

    const handleSubmit = async () => {
        try {
            await saveTempDetails();
            Alert.alert('Verification', 'You will be redirected to the mobile verification screen.', [{ text: 'OK', onPress: () => navigation.navigate('VerificationScreen', { email }) }]);
        } catch (error) {
            console.error('Error saving temporary details:', error);
        }
      }

    return (
    <SafeAreaView style={{flex: 1, backgroundColor: Color.colorWhite}}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"always"}>
            <View style={{ flex: 1, marginHorizontal: windowWidth * 0.05, justifyContent: "center", flexDirection: "column"}}>

                <Pressable onPress={() => navigation.goBack()} style={styles.arrowContainer}>
                    <Image
                    style={styles.userroleChild}
                    contentFit="cover"
                    source={require("./../../assets/arrow-1.png")}
                    />
                </Pressable>

                <View style={{ marginVertical: windowHeight * 0.04 }}>
                    <Text style={{
                        fontSize: windowWidth * 0.1,
                        fontWeight: 'bold',
                        marginVertical: windowHeight * 0.02,
                        color: Color.colorBlue
                    }}>
                        Start
                        {"\n"}
                        {roleText}...
                    </Text>
                </View>
        
                <View style={{ marginBottom: windowHeight * 0.01 }}>
                    <Text style={{
                        fontSize: windowWidth * 0.05,
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
          
            <View style={{ marginBottom: windowHeight * 0.01 }}>
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

             <View style={ {marginBottom: windowHeight * 0.01} }>
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

            <View style={{
                flexDirection: 'row',
                marginVertical: 6
            }}>
                <Checkbox
                    style={{marginRight: 8}}
                    value={isChecked}
                    onValueChange={setIsChecked}
                    color={isChecked ? Color.colorPrimary : undefined}
                />

                    <Text>I agree to the terms and conditions</Text>
            </View>

            {renderButton()}

            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: windowHeight * 0.025 }}>
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: Color.colorGrey,
                            marginHorizontal: windowWidth * 0.01
                        }}
                    />
                    <Text style={{ fontSize: windowWidth * 0.035 }}>Or Sign up with</Text>
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: Color.colorGrey,
                            marginHorizontal: windowWidth * 0.01
                        }}
                    />
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}>

                    <TouchableOpacity
                        onPress={onFacebookButtonPress}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            height: windowHeight * 0.08,
                            borderWidth: 0,
                            borderColor: Color.colorWhite,
                            marginRight: windowWidth * 0.02,
                            borderRadius: windowHeight * 0.02
                        }}
                    >
                        <Image
                            source={require("./../../assets/facebook.png")}
                            style={{
                                height: windowHeight * 0.05,
                                width: windowHeight * 0.05,
                                marginRight: -windowWidth * 0.1
                            }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={GoogleSignIn}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            height: windowHeight * 0.08,
                            borderWidth: 1,
                            borderColor: Color.colorWhite,
                            marginRight: windowWidth * 0.02,
                            borderRadius: windowHeight * 0.02
                        }}
                    >
                        <Image
                            source={require("./../../assets/google.png")}
                            style={{
                                height: windowHeight * 0.07,
                                width: windowHeight * 0.07,
                                marginRight: windowWidth * 0.1
                            }}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginVertical: windowHeight * 0.025
                }}>
                    <Text style={{ fontSize: windowWidth * 0.05, color: Color.black }}>Already have an account?</Text>
                    <Pressable
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text style={{
                            fontSize: windowWidth * 0.05,
                            color: Color.colorPrimary,
                            fontWeight: 'bold',
                            marginLeft: windowWidth * 0.015
                        }}>Login</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    arrowContainer: {
        top: windowHeight * 0.03,
        left: windowWidth * 0.01,
        zIndex: 2,
    },
    userroleChild: {
        top: windowHeight * 0.001,
        left: windowWidth * 0.001,
        maxHeight: "100%",
        width: windowWidth * 0.07,
        zIndex: 1,
    }
})
