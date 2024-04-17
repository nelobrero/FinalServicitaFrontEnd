import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, FlatList, Modal, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import  { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;





const PostItem = ({ item }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
  
    const openModal = (index) => {
      setSelectedIndex(index);
      setModalVisible(true);
    };
  
    const closeModal = () => {
      setModalVisible(false);
    };
  
    const formatDate = (dateString) => {
      const options = { month: 'long', day: 'numeric', year: 'numeric' };
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', options);
    };
  
    return (
      <View style={styles.postItemContainer}>
        <Image source={{ uri: item.userImage }} style={styles.userImage} />
        <View style={styles.postContent}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.dateTime}>{formatDate(item.date)}, {item.time}</Text>
          <Text style={styles.postText}>{item.postText}</Text>
          {item.postImages && item.postImages.length > 0 && (
            <FlatList
              horizontal
              data={item.postImages}
              renderItem={({ item, index }) => (
                <Pressable onPress={() => openModal(index)}>
                  <Image source={item} style={styles.postImage} />
                </Pressable>
              )}
              keyExtractor={(item, index) => index.toString()}
              
            />
          )}
        </View>
  
        <Modal visible={modalVisible} transparent={true}>
          <View style={styles.modalContainer}>
            <Swiper
              index={selectedIndex}
              loop={false}
              showsPagination={false}
              onIndexChanged={(index) => setSelectedIndex(index)}
            >
              {item.postImages && item.postImages.map((image, index) => (
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
    );
  };
  
  const Posts = ({ serviceName, coverImage }) => {
    
    const postsData = [
      {
        id: 1,
        //URI
        userImage: coverImage,
        userName: serviceName,
        postImages: [
            require('../assets/post2.jpg'),
          ],
        postText: 'Wasn’t able to upload this gem but this is one of my favorite makeup looks. We did this glam early in the morning so I’m making sure this look will last the whole day. I’m glad this look turned exactly how the client wants it despite asking me to do whatever I want with her glam. It is indeed a hidden spark between me and my clients. I wish I can meet someone like her in the future.',
        date: '2024-03-13',
        time: '10:30 AM',
      },
      {
        id: 2,
        userImage: coverImage,
        userName: serviceName,
        postImages:  [
            require('../assets/post3.jpg'),
            require('../assets/post4.jpg'),
            require('../assets/post5.jpg'),
          ],
        postText: 'Had fun glamming youu',
        date: '2024-03-15',
        time: '12:45 PM',
      },
    ];
    
    
    return (
      <FlatList
        data={postsData}
        renderItem={({ item }) => <PostItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false} 
      />
    );
  };
  
  const styles = StyleSheet.create({
    postItemContainer: {
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
    postContent: {
      flex: 1,
    },
    userName: {
      fontWeight: 'bold',
      marginBottom: 4,
    },
    dateTime: {
      color: '#999999',
      marginBottom: 4,
    },
    postText: {
      marginBottom: 4,
      marginRight: 18,
      textAlign: 'justify'
    },
    postImage: {
      width: windowWidth * 0.72,
      height: windowWidth * 0.75,
      marginRight: 8,

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
        top: 20,
        right: 20,
        zIndex: 1,
      },
  });
  
  export default Posts;