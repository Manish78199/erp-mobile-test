"use client"

import { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native"
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

const updateFeeStructure = async (data: any) => {
  return { success: true, data: "Fee structure updated" }
}

export default function UpdateFeeStructure() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { classId } = useLocalSearchParams()

  const [feeStructure, setFeeStructure] = useState<any>(null)
  const [components, setComponents] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchFeeStructure = async () => {
      try {
        setLoading(true)
        const structure = await getFeeStructureByClass(classId as string)
        setFeeStructure(structure)
        setComponents(structure.components)
        setTotalAmount(structure.total_amount)
      } catch (error) {
        Alert.alert("Error", "Failed to fetch fee structure")
      } finally {
        setLoading(false)
      }
    }
    fetchFeeStructure()
  }, [classId])

  useEffect(() => {
    const total = components.reduce((sum, comp) => sum + (Number(comp.amount) || 0), 0)
    setTotalAmount(total)
  }, [components])

  const addComponent = () => {
    setComponents([...components, { head_name: "", amount: 0 }])
  }

  const removeComponent = (index: number) => {
    if (components.length > 1) {
      setComponents(components.filter((_, i) => i !== index))
    }
  }

  const updateComponent = (index: number, field: string, value: any) => {
    const updated = [...components]
    updated[index] = { ...updated[index], [field]: value }
    setComponents(updated)
  }

  const handleSubmit = async () => {
    setUpdating(true)
    try {
      await updateFeeStructure({
        class_id: classId,
        components,
      })
      Alert.alert("Success", "Fee structure updated successfully")
      router.push("/fee-structure-list")
    } catch (error) {
      Alert.alert("Error", "Failed to update fee structure")
    } finally {
      setUpdating(false)
    }
  }

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
        <View>
          <Text className="text-2xl font-bold text-gray-900 ">Update Fee Structure</Text>
          <Text className="text-sm mt-1 text-gray-600 ">{feeStructure?.class_name}</Text>
        </View>

        <View className="rounded-lg p-4 border border-gray-200  bg-white ">
          <Text className="text-sm font-medium mb-2 text-gray-700 ">Class</Text>
          <Text className="text-lg font-semibold text-gray-900 ">{feeStructure?.class_name}</Text>
        </View>

        <View className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-lg p-4">
          <Text className="text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-1">Total Fee Amount</Text>
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons name="currency-inr" size={24} color="#10b981" />
            <Text className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              ₹{totalAmount.toLocaleString()}
            </Text>
          </View>
        </View>

        <View className="space-y-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-900 ">Fee Components</Text>
            <TouchableOpacity onPress={addComponent} className="bg-blue-600 rounded-lg p-2 flex-row items-center gap-1">
              <MaterialCommunityIcons name="plus" size={18} color="white" />
              <Text className="text-white text-sm font-medium">Add</Text>
            </TouchableOpacity>
          </View>

          {components.map((component, index) => (
            <View
              key={index}
              className="rounded-lg p-4 border border-gray-200  bg-white  space-y-3"
            >
              <View>
                <Text className="text-sm font-medium mb-2 text-gray-700 ">Fee Particular</Text>
                <TextInput
                  placeholder="e.g., Tuition Fee"
                  placeholderTextColor="#9ca3af"
                  value={component.head_name}
                  onChangeText={(text) => updateComponent(index, "head_name", text)}
                  className="border border-gray-300  rounded-lg px-3 py-2 text-gray-900  bg-gray-50 "
                />
              </View>

              <View className="flex-row items-center gap-2">
                <View className="flex-1">
                  <Text className="text-sm font-medium mb-2 text-gray-700 ">Amount (₹)</Text>
                  <TextInput
                    placeholder="0"
                    placeholderTextColor="#9ca3af"
                    value={component.amount.toString()}
                    onChangeText={(text) => updateComponent(index, "amount", Number(text) || 0)}
                    keyboardType="numeric"
                    className="border border-gray-300  rounded-lg px-3 py-2 text-gray-900  bg-gray-50 "
                  />
                </View>
                {index > 0 && (
                  <TouchableOpacity
                    onPress={() => removeComponent(index)}
                    className="bg-red-100 dark:bg-red-900 p-3 rounded-lg mt-6"
                  >
                    <MaterialCommunityIcons name="trash-can" size={18} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 border border-gray-300  rounded-lg p-3"
          >
            <Text className="text-center font-medium text-gray-700 ">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={updating}
            className="flex-1 bg-blue-600 rounded-lg p-3 flex-row items-center justify-center gap-2"
          >
            {updating ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <MaterialCommunityIcons name="check" size={18} color="white" />
            )}
            <Text className="text-white font-medium">{updating ? "Updating..." : "Update"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
