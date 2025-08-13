// import React from "react";
// import { View } from "react-native";
// import { Typography } from "./Typography";

// interface AlertProps {
//   type: "ERROR" | "SUCCESS" | "WARNING" | string;
//   message: string;
// }

// export default function Alert({ type, message }: AlertProps) {
//   const baseClasses = "absolute text-sm bottom-20 z-50 w-full flex-row justify-center rounded-lg";
//   const boxBase = "px-4 py-2 rounded-md border";

//   const getStyle = () => {
//     switch (type) {
//       case "ERROR":
//         return `${boxBase} border-red-700/30 bg-red-500 text-white `;
//       case "SUCCESS":
//         return `${boxBase} border-emerald-700/30 bg-emerald-600 text-white `;
//       default:
//         return `${boxBase} border-yellow-700/30 bg-zinc-900 text-yellow-500`;
//     }
//   };

//   return (
//     <View className={baseClasses}>
//       <View className={`${getStyle()} rounded-full`}>
//         <Typography className="text-sm text-white">{message}</Typography>
//       </View>
//     </View>
//   );
// }


"use client"

import { useEffect, useRef } from "react"
import { View, Animated } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Typography } from "./Typography"

interface AlertProps {
  type: "ERROR" | "SUCCESS" | "WARNING" | string
  message: string
}

export default function Alert({ type, message }: AlertProps) {
  const slideAnim = useRef(new Animated.Value(100)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const getIcon = () => {
    switch (type) {
      case "ERROR":
        return "close-circle"
      case "SUCCESS":
        return "checkmark-circle"
      case "WARNING":
        return "warning"
      default:
        return "information-circle"
    }
  }

  const getIconColor = () => {
    switch (type) {
      case "ERROR":
        return "#ffffff"
      case "SUCCESS":
        return "#ffffff"
      case "WARNING":
        return "#F59E0B"
      default:
        return "#3B82F6"
    }
  }

  const baseClasses = "absolute text-sm bottom-20 z-50 w-full flex-row justify-center rounded-lg"
  const boxBase = "px-4 py-3 rounded-xl border shadow-lg elevation-8"

  const getStyle = () => {
    switch (type) {
      case "ERROR":
        return `${boxBase} border-red-500/20 bg-red-500`
      case "SUCCESS":
        return `${boxBase} border-emerald-500/20 bg-emerald-500`
      case "WARNING":
        return `${boxBase} border-yellow-500/20 bg-yellow-50 border-yellow-200`
      default:
        return `${boxBase} border-blue-500/20 bg-blue-500`
    }
  }

  const getTextColor = () => {
    switch (type) {
      case "WARNING":
        return "text-yellow-800"
      default:
        return "text-white"
    }
  }

  return (
    <View className={baseClasses}>
      <Animated.View
        style={{
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
        }}
        className={`${getStyle()} flex-row items-center`}
      >
        <Ionicons name={getIcon() as any} size={20} color={getIconColor()} style={{ marginRight: 8 }} />
        <Typography className={`text-sm font-medium ${getTextColor()}`}>{message}</Typography>
      </Animated.View>
    </View>
  )
}
