import { View, Text, TextInput, TouchableOpacity, Image, Pressable, Dimensions, ScrollView, Alert, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { Color, errorText } from '../../GlobalStyles';
import Button from '../../components/Button';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import Error from '@expo/vector-icons/MaterialIcons';
import { AccessToken, GraphRequest, GraphRequestManager, LoginManager} from 'react-native-fbsdk-next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function RegisterPage ({navigation, route, props}) {
    const [firstName, setFirstName] = useState('');
    const [firstNameVerify, setFirstNameVerify] = useState(false);
    const [lastName, setLastName] = useState('');
    const [lastNameVerify, setLastNameVerify] = useState(false);
    const [email, setEmail] = useState('');
    const [emailVerify, setEmailVerify] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [birthday, setBirthday] = useState(null);
    const [birthdayVerify, setBirthdayVerify] = useState(false);
    const [datePickerOpened, setDatePickerOpened] = useState(false);
    
    
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const formattedBirthday = birthday ? 
    `${(birthday.getMonth() + 1).toString().padStart(2, '0')}/${birthday.getDate()}/${birthday.getFullYear()}` 
    : null;

    const { role } = route.params;
    const [roleText, setRoleText] = useState(role === 'Seeker' ? 'Seeking' : 'Servicing');

    const validateName = (name, setName, setNameVerify) => {
        const trimmedName = name.trim();
        setName(trimmedName);
        setNameVerify(trimmedName && /^[a-zA-Z\s]+$/.test(trimmedName) && trimmedName.length <= 25)
      };

    const validateFields = () => {
        
        return firstNameVerify && lastNameVerify && emailVerify && birthdayVerify;
    }

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || birthday;
        setShowDatePicker(false);
        setBirthday(currentDate);
        setBirthdayVerify(currentDate <= minDate);
    }

    const onFacebookButtonPress = async () => {
        try {
          const loginResult = await LoginManager.logInWithPermissions(['public_profile', 'email']);
          
          if (loginResult.isCancelled) {
            console.log('Facebook login canceled');
          } else {
            const accessTokenData = await AccessToken.getCurrentAccessToken();
            const { accessToken } = accessTokenData;
            console.log(accessToken);
  
            const infoRequest = new GraphRequest('/me?fields=email,name', null, (error, result) => {
              if (error) {
                console.error('Error fetching user data from Facebook:', error);
              } else {
                console.log('Facebook user data:', result);
                const userData = {
                  email: result.email,
                  userId: result.id,
                  name: result.name,
                };
                checkIfEmailExists(userData.email)
                  .then((emailExists) => {
                    if (emailExists) {
                        if (emailExists) {
                            Alert.alert('Error', 'An account with this email already exists.', [{ text: 'OK' , onPress: () => navigation.navigate('Login') }]);
                        } else {
                            navigation.navigate('MissingInfo', { email: userData.email, name: userData.name, userId: userData.userId, role: role });
                        }
                    }
                  })
                  .catch((error) => {
                    console.error('Error checking if email exists:', error);
                  })
                  .finally(() => {
                    FacebookLogOut();
                    console.log('Facebook has been logged out');
                  });
              }
            });
      
            new GraphRequestManager().addRequest(infoRequest).start();
          }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while trying to sign in with Facebook. Please try again.', [{ text: 'OK' }]);
            console.error('Error during Facebook login:', error);
        }
    };

    const GoogleSignIn = async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          const userData = {
            userId: userInfo.user.id,
            name: userInfo.user.name,
            email: userInfo.user.email,
          };
          const emailExists = await checkIfEmailExists(userData.email);
          if (emailExists) {
            GoogleLogOut();
            Alert.alert('Error', 'An account with this email already exists.', [{ text: 'OK' , onPress: () => navigation.navigate('Login') }]);
          } else {
            GoogleLogOut();
            navigation.navigate('MissingInfo', { email: userData.email, name: userData.name, userId: userData.userId, role: role });
          }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while trying to sign in with Google. Please try again.', [{ text: 'OK' }]);
            console.log(error)
        }
    }
      
    const FacebookLogOut = () => {
        try {
          LoginManager.logOut();
        } catch (error) {
          console.log(error);
        }
    }

    const GoogleLogOut = () => {
        try {
            GoogleSignin.revokeAccess();
            GoogleSignin.signOut();
        } catch (error) {
          console.log(error);
        }
    }
    
    const checkIfEmailExists = async (email) => {
        try {
          const emailExists = await axios.post('http://192.168.1.14:5000/user/checkIfEmailExists', { email: email });
            if (emailExists.data) {
              return true;
            } else {
                return false;
            }
        } catch (error) {
          console.error('Error checking if email exists in MongoDB:', error);
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
                    }}>First Name</Text>
                    
                    <View style={{
                        width: '100%',
                        height: windowHeight * 0.06,
                        borderColor: firstName === null || firstName === '' ? Color.colorBlue1 : firstNameVerify ? Color.colorGreen : Color.colorRed,
                        borderWidth: 1,
                        borderRadius: windowHeight * 0.015,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingLeft: windowWidth * 0.05,
                        paddingHorizontal: windowWidth * 0.13,
                        flexDirection: 'row'
                    }}>
                        <FontAwesome name="user" color = {firstName === null || firstName === '' ? Color.colorBlue1 : firstNameVerify ? Color.colorGreen : Color.colorRed} style={{marginRight: 5, fontSize: 24}} />
                        <TextInput
                            placeholder='Enter your first name'
                            placeholderTextColor={Color.colorBlue}
                            style={{
                                width: '100%'
                            }}
                            onChange={(e) => validateName(e.nativeEvent.text, setFirstName, setFirstNameVerify)}
                        />
                        {firstName.length < 1 ? null : firstNameVerify ? (
                            <Feather name="check-circle" color="green" size={24} style={{ position: "absolute", right: 12 }}/>
                        ) : (                                                                     
                            <Error name="error" color="red" size={24} style={{ position: "absolute", right: 12 }}/>
                        )}
                    </View>
                    {firstName.length < 1 ? null : firstNameVerify ? null : (
                        firstName.length > 25 ? (
                            <Text style={errorText}>First name must not exceed 25 characters.</Text>
                        ) : (
                            <Text style={errorText}>First name must contain only letters.</Text>
                        )
                    )}
                </View>

                <View style={{ marginBottom: windowHeight * 0.01 }}>
                    <Text style={{
                        fontSize: windowWidth * 0.05,
                        fontWeight: '400',
                        marginVertical: windowHeight * 0.01,
                        color: Color.colorBlue
                    }}>Last Name</Text>

                    <View style={{
                        width: '100%',
                        height: windowHeight * 0.06,
                        borderColor: lastName === null || lastName === '' ? Color.colorBlue1 : lastNameVerify ? Color.colorGreen : Color.colorRed,
                        borderWidth: 1,
                        borderRadius: windowHeight * 0.015,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingLeft: windowWidth * 0.05,
                        paddingHorizontal: windowWidth * 0.14,
                        flexDirection: 'row'
                    }}>
                        <FontAwesome name="users" color = {lastName === null || lastName === '' ? Color.colorBlue1 : lastNameVerify ? Color.colorGreen : Color.colorRed} style={{marginRight: 5, fontSize: 24}} />
                        <TextInput
                            placeholder='Enter your last name'
                            placeholderTextColor={Color.colorBlue}
                            keyboardType='phone-pad'
                            style={{
                                width: '100%'
                            }}
                            onChange={(e) => validateName(e.nativeEvent.text, setLastName, setLastNameVerify)}
                        />
                        {lastName.length < 1 ? null : lastNameVerify ? (
                            <Feather name="check-circle" color="green" size={24} style={{ position: "absolute", right: 12 }}/>
                        ) : (                                                                     
                            <Error name="error" color="red" size={24} style={{ position: "absolute", right: 12 }}/>
                        )}
                    </View>
                    {lastName.length < 1 ? null : lastNameVerify ? null : (
                        lastName.length > 25 ? (
                            <Text style={errorText}>Last name must not exceed 25 characters.</Text>
                        ) : (
                            <Text style={errorText}>Last name must contain only letters.</Text>
                        )
                    )}
                </View>

                <View style={{ marginBottom: windowHeight * 0.01 }}>
                    <Text style={{
                        fontSize: windowWidth * 0.05,
                        fontWeight: '400',
                        marginVertical: windowHeight * 0.01,
                        color: Color.colorBlue
                    }}>Email address</Text>

                    <View style={{
                        width: '100%',
                        height: windowHeight * 0.06,
                        borderColor: email === null || email === '' ? Color.colorBlue1 : emailVerify ? Color.colorGreen : Color.colorRed,
                        borderWidth: 1,
                        borderRadius: windowHeight * 0.015,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingLeft: windowWidth * 0.05,
                        paddingHorizontal: windowWidth * 0.14,
                        flexDirection: 'row'                   
                    }}>
                        <FontAwesome name="envelope" color = {email === null || email === '' ? Color.colorBlue1 : emailVerify ? Color.colorGreen : Color.colorRed} style={{marginRight: 5, fontSize: 24}} />
                        <TextInput
                            placeholder='Enter your email address'
                            placeholderTextColor={Color.colorBlue}
                            keyboardType='email-address'
                            style={{
                                width: '100%'
                            }}
                            onChange={(e) => {
                                const trimmedEmail = e.nativeEvent.text.trim();
                                setEmail(trimmedEmail);
                                setEmailVerify(trimmedEmail.length > 1 && /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/.test(trimmedEmail));
                            }}
                        />
                        {email.length < 1 ? null : emailVerify ? (
                            <Feather name="check-circle" color="green" size={24} style={{ position: "absolute", right: 12 }}/>
                        ) : (
                            <Error name="error" color="red" size={24} style={{ position: "absolute", right: 12 }}/>
                        )}
                    </View>
                    {email.length < 1 ? null : emailVerify ? null : (
                        <Text style={errorText}>Please enter a valid email address.</Text>
                    )}
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
                <Button
                    title="Next"
                    onPress={() => navigation.navigate("AddressForm", { name: firstName + " " + lastName, email: email, role: role, birthDate: formattedBirthday })}
                    filled
                    Color={Color.colorWhite}
                    style={{
                        marginTop: windowHeight * 0.02,
                        marginBottom: windowHeight * 0.05,
                    }}
                    disabled={!validateFields()}
                />

                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: windowHeight * 0.025 }}>
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: Color.colorGrey,
                            marginHorizontal: windowWidth * 0.01
                        }}
                    />
                    <Text style={{ fontSize: windowWidth * 0.035 }}>Or Sign up with</Text>
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: Color.colorGrey,
                            marginHorizontal: windowWidth * 0.01
                        }}
                    />
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}>

                    <TouchableOpacity
                        onPress={onFacebookButtonPress}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            height: windowHeight * 0.08,
                            borderWidth: 0,
                            borderColor: Color.colorWhite,
                            marginRight: windowWidth * 0.02,
                            borderRadius: windowHeight * 0.02
                        }}
                    >
                        <Image
                            source={require("./../../assets/facebook.png")}
                            style={{
                                height: windowHeight * 0.05,
                                width: windowHeight * 0.05,
                                marginRight: -windowWidth * 0.1
                            }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={GoogleSignIn}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            height: windowHeight * 0.08,
                            borderWidth: 1,
                            borderColor: Color.colorWhite,
                            marginRight: windowWidth * 0.02,
                            borderRadius: windowHeight * 0.02
                        }}
                    >
                        <Image
                            source={require("./../../assets/google.png")}
                            style={{
                                height: windowHeight * 0.07,
                                width: windowHeight * 0.07,
                                marginRight: windowWidth * 0.1
                            }}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginVertical: windowHeight * 0.025
                }}>
                    <Text style={{ fontSize: windowWidth * 0.05, color: Color.black }}>Already have an account?</Text>
                    <Pressable
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text style={{
                            fontSize: windowWidth * 0.05,
                            color: Color.colorPrimary,
                            fontWeight: 'bold',
                            marginLeft: windowWidth * 0.015
                        }}>Login</Text>
                    </Pressable>
                </View>
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
    }
})
