"use client"

import { useEffect, useState, useMemo } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
  TextInput,
  Pressable,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialIcons } from "@expo/vector-icons"
import { useClasses } from "@/hooks/management/classes"
import { assign_section_stdent, get_class_section } from "@/service/management/section"
import { getClassStudents } from "@/service/management/student"
import RNPickerSelect from "react-native-picker-select"

export default function StudentAssignmentScreen() {
  const insets = useSafeAreaInsets()
  const { classes } = useClasses()

  const [sections, setSections] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [selectedClassId, setSelectedClassId] = useState("")
  const [selectedSectionId, setSelectedSectionId] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "assigned" | "unassigned">("all")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Fetch sections when class changes
  useEffect(() => {
    const fetch_class_section = async () => {
      if (!selectedClassId) return
      try {
        const fetched_section = await get_class_section(selectedClassId)
        setSections(fetched_section)
      } catch (error) {
        Alert.alert("Error", "Failed to fetch sections")
      }
    }
    fetch_class_section()
  }, [selectedClassId])

  // Fetch students when class changes
  useEffect(() => {
    const fetch_class_student = async () => {
      if (!selectedClassId) return
      try {
        const fetched_student = await getClassStudents(selectedClassId)
        setStudents(fetched_student)
      } catch (error) {
        Alert.alert("Error", "Failed to fetch students")
      }
    }
    fetch_class_student()
  }, [selectedClassId])

  // Filter students based on search and status
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student?.roll_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student?.admission_number?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "assigned" && student.section_id) ||
        (filterStatus === "unassigned" && !student.section_id)

      return matchesSearch && matchesStatus
    })
  }, [students, searchTerm, filterStatus])

  const sectionStudents = selectedSectionId
    ? filteredStudents.filter((student) => student.section_id === selectedSectionId)
    : []

  const unassignedStudents = filteredStudents.filter((student) => !student.section_id)
  const selectedSection = sections.find((section) => section._id === selectedSectionId)

  const handleStudentSelect = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId))
    } else {
      setSelectedStudents([...selectedStudents, studentId])
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const studentIds = filteredStudents.map((student) => student._id)
      setSelectedStudents([...new Set([...selectedStudents, ...studentIds])])
    } else {
      setSelectedStudents([])
    }
  }

  const handleAssignStudents = async () => {
    if (!selectedSectionId || selectedStudents.length === 0) return

    setIsProcessing(true)
    try {
      await assign_section_stdent(selectedSectionId, selectedStudents)
      Alert.alert("Success", "Students successfully assigned")
      setSelectedStudents([])
      // Refresh students
      const fetched_student = await getClassStudents(selectedClassId)
      setStudents(fetched_student)
    } catch (error) {
      Alert.alert("Error", error?.response?.data?.message || "Failed to assign students")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setSelectedSectionId("")
    setSelectedStudents([])
    setSearchTerm("")
    setFilterStatus("all")
  }

  const selectedClass = classes.find((cls) => cls._id === selectedClassId)

  return (
    <View className="flex-1 bg-white dark:bg-gray-900" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <ScrollView className="flex-1 px-4">
        {/* Header */}
        <View className="mt-6 mb-6">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Student Assignment</Text>
          <Text className="text-gray-600 dark:text-gray-400 mt-1">Assign students to sections</Text>
        </View>

        {/* Class Selection Card */}
        <View className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <View className="flex-row items-center gap-2 mb-4">
            <MaterialIcons name="filter-list" size={20} color="#10b981" />
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">Select Class</Text>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Class</Text>
            <RNPickerSelect
              onValueChange={(value) => {
                setSelectedClassId(value)
                handleReset()
              }}
              items={classes.map((cls) => ({
                label: `${cls.name} - (${cls.classCode})`,
                value: cls._id,
              }))}
              placeholder={{ label: "Choose a class", value: "" }}
              style={{
                inputIOS: {
                  paddingVertical: 12,
                  paddingHorizontal: 10,
                  borderRadius: 6,
                  backgroundColor: "#f3f4f6",
                  color: "#000",
                  fontSize: 16,
                },
                inputAndroid: {
                  paddingVertical: 12,
                  paddingHorizontal: 10,
                  borderRadius: 6,
                  backgroundColor: "#f3f4f6",
                  color: "#000",
                  fontSize: 16,
                },
              }}
            />
          </View>

          {selectedClassId && (
            <>
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Section</Text>
                <RNPickerSelect
                  onValueChange={setSelectedSectionId}
                  items={sections.map((section) => ({
                    label: `Section ${section.name} (${section.total_students}/${section.capacity})`,
                    value: section._id,
                  }))}
                  placeholder={{ label: "Select section", value: "" }}
                  style={{
                    inputIOS: {
                      paddingVertical: 12,
                      paddingHorizontal: 10,
                      borderRadius: 6,
                      backgroundColor: "#f3f4f6",
                      color: "#000",
                      fontSize: 16,
                    },
                    inputAndroid: {
                      paddingVertical: 12,
                      paddingHorizontal: 10,
                      borderRadius: 6,
                      backgroundColor: "#f3f4f6",
                      color: "#000",
                      fontSize: 16,
                    },
                  }}
                />
              </View>

              <TouchableOpacity
                onPress={handleReset}
                className="flex-row items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
              >
                <MaterialIcons name="refresh" size={18} color="#6b7280" />
                <Text className="text-gray-700 dark:text-gray-300 font-medium">Reset</Text>
              </TouchableOpacity>

              {/* Stats */}
              <View className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <View className="gap-2">
                  <View className="flex-row justify-between">
                    <Text className="text-blue-600 dark:text-blue-400 font-medium">Total Students:</Text>
                    <Text className="text-blue-800 dark:text-blue-200">{students.length}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-green-600 dark:text-green-400 font-medium">Assigned:</Text>
                    <Text className="text-green-800 dark:text-green-200">
                      {students.filter((s) => s.section_id).length}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-orange-600 dark:text-orange-400 font-medium">Unassigned:</Text>
                    <Text className="text-orange-800 dark:text-orange-200">
                      {students.filter((s) => !s.section_id).length}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-purple-600 dark:text-purple-400 font-medium">Sections:</Text>
                    <Text className="text-purple-800 dark:text-purple-200">{sections.length}</Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>

        {selectedClassId && (
          <>
            {/* Search and Filter */}
            <View className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
              <View className="mb-4">
                <View className="flex-row items-center border border-gray-300 dark:border-gray-600 rounded-lg px-3 bg-gray-50 dark:bg-gray-700">
                  <MaterialIcons name="search" size={20} color="#9ca3af" />
                  <TextInput
                    placeholder="Search by name, roll, admission..."
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    placeholderTextColor="#9ca3af"
                    className="flex-1 py-3 px-2 text-gray-900 dark:text-white"
                  />
                </View>
              </View>

              <View className="flex-row gap-2 mb-4">
                <RNPickerSelect
                  onValueChange={setFilterStatus}
                  items={[
                    { label: "All Students", value: "all" },
                    { label: "Assigned", value: "assigned" },
                    { label: "Unassigned", value: "unassigned" },
                  ]}
                  value={filterStatus}
                  style={{
                    inputIOS: {
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                      borderRadius: 6,
                      backgroundColor: "#f3f4f6",
                      color: "#000",
                      fontSize: 14,
                      flex: 1,
                    },
                    inputAndroid: {
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                      borderRadius: 6,
                      backgroundColor: "#f3f4f6",
                      color: "#000",
                      fontSize: 14,
                      flex: 1,
                    },
                  }}
                />
              </View>

              {/* Action Buttons */}
              {selectedStudents.length > 0 && (
                <View className="flex-row gap-2">
                  {selectedSectionId && unassignedStudents.some((s) => selectedStudents.includes(s._id)) && (
                    <TouchableOpacity
                      onPress={handleAssignStudents}
                      disabled={isProcessing}
                      className="flex-1 flex-row items-center justify-center gap-2 px-4 py-3 rounded-lg bg-emerald-400 dark:bg-emerald-600"
                    >
                      {isProcessing ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <MaterialIcons name="person-add" size={18} color="#fff" />
                      )}
                      <Text className="text-white font-semibold">Assign ({selectedStudents.length})</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>

            {/* Section Overview */}
            {selectedSectionId && selectedSection && (
              <View className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
                <View className="flex-row items-center gap-2 mb-4">
                  <MaterialIcons name="people" size={20} color="#10b981" />
                  <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                    Section {selectedSection.name} Overview
                  </Text>
                </View>

                <View className="gap-3">
                  <View className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <Text className="text-sm text-gray-600 dark:text-gray-400">Room Number</Text>
                    <Text className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                      {selectedSection.room_no}
                    </Text>
                  </View>

                  <View className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <Text className="text-sm text-gray-600 dark:text-gray-400">Class Teacher</Text>
                    <Text className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                      {selectedSection.teacher_name}
                    </Text>
                  </View>

                  <View className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <Text className="text-sm text-gray-600 dark:text-gray-400">Current Strength</Text>
                    <Text className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                      {selectedSection.total_students}/{selectedSection.capacity}
                    </Text>
                  </View>

                  <View className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <Text className="text-sm text-gray-600 dark:text-gray-400">Available Seats</Text>
                    <Text className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                      {selectedSection.capacity - selectedSection.total_students}
                    </Text>
                  </View>
                </View>

                {/* Capacity Bar */}
                <View className="mt-4">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-sm text-gray-600 dark:text-gray-400">Capacity Utilization</Text>
                    <Text className="text-sm font-medium text-gray-900 dark:text-white">
                      {Math.round((selectedSection.total_students / selectedSection.capacity) * 100)}%
                    </Text>
                  </View>
                  <View className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-emerald-400 dark:bg-emerald-600"
                      style={{
                        width: `${(selectedSection.total_students / selectedSection.capacity) * 100}%`,
                      }}
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Students List */}
            <View className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                  Students ({filteredStudents.length})
                </Text>
                {filteredStudents.length > 0 && (
                  <Pressable
                    onPress={() =>
                      handleSelectAll(filteredStudents.every((s) => selectedStudents.includes(s._id)) ? false : true)
                    }
                    className="flex-row items-center gap-2"
                  >
                    <View
                      className={`w-5 h-5 rounded border-2 ${
                        filteredStudents.every((s) => selectedStudents.includes(s._id))
                          ? "bg-emerald-400 dark:bg-emerald-600 border-emerald-400 dark:border-emerald-600"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {filteredStudents.every((s) => selectedStudents.includes(s._id)) && (
                        <MaterialIcons name="check" size={16} color="#fff" />
                      )}
                    </View>
                    <Text className="text-sm text-gray-600 dark:text-gray-400">Select All</Text>
                  </Pressable>
                )}
              </View>

              {filteredStudents.length === 0 ? (
                <View className="items-center justify-center py-8">
                  <MaterialIcons name="people-outline" size={48} color="#d1d5db" />
                  <Text className="text-gray-500 dark:text-gray-400 mt-2">No students found</Text>
                </View>
              ) : (
                <FlatList
                  data={filteredStudents}
                  renderItem={({ item }) => {
                    const isSelected = selectedStudents.includes(item._id)
                    return (
                      <Pressable
                        onPress={() => handleStudentSelect(item._id)}
                        className={`flex-row items-center gap-3 p-3 mb-2 rounded-lg border ${
                          isSelected
                            ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400 dark:border-emerald-600"
                            : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                        }`}
                      >
                        <View
                          className={`w-5 h-5 rounded border-2 ${
                            isSelected
                              ? "bg-emerald-400 dark:bg-emerald-600 border-emerald-400 dark:border-emerald-600"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {isSelected && <MaterialIcons name="check" size={16} color="#fff" />}
                        </View>

                        <View className="flex-1">
                          <View className="flex-row items-center gap-2 mb-1">
                            <Text className="font-semibold text-gray-900 dark:text-white">{item.first_name}</Text>
                            <View
                              className={`px-2 py-1 rounded ${item.gender === "male" ? "bg-blue-100 dark:bg-blue-900" : "bg-pink-100 dark:bg-pink-900"}`}
                            >
                              <Text
                                className={`text-xs font-medium ${item.gender === "male" ? "text-blue-800 dark:text-blue-200" : "text-pink-800 dark:text-pink-200"}`}
                              >
                                {item.gender}
                              </Text>
                            </View>
                          </View>
                          <Text className="text-xs text-gray-600 dark:text-gray-400">
                            Roll: {item.roll_no} • Admission: {item.admission_no}
                          </Text>
                        </View>

                        <View className="items-end">
                          {item.section_id ? (
                            <View>
                              <View className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded mb-1">
                                <Text className="text-xs font-semibold text-green-800 dark:text-green-200">
                                  Assigned
                                </Text>
                              </View>
                              <Text className="text-xs text-gray-600 dark:text-gray-400">
                                Section {item.section_name}
                              </Text>
                            </View>
                          ) : (
                            <View>
                              <View className="bg-orange-100 dark:bg-orange-900 px-2 py-1 rounded mb-1">
                                <Text className="text-xs font-semibold text-orange-800 dark:text-orange-200">
                                  Unassigned
                                </Text>
                              </View>
                              <Text className="text-xs text-gray-600 dark:text-gray-400">No section</Text>
                            </View>
                          )}
                        </View>
                      </Pressable>
                    )
                  }}
                  keyExtractor={(item) => item._id}
                  scrollEnabled={false}
                />
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  )
}
