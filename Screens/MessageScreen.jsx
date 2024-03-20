import * as React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Color, FontFamily, FontSize, Border } from "../GlobalStyles";


function MessageScreen(props) {
  return (
    <View style={styles.messagescreen}>
      <View style={styles.frameChildPosition}>
        <LinearGradient
          style={[styles.frameChild, styles.frameChildPosition]}
          locations={[0, 1]}
          colors={["#78bddd", "#002f45"]}
        />
        <Text style={styles.message}>Message</Text>
      </View>
      <Image
        style={styles.messagescreenChild}
        contentFit="cover"
        source={require("../assets/rectangle-151.png")}
      />
      <Text style={styles.search}>Search</Text>
      <Image
        style={[styles.searchIcon, styles.searchIconLayout]}
        contentFit="cover"
        source={require("../assets/search1.png")}
      />
      <View style={styles.rectangleGroup}>
        <Image
          style={styles.frameItem}
          contentFit="cover"
          source={require("../assets/rectangle-316.png")}
        />
        <Text style={styles.euniceEnreraMakeup}>
          Eunice Enrera Makeup . . .
        </Text>
        <Text style={[styles.goodMorningSir, styles.text1Typo]}>
          Good morning sir padung nami
        </Text>
        <Image
          style={[styles.frameInner, styles.searchIconLayout]}
          contentFit="cover"
          source={require("../assets/ellipse-109.png")}
        />
        <Image
          style={[styles.ellipseIcon, styles.text1Position]}
          contentFit="cover"
          source={require("../assets/ellipse-110.png")}
        />
        <Text style={styles.text}>1</Text>
        <View style={[styles.wrapper, styles.text1Layout]}>
          <Text style={[styles.text1, styles.text1Layout]}>12:00</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  frameChildPosition: {
    height: 170,
    width: 430,
    left: 0,
    top: 0,
    position: "absolute",
  },
  searchIconLayout: {
    height: 19,
    position: "absolute",
  },
  text1Typo: {
    color: Color.colorBlack,
    fontFamily: FontFamily.quicksandRegular,
    lineHeight: 20,
    letterSpacing: 0.6,
    fontSize: FontSize.size_xs,
  },
  text1Position: {
    left: 0,
    top: 0,
  },
  text1Layout: {
    width: 30,
    height: 25,
    position: "absolute",
  },
  frameChild: {
    borderBottomRightRadius: Border.br_mini,
    borderBottomLeftRadius: Border.br_mini,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 3,
      height: 4,
    },
    shadowRadius: 6,
    elevation: 6,
    shadowOpacity: 1,
    backgroundColor: "transparent",
  },
  message: {
    top: 37,
    left: 25,
    fontSize: FontSize.size_21xl,
    lineHeight: 50,
    fontWeight: "700",
    fontFamily: FontFamily.quicksandBold,
    width: 381,
    height: 84,
    textAlign: "left",
    color: Color.colorWhite,
    position: "absolute",
  },
  messagescreenChild: {
    top: 98,
    left: 22,
    borderRadius: Border.br_5xs,
    width: 387,
    height: 46,
    position: "absolute",
  },
  search: {
    top: 109,
    left: 52,
    color: "#9b9797",
    height: 24,
    width: 298,
    fontFamily: FontFamily.quicksandRegular,
    lineHeight: 20,
    letterSpacing: 0.6,
    fontSize: FontSize.size_xs,
    textAlign: "left",
    position: "absolute",
  },
  searchIcon: {
    top: 111,
    left: 29,
    width: 20,
  },
  frameItem: {
    top: 3,
    left: 14,
    borderRadius: 36,
    width: 72,
    height: 72,
    position: "absolute",
  },
  euniceEnreraMakeup: {
    top: 18,
    height: 25,
    color: Color.colorBlack,
    fontFamily: FontFamily.quicksandSemiBold,
    fontWeight: "600",
    letterSpacing: 1,
    fontSize: FontSize.size_xl,
    left: 96,
    width: 298,
    lineHeight: 20,
    textAlign: "left",
    position: "absolute",
  },
  goodMorningSir: {
    top: 39,
    left: 96,
    color: Color.colorBlack,
    height: 24,
    width: 298,
    textAlign: "left",
    position: "absolute",
  },
  frameInner: {
    top: 53,
    left: 67,
    width: 19,
  },
  ellipseIcon: {
    width: 33,
    height: 33,
    position: "absolute",
  },
  text: {
    top: 5,
    left: 13,
    width: 7,
    height: 32,
    fontFamily: FontFamily.quicksandSemiBold,
    fontWeight: "600",
    letterSpacing: 1,
    fontSize: FontSize.size_xl,
    lineHeight: 20,
    textAlign: "left",
    color: Color.colorWhite,
    position: "absolute",
  },
  text1: {
    textAlign: "right",
    color: Color.colorBlack,
    fontFamily: FontFamily.quicksandRegular,
    lineHeight: 20,
    letterSpacing: 0.6,
    fontSize: FontSize.size_xs,
    left: 0,
    top: 0,
  },
  wrapper: {
    top: 38,
    left: 366,
  },
  rectangleGroup: {
    top: 213,
    left: 11,
    width: 394,
    height: 75,
    position: "absolute",
  },
  messagescreen: {
    backgroundColor: Color.colorWhite,
    flex: 1,
    width: "100%",
    height: 932,
    overflow: "hidden",
  },
});

export default MessageScreen;

