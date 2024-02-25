import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import styles from "../styles";


function UserScreen(props){
    return(
    <View style = {styles.viewStyle}>
        <View>
            <Text style = {styles.textStyle}>This is the User Screen</Text>
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

export default UserScreen;