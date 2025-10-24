"use client"

import { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useFormik } from "formik"
import * as Yup from "yup"

// Validation Schema
const NoticeSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  message: Yup.string().required("Description is required"),
  audience_type: Yup.string().required("Audience type is required"),
  class_ids: Yup.array(),
  student_ids: Yup.array(),
})

export default function CreateNoticeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [allClass, setAllClass] = useState<any[]>([])
  const [allStudent, setAllStudent] = useState<any[]>([])
  const [creating, setCreating] = useState(false)
  const [classDropdownOpen, setClassDropdownOpen] = useState(false)
  const [currentClass, setCurrentClass] = useState<any>(null)

  useEffect(() => {
    const getAllClassRequest = async () => {
      try {
        // Replace with your actual API call
        // const classes = await getAllClass();
        // setAllClass(classes.map(item => ({ title: item.name, value: item._id })));

        // Mock data
        setAllClass([
          { title: "Class A", value: "1" },
          { title: "Class B", value: "2" },
          { title: "Class C", value: "3" },
        ])
      } catch (error) {
        console.error("Error fetching classes:", error)
      }
    }
    getAllClassRequest()
  }, [])

  const getClassStudent = async (class_id: string) => {
    if (!class_id) return
    try {
      // Replace with your actual API call
      // const students = await getStudentForAttendance(class_id, new Date().toISOString().split('T')[0]);
      // setAllStudent(students);

      // Mock data
      setAllStudent([
        { _id: "1", roll_number: "1", first_name: "John", father_name: "Smith" },
        { _id: "2", roll_number: "2", first_name: "Jane", father_name: "Doe" },
        { _id: "3", roll_number: "3", first_name: "Bob", father_name: "Johnson" },
      ])
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }

  const createNoticeRequest = async (values: any) => {
    setCreating(true)
    try {
      // Replace with your actual API call
      // await createNotice(values);
      // showAlert("SUCCESS", "Notice created successfully");

      console.log("Notice created:", values)
      router.back()
    } catch (error) {
      console.error("Error creating notice:", error)
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
      student_ids: [],
    },
    validationSchema: NoticeSchema,
    onSubmit: createNoticeRequest,
  })

  const studentSelectionHandle = (student_id: string) => {
    if (values.student_ids.includes(student_id)) {
      setFieldValue(
        "student_ids",
        values.student_ids.filter((id) => id !== student_id),
      )
    } else {
      setFieldValue("student_ids", [...values.student_ids, student_id])
    }
  }

  const updateClassChoose = (classItem: any) => {
    setCurrentClass(classItem)
    setClassDropdownOpen(false)
    if (values.audience_type === "CLASS") {
      setFieldValue("class_ids", [classItem.value])
    } else if (values.audience_type === "STUDENT") {
      getClassStudent(classItem.value)
    }
  }

  const changeAudienceHandler = (value: string) => {
    setFieldValue("audience_type", value)
    setFieldValue("student_ids", [])
    setFieldValue("class_ids", [])
    setCurrentClass(null)
  }

  const AudienceOption = ({ title, value, description }: any) => (
    <TouchableOpacity
      onPress={() => changeAudienceHandler(value)}
      className={`p-4 rounded-lg border-2 mb-3 ${
        values.audience_type === value ? "border-indigo-600 bg-indigo-600/10" : "border-slate-700 bg-slate-800"
      }`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-white font-semibold">{title}</Text>
          <Text className="text-slate-400 text-sm mt-1">{description}</Text>
        </View>
        <View
          className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
            values.audience_type === value ? "border-indigo-600 bg-indigo-600" : "border-slate-600"
          }`}
        >
          {values.audience_type === value && <MaterialIcons name="check" size={16} color="white" />}
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View className="flex-1 bg-slate-900" style={{ paddingTop: insets.top }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={["#4f46e5", "#6366f1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-4 py-6"
        >
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Create Notice</Text>
          <Text className="text-indigo-100 text-sm mt-1">Send announcement to students</Text>
        </LinearGradient>

        {/* Form */}
        <View className="px-4 py-6">
          {/* Title Field */}
          <View className="mb-5">
            <Text className="text-slate-300 text-sm font-medium mb-2">
              Title <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              placeholder="Enter notice title"
              placeholderTextColor="#64748b"
              value={values.title}
              onChangeText={(text) => setFieldValue("title", text)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
            />
            {touched.title && errors.title && <Text className="text-red-500 text-xs mt-1">{errors.title}</Text>}
          </View>

          {/* Description Field */}
          <View className="mb-5">
            <Text className="text-slate-300 text-sm font-medium mb-2">
              Description <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              placeholder="Enter notice description"
              placeholderTextColor="#64748b"
              value={values.message}
              onChangeText={(text) => setFieldValue("message", text)}
              multiline
              numberOfLines={4}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
              textAlignVertical="top"
            />
            {touched.message && errors.message && <Text className="text-red-500 text-xs mt-1">{errors.message}</Text>}
          </View>

          {/* Send To Section */}
          <View className="mb-5">
            <Text className="text-slate-300 text-sm font-medium mb-3">Send To:</Text>
            <AudienceOption title="SCHOOL" value="ALL" description="Send to all students" />
            <AudienceOption title="CLASS" value="CLASS" description="Send to class's all students" />
            <AudienceOption title="STUDENT" value="STUDENT" description="Send to selected students" />
          </View>

          {/* Class Selection */}
          {(values.audience_type === "CLASS" || values.audience_type === "STUDENT") && (
            <View className="mb-5">
              <Text className="text-slate-300 text-sm font-medium mb-2">
                Class <Text className="text-red-500">*</Text>
              </Text>
              <TouchableOpacity
                onPress={() => setClassDropdownOpen(!classDropdownOpen)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 flex-row justify-between items-center"
              >
                <Text className="text-white">{currentClass?.title || "Select Class"}</Text>
                <MaterialIcons name={classDropdownOpen ? "expand-less" : "expand-more"} size={20} color="#94a3b8" />
              </TouchableOpacity>

              {classDropdownOpen && (
                <View className="bg-slate-800 border border-slate-700 rounded-lg mt-2 max-h-48">
                  <FlatList
                    data={allClass}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => updateClassChoose(item)}
                        className="px-4 py-3 border-b border-slate-700"
                      >
                        <Text className="text-white">{item.title}</Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.value}
                    scrollEnabled={false}
                  />
                </View>
              )}
            </View>
          )}

          {/* Student Selection */}
          {values.audience_type === "STUDENT" && (
            <View className="mb-5">
              <Text className="text-slate-300 text-sm font-medium mb-3">Select Students to Send Notice</Text>
              <View className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
                {/* Header */}
                <View className="flex-row bg-slate-700 px-4 py-3">
                  <Text className="flex-1 text-slate-300 text-xs font-medium">Roll</Text>
                  <Text className="flex-1 text-slate-300 text-xs font-medium">Name</Text>
                  <Text className="flex-1 text-slate-300 text-xs font-medium">Father</Text>
                  <Text className="w-12 text-slate-300 text-xs font-medium">Select</Text>
                </View>

                {/* Student List */}
                <FlatList
                  data={allStudent}
                  renderItem={({ item }) => (
                    <View className="flex-row px-4 py-3 border-b border-slate-700 items-center">
                      <Text className="flex-1 text-slate-300 text-sm">{item.roll_number || "--"}</Text>
                      <Text className="flex-1 text-slate-300 text-sm">{item.first_name}</Text>
                      <Text className="flex-1 text-slate-300 text-sm">{item.father_name}</Text>
                      <TouchableOpacity onPress={() => studentSelectionHandle(item._id)} className="w-12 items-center">
                        <View
                          className={`w-5 h-5 rounded border-2 items-center justify-center ${
                            values.student_ids.includes(item._id )
                              ? "bg-indigo-600 border-indigo-600"
                              : "border-slate-600"
                          }`}
                        >
                          {values.student_ids.includes(item._id) && (
                            <MaterialIcons name="check" size={14} color="white" />
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                  keyExtractor={(item) => item._id}
                  scrollEnabled={false}
                />
              </View>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            onPress={() => handleSubmit()}
            disabled={creating}
            className={`py-3 rounded-lg items-center justify-center mb-6 ${
              creating ? "bg-indigo-600/50" : "bg-indigo-600"
            }`}
          >
            {creating ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold">Create Notice</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}
