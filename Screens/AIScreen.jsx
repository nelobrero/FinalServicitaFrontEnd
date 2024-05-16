import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { Bubble } from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";


const AIScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleInputText = (text) => {
    setInputMessage(text);
  };

  const renderMessage = (props) => {
    const { currentMessage } = props;

    if (currentMessage.user._id === 1) {
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
                backgroundColor: "#07374D",
                marginRight: 12,
                marginBottom: 5,
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
  };

  const submitHandler = () => {
    const message = {
      _id: Math.random().toString(36).toString(7),
      text: inputMessage,
      // Use any method to generate your desired timestamp, for example, adding a random number of milliseconds to the current time
      createdAt: new Date().getTime() + Math.floor(Math.random() * 1000),
      user: { _id: 1 },
    };

    setMessages((previousMessages) => [message, ...previousMessages]);

    setInputMessage("");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
         <LinearGradient
        colors={["#3A6A80", "white"]}
        style={{flex: 1,
            justifyContent: "center",
            alignItems: "center",}}
      >
<View style={{ flex: 1, flexDirection: "row", }}>
  <TouchableOpacity style={{margin: 15}}>
    <AntDesign name="arrowleft" size={28} color="black" />
  </TouchableOpacity>

  


          {/* <Image
            source={require("../assets/AILogo.png")}
            resizeMode="contain"
            style={{
              height: 100,
              width: 100,    
              position: "absolute",
              top: 10, // Adjust the top position as needed
              left: 170, // Adjust the left position as needed
            }}
          /> */}
        

        <GiftedChat
          messages={messages}
          renderInputToolbar={() => {
            return null;
          }}
          user={{ _id: 1 }}
          minInputToolbarHeight={0}
          renderMessage={renderMessage}
          
        />

        <View style={styles.inputContainer}>
          <View style={styles.inputMessageContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type here..."
              value={inputMessage}
              onChangeText={handleInputText}
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={{ marginHorizontal: 8 }}
              >
                <Ionicons name="images-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={submitHandler}>
              <Feather
                name="send"
                size={24}
                color="black"
                marginRight={10}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: "white",
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  inputMessageContainer: {
    height: 54,
    width: 380,
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 16,
    alignItems: "center",
    borderColor: "black",
  },
  input: {
    color: "black",
    flex: 1,
    paddingHorizontal: 10,
  },
});

export default AIScreen;
