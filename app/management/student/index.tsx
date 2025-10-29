"use client"

import { useEffect, useState } from "react"
import { View, ScrollView, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { getAllSchoolStudent } from "@/service/management/student"
import { PermitComponent } from "@/components/management/Authorization/PermitComponent"
import { Typography } from "@/components/Typography"

export default function StudentManagement() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  // const { } = useContext(UserAuthorization)

  const [allStudent, setAllStudent] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const getAllStudentRequest = async () => {
    setLoading(true)
    try {
      const students = await getAllSchoolStudent()
      setAllStudent(students)
    } catch (error) {
      Alert.alert("Error", "Failed to fetch students")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllStudentRequest()
  }, [])

  const StudentCard = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => router.push(`/management/student/view/${item?._id}`)}
      className="mb-3 bg-white rounded-lg border border-border bg-card p-4"
    >
      <View className="mb-3 flex-row items-start justify-between">
        <View className="flex-1">
          <Typography className="text-base font-semibold text-foreground">
            {item?.first_name?.substring(0, 15)}
          </Typography>
          <Typography className="mt-1 text-xs text-muted-foreground">Admission: {item?.admission_no}</Typography>
        </View>
        <TouchableOpacity
          onPress={() => router.push(`/management/student/view/${item?._id}`)}
          className="rounded-lg bg-primary px-3 py-2"
        >
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="eye" size={16} color="white" />
            <Typography className="ml-1 text-xs font-medium text-white">View</Typography>
          </View>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center justify-between">
        <View>
          <Typography className="text-xs text-muted-foreground">Father Name</Typography>
          <Typography className="mt-0.5 text-sm font-medium text-foreground">{item?.father_name || "--"}</Typography>
        </View>
        <View>
          <Typography className="text-xs text-muted-foreground">Class</Typography>
          <Typography className="mt-0.5 text-sm font-medium text-foreground">{item?.class_name || "--"}</Typography>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView className="flex-1 bg-background" >
      <ScrollView className="flex-1 bg-background">
        {/* Header */}
        <View className="border-b border-border px-4 py-4">
          <View className="mb-3 flex-row items-center justify-between">
            <View className="flex-1">
              <Typography className="text-2xl font-bold text-foreground">Student Management</Typography>
              <Typography className="mt-1.5 text-sm text-muted-foreground">
                View, search, and manage student records.
              </Typography>
            </View>

            <PermitComponent module={"STUDENT"} action={"ADMISSION"}>
              <TouchableOpacity
                onPress={() => router.push("/management/student/admission")}
                className="flex-row items-center rounded-lg border border-border bg-card px-3 py-2"
              >
                <Typography className="font-medium text-foreground">Add</Typography>
                <MaterialCommunityIcons name="account-plus" size={16} color="#10b981" className="ml-1" />
              </TouchableOpacity>
            </PermitComponent>
          </View>
        </View>

        {/* Student List */}
        <View className="px-4 py-4">
          {loading ? (
            <View className="flex-row items-center justify-center py-12">
              <ActivityIndicator size="large" color="#10b981" />
            </View>
          ) : allStudent.length > 0 ? (
            <FlatList
              scrollEnabled={false}
              data={allStudent}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => <StudentCard item={item} />}
            />
          ) : (
            <View className="items-center justify-center py-12">
              <MaterialCommunityIcons name="folder-open" size={48} color="#d1d5db" />
              <Typography className="mt-2 text-muted-foreground">No students found</Typography>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
