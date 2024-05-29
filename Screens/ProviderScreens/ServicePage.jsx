import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Alert, Modal, TextInput, Pressable, FlatList } from "react-native";
import { Color, errorText } from '../../GlobalStyles'
import React, { useState, useEffect } from "react";
import { COLORS, FONTS } from "./../../constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons, AntDesign, Feather, FontAwesome, Entypo, Ionicons } from "@expo/vector-icons";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import * as ImagePicker from "expo-image-picker";
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import axios from "axios";
import Button from './../../components/Button';
import { Video } from "expo-av";
import { askForCameraPermission, askForLibraryPermission } from "./../../helper/helperFunction";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default ServicePage = ({ navigation, route }) => {


const { service, storeData, userData } = route.params;
if (!service || !storeData || !userData) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.secondaryGray}} >
        <Image source={require('../../assets/loading.gif')} style={{width: 200, height: 200}} />
    </View>
  );
}

    const [selectedImage, setSelectedImage] = useState(service.data.coverImage);
    const [compareImage, setCompareImage] = useState(service.data.coverImage);
    const [updatedImage, setUpdatedImage] = useState(null);
      const [selectedUri, setSelectedUri] = useState(null);
      const [reviewText, setReviewText] = useState('');
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [showPostModal, setShowPostModal] = useState(false);
    const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
    const [serviceName, setServiceName] = useState(service.data.name);
    const [serviceNameVerify, setServiceNameVerify] = useState(true);
    const [serviceDescription, setServiceDescription] = useState(service.data.description);
    const [serviceDescriptionVerify, setServiceDescriptionVerify] = useState(true);
    const [minPrice, setMinPrice] = useState(service.data.price.min);
    const [maxPrice, setMaxPrice] = useState(service.data.price.max);
    const [priceVerify, setPriceVerify] = useState(true);
    const [dynamicMinMarkerOverlapDistance, setDynamicMinMarkerOverlapDistance] = useState(0);
    const [inputHeight, setInputHeight] = useState(windowHeight * 0.06);
    const priceGap = 300
    const [isChanged, setIsChanged] = useState(false);
    const [images, setImages] = useState(null);
    const [modalOptionsVisible, setModalOptionsVisible] = useState(false);
    const [modalOptionssVisible, setModalOptionssVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validateName = (name, setName, setNameVerify, limit) => {
      setName(name);
      const trimmedName = name.trim();
      setNameVerify(trimmedName && trimmedName.length <= limit)
    };

    const [defaultServiceAvailability] = useState([
      { day: 'Monday', startTime: '', endTime: '', flagAvailable: false, startTimeValue: 0, endTimeValue: 0 },
      { day: 'Tuesday', startTime: '', endTime: '', flagAvailable: false, startTimeValue: 0, endTimeValue: 0 },
      { day: 'Wednesday', startTime: '', endTime: '', flagAvailable: false, startTimeValue: 0, endTimeValue: 0 },
      { day: 'Thursday', startTime: '', endTime: '', flagAvailable: false, startTimeValue: 0, endTimeValue: 0 },
      { day: 'Friday', startTime: '', endTime: '', flagAvailable: false, startTimeValue: 0, endTimeValue: 0 },
      { day: 'Saturday', startTime: '', endTime: '', flagAvailable: false, startTimeValue: 0, endTimeValue: 0 },
      { day: 'Sunday', startTime: '', endTime: '', flagAvailable: false, startTimeValue: 0, endTimeValue: 0 },
  ]);

  const [serviceAvailability, setServiceAvailability] = useState([
      { day: service.data.availability[0].day, startTime: service.data.availability[0].startTime, endTime: service.data.availability[0].endTime, flagAvailable: service.data.availability[0].flagAvailable, startTimeValue: service.data.availability[0].startTimeValue, endTimeValue: service.data.availability[0].endTimeValue },
      { day: service.data.availability[1].day, startTime: service.data.availability[1].startTime, endTime: service.data.availability[1].endTime, flagAvailable: service.data.availability[1].flagAvailable, startTimeValue: service.data.availability[1].startTimeValue, endTimeValue: service.data.availability[1].endTimeValue },
      { day: service.data.availability[2].day, startTime: service.data.availability[2].startTime, endTime: service.data.availability[2].endTime, flagAvailable: service.data.availability[2].flagAvailable, startTimeValue: service.data.availability[2].startTimeValue, endTimeValue: service.data.availability[2].endTimeValue },
      { day: service.data.availability[3].day, startTime: service.data.availability[3].startTime, endTime: service.data.availability[3].endTime, flagAvailable: service.data.availability[3].flagAvailable, startTimeValue: service.data.availability[3].startTimeValue, endTimeValue: service.data.availability[3].endTimeValue },
      { day: service.data.availability[4].day, startTime: service.data.availability[4].startTime, endTime: service.data.availability[4].endTime, flagAvailable: service.data.availability[4].flagAvailable, startTimeValue: service.data.availability[4].startTimeValue, endTimeValue: service.data.availability[4].endTimeValue },
      { day: service.data.availability[5].day, startTime: service.data.availability[5].startTime, endTime: service.data.availability[5].endTime, flagAvailable: service.data.availability[5].flagAvailable, startTimeValue: service.data.availability[5].startTimeValue, endTimeValue: service.data.availability[5].endTimeValue },
      { day: service.data.availability[6].day, startTime: service.data.availability[6].startTime, endTime: service.data.availability[6].endTime, flagAvailable: service.data.availability[6].flagAvailable, startTimeValue: service.data.availability[6].startTimeValue, endTimeValue: service.data.availability[6].endTimeValue },
  ]);

  const [timeOptions] = useState([
      { label: '5:00 AM', value: '5:00 AM', numValue: 1 },
      { label: '6:00 AM', value: '6:00 AM', numValue: 2 },
      { label: '7:00 AM', value: '7:00 AM', numValue: 3 },
      { label: '8:00 AM', value: '8:00 AM', numValue: 4 },
      { label: '9:00 AM', value: '9:00 AM', numValue: 5 },
      { label: '10:00 AM', value: '10:00 AM', numValue: 6 },
      { label: '11:00 AM', value: '11:00 AM', numValue: 7 },
      { label: '12:00 PM', value: '12:00 PM', numValue: 8 },
      { label: '1:00 PM', value: '1:00 PM', numValue: 9 },
      { label: '2:00 PM', value: '2:00 PM', numValue: 10 },
      { label: '3:00 PM', value: '3:00 PM', numValue: 11 },
      { label: '4:00 PM', value: '4:00 PM', numValue: 12 },
      { label: '5:00 PM', value: '5:00 PM', numValue: 13 },
      { label: '6:00 PM', value: '6:00 PM', numValue: 14 },
      { label: '7:00 PM', value: '7:00 PM', numValue: 15 },
      { label: '8:00 PM', value: '8:00 PM', numValue: 16 },
      { label: '9:00 PM', value: '9:00 PM', numValue: 17 },
      { label: '10:00 PM', value: '10:00 PM', numValue: 18 },
      { label: '11:00 PM', value: '11:00 PM', numValue: 19 },
  ]);

  const [showPickerStart, setShowPickerStart] = useState(false);
  const [showPickerEnd, setShowPickerEnd] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);

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

