"use client"

import { useEffect, useMemo, useState } from "react"
import { View, Text, ScrollView, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert, RefreshControl } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import RNPickerSelect from "react-native-picker-select"
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import { cn } from "@/utils/cn"
import { useClasses } from "@/hooks/management/classes"
import { useClassSections, useSections } from "@/hooks/management/section"
import { Plus } from "lucide-react-native"
import { Typography } from "@/components/Typography"

// Mock API functions - replace with actual API calls
const getAllSections = async () => {
  return [
    {
      _id: "1",
      name: "A",
      code: "10A",
      class_name: "Class 10",
      room_no: "101",
      capacity: 45,
      total_students: 42,
      teacher_name: "Mr. Smith",
      is_active: true,
      description: "Main section for class 10",
    },
    {
      _id: "2",
      name: "B",
      code: "10B",
      class_name: "Class 10",
      room_no: "102",
      capacity: 45,
      total_students: 38,
      teacher_name: "Ms. Johnson",
      is_active: true,
      description: "Secondary section for class 10",
    },
    {
      _id: "3",
      name: "A",
      code: "9A",
      class_name: "Class 9",
      room_no: "201",
      capacity: 50,
      total_students: 48,
      teacher_name: "Mr. Brown",
      is_active: true,
      description: "Main section for class 9",
    },
  ]
}

const getAllClasses = async () => {
  return [
    { _id: "1", name: "Class 10" },
    { _id: "2", name: "Class 9" },
    { _id: "3", name: "Class 8" },
  ]
}

