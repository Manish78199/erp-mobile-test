
import { useEffect, useState, useMemo } from "react"
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialIcons } from "@expo/vector-icons"
import { useClasses } from "@/hooks/management/classes"
import { geAllEmployee } from "@/service/management/employee"
import { createSection } from "@/service/management/section"
import RNPickerSelect from "react-native-picker-select"

const suggestedSectionNames = ["A", "B", "C", "D", "E", "F", "A2", "A3", "B2", "B3", "C2", "C3"]

export default function CreateSectionScreen() {
  const insets = useSafeAreaInsets()
  const { classes } = useClasses()

  const [teachers, setTeachers] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    name: "",
    class_id: "",
    room_no: "",
    capacity: "",
    teacher_id: "",
    description: "",
    is_active: true,
  })

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const teachers = await geAllEmployee("TEACHER")
        setTeachers(teachers)
      } catch (error) {
        Alert.alert("Error", "Failed to fetch teachers")
      }
    }
    fetchTeachers()
  }, [])

  const handleInputChange = (field: string, value: any) => {
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

    if (!formData.name.trim()) {
      newErrors.name = "Section name is required"
    }

    if (!formData.class_id) {
      newErrors.class_id = "Please select a class"
    }

    if (!formData.room_no.trim()) {
      newErrors.room_no = "Room number is required"
    }

    if (!formData.capacity || Number.parseInt(formData.capacity) <= 0) {
      newErrors.capacity = "Please enter a valid capacity"
    }

    if (Number.parseInt(formData.capacity) > 50) {
      newErrors.capacity = "Capacity cannot exceed 50 students"
    }

    if (!formData.teacher_id) {
      newErrors.teacher_id = "Please select a class teacher"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await createSection(formData)
      Alert.alert("Success", "Section created successfully")
      setFormData({
        name: "",
        class_id: "",
        room_no: "",
        capacity: "",
        teacher_id: "",
        description: "",
        is_active: true,
      })
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.message || "Failed to create section")
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedClass = useMemo(() => {
    return classes.find((c) => c._id === formData.class_id)
  }, [formData.class_id, classes])

  const selectedTeacher = useMemo(() => {
    return teachers.find((t) => t?._id === formData.teacher_id)
  }, [formData.teacher_id, teachers])

  return (
    <View className="flex-1 bg-white dark:bg-gray-900" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <ScrollView className="flex-1 px-4">
        {/* Header */}
        <View className="mt-6 mb-6">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Create New Section</Text>
          <Text className="text-gray-600 dark:text-gray-400 mt-1">Add a new section to organize students</Text>
        </View>

        {/* Basic Information Card */}
        <View className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <View className="flex-row items-center gap-2 mb-4">
            <MaterialIcons name="book" size={20} color="#10b981" />
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</Text>
          </View>

          {/* Section Name */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Section Name <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              placeholder="Enter section name"
              placeholderTextColor="#9ca3af"
              className={`border rounded-lg px-3 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 ${
                errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.name && <Text className="text-red-500 text-xs mt-1">{errors.name}</Text>}

            {/* Quick Suggestions */}
            <View className="mt-3">
              <Text className="text-xs text-gray-600 dark:text-gray-400 mb-2">Quick suggestions:</Text>
              <View className="flex-row flex-wrap gap-2">
                {suggestedSectionNames.map((name) => (
                  <TouchableOpacity
                    key={name}
                    onPress={() => handleInputChange("name", name)}
                    className="px-3 py-2 rounded bg-indigo-100 dark:bg-indigo-900"
                  >
                    <Text className="text-xs font-medium text-indigo-800 dark:text-indigo-200">{name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Class Selection */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Class <Text className="text-red-500">*</Text>
            </Text>
            <RNPickerSelect
              onValueChange={(value) => handleInputChange("class_id", value)}
              items={classes.map((cls) => ({
                label: `${cls.name} (${cls.classCode})`,
                value: cls._id,
              }))}
              placeholder={{ label: "Select class", value: "" }}
              style={{
                inputIOS: {
                  paddingVertical: 12,
                  paddingHorizontal: 10,
                  borderRadius: 6,
                  backgroundColor: "#f3f4f6",
                  color: "#000",
                  fontSize: 16,
                  borderWidth: errors.class_id ? 2 : 1,
                  borderColor: errors.class_id ? "#ef4444" : "#d1d5db",
                },
                inputAndroid: {
                  paddingVertical: 12,
                  paddingHorizontal: 10,
                  borderRadius: 6,
                  backgroundColor: "#f3f4f6",
                  color: "#000",
                  fontSize: 16,
                  borderWidth: errors.class_id ? 2 : 1,
                  borderColor: errors.class_id ? "#ef4444" : "#d1d5db",
                },
              }}
            />
            {errors.class_id && <Text className="text-red-500 text-xs mt-1">{errors.class_id}</Text>}
          </View>

          {/* Class Teacher Selection */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Class Teacher <Text className="text-red-500">*</Text>
            </Text>
            <RNPickerSelect
              onValueChange={(value) => handleInputChange("teacher_id", value)}
              items={teachers.map((teacher) => ({
                label: `${teacher.name} - ${teacher.employee_code}`,
                value: teacher._id,
              }))}
              placeholder={{ label: "Select teacher", value: "" }}
              style={{
                inputIOS: {
                  paddingVertical: 12,
                  paddingHorizontal: 10,
                  borderRadius: 6,
                  backgroundColor: "#f3f4f6",
                  color: "#000",
                  fontSize: 16,
                  borderWidth: errors.teacher_id ? 2 : 1,
                  borderColor: errors.teacher_id ? "#ef4444" : "#d1d5db",
                },
                inputAndroid: {
                  paddingVertical: 12,
                  paddingHorizontal: 10,
                  borderRadius: 6,
                  backgroundColor: "#f3f4f6",
                  color: "#000",
                  fontSize: 16,
                  borderWidth: errors.teacher_id ? 2 : 1,
                  borderColor: errors.teacher_id ? "#ef4444" : "#d1d5db",
                },
              }}
            />
            {errors.teacher_id && <Text className="text-red-500 text-xs mt-1">{errors.teacher_id}</Text>}
          </View>

          {/* Room Number */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room No <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={formData.room_no}
              onChangeText={(value) => handleInputChange("room_no", value)}
              placeholder="101, 103"
              placeholderTextColor="#9ca3af"
              className={`border rounded-lg px-3 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 ${
                errors.room_no ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.room_no && <Text className="text-red-500 text-xs mt-1">{errors.room_no}</Text>}
          </View>

          {/* Capacity */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Capacity <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={formData.capacity}
              onChangeText={(value) => handleInputChange("capacity", value)}
              placeholder="Maximum students (1-50)"
              placeholderTextColor="#9ca3af"
              keyboardType="number-pad"
              className={`border rounded-lg px-3 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 ${
                errors.capacity ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.capacity && <Text className="text-red-500 text-xs mt-1">{errors.capacity}</Text>}
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</Text>
            <TextInput
              value={formData.description}
              onChangeText={(value) => handleInputChange("description", value)}
              placeholder="Optional description about the section"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700"
            />
          </View>

          {/* Active Status */}
          <View className="flex-row items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
            <View>
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Status</Text>
              <Text className="text-xs text-gray-600 dark:text-gray-400 mt-1">Set this section as active</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleInputChange("is_active", !formData.is_active)}
              className={`px-4 py-2 rounded-lg ${
                formData.is_active ? "bg-green-100 dark:bg-green-900" : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <Text
                className={`font-semibold ${
                  formData.is_active ? "text-green-800 dark:text-green-200" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {formData.is_active ? "Active" : "Inactive"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preview Card */}
        <View className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Section Preview</Text>

          <View className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
            <View className="items-center mb-4">
              <Text className="text-lg font-bold text-gray-900 dark:text-white">Section {formData.name || "___"}</Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {selectedClass?.name || "Select Class"}
              </Text>
            </View>

            <View className="gap-3 text-sm">
              <View className="flex-row justify-between">
                <Text className="text-gray-600 dark:text-gray-400">Room:</Text>
                <Text className="font-medium text-gray-900 dark:text-white">{formData.room_no || "Not set"}</Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-600 dark:text-gray-400">Capacity:</Text>
                <Text className="font-medium text-gray-900 dark:text-white">
                  {formData.capacity ? `${formData.capacity} students` : "Not set"}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-600 dark:text-gray-400">Teacher:</Text>
                <Text className="font-medium text-gray-900 dark:text-white">
                  {selectedTeacher?.name || "Not assigned"}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-600 dark:text-gray-400">Status:</Text>
                <Text
                  className={`font-medium ${formData.is_active ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"}`}
                >
                  {formData.is_active ? "Active" : "Inactive"}
                </Text>
              </View>
            </View>

            {formData.description && (
              <View className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                <Text className="text-xs text-gray-600 dark:text-gray-400 mb-1">Description:</Text>
                <Text className="text-sm text-gray-900 dark:text-white">{formData.description}</Text>
              </View>
            )}
          </View>

          {selectedTeacher && (
            <View className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <Text className="text-sm font-semibold text-green-800 dark:text-green-200">
                Teacher: {selectedTeacher.name}
              </Text>
              <Text className="text-xs text-green-700 dark:text-green-300 mt-1">
                {selectedTeacher.employee_code} • {selectedTeacher.phone}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity
            disabled={isSubmitting}
            className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            <Text className="text-center font-semibold text-gray-700 dark:text-gray-300">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-3 rounded-lg bg-indigo-500 dark:bg-indigo-600 flex-row items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <MaterialIcons name="save" size={18} color="#fff" />
            )}
            <Text className="text-white font-semibold">{isSubmitting ? "Creating..." : "Create Section"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}
