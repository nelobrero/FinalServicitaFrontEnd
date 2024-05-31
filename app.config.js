export default {
  "expo": {
    "scheme": "servicita",
    "name": "Servicita",
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
        "foregroundImage": "./assets/Groups774.png",
        "backgroundColor": "#000000"
      },
      "package": "com.xdhunter6.FrontEnd",
      "googleServicesFile": "./google-services.json",
      "config": {
        "googleMaps": {
          "apiKey": "AIzaSyCG2UV8weM9nFuWYQNkEbG9f8wwITMiCRk"
        }
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-font", "@react-native-google-signin/google-signin", "@react-native-firebase/app", "@react-native-firebase/auth", "@react-native-firebase/crashlytics", [
        "react-native-fbsdk-next",
        {
          "appID": "790139039804431",
          "clientToken": "7f6f80acf921318f2555a64924e52ea1",
          "displayName": "Servicita",
          "scheme": "fb790139039804431",
          "advertiserIDCollectionEnabled": false,
          "autoLogAppEventsEnabled": false,
          "isAutoInitEnabled": true,
        }
      ], "expo-tracking-transparency", [
        "expo-image-picker",
        {
          "cameraPermission": "The app needs access to your camera to take photos.",
          "photosPermission": "The app accesses your photos to let you share them with your friends.",
          "microphonePermission": "The app needs access to your microphone to take videos."
        }
      ], [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
          "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone",
          "recordAudioAndroid": true
        }
      ], [
        "expo-location",
      {
        "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location."
      }
    ], [
      "expo-av",
      {
        "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone."
      }
    ]
    ],
    "extra": {
      "eas": {
        "projectId": "0f79223f-75c2-46b0-bdb3-5a0306917010"
      }
    },
    "runtimeVersion": "1.0.0",
    "updates": {
      "url": "https://u.expo.dev/0f79223f-75c2-46b0-bdb3-5a0306917010"
    }
  }
}
