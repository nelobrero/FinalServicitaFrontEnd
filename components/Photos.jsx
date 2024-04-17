import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Image, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';
import ReviewItem from '../components/ReviewParent';
import reviewsData from '../components/Data';

const ReviewsWithNonEmptyImages = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openModal = (index) => {
    setSelectedIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const filteredReviewsData = reviewsData.filter(item => Array.isArray(item.reviewImages) && item.reviewImages.length > 0);
  const allReviewImages = reviewsData.reduce((accumulator, currentValue) => accumulator.concat(currentValue.reviewImages), []);

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.photoContainer}>
            <FlatList
            data={allReviewImages}
            renderItem={({ item, index }) => (
                <Pressable onPress={() => openModal(index)}>
                <Image source={item} style={styles.reviewImage} />
                </Pressable>
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            />
        </View>
        <Modal visible={modalVisible} transparent={true}>
          <View style={styles.modalContainer}>
            <Swiper
              index={selectedIndex}
              loop={false}
              showsPagination={false}
              onIndexChanged={(index) => setSelectedIndex(index)}
            >
              {allReviewImages.map((image, index) => (
                <View key={index} style={styles.swiperImageContainer}>
                  <Image source={image} style={styles.swiperImage} resizeMode="contain" />
                </View>
              ))}
            </Swiper>
            <Pressable style={styles.closeButton} onPress={closeModal}>
              <Ionicons name="close-circle" size={36} color="white" />
            </Pressable>
          </View>
        </Modal>
      </View>

      <FlatList
        data={filteredReviewsData}
        renderItem={({ item }) => <ReviewItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
  reviewItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  userImage: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  reviewContent: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reviewText: {
    marginBottom: 4,
    marginRight: 18,
    textAlign: 'justify'
  },
  reviewImage: {
    width: 100,
    height: 100,
    marginRight: 8,
  },
  dateTime: {
    color: '#999999',
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
  ratingStar: {
    color: "#07374d",
  },
  photoContainer:{
    borderBottomWidth: 1,  // Add border to the bottom
    paddingBottom:10,
    borderColor: '#CCCCCC',
  }
});




export default ReviewsWithNonEmptyImages;
