"use client"

import { useEffect, useMemo, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import RNPickerSelect from "react-native-picker-select"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Typography } from "@/components/Typography"
import { useClasses } from "@/hooks/management/classes"

// Mock API functions - replace with actual API calls
const getAllClass = async () => {
  return [
    { _id: "1", name: "Class 10-A" },
    { _id: "2", name: "Class 10-B" },
    { _id: "3", name: "Class 9-A" },
  ]
}

const createSubject = async (values: any) => {
  return { data: { message: "Subject created successfully" } }
}

const SubjectSchema = Yup.object().shape({
  name: Yup.string().required("Subject name is required"),
  code: Yup.string().required("Subject code is required"),
  class_id: Yup.string().required("Class is required"),
  subject_type: Yup.string().required("Subject type is required"),
  result_type: Yup.string().required("Result type is required"),
})

export default function CreateSubject() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const {classes}=useClasses()
  const [isCreating, setIsCreating] = useState(false)

  const classList = useMemo(() => [ ...classes.map((cls)=>({ label: `${cls?.name} (${cls?.classCode})`, value: cls?._id }))], [classes])


  const subjectInit = {
    class_id: "",
    name: "",
    code: "",
    subject_type: "THEORETICAL",
    result_type: "PERCENTAGE",
  }

  const createSubjectRequest = async (values: typeof subjectInit) => {
    setIsCreating(true)
    try {
      const response = await createSubject(values)
      Alert.alert("Success", response.data.message)
      router.push("/management/subject/add")
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.message || "Error creating subject")
    } finally {
      setIsCreating(false)
    }
  }

  const { values, errors, handleChange, handleSubmit, setFieldValue, touched } = useFormik<typeof subjectInit>({
    initialValues: subjectInit,
    onSubmit: createSubjectRequest,
    validationSchema: SubjectSchema,
  })

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="flex-1 bg-white dark:bg-gray-900"
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <View className="flex-row items-center p-4">
          <TouchableOpacity
            onPress={() => router.push("/management/subject")}
            className="flex-row items-center bg-input border border-border rounded-lg px-3 py-2 mr-2"
          >
            <Typography className="text-primary font-semibold">← Back</Typography>
          </TouchableOpacity>

          <Typography className=" font-bold text-foreground">New Subject</Typography>
        </View>

        <View className="px-4 py-6 space-y-6">

          <View>
            <Typography className="text-2xl font-bold text-gray-900 dark:text-white">Create Subject</Typography>
            <Typography className="text-sm mt-1 text-gray-600 dark:text-gray-400">Create class's subject</Typography>
          </View>

          <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
            <Typography className="text-lg font-semibold text-gray-900 dark:text-white">Subject Details</Typography>

            {/* Subject Name */}
            <View>
              <Typography className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Subject Name</Typography>
              <TextInput
                placeholder="Mathematics"
                placeholderTextColor="#9ca3af"
                value={values.name}
                onChangeText={(text) => handleChange("name")(text)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {errors.name && touched.name && <Typography className="mt-1 text-sm text-red-500">{errors.name}</Typography>}
            </View>

            {/* Subject Code */}
            <View>
              <Typography className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Subject Code</Typography>
              <TextInput
                placeholder="MATH102"
                placeholderTextColor="#9ca3af"
                value={values.code}
                onChangeText={(text) => handleChange("code")(text)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {errors.code && touched.code && <Typography className="mt-1 text-sm text-red-500">{errors.code}</Typography>}
            </View>

            {/* Subject Type */}
            <View>
              <Typography className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Subject Type</Typography>
              <RNPickerSelect
                items={[
                  { label: "Theoretical", value: "THEORETICAL" },
                  { label: "Practical", value: "PRACTICAL" },
                  { label: "Both", value: "BOTH" },
                ]}
                onValueChange={(value) => setFieldValue("subject_type", value)}
                value={values.subject_type}
                style={{
                  inputIOS: {
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#d1d5db",
                    backgroundColor: "#f9fafb",
                    color: "#000",
                  },
                  inputAndroid: {
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#d1d5db",
                    backgroundColor: "#f9fafb",
                    color: "#000",
                  },
                }}
              />
            </View>

            {/* Result Type */}
            <View>
              <Typography className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Result Type</Typography>
              <View className="space-y-2">
                {[
                  { name: "Grade", value: "GRADE" },
                  { name: "Percentage", value: "PERCENTAGE" },
                  { name: "GPA", value: "GPA" },
                  { name: "CGPA", value: "CGPA" },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => setFieldValue("result_type", option.value)}
                    className="flex-row items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  >
                    <View
                      className={`w-5 h-5 rounded-full border-2 items-center justify-center ${values.result_type === option.value
                        ? "border-emerald-600 bg-emerald-600"
                        : "border-gray-300 dark:border-gray-600"
                        }`}
                    >
                      {values.result_type === option.value && <View className="w-2 h-2 rounded-full bg-white" />}
                    </View>
                    <Typography className="ml-3 text-gray-900 dark:text-white font-medium">{option.name}</Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Class Selection */}
            <View>
              <Typography className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Class <Typography className="text-red-500">*</Typography>
              </Typography>
              <RNPickerSelect
                items={classList}
                onValueChange={(value) => setFieldValue("class_id", value)}
                value={values.class_id}
                placeholder={{ label: "-- Select Class --", value: "" }}
                style={{
                  inputIOS: {
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#d1d5db",
                    backgroundColor: "#f9fafb",
                    color: "#000",
                  },
                  inputAndroid: {
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#d1d5db",
                    backgroundColor: "#f9fafb",
                    color: "#000",
                  },
                }}
              />
              {errors.class_id && touched.class_id && (
                <Typography className="mt-1 text-sm text-red-500">{errors.class_id}</Typography>
              )}
            </View>

            {/* Submit Button */}
            <View className="flex-row items-center justify-end gap-3 mt-6">
              <TouchableOpacity
                onPress={() => router.push("/management/subject")}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
              >
                <Typography className="text-gray-700 dark:text-gray-300 font-medium">Cancel</Typography>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSubmit()}
                disabled={isCreating}
                className="px-4 py-2 rounded-lg bg-emerald-600 flex-row items-center gap-2"
              >
                {isCreating ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <MaterialCommunityIcons name="check" size={18} color="white" />
                    <Typography className="text-white font-medium">Add Subject</Typography>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
