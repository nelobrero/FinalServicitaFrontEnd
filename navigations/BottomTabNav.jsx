import { Image, View } from "react-native";
import React from "react";
import { SimpleLineIcons, Feather, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { COLORS } from "../constants/theme.jsx";
import { Home, Message, Profile, Booking } from "./../Screens/ProviderScreens"
import { HomePage, ProfilePage, MessagePage, BookingPage} from "./../Screens/SeekerScreens"
import { SafeAreaView } from "react-native-safe-area-context";
import AIScreen from "../Screens/AIScreen.jsx";

const Tab = createBottomTabNavigator();


const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarHideOnKeyboard: true,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 0,
    height: 50,
    backgroundColor: COLORS.white,
  },
};

export default BottomTabNav = ({route}) => {

  const { userRole, userEmail } = route.params;
  console.log("User Role: ", userRole);
  // console.log("User Email: ", userEmail);

  if (userRole === 'Provider') {


    return (
      <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
     
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View style={{
        
        backgroundColor: focused ? COLORS.primary : COLORS.white,
            borderRadius: 5, // Adjust the borderRadius to match the shape of the icon
            padding: 10, // Adjust the padding to control the background size
            paddingBottom: 12
        
                }}>
                <SimpleLineIcons
                  name="home"
                  size={20}
                  backgroundColor={focused ? COLORS.primary : COLORS.white}
                  color={focused ? COLORS.white : COLORS.primary}  // Update the colors here
                />
                </View>
              );
            },
          }}
          initialParams={{userEmail: userEmail}}
        />
  
        <Tab.Screen
          name="Booking"
          component={Booking}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View style={{
                  backgroundColor: focused ? COLORS.primary : COLORS.white,
    borderRadius: 5, // Adjust the borderRadius to match the shape of the icon
    padding: 10, // Adjust the padding to control the background size
    paddingBottom: 12
                }}>
                <Entypo
                  name="calendar"
                  size={20}
                  backgroundColor={focused ? COLORS.primary : COLORS.white}
          color={focused ? COLORS.white : COLORS.primary}  // Update the colors here
                />
                </View>
              );
            },
          }}
          initialParams={{userEmail: userEmail}}
        />

        <Tab.Screen
          name="AI"
          component={AIScreen}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View style={{
                  backgroundColor: focused ? COLORS.primary : COLORS.white,
    borderRadius: 5, // Adjust the borderRadius to match the shape of the icon
    padding: 10, // Adjust the padding to control the background size
    paddingBottom: 12
                }}>
                <Image
                  source={require("./../assets/AI LOGO.png")}
                  style={{
                    width: 34,
                    height: 28,
                    // borderRadius: 20,
                    // backgroundColor: Colors.,
                    tintColor: focused ? COLORS.white : COLORS.secondary,
                  }}
                />
                </View>
              );
            },
          }}
          initialParams={{userEmail: userEmail, userRole: userRole}}
        />

        <Tab.Screen
          name="Message"
          component={Message}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View style={{
                  backgroundColor: focused ? COLORS.primary : COLORS.white,
    borderRadius: 5, // Adjust the borderRadius to match the shape of the icon
    padding: 10, // Adjust the padding to control the background size
    paddingBottom: 12
                }}>
                  <Feather name="message-square" 
                  size={20} 
                  backgroundColor={focused ? COLORS.primary : COLORS.white}
          color={focused ? COLORS.white : COLORS.primary}  // Update the colors here
                  />
                  </View>
              );
            },
          }}
          initialParams={{userEmail: userEmail, userRole: userRole}}
        />
  
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View style={{backgroundColor: focused ? COLORS.primary : COLORS.white,
                  borderRadius: 5, // Adjust the borderRadius to match the shape of the icon
                  padding: 10, // Adjust the padding to control the background size
                  paddingBottom: 12}}> 
                <MaterialCommunityIcons
                  name="account"
                  size={20}
                  backgroundColor={focused ? COLORS.primary : COLORS.white}
          color={focused ? COLORS.white : COLORS.primary}  // Update the colors here
                />
                </View>
              );
            },
          }}
          initialParams={{userEmail: userEmail}}
        />
      </Tab.Navigator>
      </SafeAreaView>
    );
  } else if (userRole === 'Seeker'){
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <Tab.Navigator screenOptions={screenOptions}>

      <Tab.Screen
  name="Home"
  component={HomePage}
  options={{
    tabBarIcon: ({ focused }) => {
      return (
        <View style={{

backgroundColor: focused ? COLORS.primary : COLORS.white,
    borderRadius: 5, // Adjust the borderRadius to match the shape of the icon
    padding: 10, // Adjust the padding to control the background size
    paddingBottom: 12

        }}>
        <SimpleLineIcons
          name="home"
          size={20}
          backgroundColor={focused ? COLORS.primary : COLORS.white}
          color={focused ? COLORS.white : COLORS.primary}  // Update the colors here
        />
        </View>
      );
    },
  }}
  initialParams={{ userEmail: userEmail }}
/>

        <Tab.Screen
          name="Booking"
          component={BookingPage}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View style={{
                  backgroundColor: focused ? COLORS.primary : COLORS.white,
    borderRadius: 5, // Adjust the borderRadius to match the shape of the icon
    padding: 10, // Adjust the padding to control the background size
    paddingBottom: 12
                }}>
                <Entypo
                  name="calendar"
                  size={20}
                  backgroundColor={focused ? COLORS.primary : COLORS.white}
          color={focused ? COLORS.white : COLORS.primary}  // Update the colors here
                />
                </View>
              );
            },
          }}
          initialParams={{userEmail: userEmail}}
        />

        <Tab.Screen
          name="AI"
          component={AIScreen}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View style={{
                  backgroundColor: focused ? COLORS.primary : COLORS.white,
    borderRadius: 5, // Adjust the borderRadius to match the shape of the icon
    padding: 10, // Adjust the padding to control the background size
    paddingBottom: 12
                }}>
                <Image
                  source={require("./../assets/AI LOGO.png")}
                  style={{
                    width: 34,
                    height: 28,
                    // borderRadius: 20,
                    // backgroundColor: Colors.,
                    tintColor: focused ? COLORS.white : COLORS.secondary,
                  }}
                />
                </View>
              );
            },
          }}
          initialParams={{userEmail: userEmail, userRole: userRole}}
        />

        <Tab.Screen
          name="Message"
          component={MessagePage}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View style={{
                  backgroundColor: focused ? COLORS.primary : COLORS.white,
    borderRadius: 5, // Adjust the borderRadius to match the shape of the icon
    padding: 10, // Adjust the padding to control the background size
    paddingBottom: 12
                }}>
                  <Feather name="message-square" 
                  size={20} 
                  backgroundColor={focused ? COLORS.primary : COLORS.white}
          color={focused ? COLORS.white : COLORS.primary}  // Update the colors here
                  />
                  </View>
              );
            },
          }}
          initialParams={{userEmail: userEmail}}
        />
  
        <Tab.Screen
          name="Profile"
          component={ProfilePage}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View style={{backgroundColor: focused ? COLORS.primary : COLORS.white,
                  borderRadius: 5, // Adjust the borderRadius to match the shape of the icon
                  padding: 10, // Adjust the padding to control the background size
                  paddingBottom: 12}}> 
                <MaterialCommunityIcons
                  name="account"
                  size={20}
                  backgroundColor={focused ? COLORS.primary : COLORS.white}
          color={focused ? COLORS.white : COLORS.primary}  // Update the colors here
                />
                </View>
              );
            },
          }}
          initialParams={{userEmail: userEmail}}
        />
      </Tab.Navigator>
      </SafeAreaView>
    )
    
  }
};