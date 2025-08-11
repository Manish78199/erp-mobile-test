"use client"

import { useEffect, useRef } from "react"
import { View, Text, Animated, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

export default function LoadingAnimation() {
  const scaleAnim = useRef(new Animated.Value(0.8)).current
  const rotateAnim = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0.5)).current

  useEffect(() => {
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    )

    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    )

    const fadeAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    )

    scaleAnimation.start()
    rotateAnimation.start()
    fadeAnimation.start()

    return () => {
      scaleAnimation.stop()
      rotateAnimation.stop()
      fadeAnimation.stop()
    }
  }, [])

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  return (
    <View className="flex-1 bg-blue-500 justify-center items-center">
      {/* Background decorative elements */}
      <View className="absolute top-20 left-8">
        <Animated.View style={{ opacity: fadeAnim }} className="w-12 h-12 bg-yellow-400 rounded-full" />
      </View>
      <View className="absolute top-16 right-12">
        <Animated.View style={{ opacity: fadeAnim }} className="w-2 h-2 bg-white rounded-full" />
      </View>
      <View className="absolute bottom-32 left-16">
        <Animated.View style={{ opacity: fadeAnim }} className="w-6 h-3 bg-white rounded-full" />
      </View>

      {/* Main loading animation */}
      <View className="items-center">
        {/* VT Logo with animation */}
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }, { rotate: spin }],
          }}
          className="w-24 h-24 bg-white rounded-full items-center justify-center mb-6 shadow-lg"
        >
          <Text className="text-blue-500 text-3xl font-bold">VT</Text>
        </Animated.View>

        {/* School-related icons */}
        <View className="flex-row items-center mb-4">
          <Animated.View style={{ opacity: fadeAnim }}>
            <Ionicons name="school" size={24} color="white" />
          </Animated.View>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }}
            className="mx-4"
          >
            <Ionicons name="book" size={20} color="white" />
          </Animated.View>
          <Animated.View style={{ opacity: fadeAnim }}>
            <Ionicons name="people" size={24} color="white" />
          </Animated.View>
        </View>

        {/* Loading text */}
        <Animated.Text style={{ opacity: fadeAnim }} className="text-white text-lg font-semibold mb-2">
          VEDATRON
        </Animated.Text>
        <Animated.Text style={{ opacity: fadeAnim }} className="text-white/80 text-sm">
          Verifying your credentials...
        </Animated.Text>

        {/* Loading dots */}
        <View className="flex-row mt-4">
          {[0, 1, 2].map((index) => (
            <Animated.View
              key={index}
              style={{
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: Animated.multiply(scaleAnim, new Animated.Value(index * 2)),
                  },
                ],
              }}
              className="w-2 h-2 bg-white rounded-full mx-1"
            />
          ))}
        </View>
      </View>

      {/* Bottom branding */}
      <View className="absolute bottom-8 items-center">
        <Animated.Text style={{ opacity: fadeAnim }} className="text-white/60 text-xs">
          © 2024 VEDATRON. All rights reserved.
        </Animated.Text>
      </View>
    </View>
  )
}
