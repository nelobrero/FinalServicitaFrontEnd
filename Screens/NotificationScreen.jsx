import React from 'react';
import { View } from 'react-native';
import Header_Notification from '../components/Header_Notification';
import Notifications from '../components/Notifications';

const NotificationScreen = () => {
  return (
    <View style={{ flex: 1, marginTop: 25  }}>
      <Header_Notification title="Notifications" />
      <View style={{   flex: 1 }}>
        {/* Your screen content goes here */}
        <Notifications />
      </View>
    </View>
  );
};

export default NotificationScreen;