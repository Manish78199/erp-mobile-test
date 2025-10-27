
import { useEffect, useState } from "react"
import { View, Text, ScrollView, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"

// Mock API functions - replace with actual API calls
const getAllSubject = async () => {
  return [
    {
      _id: "1",
      name: "Mathematics",
      code: "MATH101",
      class_name: "Class 10-A",
      result_type: "PERCENTAGE",
      subject_type: "THEORETICAL",
    },
    {
      _id: "2",
      name: "Physics",
      code: "PHY101",
      class_name: "Class 10-A",
      result_type: "GRADE",
      subject_type: "BOTH",
    },
    {
      _id: "3",
      name: "Chemistry",
      code: "CHEM101",
      class_name: "Class 10-B",
      result_type: "PERCENTAGE",
      subject_type: "PRACTICAL",
    },
  ]
}

const deleteSubject = async (subjectId: string) => {
  return { success: true }
}

export default function SubjectList() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const [allSubject, setAllSubject] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true)
        const subjects = await getAllSubject()
        setAllSubject(subjects)
      } catch (error) {
        Alert.alert("Error", "Failed to fetch subjects")
      } finally {
        setLoading(false)
      }
    }
    fetchSubjects()
  }, [])

  const handleDeleteSubject = (subjectId: string) => {
    Alert.alert("Delete Subject", "Are you sure you want to delete this subject?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Delete",
        onPress: async () => {
          const previousSubjects = allSubject
          const filtered = previousSubjects.filter((subject) => subject?._id !== subjectId)
          setAllSubject(filtered)
          setDeleting(subjectId)

          try {
            await deleteSubject(subjectId)
            Alert.alert("Success", "Subject deleted successfully")
          } catch (error: any) {
            setAllSubject(previousSubjects)
            Alert.alert("Error", error?.response?.data?.message || "Error deleting subject")
          } finally {
            setDeleting(null)
          }
        },
        style: "destructive",
      },
    ])
  }

  const SubjectCard = ({ subject }: any) => (
    <View className="mb-3 rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900 dark:text-white">{subject.name}</Text>
          <Text className="text-xs mt-1 text-gray-600 dark:text-gray-400">{subject.code}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteSubject(subject._id)}
          disabled={deleting === subject._id}
          className="p-2"
        >
          {deleting === subject._id ? (
            <ActivityIndicator size="small" color="#ef4444" />
          ) : (
            <MaterialCommunityIcons name="trash-can" size={20} color="#ef4444" />
          )}
        </TouchableOpacity>
      </View>

      <View className="space-y-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-gray-600 dark:text-gray-400">Class</Text>
          <Text className="text-sm font-medium text-gray-900 dark:text-white">{subject.class_name}</Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-gray-600 dark:text-gray-400">Result Type</Text>
          <View className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900">
            <Text className="text-xs font-medium text-blue-700 dark:text-blue-200">{subject.result_type}</Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-gray-600 dark:text-gray-400">Subject Type</Text>
          <View className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-900">
            <Text className="text-xs font-medium text-emerald-700 dark:text-emerald-200">{subject.subject_type}</Text>
          </View>
        </View>
      </View>
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
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">Course's Subjects</Text>
            <Text className="text-sm mt-1 text-gray-600 dark:text-gray-400">Manage Course's Subjects</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/create-subject")}
            className="flex-row items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600"
          >
            <MaterialCommunityIcons name="plus" size={18} color="white" />
            <Text className="text-sm font-medium text-white">Add</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-2">
          <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <MaterialCommunityIcons name="filter" size={18} color="#6b7280" />
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <MaterialCommunityIcons name="download" size={18} color="#6b7280" />
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Export</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="flex-row items-center justify-center py-12">
            <ActivityIndicator size="large" color="#10b981" />
          </View>
        ) : allSubject.length > 0 ? (
          <FlatList
            scrollEnabled={false}
            data={allSubject}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <SubjectCard subject={item} />}
          />
        ) : (
          <View className="items-center justify-center py-12">
            <MaterialIcons name="folder-open" size={48} color="#d1d5db" />
            <Text className="text-gray-500 dark:text-gray-400 mt-2">No subjects found</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}
