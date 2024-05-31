import React from "react";
import { StyleSheet, View, Text, Image, FlatList, Dimensions, Pressable } from "react-native";
import { FontFamily, Color, FontSize } from "../GlobalStyles";
import RatingService from "./../components/RatingService";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default Result = ({navigation, searchQuery, filterQuery, serviceData, userData}) => {


  const { dayOfDate = null, selectedBarangay = null, selectedCity = null, selectedService = null, selectedPriceRange = null, selectedRating = null, hours = null } = filterQuery || {};


  const data = serviceData.map((item) => ({
    id: item.id,
    minprice: item.data.price.min,
    maxprice: item.data.price.max,
    barangay: item.data.address.barangay,
    city: item.data.address.cityMunicipality,
    locationIcon: require("../assets/image-145.png"),
    providerImage: item.data.coverImage,
    category: item.data.serviceType,
    service: item.data.name,
     description: item.data.description,
     ratingStar: item.data.rating,
     availability: item.data.availability,
     providerId: item.data.providerId,
     bookings: item.data.bookings,

})).slice(0, 10);

  if (!serviceData || serviceData.length === 0 || !data) {
    return null;
  }

  const filteredDataByCategory = data.filter((data) => {
    if (selectedService === null || selectedService === "") {
      return data;
    } else if (data.category === selectedService) {
      return data;
    }
  });

  const filteredDataByCity = filteredDataByCategory.filter((data) => {
    if (selectedCity === null || selectedCity === "") {
      return data;
    } else if (data.city === selectedCity) {

      return data;
    }
  });

  const filteredDataByBarangay = filteredDataByCity.filter((data) => {
    if (selectedBarangay === null || selectedBarangay === "") {

      return data;
    } else if (data.barangay === selectedBarangay) {
      return data;
    }
  } );

  const filteredDataByPriceRange = filteredDataByBarangay.filter((data) => {
    if (selectedPriceRange === null) {
      return data;
    } else if (data.minprice <= selectedPriceRange && data.maxprice >= selectedPriceRange) {
      return data;
    }
  });


  const filteredDataByRating = filteredDataByPriceRange.filter((data) => {
    if (selectedRating === null) {
      return data;
    } else if (data.ratingStar >= selectedRating) {
      return data;
    }
  });

  const filteredDataByDay = filteredDataByRating.filter((data) => {
    if (dayOfDate === null) {
      return data;

    } else {
        const availability = data.availability.find((day) => day.day === dayOfDate);
        return availability && availability.flagAvailable;
    }
});

  const filteredDataByTime = filteredDataByDay.filter((data) => {
    if (hours === null) {
        return data;
    } else {
        const availability = data.availability.find((day) => day.day === dayOfDate);
        return availability && availability.startTimeValue <= hours && availability.endTimeValue >= hours;     

    }
});

  const filteredDataBySearch = filteredDataByTime.filter((data) => {
    if (searchQuery === null || searchQuery === "") {
      return data;
    } else if (data.service.toLowerCase().includes(searchQuery.toLowerCase())) {
      return data;
    }
  }
  );
  
  const horizontalMargin = 16;
  const itemWidth = screenWidth - 2 * horizontalMargin;

  const handlePress = (item) => {
    navigation.navigate('ServiceView', {data: item, userData: userData});
  };

  return (
    filteredDataBySearch.length === 0 ? <Text style={{textAlign: 'center', marginTop: 20}}>No results found.</Text> :
    <FlatList
      data={filteredDataBySearch}
      renderItem={({ item }) => (
        <Pressable onPress={() => handlePress(item)}>
          <View style={[styles.resultContainer, { width: itemWidth }]}>
            <Image
              style={styles.providerImage}
              contentFit="cover"
              source={{uri: item.providerImage}}
            />
            <View style={styles.hays}>
              <Text style={styles.Service}>{item.service}</Text>
              {/* Render RatingStars component with item.ratingStar */}
              <View style={styles.locationContainer}>
                <Image
                  style={styles.seeDetailsIcon}
                  contentFit="cover"
                  source={item.locationIcon}
                />
                <Text style={styles.location}>{item.barangay}, {item.city}</Text>
              </View>
              <RatingService  rating={item.ratingStar} />
              
            </View>
            <Text style={styles.price}>₱{item.minprice} - ₱{item.maxprice}</Text>
            
            <Text style={styles.seeDetails}>{item.category}</Text>
          </View>
        </Pressable>
      )}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.flatListContent}
    />
    
  );
};

const styles = StyleSheet.create({
  resultContainer: {
    backgroundColor: Color.colorWhite,
    marginVertical: 5,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowRadius: 7,
    elevation: 7,
    shadowOpacity: 1,
    borderStyle: "solid",
    borderColor: Color.colorBlack,
    borderWidth: 0.1,
    top: 0,
    height: 147,
    position: "relative",
  },
  flatListContent: {
    alignItems: "center",
    justifyContent: "center", 
    flexGrow: 1, 
  },
  location: {
    alignItems: "center",
    display: "flex",
    // textAlign: "left",
    color: Color.colorBlack,
    fontFamily: FontFamily.quicksandRegular,
    marginLeft: 10,
    fontSize: 10,
    letterSpacing: 0.3,
    lineHeight: 10,
    width: 150,
    position: "absolute",
  },
  locationIcon: {
    width: 5,
    height: 6,
    position: "absolute",
  },
  price: {
    bottom: screenHeight * 0.02,
    right: 10,
    color: "#0e638a",
    letterSpacing: 0.9,
    fontSize: FontSize.size_sm,
    textAlign: "right",
    fontFamily: FontFamily.quicksandSemiBold,
    fontWeight: "600",
    lineHeight: 20,
    position: "absolute",
  },
  seeDetails: {
    bottom: screenHeight * 0.02,
    left:125,
    fontSize: screenWidth * 0.021,
    letterSpacing: 0.5,
    color: '#696969',
    textAlign: "right",
    fontFamily: FontFamily.quicksandSemiBold,
    fontWeight: "600",
    lineHeight: 15,
    position: "absolute",
  },
  seeDetailsIcon: {
    // top: screenHeight * 0.1600,
    // left: 125,
    width: 8,
    height: 10,
    position: "absolute",
  },
  rating: {
    fontSize: 13,
    letterSpacing: 0.7,
    lineHeight: 14,
    width: 25,
    textAlign: "left",
    color: Color.colorBlack,
    fontFamily: FontFamily.quicksandRegular,
    position: "absolute",
  },
  stars: {
    left: 25,
    width: 49,
    height: 10,
    position: "absolute",
  },
  providerImage: {
    left: 14,
    width: 105,
    height: 113,
    top: 17,
    position: "absolute",
  },
  Service: {
    paddingTop: 15,
    paddingBottom: 1,
    width: screenWidth * 0.6,
    alignItems: "center",
    display: "flex",
    textAlign: "left",
    color: Color.colorBlack,
    fontFamily: FontFamily.quicksandRegular,
    lineHeight: 25,
    letterSpacing: 0.75,
    fontSize: FontSize.size_lg,
    position: "relative",
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    position: 'absolute', 
    paddingBottom: 15,
    position:  "relative",
  },
  locationContainer: {
    alignItems:"space-between",
    flexDirection: 'row', 
    width: 77,
    height: 9,
    marginTop:4,
    position:  "relative",
    marginBottom: 3,
    textAlign: "left",
  },
  hays: {
    marginLeft: 125,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingStars: {
    flexDirection: 'row',
    marginRight: 5,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
    marginHorizontal: 3,
    
  },
});