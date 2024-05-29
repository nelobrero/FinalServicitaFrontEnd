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
    <View style={{ flex: 1 }}>
    <Carousel
      ref={ref}
      width={width}
      height={width / 2}
      data={sliderImages}
      onProgressChange={progress}
      renderItem={({ index }) => (
        <View
          style={{
            flex: 1,
            borderWidth: 1,
            justifyContent: "center",
          }}
        > 
          <Image
            source={sliderImages[index]}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
      )}
    />

    <Pagination.Basic
      progress={progress}
      data={sliderImages}
      dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 50 }}
      containerStyle={{ gap: 5, marginTop: 10 }}
      onPress={onPressPagination}
    />
  </View>
  )
}

export default ImageSlider