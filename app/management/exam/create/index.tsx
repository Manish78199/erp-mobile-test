"use client"

import { useContext, useEffect, useMemo, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import RNPickerSelect from "react-native-picker-select"
import { useFormik } from "formik"
import * as Yup from "yup"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { getAllClass } from "@/service/management/class/classBasic"
import {  createExam } from "@/service/management/exam"
import {getClassSubject} from "@/service/management/subject"
import { AlertContext } from "@/context/Alert/context"

const ExamSchema = Yup.object().shape({
  name: Yup.string().required("Exam name is required"),
  class_id: Yup.string().required("Class is required"),
  duration: Yup.number().required("Duration is required").positive(),
  subjects: Yup.array().min(1, "At least one subject is required"),
})

export default function CreateExam() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { showAlert } = useContext(AlertContext)

  const [allClass, setClass] = useState([])
  const [allSubject, setAllSubject] = useState([])
  const [isCreating, setCreating] = useState(false)

  const classList = useMemo(
    () => [
      { label: "-- Select Class --", value: "" },
      ...allClass.map((item: any) => ({ label: item.name, value: item._id })),
    ],
    [allClass],
  )

  const subjectList = useMemo(
    () => [
      { label: "-- Select Subject --", value: "" },
      ...allSubject.map((item: any) => ({ label: `${item.name} (${item.code})`, value: item._id })),
    ],
    [allSubject],
  )

  const [values, setValues] = useState({
    name: "",
    duration: "",
    class_id: "",
    subjects: [] as any[],
  })

  useEffect(() => {
    const getAllClassRequest = async () => {
      try {
        const classes = await getAllClass()
        setClass(classes)
      } catch (error) {
        Alert.alert("Error", "Failed to fetch classes")
      }
    }
    getAllClassRequest()
  }, [])

  useEffect(() => {
    const getAllSubjectRequest = async () => {
      if (values.class_id) {
        try {
          const subjects = await getClassSubject(values.class_id)
          setAllSubject(subjects)
        } catch (error) {
          Alert.alert("Error", "Failed to fetch subjects")
        }
      }
    }
    getAllSubjectRequest()
  }, [values.class_id])

  const { errors, touched, handleChange, setFieldValue, handleSubmit } = useFormik({
    initialValues: values,
    validationSchema: ExamSchema,
    onSubmit: async (data) => {
      setCreating(true)
      try {
        await createExam(data)
        showAlert("SUCCESS", "Exam created successfully")
        router.back()
      } catch (error: any) {
        showAlert("ERROR", error?.response?.data?.message || "Exam creation failed")
      } finally {
        setCreating(false)
      }
    },
  })

  const handleAddSubject = () => {
    const newSubject = {
      subject_id: "",
      max_practical: 0,
      min_practical: 0,
      max_theory: 0,
      min_theory: 0,
      schedule_at: new Date().toISOString(),
    }
    setFieldValue("subjects", [...values.subjects, newSubject])
  }

  const handleRemoveSubject = (index: number) => {
    setFieldValue(
      "subjects",
      values.subjects.filter((_, i) => i !== index),
    )
  }

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-gray-900"
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-4 py-6 space-y-6">
        <View>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Create Exam</Text>
          <Text className="text-sm mt-1 text-gray-600 dark:text-gray-400">Add a new exam with subjects and marks</Text>
        </View>

        <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
          <View>
            <Text className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Exam Name *</Text>
            <TextInput
              placeholder="Enter exam name"
              placeholderTextColor="#9ca3af"
              value={values.name}
              onChangeText={(text) => setFieldValue("name", text)}
              className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            {errors.name && touched.name && <Text className="text-red-600 text-xs mt-1">{errors.name}</Text>}
          </View>

          <View>
            <Text className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Class *</Text>
            <RNPickerSelect
              items={classList}
              onValueChange={(value) => setFieldValue("class_id", value)}
              value={values.class_id}
              placeholder={{ label: "Select Class", value: "" }}
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
            {errors.class_id && touched.class_id && (
              <Text className="text-red-600 text-xs mt-1">{errors.class_id}</Text>
            )}
          </View>

          <View>
            <Text className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Duration (Minutes) *</Text>
            <TextInput
              placeholder="90"
              placeholderTextColor="#9ca3af"
              value={values.duration}
              onChangeText={(text) => setFieldValue("duration", text)}
              keyboardType="numeric"
              className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            {errors.duration && touched.duration && (
              <Text className="text-red-600 text-xs mt-1">{errors.duration}</Text>
            )}
          </View>
        </View>

        <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">Subjects</Text>
            <View className="bg-blue-600 px-2 py-1 rounded-full">
              <Text className="text-white text-xs font-semibold">{values.subjects.length}</Text>
            </View>
          </View>

          {values.subjects.map((subject, index) => (
            <View
              key={index}
              className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
            >
              <View className="flex-row items-center justify-between mb-3">
                <Text className="font-medium text-gray-900 dark:text-white">Subject {index + 1}</Text>
                <TouchableOpacity onPress={() => handleRemoveSubject(index)}>
                  <MaterialCommunityIcons name="close-circle" size={20} color="#dc2626" />
                </TouchableOpacity>
              </View>

              <View>
                <Text className="text-xs font-medium mb-2 text-gray-700 dark:text-gray-300">Select Subject</Text>
                <RNPickerSelect
                  items={subjectList}
                  onValueChange={(value) => {
                    const newSubjects = [...values.subjects]
                    newSubjects[index].subject_id = value
                    setFieldValue("subjects", newSubjects)
                  }}
                  value={subject.subject_id}
                  placeholder={{ label: "Select Subject", value: "" }}
                  style={{
                    inputIOS: {
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: "#d1d5db",
                      backgroundColor: "#fff",
                      color: "#000",
                      fontSize: 14,
                    },
                    inputAndroid: {
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: "#d1d5db",
                      backgroundColor: "#fff",
                      color: "#000",
                      fontSize: 14,
                    },
                  }}
                />
              </View>
            </View>
          ))}

          <TouchableOpacity
            onPress={handleAddSubject}
            className="p-3 rounded-lg border-2 border-dashed border-blue-400 dark:border-blue-600 items-center justify-center"
          >
            <MaterialCommunityIcons name="plus" size={20} color="#3b82f6" />
            <Text className="text-blue-600 dark:text-blue-400 font-medium text-sm mt-1">Add Subject</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => handleSubmit()}
          disabled={isCreating}
          className="p-4 rounded-lg bg-emerald-600 dark:bg-emerald-700 items-center justify-center"
        >
          {isCreating ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-semibold">Create Exam</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
