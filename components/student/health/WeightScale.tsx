"use client"

import { Typography } from "@/components/Typography"
import React from "react"
import { useEffect, useRef } from "react"
import { View, Text, Animated } from "react-native"

interface WeightScaleProps {
  weight: number
}

const WeightScale: React.FC<WeightScaleProps> = ({ weight = 0 }) => {
  const animatedWeight = useRef(new Animated.Value(0)).current
  const animatedProgress = useRef(new Animated.Value(0)).current
  const [displayWeight, setDisplayWeight] = React.useState(0)
  const MAX_WEIGHT = 150
  const TICK_INTERVAL = 10

  // Generate ticks for the scale
  const ticks = Array.from(
    { length: Math.floor(MAX_WEIGHT / TICK_INTERVAL) + 1 },
    (_, i) => i * TICK_INTERVAL
  )

  useEffect(() => {
    // Animate weight counter
    Animated.timing(animatedWeight, {
      toValue: weight,
      duration: 2000,
      useNativeDriver: false,
    }).start()

    // Animate progress bar
    Animated.timing(animatedProgress, {
      toValue: (weight / MAX_WEIGHT) * 100,
      duration: 2000,
      useNativeDriver: false,
    }).start()
  }, [weight])

  useEffect(() => {
    const id = animatedWeight.addListener(({ value }) => {
      setDisplayWeight(value)
    })
    return () => {
      animatedWeight.removeListener(id)
    }
  }, [animatedWeight])

  return (
    <View>
      <Animated.Text className="text-5xl font-bold text-[#2C3E50]">
        {displayWeight.toFixed(0)}
      </Animated.Text>
      {/* Removed erroneous Animated.Text using __getValue() */}
      <Typography className="text-lg text-[#7F8C8D]">kg</Typography> 
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
              <Typography className="text-xs text-[#7F8C8D] mt-0.5">{tick}</Typography> 
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

export default WeightScale
