import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, Modal, FlatList } from 'react-native';
import Swiper from 'react-native-swiper';
import  { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import RatingStars from './RatingStars';

const ReviewItem = ({ item }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openModal = (index) => {
    setSelectedIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.reviewItemContainer}>
      <Image source={item.userImage} style={styles.userImage} />
      <View style={styles.reviewContent}>
        <Text style={styles.userName}>{item.userName}</Text>
        {/* Render RatingStars component with item.ratingStar */}
        <RatingStars rating={item.ratingStar} />
        <Text style={styles.reviewText}>{item.reviewText}</Text>
        {item.reviewImages && item.reviewImages.length > 0 && (
          <FlatList
            horizontal
            data={item.reviewImages}
            renderItem={({ item, index }) => (
              <Pressable onPress={() => openModal(index)}>
                <Image source={item} style={styles.reviewImage} />
              </Pressable>
            )}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false} 
          />
        )}
        <Text style={styles.dateTime}>{item.date} - {item.time}</Text>
      </View>

      <Modal visible={modalVisible} transparent={false}>
        <View style={styles.modalContainer}>
          <Swiper
            index={selectedIndex}
            loop={false}
            showsPagination={false}
            onIndexChanged={(index) => setSelectedIndex(index)}
          >
            {item.reviewImages && item.reviewImages.map((image, index) => (
              <View key={index} style={styles.swiperImageContainer}>
                <Image source={image} style={styles.swiperImage} resizeMode="contain" />
              </View>
            ))}
          </Swiper>
          <Pressable style={styles.closeButton} onPress={closeModal}>
            <Ionicons name="close-circle"size={36} color="white" />
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

export default ReviewItem;
const styles = StyleSheet.create({
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    top: 20,
    right: 20,
    zIndex: 1,
  },
  
});