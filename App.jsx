import React, { useEffect, useState, useCallback } from 'react';

import { ActivityIndicator } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { Settings } from 'react-native-fbsdk-next';
import axios from 'axios';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';

import UserRoleScreen from './Screens/Login&Register/UserRoleScreen';
import LoginPage from './Screens/Login&Register/Login';
import MobileLogin from './Screens/Login&Register/MobileLogin';
import RegisterPage from './Screens/Login&Register/Registration';
import RegisterPage2 from './Screens/Login&Register/Registration2';
import MissingInfoPage from './Screens/Login&Register/MissingInfo';
import ProviderPreferencePage from './Screens/Login&Register/Providerpref';
import AddressForm from './Screens/Login&Register/AddressForm';
import VerificationScreen from './Screens/Login&Register/VerificationScreen';
import Welcome from './Screens/Login&Register/Welcome';
import ForgotPasswordScreen from './Screens/Login&Register/ForgotPasswordScreen';
import ResetPasswordScreen from './Screens/Login&Register/ResetPasswordScreen';
import BottomTabNav from "./navigations/BottomTabNav";
import EditProfile from './Screens/EditProfile';
import ServicePage from './Screens/ProviderScreens/ServicePage';
import ProviderList from './Screens/SeekerScreens/ProviderList';
import Services from './Screens/SeekerScreens/Services';
import Filter from './Screens/SeekerScreens/Filter';
import SearchScreen from './Screens/SeekerScreens/SearchScreen';
import Result from './components/Result';
import ServiceViewScreen from './Screens/SeekerScreens/ServiceViewScreen';
import CategoryScreen from './Screens/SeekerScreens/CategoryScreen';
import CategoryFilter from './Screens/SeekerScreens/CategoryFilter';
import BookingScreen from './Screens/SeekerScreens/BookingScreen';
import PopularServices from './Screens/SeekerScreens/PopularServices';
import ConfirmationScreen from './Screens/SeekerScreens/ConfirmationScreen';
import PaymentScreen from './Screens/SeekerScreens/PaymentScreen';
import SplashScreen1 from './Screens/SeekerScreens/SplashScreen';
import BookingSeeker from './components/BookingSeeker';
import SeekerBookingStatusScreen from './Screens/SeekerScreens/SeekerBookingStatusScreen';
import SeekerBookingScreen from './Screens/SeekerScreens/SeekerBookingScreen';
import BookingProvider from './components/BookingProvider';
import ProviderBookingStatusScreen from './Screens/ProviderScreens/ProviderBookingStatusScreen';
import ProviderBookingScreen from './Screens/ProviderScreens/ProviderBookingScreen';
import BookingPage from './Screens/SeekerScreens/BookingPage';
import ChooseLocation from './Screens/SeekerScreens/ChooseLocation';
import ProviderBookingPage from './Screens/ProviderScreens/ProviderBookingPage';
import Chat from './Screens/Chat';

const LoginNav = () => {

    const Stack = createNativeStackNavigator();
    const navigation = useNavigation();

    useEffect(() => {
      const unsubscribeToLinks = Linking.addEventListener('url', (event) => {
          handleDeepLink(event, navigation);
      });
      return () => {
          unsubscribeToLinks.remove();
      };
  }, []);

  const handleDeepLink = (event, navigation) => {
    const { path } = Linking.parse(event.url);
    console.log("LoginNav path: ", path);
  };

    return (
        <Stack.Navigator initialRouteName='Welcome' screenOptions={{ headerShown: false }}>

            <Stack.Screen name='UserRole' component={UserRoleScreen} />
            <Stack.Screen name='Login' component={LoginPage} />
            <Stack.Screen name='Register' component={RegisterPage} />
            <Stack.Screen name='Register2' component={RegisterPage2} />
            <Stack.Screen name='ProviderPrefer' component={ProviderPreferencePage} />
            <Stack.Screen name='App' component={AppNavigator} />
            <Stack.Screen name='VerificationScreen' component={VerificationScreen} />
            <Stack.Screen name='MobileLogin' component={MobileLogin} />
            <Stack.Screen name='MissingInfo' component={MissingInfoPage} />
            <Stack.Screen name='Welcome' component={Welcome} />
            <Stack.Screen name='AddressForm' component={AddressForm} />
            <Stack.Screen name='ForgotPassword' component={ForgotPasswordScreen} />
            <Stack.Screen name='ResetPassword' component={ResetPasswordScreen} />

        </Stack.Navigator>
        )

}

