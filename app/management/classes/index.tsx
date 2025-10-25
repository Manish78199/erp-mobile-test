"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
  ScrollView,
  useColorScheme,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons"
import { createClass, getAllClass } from "@/service/management/class/classBasic"
import { PermitComponent } from "@/components/management/Authorization/PermitComponent"

const SECTIONS = ["A", "B", "C", "D"]

export default function ClassManagementScreen() {
  const [isOpen, setIsOpen] = useState(false)
  const [creatingClass, setCreatingClass] = useState(false)
  const [className, setClassName] = useState("")
  const [selectedSection, setSelectedSection] = useState<string[]>([])
  const [allClass, setClass] = useState<
    Array<{ name: string; classCode: string; studentCount?: number; subjectCount?: number }>
  >([])
  const [loading, setLoading] = useState(false)
  const insets = useSafeAreaInsets()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  const discardClassModal = () => {
    setClassName("")
    setSelectedSection([])
    setIsOpen(false)
  }

  const createClassRequest = async () => {
    if (!className.trim()) {
      Alert.alert("Error", "Please enter a class name")
      return
    }
    if (selectedSection.length === 0) {
      Alert.alert("Error", "Please select at least one section")
      return
    }

    setCreatingClass(true)
    const data = {
      name: className,
      section: selectedSection,
    }

    try {
      const res = await createClass(data)
      console.log(res, "createdClass")
      Alert.alert("Success", "Class created successfully")
      discardClassModal()
      getAllClassRequest()
    } catch (error) {
      console.log("error", error)
      Alert.alert("Error", "Failed to create class")
    } finally {
      setCreatingClass(false)
    }
  }

  const getAllClassRequest = async () => {
    setLoading(true)
    try {
      const allClassData = await getAllClass()
      setClass(allClassData)
    } catch (error) {
      console.log("error", error)
      Alert.alert("Error", "Failed to fetch classes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllClassRequest()
  }, [])

  const toggleSelection = (value: string) => {
    setSelectedSection((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))
  }

  const renderClassItem = ({ item }: { item: any }) => (
    <View className="flex-row items-center justify-between px-4 py-3 border-b border-zinc-700/30">
      <View className="flex-1">
        <Text className={`text-sm font-semibold ${isDark ? "text-white" : "text-black"}`}>{item.name}</Text>
        <Text className="text-xs text-zinc-500 mt-1">{item.classCode}</Text>
      </View>
      <View className="flex-row items-center space-x-4">
        <View className="items-center">
          <Text className="text-xs text-zinc-500">Students</Text>
          <Text className={`text-sm font-semibold ${isDark ? "text-white" : "text-black"}`}>
            {item.studentCount || 0}
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-xs text-zinc-500">Subjects</Text>
          <Text className={`text-sm font-semibold ${isDark ? "text-white" : "text-black"}`}>
            {item.subjectCount || 0}
          </Text>
        </View>
        <TouchableOpacity className="p-2">
          <MaterialIcons name="more-vert" size={20} color={isDark ? "#fff" : "#000"} />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View className={`flex-1 ${isDark ? "bg-zinc-900" : "bg-white"}`} style={{ paddingTop: insets.top }}>
      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          <View
            className={`w-full max-w-sm rounded-xl p-6 ${
              isDark ? "bg-zinc-800" : "bg-white"
            } border border-zinc-700/30`}
          >
            <Text className={`text-lg font-semibold ${isDark ? "text-white" : "text-black"}`}>Add New Class</Text>

            <View className="border-t border-zinc-700/30 mt-3 pt-4">
              {/* Class Name Input */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-zinc-400 mb-2">Class Name</Text>
                <TextInput
                  placeholder="Enter Class Name"
                  placeholderTextColor={isDark ? "#888" : "#ccc"}
                  value={className}
                  onChangeText={setClassName}
                  className={`rounded-lg border border-zinc-700/30 px-3 py-2 text-sm ${
                    isDark ? "bg-zinc-700/30 text-white" : "bg-gray-100 text-black"
                  }`}
                />
              </View>

              {/* Sections Selection */}
              <View className="mb-6">
                <Text className="text-sm font-medium text-zinc-400 mb-3">Sections</Text>
                <View className="flex-row justify-between">
                  {SECTIONS.map((section) => (
                    <TouchableOpacity
                      key={section}
                      onPress={() => toggleSelection(section)}
                      className="flex-row items-center space-x-2"
                    >
                      <View
                        className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                          selectedSection.includes(section) ? "bg-indigo-400 border-indigo-400" : "border-zinc-600"
                        }`}
                      >
                        {selectedSection.includes(section) && <View className="w-2 h-2 rounded-full bg-white" />}
                      </View>
                      <Text className={isDark ? "text-white" : "text-black"}>{section}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row justify-end space-x-3 mt-6">
              <TouchableOpacity onPress={discardClassModal} className="px-4 py-2 rounded-md bg-red-200">
                <Text className="text-sm font-semibold text-red-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={createClassRequest}
                disabled={creatingClass}
                className="px-4 py-2 rounded-md bg-emerald-400"
              >
                {creatingClass ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <Text className="text-sm font-semibold text-black">Add Class</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView className="flex-1 px-4">
        {/* Header Section */}
        <View className="mt-6 mb-6">
          <View className="flex-row justify-end mb-6">
            <PermitComponent module="CLASS" action="CREATE">
              <TouchableOpacity
                onPress={() => setIsOpen(true)}
                className={`flex-row items-center space-x-2 px-3 py-2 rounded-md ${
                  isDark ? "bg-zinc-800" : "bg-gray-100"
                }`}
              >
                <MaterialIcons name="add" size={20} color={isDark ? "#fff" : "#000"} />
                <Text className={isDark ? "text-white" : "text-black"}>Add Class</Text>
              </TouchableOpacity>
            </PermitComponent>
          </View>

          <View className="mb-4">
            <Text className={`text-2xl font-bold ${isDark ? "text-white" : "text-black"}`}>Class Management</Text>
            <Text className="text-zinc-500 mt-1">Manage Your School's classes.</Text>
          </View>

          {/* Filter and Export Buttons */}
          <View className="flex-row space-x-2">
            <TouchableOpacity
              className={`flex-row items-center space-x-2 px-3 py-2 rounded-md ${
                isDark ? "bg-zinc-800" : "bg-gray-100"
              }`}
            >
              <MaterialIcons name="filter-list" size={18} color={isDark ? "#fff" : "#000"} />
              <Text className={isDark ? "text-white" : "text-black"}>Filter By</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-row items-center space-x-2 px-3 py-2 rounded-md ${
                isDark ? "bg-zinc-800" : "bg-gray-100"
              }`}
            >
              <MaterialCommunityIcons name="note" size={18} color={isDark ? "#fff" : "#000"} />
              <Text className={isDark ? "text-white" : "text-black"}>Exports</Text>
              <MaterialIcons name="expand-more" size={16} color={isDark ? "#fff" : "#000"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Classes List */}
        <PermitComponent module="CLASS" action="VIEW">
          {loading ? (
            <View className="flex-1 justify-center items-center py-8">
              <ActivityIndicator size="large" color={isDark ? "#fff" : "#000"} />
            </View>
          ) : allClass.length > 0 ? (
            <FlatList
              data={allClass}
              renderItem={renderClassItem}
              keyExtractor={(item) => item.classCode}
              scrollEnabled={false}
              className={`rounded-lg border border-zinc-700/30 ${isDark ? "bg-zinc-800" : "bg-gray-50"}`}
            />
          ) : (
            <View className="py-8 items-center">
              <Text className="text-zinc-500">No classes found</Text>
            </View>
          )}
        </PermitComponent>
      </ScrollView>
    </View>
  )
}
