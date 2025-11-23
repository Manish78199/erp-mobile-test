
import { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Image } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import HealthScale from "@/components/management/student/health-scale"
import HealthChart from "@/components/management/student/health-chart"
import { getStudentProfileById } from "@/service/management/student"
import { get_student_health } from "@/service/management/health"
import { Typography } from "@/components/Typography"
import { SafeAreaView } from "react-native-safe-area-context"

const tabs = [
  { id: "profile", name: "Profile", icon: "person" },
  { id: "health", name: "Health", icon: "heart" },
  { id: "fees", name: "Fees", icon: "card" },
  { id: "library", name: "Library", icon: "book" },
  { id: "transport", name: "Transport", icon: "car" },
  { id: "hostel", name: "Hostel", icon: "home" },
  { id: "security", name: "Security", icon: "lock-closed" },
  { id: "history", name: "History", icon: "time" },
]

// const mockStudent = {
//   _id: "1",
//   firstName: "John",
//   middleName: "Michael",
//   lastName: "Doe",
//   admissionNo: "ADM-2024-001",
//   userId: "USER-001",
//   gender: "Male",
//   className: "10-A",
//   sectionName: "A",
//   rollNumber: "15",
//   fatherName: "James Doe",
//   contactNumber: "+91-9876543210",
//   profileImage: "https://via.placeholder.com/200",
// }

// const mockHealth = {
//   current: {
//     height: 175,
//     weight: 65,
//   },
//   chart: [
//     { month: "Jan", height: 140, weight: 35, bmi: 17.9 },
//     { month: "Feb", height: 141, weight: 36, bmi: 18.1 },
//     { month: "Mar", height: 142, weight: 37, bmi: 18.3 },
//     { month: "Apr", height: 143, weight: 38, bmi: 18.5 },
//     { month: "May", height: 144, weight: 39, bmi: 18.7 },
//     { month: "Jun", height: 145, weight: 40, bmi: 18.9 },
//     { month: "Jul", height: 146, weight: 41, bmi: 19.2 },
//     { month: "Aug", height: 147, weight: 42, bmi: 19.4 },
//     { month: "Sep", height: 148, weight: 43, bmi: 19.6 },
//     { month: "Oct", height: 149, weight: 44, bmi: 19.8 },
//     { month: "Nov", height: 150, weight: 45, bmi: 20.0 },
//     { month: "Dec", height: 151, weight: 46, bmi: 20.2 },
//   ],
// }

