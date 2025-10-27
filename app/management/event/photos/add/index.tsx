
import { useCallback, useEffect, useMemo, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import RNPickerSelect from "react-native-picker-select"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useFormik } from "formik"
import * as Yup from "yup"

// Mock API functions - replace with actual API calls
const getAllClass = async () => {
  return [
    { _id: "1", name: "Class 10-A" },
    { _id: "2", name: "Class 10-B" },
  ]
}

const getStudentForAttendance = async (classId: string, date: string) => {
  return [
    { _id: "1", first_name: "John", father_name: "Doe" },
    { _id: "2", first_name: "Jane", father_name: "Smith" },
  ]
}

const uploadEventActivityImage = async (data: any) => {
  return { data: { message: "Photos uploaded successfully" } }
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  reciever: Yup.string().required("Recipient is required"),
  image_urls: Yup.array().min(1, "At least one image is required"),
})

export default function AddEventPhotos() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const [allClass, setAllClass] = useState([])
  const [allStudent, setClassStudent] = useState<any[]>([])
  const [creating, setCreating] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [imageUploadingProgress, setImageUploadingProgress] = useState(0)

  const ClassListItem = useMemo(
    () => [{ label: "-- Select Class --", value: "" }, ...allClass.map((c) => ({ label: c.name, value: c._id }))],
    [allClass],
  )

  const StudentListItem = useMemo(
    () => [
      { label: "-- Select Student --", value: "" },
      ...allStudent.map((s) => ({ label: `${s.first_name} s/o ${s.father_name}`, value: s._id })),
    ],
    [allStudent],
  )

  const { values, errors, handleChange, handleSubmit, setFieldValue, touched } = useFormik({
    initialValues: {
      title: "",
      reciever: "SCHOOL",
      class_id: null,
      student_id: null,
      image_urls: [],
      event_id: null,
    },
    validationSchema,
    onSubmit: async (formValues) => {
      setCreating(true)
      try {
        await uploadEventActivityImage(formValues)
        Alert.alert("Success", "Photos uploaded successfully")
        router.push("/event-photo-gallery")
      } catch (error) {
        Alert.alert("Error", "Failed to upload photos")
      } finally {
        setCreating(false)
      }
    },
  })

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classes = await getAllClass()
        setAllClass(classes)
      } catch (error) {
        Alert.alert("Error", "Failed to fetch classes")
      }
    }
    fetchClasses()
  }, [])

  const getClassStudent = useCallback(async (classId: string) => {
    if (!classId) return
    try {
      const todayDate = new Date().toISOString().split("T")[0]
      const students = await getStudentForAttendance(classId, todayDate)
      setClassStudent(students)
    } catch (error) {
      Alert.alert("Error", "Failed to fetch students")
    }
  }, [])

  const changeClassHandle = useCallback(
    (classId: string) => {
      if (values.reciever === "CLASS") {
        setFieldValue("class_id", classId)
      } else if (values.reciever === "STUDENT") {
        getClassStudent(classId)
      }
    },
    [values.reciever, getClassStudent, setFieldValue],
  )

  const changeAudienceHandler = (value: string) => {
    setFieldValue("reciever", value)
    setFieldValue("student_id", null)
    setFieldValue("class_id", null)
  }

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-gray-900"
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-4 py-6 space-y-6">
        {/* Header */}
        <View>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Event Gallery</Text>
          <Text className="text-sm mt-1 text-gray-600 dark:text-gray-400">Add Event's Photos</Text>
        </View>

        {/* Form Card */}
        <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">Photos Details</Text>

          {/* Title Input */}
          <View>
            <Text className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Title <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              placeholder="Enter Title"
              placeholderTextColor="#9ca3af"
              value={values.title}
              onChangeText={(text) => setFieldValue("title", text)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            {touched.title && errors.title && <Text className="text-red-500 text-xs mt-1">{errors.title}</Text>}
          </View>

          {/* Recipient Selection */}
          <View>
            <Text className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Send To:</Text>
            <View className="space-y-2">
              {[
                { title: "SCHOOL", value: "SCHOOL", description: "Send to all students" },
                { title: "CLASS", value: "CLASS", description: "Send to class's all students" },
                { title: "STUDENT", value: "STUDENT", description: "Send to selected student" },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => changeAudienceHandler(option.value)}
                  className={`p-4 rounded-lg border-2 ${
                    values.reciever === option.value
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text
                        className={`font-semibold ${
                          values.reciever === option.value
                            ? "text-indigo-900 dark:text-indigo-100"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {option.title}
                      </Text>
                      <Text
                        className={`text-xs mt-1 ${
                          values.reciever === option.value
                            ? "text-indigo-700 dark:text-indigo-200"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {option.description}
                      </Text>
                    </View>
                    <MaterialCommunityIcons
                      name={values.reciever === option.value ? "check-circle" : "circle-outline"}
                      size={24}
                      color={values.reciever === option.value ? "#4f46e5" : "#9ca3af"}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Class Selection */}
          {(values.reciever === "CLASS" || values.reciever === "STUDENT") && (
            <View>
              <Text className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Class <Text className="text-red-500">*</Text>
              </Text>
              <RNPickerSelect
                items={ClassListItem}
                onValueChange={changeClassHandle}
                value={values.class_id}
                placeholder={{ label: "-- Select Class --", value: "" }}
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
                    paddingVertical: 12,
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
          )}

          {/* Student Selection */}
          {values.reciever === "STUDENT" && (
            <View>
              <Text className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Select Student</Text>
              <RNPickerSelect
                items={StudentListItem}
                onValueChange={(value) => setFieldValue("student_id", value)}
                value={values.student_id}
                placeholder={{ label: "-- Select Student --", value: "" }}
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
                    paddingVertical: 12,
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
          )}

          {/* Image Upload Placeholder */}
          <View>
            <Text className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Select Images <Text className="text-red-500">*</Text>
            </Text>
            <TouchableOpacity className="p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 items-center justify-center">
              <MaterialCommunityIcons name="cloud-upload" size={32} color="#9ca3af" />
              <Text className="text-sm font-medium mt-2 text-gray-600 dark:text-gray-400">Tap to upload images</Text>
              <Text className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {imageUploadingProgress > 0 ? `${imageUploadingProgress}%` : "PNG, JPG up to 10MB"}
              </Text>
            </TouchableOpacity>
            {errors.image_urls && <Text className="text-red-500 text-xs mt-1">{errors.image_urls}</Text>}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={() => handleSubmit()}
            disabled={creating || imageUploading}
            className={`p-3 rounded-lg flex-row items-center justify-center ${
              creating || imageUploading ? "bg-gray-400" : "bg-indigo-600"
            }`}
          >
            {creating || imageUploading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <MaterialCommunityIcons name="upload" size={18} color="white" />
                <Text className="text-white font-medium ml-2">Submit</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
