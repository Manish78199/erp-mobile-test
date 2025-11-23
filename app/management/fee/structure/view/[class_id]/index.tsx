"use client"

import { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import { Typography } from "@/components/Typography"
import { getFeeStructureByClass } from "@/service/management/feeStructure"

interface FeeStructure {
  _id: string
  class_id: string
  class_name: string
  total_amount: number
  components: Array<{ head_name: string; amount: number }>
  created_at: string
}

export default function ViewFeeStructureScreen() {
  const router = useRouter()
  const { class_id } = useLocalSearchParams()
  const [feeStructure, setFeeStructure] = useState<FeeStructure | null>(null)
  const [loading, setLoading] = useState(true)

  const get_fee_structure_request = async () => {

    setLoading(true)

    const mockData = await getFeeStructureByClass(class_id)
    setFeeStructure(mockData)

    setLoading(false)
  }
  useEffect(() => {


    get_fee_structure_request()

  }, [class_id])

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center p-4">
        <TouchableOpacity
          onPress={() => router.push("/management/fee/structure")}
          className="flex-row items-center bg-white border border-border rounded-lg px-3 py-2 mr-2"
        >
          <Typography className="text-primary font-semibold">← Back</Typography>
        </TouchableOpacity>

        <Typography className="text-xl font-bold text-foreground"> Fee components</Typography>
      </View>
      <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={get_fee_structure_request} />} className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className=" px-4 pt-6 pb-4 ">

          <Text className="text-2xl font-bold text-text-color">Fee Structure</Text>
          <Text className="text-nav-text text-sm mt-1">View fee components</Text>
        </View>


        <View className="px-4 py-6">

          <View className="bg-white border border-gray-200 rounded-2xl p-4 mb-6">
            <Text className="text-nav-text text-sm font-medium mb-2">Class</Text>
            <View className="flex-row items-center">
              <View className="bg-blue-50 p-2 rounded-lg mr-3">
                <MaterialIcons name="school" size={20} color="#2563eb" />
              </View>
              <Text className="text-text-color font-semibold text-lg">{feeStructure?.class_name}</Text>
            </View>
          </View>

          {/* Total Fee Card */}
          <View className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
            <Text className="text-nav-text text-sm font-medium mb-3">Total Fee Amount</Text>
            <View className="flex-row items-center">
              <View className="bg-green-100 p-2 rounded-lg mr-3">
                <MaterialCommunityIcons name="currency-inr" size={24} color="#16a34a" />
              </View>
              <Text className="text-green-700 font-bold text-2xl">₹{feeStructure?.total_amount.toLocaleString()}</Text>
            </View>
          </View>

          {/* Fee Components */}
          {feeStructure?.components && feeStructure.components.length > 0 && (
            <View>
              <Text className="text-lg font-bold text-text-color mb-4">Fee Components Breakdown</Text>
              {feeStructure.components.map((component, index) => (
                <View key={index} className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
                  <Text className="text-nav-text text-sm font-medium mb-2">{component.head_name}</Text>
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons name="currency-inr" size={18} color="#6b7280" />
                    <Text className="text-text-color font-semibold text-lg ml-1">
                      ₹{component.amount.toLocaleString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Edit Button */}
          <TouchableOpacity
            onPress={() => router.push(`/management/fee/structure/update/${feeStructure?.class_id}`)}
            className="bg-indigo-600 rounded-xl py-3 px-4 flex-row items-center justify-center mt-6 mb-6"
          >
            <MaterialIcons name="edit" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Edit Structure</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
