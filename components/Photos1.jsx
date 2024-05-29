import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image, Pressable, Modal, Dimensions, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import Swiper from 'react-native-swiper';
import { Video } from 'expo-av';
import { COLORS, FONTS } from "./../constants/theme";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ReviewsWithNonEmptyImages = ({ serviceId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [reviewsData, setReviewsData] = useState(null);
  const [postsData, setPostsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const videoRef = React.useRef(null);

  const openModal = (index) => {
    setSelectedIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    const getReviews = async () => {
      try {
        const response = await axios.post('http://192.168.1.7:5000/rating/getRatingsByService', { serviceId });
        setReviewsData(response.data.data);
        const response2 = await axios.post('http://192.168.1.7:5000/post/getPostsById', { serviceId });
        setPostsData(response2.data.data);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error(error);
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    getReviews();
  }, [serviceId]);


  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.secondaryGray}} >
          <Image source={require('../assets/loading.gif')} style={{width: 200, height: 200}} />
      </View>
    );
  }

  if (!reviewsData && reviewsData.length === 0 && !postsData && postsData.length === 0) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 20 }}>
        <Text>No photos available</Text>
      </View>
    );
  }

  const reviewImages = reviewsData.reduce((accumulator, currentValue) => accumulator.concat(currentValue.images), []);
  const postImages = postsData.reduce((accumulator, currentValue) => accumulator.concat(currentValue.images), []);
  const allImages = reviewImages.concat(postImages);

  return (
    <View style={styles.container}>
      <View style={styles.photoContainer}>
        <FlatList
          data={allImages}
          renderItem={({ item, index }) => (
            <Pressable onPress={() => {openModal(index)}}>

              {
                item.includes('.mp4') ?
                <> 
                <Video
                  source={{ uri: item }}
                  style={styles.reviewImage}
                  resizeMode='cover'
                />
  

                <Ionicons name="play-circle" size={36} color="white" style={{position: 'absolute', top: '50%', left: '50%', marginLeft: -18, marginTop: -18}} />
                </> : <Image source={{ uri: item }} style={styles.reviewImage} />
              }

              
            </Pressable>
          )}
          keyExtractor={(item, index) => index.toString()}
          horizontal={false}
          vertical={false}
          numColumns={3} // Display three photos per row
          contentContainerStyle={styles.flatListContainer} // Add this line
          scrollEnabled={false}
          ListEmptyComponent={() => <Text>No photos available</Text>}
        />
      </View>
      <Modal visible={modalVisible} transparent={false}>
        <View style={styles.modalContainer}>
          <Swiper
            index={selectedIndex}
            loop={false}
            showsPagination={false}
            onIndexChanged={(index) => {
              setSelectedIndex(index)
              videoRef.current.pauseAsync();
            }}
          >
            {allImages.map((image, index) => (
              <View key={index} style={styles.swiperImageContainer}>

                {image.includes('.mp4') ?
                <Video
                  source={{ uri: image }}
                  style={styles.swiperImage}
                  resizeMode='cover'
                  ref={videoRef}
                  useNativeControls
                /> : <Image source={{ uri: image }} style={styles.swiperImage} />
              }

     
              </View>
            ))}
          </Swiper>
          <Pressable style={styles.closeButton} onPress={closeModal}>
            <Ionicons name="close-circle" size={36} color="white" />
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center', // Center the FlatList vertically
  },
  reviewImage: {
    width: windowWidth * 0.3,
    height: windowWidth * 0.3,
    marginHorizontal: 5,
    marginBottom: 8, // Add margin bottom for space between rows
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  swiperImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swiperImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  photoContainer:{
    marginVertical: windowHeight * 0.02,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    borderBottomWidth: 1,  // Add border to the bottom
    paddingBottom: 10,
    borderColor: '#CCCCCC',
  },
});

export default ReviewsWithNonEmptyImages;