const handleChangeStartTime = (value) => {
    const updatedAvailability = [...serviceAvailability];
    updatedAvailability[selectedDayIndex].startTime = value;
    setServiceAvailability(updatedAvailability);
    setShowPickerStart(false);
}

const handleChangeEndTime = (value) => {
    const updatedAvailability = [...serviceAvailability];
    updatedAvailability[selectedDayIndex].endTime = value;
    setServiceAvailability(updatedAvailability);
    setShowPickerEnd(false);
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

const openPostModal = () => {
  setShowPostModal(true);
}

const appeal = async () => {
  try {
    // Reset service status to pending
    await firestore().collection('services').doc(service.id).set({
      status: 'Pending',
    }, { merge: true });
    Alert.alert("Service appeal submitted successfully");
    navigation.goBack();
  } catch (error) {
    console.error('Error submitting appeal:', error);
  }
}

const handleImageSelection = async () => {
  const Permission = await askForLibraryPermission();
  if (Permission) {
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

const closePostModal = () => {
  setImages(null);
  setReviewText('');
  setShowPostModal(false);
};

const handleImagePicker = async () => {
  const Permission = await askForLibraryPermission();
  if (Permission) {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 4],
    quality: 1,

  });
  if (!result.canceled) {
      setImages(images ? [...images, result.assets[0].uri] : [result.assets[0].uri]);

    }
  }
};

