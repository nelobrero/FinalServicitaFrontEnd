import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Border, FontSize, FontFamily, Color } from "./../../GlobalStyles";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;


export default function PopularServices({ navigation, serviceData, userData }) {
  const data = serviceData.map((item) => ({
    id: item.id,
    minprice: item.data.price.min,
    maxprice: item.data.price.max,
    barangay: item.data.address.barangay,
    city: item.data.address.cityMunicipality,
    providerImage: item.data.coverImage,
    category: item.data.serviceType,
    service: item.data.name,
    description: item.data.description,
    ratingStar: item.data.rating,
    availability: item.data.availability,
    providerId: item.data.providerId,
    bookings: item.data.bookings,
  })).slice(0, 5);

  if (!serviceData || serviceData.length === 0 || !data) {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.secondaryGray}} >
            <Image source={require('../../assets/loading.gif')} style={{width: 200, height: 200}} />
        </View>
      );
 }

  const handlePress = (item) => {
    navigation.navigate('ServiceView', { data: item, userData: userData });
  };

  const renderItem = ({ item }) => (
    <View style={styles.flatListContainer}>
      <Image
        source={{ uri: item.providerImage }}
        style={styles.image}
      />
      <Text style={styles.Text}>{item.service}</Text>
      <Text style={styles.Text2}>{item.description}</Text>
      <TouchableOpacity style={styles.button} onPress={() => handlePress(item)}>
        <Text style={styles.buttonText}>View Now!</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={"always"}
    //   style={{ maxHeight: windowHeight * 0.50 }}
      scrollEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  flatListContainer: {
    backgroundColor: "white",
    marginVertical: windowHeight * 0.01,
    marginHorizontal: 16,
    paddingBottom: 20,
    borderRadius: 15,
    borderColor: Color.colorGray_100,
    borderWidth: 0.5
  },
  Text: {
    fontSize: 24,
    fontWeight: "bold",
    paddingTop: 6,
    paddingHorizontal: 15
  },
  Text2: {
    fontSize: 15,
    paddingHorizontal: 15
  },
  button: {
    backgroundColor: '#07364B', // Set button background color
    paddingVertical: 12, // Adjust button height
    paddingHorizontal: 24, // Adjust button width
    borderRadius: 12,
    marginTop: 10,
    alignSelf: 'flex-end',
    marginRight: 15,
  },
  buttonText: {
    color: 'white', // Set button text color
    textAlign: 'justify',
    fontWeight: 'bold',
  },
  image: {
    width: "100%",
    height: windowHeight * 0.25,
    // borderRadius: 15,
    borderTopLeftRadius: 15, 
    borderTopRightRadius: 15, 
    marginBottom: windowHeight * 0.01,
  },
});