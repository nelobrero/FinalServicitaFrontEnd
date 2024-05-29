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
            const response = await axios.get('http://192.168.1.7:5000/service/getServices');
            setServices(response.data.data);
            
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const fetchCities = async () => {
        try {
            const response = await axios.get('http://192.168.1.7:5000/location/getCities');
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
        <SafeAreaView flex={1} backgroundColor={COLORS.white}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"always"} backgroundColor={COLORS.white}>
        <View style={styles.container1}>
       
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,

                position: 'absolute',
                zIndex: 1
            }}
        >
            <MaterialIcons name="arrow-back-ios" size={20} color={COLORS.white} />
        </TouchableOpacity>
                    <View style={styles.searchBar}>
                    <Text style={{ margin: 10, fontWeight:"bold", fontSize: 30, color: "#FFFFFF"}}>Search Filters</Text>
                
                        
                    </View>

                    {/* <Pressable onPress={()=>navigation.goBack()}>
                        <Ionicons name="filter" size={24} color="white" style={styles.filter} />
                    </Pressable> */}
                </View>
            </View>

          <View>
         
          </View>
            {/* SelectList component */}
            <View style={{marginTop: 30, width: '90%'}}>
              <Text style={{fontWeight:"bold", fontSize: 20, color: "#002F45", marginBottom: 6}}>Type of Service</Text>
            <SelectList 
            data={transformedServices} 
            setSelected={setSelectedService}
            style={{
            backgroundColor: "black",
            color: "white",
            }}
            placeholder= {selectedService != "" ? selectedService : "Select service"}
            searchPlaceholder="Search service"
            key={clear}
            />
            </View>

            <View style={{marginTop: 30, width: '90%', }}>
              <Text style={{fontWeight:"bold", fontSize: 20, color: "#002F45", marginBottom: 6}}>Location</Text>
            <SelectList 
            data={transformedCities} 
            setSelected={handleSelectCity}
            style={{
            backgroundColor: "black",
            color: "white",
            }}
            placeholder = {selectedCity != "" ? selectedCity : "Select city"}
            searchPlaceholder="Search city"
            key={clear}
    
            />
            </View>
            
            {selectedCity && (
                <View style={{marginTop: 30, width: '90%'}}>
                <SelectList 
                key={selectedCity || clear}
                data={filteredBarangays} 
                setSelected={setSelectedBarangay}
                style={{
                backgroundColor: "black",
                color: "white",
                }}
                placeholder= {selectedBarangay || selectedBarangay != "" ? selectedBarangay : "Select barangay"}
                />
                </View>
            )
            }
            

            <View style={{marginTop: 30, width: '90%'}}>
              <Text style={{fontWeight:"bold", fontSize: 20, color: "#002F45", marginBottom: 6}}>Price Range</Text>
            <SelectList 
            data={priceRange}
            setSelected={setSelectedPriceRange}
            style={{
            backgroundColor: "black",
            color: "white",
            }}
            placeholder= {selectedPriceRange != null ? `₱${selectedPriceRange - 99} - ₱${selectedPriceRange}` : "Select price range"}
            key={clear}
            search={false}
    
            />
            </View>

            <View style={{marginTop: 30, width: '90%'}}>
              <Text style={{fontWeight:"bold", fontSize: 20, color: "#002F45", marginBottom: 6}}>Rating</Text>
            <SelectList 
            data={rating}
            setSelected={setSelectedRating}
            style={{
            backgroundColor: "black",
            color: "white",
            }}
            placeholder= {selectedRating != null ? selectedRating == 5 ? '5 Stars' : selectedRating == 1 ? '1 Star and up' : `${selectedRating} Stars and up` : "Select rating"}
            key={clear}
            search={false}
            />
            </View>


            {/* <View style={{marginTop: 30, width: '90%'}}>
              <Text style={{fontWeight:"bold", fontSize: 20, color: "#002F45"}}>Date</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={{
                  height: screenHeight * 0.06,
                  width: "100%",
                  borderColor: COLORS.black,
                  borderWidth: 0.7,
                  borderRadius: 10,
                  marginVertical: 6,
                  justifyContent: "center",
                  paddingLeft: 18,
                }}
                placeholder="Select date"
              >
                <Text>{date.toDateString()}</Text>
              </TouchableOpacity>
            </View>


            {showDatePicker && (
                        <DateTimePicker
                            minimumDate={new Date()}
                            testID="datePicker"
                            mode="date"
                            display="default"
                            value={date}
                            onChange={onChangeDate}
                        />
                    )}


            <View style={{marginTop: 30, width: '90%'}}>
                <Text style={{fontWeight:"bold", fontSize: 20, color: "#002F45"}}>Time</Text>
                <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                style={{
                    height: screenHeight * 0.06,
                    width: "100%",
                    borderColor: COLORS.black,
                    borderWidth: 0.7,
                    borderRadius: 10,
                    marginVertical: 6,
                    justifyContent: "center",
                    paddingLeft: 18,
                }}
                >
                <TextInput styles={{fontSize: 16}} placeholder="Select time" editable={false} placeholderTextColor={Color.colorBlack} color={Color.colorBlack}>
                    {time}</TextInput>
                </TouchableOpacity>

                            </View>

                            {showTimePicker && (
                                            <Modal animationType="slide" transparent={true} visible={showTimePicker} onRequestClose={() => setShowTimePicker(false)}>
                                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                                    <View style={{ backgroundColor: 'white', width: '90%', maxHeight: '80%', borderRadius: 10, }}>
                                                        <View flexDirection='row' style={{ borderBottomColor: Color.colorBlue, borderBottomWidth: 1, alignItems: 'center', justifyContent: 'space-between', marginVertical: screenHeight * 0.01 }}>
                                                            <Text style={{
                                                                    fontSize: screenWidth * 0.06,
                                                                    fontWeight: '400',
                                                                    marginVertical: screenHeight * 0.01,
                                                                    color: Color.colorBlue,
                                                                    marginLeft: screenWidth * 0.05 
                                                                }}>Time</Text>
                                                            <AntDesign style = {{ marginRight: screenWidth * 0.05 }} name="close" size= {screenWidth * 0.06} color={Color.colorBlue} onPress={() => setShowTimePicker(false)} />
                                                        </View>
                                                        
                                                        <FlatList
                                                            data={timeOptions}
                                                            keyExtractor={(item) => item.value}
                                                            
                                                            renderItem={({ item }) => (
                                                                <Pressable onPress={() => onChangeTime(item.value, item.numValue)}>
                                                                    <View style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.5)' }}>
                                                                    <Text style={{ paddingVertical: 10, paddingHorizontal: 20 }}>{item.label}</Text>
                                                                    </View>
                                                                </Pressable>
                                                            )}
                                                        />
                                                    </View>
                                                </View>
                                            </Modal>
                                        )} */}

        

            <StatusBar style="auto" />

            <View style={styles.buttonContainer}>
            <Button
            title="Search"
            filled
            color="#002F45"
            onPress={() => {navigation.navigate('Search', { selectedService, selectedCity, selectedBarangay, selectedPriceRange, selectedRating})}}
            // disabled={selectedService === '' && selectedCity === '' && selectedPriceRange === null && selectedRating === null}
            // opacity={selectedService === '' && selectedCity === '' && selectedPriceRange === null && selectedRating === null ? 0.5 : 1}
            />

            </View>
            <View style={styles.buttonContainer}>
            <Button
            title="Clear"
            color="#002F45"
            onPress={() => {setClear(!clear); setSelectedService(""); setSelectedCity(""); setSelectedBarangay(""); setSelectedPriceRange(null); setSelectedRating(null)}}
            />
            </View>
        </View>
        </ScrollView>   
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container1: {
        alignItems: "center",
        justifyContent: "center",
    },
    buttonContainer: {
      marginTop: 40,
      marginBottom: 15,
      width: 200, // Adjust the width as needed
  },
  buttonContainer1: {
    marginBottom: 10,
    borderRadius: 10,
    height: 80,
    width: 150, // Adjust the width as needed
},
    container: {
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        backgroundColor: '#07364B',
        alignItems: 'center'
    },
    searchContainer: {
    
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 10,
        marginRight: 30,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 5,
        borderColor: "#002F45",
        borderRadius: 20,
        marginLeft: 15,
        width: '100%',
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
    },
    Button: {
        backgroundColor: '#002147',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    container2: {
      margin: 20,
      width: '90%',
  },
  input: {
      height: 50,
      borderWidth: 1,
      borderColor: '#002147',
      borderRadius: 10,
      paddingHorizontal: 10,
      fontSize: 16
  },
  filter: {
    left: 15
  },
});
