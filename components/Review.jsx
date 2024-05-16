import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import ReviewItem from '../components/ReviewParent';


const Reviews = ({ serviceId }) => {
  const [reviewsData, setReviewsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getReviews = async () => {
      try {
        const response = await axios.post('http://192.168.50.68:5000/rating/getRatingsByService', { serviceId });
        setReviewsData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    getReviews();
  }, [serviceId]);

  const convertCreatedAtToDateMonthYear = (createdAt) => {
    const date = new Date(createdAt);
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
  };

  const convertCreatedAtToTime12HourFormat = (createdAt) => {
    const date = new Date(createdAt);
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  };
  
  if (!reviewsData && loading) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 20 }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <FlatList
      data={reviewsData}
      renderItem={({ item }) => (
        <ReviewItem
          item={{
            id: item._id,
            userImage: item.seekerImage,
            userName: item.seekerName,
            ratingStar: item.rating,
            reviewText: item.comment,
            reviewImages: item.images,
            date: convertCreatedAtToDateMonthYear(item.createdAt),
            time: convertCreatedAtToTime12HourFormat(item.createdAt)
          }}
        />
      )}
      keyExtractor={(item) => item._id.toString()}
      ListEmptyComponent={() => (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 20 }}>
          <Text>No reviews available</Text>
        </View>
      )}
      scrollEnabled={false}
    />
  );
};

export default Reviews;
