import { StatusBar } from "expo-status-bar";
import { StyleSheet, Button, View, Text, Dimensions, ScrollView, TouchableOpacity, Image } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState, useEffect } from "react";
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SelectList } from 'react-native-dropdown-select-list';
import { COLORS } from "../../constants/theme";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";


const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

   
export default function Filter({navigation, route}) {
    const priceRange = [
        { key: 100, value: '₱1 - ₱100'},
        { key: 200, value: '₱101 - ₱200'},
        { key: 300, value: '₱201 - ₱300'},
        { key: 400, value: '₱301 - ₱400'},
        { key: 500, value: '₱401 - ₱500'},
        { key: 600, value: '₱501 - ₱600'},
        { key: 700, value: '₱601 - ₱700'},
        { key: 800, value: '₱701 - ₱800'},
        { key: 900, value: '₱801 - ₱900'},
        { key: 1000, value: '₱901 - 1000'},
    ];

    const rating = [
        { key: 1, value: '1 Star and up'},
        { key: 2, value: '2 Stars and up'},
        { key: 3, value: '3 Stars and up'},
        { key: 4, value: '4 Stars and up'},
        { key: 5, value: '5 Stars'},
    ];

    const { filterQuery } = route.params;

    console.log(filterQuery);

    // const [defaultTimeOptions] = useState([
    //     { label: '5:00 AM', value: '5:00 AM', numValue: 5 },
    //     { label: '6:00 AM', value: '6:00 AM', numValue: 6 },
    //     { label: '7:00 AM', value: '7:00 AM', numValue: 7 },
    //     { label: '8:00 AM', value: '8:00 AM', numValue: 8 },
    //     { label: '9:00 AM', value: '9:00 AM', numValue: 9 },
    //     { label: '10:00 AM', value: '10:00 AM', numValue: 10 },
    //     { label: '11:00 AM', value: '11:00 AM', numValue: 11 },
    //     { label: '12:00 PM', value: '12:00 PM', numValue: 12 },
    //     { label: '1:00 PM', value: '1:00 PM', numValue: 13 },
    //     { label: '2:00 PM', value: '2:00 PM', numValue: 14 },
    //     { label: '3:00 PM', value: '3:00 PM', numValue: 15 },
    //     { label: '4:00 PM', value: '4:00 PM', numValue: 16 },
    //     { label: '5:00 PM', value: '5:00 PM', numValue: 17 },
    //     { label: '6:00 PM', value: '6:00 PM', numValue: 18 },
    //     { label: '7:00 PM', value: '7:00 PM', numValue: 19 },
    //     { label: '8:00 PM', value: '8:00 PM', numValue: 20 },
    //     { label: '9:00 PM', value: '9:00 PM', numValue: 21 },
    //     { label: '10:00 PM', value: '10:00 PM', numValue: 22 },
    //     { label: '11:00 PM', value: '11:00 PM', numValue: 23 },
    // ]);

    // const [timeOptions, setTimeOptions] = useState([
    //     { label: '5:00 AM', value: '5:00 AM', numValue: 5 },
    //     { label: '6:00 AM', value: '6:00 AM', numValue: 6 },
    //     { label: '7:00 AM', value: '7:00 AM', numValue: 7 },
    //     { label: '8:00 AM', value: '8:00 AM', numValue: 8 },
    //     { label: '9:00 AM', value: '9:00 AM', numValue: 9 },
    //     { label: '10:00 AM', value: '10:00 AM', numValue: 10 },
    //     { label: '11:00 AM', value: '11:00 AM', numValue: 11 },
    //     { label: '12:00 PM', value: '12:00 PM', numValue: 12 },
    //     { label: '1:00 PM', value: '1:00 PM', numValue: 13 },
    //     { label: '2:00 PM', value: '2:00 PM', numValue: 14 },
    //     { label: '3:00 PM', value: '3:00 PM', numValue: 15 },
    //     { label: '4:00 PM', value: '4:00 PM', numValue: 16 },
    //     { label: '5:00 PM', value: '5:00 PM', numValue: 17 },
    //     { label: '6:00 PM', value: '6:00 PM', numValue: 18 },
    //     { label: '7:00 PM', value: '7:00 PM', numValue: 19 },
    //     { label: '8:00 PM', value: '8:00 PM', numValue: 20 },
    //     { label: '9:00 PM', value: '9:00 PM', numValue: 21 },
    //     { label: '10:00 PM', value: '10:00 PM', numValue: 22 },
    //     { label: '11:00 PM', value: '11:00 PM', numValue: 23 },
    // ]);

    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = filterQuery != undefined ? filterQuery.selectedService != "" ? useState(filterQuery.selectedService) : useState('') : useState('');
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = filterQuery != undefined ? filterQuery.selectedCity != "" ? useState(filterQuery.selectedCity) : useState('') : useState('');
    const [selectedBarangay, setSelectedBarangay] = filterQuery != undefined ? filterQuery.selectedBarangay != null ? useState(filterQuery.selectedBarangay) : useState('') : useState('');;
    const [selectedPriceRange, setSelectedPriceRange] = filterQuery != undefined ? filterQuery.selectedPriceRange != null ? useState(filterQuery.selectedPriceRange) : useState(null) : useState(null);
    const [selectedRating, setSelectedRating] = filterQuery != undefined ? filterQuery.selectedRating != null ? useState(filterQuery.selectedRating) : useState(null) : useState(null);
    // const [time, setTime] = useState('');
    // const [date, setDate] = useState(new Date());
    // const [dateIsNow, setDateIsNow] = useState(true);
    // const [dayOfDate, setDayOfDate] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));
    // const [hours, setHours] = useState(null);
    // const [showDatePicker, setShowDatePicker] = useState(false);
    // const [showTimePicker, setShowTimePicker] = useState(false);
    const [clear, setClear] = useState(false);

    const fetchServices = async () => {
        try {
            const response = await axios.get('http://192.168.254.111:5001/service/getServices');
            setServices(response.data.data);
            
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const fetchCities = async () => {
        try {
            const response = await axios.get('http://192.168.254.111:5001/location/getCities');
            setCities(response.data.data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    

    useEffect(() => {
        fetchCities();
        fetchServices();
        
    }, []);

    if (!services || !cities) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.secondaryGray}} >
                <Image source={require('../../assets/loading.gif')} style={{width: 200, height: 200}} />
            </View>
          );
    }

    // useEffect(() => {
    //     if (dateIsNow) {
    //         setTimeOptions(timeOptions.filter(timeOption => timeOption.numValue > new Date().getHours()));
    //     } else {
    //         setTimeOptions(defaultTimeOptions);
    //     }
    // }, [dateIsNow]);

    

    const transformedServices = services.map(service => ({ key: service.name, value: service.name }));
    const transformedCities = cities.map(city => ({ key: city.name, value: city.name }));
    const filteredBarangays = selectedCity ? cities.find(city => city.name === selectedCity)?.barangays.map(barangay => ({ key: barangay, value: barangay })) || [] : [];

    // const onChangeDate = (event, selectedDate) => {
    //     setShowDatePicker(false);
    //     const currentDate = selectedDate || date;
    //     if (currentDate > new Date()) {
    //         setDateIsNow(false);
    //     } else {
    //         setDateIsNow(true);
    //     }
    //     setDate(currentDate);
    //     setDayOfDate(currentDate.toLocaleDateString('en-US', { weekday: 'long' }));
    //     setTime('');
    // };

    // const onChangeTime = (selectedTime, hours) => {
    //     setTime(selectedTime);
    //     setHours(hours);
    //     setShowTimePicker(false);

    // };

    const handleSelectCity = (city) => {
        setSelectedCity(city);
        if (!cities.find(c => c.name === city).barangays.includes(selectedBarangay)) {
        setSelectedBarangay("");
        }
    };

return (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.container1}>
      <View style={styles.iconContainer}>
        <Feather name="check-circle" size={120} color="white" />
      </View>
    <View style={{marginTop: 15}}>
        <Text style={{ fontSize: 30, color: 'white', alignSelf: 'center', marginTop: 163, }}>Booking Confirmed</Text>
        <Text style={{alignSelf:'center', marginTop: 1, color:'white'}}>You can view your booking details below.</Text>
      </View>
      
    </View>
    <View style={[styles.container2, { justifyContent: "center", marginTop: 225 }]}>

      <View style={{flexDirection:"row", }}>
      <Text style={styles.textBold} >Booking ID</Text>
      <Text style={styles.textRegular}>{bookingId}</Text>
      </View>

      <View style={{flexDirection:"row"}}>
      <Text style={styles.textBold}>Provider</Text>
      <Text style={styles.textRegular}>{providerData.name.firstName} {providerData.name.lastName}</Text>
      </View>

      <View style={{flexDirection:"row"}}>
      <Text style={styles.textBold}>Location</Text>
      <Text style={styles.textRegular}>{bookingData.location.address}</Text>
      </View>

      <View style={{flexDirection:"row"}}>
      <Text style={styles.textBold}>Date</Text>
      <Text style={styles.textRegular}>{bookingData.bookedDate}</Text>
      </View>

      <View style={{flexDirection:"row"}}>
      <Text style={styles.textBold}>Time</Text>
      <Text style={styles.textRegular}>{bookingData.startTime} - {bookingData.endTime}</Text>
      </View>

    </View>
    <View style={[styles.container3, { justifyContent: "center" }]}>
    <View style={{flexDirection:"row", }}>
      <Text style={styles.textBold}>Transaction ID</Text>
      <Text style={{marginTop: 8, textAlign:'right', position: 'absolute', left: windowWidth * 0.265, fontSize: windowWidth * 0.030}}>{bookingData.paymentId}</Text>
      </View>

      <View style={{flexDirection:"row"}}>
      <Text style={styles.textBold}>Created At</Text>
      <Text style={styles.textRegular}>
      {bookingData.createdAt.toDate().toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
      </Text>
      </View>

      <View style={{flexDirection:"row"}}>
      <Text style={styles.textBold}>Expires At</Text>
      <Text style={styles.textRegular}>
      {bookingData.expiresAt.toDate().toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
</Text>

      </View>

      <View style={{flexDirection:"row"}}>
      <Text style={styles.textBold}>Payment Method</Text>
      <Text style={styles.textRegular}>{bookingData.paymentMethod === 'gcash' ? 'GCash' : bookingData.paymentMethod === 'grab_pay' ? 'GrabPay' : 'Paymaya'}</Text>
      </View>

      <View style={{flexDirection:"row"}}>
      <Text style={styles.textBold}>Amount</Text>
      <Text style={styles.textRegular}>{bookingData.price}</Text>
      </View>  
    </View>

    
    <View style={styles.buttonContainer2}>
      {/* <Button  title="Go Back to Home" color={button2Color} onPress={()=>navigation.navigate("BottomTabNavigation", {userRole: userRole, userEmail: userEmail})} /> */}
      <Button 
            title="Go Back to Home" 
            filled 
            Color={Color.colorWhite} 
            style={{ 
              height: 53,
              // width: windowWidth * 0.890, 
              width: windowWidth * 0.81, 
              // top: 540,
              // bottom: windowHeight * 0.12, 
              position: "relative", 
            }} 
            onPress={()=>navigation.navigate("BottomTabNavigation", {userRole: userRole, userEmail: userEmail})}
          />
    </View>
  </SafeAreaView>

);
};



const styles = StyleSheet.create({
safeArea: {
  flex: 1,
  backgroundColor:"white"
},
container1: {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '55%',
  backgroundColor: '#07374D',
},
container2: {
  marginTop: windowHeight * 0.3,
  // width: '80%',
  width: windowWidth * 0.81, 
  // height: '25%',
  height: windowHeight * 0.25,
  alignSelf: 'center',
  backgroundColor: 'white', // For visualization
  shadowColor: '#000',
  // borderRadius:5,
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
  // width: '80%',
  width: windowWidth * 0.81, 
  // height: '25%',
  height: windowHeight * 0.25,
  alignSelf: 'center',
  backgroundColor: 'white', // For visualization
  shadowColor: '#000',
  // borderRadius:5,
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

iconContainer: {
  position: 'absolute',
  top: '25%', // Adjust to vertically center
  left: '50%', // Adjust to horizontally center
  transform: [{ translateX: -60 }, { translateY: -60 }], // Center the icon
 
},
textBold:{
  margin: 8, 
  fontWeight:'bold',
  fontSize:  windowWidth * 0.035,
  textAlign:'left',
},
textRegular:{
  marginTop: 8, 
  textAlign:'right',
  fontSize: windowWidth * 0.035,
  // left: windowWidth * 0.265,
  // right: windowWidth * 0.09,
 
  
},
buttonContainer2: {
  marginTop: windowHeight * 0.035,
 // bottom:  windowHeight * 0.03,
  marginHorizontal: 40,
},
});
