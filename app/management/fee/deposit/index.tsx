"use client"

import { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import RNPickerSelect from "react-native-picker-select"
import { MaterialCommunityIcons } from "@expo/vector-icons"

// Mock API - replace with actual API calls
const getAllClass = async () => {
  return [
    { _id: "1", name: "Class 10-A" },
    { _id: "2", name: "Class 10-B" },
  ]
}

const getClassStudents = async (classId: string) => {
  return [
    { _id: "1", first_name: "John", last_name: "Doe", admission_no: "ADM001" },
    { _id: "2", first_name: "Jane", last_name: "Smith", admission_no: "ADM002" },
  ]
}

const getStudentDetails = async (studentId: string) => {
  return {
    data: {
      data: {
        admission_no: "ADM001",
        first_name: "John",
        middle_name: "",
        last_name: "Doe",
        father_name: "Robert Doe",
        total_fee: 50000,
        paid_fee: 20000,
        remaining_fee: 30000,
      },
    },
  }
}

const depositFee = async (data: any) => {
  return { data: { message: "Fee deposited successfully", data: "1" } }
}

export default function FeePayment() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const [allClass, setAllClass] = useState([])
  const [allStudents, setAllStudents] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [studentDetails, setStudentDetails] = useState<any>(null)
  const [amount, setAmount] = useState("")
  const [paymentMode, setPaymentMode] = useState("CASH")
  const [remarks, setRemarks] = useState("")
  const [referenceNo, setReferenceNo] = useState("")
  const [loading, setLoading] = useState(false)
  const [depositing, setDepositing] = useState(false)

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classes = await getAllClass()
        setAllClass(classes)
      } catch (error) {
        Alert.alert("Error", "Failed to fetch classes")
      }
    }
    fetchClasses()
  }, [])

  const handleClassChange = async (value: string) => {
    setSelectedClass(value)
    setSelectedStudent(null)
    setStudentDetails(null)
    try {
      setLoading(true)
      const students = await getClassStudents(value)
      setAllStudents(students)
    } catch (error) {
      Alert.alert("Error", "Failed to fetch students")
    } finally {
      setLoading(false)
    }
  }

  const handleStudentChange = async (value: string) => {
    setSelectedStudent(value)
    try {
      const details = await getStudentDetails(value)
      setStudentDetails(details.data.data)
    } catch (error) {
      Alert.alert("Error", "Failed to fetch student details")
    }
  }

  const handleSubmit = async () => {
    if (!selectedStudent || !amount) {
      Alert.alert("Error", "Please fill all required fields")
      return
    }

    setDepositing(true)
    try {
      await depositFee({
        student_id: selectedStudent,
        paid_amount: Number(amount),
        payment_mode: paymentMode,
        remarks,
        reference_no: referenceNo,
      })
      Alert.alert("Success", "Fee deposited successfully")
      router.push(`/fee-slip/${selectedStudent}`)
    } catch (error) {
      Alert.alert("Error", "Failed to deposit fee")
    } finally {
      setDepositing(false)
    }
  }

  const classList = allClass.map((item) => ({
    label: item.name,
    value: item._id,
  }))

  const studentList = allStudents.map((item: any) => ({
    label: `(${item.admission_no}) ${item.first_name} ${item.last_name}`,
    value: item._id,
  }))

  const paymentModes = [
    { label: "Cash", value: "CASH" },
    { label: "UPI", value: "UPI" },
    { label: "Card", value: "CARD" },
    { label: "Bank Transfer", value: "BANK_TRANSFER" },
  ]

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-gray-900"
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-4 py-6 space-y-6">
        <View>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Fee Payment</Text>
          <Text className="text-sm mt-1 text-gray-600 dark:text-gray-400">Deposit student fees</Text>
        </View>

        <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
          <View>
            <Text className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Select Class</Text>
            <RNPickerSelect
              items={classList}
              onValueChange={handleClassChange}
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

          {selectedClass && (
            <View>
              <Text className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Select Student</Text>
              <RNPickerSelect
                items={studentList}
                onValueChange={handleStudentChange}
                value={selectedStudent}
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
          )}
        </View>

        {studentDetails && (
          <>
            <View className="space-y-3">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">Student Information</Text>
              <View className="rounded-lg p-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <Text className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Admission No</Text>
                <Text className="font-semibold text-gray-900 dark:text-white">{studentDetails.admission_no}</Text>
              </View>
              <View className="rounded-lg p-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <Text className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Student Name</Text>
                <Text className="font-semibold text-gray-900 dark:text-white">
                  {studentDetails.first_name} {studentDetails.last_name}
                </Text>
              </View>
            </View>

            <View className="space-y-3">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">Fee Summary</Text>
              <View className="rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
                <Text className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">Total Fee</Text>
                <View className="flex-row items-center gap-1">
                  <MaterialCommunityIcons name="currency-inr" size={20} color="#3b82f6" />
                  <Text className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                    ₹{studentDetails.total_fee?.toLocaleString()}
                  </Text>
                </View>
              </View>

              <View className="rounded-lg p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700">
                <Text className="text-xs font-medium text-emerald-800 dark:text-emerald-200 mb-1">Paid Fee</Text>
                <View className="flex-row items-center gap-1">
                  <MaterialCommunityIcons name="currency-inr" size={20} color="#10b981" />
                  <Text className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                    ₹{studentDetails.paid_fee?.toLocaleString()}
                  </Text>
                </View>
              </View>

              <View className="rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700">
                <Text className="text-xs font-medium text-orange-800 dark:text-orange-200 mb-1">Remaining Fee</Text>
                <View className="flex-row items-center gap-1">
                  <MaterialCommunityIcons name="currency-inr" size={20} color="#f59e0b" />
                  <Text className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                    ₹{studentDetails.remaining_fee?.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>

            <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">Payment Details</Text>

              <View>
                <Text className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Deposit Amount (₹)</Text>
                <TextInput
                  placeholder="Enter amount"
                  placeholderTextColor="#9ca3af"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700"
                />
              </View>

              <View>
                <Text className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Payment Type</Text>
                <RNPickerSelect
                  items={paymentModes}
                  onValueChange={setPaymentMode}
                  value={paymentMode}
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

              {paymentMode !== "CASH" && (
                <View>
                  <Text className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Reference Number</Text>
                  <TextInput
                    placeholder="Enter transaction reference"
                    placeholderTextColor="#9ca3af"
                    value={referenceNo}
                    onChangeText={setReferenceNo}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700"
                  />
                </View>
              )}

              <View>
                <Text className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Remarks</Text>
                <TextInput
                  placeholder="Add payment remarks..."
                  placeholderTextColor="#9ca3af"
                  value={remarks}
                  onChangeText={setRemarks}
                  multiline
                  numberOfLines={3}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700"
                />
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-3"
              >
                <Text className="text-center font-medium text-gray-700 dark:text-gray-300">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={depositing}
                className="flex-1 bg-blue-600 rounded-lg p-3 flex-row items-center justify-center gap-2"
              >
                {depositing ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <MaterialCommunityIcons name="check" size={18} color="white" />
                )}
                <Text className="text-white font-medium">{depositing ? "Processing..." : "Submit Payment"}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  )
}
