import 'react-native-gesture-handler';
import React, { useEffect, useState, useCallback } from 'react';
import { View } from 'react-native';
import { NavigationContainer, useNavigation, DrawerActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Screens/HomeScreen';
import ProfileScreen from './Screens/ProfileScreen';
import UserScreen from './Screens/UserScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Entypo from '@expo/vector-icons/Entypo';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import DrawerContent from './DrawerContent';
import LoginPage from './Screens/Login&Register/Login';
import RegisterPage from './Screens/Login&Register/Register';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

console.log(Constants.systemFonts);

SplashScreen.preventAutoHideAsync()
  .then((result) => console.log(`SplashScreen.preventAutoHideAsync() succeeded: ${result}`))
  .catch(console.warn); // it's good to explicitly catch and inspect any error

const StackNav = ()=>{
    const Stack = createNativeStackNavigator();
    const Navigation = useNavigation();
    return (
        <Stack.Navigator screenOptions={{
            statusBarColor: 'blue',
            headerStyle: {
                backgroundColor: 'blue'
            },
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerLeft:() => {
                return (
                    <Entypo
                    name = 'menu'
                    onPress = {() => Navigation.dispatch(DrawerActions.openDrawer())}
                    size = {30}
                    color = "#fff"/>
                )
            }}}>
            <Stack.Screen name = 'Home' component = {HomeScreen} />
            <Stack.Screen name = 'Profile' component = {ProfileScreen} />
            <Stack.Screen name = 'User' component = {UserScreen} screenOptions = {{
                headerShown: false
            }} />
            <Stack.Screen name = 'Login' component = {LoginNav} />
        </Stack.Navigator>
    );
}

const DrawerNav = ()=>{
    const Drawer = createDrawerNavigator();
    return(
        <Drawer.Navigator drawerContent = {props => <DrawerContent {...props}/>} screenOptions={{
            headerShown: false}}>
            <Drawer.Screen name = "Home" component = {StackNav} />
        </Drawer.Navigator>
    )
    
}

const LoginNav = ()=>{
    const Stack = createNativeStackNavigator();
    return(
    <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name = 'Login' component = {LoginPage} />
        <Stack.Screen name = 'Register' component = {RegisterPage} />
        {/* <Stack.Screen name = 'Home' component = {DrawerNav} /> */}
    </Stack.Navigator>)
    
}

function App() {

  const [appIsReady, setAppIsReady] = useState(false);  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    
    async function checkIfLoggedIn(){
        const data = await AsyncStorage.getItem('isLoggedIn');
        setIsLoggedIn(data);
    }

    useEffect(() => {
      async function prepare() {
          try {
              // Pre-load fonts, make any API calls you need to do here
              await Font.loadAsync(Entypo.font);
              // Artificially delay for two seconds to simulate a slow loading
              // experience. Please remove this if you copy and paste the code!
              await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (e) {
              console.warn(e);
          } finally {
              // Tell the application to render
              setAppIsReady(true);  // Assuming you want to show the app as ready after loading fonts
              await SplashScreen.hideAsync();
          }
      }

      checkIfLoggedIn();
      prepare();
    }, []);


    const Stack = createNativeStackNavigator();
    return(
        <NavigationContainer>
            {isLoggedIn ? <DrawerNav /> : <LoginNav />}
        </NavigationContainer>

    );
}

export default App;