const AppNavigator = () => {
    
    const Stack = createNativeStackNavigator();
    const [userRole, setUserRole] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userDataFetched, setUserDataFetched] = useState(false);
    const navigation = useNavigation();
    useEffect(() => {
        getUserData();
    }, []);

    async function getUserData() {
        const token = await AsyncStorage.getItem('token');
        await axios.post("http://192.168.1.7:5000/user/userData", {token: token}).then((res) => {
        setUserRole(res.data.data.data.role);
        setUserEmail(res.data.data.data.email);
        setUserDataFetched(true);
        }).catch((err) => {
          console.log(err);
        });
    }

    useEffect(() => {
      const unsubscribeToLinks = Linking.addEventListener('url', (event) => {
          handleDeepLink(event, navigation);
      });
      return () => {
          unsubscribeToLinks.remove();
      };
  }, []);

  const handleDeepLink = (event, navigation) => {
    const { path } = Linking.parse(event.url);
    console.log("App path: ", path);
  };

    if (!userDataFetched || userRole === '' || userEmail === '') {
        return null;
    }



    if (userRole === 'Provider') {
        return(
            <Stack.Navigator
                initialRouteName="BottomTabNavigation"
              >
                <Stack.Screen
                  name="BottomTabNavigation"
                  component={BottomTabNav}
                  options={{
                    headerShown: false
                  }}
                  initialParams={{ userRole: userRole, userEmail: userEmail }}
        
                /> 
                <Stack.Screen
                  name="EditProfile"
                  component={EditProfile}
                  options={{
                    headerShown: false
                  }}
                />
                <Stack.Screen
                    name="ServicePage"
                    component={ServicePage}
                    options={{
                      headerShown: false
                    }}
                />
                <Stack.Screen
                    name="LoginNav"
                    component={LoginNav}
                    options={{
                      headerShown: false
                    }}
                />
                <Stack.Screen
                    name="ProviderBookingStatus"
                    component={ProviderBookingStatusScreen}
                    options={{
                      headerShown: false
                    }}
                />
                <Stack.Screen
                    name="ProviderBooking"
                    component={ProviderBookingScreen}
                    options={{
                      headerShown: false
                    }}
                />
                <Stack.Screen
                    name="BookingProvider"
                    component={BookingProvider}
                    options={{
                      headerShown: false
                    }}
                />
                 <Stack.Screen
                    name="ProviderBookingPage"
                    component={ProviderBookingPage}
                    options={{
                      headerShown: false
                    }}
                />
                <Stack.Screen
                    name="Chat"
                    component={Chat}
                    options={{
                      headerShown: false
                    }}
                />
              </Stack.Navigator>
            )
    } else if (userRole === 'Seeker') {
        return (
            <Stack.Navigator
                initialRouteName="BottomTabNavigation"
              >
                <Stack.Screen
                  name="BottomTabNavigation"
                  component={BottomTabNav}
                  options={{
                    headerShown: false,
                  }}
                  initialParams={{ userRole: userRole, userEmail: userEmail }}
        
                />
                <Stack.Screen
                  name="EditProfile"
                  component={EditProfile}
                  options={{
                    headerShown: false
                  }}
                />
                <Stack.Screen
                    name="LoginNav"
                    component={LoginNav}
                    options={{
                      headerShown: false
                    }}
                />
                <Stack.Screen
                    name="ProviderList"
                    component={ProviderList}
                    options={{
                      headerShown: false
                    }}
                />
                <Stack.Screen
                    name="Services"
                    component={Services}
                    options={{
                      headerShown: false
                    }} 
                />
                <Stack.Screen
                    name="Filter"
                    component={Filter}
                    options={{
                      headerShown: false
                    }}
                />
                <Stack.Screen
                    name="Search"
                    component={SearchScreen}
                    options={{
                      headerShown: false
                    }}
                />
                <Stack.Screen
                    name="Result"
                    component={Result}
                    options={{
                      headerShown: false
                    }}
                />
                <Stack.Screen
                    name="ServiceView"
                    component={ServiceViewScreen}
                    options={{
                      headerShown: false
                    }}
                />
                <Stack.Screen
                    name="CategoryScreen"
                    component={CategoryScreen}
                    options={{
                      headerShown: false
                    }}
                />
                <Stack.Screen
                    name="CategoryFilter"
                    component={CategoryFilter}
                    options={{
                      headerShown: false
                    }}
                />
                <Stack.Screen
                    name="Booking"
                    component={BookingScreen}
                    options={{
                      headerShown: false
                    }}
                />
                <Stack.Screen
                    name="PopularServices"
                    component={PopularServices}
                    options={{
                      headerShown: false
                    }}
                />
                <Stack.Screen
                    name="Confirmation"
                    component={ConfirmationScreen}
                    options={{
                      headerShown: false
                    }}
                />
                <Stack.Screen
                    name="Payment"
                    component={PaymentScreen}
                    options={{
                      headerShown: false
                    }}
                />
                <Stack.Screen
                    name="SplashScreen"
                    component={SplashScreen1}
                    options={{
                      headerShown: false
                    }}
                />
                <Stack.Screen
                    name="BookingSeeker"
                    component={BookingSeeker}
                    options={{
                      headerShown: false
                    }}
                />
                <Stack.Screen
                    name="SeekerBookingStatus"
                    component={SeekerBookingStatusScreen}
                    options={{
                      headerShown: false
                    }}
                />
                <Stack.Screen
                    name="SeekerBooking"
                    component={SeekerBookingScreen}
                    options={{
                      headerShown: false
                    }}
                />
                <Stack.Screen
                    name="BookingPage"
                    component={BookingPage}
                    options={{
                      headerShown: false
                    }}
                />
                <Stack.Screen
                    name="ChooseLocation"
                    component={ChooseLocation}
                    options={{
                      headerShown: false
                    }}
                />
                <Stack.Screen
                    name="Chat"
                    component={Chat}
                    options={{
                      headerShown: false
                    }}
                />
              </Stack.Navigator>
        )
    }
    

};

