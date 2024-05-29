import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Image, TouchableOpacity,  TextInput, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';
import Button from './../../components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Border, FontSize, FontFamily, Color } from "./../../GlobalStyles";
import storage from '@react-native-firebase/storage';
import StarRating from 'react-native-star-rating-widget';
import * as ImagePicker from 'expo-image-picker';
import RealTimeInfoProvider from "../../components/RealTimeInfoProvider";
import axios from 'axios';
import MapPage from './../MapPage';
import { askForCameraPermission, askForLibraryPermission } from "./../../helper/helperFunction";
import { Video } from 'expo-av';
import { sendPushNotification } from '../NotificationScreen';
import { COLORS, FONTS } from "./../../constants/theme";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function SeekerBookingStatusScreen({ navigation, route }) {
    const { data, userData, serviceData } = route.params;

    // const [statusText, setStatusText] = useState(data.status);
    const [statusText, setStatusText] = useState("Completed");
    const [serviceName, setServiceName] = useState(data.serviceName);
    const [buttonsVisible, setButtonsVisible] = useState(true);
    const [buttonsVisible1, setButtonsVisible1] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [complaint, setComplaint] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [starCount, setStarCount] = useState(0);
    const [images, setImages] = useState(null);
    const [hasReported, setHasReported] = useState(null);
    const [hasReviewed, setHasReviewed] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [modalOptionssVisible, setModalOptionssVisible] = useState(false);
    console.log(starCount)
    const finalServiceData = {
      id: serviceData.id,
      minprice: serviceData.data.price.min,
      maxprice: serviceData.data.price.max,
      barangay: serviceData.data.address.barangay,
      city: serviceData.data.address.city,
      providerImage: serviceData.data.coverImage,
      category:  serviceData.data.serviceType,
      service: serviceData.data.serviceName,
      description: serviceData.data.description,
      ratingStar: serviceData.data.rating,
      availability: serviceData.data.availability,
      providerId: serviceData.data.providerId,
      bookings: serviceData.data.bookings,
    }

    useEffect(() => {
      if (statusText === "En Route") {
        const interval = setInterval(() => {
          firestore().collection('bookings').doc(data.bookingId).get().then((doc) => {
            if (doc.data().status === "In Progress") {
              clearInterval(interval);
              setModalVisible2(true);
              setStatusText("In Progress");
              setButtonsVisible(false);
            }
          });
        }, 3000);
      } else  if (statusText === "In Progress") {
        const interval = setInterval(() => {
          firestore().collection('bookings').doc(data.bookingId).get().then((doc) => {
            if (doc.data().status === "Completed") {
              clearInterval(interval);
              setStatusText("Completed");
              setButtonsVisible1(true);
            }
          });
        }, 3000);
      }
    }, [statusText]);

    const handleModalClose = () => {
        setModalVisible2(false);
    };
    const handleBackPress = () => {
        navigation.goBack();
  };
    const handleCancel = async () => {
      setIsLoading(true);
      await firestore().collection('bookings').doc(data.bookingId).update({ status: 'Canceled' });
      setStatusText("Canceled");
      setButtonsVisible(false);
      for (const token of data.providerExpoTokens) {
        sendPushNotification(token, 'Booking Canceled', `${data.seekerName} has canceled the booking.`, data.seekerId);
      }
      setIsLoading(false);
    };
    
    const handleReport = () => {
      setModalVisible(true);
    };
    
    const handleReportModalClose = () => {
      setComplaint('');
      setModalVisible(false);
    };

    const handleReviewModalClose = () => {
      setReviewText('');
      setStarCount(0);
      setImages(null);
      setModalVisible1(false);
  };

  const handleStarRating = (rating) => {
    // if half star round to nearest whole number
    if (rating % 1 !== 0) {
        rating = Math.round(rating);
    }
    setStarCount(rating);
};



    const handleSubmit = async () => {
      setIsLoading(true);
      const reportData = {
        reporterId: data.seekerId,
        reportedId: data.providerId,
        bookingId: data.bookingId,
        reason: complaint,
        status: 'PENDING'
      }
      await axios.post("http://192.168.1.7:5000/report/createReport", reportData);
      const providerRef = firestore().collection('providers').doc(data.providerId);
      const providerDoc = await providerRef.get();
      const reportsReceived = providerDoc.data().reportsReceived + 1;
      await providerRef.update({ reportsReceived });
      setIsLoading(false);
      alert('Report submitted successfully! The Servicita team will review your report.');
      setComplaint('');
      const notification = {
        userId: "66111acbea0491231d30d8a7",
        message: `User ${data.seekerId} has reported user ${data.providerId} for the booking ${data.bookingId}.`,
        title: "New Report to Review",
        otherUserId: data.seekerId,
      };
    
      await axios.post("http://192.168.1.7:5000/notifications/create", notification)
      setModalVisible(false);
      navigation.goBack();
  };
  const handleReview = () => {
    setModalVisible1(true);
  };
  const handleImagePicker = async () => {
    const Permission = await askForLibraryPermission();
    if (Permission) {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!result.canceled) {
        setImages(images ? [...images, result.assets[0].uri] : [result.assets[0].uri]);
    }
  }
};

