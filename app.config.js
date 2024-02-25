export default {
  "expo": {
    "name": "FrontEnd",
    "slug": "FrontEnd",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#000000"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#000000"
      },
      "package": "com.xdhunter6.FrontEnd",
      "googleServicesFile": process.env.GOOGLE_SERVICES_JSON
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-font", "@react-native-google-signin/google-signin"
    ],
    "extra": {
      "eas": {
        "projectId": "0f79223f-75c2-46b0-bdb3-5a0306917010"
      }
    },
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "updates": {
      "url": "https://u.expo.dev/0f79223f-75c2-46b0-bdb3-5a0306917010"
    }
  }
}
