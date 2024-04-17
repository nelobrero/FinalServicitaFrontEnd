import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import React from 'react';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/splash1.png')} style={styles.image} />
      <Text style={styles.text}>Service {"\n"}
      Confirming...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#07374D', // Background color added here
  },
  image: {
    width: width * 0.2, // Adjust the width of the image as needed
    height: width * 0.5, // Adjust the height of the image as needed
    marginRight: 20,
    resizeMode: 'contain', // Adjust the resizeMode property as needed
  },
  text: {
    color: 'white',
    fontSize: width * 0.09, // Adjust the font size based on screen width
  },
});

export default SplashScreen;
