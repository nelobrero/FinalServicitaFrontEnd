

import React from "react";
import { StyleSheet, View, Text, Image, Dimensions, FlatList } from "react-native";
import { Color, FontFamily, FontSize, Border } from "./../GlobalStyles";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const data = [
  {
    id: '1',
    bookingId: '#236',
    status: 'Pending',
    serviceName: 'Eunice Enrera Makeup Artistry - Cebu Makeup Artist',
    providerName: 'Eunice Enrera',
    time: '1:00 AM - 2:00 AM',
    date: 'December 25, 2023',
    address: 'Lahug, Cebu City',
    imageSource: require("./../assets/serviceimage1.png"),
  },
  {
    id: '2',
    bookingId: '#236',
    status: 'Completed',
    serviceName: "Barbie's Hair and Make up Service",
    providerName: 'Eunice Enrera',
    time: '1:00 AM - 2:00 AM',
    date: 'December 25, 2023',
    address: 'Lahug, Cebu City',
    imageSource: require("./../assets/serviceimage1.png"),
  },
  {
    id: '3',
    bookingId: '#236',
    status: 'Completed',
    serviceName: "Pagwapa Service",
    providerName: 'Eunice Enrera',
    time: '1:00 AM - 2:00 AM',
    date: 'December 25, 2023',
    address: 'Lahug, Cebu City',
    imageSource: require("./../assets/serviceimage1.png"),
  },
  {
    id: '4',
    bookingId: '#236',
    status: 'Completed',
    serviceName: "Pagwapa Service ni Carl",
    providerName: 'Eunice Enrera',
    time: '1:00 AM - 2:00 AM',
    date: 'December 25, 2023',
    address: 'Lahug, Cebu City',
    imageSource: require("./../assets/serviceimage1.png"),
  },
  {
    id: '5',
    bookingId: '#236',
    status: 'Completed',
    serviceName: "Pagwapofsafas Service ni Carl",
    providerName: 'Eunice Enrera',
    time: '1:00 AM - 2:00 AM',
    date: 'December 25, 2023',
    address: 'Lahug, Cebu City',
    imageSource: require("./../assets/serviceimage1.png"),
  },
  // Add more data objects as needed
];

const renderItem = ({ item }) => (
  <View style={styles.container}>
    <View style={styles.bookingseeker}>
      <View style={[styles.frame, styles.framePosition]}>
        <View style={[styles.frameChild, styles.frameShadowBox]} />
        <View style={[styles.frameItem, styles.frameShadowBox]} />
      </View>
      <Image
        style={styles.serviceimageIcon}
        contentFit="cover"
        source={item.imageSource}
      />

      <View style={styles.serviceWrapper}>
        <Text style={styles.service}>{item.serviceName}</Text>
        <View style={styles.provider}>
          <Image
            style={styles.userIcon}
            contentFit="cover"
            source={require("./../assets/user.png")}
          />
          <Text style={styles.provider1}>{item.providerName}</Text>
        </View>
      </View>
      
      <View style={[styles.status, styles.statusLayout]}>
        <Text style={[styles.bookingid, styles.status1Typo]}>{item.bookingId}</Text>
        <Text style={[styles.status1, styles.status1Typo]}>{item.status}</Text>
      </View>
      <View style={styles.bookingdetails}>
        

        <Text style={[styles.address, styles.dateTypo]}>{item.address}</Text>
        <Text style={[styles.date, styles.dateTypo]}>{item.date}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      
    </View>
  </View>
);

const BookingSeeker = () => {
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={{ paddingBottom: windowHeight * 0.285, paddingTop: windowHeight * 0.02 }}
      
    />
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 15,
  
  },
  bookingseeker: {
    height: 196,
    marginBottom:10,
    position: "relative",
    
  },

  
  
  frameShadowBox: {
    borderWidth: 0.3,
    borderColor: Color.colorBlack,
    borderStyle: "solid",
    shadowOpacity: 1,
    elevation: 7,
    shadowRadius: 7,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowColor: "rgba(0, 0, 0, 0.5)",
    left: 0,
    top: 0,
    position: "absolute",
    width: windowWidth * 0.95,
    
  },
  
  frameChild: {
    borderRadius: Border.br_3xs,
    backgroundColor: Color.colorWhite,
    height: 196,

  },
  frameItem: {
    borderTopLeftRadius: Border.br_3xs,
    borderTopRightRadius: Border.br_3xs,
    backgroundColor: "#07374d",
    height: 40,
    
  },
  frame: {
    left: 0,
    position: "relative",
    height: windowHeight * 0.25,  // Adjust height as needed
    width: windowWidth * 0.95, // Adjust width as needed
    
  },



  statusLayout: {
    height: 15,
    position: "absolute",
  },
  dateTypo: {
    width: 169,
    fontFamily: FontFamily.quicksandMedium,
    fontWeight: "500",
    letterSpacing: 0.5,
    fontSize: 11,
    alignItems: "center",
    display: "flex",
    color: Color.colorBlack,
    textAlign: "left",
    lineHeight: 15,
    left: 0,
    position: "absolute",
  },
  status1Typo: {
    color: Color.colorWhite,
    fontFamily: FontFamily.quicksandBold,
    fontWeight: "700",
    lineHeight: 15,
    letterSpacing: 0.6,
    fontSize: FontSize.size_xs,
    top: 0,
    position: "absolute",
  },
  





  
  serviceimageIcon: {
    top: 59,
    width: 118,
    height: 118,
    left: 14,
    position: "absolute",
  },
  userIcon: {
    top: 1,
    width: 13,
    height: 13,
    left: 0,
    position: "absolute",
  },
  provider1: {
    marginLeft: 13,
    fontWeight: "600",
    fontFamily: FontFamily.quicksandSemiBold,
    color: Color.colorDarkslategray_500,
    textAlign: "left",
    lineHeight: 15,
    letterSpacing: 0.6,
    fontSize: FontSize.size_xs,
  },
  userParent: {
    width: 102,
    height: 15,
    left: 0,
    top: 0,
  },
  provider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  service: {
    fontSize: FontSize.size_xl,
    letterSpacing: 1,
    lineHeight: 20,
    fontFamily: FontFamily.quicksandRegular,
    color: Color.colorBlack,
    textAlign: "left",
    width: 216.5,
    paddingBottom:4,
    
  },
  serviceWrapper: {
    left: 149,
    top: 60,
    position: "absolute",
  },
  time: {
    top: 107,
    width: 153,
    fontFamily: FontFamily.quicksandMedium,
    fontWeight: "500",
    letterSpacing: 0.5,
    fontSize: 11,
    alignItems: "center",
    display: "flex",
    color: Color.colorBlack,
    textAlign: "left",
    lineHeight: 15,
    height: 13,
    left: 0,
    position: "absolute",
  },
  date: {
    top: 95,
  },
  address: {
    top: 82,
  },
  bookingdetails: {
    top: 57,
    height: 123,
    width: 246,
    left: 149,
    position: "absolute",
  },
  bookingid: {
    left: windowWidth * 0.775,
    textAlign: "right",
    width: 42,
    height: 12,
  },
  status1: {
    width: 135,
    textAlign: "left",
    left: 0,
  },
  status: {
    top: 15,
    width: 380,
    left:  windowWidth * 0.04,
   
  },
 
});

export default BookingSeeker;
