import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const  windowHeight = Dimensions.get('window').height;
const  windowWidth = Dimensions.get('window').width;

const Description = ({description}) => {
  const serviceDescription = description;

  return (
    <View style={styles.container}>
      <Text style={styles.description}>{serviceDescription}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    paddingTop: 20,
    backgroundColor: 'white',
    height: windowHeight * 0.245,
  },
  description: {
    fontSize: 16,
    textAlign: 'justify',
    

  },
});

export default Description;