const handleCameraPicker = async () => {
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
      setImages(images ? [...images, result.assets[0].uri] : [result.assets[0].uri]);
  }
}
};


  const removeImage = (index) => {
    const newImages = images.filter((image, i) => i !== index);
    if (newImages.length === 0) {
        setImages(null);
    } else {
      setImages(newImages);
    }
};

const messageProvider = () => {
  const messagesData = {
    users: [data.seekerId, data.providerId],
    usersOnline: { seeker: true, provider: true },
    usersFullName: { seeker: data.seekerName, provider: data.providerName},
    usersImage: { seeker: data.seekerImage, provider: data.providerImage},
    usersNumbers: { seeker: data.seekerMobile, provider: data.providerMobile},
    lastMessage: '',
    lastSeen: { seeker: false, provider: true },
    createdAt: new Date(),
    lastMessageTime: new Date(),
    messages: [ 
      {
        text: 'Hello! I would like to inquire about your service.',
        createdAt: new Date(),
        user: {
          _id: data.seekerId,
        },
        _id: `${data.seekerId}_${data.providerId}_${new Date().getTime()}_${data.seekerId}`,
      }
    ]
  }
  try {
    firestore().collection('chats').where('users', '==', [data.seekerId, data.providerId]).get().then((querySnapshot) => {
      if (querySnapshot.empty) {
        firestore().collection('chats').doc(`${data.seekerId}_${data.providerId}`).set(messagesData);
        for (const token of data.providerExpoTokens) {
          sendPushNotification(token, 'New Conversation', `${data.seekerName} has started a conversation with you.`, data.seekerId);
        }
        navigation.navigate('Chat', { userId: data.seekerId, userName: data.seekerName, chatId: `${data.seekerId}_${data.providerId}`, otherUserName: data.providerName, otherUserImage: data.providerImage, role: 'Seeker', otherUserMobile: data.providerMobile, admin: false, otherUserTokens: data.providerExpoTokens });
      } else {
        querySnapshot.forEach((doc) => {
          navigation.navigate('Chat', { userId: data.seekerId, userName: data.seekerName, chatId: doc.id, otherUserName: data.providerName, otherUserImage: data.providerImage, role: 'Seeker', otherUserMobile: data.providerMobile, admin: false, otherUserTokens: data.providerExpoTokens });
        });
      }
    }
    );
  }
  catch (error) {
    console.error('Error creating chat:', error);
  }
};

