"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { cn } from "@/utils/cn"

// Mock API function - replace with actual API call
const markStudentAttendance = async (data: any[]) => {
  return { success: true }
}

const AttendanceController = ({
  data,
  isLocked = false,
  date = null,
  onAttendanceChange,
}: {
  data: any
  isLocked?: boolean
  date?: string | null
  onAttendanceChange?: () => void
}) => {
  const [myAttendance, setAttendance] = useState(data?.myAttendance?.status || null)
  const [isLoading, setIsLoading] = useState(false)

  const attendanceOptions = [
    { label: "Present", value: "PRESENT", icon: "check-circle", color: "bg-emerald-600" },
    { label: "Half Day", value: "HALFDAY", icon: "alert-circle", color: "bg-orange-600" },
    { label: "Absent", value: "ABSENT", icon: "close-circle", color: "bg-red-600" },
    { label: "Late", value: "LATE", icon: "clock", color: "bg-yellow-600" },
    { label: "Leave", value: "LEAVE", icon: "calendar", color: "bg-blue-600" },
  ]

  const onChangeAttendance = async (value: string) => {
    const prev = myAttendance
    setAttendance(value)
    setIsLoading(true)

    try {
      const dateStr = date || new Date().toISOString().split("T")[0]
      await markStudentAttendance([
        {
          student_id: data?._id,
          status: value,
          date: dateStr,
        },
      ])

      Alert.alert("Success", `Attendance marked as ${value}`)
      onAttendanceChange?.()
    } catch (error) {
      setAttendance(prev)
      Alert.alert("Error", "Failed to mark attendance")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const option = attendanceOptions.find((opt) => opt.value === status)
    return option?.color || "bg-gray-600"
  }

  const getStatusIcon = (status: string) => {
    const option = attendanceOptions.find((opt) => opt.value === status)
    return option?.icon || "help-circle"
  }

  return (
    <View className="space-y-3">
      {/* Current Status Badge */}
      {(myAttendance || isLocked) && (
        <View className="flex-row items-center gap-2">
          <View className={cn("flex-row items-center px-3 py-2 rounded-lg", getStatusColor(myAttendance))}>
            <MaterialCommunityIcons name={getStatusIcon(myAttendance) as any} size={16} color="white" />
            <Text className="text-white text-sm font-medium ml-2">{myAttendance || "Not Marked"}</Text>
          </View>
          {isLocked && <MaterialCommunityIcons name="lock" size={16} color="#6b7280" />}
          {isLoading && <ActivityIndicator size="small" color="#10b981" />}
        </View>
      )}

      {/* Attendance Options */}
      {!isLocked && (
        <View className="flex-row flex-wrap gap-2">
          {attendanceOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => onChangeAttendance(option.value)}
              disabled={isLoading}
              className={cn(
                "flex-row items-center px-3 py-2 rounded-lg border-2",
                myAttendance === option.value
                  ? `${option.color} border-transparent`
                  : "bg-gray-100  border-gray-300 ",
              )}
            >
              <MaterialCommunityIcons
                name={option.icon as any}
                size={16}
                color={myAttendance === option.value ? "white" : "#6b7280"}
              />
              <Text
                className={cn(
                  "text-xs font-medium ml-1",
                  myAttendance === option.value ? "text-white" : "text-gray-700 ",
                )}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
}

export default AttendanceController
