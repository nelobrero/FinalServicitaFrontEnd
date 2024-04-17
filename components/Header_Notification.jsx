import React from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import { Border, FontSize, FontFamily, Color } from "../GlobalStyles";
import { useNavigation } from '@react-navigation/native';

const Header_Notification = ({ title }) => {

  const navigation = useNavigation(); 

  const handleBackPress = () => {
    navigation.navigate('HomeScreen');
  };

  return (
    <View style={styles.header}>
      <Pressable onPress={handleBackPress}>
        <AntDesign name="left" size={24} color="white" style={styles.icon} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#07374d",
    height: Dimensions.get('window').height * 0.1, // Adjust height according to screen size
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  title: {
    fontSize:  23,
    lineHeight: 50,
    fontWeight: "700",
    fontFamily: "Lobster-Regular",
    color: Color.colorWhite,
    display: "flex",
    alignItems: "center",
    width: 326,
    textAlign: "left",
    position: "absolute",
    marginLeft: 45,
  },
  icon: {
    marginLeft: 10, // Add some space before the icon
  },
});

export default Header_Notification;