const handleSubmitReview = async () => {
  setIsLoading(true);
  const reviewData = {
    bookingId: data.bookingId,
    seekerImage: data.seekerImage,
    seekerName: data.seekerName,
    rating: starCount,
    comment: reviewText,
    serviceId: data.serviceId,
    seekerId: data.seekerId,
    providerId: data.providerId,
    images: []
  }

  const imageUploadPromises = images && images.length > 0 ? images.map(async (image) => {
      const response = await fetch(image);
      const blob = await response.blob();
      const storageRef = storage().ref();
      const imageRef = storageRef.child(`reviews/${data.bookingId}/${image.split('/').pop()}`);
      await imageRef.put(blob);
      const url = await imageRef.getDownloadURL();
      reviewData.images.push(url);
  }) : [];

  await Promise.all(imageUploadPromises);

  await axios.post("http://192.168.1.7:5000/rating/createRating", { bookingId: data.bookingId, rating: starCount, comment: reviewText, serviceId: data.serviceId, seekerId: data.seekerId, providerId: data.providerId, images: reviewData.images, seekerImage: data.seekerImage, seekerName: data.seekerName });

  const providerRef = firestore().collection('providers').doc(data.providerId);
  const providerDoc = await providerRef.get();
  const providerRatingCount = providerDoc.data().ratingCount + 1;
  const providerRating = ((providerDoc.data().rating * providerDoc.data().ratingCount) + starCount) / providerRatingCount;
  await providerRef.update({ rating: providerRating, ratingCount: providerRatingCount, ratingNumberCount:{
    one: providerDoc.data().ratingNumberCount.one + (starCount === 1 ? 1 : 0),
    two: providerDoc.data().ratingNumberCount.two + (starCount === 2 ? 1 : 0),
    three: providerDoc.data().ratingNumberCount.three + (starCount === 3 ? 1 : 0),
    four: providerDoc.data().ratingNumberCount.four + (starCount === 4 ? 1 : 0),
    five: providerDoc.data().ratingNumberCount.five + (starCount === 5 ? 1 : 0),
  } });
  const serviceRef = firestore().collection('services').doc(data.serviceId);
  const serviceDoc = await serviceRef.get();
  const serviceRatingCount = serviceDoc.data().ratingCount + 1;
  const serviceRating = ((serviceDoc.data().rating * serviceDoc.data().ratingCount) + starCount) / serviceRatingCount;
  await serviceRef.update({ rating: serviceRating, ratingCount: serviceRatingCount, ratingNumberCount:{
    one: serviceDoc.data().ratingNumberCount.one + (starCount === 1 ? 1 : 0),
    two: serviceDoc.data().ratingNumberCount.two + (starCount === 2 ? 1 : 0),
    three: serviceDoc.data().ratingNumberCount.three + (starCount === 3 ? 1 : 0),
    four: serviceDoc.data().ratingNumberCount.four + (starCount === 4 ? 1 : 0),
    five: serviceDoc.data().ratingNumberCount.five + (starCount === 5 ? 1 : 0),
  } });

  setIsLoading(false);
  alert('Review submitted successfully!');
  setReviewText('');
  setStarCount(0);
  setImages(null);
  setModalVisible1(false);
  navigation.goBack();
};

  useEffect(() => {
    const checkForReport = async () => {
      const response = await axios.post("http://192.168.1.7:5000/report/getReportByBookingId", { bookingId: data.bookingId, reporterId: data.seekerId });
      const response2 = await axios.post("http://192.168.1.7:5000/rating/getRatingByBookingId", { bookingId: data.bookingId });
      setHasReported(response.data);
      setHasReviewed(response2.data);
  }
  checkForReport();
}
, []);

if (hasReported == null || hasReviewed == null) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.secondaryGray}} >
        <Image source={require('../../assets/loading.gif')} style={{width: 200, height: 200}} />
    </View>
  );
}

