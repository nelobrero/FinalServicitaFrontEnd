

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Modal, TouchableOpacity, Image } from 'react-native';
import { Color } from "./../../GlobalStyles";
import BookingSeeker from "./../../components/BookingSeeker";
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS } from "./../../constants/theme";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function SeekerBookingScreen({ navigation, route }) {

  const { userEmail } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [userData, setUserData] = useState({});
  const [bookingData, setBookingData] = useState({});
  const [serviceData, setServiceData] = useState({});
  const [userDataFetched, setUserDataFetched] = useState(false);
  const filters = ["Pending", "Accepted", "In Progress", "Completed", "Canceled", "Rejected", "Failed", "Expired", "En Route", "All"]

  const getUserIdAndImage = async () => {
    try {
      const result = await axios.post("http://192.168.1.7:5000/user/getUserDetailsByEmail", { email: userEmail })
      setUserData(result.data.data);
      return { id: result.data.data._id, image: result.data.data.profileImage, mobile: result.data.data.mobile };
    } catch (error) {
      console.error('Error getting user data from MongoDB:', error);
    }
  }

  async function getBookingData() {
    try {
        const userId = await getUserIdAndImage();

        const bookings = [];
        const currentTime = new Date();
        const snapshot = await firestore().collection('bookings').where('seekerId', '==', userId.id).get();
        for (const doc of snapshot.docs) {
            
            const seekerSnapshot = await firestore().collection('seekers').doc(doc.data().seekerId).get();
            const seekerData = { image: userId.image, data: seekerSnapshot.data(), mobile: userId.mobile }
            const serviceSnapshot = await firestore().collection('services').doc(doc.data().serviceId).get();
            const serviceData = { id: serviceSnapshot.id, data: serviceSnapshot.data()}
            const providerSnapshot = await firestore().collection('providers').doc(doc.data().providerId).get();
            const providerData = providerSnapshot.data();
            const result = await axios.post("http://192.168.1.7:5000/user/getUserDetailsById", { id: providerSnapshot.id })
            const expiresAt = doc.data().expiresAt.toDate();
            

            if ((doc.data().status === 'Pending' || doc.data().status === 'Accepted') && expiresAt < currentTime) {
              await firestore().collection('bookings').doc(doc.id).update({ status: 'Expired' });
              doc.data().status = 'Expired';
            }
            
            bookings.push({ id: doc.id, data: doc.data(), serviceData: serviceData, providerData: providerData, providerMobile: result.data.data.mobile, seekerData: seekerData, providerImage: result.data.data.profileImage });
        }
        
        setBookingData(bookings);
        setUserDataFetched(true);
        setLoading(false);
    } catch (error) {
        console.error('Error getting user data from Firestore:', error);
    }
}


  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      getBookingData();
    }, [route])
  );

  useEffect(() => {
    setLoading(true);
    getBookingData();
  }, [selectedFilter]);


  const handleFilterPress = (filter) => {
    setSelectedFilter(filter);
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.secondaryGray}} >
          <Image source={require('../../assets/loading.gif')} style={{width: 200, height: 200}} />
      </View>
    );
  }

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Bookings ({selectedFilter})</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="filter" size={24} color={Color.colorWhite} style={styles.filterIcon} />
        </TouchableOpacity>
      </View>
      <View >
        <BookingSeeker navigation={navigation} filters={selectedFilter} bookingData={bookingData} userData={userData}/>
      </View>
      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Select Filter</Text>
            </View>
            {filters.map((filter, index) => (
              <TouchableOpacity key={index} onPress={() => handleFilterPress(filter)}>
                <Text style={styles.modalItem}>{filter}</Text>
                {index !== filters.length - 1 && <View style={styles.separator} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#07374d",
    height: Dimensions.get('window').height * 0.1, // Adjust height according to screen size
    flexDirection: 'row',
    alignItems: 'center',  
    
  },
  title: {
    fontSize:  23,
    lineHeight: 50,
    fontWeight: "700",
    fontFamily: "Lobster-Regular",
    color: Color.colorWhite,
    display: "flex",
    alignItems: "center",
    width: 326,
    textAlign: "left",
    position: "absolute",
    marginLeft: 25,
  },
  filterIcon: {
    marginLeft: windowWidth * 0.87,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 10,
    // paddingHorizontal: 80,
    // paddingBottom: 30,
    elevation: 5,
    width: 280,
  },
  modalItem: {
    
    fontSize: 18,
    paddingTop: 10,
    paddingBottom: 15,
    color: '#333', // Customize the color of the text
    textAlign: 'center',
    fontWeight: "400"
    
    
  },
  separator: {
    borderBottomWidth: 0.2,
    borderBottomColor: '#cc',
    marginBottom: 10, // Adjust the space between items
    width: 250, // Adjust the width of the separator
    alignSelf: 'center', // Align the separator to the center 
  },
  modalHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
    paddingTop: 10,
    borderTopLeftRadius: 10, 
    borderTopRightRadius: 10, 
    height:50,
    width: 280,
    backgroundColor: "#07374d",
  },
  modalHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Color.colorWhite,
    alignSelf: 'center',
    
  },
  
});