const handleCameraPicker = async () => {
  const Permission = await askForCameraPermission();
  if (Permission) {
  let result = await ImagePicker.launchCameraAsync(
    {
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    }

  );

  if (!result.canceled) {
      setImages(images ? [...images, result.assets[0].uri] : [result.assets[0].uri]);
  }
}
};

const removeImage = (index) => {
  const newImages = images.filter((image, i) => i !== index);
  if (newImages.length === 0) {
      setImages(null);
  } else {
    setImages(newImages);
  }
};

const handleSubmitPost = async () => {
  setIsLoading(true);
  try {
    const submitImages = [];

    const imageUploadPromises = images && images.length > 0 ? images.map(async (image) => {
      const response = await fetch(image);
      const blob = await response.blob();
      const storageRef = storage().ref();
      const imageRef = storageRef.child(`postImages/${service.id}/${image.split('/').pop()}`);
      await imageRef.put(blob);
      const url = await imageRef.getDownloadURL();
      submitImages.push(url);
  }) : [];

  await Promise.all(imageUploadPromises);

  await axios.post('http://192.168.1.7:5000/post/createPost', { serviceId: service.id, images: submitImages, postText: reviewText });
  setIsLoading(false);
  alert('Post submitted successfully!');
  setImages(null);
  setReviewText('');
  setShowPostModal(false);
  navigation.goBack();
} catch (error) {
  console.error('Error submitting post:', error);
}
};

