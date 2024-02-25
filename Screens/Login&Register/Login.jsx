import React, { useState } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from '@expo/vector-icons/Feather';
import Error from '@expo/vector-icons/MaterialIcons';

function LoginPage(){
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [emailVerify, setEmailVerify] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordVerify, setPasswordVerify] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validateFields = () => {
        return email.length > 0 && emailVerify && password.length > 0 && passwordVerify;
    }

    const handleSubmit = () => {
        const userData = {
            email: email,
            password: password,
        }
        axios.post("http://192.168.1.3:5000/user/login", userData).then((res) => {
        console.log(res.data)
        if (res.data.status === 'SUCCESS') {
            Alert.alert('Success', 'You have successfully logged in.', [{ text: 'OK' }]);
            AsyncStorage.setItem('token', res.data.data);
            AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
            // navigation.navigate('Home');
        }
    }).catch((err) => {
        console.log(err);
        if(err.response.data.message === "Email has not been verified yet."){
            Alert.alert('Error', 'Email has not been verified yet.', [{ text: 'OK' }]);
        } else if (err.response.data.message === "Invalid credentials entered!"){
            Alert.alert('Error', 'Invalid credentials entered!', [{ text: 'OK' }]);
        } else if (err.response.data.message === "Invalid password entered!"){
            Alert.alert('Error', 'Invalid password entered!', [{ text: 'OK' }]);
        } else {
            Alert.alert('Error', 'An error occurred while processing your request. Please try again later.', [{ text: 'OK' }]);
        }
        });
    }

    return(
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"always"}>
            <View>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('./../../assets/Logo.png')}/>
                </View>
                <View style={styles.loginContainer}>
                    <Text style={styles.text_header}>Login</Text>
                    <View style={styles.action}>
                        <FontAwesome name="user" color='#38AEE6' style={styles.smallIcon} />
                        <TextInput
                            placeholder="Email"
                            style={styles.textInput}
                            onChange={(e) => {
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
                    <View style={styles.click_footer_view}>
                        <Text style={{...styles.click_footer, color: '#38AEE6'}}>Forgot password?</Text>
                    </View>
                </View>
                <View style={styles.button}>
                {validateFields() ? (
                    <TouchableOpacity
                        style={[styles.inBut]}
                        onPress={handleSubmit}
                    >
                        <View>
                        <Text style={styles.textSign}>Login</Text>
                        </View>
                    </TouchableOpacity>
                    ) : (
                    <View style={[styles.inBut, styles.disabledButton]}>
                        <View>
                        <Text style={styles.textSign}>Login</Text>
                        </View>
                    </View>
                    )}
                    <View style={{padding: 15}}>
                        <Text style={{...styles.click_footer_two, color: '#919191'}}>
                            ---Or Login Using---
                        </Text>
                    </View>
                    <View style={styles.bottomButton}>
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <TouchableOpacity style={styles.inBut2}>
                                <FontAwesome name="facebook-f" color='#fff' style={styles.smallIcon2} />
                            </TouchableOpacity>
                            <Text style={styles.bottomText}>Facebook</Text>                    
                        </View>
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <TouchableOpacity style={styles.inBut2}>
                                <FontAwesome name="google" color='#fff' style={styles.smallIcon2} />
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
                            Don't have an account?{' '}
                            <Text style={{ textDecorationLine: 'underline', color: '#38AEE6' }} onPress={() => {navigation.navigate('Register')}}>
                                Sign up
                            </Text>
                        </Text>
                    </View>
                </View>
            </View>
        </ScrollView>
        
    )
}

export default LoginPage;
