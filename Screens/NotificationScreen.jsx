import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const notifications = {
  today: [
    { id: 1, time: '10:00 AM', message: 'Your appointment with John Doe at 2:00 PM today has been confirmed.', image: require('../assets/icon.png') },
    { id: 2, time: '9:30 AM', message: 'Jane Smith will be 15 minutes late for your 3:00 PM appointment.', image: require('../assets/icon.png') }
  ],
  yesterday: [
    { id: 1, time: '3:00 PM', message: 'Your appointment with Sarah Johnson has been rescheduled to 4:00 PM.', image: require('../assets/icon.png') },
    { id: 2, time: '1:00 PM', message: 'Reminder: You have an appointment with Michael Brown tomorrow at 10:00 AM.', image: require('../assets/icon.png') }
  ],
  thisWeekend: [
    { id: 1, time: 'Saturday 2:00 PM', message: 'Your appointment with Emma Davis is confirmed for Saturday at 2:00 PM.', image: require('../assets/icon.png') },
    { id: 2, time: 'Sunday 11:00 AM', message: 'Your appointment with Chris Lee is confirmed for Sunday at 11:00 AM.', image: require('../assets/icon.png') }
  ]
};

const NotificationScreen = () => {
  const renderNotifications = (title, notifications) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {notifications.map((notification) => (
        <View key={notification.id} style={styles.notificationItem}>
          <View style={styles.notificationContent}>
            <Image source={notification.image} style={styles.notificationImage} />
            <View style={styles.notificationText}>
              <Text style={styles.notificationTime}>{notification.time}</Text>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <AntDesign name="arrowleft" size={24} color="#07364B" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
      </View>
      <ScrollView style={styles.scrollContainer}>
        {renderNotifications('Today', notifications.today)}
        {renderNotifications('Yesterday', notifications.yesterday)}
        {renderNotifications('This Weekend', notifications.thisWeekend)}
      </ScrollView>
    </View>
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