const saveChanges = async () => {
  setIsLoading(true);
  try {
  const serviceRef = firestore().collection('services').doc(service.id);
  await serviceRef.set({
    name: serviceName,
    description: serviceDescription,
    price: {
      min: minPrice,
      max: maxPrice,
    },
    availability: serviceAvailability,
  }, { merge: true })

  if (compareImage !== service.data.coverImage) {
    const response = await fetch(updatedImage.assets[0].uri);
    const blob = await response.blob();
    const storageRef = storage().ref().child(`serviceImages/${service.id}`);
    await storageRef.put(blob);
    const url = await storageRef.getDownloadURL();
    await serviceRef.set({
      coverImage: url,
    }, { merge: true });
  }
  setShowServiceModal(false);
  setIsLoading(false);
  Alert.alert("Service updated successfully");
  navigation.goBack();
  } catch (error) {
    console.error('Error updating user data:', error);
  }
  

}
useEffect(() => {
  if (serviceName !== service.data.name || serviceDescription !== service.data.description || (minPrice !== service.data.price.min && maxPrice !== service.data.price.max) || !areArraysEqual(serviceAvailability, service.data.availability)  || service.data.coverImage !== compareImage) {
    setIsChanged(true);
  } else {
    setIsChanged(false);
  }
}, [serviceName, serviceDescription, minPrice, maxPrice, serviceAvailability, compareImage]);

  let accountItems = [];

  if (service.data.status === "Active") {
    accountItems = [
      {
        text: "Edit Service",
        action: openServiceModal,
      },
      {
        text: "Add Post",
        action: openPostModal,
      }
    ];
  } else if (service.data.status === "Rejected") {
    accountItems = [
      {
        text: "Edit Service",
        action: openServiceModal,
      },
      {
        text: "Appeal",
        action: appeal,
      }
    ];
  } else {
    accountItems = [{
      text: "Edit Service",
      action: openServiceModal,
    }]
  }


  const renderSettingsItem = ({ text, action }) => (
    <TouchableOpacity
      onPress={action}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 18,
        paddingLeft: 12,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        marginVertical: windowHeight * 0.007,
        marginRight: windowWidth * 0.25
      }}
    >
      <Feather
        name="edit-2"
        size={15}
        color="white"
        style={{ marginRight: 8 }}
      />
      <Text
        style={{
          color: COLORS.white,
          alignItems: "center",
          fontSize: 16,
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );

if (isLoading) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.secondaryGray}} >
        <Image source={require('../../assets/loading.gif')} style={{width: 200, height: 200}} />
    </View>
  );
}

  return (
    <ScrollView>
    <SafeAreaView
      style={{
        backgroundColor: COLORS.white,
      }}
    >
        

      <View style={styles.container}>
        <StatusBar />
        
        <View style={{ width: "100%" }}>
            <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
                paddingHorizontal: 20,
                position: 'absolute',
                zIndex: 1
            }}
        >
          {/* arrow with circle */}
            <MaterialIcons name="arrow-back-ios" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        
          <Image
            source={{ uri: service.data.coverImage}}
            resizeMode="cover"
            style={{
              height: 228,
              width: "100%",
            }}
          />


        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 30,
              color: COLORS.primary,
              marginTop: 30,
            }}
          > {service.data.name}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            paddingHorizontal: 60,
          }}
        >
          {/* Background shape */}
          <View
            style={{
              backgroundColor: COLORS.gray,
              borderRadius: 20,
              padding: 8,
              marginRight: 5,
            }}
          >
            <Text style={{ color: COLORS.primary }}>{service.data.serviceType}</Text>
          </View>
          <View
            style={{
              backgroundColor: COLORS.gray,
              borderRadius: 20,
              padding: 8,
              marginLeft: 5,
            }}
          >
            <Text style={{ color: COLORS.primary }}>{service.data.status}</Text>
          </View>
        </View>

        <View
          style={{
            marginTop: 50,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
          }}
        >
          <View style={{ flexDirection: "column"}}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
              marginTop: 12,
              color: COLORS.primary,
            }}
          >
            Service Fee: ₱{service.data.price.min} - ₱{service.data.price.max}
          </Text>
          

          <View  
            style={{
              flexDirection: "row",
              borderRadius: 12,
            }}
          >
            {accountItems.map((item, index) => (
              <React.Fragment key={index}>
                {renderSettingsItem(item)}
              </React.Fragment>
            ))}
          </View>
        </View>
      </View>
      </View>

      <View
        style={{
          marginTop: 20,  
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 50,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            marginVertical: 6,
            alignItems: "center",
          }}
        >
          <MaterialIcons name="location-on" size={20} color="black" />
          <Text
            style={{
              ...FONTS.body4,
              marginLeft: 4,
            }}
          >
            {storeData.address.cityMunicipality}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginVertical: 6,
            alignItems: "center",
          }}
        >
          <AntDesign name="phone" size={20} color="black" />
        <Text
          style={{
            ...FONTS.body4,
            marginLeft: 4,
          }}
        >
          {userData.mobile}
        </Text>
        </View>
      </View>

      <View
        style={{
          paddingHorizontal: 50,
          flexDirection: "row",
          marginVertical: windowHeight * 0.01,
          marginBottom: windowHeight * 0.03,
          alignItems: "center",
        }}
      >
        

        <Feather name="mail" size={20} color="black" />
          <Text
            style={{
              ...FONTS.body4,
              marginLeft: 4,
            }}
          >
            {userData.email}
          </Text>
      </View>

      <View
        style={{
          marginLeft: 20,
          marginTop: 25,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          About Our Service
        </Text>

        <Text style={{
          margin: 5,
          marginRight: 20,
          textAlign: "justify",
          justifyContent: "center"
        }}>
          {service.data.description}
        </Text>
      </View>


      <View>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            marginTop: 15,
            marginLeft: 20,

          }}
        >
        Availability Schedule
        </Text>
      </View>
          
          <View style = {{marginBottom: 20}}>
          <View style={{flexDirection: "row", marginTop: 10, justifyContent: "space-between", marginHorizontal: windowWidth * 0.15, paddingHorizontal: windowWidth * 0.10}}>
          <Text style={{fontSize: 15, fontWeight: '500'}}>Monday </Text>
          <Text style={{fontSize: 15, fontWeight: '500'}}>Tuesday</Text>
          </View>
      <View style={{flexDirection: "row", marginTop: 10, justifyContent: "space-evenly", paddingHorizontal: 50}}>
        <Text style={styles.container1}>
        {service.data.availability[0].startTime && service.data.availability[0].endTime ? `${service.data.availability[0].startTime} - ${service.data.availability[0].endTime}` : "Unavailable"}
        </Text>
        <Text style={styles.container1}>
        {service.data.availability[1].startTime && service.data.availability[1].endTime ? `${service.data.availability[1].startTime} - ${service.data.availability[1].endTime}` : "Unavailable"}
        </Text>
        </View>

        <View style={{flexDirection: "row", marginTop: 10, justifyContent: "space-between", marginHorizontal: windowWidth * 0.13, paddingHorizontal: windowWidth * 0.10}}>
        <Text style={{fontSize: 15, fontWeight: '500'}}>Wednesday</Text>
        <Text style={{fontSize: 15, fontWeight: '500'}}> Thursday</Text>
        </View>
        <View style={{flexDirection: "row", marginTop: 10, justifyContent: "space-evenly", paddingHorizontal: 50}}>
        <Text style={styles.container1}>
        {service.data.availability[2].startTime && service.data.availability[2].endTime ? `${service.data.availability[2].startTime} - ${service.data.availability[2].endTime}` : "Unavailable"}
        </Text>
        <Text style={styles.container1}>
        {service.data.availability[3].startTime && service.data.availability[3].endTime ? `${service.data.availability[3].startTime} - ${service.data.availability[3].endTime}` : "Unavailable"}
        </Text>
        </View>

        <View style={{flexDirection: "row", marginTop: 10, justifyContent: "space-between", marginHorizontal: windowWidth * 0.15, paddingHorizontal: windowWidth * 0.10}}>
        <Text style={{fontSize: 15, fontWeight: '500'}}>Friday  </Text>
        <Text style={{fontSize: 15, fontWeight: '500'}}>Saturday</Text>
        </View>
        <View style={{flexDirection: "row", marginTop: 10, justifyContent: "space-evenly", paddingHorizontal: 50}}>
       <Text style={styles.container1}>
        {service.data.availability[4].startTime && service.data.availability[4].endTime ? `${service.data.availability[4].startTime} - ${service.data.availability[4].endTime}` : "Unavailable"}
       </Text>
       <Text style={styles.container1}>
        {service.data.availability[5].startTime && service.data.availability[5].endTime ? `${service.data.availability[5].startTime} - ${service.data.availability[5].endTime}` : "Unavailable"}
       </Text>
       </View>

          
       <View style={{ marginTop: 10, alignItems: 'center' }}>
         <Text style={{ fontSize: 15, fontWeight: '500', marginBottom: 10 }}>Sunday</Text>
       <Text style={styles.container1}>
        {service.data.availability[6].startTime && service.data.availability[6].endTime ? `${service.data.availability[6].startTime} - ${service.data.availability[6].endTime}` : "Unavailable"}
       </Text>
       </View>
        </View>

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
                            <AntDesign style = {{ marginRight: windowWidth * 0.05 }} name="close" size= {windowWidth * 0.06} color={Color.colorBlue} onPress={() => closeServiceModal()} />
                            </View>

                            <View style={{ marginHorizontal: windowWidth * 0.05, marginBottom: windowHeight * 0.01 }}>
                                <TouchableOpacity onPress={() => setModalOptionsVisible(true)}>
                                <View style={{
                                    height: windowHeight * 0.2,
                                    width: windowHeight * 0.2,
                                    borderRadius: windowHeight * 0.1,
                                    borderColor: Color.colorBlue1,
                                    borderWidth: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                    marginTop: windowHeight * 0.01
                                }}>
                                    <Image
                                        source={{ uri: selectedUri ? selectedUri : selectedImage }}
                                        style={{
                                            height: windowHeight * 0.2,
                                            width: windowHeight * 0.2,
                                            borderRadius: windowHeight * 0.1,
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
                                    <MaterialIcons name="error" color="red" size={24} style={{ position: "absolute", right: 12 }}/>
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
                                    <MaterialIcons name="error" color="red" size={24} style={{ position: "absolute", right: 12 }}/>
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
                                    <MaterialIcons name="error" color="red" size={24} style={{ position: "absolute", right: 12 }}/>
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
                                    <MaterialIcons name="error" color="red" size={24} style={{ position: "absolute", right: 12 }}/>
                                )}
                                </View>
                                {areArraysEqual(serviceAvailability, defaultServiceAvailability) ? null : validateAvailabilityValues() ? null : (
                                    <Text style={errorText}>You have missing details in your schedule</Text>
                                )}
                            </TouchableOpacity>
                            </View> 

                            <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              height: 44,
              borderRadius: 6,
              alignItems: "center",
              justifyContent: "center",
              opacity: serviceNameVerify && serviceDescriptionVerify && priceVerify && !areArraysEqual(serviceAvailability, defaultServiceAvailability) && validateAvailabilityValues() && isChanged ? 1 : 0.5,
              marginVertical: windowHeight * 0.03,
              marginHorizontal: windowWidth * 0.05,
            }}
            onPress={saveChanges}
            disabled={!serviceNameVerify || !serviceDescriptionVerify || !priceVerify || areArraysEqual(serviceAvailability, defaultServiceAvailability) || !validateAvailabilityValues() || !isChanged}
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
    
                     </ScrollView>
                     
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
                                                                <Pressable onPress={() => handleChangeStartTime(item.value)}>
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
                                        <Pressable onPress={() => handleChangeEndTime(item.value)}>
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

                <Modal
    visible={showPostModal}
    animationType="slide"
    transparent={true}
