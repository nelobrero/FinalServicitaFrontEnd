import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const RatingService = ({ rating }) => {
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating - filledStars >= 0.5;
  const remainingStars = 5 - filledStars - (hasHalfStar ? 1 : 0);

  return (
    <View style={styles.container}>
    <Text style={styles.ratingText}>{rating}</Text>
      <View style={styles.ratingStars}>
        {[...Array(filledStars)].map((_, index) => (
          <FontAwesome key={index} name="star" size={14} color="#266f92" />
        ))}
        {hasHalfStar && <FontAwesome name="star-half-full" size={14} color="#266f92" />}
        {[...Array(remainingStars)].map((_, index) => (
          <FontAwesome key={index + filledStars + (hasHalfStar ? 1 : 0)} name="star-o" size={15} color="#266f92" />
        ))}
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
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

export default RatingService ;