import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

export default ConfirmationScreen = ({ navigation }) => {
  const [button1Color, setButton1Color] = useState('#07374D');
  const [button2Color, setButton2Color] = useState('#07374D');

  const handleButton1Click = () => {
    setButton1Color(button1Color === '#07374D' ? '#33B3EE' : '#07374D');
  };

  const handleButton2Click = () => {
    setButton2Color(button2Color === '#07374D' ? '#33B3EE' : '#07374D');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container1}>
        <View style={styles.iconContainer}>
          <Feather name="check-circle" size={120} color="white" />
        </View>
        <Text style={{ fontSize: 30, color: 'white', alignSelf: 'center', marginTop: 160 }}>Booked Confirmed</Text>
        <Text style={{alignSelf:'center', marginTop: 1, color:'white'}}>Hold tight, service excellence is just around the corner!</Text>
      </View>
      <View style={styles.container2}>

        <View style={{flexDirection:"row"}}>
        <Text style={{margin: 8, fontWeight:'bold'}}>Booking ID</Text>
        <Text style={{marginTop: 8, textAlign:'right'}}>Booking ID</Text>
        </View>

        <View style={{flexDirection:"row"}}>
        <Text style={{margin: 8, fontWeight:'bold'}}>Seeker</Text>
        <Text style={{marginTop: 8, textAlign:'right'}}>Seeker</Text>
        </View>

        <View style={{flexDirection:"row"}}>
        <Text style={{margin: 8, fontWeight:'bold'}}>Address</Text>
        <Text style={{marginTop: 8, textAlign:'right'}}>Address</Text>
        </View>

        <View style={{flexDirection:"row"}}>
        <Text style={{margin: 8, fontWeight:'bold'}}>Date</Text>
        <Text style={{marginTop: 8, textAlign:'right'}}>Date</Text>
        </View>

        <View style={{flexDirection:"row"}}>
        <Text style={{margin: 8, fontWeight:'bold'}}>Time</Text>
        <Text style={{marginTop: 8, textAlign:'right'}}>Time</Text>
        </View>

      </View>
      <View style={styles.container3}>
      <View style={{flexDirection:"row"}}>
        <Text style={{margin: 8, fontWeight:'bold'}}>Transaction ID</Text>
        <Text style={{marginTop: 8, textAlign:'right'}}>Transaction ID</Text>
        </View>

        <View style={{flexDirection:"row"}}>
        <Text style={{margin: 8, fontWeight:'bold'}}>Booking Time</Text>
        <Text style={{marginTop: 8, textAlign:'right'}}>Booking Time</Text>
        </View>

        <View style={{flexDirection:"row"}}>
        <Text style={{margin: 8, fontWeight:'bold'}}>Payment Time</Text>
        <Text style={{marginTop: 8, textAlign:'right'}}>Payment Time</Text>
        </View>

        <View style={{flexDirection:"row"}}>
        <Text style={{margin: 8, fontWeight:'bold'}}>Payment Method</Text>
        <Text style={{marginTop: 8, textAlign:'right'}}>Payment Method</Text>
        </View>

        <View style={{flexDirection:"row"}}>
        <Text style={{margin: 8, fontWeight:'bold'}}>Amount</Text>
        <Text style={{marginTop: 8, textAlign:'right'}}>Amount</Text>
        </View>  
      </View>

      <View style={styles.buttonContainer1}>
        <Button  
        title="View Booking" color={button1Color} onPress={()=>navigation.navigate("BookingScreen")} />
      </View>
      <View style={styles.buttonContainer2}>
        <Button  title="Go Back to Home" color={button2Color} onPress={()=>navigation.navigate("HomeScreen")}/>
      </View>
    </SafeAreaView>

  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container1: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '60%',
    backgroundColor: '#07374D',
  },
  container2: {
    marginTop: 220,
    width: '80%',
    height: '25%',
    alignSelf: 'center',
    backgroundColor: 'white', // For visualization
    shadowColor: '#000',
    borderRadius:5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  container3: {
    marginTop: 10,
    width: '80%',
    height: '25%',
    alignSelf: 'center',
    backgroundColor: 'white', // For visualization
    shadowColor: '#000',
    borderRadius:5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  
  buttonContainer1: {
    marginTop: 30,
    marginHorizontal: 40,
  },
  buttonContainer2: {
    marginTop: 10,
    marginHorizontal: 40,
  },
  iconContainer: {
    position: 'absolute',
    top: '20%', // Adjust to vertically center
    left: '50%', // Adjust to horizontally center
    transform: [{ translateX: -60 }, { translateY: -60 }], // Center the icon
  },
});


