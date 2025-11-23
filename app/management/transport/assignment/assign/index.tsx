"use client"

import { useState } from "react"
import { View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import RNPickerSelect from "react-native-picker-select"
import { cn } from "@/utils/cn"
import { Typography } from "@/components/Typography"
import { useRouter } from "expo-router"

interface TransportAssignmentData {
  student_id: string
  pickup_point_id: string
  monthly_fee: number | string
  route_id: string
  vehicle_id: string
}

export default function TransportAssignForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<TransportAssignmentData>({
    student_id: "",
    pickup_point_id: "",
    monthly_fee: "",
    route_id: "",
    vehicle_id: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock data
  const classes = [
    { _id: "1", name: "Class 1", classCode: "A" },
    { _id: "2", name: "Class 2", classCode: "B" },
  ]

  const students = [
    { _id: "1", first_name: "John", last_name: "Doe", admission_no: "ADM001" },
    { _id: "2", first_name: "Jane", last_name: "Smith", admission_no: "ADM002" },
  ]

  const routes = [
    { _id: "1", name: "Route A", code: "RA" },
    { _id: "2", name: "Route B", code: "RB" },
  ]

  const pickupPoints = [
    { _id: "1", name: "Point A", address: "123 Main St", monthly_fee: 500 },
    { _id: "2", name: "Point B", address: "456 Oak Ave", monthly_fee: 600 },
  ]

  const handleInputChange = (field: keyof TransportAssignmentData, value: any) => {
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

    if (!formData.student_id) newErrors.student_id = "Student selection is required"
    if (!formData.pickup_point_id) newErrors.pickup_point_id = "Pickup point selection is required"
    if (!formData.monthly_fee || Number(formData.monthly_fee) <= 0)
      newErrors.monthly_fee = "Monthly fee must be greater than 0"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      Alert.alert("Success", "Transport assigned successfully")
      setFormData({
        student_id: "",
        pickup_point_id: "",
        monthly_fee: "",
        route_id: "",
        vehicle_id: "",
      })
    } catch (error) {
      Alert.alert("Error", "Failed to assign transport")
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
        <Typography className="text-lg font-bold text-foreground">Transport</Typography>
      </View>

      <ScrollView className="flex-1 bg-background">
        <View className="px-4 mt-3 pb-6 space-y-6">
          <View>
            <Typography className="text-2xl font-bold text-gray-900">Assign Transport</Typography>
            <Typography className="text-sm mt-1 text-gray-600">Assign transport to a student</Typography>
          </View>

          <View className="rounded-lg p-4 border border-gray-200 bg-white space-y-4">
            <View className="flex-row items-center gap-2 mb-4">
              <View className="p-2 bg-green-500 rounded-lg">
                <MaterialCommunityIcons name="bus" size={18} color="white" />
              </View>
              <Typography className="text-lg font-semibold text-gray-900">Assignment Details</Typography>
            </View>

            <View>
              <Typography className="text-sm font-medium text-gray-700 mb-2">
                Select Class <Typography className="text-red-500">*</Typography>
              </Typography>
              <RNPickerSelect
                items={classes.map((c) => ({ label: c.name, value: c._id }))}
                onValueChange={(value) => handleInputChange("student_id", value)}
                placeholder={{ label: "-- Select Class --" }}
                style={{
                  inputIOS: {
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: errors.student_id ? "#ef4444" : "#e5e7eb",
                    backgroundColor: "#f9fafb",
                    color: "#000",
                  },
                  inputAndroid: {
                    paddingVertical: 0,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: errors.student_id ? "#ef4444" : "#e5e7eb",
                    backgroundColor: "#f9fafb",
                    color: "#000",
                  },
                }}
              />
              {errors.student_id && <Typography className="text-red-500 text-xs mt-1">{errors.student_id}</Typography>}
            </View>

            <View>
              <Typography className="text-sm font-medium text-gray-700 mb-2">
                Select Student <Typography className="text-red-500">*</Typography>
              </Typography>
              <RNPickerSelect
                items={students.map((s) => ({ label: `${s.first_name} ${s.last_name}`, value: s._id }))}
                onValueChange={(value) => handleInputChange("student_id", value)}
                placeholder={{ label: "-- Select Student --" }}
                style={{
                  inputIOS: {
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: errors.student_id ? "#ef4444" : "#e5e7eb",
                    backgroundColor: "#f9fafb",
                    color: "#000",
                  },
                  inputAndroid: {
                    paddingVertical: 0,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: errors.student_id ? "#ef4444" : "#e5e7eb",
                    backgroundColor: "#f9fafb",
                    color: "#000",
                  },
                }}
              />
              {errors.student_id && <Typography className="text-red-500 text-xs mt-1">{errors.student_id}</Typography>}
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
                    borderColor: "#e5e7eb",
                    backgroundColor: "#f9fafb",
                    color: "#000",
                  },
                  inputAndroid: {
                    paddingVertical: 0,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    backgroundColor: "#f9fafb",
                    color: "#000",
                  },
                }}
              />
            </View>

            <View>
              <Typography className="text-sm font-medium text-gray-700 mb-2">
                Select Pickup Point <Typography className="text-red-500">*</Typography>
              </Typography>
              <RNPickerSelect
                items={pickupPoints.map((p) => ({ label: p.name, value: p._id }))}
                onValueChange={(value) => handleInputChange("pickup_point_id", value)}
                placeholder={{ label: "-- Select Pickup Point --" }}
                style={{
                  inputIOS: {
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: errors.pickup_point_id ? "#ef4444" : "#e5e7eb",
                    backgroundColor: "#f9fafb",
                    color: "#000",
                  },
                  inputAndroid: {
                    paddingVertical: 0,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: errors.pickup_point_id ? "#ef4444" : "#e5e7eb",
                    backgroundColor: "#f9fafb",
                    color: "#000",
                  },
                }}
              />
              {errors.pickup_point_id && (
                <Typography className="text-red-500 text-xs mt-1">{errors.pickup_point_id}</Typography>
              )}
            </View>

            <View>
              <Typography className="text-sm font-medium text-gray-700 mb-2">
                Monthly Fee (₹) <Typography className="text-red-500">*</Typography>
              </Typography>
              <TextInput
                value={formData.monthly_fee.toString()}
                onChangeText={(value) => handleInputChange("monthly_fee", value)}
                placeholder="Enter monthly fee"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                className={cn(
                  "px-3 py-2 rounded-lg border text-gray-900 bg-gray-50",
                  errors.monthly_fee ? "border-red-500" : "border-gray-300",
                )}
              />
              {errors.monthly_fee && (
                <Typography className="text-red-500 text-xs mt-1">{errors.monthly_fee}</Typography>
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
