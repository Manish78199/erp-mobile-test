"use client"

import { useEffect, useMemo, useState } from "react"
import { View, Text, ScrollView, FlatList, ActivityIndicator, Alert, TouchableOpacity } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import RNPickerSelect from "react-native-picker-select"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { getAllClass } from "@/service/management/class/classBasic"
import { get_clas_exam_for_attendance } from "@/service/management/exam"
import { get_result_summary } from "@/service/management/result"

export default function ResultSummary() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const [allClass, setClass] = useState([])
  const [allExam, setExam] = useState([])
  const [currentClass, setCurrentClass] = useState(null)
  const [currentExam, setCurrentExam] = useState(null)
  const [allStudent, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const ClassListItem = useMemo(
    () => [
      { label: "-- Select Class --", value: null },
      ...allClass.map((item: any) => ({ label: item.name, value: item._id })),
    ],
    [allClass],
  )

  const ExamListItem = useMemo(
    () => [
      { label: "-- Select Exam --", value: null },
      ...allExam.map((item: any) => ({ label: `${item?.name} (${item?.session})`, value: item._id })),
    ],
    [allExam],
  )

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

  const handleClassChange = async (value: any) => {
    setCurrentClass(value)
    setCurrentExam(null)
    setStudents([])
    if (value) {
      try {
        const data = await get_clas_exam_for_attendance(value)
        setExam(data)
      } catch (error) {
        Alert.alert("Error", "Failed to fetch exams")
      }
    }
  }

  const handleExamChange = async (value: any) => {
    setCurrentExam(value)
    if (value) {
      setLoading(true)
      try {
        const data = await get_result_summary(value)
        setStudents(data)
      } catch (error) {
        Alert.alert("Error", "Failed to fetch results")
      } finally {
        setLoading(false)
      }
    }
  }

  const ResultCard = ({ item }: any) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/management/result/[student_id]/index",
          params: { student_id: item?.student_id },
        })
      }
      className="mb-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-1">
          <Text className="font-semibold text-gray-900 dark:text-white">{item?.full_name}</Text>
          <Text className="text-xs mt-1 text-gray-600 dark:text-gray-400">Admission: {item?.admission_no}</Text>
        </View>
        <View
          className={`px-3 py-1 rounded-full ${
            item?.status === "PASS" ? "bg-emerald-100 dark:bg-emerald-900" : "bg-red-100 dark:bg-red-900"
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              item?.status === "PASS" ? "text-emerald-700 dark:text-emerald-200" : "text-red-700 dark:text-red-200"
            }`}
          >
            {item?.status}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-xs text-gray-600 dark:text-gray-400">Percentage</Text>
          <Text className="text-lg font-bold text-gray-900 dark:text-white">{item?.percentage}%</Text>
        </View>
        <View>
          <Text className="text-xs text-gray-600 dark:text-gray-400">Marks</Text>
          <Text className="text-lg font-bold text-gray-900 dark:text-white">
            {item?.total_obtained}/{item?.total_max}
          </Text>
        </View>
        <View>
          <Text className="text-xs text-gray-600 dark:text-gray-400">Grade</Text>
          <Text className="text-lg font-bold text-gray-900 dark:text-white">{item?.grade || "NA"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-gray-900"
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-4 py-6 space-y-6">
        <View>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Result Summary</Text>
          <Text className="text-sm mt-1 text-gray-600 dark:text-gray-400">View result summary for students</Text>
        </View>

        <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
          <View>
            <Text className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Select Class</Text>
            <RNPickerSelect
              items={ClassListItem}
              onValueChange={handleClassChange}
              value={currentClass}
              placeholder={{ label: "Select Class", value: null }}
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

          <View>
            <Text className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Select Exam</Text>
            <RNPickerSelect
              items={ExamListItem}
              onValueChange={handleExamChange}
              value={currentExam}
              placeholder={{ label: "Select Exam", value: null }}
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
        </View>

        {currentExam && (
          <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <Text className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Results</Text>

            {loading ? (
              <View className="flex-row items-center justify-center py-8">
                <ActivityIndicator size="large" color="#10b981" />
              </View>
            ) : allStudent.length > 0 ? (
              <FlatList
                scrollEnabled={false}
                data={allStudent}
                keyExtractor={(item) => item.student_id}
                renderItem={({ item }) => <ResultCard item={item} />}
              />
            ) : (
              <View className="items-center justify-center py-8">
                <MaterialCommunityIcons name="folder-open" size={48} color="#d1d5db" />
                <Text className="text-gray-500 dark:text-gray-400 mt-2">No results found</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  )
}
