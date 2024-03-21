import React, { useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Color } from "./GlobalStyles";
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { Settings } from 'react-native-fbsdk-next';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import UserRoleScreen from './Screens/Login&Register/UserRoleScreen';
import LoginPage from './Screens/Login&Register/Login';
import MobileLogin from './Screens/Login&Register/MobileLogin';
import RegisterPage from './Screens/Login&Register/Registration';
import RegisterPage2 from './Screens/Login&Register/Registration2';
import MissingInfoPage from './Screens/Login&Register/MissingInfo';
import Providerpref from './Screens/Login&Register/Providerpref';
import AddressForm from './Screens/Login&Register/AddressForm';
import HomeScreen from './Screens/HomeScreen';
import BookingScreen from './Screens/BookingScreen';
import MessageScreen from './Screens/MessageScreen';
import ProfileScreen from './Screens/ProfileScreen';
import SeekerEditProfileScreen from './Screens/SeekerEditProfileScreen';
import ProviderProfileScreen from './Screens/ProviderProfileScreen';
import ProviderEditProfileScreen from './Screens/ProviderEditProfileScreen';
import VerificationScreen from './Screens/Login&Register/VerificationScreen';
import Welcome from './Screens/Login&Register/Welcome';
import ForgotPasswordScreen from './Screens/Login&Register/ForgotPasswordScreen';
import ResetPasswordScreen from './Screens/ResetPasswordScreen';

const LoginNav = ({userData}) => {

    const [userInfo, setUserInfos] = useState(userData);

    async function getUserData() {
        const token = await AsyncStorage.getItem('token');
        console.log(token);
        axios.post("http://192.168.1.14:5000/user/userdata", {token: token}).then((res) => {
          console.log(res.data);
          setUserInfos(res.data.data);
        }).catch((err) => {
          console.log(err);
        });
      }

    useEffect(() => {
        getUserData();
     }, [userInfo]);

     

    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator initialRouteName='Welcome' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='UserRole' component={UserRoleScreen} />
            <Stack.Screen name='Login' component={LoginPage} />
            <Stack.Screen name='Register' component={RegisterPage} />
            <Stack.Screen name='Register2' component={RegisterPage2} />
            <Stack.Screen name='ProviderPrefer' component={Providerpref} />
            <Stack.Screen name='Tab' component={TabNavigator} />
            <Stack.Screen name='VerificationScreen' component={VerificationScreen} />
            <Stack.Screen name='MobileLogin' component={MobileLogin} />
            <Stack.Screen name='MissingInfo' component={MissingInfoPage} />
            <Stack.Screen name='Welcome' component={Welcome} />
            <Stack.Screen name='AddressForm' component={AddressForm} />
            <Stack.Screen name='ForgotPassword' component={ForgotPasswordScreen} />
            <Stack.Screen name='ResetPassword' component={ResetPasswordScreen} />
        </Stack.Navigator>)
}

