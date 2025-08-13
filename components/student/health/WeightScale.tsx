"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { View, Text, Animated } from "react-native"

interface WeightScaleProps {
  weight: number
}

const WeightScale: React.FC<WeightScaleProps> = ({ weight = 0 }) => {
  const animatedWeight = useRef(new Animated.Value(0)).current
  const animatedProgress = useRef(new Animated.Value(0)).current
  const [displayWeight, setDisplayWeight] = useState(0)
  const MAX_WEIGHT = 150
  const TICK_INTERVAL = 10

  const safeWeight = typeof weight === "number" && !isNaN(weight) && weight > 0 ? weight : 58

  useEffect(() => {
    try {
      // Animate weight counter
      Animated.timing(animatedWeight, {
        toValue: safeWeight,
        duration: 2000,
        useNativeDriver: false,
      }).start()

      // Animate progress bar
      Animated.timing(animatedProgress, {
        toValue: (safeWeight / MAX_WEIGHT) * 100,
        duration: 2000,
        useNativeDriver: false,
      }).start()

      const listener = animatedWeight.addListener(({ value }) => {
        setDisplayWeight(Math.round(value))
      })

      return () => {
        animatedWeight.removeListener(listener)
      }
    } catch (error) {
      console.error("Animation error in WeightScale:", error)
      setDisplayWeight(safeWeight)
    }
  }, [safeWeight])

  const ticks = Array.from({ length: MAX_WEIGHT / TICK_INTERVAL + 1 }, (_, i) => i * TICK_INTERVAL)

  return (
    <View className="bg-white rounded-xl p-6 shadow-lg elevation-5 w-full">
      <Text className="text-xl font-semibold text-[#2C3E50] mb-2">Weight</Text>
      <Text className="text-[#7F8C8D] text-sm mb-4">Measured body weight (kg)</Text>

      <View className="items-center mb-6">
        <Text className="text-5xl font-bold text-[#2C3E50]">{displayWeight}</Text>
        <Text className="text-lg text-[#7F8C8D]">kg</Text>
      </View>

      <View className="relative w-full bg-[#EAECEE] rounded h-5 overflow-hidden mb-4">
        <Animated.View
          className="absolute top-0 left-0 h-full bg-emerald-600"
          style={{
            width: animatedProgress.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
          }}
        />

        {/* Ticks */}
        <View className="absolute inset-0 flex-row justify-between items-end px-1 pointer-events-none">
          {ticks.map((tick, index) => (
            <View key={index} className="items-center">
              <View className="w-0.5 h-4 bg-[#7F8C8D] opacity-50" />
              <Text className="text-xs text-[#7F8C8D] mt-0.5">{tick}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

export default WeightScale
