import React from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';

const notificationsData = [
  {
    id: 1,
    message: 'You have a new message.',
    time: '10:00 AM',
    image: require('../assets/AppLogo.png'),
  },
  {
    id: 2,
    message: 'Your order has been delivered. Your order has been delivered.Your order has been delivered.Your order has been delivered.Your order has been delivered.Your order has been delivered.Your order has been delivered.Your order has been delivered.Your order has been delivered.',
    time: '1 day ago',
    image: require('../assets/AppLogo.png'),
  },
  // Add more notification items as needed
];

const NotificationItem = ({ item }) => {
  return (
    <View style={styles.notificationItemContainer}>
      <Image source={item.image} style={styles.notificationImage} />
      <View style={styles.notificationContent}>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
    </View>
  );
};

const Notifications = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={notificationsData}
        renderItem={({ item }) => <NotificationItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 5,
  },
  notificationItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    height: 100, 
  },
  notificationImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationUser: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationMessage: {
    color: '#666',
    marginBottom: 4,
  },
  notificationTime: {
    color: '#999',
    
  },
});

export default Notifications;
