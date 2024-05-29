import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  Modal,
  Pressable,
  Linking,
} from "react-native";
import { Video, Audio } from "expo-av";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import { formatDayStamps, formatTimeStamps2, askForCameraPermission, askForLibraryPermission } from "../helper/helperFunction";
import * as ImagePicker from 'expo-image-picker';
import storage from '@react-native-firebase/storage';
import Swiper from 'react-native-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendPushNotification } from './NotificationScreen'
import { COLORS, FONTS } from "./../constants/theme";
import axios from 'axios';

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;


const Chat = ({ navigation, route }) => {
  const { userId, userName, chatId, otherUserName, otherUserImage, role, otherUserMobile, admin, otherUserTokens } = route.params;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [otherUserStatus, setOtherUserStatus] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sentImagesData, setSentImagesData] = useState(null);
  const [modalOptionsVisible, setModalOptionsVisible] = useState(false);
  const videoRef = React.useRef(null);


  const handleInputText = (text) => {
    setInputMessage(text);
  };


  useEffect(() => {

    const chatReference = admin === false ? firestore().collection("chats").doc(chatId) : firestore().collection("adminChats").doc(chatId);
    

    const unsubscribe = chatReference.onSnapshot((doc) => {
      if (doc.exists) {
        setMessages(doc.data().messages);
        setOtherUserStatus(admin === true ? doc.data.adminStatus : role === "Provider" ? doc.data().usersOnline.seeker : doc.data().usersOnline.provider);
        
        const messages = doc.data().messages.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
  
        // Filter out images from sorted messages
        const images = messages.filter((message) => message.image || message.video);
  
        // Set the sorted images data
        setSentImagesData(images);
  
      }
      setLoading(false);
    }
    );

    return () => unsubscribe();
  }, [userId, chatId]);


  const handleCall = () => {
    if(Platform.OS === 'android') {
      Linking.openURL(`tel:${otherUserMobile}`);
    } else {
      Linking.openURL(`telprompt:${otherUserMobile}`);
    }
  }

  
  const handlePhotoPicker = async () => {
    const Permission = await askForLibraryPermission();
    if (Permission) {
    let image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!image.canceled) {
      if (image.assets[0].type === "image") {
        sendImage(image.assets[0].uri);
      } else if (image.assets[0].type === "video") {
        sendVideo(image.assets[0].uri);
      }
    }
  } 
  }

  async function sendImage(uri) {
  setModalOptionsVisible(false);
  setLoading(true);
    const imageUploadPromise = 
    new Promise(async (resolve, reject) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = storage().ref().child(`chats/${chatId}/${uri.split('/').pop()}`);
    await ref.put(blob);
    const imageUrl = await ref.getDownloadURL();
    submitHandler([{ image: imageUrl, createdAt: new Date(), user: { _id: userId }, _id: `${chatId}_${new Date().getTime()}_${userId}`, text: ""}]);
    resolve(imageUrl);
  });
  await imageUploadPromise;
  setLoading(false);
  }


  const handleCamera = async () => {
    const Permission = await askForCameraPermission();
    if (Permission) {
      let result = await ImagePicker.launchCameraAsync(
        {
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 4],
          quality: 1,
        }

      );

      if (!result.canceled) {
        if (result.assets[0].type === "image") {
          sendImage(result.assets[0].uri);
        } else if (result.assets[0].type === "video") {
          sendVideo(result.assets[0].uri);
        }
      }

    }
  }
  
  async function sendVideo(uri) {
    setModalOptionsVisible(false);
    setLoading(true);
    const videoUploadPromise =
    new Promise(async (resolve, reject) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = storage().ref().child(`chats/${chatId}/${uri.split('/').pop()}`);
    await ref.put(blob);
    const videoUrl = await ref.getDownloadURL();
    submitHandler([{ video: videoUrl, createdAt: new Date(), user: { _id: userId }, _id: `${chatId}_${new Date().getTime()}_${userId}`, text: ""}]);
    resolve(videoUrl);
  }
  );
  await videoUploadPromise;
  setLoading(false);
  }

  const renderMessage = (props) => {
    const { currentMessage } = props;
    const isReceived = currentMessage._id !== userId;
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <Bubble
            {...props}

            wrapperStyle={{
              right: {
                backgroundColor: '#218aff',
                marginRight: 12,
          
              },
              left: {
                backgroundColor: "#d8d8d8",
                marginLeft: 12,
              
              },
            
            }}
            containerStyle={{
              left: {
                marginLeft: isReceived ? -40 : 0,
              },
            
            }}
            textStyle={{
              right: {
                color: "white",
              },
            }}
          />
        </View>
      );
    }

  const submitHandler = async (newMessages = []) => {
    const chatReference = admin === false ? firestore().collection("chats").doc(chatId) : firestore().collection("adminChats").doc(chatId);
    const formattedMessage = newMessages.map((message) => ({
      ...message,
      createdAt: new Date(message.createdAt),
    }));

    const lastMessageTime = formattedMessage[0].createdAt;
  

    setInputMessage("");

    try {
      await chatReference.set({
        messages: GiftedChat.append(messages, formattedMessage),
        lastMessageTime: lastMessageTime,
      }, { merge: true });

      if (admin === false) {
      for (const token of otherUserTokens) {
        sendPushNotification(token, 'New Message', `${userName} has sent you a message.`, userId);
      } 
    } else {
      const notification = {
        userId: "66111acbea0491231d30d8a7",
        message: `User ${userId} has sent you a message.`,
        title: "New Message",
        otherUserId: userId,
      };
    
      await axios.post("http://192.168.1.7:5000/notifications/create", notification)
    }

    } catch (error) {
      console.log("Error sending message: ", error);
    }
    }
  
    const renderChatFooter = () => {
      return <View style={{ height: 20 }} />;
    }

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.secondaryGray}} >
          <Image source={require('../assets/loading.gif')} style={{width: 100, height: 100}} />
      </View>
    );
  }

  const allImages = sentImagesData.reduce((accumulator, currentValue) => accumulator.concat(currentValue.image || currentValue.video), []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 16,
          backgroundColor: "white",
          borderBottomColor: "gray",
          borderBottomWidth: 0.2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginHorizontal: 12 }}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <View>
            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 4, // Corrected the spelling of "right"
                width: 10,
                height: 10, // Corrected the spelling of "height"
                borderRadius: 5,
                backgroundColor: "blue",
                zIndex: 999,
                borderWidth: 2, // Corrected the repeated declaration
                borderColor: "white",
              }}
            />
            <Image
              source={{ uri: otherUserImage }}
              resizeMode="contain"
              style={{
                height: 48, // Corrected the spelling of "height"
                width: 48,
                borderRadius: 24, // Adjusted the borderRadius to half the width/height to make it a circle
              }}
            />
          </View>
          <View style={{ marginLeft: 16 }}>
            <Text
              style={{
                fontSize: 16,
                color: "black",
              }}
            >
              {otherUserName}
            </Text>
            <Text
              style={{
                fontSize: 12,
                // fontFamily: "regular",
                color: "blue",
              }}
            >
              {otherUserStatus ? "Online" : "Offline"}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >

          {admin === 'false' && (
          <TouchableOpacity
            style={{
              marginHorizontal: 16,
            }}
            onPress={handleCall}
          >
            <Feather name="phone" size={24} color="gray" />
          </TouchableOpacity>
          )}
        </View>
      </View>

      <GiftedChat
        messages={messages}
        renderInputToolbar={(props) =>
           <View style={styles.inputContainer}>
        <View style={styles.inputMessageContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type here..."
            value={inputMessage}
            multiline={true}
            onChangeText={handleInputText}
            // placeholderTextColor={black}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                marginHorizontal: 8,
              }}
              onPress={() => setModalOptionsVisible(true)}
            >
              <Ionicons name="images-outline" size={24} color="black" />
            </TouchableOpacity>
          
          <TouchableOpacity onPress={() => submitHandler([{ text: inputMessage, createdAt: new Date(), user: { _id: userId }, _id: `${chatId}_${new Date().getTime()}_${userId}` }])} disabled={inputMessage.length === 0} style={{ opacity: inputMessage.length === 0 ? 0.5 : 1 }}>
            <Feather name="send" size={24} color="black" marginRight={10} />
          </TouchableOpacity>
          </View>
        </View>
      </View>
        }
        onSend={(newMessages) => submitHandler(newMessages)}
        user={{ _id: userId }}
        renderTime={(props) => (
            <View style={props.containerStyle}>
            <Text
              style={{
                color: props.position === "left" ? "gray" : "white",
                fontSize: 12,
                marginHorizontal: 10,
              }}
            >
              {`${props.currentMessage.createdAt instanceof Date ? props.currentMessage.createdAt.toLocaleString("en-US",
                {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })
                : formatTimeStamps2(props.currentMessage.createdAt)
                }`}
              
            </Text>
          </View>
          )}

          renderDay={(props) => {
            const { currentMessage, previousMessage } = props;
        
            const isSameDayAs = (date1, date2) => {

              if (!date1 || !date2) return false;

              if (typeof date1 === 'object' && typeof date1.seconds === 'number' &&
                  typeof date1.nanoseconds === 'number') {

                date1 = new Date(date1.seconds * 1000 + date1.nanoseconds / 1000000);;
              }
            
              if (typeof date2 === 'object' && typeof date2.seconds === 'number' &&
                  typeof date2.nanoseconds === 'number') {
                date2 = new Date(date2.seconds * 1000 + date2.nanoseconds / 1000000);
              }
            
              return (
                date1.getFullYear() === date2.getFullYear() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getDate() === date2.getDate()
              );
            };
        
        
            return (
              <View style={props.containerStyle}>
                {!previousMessage || !isSameDayAs(currentMessage.createdAt, previousMessage.createdAt) ? (
                <Text style={{ color: "gray", fontSize: 12, marginHorizontal: 4, alignSelf: "center", marginVertical: 10 }}>
                  {currentMessage.createdAt instanceof Date
                      ? currentMessage.createdAt.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : formatDayStamps(currentMessage.createdAt)}
                </Text>
              ) : null}
              </View>
            );
          }}
          renderBubble={renderMessage}
          renderChatFooter={renderChatFooter}
          renderMessageImage={(props) => {
            return (
              <View style={{ borderRadius: 15, padding: 2}}>
                <Pressable onPress={() => {
                  setSelectedIndex(allImages.indexOf(props.currentMessage.image));
                  setModalVisible(true);
                }
                }>
                  <Image
                    resizeMode="contain"
                    source={{ uri: props.currentMessage.image }}
                    style={{ width: 200, height: 200, borderRadius: 15, padding: 6, resizeMode: 'cover'  }}
                  />
                </Pressable>
              </View>
            );
          }
          }
          renderMessageVideo={(props) => {
            return (
              <View style={{ borderRadius: 15, padding: 2}}>
                <Pressable onPress={() => {
            
                  setSelectedIndex(allImages.indexOf(props.currentMessage.video));
                  setModalVisible(true);
                }
                }>
                  <Video
                    source={{ uri: props.currentMessage.video }}
                    style={{ width: 200, height: 200, borderRadius: 15, padding: 6 }}
                    resizeMode="cover"
          
                  />

                 

                  <View
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginLeft: -24,
                      marginTop: -24,
                    }}
                  >
                    <Ionicons name="play-circle" size={48} color="white" />
                  </View>

                </Pressable>



              </View>
            );
          }
          
          }
          renderLoading={() => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="blue" />
            </View>
          )}
        renderAvatarOnTop={true}
        renderAvatar={(props) => {
          
          const { currentMessage, previousMessage } = props;

        

          return (
            <View
              style={{
                marginLeft: 12,
                marginRight: 12,
                marginBottom: 4,
              }}
            >
              {currentMessage?.user?._id !== previousMessage?.user?._id ? (
  <Image
    source={{ uri: otherUserImage }}
    style={{
      height: 32,
      width: 32,
      borderRadius: 16,
      marginRight: windowWidth * 0.08
    }}
  />
) : (
  <View style={{ height: 32, width: 32, marginRight: windowWidth * 0.08 }} />
)}


            </View>
            
          );
        }
        }
        // loadEarlier={true}
        // isLoadingEarlier={true}
        // infiniteScroll={true}
      />
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >

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

            {image.includes(".mp4") ?
              <Video
                source={{ uri: image }}
                style={styles.swiperImage}
                resizeMode="contain"
                useNativeControls
                ref={videoRef}
              />
              :
              <Image
                source={{ uri: image }}
                style={styles.swiperImage}
                resizeMode="contain"
              />  
          } 
              </View>
            ))}
          </Swiper>
          <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Ionicons name="close-circle" size={36} color="white" />
          </Pressable>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={modalOptionsVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <Pressable style={styles.closeButtons} onPress={() => setModalOptionsVisible(false)}>
            <Ionicons name="close-circle" size={36} color="white" />
          </Pressable>
          <View
            style={{
              backgroundColor: "white",
              width: "80%",
              padding: 16,
              borderRadius: 16,
            }}
          >
            <TouchableOpacity
              style={{
                padding: 16,
              }}
              onPress={handleCamera}
            >
              <Text>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 16,
              }}
              onPress={handlePhotoPicker}
            >
              <Text>Photo Library</Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </Modal>

      {Platform.OS === "android" && <KeyboardAvoidingView behavior="padding" />}
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: "white",
    height: 'auto',
    alignItems: "center",
    justifyContent: "center",
    bottom: windowHeight * 0.02,
  },
  inputMessageContainer: {
    height: 54,
    width: 380,
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    // backgroundColor: "blue",
    borderRadius: 16,
    alignItems: "center",
    borderColor: "blue",
    marginBottom: 130,
  },
  input: {
    color: "black",
    flex: 1,
    paddingHorizontal: 10,
  },
  closeButton: {
    position: 'absolute',
    top: windowHeight * 0.02,
    right: 20,
  },
  closeButtons: {
    position: 'absolute',
    top: windowHeight * 0.02,
    right: 20,
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
});

export default Chat;
