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
    { _id: "3", name: "Class 9-A" },
  ]
}

const createFeeStructure = async (data: any) => {
  return { success: true, data: "Fee structure created" }
}

export default function CreateFeeStructure() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const [allClass, setAllClass] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [selectedClassName, setSelectedClassName] = useState("")
  const [components, setComponents] = useState([{ head_name: "Tuition Fee", amount: 0 }])
  const [totalAmount, setTotalAmount] = useState(0)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classes = await getAllClass()
        setAllClass(classes)
        if (classes.length > 0) {
          setSelectedClass(classes[0]._id)
          setSelectedClassName(classes[0].name)
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch classes")
      }
    }
    fetchClasses()
  }, [])

  useEffect(() => {
    const total = components.reduce((sum, comp) => sum + (Number(comp.amount) || 0), 0)
    setTotalAmount(total)
  }, [components])

  const handleSelectClass = (value: string) => {
    setSelectedClass(value)
    const classObj = allClass.find((c) => c._id === value)
    if (classObj) setSelectedClassName(classObj.name)
  }

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
    if (!selectedClass) {
      Alert.alert("Error", "Please select a class")
      return
    }

    setCreating(true)
    try {
      await createFeeStructure({
        class_id: selectedClass,
        components,
      })
      Alert.alert("Success", "Fee structure created successfully")
      router.push("/fee-structure-list")
    } catch (error) {
      Alert.alert("Error", "Failed to create fee structure")
    } finally {
      setCreating(false)
    }
  }

  const classList = allClass.map((item) => ({
    label: item.name,
    value: item._id,
  }))

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-gray-900"
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-4 py-6 space-y-6">
        <View>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Create Fee Structure</Text>
          <Text className="text-sm mt-1 text-gray-600 dark:text-gray-400">Set up fee components for a class</Text>
        </View>

        <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
          <View>
            <Text className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Select Class</Text>
            <RNPickerSelect
              items={classList}
              onValueChange={handleSelectClass}
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

          <View className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-lg p-4">
            <Text className="text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-1">Total Fee Amount</Text>
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons name="currency-inr" size={24} color="#10b981" />
              <Text className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                ₹{totalAmount.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        <View className="space-y-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">Fee Components</Text>
            <TouchableOpacity onPress={addComponent} className="bg-blue-600 rounded-lg p-2 flex-row items-center gap-1">
              <MaterialCommunityIcons name="plus" size={18} color="white" />
              <Text className="text-white text-sm font-medium">Add</Text>
            </TouchableOpacity>
          </View>

          {components.map((component, index) => (
            <View
              key={index}
              className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-3"
            >
              <View>
                <Text className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Fee Particular</Text>
                <TextInput
                  placeholder="e.g., Tuition Fee"
                  placeholderTextColor="#9ca3af"
                  value={component.head_name}
                  onChangeText={(text) => updateComponent(index, "head_name", text)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700"
                />
              </View>

              <View className="flex-row items-center gap-2">
                <View className="flex-1">
                  <Text className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Amount (₹)</Text>
                  <TextInput
                    placeholder="0"
                    placeholderTextColor="#9ca3af"
                    value={component.amount.toString()}
                    onChangeText={(text) => updateComponent(index, "amount", Number(text) || 0)}
                    keyboardType="numeric"
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700"
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
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-3"
          >
            <Text className="text-center font-medium text-gray-700 dark:text-gray-300">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={creating}
            className="flex-1 bg-blue-600 rounded-lg p-3 flex-row items-center justify-center gap-2"
          >
            {creating ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <MaterialCommunityIcons name="check" size={18} color="white" />
            )}
            <Text className="text-white font-medium">{creating ? "Creating..." : "Create"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
