import { View, Text, TextInput, TouchableOpacity, Image, Pressable, Dimensions, ScrollView, Alert, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { Color } from "../../GlobalStyles"; 
import Button from '../../components/Button';
import axios from 'axios';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Providerpref ({navigation, route, params}) {
    
    // const { firstName, lastName, email, role, streetAddress1, streetAddress2, city, barangay, birthDate, mobile, password } = route.params;
    const [birthday, setBirthday] = useState('');
    const [selectedValue, setSelectedValue] = useState(null);
    const [showSelectList, setShowSelectList] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [serviceName, setServiceName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('')
    const [availability, setAvailability] = useState([]);
    const [modalServiceName, setModalServiceName] = useState('');
    const [modalDescription, setModalDescription] = useState('');
    const [modalPrice, setModalPrice] = useState('');
    const [modalAvailability, setModalAvailability] = useState([]);
    const [services, setServices] = useState([]);

    // useEffect(() => {
    //     convertDate(birthDate);
    // }, [birthDate]);

    const [data, setData] = useState([]);

    const filteredData = data.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    

    useEffect(() => {
        fetchServices();
    }, []);

    function generateServiceId() {
        const timestamp = new Date().getTime().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        const serviceId = timestamp + random;
        return serviceId;
    }
    

    const openServiceModal = () => {
        setShowServiceModal(true);
    };

    const closeServiceModal = () => {
        setShowServiceModal(false);
    };

    const handleModalSubmit = () => {
        // Perform validation if needed
        // Update service information or do any other necessary action
        setServiceName(modalServiceName);
        setDescription(modalDescription);
        setPrice(modalPrice);
        setAvailability(modalAvailability);
        closeServiceModal(); // Close the modal
    };

    const fetchServices = async () => {
        try {
            const response = await axios.get('http://192.168.1.14:5000/service/getServices');
            setData(response.data.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const validateFields = () => {
        return selectedValue;
    }
    
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
            const userData = { 
                email,
                mobile,
                password,
                role,
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
                birthDate,
                service: [],
                
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
                    <Pressable onPress={() => navigation.goBack()} style={styles.arrowContainer}>
                                            <Image
                                            style={styles.userroleChild}
                                            contentFit="cover"
                                            source={require("./../../assets/arrow-1.png")}
                                            />
                            </Pressable>
                    <View style={{ flexDirection: 'column', justifyContent: 'flex-start', marginHorizontal: windowWidth * 0.05, marginTop: windowHeight * 0.07 }}>
                            <View style={{ marginVertical: windowHeight * 0.04 }}>
                                <Text style={{
                                    fontSize: windowWidth * 0.1,
                                    fontWeight: 'bold',
                                    color: Color.colorBlue,
                                    bottom: windowHeight * 0.03,
                                }}>
                                    Service
                                    {"\n"}
                                    Preferences...
                                </Text>
                            </View>

                        </View>
            
            <View style={{ flex: 1, marginHorizontal: windowWidth * 0.05, justifyContent: "center", flexDirection: "column", marginBottom: windowHeight * 0.09}}>

        

                <TouchableWithoutFeedback onPress={() => setShowSelectList(false)}>
            <View style={{ marginBottom: windowHeight * 0.08 }}>
                <Text style={{
                    fontSize: windowWidth * 0.05,
                    fontWeight: '400',
                    marginVertical: windowHeight * 0.01,
                    color: Color.colorBlue,
                }}>Service</Text>
                <TouchableOpacity onPress={() => setShowSelectList(true)}>
                    <View style={{
                        width: '100%',
                        height: windowHeight * 0.06,
                        borderColor: selectedValue ? Color.colorGreen : Color.colorBlue1,
                        borderWidth: 1,
                        borderRadius: windowHeight * 0.015,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingLeft: windowWidth * 0.025,
                        paddingHorizontal: windowWidth * 0.14,
                        flexDirection: 'row'
                    }}>
                        <FontAwesome name="bell" color = {selectedValue === null || selectedValue === '' ? Color.colorBlue1 : selectedValue ? Color.colorGreen : Color.colorBlue1} style={{marginRight: 5, fontSize: 24}}/>
                        <TextInput
                            placeholder='Select service preferences'
                            placeholderTextColor={Color.colorBlue}
                            value={selectedValue ? selectedValue.name : ''}
                            editable={false}
                            style={{ flex: 1 }}
                            color={selectedValue ? Color.colorBlack : Color.colorBlue}
                        />
                        {selectedValue ? (
                            <Feather name="check-circle" color="green" size={24} style={{ position: "absolute", right: 12 }}/>
                        ) : null}
                    </View>
                </TouchableOpacity>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showSelectList}
                    onRequestClose={() => setShowSelectList(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setShowSelectList(false)}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View style={{ backgroundColor: 'white', width: '80%', maxHeight: '80%', borderRadius: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.3)', height: windowHeight * 0.06, }}>
                                <FontAwesome name="search" color={Color.colorBlue} style={{ marginLeft: 10, fontSize: 20 }} />
                                <TextInput
                                    placeholder='Search...'
                                    onChangeText={text => setSearchQuery(text)}
                                    style={{ paddingHorizontal: 10 }}
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
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        </TouchableWithoutFeedback>
    
    

            
          <Button
            title="Sign Up"
            filled
            Color={Color.colorWhite}
            style={{
                marginTop: windowHeight * 0.09,
            }}
                onPress={handleSubmit}
                disabled={!validateFields()}
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
    }
})