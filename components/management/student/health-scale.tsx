
import { useEffect } from "react"
import { View, Text } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated"

interface HealthScaleProps {
  value: number
  maxValue: number
  unit: string
  label: string
  color: string
}

export default function HealthScale({ value =0, maxValue=0, unit, label, color }: HealthScaleProps) {
  const fillPercentage = Math.min((value / maxValue) * 100, 100)
  const animatedWidth = useSharedValue(0)

  useEffect(() => {
    animatedWidth.value = withTiming(fillPercentage, { duration: 1200 })
  }, [value])

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%`,
  }))

  return (
    <View className="bg-white  rounded-lg p-4 mb-4">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-semibold text-slate-900 ">{label}</Text>
        <Text className="text-2xl font-bold text-slate-900 ">
          {value} {unit}
        </Text>
      </View>

      <View className="h-8 bg-slate-200  rounded-full overflow-hidden">
        <Animated.View style={[animatedStyle, { backgroundColor: color }]} className="h-full rounded-full" />
      </View>

      <View className="flex-row justify-between mt-2">
        <Text className="text-xs text-slate-500 ">0</Text>
        <Text className="text-xs text-slate-500 ">{maxValue}</Text>
      </View>
    </View>
  )
}
