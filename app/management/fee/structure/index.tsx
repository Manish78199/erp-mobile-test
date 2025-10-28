"use client"

import { useEffect, useMemo, useState } from "react"
import { View, Text, ScrollView, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import { cn } from "@/utils/cn"

// Mock API - replace with actual API calls
const getAllFeeStructure = async () => {
  return [
    { _id: "1", class_id: "1", class_name: "Class 10-A", total_amount: 50000, created_at: new Date() },
    { _id: "2", class_id: "2", class_name: "Class 10-B", total_amount: 50000, created_at: new Date() },
    { _id: "3", class_id: "3", class_name: "Class 9-A", total_amount: 45000, created_at: new Date() },
  ]
}

const deleteFeeStructure = async (id: string) => {
  return { success: true }
}

export default function FeeStructureList() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const [allFeeStructure, setAllFeeStructure] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchFeeStructures = async () => {
      try {
        setLoading(true)
        const structures = await getAllFeeStructure()
        setAllFeeStructure(structures)
      } catch (error) {
        Alert.alert("Error", "Failed to fetch fee structures")
      } finally {
        setLoading(false)
      }
    }
    fetchFeeStructures()
  }, [])

  const filteredData = useMemo(() => {
    return allFeeStructure.filter((fee: any) => fee.class_name?.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [allFeeStructure, searchTerm])

  const totalClasses = allFeeStructure.length
  const totalRevenue = allFeeStructure.reduce((sum: number, fee: any) => sum + (fee.total_amount || 0), 0)
  const averageFee = totalClasses > 0 ? totalRevenue / totalClasses : 0

  const StatCard = ({ icon, title, value, color }: any) => (
    <View className={cn("flex-1 rounded-lg p-3 border border-gray-200  bg-white ")}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-xs font-medium mb-1 text-gray-600 ">{title}</Text>
          <Text className="text-lg font-bold text-gray-900 ">{value}</Text>
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
          <Text className="text-2xl font-bold text-gray-900 ">Fee Structure</Text>
          <Text className="text-sm mt-1 text-gray-600 ">Manage class fee structures</Text>
        </View>

        <View className="space-y-2">
          <View className="flex-row gap-2">
            <StatCard icon="school" title="Total Classes" value={totalClasses} color="bg-blue-500" />
            <StatCard
              icon="currency-inr"
              title="Total Revenue"
              value={`₹${totalRevenue.toLocaleString()}`}
              color="bg-emerald-500"
            />
          </View>
          <View className="flex-row gap-2">
            <StatCard
              icon="calculator"
              title="Average Fee"
              value={`₹${Math.round(averageFee).toLocaleString()}`}
              color="bg-purple-500"
            />
          </View>
        </View>

        <View className="rounded-lg p-4 border border-gray-200  bg-white  space-y-3">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-gray-900 ">Search</Text>
            <TouchableOpacity
              onPress={() => router.push("/fee-structure-create")}
              className="bg-emerald-600 rounded-lg p-2 flex-row items-center gap-1"
            >
              <MaterialCommunityIcons name="plus" size={18} color="white" />
              <Text className="text-white text-sm font-medium">Add</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center px-3 rounded-lg border border-gray-300 ">
            <MaterialCommunityIcons name="magnify" size={20} color="#6b7280" />
            <TextInput
              placeholder="Search by class name..."
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
        ) : filteredData.length > 0 ? (
          <FlatList
            scrollEnabled={false}
            data={filteredData}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View className="mb-3 rounded-lg p-4 border border-gray-200  bg-white ">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900 ">{item.class_name}</Text>
                    <Text className="text-xs mt-1 text-gray-600 ">
                      Updated: {new Date(item.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => router.push(`/view-fee-structure/${item.class_id}`)}
                      className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg"
                    >
                      <MaterialCommunityIcons name="eye" size={18} color="#3b82f6" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => router.push(`/update-fee-structure/${item.class_id}`)}
                      className="bg-amber-100 dark:bg-amber-900 p-2 rounded-lg"
                    >
                      <MaterialCommunityIcons name="pencil" size={18} color="#f59e0b" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View className="flex-row items-center gap-2 mt-2">
                  <MaterialCommunityIcons name="currency-inr" size={16} color="#10b981" />
                  <Text className="font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{item.total_amount?.toLocaleString()}
                  </Text>
                </View>
              </View>
            )}
          />
        ) : (
          <View className="items-center justify-center py-12">
            <MaterialIcons name="folder-open" size={48} color="#d1d5db" />
            <Text className="text-gray-500  mt-2">No fee structures found</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}
