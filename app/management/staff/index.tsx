"use client"

import { useEffect, useMemo, useState } from "react"
import { View, Text, ScrollView, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import RNPickerSelect from "react-native-picker-select"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { cn } from "@/utils/cn"
import { geAllEmployee } from "@/service/management/employee"

export default function StaffList() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const [allStaff, setStaffList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [designationFilter, setDesignationFilter] = useState("all")
  const [genderFilter, setGenderFilter] = useState("all")

  useEffect(() => {
    const getStaffRequest = async () => {
      setLoading(true)
      try {
        const staff = await geAllEmployee()
        setStaffList(staff)
      } catch (error) {
        Alert.alert("Error", "Failed to fetch staff members")
      } finally {
        setLoading(false)
      }
    }
    getStaffRequest()
  }, [])

  const filteredStaff = useMemo(() => {
    return allStaff.filter((staff) => {
      const matchesSearch =
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.employee_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.phone.includes(searchTerm)

      const matchesStatus = statusFilter === "all" || staff.status === statusFilter
      const matchesDesignation = designationFilter === "all" || staff.designation === designationFilter
      const matchesGender = genderFilter === "all" || staff.gender === genderFilter

      return matchesSearch && matchesStatus && matchesDesignation && matchesGender
    })
  }, [allStaff, searchTerm, statusFilter, designationFilter, genderFilter])

  const uniqueDesignations = useMemo(() => Array.from(new Set(allStaff.map((staff) => staff.designation))), [allStaff])

  const getStatusColor = (status: string) => {
    return status === "ACTIVE" ? "bg-emerald-100 dark:bg-emerald-900" : "bg-red-100 dark:bg-red-900"
  }

  const getStatusTextColor = (status: string) => {
    return status === "ACTIVE" ? "text-emerald-800 dark:text-emerald-200" : "text-red-800 dark:text-red-200"
  }

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setDesignationFilter("all")
    setGenderFilter("all")
  }

  const StaffCard = ({ staff }: any) => (
    <TouchableOpacity
      onPress={() => router.push(`/management/staff/view/${staff._id}`)}
      className="rounded-lg p-4 border border-gray-200  bg-white  mb-3"
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 items-center justify-center">
            <Text className="font-bold text-emerald-600 dark:text-emerald-400">{getInitials(staff.name)}</Text>
          </View>
          <View className="ml-3 flex-1">
            <Text className="font-semibold text-gray-900 ">{staff.name}</Text>
            <Text className="text-xs mt-1 text-gray-600  capitalize">
              {staff.designation.toLowerCase().replace("_", " ")}
            </Text>
          </View>
        </View>
        <TouchableOpacity className="p-2">
          <MaterialCommunityIcons name="dots-vertical" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <View className="space-y-2 mb-3">
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="badge-account" size={14} color="#6b7280" />
          <Text className="text-xs ml-2 text-gray-600 ">{staff.employee_code}</Text>
        </View>
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="phone" size={14} color="#6b7280" />
          <Text className="text-xs ml-2 text-gray-600 ">{staff.phone}</Text>
        </View>
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="calendar" size={14} color="#6b7280" />
          <Text className="text-xs ml-2 text-gray-600 ">Joined {formatDate(staff.joining_date)}</Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between pt-3 border-t border-gray-200 ">
        <View className={cn("px-2 py-1 rounded", getStatusColor(staff.status))}>
          <Text className={cn("text-xs font-medium", getStatusTextColor(staff.status))}>{staff.status}</Text>
        </View>
        <Text className="text-xs text-gray-600  capitalize">{staff.gender.toLowerCase()}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-gray-900"
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-4 py-6 space-y-6">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-900 ">Staff Management</Text>
            <Text className="text-sm mt-1 text-gray-600 ">
              {filteredStaff.length} of {allStaff.length} staff members
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/management/staff/add")}
            className="bg-emerald-600 dark:bg-emerald-600 rounded-lg p-3"
          >
            <MaterialCommunityIcons name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View className="rounded-lg p-4 border border-gray-200  bg-white  space-y-3">
          <View className="flex-row items-center px-3 rounded-lg border border-gray-300 ">
            <MaterialCommunityIcons name="magnify" size={20} color="#6b7280" />
            <TextInput
              placeholder="Search by name, code, email..."
              placeholderTextColor="#9ca3af"
              value={searchTerm}
              onChangeText={setSearchTerm}
              className="flex-1 ml-2 py-2 text-sm text-gray-900 "
            />
          </View>

          <View>
            <Text className="text-xs font-medium mb-2 text-gray-600 ">Filter by Status</Text>
            <RNPickerSelect
              items={[
                { label: "All Status", value: "all" },
                { label: "Active", value: "ACTIVE" },
                { label: "Inactive", value: "INACTIVE" },
              ]}
              onValueChange={setStatusFilter}
              value={statusFilter}
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
            <Text className="text-xs font-medium mb-2 text-gray-600 ">Filter by Designation</Text>
            <RNPickerSelect
              items={[
                { label: "All Roles", value: "all" },
                ...uniqueDesignations.map((d) => ({
                  label: d.toLowerCase().replace("_", " "),
                  value: d,
                })),
              ]}
              onValueChange={setDesignationFilter}
              value={designationFilter}
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
            <Text className="text-xs font-medium mb-2 text-gray-600 ">Filter by Gender</Text>
            <RNPickerSelect
              items={[
                { label: "All Gender", value: "all" },
                { label: "Male", value: "MALE" },
                { label: "Female", value: "FEMALE" },
                { label: "Other", value: "OTHER" },
              ]}
              onValueChange={setGenderFilter}
              value={genderFilter}
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

          {(searchTerm || statusFilter !== "all" || designationFilter !== "all" || genderFilter !== "all") && (
            <TouchableOpacity
              onPress={clearFilters}
              className="flex-row items-center justify-center p-2 rounded-lg border border-gray-300 "
            >
              <MaterialCommunityIcons name="close" size={16} color="#6b7280" />
              <Text className="ml-2 text-sm font-medium text-gray-600 ">Clear Filters</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <View className="flex-row items-center justify-center py-12">
            <ActivityIndicator size="large" color="#10b981" />
            <Text className="ml-2 text-gray-600 ">Loading staff members...</Text>
          </View>
        ) : filteredStaff.length === 0 ? (
          <View className="items-center justify-center py-12 rounded-lg border border-gray-200  bg-white ">
            <MaterialCommunityIcons name="account-multiple" size={48} color="#d1d5db" />
            <Text className="text-gray-900  font-medium mt-2">No Staff Members Found</Text>
            <Text className="text-gray-600  text-sm mt-1">
              {searchTerm || statusFilter !== "all" || designationFilter !== "all" || genderFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by adding your first staff member"}
            </Text>
          </View>
        ) : (
          <FlatList
            scrollEnabled={false}
            data={filteredStaff}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <StaffCard staff={item} />}
          />
        )}
      </View>
    </ScrollView>
  )
}
