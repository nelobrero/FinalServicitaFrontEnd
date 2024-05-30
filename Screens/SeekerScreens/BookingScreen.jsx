import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native'
import { StyleSheet, View, Text, Dimensions, TextInput, TouchableOpacity, Image } from "react-native";
import { Color, FontFamily, FontSize } from "./../../GlobalStyles";
import Button from './../../components/Button';
import { ScrollView } from "react-native-gesture-handler";
import CalendarPicker from "react-native-calendar-picker";
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants';
import firestore from '@react-native-firebase/firestore';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function BookingScreen ({navigation, route}) {

  const { data, userData } = route.params;

  const formatDefaultDate = (date) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const [location, setLocation] = useState('');
  const [bookingData, setBookingData] = useState([]);
  const [date, setDate] = useState(formatDefaultDate(new Date(Date.now())));
  const [selectedDate, setSelectedDate] = useState(new Date(Date.now()));
  const [dayOfDate, setDayOfDate] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));
  const [startTime, setStartTime] = useState('');
  const [startTimeValue, setStartTimeValue] = useState(0);
  const [endTime, setEndTime] = useState('');
  const [endTimeValue, setEndTimeValue] = useState(0);
  const [isFocus, setIsFocus] = useState(false);
  const [bookingDataFetched, setBookingDataFetched] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState(null);
  const [unavailableDatesFetched, setUnavailableDatesFetched] = useState(false);
  const [locationDetails, setLocationDetails] = useState(null);

const [timeOptions, setTimeOptions] = useState([
        { label: '5:00 AM', value: '5:00 AM', numValue: 5 },
        { label: '6:00 AM', value: '6:00 AM', numValue: 6 },
        { label: '7:00 AM', value: '7:00 AM', numValue: 7 },
        { label: '8:00 AM', value: '8:00 AM', numValue: 8 },
        { label: '9:00 AM', value: '9:00 AM', numValue: 9 },
        { label: '10:00 AM', value: '10:00 AM', numValue: 10 },
        { label: '11:00 AM', value: '11:00 AM', numValue: 11 },
        { label: '12:00 PM', value: '12:00 PM', numValue: 12 },
        { label: '1:00 PM', value: '1:00 PM', numValue: 13 },
        { label: '2:00 PM', value: '2:00 PM', numValue: 14 },
        { label: '3:00 PM', value: '3:00 PM', numValue: 15 },
        { label: '4:00 PM', value: '4:00 PM', numValue: 16 },
        { label: '5:00 PM', value: '5:00 PM', numValue: 17 },
        { label: '6:00 PM', value: '6:00 PM', numValue: 18 },
        { label: '7:00 PM', value: '7:00 PM', numValue: 19 },
        { label: '8:00 PM', value: '8:00 PM', numValue: 20 },
        { label: '9:00 PM', value: '9:00 PM', numValue: 21 },
        { label: '10:00 PM', value: '10:00 PM', numValue: 22 },
        { label: '11:00 PM', value: '11:00 PM', numValue: 23 },
    ]);
  


async function getBookingData() {
    try{
      const bookings = [];
      for (let i = 0; i < data.bookings.length; i++) {
        const bookingRef = firestore().collection('bookings').doc(data.bookings[i]);
        const doc = await bookingRef.get();
        if (doc.exists && doc.data().status !== 'Canceled') {
          bookings.push(doc.data());
        }
      }
      setBookingData(bookings);
      setBookingDataFetched(true);
    } catch (error) {
      console.log(error);
    }
  } 
  useEffect(() => {
    getBookingData();
  }, []);
  
  useFocusEffect(
    React.useCallback(() => {
      if (bookingData !== null) {
        renderUnavailableDates(selectedDate.getMonth());
      }
    }, [bookingData, selectedDate])
  );


