import * as React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity, ScrollView, Pressable } from "react-native";
import { Color, FontSize, FontFamily } from "../GlobalStyles";
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import firestore from "@react-native-firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { format } from 'date-fns';
import { Picker } from '@react-native-picker/picker';
import { Alert } from "react-native";

function ProviderEditProfileScreen(props){
  const [userData, setUserData] = useState("");
  const [storeData, setStoreData] = useState("");
  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");
  const [service, setService] = useState("Catering")
  const [contactNumber, setContactNumber] = useState("+63");
  const [birthdate, setBirthdate] = useState(new Date()); // Initial birthdate value
  const [address, setAddress] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false); // State to control the visibility of the date picker modal
  const navigation = useNavigation();
  const route = useRoute();
  const [nameError, setNameError] = useState("");
  const [shopNameError, setShopNameError] = useState("");
  const [contactNumberError, setContactNumberError] = useState("");
  const [birthdateError, setBirthdateError] = useState("");
  const [addressError, setAddressError] = useState("")
  const [image, setImage] = useState(null);
  const [isChanged, setIsChanged] = useState(false);

  async function getUserData() {
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    axios.post("http://172.16.3.248:5000/user/userdata", {token: token}).then((res) => {
      console.log(res.data);
      setUserData(res.data.data);
    }).catch((err) => {
      console.log(err);
    });
  }

  async function getStoreData() {
    try {
      const userRef = firestore().collection('users').doc(userData._id); // Assuming token is the document ID
      const doc = await userRef.get();
      if (doc.exists) {
        const storedData = doc.data();
        console.log(storedData);
        setStoreData(storedData);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error getting user data from Firestore:', error);
    }
  }

  useEffect(() => {
    if (route.params && route.params.userData) {
      setUserData(route.params.userData);
      navigation.setParams({ userData: route.params.userData });
    } else {
      getUserData();
    }
  }, [route.params]);

  useEffect(() => {
    getStoreData();
  }, [userData]);
  
  useEffect(() => {
    if (storeData && storeData.name) {
      setName(storeData.name);
    }
    if (storeData && storeData.shopName) {
      setShopName(storeData.shopName);
    }
    if (storeData && storeData.service) {
      setService(storeData.service);
    }
    if (storeData && storeData.mobile) {
      setContactNumber(storeData.mobile);
    }
    if (storeData && storeData.birthdate) {
      setBirthdate(storeData.birthdate.toDate()); // Convert Timestamp back to Date
  }
    if (storeData && storeData.address) {
      setAddress(storeData.address);
    }
  }, [storeData]);

  useEffect(() => {
    setIsChanged( // Check if any data has changed
      name !== storeData.name ||
      shopName !== storeData.shopName ||
      service !== storeData.service ||
      contactNumber !== storeData.mobile ||
      address !== storeData.address ||
      birthdate.getTime() !== (storeData.birthdate ? storeData.birthdate.toDate().getTime() : null)
    );
  }, [name, shopName, service, contactNumber, address, birthdate, storeData]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // Hide the date picker modal
    if (selectedDate) {
      // Validate the selected date
      if (isDateValid(selectedDate)) {
        setBirthdate(selectedDate); // Set the selected date as the birthdate
        setBirthdateError("");
      } else {
        setBirthdateError("Please select a valid birthdate or you should be at least 18 years old"); // Set an error message
      }
    }
  };
  
  // Validate the birthdate
  const isDateValid = (date) => {
    const currentDate = new Date();
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(currentDate.getFullYear() - 18);

  // Compare the selected date with eighteen years ago
  return date <= eighteenYearsAgo;
};

const handleSave = () => {
  try {
    saveDetails(userData._id);
    
    navigation.navigate('Profile', { updatedData: { name, shopName, service, mobile: contactNumber, birthdate, address } });
  } catch (error) {
    console.error('Error saving user details:', error);
  }
};

const saveDetails = async (userID) => {
  try{
    const userData = {
      userId: userID,
      name: name,
    }
    await axios.post("http://172.16.3.248:5000/user/updatedata", userData).then(async (res) => {
      console.log(`User details saved for user with ID: ${userID}`);
      }).catch((err) => {
        console.error('Error saving user details to MongoDB:', err);
      });
      const userRef = firestore().collection('users').doc(userID);
      await userRef.set({
        name: name,
        shopName: shopName,
        service: service,
        mobile: contactNumber,
        birthdate: firestore.Timestamp.fromDate(new Date(birthdate)),
        address: address,
      }, { merge: true })
      console.log(`User details saved for user with ID: ${userID}`);
      Alert.alert('User details saved successfully');
  } catch (error) {
      console.error('Error saving user details to Firestore:', error);
  }
}

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.providereditprofile}>
      
        <View style={[styles.provideeditprofileChild, styles.childPosition]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="arrow-left" color='#FFFFFF' style={styles.backIcon} />
        </TouchableOpacity>
            <Text style={[styles.euniceEnreraMakeup, styles.hairAndMakeTypo]}>
                {storeData && storeData.shopName ? storeData.shopName : "Shop Name"}
            </Text>
            <Text style={[styles.hairAndMake, styles.hairAndMakeTypo]}>
                {storeData && storeData.service ? storeData.service : "Service"}
            </Text>
            <Pressable onPress={pickImage} style={styles.seekereditprofileChild}>
            <Pressable> 
        {image ? (
  <Image style={styles.provideeditprofileItem} source={{ uri: image }} />
) : (
    <Image
    style={styles.provideeditprofileItem}
    contentFit="cover"
    source={require("../assets/rectangle-373.png")}
        />
)}
</Pressable>
                <View style={[styles.vectorParent, styles.frameChildLayout]}>
                    <Image
                        style={[styles.frameChild, styles.frameChildLayout]}
                        contentFit="cover"
                        source={require("../assets/rectangle-517.png")}
                    />
                    <Image
                        style={styles.cameraIcon}
                        contentFit="cover"
                        source={require("../assets/camera.png")}
                    />
                </View>
            </Pressable>
        </View>

        <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(text) => {
              setName(text);
              setNameError(text.length >= 1 && /^[A-Za-z\s]{0,50}$/.test(text) ? "" : "Name must not be blank and must contain only letters not exceeding 50 characters.");
            }}
            placeholder="Name"
          />
          {nameError ? <Text style={styles.errorMsg}>{nameError}</Text> : null}
          <Text style={styles.inputLabel}>Shop</Text>
          <TextInput
            style={styles.input}
            value={shopName}
            onChangeText={(text) => {
              setShopName(text);
              setShopNameError(text.trim().length >= 1 ? "" : "Shop Name must not be blank.");
            }}
            placeholder="Shop Name"
          />
          {shopNameError ? <Text style={styles.errorMsg}>{shopNameError}</Text> : null}
          <Text style={styles.inputLabel}>Service</Text>
          <Picker
          selectedValue={service}
          style={styles.input}
          onValueChange={(itemValue, itemIndex) => {
            setService(itemValue);
          }}
        >
          <Picker.Item label="Catering" value="Catering" />
          <Picker.Item label="Electrical" value="Electrical" />
          <Picker.Item label="Hair and Makeup" value="Hair and Makeup" />
          <Picker.Item label="Home Cleaning" value="Home Cleaning" />
          <Picker.Item label="Manicure/Pedicure" value="Manicure/Pedicure" />
          <Picker.Item label="Massage" value="Massage" />
          <Picker.Item label="Plumbing" value="Plumbing" />
          <Picker.Item label="Septic Tank Cleaning" value="Septic Tank Cleaning" />
          <Picker.Item label="Tutoring" value="Tutoring" />
        </Picker>
  <Text style={styles.inputLabel}>Contact Number</Text>
