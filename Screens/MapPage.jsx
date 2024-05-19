import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Platform } from 'react-native';
import MapView, {Marker, AnimatedRegion} from 'react-native-maps';
import React, { useState, useRef, useEffect } from 'react';
import imgPath from './../constants/imgPath';
import Loader from './../components/Loader';
import { locationPermission, getCurrentLocation } from './../helper/helperFunction';
import firestore from '@react-native-firebase/firestore';
import MapViewDirections from 'react-native-maps-directions';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default MapPage = ({locationData, role, bookingId}) => {

  const mapRef = useRef()
  const currentLocMarkerRef = useRef()

  const [state, setState] = useState({
    curLoc: {},
    isLoading: false,
    coordinate: null,
    time: 0,
    distance: 0,
    heading: 0,
    address: '',
    destinationCords: {
        latitude: locationData.latitude,
        longitude: locationData.longitude
    }
})

const { curLoc, time, distance, coordinate, heading, destinationCords } = state
    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    useEffect(() => {
      getLiveLocation()
  }, [])


useEffect(() => {
    if (curLoc.latitude !== undefined && curLoc.longitude !== undefined) {
    const interval = setInterval(() => {
        getCurrentsLocation()
    }, 6000);
    return () => clearInterval(interval);
}
}, [curLoc]);

    const getCurrentsLocation = async () => {
        if (role === 'Provider') {
            const { latitude, longitude, heading } = await getCurrentLocation()
            await firestore().collection('locations').doc(bookingId).update({
                latitude: latitude,
                longitude: longitude,
                heading: 0
            })
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
            
            
        } else {
        const location = await firestore().collection('locations').doc(bookingId).get()
        const { latitude, longitude, heading } = location.data()
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
    }

  const getLiveLocation = async () => {
    try {
    const locPermissionDenied = await locationPermission()
    if (locPermissionDenied) {
        if (role === 'Provider') {
            const { latitude, longitude, heading } = await getCurrentLocation()
            await firestore().collection('locations').doc(bookingId).set({
                latitude: latitude,
                longitude: longitude,
                heading: 0
            })
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
        } else {
            const location = await firestore().collection('locations').doc(bookingId).get()
            const { latitude, longitude, heading } = location.data()
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
        

    }
} catch (error) {
    console.log("error", error)
}
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

const fetchTime = (d, t) => {

    const distance = parseFloat(d.toFixed(1));

    const time = Math.round(t);

    updateState({
        distance: distance,
        time: time
    })
}

if (curLoc.latitude === undefined || curLoc.longitude === undefined || coordinate === null) {
    return <Loader isLoading={true} />
}

return (
  <View style={styles.container}>

      <View style={{ flex: 1 }}>
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

    {Object.keys(destinationCords).length > 0 && (<Marker
                  coordinate={destinationCords}
                  image={imgPath.icGreenMarker}
              />)}

              {Object.keys(destinationCords).length > 0 && (<MapViewDirections
                  origin={curLoc}
                  destination={destinationCords}
                  apikey='AIzaSyCG2UV8weM9nFuWYQNkEbG9f8wwITMiCRk'
                  strokeWidth={6}
                  strokeColor="#3296C4"
                  optimizeWaypoints={true}
                  onStart={(params) => {
                      console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                  }}
                  onReady={result => {
                    console.log(`Distance: ${result.distance} km`)
                    console.log(`Duration: ${result.duration} min.`)
                    fetchTime(result.distance, result.duration),
                      mapRef.current.fitToCoordinates(result.coordinates, {
                        edgePadding: {
                        //   top: 100,
                        //   bottom: 100,
                        //   left: 100,
                        //   right: 100,
                        },
                      });
                  }}
                  onError={(errorMessage) => {
                     console.log("error", errorMessage)
                  }}
                
              />)}


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
            
        {/* Time and Distance */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: screen.width * 0.05 }}>
            <Text style={{ fontSize: 16, color: '#07374D' }}>Time to arrive: {time} min</Text>
            <Text style={{ fontSize: 16, color: '#07374D' }}>Distance: {distance} km</Text>
        </View>

    

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>

        

                
            </View>
      </View>


  </View>
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