const prefix = Linking.createURL('servicita://');

const config = {
  screens:{
      LoginNav: {
        screens: {
          Login: 'login',
          Register: 'register',
          Register2: 'register2',
          ProviderPrefer: 'providerprefer',
          App: 'app',
          VerificationScreen: 'verification',
          MobileLogin: 'mobilelogin',
          MissingInfo: 'missinginfo',
          Welcome: 'welcome',
          AddressForm: 'addressform',
          ForgotPassword: 'forgotpassword',
          ResetPassword: 'resetpassword',
        },
      },
      App: {
        screens: {
          BottomTabNavigation: {
            screens: {
              Home: {
                screens: {
                  Home: 'home',
                  EditProfile: 'editprofile',
                  ServicePage: 'servicepage',
                  LoginNav: 'loginnav',
                },
              },
              Services: {
                screens: {
                  Services: 'services',
                  ProviderList: 'providerlist',
                  Filter: 'filter',
                  Search: 'search',
                  Result: 'result',
                  ServiceView: 'serviceview',
                  CategoryScreen: 'categoryscreen',
                  CategoryFilter: 'categoryfilter',
                  Booking: 'booking',
                  PopularServices: 'popularservices',
                  Confirmation: 'confirmation',
                  Payment: 'payment',
                  SplashScreen: 'splashscreen',
                },
              },
              Profile: {
                screens: {
                  Profile: 'profile',
                  EditProfile: 'editprofile',
                  LoginNav: 'loginnav',
                },
              },
            },
          },
        },
      },

  
    },
};

export default function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    
    const linking = {
      prefixes: [prefix],
      config,
    };

    const [fontsLoaded] = useFonts({
        black: require('./assets/fonts/Inter-Black.ttf'),
        bold: require('./assets/fonts/Inter-Bold.ttf'),
        medium: require('./assets/fonts/Inter-Medium.ttf'),
        regular: require('./assets/fonts/Inter-Regular.ttf'),
        semiBold: require('./assets/fonts/Inter-SemiBold.ttf'),
      });

      

    async function checkIfLoggedIn() {
        try {
            const data = await AsyncStorage.getItem('isLoggedIn');
            if (data) {
                setIsLoggedIn(true);
                // await AsyncStorage.removeItem('isLoggedIn');
            } else {
                setIsLoggedIn(false);
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

    useCallback(async () => {
        if (fontsLoaded) {
        await SplashScreen.hideAsync();
        }
    }, []);


    useEffect(() => {
        GoogleSignin.configure({
            webClientId: "916162526509-cafrd93roeekc80suoporajs002l5l9q.apps.googleusercontent.com"
        });
        requestTrackingPermission();
        checkIfLoggedIn();
    }, [isLoggedIn]);

    return (
      <NavigationContainer linking={linking} fallback={<ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />}>
        <GestureHandlerRootView style={{ flex: 1 }}>
           
            {isLoggedIn ? (
                    <AppNavigator/>
                ) : (
                    <LoginNav/>
             )}

        </GestureHandlerRootView>
        </NavigationContainer>
    );
}
