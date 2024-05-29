
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, TouchableOpacity, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useRef } from "react";
import * as Device from 'expo-device';
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { COLORS, FONTS } from "./../constants/theme";

export const usePushNotifications = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldShowAlert: true,
      shouldSetBadge: true,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState(undefined);
  const [notification, setNotification] = useState(undefined);

  const notificationListener = useRef();
  const responseListener = useRef();

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification");
        return;
      }

      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      });
    } else {
      alert("Must be using a physical device for Push notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return {
    expoPushToken,
    notification,
  };
};

export const sendPushNotification = async (expoPushToken, title, body, userId, otherUserId) => {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: title,
    body: body,
  };

  console.log("Sending push notification:", message);


  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      host: "exp.host",
      accept: "application/json",
      "accept-encoding": "gzip, deflate",
      "content-type": "application/json",
    },
    body: JSON.stringify(message),
  });

  const notification = {
    userId: userId,
    message: body,
    title: title,
    otherUserId: otherUserId
  };

  const result = await axios.post("http://192.168.1.7:5000/notifications/create", notification)
  return result;
};




const { width, height } = Dimensions.get('window');

// const notifications = {
//   today: [
//     { id: 1, time: '10:00 AM', message: 'Your appointment with John Doe at 2:00 PM today has been confirmed.', image: require('../assets/icon.png') },
//     { id: 2, time: '9:30 AM', message: 'Jane Smith will be 15 minutes late for your 3:00 PM appointment.', image: require('../assets/icon.png') }
//   ],
//   yesterday: [
//     { id: 1, time: '3:00 PM', message: 'Your appointment with Sarah Johnson has been rescheduled to 4:00 PM.', image: require('../assets/icon.png') },
//     { id: 2, time: '1:00 PM', message: 'Reminder: You have an appointment with Michael Brown tomorrow at 10:00 AM.', image: require('../assets/icon.png') }
//   ],
//   thisWeekend: [
//     { id: 1, time: 'Saturday 2:00 PM', message: 'Your appointment with Emma Davis is confirmed for Saturday at 2:00 PM.', image: require('../assets/icon.png') },
//     { id: 2, time: 'Sunday 11:00 AM', message: 'Your appointment with Chris Lee is confirmed for Sunday at 11:00 AM.', image: require('../assets/icon.png') }
//   ]
// };

