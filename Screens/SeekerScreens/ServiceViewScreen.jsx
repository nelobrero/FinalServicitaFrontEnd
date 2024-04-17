
import { View, StyleSheet, ScrollView,TouchableOpacity, Dimensions, Text} from 'react-native';
import { Color, FontSize, FontFamily } from "./../../GlobalStyles";
import ServiceTop from './../../components/ServiceTop';
import Description from './../../components/Description';
import Post from './../../components/Post';
import Review from './../../components/Review';
import Photos from './../../components/Photos';
import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default ServiceViewScreen = ({navigation, route}) => {

  const { data } = route.params;

  const [activeTab, setActiveTab] = useState("Post"); // State to track active tab

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <SafeAreaView>

      <ScrollView>
      <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
                marginLeft: 20,
                position: 'absolute',
                zIndex: 1
            }}
        >
            <MaterialIcons name="arrow-back-ios" size={20} color={COLORS.white} />
            </TouchableOpacity>
        <View>
          <ServiceTop data={data} navigation={navigation} />
        </View>

        <View style={[styles.navigator, styles.navigatorContainer]}>

        <TouchableOpacity onPress={() => handleTabPress("Description")}>
          <Text style={[styles.tabText, activeTab === "Description" && styles.activeTab]}>Description</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabPress("Post")}>
          <Text style={[styles.tabText, activeTab === "Post" && styles.activeTab]}>Post</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabPress("Reviews")}>
          <Text style={[styles.tabText, activeTab === "Reviews" && styles.activeTab]}>Reviews</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabPress("Photos")}>
          <Text style={[styles.tabText, activeTab === "Photos" && styles.activeTab]}>Photos</Text>
        </TouchableOpacity>
      </View>

      <View>
        {activeTab === "Photos" && <Photos />}
      </View>

      <View>
        {activeTab === "Reviews" && <Review />}
      </View>  
      <View>
        {activeTab === "Post" && <Post serviceName = {data.service} coverImage = {data.providerImage}/>}
      </View>
     
      <View>
        {activeTab === "Description" && <Description description = {data.description} />}
      </View>
      

      
      

      

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.colorWhite,
  },
  navigatorContainer: {
    borderTopWidth: 2,  // Add border to the top
    borderBottomWidth: 2,  // Add border to the bottom
    borderColor: '#CCCCCC',
    paddingHorizontal: 10,
  },
  tabText: {
    textAlign: "center",
    color: Color.colorBlack,
    fontFamily: FontFamily.quicksandRegular,
    lineHeight: 13,
    letterSpacing: 0.6,
    fontSize: FontSize.size_xs,
    position: "relative",
    marginHorizontal: 25,
  },
  activeTab: {
    fontWeight: "bold", // You can customize the styling for active tab
    textDecorationLine: "underline",
    color: "#07374d",
  },
  navigator: {
    backgroundColor: Color.colorWhite,
    width: windowWidth,
    height: 40,
    overflow: "hidden",
    flexDirection: "row", // Arrange tabs horizontally
    alignItems: "center", // Align items vertically at the center
    justifyContent: "center", // Horizontally center the tabs
  },
});

