"use client"

import { useState } from "react"
import { View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import RNPickerSelect from "react-native-picker-select"
import { cn } from "@/utils/cn"
import { Typography } from "@/components/Typography"
import { useRouter } from "expo-router"

interface VehicleRouteData {
  vehicle_id: string
  route_id: string
  arrival_time: string
  departure_time: string
}

export default function VehicleAssignRoute() {
  const router = useRouter()
  const [formData, setFormData] = useState<VehicleRouteData>({
    vehicle_id: "",
    route_id: "",
    arrival_time: "",
    departure_time: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock data
  const vehicles = [
    { _id: "1", vehicle_number: "DL-01-AB-1234", type: "Bus", capacity: 40 },
    { _id: "2", vehicle_number: "DL-01-CD-5678", type: "Van", capacity: 15 },
  ]

  const routes = [
    { _id: "1", name: "Route A - Central Delhi", description: "Covers Central Delhi area" },
    { _id: "2", name: "Route B - South Delhi", description: "Covers South Delhi area" },
  ]

  const handleInputChange = (field: keyof VehicleRouteData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.vehicle_id) newErrors.vehicle_id = "Vehicle selection is required"
    if (!formData.route_id) newErrors.route_id = "Route selection is required"
    if (!formData.arrival_time) newErrors.arrival_time = "Arrival time is required"
    if (!formData.departure_time) newErrors.departure_time = "Departure time is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      Alert.alert("Success", "Vehicle assigned to route successfully")
      setFormData({
        vehicle_id: "",
        route_id: "",
        arrival_time: "",
        departure_time: "",
      })
    } catch (error) {
      Alert.alert("Error", "Failed to assign vehicle to route")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center p-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center bg-white border border-border rounded-lg px-3 py-2 mr-2"
        >
          <Typography className="text-primary font-semibold">← Back</Typography>
        </TouchableOpacity>
        <Typography className="text-lg font-bold text-foreground">Vehicle Routes</Typography>
      </View>

      <ScrollView className="flex-1 bg-background">
        <View className="px-4 mt-3 pb-6 space-y-6">
          <View>
            <Typography className="text-2xl font-bold text-gray-900">Assign Vehicle to Route</Typography>
            <Typography className="text-sm mt-1 text-gray-600">Configure vehicle assignment and schedule</Typography>
          </View>

          <View className="rounded-lg p-4 border border-gray-200 bg-white space-y-4">
            <View className="flex-row items-center gap-2 mb-4">
              <View className="p-2 bg-purple-500 rounded-lg">
                <MaterialCommunityIcons name="bus" size={18} color="white" />
              </View>
              <Typography className="text-lg font-semibold text-gray-900">Vehicle Route Assignment</Typography>
            </View>

            <View>
              <Typography className="text-sm font-medium text-gray-700 mb-2">
                Select Vehicle <Typography className="text-red-500">*</Typography>
              </Typography>
              <RNPickerSelect
                items={vehicles.map((v) => ({ label: v.vehicle_number, value: v._id }))}
                onValueChange={(value) => handleInputChange("vehicle_id", value)}
                placeholder={{ label: "-- Select Vehicle --" }}
                style={{
                  inputIOS: {
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: errors.vehicle_id ? "#ef4444" : "#e5e7eb",
                    backgroundColor: "#f9fafb",
                    color: "#000",
                  },
                  inputAndroid: {
                    paddingVertical: 0,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: errors.vehicle_id ? "#ef4444" : "#e5e7eb",
                    backgroundColor: "#f9fafb",
                    color: "#000",
                  },
                }}
              />
              {errors.vehicle_id && <Typography className="text-red-500 text-xs mt-1">{errors.vehicle_id}</Typography>}
            </View>

            <View>
              <Typography className="text-sm font-medium text-gray-700 mb-2">
                Select Route <Typography className="text-red-500">*</Typography>
              </Typography>
              <RNPickerSelect
                items={routes.map((r) => ({ label: r.name, value: r._id }))}
                onValueChange={(value) => handleInputChange("route_id", value)}
                placeholder={{ label: "-- Select Route --" }}
                style={{
                  inputIOS: {
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: errors.route_id ? "#ef4444" : "#e5e7eb",
                    backgroundColor: "#f9fafb",
                    color: "#000",
                  },
                  inputAndroid: {
                    paddingVertical: 0,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: errors.route_id ? "#ef4444" : "#e5e7eb",
                    backgroundColor: "#f9fafb",
                    color: "#000",
                  },
                }}
              />
              {errors.route_id && <Typography className="text-red-500 text-xs mt-1">{errors.route_id}</Typography>}
            </View>

            <View>
              <Typography className="text-sm font-medium text-gray-700 mb-2">
                Arrival Time <Typography className="text-red-500">*</Typography>
              </Typography>
              <TextInput
                value={formData.arrival_time}
                onChangeText={(value) => handleInputChange("arrival_time", value)}
                placeholder="HH:MM"
                placeholderTextColor="#9ca3af"
                className={cn(
                  "px-3 py-2 rounded-lg border text-gray-900 bg-gray-50",
                  errors.arrival_time ? "border-red-500" : "border-gray-300",
                )}
              />
              {errors.arrival_time && (
                <Typography className="text-red-500 text-xs mt-1">{errors.arrival_time}</Typography>
              )}
            </View>

            <View>
              <Typography className="text-sm font-medium text-gray-700 mb-2">
                Departure Time <Typography className="text-red-500">*</Typography>
              </Typography>
              <TextInput
                value={formData.departure_time}
                onChangeText={(value) => handleInputChange("departure_time", value)}
                placeholder="HH:MM"
                placeholderTextColor="#9ca3af"
                className={cn(
                  "px-3 py-2 rounded-lg border text-gray-900 bg-gray-50",
                  errors.departure_time ? "border-red-500" : "border-gray-300",
                )}
              />
              {errors.departure_time && (
                <Typography className="text-red-500 text-xs mt-1">{errors.departure_time}</Typography>
              )}
            </View>
          </View>

          <View className="flex-row mt-3 gap-3">
            <TouchableOpacity className="flex-1 border border-gray-300 rounded-lg p-3">
              <Typography className="text-center font-medium text-gray-700">Cancel</Typography>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-indigo-600 rounded-lg p-3 flex-row items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <MaterialCommunityIcons name="check" size={18} color="white" />
                  <Typography className="text-white font-medium">Assign</Typography>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
