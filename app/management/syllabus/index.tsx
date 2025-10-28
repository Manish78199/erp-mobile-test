
import { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  FlatList,
  Alert,
  TextInput,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import DocumentPicker from "expo-document-picker"
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useClasses } from "@/hooks/management/classes"
import { getAllSylllabus, addSyllabus } from "@/service/management/syllabus"
import RNPickerSelect from "react-native-picker-select"
import { useColorScheme } from "nativewind"
import { Axios } from "axios"

export default function SyllabusScreen() {
  const insets = useSafeAreaInsets()
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === "dark"

  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [allSyllabus, setAllSyllabus] = useState([])
  const { classes } = useClasses()

  const [currentClass, setCurrentClass] = useState("")
  const [syllabusDescription, setSyllabusDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const getAllSyllabusRequest = async () => {
    try {
      const allsub = await getAllSylllabus()
      setAllSyllabus(allsub)
    } catch (error) {
      Alert.alert("Error", "Failed to fetch syllabuses")
    }
  }

  useEffect(() => {
    getAllSyllabusRequest()
  }, [])

  const addSyllabusRequest = async () => {
    if (!currentClass || !syllabusDescription || !file) {
      Alert.alert("Validation", "Please fill all required fields")
      return
    }

    setIsCreating(true)
    try {
      const response = await addSyllabus({
        description: syllabusDescription,
        class_id: currentClass,
        file,
      })
      Alert.alert("Success", response.data.message)
      getAllSyllabusRequest()
      setIsOpen(false)
      setSyllabusDescription("")
      setCurrentClass("")
      setFile(null)
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to add syllabus")
    } finally {
      setIsCreating(false)
    }
  }

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      })
      setFile(result[0])
    } catch (err) {
      Alert.alert("Error", "Failed to pick file")
    }
  }

  const renderSyllabusItem = ({ item }:{item:any}) => (
    <View className="flex-row items-center justify-between p-4 border-b border-gray-200 ">
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900 ">
          {item.class_name} ({item.class_code})
        </Text>
        <Text className="text-sm text-gray-600  mt-1">{item.description}</Text>
        <Text className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {item.file_name.slice(-15)} • {item.file_size} kb
        </Text>
      </View>
      <TouchableOpacity className="p-2">
        <MaterialIcons name="download" size={20} color={isDark ? "#fff" : "#000"} />
      </TouchableOpacity>
    </View>
  )

  return (
    <View className="flex-1 bg-white dark:bg-gray-900" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white  rounded-lg p-6 w-full max-w-sm">
            <Text className="text-lg font-semibold text-gray-900  mb-4">Add New Syllabus</Text>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700  mb-2">
                Class <Text className="text-red-500">*</Text>
              </Text>
              <RNPickerSelect
                onValueChange={(value) => setCurrentClass(value)}
                items={classes.map((item) => ({
                  label: `${item.name} (${item.classCode})`,
                  value: item._id,
                }))}
                placeholder={{ label: "-- Select Class --", value: null }}
                style={{
                  inputIOS: {
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderRadius: 6,
                    backgroundColor: isDark ? "#374151" : "#f3f4f6",
                    color: isDark ? "#fff" : "#000",
                    fontSize: 16,
                  },
                  inputAndroid: {
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderRadius: 6,
                    backgroundColor: isDark ? "#374151" : "#f3f4f6",
                    color: isDark ? "#fff" : "#000",
                    fontSize: 16,
                  },
                }}
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700  mb-2">Description</Text>
              <TextInput
                value={syllabusDescription}
                onChangeText={setSyllabusDescription}
                placeholder="Enter syllabus details"
                placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                multiline
                numberOfLines={4}
                className="border border-gray-300  rounded-lg p-3 bg-white  text-gray-900 "
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700  mb-2">Select Syllabus PDF</Text>
              <TouchableOpacity
                onPress={handleFileUpload}
                className="border-2 border-dashed border-gray-300  rounded-lg p-4 items-center"
              >
                <MaterialIcons name="cloud-upload" size={24} color={isDark ? "#9ca3af" : "#6b7280"} />
                <Text className="text-sm text-gray-600  mt-2">
                  {file ? file.name : "Tap to select PDF"}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-end gap-3">
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900"
              >
                <Text className="text-red-700 dark:text-red-200 font-semibold">Cancel</Text>
              </TouchableOpacity>

              {!isCreating ? (
                <TouchableOpacity
                  onPress={addSyllabusRequest}
                  className="px-4 py-2 rounded-lg bg-emerald-400 dark:bg-emerald-600"
                >
                  <Text className="text-gray-900  font-semibold">Add Syllabus</Text>
                </TouchableOpacity>
              ) : (
                <View className="px-4 py-2 justify-center">
                  <ActivityIndicator size="small" color={isDark ? "#fff" : "#000"} />
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView className="flex-1 px-4">
        <View className="mt-6 flex-row justify-end">
          <TouchableOpacity
            onPress={() => setIsOpen(true)}
            className="flex-row items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 "
          >
            <MaterialIcons name="add" size={20} color={isDark ? "#fff" : "#000"} />
            <Text className="text-gray-700  font-medium">Add Syllabus</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-6">
          <Text className="text-2xl font-bold text-gray-900 ">Class's Syllabus</Text>
          <Text className="text-gray-600  mt-1">Manage Class's Syllabus.</Text>
        </View>

        <View className="mt-6 flex-row gap-2">
          <TouchableOpacity className="flex-row items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 ">
            <MaterialIcons name="filter-list" size={18} color={isDark ? "#fff" : "#000"} />
            <Text className="text-gray-700  text-sm">Filter By</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 ">
            <MaterialCommunityIcons name="file-export" size={18} color={isDark ? "#fff" : "#000"} />
            <Text className="text-gray-700  text-sm">Exports</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900  mb-4">All Syllabus</Text>
          {allSyllabus.length > 0 ? (
            <FlatList
              data={allSyllabus}
              renderItem={renderSyllabusItem}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
              className="border border-gray-200  rounded-lg overflow-hidden"
            />
          ) : (
            <View className="items-center justify-center py-8">
              <MaterialIcons name="folder-open" size={48} color={isDark ? "#6b7280" : "#d1d5db"} />
              <Text className="text-gray-500  mt-2">No syllabuses found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
