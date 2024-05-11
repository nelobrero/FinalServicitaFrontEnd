import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, Dimensions, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';
import { messagesData } from '../data'; // Ensure that messagesData and users are imported correctly
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatTimeStamps, generateMessageId, sortMessagesByTimestamp } from '../helper/helperFunction';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const MessagePage = ({ navigation, route }) => {


  const { userEmail, userRole } = route.params;
  const [userData, setUserData] = useState({});
  const [loading, isLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  async function getUserData() {
    try {
      await axios.post("http://192.168.1.7:5000/user/getUserDetailsByEmail", { email: userEmail }).then((response) => {
        setUserData(response.data.data);
        return response.data.data._id;
      }
      );

    } catch (error) {
      AsyncStorage.removeItem('isLoggedIn');
      console.error('Error getting user data from MongoDB:', error);
    }
  }

  // async function getMessageData() {
  //   try {
  //     const userId = await getUserData();
  //     const chatSnapshot = await firestore().collection('messages').where('users', 'array-contains', userId).get();
  //     setFilteredUsers(chatSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  //     isLoading(false);
  //   }
  //   catch (error) {
  //     console.error('Error getting message data:', error);
  //   }
  // }


  // useFocusEffect(
  //   React.useCallback(() => {
  //     getMessageData();
  //   }, [route])
  // );

  useEffect(async () => {
    const userId = await getUserData();
    const chatSnapshots = firestore().collection("chats").where('users', 'array-contains', userId);
    

    const unsubscribe = chatSnapshots.onSnapshot((snapshot) => {
      const chats = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      // const sortedChats = sortMessagesByTimestamp(chats);
      setFilteredUsers(chats);
      isLoading(false);
    }
    );

    return () => unsubscribe();
  }, [userId]);

  const handleSearch = (text)=>{
    setSearch(text);

    const filteredData = messagesData.filter((user) =>
      userRole === 'Provider' ? user.usersFullName.seeker.toLowerCase().includes(text.toLowerCase()) : user.usersFullName.provider.toLowerCase().includes(text.toLowerCase())
    );

    setFilteredUsers(filteredData)
  }

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Chat", { userId: userData._id, chatId: item.id })}
      style={[
        styles.userContainer,
      ]}
    >
      <View style={styles.userImageContainer}>
        {userRole === 'Provider' ?  item.usersOnline.seeker ? (
          <View style={[styles.onlineIndicator, { backgroundColor: '#34C800' }]} />
        ) : (
          <View style={[styles.onlineIndicator, { backgroundColor: '#FF0000' }]} />
        ) : item.usersOnline.provider ? (
          <View style={[styles.onlineIndicator, { backgroundColor: '#34C800' }]} />
        ) : (
          <View style={[styles.onlineIndicator, { backgroundColor: '#FF0000' }]} />
        )}
        <Image
          source={{ uri: userRole === 'Provider' ? item.usersImage.seeker : item.usersImage.provider }}
          resizeMode='cover'
          style={styles.userImage}
        />
      </View>

      <View style={{ flex: 1 }}>
        <View style={styles.userInfoContainer}>
          <Text style={styles.userName}>{userRole === 'Provider' ? item.usersFullName.seeker : item.usersFullName.provider}</Text>
          <Text style={styles.lastSeen}>{item.messages && item.messages.length > 0 ? item.messages[item.messages.length - 1].lastMessage : 'You are now connected'}</Text>
        </View>

        <View style={{ position: "absolute", right: 4, alignItems: "center" }}>
          <Text style={styles.lastMessageTime}>{item.messages && item.messages.length > 0 ? formatTimeStamps(item.messages[item.messages.length - 1].createdAt) : ''}</Text>
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
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      {/* FlatList */}
      <FlatList
        data={filteredUsers}
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
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#07364B" />
          </View>
        );
      }

  return (
    <SafeAreaView style={styles.area}>
      <StatusBar hidden />
      <View style={styles.container}>
        {renderContent()}
      </View>
    </SafeAreaView>
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
    backgroundColor: "#90ee90",
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
