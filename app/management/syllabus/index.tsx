"use client"

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
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import * as DocumentPicker from "expo-document-picker";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useClasses } from "@/hooks/management/classes"
import { getAllSylllabus, addSyllabus } from "@/service/management/syllabus"
import RNPickerSelect from "react-native-picker-select"
import { cn } from "@/utils/cn"
import { Typography } from "@/components/Typography"
import { useRouter } from "expo-router"
import { downloadAndOpenFile } from "@/utils/download";

export default function SyllabusScreen() {
  const insets = useSafeAreaInsets()

  const router = useRouter()
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
      Alert.alert("Validation", "Please fill all required fields");
      return;
    }

    setIsCreating(true);
    try {


      const response = await addSyllabus({
        class_id: currentClass,
        description: syllabusDescription,
        file: {
          uri: file.uri ,
          name: file.name,
          type: file.type,
        } as any
      });
      Alert.alert("Success",  "Syllabus added successfully");

      // Reset state
      getAllSyllabusRequest();
      setIsOpen(false);
      setSyllabusDescription("");
      setCurrentClass("");
      setFile(null);
    } catch (error: any) {
      console.log("Upload error:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to add syllabus");
    } finally {
      setIsCreating(false);
    }
  };


  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      console.log("Document Picker Result:", result);


      if (result.canceled) return;


      const pickedFile = result.assets ? result.assets[0] : result;

      setFile({
        uri: pickedFile.uri,
        name: pickedFile.name || "syllabus.pdf",
        type: pickedFile.mimeType || "application/pdf",
      } as any);
      console.log("Picked File:", pickedFile);
    } catch (err) {
      console.log("Document Picker Error:", err);
      Alert.alert("Error", "Failed to pick file");
    }
  };


  const renderSyllabusItem = ({ item }: { item: any }) => (
    <View className="flex-row bg-white items-center justify-between p-4 border-b border-border">
      <View className="flex-1">
        <Typography className="text-base font-semibold text-foreground">
          {item.class_name} ({item.class_code})
        </Typography>
        <Typography className="text-sm text-muted-foreground mt-1">{item.description}</Typography>
        <Typography className="text-xs text-muted-foreground mt-1">
          {item.file_name.slice(-15)} • {item.file_size} kb
        </Typography>
      </View>
      <TouchableOpacity className="p-2" onPress={()=>downloadAndOpenFile(item.file_name,`${item?.class_name}_${item?.class_code}`)}>
        <MaterialIcons name="download" size={20} color="currentColor" />
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView className="flex-1">
      <View className={cn("flex-1 bg-background")}>
        <View className="flex-row items-center p-4">
          <TouchableOpacity
            onPress={() => router.push("/management")}
            className="flex-row items-center bg-input border border-border rounded-lg px-3 py-2 mr-2"
          >
            <Typography className="text-primary font-semibold">← Back</Typography>
          </TouchableOpacity>

          <Typography className="text-lg font-bold text-foreground">Subjects</Typography>
        </View>
        <Modal visible={isOpen} transparent animationType="fade" className="" onRequestClose={() => {
          setIsOpen(false)
          setFile(null)
        }}>
          <View className="flex-1  bg-black/50 justify-center items-center p-4">
            <View className="bg-white rounded-lg p-6 w-full max-w-sm">
              <Typography className="text-lg font-semibold text-foreground mb-4">Add New Syllabus</Typography>

              <View className="mb-4">
                <Typography className="text-sm font-medium text-foreground mb-2">
                  Class <Typography className="text-destructive">*</Typography>
                </Typography>
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
                      borderColor: "#d1d5db",
                      backgroundColor: "#f9fafb",
                      color: "#000",
                      fontSize: 16,
                    },
                    inputAndroid: {
                      paddingVertical: 0,
                      paddingHorizontal: 10,
                      borderRadius: 6,
                      borderColor: "#d1d5db",
                      backgroundColor: "#f9fafb",
                      color: "#000",
                      fontSize: 16,
                    },
                  }}
                />
              </View>

              <View className="mb-4">
                <Typography className="text-sm font-medium text-foreground mb-2">Description</Typography>
                <TextInput
                  value={syllabusDescription}
                  onChangeText={setSyllabusDescription}
                  placeholder="Enter syllabus details"
                  placeholderTextColor="var(--color-muted-foreground)"
                  multiline
                  numberOfLines={4}
                  className="border border-border rounded-lg p-3 bg-card text-foreground"
                />
              </View>

              {!file && <View className="mb-6">
                <Typography className="text-sm font-medium text-foreground mb-2">Select Syllabus PDF</Typography>
                <TouchableOpacity
                  onPress={handleFileUpload}
                  className="border-2 border-dashed border-border rounded-lg p-4 items-center"
                >
                  <MaterialIcons name="cloud-upload" size={24} color="var(--color-muted-foreground)" />
                  <Typography className="text-sm text-muted-foreground mt-2">{file ? file.name : "Tap to select PDF"}</Typography>
                </TouchableOpacity>
              </View>
              }
              {
                file &&
                <View className="bg-white">
                  <Typography>
                    {file?.name}
                  </Typography>

                </View>
              }

              <View className="flex-row justify-end gap-3">
                <TouchableOpacity onPress={() => {
                  setIsOpen(false)
                  setFile(null)

                }} className="px-4 py-2 rounded-lg bg-destructive">
                  <Typography className="text-destructive-foreground font-semibold">Cancel</Typography>
                </TouchableOpacity>

                {!isCreating ? (
                  <TouchableOpacity onPress={addSyllabusRequest} className="px-4 py-2 rounded-lg bg-primary text-white">
                    <Typography className="text-white font-semibold">Add Syllabus</Typography>
                  </TouchableOpacity>
                ) : (
                  <View className="px-4 py-2 justify-center">
                    <ActivityIndicator size="small" color="var(--color-foreground)" />
                  </View>
                )}
              </View>
            </View>
          </View>
        </Modal>

        <ScrollView className="flex-1 px-4">
          <View className="mt-3 flex-row justify-between items-center">
            <View className="">
              <Typography className="text-2xl font-bold text-foreground">Class's Syllabus</Typography>
              <Typography className="text-muted-foreground mt-1">Manage Class's Syllabus.</Typography>
            </View>
            <TouchableOpacity
              onPress={() => setIsOpen(true)}
              className="flex-row bg-indigo-500 text-white items-center gap-2 px-3 py-2 rounded-lg bg-input"
            >
              <MaterialIcons name="add" size={20} color="white" />

            </TouchableOpacity>
          </View>



          <View className="mt-6 flex-row gap-2">
            <TouchableOpacity className="flex-row items-center gap-2 px-3 py-2 rounded-lg bg-gray-300">
              <MaterialIcons name="filter-list" size={18} color="currentColor" />
              <Typography className="text-foreground text-sm">Filter By</Typography>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center gap-2 px-3 py-2 rounded-lg bg-indigo-300">
              <MaterialCommunityIcons name="file-export" size={18} color="currentColor" />
              <Typography className="text-foreground text-sm">Exports</Typography>
            </TouchableOpacity>
          </View>

          <View className="mt-6 mb-6">
            <Typography className="text-lg font-semibold text-foreground mb-4">All Syllabus</Typography>
            {allSyllabus.length > 0 ? (
              <FlatList
                data={allSyllabus}
                renderItem={renderSyllabusItem}
                keyExtractor={(item) => item._id}
                scrollEnabled={false}
                className="border border-border rounded-lg overflow-hidden"
              />
            ) : (
              <View className="items-center justify-center py-8">
                <MaterialIcons name="folder-open" size={48} color="var(--color-muted-foreground)" />
                <Typography className="text-muted-foreground mt-2">No syllabuses found</Typography>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

