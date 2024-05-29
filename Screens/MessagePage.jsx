import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, Dimensions, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatTimeStamps, generateMessageId, sortConversationsByLastMessageTime } from '../helper/helperFunction';
import { COLORS, FONTS } from "./../constants/theme";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const MessagePage = ({ navigation, route }) => {


  const { userEmail, userRole } = route.params;
  const [userName, setUserName] = useState('');
  const [userData, setUserData] = useState({});
  const [loading, isLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);


  useEffect(() => {
    async function fetchData() {
        try {
            const response = await axios.post("http://192.168.1.7:5000/user/getUserDetailsByEmail", { email: userEmail });
            const userData = response.data.data;
            setUserData(userData);
            
            const userId = userData._id;
            const userFirestoreData = userRole === 'Provider' ? await firestore().collection('providers').doc(userId).get() : await firestore().collection('seekers').doc(userId).get();
            const userFirestoreDataJson = userFirestoreData.data();
            setUserName(`${userFirestoreDataJson.firstName} ${userFirestoreDataJson.lastName}`);
            let otherUserId = '';
            let otherUserExpoTokens = []

            const chatSnapshots = firestore().collection("chats").where('users', 'array-contains', userId);
            
           




            const chatWithAdminSnapshots = firestore().collection("adminChats").where('usersId.user', '==', userId);
      
            const [chatSnapshot, chatWithAdminSnapshot] = await Promise.all([chatSnapshots.get(), chatWithAdminSnapshots.get()]);
            if (chatSnapshot.docs.length > 0) {
                const chatData = chatSnapshot.docs[0].data();
                otherUserId = chatData.users.find(id => id !== userId);
                const otherUserFirestoreData = userRole === 'Provider' ? await firestore().collection('seekers').doc(otherUserId).get() : await firestore().collection('providers').doc(otherUserId).get();
                otherUserExpoTokens = otherUserFirestoreData.data().expoPushTokens;
            }

            // Extract the data from the snapshots
            const chatDocs = chatSnapshot.docs.map(doc => ({ id: doc.id, admin: false, ...doc.data(), otherUserTokens: otherUserExpoTokens })); 
          
            const chatWithAdminDocs = chatWithAdminSnapshot.docs.map(doc => ({ id: doc.id, admin: true, ...doc.data(), otherUserTokens: [] }));
      
            // Combine or set them as needed
            const allChats = [...chatDocs, ...chatWithAdminDocs];
            setFilteredUsers(allChats);
            
            // Set up snapshot listeners after the initial data fetch
            const chatUnsubscribe = chatSnapshots.onSnapshot((snapshot) => {
                const chatDocs = snapshot.docs.map(doc => ({ id: doc.id, admin: false, ...doc.data() }));
                setFilteredUsers(prevState => {
                    const updatedChats = new Map(prevState.map(chat => [chat.id, chat]));
                    chatDocs.forEach(chat => updatedChats.set(chat.id, chat));
                    return Array.from(updatedChats.values());
                });
            });
          
            const chatWithAdminUnsubscribe = chatWithAdminSnapshots.onSnapshot((snapshot) => {
                const chatWithAdminDocs = snapshot.docs.map(doc => ({ id: doc.id, admin: true, ...doc.data() }));
                setFilteredUsers(prevState => {
                    const updatedChats = new Map(prevState.map(chat => [chat.id, chat]));
                    chatWithAdminDocs.forEach(chat => updatedChats.set(chat.id, chat));
                    return Array.from(updatedChats.values());
                });
            });

            // Return the unsubscribe functions to be called on cleanup
            return () => {
                chatUnsubscribe();
                chatWithAdminUnsubscribe();
            };
            
        } catch (error) {
            await AsyncStorage.removeItem('isLoggedIn');
            console.error('Error getting user data from MongoDB:', error);
        } finally {
            isLoading(false); // Ensure this function call is correct
        }
    }
  
    fetchData();
}, [userEmail]);

  
  

  const sortedData = sortConversationsByLastMessageTime(filteredUsers);
  const filteredData = sortedData.filter((user) => user.admin === true ? user.usersFullName.admin.toLowerCase().includes(searchQuery.toLowerCase()) : userRole === 'Provider' ? user.usersFullName.seeker.toLowerCase().includes(searchQuery.toLowerCase()) : user.usersFullName.provider.toLowerCase().includes(searchQuery.toLowerCase()));


  const renderItem = ({ item, index }) => (

    <TouchableOpacity
      onPress={() => navigation.navigate("Chat", { userId: userData._id, userName: userName, chatId: item.id, otherUserName: item.admin === true ? item.usersFullName.admin : userRole === 'Provider' ? item.usersFullName.seeker : item.usersFullName.provider, otherUserImage: item.admin === true ? item.usersImage.admin : userRole === 'Provider' ? item.usersImage.seeker : item.usersImage.provider, role: userRole, otherUserMobile: item.admin === true ? '' : userRole === 'Provider' ? item.usersNumbers.seeker : item.usersNumbers.provider, admin: item.admin, otherUserTokens: item.admin === true ? '' : item.otherUserTokens })} 
      style={[
        styles.userContainer,
      ]}
    >
      <View style={styles.userImageContainer}>

        {/* If admin is true instead of the online indicator, there should be a light blue checkmark icon */}

        {item.admin === true ? <AntDesign name="checkcircle" size={width * 0.05} color="#00BFFF" style={styles.onlineIndicator} /> :<View style={[
          styles.onlineIndicator,
          {
            backgroundColor: 
            // If admin is true, the online indicator should be light blue
              (userRole === 'Provider' && item.usersOnline.seeker) ||
              (userRole !== 'Provider' && item.usersOnline.provider)
                ? '#34C800'
                : '#FF0000'
          }
        ]} />}
        <Image
          source={{ uri: item.admin === true ? item.usersImage.admin : userRole === 'Provider' ? item.usersImage.seeker : item.usersImage.provider }}
          resizeMode='cover'
          style={styles.userImage}
        />
        
      </View>

        
      <View style={{ flex: 1 }}>
        <View style={styles.userInfoContainer}>
          <Text style={styles.userName}>{ item.admin === true ? item.usersFullName.admin : userRole === 'Provider' ? item.usersFullName.seeker : item.usersFullName.provider }</Text>
          <Text style={styles.lastSeen}>{item.messages && item.messages.length > 0 ? item.messages[0].user._id === userData._id ? item.messages[0].video ? 'You sent a video' : item.messages[0].image ? 'You sent an image' : `You: ${item.messages[0].text}` : item.messages[0].video ? 'Sent a video' : item.messages[0].image ? 'Sent an image' : item.messages[0].text : 'You are now connected!'}</Text>
        </View>

        <View style={{ position: "absolute", right: 4, alignItems: "center" }}>
          <Text style={styles.lastMessageTime}>{item.messages && item.messages.length > 0 ? formatTimeStamps(item.messages[0].createdAt) : formatTimeStamps(item.createdAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
  <Text style={{ fontSize: 30, fontWeight: "bold", color: "#07364B" }}>Message...</Text>
  <TouchableOpacity>
    
    <Image 
      source={require("../assets/ailogo.png")}
      resizeMode="contain"
      style={{
        height: 48,
        width: 70,
      }}
    />
  </TouchableOpacity>
</View>

      <View style={styles.searchBar}>
        <TouchableOpacity>
          <AntDesign name="search1" size={24} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder='Search....'
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
      </View>

      {/* FlatList */}
      <FlatList
        data={filteredData}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>No messages found</Text>
          </View>
        )}
      />
    </View>
  );

      if (loading) {
        return (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.secondaryGray}} >
              <Image source={require('../assets/loading.gif')} style={{width: 200, height: 200}} />
          </View>
        );
      }

  return (
   <View style={styles.area}>
      <StatusBar hidden />
      <View style={styles.container}>
        {renderContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    width: width * 0.91,
    height: height * 0.07,
    marginVertical: 22,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1
  },
  searchInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 12,
    backgroundColor: "white"
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  
  userImageContainer: {
    marginRight: 16,
  },
  onlineIndicator: {
    width: 20,
    height: 20,
    borderRadius: 15,
    position: "absolute",
    borderWidth:3,
    borderColor: "white", 
    top: 50,
    zIndex: 999,
    right: 0,
  },
  userImage: {
    width: 70,
    height: 70,
    borderRadius: 40,
  },
  userInfoContainer: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
  },
  lastSeen: {
    color: '#999',
  },
  lastMessageTime: {
    color: '#999',
  }
});

export default MessagePage;
