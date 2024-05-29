import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { GiftedChat, Bubble  } from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { COLORS, FONTS } from "./../constants/theme";

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

const AIScreen = ({ navigation, role }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loadingMessage, setLoadingMessage] = useState(false);

  const handleInputText = (text) => {
    setInputMessage(text);
  };

  const renderChatFooter = () => {
    return <View style={{ height: 30 }} />;
  }

  const renderMessage = (props) => {
    const { currentMessage } = props;
    const isReceived = currentMessage.user._id !== 1

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
              marginBottom: 12,
            },
            left: {
              backgroundColor: "#d8d8d8",
              marginLeft: 12,
              marginBottom: 12,
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
      </View>
    );
  };

  const submitHandler = async () => {


    const message = {
      _id: Math.random().toString(36).toString(7),
      text: inputMessage,
      createdAt: new Date().getTime() + Math.floor(Math.random() * 1000),
      user: { _id: 1 },
    };

    try {
      setLoadingMessage(true);
      setMessages((previousMessages) => [message, ...previousMessages]);
      setInputMessage("");

      const response = role === "Seeker" ? await axios.post("http://192.168.1.7:5000/ai/generateSeekerContent", { inputText: inputMessage }) : await axios.post("http://192.168.1.7:5000/ai/generateProviderContent", { inputText: inputMessage })
      console.log(response);
      const botMessage = {
        _id: Math.random().toString(36).toString(7),
        text: response.data.outputText,
        createdAt: new Date().getTime() + Math.floor(Math.random() * 1000),
        user: { _id: 2 },
      };

      setMessages((previousMessages) => [botMessage, ...previousMessages]);
      setLoadingMessage(false);
    } catch (error) {
      console.log(error);
    }

  };

  return (
    
    
         <LinearGradient
        colors={["#3A6A80", "white"]}
        style={{flex: 1,
      }}
      >
          
<View style={{ flex: 1, flexDirection: "row", }}>
  


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
          renderInputToolbar={(props) => {
          }}
          user={{ _id: 1 }}
          renderMessage={renderMessage}
          renderChatFooter={renderChatFooter}
          disabled={loadingMessage}
        />

        

       
      </View>

      {loadingMessage ? (
               
               <View style={styles.loadingContainer}>
               <Image source={require('../assets/loading.gif')} style={{width: 100, height: 100}} />
           </View>
             )  :
             <View style={styles.inputContainer}>
            <View style={styles.inputMessageContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type here..."
                value={inputMessage}
                onChangeText={handleInputText}
              />
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* <TouchableOpacity
                  style={{ marginHorizontal: 8 }}
                >
                  <Ionicons name="images-outline" size={24} color="black" />
                </TouchableOpacity> */}
              </View>

               

              <TouchableOpacity onPress={submitHandler} disabled={!inputMessage || loadingMessage} styles={{ opacity: !inputMessage || loadingMessage ? 0.5 : 1 }}>
                <Feather
                  name="send"
                  size={24}
                  color="black"
                  marginRight={10}
                />
              </TouchableOpacity>
            </View>
          </View>
    
             
             }

      
          
      </LinearGradient>

      
      
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: "center",
    justifyContent: "center",
    bottom: height * 0.1,
    width: "100%",
  },
  inputMessageContainer: {
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 16,
    alignItems: "center",
    borderColor: "black",
    backgroundColor: "white",
  },
  input: {
    color: "black",
    flex: 1,
    paddingHorizontal: 10,
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
});

export default AIScreen;
