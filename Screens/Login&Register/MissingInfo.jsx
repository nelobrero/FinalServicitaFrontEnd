import { View, Text, TextInput, TouchableOpacity, Image, Pressable, Dimensions, ScrollView, Alert, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { Color, errorText } from '../../GlobalStyles';
import Button from '../../components/Button';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import Error from '@expo/vector-icons/MaterialIcons';
import Material from '@expo/vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

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
    const [mobile, setMobile] = useState('+63');
    const [mobileVerify, setMobileVerify] = useState(false);
    const [selectedValueService, setSelectedValueService] = useState(null);
    const [showSelectListService, setShowSelectListService] = useState(false);
    const [searchQueryService, setSearchQueryService] = useState('');
    const [selectedValueCity, setSelectedValueCity] = useState(null);
    const [showSelectListCity, setShowSelectListCity] = useState(false);
    const [searchQueryCity, setSearchQueryCity] = useState('');
    const [selectedBarangay, setSelectedBarangay] = useState(null);
    const [showSelectBarangay, setShowSelectBarangay] = useState(false);
    const [searchQueryBarangay, setSearchQueryBarangay] = useState('');
    
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
    const filteredBarangays = selectedValueCity ? selectedValueCity.barangays.filter(item => item.toLowerCase().includes(searchQueryBarangay.toLowerCase())) : [];
    

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
            return birthdayVerify && streetAddress1Verify && selectedValueCity && selectedBarangay && mobileVerify && selectedValueService;
        } else {
            return birthdayVerify && streetAddress1Verify && selectedValueCity && selectedBarangay && mobileVerify;
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

    const handleSelectCity = (city) => {
        setSelectedValueCity(city);
        if (selectedBarangay && !city.barangays.includes(selectedBarangay)) {
            setSelectedBarangay(null);
        }
        setShowSelectListCity(false);
    };

    const handleSelectBarangay = (barangay) => {
        setSelectedBarangay(barangay);
        setShowSelectBarangay(false);
    };

    const saveTempDetails = async () => {
        try {
            let userData;
    
            if (role === 'Seeker') {
                userData = {
                    email,
                    mobile,
                    password: userId,
                    role,
                    name: {
                        firstName: name,
                        lastName: ""
                    },
                    address: {
                        streetAddress1: streetAddress1,
                        streetAddress2: streetAddress2,
                        cityMunicipality: selectedValueCity.name,
                        barangay: selectedBarangay
                    },
                    birthDate: formattedBirthday,
                };
            } else {
                userData = {
                    email,
                    mobile,
                    password: userId,
                    role,
                    name: {
                        firstName: name,
                        lastName: ""
                    },
                    address: {
                        streetAddress1: streetAddress1,
                        streetAddress2: streetAddress2,
                        cityMunicipality: selectedValueCity.name,
                        barangay: selectedBarangay
                    },
                    birthDate: formattedBirthday,
                    service: [],
                };
            }

            if (services && services.length > 0) {
                userData.service = services.map(service => ({
                    serviceId: generateServiceId(),
                    type: service.selectedValue.name,
                    name: service.serviceName,
                    description: service.description,
                    price: service.price,
                    availability: service.availability.map(slot => ({
                        day: slot.day,
                        startTime: slot.startTime,
                        endTime: slot.endTime
                    }))
                }));
            }

            axios.post("http://192.168.1.14:5000/user/addTempDetails", userData).then(async (res) => {
                const result = res.data;
                const { data, message, status } = result
                if (status === 'SUCCESS') {
                    console.log('Temporary details saved successfully:', data);
                } else {
                    console.error('Error saving temporary details:', message);
                }
            })
        } catch (error) {
            console.error('Error saving temporary details:', error);
        }
            
    }

    const handleSubmit = async () => {
        try {
            await saveTempDetails();
            Alert.alert('Verification', 'You will be redirected to the mobile verification screen.', [{ text: 'OK', onPress: () => navigation.navigate('VerificationScreen', { email }) }]);
        } catch (error) {
            console.error('Error saving temporary details:', error);
        }
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
                
        {selectedValueCity ? (
                     <TouchableWithoutFeedback onPress={() => setShowSelectBarangay(false)}>
                     <View style={{ marginBottom: windowHeight * 0.01 }}>
                         <Text style={{
                             fontSize: windowWidth * 0.05,
                             fontWeight: '400',
                             marginVertical: windowHeight * 0.01,
                             color: Color.colorBlue,
                         }}>Barangay</Text>
                         <TouchableOpacity onPress={() => setShowSelectBarangay(true)}>
                             <View style={{
                                 width: '100%',
                                 height: windowHeight * 0.06,
                                 borderColor: selectedBarangay ? Color.colorGreen : Color.colorBlue1,
                                 borderWidth: 1,
                                 borderRadius: windowHeight * 0.015,
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 paddingLeft: windowWidth * 0.025,
                                 paddingHorizontal: windowWidth * 0.14,
                                 flexDirection: 'row'
                             }}>
                                 <Material name="town-hall" color = {selectedBarangay === null || selectedBarangay === '' ? Color.colorBlue1 : selectedBarangay ? Color.colorGreen : Color.colorBlue1} style={{marginRight: 5, fontSize: 24}}/>
                                 <TextInput
                                     placeholder='Select Barangay'
                                     placeholderTextColor={Color.colorBlue}
                                     value={selectedBarangay ? selectedBarangay: '' }
                                     editable={false}
                                     style={{ flex: 1 }}
                                     color={selectedBarangay ? Color.colorBlack : Color.colorBlue}
                                 />
                                 {selectedBarangay ? (
                                     <Feather name="check-circle" color="green" size={24} style={{ position: "absolute", right: 12 }}/>
                                 ) : null}
                             </View>
                         </TouchableOpacity>
         
                         <Modal
                             animationType="slide"
                             transparent={true}
                             visible={showSelectBarangay}
                             onRequestClose={() => setShowSelectBarangay(false)}
                         >
                             <TouchableWithoutFeedback onPress={() => setShowSelectBarangay(false)}>
                                 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                     <View style={{ backgroundColor: 'white', width: '80%', maxHeight: '80%', borderRadius: 10 }}>
                                         <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.3)', height: windowHeight * 0.06, }}>
                                         <FontAwesome name="search" color={Color.colorBlue} style={{ marginLeft: 10, fontSize: 20 }} />
                                         <TextInput
                                             placeholder='Search...'
                                             onChangeText={text => setSearchQueryBarangay(text)}
                                             style={{ paddingHorizontal: 10 }}
                                         />
                                         </View>
                                         <ScrollView style={{ maxHeight: windowHeight * 0.5 }}>
                                         {filteredBarangays.map((item, index) => (
                                             <TouchableOpacity key={item} onPress={() => handleSelectBarangay(item)} style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.3)' }}>
                                                 <Text style={{ paddingVertical: 10, paddingHorizontal: 20 }}>{item}</Text>
                                             </TouchableOpacity>
                                         ))}
                                         </ScrollView>
                                     </View>
                                 </View>
                             </TouchableWithoutFeedback>
                         </Modal>
                     </View>
                 </TouchableWithoutFeedback>
                ) : null}

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
