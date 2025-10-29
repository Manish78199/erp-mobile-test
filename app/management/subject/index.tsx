
import { useEffect, useState } from "react"
import { View, Text, ScrollView, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import { useSubjects } from "@/hooks/management/subject"
import { deleteSubject } from "@/service/management/subject"
import { Typography } from "@/components/Typography"

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


export default function SubjectList() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const { data: allSubject, isError, isLoading } = useSubjects()

  const [deleting, setDeleting] = useState<string | null>(null)


  const handleDeleteSubject = (subjectId: string) => {
    Alert.alert("Delete Subject", "Are you sure you want to delete this subject?", [
      { text: "Cancel", onPress: () => { } },
      {
        text: "Delete",
        onPress: async () => {
          const previousSubjects = allSubject
          const filtered = previousSubjects.filter((subject) => subject?._id !== subjectId)

          setDeleting(subjectId)

          try {
            await deleteSubject(subjectId)
            Alert.alert("Success", "Subject deleted successfully")
          } catch (error: any) {
            // setAllSubject(previousSubjects)
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
    <View className="mb-3 rounded-lg p-4 border border-gray-200  bg-white ">
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Typography className="text-base font-semibold text-gray-900 ">{subject.name}</Typography>
          <Typography className="text-xs mt-1 text-gray-600 ">{subject.code}</Typography>
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
          <Typography className="text-xs text-gray-600 ">Class</Typography>
          <Typography className="text-sm font-medium text-gray-900 ">{subject.class_name}</Typography>
        </View>
        <View className="flex-row items-center justify-between mt-1">
          <Typography className="text-xs text-gray-600 ">Result Type</Typography>
          <View className="px-2 py-1 rounded bg-blue-100 ">
            <Typography className="text-xs font-medium text-blue-700 ">{subject.result_type}</Typography>
          </View>
        </View>
        <View className="flex-row items-center justify-between mt-1">
          <Typography className="text-xs text-gray-600 ">Subject Type</Typography>
          <View className="px-2 py-1 rounded bg-emerald-100">
            <Typography className="text-xs font-medium text-emerald-700 ">{subject.subject_type}</Typography>
          </View>
        </View>
      </View>
    </View>
  )

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="flex-1 bg-background "
        
      >

        <View className="flex-row items-center p-4">
          <TouchableOpacity
            onPress={() => router.push("/management")}
            className="flex-row items-center bg-input border border-border rounded-lg px-3 py-2 mr-2"
          >
            <Typography className="text-primary font-semibold">← Back</Typography>
          </TouchableOpacity>

          <Typography className="text-lg font-bold text-foreground">Subjects</Typography>
        </View>
        <View className="px-4 py-6 space-y-6">
          <View className="flex-row items-center justify-between">
            <View>
              <Typography className="text-2xl font-bold text-gray-900 ">Course's Subjects</Typography>
              <Typography className="text-sm mt-1 text-gray-600 ">Manage Course's Subjects</Typography>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/management/subject/add")}
              className="flex-row items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600"
            >
              <MaterialCommunityIcons name="plus" size={18} color="white" />
              <Typography className="text-sm font-medium text-white">Add</Typography>
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-2 mb-3 mt-2">
            <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200  bg-white ">
              <MaterialCommunityIcons name="filter" size={18} color="#6b7280" />
              <Typography className="text-sm font-medium text-gray-700 ">Filter</Typography>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200  bg-white ">
              <MaterialCommunityIcons name="download" size={18} color="#6b7280" />
              <Typography className="text-sm font-medium text-gray-700 ">Export</Typography>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View className="flex-row items-center justify-center py-12">
              <ActivityIndicator size="large" color="#10b981" />
            </View>
          ) : allSubject.length > 0 ? (
            <FlatList
              scrollEnabled={false}
              data={allSubject}
              keyExtractor={(item) => item?._id}
              renderItem={({ item }) => <SubjectCard subject={item} />}
            />
          ) : (
            <View className="items-center justify-center py-12">
              <MaterialIcons name="folder-open" size={48} color="#d1d5db" />
              <Typography className="text-gray-500  mt-2">No subjects found</Typography>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