const renderUnavailableDates = (month) => {

  const year = selectedDate.getFullYear();
 

  const numDaysInMonth = new Date(year, month + 1, 0).getDate();

  const unavailableDates = [];

  for (let day = 1; day <= numDaysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const dayOfWeek = currentDate.getDay();
    const availabilityForDay = data.availability.find(availability => {
      return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek] === availability.day;
    });

    if (!availabilityForDay || availabilityForDay.startTimeValue === 0) {
      unavailableDates.push(currentDate);
      continue;
    }

    if (currentDate.toDateString() === new Date(Date.now()).toDateString()) {
      const currentTime = new Date(Date.now()).getHours();
      if (availabilityForDay.endTimeValue <= currentTime + 2) {
      unavailableDates.push(currentDate);
      continue;
      }
    }

    

    let totalSumOfAvailTimes = 0;


for (let i = availabilityForDay.startTimeValue; i <= availabilityForDay.endTimeValue; i++) {
    totalSumOfAvailTimes += i;
}


const bookingsForDate = bookingData.filter(booking => booking.bookedDate === formatDefaultDate(currentDate));

let sumOfBookedTimes = 0;
let bookedHours = [];

for (let i = 0; i < bookingsForDate.length; i++) {
    const booking = bookingsForDate[i];
    for (let j = booking.startTimeValue; j <= booking.endTimeValue; j++) {

        if (!bookedHours.includes(j)) {
            sumOfBookedTimes += j;
            bookedHours.push(j);
        }
    }
    if (sumOfBookedTimes === totalSumOfAvailTimes) {
        unavailableDates.push(currentDate);
        break;
    }
}


  }

  setUnavailableDates(unavailableDates);
  setUnavailableDatesFetched(true);
};
  

  const chooseFinalStartingSelectedDate = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();
    const currentDate = new Date(year, month, day);
    const currentDateString = currentDate.toDateString();
     if (unavailableDates.some(date => date.toDateString() === currentDateString)) {
        let nextAvailableDate = new Date(selectedDate);
        nextAvailableDate.setDate(nextAvailableDate.getDate() + 1);
        setSelectedDate(nextAvailableDate);
        setDate(formatDefaultDate(nextAvailableDate));
        setDayOfDate(nextAvailableDate.toLocaleDateString('en-US', { weekday: 'long' }));
        return nextAvailableDate;
    } else {
      return selectedDate;
    }
  }
      
      



  const handleContinue = () => {
    const formattedExpiresAt = selectedDate.setHours(startTimeValue, 0, 0, 0);
    const expiresAts = new Date(formattedExpiresAt);
    const expiresAt = firestore.Timestamp.fromDate(expiresAts);
    

  const bookingData = {
    startTime: startTime,
    startTimeValue: startTimeValue,
    endTime: endTime,
    endTimeValue: endTimeValue,
    price: calculatePrice(),
    location: {
      address: location,
      latitude: locationDetails.latitude,
      longitude: locationDetails.longitude,
    },
    serviceId: data.id,
    seekerId: userData._id,
    providerId: data.providerId,
    bookedDate: date,
    expiresAt: expiresAt,
    seekerEmail: userData.email,
    seekerMobile: userData.mobile,
  };

    navigation.navigate('Payment', { bookingData });
  };

  const onDateChange = (selected) => {

    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
  
    const month = monthNames[selected.getMonth()];
    const day = selected.getDate();
    const year = selected.getFullYear();

    const formattedDate = `${month} ${day}, ${year}`;
  
    if (selected.toDateString() !== selectedDate.toDateString()) {
      setStartTime('');
      setEndTime('');
    }
    setSelectedDate(selected);
    setDate(formattedDate);
    setDayOfDate(selected.toLocaleDateString('en-US', { weekday: 'long' }));
  };

  const calculatePrice = () => {
    if (startTime === '' || endTime === '') {
      return 0;
    }
    const duration = endTimeValue - startTimeValue;
    return duration * (data.maxprice + data.minprice)/2;
  } 

  const selectedAvailability = data.availability.find(availability => availability.day === dayOfDate);

  let filteredTimeOptions = [];

if (selectedAvailability) {
  filteredTimeOptions = timeOptions.filter(option => {
    if (selectedAvailability.startTime === '') {
      return false;
    } else {
      const currentDate = new Date(Date.now());
      let partialOptions;
      if (selectedDate.getDate() === currentDate.getDate()) {
        partialOptions = option.numValue > new Date(Date.now()).getHours() + 1 && option.numValue <= 23;
      } else {
        partialOptions = option.numValue >= 5 && option.numValue <= 23;
      }
      if (bookingData.length === 0) {
        return partialOptions;
      } 
      const isBooked = bookingData.some(booking => date === booking.bookedDate && booking.startTimeValue < option.numValue && booking.endTimeValue > option.numValue);
      return partialOptions && !isBooked;
    }
  });
}

const bookedStartTimeValuesforCurrentDate = bookingData.filter(booking => booking.bookedDate === date).map(booking => booking.startTimeValue);

const minStartTimeValue = Math.min(...bookedStartTimeValuesforCurrentDate);

const startTimeOptions = filteredTimeOptions.filter(option => {
  if (option.numValue >= selectedAvailability.startTimeValue && option.numValue < selectedAvailability.endTimeValue) {
    const isBooked = bookingData.some(booking => date === booking.bookedDate && booking.startTimeValue === option.numValue);
    return !isBooked;
  }
  return false;
});


