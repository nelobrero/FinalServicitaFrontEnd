import {  View, Text, TextInput, TouchableOpacity, Image, Pressable, Platform, Dimensions, Alert, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { Color, circleContainer, circleButton, errorText } from "./../../GlobalStyles";
import { Ionicons } from "@expo/vector-icons";
import Button from './../../components/Button';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import Error from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from "expo-linear-gradient";
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk-next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import * as Notifications from "expo-notifications";


export default function LoginPage ({ navigation }) {
    const [email, setEmail] = useState('');
    const [emailVerify, setEmailVerify] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordVerify, setPasswordVerify] = useState(false);
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const { width, height } = Dimensions.get('window');

    const validateFields = () => {
        return emailVerify && passwordVerify;
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
  
            const infoRequest = new GraphRequest('/me?fields=email,first_name,last_name', null, async (error, result) => {
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
                    if (emailExists.exists) {
                        const userEmail = {
                          email: result.email,
                        }
                        FacebookLogOut();
                        if (emailExists.type === "permanent") {
                          axios.get(`http://192.168.1.7:5000/admin/checkSuspensionStatus/${userEmail}`).then((res) => {
                            if (res.data.status === 'SUCCESS') {

                              if (res.data.type === 'SUSPENDED') {
                                const remainingTime = res.data.remainingTime;
                                if (remainingTime <= 0) {
                                  axios.patch(`http://192.168.1.7:5000/admin/unsuspendUser`, { email: userData.email }).then((res) => {
                                    if (res.data.status === 'SUCCESS') {
                                      axios.post("http://192.168.1.7:5000/user/loginOther", {email: userData.email }).then(async (res) => {
                                        console.log(res.data)
                                    console.log("User ID: ", res.data.userId);
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
                                            navigation.navigate('App', { email: userData.email });
                                        }
                                    }
                                    ).catch((err) => {
                                        console.log("Not working");
                                        console.log(err);
                                        });
                                    }
                                  }
                                  ).catch((err) => {
                                    console.log("Not working1");
                                    console.log(err);
                                  });
                                } else {
                                const formatMessage = remainingTime >= 60 ? `${Math.floor(remainingTime / 60)} hour${Math.floor(remainingTime / 60) > 1 ? 's' : ''} and ${remainingTime % 60} minute${remainingTime % 60 > 1 ? 's' : ''}`: `${remainingTime} minute${remainingTime > 1 ? 's' : ''}`;
                                Alert.alert('Account Suspended', `Your account has been suspended. You will be able to login again in ${formatMessage}.`, [{ text: 'OK' }]);
                                }
                                const formatMessage = remainingTime >= 60 ? `${Math.floor(remainingTime / 60)} hour${Math.floor(remainingTime / 60) > 1 ? 's' : ''} and ${remainingTime % 60} minute${remainingTime % 60 > 1 ? 's' : ''}`: `${remainingTime} minute${remainingTime > 1 ? 's' : ''}`;
                Alert.alert('Account Suspended', `Your account has been suspended. You will be able to login again in ${formatMessage}.`, [{ text: 'OK' }]);
                              } else if (res.data.type === 'NOT_SUSPENDED') {
                                axios.post("http://192.168.1.7:5000/user/loginOther", userEmail).then(async (res) => {
                                    console.log(res.data)
                                    console.log("User ID: ", res.data.userId);
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
                                        navigation.navigate('App', { email: userData.email });
                                    }
                                }).catch((err) => {
                                    console.log(err);
                                    });
                              }
                            }
                          }
                          ).catch((err) => {
                            console.log(err);
                          });
                        } else if (emailExists.type === "temp") {               
                          Alert.alert('Pending Mobile Verification', 'You have not completed the mobile verification process yet. Please complete the process to continue.', [{ text: 'OK', onPress: () => navigation.navigate('VerificationScreen', { email: userData.email }) }]);
                        }
                      } else {
                      navigation.navigate('UserRole', { email: userData.email, firstName: userData.firstName, lastName: userData.lastName, userId: userData.userId });
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
          console.error('Error during Facebook login:', error);
        }
      };

    const GoogleSignIn = async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          const emailExists = await checkIfEmailExists(userInfo.user.email);
          console.log(userInfo);
          const userData = {
            email: userInfo.user.email,
            userId: userInfo.user.id,
            firstName: userInfo.user.givenName,
            lastName: userInfo.user.familyName,
          };
          if (emailExists.exists) {
            GoogleLogOut();
            if (emailExists.type === "permanent") {
              axios.get(`http://192.168.1.7:5000/admin/checkSuspensionStatus/${userData.email}`).then((res) => {
                if (res.data.status === 'SUCCESS') {
                  if (res.data.type === 'SUSPENDED') {
                    const remainingTime = res.data.remainingTime;
                    if (remainingTime <= 0) {
                      axios.patch(`http://192.168.1.7:5000/admin/unsuspendUser`, { email: userData.email }).then((res) => {
                        if (res.data.status === 'SUCCESS') {
                          axios.post("http://192.168.1.7:5000/user/loginOther", {email: userInfo.user.email }).then(async (res) => {
                            console.log(res.data)
                                    console.log("User ID: ", res.data.userId);
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
                                navigation.navigate('App', { email: userData.email });
                            }
                        }
                        ).catch((err) => {
                            console.log(err);
                            });
                        }
                      }
                      ).catch((err) => {
                        console.log(err);
                      });
                    } else {
                    const formatMessage = remainingTime >= 60 ? `${Math.floor(remainingTime / 60)} hour${Math.floor(remainingTime / 60) > 1 ? 's' : ''} and ${remainingTime % 60} minute${remainingTime % 60 > 1 ? 's' : ''}`: `${remainingTime} minute${remainingTime > 1 ? 's' : ''}`;
                    Alert.alert('Account Suspended', `Your account has been suspended. You will be able to login again in ${formatMessage}.`, [{ text: 'OK' }]);
                    }
                  } else if (res.data.type === 'NOT_SUSPENDED') {
                  axios.post("http://192.168.1.7:5000/user/loginOther", {email: userInfo.user.email }).then(async (res) => {
                    console.log(res.data)
                    console.log("User ID: ", res.data.userId);
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
                      navigation.navigate('App', { email: userData.email });
                  }
              }).catch((err) => {
                  console.log(err);
                  });
                  }
                }
              }
              ).catch((err) => {
                console.log(err);
              });
              } else if (emailExists.type === "temp") {               
                Alert.alert('Pending Mobile Verification', 'You have not completed the mobile verification process yet. Please complete the process to continue.', [{ text: 'OK', onPress: () => navigation.navigate('VerificationScreen', { email: userData.email }) }]);
              }
          } else {
            GoogleLogOut();
            navigation.navigate('UserRole', { email: userData.email, firstName: userData.firstName, lastName: userData.lastName, userId: userData.userId });
          }
        } catch (error) {
          console.log(error.message);
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
            };
            const res = await axios.post("http://192.168.1.7:5000/user/getUserDetailsByEmail", userData);
            
            if (res.data.status === 'SUCCESS') {
                return { exists: true, type: res.data.type };
            }
        } catch (error) {
            console.error('Error checking if email exists:', error.response ? error.response.data.message : error.message);
            return { exists: false, error: error.response ? error.response.data.message : error.message }; // Return an object indicating an error occurred
        }
    };
    

    const handleSubmit = () => {
        const userData = {
            email: email,
            password: password,
        }
        axios.post("http://192.168.1.7:5000/user/login", userData).then((res) => {
        const storedData = res.data.data;
        const userId = res.data.userId;
        const role = res.data.role;
        if (res.data.status === 'SUCCESS') {
          axios.get(`http://192.168.1.7:5000/admin/checkSuspensionStatus/${email}`).then(async (res) => {
            if (res.data.status === 'SUCCESS') {
              if (res.data.type === 'SUSPENDED') {
                const remainingTime = res.data.remainingTime;
                if (remainingTime <= 0) {
                  axios.patch(`http://192.168.1.7:5000/admin/unsuspendUser`, { email: userData.email }).then((res) => {
                    if (res.data.status === 'SUCCESS') {
                      axios.post("http://192.168.1.7:5000/user/loginOther", {email: userData.email }).then(async (res) => {
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
                            navigation.navigate('App', { email: userData.email });
                        }
                    }
                    ).catch((err) => {
                        console.log(err);
                        });
                    }
                  }
                  ).catch((err) => {
                    console.log(err);
                  });
                } else {
                const formatMessage = remainingTime >= 60 ? `${Math.floor(remainingTime / 60)} hour${Math.floor(remainingTime / 60) > 1 ? 's' : ''} and ${remainingTime % 60} minute${remainingTime % 60 > 1 ? 's' : ''}`: `${remainingTime} minute${remainingTime > 1 ? 's' : ''}`;
                Alert.alert('Account Suspended', `Your account has been suspended. You will be able to login again in ${formatMessage}.`, [{ text: 'OK' }]);
                }
              } else if (res.data.type === 'NOT_SUSPENDED') {
                Alert.alert('Success', 'You have successfully logged in.', [{ text: 'OK' }]);
                await AsyncStorage.setItem('token', storedData);
                await AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
                await AsyncStorage.setItem('userId', userId);
                const expoToken = await Notifications.getExpoPushTokenAsync();         
                                            let userDoc = null;                                            
                                            if (res.data.role === "Seeker") {
                                                userDoc = await firestore().collection('seekers').doc(userId).get();
                                            } else {
                                                userDoc = await firestore().collection('providers').doc(userId).get();
                                            }
                                            if (userDoc.exists) {
                                                const user = userDoc.data();     
                                                console.log(user);
                                    
                                                if (user.expoPushTokens.includes(expoToken.data)) {
                                                    console.log('ExpoToken already exists');
                                                } else {
                                                    user.expoPushTokens.push(expoToken.data);
                                                    if (role === "Seeker") {
                                                        await firestore().collection('seekers').doc(userId).update({ expoTokens: user.expoPushTokens });
                                                    } else {
                                                        await firestore().collection('providers').doc(userId).update({ expoTokens: user.expoPushTokens });
                                                    }
                                                    console.log('ExpoToken added');
                                                }
                                            }
                navigation.navigate('App', { email: userData.email });
              }
            }
        }
          ).catch((err) => {
            console.log(err);
            console.log("Not working");
          }
          );
        }
    }).catch(async (err) => {
        console.log(err);
        if(err.response.data.message === "User has not completed the registration process yet."){
            Alert.alert('Error', 'User has not completed the registration process yet.', [{ text: 'OK', onPress: () => navigation.navigate('VerificationScreen', { email }) }]);
        } else if (err.response.data.message === "Invalid credentials entered!"){
            Alert.alert('Error', 'Invalid credentials entered!', [{ text: 'OK' }]);
        } else if (err.response.data.message === "Invalid password entered!"){
            Alert.alert('Error', 'Invalid password entered!', [{ text: 'OK' }]);
        } else {
            Alert.alert('Error', 'An error occurred while processing your request. Please try again later.', [{ text: 'OK' }]);
        }
        });
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Color.colorWhite }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"always"}>
                <LinearGradient
                    style={{ flex: 1 }}
                    colors={[Color.colorSecondary, Color.colorPrimary]}
                >
                    <View style={{ flex: 1, marginHorizontal: 22 }}>
                        <View style={{ marginVertical: Platform.OS === 'ios' ? height * 0.15 : height * 0.05 }}>
                            <Image
                                source={require("./../../assets/ServicitaLOGO.png")}
                                style={{
                                    height: height * 0.25,
                                    width: width * 0.8,
                                    borderRadius: 20,
                                    alignSelf: 'center'
                                }}
                            />
                        </View>

                        <View style={{ marginBottom: height * 0.02 }}>
                            <Text style={{ fontSize: 16, fontWeight: '400', marginVertical: 8, color: Color.colorWhite }}>Email Address</Text>
                            <View style={{ width: "100%", height: 48, borderColor:  email === null || email === '' ? Color.colorWhite : emailVerify ? Color.colorWhite : Color.colorCoralShade, borderWidth: 1, borderRadius: 50, alignItems: "center", justifyContent: "center", paddingLeft: 22, flexDirection: 'row', paddingHorizontal: 55}}>
                              <FontAwesome name="envelope" color = { email === null || email === '' ? Color.colorWhite : emailVerify ? Color.colorWhite : Color.colorCoralShade } style={{marginRight: 5, fontSize: 24}} />
                                <TextInput 
                                    placeholder='Enter your email address' 
                                    placeholderTextColor={Color.colorWhite} 
                                    keyboardType='email-address' 
                                    style={{ width: "100%" }}
                                    color={ Color.colorWhite }
                                    onChange={(e) => {
                                        const trimmedEmail = e.nativeEvent.text.trim();
                                        setEmail(trimmedEmail);
                                        setEmailVerify(trimmedEmail.length > 1 && /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/.test(trimmedEmail));
                                    }}
                                    value={email}
                                />
                                {email.length < 1 ? null : emailVerify ? (
                            <Feather name="check-circle" color={Color.colorWhite} size={24} style={{ position: "absolute", right: 12 }}/>
                        ) : (
                            <Error name="error" color={Color.colorCoralShade} size={24} style={{ position: "absolute", right: 12 }}/>
                        )}
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                              {email.length < 1 ? null : emailVerify ? (
                                  null
                              ) : (
                                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                      <Text style={[errorText, { color: Color.colorCoralShade}]}>Please enter a valid email address.</Text>
                                  </View>
                              )}

                          </View>
                        </View>

                        <View style={{ marginBottom: height * 0.02 }}>
                            <Text style={{ fontSize: 16, fontWeight: '400', marginVertical: 8, color: Color.colorWhite }}>Password</Text>
                            <View style={{ width: "100%", height: 48, borderColor: password === null || password === '' ? Color.colorWhite : passwordVerify ? Color.colorWhite : Color.colorCoralShade, borderWidth: 1, borderRadius: 50, alignItems: "center", justifyContent: "center", flexDirection: 'row', paddingLeft: 22, paddingHorizontal: 51.5}}>
                            <FontAwesome name="lock" color = {password === null || password === '' ? Color.colorWhite : passwordVerify ? Color.colorWhite : Color.colorCoralShade} style={{marginRight: 5, fontSize: 24}} />
                                <TextInput 
                                    placeholder='Enter your password' 
                                    placeholderTextColor={Color.colorWhite} 
                                    secureTextEntry={!isPasswordShown} 
                                    style={{ width: "100%" }} 
                                    color={ Color.colorWhite }
                                    onChange={(e) => {
                                      const passwordInput = e.nativeEvent.text;
                                      setPassword(passwordInput);
                                      setPasswordVerify(passwordInput.length > 1 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(passwordInput));
                                    }}
                                    value={password}
                                />
                                <TouchableOpacity onPress={() => setIsPasswordShown(!isPasswordShown)} style={{ position: "absolute", right: 12 }}>
                                    <Ionicons name={isPasswordShown ? "eye-off" : "eye"} size={24} color={password === null || password === '' ? Color.colorWhite : passwordVerify ? Color.colorWhite : Color.colorCoralShade} />
                                </TouchableOpacity>
                            </View>
                            {password.length < 1 ? null : passwordVerify ? null : (
                                <Text style={[errorText, {color: Color.colorCoralShade, textAlign: 'left' }]}>Password must be at least 8 characters long and include at least one uppercase letter and one digit.</Text>
                            )}
                        </View>

                        <View style={{ flexDirection: 'row', marginVertical: height * 0.005, justifyContent: 'flex-end' }}>
                            <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
                                <Text style={{ color: Color.colorWhite, fontWeight: 'normal' }}>Forgot Password?</Text>
                            </Pressable>
                        </View>
                                                
                        <Button title="Login" filled Color={Color.colorWhite} style={{ marginTop: height * 0.015, marginBottom: height * 0.005 }} onPress={handleSubmit} disabled={!validateFields()}/>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: height * 0.005 }}>
                          <View style={{ flex: 1, height: 1, backgroundColor: Color.colorGrey, marginHorizontal: 10 }} />
                          <Text style={{ fontSize: 14, color: Color.colorWhite }}>Or Login with</Text>
                          <View style={{ flex: 1, height: 1, backgroundColor: Color.colorGrey, marginHorizontal: 10 }} />
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                          <View style={circleContainer}>
                            <TouchableOpacity onPress={onFacebookButtonPress} style={circleButton}>
                              <Image source={require("./../../assets/facebook.png")} style={{ height: 36, width: 36, top: 7}} />
                            </TouchableOpacity>
                          </View>
                          <View style={circleContainer}>
                            <TouchableOpacity onPress={GoogleSignIn} style={circleButton}>
                              <Image source={require("./../../assets/google.png")} style={{ height: 47, width: 47, top: 1 }} />
                            </TouchableOpacity>
                          </View>
                          <View style={circleContainer}>
                            <TouchableOpacity onPress={() => navigation.navigate('MobileLogin')} style={circleButton}>
                              <Image source={require("./../../assets/phone.png")} style={{ height: 37, width: 37, top: 6 }} />
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View style={{ flexDirection: "row", justifyContent: "center", marginVertical: height * 0.03 }}>
                            <Text style={{ fontSize: 16, color: Color.colorWhite }}>Don't have an account?</Text>
                            <Pressable onPress={() => navigation.navigate("UserRole", {email: '', name: '', userId: ''})}>
                                <Text style={{ fontSize: 16, color: Color.colorWhite, fontWeight: 'bold', marginLeft: 8 }}>Register</Text>
                            </Pressable>
                        </View>
                    </View>
                </LinearGradient>
            </ScrollView>
            
        </SafeAreaView>
    )
}
