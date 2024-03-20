
import * as React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Border, FontSize, FontFamily, Color } from "../GlobalStyles";


function BookingScreen(props) {

  return (
    <View style={styles.bookingscreen}>
      <View style={styles.frameChildPosition}>
        <LinearGradient
          style={[styles.frameChild, styles.frameChildPosition]}
          locations={[0, 1]}
          colors={["#78bddd", "#002f45"]}
        />
        <Text style={[styles.booking, styles.searchFlexBox]}>Booking</Text>
      </View>
      <Image
        style={styles.bookingscreenChild}
        contentFit="cover"
        source={require("../assets/rectangle-151.png")}
      />
      <Text style={[styles.search, styles.searchFlexBox]}>Search</Text>
      <Image
        style={styles.searchIcon}
        contentFit="cover"
        source={require("../assets/search1.png")}
      />
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
  searchFlexBox: {
    textAlign: "left",
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
  booking: {
    top: 37,
    left: 25,
    fontSize: FontSize.size_21xl,
    lineHeight: 50,
    fontWeight: "700",
    fontFamily: FontFamily.quicksandBold,
    color: Color.colorWhite,
    width: 381,
    height: 84,
  },
  bookingscreenChild: {
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
    fontSize: FontSize.size_xs,
    letterSpacing: 0.6,
    lineHeight: 20,
    fontFamily: FontFamily.quicksandRegular,
    color: "#9b9797",
    width: 298,
    height: 24,
  },
  searchIcon: {
    top: 111,
    left: 29,
    width: 20,
    height: 19,
    position: "absolute",
  },
  bookingscreen: {
    backgroundColor: Color.colorWhite,
    flex: 1,
    width: "100%",
    height: 932,
    overflow: "hidden",
  },
});

export default BookingScreen;