export default function SectionAttendance() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { classes } = useClasses()
  const { sections } = useSections()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState("all")
  const [loading, setLoading] = useState(false)

  const classList = useMemo(() => {
    const mapped = classes.map((item) => ({
      label: `${item?.name} (${item?.classCode})`,
      value: item?._id,
    }))
    return [{ label: "All Classes", value: "all" }, ...mapped]
  }, [classes])

  const filteredSections = useMemo(() => {
    let filtered = sections

    if (searchTerm) {
      filtered = filtered.filter(
        (section: any) =>
          section.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          section.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          section.class_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          section.teacher_name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedClass !== "all") {
      filtered = filtered.filter((section) => section.class_name === classes.find((c) => c._id === selectedClass)?.name)
    }

    return filtered
  }, [sections, searchTerm, selectedClass, classes])


  const getCapacityColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100
    if (percentage >= 90) return "text-red-600 dark:text-red-400"
    if (percentage >= 75) return "text-orange-600 dark:text-orange-400"
    return "text-emerald-600 dark:text-emerald-400"
  }

  const getCapacityBgColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100
    if (percentage >= 90) return "bg-red-500"
    if (percentage >= 75) return "bg-orange-500"
    return "bg-emerald-500"
  }


  const StatCard = ({ icon, title, value, color }: any) => (
    <View className={cn("flex-1 rounded-lg p-3 border border-gray-200  bg-white ")}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Typography className="text-xs font-medium mb-1 text-gray-600 ">{title}</Typography>
          <Typography className="text-lg font-bold text-gray-900 ">{value}</Typography>
        </View>
        <View className={cn("p-2 rounded-lg", color)}>
          <MaterialCommunityIcons name={icon} size={16} color="white" />
        </View>
      </View>
    </View>
  )

  const SectionCard = ({ section }: any) => (
    <View className="mb-4 rounded-lg p-4 border border-gray-200  bg-white ">
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Typography className="text-lg font-semibold text-gray-900 ">Section {section.name} </Typography>
          <Typography className="text-sm mt-1 text-gray-600 ">{section?.class_name}</Typography>
        </View>
        <View
          className={cn(
            "px-3 py-1 rounded-full",
            section.is_active ? "bg-emerald-100" : "bg-red-100 ",
          )}
        >
          <Typography
            className={cn(
              "text-xs font-medium",
              section.is_active ? "text-emerald-700" : "text-red-700",
            )}
          >
            {section.is_active ? "Active" : "Inactive"}
          </Typography>
        </View>
      </View>

      <View className="space-y-3">
        <View className="flex-row items-center gap-2">
          <MaterialCommunityIcons name="map-marker" size={16} color="#6b7280" />
          <Typography className="text-sm text-gray-700 ">Room {section.room_no}</Typography>
        </View>

        <View className="flex-row mt-2 items-center gap-2">
          <MaterialCommunityIcons name="account-multiple" size={16} color="#6b7280" />
          <Typography className={cn("text-sm font-medium", getCapacityColor(section.total_students, section.capacity))}>
            {section.total_students}/{section.capacity} Students
          </Typography>
        </View>

        <View className="w-full bg-gray-200 mt-2 rounded-full h-2">
          <View
            className={cn("h-2 rounded-full", getCapacityBgColor(section.total_students, section.capacity))}
            style={{ width: `${(section.total_students / section.capacity) * 100}%` }}
          />
        </View>

        <View className="mt-1">
          <Typography className="text-xs font-semibold text-gray-600  mb-1">Class Teacher</Typography>
          <Typography className="text-sm font-medium text-gray-900 ">{section.teacher_name}</Typography>
        </View>

        {section.description && (
          <View className="mt-1">
            <Typography className="text-xs font-semibold text-gray-600  mb-1">Description</Typography>
            <Typography className="text-sm text-gray-700 ">{section.description}</Typography>
          </View>
        )}

        <View className="flex-row gap-2 pt-2">
          <TouchableOpacity
            onPress={() => router.push(`/management/section/students`)}
            className="flex-1 rounded-lg p-3 border border-gray-200  bg-white "
          >
            <View className="flex-row items-center justify-center gap-2">
              <MaterialCommunityIcons name="account-check" size={16} color="#10b981" />
              <Typography className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Manage Student</Typography>
            </View>
          </TouchableOpacity>

          {/* <TouchableOpacity
            onPress={() => router.push(`/section-details/${section._id}`)}
            className="flex-1 rounded-lg p-3 border border-gray-200  bg-white "
          >
            <View className="flex-row items-center justify-center gap-2">
              <MaterialCommunityIcons name="information" size={16} color="#6366f1" />
              <Typography className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Details</Typography>
            </View>
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  )

  return (
    <SafeAreaView className="flex-1">
      <ScrollView

        className="flex-1 bg-background"
       
      >
        <View className="flex-row items-center p-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center bg-input border border-border rounded-lg px-3 py-2 mr-2"
          >
            <Typography className="text-primary font-semibold">← Back</Typography>
          </TouchableOpacity>

          <Typography className="text-lg font-bold text-foreground">Sections</Typography>
        </View>
        <View className="px-4 mt-3 pb-6 space-y-6">
          {/* Header */}
          <View className=" flex-row item-center justify-between">
            <View>
              <Typography className="text-2xl font-bold text-gray-900 ">Section Management</Typography>
              <Typography className="text-sm mt-1 text-gray-600 ">Manage sections and student </Typography>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/management/section/create")}
              className="bg-primary text-white rounded-lg p-3 ml-2"
            >
              <View>

                <Plus size={20} color={"white"}  />
              </View>
            </TouchableOpacity>
          </View>


          {/* Stats Cards */}
          <View className="space-y-2 mt-3">
            <View className="flex-row gap-2">
              <StatCard icon="book-multiple" title="Total Sections" value={sections?.length} color="bg-blue-500" />
              <StatCard
                icon="account-multiple"
                title="Total Students"
                value={sections?.reduce((sum, s) => sum + s.total_students, 0)}
                color="bg-emerald-500"
              />
            </View>
            <View className="flex-row gap-2 mt-2">
              <StatCard
                icon="door"
                title="Avg Capacity"
                value={
                  sections?.length > 0 ? Math.round(sections.reduce((sum, s) => sum + s.capacity, 0) / sections?.length) : 0
                }
                color="bg-purple-500"
              />
              <StatCard
                icon="percent"
                title="Avg Occupancy"
                value={
                  sections?.length > 0
                    ? Math.round(
                      (sections.reduce((sum, s) => sum + s.total_students, 0) /
                        sections.reduce((sum, s) => sum + s.capacity, 0)) *
                      100,
                    )
                    : 0
                }
                color="bg-orange-500"
              />
            </View>
          </View>

          {/* Filters */}
          <View className="rounded-lg p-4 mt-3 border border-gray-200  bg-white  space-y-3">
            <Typography className="text-sm font-medium text-gray-700 ">Search & Filter</Typography>

            <View className="flex-row mt-2  items-center px-3 rounded-lg border border-gray-300  bg-gray-50 ">
              <MaterialCommunityIcons name="magnify" size={20} color="#6b7280" />
              <TextInput
                placeholder="Search sections..."
                placeholderTextColor="#9ca3af"
                value={searchTerm}
                onChangeText={setSearchTerm}
                className="flex-1 ml-2 py-2 text-sm text-gray-900 "
              />
            </View>

            <View className="mt-2">
              <Typography className="text-xs font-medium mb-2 text-gray-600 ">Filter by Class</Typography>
              <RNPickerSelect
                items={classList}
                onValueChange={setSelectedClass}
                value={selectedClass}
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

          {/* Sections List */}
          <View className="rounded-lg py-4 ">
            <Typography className="text-lg font-semibold mb-4 text-gray-900 ">Sections</Typography>

            {loading ? (
              <View className="flex-row items-center justify-center py-12">
                <ActivityIndicator size="large" color="#10b981" />
              </View>
            ) : filteredSections?.length > 0 ? (
              <FlatList
                scrollEnabled={false}
                data={filteredSections}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <SectionCard section={item} />}
              />
            ) : (
              <View className="items-center justify-center py-8">
                <MaterialIcons name="folder-open" size={48} color="#d1d5db" />
                <Typography className="text-gray-500  mt-2">No sections found</Typography>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
