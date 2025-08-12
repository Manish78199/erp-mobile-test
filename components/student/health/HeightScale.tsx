"use client"

import { Typography } from "@/components/Typography"
import type React from "react"
import { useEffect, useRef } from "react"
import { View, Text, Animated } from "react-native"

interface HeightScaleProps {
  height: number
}

const HeightScale: React.FC<HeightScaleProps> = ({ height = 0 }) => {
  const animatedHeight = useRef(new Animated.Value(0)).current
  const MAX_HEIGHT = 200 // cm, maximum scale for the ruler
  const fillPercentage = Math.min((height / MAX_HEIGHT) * 100, 100)

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: fillPercentage,
      duration: 1200,
      useNativeDriver: false,
    }).start()
  }, [height, fillPercentage])

  const heightInFeet = Math.floor(height / 30.48)
  const heightInInches = Number((height % 30.48) / 2.54).toFixed(1)

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
                <Typography className="text-xs text-[#7F8C8D] ml-1">{markerHeight}</Typography> 
              </View>
            )
          })}
        </View>
      </View>

      {/* Label for actual height */}
      <View className="mt-2 items-center">
        <Typography className="text-sm font-semibold text-[#2C3E50]">{height} cm</Typography> 
        <Typography className="text-xs text-[#7F8C8D]">
          {heightInFeet}' {heightInInches}"
        </Typography> 
      </View>
    </View>
  )
}

export default HeightScale
