"use client"

import { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, ActivityIndicator, RefreshControl } from "react-native"
import { useRouter } from "expo-router"
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import { Typography } from "@/components/Typography"

import { getAllFeeStructure } from "@/service/management/feeStructure"

interface FeeStructure {
  _id: string
  class_id: string
  class_name: string
  total_amount: number
  components: Array<{ head_name: string; amount: number }>
  created_at: string
}

export default function FeeStructureListScreen() {
  const router = useRouter()
  const [allFeeStructure, setAllFeeStructure] = useState<FeeStructure[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const get_fee_structure_request = async () => {
    setLoading(true)
    const mockData: FeeStructure[] = await getAllFeeStructure()
    setAllFeeStructure(mockData)
    setLoading(false)
  }

  useEffect(() => {

    get_fee_structure_request()
  }, [])

  const filteredData = allFeeStructure.filter((fee) => fee.class_name?.toLowerCase().includes(searchTerm.toLowerCase()))

  const renderFeeItem = ({ item }: { item: FeeStructure }) => (
    <View className="bg-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-sm">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <View className="bg-card-bg p-2 rounded-lg mr-3">
            <MaterialIcons name="school" size={20} color="#6b7280" />
          </View>
          <Text className="text-text-color font-semibold text-base flex-1">{item.class_name}</Text>
        </View>
      </View>

      <View className="bg-green-50 border border-green-200 rounded-xl p-3 mb-3">
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="currency-inr" size={20} color="#16a34a" />
          <Text className="text-green-700 font-bold text-lg ml-2">₹{item.total_amount.toLocaleString()}</Text>
        </View>
      </View>

      <Text className="text-nav-text text-xs mb-2">Updated: {new Date(item.created_at).toLocaleDateString()}</Text>

      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={() => router.push(`/management/fee/structure/view/${item.class_id}`)}
          className="flex-1 bg-blue-50 border border-blue-200 rounded-lg py-2 px-3"
        >
          <View className="flex-row items-center justify-center">
            <MaterialIcons name="visibility" size={16} color="#2563eb" />
            <Text className="text-blue-600 font-medium text-sm ml-1">View</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/management/fee/structure/update/${item.class_id}`)}
          className="flex-1 bg-indigo-50 border border-indigo-200 rounded-lg py-2 px-3"
        >
          <View className="flex-row items-center justify-center">
            <MaterialIcons name="edit" size={16} color="#4f46e5" />
            <Text className="text-indigo-600 font-medium text-sm ml-1">Edit</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView className="flex-1 bg-background">

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={loading} onRefresh={get_fee_structure_request}/>}>
        <View className="flex-row items-center p-4">
          <TouchableOpacity
            onPress={() => router.push("/management")}
            className="flex-row items-center bg-white border border-border rounded-lg px-3 py-2 mr-2"
          >
            <Typography className="text-primary font-semibold">← Back</Typography>
          </TouchableOpacity>

          <Typography className="text-xl font-bold text-foreground"> Fee Structure</Typography>
        </View>
        <View className="flex-row items-center justify-between px-4 pt-6 pb-4 ">
          <View className=" mb-4">


            <Text className="text-text-color text-2xl font-bold">Fee Structure</Text>
            <Text className="text-nav-text text-sm mt-1">Manage class fee structures</Text>

          </View>

          <TouchableOpacity
            onPress={() => router.push("/management/fee/structure/create")}
            className="bg-blue-600 rounded-xl py-3 px-4 flex-row items-center justify-center"
          >
            <MaterialIcons name="add" size={20} color="white" />
            {/* <Text className="text-white font-semibold ml-2">Add Fee Structure</Text> */}
          </TouchableOpacity>
        </View>


        <View className="px-4 py-4 ">
          <View className="bg-white border border-gray-200 rounded-xl px-3 py-2 flex-row items-center">
            <MaterialIcons name="search" size={20} color="#6b7280" />
            <TextInput
              placeholder="Search by class name..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              className="flex-1 ml-2 text-text-color"
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>


        <View className="px-4 pb-6">
          {loading ? (
            <View className="py-8 items-center justify-center">
              <ActivityIndicator size="large" color="#2563eb" />
            </View>
          ) : filteredData.length > 0 ? (
            <FlatList
              data={filteredData}
              renderItem={renderFeeItem}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
            />
          ) : (
            <View className="py-12 items-center justify-center">
              <View className="bg-card-bg rounded-full p-4 mb-4">
                <MaterialCommunityIcons name="cash-multiple" size={32} color="#6b7280" />
              </View>
              <Text className="text-text-color font-semibold text-lg mb-2">No fee structures found</Text>
              <Text className="text-nav-text text-sm mb-6">
                {searchTerm ? "Try adjusting your search" : "Create your first fee structure"}
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/management/fee/structure/create")}
                className="bg-blue-600 rounded-xl py-3 px-6 flex-row items-center"
              >
                <MaterialIcons name="add" size={18} color="white" />
                <Text className="text-white font-semibold ml-2">Create Fee Structure</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

    </SafeAreaView>
  )
}
