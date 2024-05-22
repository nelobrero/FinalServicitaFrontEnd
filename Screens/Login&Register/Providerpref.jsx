import { View, Text, TextInput, TouchableOpacity, Image, Pressable, Dimensions, ScrollView, Alert, StyleSheet, Modal, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { Color, errorText } from "../../GlobalStyles"; 
import Button from '../../components/Button';
import axios from 'axios';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import Error from '@expo/vector-icons/MaterialIcons';
import { Fab, Icon, Center, NativeBaseProvider } from "native-base";
import { AntDesign } from '@expo/vector-icons';
import Task from '../../components/Task';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ProviderPreferencePage ({navigation, route, props}) {
    
    const { firstName, lastName, email, role, streetAddress1, streetAddress2, city, barangay, birthDate, mobile, password } = route.params;
    const [birthday, setBirthday] = useState('');
    const [selectedValue, setSelectedValue] = useState(null);
    const [showSelectList, setShowSelectList] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
    const [serviceItems, setServiceItems] = useState([]);
    const [serviceName, setServiceName] = useState('');
    const [serviceNameVerify, setServiceNameVerify] = useState(false);
    const [serviceDescription, setServiceDescription] = useState('');
    const [serviceDescriptionVerify, setServiceDescriptionVerify] = useState(false);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [priceVerify, setPriceVerify] = useState(false);
    const [dynamicMinMarkerOverlapDistance, setDynamicMinMarkerOverlapDistance] = useState(0);
    const [inputHeight, setInputHeight] = useState(windowHeight * 0.06);
    const priceGap = 300
    const [showSeeMoreModal, setShowSeeMoreModal] = useState(false);
    const [key, setKey] = useState('');
   ;
    
    const validateName = (name, setName, setNameVerify, limit) => {
        setName(name);
        const trimmedName = name.trim();
        setNameVerify(trimmedName && trimmedName.length <= limit)
      };

    const [defaultServiceAvailability] = useState([
        { day: 'Monday', startTime: '', endTime: '', startTimeValue: 0, endTimeValue: 0, flagAvailable: false },
        { day: 'Tuesday', startTime: '', endTime: '', startTimeValue: 0, endTimeValue: 0, flagAvailable: false },
        { day: 'Wednesday', startTime: '', endTime: '', startTimeValue: 0, endTimeValue: 0, flagAvailable: false },
        { day: 'Thursday', startTime: '', endTime: '', startTimeValue: 0, endTimeValue: 0, flagAvailable: false },
        { day: 'Friday', startTime: '', endTime: '', startTimeValue: 0, endTimeValue: 0, flagAvailable: false },
        { day: 'Saturday', startTime: '', endTime: '', startTimeValue: 0, endTimeValue: 0, flagAvailable: false },
        { day: 'Sunday', startTime: '', endTime: '', startTimeValue: 0, endTimeValue: 0, flagAvailable: false }
    ]);

    const [serviceAvailability, setServiceAvailability] = useState([
        { day: 'Monday', startTime: '', endTime: '', startTimeValue: 0, endTimeValue: 0, flagAvailable: false },
        { day: 'Tuesday', startTime: '', endTime: '', startTimeValue: 0, endTimeValue: 0, flagAvailable: false },
        { day: 'Wednesday', startTime: '', endTime: '', startTimeValue: 0, endTimeValue: 0, flagAvailable: false },
        { day: 'Thursday', startTime: '', endTime: '', startTimeValue: 0, endTimeValue: 0, flagAvailable: false },
        { day: 'Friday', startTime: '', endTime: '', startTimeValue: 0, endTimeValue: 0, flagAvailable: false },
        { day: 'Saturday', startTime: '', endTime: '', startTimeValue: 0, endTimeValue: 0, flagAvailable: false },
        { day: 'Sunday', startTime: '', endTime: '', startTimeValue: 0, endTimeValue: 0, flagAvailable: false }
    ]);

    

    const [timeOptions] = useState([
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

    const [showPickerStart, setShowPickerStart] = useState(false);
    const [showPickerEnd, setShowPickerEnd] = useState(false);
    const [selectedDayIndex, setSelectedDayIndex] = useState(null);

    useEffect(() => {
        convertDate(birthDate);
    }, [birthDate]);

    const [data, setData] = useState([]);

    //take into account the search query and if the type of service is already in the submitted services
    const [submittedServiceTypes, setSubmittedServiceTypes] = useState([]);
    

    useEffect(() => {
        fetchServices();
    }, [showServiceModal]);

    const handleAddService = () => {
        closeServiceModal();
        setServiceItems([...serviceItems, { type: selectedValue.name, name: serviceName, description: serviceDescription, minprice: minPrice, maxprice: maxPrice, availability: serviceAvailability, key: generateServiceId() }]);
        setSubmittedServiceTypes([...submittedServiceTypes, selectedValue.name]);
        setServiceName('');
        setServiceDescription('');
        setMinPrice(0);
        setMaxPrice(1000);
        setSelectedValue(null);
        setServiceAvailability([
            { day: 'Monday', startTime: '', endTime: '', startTimeValue: 0, endTimeValue: 0, flagAvailable: false },
            { day: 'Tuesday', startTime: '', endTime: '', startTimeValue: 0, endTimeValue: 0, flagAvailable: false },
            { day: 'Wednesday', startTime: '', endTime: '', startTimeValue: 0, endTimeValue: 0, flagAvailable: false },
            { day: 'Thursday', startTime: '', endTime: '', startTimeValue: 0, endTimeValue: 0, flagAvailable: false },
            { day: 'Friday', startTime: '', endTime: '', startTimeValue: 0, endTimeValue: 0, flagAvailable: false },
            { day: 'Saturday', startTime: '', endTime: '', startTimeValue: 0, endTimeValue: 0, flagAvailable: false },
            { day: 'Sunday', startTime: '', endTime: '', startTimeValue: 0, endTimeValue: 0, flagAvailable: false }
    ]);
        setKey('');
      }
    
      const handleRemoveService = (index) => {
        const updatedServiceItems = [...serviceItems];
        const updatedSubmittedServiceTypes = [...submittedServiceTypes];
        updatedSubmittedServiceTypes.splice(index, 1);
        updatedServiceItems.splice(index, 1);
        setSubmittedServiceTypes(updatedSubmittedServiceTypes);
        setServiceItems(updatedServiceItems);
        closeShowSeeMoreModal();
      }

      const filteredData = data.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()) && !submittedServiceTypes.includes(item.name));

      const areArraysEqual = (arr1, arr2) => {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i].day !== arr2[i].day || arr1[i].startTime !== arr2[i].startTime || arr1[i].endTime !== arr2[i].endTime || arr1[i].flagAvailable !== arr2[i].flagAvailable) {
                return false;
            }
        }
        return true;
    };

    const validateAvailabilityValues = () => {
        let isValid = true;
        serviceAvailability.forEach((day) => {
            if (day.flagAvailable) {
                if (day.startTime === '' || day.endTime === '') {
                    isValid = false;
                } else if (timeOptions.find((option) => option.value === day.startTime).numValue >= timeOptions.find((option) => option.value === day.endTime).numValue) {
                    isValid = false;
                }
            }
        });
        return isValid;
    }

    const renderErrorTextPerDay = (day) => {
        if (day.flagAvailable) {
            if (day.startTime === '' || day.endTime === '') {
                    if ((day.startTime !== '' && day.endTime === '' ) || (day.startTime === '' && day.endTime !== '')) {
                        return <Text style={errorText}>Please fill in the missing details</Text>;
                    }
            } else if (timeOptions.find((option) => option.value === day.startTime).numValue >= timeOptions.find((option) => option.value === day.endTime).numValue) {
                return <Text style={errorText}>End time must be later than start time</Text>;
            }
        }
        return null;
    }

    const renderErrorPerDay = (day) => {
        if (day.flagAvailable) {
            if (day.startTime === '' || day.endTime === '') {
                if ((day.startTime !== '' && day.endTime === '' ) || (day.startTime === '' && day.endTime !== '')) {
                    return true;
                }
            } else if (timeOptions.find((option) => option.value === day.startTime).numValue >= timeOptions.find((option) => option.value === day.endTime).numValue) {
                return true;
            }
        }
        return false;
    }

    const handleChangeStartTime = (value, numValue) => {
        const updatedAvailability = [...serviceAvailability];
        updatedAvailability[selectedDayIndex].startTime = value;
        updatedAvailability[selectedDayIndex].startTimeValue = numValue;
        setServiceAvailability(updatedAvailability);
        setShowPickerStart(false);
    }

    const handleChangeEndTime = (value, numValue) => {
        const updatedAvailability = [...serviceAvailability];
        updatedAvailability[selectedDayIndex].endTime = value;
        updatedAvailability[selectedDayIndex].endTimeValue = numValue;
        setServiceAvailability(updatedAvailability);
        setShowPickerEnd(false);
    }


      const showMore = (index) => {
        const { type, name, description, minprice, maxprice, availability, key } = serviceItems[index];
        setSelectedValue({ name: type });
        setServiceName(name);
        setServiceDescription(description);
        setMinPrice(minprice);
        setMaxPrice(maxprice);
        setServiceAvailability(availability);
        setKey(key);
        setShowSeeMoreModal(true);
        setShowServiceModal(true);
      }

    function generateServiceId() {
        const timestamp = new Date().getTime().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        const moreRandom = Math.random().toString(36).substr(2, 5);
        const serviceId = timestamp + random + moreRandom;
        return serviceId;
    }
    
    useEffect(() => {
        setPriceVerify(minPrice > 0 && maxPrice - minPrice >= priceGap);
    }, [minPrice, maxPrice]);

    const handleValuesChange = (values) => {
        let [newMinPrice, newMaxPrice] = values;
    
        const numberOfSteps = ((1000 - 0) / priceGap);
        
        const dynamicMinMarkerOverlapDistance = (windowWidth * 0.8) / numberOfSteps;
    
        setMinPrice(newMinPrice);
        setMaxPrice(newMaxPrice);
    
        setDynamicMinMarkerOverlapDistance(dynamicMinMarkerOverlapDistance);
        setPriceVerify(maxPrice > minPrice && maxPrice - minPrice >= priceGap);
    };

    const closeShowSeeMoreModal = () => {
        setShowSeeMoreModal(false);
        setShowServiceModal(false);
        setServiceName('');
        setServiceDescription('');
        setMinPrice(0);
        setMaxPrice(1000);
        setSelectedValue(null);
        setServiceAvailability([
            { day: 'Monday', startTime: '', endTime: '', startTimeValue: 0, endTimeValue: 0, flagAvailable: false },
            { day: 'Tuesday', startTime: '', endTime: '', startTimeValue: 0, endTimeValue: 0, flagAvailable: false },
            { day: 'Wednesday', startTime: '', endTime: '', startTimeValue: 0, endTimeValue: 0, flagAvailable: false },
            { day: 'Thursday', startTime: '', endTime: '', startTimeValue: 0, endTimeValue: 0, flagAvailable: false },
            { day: 'Friday', startTime: '', endTime: '', startTimeValue: 0, endTimeValue: 0, flagAvailable: false },
            { day: 'Saturday', startTime: '', endTime: '', startTimeValue: 0, endTimeValue: 0, flagAvailable: false },
            { day: 'Sunday', startTime: '', endTime: '', startTimeValue: 0, endTimeValue: 0, flagAvailable: false }
        ]);
        setKey('');
    }

    const handleEditService = () => {
        const updatedServiceItems = [...serviceItems];
        const index = updatedServiceItems.findIndex((item) => item.key === key);
        updatedServiceItems[index] = { type: selectedValue.name, name: serviceName, description: serviceDescription, minprice: minPrice, maxprice: maxPrice, availability: serviceAvailability, key: key };
        setServiceItems(updatedServiceItems);
        closeShowSeeMoreModal();
    }

    const openServiceModal = () => {
        setShowServiceModal(true);
    };

    const closeServiceModal = () => {
        setShowServiceModal(false);
    };

    const openPriceModal = () => {
        setShowPriceModal(true);
    }

    const closePriceModal = () => {
        setShowPriceModal(false);
    }

    const Example = () => {
        return <Center>
              <Fab  renderInPortal={false} shadow={15} size={windowHeight * 0.073} icon={<Icon color="white" as={AntDesign} name="plus" size="sm" />} placement='center' onPress={openServiceModal}  />
          </Center>;
      };

    const fetchServices = async () => {
        try {
            const response = await axios.get('http://192.168.1.7:5000/service/getServices');
            setData(response.data.data);
            
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };
    
    const handleSelect = (value) => {
        setSelectedValue(value);
        setShowSelectList(false);
    };

    const convertDate = (date) => {
        try {
            const dateParts = date.split('/');
            const month = parseInt(dateParts[0], 10);
            const day = parseInt(dateParts[1], 10);
            const year = parseInt(dateParts[2], 10);
            const birthdayDate = new Date(year, month - 1, day)
            setBirthday(birthdayDate);
        } catch (error) {
            console.error('Error converting date:', error);
        }
    }

    const saveTempDetails = async () => {
        try{
            let userData = { 
                email: email,
                mobile: mobile,
                password: password,
                role: role,
                name: {
                    firstName: firstName,
                    lastName: lastName
                },
                address: {
                    streetAddress1: streetAddress1,
                    streetAddress2: streetAddress2,
                    cityMunicipality: city,
                    barangay: barangay
                },
                birthDate: birthDate,
                services: [],
                
            }

            serviceItems.forEach((item) => {
                const service = {
                    serviceId: item.key,
                    serviceType: item.type,
                    name: item.name,
                    description: item.description,
                    price: {
                        min : item.minprice,
                        max : item.maxprice
                    },
                    availability: item.availability
                }
                userData.services.push(service);
            });

            await axios.post("http://192.168.1.7:5000/user/addTempDetails", userData).then(async (res) => {
                const result = res.data;
                const { data, message, status } = result
                if (status === 'SUCCESS') {
                    console.log('Temporary details saved successfully:', data);
                } else {
                    console.error('Error saving temporary details:', message);
                }
            })
        } catch (error) {
            if (error.response.data.message === "Temporary user already exists with the given email.") {
                Alert.alert('Error', 'Email has recently been verified but has not finished the registration process yet.', [{ text: 'OK'}]);
            } else if (error.response.data.message === "Temporary user already exists with the given mobile number.") {
                Alert.alert('Error', 'A user with this mobile number is currently undergoing the registration process.', [{ text: 'OK' }]);
            } else if (error.response.data.message === "User already exists with the given email.") { 
                Alert.alert('Error', 'An account with this email already exists.', [{ text: 'OK' }]);
            } else if (error.response.data.message === "User already exists with the given mobile number.") { 
                Alert.alert('Error', 'An account with this mobile number already exists.', [{ text: 'OK'}]);
            } else {
                Alert.alert('Error', 'An error occurred while trying to sign up. Please try again.', [{ text: 'OK' }]);
                console.error('Error saving temporary details:', error);
            }
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

  return (
    
    <SafeAreaView style={{flex: 1, backgroundColor: Color.colorWhite}}>
                
                <View style={{ flexDirection: 'column', justifyContent: 'flex-start'}}>
                            <Pressable onPress={() => navigation.goBack()} style={styles.arrowContainer}>
                                            <Image
                                            style={styles.userroleChild}
                                            contentFit="cover"
                                            source={require("./../../assets/arrow-1.png")}
                                            />
                            </Pressable>
                            
                        </View>
                        <View style={{ marginVertical: windowHeight * 0.04 }}>
                    
                    <Text style={{
                        fontSize: windowWidth * 0.1,
                        fontWeight: 'bold',
                        marginVertical: windowHeight * 0.02,
                        color: Color.colorBlue,
                        marginLeft: windowWidth * 0.05,
                        
                    }}>
                        Start
                        {"\n"}
                        Servicing...
                    </Text>
                </View>
                    <View style={styles.container}>
                            
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"always"}>
                        <View style={styles.tasksWrapper}>
                            {
                                serviceItems.length === 0 ? (
                                    <Text style={{ 
                                        fontSize: windowWidth * 0.05,
                                        fontWeight: 'bold',
                                        color: 'rgba(0, 0, 0, 0.3)',
                                        textAlign: 'center',
                                        marginVertical: windowHeight * 0.04,
                                        top: windowHeight * 0.17
                                    }}>Click the button below to add your service/s</Text>
                                ) : null
                            }
                            <View style={styles.items}>
                              {
                               

                                serviceItems.map((item, index) => {
                                    return (
                                    

                                    <TouchableOpacity key={index}  onPress={() => showMore(index)}>
                                        <Task text={item.name} /> 
                                    </TouchableOpacity>
                                )
                                })
                            }
                            </View>
                        </View>
                        </ScrollView>

                        
                        
                        <Modal animationType="slide" transparent={true} visible={showServiceModal} onRequestClose={closeServiceModal}>
                        
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            
                        <View style={{ backgroundColor: 'white', width: '90%', maxHeight: '80%', borderRadius: 10, }}>
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"always"}>
                            <View flexDirection='row' style={{ borderBottomColor: Color.colorBlue, borderBottomWidth: 1, alignItems: 'center', justifyContent: 'space-between', marginVertical: windowHeight * 0.01 }}>   
                            <Text style={{
                                    fontSize: windowWidth * 0.06,
                                    fontWeight: '400',
                                    marginVertical: windowHeight * 0.01,
                                    color: Color.colorBlue,
                                    marginLeft: windowWidth * 0.05 
                                }}>Service Details</Text>
                            <AntDesign style = {{ marginRight: windowWidth * 0.05 }} name="close" size= {windowWidth * 0.06} color={Color.colorBlue} onPress={() => showSeeMoreModal ? closeShowSeeMoreModal() : closeServiceModal()} />
                            </View>
                            <View style={{ marginHorizontal: windowWidth * 0.05, marginBottom: windowHeight * 0.01 }}>
                    
                        
                            <TouchableOpacity onPress={() => setShowSelectList(true)} disabled={showSeeMoreModal}>

                                
                        <View style={{
                            height: windowHeight * 0.06,
                            borderColor: !selectedValue ? Color.colorBlue1 : showSeeMoreModal ? Color.colorDarkGrey : Color.colorGreen,
                            borderWidth: 1,
                            borderRadius: windowHeight * 0.015,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingLeft: windowWidth * 0.025,
                            paddingHorizontal: windowWidth * 0.14,
                            flexDirection: 'row',
                            marginTop: windowHeight * 0.01,
                            backgroundColor: showSeeMoreModal ? Color.colorGray : Color.colorWhite
                        }}>
                            <FontAwesome name="bell" color = {selectedValue === null || selectedValue === '' ? Color.colorBlue1 : selectedValue ? showSeeMoreModal ? Color.colorDarkGrey : Color.colorGreen : Color.colorRed} style={{marginRight: 5, fontSize: 24}}/>
                            <TextInput
                                placeholder='Select service type...'
                                placeholderTextColor={Color.colorBlue}
                                value={selectedValue ? selectedValue.name : ''}
                                editable={false}
                                style={{ flex: 1 }}
                                color={!selectedValue ? Color.colorBlue: showSeeMoreModal ? Color.colorDarkGrey : Color.colorBlack}  
                            />
                            {selectedValue ? (
                                <Feather name="check-circle" color={showSeeMoreModal ? Color.colorDarkGrey : "green"} size={24} style={{ position: "absolute", right: 12 }}/>
                            ) : null}
                        </View>
                                    
                    </TouchableOpacity>
                    </View>
                    <View style={{ marginHorizontal: windowWidth * 0.05, marginBottom: windowHeight * 0.01 }}>
                                
                        <View style={{
                            height: windowHeight * 0.06,
                            borderColor: serviceName === null || serviceName === '' ? Color.colorBlue1 : serviceNameVerify ? Color.colorGreen : Color.colorRed,
                            borderWidth: 1,
                            borderRadius: windowHeight * 0.015,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingLeft: windowWidth * 0.025,
                            paddingHorizontal: windowWidth * 0.17,
                            flexDirection: 'row',
                            marginTop: windowHeight * 0.01
                        }}>
                            <FontAwesome name="bell-o" color = {serviceName === null || serviceName === '' ? Color.colorBlue1 : serviceNameVerify ? Color.colorGreen : Color.colorRed} style={{ marginLeft: windowWidth * 0.07,fontSize: 24}}/>
                            <TextInput
                                placeholder='Service Name'
                                placeholderTextColor={Color.colorBlue}
                                style={{
                                    width: '100%',
                                    marginLeft: windowWidth * 0.01,
                                }}
                                value={serviceName}
                                onChangeText={(text) => validateName(text, setServiceName, setServiceNameVerify, 25)}
                            />
                            {serviceName.length < 1 ? null : serviceNameVerify ? (
                            <Feather name="check-circle" color="green" size={24} style={{ position: "absolute", right: 12 }}/>
                        ) : (
                            <Error name="error" color="red" size={24} style={{ position: "absolute", right: 12 }}/>
                        )}
                        </View>
                        {serviceName.length < 1 ? null : serviceNameVerify? null : (
                        <Text style={errorText}>Service name must not exceed more than 25 characters</Text>
                        )}

                        
                    </View>

                    <View style={{ marginHorizontal: windowWidth * 0.05, marginBottom: windowHeight * 0.01 }}>
                                
                        <View style={{
                           
                            height: inputHeight,
                            borderColor: serviceDescription === null || serviceDescription === '' ? Color.colorBlue1 : serviceDescriptionVerify ? Color.colorGreen : Color.colorRed,
                            borderWidth: 1,
                            borderRadius: windowHeight * 0.015,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingLeft: windowWidth * 0.025,
                            paddingHorizontal: windowWidth * 0.17,
                            flexDirection: 'row',
                            marginTop: windowHeight * 0.01
                        }}>
                            <Entypo name="text" color = {serviceDescription === null || serviceDescription === '' ? Color.colorBlue1 : serviceDescriptionVerify ? Color.colorGreen : Color.colorRed} style={{ marginLeft: windowWidth * 0.07,fontSize: 24}}/>
                            <TextInput
                                ref={input => { this.textInput = input }}
                                multiline={true}
                                placeholder='Description'
                                placeholderTextColor={Color.colorBlue}
                                style={{
                                    width: '100%',
                                    height: inputHeight,
                                    marginLeft: windowWidth * 0.01,
                                }}
                                value={serviceDescription}
                                onChange={(e) => validateName(e.nativeEvent.text, setServiceDescription, setServiceDescriptionVerify, 100)}
                                onContentSizeChange={(e) => {
                                    setInputHeight(Math.max(windowHeight * 0.06, e.nativeEvent.contentSize.height));
                                }}
                            />
                            {serviceDescription.length < 1 ? null : serviceDescriptionVerify ? (
                            <Feather name="check-circle" color="green" size={24} style={{ position: "absolute", right: 12 }}/>
                        ) : (
                            <Error name="error" color="red" size={24} style={{ position: "absolute", right: 12 }}/>
                        )}
                        </View>
                        {serviceDescription.length < 1 ? null : serviceDescriptionVerify? null : (
                        <Text style={errorText}>Description must not exceed more than 100 characters.</Text>
                        )}

                    </View>
                    <View style={{ marginHorizontal: windowWidth * 0.05, marginBottom: windowHeight * 0.01 }}>
                                
                                
                            <TouchableOpacity onPress={() => openPriceModal()}>
                                
                        <View style={{
                            height: windowHeight * 0.06,
                            borderColor: minPrice === 0 ? Color.colorBlue1 : priceVerify ? Color.colorGreen : Color.colorRed,
                            borderWidth: 1,
                            borderRadius: windowHeight * 0.015,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingLeft: windowWidth * 0.025,
                            paddingHorizontal: windowWidth * 0.14,
                            flexDirection: 'row',
                            marginTop: windowHeight * 0.01
                        }}>
                            <FontAwesome name="money" color = {minPrice === 0 ? Color.colorBlue1 : priceVerify ? Color.colorGreen : Color.colorRed} style={{marginRight: 5, fontSize: 24}}/>
                            <TextInput
                                placeholder='Select price range...'
                                placeholderTextColor={Color.colorBlue}
                                value={minPrice > 0 ? `₱ ${minPrice.toString()} - ₱ ${maxPrice.toString()}` : ''}
                                editable={false}
                                style={{ flex: 1 }}
                                color={minPrice === 0 ? Color.colorBlue1 : priceVerify ? Color.colorBlack : Color.colorRed}
                            />
                            {minPrice === 0 ? null : priceVerify ? (
                            <Feather name="check-circle" color="green" size={24} style={{ position: "absolute", right: 12 }}/>
                        ) : (                                                                     
                            <Error name="error" color="red" size={24} style={{ position: "absolute", right: 12 }}/>
                        )}
                        </View>
                        {minPrice === 0 ? null : priceVerify ? null : (
                                <Text style={errorText}>Price range must be at least ₱300</Text>
                            )}
                                    
                    </TouchableOpacity>
                    </View>

                    <View style={{ marginHorizontal: windowWidth * 0.05, marginBottom: windowHeight * 0.01 }}>
                                
                                
                            <TouchableOpacity onPress={() => setShowAvailabilityModal(true)}>
                                
                        <View style={{
                            height: windowHeight * 0.06,
                            
                            borderColor: areArraysEqual(serviceAvailability, defaultServiceAvailability) ? Color.colorBlue1 : validateAvailabilityValues() ? Color.colorGreen : Color.colorRed,
                            borderWidth: 1,
                            borderRadius: windowHeight * 0.015,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingLeft: windowWidth * 0.025,
                            paddingHorizontal: windowWidth * 0.14,
                            flexDirection: 'row',
                            marginTop: windowHeight * 0.01
                        }}>
                            <FontAwesome name="clock-o" color = {areArraysEqual(serviceAvailability, defaultServiceAvailability) ? Color.colorBlue1 : validateAvailabilityValues() ? Color.colorGreen : Color.colorRed} style={{marginRight: 5, fontSize: 24}}/>
                            <TextInput
                                placeholder='Set service availability...'
                                placeholderTextColor={Color.colorBlue}
                                value={areArraysEqual(serviceAvailability, defaultServiceAvailability) ? '' : 'Configure availability...'}
                                editable={false}
                                style={{ flex: 1 }}
                                color={Color.colorBlack}
                            />
                            {areArraysEqual(serviceAvailability, defaultServiceAvailability) ? null : validateAvailabilityValues() ? (
                            <Feather name="check-circle" color="green" size={24} style={{ position: "absolute", right: 12 }}/>
                        ) : (
                            <Error name="error" color="red" size={24} style={{ position: "absolute", right: 12 }}/>
                        )}
                        </View>
                        {areArraysEqual(serviceAvailability, defaultServiceAvailability) ? null : validateAvailabilityValues() ? null : (
                            <Text style={errorText}>You have missing details in your schedule</Text>
                        )}
                    </TouchableOpacity>
                    </View>
                    {showSeeMoreModal ? (
                        <View style={{ flexDirection: 'column' }}>
                            <Button
                                title="Edit"
                                filled
                                Color={Color.colorWhite}
                                onPress={() => handleEditService()}
                                style={styles.button}
                                disabled={!selectedValue || !serviceNameVerify || !serviceDescriptionVerify || !priceVerify || areArraysEqual(serviceAvailability, defaultServiceAvailability) || !validateAvailabilityValues()}
                            />
                            <Button
                                title="Remove"
                             
                                Color={Color.colorRed}
                                onPress={() => handleRemoveService(serviceItems.findIndex((item) => item.name === serviceName))}
                                style={styles.buttons}
                            />
                        </View>
                    ) : (
                    <Button
                    title="Submit"
                    filled
                    Color={Color.colorWhite}
                    onPress={handleAddService}
                    disabled={!selectedValue || !serviceNameVerify || !serviceDescriptionVerify || !priceVerify || areArraysEqual(serviceAvailability, defaultServiceAvailability) || !validateAvailabilityValues()}
                    style={styles.button}
                />
                )}
                        
                                                </ScrollView>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showSelectList}
                    onRequestClose={() => setShowSelectList(false)}
                >

                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View style={{ backgroundColor: 'white', width: '80%', maxHeight: '80%', borderRadius: 10 }}>
                            <View flexDirection='row' style={{ borderBottomColor: Color.colorBlue, borderBottomWidth: 1, alignItems: 'center', justifyContent: 'space-between', marginVertical: windowHeight * 0.01 }}>
                            <Text style={{
                                    fontSize: windowWidth * 0.06,
                                    fontWeight: '400',
                                    marginVertical: windowHeight * 0.01,
                                    color: Color.colorBlue,
                                    marginLeft: windowWidth * 0.05 
                                }}>Service Type</Text>
                            <AntDesign style = {{ marginRight: windowWidth * 0.05 }} name="close" size= {windowWidth * 0.06} color={Color.colorBlue} onPress={() => setShowSelectList(false)} />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.5)'  }}>
                                
                                <FontAwesome name="search" color={Color.colorBlue} style={{ marginLeft: 10, fontSize: 20, marginBottom: windowWidth * 0.02 }} />
                                <TextInput
                                    placeholder='Search...'
                                    onChangeText={text => setSearchQuery(text)}
                                    style={{ paddingHorizontal: 10, marginBottom: windowWidth * 0.01 }}

                                />
                                </View>
                                <ScrollView style={{ maxHeight: windowHeight * 0.5 }}>
                                {filteredData.map((item, index) => (
                                    <TouchableOpacity key={item.key} onPress={() => handleSelect(item)} style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.3)' }}>
                                        <Text style={{ paddingVertical: 10, paddingHorizontal: 20 }}>{item.name}</Text>
                                    </TouchableOpacity>
                                ))}
                                </ScrollView>
                            </View>
                        </View>
                </Modal>

        <Modal animationType="slide" transparent={true} visible={showPriceModal} onRequestClose={closePriceModal}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View style={{ backgroundColor: 'white', width: '90%', maxHeight: '80%', borderRadius: 10, }}>
                            <View flexDirection='row' style={{ borderBottomColor: Color.colorBlue, borderBottomWidth: 1, alignItems: 'center', justifyContent: 'space-between', marginVertical: windowHeight * 0.01 }}>
                            <Text style={{
                                    fontSize: windowWidth * 0.06,
                                    fontWeight: '400',
                                    marginVertical: windowHeight * 0.01,
                                    color: Color.colorBlue,
                                    marginLeft: windowWidth * 0.05 
                                }}>Price Range</Text>
                            <AntDesign style = {{ marginRight: windowWidth * 0.05 }} name="close" size= {windowWidth * 0.06} color={Color.colorBlue} onPress={() => closePriceModal()} />
                            </View>
                            <View style={{ marginHorizontal: windowWidth * 0.05 }}>
                        <View style={{
                                height: windowHeight * 0.06,    
                                flexDirection: 'row',
                                marginTop: windowHeight * 0.01,
                                alignItems: 'center', 
                                justifyContent: 'space-between', 
                                width: '100%', 
                            }}>
                                
                            <Text style = {{ fontSize: 13, color: Color.colorBlue }}>Min:</Text>    
                            <TextInput

                                        style={{
                                            width: '30%',
                                            height: windowHeight * 0.06,
                                            borderWidth: 1,
                                            borderRadius: windowHeight * 0.015,
                                            paddingHorizontal: 10,
                                            borderColor: minPrice === 0 ? Color.colorBlue1 : priceVerify ? Color.colorGreen : Color.colorRed,
                                        }}
                                        keyboardType='numeric'
                                        value={`₱ ${minPrice.toString()}`}
                                        color={minPrice === 0 ? Color.colorBlue1 : priceVerify ? Color.colorGreen : Color.colorRed}
                                        onChangeText={(text) => {
                                            if (text === '₱ ' || text === '₱') {
                                                setMinPrice(0);
                                            } else if (text.length >= 3) { 
                                                setMinPrice(parseInt(text.replace('₱ ', '')));
                                                const numericPart = parseInt(text.replace('₱ ', ''));
                                                if (!isNaN(numericPart)) {
                                                    if (numericPart > 1000) {
                                                        setMinPrice(0);
                                                    } else {
                                                        setMinPrice(numericPart);
                                                    }
                                            } 
                                            }
                                        }}
                                    />
                                    <Text style={{ fontSize: 20, color: Color.colorBlue }}>-</Text>
                                    <Text style = {{ fontSize: 13, color: Color.colorBlue }}>Max:</Text>    
                                    <TextInput
                                        style={{
                                            width: '30%',
                                            height: windowHeight * 0.06,
                                            borderWidth: 1,
                                            borderRadius: windowHeight * 0.015,
                                            paddingHorizontal: 10,
                                            borderColor: minPrice === 0 ? Color.colorBlue1 : priceVerify ? Color.colorGreen : Color.colorRed,
                                        }}
                                        keyboardType='numeric'
                                        value={`₱ ${maxPrice.toString()}`}
                                        color={minPrice === 0 ? Color.colorBlue1 : priceVerify ? Color.colorGreen : Color.colorRed}
                                        onChangeText={(text) => {
                                            if (text === '₱ ' || text === '₱') {
                                                setMaxPrice(0);
                                            } else if (text.length >= 3) {
                                                setMaxPrice(parseInt(text.replace('₱ ', '')));
                                                const numericPart = parseInt(text.replace('₱ ', ''));
                                                if (!isNaN(numericPart)) {
                                                    if (numericPart > 1000) {
                                                        setMaxPrice(1000);
                                                    } else {
                                                        setMaxPrice(numericPart);
                                                    }
                                            } 
                                            }
                                        }}
                                    />
                                    
                            </View>
                            <MultiSlider
                            values={[minPrice, maxPrice]}
                            min={0}
                            max={1000}
                            step={1}
                            sliderLength={windowWidth * 0.8}
                            onValuesChange={handleValuesChange}
                            allowOverlap={false}
                            minMarkerOverlapDistance={dynamicMinMarkerOverlapDistance}
                            selectedStyle={{ backgroundColor: Color.colorBlue }}
                            />

                           
                        </View>
                        
                        </View>
                        </View>
                        </Modal>
            
                        <Modal animationType="slide" transparent={true} visible={showAvailabilityModal} onRequestClose={() => setShowAvailabilityModal(false)}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View style={{ backgroundColor: 'white', width: '90%', maxHeight: '80%', borderRadius: 10, }}>
                            <View flexDirection='row' style={{ borderBottomColor: Color.colorBlue, borderBottomWidth: 1, alignItems: 'center', justifyContent: 'space-between', marginTop: windowHeight * 0.01 }}>
                            <Text style={{
                                    fontSize: windowWidth * 0.06,
                                    fontWeight: '400',
                                    marginVertical: windowHeight * 0.01,
                                    color: Color.colorBlue,
                                    marginLeft: windowWidth * 0.05 
                                }}>Service Availability</Text>
                            <AntDesign style = {{ marginRight: windowWidth * 0.05 }} name="close" size= {windowWidth * 0.06} color={Color.colorBlue} onPress={() => setShowAvailabilityModal(false)} />
                            </View>
                            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"always"}>
                           
                            <View style={{ marginBottom: windowHeight * 0.01 }}>
                                
                            
                            {serviceAvailability.map((day, index) => (
                                <View key={index} style={{flexDirection: 'row', padding: 10, alignItems: 'center', borderBottomWidth: index === serviceAvailability.length - 1 ? 0 : 0.5, borderBottomColor: Color.colorBlue, paddingBottom: 30}}>
                                    
                                    <Text style={{marginLeft: windowWidth * 0.02, color: day.flagAvailable ? Color.colorBlue : Color.colorGray}}>{day.day}</Text>
                                        
                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1}}> 
                                    
                                    
                                    
                                    {day.flagAvailable && (
                                        
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1}}>
                
                
                <TouchableOpacity onPress={() => {
                                            setSelectedDayIndex(index);
                                            setShowPickerStart(!showPickerStart);
                                        }}>
                                            <TextInput
                                                placeholder='Start Time'
                                                value={day.startTime}
                                                style={{
                                                    width: windowWidth * 0.22,
                                                    height: windowHeight * 0.055,
                                                    borderWidth: 1,
                                                    borderRadius: windowHeight * 0.015,
                                                    paddingHorizontal: windowWidth * 0.02,
                                                    borderColor: day.startTime === '' && day.endTime === '' ? Color.colorBlue1 : renderErrorPerDay(day) ? Color.colorRed : Color.colorGreen,
                                                }}
                                                editable={false}
                                                color={Color.colorBlue}
                                            />
                                        </TouchableOpacity>
                                        {showPickerStart && (
                                            <Modal animationType="slide" transparent={true} visible={showPickerStart} onRequestClose={() => setShowPickerStart(false)}>
                                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                                    <View style={{ backgroundColor: 'white', width: '90%', maxHeight: '80%', borderRadius: 10, }}>
                                                        <View flexDirection='row' style={{ borderBottomColor: Color.colorBlue, borderBottomWidth: 1, alignItems: 'center', justifyContent: 'space-between', marginVertical: windowHeight * 0.01 }}>
                                                            <Text style={{
                                                                    fontSize: windowWidth * 0.06,
                                                                    fontWeight: '400',
                                                                    marginVertical: windowHeight * 0.01,
                                                                    color: Color.colorBlue,
                                                                    marginLeft: windowWidth * 0.05 
                                                                }}>Start Time</Text>
                                                            <AntDesign style = {{ marginRight: windowWidth * 0.05 }} name="close" size= {windowWidth * 0.06} color={Color.colorBlue} onPress={() => setShowPickerStart(false)} />
                                                        </View>

                                                        <FlatList
                                                            data={timeOptions}
                                                            keyExtractor={(item) => item.value}
                                                            
                                                            renderItem={({ item }) => (
                                                                <Pressable onPress={() => handleChangeStartTime(item.value, item.numValue)} >
                                                                    <View style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.5)' }}>
                                                                    <Text style={{ paddingVertical: 10, paddingHorizontal: 20 }}>{item.label}</Text>
                                                                    </View>
                                                                </Pressable>
                                                            )}
                                                        />
                                                    </View>
                                                </View>
                                            </Modal>
                                        )}

                <Text style={{ fontSize: 20, color: Color.colorBlue }}> - </Text>

                <TouchableOpacity onPress={() => {
                    setSelectedDayIndex(index);
                    setShowPickerEnd(!showPickerEnd);
                }
                }>
                <TextInput
                    placeholder='End Time'
                    value={day.endTime}
                    style={{
                        width: windowWidth * 0.22,
                        height: windowHeight * 0.055,
                        borderWidth: 1,
                        borderRadius: windowHeight * 0.015,
                        paddingHorizontal: windowWidth * 0.02,
                        borderColor: day.startTime === '' && day.endTime === '' ? Color.colorBlue1 : renderErrorPerDay(day) ? Color.colorRed : Color.colorGreen ? Color.colorGreen : Color.colorRed,
                    }}
                    editable={false}
                    color={Color.colorBlue}
                />
                </TouchableOpacity>
                {showPickerEnd && (
                    <Modal animationType="slide" transparent={true} visible={showPickerEnd} onRequestClose={() => setShowPickerEnd(false)}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View style={{ backgroundColor: 'white', width: '90%', maxHeight: '80%', borderRadius: 10, }}>
                                <View flexDirection='row' style={{ borderBottomColor: Color.colorBlue, borderBottomWidth: 1, alignItems: 'center', justifyContent: 'space-between', marginVertical: windowHeight * 0.02 }}>
                                    <Text style={{
                                            fontSize: windowWidth * 0.06,
                                            fontWeight: '400',
                                            marginVertical: windowHeight * 0.01,
                                            color: Color.colorBlue,
                                            marginLeft: windowWidth * 0.05 
                                        }}>End Time</Text>
                                    <AntDesign style = {{ marginRight: windowWidth * 0.05 }} name="close" size= {windowWidth * 0.06} color={Color.colorBlue} onPress={() => setShowPickerEnd(false)} />
                                </View>

                                <FlatList
                                    data={timeOptions}
                                    keyExtractor={(item) => item.value}
                                    
                                    renderItem={({ item }) => (
                                        <Pressable onPress={() => handleChangeEndTime(item.value, item.numValue)} >
                                            <View style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.5)' }}>
                                            <Text style={{ paddingVertical: 10, paddingHorizontal: 20 }}>{item.label}</Text>
                                            </View>
                                        </Pressable>
                                    )}
                                />
                            </View>
                        </View>
                    </Modal>
                )    
                }
        

            </View>
        )}                          
                                    <Pressable onPress={() => {
                                        const updatedAvailability = [...serviceAvailability];
                                        updatedAvailability[index].flagAvailable = !updatedAvailability[index].flagAvailable;
                                        if (!updatedAvailability[index].flagAvailable) {
                                            updatedAvailability[index].startTime = '';
                                            updatedAvailability[index].endTime = '';
                                        }
                                        setServiceAvailability(updatedAvailability);
                                        
                                    }}>
                                        <FontAwesome name={day.flagAvailable ? 'check-square' : 'square-o'} size={24} color={day.flagAvailable ? 'green' : Color.colorBlue} style={{ marginLeft: 10, marginRight: windowWidth * 0.03 }}/>
                                    </Pressable>
                                    <View style={{ position:'absolute', top: windowHeight * 0.06, right: windowWidth * 0.145 }}>
                                        {renderErrorTextPerDay(day)}
                                    </View>
                                    </View>
                                    
                                            
                                </View>
                                
                            ))}
                             
                        </View>

                        </ScrollView>
                        </View>
                        </View>
                        </Modal>

                            </View>
                        </View>
                                            
     

                </Modal>
                
                                



                <NativeBaseProvider>
                    <View style={{ marginVertical: windowHeight * 0.01 }}>
                    <Example />
                    </View>
                    </NativeBaseProvider> 
                <Button
            title="Sign Up"
            filled
            Color={Color.colorWhite}
            onPress={handleSubmit}
            disabled={serviceItems.length === 0}
        />

        </View>

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
        left: windowWidth * 0.05,
        maxHeight: "100%",
        width: windowWidth * 0.07,
        zIndex: 1,
    },
    tasksWrapper: {
        paddingTop: windowHeight * 0.01,
        width: windowWidth * 0.9,
        height: windowHeight * 0.5,
        borderRadius: 10,
        // backgroundColor: 'rgba(100, 150, 255, 0.1)',
      }, 
    items: {
        marginTop: windowHeight * 0.02,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Color.colorWhite,
        marginHorizontal: windowWidth * 0.05,
        flexDirection: 'column',
        position: 'absolute',
        top: windowHeight * 0.27,
    },
    button: {
        alignSelf: 'center',
        marginVertical: windowHeight * 0.02,
        width: windowWidth * 0.8,
        height: windowHeight * 0.07,
    },
    buttons: {
        alignSelf: 'center',
        marginBottom: windowHeight * 0.02,
        width: windowWidth * 0.8,
        height: windowHeight * 0.07,
    },
})