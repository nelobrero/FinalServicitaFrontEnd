import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, Modal, TouchableWithoutFeedback, Dimensions, Alert, ActivityIndicator, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { COLORS, FONTS } from "../constants/theme"
import { MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import DatePicker from "react-native-modern-datepicker";
import { errorText } from "../GlobalStyles";
import axios from "axios";
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { askForCameraPermission, askForLibraryPermission } from "../helper/helperFunction";


const  { width, height } = Dimensions.get('window');
export default EditProfile = ({ navigation, route }) => {

  const { userData, storeData } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  if (!userData || !storeData ) {
    return null;
  }
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const DEFAULT_IMAGE_URL_PROVIDER = "https://firebasestorage.googleapis.com/v0/b/servicita-signin-fa66f.appspot.com/o/DEPOLTIMEJ.jpg?alt=media&token=720651f9-4b46-4b9d-8131-ec4d8951a81b";




useEffect(() => {
  fetchCities();
}, []);

const fetchCities = async () => {
  try {
    const response = await axios.get('http://192.168.1.7:5000/location/getCities');
    if (response && response.data && response.data.data) {
      setCities(response.data.data);
      setSelectedCity(response.data.data.find(city => city.name === storeData.address.cityMunicipality));
    }
  } catch (error) {
    console.error('Error fetching services:', error);
  }
};

  
const [selectedImage, setSelectedImage] = useState(userData.profileImage);
const [compareImage, setCompareImage] = useState(userData.profileImage);
const [updatedImage, setUpdatedImage] = useState(null);
  const [selectedUri, setSelectedUri] = useState(null);
  const [firstName, setFirstName] = useState(storeData.name.firstName);
  const [firstNameVerify, setFirstNameVerify] = useState(true) ;
  const [lastName, setLastName] = useState(storeData.name.lastName);
  const [lastNameVerify, setLastNameVerify] = useState(true) ;
  const [streetAddress1, setStreetAddress1] = useState(storeData.address.streetAddress1);
  const [streetAddress1Verify, setStreetAddress1Verify] = useState(true) ;
  const [streetAddress2, setStreetAddress2] = useState(storeData.address.streetAddress2);
  const [modalOptionsVisible, setModalOptionsVisible] = useState(false);
  const [selectedCityName, setSelectedCityName] = useState(storeData.address.cityMunicipality);
  const [showSelectCity, setShowSelectCity] = useState(false);
  const [searchQueryCity, setSearchQueryCity] = useState('');
  const [selectedBarangay, setSelectedBarangay] = useState(storeData.address.barangay);
  const [showSelectBarangay, setShowSelectBarangay] = useState(false);
  const [searchQueryBarangay, setSearchQueryBarangay] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthday, setBirthday] = useState(storeData.birthDate.toDate());
  const [birthdayVerify, setBirthdayVerify] = useState(true);
  const filteredCities = cities && cities.length > 0 ? cities.filter(item => item.name.toLowerCase().includes(searchQueryCity.toLowerCase())) : [];
  const filteredBarangays = selectedCity && selectedCity.barangays && selectedCity.barangays.length > 0 ? selectedCity.barangays.filter(item => item.toLowerCase().includes(searchQueryBarangay.toLowerCase())) : [];
  const [isChanged, setIsChanged] = useState(false);

    const today = new Date();
    const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const formattedBirthday = birthday ? 
    `${birthday.getFullYear()}/${(birthday.getMonth() + 1).toString().padStart(2, '0')}/${birthday.getDate()}` 
    : null;



    const parseDateString = (dateString) => {
      const [year, month, day] = dateString.split('/');
      return new Date(year, month - 1, day); // Month is 0-indexed, so subtract 1
  };

  const handleSelectCity = (city) => {
    setSelectedCity(city);
    setSelectedCityName(city.name);
    if (selectedBarangay && !city.barangays.includes(selectedBarangay)) {
        setSelectedBarangay(null);
    }
    setShowSelectCity(false);
};

const handleSelectBarangay = (barangay) => {
    setSelectedBarangay(barangay);
    setShowSelectBarangay(false);
};



    const handleDateChange = (dateString) => {
      const selectedDate = parseDateString(dateString);
      setShowDatePicker(false);
      setBirthday(selectedDate);
      setBirthdayVerify(selectedDate <= minDate);
  }

  const validateName = (name, setName, setNameVerify) => {
    setName(name);
    const trimmedName = name.trim();
    setNameVerify(trimmedName && /^[a-zA-Z\s]+$/.test(trimmedName) && trimmedName.length <= 25)
  };

  const handleImageSelection = async () => {
    const permission = await askForLibraryPermission();
    if (permission) {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,

    });

    if (!result.canceled) {
      setSelectedUri(result.assets[0].uri);
      setCompareImage(`result.assets[0].uri`);
      setUpdatedImage(result)
    }
  }
  };

  const handleCamera = async () => {
    const Permission = await askForCameraPermission();
    if (Permission) {
      let result = await ImagePicker.launchCameraAsync(
        {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 4],
          quality: 1,
        }

      );

      if (!result.canceled) {
        setSelectedUri(result.assets[0].uri);
        setCompareImage(`result.assets[0].uri`);
        setUpdatedImage(result)
      }

    }
  }

  function renderDatePicker() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDatePicker}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              margin: 20,
              backgroundColor: COLORS.primary,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 20,
              padding: 35,
              width: "90%",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >

            <DatePicker
              mode="calendar"
              onDateChange={handleDateChange}
              value={birthday}
              options={{
                backgroundColor: COLORS.primary,
                textHeaderColor: "#469ab6",
                textDefaultColor: COLORS.white,
                selectedTextColor: COLORS.white,
                mainColor: "#469ab6",
                textSecondaryColor: COLORS.white,
                borderColor: "rgba(122,146,165,0.1)",
              }}
            />

            <TouchableOpacity onPress={() => setShowDatePicker(false)}>
              <Text style={{ ...FONTS.body3, color: COLORS.white }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  

  useEffect(() => {
    if (firstName !== storeData.name.firstName || lastName !== storeData.name.lastName || birthday.getTime() !== (storeData.birthDate ? storeData.birthDate.toDate().getTime() : null) || streetAddress1 !== storeData.address.streetAddress1 || streetAddress2 !== storeData.address.streetAddress2 || selectedCityName !== storeData.address.cityMunicipality || selectedBarangay !== storeData.address.barangay || compareImage !== userData.profileImage) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [firstName, lastName, birthday, streetAddress1, streetAddress2, selectedCityName, selectedBarangay, selectedImage, selectedUri, compareImage]);

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const roleText = userData.role === 'Provider' ? 'providers' : 'seekers';
      const userRef = firestore().collection(roleText).doc(userData._id);
      await userRef.set({
        name: {
          firstName: firstName,
          lastName: lastName,
        },
        birthDate: firestore.Timestamp.fromDate(new Date(birthday)),
        address: {
          streetAddress1: streetAddress1,
          streetAddress2: streetAddress2,
          cityMunicipality: selectedCity.name,
          barangay: selectedBarangay,
        },
      }, { merge: true })

      if (compareImage !== userData.profileImage) {
        const response = await fetch(updatedImage.assets[0].uri);
        const blob = await response.blob();
        const storageRef = storage().ref().child(`profileImages/${userData._id}`);
        await storageRef.put(blob);
        const url = await storageRef.getDownloadURL();
        await axios.patch('http://192.168.1.7:5000/user/updateImage', { userId: userData._id, url: url });
      }
      console.log(`User details saved for user with ID: ${userData._id}`);
      setIsLoading(false);
      Alert.alert('User details saved successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating user data:', error);
    }

  }

  const validateFields = () => {
    return firstNameVerify && lastNameVerify && birthdayVerify && streetAddress1Verify;
  };

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.secondaryGray}} >
          <Image source={require('../assets/loading.gif')} style={{width: 200, height: 200}} />
      </View>
    );
  }
    
  return (
    <ScrollView>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
          paddingHorizontal: 22,
        }}
      >
        <View
          style={{
            marginHorizontal: 12,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              position: "absolute",
              left: 0,
            }}
          >
            <MaterialIcons
              name="keyboard-arrow-left"
              size={24}
              color={COLORS.black}
            />
          </TouchableOpacity>

          <Text style={{ ...FONTS.h3 }}>Edit Profile</Text>
        </View>

        <ScrollView>
          <View
            style={{
              alignItems: "center",
              marginVertical: 22,
            }}
          >
            <TouchableOpacity onPress={() => setModalOptionsVisible(true)}>
              <Image
                source={{ uri: selectedUri ? selectedUri : selectedImage}}
                style={{
                  height: 170,
                  width: 170,
                  borderRadius: 85,
                  borderWidth: 2,
                  borderColor: COLORS.primary,
                }}
              />

              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 10,
                  zIndex: 9999,
                }}
              >
                <MaterialIcons
                  name="photo-camera"
                  size={32}
                  color={COLORS.primary}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View>
            <View
              style={{
                flexDirection: "column",
                marginBottom: 6,
              }}
            >
              <Text style={{ ...FONTS.h4 }}>Name</Text>
              <View
                style={{
                  height: 44,
                  width: "100%",
                  borderColor: COLORS.secondaryGray,
                  borderWidth: 1,
                  borderRadius: 4,
                  marginVertical: 6,
                  justifyContent: "center",
                  paddingLeft: 8,
                }}
              >
                <TextInput
                  value={firstName}
                  onChange={(e) => validateName(e.nativeEvent.text, setFirstName, setFirstNameVerify)}
                  editable={true}
                />
              </View>
              {firstName.length < 1 || firstName === storeData.name.firstName ? null : firstNameVerify ? null : (
                        firstName.length > 25 ? (
                            <Text style={errorText}>First name must not exceed 25 characters.</Text>
                        ) : (
                            <Text style={errorText}>First name must contain only letters.</Text>
                        )
                    )}
              <View
                style={{
                  height: 44,
                  width: "100%",
                  borderColor: COLORS.secondaryGray,
                  borderWidth: 1,
                  borderRadius: 4,
                  marginVertical: 6,
                  justifyContent: "center",
                  paddingLeft: 8,
                }}
              >
                <TextInput
                  value={lastName}
                  onChange={(e) => validateName(e.nativeEvent.text, setLastName, setLastNameVerify)}
                  editable={true}
                />
                
              </View>
              {lastName.length < 1 || lastName === storeData.name.lastName ? null : lastNameVerify ? null : (
                        lastName.length > 25 ? (
                            <Text style={errorText}>Last name must not exceed 25 characters.</Text>
                        ) : (
                            <Text style={errorText}>Last name must contain only letters.</Text>
                        )
                    )}
            </View>

          

            <View
              style={{
                flexDirection: "column",
                marginBottom: 6,
              }}
            >
              <Text style={{ ...FONTS.h4 }}>Date of Birth</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={{
                  height: 44,
                  width: "100%",
                  borderColor: COLORS.secondaryGray,
                  borderWidth: 1,
                  borderRadius: 4,
                  marginVertical: 6,
                  justifyContent: "center",
                  paddingLeft: 8,
                }}
              >
                <Text>{formattedBirthday}</Text>
              </TouchableOpacity>
              {birthday === null || birthday === storeData.birthDate.toDate() ? null : birthdayVerify ? null : (
                        <Text style={errorText}>You must be at least 18 years old to register.</Text>
                    )}
            </View>
            
          </View>

          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{ ...FONTS.h4 }}>Location</Text>
            <View
              style={{
                height: 44,
                width: "100%",
                borderColor: COLORS.secondaryGray,
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: "center",
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={streetAddress1}
                onChange={(e) => {
                  const streetAddress = e.nativeEvent.text;
                  setStreetAddress1(streetAddress);
                  setStreetAddress1Verify(streetAddress.length > 0 && streetAddress.length <= 25);
              }}
                editable={true}
              />
            </View>
            {streetAddress1.length < 1 || streetAddress1 === storeData.address.streetAddress1 ? null : streetAddress1Verify ? null : (
                        streetAddress1.length > 25 ? (
                            <Text style={errorText}>Street address must not exceed 25 characters.</Text>
                        ) : (
                            null
                        )
                    )}
            <View
              style={{
                height: 44,
                width: "100%",
                borderColor: COLORS.secondaryGray,
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: "center",
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={streetAddress2}
                onChangeText={(value) => setStreetAddress2(value)}
                editable={true}
              />
            </View>
            
            <TouchableOpacity
              onPress={() => setShowSelectCity(true)}
            >
            <View
              style={{
                height: 44,
                width: "100%",
                borderColor: COLORS.secondaryGray,
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: "center",
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={selectedCityName ? selectedCityName : ""}
                editable={false}
                color={COLORS.black}
              />

            </View>

            </TouchableOpacity>

            <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showSelectCity}
                    onRequestClose={() => setShowSelectCity(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setShowSelectCity(false)}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View style={{ backgroundColor: 'white', width: '80%', maxHeight: '80%', borderRadius: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.3)', height: height * 0.06, }}>
                                <FontAwesome name="search" color={COLORS.black} size={20} style={{ paddingHorizontal: 10 }} />
                                <TextInput
                                    placeholder='Search...'
                                    onChangeText={text => setSearchQueryCity(text)}
                                    style={{ paddingHorizontal: 10 }}
                                />
                                </View>
                                <ScrollView style={{ maxHeight: height * 0.5 }}>
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

            <TouchableOpacity 
              onPress={() => setShowSelectBarangay(true)}
              style={{
                height: 44,
                width: "100%",
                borderColor: COLORS.secondaryGray,
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: "center",
                paddingLeft: 8,
              }}
            >
            <View
            >
              <TextInput
                value={selectedBarangay ? selectedBarangay : ""}
                editable={false}
                color={COLORS.black}
              />
            </View>
            </TouchableOpacity>
          </View>

          <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showSelectBarangay}
                    onRequestClose={() => setShowSelectBarangay(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setShowSelectBarangay(false)}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View style={{ backgroundColor: 'white', width: '80%', maxHeight: '80%', borderRadius: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.3)', height: height * 0.06, }}>
                                <FontAwesome name="search" color={COLORS.black} size={20} style={{ paddingHorizontal: 10 }} />
                                <TextInput
                                    placeholder='Search...'
                                    onChangeText={text => setSearchQueryBarangay(text)}
                                    style={{ paddingHorizontal: 10 }}
                                />
                                </View>
                                <ScrollView style={{ maxHeight: height * 0.5 }}>
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
                <Modal animationType="slide" transparent={true} visible={modalOptionsVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <Pressable style={{position: 'absolute',
  top: height * 0.02,
  right: 20,}} onPress={() => setModalOptionsVisible(false)}>
            <Ionicons name="close-circle" size={36} color="white" />
          </Pressable>
          <View
            style={{
              backgroundColor: "white",
              width: "80%",
              padding: 16,
              borderRadius: 16,
            }}
          >
            <TouchableOpacity
              style={{
                padding: 16,
              }}
              onPress={handleCamera}
            >
              <Text>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 16,
              }}
              onPress={handleImageSelection}
            >
              <Text>Photo Library</Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </Modal>

          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              height: 44,
              borderRadius: 6,
              alignItems: "center",
              justifyContent: "center",
              opacity: validateFields() && isChanged ? 1 : 0.5,
              marginBottom: height * 0.05,
            }}
            onPress={handleSaveChanges}
            disabled={!validateFields() || !isChanged}
          >
            <Text
              style={{
                ...FONTS.body3,
                color: COLORS.white,
              }}
            >
              Save Changes
            </Text>
          </TouchableOpacity>



          {renderDatePicker()}
        </ScrollView>
      </SafeAreaView>
    </ScrollView>
  );
};

