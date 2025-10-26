"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { View, Text, ScrollView, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import RNPickerSelect from "react-native-picker-select"
import DateTimePicker from "@react-native-community/datetimepicker"
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import { cn } from "@/utils/cn"
import AttendanceController from "./attendance-controller"

// Mock API functions - replace with actual API calls
const getAllClass = async () => {
  // Replace with actual API call
  return [
    { _id: "1", name: "Class 10-A" },
    { _id: "2", name: "Class 10-B" },
    { _id: "3", name: "Class 9-A" },
  ]
}

const getStudentForAttendance = async (classId: string, date: string) => {
  // Replace with actual API call
  return [
    {
      _id: "1",
      first_name: "John",
      last_name: "Doe",
      rollNo: 1,
      admission_no: "ADM001",
      myAttendance: { status: "PRESENT" },
    },
    {
      _id: "2",
      first_name: "Jane",
      last_name: "Smith",
      rollNo: 2,
      admission_no: "ADM002",
      myAttendance: { status: null },
    },
  ]
}

const markStudentAttendance = async (data: any[]) => {
  // Replace with actual API call
  return { success: true }
}

export default function StudentAttendance() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const [allClass, setClass] = useState<any[]>([])
  const [classStudent, setClassStudent] = useState<any[]>([])
  const [currentClass, setCurrentClass] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedStudents, setSelectedStudents] = useState(new Set())
  const [attendanceStats, setAttendanceStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    halfday: 0,
    holiday: 0,
    percentage: 0,
  })
  const [loading, setLoading] = useState(false)
  const [bulkProcessing, setBulkProcessing] = useState(false)
  const [viewMode, setViewMode] = useState("table")
  const [isLocked, setIsLocked] = useState(true)

  const today = new Date()
  const weekLow = new Date()
  weekLow.setDate(today.getDate() - 6)

  const getClassName = useCallback(() => {
    const selectedClassObj = allClass.find((item) => item?._id === currentClass)
    return selectedClassObj?.name || ""
  }, [currentClass, allClass])

  const classList = useMemo(() => {
    const mapped = allClass.map((item) => ({
      label: item?.name,
      value: item?._id,
    }))
    return [{ label: "Select Class", value: null }, ...mapped]
  }, [allClass])

  const filteredStudents = useMemo<any[]>(() => {
    let filtered = classStudent

    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.rollNo?.toString().includes(searchTerm) ||
          student.admission_no?.includes(searchTerm),
      )
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((student) => {
        const status = student.myAttendance?.status || null
        return status === filterStatus
      })
    }

    return filtered
  }, [classStudent, searchTerm, filterStatus])

  useEffect(() => {
    const total = classStudent.length
    const present = classStudent.filter((s) => s.myAttendance?.status === "PRESENT").length
    const absent = classStudent.filter((s) => s.myAttendance?.status === "ABSENT").length
    const late = classStudent.filter((s) => s.myAttendance?.status === "LATE").length
    const halfday = classStudent.filter((s) => s.myAttendance?.status === "HALFDAY").length
    const holiday = classStudent.filter((s) => s.myAttendance?.status === "HOLIDAY").length
    const percentage = total > 0 ? Math.round(((present + halfday * 0.5) / total) * 100) : 0

    setAttendanceStats({ total, present, absent, late, halfday, holiday, percentage })
  }, [classStudent])

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classes = await getAllClass()
        setClass(classes)
      } catch (error) {
        Alert.alert("Error", "Failed to fetch classes")
      }
    }
    fetchClasses()
  }, [])

  useEffect(() => {
    const fetchStudents = async () => {
      if (!currentClass) return
      try {
        setLoading(true)
        const dateStr = selectedDate.toISOString().split("T")[0]
        const students = await getStudentForAttendance(currentClass, dateStr)
        setClassStudent(students)
      } catch (error) {
        Alert.alert("Error", "Failed to fetch students")
      } finally {
        setLoading(false)
      }
    }
    fetchStudents()
  }, [currentClass, selectedDate])

  const handleDateChange = (event: any, date?: Date) => {
    if (date) {
      setSelectedDate(date)
    }
    setShowDatePicker(false)
  }

  const handleBulkAction = async (action: string) => {
    if (selectedStudents.size === 0) return

    const allSelectedStudent = Array.from(selectedStudents)
    const dateStr = selectedDate.toISOString().split("T")[0]
    const data = allSelectedStudent.map((item) => ({
      student_id: item as string,
      date: dateStr,
      status: action,
    }))

    setBulkProcessing(true)
    setIsLocked(true)

    try {
      await markStudentAttendance(data)

      const updatedStudentList = classStudent.map((s) => ({
        ...s,
        myAttendance: selectedStudents.has(s._id) ? { status: action } : (s.myAttendance ?? null),
      }))
      setClassStudent(updatedStudentList)

      Alert.alert("Success", `Attendance marked as ${action}`)
      setSelectedStudents(new Set())
    } catch (error) {
      Alert.alert("Error", "Failed to mark attendance")
    } finally {
      setBulkProcessing(false)
      setIsLocked(false)
    }
  }

  const handleSelectAll = () => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set())
    } else {
      setSelectedStudents(new Set(filteredStudents.map((s) => s._id)))
    }
  }

  const handleStudentSelect = (studentId: string) => {
    const newSelected = new Set(selectedStudents)
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId)
    } else {
      newSelected.add(studentId)
    }
    setSelectedStudents(newSelected)
  }

  const StatCard = ({ icon, title, value, color }: any) => (
    <View className={cn("flex-1 rounded-lg p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800")}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">{title}</Text>
          <Text className="text-lg font-bold text-gray-900 dark:text-white">{value}</Text>
        </View>
        <View className={cn("p-2 rounded-lg", color)}>
          <MaterialCommunityIcons name={icon} size={16} color="white" />
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
        <View>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Student Attendance</Text>
          <Text className="text-sm mt-1 text-gray-600 dark:text-gray-400">
            Manage and track student attendance efficiently
          </Text>
        </View>

        <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
          <View>
            <Text className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Select Class</Text>
            <RNPickerSelect
              items={classList}
              onValueChange={setCurrentClass}
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
            <Text className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Select Date</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="flex-row items-center p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
            >
              <MaterialCommunityIcons name="calendar" size={20} color="#6b7280" />
              <Text className="ml-2 font-medium text-gray-700 dark:text-gray-300">
                {selectedDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={weekLow}
                maximumDate={today}
              />
            )}
          </View>

          <TouchableOpacity
            onPress={() => setIsLocked(!isLocked)}
            className={cn(
              "flex-row items-center justify-center p-3 rounded-lg border",
              isLocked
                ? "bg-red-100 dark:bg-red-900 border-red-200 dark:border-red-700"
                : "bg-emerald-100 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-700",
            )}
          >
            <MaterialCommunityIcons
              name={isLocked ? "lock" : "lock-open"}
              size={18}
              color={isLocked ? "#dc2626" : "#059669"}
            />
            <Text
              className={cn(
                "ml-2 font-medium",
                isLocked ? "text-red-700 dark:text-red-200" : "text-emerald-700 dark:text-emerald-200",
              )}
            >
              {isLocked ? "Unlock to Mark Attendance" : "Lock Attendance"}
            </Text>
          </TouchableOpacity>
        </View>

        {currentClass && (
          <>
            <View>
              <Text className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Attendance Overview</Text>
              <View className="space-y-2">
                <View className="flex-row gap-2">
                  <StatCard icon="account-multiple" title="Total" value={attendanceStats.total} color="bg-blue-500" />
                  <StatCard
                    icon="check-circle"
                    title="Present"
                    value={attendanceStats.present}
                    color="bg-emerald-500"
                  />
                  <StatCard icon="close-circle" title="Absent" value={attendanceStats.absent} color="bg-red-500" />
                </View>
                <View className="flex-row gap-2">
                  <StatCard icon="clock" title="Late" value={attendanceStats.late} color="bg-yellow-500" />
                  <StatCard icon="clock-half" title="Half Day" value={attendanceStats.halfday} color="bg-orange-500" />
                  <StatCard
                    icon="trending-up"
                    title="Rate"
                    value={`${attendanceStats.percentage}%`}
                    color="bg-purple-500"
                  />
                </View>
              </View>
            </View>

            <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-3">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Search & Filter</Text>

              <View className="flex-row items-center px-3 rounded-lg border border-gray-300 dark:border-gray-600">
                <MaterialCommunityIcons name="magnify" size={20} color="#6b7280" />
                <TextInput
                  placeholder="Search students..."
                  placeholderTextColor="#9ca3af"
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                  className="flex-1 ml-2 py-2 text-sm text-gray-900 dark:text-white"
                />
              </View>

              <View>
                <Text className="text-xs font-medium mb-2 text-gray-600 dark:text-gray-400">Filter by Status</Text>
                <RNPickerSelect
                  items={[
                    { label: "All Status", value: "all" },
                    { label: "Present", value: "PRESENT" },
                    { label: "Absent", value: "ABSENT" },
                    { label: "Late", value: "LATE" },
                    { label: "Half Day", value: "HALFDAY" },
                    { label: "Holiday", value: "HOLIDAY" },
                  ]}
                  onValueChange={setFilterStatus}
                  value={filterStatus}
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

            {!isLocked && (
              <View className="space-y-3">
                <TouchableOpacity
                  onPress={handleSelectAll}
                  className="flex-row items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  <MaterialCommunityIcons
                    name={
                      selectedStudents.size === filteredStudents.length && filteredStudents.length > 0
                        ? "checkbox-marked"
                        : "checkbox-blank-outline"
                    }
                    size={24}
                    color="#10b981"
                  />
                  <Text className="ml-3 font-medium text-gray-700 dark:text-gray-300">
                    Select All ({filteredStudents.length})
                  </Text>
                </TouchableOpacity>

                {selectedStudents.size > 0 && !bulkProcessing && (
                  <View className="rounded-lg p-4 border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900">
                    <Text className="font-medium mb-3 text-emerald-800 dark:text-emerald-200">
                      {selectedStudents.size} student(s) selected
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      <TouchableOpacity
                        onPress={() => handleBulkAction("PRESENT")}
                        className="flex-1 min-w-[100px] bg-emerald-600 rounded-lg p-2"
                      >
                        <Text className="text-white text-center font-medium text-sm">Mark Present</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleBulkAction("ABSENT")}
                        className="flex-1 min-w-[100px] bg-red-600 rounded-lg p-2"
                      >
                        <Text className="text-white text-center font-medium text-sm">Mark Absent</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleBulkAction("HALFDAY")}
                        className="flex-1 min-w-[100px] bg-orange-600 rounded-lg p-2"
                      >
                        <Text className="text-white text-center font-medium text-sm">Half Day</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {bulkProcessing && (
                  <View className="flex-row items-center justify-center p-4">
                    <ActivityIndicator size="small" color="#10b981" />
                    <Text className="ml-2 font-medium text-emerald-600 dark:text-emerald-400">Processing...</Text>
                  </View>
                )}
              </View>
            )}

            <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <Text className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Mark Attendance</Text>

              {loading ? (
                <View className="flex-row items-center justify-center py-12">
                  <ActivityIndicator size="large" color="#10b981" />
                </View>
              ) : filteredStudents.length > 0 ? (
                <FlatList
                  scrollEnabled={false}
                  data={filteredStudents}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item: student }) => (
                    <View
                      key={student._id}
                      className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                    >
                      <View className="flex-row items-center justify-between mb-3">
                        <View className="flex-1">
                          <Text className="font-semibold text-gray-900 dark:text-white">
                            {student.first_name} {student.last_name}
                          </Text>
                          <Text className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                            Roll: {student.rollNo} • Admission: {student.admission_no}
                          </Text>
                        </View>
                        {!isLocked && (
                          <TouchableOpacity onPress={() => handleStudentSelect(student._id)} className="ml-3">
                            <MaterialCommunityIcons
                              name={selectedStudents.has(student._id) ? "checkbox-marked" : "checkbox-blank-outline"}
                              size={24}
                              color="#10b981"
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                      <AttendanceController
                        data={student}
                        isLocked={isLocked}
                        date={selectedDate.toISOString().split("T")[0]}
                        onAttendanceChange={() => {
                          const dateStr = selectedDate.toISOString().split("T")[0]
                          getStudentForAttendance(currentClass, dateStr).then(setClassStudent)
                        }}
                      />
                    </View>
                  )}
                />
              ) : (
                <View className="items-center justify-center py-8">
                  <MaterialIcons name="folder-open" size={48} color="#d1d5db" />
                  <Text className="text-gray-500 dark:text-gray-400 mt-2">No students found</Text>
                </View>
              )}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  )
}
