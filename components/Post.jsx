import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, Image, StyleSheet, Pressable, FlatList, Modal, Dimensions, ActivityIndicator } from 'react-native';
import Swiper from 'react-native-swiper';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { COLORS, FONTS } from "./../constants/theme";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const PostItem = ({ item }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const videoRef = React.useRef(null);
  
    const openModal = (index) => {
      setSelectedIndex(index);
      setModalVisible(true);
    };
  
    const closeModal = () => {
      setModalVisible(false);
    };
  
  
    return (
      <View style={styles.postItemContainer}>
        <Image source={{ uri: item.userImage }} style={styles.userImage} />
        <View style={styles.postContent}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.dateTime}>{item.date}, {item.time}</Text>
          <Text style={styles.postText}>{item.postText}</Text>
          {item.postImages && item.postImages.length > 0 && (
            <FlatList
              horizontal
              data={item.postImages}
              renderItem={({ item, index }) => (
                <Pressable onPress={() => openModal(index)}>
                  {
                    item.includes('.mp4') ?
                    <>
                    <Video source={{ uri: item }} style={styles.postImage} resizeMode='cover' /> 
                    <Ionicons name="play-circle" size={36} color="red" style={{ position: 'absolute', top: '50%', left: '50%', marginLeft: -18, marginTop: -18 }} />
                    </>  : <Image source={{ uri: item }} style={styles.postImage} />
                  }
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
              onIndexChanged={(index) => {
                setSelectedIndex(index)
                videoRef.current.pauseAsync();
              }}
            >
              {item.postImages && item.postImages.map((image, index) => (
                <View key={index} style={styles.swiperImageContainer}>
                  { image.includes('.mp4') ?
                  <>
                  <Video source={{ uri: image }} style={styles.swiperImage} resizeMode='cover' ref={videoRef} useNativeControls />
                  </>  : <Image source={{ uri: image }} style={styles.swiperImage} />
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
  
  const Posts = ({ serviceName, coverImage, serviceId }) => {
    
    const [postsData, setPostsData] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const getPosts = async () => {
        try {
          const response = await axios.post('http://192.168.1.7:5000/post/getPostsById', { serviceId });
          setPostsData(response.data.data);
          setLoading(false);
        } catch (error) {
          console.error(error);
        }
      };
  
      getPosts();
    }, [serviceId]);
  
    const convertCreatedAtToDateMonthYear = (createdAt) => {
      const date = new Date(createdAt);
      return `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    };
  
    const convertCreatedAtToTime12HourFormat = (createdAt) => {
      const date = new Date(createdAt);
      return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };
    
    if (!postsData && loading) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.secondaryGray}} >
            <Image source={require('../assets/loading.gif')} style={{width: 200, height: 200}} />
        </View>
      );
    }
  
    
    return (
      <FlatList
      data={postsData}
      renderItem={({ item }) => (
        <PostItem
          item={{
            id: item._id,
            userImage: coverImage,
            userName: serviceName,
            postImages: item.images,
            postText: item.postText,
            date: convertCreatedAtToDateMonthYear(item.createdAt),
            time: convertCreatedAtToTime12HourFormat(item.createdAt)
          }}
        />
      )}
      keyExtractor={(item) => item._id.toString()}
      ListEmptyComponent={() => (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 20 }}>
          <Text>No posts available</Text>
        </View>
      )}
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