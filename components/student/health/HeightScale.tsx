
import type React from "react"
import { useEffect, useRef } from "react"
import { View, Text, Animated } from "react-native"

interface HeightScaleProps {
  height: number
}

const HeightScale: React.FC<HeightScaleProps> = ({ height = 0 }) => {
  const animatedHeight = useRef(new Animated.Value(0)).current
  const MAX_HEIGHT = 200 // cm, maximum scale for the ruler

  const safeHeight = typeof height === "number" && !isNaN(height) && height > 0 ? height : 165
  const fillPercentage = Math.min((safeHeight / MAX_HEIGHT) * 100, 100)

  useEffect(() => {
    try {
      Animated.timing(animatedHeight, {
        toValue: fillPercentage,
        duration: 1200,
        useNativeDriver: false,
      }).start()
    } catch (error) {
      console.error("Animation error in HeightScale:", error)
    }
  }, [safeHeight, fillPercentage])

  const heightInFeet = Math.floor(safeHeight / 30.48)
  const heightInInches = Number((safeHeight % 30.48) / 2.54).toFixed(1)

  return (
    <View className="flex-col items-center w-20">
      <View className="h-[300px] w-8 relative bg-white rounded-lg border border-[#DDE4EB] overflow-hidden shadow-inner">
        {/* Animated fill */}
        <Animated.View
          className="absolute bottom-0 left-0 w-full bg-emerald-600"
          style={{
            height: animatedHeight.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
          }}
        />

        {/* Height markers */}
        <View className="absolute inset-0 flex-col justify-between p-1">
          {[...Array(5)].map((_, i) => {
            const markerHeight = MAX_HEIGHT - i * (MAX_HEIGHT / 4)
            return (
              <View key={i} className="flex-row items-center">
                <View className="w-2 h-[1px] bg-[#7F8C8D]" />
                <Text className="text-xs text-[#7F8C8D] ml-1">{markerHeight}</Text>
              </View>
            )
          })}
        </View>
      </View>

      {/* Label for actual height */}
      <View className="mt-2 items-center">
        <Text className="text-sm font-semibold text-[#2C3E50]">{safeHeight} cm</Text>
        <Text className="text-xs text-[#7F8C8D]">
          {heightInFeet}' {heightInInches}"
        </Text>
      </View>
    </View>
  )
}

export default HeightScale
