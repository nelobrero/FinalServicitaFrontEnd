import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import AddressPickup from '../../components/AddressPickUp';
import { showError } from '../../helper/helperFunction';
import Button from './../../components/Button';
import { Color } from "./../../GlobalStyles";

const ChooseLocation = ({ navigation, route }) => {

    const [state, setState] = useState({
        startCords: {},
        address: '',
    })

    const { startCords, address } = state

    const checkValid = () =>{
        console.log(startCords)
        if(Object.keys(startCords).length === 0){
           
            showError('Please enter your starting location')
            return false
        }
        return true
    }

    const onDone = () => {
        const isValid = checkValid();
        if (isValid) {
          route.params.getStartLocation({
            startCords,
            address
          });
          navigation.goBack();
        } else {
            Alert.alert('Please enter your starting location')
        }
      };
    
    const fetchStartCords = (lat, lng, address, name) => {
       console.log(`full address: ${name}, ${address}`)
        setState({
            ...state,
            startCords: {
                latitude: lat,
                longitude: lng
            },
            address: name
        })
    }

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.container}>

        <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
                marginLeft: 20,
                position: 'absolute',
                zIndex: 1
            }}
        >
            <MaterialIcons name="arrow-back-ios" size={20} color="black" />
            </TouchableOpacity>
                
            <View style={{ backgroundColor: 'white', flex: 1, padding: 24}}>
                <View style={{ marginBottom: 16 }} />
                <AddressPickup
                    placheholderText={"Enter Pickup Location"}
                    fetchAddress={fetchStartCords}
                />
                <Button
                    title="Choose Location"
                    filled Color={Color.colorWhite}
                    style={{ marginTop: 16, opacity: address === '' || Object.keys(startCords).length === 0 ? 0.5 : 1 }}
                    onPress={onDone}
                    disabled={address === '' || Object.keys(startCords).length === 0}
                />
            </View>
        </View>
    </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
export default ChooseLocation;