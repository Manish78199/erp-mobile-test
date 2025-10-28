
import { useContext, useEffect, useState } from "react"
import { View, Text, ScrollView, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { get_all_exam } from "@/service/management/exam"
import {result_declare} from "@/service/management/result"
import { AlertContext } from "@/context/Alert/context"

export default function ExamList() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { showAlert } = useContext(AlertContext)

  const [examList, setExamList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [declaring, setDeclaring] = useState<string | null>(null)

  const getExamList = async () => {
    setLoading(true)
    try {
      const exams = await get_all_exam()
      setExamList(exams)
    } catch (error) {
      Alert.alert("Error", "Failed to fetch exams")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getExamList()
  }, [])

  const handleDeclareResult = async (examId: string) => {
    setDeclaring(examId)
    try {
      await result_declare(examId)
      showAlert("SUCCESS", "Result Declared Successfully")
      getExamList()
    } catch (error: any) {
      showAlert("ERROR", error?.response?.data?.message || "Result declaration failed")
    } finally {
      setDeclaring(null)
    }
  }

  const ExamCard = ({ item }: any) => (
    <View className="mb-3 p-4 rounded-lg border border-gray-200  bg-white ">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1">
          <Text className="font-semibold text-gray-900 ">{item?.name}</Text>
          <Text className="text-xs mt-1 text-gray-600 ">
            {item?.class_name} • {item?.session}
          </Text>
        </View>
        <View
          className={`px-3 py-1 rounded-full ${
            item?.result_declare ? "bg-emerald-100 dark:bg-emerald-900" : "bg-yellow-100 dark:bg-yellow-900"
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              item?.result_declare ? "text-emerald-700 dark:text-emerald-200" : "text-yellow-700 dark:text-yellow-200"
            }`}
          >
            {item?.result_declare ? "Declared" : "Pending"}
          </Text>
        </View>
      </View>

      {!item?.result_declare && (
        <TouchableOpacity
          onPress={() => handleDeclareResult(item?._id)}
          disabled={declaring === item?._id}
          className="flex-row items-center justify-center p-2 rounded-lg bg-emerald-600 dark:bg-emerald-700"
        >
          {declaring === item?._id ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <MaterialCommunityIcons name="check-circle" size={16} color="white" />
              <Text className="ml-2 font-medium text-white text-sm">Declare Result</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  )

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-gray-900"
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-4 py-6 space-y-6">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-900 ">Exams</Text>
            <Text className="text-sm mt-1 text-gray-600 ">Manage exams</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/management/exam/create")}
            className="p-2 rounded-lg bg-emerald-600 dark:bg-emerald-700"
          >
            <MaterialCommunityIcons name="plus" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="flex-row items-center justify-center py-12">
            <ActivityIndicator size="large" color="#10b981" />
          </View>
        ) : examList.length > 0 ? (
          <FlatList
            scrollEnabled={false}
            data={examList}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <ExamCard item={item} />}
          />
        ) : (
          <View className="items-center justify-center py-12">
            <MaterialCommunityIcons name="folder-open" size={48} color="#d1d5db" />
            <Text className="text-gray-500  mt-2">No exams found</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}
