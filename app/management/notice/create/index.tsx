"use client"

import { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, FlatList } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import RNPickerSelect from "react-native-picker-select"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { cn } from "@/utils/cn"
import { useFormik } from "formik"
import * as Yup from "yup"
import { getAllClass } from "@/service/management/class/classBasic"
import { getStudentForAttendance } from "@/service/management/student"
import { createNotice } from "@/service/management/notice"
import { Typography } from "@/components/Typography"
import { useClasses } from "@/hooks/management/classes"

const NoticeSchema = Yup.object().shape({
  title: Yup.string().required("Title is required").min(3, "Title must be at least 3 characters"),
  message: Yup.string().required("Message is required").min(10, "Message must be at least 10 characters"),
  audience_type: Yup.string().required("Audience type is required"),
  class_ids: Yup.array().when("audience_type", {
    is: "CLASS",
    then: (schema) => schema.min(1, "Please select at least one class"),
    otherwise: (schema) => schema.notRequired(),
  }),
  student_ids: Yup.array().when("audience_type", {
    is: "STUDENT",
    then: (schema) => schema.min(1, "Please select at least one student"),
    otherwise: (schema) => schema.notRequired(),
  }),
})

export default function CreateNoticeScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()


  const [creating, setCreating] = useState(false)
  const [allStudent, setClassStudent] = useState<any[]>([])
  const [currentClass, setCurrentClass] = useState<any>(null)

  const { classes } = useClasses()

  const getClassStudent = async (class_id: string) => {
    if (!class_id) return
    try {
      const todayDate = new Date().toISOString().split("T")[0]
      const allStudent = await getStudentForAttendance(class_id, todayDate)
      setClassStudent(allStudent || [])
    } catch (error) {
      console.error("Error fetching students:", error)
      Alert.alert("Error", "Failed to load students")
    }
  }

  const createNoticeRequest = async (values: any) => {
    setCreating(true)
    try {
      const res = await createNotice(values)
      Alert.alert("Success", res.data.message || "Notice created successfully")
      router.push("/management/notice")
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to create notice")
    } finally {
      setCreating(false)
    }
  }

  const { values, errors, handleChange, handleSubmit, setFieldValue, touched } = useFormik({
    initialValues: {
      title: "",
      message: "",
      audience_type: "ALL",
      class_ids: [],
      student_ids: [] as any[],
    },
    validationSchema: NoticeSchema,
    onSubmit: createNoticeRequest,
  })

  const studentSelectionHandle = (student_id: string) => {
    if (values.audience_type === "STUDENT" && values.student_ids.includes(student_id)) {
      const filterStudent = values.student_ids.filter((id) => id !== student_id)
      setFieldValue("student_ids", filterStudent)
    } else {
      setFieldValue("student_ids", [...values.student_ids, student_id])
    }
  }

  const updateClassChoose = (classId: string) => {
    const matched = classes.find((cls) => cls._id === classId)
    if (matched) {
      setCurrentClass(matched)
      if (values.audience_type === "CLASS") {
        setFieldValue("class_ids", [matched._id])
      } else if (values.audience_type === "STUDENT") {
        getClassStudent(matched._id)
      }
    }
  }

  const changeAudienceHandler = (value: string) => {
    setFieldValue("audience_type", value)
    setFieldValue("student_ids", [])
    setFieldValue("class_ids", [])
    setCurrentClass(null)
    setClassStudent([])
  }

  const AudienceOption = ({ title, value, description }: any) => (
    <TouchableOpacity
      onPress={() => changeAudienceHandler(value)}
      className={cn(
        "rounded-lg p-4 border-2 mb-3",
        values.audience_type === value
          ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
          : "border-gray-200  bg-white ",
      )}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Typography
            className={cn(
              "font-semibold",
              values.audience_type === value ? "text-indigo-600" : "text-gray-900 ",
            )}
          >
            {title}
          </Typography>
          <Typography className="text-xs mt-1 text-gray-600 ">{description}</Typography>
        </View>
        <View
          className={cn(
            "w-5 h-5 rounded-full border-2",
            values.audience_type === value ? "border-indigo-600 bg-indigo-600" : "border-gray-300 ",
          )}
        >
          {values.audience_type === value && (
            <View className="w-full h-full items-center justify-center">
              <MaterialCommunityIcons name="check" size={12} color="white" />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center p-4">
          <TouchableOpacity
            onPress={() => router.push("/management/notice")}
            className="flex-row items-center bg-input border border-border rounded-lg px-3 py-2 mr-2"
          >
            <Typography className="text-primary font-semibold">← Back</Typography>
          </TouchableOpacity>

          <Typography className="text-lg font-bold text-foreground">New Section</Typography>
        </View>
        <View className="px-4 py-4 ">
        
          <View>
            <Typography className="text-2xl font-bold text-gray-900 ">Create Notice</Typography>
            <Typography className="text-sm mt-1 text-gray-600 ">Send notice to students</Typography>
          </View>
        </View>

        <View className="px-4 pb-6 space-y-6">
          {/* Notice Details Card */}
          <View className="rounded-lg p-4 border border-gray-200  bg-white ">
            <Typography className="text-lg font-semibold mb-4 text-gray-900 ">Notice Details</Typography>

            {/* Title Field */}
            <View className="mb-4">
              <Typography className="text-sm font-medium text-gray-700  mb-2">
                Title <Text className="text-red-500">*</Text>
              </Typography>
              <TextInput
                placeholder="Enter notice title"
                placeholderTextColor="#9ca3af"
                value={values.title}
                onChangeText={handleChange("title")}
                className="px-3 py-2 rounded-lg border border-gray-300  bg-gray-50  text-gray-900 "
              />
              {touched.title && errors.title && (
                <Typography className="text-xs text-red-600 mt-1">{errors.title}</Typography>
              )}
            </View>

            {/* Message Field */}
            <View className="mb-4">
              <Typography className="text-sm font-medium text-gray-700  mb-2">
                Message <Text className="text-red-500">*</Text>
              </Typography>
              <TextInput
                placeholder="Enter notice message"
                placeholderTextColor="#9ca3af"
                value={values.message}
                onChangeText={handleChange("message")}
                multiline
                numberOfLines={4}
                className="px-3 py-2 rounded-lg border border-gray-300  bg-gray-50  text-gray-900 "
              />
              {touched.message && errors.message && (
                <Typography className="text-xs text-red-600 mt-1">{errors.message}</Typography>
              )}
            </View>
          </View>

          {/* Audience Selection Card */}
          <View className="rounded-lg mt-3 p-4 border border-gray-200  bg-white ">
            <Typography className="text-lg font-semibold mb-4 text-gray-900 ">Send To</Typography>

            <AudienceOption title="School" value="ALL" description="Send to all students in the school" />
            <AudienceOption title="Class" value="CLASS" description="Send to all students in a specific class" />
            <AudienceOption title="Student" value="STUDENT" description="Send to selected students" />
          </View>

          {/* Class Selection */}
          {(values.audience_type === "CLASS" || values.audience_type === "STUDENT") && (
            <View className="rounded-lg p-4 mt-3 border border-gray-200  bg-white ">
              <Typography className="text-lg font-semibold mb-4 text-gray-900 ">
                Select Class <Text className="text-red-500">*</Text>
              </Typography>
              <RNPickerSelect
                items={classes?.map((cls) => ({ label: `${cls?.name} (${cls.classCode})`, value: cls?._id })) || []}
                onValueChange={updateClassChoose}
                value={currentClass?.value}
                placeholder={{ label: "Choose a class...", value: null }}
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
              {touched.class_ids && errors.class_ids && (
                <Typography className="text-xs text-red-600 mt-2">{errors.class_ids}</Typography>
              )}
            </View>
          )}

          {/* Student Selection */}
          {values.audience_type === "STUDENT" && (
            <View className="rounded-lg mt-3 p-4 border border-gray-200  bg-white ">
              <Typography className="text-lg font-semibold mb-4 text-gray-900 ">
                Select Students <Text className="text-red-500">*</Text>
              </Typography>

              {allStudent.length > 0 ? (
                <View>
                  <View className="flex-row mb-3 pb-3 border-b border-gray-200 ">
                    <Typography className="flex-1 text-xs font-semibold text-gray-600 ">
                      Roll
                    </Typography>
                    <Typography className="flex-1 text-xs font-semibold text-gray-600 ">
                      Name
                    </Typography>
                    <Typography className="flex-1 text-xs font-semibold text-gray-600 ">
                      Father
                    </Typography>
                    <Typography className="w-12 text-xs font-semibold text-gray-600 ">
                      Select
                    </Typography>
                  </View>

                  <FlatList
                    scrollEnabled={false}
                    data={allStudent}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                      <View className="flex-row items-center py-2 border-b border-gray-100 ">
                        <Typography className="flex-1 text-xs text-gray-900 ">
                          {item.roll_number || "--"}
                        </Typography>
                        <Typography className="flex-1 text-xs text-gray-900 ">
                          {item.first_name}
                        </Typography>
                        <Typography className="flex-1 text-xs text-gray-900 ">
                          {item.father_name}
                        </Typography>
                        <TouchableOpacity
                          onPress={() => studentSelectionHandle(item._id)}
                          className="w-12 items-center"
                        >
                          <MaterialCommunityIcons
                            name={values.student_ids.includes(item._id) ? "checkbox-marked" : "checkbox-blank-outline"}
                            size={20}
                            color={values.student_ids.includes(item._id) ? "#4f46e5" : "#9ca3af"}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                </View>
              ) : (
                <Typography className="text-sm text-gray-600 ">
                  Please select a class first
                </Typography>
              )}

              {touched.student_ids && errors.student_ids && (
                <Typography className="text-xs text-red-600 mt-2">{errors?.student_ids?.toString()}</Typography>
              )}
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            onPress={() => handleSubmit()}
            disabled={creating}
            className={cn("rounded-lg mt-5 p-4 items-center justify-center", creating ? "bg-gray-400" : "bg-indigo-600")}
          >
            {creating ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Typography className="text-white font-semibold">Create Notice</Typography>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
