import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";

import userAvatar from "../assets/AIUSER.png";
import botAvatar from "../assets/AI LOGO.png";

const AIScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loadingMessage, setLoadingMessage] = useState(false);

  const { userRole } = route.params;

  const handleInputText = (text) => {
    setInputMessage(text);
  };

  const renderChatFooter = () => {
    return <View style={{ height: -100 }} />;
  };

  const renderMessage = (props) => {
    const { currentMessage } = props;
    const isReceived = currentMessage.user._id !== 1;

    return (
      <View style={[styles.messageContainer, isReceived ? styles.receivedMessage : styles.sentMessage]}>
        {isReceived && (
          <Image
            source={currentMessage.user.avatar}
            style={styles.avatar}
          />
        )}
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: "#002F45",
              marginRight: 12,
              marginBottom: 20,
            },
            left: {
              backgroundColor: "white",
              marginLeft: 12,
              marginBottom: 30,
            },
          }}
          containerStyle={{
            left: {
              marginLeft: isReceived ? 5 : 0,
            },
          }}
          textStyle={{
            right: {
              color: "white",
            },
          }}
        />
        {!isReceived && (
          <Image
            source={currentMessage.user.avatar}
            style={styles.avatar}
          />
        )}
      </View>
    );
  };

  const submitHandler = async () => {
    const message = {
      _id: Math.random().toString(36).substring(7),
      text: inputMessage,
      createdAt: new Date().getTime() + Math.floor(Math.random() * 1000),
      user: {
        _id: 1,
        avatar: userAvatar, // Use the imported local image
      },
    };

    try {
      setLoadingMessage(true);
      setMessages((previousMessages) => [message, ...previousMessages]);
      setInputMessage("");

      const response =
        userRole === "Seeker"
          ? await axios.post("http://3.26.59.191:5001/ai/generateSeekerContent", { inputText: inputMessage })
          : await axios.post("http://3.26.59.191:5001/ai/generateProviderContent", { inputText: inputMessage });
      console.log(response);
      const botMessage = {
        _id: Math.random().toString(36).substring(7),
        text: response.data.outputText,
        createdAt: new Date().getTime() + Math.floor(Math.random() * 1000),
        user: {
          _id: 2,
          avatar: botAvatar, // Use the imported local image
        },
      };

      setMessages((previousMessages) => [botMessage, ...previousMessages]);
      setLoadingMessage(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <LinearGradient colors={["#3A6A80", "white"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0} // Adjust this value as needed
      >

            <Image
              source={require("../assets/ailogo (5).png")}
              style={{ width: 200, height: 90, marginTop:10, alignSelf: 'center' }}
            />

        <View style={{ flex: 1, flexDirection: "row" }}>
          
          
          <GiftedChat
            messages={messages}
            renderInputToolbar={(props) => {}}
            user={{ _id: 1 }}
            renderMessage={renderMessage}
            renderChatFooter={renderChatFooter}
            disabled={loadingMessage}
          />
        </View>


  
        {loadingMessage ? (
          <View style={styles.loadingContainer}>
            <Image
              source={require("../assets/loading.gif")}
              style={{ width: 120, height: 120 }}
            />
          </View>
        ) : (
          <View style={styles.inputContainer}>
            <View style={styles.inputMessageContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type here..."
                value={inputMessage}
                onChangeText={handleInputText}
              />
              <View style={{ flexDirection: "row", alignItems: "center" }}></View>
  
              <TouchableOpacity
                onPress={submitHandler}
                disabled={!inputMessage || loadingMessage}
                style={{ opacity: !inputMessage || loadingMessage ? 0.5 : 1 }}
              >
                <Feather name="send" size={24} color="black" marginRight={20} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </LinearGradient>
  );
  
};

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    top: 15,
    marginTop: -80,
  },
  inputMessageContainer: {
    height: 50,
    flexDirection: "row",
    width: 350,
    marginBottom: 80,
    borderWidth: 1,
    borderRadius: 50,
    alignItems: "center",
    borderColor: "black",
    backgroundColor: "white",
  },
  input: {
    color: "black",
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-start", // Align items to the start (top)
  },
  receivedMessage: {
    justifyContent: "flex-start",
    marginLeft: 8, // Add some margin to the left of the message container
  },
  sentMessage: {
    justifyContent: "flex-end",
    marginRight: 8, // Add some margin to the right of the message container
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15, // Adjusted to match the width/height to make it a circle
    marginHorizontal: 3,
    alignSelf: 'flex-start', // Align the avatar to the top
    marginTop: 5, // Adjust space above the avatar
    marginRight: 5, // Adjust space between the avatar and the message container
  },
});


export default AIScreen;