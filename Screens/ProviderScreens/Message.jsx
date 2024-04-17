import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Message = () => {
  return (
    <View style={styles.container}>
      <Text>Message</Text>
    </View>
  )
}

export default Message
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });