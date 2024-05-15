import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, {Marker, AnimatedRegion} from 'react-native-maps';
import React, { useState, useRef, useEffect } from 'react';
import imgPath from '../../constants/imgPath';
import Loader from '../../components/Loader';
import { locationPermission, getCurrentLocation } from '../../helper/helperFunction';
import { SafeAreaView } from 'react-native-safe-area-context';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const BookingPage = ({navigation, route}) => {
  const mapRef = useRef()
  const currentLocMarkerRef = useRef()
  const markerRef = useRef()

  const [state, setState] = useState({
    curLoc: {},
    startCords: null,
    isLoading: false,
    coordinate: null,
    heading: 0,
})

const { curLoc, startCords, coordinate, heading } = state
    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    useEffect(() => {
      getLiveLocation()
  }, [])

  useEffect(() => {
    if (startCords) {
        mapRef.current.animateToRegion({
            latitude: startCords.latitude,
            longitude: startCords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        });
    }
}, [startCords]);

useEffect(() => {
    if (curLoc.latitude !== undefined && curLoc.longitude !== undefined) {
    const interval = setInterval(() => {
        getCurrentsLocation()
    }, 6000);
    return () => clearInterval(interval);
}
}, [curLoc]);


    const getCurrentsLocation = async () => {
        const { latitude, longitude, heading } = await getCurrentLocation()
        console.log("get live location after 3 second", latitude, longitude)
        animate(latitude, longitude)
        updateState({
            heading: 0,
            curLoc: { latitude, longitude },
            coordinate: new AnimatedRegion({
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            }),
        })
        
    }

  const getLiveLocation = async () => {
    try {
    const locPermissionDenied = await locationPermission()
    if (locPermissionDenied) {
        const { latitude, longitude, heading } = await getCurrentLocation()
        updateState({
            heading: 0,
            curLoc: { latitude, longitude },
            coordinate: new AnimatedRegion({
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            }),
        })
        mapRef.current.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        })
    }
} catch (error) {
    console.log("error", error)
}
}

const onPressLocation = () => {
    navigation.navigate('ChooseLocation', { 
      getStartLocation: fetchStartValue,
    });
  }

const fetchStartValue = (data) => {
    updateState({
        startCords: {
            latitude: data.startCords.latitude,
            longitude: data.startCords.longitude,
            address: data.address
        }
    })
    console.log("NAKUHA NGA ADDRESS", data.address)
}

const submitLocation = () => {
    route.params.getStartingLocation({
        startCords,
    });
    navigation.goBack();
}

const animate = (latitude, longitude) => {
    try {
    const newCoordinate = { latitude, longitude };
    if (Platform.OS == 'android') {
        if (currentLocMarkerRef.current) {
            currentLocMarkerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
        }       
    } else {
        coordinate.timing(newCoordinate).start();
    }
} catch (error) {
    console.log("error", error)
}
}

const onCenter = () => {
    mapRef.current.animateToRegion({
        latitude: curLoc.latitude,
        longitude: curLoc.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
    })
}



if (curLoc.latitude === undefined || curLoc.longitude === undefined || coordinate === null) {
    return <Loader isLoading={true} />
}

return (
    <SafeAreaView style={styles.container}>
  <View style={styles.container}>
    
     {startCords && (
                <>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 10}}>
                    <Text style={{ color:'black', fontSize: 16, marginHorizontal: screen.width * 0.01 }}>Selected Location: {startCords.address}</Text>
                </View>
                </>

                )}
      <View style={{ flex: 1 }}>
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
          <MapView
              ref={mapRef}
              style={StyleSheet.absoluteFill}
              initialRegion={{
                    ...curLoc,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
              }}
          >


    <Marker.Animated
        ref={currentLocMarkerRef}
        coordinate={coordinate}
    >
        <Image
            source={imgPath.currentUser}
            style={{
                width: 40,
                height: 40,
                transform: [{rotate: `${heading}deg`}]
            }}
            resizeMode="contain"
        />
    </Marker.Animated>


            {startCords && (
    <Marker
        ref={markerRef}
        coordinate={startCords}
    >
        <Image
            source={imgPath.icBike}
            style={{
                width: 40,
                height: 40,
                transform: [{rotate: `${heading}deg`}]
            }}
            resizeMode="contain"
        />
    </Marker>
)}


    
          </MapView>
          <TouchableOpacity
              style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0
              }}
              onPress={onCenter}
          >
              <Image source={imgPath.greenIndicator} />
          </TouchableOpacity>
      </View>
      <View style={styles.bottomCard}>

    {/* Display Current Location */}
            

          <TouchableOpacity
              onPress={onPressLocation}
              style={styles.inpuStyle}
          >
              <Text style={{ color:'white', fontSize: 18 }}> {startCords ? 'Change Location' : 'Select Location'} </Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>

           
          {startCords && (
                <>
                <View style={{ width: '100%', marginTop: 10 }}>
                    
                    <TouchableOpacity 
                    style={styles.inpuStyle} 
                    onPress={submitLocation}>
                    <Text style={{ color:'white', fontSize: 18 }}>Submit</Text>  
                    </TouchableOpacity>
                </View>
                </>

                )}

                
            </View>
      </View>


  </View>
    </SafeAreaView>
);
};


const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
  bottomCard: {
      backgroundColor: 'white',
      width: '100%',
    paddingBottom: screen.height * 0.01,
      paddingTop: screen.height * 0.02,
      borderTopEndRadius: 24,
      borderTopStartRadius: 24,
  },
  inpuStyle: {
      backgroundColor: '#07374D',
      color:'white',
      borderWidth: 1,
      alignItems: 'center',
      height: 50,
      justifyContent: 'center',
        marginHorizontal: screen.width * 0.05,
        borderRadius: 10,
  }
});

export default BookingPage;
