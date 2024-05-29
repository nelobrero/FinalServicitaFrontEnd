import { View, Text, TextInput, TouchableOpacity, Image, Pressable, Dimensions, ScrollView, Alert, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { Color, errorText, Border } from '../../GlobalStyles';
import Button from '../../components/Button';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import Error from '@expo/vector-icons/MaterialIcons';
import { AccessToken, GraphRequest, GraphRequestManager, LoginManager} from 'react-native-fbsdk-next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useNotifications, createNotifications } from 'react-native-notificated';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function RegisterPage ({navigation, route, props}) {
    const { NotificationsProvider } = createNotifications();
    const { notify } = useNotifications();
    
    const [timer, setTimer] = useState(null);
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
    const [code, setCode] = useState(['', '', '', '']);
    const inputRefs = useRef([]);
    const [modalVisible, setModalVisible] = useState(false);
    
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const formattedBirthday = birthday ? 
    `${(birthday.getMonth() + 1).toString().padStart(2, '0')}/${birthday.getDate()}/${birthday.getFullYear()}` 
    : null;

    const { role } = route.params;
    const [roleText, setRoleText] = useState(role === 'Seeker' ? 'Seeking' : 'Servicing');


    useEffect(() => {
        
        if (modalVisible !== false) {
            setTimer(300);
            fetchServerTime();
            const interval = setInterval(() => {
                setTimer(prevTimer => {
                    if (prevTimer <= 0) {
                        return prevTimer;
                    }
                    return prevTimer - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [modalVisible]);

    

    useEffect(() => {
        notify('info', {
          params: {
            title: `Hello, future ${role}!`,
            description: 'Please fill in the following details to get started.',
            style: {
                multiline: 2,
            }
          },
        });
      }, [])

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
  
            const infoRequest = new GraphRequest('/me?fields=email,first_name,last_name', null, (error, result) => {
              if (error) {
                console.error('Error fetching user data from Facebook:', error);
              } else {
                console.log('Facebook user data:', result);
                const userData = {
                  email: result.email,
                  userId: result.id,
                  firstName: result.first_name,
                  lastName: result.last_name, 
                };
                checkIfEmailExists(userData.email)
                  .then((emailExists) => {
                    if (emailExists) {
                        if (emailExists) {
                            Alert.alert('Error', 'An account with this email already exists. Please login again using Facebook', [{ text: 'OK' , onPress: () => navigation.navigate('Login') }]);
                        } else {
                            navigation.navigate('MissingInfo', { email: userData.email, firstName: userData.firstName, lastName: userData.lastName, userId: userData.userId, role: role });
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
            firstName: userInfo.user.givenName,
            lastName: userInfo.user.familyName,
            email: userInfo.user.email,
          };
          const emailExists = await checkIfEmailExists(userData.email);
          if (emailExists) {
            GoogleLogOut();
            Alert.alert('Error', 'An account with this email already exists. Please login again using Google.', [{ text: 'OK' , onPress: () => navigation.navigate('Login') }]);
          } else {
            GoogleLogOut();
            navigation.navigate('MissingInfo', { email: userData.email, firstName: userData.firstName, lastName: userData.lastName, userId: userData.userId, role: role });
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
            const userData = {
                email: email,
            }
            const res = await axios.post("http://192.168.1.7:5000/user/getUserDetailsByEmail", userData);
            if (res.data.status === 'SUCCESS') {
                return true;
            }
          } catch (error) {
            if (error.response.data.message === "User not found!") {
                return false;
            }
          }
    }

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        return formattedTime;
    };

    const hideModal = () => {
        setModalVisible(false);
    }

    const handleContinuePress = () => {
        
        const userData = {
            email: email,
            name: `${firstName} ${lastName}`,
          }
        axios.post("http://192.168.1.7:5000/email_verification_otp/sendEmail", userData).then((res) => {
          console.log(res.data);
          if (res.data.status === 'PENDING') {
            setModalVisible(true);
            Alert.alert('Verification', 'An email has been sent to your email address. Please enter the code to verify your email.', [{ text: 'OK' }]);
          } else {
            Alert.alert('Error', 'An error occurred while processing your request. Please try again later.', [{ text: 'OK' }]);
          }}).catch((err) => {
            if (err.response.data.message === "Email already exists in the system.") {
              Alert.alert('Error', 'An account with this email already exists in the system.', [{ text: 'OK' }]);
            } else if (err.response.data.message === "Email has recently been verified but has not finished the registration process yet.") {
              Alert.alert('Error', 'Email has recently been verified but has not finished the registration process yet. Please login using the option you used to proceed to the mobile verification screen', [{ text: 'OK' }, { text: ' Go to Login', onPress: () => navigation.navigate('Login') }]);
            }
            console.log(err);
          });
    }

    const updateCode = (index, value) => {
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        console.log(newCode);
    
        if (value === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        } else if (value !== '' && index < code.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleVerifyPress = () => {
        const userData = {
            email: email,
            otp: code.join(''),
        }
          axios.post("http://192.168.1.7:5000/email_verification_otp/verifyOTP", userData).then((res) => {
          console.log(res.data);
          if (res.data.status === 'SUCCESS') {
            setModalVisible(false);
            Alert.alert('Success', 'Your email has been verified successfully. Please continue.', [{ text: 'OK', onPress: () => navigation.navigate('AddressForm', { firstName: firstName, lastName: lastName, email: email, role: role, birthDate: formattedBirthday  })}]);
          } else {
            Alert.alert('Error', 'An error occurred while processing your request. Please try again later.', [{ text: 'OK' }]);
          }}).catch((err) => {
            if(err.response.data.message === "Invalid code passed."){
              Alert.alert('Error', 'Invalid code passed.', [{ text: 'OK'}]);
            } else {
              Alert.alert('Error', 'An error occurred while processing your request. Please try again later.', [{ text: 'OK' }]);
              console.log(err.response.data.message);
            }
          });
    };

    const handleSendAgainPress = () => {
        setTimer(300);
        const userData = {
            email: email,
            name: `${firstName} ${lastName}`,
          }
        axios.post("http://192.168.1.7:5000/email_verification_otp/sendEmail", userData).then((res) => {
          console.log(res.data);
          if (res.data.status === 'PENDING') {
            fetchServerTime();
            Alert.alert('Resent', 'OTP has been resent. Please check your email.', [{ text: 'OK'}]);
          } else {
            Alert.alert('Error', 'An error occurred while processing your request. Please try again later.', [{ text: 'OK' }]);
          }}).catch((err) => {
            console.log(err);
          });
    };


    const fetchServerTime = async () => {
        try {
            console.log('Fetching server time...');
            const response = await axios.get(`http://192.168.1.7:5000/email_verification_otp/getRemainingCurrentTime/${email}`);
            const remainingTime = Math.floor(response.data.remainingTime / 1000);
            if (remainingTime <= 0) {
                setTimer(0);
            } else {
                setTimer(remainingTime);
            }
            
            console.log('Server time fetched:', remainingTime)
        } catch (error) {
            console.log('Error fetching server time:', error);
        }
    };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.colorWhite }}>
        <View style={{ alignItems: 'center' }}>
        <NotificationsProvider />
        </View>
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
                    }}>Email Address</Text>

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
                
                <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >


            <View style={styles.centeredView}>
            
              <View style={styles.modalView}>
              <View flexDirection='row' style={{ borderBottomColor: Color.colorBlue, borderBottomWidth: 1, alignItems: 'center', justifyContent: 'space-between', marginVertical: windowHeight * 0.01 }}>
                            <Text style={{
                                    fontSize: windowWidth * 0.06,
                                    fontWeight: '400',
                                    marginVertical: windowHeight * 0.01,
                                    color: Color.colorBlue,
                                    marginLeft: windowWidth * 0.05 
                                }}>Verify Code</Text>
                            <AntDesignIcon style = {{ marginRight: windowWidth * 0.05 }} name="close" size= {windowWidth * 0.06} color={Color.colorBlue} onPress={() => hideModal()} />
                            </View>
              <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={[styles.passwordRecovery, styles.passwordFlexBox]}>We’ve sent the code to:</Text>
                <Text style={[styles.enterYourEmail, styles.passwordFlexBox]}>{email}</Text>
                <View style={styles.timerContainer}>
                    <Text style={styles.text}>Code expires in: </Text>
                    <Text style={[styles.text, {fontWeight: '800'}]}>{formatTime(timer)}</Text>
                </View>
            </View>
                <View style={styles.codeInputContainer}>
                  {[0, 1, 2, 3].map((index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => (inputRefs.current[index] = ref)}
                      style={styles.codeInput}
                      keyboardType="numeric"
                      maxLength={1}
                      onKeyPress={({ nativeEvent }) => {
                        if (nativeEvent.key === 'Backspace' && code[index] === '') {
                          if (index !== 0) {
                            updateCode(index, '');
                            inputRefs.current[index - 1].focus();
                          }
                        } else if (!isNaN(nativeEvent.key) && code[index] && index !== 3) {
                          inputRefs.current[index + 1].setNativeProps({ text: nativeEvent.key });
                          updateCode(index + 1, nativeEvent.key);
                        }
                      }}
                      onChange={(e) => updateCode(index, e.nativeEvent.text)}
                    />
                  ))}
                </View>
                <Button
                  title="Verify"
                  filled
                  Color={Color.colorWhite}
                  onPress={handleVerifyPress}
                  disabled={timer === 0 || code.includes('')}
                  style={styles.button}
                />
                <Button
                  title="Send Again"
                  Color={Color.colorWhite}
                  onPress={handleSendAgainPress}
                  style={styles.buttons}
                />
              </View>
            </View>
        </Modal>


                <Button
                title="Continue"
                onPress={handleContinuePress}
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
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: 'white', 
        width: '80%', 
        maxHeight: '90%', 
        borderRadius: 10,
    },
    codeInputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    codeInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        margin: 5,
        width: 50,
        textAlign: 'center',
        color: Color.colorBlue,
        borderColor: Color.colorGray,
        backgroundColor: Color.colorGainsboro,
        borderRadius: Border.br_3xs,
    },
    button: {
        marginTop: windowHeight * 0.02,
        width: windowWidth * 0.65,
        height: windowHeight * 0.08,
        alignSelf: 'center',    
    },
    buttons: {
        marginVertical: windowHeight * 0.02,
        width: windowWidth * 0.65,
        height: windowHeight * 0.08,
        alignSelf: 'center',    
    },
    passwordFlexBox: {
        marginTop: windowHeight * 0.02,
        marginVertical: windowHeight * 0.001,
    },
    passwordRecovery: {
        fontSize: windowHeight * 0.023,
        fontWeight: 'bold',
    },
    enterYourEmail: {
        fontSize: windowHeight * 0.018,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: windowHeight * 0.02,
    },
    text: {
        fontSize: windowHeight * 0.018,
    },
})
