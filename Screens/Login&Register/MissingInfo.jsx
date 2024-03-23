import { View, Text, TextInput, TouchableOpacity, Image, Pressable, Dimensions, ScrollView, Alert, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { Color, errorText } from '../../GlobalStyles';
import Button from '../../components/Button';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import Error from '@expo/vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function MissingInfoPage ({navigation, route, props}) {

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [birthday, setBirthday] = useState(null);
    const [birthdayVerify, setBirthdayVerify] = useState(false);
    const [datePickerOpened, setDatePickerOpened] = useState(false);
    const [streetAddress1, setStreetAddress1] = useState('');
    const [streetAddress1Verify, setStreetAddress1Verify] = useState(false);
    const [streetAddress2, setStreetAddress2] = useState('');
    // const [state, setState] = useState('');
    // const [stateVerify, setStateVerify] = useState(false);
    // const [postalCode, setPostalCode] = useState('');
    // const [postalCodeVerify, setPostalCodeVerify] = useState(false);
    const [mobile, setMobile] = useState('+63');
    const [mobileVerify, setMobileVerify] = useState(false);
    const [selectedValueService, setSelectedValueService] = useState(null);
    const [showSelectListService, setShowSelectListService] = useState(false);
    const [searchQueryService, setSearchQueryService] = useState('');
    const [selectedValueCity, setSelectedValueCity] = useState(null);
    const [showSelectListCity, setShowSelectListCity] = useState(false);
    const [searchQueryCity, setSearchQueryCity] = useState('');
    
    
    
    

    const today = new Date();
    const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const formattedBirthday = birthday ? 
    `${(birthday.getMonth() + 1).toString().padStart(2, '0')}/${birthday.getDate()}/${birthday.getFullYear()}` 
    : null;

    const { email, name, userId, role } = route.params;

    const [roleText, setRoleText] = useState(role === 'Seeker' ? 'Seeking' : 'Servicing');

    const [services, setServices] = useState([]);
    const [cities, setCities] = useState([]);

    const filteredServices = services.filter(item => item.name.toLowerCase().includes(searchQueryService.toLowerCase()));
    const filteredCities = cities.filter(item => item.name.toLowerCase().includes(searchQueryCity.toLowerCase()));
    

    useEffect(() => {
        fetchServices();
        fetchCities();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await axios.get('http://192.168.1.14:5000/service/getServices');
            setServices(response.data.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const fetchCities = async () => {
        try {
            const response = await axios.get('http://192.168.1.14:5000/location/getCities');
            setCities(response.data.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const validateFields = () => {
        if (role === 'Provider') {
            return birthdayVerify && streetAddress1Verify && selectedValueCity && mobileVerify && selectedValueService;
        } else {
            return birthdayVerify && streetAddress1Verify && selectedValueCity && mobileVerify;
        }
    }

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || birthday;
        setShowDatePicker(false);
        setBirthday(currentDate);
        setBirthdayVerify(currentDate <= minDate);
    }

    const handleSelectService = (value) => {
        setSelectedValueService(value);
        setShowSelectListService(false);

    };

    const handleSelectCity = (value) => {
        setSelectedValueCity(value);
        setShowSelectListCity(false);

    };

    const saveDetails = async (userId) => {
        try{
            if (role === 'Provider') {
                const userRef = firestore().collection('providers').doc(userId);
                await userRef.set({
                    name: name,
                    address: streetAddress1 + " " + streetAddress2 + ", " + selectedValueCity.name,
                    birthDate: firestore.Timestamp.fromDate(new Date(birthday)),
                    service: selectedValueService.name
                })
            } else if (role === 'Seeker') {
                const userRef = firestore().collection('seekers').doc(userId);
                await userRef.set({
                    name: name,
                    address: streetAddress1 + " " + streetAddress2 + ", " + selectedValueCity.name,
                    birthDate: firestore.Timestamp.fromDate(new Date(birthday)),
                })
            }
            console.log(`User details saved for user with ID: ${userId}`);
        } catch (error) {
            console.error('Error saving user details to Firestore:', error);
        }
    }

    const handleSubmit = () => {
        const userInfo = {
            email: email,
            mobile: mobile,
            password: userId,
            role: role
        }
        axios.post("http://192.168.1.14:5000/user/signupOther", userInfo).then(async (res) => {
        const result = res.data;
        const {data, message, status} = result;
        console.log("test", res.data);
        console.log(data._id);
        if (res.data.status === 'SUCCESS') {
        await saveDetails(data._id);
          Alert.alert('Success', 'Details saved successfully. Login again.', [{ text: 'OK', onPress: () => navigation.navigate('Login') }]);
        } else {
          Alert.alert('Error', 'An error occurred while processing your request. Please try again later.', [{ text: 'OK' }]);
        }}).catch((err) => {
        if(err.response.data.message === "Email is being used by another user."){
            Alert.alert('Error', 'Email is already being used by another user.', [{ text: 'OK', onPress: () => navigation.navigate('Login') }]);
        } else {
            Alert.alert('Error', 'An error occurred while processing your request. Please try again later.', [{ text: 'OK' }]);
        }
        });
    }

    const renderButton = () => {
        if (role === 'Provider') {

            return (
                <TouchableWithoutFeedback onPress={() => setShowSelectListService(false)}>
            <View style={{ marginBottom: windowHeight * 0.01 }}>
                <Text style={{
                    fontSize: windowWidth * 0.05,
                    fontWeight: '400',
                    marginVertical: windowHeight * 0.01,
                    color: Color.colorBlue,
                }}>Service</Text>
                <TouchableOpacity onPress={() => setShowSelectListService(true)}>
                    <View style={{
                        width: '100%',
                        height: windowHeight * 0.06,
                        borderColor: selectedValueService ? Color.colorGreen : Color.colorBlue1,
                        borderWidth: 1,
                        borderRadius: windowHeight * 0.015,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingLeft: windowWidth * 0.025,
                        paddingHorizontal: windowWidth * 0.14,
                        flexDirection: 'row'
                    }}>
                        <FontAwesome name="bell" color = {selectedValueService === null || selectedValueService === '' ? Color.colorBlue1 : selectedValueService ? Color.colorGreen : Color.colorBlue1} style={{marginRight: 5, fontSize: 24}}/>
                        <TextInput
                            placeholder='Select service'
                            placeholderTextColor={Color.colorBlue}
                            value={selectedValueService ? selectedValueService.name : '' }
                            editable={false}
                            style={{ flex: 1 }}
                            color={selectedValueService ? Color.colorBlack : Color.colorBlue}
                        />
                        {selectedValueService ? (
                            <Feather name="check-circle" color="green" size={24} style={{ position: "absolute", right: 12 }}/>
                        ) : null}
                    </View>
                </TouchableOpacity>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showSelectListService}
                    onRequestClose={() => setShowSelectListService(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setShowSelectListService(false)}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View style={{ backgroundColor: 'white', width: '80%', maxHeight: '80%', borderRadius: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.3)', height: windowHeight * 0.06, }}>
                                <FontAwesome name="search" color={Color.colorBlue} style={{ marginLeft: 10, fontSize: 20 }} />
                                <TextInput
                                    placeholder='Search...'
                                    onChangeText={text => setSearchQueryService(text)}
                                    style={{ paddingHorizontal: 10 }}
                                />
                                </View>
                                <ScrollView style={{ maxHeight: windowHeight * 0.5 }}>
                                {filteredServices.map((item, index) => (
                                    <TouchableOpacity key={item.key} onPress={() => handleSelectService(item)} style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.3)' }}>
                                        <Text style={{ paddingVertical: 10, paddingHorizontal: 20 }}>{item.name}</Text>
                                    </TouchableOpacity>
                                ))}
                                </ScrollView>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        </TouchableWithoutFeedback>
            );
        } else {
            return (
                null
            );
        }
    };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.colorWhite }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"always"}>
            <View style={{ flex: 1, marginHorizontal: windowWidth * 0.05, justifyContent: "center", flexDirection: "column"}}>
                
                <Pressable onPress={() => navigation.goBack()} style={styles.arrowContainer}>
                    <Image
                    style={styles.userroleChild}
                    contentFit="cover"
                    source={require("./../../assets/arrow-1.png")}
                    />
                </Pressable>

                <View style={{ marginVertical: windowHeight * 0.04 }}>
                    
                    <Text style={{
                        fontSize: windowWidth * 0.1,
                        fontWeight: 'bold',
                        marginVertical: windowHeight * 0.02,
                        color: Color.colorBlue
                        
                    }}>
                        Start
                        {"\n"}
                        {roleText}...
                    </Text>
                </View>
                
                <View style={{ marginBottom: windowHeight * 0.01 }}>
                    <Text style={{
                        fontSize: windowWidth * 0.05,
                        fontWeight: '400',
                        marginVertical: windowHeight * 0.01,
                        color: Color.colorBlue
                    }}>Birthdate</Text>
                    <TouchableOpacity onPress={() => {
                        setShowDatePicker(true);
                        if (!datePickerOpened) {
                            setBirthday(new Date());
                            setDatePickerOpened(true);
                        }
                    }}>
                       <View style={{
                        width: '100%',
                        height: windowHeight * 0.06,
                        borderColor: birthday === null || birthday === '' ? Color.colorBlue1 : birthdayVerify ? Color.colorGreen : Color.colorRed,
                        borderWidth: 1,
                        borderRadius: windowHeight * 0.015,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingLeft: windowWidth * 0.05,
                        paddingHorizontal: windowWidth * 0.14,
                        flexDirection: 'row'                   
                    }}>
                        <FontAwesome name="calendar" color = {birthday === null || birthday === '' ? Color.colorBlue1 : birthdayVerify ? Color.colorGreen : Color.colorRed} style={{marginRight: 5, fontSize: 24}} />
                        <TextInput
                            placeholder='MM/DD/YYYY'
                            placeholderTextColor={Color.colorBlue}
                            keyboardType='numeric'
                            style={{
                                width: "100%",
                            }}
                            value={birthday ? formattedBirthday: ''}
                            editable={false}
                            color={birthday === null || birthday === '' ? Color.colorBlack : birthdayVerify ? Color.colorBlack : Color.colorRed}
                            fontSize={windowWidth * 0.034}
                        />
                        {birthday < 1 ? null : birthdayVerify ? (
                            <Feather name="check-circle" color="green" size={24} style={{ position: "absolute", right: 12 }}/>
                        ) : (                                                                     
                                <Error name="error" color="red" size={24} style={{ position: "absolute", right: 12 }}/>
                        )}
                        </View>
                    </TouchableOpacity>
                    
                    {showDatePicker && (
                        <DateTimePicker
                            value={birthday || new Date()}
                            mode="date"
                            display="spinner"
                            onChange={handleDateChange}
                        />
                    )}
                    
                </View>
                    {birthday === null ? null : birthdayVerify ? null : (
                        <Text style={errorText}>You must be at least 18 years old to register.</Text>
                    )}

<View style={{ marginBottom: windowHeight * 0.01 }}>
                    <Text style={{
                        fontSize: windowWidth * 0.05,
                        fontWeight: '400',
                        marginVertical: windowHeight * 0.01,
                        color: Color.colorBlue
                    }}>Street Address Line 1</Text>
                    
                    <View style={{
                        width: '100%',
                        height: windowHeight * 0.06,
                        borderColor: streetAddress1 === null || streetAddress1 === '' ? Color.colorBlue1 : streetAddress1Verify ? Color.colorGreen : Color.colorRed,
                        borderWidth: 1,
                        borderRadius: windowHeight * 0.015,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingLeft: windowWidth * 0.05,
                        paddingHorizontal: windowWidth * 0.13,
                        flexDirection: 'row'
                    }}>
                        <FontAwesome name="home" color = {streetAddress1 === null || streetAddress1 === '' ? Color.colorBlue1 : streetAddress1Verify ? Color.colorGreen : Color.colorRed} style={{marginRight: 5, fontSize: 24}} />
                        <TextInput
                            placeholder='Enter street address'
                            placeholderTextColor={Color.colorBlue}
                            style={{
                                width: '100%'
                            }}
                            onChange={(e) => {
                                const streetAddress = e.nativeEvent.text;
                                setStreetAddress1(streetAddress);
                                setStreetAddress1Verify(streetAddress.length > 0 && streetAddress.length <= 25);
                            }}
                        />
                        {streetAddress1.length < 1 ? null : streetAddress1Verify ? (
                            <Feather name="check-circle" color="green" size={24} style={{ position: "absolute", right: 12 }}/>
                        ) : (                                                                     
                            <Error name="error" color="red" size={24} style={{ position: "absolute", right: 12 }}/>
                        )}
                    </View>
                    {streetAddress1.length < 1 ? null : streetAddress1Verify ? null : (
                        <Text style={errorText}>Street Address must not exceed 25 characters.</Text>
                    )}
                </View>
                
                <View style={{ marginBottom: windowHeight * 0.01 }}>
                    <Text style={{
                        fontSize: windowWidth * 0.05,
                        fontWeight: '400',
                        marginVertical: windowHeight * 0.01,
                        color: Color.colorBlue
                    }}>Street Address Line 2 (Optional)</Text>
                    
                    <View style={{
                        width: '100%',
                        height: windowHeight * 0.06,
                        borderColor: streetAddress2 === null || streetAddress2 === '' ? Color.colorBlue1 : streetAddress2 ? Color.colorGreen : Color.colorBlue1,
                        borderWidth: 1,
                        borderRadius: windowHeight * 0.015,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingLeft: windowWidth * 0.05,
                        paddingHorizontal: windowWidth * 0.13,
                        flexDirection: 'row'
                    }}>
                        <Error name="apartment" color={streetAddress2 === null || streetAddress2 === '' ? Color.colorBlue1 : streetAddress2 ? Color.colorGreen : Color.colorBlue1} style={{marginRight: 5, fontSize: 24}} />
                        <TextInput
                            placeholder='Apartment, suite, building, etc.'
                            placeholderTextColor={Color.colorBlue}
                            style={{
                                width: '100%'
                            }}
                            onChange={(e) => {
                                const streetAddress = e.nativeEvent.text;
                                setStreetAddress2(streetAddress);
                            }}
                        />
                        {streetAddress2 < 1 ? null : streetAddress2 ? (
                            <Feather name="check-circle" color="green" size={24} style={{ position: "absolute", right: 12 }}/>
                        ) : (                                                                     
                            null
                        )}
                    </View>
                </View>

                <TouchableWithoutFeedback onPress={() => setShowSelectListCity(false)}>
            <View style={{ marginBottom: windowHeight * 0.01 }}>
                <Text style={{
                    fontSize: windowWidth * 0.05,
                    fontWeight: '400',
                    marginVertical: windowHeight * 0.01,
                    color: Color.colorBlue,
                }}>City/Municipality</Text>
                <TouchableOpacity onPress={() => setShowSelectListCity(true)}>
                    <View style={{
                        width: '100%',
                        height: windowHeight * 0.06,
                        borderColor: selectedValueCity ? Color.colorGreen : Color.colorBlue1,
                        borderWidth: 1,
                        borderRadius: windowHeight * 0.015,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingLeft: windowWidth * 0.025,
                        paddingHorizontal: windowWidth * 0.14,
                        flexDirection: 'row'
                    }}>
                        <Error name="location-city" color = {selectedValueCity === null || selectedValueCity === '' ? Color.colorBlue1 : selectedValueCity ? Color.colorGreen : Color.colorBlue1} style={{marginRight: 5, fontSize: 24}}/>
                        <TextInput
                            placeholder='Select City/Municipality'
                            placeholderTextColor={Color.colorBlue}
                            value={selectedValueCity ? selectedValueCity.name : '' }
                            editable={false}
                            style={{ flex: 1 }}
                            color={selectedValueCity ? Color.colorBlack : Color.colorBlue}
                        />
                        {selectedValueCity ? (
                            <Feather name="check-circle" color="green" size={24} style={{ position: "absolute", right: 12 }}/>
                        ) : null}
                    </View>
                </TouchableOpacity>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showSelectListCity}
                    onRequestClose={() => setShowSelectListCity(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setShowSelectListCity(false)}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View style={{ backgroundColor: 'white', width: '80%', maxHeight: '80%', borderRadius: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.3)', height: windowHeight * 0.06, }}>
                                <FontAwesome name="search" color={Color.colorBlue} style={{ marginLeft: 10, fontSize: 20 }} />
                                <TextInput
                                    placeholder='Search...'
                                    onChangeText={text => setSearchQueryCity(text)}
                                    style={{ paddingHorizontal: 10 }}
                                />
                                </View>
                                <ScrollView style={{ maxHeight: windowHeight * 0.5 }}>
                                {filteredCities.map((item, index) => (
                                    <TouchableOpacity key={item.key} onPress={() => handleSelectCity(item)} style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.3)' }}>
                                        <Text style={{ paddingVertical: 10, paddingHorizontal: 20 }}>{item.name}</Text>
                                    </TouchableOpacity>
                                ))}
                                </ScrollView>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        </TouchableWithoutFeedback>

                {/* <View style={{ marginBottom: windowHeight * 0.01 }}>
                    <Text style={{
                        fontSize: windowWidth * 0.05,
                        fontWeight: '400',
                        marginVertical: windowHeight * 0.01,
                        color: Color.colorBlue
                    }}>State/Province/Region</Text>
                    
                    <View style={{
                        width: '100%',
                        height: windowHeight * 0.06,
                        borderColor: state === null || state === '' ? Color.colorBlue1 : stateVerify ? Color.colorGreen : Color.colorRed,
                        borderWidth: 1,
                        borderRadius: windowHeight * 0.015,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingLeft: windowWidth * 0.05,
                        paddingHorizontal: windowWidth * 0.13,
                        flexDirection: 'row'
                    }}>
                        <FontAwesome name="globe" color={state === null || state === '' ? Color.colorBlue1 : stateVerify ? Color.colorGreen : Color.colorRed} style={{marginRight: 5, fontSize: 24}} />
                        <TextInput
                            placeholder='Enter state, province, or region'
                            placeholderTextColor={Color.colorBlue}
                            style={{
                                width: '100%'
                            }}
                            onChange={(e) => {
                                const states = e.nativeEvent.text;
                                setState(states);
                                setStateVerify(states.length > 0 && states.length <= 25);
                            }}
                        />
                        {state.length < 1 ? null : stateVerify ? (
                            <Feather name="check-circle" color="green" size={24} style={{ position: "absolute", right: 12 }}/>
                        ) : (                                                                     
                            <Error name="error" color="red" size={24} style={{ position: "absolute", right: 12 }}/>
                        )}
                    </View>
                    {state.length < 1 ? null : stateVerify ? null : (
                        <Text style={errorText}>State/Province/Region must not exceed 25 characters.</Text>
                    )}
                </View>

                <View style={{ marginBottom: windowHeight * 0.01 }}>
                    <Text style={{
                        fontSize: windowWidth * 0.05,
                        fontWeight: '400',
                        marginVertical: windowHeight * 0.01,
                        color: Color.colorBlue
                    }}>Postal Code/ZIP Code</Text>
                    
                    <View style={{
                        width: '100%',
                        height: windowHeight * 0.06,
                        borderColor: postalCode === null || postalCode === '' ? Color.colorBlue1 : postalCodeVerify ? Color.colorGreen : Color.colorRed,
                        borderWidth: 1,
                        borderRadius: windowHeight * 0.015,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingLeft: windowWidth * 0.05,
                        paddingHorizontal: windowWidth * 0.13,
                        flexDirection: 'row'
                    }}>
                        <FontAwesome name="map-marker" color={postalCode === null || postalCode === '' ? Color.colorBlue1 : postalCodeVerify ? Color.colorGreen : Color.colorRed} style={{marginRight: 5, fontSize: 24}} />
                        <TextInput
                            placeholder='Enter postal code or ZIP code'
                            placeholderTextColor={Color.colorBlue}
                            style={{
                                width: '100%'
                            }}
                            keyboardType='numeric'
                            onChange={(e) => {
                                const enteredPostalCode = e.nativeEvent.text;
                                const isValidPostalCode = /^\d{4}$/.test(enteredPostalCode);
                                setPostalCode(enteredPostalCode);
                                setPostalCodeVerify(isValidPostalCode);
                            }}
                        />
                        {postalCode.length < 1 ? null : postalCodeVerify ? (
                            <Feather name="check-circle" color="green" size={24} style={{ position: "absolute", right: 12 }}/>
                        ) : (                                                                     
                            <Error name="error" color="red" size={24} style={{ position: "absolute", right: 12 }}/>
                        )}
                    </View>
                    {postalCode.length < 1 ? null : postalCodeVerify ? null : (
                         <Text style={errorText}>Postal Code/ZIP Code must be 4 digits long.</Text>
                    )}
                </View> */}

                <View style={{ marginBottom: windowHeight * 0.01 }}>
                    <Text style={{
                        fontSize: windowWidth * 0.05,
                        fontWeight: '400',
                        marginVertical: windowHeight * 0.01,
                        color: Color.colorBlue
                    }}>Mobile Number</Text>

                    <View style={{
                        width: '100%',
                        height: windowHeight * 0.06,
                        borderColor: mobile === null || mobile.length <= 3 ? Color.colorBlue1 : mobileVerify ? Color.colorGreen : Color.colorRed,
                        borderWidth: 1,
                        borderRadius: windowHeight * 0.015,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingLeft: windowWidth * 0.05,
                        paddingHorizontal: windowWidth * 0.13,
                        flexDirection: 'row'
                    }}>
                        <FontAwesome name="phone" color={mobile === null || mobile.length <= 3 ? Color.colorBlue1 : mobileVerify ? Color.colorGreen : Color.colorRed} style={{ marginRight: 5, fontSize: 24}} />
                        <TextInput
                        placeholder='+63'
                        placeholderTextColor={Color.colorBlue1}
                        keyboardType='numeric'
                        style={{
                            width: "12%",
                            borderRightWidth: 1,
                            borderColor: mobile === null || mobile.length <= 3 ? Color.colorBlue1 : mobileVerify ? Color.colorGreen : Color.colorRed,
                            height: "100%",
                        }}
                        color={mobile === null || mobile.length <= 3 ? Color.colorBlue1 : mobileVerify ? Color.colorGreen : Color.colorRed}
                        defaultValue='+63'
                        editable={false}
                        />
                        <TextInput
                            placeholder='Enter your phone number'
                            placeholderTextColor={Color.colorBlue}
                            keyboardType='numeric'
                            style={{
                                width: "80%",
                                marginRight: 10,
                                left: 10
                            }}
                            onChangeText={(text) => {
                                const formattedMobile = "+63" + text;
                                setMobile(formattedMobile);
                                setMobileVerify(text.length > 1 && /^(\+63[89])[0-9]{9}$/.test(formattedMobile));
                            }}
                        />
                        {mobile.length < 4 ? null : mobileVerify ? (
                            <Feather name="check-circle" color="green" size={24} style={{ position: "absolute", right: 12 }}/>
                        ) : (
                            <Error name="error" color="red" size={24} style={{ position: "absolute", right: 12 }}/>
                        )}
                    </View>
                    {mobile.length < 4 ? null : mobileVerify ? null : (
                        <Text style={errorText}>Please enter a valid Philippine mobile number in the format +63*********.</Text>
                    )}
                </View>

                {renderButton()}

                <Button
                    title="Submit"
                    onPress={handleSubmit}
                    filled
                    Color={Color.colorWhite}
                    style={{
                        marginTop: windowHeight * 0.02,
                        marginBottom: windowHeight * 0.05,
                    }}
                    disabled={!validateFields()}
                />

            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    arrowContainer: {
        top: windowHeight * 0.03,
        left: windowWidth * 0.01,
        zIndex: 2,
    },
    userroleChild: {
        top: windowHeight * 0.001,
        left: windowWidth * 0.001,
        maxHeight: "100%",
        width: windowWidth * 0.07,
        zIndex: 1,
    },
    datePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: windowHeight * 0.015,
        height: windowHeight * 0.045,
    },
})
