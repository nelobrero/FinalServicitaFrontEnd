import { showMessage } from "react-native-flash-message"
import { PermissionsAndroid, Platform } from "react-native";
import * as Location from 'expo-location';
import { v4 as uuidv4 } from 'uuid';
import * as ImagePicker from 'expo-image-picker';

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

export const formatTimeStamps2 = (time) => {
    const date = new Date(time.toMillis());
    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
    });
}

export const formatDayStamps = (time) => {
    const date = new Date(time.toMillis());

    // Take into account if the same week say "Today" or "Yesterday" or what day of the week it is

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);


    if (date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
        return "Today";
    } else if (date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear()) {
        return "Yesterday";
    } else if (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() >= today.getDate() - 7) {
        return date.toLocaleDateString("en-US", {
            weekday: "long",
        });
    } else {
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    }

}


export const generateMessageId = () => {
    const uniqueId = Math.random().toString(36).substring(7);
    const uniqueId2 = uuidv4();
    return `${uniqueId}-${uniqueId2}`;
}

export const sortConversationsByLastMessageTime = (conversations) => {
    return conversations.sort((a, b) => {
        const timeA = a.lastMessageTime.toMillis();
        const timeB = b.lastMessageTime.toMillis();
        return timeB - timeA;
    });
}

export async function askForLibraryPermission() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status;
  }

export async function askForCameraPermission() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status;
  }