<TextInput
  style={styles.input}
  value={contactNumber}
  onChangeText={(text) => {
    // Check if the entered text starts with '+63'
    if (text.startsWith('+63')) {
      setContactNumber(text);
      setContactNumberError(text.length === 13 && /^(\+63[89])[0-9]{9}$/.test(text) ? "" : "Please enter a valid Philippine mobile number in the format +63*********.");
    }
  }}
  placeholder="Contact Number"/>
  {contactNumberError ? <Text style={styles.errorMsg}>{contactNumberError}</Text> : null}
  <Pressable onPress={() => setShowDatePicker(true)}>
  <Text style={styles.inputLabel}>Birthdate</Text>
  <TextInput
  style={[styles.input, styles.birthdateText]}
  value={format(birthdate, 'MM/dd/yyyy')} // Format the birthdate before displaying it
  editable={false}
/>
</Pressable>
{birthdateError ? <Text style={styles.errorMsg}>{birthdateError}</Text> : null}
{showDatePicker && (
  <DateTimePicker
    value={birthdate}
    mode="date"
    display="spinner"
    onChange={handleDateChange}
  />
)}
          <Text style={styles.inputLabel}>Address</Text>
<TextInput
  style={styles.input}
  value={address}
  onChangeText={(text) => {
    setAddress(text);
    setAddressError(text.trim().length >= 1 ? "" : "Address must not be blank.");
  }}
  placeholder="Address"
