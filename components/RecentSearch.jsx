import * as React from "react";
import { StyleSheet, View, Image, FlatList, Pressable } from "react-native";
import { useNavigation } from '@react-navigation/native';

const RecentSearch = () => {
  const navigation = useNavigation();

  const [data, setData] = React.useState([
    { id: 1, image: require("../assets/rectangle-371.jpg") },
    { id: 2, image: require("../assets/rectangle-372.jpg") }, 
    { id: 3, image: require("../assets/rectangle-373.png") }, 
    { id: 4, image: require("../assets/rectangle-374.jpg") }, 
    
    // Add more images as needed
  ]);

  const handleDelete = (id) => {
    setData(prevData => prevData.filter(item => item.id !== id));
  };

  
  const handleImagePress = () => {
    navigation.navigate("ServiceViewScreen"); 
  };

  const renderItem = ({ item }) => (
    <View style={styles.rectangleParent}>
      <Pressable onPress={handleImagePress}>
        <Image
          style={styles.frameChild}
          contentFit="cover"
          source={item.image}
        />
      </Pressable>
      <Pressable
        style={[styles.ellipseParent, styles.frameItemLayout]}
        onPress={() => handleDelete(item.id)}
      >
        <Image
          style={styles.frameItem}
          contentFit="cover"
          source={require("../assets/ellipse-80.png")}
        />
        <Image
          style={styles.closeIcon}
          contentFit="cover"
          source={require("../assets/close.png")}
        />
      </Pressable>
    </View>
  );

  return (
    <View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
      />
    </View>
  );
};

const styles = StyleSheet.create({
  frameItemLayout: {
    height: 16,
    width: 16,
    top: 0,
    position: "absolute",
  },
  frameChild: {
    top: 6,
    width: 64,
    height: 64,
    left: 0,
    position: "absolute",
  },
  frameItem: {
    left: 0,
  },
  closeIcon: {
    top: 4,
    left: 4,
    width: 8,
    height: 8,
    position: "absolute",
  },
  ellipseParent: {
    left: 55,
  },
  rectangleParent: {
    width: 71,
    height: 70,
    marginLeft: 20,
  },
});

export default RecentSearch;