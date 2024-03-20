import React, { useState } from "react";
import { Text, StyleSheet, View, TextInput, Image, Pressable, Dimensions, SafeAreaView, ScrollView, Alert } from "react-native";
import { FontSize, Color, FontFamily, errorText } from "../../GlobalStyles";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import Error from '@expo/vector-icons/MaterialIcons';
import Button from "../../components/Button";
import axios from "axios";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ForgotPasswordScreen({navigation}) {
    const [email, setEmail] = useState("");
    const [emailVerify, setEmailVerify] = useState(false);
    const [storeData, setStoreData] = useState({});
    const [confirm, setConfirm] = useState(null);

    const handlePress = async () => {
        try {
            await getUserId();
            await axios.post("http://192.168.1.14:5000/forgot_password_otp/request", { email: email });


        } catch (error) {
            if (error.response.message === "No account with the said email exists. Please register.") {
                Alert.alert("No account with the said email exists. Please register.", [ { text: "Yes", onPress: () => navigation.navigate("UserRole", {email: '', name: '', userId: ''}) }]);
            } else if (error.response.message === "Email has not been verified yet. Please check your inbox.") {
                Alert.alert("Email has not been verified yet. Please verify your email.", [ { text: "Yes", onPress: () => navigation.navigate("VerificationScreen", {email: email, userId: storeData._id}) }]);
            }
        }
    };
    
    const getUserId = async () => {
        try {
            const response = await axios.get("http://http://192.168.1.14:5000/user/getuserid", { email: email });
            setStoreData(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Color.colorWhite }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"always"}>
        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', marginHorizontal: windowWidth * 0.05, marginTop: windowHeight * 0.07 }}>
                            <Pressable onPress={() => navigation.goBack()} style={styles.arrowContainer}>
                                            <Image
                                            style={styles.userroleChild}
                                            contentFit="cover"
                                            source={require("./../../assets/arrow-1.png")}
                                            />
                            </Pressable>
        </View>
        <View style={styles.container}>
            <Text style={[styles.passwordRecovery, styles.passwordFlexBox]}>
                Password recovery
            </Text>
            <Text style={[styles.enterYourEmail, styles.passwordFlexBox]}>
                Enter your email to recover your password
            </Text>

            <View style={{ marginTop: windowHeight * 0.05, width: windowWidth * 0.90 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: '400',
                        marginVertical: windowHeight * 0.01,
                        color: Color.colorBlue,
                        
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

            
            <Button
            title="Verify"
            filled
            Color={Color.colorWhite}
            style={{
                marginTop: windowHeight * 0.07,
                marginBottom: windowHeight * 0.05,
                width: windowWidth * 0.87,
                height: windowHeight * 0.08,
                top: windowHeight * 0.1,
            }}
            onPress={handlePress}
            disabled={!emailVerify}
            />
        </View>
        </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    passwordFlexBox: {
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        textAlign: "center",
        lineHeight: 23,
        position: "absolute",
    },
    passwordRecovery: {
        top: windowHeight * 0.05,
        fontSize: FontSize.size_6xl,
        color: Color.colorDarkslategray_100,
        width: windowWidth * 0.7,
        height: windowHeight * 0.1,
        fontFamily: FontFamily.quicksandBold,
        fontWeight: "700",
        alignItems: "center",
        display: "flex",
        textAlign: "center",
        lineHeight: windowHeight * 0.1,
    },
    enterYourEmail: {
        top: windowHeight * 0.1,
        fontSize: FontSize.size_mini,
        letterSpacing: 0.5,
        fontWeight: "300",
        fontFamily: FontFamily.quicksandLight,
        color: Color.colorBlack,
        height: windowHeight * 0.05,
        alignItems: "center",
        display: "flex",
        textAlign: "center",
        lineHeight: windowHeight * 0.05,
        width: windowWidth * 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Color.colorWhite,
        marginHorizontal: windowWidth * 0.05,
        flexDirection: 'column',
        alignItems: 'center',
    },
    arrowContainer: {
        bottom: windowHeight * 0.02,
        left: windowWidth * 0.01,
    },
    userroleChild: {
        top: windowHeight * 0.003,
        left: windowWidth * 0.001,
        maxHeight: "100%",
        width: windowWidth * 0.07,
    },
});

