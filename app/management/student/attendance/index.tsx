
import { useCallback, useEffect, useMemo, useState } from "react"
import { View, Text, ScrollView, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import RNPickerSelect from "react-native-picker-select"
import DateTimePicker from "@react-native-community/datetimepicker"
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import { cn } from "@/utils/cn"
import AttendanceController from "./attendance-controller"
import { Typography } from "@/components/Typography"
import { useClasses } from "@/hooks/management/classes"
import { getStudentForAttendance, markStudentAttendance } from "@/service/management/student"


export default function StudentAttendance() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const {classes:allClass}=useClasses()


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
    return [ ...mapped]
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
      console.log(classStudent,"updatedStudentList")

      const updatedStudentList = classStudent.map((s) => ({
        ...s,
        myAttendance: selectedStudents.has(s._id) ? { status: action } : (s.myAttendance ?? null),
      }))
      console.log(updatedStudentList,"updatedStudentList")
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

  return (
    <SafeAreaView className="flex-1 bg-background" >
      <View className="flex-row items-center p-4">
        <TouchableOpacity
          onPress={() => router.push("/management")}
          className="flex-row items-center bg-white border border-border rounded-lg px-3 py-2 mr-2"
        >
          <Typography className=" text-primary font-semibold">← Back</Typography>
        </TouchableOpacity>

        <Typography className="text-lg font-bold text-foreground">Student Attendance</Typography>
      </View>
      <ScrollView
        className="flex-1  "
       
      >
        <View className="px-4 pb-6 space-y-6">
          <View>
            <Typography className="text-2xl font-bold text-gray-900 ">Student Attendance</Typography>
            <Typography className="text-sm mt-1 text-gray-600 ">
              Manage and track student attendance efficiently
            </Typography>
          </View>

          <View className="rounded-lg p-4 border border-gray-200 mt-3 bg-white  space-y-4">
            <View>
              <Typography className="text-sm font-medium mb-2 text-gray-700 ">Select Class</Typography>
              <RNPickerSelect
                items={classList}
                onValueChange={setCurrentClass}
                value={currentClass}
                placeholder={{ label: "--  Select Class --", value: null }}
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
                    paddingVertical: 0,
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

            <View className="mt-3">
              <Typography className="text-sm font-medium mb-2 text-gray-700 ">Select Date</Typography>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="flex-row items-center p-3 rounded-lg border border-gray-300  bg-gray-50 "
              >
                <MaterialCommunityIcons name="calendar" size={20} color="#6b7280" />
                <Typography className="ml-2 font-medium text-gray-700 ">
                  {selectedDate.toLocaleDateString()}
                </Typography>
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
                "flex-row mt-3 items-center justify-center p-3 rounded-lg border",
                isLocked
                  ? "bg-red-100  border-red-200 "
                  : "bg-emerald-100  border-emerald-200 ",
              )}
            >
              <MaterialCommunityIcons
                name={isLocked ? "lock" : "lock-open"}
                size={18}
                color={isLocked ? "#dc2626" : "#059669"}
              />
              <Typography
                className={cn(
                  "ml-2 font-medium",
                  isLocked ? "text-red-700 " : "text-emerald-700 ",
                )}
              >
                {isLocked ? "Unlock to Mark Attendance" : "Lock Attendance"}
              </Typography>
            </TouchableOpacity>
          </View>

          {currentClass && (
            <>
              <View className="mt-3">
                <Typography className="text-lg font-semibold mb-3 text-gray-900 ">Attendance Overview</Typography>
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
                  <View className="flex-row mt-3 gap-2">
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

              <View className="mt-3 rounded-lg p-4 border border-gray-200  bg-white  space-y-3">
                <Typography className="text-sm font-medium text-gray-700 ">Search & Filter</Typography>

                <View className="flex-row mt-2 items-center px-3 rounded-lg border border-gray-300 ">
                  <MaterialCommunityIcons name="magnify" size={20} color="#6b7280" />
                  <TextInput
                    placeholder="Search students..."
                    placeholderTextColor="#9ca3af"
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    className="flex-1 ml-2  py-2 text-sm text-gray-900 "
                  />
                </View>

                <View className="mt-3">
                  <Typography className="text-xs font-medium mb-2 text-gray-600 ">Filter by Status</Typography>
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
                        paddingVertical: 0,
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
                <View className="space-y-3 ">
                  <TouchableOpacity
                    onPress={handleSelectAll}
                    className="flex-row mt-3 items-center p-3 rounded-lg border border-gray-200  bg-white "
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
                    <Typography className="ml-3 font-medium text-gray-700 ">
                      Select All ({filteredStudents.length})
                    </Typography>
                  </TouchableOpacity>

                  {selectedStudents.size > 0 && !bulkProcessing && (
                    <View className="mt-3 rounded-lg p-4 border border-emerald-200  bg-emerald-50 ">
                      <Typography className="font-medium mb-3 text-emerald-800 ">
                        {selectedStudents.size} student(s) selected
                      </Typography>
                      <View className="flex-row flex-wrap gap-2">
                        <TouchableOpacity
                          onPress={() => handleBulkAction("PRESENT")}
                          className="flex-1 min-w-[100px] bg-emerald-600 rounded-lg p-2"
                        >
                          <Typography className="text-white text-center font-medium text-sm">Mark Present</Typography>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleBulkAction("ABSENT")}
                          className="flex-1 min-w-[100px] bg-red-600 rounded-lg p-2"
                        >
                          <Typography className="text-white text-center font-medium text-sm">Mark Absent</Typography>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleBulkAction("HALFDAY")}
                          className="flex-1 min-w-[100px] bg-orange-600 rounded-lg p-2"
                        >
                          <Typography className="text-white text-center font-medium text-sm">Half Day</Typography>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {bulkProcessing && (
                    <View className="flex-row items-center justify-center p-4">
                      <ActivityIndicator size="small" color="#10b981" />
                      <Typography className="ml-2 font-medium text-emerald-600 ">Processing...</Typography>
                    </View>
                  )}
                </View>
              )}

              <View className="rounded-lg p-4 mt-3 border border-gray-200  bg-white ">
                <Typography className="text-lg font-semibold mb-4 text-gray-900 ">Mark Attendance</Typography>

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
                        className="mb-4 pb-4 border-t pt-3 border-gray-200  last:border-b-0"
                      >
                        <View className="flex-row items-center  justify-between mb-3">
                          <View className="flex-1">
                            <Typography className="font-semibold text-gray-900 ">
                              {student.first_name} ( {student?.father_name})
                            </Typography>
                            <Typography className="text-xs mt-1 text-gray-600 ">
                              Roll: {student.rollNo} 
                            </Typography>
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
                    <Typography className="text-gray-500  mt-2">No students found</Typography>
                  </View>
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
