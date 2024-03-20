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
import firestore from '@react-native-firebase/firestore';
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk-next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const LoginPage = ({ navigation }) => {
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
  
            const infoRequest = new GraphRequest('/me?fields=email,name', null, (error, result) => {
              if (error) {
                console.error('Error fetching user data from Facebook:', error);
              } else {
                console.log('Facebook user data:', result);
                const userData = {
                  email: result.email,
                  userId: result.id,
                  name: result.name,
                };
                checkIfEmailExists(userData.email)
                  .then((emailExists) => {
                    if (emailExists) {
                        const userEmail = {
                          email: result.email,
                        }
                        FacebookLogOut();
                        axios.post("http://192.168.1.14:5000/user/loginOther", userEmail).then((res) => {
                            console.log(res.data)
                            if (res.data.status === 'SUCCESS') {
                                Alert.alert('Success', 'You have successfully logged in.', [{ text: 'OK' }]);
                                AsyncStorage.setItem('token', res.data.data);
                                AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
                                navigation.navigate('Tab');
                            }
                        }).catch((err) => {
                            console.log(err);
                            });
                      } else {
                      navigation.navigate('UserRole', { email: userData.email, name: userData.name, userId: userData.userId });
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

      const getUserId = async () => {
        try {
            const userData = {
                email: email,
            }
            const res = await axios.post("http://192.168.1.14:5000/user/getuserid", userData);
            const result = res.data;
            const { data, status, message } = result;

            if (res.data.status === 'SUCCESS') {
                return data._id;
            }
        } catch (error) {
            console.log(error);
        }
    }

    const GoogleSignIn = async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          const emailExists = await checkIfEmailExists(userInfo.user.email);
          const userData = {
            email: userInfo.user.email,
            userId: userInfo.user.id,
            name: userInfo.user.name,
          };
          if (emailExists) {
            const userEmail = {
                email: userInfo.user.email,
            }
            GoogleLogOut();
            axios.post("http://192.168.1.14:5000/user/loginOther", userEmail).then((res) => {
                console.log(res.data)
                if (res.data.status === 'SUCCESS') {
                    Alert.alert('Success', 'You have successfully logged in.', [{ text: 'OK' }]);
                    AsyncStorage.setItem('token', res.data.data);
                    AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
                    navigation.navigate('Tab');
                }
            }).catch((err) => {
                console.log(err);
                });
          } else {
            GoogleLogOut();
            navigation.navigate('UserRole', { email: userData.email, name: userData.name, userId: userData.userId });
          }
        } catch (error) {
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
          const querySnapshot = await firestore()
            .collection('users')
            .where('email', '==', email)
            .get();
          return !querySnapshot.empty;
        } catch (error) {
          console.error('Error checking if email exists in Firestore:', error);
          return false;
        }
      };

    const handleSubmit = () => {
        const userData = {
            email: email,
            password: password,
        }
        axios.post("http://192.168.1.14:5000/user/login", userData).then((res) => {
        console.log(res.data)
        if (res.data.status === 'SUCCESS') {
            Alert.alert('Success', 'You have successfully logged in.', [{ text: 'OK' }]);
            AsyncStorage.setItem('token', res.data.data);
            AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
            navigation.navigate('Tab');
        }
    }).catch(async (err) => {
        console.log(err);
        if(err.response.data.message === "Email has not been verified yet."){
            const userId = await getUserId();
            Alert.alert('Error', 'Email has not been verified yet.', [{ text: 'OK', onPress: () => navigation.navigate('VerificationScreen', { email, userId }) }]);
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
                            <Text style={{ fontSize: 16, fontWeight: '400', marginVertical: 8, color: Color.colorWhite }}>Email address</Text>
                            <View style={{ width: "100%", height: 48, borderColor: Color.colorWhite, borderWidth: 1, borderRadius: 50, alignItems: "center", justifyContent: "center", paddingLeft: 22, flexDirection: 'row', paddingHorizontal: 55}}>
                              <FontAwesome name="envelope" color = { Color.colorWhite } style={{marginRight: 5, fontSize: 24}} />
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
                            null
                        )}
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                              {email.length < 1 ? null : emailVerify ? (
                                  null
                              ) : (
                                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                      <Error name="error" color={email === null || email === '' ? Color.colorWhite : emailVerify ? Color.colorWhite : Color.colorCoralShade} size={24} marginTop={6}/>
                                      <Text style={[errorText, { color: Color.colorWhite}]}>Please enter a valid email address.</Text>
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
                                <Text style={[errorText, {color: Color.colorWhite }]}>Password must be at least 8 characters long and include at least one uppercase letter and one digit.</Text>
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



export default LoginPage;
