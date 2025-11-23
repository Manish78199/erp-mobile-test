
import { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, ActivityIndicator, RefreshControl } from "react-native"
import { useRouter } from "expo-router"
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons"
import { getAllSchoolStudent } from "@/service/management/student"
import { SafeAreaView } from "react-native-safe-area-context"
import { Typography } from "@/components/Typography"

interface Student {
  _id: string
  admission_no: string
  first_name: string
  last_name: string
  father_name: string
  class_name: string
  rollNo: number
  created_at: string
}

export default function StudentListScreen() {
  const router = useRouter()
  const [allStudents, setAllStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const get_student_all = async () => {
    setLoading(true)
    const mockData: Student[] = await getAllSchoolStudent()
    setAllStudents(mockData)
    setLoading(false)
  }

  useEffect(() => {
    get_student_all()

  }, [])

  const filteredData = allStudents.filter(
    (student) =>
      student.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admission_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.father_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const renderStudentItem = ({ item }: { item: Student }) => (
    <View className="bg-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-sm">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <View className="bg-blue-100 p-3 rounded-full mr-3">
            <MaterialCommunityIcons name="account-circle" size={24} color="#2563eb" />
          </View>
          <View className="flex-1">
            <Typography className="text-text-color font-semibold text-base">
              {item.first_name} {item.last_name}
            </Typography>
            <Typography className="text-nav-text text-xs mt-1">Adm: {item.admission_no}</Typography>
          </View>
        </View>
      </View>

      <View className="bg-gray-50 rounded-lg p-3 mb-3">
        <View className="flex-row justify-between mb-2">
          <Typography className="text-nav-text text-xs">Father: {item.father_name}</Typography>
          <Typography className="text-nav-text text-xs font-semibold">{item.class_name}</Typography>
        </View>
        <View className="flex-row items-center">
          <MaterialIcons name="badge" size={14} color="#6b7280" />
          <Typography className="text-nav-text text-xs ml-1">Roll No: {item.rollNo}</Typography>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => router.push(`/management/student/view/${item._id}`)}
        className="bg-blue-600 rounded-lg py-2 px-3 flex-row items-center justify-center"
      >
        <MaterialIcons name="visibility" size={16} color="white" />
        <Typography className="text-white font-medium text-sm ml-1">View Details</Typography>
      </TouchableOpacity>
    </View>
  )

  return (

    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center p-4">
        <TouchableOpacity
          onPress={() => router.push("/management")}
          className="flex-row items-center bg-white border border-border rounded-lg px-3 py-2 mr-2"
        >
          <Typography className="text-primary font-semibold">← Back</Typography>
        </TouchableOpacity>
        <Typography className="text-xl font-bold text-foreground">Students</Typography>
      </View>
      <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={get_student_all} />} className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className=" px-4 pt-6 pb-4 ">
          <View className=" mb-4">


            <Typography className="text-text-color text-2xl font-bold">Student Management</Typography>
            <Typography className="text-nav-text text-sm mt-1">View and manage student records</Typography>

          </View>

          <TouchableOpacity
            onPress={() => router.push("/management/student/admission")}
            className="bg-blue-600 rounded-xl py-3 px-4 flex-row items-center justify-center"
          >
            <MaterialIcons name="person-add" size={20} color="white" />
            <Typography className="text-white font-semibold ml-2">Add Student</Typography>
          </TouchableOpacity>
        </View>


        <View className="px-4 py-4">
          <View className="bg-white border border-gray-200 rounded-xl px-3 py-2 flex-row items-center">
            <MaterialIcons name="search" size={20} color="#6b7280" />
            <TextInput
              placeholder="Search by name or admission no..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              className="flex-1 ml-2 text-text-color"
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        {/* Content */}
        <View className="px-4 pb-6">
          {loading ? (
            <View className="py-8 items-center justify-center">
              <ActivityIndicator size="large" color="#2563eb" />
            </View>
          ) : filteredData.length > 0 ? (
            <FlatList
              data={filteredData}
              renderItem={renderStudentItem}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
            />
          ) : (
            <View className="py-12 items-center justify-center">
              <View className="bg-white rounded-full p-4 mb-4">
                <MaterialCommunityIcons name="account-multiple" size={32} color="#6b7280" />
              </View>
              <Typography className="text-text-color font-semibold text-lg mb-2">No students found</Typography>
              <Typography className="text-nav-text text-sm mb-6">
                {searchTerm ? "Try adjusting your search" : "Add your first student"}
              </Typography>
              <TouchableOpacity
                onPress={() => router.push("/management/student/admission")}
                className="bg-blue-600 rounded-xl py-3 px-6 flex-row items-center"
              >
                <MaterialIcons name="person-add" size={18} color="white" />
                <Typography className="text-white font-semibold ml-2">Add Student</Typography>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
