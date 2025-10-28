"use client"

import { useEffect, useState } from "react"
import { View, Text, ScrollView, FlatList, TextInput, ActivityIndicator, Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"

// Mock API - replace with actual API calls
const getFeeHistory = async () => {
  return [
    {
      _id: "1",
      student_name: "John Doe",
      admission_no: "ADM001",
      paid_amount: 10000,
      payment_mode: "CASH",
      deposit_at: new Date(),
      status: "COMPLETED",
    },
    {
      _id: "2",
      student_name: "Jane Smith",
      admission_no: "ADM002",
      paid_amount: 15000,
      payment_mode: "UPI",
      deposit_at: new Date(),
      status: "COMPLETED",
    },
  ]
}

export default function FeeHistory() {
  const insets = useSafeAreaInsets()

  const [feeHistory, setFeeHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true)
        const history = await getFeeHistory()
        setFeeHistory(history)
      } catch (error) {
        Alert.alert("Error", "Failed to fetch fee history")
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  const filteredHistory = feeHistory.filter(
    (item: any) =>
      item.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) || item.admission_no?.includes(searchTerm),
  )

  const totalAmount = feeHistory.reduce((sum: number, item: any) => sum + (item.paid_amount || 0), 0)

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-gray-900"
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-4 py-6 space-y-6">
        <View>
          <Text className="text-2xl font-bold text-gray-900 ">Fee History</Text>
          <Text className="text-sm mt-1 text-gray-600 ">View all fee payments</Text>
        </View>

        <View className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-lg p-4">
          <Text className="text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-1">Total Collected</Text>
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons name="currency-inr" size={24} color="#10b981" />
            <Text className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              ₹{totalAmount.toLocaleString()}
            </Text>
          </View>
        </View>

        <View className="rounded-lg p-4 border border-gray-200  bg-white ">
          <View className="flex-row items-center px-3 rounded-lg border border-gray-300 ">
            <MaterialCommunityIcons name="magnify" size={20} color="#6b7280" />
            <TextInput
              placeholder="Search by name or admission no..."
              placeholderTextColor="#9ca3af"
              value={searchTerm}
              onChangeText={setSearchTerm}
              className="flex-1 ml-2 py-2 text-sm text-gray-900 "
            />
          </View>
        </View>

        {loading ? (
          <View className="flex-row items-center justify-center py-12">
            <ActivityIndicator size="large" color="#10b981" />
          </View>
        ) : filteredHistory.length > 0 ? (
          <FlatList
            scrollEnabled={false}
            data={filteredHistory}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View className="mb-3 rounded-lg p-4 border border-gray-200  bg-white ">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900 ">{item.student_name}</Text>
                    <Text className="text-xs mt-1 text-gray-600 ">
                      Admission: {item.admission_no}
                    </Text>
                  </View>
                  <View className="bg-emerald-100 dark:bg-emerald-900 px-2 py-1 rounded">
                    <Text className="text-xs font-medium text-emerald-700 dark:text-emerald-300">{item.status}</Text>
                  </View>
                </View>
                <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-200 ">
                  <View className="flex-row items-center gap-1">
                    <MaterialCommunityIcons name="currency-inr" size={16} color="#10b981" />
                    <Text className="font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{item.paid_amount?.toLocaleString()}
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-600 ">
                    {new Date(item.deposit_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            )}
          />
        ) : (
          <View className="items-center justify-center py-12">
            <MaterialIcons name="folder-open" size={48} color="#d1d5db" />
            <Text className="text-gray-500  mt-2">No fee history found</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}
