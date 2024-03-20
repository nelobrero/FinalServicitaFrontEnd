import { View, Text, TextInput, TouchableOpacity, Image, Pressable, Dimensions, ScrollView, Alert, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { Color, errorText } from './../../GlobalStyles';
import Button from './../../components/Button';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import Error from '@expo/vector-icons/MaterialIcons';
import { AccessToken, GraphRequest, GraphRequestManager, LoginManager} from 'react-native-fbsdk-next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import axios from 'axios';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function AddressForm ({navigation, route, props}) {
    const [streetAddress1, setStreetAddress1] = useState('');
    const [streetAddress1Verify, setStreetAddress1Verify] = useState(false);
    const [streetAddress2, setStreetAddress2] = useState('');
    const [city, setCity] = useState('');
    const [cityVerify, setCityVerify] = useState(false);
    const [state, setState] = useState('');
    const [stateVerify, setStateVerify] = useState(false);
    const [postalCode, setPostalCode] = useState('');
    const [postalCodeVerify, setPostalCodeVerify] = useState(false);
    

    const { name, email, role, birthDate } = route.params;
    const [roleText, setRoleText] = useState(role === 'Seeker' ? 'Seeking' : 'Servicing');
    const validateFields = () => {
        return streetAddress1Verify && cityVerify && stateVerify && postalCodeVerify;
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

                <View style={{ marginBottom: windowHeight * 0.01 }}>
                    <Text style={{
                        fontSize: windowWidth * 0.05,
                        fontWeight: '400',
                        marginVertical: windowHeight * 0.01,
                        color: Color.colorBlue
                    }}>City/Town</Text>
                    
                    <View style={{
                        width: '100%',
                        height: windowHeight * 0.06,
                        borderColor: city === null || city === '' ? Color.colorBlue1 : cityVerify ? Color.colorGreen : Color.colorRed,
                        borderWidth: 1,
                        borderRadius: windowHeight * 0.015,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingLeft: windowWidth * 0.05,
                        paddingHorizontal: windowWidth * 0.13,
                        flexDirection: 'row'
                    }}>
                        <Error name="location-city" color = {city === null || city === '' ? Color.colorBlue1 : cityVerify ? Color.colorGreen : Color.colorRed} style={{marginRight: 5, fontSize: 24}} />
                        <TextInput
                            placeholder='Enter city or town'
                            placeholderTextColor={Color.colorBlue}
                            style={{
                                width: '100%'
                            }}
                            onChange={(e) => {
                                const citi = e.nativeEvent.text;
                                setCity(citi);
                                setCityVerify(citi.length > 0 && citi.length <= 25);
                            }}
                        />
                        {city.length < 1 ? null : cityVerify ? (
                            <Feather name="check-circle" color="green" size={24} style={{ position: "absolute", right: 12 }}/>
                        ) : (                                                                     
                            <Error name="error" color="red" size={24} style={{ position: "absolute", right: 12 }}/>
                        )}
                    </View>
                    {city.length < 1 ? null : cityVerify ? null : (
                        <Text style={errorText}>City/Town must not exceed 25 characters.</Text>
                    )}
                </View>

                <View style={{ marginBottom: windowHeight * 0.01 }}>
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
                </View>


                <Button
                    title="Next"
                    onPress={() => navigation.navigate("Register2", { name: name, email: email, role: role, address: streetAddress1 + " " + streetAddress2 + ", " + city + ", " + state + ", " + postalCode, birthDate: birthDate })}
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
})
