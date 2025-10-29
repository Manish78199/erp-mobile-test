"use client"

import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { cn } from "@/utils/cn"
import { markStudentAttendance } from "@/service/management/student"

// Mock API function (replace with actual API call)
// const markStudentAttendance = async (data: any[]) => {
//   return { success: true }
// }

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
    { label: "Late", value: "LATE", icon: "clock-outline", color: "bg-yellow-600" },
    { label: "Leave", value: "LEAVE", icon: "calendar", color: "bg-blue-600" },
  ]

   useEffect(() => {
    setAttendance(data?.myAttendance?.status || null)
  }, [data?.myAttendance?.status])

  
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

  const getOption = (status: string) => {
    return attendanceOptions.find((opt) => opt.value === status)
  }

  return (
    <View className="space-y-3">
      {/* ===== STATUS DISPLAY SECTION ===== */}
      {(myAttendance || isLocked) && (
        <View className="flex-row items-center gap-2">
          {myAttendance ? (
            <View
              className={cn(
                "flex-row items-center px-3 py-2 rounded-lg",
                getOption(myAttendance)?.color || "bg-gray-600",
              )}
            >
              <MaterialCommunityIcons
                name={(getOption(myAttendance)?.icon as any) || "help-circle"}
                size={18}
                color="white"
              />
              <Text className="text-white text-sm font-semibold ml-2">
                {getOption(myAttendance)?.label || "Not Marked"}
              </Text>
            </View>
          ) : (
            <View className="bg-gray-300 px-3 py-2 rounded-lg">
              <Text className="text-gray-700 text-sm font-semibold">Not Marked</Text>
            </View>
          )}
          {isLocked && <MaterialCommunityIcons name="lock" size={16} color="#6b7280" />}
          {isLoading && <ActivityIndicator size="small" color="#10b981" />}
        </View>
      )}

      {/* ===== BUTTON SECTION ===== */}
      {!isLocked && (
        <View className="flex-row mt-3 flex-wrap gap-2">
          {attendanceOptions.map((option) => {
            const isSelected = myAttendance === option.value
            return (
              <TouchableOpacity
                key={option.value}
                onPress={() => onChangeAttendance(option.value)}
                disabled={isLoading}
                className={cn(
                  "flex-row items-center px-3 py-2 rounded-lg border-2",
                  isSelected
                    ? `${option.color} border-transparent`
                    : "bg-gray-100 border-gray-300",
                )}
              >
                <MaterialCommunityIcons
                  name={option.icon as any}
                  size={16}
                  color={isSelected ? "white" : "#6b7280"}
                />
                <Text
                  className={cn(
                    "text-xs font-medium ml-1",
                    isSelected ? "text-white" : "text-gray-700",
                  )}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      )}
    </View>
  )
}

export default AttendanceController
