"use client"

import { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import RNPickerSelect from "react-native-picker-select"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useClasses } from "@/hooks/management/classes"
import { createFeeStructure } from "@/service/management/feeStructure"
import { Typography } from "@/components/Typography"





export default function CreateFeeStructure() {
  const insets = useSafeAreaInsets()
  const router = useRouter()


  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [selectedClassName, setSelectedClassName] = useState("")
  const [components, setComponents] = useState([{ head_name: "Tuition Fee", amount: 0 }])
  const [totalAmount, setTotalAmount] = useState(0)
  const [creating, setCreating] = useState(false)

  const { classes: allClass } = useClasses()

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
      router.push("/management/fee/structure")
    } catch (error) {
      Alert.alert("Error", "Failed to create fee structure")
    } finally {
      setCreating(false)
    }
  }

  const classList = allClass.map((item) => ({
    label: `${item.name} (${item?.classCode})`,
    value: item._id,
  }))

  return (
    <SafeAreaView className="flex-1 bg-background">

      <View className="flex-row items-center p-4">
        <TouchableOpacity
          onPress={() => router.push("/management")}
          className="flex-row items-center bg-white border border-border rounded-lg px-3 py-2 mr-2"
        >
          <Typography className="text-primary font-semibold">← Back</Typography>
        </TouchableOpacity>

        <Typography className="text-xl font-bold text-foreground"> Fee Structure</Typography>
      </View>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <View className="px-4 py-6 space-y-6">
          <View>
            <Typography className="text-2xl font-bold text-gray-900 ">Create Fee Structure</Typography>
            <Typography className="text-sm mt-1 text-gray-600 ">Set up fee components for a class</Typography>
          </View>

          <View className="rounded-lg p-4 mt-3 border border-gray-200  bg-white  space-y-4">
            <View>
              <Typography className="text-sm font-medium mb-2 text-gray-700 ">Select Class</Typography>
              <RNPickerSelect
                items={classList}
                onValueChange={handleSelectClass}
                value={selectedClass}
                placeholder={{ label: "-- Select class --", value: null }}
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

            <View className="bg-emerald-50  border border-emerald-200  rounded-lg p-4">
              <Typography className="text-sm font-medium text-emerald-800  mb-1">Total Fee Amount</Typography>
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons name="currency-inr" size={24} color="#10b981" />
                <Typography className="text-2xl font-bold text-emerald-700 ">
                  ₹{totalAmount.toLocaleString()}
                </Typography>
              </View>
            </View>
          </View>

          <View className="space-y-3">
            <View className="flex-row mt-5 mb-3 items-center justify-between">
              <Typography className="text-lg font-semibold text-gray-900 ">Fee Components</Typography>
              <TouchableOpacity onPress={addComponent} className="bg-blue-600 rounded-lg p-2 flex-row items-center gap-1">
                <MaterialCommunityIcons name="plus" size={18} color="white" />
                <Typography className="text-white text-sm font-medium">Add</Typography>
              </TouchableOpacity>
            </View>

            {components.map((component, index) => (
              <View
                key={index}
                className="rounded-lg p-4 mt-2 border border-gray-200  bg-white  space-y-3"
              >
                <View>
                  <Typography className="text-sm font-medium mb-2 text-gray-700 ">Fee Particular</Typography>
                  <TextInput
                    placeholder="e.g., Tuition Fee"
                    placeholderTextColor="#9ca3af"
                    value={component.head_name}
                    onChangeText={(text) => updateComponent(index, "head_name", text)}
                    className="border border-gray-300  rounded-lg px-3 py-2 text-gray-900  bg-gray-50 "
                  />
                </View>

                <View className="flex-row mt-2 items-center gap-2">
                  <View className="flex-1">
                    <Typography className="text-sm font-medium mb-2 text-gray-700 ">Amount (₹)</Typography>
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
                      className="bg-red-100  p-3 rounded-lg mt-6"
                    >
                      <MaterialCommunityIcons name="trash-can" size={18} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>

          <View className="flex-row mt-5 gap-3">
            <TouchableOpacity
              onPress={() => router.push("/management/fee/structure")}
              className="flex-1 border border-gray-300  rounded-lg p-3"
            >
              <Typography className="text-center font-medium text-gray-700 ">Cancel</Typography>
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
              <Typography className="text-white font-medium">{creating ? "Creating..." : "Create"}</Typography>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
