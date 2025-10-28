"use client"

import { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter, useLocalSearchParams } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"

// Mock API - replace with actual API calls
const getFeeStructureByClass = async (classId: string) => {
  return {
    _id: "1",
    class_id: classId,
    class_name: "Class 10-A",
    total_amount: 50000,
    components: [
      { head_name: "Tuition Fee", amount: 30000 },
      { head_name: "Lab Fee", amount: 10000 },
      { head_name: "Library Fee", amount: 5000 },
      { head_name: "Sports Fee", amount: 5000 },
    ],
    created_at: new Date(),
  }
}

export default function ViewFeeStructure() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { classId } = useLocalSearchParams()

  const [feeStructure, setFeeStructure] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeeStructure = async () => {
      try {
        setLoading(true)
        const structure = await getFeeStructureByClass(classId as string)
        setFeeStructure(structure)
      } catch (error) {
        Alert.alert("Error", "Failed to fetch fee structure")
      } finally {
        setLoading(false)
      }
    }
    fetchFeeStructure()
  }, [classId])

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
            <Text className="text-2xl font-bold text-gray-900 ">Fee Structure Details</Text>
            <Text className="text-sm mt-1 text-gray-600 ">{feeStructure?.class_name}</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push(`/update-fee-structure/${classId}`)}
            className="bg-amber-600 rounded-lg p-3"
          >
            <MaterialCommunityIcons name="pencil" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View className="rounded-lg p-4 border border-gray-200  bg-white ">
          <Text className="text-sm font-medium mb-2 text-gray-700 ">Class</Text>
          <Text className="text-lg font-semibold text-gray-900 ">{feeStructure?.class_name}</Text>
        </View>

        <View className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-lg p-4">
          <Text className="text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-2">Total Fee Amount</Text>
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons name="currency-inr" size={28} color="#10b981" />
            <Text className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">
              ₹{feeStructure?.total_amount?.toLocaleString()}
            </Text>
          </View>
        </View>

        <View className="space-y-3">
          <Text className="text-lg font-semibold text-gray-900 ">Fee Components Breakdown</Text>
          {feeStructure?.components?.map((component: any, index: number) => (
            <View
              key={index}
              className="rounded-lg p-4 border border-gray-200  bg-white "
            >
              <View className="flex-row items-center justify-between">
                <Text className="font-medium text-gray-900 ">{component.head_name}</Text>
                <View className="flex-row items-center gap-1">
                  <MaterialCommunityIcons name="currency-inr" size={16} color="#10b981" />
                  <Text className="font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{component.amount?.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          ))}
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