export default function StudentProfileScreen() {
  const { studentId } = useLocalSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [passwordModalVisible, setPasswordModalVisible] = useState(false)

  const [mockStudent, setStudentDetails] = useState<any>(null)
  const [mockHealth, setHealth] = useState<any>(null)

  const [healthData, setHealthData] = useState({
    height: mockHealth?.current?.height,
    weight: mockHealth?.current?.weight,
    measureDate: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    const getStudentProfileRequest = async () => {
      const profile = await getStudentProfileById(String(studentId))
      console.log(profile, "profile")
      setStudentDetails(() => profile)
    }
    const getStudentHealthRequest = async () => {
      const health_details = await get_student_health(String(studentId))
      console.log(health_details, "health_details")
      setHealth(() => health_details)
    }
    getStudentProfileRequest()
    getStudentHealthRequest()

  }, [studentId])

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  })

  const renderProfileTab = () => (
    <View className="bg-white  rounded-lg p-4 mb-4">
      <View className="items-center mb-6">
        <Image source={{ uri: mockStudent?.profileImage }} className="w-32 h-32 rounded-full mb-4" />
        <Typography className="text-2xl font-bold text-slate-900 ">
          {mockStudent?.firstName} {mockStudent?.lastName}
        </Typography>
        <Typography className="text-slate-500 "> {mockStudent?.first_name} {mockStudent?.middle_name}  {mockStudent?.last_name} </Typography>
      </View>

      <View className="space-y-4">
        <View>
          <Typography className="text-sm font-medium text-slate-600  mb-1">Admission Number</Typography>
          <View className="bg-slate-100  p-3 rounded-lg">
            <Typography className="text-slate-900 ">{mockStudent?.admission_no}</Typography>
          </View>
        </View>

        <View>
          <Typography className="text-sm font-medium text-slate-600  mb-1">User ID</Typography>
          <View className="bg-slate-100  p-3 rounded-lg">
            <Typography className="text-slate-900 ">{mockStudent?.userId}</Typography>
          </View>
        </View>

        <View>
          <Typography className="text-sm font-medium text-slate-600  mb-1">Gender</Typography>
          <View className="bg-slate-100  p-3 rounded-lg">
            <Typography className="text-slate-900 ">{mockStudent?.gender}</Typography>
          </View>
        </View>

        <View>
          <Typography className="text-sm font-medium text-slate-600  mb-1">Class</Typography>
          <View className="bg-slate-100  p-3 rounded-lg">
            <Typography className="text-slate-900 ">{mockStudent?.class_name}</Typography>
          </View>
        </View>

        <View>
          <Typography className="text-sm font-medium text-slate-600  mb-1">Father's Name</Typography>
          <View className="bg-slate-100  p-3 rounded-lg">
            <Typography className="text-slate-900 ">{mockStudent?.father_name}</Typography>
          </View>
        </View>

        <View>
          <Typography className="text-sm font-medium text-slate-600  mb-1">Contact Number</Typography>
          <View className="bg-slate-100  p-3 rounded-lg">
            <Typography className="text-slate-900 ">{mockStudent?.contact_number}</Typography>
          </View>
        </View>
      </View>
    </View>
  )

  const renderHealthTab = () => (
    <View>
      <TouchableOpacity
        onPress={() => setEditModalVisible(true)}
        className="bg-indigo-600 rounded-lg p-3 mb-4 flex-row items-center justify-center"
      >
        <Ionicons name="pencil" size={18} color="white" />
        <Typography className="text-white font-semibold ml-2">Edit Health Data</Typography>
      </TouchableOpacity>

      <HealthScale value={mockHealth?.current?.height || 0} maxValue={200} unit="cm" label="Height" color="#6366F1" />

      <HealthScale value={mockHealth?.current?.weight || 0} maxValue={150} unit="kg" label="Weight" color="#10B981" />

      <View className="mb-4">
        <HealthChart data={mockHealth?.chart || []} />
      </View>
    </View>
  )

  const renderFeesTab = () => (
    <View className="bg-white  rounded-lg p-4 mb-4">
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1 bg-green-50  rounded-lg p-4">
          <Typography className="text-green-800  text-sm font-medium">Total Paid</Typography>
          <Typography className="text-green-600  text-xl font-bold">₹45,000</Typography>
        </View>
        <View className="flex-1 bg-red-50  rounded-lg p-4">
          <Typography className="text-red-800  text-sm font-medium">Outstanding</Typography>
          <Typography className="text-red-600  text-xl font-bold">₹15,000</Typography>
        </View>
        <View className="flex-1 bg-blue-50 rounded-lg p-4">
          <Typography className="text-blue-800  text-sm font-medium">Total Fees</Typography>
          <Typography className="text-blue-600  text-xl font-bold">₹60,000</Typography>
        </View>
      </View>

      <View className="bg-slate-100  rounded-lg overflow-hidden">
        <View className="bg-slate-200  p-3 flex-row">
          <Typography className="flex-1 font-semibold text-slate-900 ">Fee Type</Typography>
          <Typography className="flex-1 font-semibold text-slate-900 ">Amount</Typography>
          <Typography className="flex-1 font-semibold text-slate-900 ">Status</Typography>
        </View>
        <View className="p-3 border-t border-slate-300 ">
          <View className="flex-row mb-2">
            <Typography className="flex-1 text-slate-900 ">Tuition Fee</Typography>
            <Typography className="flex-1 text-slate-900 ">₹25,000</Typography>
            <View className="flex-1 bg-green-100  rounded px-2 py-1">
              <Typography className="text-green-800  text-xs font-semibold">Paid</Typography>
            </View>
          </View>
          <View className="flex-row">
            <Typography className="flex-1 text-slate-900 ">Library Fee</Typography>
            <Typography className="flex-1 text-slate-900 ">₹5,000</Typography>
            <View className="flex-1 bg-red-100 rounded px-2 py-1">
              <Typography className="text-red-800  text-xs font-semibold">Pending</Typography>
            </View>
          </View>
        </View>
      </View>
    </View>
  )

  const renderLibraryTab = () => (
    <View className="bg-white  rounded-lg p-4 mb-4">
      <View className="flex-row gap-2 mb-4">
        <View className="flex-1 bg-blue-50 rounded-lg p-3 items-center">
          <Typography className="text-blue-800  text-xs font-medium">Books Issued</Typography>
          <Typography className="text-blue-600  text-lg font-bold">5</Typography>
        </View>
        <View className="flex-1 bg-green-50  rounded-lg p-3 items-center">
          <Typography className="text-green-800  text-xs font-medium">Returned</Typography>
          <Typography className="text-green-600  text-lg font-bold">23</Typography>
        </View>
        <View className="flex-1 bg-red-50  rounded-lg p-3 items-center">
          <Typography className="text-red-800  text-xs font-medium">Overdue</Typography>
          <Typography className="text-red-600  text-lg font-bold">1</Typography>
        </View>
      </View>

      <View className="bg-slate-100  rounded-lg overflow-hidden">
        <View className="bg-slate-200  p-3">
          <Typography className="font-semibold text-slate-900  text-sm">Recent Books</Typography>
        </View>
        <View className="p-3 space-y-3">
          <View className="border-b border-slate-300  pb-3">
            <Typography className="text-slate-900  font-medium">Mathematics Grade 10</Typography>
            <Typography className="text-slate-500  text-xs">Status: Overdue</Typography>
          </View>
          <View>
            <Typography className="text-slate-900  font-medium">Science Textbook</Typography>
            <Typography className="text-slate-500  text-xs">Status: Active</Typography>
          </View>
        </View>
      </View>
    </View>
  )

  const renderTransportTab = () => (
    <View className="bg-white  rounded-lg p-4 mb-4">
      <View className="space-y-3">
        <View>
          <Typography className="text-sm font-medium text-slate-600  mb-1">Assigned Route</Typography>
          <View className="bg-slate-100  p-3 rounded-lg">
            <Typography className="text-slate-900 ">Route A - City Center to School</Typography>
          </View>
        </View>

        <View>
          <Typography className="text-sm font-medium text-slate-600  mb-1">Vehicle Number</Typography>
          <View className="bg-slate-100  p-3 rounded-lg">
            <Typography className="text-slate-900 ">MH-12-AB-1234</Typography>
          </View>
        </View>

        <View>
          <Typography className="text-sm font-medium text-slate-600  mb-1">Driver Name</Typography>
          <View className="bg-slate-100  p-3 rounded-lg">
            <Typography className="text-slate-900 ">Rajesh Kumar</Typography>
          </View>
        </View>

        <View>
          <Typography className="text-sm font-medium text-slate-600  mb-1">Pickup Time</Typography>
          <View className="bg-slate-100  p-3 rounded-lg">
            <Typography className="text-slate-900 ">7:30 AM</Typography>
          </View>
        </View>

        <View>
          <Typography className="text-sm font-medium text-slate-600  mb-1">Monthly Fee</Typography>
          <View className="bg-slate-100  p-3 rounded-lg">
            <Typography className="text-slate-900 ">₹2,500</Typography>
          </View>
        </View>
      </View>
    </View>
  )

  const renderHostelTab = () => (
    <View className="bg-white  rounded-lg p-4 mb-4">
      <View className="space-y-3">
        <View>
          <Typography className="text-sm font-medium text-slate-600  mb-1">Hostel Block</Typography>
          <View className="bg-slate-100  p-3 rounded-lg">
            <Typography className="text-slate-900 ">Block A - Boys Hostel</Typography>
          </View>
        </View>

        <View>
          <Typography className="text-sm font-medium text-slate-600  mb-1">Room Number</Typography>
          <View className="bg-slate-100  p-3 rounded-lg">
            <Typography className="text-slate-900 ">A-201</Typography>
          </View>
        </View>

        <View>
          <Typography className="text-sm font-medium text-slate-600  mb-1">Bed Number</Typography>
          <View className="bg-slate-100  p-3 rounded-lg">
            <Typography className="text-slate-900 ">Bed 2</Typography>
          </View>
        </View>

        <View>
          <Typography className="text-sm font-medium text-slate-600  mb-1">Warden</Typography>
          <View className="bg-slate-100  p-3 rounded-lg">
            <Typography className="text-slate-900 ">Mr. Sharma</Typography>
          </View>
        </View>

        <View>
          <Typography className="text-sm font-medium text-slate-600  mb-1">Monthly Fee</Typography>
          <View className="bg-slate-100  p-3 rounded-lg">
            <Typography className="text-slate-900 ">₹8,000</Typography>
          </View>
        </View>
      </View>
    </View>
  )

  const renderSecurityTab = () => (
    <View className="bg-white  rounded-lg p-4 mb-4">
      <TouchableOpacity
        onPress={() => setPasswordModalVisible(true)}
        className="bg-indigo-600 rounded-lg p-3 flex-row items-center justify-center"
      >
        <Ionicons name="lock-closed" size={18} color="white" />
        <Typography className="text-white font-semibold ml-2">Change Password</Typography>
      </TouchableOpacity>
    </View>
  )

  const renderHistoryTab = () => (
    <View className="bg-white  rounded-lg p-4 mb-4">
      <View className="space-y-3">
        <View className="border-l-4 border-blue-500 pl-3 py-2">
          <Typography className="text-slate-900  font-medium">Profile Updated</Typography>
          <Typography className="text-slate-500  text-xs">
            Contact number changed - 2024-01-15 10:30 AM
          </Typography>
        </View>
        <View className="border-l-4 border-green-500 pl-3 py-2">
          <Typography className="text-slate-900  font-medium">Fee Payment</Typography>
          <Typography className="text-slate-500  text-xs">
            Tuition fee paid ₹25,000 - 2024-01-10 2:15 PM
          </Typography>
        </View>
        <View className="border-l-4 border-purple-500 pl-3 py-2">
          <Typography className="text-slate-900  font-medium">Book Issued</Typography>
          <Typography className="text-slate-500  text-xs">
            Mathematics Grade 10 issued - 2024-01-08 11:45 AM
          </Typography>
        </View>
        <View className="border-l-4 border-orange-500 pl-3 py-2">
          <Typography className="text-slate-900  font-medium">Transport Route Changed</Typography>
          <Typography className="text-slate-500  text-xs">Assigned to Route A - 2024-01-05 9:20 AM</Typography>
        </View>
      </View>
    </View>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileTab()
      case "health":
        return renderHealthTab()
      case "fees":
        return renderFeesTab()
      case "library":
        return renderLibraryTab()
      case "transport":
        return renderTransportTab()
      case "hostel":
        return renderHostelTab()
      case "security":
        return renderSecurityTab()
      case "history":
        return renderHistoryTab()
      default:
        return null
    }
  }

  return (

    <SafeAreaView className="flex-1 bg-background">

      <View className="flex-row items-center p-4">
        <TouchableOpacity
          onPress={() => router.push("/management")}
          className="flex-row items-center bg-white border border-border rounded-lg px-3 py-2 mr-2"
        >
          <Typography className="text-primary font-semibold">← Back</Typography>
        </TouchableOpacity>
        <Typography className="text-xl font-bold text-foreground">Student Profile</Typography>
      </View>


      <ScrollView className="flex-1 px-4 ">
        <View className=" mb-4">


          <Typography className="text-text-color text-2xl font-bold">Student Profile</Typography>
          <Typography className="text-nav-text text-sm mt-1">View and manage student profile</Typography>

        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="flex-row gap-2">
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg flex-row items-center gap-2 ${activeTab === tab.id
                  ? "bg-indigo-600"
                  : "bg-white  border-slate-200 "
                  }`}
              >
                <Ionicons name={tab.icon as any} size={16} color={activeTab === tab.id ? "white" : "#64748b"} />
                <Typography
                  className={`text-sm font-medium ${activeTab === tab.id ? "text-white" : "text-slate-600 "
                    }`}
                >
                  {tab.name}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>


        {renderTabContent()}
      </ScrollView>


      <Modal visible={editModalVisible} className="fixed top-0" transparent animationType="slide">
        <SafeAreaView className="flex-1 bg-black/50">
          <View className="flex-1 justify-end">
            <View className="bg-white  rounded-t-2xl p-4">
              <View className="flex-row justify-between items-center mb-4">
                <Typography className="text-lg font-bold text-slate-900 ">Update Health Details</Typography>
                <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>

              <View className="space-y-4 mb-4">
                <View>
                  <Typography className="text-sm font-medium text-slate-600  mb-2">Height (cm)</Typography>
                  <TextInput
                    value={String(healthData.height)}
                    onChangeText={(text) => setHealthData({ ...healthData, height: Number(text) })}
                    placeholder="Enter height"
                    keyboardType="numeric"
                    className="bg-slate-100  border border-slate-300  rounded-lg p-3 text-slate-900 "
                  />
                </View>

                <View>
                  <Typography className="text-sm font-medium text-slate-600  mb-2">Weight (kg)</Typography>
                  <TextInput
                    value={String(healthData.weight)}
                    onChangeText={(text) => setHealthData({ ...healthData, weight: Number(text) })}
                    placeholder="Enter weight"
                    keyboardType="numeric"
                    className="bg-slate-100  border border-slate-300  rounded-lg p-3 text-slate-900 "
                  />
                </View>

                <View>
                  <Typography className="text-sm font-medium text-slate-600  mb-2">Measure Date</Typography>
                  <TextInput
                    value={healthData.measureDate}
                    onChangeText={(text) => setHealthData({ ...healthData, measureDate: text })}
                    placeholder="YYYY-MM-DD"
                    className="bg-slate-100  border border-slate-300  rounded-lg p-3 text-slate-900 "
                  />
                </View>
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setEditModalVisible(false)}
                  className="flex-1 bg-slate-200  rounded-lg p-3"
                >
                  <Typography className="text-center font-semibold text-slate-900 ">Close</Typography>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setEditModalVisible(false)
                  }}
                  className="flex-1 bg-indigo-600 rounded-lg p-3"
                >
                  <Typography className="text-center font-semibold text-white">Save</Typography>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      <Modal visible={passwordModalVisible} transparent animationType="slide">
        <SafeAreaView className="flex-1 bg-black/50">
          <View className="flex-1 justify-end">
            <View className="bg-white  rounded-t-2xl p-4">
              <View className="flex-row justify-between items-center mb-4">
                <Typography className="text-lg font-bold text-slate-900 ">Change Password</Typography>
                <TouchableOpacity onPress={() => setPasswordModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>

              <View className="space-y-4 mb-4">
                <View>
                  <Typography className="text-sm font-medium text-slate-600  mb-2">New Password</Typography>
                  <TextInput
                    value={passwordData.newPassword}
                    onChangeText={(text) => setPasswordData({ ...passwordData, newPassword: text })}
                    placeholder="Enter new password"
                    secureTextEntry
                    className="bg-slate-100  border border-slate-300  rounded-lg p-3 text-slate-900 "
                  />
                </View>

                <View>
                  <Typography className="text-sm font-medium text-slate-600  mb-2">Confirm Password</Typography>
                  <TextInput
                    value={passwordData.confirmPassword}
                    onChangeText={(text) => setPasswordData({ ...passwordData, confirmPassword: text })}
                    placeholder="Confirm password"
                    secureTextEntry
                    className="bg-slate-100  border border-slate-300  rounded-lg p-3 text-slate-900 "
                  />
                </View>
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setPasswordModalVisible(false)}
                  className="flex-1 bg-slate-200  rounded-lg p-3"
                >
                  <Typography className="text-center font-semibold text-slate-900 ">Close</Typography>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setPasswordModalVisible(false)
                  }}
                  className="flex-1 bg-indigo-600 rounded-lg p-3"
                >
                  <Typography className="text-center font-semibold text-white">Change</Typography>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  )
}
