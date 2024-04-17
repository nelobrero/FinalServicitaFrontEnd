
import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, Modal, FlatList } from 'react-native';
import Swiper from 'react-native-swiper';
import  { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import reviewsData from '../components/Data';
import ReviewItem from '../components/ReviewParent';

const Reviews = () => {
  return (
    <FlatList
      data={reviewsData}
      renderItem={({ item }) => <ReviewItem item={item} />}
      keyExtractor={(item) => item.id.toString()}
      scrollEnabled={false} 
    />
  );
};



export default Reviews;