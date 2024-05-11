
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
navigator.geolocation = require('react-native-geolocation-service');

// const AddressPickup = ({
//     placheholderText,
//     fetchAddress
// }) => {

//     const onPressAddress = (data, details) => {
//         console.log("details==>>>>", details)

//         let resLength = details.address_components
//         let zipCode = ''

//         let filtersResCity = details.address_components.filter(val => {
//             if (val.types.includes('locality') || val.types.includes('sublocality')) {
//                 return val
//             }
//             if (val.types.includes('postal_code')) {
//                 let postalCode = val.long_name
//                 zipCode = postalCode
//             }
//             return false
//         })

//         let dataTextCityObj = filtersResCity.length > 0
//             ? filtersResCity[0] :
//             details.address_components[
//             resLength > 1 ? resLength - 2 : resLength - 1
//             ];

//         let cityText =
//             dataTextCityObj.long_name && dataTextCityObj.long_name.length > 17
//                 ? dataTextCityObj.short_name
//                 : dataTextCityObj.long_name;

//         console.log("zip cod found", zipCode)
//         console.log("city namte", cityText)

//         const lat = details.geometry.location.lat
//         const lng = details.geometry.location.lng
//         fetchAddress(lat, lng, zipCode, cityText)
//     }

//     return (
        
//         <View style={styles.container}>
//             <GooglePlacesAutocomplete
//                 placeholder={placheholderText}
//                 fetchDetails={true}
//                 onPress={onPressAddress}
//                 query={{
//                     key: 'AIzaSyCG2UV8weM9nFuWYQNkEbG9f8wwITMiCRk',
//                     language: 'en'
//                 }}
//                 styles={{
//                     textInputContainer: styles.containerStyle,
//                     textInput: styles.textInputStyle
//                 }}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     containerStyle: {
//         backgroundColor: 'white'
//     },
//     textInputStyle: {
//         height: 48,
//         color: 'black',
//         fontSize: 16,
//         backgroundColor: '#f3f3f3'
//     }
// });

// export default AddressPickup;




const AddressPickup = ({
    placheholderText,
    fetchAddress,
}) => {

    // const getCurrentLocation = () => {
    //     navigator.geolocation.getCurrentPosition(
    //         (position) => {
    //             console.log(position);
    //           },
    //           (error) => {
        
    //             console.log(error.code, error.message);
    //           },
    //     );
    // }

    // useEffect(() => {
    //     getCurrentLocation();
    // }
    // ,[]);

    const onPressAddress = (data, details) => {
        const { lat, lng } = details.geometry.location;
        const address = details.vicinity;
        const name = details.name;
        fetchAddress(lat, lng, address, name);
    }

   


    return (
        
        <View style={styles.container}>
            <GooglePlacesAutocomplete
                currentLocationLabel='Current location'
                currentLocation={true}
                placeholder={placheholderText}
                fetchDetails={true}
                onPress={onPressAddress}
                query={{
                    key: 'AIzaSyCG2UV8weM9nFuWYQNkEbG9f8wwITMiCRk', // Replace with your Google Maps API key
                    language: 'en',
                    components: 'country:ph'
                }}
                styles={{
                    textInputContainer: styles.containerStyle,
                    textInput: styles.textInputStyle
                }}
                enableHighAccuracyLocation={true}
                enablePoweredByContainer={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        containerStyle: {
            backgroundColor: 'white',
            marginTop: 20
        },
        textInputStyle: {
            height: 48,
            color: 'black',
            fontSize: 16,
            backgroundColor: '#f3f3f3'
        }
    });
    
export default AddressPickup;