const TabNavigator = ({userData}) => {
    const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();

    const [userInfo, setUserInfo] = useState(userData);

    const tabBarIcon = (imageSource) => ({ focused }) => (
        <View style={{ alignItems: 'center' }}>
            {focused && (
                <View
                    style={{position: 'absolute', width: 65, height: 73, backgroundColor: '#47ACC8', borderRadius: 7, top: -10, zIndex: -1,}}
                />
            )}
            <Image
                source={imageSource}
                style={{height: 40, width: 40, tintColor: focused ? Color.colorWhite : undefined,}}
            />
        </View>
    );

    const getProfileScreen = () => {
        if (userInfo?.role === 'Provider') {
            return ProviderProfileScreen;
        } else {
            return ProfileScreen;
        }
    }

    const getEditProfileScreen = () => {
        if (userInfo?.role === 'Provider') {
            return ProviderEditProfileScreen;
        } else {
            return SeekerEditProfileScreen;
        }
    }

    async function getUserData() {
        const token = await AsyncStorage.getItem('token');
        axios.post("http://192.168.1.14:5000/user/userdata", {token: token}).then((res) => {
          console.log(res.data);
          setUserInfo(res.data.data);
        }).catch((err) => {
          console.log(err);
        });
      }

    useEffect(() => {
        getUserData();
     }, [userInfo]);
    

    return (
        <Tab.Navigator
            initialRouteName='Home' screenOptions={{ headerShown: false, tabBarStyle: { display: 'flex', backgroundColor: 'white', height: 70 }, tabBarItemStyle: { paddingBottom: 10, paddingTop: 18 }}}
        >
            <Tab.Screen name='Home' component={HomeScreen} options={{
                title: '',
                tabBarIcon: tabBarIcon(require("./assets/home.png")),
                tabBarActiveTintColor: Color.colorOrange,
            }} />
            <Tab.Screen name='Booking' component={BookingScreen} options={{
                title: '',
                tabBarIcon: tabBarIcon(require("./assets/booking.png")),
                tabBarActiveTintColor: Color.colorOrange,
            }} />
            <Tab.Screen name='Message' component={MessageScreen} options={{
                title: '',
                tabBarIcon: tabBarIcon(require("./assets/message.png")),
                tabBarActiveTintColor: Color.colorOrange,
            }} />
          <Tab.Screen
                name='Profiles'
                options={{
                    title: '',
                    tabBarIcon: tabBarIcon(require("./assets/profile.png")),
                    tabBarActiveTintColor: Color.colorOrange,
                }}
                listeners={
                    ({ navigation }) => ({
                        tabPress: (e) => {
                            e.preventDefault();
                            navigation.dispatch(
                                CommonActions.navigate({
                                    name: 'Profiles',
                                })
                            );
                        },
                    })
                
                }
                >
                {() => (
                    <Stack.Navigator
                        initialRouteName='Profile'
                        screenOptions={{ headerShown: false }}
                    >
                        <Stack.Screen
                            name='Profile'
                            component={getProfileScreen()}
                            options={{ unmountOnBlur: true }}
                        />
                        <Stack.Screen
                            name='EditProfile'
                            component={getEditProfileScreen()}
                            options={{ unmountOnBlur: true }}
                        />
                        <Stack.Screen
                            name='LoginNav'
                            component={LoginNav}
                        />
                    </Stack.Navigator>
                )}
            </Tab.Screen>
        </Tab.Navigator>
    );
};


function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState("");

    async function checkIfLoggedIn() {
        try {
            const data = await AsyncStorage.getItem('isLoggedIn');
            if (data) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
                setUserInfo("");
            }
        } catch (error) {
            console.error("Error checking login status:", error);
        }
    }

    const requestTrackingPermission = async () => {
        try {
            const { status } = await requestTrackingPermissionsAsync();
            Settings.initializeSDK();
            if (status === 'granted') {
                Settings.setClientToken('7f6f80acf921318f2555a64924e52ea1');
                await Settings.setAdvertiserTrackingEnabled(true);
            }
        } catch (e) {
            console.log(e);
        }
    }

    async function getUserData() {
        const token = await AsyncStorage.getItem('token');
        console.log(token);
        axios.post("http://192.168.1.14:5000/user/userdata", {token: token}).then((res) => {
          console.log(res.data);
          setUserInfo(res.data.data);
        }).catch((err) => {
          console.log(err);
        });
      }

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: "916162526509-cafrd93roeekc80suoporajs002l5l9q.apps.googleusercontent.com"
        });
        requestTrackingPermission();
        checkIfLoggedIn();
    }, [userInfo]);

    useEffect(() => {
       getUserData();
    }, [isLoggedIn]);


    return (
        <NavigationContainer>
        {isLoggedIn && userInfo.role ? (
            <TabNavigator userInfo = {userInfo} />
        ) : (
            <LoginNav userInfo = {userInfo} />
        )}
    </NavigationContainer>
    );
}

export default App;