/>
{addressError ? <Text style={styles.errorMsg}>{addressError}</Text> : null}

        </View>
        <TouchableOpacity
          style={[
            styles.saveButton,
            {
              opacity: nameError ||
                shopNameError ||
                contactNumberError ||
                birthdateError ||
                addressError ||
                !address || !isChanged
                || !shopName || !service
                ? 0.5 // Set opacity to 0.5 when there are errors
                : 1,  // Set opacity to 1 when there are no errors
            },
          ]}
          onPress={handleSave}
          disabled={
            !!nameError ||
            !!shopNameError ||
            !!contactNumberError ||
            !!birthdateError ||
            !!addressError || 
            !address || !isChanged
            || !shopName || !service
          }
        >
          <LinearGradient
            colors={['#7CC2E3', '#3b5998', '#002F45']}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  providereditprofileChild: {
    top: 0,
    left: 0,
    backgroundColor: Color.colorDarkslategray_100,
    width: 430,
    height: 151,
    position: "absolute",
  },
  imageIcon: {
    top: 76,
    left: 27,
    width: 145,
    height: 141,
    position: "absolute",
  },
  providerName: {
    top: 106,
    left: 169,
    fontSize: FontSize.size_6xl,
    fontWeight: "600",
    fontFamily: FontFamily.quicksandSemiBold,
    color: Color.colorWhite,
    textAlign: "center",
    width: 261,
    position: "absolute",
  },
  frameChild: {
    left: 0,
    top: 0,
  },
  cameraIcon: {
    top: 0,
    left: 16,
    width: 19,
    height: 24,
  },
  vectorParent: {
    top: 176,
    left: 131,
  },
  frameChildLayout: {
    height: 41,
    width: 41,
    position: "absolute",
  },

  providereditprofile: {
    backgroundColor: Color.colorWhite,
    width: "100%",
    minHeight: 932,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
    flex: 1,
  },
  inputContainer: {
    marginTop: 240, // Adjust the margin here to lower the text fields
  },
  inputLabel: {
    marginBottom: 0,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
    width: 300, // Adjust the width as needed
    color: '#002F45', // Change the text color here
  },
  input: {
    height: 40,
    width: 300,
    borderColor: Color.colorDarkgray,
    borderRadius: 5,
    borderWidth: 1,
    marginVertical: 8,
    paddingHorizontal: 10,
  },
  birthdateText: {
    color: '#002F45', // Same text color as other fields
  },
  saveButton: {
    marginTop: 20, // Adjust the marginTop to lower the button
    marginBottom: 100,
  },
  gradientButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  childPosition: {
    left: 0,
    top: 0,
},
hairAndMakeTypo: {
    textAlign: "left",
    fontFamily: FontFamily.quicksandBold,
    fontWeight: "700",
    lineHeight: 15,
    left: 179,
    position: "absolute",
},
frameChildLayout: {
    height: 41,
    width: 41,
    position: "absolute",
},
provideeditprofileChild: {
    backgroundColor: Color.colorDarkslategray_100,
    width: 430,
    height: 151,
    position: "absolute",
},
provideeditprofileItem: {
    top: 45,
    left: 27,
    width: 143,
    height: 146,
    position: "absolute",
},
euniceEnreraMakeup: {
    top: 112,
    fontSize: FontSize.size_mini,
    letterSpacing: 0.8,
    color: Color.colorWhite,
    width: 239,
},
hairAndMake: {
    top: 159,
    fontSize: FontSize.size_xs,
    letterSpacing: 0.6,
    color: Color.colorDarkslategray_200,
    width: 261,
},
frameChild: {
    left: 0,
    top: 0,
},
cameraIcon: {
    top: 13,
    left: 16,
    width: 19,
    height: 24,
    position: "absolute",
},
vectorParent: {
    top: 150,
    left: 129,
},
provideeditprofile: {
    backgroundColor: Color.colorWhite,
    flex: 1,
    width: "100%",
    height: 932,
    overflow: "hidden",
},
scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
}, errorMsg: {
  color: 'red',
  fontSize: 14,
  marginTop: 5,
},
backIcon: {
  top: 30, // Adjust the top value to position the icon lower
  left: 25,
  fontSize: 25,
},


});

export default ProviderEditProfileScreen;
