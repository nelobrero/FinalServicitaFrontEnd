import { View, Text, StyleSheet, TouchableOpacity,} from 'react-native';
import React, { useState } from 'react';
import Animated, {BounceIn} from 'react-native-reanimated'

const Tabs = ({items}) => {
    const [index, setIndex] = useState(0);
  return (
    <View  style={styles.container}>
        <View style={styles.tabs}>
            {items.map((tab, i)=>{
                const active = index === i;
                return(
                 <TouchableOpacity key={i} onPress={()=> setIndex(i)} 
                 style={styles.tab}>
                    {active && <Animated.View entering={BounceIn} style={styles.dot}/>}
                    <Text style={ active ? styles.activeTabText : styles.tabText}>
                        {tab.title}
                    </Text>
                </TouchableOpacity>
                );
            }
            )}
        </View>
        {items[index].content()}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        display: "flex"
    },
    tabs: {
        flexDirection: 'row',
        justifyContent:'flex-end',
        paddingHorizontal: 50,
        paddingBottom: 5,
        marginRight: 10,
        alignContent: "space-between",
    },
    tab:{
        marginLeft: 10
    },
    tabText: {
        color: "gray",
    }, 

    activeTabText:{
        color: "blue"


    },
    dot:{
        position:"absolute",
        top: 5,
        left: -10,
        width: 6,
        height: 6,
        backgroundColor: 'blue',
        borderRadius: 10
    }

});
export default Tabs