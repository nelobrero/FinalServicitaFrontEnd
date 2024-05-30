import { View, Text, Dimensions, Image } from 'react-native'
import * as React from "react";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import { sliderImages } from '../constants/index1';

const width = Dimensions.get("window").width;

const ImageSlider = () => {

  const ref = React.useRef(null);;
  const progress = useSharedValue(0);

  const onPressPagination = (index) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View style={{ flex: 1  }}>
    <Carousel
      ref={ref}
      width={width/ 1}
      height={width / 1.6}
      data={sliderImages}
      onProgressChange={progress}
      renderItem={({ index }) => (
        <View
          style={{
            flex: 1,
            // borderWidth: 1,
            borderRadius: 20,
            justifyContent: "center",
            margin: 14
          }}
        > 
          <Image
            source={sliderImages[index]}
            style={{ width: "100%", height: "100%", borderRadius:10}}
          />
        </View>
      )}
    />

    <Pagination.Basic
      progress={progress}
      data={sliderImages}
      dotStyle={{ backgroundColor: "rgba(0,0,0,0.1)", borderRadius: 30, height: 5, width: 5 }}
      containerStyle={{ gap: 3, height: 1, marginBottom: 3}}
      onPress={onPressPagination}
    />
  </View>
  )
}

export default ImageSlider