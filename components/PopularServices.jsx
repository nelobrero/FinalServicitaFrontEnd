import { View, Text, StyleSheet, SafeAreaView, Image, FlatList, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'



const PopularServices = () => {
    //Data
    const data = [
        {
            id: 1,
            title: 'Mr. Daniel Clean',
            description: 'Cleaning Service',
            image: require('../assets/images/slide1.png'),
        },
        {
            id: 2,
            title: 'Barbie Salon',
            description: 'Hair and Make up Service',
            image: require('../assets/images/slide2.png'),

        },
        {
            id: 3,
            title: 'service 3',
            description: 'lami kaayu',
            image: require('../assets/images/slide3.png'),

        },


    ]
  return (
    <View>
        <SafeAreaView/>
        <FlatList 
        data ={data} 
            renderItem={({item})=> (
            <View style={styles.flatListContainer}>
              <Image 
                source={item.image}
                style={{width: "100%", height: 200}}
              />
              <Text style={styles.Text}>{item.title}</Text>
              <Text style={styles.Text2}>{item.description}</Text>
              <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Book Now!</Text>
            </TouchableOpacity>
             </View>)}
             />
    </View>
  )
}

export default PopularServices

const styles = StyleSheet.create({
    flatListContainer: {
        backgroundColor:"white",
        marginVertical: 10,
        marginHorizontal: 16,
        paddingBottom: 32,
        borderRadius:15,
    },

Text: {
    fontSize:24,
    fontWeight: "bold",
    paddingTop:6,
    paddingLeft:10
},
Text2: {
    fontSize:15,
    paddingLeft:10
},
button: {
    backgroundColor: '#07364B', // Set button background color
    paddingVertical: 12, // Adjust button height
    paddingHorizontal: 24, // Adjust button width
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'flex-start',
},
buttonText: {
    color: 'white', // Set button text color
    textAlign: 'justify',
    fontWeight: 'bold',
},
})