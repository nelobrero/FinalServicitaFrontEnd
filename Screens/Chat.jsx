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
} from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import { formatTimeStamps } from "../helper/helperFunction";

const Chat = ({ navigation, route }) => {
  const { userId, chatId } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const handleInputText = (text) => {
    setInputMessage(text);
  };

  useEffect(() => {
    const chatReference = firestore().collection("chats").doc(chatId);
    

    const unsubscribe = chatReference.onSnapshot((doc) => {
      if (doc.exists) {
        setMessages(doc.data().messages);
      }
      setLoading(false);
    }
    );

    return () => unsubscribe();
  }, [userId, chatId]);



  const renderMessage = (props) => {
    const { currentMessage } = props;
    const isReceived = currentMessage.senderId !== userId;

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
                backgroundColor: "blue",
              },
              left: {
                backgroundColor: "green",
                marginLeft: isReceived ? 0 : 10,
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
    const chatReference = firestore().collection("chats").doc(chatId);
    const formattedMessage = newMessages.map((message) => ({
      ...message,
      createdAt: new Date(message.createdAt),
    }));
    setInputMessage("");

    try {
      await chatReference.set({
        messages: GiftedChat.append(messages, formattedMessage),
      }, { merge: true });
    } catch (error) {
      console.log("Error sending message: ", error);
    }
    }
  
    const renderChatFooter = () => {
      return <View style={{ height: 20 }} />;
    }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

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
              source={require("../assets/images/user1.jpeg")}
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
              Carl Asoy
            </Text>
            <Text
              style={{
                fontSize: 12,
                // fontFamily: "regular",
                color: "blue",
              }}
            >
              Online
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              marginHorizontal: 16,
            }}
          >
            <Feather name="video" size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </View>

      <GiftedChat
        messages={messages}
        renderInputToolbar={() => {
          return null;
        }}
        onSend={(newMessages) => submitHandler(newMessages)}
        user={{ _id: userId }}
        renderTime={(props) => (
            <View style={props.containerStyle}>
            <Text
              style={{
                color: "black",
                fontSize: 12,
                marginHorizontal: 10,
                color: props.position === "left" ? "black" : "gray",
              }}
            >
              {`${props.currentMessage.createdAt instanceof Date ? props.currentMessage.createdAt.toLocaleString("en-US",
                {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })
                : formatTimeStamps(props.currentMessage.createdAt)
                }`}
              
            </Text>
          </View>
          )}

          renderDay={() => null}
          renderBubble={renderMessage}
          renderChatFooter={renderChatFooter}
          placeholder="Type a message..."
          textInputStyle={{ color: "white" }}
          renderUsernameOnMessage={true}
          containerStyle={{ 
            backgroundColor: "black" ,
            padding: 10,
            height: 60,
            multiline: true,
          }}
      />
      {Platform.OS === "android" && <KeyboardAvoidingView behavior="padding" />}
      <View style={styles.inputContainer}>
        <View style={styles.inputMessageContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type here..."
            value={inputMessage}
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
            >
              <Ionicons name="images-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={submitHandler}>
            <Feather name="send" size={24} color="black" marginRight={10} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: "white",
    height: 72,
    alignItems: "center",
    justifyContent: "center",
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
});

export default Chat;