if (isLoading) {
  return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#07374d" />
      </View>
  );
}

  return (
    <SafeAreaView style={{ flex: 1}}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[styles.bookingscreen2]}>
      
      <View style={styles.header}>
      <Pressable onPress={handleBackPress}>
        <AntDesign name="left" size={24} color="white" style={styles.icon} />
      </Pressable>
        <Text style={styles.title}>{statusText}</Text>
      </View>


    {statusText === "In Progress" && (
      
      <View style={styles.containerGif}>
          <Text style={styles.sched}>Schedule</Text>
          <Text style={styles.time}>{data.time}</Text>
          
          <Image
            source={require('./../../assets/1400px.gif')}
            style={styles.gif}
          />


          <Text style={styles.wonderful}>Have a wonderful</Text>
          <Text style={styles.servicitime}> Servicitime!</Text>
        </View>

    )}  
    


    

    {statusText !== "En Route" &&  statusText !== "In Progress" &&(
    <View  style={styles.centeredContainer1}>
      
      <View style={[styles.servicecontainer2, styles.servicecontainer2Layout]}>
        <Image
          style={[styles.serviceimage2Icon, styles.servicecontainer2Layout]}
          contentFit="cover"
          source={{uri: data.imageSource}}
        />
        <View style={[styles.serviceinfo2, styles.serviceinfo2Layout]}>
          <View >
            <Text style={[styles.servicename2]}>
              {serviceName}
            </Text>
          </View>
          
          <TouchableOpacity onPress={messageProvider}>
          <View style={[styles.message2, styles.message2Layout]}>
          
            <View style={[styles.message2Child, styles.message2Layout]} />
            <Text style={[styles.role2, styles.role2FlexBox]}>
              Message Provider
            </Text>
            <Image
              style={styles.lettericon2}
              contentFit="cover"
              source={require("./../../assets/letter.png")}
            />
          </View>
          </TouchableOpacity>
        </View>
      </View>


      <View style={[styles.bookingdets, styles.bookingdetsLayout]}>
        <View style={[styles.bookingdetsChild, styles.bookingdetsLayout]} />
        <Text
          style={[styles.bookingIdSeeker, styles.bookingPosition]}
        >{`Booking ID
Provider
Contact
Location
Date
Time`}</Text>
        <Text style={[styles.booking, styles.bookingPosition]}>{`${data.bookingId}
${data.providerName}
${data.providerMobile}
${data.location.address}
${data.date}
${data.time}
`}</Text>
      </View>


      <View style={[styles.transactionDets, styles.transactionLayout1]}>
        <View style={[styles.transactionDetsChild, styles.childShadowBox]} />
        <Text
          style={[styles.transactionIdBooking, styles.transactionLayout]}
        >{`Transaction ID
Created At
Expires At
Payment Method
Amount

`}</Text>
        <Text style={[styles.transaction, styles.bookingTypo]}>{`${data.paymentId}
${data.createdAt.toDate().toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
${data.expiresAt.toDate().toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
${data.paymentMethod === 'gcash' ? 'GCash' : data.paymentMethod === 'grab_pay' ? 'GrabPay' : 'Paymaya'}
₱${data.price}

`}</Text>
      </View>
      </View>

    )}
    <View style={styles.centeredContainer}>


      {(statusText === "Pending" || statusText === "Accepted" && buttonsVisible)   && (
          // <View style={{top: windowHeight * 0.37}} >
          <View style={{bottom:windowHeight > 732 ? windowHeight * -0.385 : windowHeight * -0.42  }} > 
          <Button 
              title="Cancel" 
              filled 
              Color={Color.colorWhite} 
              style={{ 
                height: 53,
                width: windowWidth * 0.890, 
                // top: 540,
                // bottom: windowHeight * 0.12, 
                position: "relative", 
              }} 
              onPress={handleCancel} 
            />
          </View>
        )}

      
        
        {statusText === "Completed"  && buttonsVisible1 && (
          <>
          <View style={{bottom:windowHeight > 732 ? windowHeight * -0.34 : windowHeight * -0.375  }} >
            <Button 
              title="Book Again" 
              filled 
              Color={Color.colorWhite} 
              style={{ 
                height: 53,
                width: windowWidth * 0.890, 
                opacity: serviceData.data.status !== 'Active' ? 0.5 : 1,
                // top: 540,
                position: "relative", 
              }} 
              onPress={() => navigation.navigate('Booking', { data: finalServiceData, userData: userData })}
              disabled={serviceData.data.status !== 'Active'}
            />
            <View style={{ marginBottom: 10 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button 
              title="Review" 
              disabled={hasReviewed}
              filled={false} 
              style={{ 
                height: 53,
                width: (windowWidth * 0.445) - 5, 
                position: "relative",
                opacity: hasReviewed ? 0.5 : 1,
              }} 
              onPress={handleReview}
            />
            <Button 
              title="Report"
              disabled={hasReported}
              filled={false}
              style={{ 
                height: 53,
                width: (windowWidth * 0.445) - 5,
                position: "relative",
                opacity: hasReported ? 0.5 : 1,
              }} 
              onPress={handleReport} 
            />
          </View>
          </View>
          </>
        )}

        {(statusText === "En Route" ) && (

          <>

          <View style={styles.container01}>
            <View style={styles.providerInfo}>
              <RealTimeInfoProvider providerName={data.providerName} providerImage={data.providerImage} location={data.location.address} data={data} />
            </View>
          </View>


          {/* <Button 
            title="i'm here" 
            filled={false}
            style={{ 
              height: 53,
              width: windowWidth * 0.890, 
               top: 300,
              position: "absolute", 
            }} 
            onPress={handleImHerePress}  
          /> */}
         
         <View style={styles.mapContainer}>
          <MapPage locationData={data.location} role="Seeker" bookingId={data.bookingId} />
          </View>
          

          <View style={{bottom:windowHeight > 732 ? windowHeight * -0.322 : windowHeight * -0.35 }} > 
          <Button 
            title="Report" 
            disabled={hasReported}
            filled={false}
            style={{ 
              height: 53,
              width: windowWidth * 0.890, 
              position: "relative",
              opacity: hasReported ? 0.5 : 1,
            }} 
            onPress={handleReport} 
          />
          </View>
          </>
        )}

        
        {( statusText === "Failed" || statusText === "Canceled" || statusText === "Expired" || statusText === "Rejected" || statusText === "In Progress" ) && (
          <View style={{bottom:windowHeight > 732 ? windowHeight * -0.385 : windowHeight * -0.42  }} > 
          <Button 
            title="Report" 
            disabled={hasReported}
            filled 
            Color={Color.colorWhite} 
            style={{ 
              height: 53,
              width: windowWidth * 0.890, 
              // top: 600,
              position: "relative", 
              backgroundColor: "#7C7878",
              borderColor: "#7C7878",
              opacity: hasReported ? 0.5 : 1,
            }} 
            onPress={handleReport} 

          />
          </View>
        )}
  </View>



  <Modal
  visible={modalVisible}
  animationType="slide"
  transparent={true}
>
 
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"always"}>
      
      <Text style={styles.modalHeader}>Report</Text>
      <TouchableOpacity onPress={handleReportModalClose} style={styles.closeIcon}>
        <AntDesign name="close" size={24} color="#07374d" />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Enter your complaint..."
        textAlignVertical="top"
        onChangeText={(text) => setComplaint(text)}
        value={complaint}
      />
      <Button title="Submit" onPress={handleSubmit} 
      filled 
      Color={Color.colorWhite} 
      style={{ 
        backgroundColor: "#07374d",
        borderColor: "#07374d",
      }} 
      disabled={complaint === ''}
      />
      </ScrollView>
    </View>
  </View>
  
</Modal>


<Modal
    visible={modalVisible1}
    animationType="slide"
    transparent={true}
>
<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
    <View style={styles.modalContent}>
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"always"}>
            
            <Text style={styles.modalHeader}>Share your Experience</Text>
            <TouchableOpacity onPress={handleReviewModalClose} style={styles.closeIcon}>
                <AntDesign name="close" size={24} color="#07374d" />
            </TouchableOpacity>
            {/* empty star should be gray */}
            <StarRating
                maxStars={5}
                rating={starCount}
                onChange={(rating) => handleStarRating(rating)}
                starSize={30}
                emptyColor={COLORS.gray}
                color='#07374d'
                starStyle={{ paddingBottom:15, paddingHorizontal: 5 }}  // Adjust the spacing between stars
                enableHalfStars={false}
            />
            <View>
                <TextInput
                    style={styles.input}
                    multiline
                    placeholder="Write your review..."
                    textAlignVertical="top"
                    onChangeText={(text) => setReviewText(text)}
                    value={reviewText}
                />
                <TouchableOpacity style={[styles.cameraIconContainer, {opacity : images && images.length === 3 ? 0.2 : 1}]} onPress={() => setModalOptionssVisible(true)} disabled={images && images.length === 3}>
                    <AntDesign name="camerao" size={24} color="gray" />
                </TouchableOpacity>
            </View>
            {/* Display the images */}

            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {images && images.map((image, index) => (
                <View key={index} style={{ position: 'relative' }}>
                
                  {image.includes('.mp4') ? <Video
                    source={{ uri: image }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={true}
                    shouldPlay
                    isLooping
                    style={styles.image}
                />
                : <Image source={{ uri: image }} style={styles.image} />}

                    <TouchableOpacity style={styles.closeIcon} onPress={() => removeImage(index)}>
                        <AntDesign name="closecircle" size={12} color="red" />
                    </TouchableOpacity>
                </View>
            ))}
        </View>
            <Button
                title="Submit"
                onPress={handleSubmitReview}
                filled
                Color={Color.colorWhite}
                style={styles.submitButton}
                disabled={reviewText === '' || starCount === 0}
            />
        </ScrollView>
        </View>
    </View>
</Modal>


{/* Circular Modal */}
<Modal
    visible={modalVisible2}
    animationType="fade"
    transparent={true}
    onRequestClose={handleModalClose}
>
    <View style={styles.centeredView}>
        <View style={styles.modalView}>
            <Text style={styles.modalText}>Service is Here!</Text>
            <Pressable onPress={handleModalClose} style={styles.closeButton}>
                <AntDesign name="close" size={24} color="black" />
            </Pressable>
        </View>
    </View>
</Modal>
<Modal animationType="slide" transparent={true} visible={modalOptionssVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <Pressable style={styles.closeButtons} onPress={() => setModalOptionssVisible(false)}>
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
              onPress={handleCameraPicker}
            >
              <Text>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 16,
              }}
              onPress={handleImagePicker}
            >
              <Text>Photo Library</Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </Modal>
    
    </View>

    </ScrollView>
     
    </SafeAreaView>
  );
};

  const styles = StyleSheet.create({
  header: {
    backgroundColor: "#07374d",
    height: Dimensions.get('window').height * 0.1, 
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  title: {
    fontSize:  23,
    lineHeight: 50,
    fontWeight: "700",
    fontFamily: "Lobster-Regular",
    color: Color.colorWhite,
    display: "flex",
    alignItems: "center",
    width: 326,
    textAlign: "left",
    position: "absolute",
    marginLeft: 45,
  },
  icon: {
    marginLeft: 10, 
  },
  acceptLayout: {
    height: 53,
    width: 371,
    left: 32,
    position: "absolute",
  },
  childLayout: {
    borderRadius: Border.br_3xs,
    left: 0,
    top: 0,
    height: 53,
    width: 371,
    position: "absolute",
  },
  accept1Typo: {
    alignItems: "center",
    display: "flex",
    color: Color.colorWhite,
    fontFamily: FontFamily.quicksandBold,
    fontWeight: "700",
    lineHeight: 50,
    position: "absolute",
  },
  transactionLayout1: {
    height: 188,
    //width: 350,
    width: windowWidth * 0.890, 
    position: "absolute",
  },
  childShadowBox: {
    borderWidth: 0.2,
    borderColor: Color.colorBlack,
    borderStyle: "solid",
    shadowOpacity: 1,
    elevation: 7,
    shadowRadius: 7,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowColor: "rgba(0, 0, 0, 0.25)",
    left: 0,
    top: 0,
    backgroundColor: Color.colorWhite,
  },
  transactionLayout: {
    height: 156,
    color: Color.colorBlack,
    lineHeight: 30,
    letterSpacing: 0.6,
    fontSize: FontSize.size_xs,
    position: "absolute",
  },
  bookingTypo: {
    textAlign: "right",
    fontFamily: FontFamily.quicksandMedium,
    fontWeight: "500",
  },
  bookingdetsLayout: {
    height: 164,
    width: windowWidth * 0.890, 
    position: "absolute",
  },
  bookingPosition: {
    lineHeight: 27,
    top: 13,
    color: Color.colorBlack,
    letterSpacing: 0.6,
    fontSize: FontSize.size_xs,
    position: "absolute",
  },
  messageLayout: {
    height: 21,
    width: 139,
    position: "relative",
  },
  servicenamePosition: {
    top: 106,
    position: "absolute",
  },
  headerPosition: {
    height: 76,
    width: 430,
    left: 0,
    top: 0,
    position: "absolute",
  },
  acceptChild: {
    backgroundColor: Color.colorDarkslategray_500,
  },
  accept1: {
    top: 1,
    left: 88,
    textAlign: "center",
    justifyContent: "center",
    width: 196,
    height: 51,
    fontSize: FontSize.size_xl,
    alignItems: "center",
    display: "flex",
    color: Color.colorWhite,
    fontFamily: FontFamily.quicksandBold,
    fontWeight: "700",
    lineHeight: 50,
  },
  accept: {
    top: 781,
  },
  cancelChild: {
    backgroundColor: Color.colorGray,
  },
  cancel: {
    top: 844,
  },
  transactionDetsChild: {
    height: 188,
    width: windowWidth * 0.890, 
    position: "absolute",
  },
  transactionIdBooking: {
    top: 17,
    width: 108,
    textAlign: "left",
    // left: 21,
    left: windowWidth * 0.051,
    fontFamily: FontFamily.quicksandBold,
    fontWeight: "700",
  },
  transaction: {
    top: 19,
    // left: 219,
    right: windowWidth * 0.051,
    width: windowWidth * 0.890,
    height: 156,
    color: Color.colorBlack,
    lineHeight: 30,
    letterSpacing: 0.6,
    fontSize: 11,
    position: "absolute",
  },
  transactionDets: {
    top: 340,
    // left: 40,
    //  justifyContent: 'center', 
    // alignItems: 'center'
  },
  bookingdetsChild: {
    borderWidth: 0.2,
    borderColor: Color.colorBlack,
    borderStyle: "solid",
    shadowOpacity: 1,
    elevation: 7,
    shadowRadius: 7,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowColor: "rgba(0, 0, 0, 0.25)",
    left: 0,
    top: 0,
    backgroundColor: Color.colorWhite,
  },
  bookingIdSeeker: {
    width: 77,
    height: 136,
    textAlign: "left",
    left: windowWidth * 0.051,
    // left: 21,
    fontFamily: FontFamily.quicksandBold,
    fontWeight: "700",
  },
  booking: {
    // left: 158,
    right: windowWidth * 0.051,
    width: 172,
    height: 142,
    textAlign: "right",
    fontFamily: FontFamily.quicksandMedium,
    fontWeight: "500",
  },
  bookingdets: {
    top: 160,
    // left: 40,
  },
  messageChild: {
    borderRadius: 4,
    backgroundColor: "#dbdbdb",
    left: 0,
    top: 0,
    height: 21,
    width: 139,
  },
  messageSeeker: {
    top: 3,
    left: 28,
    fontWeight: "600",
    fontFamily: FontFamily.quicksandSemiBold,
    color: Color.colorDarkslategray_500,
    textAlign: "left",
    lineHeight: 15,
    letterSpacing: 0.6,
    fontSize: FontSize.size_xs,
    position: "absolute",
  },
  letterIcon: {
    top: 4,
    left: 9,
    width: 17,
    height: 13,
    position: "absolute",
  },
  message: {
    top: 176,
    left: 130,
  },
  servicename: {
    left: 130,
    letterSpacing: 1,
    lineHeight: 20,
    fontFamily: FontFamily.quicksandRegular,
    width: 227,
    height: 56,
    textAlign: "left",
    color: Color.colorBlack,
    top: 106,
    alignItems: "center",
    display: "flex",
    fontSize: FontSize.size_xl,
  },
  serviceimageIcon: {
    width: 118,
    height: 118,
    left: 0,
  },
  headerChild: {
    backgroundColor: Color.colorDarkslategray_500,
  },
  chevronLeftIcon: {
    top: 14,
    left: 15,
    width: 35,
    height: 48,
    position: "absolute",
  },
  forApproval: {
    top: 12,
    left: 52,
    fontSize: FontSize.size_21xl,
    width: 326,
    textAlign: "left",
  },
  providerbookingdetails: {
    flex: 1,
    width: "100%",
    height: 932,
    overflow: "hidden",
    backgroundColor: Color.colorWhite,
  },
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    position:"relative",
    justifyContent: 'center',
},
centeredContainer1: {
  
  alignItems: 'center',
  position:"relative",
  justifyContent: 'center',
},
servicecontainerLayout: {
height: 118,
position: "absolute",

},
servicecontainer: {
    top: -80,
    width: windowWidth * 0.890, 
    
    
},
modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalContent: {
  backgroundColor: 'white',
  borderRadius: 10,
  padding: 20,
  width: '80%',
  maxHeight: '95%',
},
modalHeader: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 10,
},
input: {
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 5,
  padding: 10,
  height:200,
  maxHeight: 200,
  // minHeight: 200,
},
closeIcon: {
  position: 'absolute',
  top: 5,
  right: 5,

},
bookingscreen2: {
  flex: 1,
  width: "100%",
  height:  760,
  height: windowHeight > 732 ? windowHeight : 770,
  overflow: "hidden",
  // backgroundColor: Color.colorWhite,
  
  
},

container01: {
  // flex: 1,
  // justifyContent: "center",
  alignItems: "center",
  // backgroundColor: "#ffffff",
},
providerInfo: {
  position: "relative",
  top: windowHeight* -0.335,
//  alignItems: "center", 
},




container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalContent: {
  backgroundColor: 'white',
  borderRadius: 10,
  padding: 20,
  width: '80%',
  maxHeight: '80%',
},
modalHeader: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 10,
  textAlign: 'left',
},
input: {
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 5,
  padding: 10,
  marginBottom: 20,
  height: 200,
  maxHeight: 200,
},
cameraIconContainer: {
  position: 'absolute',
  bottom: 30,
  right: 15,
},
image: {
  width: 90,
  height: 90,
  resizeMode: 'cover',
  marginBottom: 10,
  borderRadius: 10, // Add border radius for rounded corners
  borderWidth: 1, // Add border width for a border around the image
  borderColor: '#ddd', // Set border color
},
submitButton: {
  marginTop: 30,
},
centeredView: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalView: {
  backgroundColor: "#07374d",
  borderColor:"#9F9C9C", 
  borderWidth: 17,
  borderRadius: windowWidth * 0.5,
  width: windowWidth * 0.75,
  height: windowWidth * 0.75,
  alignItems: "center",
  justifyContent: "center",
  shadowColor: "#000",
  shadowOffset: {
      width: 0,
      height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 20,
  
},
modalText: {
  textAlign: "center",
  fontSize: 50,
  fontWeight: "700",
  color: 'white',
  fontFamily: FontFamily.quicksandBold,
},
closeButton: {
  position: 'absolute',
  top: 10,
  right: 10,
},


//////////////
servicecontainer2Layout: {
  height: 118,
  position: "absolute",
},
serviceinfo2Layout: {
  width: 246,
  top: 0,
},
role2FlexBox: {
  textAlign: "left",
  position: "absolute",
},
message2Layout: {
  height: 21,
  width: 139,
  left: 0,
  // position: "absolute",
},
serviceimage2Icon: {
  width: 118,
  left: 0,
  top: 0,
},
servicename2: {
  fontSize: FontSize.size_xl,
  letterSpacing: 1,
  lineHeight: 20,
  fontFamily: FontFamily.quicksandRegular,
  color: Color.colorBlack,
  display: "flex",
  alignItems: "center",
  width: windowWidth * 0.6,
  textAlign: "left",
  
  
  paddingBottom: 1,
  
},
message2Child: {
  borderRadius: Border.br_9xs,
  backgroundColor: Color.colorGainsboro_100,
  top: 0,
},
role2: {
  top: 3,
  left: 24,
  fontSize: FontSize.size_xs,
  letterSpacing: 0.6,
  lineHeight: 15,
  fontWeight: "600",
  fontFamily: FontFamily.quicksandSemiBold,
  color: Color.colorDarkslategray_500,
},
lettericon2: {
  top: 4,
  left: 4,
  width: 17,
  height: 13,
  position: "absolute",
},
message2: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 5,
},
serviceinfo2: {
  left: 126,
  height: 85,
  position: "absolute",
},
servicecontainer2: {
  top: 20,
  width: windowWidth * 0.890, 
    
},
serviceinfo: {
  backgroundColor: Color.colorWhite,
  flex: 1,
  width: "100%",
  height: 932,
  overflow: "hidden",
},
mapContainer: {
  flex: 1,
  width: "90%",
  height: windowHeight * 0.54,
  backgroundColor: Color.colorWhite,
  borderRadius: Border.br_mini,
  position: "absolute",
  bottom: windowHeight * 0.195,
},
containerGif: {
  flex: 1,
  // justifyContent: 'center',
  paddingTop: 50,
  alignItems: 'center',
  top: windowHeight * 0.08,
},
sched: {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 10,
  position: "absolute",
  top: windowHeight * 0.02,  
},
time: {
  fontSize: 18,
  marginBottom: 20,
  position: "absolute",
  top: windowHeight * 0.07,  
},
gif: {
  width: windowWidth * 0.95,
  height: windowWidth * 0.95,
  marginBottom: 20,
},
wonderful: {
  
  fontSize: 25,
  // fontStyle: 'italic',
  position: "absolute",
  top: windowHeight * 0.52,
},
servicitime: {
  fontSize: 30,
  fontWeight: '900',
  fontStyle: 'italic',
  position: "absolute", 
  top: windowHeight * 0.565, 
},
closeButtons: {
  position: 'absolute',
  top: windowHeight * 0.02,
  right: 20,
},
});
  



export default SeekerBookingStatusScreen;