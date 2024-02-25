import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import styles from "../styles";

function ProfileScreen(props){
    return(
    <View style = {styles.viewStyle}>
        <View>
            <Text style = {styles.textStyle}>Hello, {props.route.params.name}!</Text>
        </View>
        <View>
            <Button
                style = {[styles.buttonStyle, {backgroundColor: 'green'}]}
                textColor = "white"
                onPress = {() => console.log("Hey")}>
                    Test this
            </Button>
        </View>
   </View>
   );
}

export default ProfileScreen;