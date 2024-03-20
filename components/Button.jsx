import { Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
import { Color } from './../GlobalStyles'

const Button = (props) => {
    const filledBgColor = props.color || Color.colorPrimary;
    const outlinedColor = Color.colorWhite;
    const bgColor = props.filled ? filledBgColor : outlinedColor;
    const textColor = props.filled ? Color.colorWhite : Color.colorPrimary;

  return (
    <TouchableOpacity
        style={{
            ...styles.button,
            backgroundColor: props.disabled ? Color.colorPrimary : bgColor,
            ...props.style,
            ...(props.disabled && styles.disabledButton),
        }}
        onPress={props.onPress}
        disabled={props.disabled}
    >
        <Text style={{ fontSize: 18, color: props.disabled ? 'rgba(255, 255, 255, 0.5)' : textColor }}>
            {props.title}
        </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    button:{
        paddingBottom: 16,
        paddingVertical: 10,
        borderColor: Color.colorPrimary,
        borderWidth: 2,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    disabledButton: {
        opacity: 0.5
    }
})
export default Button