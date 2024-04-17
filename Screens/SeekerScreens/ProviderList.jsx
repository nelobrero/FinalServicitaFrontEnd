import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { COLORS } from '../../constants/theme'


export default ProviderList = ({navigation, route}) => {

  const { serviceType } = route.params;

  return (
    <View>
      <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
                paddingHorizontal: 20,
                position: 'absolute',
                zIndex: 1
            }}
        >
            <MaterialIcons name="arrow-back-ios" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      <Text>{serviceType} YOU DIRTY BITCH!</Text>
    </View>
  )
}