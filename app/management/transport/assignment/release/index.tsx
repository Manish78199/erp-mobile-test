"use client"

import { useState } from "react"
import { View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import RNPickerSelect from "react-native-picker-select"
import { cn } from "@/utils/cn"
import { Typography } from "@/components/Typography"
import { useRouter } from "expo-router"

interface ReleaseFormData {
  student_id: string
  assignment_id: string
  reason: string
  effective_date: string
}

export default function TransportReleaseForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<ReleaseFormData>({
    student_id: "",
    assignment_id: "",
    reason: "",
    effective_date: new Date().toISOString().split("T")[0],
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

  const assignments = [
    { _id: "1", pickup_point: "Point A", route: "Route A", monthly_fee: 500 },
    { _id: "2", pickup_point: "Point B", route: "Route B", monthly_fee: 600 },
  ]

  const handleInputChange = (field: keyof ReleaseFormData, value: any) => {
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
    if (!formData.assignment_id) newErrors.assignment_id = "Assignment selection is required"
    if (!formData.reason || formData.reason.length < 10)
      newErrors.reason = "Please provide a detailed reason (minimum 10 characters)"
    if (!formData.effective_date) newErrors.effective_date = "Effective date is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      Alert.alert("Success", "Transport released successfully")
      setFormData({
        student_id: "",
        assignment_id: "",
        reason: "",
        effective_date: new Date().toISOString().split("T")[0],
      })
    } catch (error) {
      Alert.alert("Error", "Failed to release transport")
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
        <Typography className="text-lg font-bold text-foreground">Release Transport</Typography>
      </View>

      <ScrollView className="flex-1 bg-background">
        <View className="px-4 mt-3 pb-6 space-y-6">
          <View>
            <Typography className="text-2xl font-bold text-gray-900">Release Transport</Typography>
            <Typography className="text-sm mt-1 text-gray-600">Remove students from transport assignments</Typography>
          </View>

          <View className="rounded-lg p-4 border border-gray-200 bg-white space-y-4">
            <View className="flex-row items-center gap-2 mb-4">
              <View className="p-2 bg-red-500 rounded-lg">
                <MaterialCommunityIcons name="bus-remove" size={18} color="white" />
              </View>
              <Typography className="text-lg font-semibold text-gray-900">Release Details</Typography>
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
                Select Assignment <Typography className="text-red-500">*</Typography>
              </Typography>
              <RNPickerSelect
                items={assignments.map((a) => ({ label: a.pickup_point, value: a._id }))}
                onValueChange={(value) => handleInputChange("assignment_id", value)}
                placeholder={{ label: "-- Select Assignment --" }}
                style={{
                  inputIOS: {
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: errors.assignment_id ? "#ef4444" : "#e5e7eb",
                    backgroundColor: "#f9fafb",
                    color: "#000",
                  },
                  inputAndroid: {
                    paddingVertical: 0,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: errors.assignment_id ? "#ef4444" : "#e5e7eb",
                    backgroundColor: "#f9fafb",
                    color: "#000",
                  },
                }}
              />
              {errors.assignment_id && (
                <Typography className="text-red-500 text-xs mt-1">{errors.assignment_id}</Typography>
              )}
            </View>

            <View>
              <Typography className="text-sm font-medium text-gray-700 mb-2">
                Reason for Release <Typography className="text-red-500">*</Typography>
              </Typography>
              <TextInput
                value={formData.reason}
                onChangeText={(value) => handleInputChange("reason", value)}
                placeholder="Enter reason for release"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                className={cn(
                  "px-3 py-2 rounded-lg border text-gray-900 bg-gray-50",
                  errors.reason ? "border-red-500" : "border-gray-300",
                )}
              />
              {errors.reason && <Typography className="text-red-500 text-xs mt-1">{errors.reason}</Typography>}
            </View>

            <View>
              <Typography className="text-sm font-medium text-gray-700 mb-2">
                Effective Date <Typography className="text-red-500">*</Typography>
              </Typography>
              <TextInput
                value={formData.effective_date}
                onChangeText={(value) => handleInputChange("effective_date", value)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9ca3af"
                className={cn(
                  "px-3 py-2 rounded-lg border text-gray-900 bg-gray-50",
                  errors.effective_date ? "border-red-500" : "border-gray-300",
                )}
              />
              {errors.effective_date && (
                <Typography className="text-red-500 text-xs mt-1">{errors.effective_date}</Typography>
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
              className="flex-1 bg-red-600 rounded-lg p-3 flex-row items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <MaterialCommunityIcons name="check" size={18} color="white" />
                  <Typography className="text-white font-medium">Release</Typography>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
