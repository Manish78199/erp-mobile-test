"use client"

import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  useColorScheme,
  ScrollView,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons"
import { getAllSchoolStudent } from "@/service/management/student"
import { PermitComponent } from "@/components/management/Authorization/PermitComponent"

interface Student {
  _id: string
  admission_no: string
  first_name: string
  father_name: string
  class_name: string
}

export default function StudentManagementScreen() {
  const [allStudents, setAllStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Student
    direction: "asc" | "desc"
  } | null>(null)

  const router = useRouter()
  const insets = useSafeAreaInsets()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  const getAllStudentRequest = async () => {
    try {
      setLoading(true)
      const students = await getAllSchoolStudent()
      setAllStudents(students || [])
    } catch (error) {
      Alert.alert("Error", "Failed to fetch students")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllStudentRequest()
  }, [])

  const handleSort = (key: keyof Student) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const sortedStudents = React.useMemo(() => {
    if (!sortConfig) return allStudents

    const sorted = [...allStudents].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })

    return sorted
  }, [allStudents, sortConfig])

  const renderStudentRow = ({ item }: { item: Student }) => (
    <View className="border-b border-border bg-card">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} scrollEnabled={true}>
        <View className="flex-row">
          {/* Admission No */}
          <View className=" px-4 py-4 justify-center border-r border-border">
            <Text className="text-xs text-muted-foreground mb-1">Admission No.</Text>
            <Text className="text-sm font-medium text-foreground">{item.admission_no}</Text>
          </View>

          {/* Name */}
          <View className=" px-4 py-4 justify-center border-r border-border">
            <Text className="text-xs text-muted-foreground mb-1">Name</Text>
            <Text className="text-sm font-medium text-foreground">{item.first_name.substring(0, 20)}</Text>
          </View>

          {/* Father Name */}
          <View className=" px-4 py-4 justify-center border-r border-border">
            <Text className="text-xs text-muted-foreground mb-1">Father Name</Text>
            <Text className="text-sm font-medium text-foreground">{item.father_name}</Text>
          </View>

          {/* Class */}
          <View className=" px-4 py-4 justify-center border-r border-border">
            <Text className="text-xs text-muted-foreground mb-1">Class</Text>
            <Text className="text-sm font-medium text-foreground">{item.class_name}</Text>
          </View>

          {/* View Button */}
          <TouchableOpacity
            onPress={() => router.push(`/management/student/view/${item._id}`)}
            className="w-28 px-4 py-4 justify-center items-center bg-primary/10"
          >
            <MaterialIcons name="visibility" size={18} color={isDark ? "#3b82f6" : "#2563eb"} />
            <Text className="text-xs font-medium text-primary mt-1">View</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )

  const renderColumnHeader = (label: string, key: keyof Student, width: number, sortable = false) => (
    <TouchableOpacity
      onPress={() => sortable && handleSort(key)}
      className={`px-4 py-3 justify-center border-r border-border ${sortable ? "active:bg-muted" : ""}`}
      style={{ width }}
      disabled={!sortable}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-semibold text-foreground flex-1">{label}</Text>
        {sortable && sortConfig?.key === key && (
          <MaterialIcons
            name={sortConfig.direction === "asc" ? "arrow-upward" : "arrow-downward"}
            size={14}
            color={isDark ? "#e5e7eb" : "#374151"}
            style={{ marginLeft: 4 }}
          />
        )}
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }} className="flex-1 bg-background">
      {/* Header Section */}
      <View className="px-4 py-6 border-b border-border">
        <Text className="text-2xl font-bold text-foreground">Student Management</Text>
        <Text className="text-sm text-muted-foreground mt-2">View, search, and manage student records.</Text>

        {/* Add Student Button */}
        <PermitComponent module="STUDENT" action="ADMISSION">
          <TouchableOpacity
            onPress={() => router.push("/management/student/admission")}
            className="mt-4 flex-row items-center justify-center bg-primary rounded-lg px-4 py-3"
          >
            <MaterialCommunityIcons name="account-plus" size={18} color="#fff" />
            <Text className="text-white font-semibold ml-2">Add Student</Text>
          </TouchableOpacity>
        </PermitComponent>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        scrollEnabled={true}
        className="bg-card border-b border-border"
      >
        <View className="flex-row">
          {renderColumnHeader("Admission No.", "admission_no", 128, true)}
          {renderColumnHeader("Name", "first_name", 160, true)}
          {renderColumnHeader("Father Name", "father_name", 160, true)}
          {renderColumnHeader("Class", "class_name", 128, true)}
          <View className="w-28 px-4 py-3 justify-center items-center border-r border-border">
            <Text className="text-xs font-semibold text-foreground">Action</Text>
          </View>
        </View>
      </ScrollView>

      {/* Students List */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={isDark ? "#e5e7eb" : "#374151"} />
        </View>
      ) : allStudents.length === 0 ? (
        <View className="flex-1 justify-center items-center px-4">
          <MaterialIcons name="people-outline" size={48} color={isDark ? "#6b7280" : "#d1d5db"} />
          <Text className="text-lg font-semibold text-foreground mt-4">No Students Found</Text>
          <Text className="text-sm text-muted-foreground text-center mt-2">Add a new student to get started.</Text>
        </View>
      ) : (
        <FlatList
          data={sortedStudents}
          renderItem={renderStudentRow}
          keyExtractor={(item) => item._id}
          scrollEnabled={true}
        />
      )}
    </View>
  )
}