>
<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
    <View style={{ backgroundColor: 'white', width: '90%', maxHeight: '80%', borderRadius: 10, }}>
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"always"}>
            
    <View flexDirection='row' style={{ borderBottomColor: Color.colorBlue, borderBottomWidth: 1, alignItems: 'center', justifyContent: 'space-between', marginVertical: windowHeight * 0.02 }}>
                                    <Text style={{
                                            fontSize: windowWidth * 0.06,
                                            fontWeight: '400',
                                            marginVertical: windowHeight * 0.01,
                                            color: Color.colorBlue,
                                            marginLeft: windowWidth * 0.05 
                                        }}>Create a Post</Text>
                                    <AntDesign style = {{ marginRight: windowWidth * 0.05 }} name="close" size= {windowWidth * 0.06} color={Color.colorBlue} onPress={closePostModal} />
                                </View>
            <View>
           
                <TextInput
                    style={styles.input}
                    multiline
                    placeholder="Write your post..."
                    textAlignVertical="top"
                    onChangeText={(text) => setReviewText(text)}
                    value={reviewText}
                />
                <TouchableOpacity style={{opacity : images && images.length === 3 ? 0.2 : 1, left: windowWidth * 0.77, bottom: windowHeight * 0.04}} onPress={ () => setModalOptionssVisible(true)} disabled={images && images.length === 3}>
                    <AntDesign name="camerao" size={24} color="gray" />
                </TouchableOpacity>    
            </View>
            

            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {images && images.map((image, index) => (
                <View key={index} style={{ position: 'relative' }}>
                     {image.includes('.mp4') ? <Video
                    source={{ uri: image }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={true}
                    shouldPlay
                    isLooping
                    style={styles.image}
                />
                : <Image source={{ uri: image }} style={styles.image} />}
                    <TouchableOpacity style={styles.closeIcon} onPress={() => removeImage(index)}>
                        <AntDesign name="closecircle" size={12} color="red" />
                    </TouchableOpacity>
                </View>
            ))}
        </View>
            <Button
                title="Submit"
                onPress={handleSubmitPost}
                filled
                Color={Color.colorWhite}
                style={styles.submitButton}
                disabled={reviewText === ''}
            />
        </ScrollView>
        </View>
    </View>
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
          <Pressable style={styles.closeButtons} onPress={() => setModalOptionsVisible(false)}>
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
      <Modal animationType="slide" transparent={true} visible={modalOptionssVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <Pressable style={styles.closeButtons} onPress={() => setModalOptionssVisible(false)}>
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
              onPress={handleCameraPicker}
            >
              <Text>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 16,
              }}
              onPress={handleImagePicker}
            >
              <Text>Photo Library</Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </Modal>
    </SafeAreaView>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff", // Change this to your desired background color
    shadowColor: "#000",
    paddingBottom: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 4,
    shadowRadius: 3.84,
    elevation: 5,
  },

  container1: {
    width: 136, 
    height: 40, 
    borderWidth: 2, 
    borderColor: COLORS.primary,
    alignItems:"center",
    textAlignVertical:"center",
    justifyContent:"center",
    textAlign:"center"
  },
  button: {
    alignSelf: 'center',
    marginVertical: windowHeight * 0.02,
    width: windowWidth * 0.8,
    height: windowHeight * 0.07,
},
input: {
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 5,
  padding: 10,
  height:200,
  maxHeight: 200,
  width: windowWidth * 0.8,
  alignSelf: 'center',
  // minHeight: 200,
},
cameraIconContainer: {
  position: 'absolute',
},
image: {
  width: 97,
  height: 97,
  resizeMode: 'cover',
  margin: 10,
  borderRadius: 10, // Add border radius for rounded corners
  borderWidth: 1, // Add border width for a border around the image
  borderColor: '#ddd', // Set border color
},
submitButton: {
  margin: 10,
},
closeIcon: {
  position: 'absolute',
  top: 5,
  right: 5,
},cameraIconContainer: {
  position: 'absolute',
  bottom: 30,
  right: 15,
},
closeButtons: {
  position: 'absolute',
  top: windowHeight * 0.02,
  right: 20,
},
});