const endTimeOptions = filteredTimeOptions.filter(option => {
  const bookingDataForThisDate = bookingData.filter(booking => booking.bookedDate === date);
  if (bookingDataForThisDate.length === 0) {
    return option.numValue > startTimeValue && option.numValue <= selectedAvailability.endTimeValue;
  } else if (option.numValue > startTimeValue && option.numValue <= selectedAvailability.endTimeValue) {
    const isBooked = bookingData.some(booking => date === booking.bookedDate && booking.startTimeValue < option.numValue && booking.endTimeValue > option.numValue);
  
    if (startTimeValue < minStartTimeValue) {
      return !isBooked && option.numValue <= minStartTimeValue;
    }
    return !isBooked;
  }
  return false;
  
});

const initializeSelectedLocation = (locationDetails) => {
  setLocation(locationDetails.startCords.address);
  setLocationDetails({
    latitude: locationDetails.startCords.latitude,
    longitude: locationDetails.startCords.longitude,
  })
  console.log(locationDetails.startCords.address);
  console.log(locationDetails.startCords.latitude);
  console.log(locationDetails.startCords.longitude);
};


if ( !bookingDataFetched || !bookingData || !unavailableDatesFetched || !unavailableDates) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.secondaryGray}} >
        <Image source={require('../../assets/loading.gif')} style={{width: 200, height: 200}} />
    </View>
  );
}

  return (
    <SafeAreaView>
      <ScrollView>
      <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
                marginLeft: 20,
                position: 'absolute',
                zIndex: 1
            }}
        >
            <MaterialIcons name="arrow-back-ios" size={20} color={COLORS.white} />
            </TouchableOpacity>
    <View style={[styles.bookingscreen2, { marginBottom: 0 }]}>
        <View style={[styles.bookingscreen2Child, styles.childPosition]} />

        
        <Text style={[styles.bookingtext]}>{`Start\nBooking...`}</Text>

        <View style={[styles.rectangleParent, styles.groupChildLayout]}>
          
          
          <View style={[styles.groupChild, styles.groupChildLayout]} />
          <Text style={{  left: 15, fontSize: 15,fontWeight: '500', position: "relative", bottom: 10, }}>Select your preferred date and time-slot</Text>
          
          <View style={styles.calenderContainer}>
          <CalendarPicker
                onDateChange={onDateChange}
                onMonthChange={value => renderUnavailableDates(value.getMonth())}
                minDate={Date.now()}
                todayTextStyle={{ color: 'white' }}
                selectedStartDate={chooseFinalStartingSelectedDate()}
                selectedDayColor="#88D0F1"
                selectedDayTextStyle={{ color: 'black' }}
                width={windowWidth * 0.865}
                disabledDates={unavailableDates}
                disabledDatesTextStyle={{ color: 'gray' }}
                nextComponent={<FontAwesome5 name="chevron-right" size={15} color="black"/>}
                previousComponent={<FontAwesome5 name="chevron-left" size={15} color="black" />} 
              />
          </View>


          
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Start Time</Text>
              <Dropdown
                style={[styles.dropdown1, isFocus && {borderColor: 'blue'}]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={startTimeOptions}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? '' : '...'}
                value={startTime}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setStartTime(item.value);
                  setStartTimeValue(item.numValue);
                  setIsFocus(false);
                }}
              />
            </View>
          
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel1}>End Time</Text>
              <Dropdown
                style={[styles.dropdown2, isFocus ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={endTimeOptions}
                maxHeight={300}
                labelField={endTimeOptions.length === 0 ? 'No time options' : "label"}
                valueField={endTimeOptions.length === 0 ? 'No time options' : "value"}
                placeholder={!isFocus ? '' : '...'}
                value={endTime}
                disable={startTime === ''}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setEndTime(item.value);
                  setEndTimeValue(item.numValue);
                  setIsFocus(false);
                }}
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>Date</Text>
            <TextInput
              style={styles.input}
              value={date}
              editable={false} 
            />
          
          <TouchableOpacity onPress={() => navigation.navigate('BookingPage', {
            getStartingLocation: initializeSelectedLocation,
          })}>
          


          <Text style={styles.inputLabel}>Location</Text>
          <View style={styles.locationInput}>
            <TextInput
              style={styles.input}
              placeholder="Choose Location"
              value={location}
              onChangeText={setLocation}
              editable={false}
            />
            {/* <FontAwesome5 name="map-marker-alt" size={15} color="gray" style={styles.locationIcon} /> */}
          </View>
          </TouchableOpacity>

          <Text style={styles.inputLabel}>Calculated Price</Text>
            <TextInput
              style={styles.input}
              value={`₱${calculatePrice()}`}
              editable={false} 
            />
        </View>
        
        

        <Button title="Continue" filled Color={Color.colorWhite} 
        style={{ height: 53,
            width: windowWidth * 0.9,
            top: 850,
            position: "absolute", 
            opacity: date === '' || startTime === '' || endTime === '' || location === '' ? 0.5 : 1
             }} 
            onPress={handleContinue} 
            disabled={date === '' || startTime === '' || endTime === '' || location === ''}
          
        />

      </View>
      
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  childPosition: {
    backgroundColor: Color.colorDarkslategray_500,
    left: 0,
    position: "absolute",
  },
  groupChildLayout: {
    height: 650,
    width: windowWidth * 0.9,
    position: "absolute",

    
  },

  zipCodePosition: {
    left: 26,
    position: "absolute",
  },
  
  continuebutton: {
    top: 780,
    height: 53,
    width: 358,
    left: 36,
    position: "absolute",
  },
  bookingscreen2Child: {
    top: -19,
    width: windowWidth,
    height: 378,
  },
  groupChild: {
    shadowColor: "rgba(0, 0, 0, 1s)",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 4,
    elevation: 5,
    shadowOpacity: 0.5,
    left: 0,
    height: 534,
    top: 0,
    backgroundColor: Color.colorWhite,
  },
 
  rectangleParent: {
    justifyContent: 'center',
    top:170,
    // marginTop:10,
    //alignItems: 'center',
  },
  bookingtext: {
    top: windowHeight * 0.06,
    fontSize: 55,
    width: windowWidth * 0.9,
    textAlign: "left",
    left: 36,
    color: Color.colorWhite,
    fontFamily: FontFamily.quicksandBold,
    fontWeight: "700",
    lineHeight: windowHeight * 0.073,
    position: "absolute", 

  },
  bookingscreen2: {
    flex: 1,
    width: "100%",
    height: 925,
    overflow: "hidden",
    backgroundColor: Color.colorWhite,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  errorMsg: {
    color: 'red',
    fontSize: 12, 
    marginTop: windowHeight * 0.0001, 
    marginBottom: windowHeight * 0.01,
    width:  windowWidth * 0.698,
    left: 25,
  },

  input: {
    height: windowHeight * 0.045, 
    width: windowWidth * 0.77,
    borderColor: Color.colorDarkgray,
    borderRadius: 5,
    borderWidth: 1,
    marginVertical: windowHeight * 0.008, 
    paddingHorizontal: windowWidth * 0.025, 
    fontSize: 14,
    color: 'black',
    left: windowWidth * 0.070,
  },
  inputLabel: {
    marginBottom: 0,
    fontWeight: "bold",
    textAlign: "left",
    width: windowWidth * 0.7, 
    left: 25,
    color: Color.colorBlack,
    fontFamily: FontFamily.quicksandSemiBold,
    fontWeight: "600",
    fontSize: FontSize.size_mini,
    
  },
  inputLabel1: {
    marginBottom: 0,
    fontWeight: "bold",
    textAlign: "left",
    width: windowWidth * 0.7, 
    // left: 175,
    color: Color.colorBlack,
    fontFamily: FontFamily.quicksandSemiBold,
    fontWeight: "600",
    fontSize: FontSize.size_mini,
    marginLeft: windowWidth * 0.035,
    
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    // marginBottom: 20,
    
  },
  inputContainer: {
    flex: 1,

  },

  
  calenderContainer: {
    padding: windowWidth * 0.05,
    borderRadius: 15,
    bottom: 10,
    marginBottom:5,
    width: windowWidth * 0.9,
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginLeft: 5,
  },


  dropdown1: {
    height: windowHeight * 0.045, 
    width: windowWidth * 0.35,
    borderColor: Color.colorDarkgray,
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: windowHeight * 0.008, 
    paddingHorizontal: windowWidth * 0.025, 
    marginTop:8,
    marginLeft: windowWidth * 0.070,
  },
  dropdown2: {
    height: windowHeight * 0.045, 
    width: windowWidth * 0.35,
    borderColor: Color.colorDarkgray,
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: windowHeight * 0.008, 
    paddingHorizontal: windowWidth * 0.025, 
    marginTop:8,
    marginLeft: windowWidth * 0.035,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 14,
    color:'gray'
  },
  selectedTextStyle: {
    fontSize: 14,
  }
  
});
