import React, { useState } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, ScrollView, Pressable, Platform, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../../styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import Error from '@expo/vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { format } from 'date-fns';

function RegisterPage({props}) {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [firstNameVerify, setFirstNameVerify] = useState(false);
  const [lastName, setLastName] = useState('');
  const [lastNameVerify, setLastNameVerify] = useState(false);
  const [email, setEmail] = useState('');
  const [emailVerify, setEmailVerify] = useState(false);
  const [mobile, setMobile] = useState('');
  const [mobileVerify, setMobileVerify] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  

  const validateFields = () => {

    const isFirstNameValid = firstName.length > 0 && firstNameVerify;
    const isLastNameValid = lastName.length > 0 && lastNameVerify;
    const isEmailValid = email.length > 0 && emailVerify;
    const isMobileValid = mobile.length > 0 && mobileVerify;
    const isPasswordValid = password.length > 0 && passwordVerify;
    const isDateOfBirthValid = dateOfBirth.length > 0;
  
    return (
      isFirstNameValid &&
      isLastNameValid &&
      isEmailValid &&
      isMobileValid &&
      isPasswordValid &&
      isDateOfBirthValid
    );
  };
  

  const handleSubmit = () => {
    
    const userData = {
      name: firstName + ' ' + lastName,
      email: email,
      mobile: mobile,
      password: password,
      dateOfBirth: dateOfBirth,
    }
    axios.post("http://192.168.1.3:5000/user/signup", userData).then((res) => {
      
    console.log(res.data)
    if (res.data.status === 'PENDING') {
      Alert.alert('Verification', 'Please check your email for the verification link.', [{ text: 'OK', onPress: () => navigation.navigate('Login') }]);
      navigation.navigate('Login')
      // Insert Verification Page
    } else {
      Alert.alert('Error', 'An error occurred while processing your request. Please try again later.', [{ text: 'OK' }]);
    }}).catch((err) => {
      console.log(err);
      if(err.response.data.message === "Email is being used by another user."){
        Alert.alert('Error', 'Email is already being used by another user.', [{ text: 'OK', onPress: () => navigation.navigate('Login') }]);
      } else {
        Alert.alert('Error', 'An error occurred while processing your request. Please try again later.', [{ text: 'OK' }]);
      }
    });
  }

  const validateName = (name, setName, setNameVerify) => {
    const trimmedName = name.trim();
    setName(trimmedName);
    setNameVerify(trimmedName && /^[a-zA-Z\s]+$/.test(trimmedName));
  };

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  }

    const onChange = ({ type }, selectedDate) => {
      if (type === 'set') {
        
        const formattedDate = format(selectedDate, 'MM-dd-yyyy');
        setDateOfBirth(formattedDate);

        if (Platform.OS === 'android') {
          toggleDatePicker();
        }
      } else {
        toggleDatePicker();
      }
    };
  
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"always"}>
      <View>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require('../../assets/Logo.png')} />
        </View>
        <View style={styles.loginContainer}>
          <Text style={styles.text_header}>Sign up</Text>
          <View style={styles.action}>
            <FontAwesome name="user" color="#38AEE6" style={styles.smallIcon} />
            <TextInput placeholder="First Name" style={styles.textInput} onChange={(e) => validateName(e.nativeEvent.text, setFirstName, setFirstNameVerify)} />
              {firstName.length < 1 ? null : firstNameVerify ? (
                <Feather name="check-circle" color="green" size={20} />
              ) : (
                <Error name="error" color="red" size={20} />
              )}
          </View>
          {firstName.length < 1 ? null : firstNameVerify ? null : (
            <Text style={styles.errorMsg}>A name must contain only letters.</Text>
          )}
          <View style={styles.action}>
            <FontAwesome name="user" color="#38AEE6" style={styles.smallIcon} />
            <TextInput placeholder="Last Name" style={styles.textInput} onChange={(e) => validateName(e.nativeEvent.text, setLastName, setLastNameVerify)} />
              {lastName.length < 1 ? null : lastNameVerify ? (
                <Feather name="check-circle" color="green" size={20} />
              ) : (
                <Error name="error" color="red" size={20} />
              )}
          </View>
          {lastName.length < 1 ? null : lastNameVerify ? null : (
            <Text style={styles.errorMsg}>A name must contain only letters.</Text>
          )}
          <View style={styles.action}>
            <FontAwesome name="envelope" color="#38AEE6" style={styles.smallIcon} />
            <TextInput placeholder="Email" style={styles.textInput} onChange={(e) => {
                const trimmedEmail = e.nativeEvent.text.trim();
                setEmail(trimmedEmail);
                setEmailVerify(trimmedEmail.length > 1 && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/.test(trimmedEmail));
              }} />
              {email.length < 1 ? null : emailVerify ? (
                <Feather name="check-circle" color="green" size={20} />
              ) : (
                <Error name="error" color="red" size={20} />
              )}
          </View>
          {email.length < 1 ? null : emailVerify ? null : (
            <Text style={styles.errorMsg}>Please enter a valid email address.</Text>
          )}
          <View style={styles.action}>
            <FontAwesome name="phone" color="#38AEE6" style={styles.smallIcon} />
            <TextInput placeholder="Contact Number" style={styles.textInput} keyboardType="phone-pad" onChange={(e) => {
                const number = e.nativeEvent.text;
                setMobile(number);
                setMobileVerify(number.length > 1 && /^09[0-9]{9}$/.test(number));
              }} />
              {mobile.length < 1 ? null : mobileVerify ? (
                <Feather name="check-circle" color="green" size={20} />
              ) : (
                <Error name="error" color="red" size={20} />
              )}
          </View>
          {mobile.length < 1 ? null : mobileVerify ? null : (
            <Text style={styles.errorMsg}>Please enter a valid Philippine mobile number in the format 09*********.</Text>
          )}
          <View style={styles.action}>
            <FontAwesome name="lock" color="#38AEE6" style={styles.smallIcon} />
            <TextInput placeholder="Password" style={styles.textInput} secureTextEntry={showPassword} onChange={(e) => {
                const passwordInput = e.nativeEvent.text;
                setPassword(passwordInput);
                setPasswordVerify(passwordInput.length > 1 && /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(passwordInput));
              }}/>
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather name={showPassword ? 'eye' : 'eye-off'} color={password === null || password === '' ? 'grey' : passwordVerify ? 'green' : 'red'} size={20} />
              </TouchableOpacity>
          </View>
          {password.length < 1 ? null : passwordVerify ? null : (
            <Text style={styles.errorMsg}>Password must be at least 8 characters long and include at least one uppercase letter and one digit.</Text>
          )}
          <View style={styles.action}>
            <FontAwesome name="calendar" color="#38AEE6" style={styles.smallIcon} />
            {showPicker && (
                <DateTimePicker mode='date' display='spinner' value={date} onChange={onChange} maximumDate={eighteenYearsAgo}/>
            )}
            {!showPicker && (
              <Pressable onPress={toggleDatePicker}>
                <TextInput placeholder="Date of Birth" style={styles.textInput} value={dateOfBirth} onChangeText={setDateOfBirth} editable={false}/>
              </Pressable>
            )}
          </View>
        </View>
        <View style={styles.button}>
        {validateFields() ? (
          <TouchableOpacity
            style={[styles.inBut]}
            onPress={handleSubmit}
          >
            <View>
              <Text style={styles.textSign}>Register</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={[styles.inBut, styles.disabledButton]}>
            <View>
              <Text style={styles.textSign}>Register</Text>
            </View>
          </View>
        )}
          <View style={{ padding: 15 }}>
            <Text style={{ ...styles.click_footer_two, color: '#919191' }}>---Or Register Using---</Text>
          </View>
          <View style={styles.bottomButton}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity style={styles.inBut2}>
                <FontAwesome name="facebook" color="#fff" style={styles.smallIcon2} />
              </TouchableOpacity>
              <Text style={styles.bottomText}>Facebook</Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity style={styles.inBut2}>
                <FontAwesome name="google" color="#fff" style={styles.smallIcon2} />
              </TouchableOpacity>
              <Text style={styles.bottomText}>Google</Text>
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity style={styles.inBut2}>
                  <FontAwesome name="mobile" color='#fff' style={styles.smallIcon2} />
                </TouchableOpacity>
              <Text style={styles.bottomText}>Mobile</Text>                    
            </View>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
            <Text style={{ ...styles.bottomText, color: '#919191' }}>
              Already have an account?{' '}
              <Text
                style={{ textDecorationLine: 'underline', color: '#38AEE6' }}
                onPress={() => {
                  navigation.navigate('Login');
                }}>
                Login here
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default RegisterPage;
