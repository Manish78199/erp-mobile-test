
import React from "react"
import { StyleProp, Text, TextProps, TextStyle } from "react-native"


type TypographyProps = TextProps & {
  className?: string
  style?: StyleProp<TextStyle>,

}

export const Typography = ({ className, style, ...props }: TypographyProps) => {
  return (
    <Text
      {...props}
      style={style}
      className={`text-base font-poppins ${className ?? ''}`} >
        {props.children}
        </Text>



  )
}

