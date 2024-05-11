import { showMessage } from "react-native-flash-message"
import { PermissionsAndroid, Platform } from "react-native";
import * as Location from 'expo-location';
import { v4 as uuidv4 } from 'uuid';

export const getCurrentLocation = () =>
    new Promise(async (resolve, reject) => {
        try {
            const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const { latitude, longitude, heading } = location.coords;
            console.log("location", location)
            return resolve({ latitude, longitude, heading });
        } catch (error) {
            return reject(error);
        }
    }
    );

export const watchLocation = () =>
    new Promise(async (resolve, reject) => {
        try {
            await Location.watchPositionAsync({ accuracy: Location.Accuracy.Balanced }, (location) => {
                const { latitude, longitude } = location.coords;
                console.log("location", location)
                return resolve({ latitude, longitude });
            });
        } catch (error) {
            return reject(error);
        }
    }
    );



export const locationPermission = () => 
    new Promise(async (resolve, reject) => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Location Permission",
                    message: "App needs access to your location",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // console.log("You can use the location");
                return resolve(true);
            } else {
                return resolve(false);
            }
        }
    });
    

const showError = (message) => {
    showMessage({
        message,
        type: 'danger',
        icon: 'danger'
    })
}

const showSuccess = (message) => {
    showMessage({
        message,
        type: 'success',
        icon: 'success'
    })
}

export {
    showError,
    showSuccess
}

export const formatTimeStamps = (time) => {
    const date = new Date(time.toMillis());
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

export const generateMessageId = () => {
    const uniqueId = Math.random().toString(36).substring(7);
    const uniqueId2 = uuidv4();
    return `${uniqueId}-${uniqueId2}`;
}

export const sortMessagesByTimestamp = (messages) => {
    return messages.sort(
        (a, b) => a.timestamp.toMillis() - b.timestamp.toMillis()
    );
}
