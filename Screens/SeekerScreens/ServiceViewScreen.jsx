
import { View, StyleSheet, ScrollView,TouchableOpacity, Dimensions, Text, Image } from 'react-native';
import { Color, FontSize, FontFamily } from "./../../GlobalStyles";
import ServiceTop from './../../components/ServiceTop';
import Description from './../../components/Description';
import Post from './../../components/Post';
import Review from './../../components/Review';
import Photos1 from './../../components/Photos1';
import React, { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import axios from 'axios';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default ServiceViewScreen = ({navigation, route}) => {

  const { data, userData } = route.params;
  const [ loading, setLoading ] = useState(true);

  const [ messagesData , setmessagesData ] = useState(null);

  async function getMessageNeededData () {
    const resultSeeker = await axios.post("http://192.168.254.111:5001/user/getUserDetailsById", { id: userData._id });
    const seekerSnapshot = await firestore().collection('seekers').doc(userData._id).get();
    const seekerData = { id: seekerSnapshot.id, ...seekerSnapshot.data(), image: resultSeeker.data.data.profileImage, mobile: resultSeeker.data.data.mobile };
    const resultProvider = await axios.post("http://192.168.254.111:5001/user/getUserDetailsById", { id: data.providerId });
    const providerSnapshot = await firestore().collection('providers').doc(data.providerId).get();
    const providerData = { id: providerSnapshot.id, ...providerSnapshot.data(), image: resultProvider.data.data.profileImage, mobile: resultProvider.data.data.mobile };
    setmessagesData({seekerData, providerData});
    setLoading(false);
  }
  
  useEffect(() => {
    getMessageNeededData();
  }, []);

  const [activeTab, setActiveTab] = useState("Post"); // State to track active tab

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
  };

  
  if (!messagesData) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.secondaryGray}} >
          <Image source={require('../../assets/loading.gif')} style={{width: 200, height: 200}} />
      </View>
    );
  }

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
          <ServiceTop data={data} navigation={navigation} userData={userData} messagesData={messagesData} />
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
      {activeTab === "Photos" && <Photos1 serviceId = {data.id} />}
      </View>

      <View>
        {activeTab === "Reviews" && <Review serviceId = {data.id} />}
      </View>  
      <View>
        {activeTab === "Post" && <Post serviceName = {data.service} coverImage = {data.providerImage} serviceId = {data.id} />}
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

