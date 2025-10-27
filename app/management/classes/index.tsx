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
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons"
import { createClass, getAllClass } from "@/service/management/class/classBasic"
import { PermitComponent } from "@/components/management/Authorization/PermitComponent"
import { Typography } from "@/components/Typography"
import { Plus } from "lucide-react-native"
import { useRouter } from "expo-router"

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
      await createClass(data)
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
    <View className="flex-row items-center justify-between px-4 py-3 border-b border-border dark:border-zinc-800">
      <View className="flex-1">
        <Typography className="text-sm font-semibold text-textPrimary dark:text-foreground">{item.name}</Typography>
        <Typography className="text-xs text-textSecondary mt-1">{item.classCode}</Typography>
      </View>
      <View className="flex-row items-center space-x-4">
        <View className="items-center">
          <Typography className="text-xs text-textSecondary">Students</Typography>
          <Typography className="text-sm font-semibold text-textPrimary dark:text-foreground">
            {item.studentCount || 0}
          </Typography>
        </View>
        <View className="items-center">
          <Typography className="text-xs text-textSecondary">Subjects</Typography>
          <Typography className="text-sm font-semibold text-textPrimary dark:text-foreground">
            {item.subjectCount || 0}
          </Typography>
        </View>
        <TouchableOpacity className="p-2">
          <MaterialIcons name="more-vert" size={20} color="gray" />
        </TouchableOpacity>
      </View>
    </View>
  )
  const router = useRouter()

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-background dark:bg-[var(--background-color)]" style={{ paddingTop: insets.top }}>
        {/* Modal */}
        <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <View className="w-full max-w-sm rounded-xl p-6 bg-surface dark:bg-[var(--card-background-color)] border border-border dark:border-[var(--card-border-color)]">
              <Typography className="text-lg font-semibold text-textPrimary dark:text-foreground">Add New Class</Typography>

              <View className="border-t border-border dark:border-[var(--card-border-color)] mt-3 pt-4">
                {/* Class Name Input */}
                <View className="mb-4">
                  <Typography className="text-sm font-medium text-textSecondary mb-2">Class Name</Typography>
                  <TextInput
                    placeholder="Enter Class Name"
                    placeholderTextColor="#9ca3af"
                    value={className}
                    onChangeText={setClassName}
                    className="rounded-lg border border-border dark:border-[var(--card-border-color)] px-3 py-2 text-sm bg-surfaceVariant dark:bg-[var(--field-background-color)] text-textPrimary dark:text-foreground"
                  />
                </View>

                {/* Sections Selection */}
                {/* <View className="mb-6">
                <Typography className="text-sm font-medium text-textSecondary mb-3">Sections</Typography>
                <View className="flex-row justify-between">
                  {SECTIONS.map((section) => (
                    <TouchableOpacity
                      key={section}
                      onPress={() => toggleSelection(section)}
                      className="flex-row items-center space-x-2"
                    >
                      <View
                        className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                          selectedSection.includes(section)
                            ? "bg-primary border-primary"
                            : "border-border dark:border-zinc-600"
                        }`}
                      >
                        {selectedSection.includes(section) && <View className="w-2 h-2 rounded-full bg-white" />}
                      </View>
                      <Typography className="text-textPrimary dark:text-foreground">{section}</Typography>
                    </TouchableOpacity>
                  ))}
                </View>
              </View> */}
              </View>

              {/* Action Buttons */}
              <View className="flex-row justify-end space-x-3 mt-6">
                <TouchableOpacity onPress={discardClassModal} className="px-4 py-2 rounded-md bg-error/10">
                  <Typography className="text-sm font-semibold text-error">Cancel</Typography>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={createClassRequest}
                  disabled={creatingClass}
                  className="px-4 py-2 rounded-md bg-success"
                >
                  {creatingClass ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Typography className="text-sm font-semibold text-white">Add Class</Typography>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <View className="flex-row items-center p-4">
          <TouchableOpacity
            onPress={() => router.push("/management")}
            className="flex-row items-center bg-input border border-border rounded-lg px-3 py-2 mr-2"
          >
            <Typography className="text-primary font-semibold">← Back</Typography>
          </TouchableOpacity>

          <Typography className=" font-bold text-foreground">Classes</Typography>
        </View>
        {/* Body */}
        <ScrollView className="flex-1 px-4">

          <View className="mt-6 mb-6">
            {/* Add Button */}

            <View className=" flex-row item-center justify-between">
              <View>
                <Typography className="text-2xl font-bold text-textPrimary dark:text-foreground">Class Management</Typography>
                <Typography className="text-textSecondary mt-1">Manage Your School's classes.</Typography>
              </View>
              <PermitComponent module="CLASS" action="CREATE">
                <TouchableOpacity onPress={() => setIsOpen(true)} className="bg-primary text-white p-3 rounded-lg">

                  <Plus size={20} className="text-white" />
                </TouchableOpacity>
              </PermitComponent>
            </View>





            {/* Filter & Export Buttons */}
            <View className="flex-row space-x-2 mt-3">
              <TouchableOpacity className="flex-row items-center space-x-2 px-3 py-2 rounded-md bg-surfaceVariant dark:bg-[var(--hover-backgroud-color)]">
                <MaterialIcons name="filter-list" size={18} color="#6A5ACD" />
                <Typography className="text-textPrimary dark:text-foreground">Filter By</Typography>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center space-x-2 px-3 py-2 rounded-md bg-surfaceVariant dark:bg-[var(--hover-backgroud-color)]">
                <MaterialCommunityIcons name="note" size={18} color="#6A5ACD" />
                <Typography className="text-textPrimary dark:text-foreground">Exports</Typography>
                <MaterialIcons name="expand-more" size={16} color="#6A5ACD" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Class List */}
          <PermitComponent module="CLASS" action="VIEW">
            {loading ? (
              <View className="flex-1 justify-center items-center py-8">
                <ActivityIndicator size="large" color="#6A5ACD" />
              </View>
            ) : allClass.length > 0 ? (
              <FlatList
                data={allClass}
                renderItem={renderClassItem}
                keyExtractor={(item) => item.classCode}
                scrollEnabled={false}
                className="rounded-lg border border-border dark:border-[var(--card-border-color)] bg-surface dark:bg-[var(--card-background-color)]"
              />
            ) : (
              <View className="py-8 items-center">
                <Typography className="text-textSecondary">No classes found</Typography>
              </View>
            )}
          </PermitComponent>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
