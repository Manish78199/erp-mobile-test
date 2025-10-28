
import { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useLocalSearchParams, useRouter } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"

// Mock API - replace with actual API calls
const getFeeSlip = async (depositId: string) => {
  return {
    slip_code: "SLIP001",
    school_logo: "",
    student_name: "John Doe",
    father_name: "Robert Doe",
    admission_no: "ADM001",
    school_address: "123 School Street",
    roll_number: "15",
    class_name: "Class 10-A",
    deposit_at: new Date().toISOString(),
    paid_amount: 10000,
    payment_mode: "CASH",
    reference_no: "TXN001",
    remarks: "April Fee",
    session: "2025-2026",
    school_name: "The Kids Heaven School",
  }
}

export default function FeeSlip() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { depositId } = useLocalSearchParams()

  const [feeSlip, setFeeSlip] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSlip = async () => {
      try {
        setLoading(true)
        const slip = await getFeeSlip(depositId as string)
        setFeeSlip(slip)
      } catch (error) {
        Alert.alert("Error", "Failed to fetch fee slip")
      } finally {
        setLoading(false)
      }
    }
    fetchSlip()
  }, [depositId])

  if (loading) {
    return (
      <View className="flex-1 bg-white dark:bg-gray-900 items-center justify-center">
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    )
  }

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-gray-900"
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-4 py-6 space-y-6">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-900 ">Fee Slip</Text>
            <Text className="text-sm mt-1 text-gray-600 ">{feeSlip?.slip_code}</Text>
          </View>
          <TouchableOpacity className="bg-blue-600 rounded-lg p-3">
            <MaterialCommunityIcons name="printer" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View className="rounded-lg p-4 border border-gray-200  bg-white  space-y-4">
          <View className="border-b border-gray-200  pb-4">
            <Text className="text-lg font-bold text-gray-900 ">{feeSlip?.school_name}</Text>
            <Text className="text-sm text-gray-600  mt-1">{feeSlip?.school_address}</Text>
            <Text className="text-sm text-gray-600  mt-1">Session: {feeSlip?.session}</Text>
          </View>

          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-sm font-medium text-gray-600 ">Student Name:</Text>
              <Text className="font-semibold text-gray-900 ">{feeSlip?.student_name}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm font-medium text-gray-600 ">Admission No:</Text>
              <Text className="font-semibold text-gray-900 ">{feeSlip?.admission_no}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm font-medium text-gray-600 ">Father's Name:</Text>
              <Text className="font-semibold text-gray-900 ">{feeSlip?.father_name}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm font-medium text-gray-600 ">Roll Number:</Text>
              <Text className="font-semibold text-gray-900 ">{feeSlip?.roll_number}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm font-medium text-gray-600 ">Class:</Text>
              <Text className="font-semibold text-gray-900 ">{feeSlip?.class_name}</Text>
            </View>
          </View>

          <View className="border-t border-gray-200  pt-4 space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-sm font-medium text-gray-600 ">Payment Date:</Text>
              <Text className="font-semibold text-gray-900 ">
                {new Date(feeSlip?.deposit_at).toLocaleDateString()}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm font-medium text-gray-600 ">Payment Mode:</Text>
              <Text className="font-semibold text-gray-900 ">{feeSlip?.payment_mode}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm font-medium text-gray-600 ">Reference No:</Text>
              <Text className="font-semibold text-gray-900 ">{feeSlip?.reference_no}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm font-medium text-gray-600 ">Amount Paid:</Text>
              <View className="flex-row items-center gap-1">
                <MaterialCommunityIcons name="currency-inr" size={16} color="#10b981" />
                <Text className="font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{feeSlip?.paid_amount?.toLocaleString()}
                </Text>
              </View>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm font-medium text-gray-600 ">Remarks:</Text>
              <Text className="font-semibold text-gray-900 ">{feeSlip?.remarks}</Text>
            </View>
          </View>

          <View className="border-t border-gray-200  pt-4 text-center">
            <Text className="text-xs text-gray-600 ">Printed On: {new Date().toLocaleString()}</Text>
            <Text className="text-xs text-gray-600  mt-2">This is a system-generated slip.</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.back()}
          className="border border-gray-300  rounded-lg p-3"
        >
          <Text className="text-center font-medium text-gray-700 ">Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
