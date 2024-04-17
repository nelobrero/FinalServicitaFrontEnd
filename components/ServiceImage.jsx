import React from "react";
import { StyleSheet, View, Dimensions, Image, FlatList } from "react-native";
import SwiperFlatList from 'react-native-swiper-flatlist';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



const ServiceImage = ({imageData}) => {

  const data = [
    { id: 1, imageUrl: imageData.providerImage },
    { id: 2, imageUrl: imageData.providerImage },
    { id: 3, imageUrl: imageData.providerImage },
    // Add more items as needed
  ];

  return (
    <SwiperFlatList
      autoplay
      autoplayDelay={2}
      autoplayLoop
      index={0}
      showPagination
      paginationDefaultColor="#d8d8d8"
      paginationActiveColor="#07374d"
      paginationStyle={styles.paginationStyle} 
    >
      {data.map(item => (
        <View key={item.id} style={styles.slide}>
          <Image
            style={styles.serviceimageIcon}
            source={{ uri: item.imageUrl }}
          />
        </View>
      ))}
    </SwiperFlatList>
  );
};

const styles = StyleSheet.create({
  slide: {
    width: windowWidth,
    height: windowHeight * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceimageIcon: {
    flex: 1,
    width: windowWidth,
    height: windowHeight * 0.5,
    
  
  },
  paginationStyle: {

    bottom:windowHeight * 0.05, 
    width: '100%', 
    justifyContent: 'center', 
    alignItems: 'center', 
    flexDirection: 'row', 
    position: "relative",
  },
});

export default ServiceImage;
