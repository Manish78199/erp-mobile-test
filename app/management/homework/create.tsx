
import { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  FlatList,
  Modal,
} from "react-native"
import { useFormik } from "formik"
import { useRouter } from "expo-router"
import RNPickerSelect from "react-native-picker-select"
import DateTimePicker from "@react-native-community/datetimepicker"
import * as ImagePicker from "expo-image-picker"
import { Calendar, Upload, X, BookOpen, Users, FileText, Paperclip } from "lucide-react-native"

import { getAllClass } from "@/service/management/class/classBasic"
import { getClassSubject } from "@/service/management/subject"
import { New_HomeWork } from "@/schema/homework"
import { createStudentHomework } from "@/service/management/studenthomework"
import { uploadImage } from "@/service/management/uploader"

const today = new Date()
today.setMinutes(today.getMinutes() - today.getTimezoneOffset())

export default function CreateHomework() {
  const router = useRouter()

  // State management
  const [allDataClass, setAllDataClass] = useState<any[]>([])
  const [allClass, setClass] = useState<Array<{ label: string; value: string }>>([])
  const [allSection, setSection] = useState<Array<{ label: string; value: string }>>([])
  const [allSubject, setAllSubject] = useState<Array<{ label: string; value: string }>>([])
  const [images, setImages] = useState<Array<any>>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchingClasses, setFetchingClasses] = useState(false)
  const [fetchingSubjects, setFetchingSubjects] = useState(false)
  const [showAssignedDatePicker, setShowAssignedDatePicker] = useState(false)
  const [showDueDatePicker, setShowDueDatePicker] = useState(false)

  // Get all classes
  const getAllClassRequest = async () => {
    setFetchingClasses(true)
    try {
      const allClass = await getAllClass()
      setAllDataClass(allClass)
      const filteredClass = allClass.map((item: any) => ({
        label: item.name,
        value: item._id,
      }))
      setClass(filteredClass)
      if (filteredClass.length) {
        setFieldValue("class_id", filteredClass[0].value)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch classes")
    } finally {
      setFetchingClasses(false)
    }
  }

  // Select sections based on class
  const selectSection = () => {
    if (allDataClass?.length && allDataClass[0]?.section) {
      const allclasssection = allDataClass[0].section.map((item: any) => ({
        label: item?.name,
        value: item?._id,
      }))
      setSection(allclasssection)
    }
    setFieldValue("section", "")
  }

  // Create homework request
  const createHomeWorkRequest = async (values: any) => {
    setLoading(true)
    try {
      const allImages = images.map((image) => image.path)
      values["attachments"] = allImages

      await createStudentHomework(values)
      Alert.alert("Success", "Homework assigned successfully.")
      router.push("/management/homework")
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.message || "Error in assigning homework.")
    } finally {
      setLoading(false)
    }
  }

  // Formik setup
  const { values, errors, handleChange, handleSubmit, setFieldValue, touched } = useFormik<{
    class_id: string
    section: string
    subject: string
    title: string
    description: string
    assigned_date: string
    due_date: string
  }>({
    initialValues: {
      class_id: "",
      section: "",
      subject: "",
      title: "",
      description: "",
      assigned_date: "",
      due_date: "",
    },
    validationSchema: New_HomeWork,
    onSubmit: createHomeWorkRequest,
  })

  // Get subjects when class changes
  useEffect(() => {
    if (values.class_id) {
      selectSection()
      const getAllSubjectRequest = async () => {
        setFetchingSubjects(true)
        try {
          const allsub = await getClassSubject(values.class_id)
          const filteredSubject = allsub.map((item: any) => ({
            label: `${item.name} (${item.code})`,
            value: item._id,
          }))
          setAllSubject(filteredSubject)
          setFieldValue("subject", "")
        } catch (error) {
          setAllSubject([])
        } finally {
          setFetchingSubjects(false)
        }
      }
      getAllSubjectRequest()
    }
  }, [values.class_id])

  // Initialize classes
  useEffect(() => {
    getAllClassRequest()
  }, [])

  // Handle file upload
  const uploadImageRequest = async (image: any) => {
    if (image.size / 1024 > 1024) {
      Alert.alert("Error", "Image size should be less than 1 MB")
      return
    }

    try {
      const fileUploadedData = await uploadImage(image)
      const fileData = fileUploadedData.data.data
      setImages((prev) => [...prev, fileData])
    } catch (error: any) {
      Alert.alert("Error", error.message)
    }
  }

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        setUploading(true)
        const asset = result.assets[0]
        const imageFile = {
          uri: asset.uri,
          name: asset.fileName || "image.jpg",
          type: asset.type || "image/jpeg",
          size: asset.fileSize || 0,
        }
        await uploadImageRequest(imageFile)
      }
    } catch (error: any) {
      Alert.alert("Error", error.message)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAssignedDateChange = (event: any, selectedDate?: Date) => {
    setShowAssignedDatePicker(false)
    if (selectedDate) {
      const isoString = selectedDate.toISOString().slice(0, 16)
      setFieldValue("assigned_date", isoString)
    }
  }

  const handleDueDateChange = (event: any, selectedDate?: Date) => {
    setShowDueDatePicker(false)
    if (selectedDate) {
      const isoString = selectedDate.toISOString().slice(0, 16)
      setFieldValue("due_date", isoString)
    }
  }

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Loading Overlay */}
      {loading && (
        <Modal transparent animationType="fade">
          <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="bg-card rounded-lg p-6 items-center gap-3">
              <ActivityIndicator size="large" color="#4f46e5" />
              <Text className="text-foreground text-sm">Creating homework...</Text>
            </View>
          </View>
        </Modal>
      )}

      <View className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground">Create Homework</Text>
          <Text className="text-muted-foreground mt-2">Create and assign homework to students.</Text>
        </View>

        {/* Card Container */}
        <View className="bg-card rounded-lg border border-border p-6 gap-6">
          {/* Card Header */}
          <View className="gap-2 border-b border-border pb-4">
            <View className="flex-row items-center gap-2">
              <BookOpen size={20} color="#4f46e5" />
              <Text className="text-lg font-semibold text-foreground">Homework Details</Text>
            </View>
            <Text className="text-muted-foreground text-sm">
              Fill in the homework information and assign it to students.
            </Text>
          </View>

          {/* Form Fields */}
          <View className="gap-6">
            {/* Class Selection */}
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <Users size={16} color="#666" />
                <Text className="text-foreground font-medium">
                  Class <Text className="text-red-500">*</Text>
                </Text>
              </View>
              <RNPickerSelect
                onValueChange={(value) => setFieldValue("class_id", value)}
                items={allClass}
                value={values.class_id}
                placeholder={{ label: fetchingClasses ? "Loading classes..." : "-- Select Class --", value: null }}
                disabled={fetchingClasses || loading}
                style={{
                  inputIOS: {
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 6,
                    color: "#000",
                    backgroundColor: "#fff",
                  },
                  inputAndroid: {
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 6,
                    color: "#000",
                    backgroundColor: "#fff",
                  },
                }}
              />
              {errors.class_id && touched.class_id && <Text className="text-red-600 text-sm">{errors.class_id}</Text>}
            </View>

            {/* Section Selection */}
            <View className="gap-2">
              <Text className="text-foreground font-medium">Section</Text>
              {!allSection?.length ? (
                <View className="p-3 border border-border rounded-md bg-card">
                  <Text className="text-muted-foreground">No sections available</Text>
                </View>
              ) : (
                <>
                  <RNPickerSelect
                    onValueChange={(value) => setFieldValue("section", value)}
                    items={allSection}
                    value={values.section}
                    placeholder={{ label: "-- Select Section --", value: null }}
                    disabled={loading}
                    style={{
                      inputIOS: {
                        paddingVertical: 12,
                        paddingHorizontal: 10,
                        borderWidth: 1,
                        borderColor: "#e5e7eb",
                        borderRadius: 6,
                        color: "#000",
                        backgroundColor: "#fff",
                      },
                      inputAndroid: {
                        paddingVertical: 12,
                        paddingHorizontal: 10,
                        borderWidth: 1,
                        borderColor: "#e5e7eb",
                        borderRadius: 6,
                        color: "#000",
                        backgroundColor: "#fff",
                      },
                    }}
                  />
                  {errors.section && touched.section && <Text className="text-red-600 text-sm">{errors.section}</Text>}
                </>
              )}
            </View>

            {/* Subject Selection */}
            <View className="gap-2">
              <Text className="text-foreground font-medium">
                Subject <Text className="text-red-500">*</Text>
              </Text>
              <RNPickerSelect
                onValueChange={(value) => setFieldValue("subject", value)}
                items={allSubject}
                value={values.subject}
                placeholder={{
                  label: fetchingSubjects ? "Loading subjects..." : "-- Select Subject --",
                  value: null,
                }}
                disabled={fetchingSubjects || loading}
                style={{
                  inputIOS: {
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 6,
                    color: "#000",
                    backgroundColor: "#fff",
                  },
                  inputAndroid: {
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 6,
                    color: "#000",
                    backgroundColor: "#fff",
                  },
                }}
              />
              {errors.subject && touched.subject && <Text className="text-red-600 text-sm">{errors.subject}</Text>}
            </View>

            {/* Title */}
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <FileText size={16} color="#666" />
                <Text className="text-foreground font-medium">
                  Title <Text className="text-red-500">*</Text>
                </Text>
              </View>
              <TextInput
                value={values.title}
                onChangeText={(text) => setFieldValue("title", text)}
                placeholder="Enter homework title"
                editable={!loading}
                className="px-3 py-3 border border-border rounded-md bg-card text-foreground"
                placeholderTextColor="#999"
              />
              {errors.title && touched.title && <Text className="text-red-600 text-sm">{errors.title}</Text>}
            </View>

            {/* Assigned Date */}
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <Calendar size={16} color="#666" />
                <Text className="text-foreground font-medium">
                  Assign Time <Text className="text-red-500">*</Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowAssignedDatePicker(true)}
                disabled={loading}
                className="px-3 py-3 border border-border rounded-md bg-card"
              >
                <Text className="text-foreground">{values.assigned_date || "Select assigned date"}</Text>
              </TouchableOpacity>
              {showAssignedDatePicker && (
                <DateTimePicker
                  value={values.assigned_date ? new Date(values.assigned_date) : new Date()}
                  mode="datetime"
                  display="spinner"
                  onChange={handleAssignedDateChange}
                  minimumDate={today}
                />
              )}
              {errors.assigned_date && touched.assigned_date && (
                <Text className="text-red-600 text-sm">{errors.assigned_date}</Text>
              )}
            </View>

            {/* Due Date */}
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <Calendar size={16} color="#666" />
                <Text className="text-foreground font-medium">
                  Due Time <Text className="text-red-500">*</Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowDueDatePicker(true)}
                disabled={loading}
                className="px-3 py-3 border border-border rounded-md bg-card"
              >
                <Text className="text-foreground">{values.due_date || "Select due date"}</Text>
              </TouchableOpacity>
              {showDueDatePicker && (
                <DateTimePicker
                  value={values.due_date ? new Date(values.due_date) : new Date()}
                  mode="datetime"
                  display="spinner"
                  onChange={handleDueDateChange}
                  minimumDate={today}
                />
              )}
              {errors.due_date && touched.due_date && <Text className="text-red-600 text-sm">{errors.due_date}</Text>}
            </View>

            {/* Description */}
            <View className="gap-2">
              <Text className="text-foreground font-medium">
                Description <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                value={values.description}
                onChangeText={(text) => setFieldValue("description", text)}
                placeholder="Enter homework description"
                editable={!loading}
                multiline
                numberOfLines={4}
                className="px-3 py-3 border border-border rounded-md bg-card text-foreground"
                placeholderTextColor="#999"
                textAlignVertical="top"
              />
              {errors.description && touched.description && (
                <Text className="text-red-600 text-sm">{errors.description}</Text>
              )}
            </View>

            {/* File Attachments */}
            <View className="gap-4">
              <View className="flex-row items-center gap-2">
                <Paperclip size={16} color="#666" />
                <Text className="text-foreground font-medium">Attached Files (Images)</Text>
              </View>

              <TouchableOpacity
                onPress={handleImagePicker}
                disabled={uploading || loading}
                className="flex-row items-center justify-center gap-2 px-4 py-3 border border-border rounded-md bg-card"
              >
                <Upload size={16} color="#666" />
                <Text className="text-foreground font-medium">{uploading ? "Uploading..." : "Select Images"}</Text>
              </TouchableOpacity>

              {/* Image Preview Grid */}
              {images.length > 0 && (
                <FlatList
                  data={images}
                  numColumns={3}
                  scrollEnabled={false}
                  columnWrapperStyle={{ gap: 12 }}
                  renderItem={({ item, index }) => (
                    <View className="flex-1 relative">
                      <Image source={{ uri: item.path }} className="w-full h-32 rounded-lg border border-border" />
                      <TouchableOpacity
                        onPress={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-black/60 rounded-full p-1"
                      >
                        <X size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  )}
                  keyExtractor={(_, index) => index.toString()}
                />
              )}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={() => handleSubmit()}
            disabled={loading || uploading}
            className="mt-6 px-8 py-3 bg-indigo-600 rounded-md flex-row items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <ActivityIndicator size="small" color="#fff" />
                <Text className="text-white font-semibold">Creating Homework...</Text>
              </>
            ) : (
              <Text className="text-white font-semibold">Create Homework</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
