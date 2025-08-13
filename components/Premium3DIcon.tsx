import type React from "react"
import { ColorValue, View, type ViewStyle } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { LinearGradient } from "expo-linear-gradient"

interface Premium3DIconProps {
  name: string
  size?: number
  colors?: string[]
  shadowColor?: string
  containerStyle?: ViewStyle
}

const Premium3DIcon: React.FC<Premium3DIconProps> = ({
  name,
  size = 24,
  colors = ["#667eea", "#764ba2"],
  shadowColor = "#000",
  containerStyle,
}) => {
  const iconSize = size * 0.6
  const containerSize = size

  return (
    <View
      style={[
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
          shadowColor: shadowColor,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 12,
        },
        containerStyle,
      ]}
    >
      <LinearGradient
        colors={colors as readonly ColorValue[]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.2)",
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 2,
            left: 2,
            right: 2,
            height: containerSize * 0.3,
            borderRadius: containerSize / 2,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          }}
        />
        <Icon name={name} size={iconSize} color="white" />
      </LinearGradient>
    </View>
  )
}

export default Premium3DIcon