const NotificationScreen = ({navigation}) => {
  
    const [notifications, setNotifications] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const deleteNotification = async (notificationId) => {
      try {
        await axios.delete(`http://192.168.1.7:5000/notifications/deleteNotification`, { notificationId });
        setNotifications((prevNotifications) => {
          const updatedNotifications = { ...prevNotifications };
          Object.keys(updatedNotifications).forEach((key) => {
            updatedNotifications[key] = updatedNotifications[key].filter((notification) => notification._id !== notificationId);
          });
          return updatedNotifications;
        });
      } catch (error) {
        console.error('Error deleting notification:', error);
      }
    };

    const renderDateObjectToDateAndTimeString = (dateObject) => {
      const date = dateObject instanceof Date ? dateObject : new Date(dateObject || Date.now());
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const isToday = date.toDateString() === new Date().toDateString();
      const isYesterday = date.toDateString() === new Date(new Date().setDate(new Date().getDate() - 1)).toDateString();
      //Take into account today and yesterday
      const formattedNameOfDay = date.toLocaleDateString('en-US', { weekday: 'long' });
      const finalDay = isToday ? 'Today' : isYesterday ? 'Yesterday' : formattedNameOfDay;

  
      return `${finalDay}, ${formattedHours}:${formattedMinutes} ${ampm}`;
    }


    useEffect(() => {
      const fetchNotifications = async () => {
        try {
          const userId = await AsyncStorage.getItem('userId');
          if (!userId) {
            console.log('User ID not found.');
            setIsLoading(false);
            return;
          }
    
          const response = await axios.get(`http://192.168.1.7:5000/notifications/getNotifications/${userId}`);
    
          // Ensure response.data is an array
          const notifications = Array.isArray(response.data) ? response.data : [];
          if (notifications.length === 0) {
            console.log('No notifications found.');
            setNotifications({ today: [], yesterday: [], thisWeekend: [] });
            setIsLoading(false);
            return;
          }
    
          setNotifications(
            notifications.reduce((acc, notification) => {
              const date = new Date(notification.createdAt || Date.now());
              const today = new Date();
              const yesterday = new Date(today);
              yesterday.setDate(today.getDate() - 1);
              const oneWeekAgo = new Date(today);
              oneWeekAgo.setDate(today.getDate() - 7);
    
              const isToday = date.toDateString() === today.toDateString();
              const isYesterday = date.toDateString() === yesterday.toDateString();
              const isThisWeek = date >= oneWeekAgo && date < today;
    
              if (isToday) {
                acc.today.push(notification);
              } else if (isYesterday) {
                acc.yesterday.push(notification);
              } else if (isThisWeek) {
                acc.thisWeekend.push(notification);
              }
    
              return acc;
            }, { today: [], yesterday: [], thisWeekend: [] })
          );
    
        } catch (error) {
          console.error('Error fetching notifications:', error);
        } finally {
          setIsLoading(false);
        }
      };
    
      fetchNotifications();
      const intervalId = setInterval(fetchNotifications, 10000);
    
      return () => clearInterval(intervalId);
    }, []);
    


  const renderNotifications = (title, notifications) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {notifications.map((notification) => (
        <View key={notification._id} style={styles.notificationItem}>
          <View style={styles.notificationContent}>
            <Image source={require('../assets/icon.png')} style={styles.notificationImage} />
            <View style={styles.notificationText}>
              <Text style={styles.notificationTime}>{notification.title}</Text>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
              <Text style={styles.notificationTime}>{renderDateObjectToDateAndTimeString(notification.createdAt)}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteNotification(notification._id)}>
              <AntDesign name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }} >
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="#07364B" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
      </View>
      <ScrollView style={styles.scrollContainer}>
      {isLoading ? (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.secondaryGray}} >
          <Image source={require('../assets/loading.gif')} style={{width: 200, height: 200}} />
      </View>
) : (
  <>
    {notifications && (  // Check if notifications is not null
      (notifications.today && notifications.today.length > 0) ||
      (notifications.yesterday && notifications.yesterday.length > 0) ||
      (notifications.thisWeekend && notifications.thisWeekend.length > 0)
    ) ? (
      <>
        {notifications.today && notifications.today.length > 0 && renderNotifications('Today', notifications.today)}
        {notifications.yesterday && notifications.yesterday.length > 0 && renderNotifications('Yesterday', notifications.yesterday)}
        {notifications.thisWeekend && notifications.thisWeekend.length > 0 && renderNotifications('This Weekend', notifications.thisWeekend)}
      </>
    ) : (
      <Text>No notifications available.</Text>
    )}
  </>
)}




      </ScrollView>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
    backgroundColor: '#fff',
    margin: height * 0.02
  },
  scrollContainer: {
    flex: 1,
    padding: width * 0.05,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    marginBottom: height * 0.00,
    marginLeft: width * 0.05,
    color: "#07364B"
  },
  section: {
    marginBottom: height * 0.03,
  },
  sectionTitle: {
    fontSize: width * 0.06,
    fontWeight: '600',
    marginBottom: height * 0.01,
    color: "#07364B"
  },
  notificationItem: {
    marginBottom: height * 0.015,
    padding: width * 0.04,
    borderRadius: 5,
    backgroundColor: 'white',
    color: "#07364B"
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  notificationImage: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    marginRight: width * 0.04
  },
  notificationText: {
    flex: 1
  },
  notificationTime: {
    color: "#07364B",
    fontSize: width * 0.035,
    fontWeight: 'bold',
    marginBottom: height * 0.005
  },
  notificationMessage: {
    fontSize: width * 0.04
  }
});

export default NotificationScreen;
