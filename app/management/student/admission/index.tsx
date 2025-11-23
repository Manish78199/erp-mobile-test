

import { useContext, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  FlatList,
} from "react-native"
import { useFormik } from "formik"
import * as ImagePicker from "expo-image-picker"
import RNPickerSelect from "react-native-picker-select"
import DateTimePicker from "@react-native-community/datetimepicker"
import { MaterialIcons } from "@expo/vector-icons"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useClasses } from "@/hooks/management/classes"
import { getFeeStructureByClass } from "@/service/management/feeStructure"
import StudentRegistrationSchema from "@/schema/admission"
import { createAdmission } from "@/service/management/student"
import { Typography } from "@/components/Typography"
import { useRouter } from "expo-router"
import { AlertContext } from "@/context/Alert/context"








export default function StudentAdmissionScreen() {

  const [feeStructure, setFeeStructure] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeSection, setActiveSection] = useState("personal")
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [datePickerField, setDatePickerField] = useState("")
  const { classes } = useClasses()

  const {showAlert}=useContext(AlertContext)
  const router=useRouter()

  const { values, errors, handleChange, handleReset, handleSubmit, setFieldValue, touched, handleBlur } = useFormik({
    initialValues: {
      personal_details: {
        profileImage: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        date_of_birth: "",
        gender: "",
        blood_group: "",
        nationality: "",
        religion: "",
        category: "",
        aadhar_number: "",
      },
      contact_details: {
        phone_number: "",
        alternate_phone_number: "",
        email_address: "",
        country: "INDIA",
        state: "",
        city: "",
        address: "",
        permanent_address: "",
      },
      parent_guardian_details: {
        father_name: "",
        mother_name: "",
        guardian_name: "",
        father_occupation: "",
        mother_occupation: "",
        guardian_occupation: "",
        father_phone_number: "",
        mother_phone_number: "",
        guardian_phone_number: "",
      },
      education_qualifications: [] as any[],
      course_details: {
        student_class: "",
        class_language: "ENGLISH",
        stream: "",
        optional_subjects: "",
      },
      fee_details: {
        tuition_fee: 0,
        transport_fee: 0,
        lab_fee: 0,
        total_fee: 0,
        fee_paid: 0,
        remaining_fee: 0,
      },
      documents: {
        birth_certificate: null,
        address_proof: null,
        report_card: null,
        passport_photo: null,
        transfer_certificate: null,
      },
    },
    validationSchema: StudentRegistrationSchema,
    onSubmit: async (formValues) => {
      
      setIsSubmitting(true)
      try {
        await createAdmission(formValues)
        showAlert("SUCCESS","Admission completed")
        handleReset(formValues)
      } catch (error: any) {
        console.log(error,"error",error?.response?.data?.messag)
        showAlert("ERROR", error?.response?.data?.message || "Error in admission process.")
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  const fetchClassFeeStructure = async (class_id: string) => {
    if (class_id) {
      const feeStructure = await getFeeStructureByClass(class_id)
      setFeeStructure(feeStructure)
    }
  }

  const updateClassChoose = (class_id: string) => {
    setFieldValue("course_details.student_class", class_id)
    fetchClassFeeStructure(class_id)
  }

  const addEducationQualification = () => {
    const newQualification = {
      name: "",
      institute_name: "",
      institute_address: "",
      percentage: 0,
      year: "",
      obtain_marks: 0,
      max_marks: 0,
    }
    setFieldValue("education_qualifications", [...values.education_qualifications, newQualification])
  }

  const removeEducationQualification = (index: number) => {
    const updatedQualifications = values.education_qualifications.filter((_, i) => i !== index)
    setFieldValue("education_qualifications", updatedQualifications)
  }

  const pickImage = async (fieldPath: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setFieldValue(fieldPath, result.assets[0].uri)
    }
  }

  const handleDateChange = (event: any, selectedDate: any) => {
    setShowDatePicker(false)
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split("T")[0]
      setFieldValue(datePickerField, dateString)
    }
  }

  const sections = [
    { id: "personal", label: "Personal", icon: "person" },
    { id: "contact", label: "Contact", icon: "phone" },
    { id: "parent", label: "Parent", icon: "people" },
    { id: "education", label: "Education", icon: "school" },
    { id: "course", label: "Course", icon: "book" },
    { id: "fee", label: "Fee", icon: "attach-money" },
    { id: "documents", label: "Documents", icon: "description" },
  ]

  const bgColor = "bg-white"
  const textColor = "text-gray-900"
  const borderColor = "border-gray-200"
  const inputBg = "bg-gray-50"
  const labelColor = "text-gray-700"

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center p-4">
        <TouchableOpacity
          onPress={() => router.push("/management/student")}
          className="flex-row items-center bg-white border border-border rounded-lg px-3 py-2 mr-2"
        >
          <Typography className="text-primary font-semibold">← Back</Typography>
        </TouchableOpacity>
        <Typography className="text-xl font-bold text-foreground">Addmission</Typography>
      </View>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="mt-6 mb-6">
          <Text className={`text-2xl font-bold ${textColor}`}>Student Admission</Text>
          <Text className="text-gray-600 mt-1">Complete the admission process for new students</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
          contentContainerStyle={{ gap: 8 }}
        >
          {sections.map((section) => (
            <TouchableOpacity
              key={section.id}
              onPress={() => setActiveSection(section.id)}
              className={`px-4 py-2 rounded-lg flex-row items-center gap-2 ${activeSection === section.id ? "bg-emerald-600" : "bg-gray-300"
                }`}
            >
              <MaterialIcons
                name={section.icon as any}
                size={16}
                color={activeSection === section.id ? "white" : "#6b7280"}
              />
              <Text className={`text-xs font-medium ${activeSection === section.id ? "text-white" : "text-gray-600"}`}>
                {section.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>


        {activeSection === "personal" && (
          <View className={`mb-6 p-4 rounded-lg border ${borderColor} ${bgColor}`}>
            <Text className={`text-lg font-semibold mb-4 ${textColor}`}>Personal Details</Text>

            {/* Profile Image */}
            <TouchableOpacity
              onPress={() => pickImage("personal_details.profileImage")}
              className={`mb-4 p-4 border-2 border-dashed rounded-lg items-center ${borderColor}`}
            >
              {values.personal_details.profileImage ? (
                <Image source={{ uri: values.personal_details.profileImage }} className="w-24 h-32 rounded-lg" />
              ) : (
                <View className="items-center">
                  <MaterialIcons name="photo-camera" size={32} color="#6b7280" />
                  <Text className="text-xs mt-2 text-gray-600">Tap to upload photo</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* First Name */}
            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${labelColor}`}>
                First Name <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                placeholder="Enter first name"
                value={values.personal_details.first_name}
                onChangeText={(text) => setFieldValue("personal_details.first_name", text)}
                className={`px-4 py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                placeholderTextColor="#d1d5db"
              />
            </View>

            {/* Middle Name */}
            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${labelColor}`}>Middle Name</Text>
              <TextInput
                placeholder="Enter middle name"
                value={values.personal_details.middle_name}
                onChangeText={(text) => setFieldValue("personal_details.middle_name", text)}
                className={`px-4 py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                placeholderTextColor="#d1d5db"
              />
            </View>

            {/* Last Name */}
            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${labelColor}`}>Last Name</Text>
              <TextInput
                placeholder="Enter last name"
                value={values.personal_details.last_name}
                onChangeText={(text) => setFieldValue("personal_details.last_name", text)}
                className={`px-4 py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                placeholderTextColor="#d1d5db"
              />
            </View>

            {/* Date of Birth */}
            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${labelColor}`}>
                Date of Birth <Text className="text-red-500">*</Text>
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setDatePickerField("personal_details.date_of_birth")
                  setShowDatePicker(true)
                }}
                className={`px-4 py-3 rounded-lg border ${borderColor} ${inputBg}`}
              >
                <Text className={textColor}>{values.personal_details.date_of_birth || "Select date"}</Text>
              </TouchableOpacity>
              {showDatePicker && datePickerField === "personal_details.date_of_birth" && (
                <DateTimePicker
                  value={new Date(values.personal_details.date_of_birth || Date.now())}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </View>

            {/* Gender */}
            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${labelColor}`}>
                Gender <Text className="text-red-500">*</Text>
              </Text>
              <RNPickerSelect
                onValueChange={(value) => setFieldValue("personal_details.gender", value)}
                items={[
                  { label: "Male", value: "MALE" },
                  { label: "Female", value: "FEMALE" },
                  { label: "Other", value: "OTHER" },
                ]}
                value={values.personal_details.gender}
                placeholder={{ label: "Select Gender", value: "" }}
                style={{
                  inputIOS: {
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor: "#f3f4f6",
                    color: "#000",
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                  },
                  inputAndroid: {
                    paddingVertical: 0,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor: "#f3f4f6",
                    color: "#000",
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                  },
                }}
              />
            </View>

            {/* Blood Group */}
            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${labelColor}`}>Blood Group</Text>
              <RNPickerSelect
                onValueChange={(value) => setFieldValue("personal_details.blood_group", value)}
                items={[
                  { label: "A+", value: "A+" },
                  { label: "A-", value: "A-" },
                  { label: "B+", value: "B+" },
                  { label: "B-", value: "B-" },
                  { label: "AB+", value: "AB+" },
                  { label: "AB-", value: "AB-" },
                  { label: "O+", value: "O+" },
                  { label: "O-", value: "O-" },
                ]}
                value={values.personal_details.blood_group}
                placeholder={{ label: "Select Blood Group", value: "" }}
                style={{
                  inputIOS: {
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor: "#f3f4f6",
                    color: "#000",
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                  },
                  inputAndroid: {
                    paddingVertical: 0,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor: "#f3f4f6",
                    color: "#000",
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                  },
                }}
              />
            </View>

            {/* Nationality */}
            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${labelColor}`}>
                Nationality <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                placeholder="Enter nationality"
                value={values.personal_details.nationality}
                onChangeText={(text) => setFieldValue("personal_details.nationality", text)}
                className={`px-4 py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                placeholderTextColor="#d1d5db"
              />
            </View>

            {/* Religion */}
            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${labelColor}`}>Religion</Text>
              <RNPickerSelect
                onValueChange={(value) => setFieldValue("personal_details.religion", value)}
                items={[
                  { label: "Hinduism", value: "HINDUISM" },
                  { label: "Islam", value: "ISLAM" },
                  { label: "Christianity", value: "CHRISTIANITY" },
                  { label: "Sikhism", value: "SIKHISM" },
                  { label: "Buddhism", value: "BUDDHISM" },
                  { label: "Jainism", value: "JAINISM" },
                  { label: "Other", value: "OTHER" },
                ]}
                value={values.personal_details.religion}
                placeholder={{ label: "Select Religion", value: "" }}
                style={{
                  inputIOS: {
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor: "#f3f4f6",
                    color: "#000",
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                  },
                  inputAndroid: {
                    paddingVertical: 0,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor: "#f3f4f6",
                    color: "#000",
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                  },
                }}
              />
            </View>

            {/* Category */}
            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${labelColor}`}>Category</Text>
              <RNPickerSelect
                onValueChange={(value) => setFieldValue("personal_details.category", value)}
                items={[
                  { label: "General", value: "GENERAL" },
                  { label: "SC", value: "SC" },
                  { label: "ST", value: "ST" },
                  { label: "OBC", value: "OBC" },
                ]}
                value={values.personal_details.category}
                placeholder={{ label: "Select Category", value: "" }}
                style={{
                  inputIOS: {
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor: "#f3f4f6",
                    color: "#000",
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                  },
                  inputAndroid: {
                    paddingVertical: 0,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor: "#f3f4f6",
                    color: "#000",
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                  },
                }}
              />
            </View>

            {/* Aadhar Number */}
            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${labelColor}`}>Aadhar Number</Text>
              <TextInput
                placeholder="Enter Aadhar number"
                value={values.personal_details.aadhar_number}
                onChangeText={(text) => setFieldValue("personal_details.aadhar_number", text)}
                className={`px-4 py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                placeholderTextColor="#d1d5db"
              />
            </View>
          </View>
        )}

        {/* Contact Details Section */}
        {activeSection === "contact" && (
          <View className={`mb-6 p-4 rounded-lg border ${borderColor} ${bgColor}`}>
            <Text className={`text-lg font-semibold mb-4 ${textColor}`}>Contact Details</Text>

            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${labelColor}`}>
                Phone Number <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                placeholder="Enter phone number"
                value={values.contact_details.phone_number}
                onChangeText={(text) => setFieldValue("contact_details.phone_number", text)}
                keyboardType="phone-pad"
                className={`px-4 py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                placeholderTextColor="#d1d5db"
              />
            </View>

            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${labelColor}`}>Alternate Phone Number</Text>
              <TextInput
                placeholder="Enter alternate phone number"
                value={values.contact_details.alternate_phone_number}
                onChangeText={(text) => setFieldValue("contact_details.alternate_phone_number", text)}
                keyboardType="phone-pad"
                className={`px-4 py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                placeholderTextColor="#d1d5db"
              />
            </View>

            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${labelColor}`}>
                Email Address <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                placeholder="Enter email address"
                value={values.contact_details.email_address}
                onChangeText={(text) => setFieldValue("contact_details.email_address", text)}
                keyboardType="email-address"
                className={`px-4 py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                placeholderTextColor="#d1d5db"
              />
            </View>

            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${labelColor}`}>
                State <Text className="text-red-500">*</Text>
              </Text>
              <RNPickerSelect
                onValueChange={(value) => setFieldValue("contact_details.state", value)}
                items={[
                  { label: "Andhra Pradesh", value: "ANDHRA_PRADESH" },
                  { label: "Maharashtra", value: "MAHARASHTRA" },
                  { label: "Karnataka", value: "KARNATAKA" },
                  { label: "Tamil Nadu", value: "TAMIL_NADU" },
                  { label: "Delhi", value: "DELHI" },
                ]}
                value={values.contact_details.state}
                placeholder={{ label: "Select State", value: "" }}
                style={{
                  inputIOS: {
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor: "#f3f4f6",
                    color: "#000",
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                  },
                  inputAndroid: {
                    paddingVertical: 0,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor: "#f3f4f6",
                    color: "#000",
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                  },
                }}
              />
            </View>

            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${labelColor}`}>
                City <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                placeholder="Enter city"
                value={values.contact_details.city}
                onChangeText={(text) => setFieldValue("contact_details.city", text)}
                className={`px-4 py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                placeholderTextColor="#d1d5db"
              />
            </View>

            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${labelColor}`}>
                Current Address <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                placeholder="Enter current address"
                value={values.contact_details.address}
                onChangeText={(text) => setFieldValue("contact_details.address", text)}
                multiline
                numberOfLines={3}
                className={`px-4 py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                placeholderTextColor="#d1d5db"
              />
            </View>

            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${labelColor}`}>
                Permanent Address <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                placeholder="Enter permanent address"
                value={values.contact_details.permanent_address}
                onChangeText={(text) => setFieldValue("contact_details.permanent_address", text)}
                multiline
                numberOfLines={3}
                className={`px-4 py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                placeholderTextColor="#d1d5db"
              />
            </View>
          </View>
        )}

        {/* Parent/Guardian Details Section */}
        {activeSection === "parent" && (
          <View className={`mb-6 p-4 rounded-lg border ${borderColor} ${bgColor}`}>
            <Text className={`text-lg font-semibold mb-4 ${textColor}`}>Parent/Guardian Details</Text>

            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${labelColor}`}>
                Father's Name <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                placeholder="Enter father's name"
                value={values.parent_guardian_details.father_name}
                onChangeText={(text) => setFieldValue("parent_guardian_details.father_name", text)}
                className={`px-4 py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                placeholderTextColor="#d1d5db"
              />
            </View>

            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${labelColor}`}>Mother's Name</Text>
              <TextInput
                placeholder="Enter mother's name"
                value={values.parent_guardian_details.mother_name}
                onChangeText={(text) => setFieldValue("parent_guardian_details.mother_name", text)}
                className={`px-4 py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                placeholderTextColor="#d1d5db"
              />
            </View>

            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${labelColor}`}>Guardian's Name (if applicable)</Text>
              <TextInput
                placeholder="Enter guardian's name"
                value={values.parent_guardian_details.guardian_name}
                onChangeText={(text) => setFieldValue("parent_guardian_details.guardian_name", text)}
                className={`px-4 py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                placeholderTextColor="#d1d5db"
              />
            </View>

            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${labelColor}`}>Father's Occupation</Text>
              <TextInput
                placeholder="Enter father's occupation"
                value={values.parent_guardian_details.father_occupation}
                onChangeText={(text) => setFieldValue("parent_guardian_details.father_occupation", text)}
                className={`px-4 py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                placeholderTextColor="#d1d5db"
              />
            </View>

            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${labelColor}`}>Mother's Occupation</Text>
              <TextInput
                placeholder="Enter mother's occupation"
                value={values.parent_guardian_details.mother_occupation}
                onChangeText={(text) => setFieldValue("parent_guardian_details.mother_occupation", text)}
                className={`px-4 py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                placeholderTextColor="#d1d5db"
              />
            </View>

            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${labelColor}`}>
                Father's Phone Number <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                placeholder="Enter father's phone number"
                value={values.parent_guardian_details.father_phone_number}
                onChangeText={(text) => setFieldValue("parent_guardian_details.father_phone_number", text)}
                keyboardType="phone-pad"
                className={`px-4 py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                placeholderTextColor="#d1d5db"
              />
            </View>

            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${labelColor}`}>Mother's Phone Number</Text>
              <TextInput
                placeholder="Enter mother's phone number"
                value={values.parent_guardian_details.mother_phone_number}
                onChangeText={(text) => setFieldValue("parent_guardian_details.mother_phone_number", text)}
                keyboardType="phone-pad"
                className={`px-4 py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                placeholderTextColor="#d1d5db"
              />
            </View>
          </View>
        )}

        {/* Education Qualifications Section */}
        {activeSection === "education" && (
          <View className={`mb-6 p-4 rounded-lg border ${borderColor} ${bgColor}`}>
            <View className="flex-row justify-between items-center mb-4">
              <Text className={`text-lg font-semibold ${textColor}`}>Education Qualifications</Text>
              <TouchableOpacity
                onPress={addEducationQualification}
                className="bg-emerald-600 px-3 py-2 rounded-lg flex-row items-center gap-1"
              >
                <MaterialIcons name="add" size={16} color="white" />
                <Text className="text-white text-xs font-medium">Add</Text>
              </TouchableOpacity>
            </View>

            {values.education_qualifications.length === 0 ? (
              <View className="items-center py-8">
                <MaterialIcons name="school" size={32} color="#d1d5db" />
                <Text className="text-sm mt-2 text-gray-600">No qualifications added</Text>
              </View>
            ) : (
              <FlatList
                data={values.education_qualifications}
                keyExtractor={(_, index) => index.toString()}
                scrollEnabled={false}
                renderItem={({ item, index }) => (
                  <View className={`p-4 rounded-lg border mb-4 ${borderColor} ${inputBg}`}>
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className={`font-medium ${textColor}`}>Qualification {index + 1}</Text>
                      <TouchableOpacity onPress={() => removeEducationQualification(index)}>
                        <MaterialIcons name="delete" size={20} color="#ef4444" />
                      </TouchableOpacity>
                    </View>

                    <View className="mb-3">
                      <Text className="text-xs font-medium mb-1 text-gray-700">Class/Course Name</Text>
                      <TextInput
                        placeholder="e.g., Class 10, B.Tech"
                        value={item.name}
                        onChangeText={(text) => {
                          const updated = [...values.education_qualifications]
                          updated[index].name = text
                          setFieldValue("education_qualifications", updated)
                        }}
                        className={`px-3 py-2 rounded border text-xs ${borderColor} ${bgColor} ${textColor}`}
                        placeholderTextColor="#d1d5db"
                      />
                    </View>

                    <View className="mb-3">
                      <Text className="text-xs font-medium mb-1 text-gray-700">Institute Name</Text>
                      <TextInput
                        placeholder="Enter institute name"
                        value={item.institute_name}
                        onChangeText={(text) => {
                          const updated = [...values.education_qualifications]
                          updated[index].institute_name = text
                          setFieldValue("education_qualifications", updated)
                        }}
                        className={`px-3 py-2 rounded border text-xs ${borderColor} ${bgColor} ${textColor}`}
                        placeholderTextColor="#d1d5db"
                      />
                    </View>

                    <View className="mb-3">
                      <Text className="text-xs font-medium mb-1 text-gray-700">Percentage</Text>
                      <TextInput
                        placeholder="Enter percentage"
                        value={item.percentage?.toString()}
                        onChangeText={(text) => {
                          const updated = [...values.education_qualifications]
                          updated[index].percentage = Number.parseFloat(text) || 0
                          setFieldValue("education_qualifications", updated)
                        }}
                        keyboardType="decimal-pad"
                        className={`px-3 py-2 rounded border text-xs ${borderColor} ${bgColor} ${textColor}`}
                        placeholderTextColor="#d1d5db"
                      />
                    </View>

                    <View className="mb-3">
                      <Text className="text-xs font-medium mb-1 text-gray-700">Passing Year</Text>
                      <TextInput
                        placeholder="e.g., 2023"
                        value={item.year}
                        onChangeText={(text) => {
                          const updated = [...values.education_qualifications]
                          updated[index].year = text
                          setFieldValue("education_qualifications", updated)
                        }}
                        className={`px-3 py-2 rounded border text-xs ${borderColor} ${bgColor} ${textColor}`}
                        placeholderTextColor="#d1d5db"
                      />
                    </View>
                  </View>
                )}
              />
            )}
          </View>
        )}

        {/* Course Details Section */}
        {activeSection === "course" && (
          <View className={`mb-6 p-4 rounded-lg border ${borderColor} ${bgColor}`}>
            <Text className={`text-lg font-semibold mb-4 ${textColor}`}>Course Details</Text>

            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${labelColor}`}>
                Class <Text className="text-red-500">*</Text>
              </Text>
              <RNPickerSelect
                onValueChange={updateClassChoose}
                items={classes.map((c) => ({
                  label: `${c.name} (${c.classCode})`,
                  value: c._id,
                }))}
                value={values.course_details.student_class}
                placeholder={{ label: "Select Class", value: "" }}
                style={{
                  inputIOS: {
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor: "#f3f4f6",
                    color: "#000",
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                  },
                  inputAndroid: {
                    paddingVertical: 0,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor: "#f3f4f6",
                    color: "#000",
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                  },
                }}
              />
            </View>

            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${labelColor}`}>Class Language</Text>
              <RNPickerSelect
                onValueChange={(value) => setFieldValue("course_details.class_language", value)}
                items={[
                  { label: "English", value: "ENGLISH" },
                  { label: "Hindi", value: "HINDI" },
                  { label: "Regional Language", value: "REGIONAL_LANGUAGE" },
                ]}
                value={values.course_details.class_language}
                placeholder={{ label: "Select Language", value: "" }}
                style={{
                  inputIOS: {
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor: "#f3f4f6",
                    color: "#000",
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                  },
                  inputAndroid: {
                    paddingVertical: 0,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor: "#f3f4f6",
                    color: "#000",
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                  },
                }}
              />
            </View>

            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${labelColor}`}>Stream (for Class 11-12)</Text>
              <RNPickerSelect
                onValueChange={(value) => setFieldValue("course_details.stream", value)}
                items={[
                  { label: "N/A (Classes LKG to 10)", value: "NA" },
                  { label: "Science", value: "SCIENCE" },
                  { label: "Commerce", value: "COMMERCE" },
                  { label: "Arts", value: "ARTS" },
                ]}
                value={values.course_details.stream}
                placeholder={{ label: "Select Stream", value: "" }}
                style={{
                  inputIOS: {
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor: "#f3f4f6",
                    color: "#000",
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                  },
                  inputAndroid: {
                    paddingVertical: 0,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor: "#f3f4f6",
                    color: "#000",
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                  },
                }}
              />
            </View>

            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${labelColor}`}>Optional Subjects</Text>
              <TextInput
                placeholder="Enter optional subjects (comma separated)"
                value={values.course_details.optional_subjects}
                onChangeText={(text) => setFieldValue("course_details.optional_subjects", text)}
                multiline
                numberOfLines={2}
                className={`px-4 py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                placeholderTextColor="#d1d5db"
              />
            </View>
          </View>
        )}

        {/* Fee Details Section */}
        {activeSection === "fee" && (
          <View className={`mb-6 p-4 rounded-lg border ${borderColor} ${bgColor}`}>
            <Text className={`text-lg font-semibold mb-4 ${textColor}`}>Fee Details</Text>

            {values.course_details.student_class && feeStructure ? (
              <>
                {(feeStructure as any)?.components?.map((item: any, index: number) => (
                  <View key={index} className="mb-4 p-3 rounded-lg bg-gray-100">
                    <Text className="text-xs font-medium mb-1 text-gray-700">{item.head_name}</Text>
                    <Text className={`text-lg font-semibold ${textColor}`}>₹ {item.amount.toLocaleString()}</Text>
                  </View>
                ))}

                <View className="mb-4 p-3 rounded-lg bg-emerald-100">
                  <Text className="text-xs font-medium mb-1 text-emerald-700">Total Fee</Text>
                  <Text className="text-lg font-semibold text-emerald-900">
                    ₹ {(feeStructure as any)?.total_amount}
                  </Text>
                </View>

                <View className="mb-4">
                  <Text className={`text-sm font-medium mb-2 ${labelColor}`}>Fee Paid</Text>
                  <TextInput
                    placeholder="Enter amount paid"
                    value={values.fee_details.fee_paid?.toString()}
                    onChangeText={(text) => setFieldValue("fee_details.fee_paid", Number.parseFloat(text) || 0)}
                    keyboardType="decimal-pad"
                    className={`px-4 py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                    placeholderTextColor="#d1d5db"
                  />
                </View>

                <View className="p-3 rounded-lg bg-emerald-100">
                  <Text className="text-xs font-medium mb-1 text-emerald-700">Remaining Fee</Text>
                  <Text className="text-lg font-semibold text-emerald-900">
                    ₹ {((feeStructure as any)?.total_amount - values.fee_details.fee_paid).toLocaleString()}
                  </Text>
                </View>
              </>
            ) : (
              <View className="p-4 rounded-lg bg-amber-100">
                <Text className="text-sm text-amber-800">Please select a class to view the fee structure.</Text>
              </View>
            )}
          </View>
        )}

        {/* Documents Section */}
        {activeSection === "documents" && (
          <View className={`mb-6 p-4 rounded-lg border ${borderColor} ${bgColor}`}>
            <Text className={`text-lg font-semibold mb-4 ${textColor}`}>Documents</Text>

            {[
              { key: "birth_certificate", label: "Birth Certificate", required: true },
              { key: "address_proof", label: "Address Proof", required: true },
              { key: "report_card", label: "Previous Report Card", required: false },
              { key: "passport_photo", label: "Passport Size Photo", required: false },
              { key: "transfer_certificate", label: "Transfer Certificate", required: false },
            ].map((doc) => (
              <View key={doc.key} className="mb-4">
                <Text className={`text-sm font-medium mb-2 ${labelColor}`}>
                  {doc.label} {doc.required && <Text className="text-red-500">*</Text>}
                </Text>
                <TouchableOpacity
                  onPress={() => pickImage(`documents.${doc.key}`)}
                  className={`p-4 border-2 border-dashed rounded-lg items-center ${borderColor}`}
                >
                  {(values.documents as any)[doc.key] ? (
                    <Image source={{ uri: (values.documents as any)[doc.key] }} className="w-20 h-24 rounded-lg" />
                  ) : (
                    <View className="items-center">
                      <MaterialIcons name="cloud-upload" size={28} color="#6b7280" />
                      <Text className="text-xs mt-2 text-gray-600">Tap to upload</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View className="mt-6 mb-4 gap-3">
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => {
                const currentIndex = sections.findIndex((s) => s.id === activeSection)
                if (currentIndex > 0) {
                  setActiveSection(sections[currentIndex - 1].id)
                }
              }}
              disabled={activeSection === "personal"}
              className={`flex-1 px-4 py-3 rounded-lg border flex-row items-center justify-center gap-2 ${activeSection === "personal" ? "opacity-50" : ""
                } ${borderColor}`}
            >
              <MaterialIcons name="arrow-back" size={18} color="#6b7280" />
              <Text className="text-gray-600 font-medium">Previous</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                const currentIndex = sections.findIndex((s) => s.id === activeSection)
                if (currentIndex < sections.length - 1) {
                  setActiveSection(sections[currentIndex + 1].id)
                }
              }}
              disabled={activeSection === "documents"}
              className={`flex-1 px-4 py-3 rounded-lg bg-emerald-600 flex-row items-center justify-center gap-2 ${activeSection === "documents" ? "opacity-50" : ""
                }`}
            >
              <Text className="text-white font-medium">Next</Text>
              <MaterialIcons name="arrow-forward" size={18} color="white" />
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => handleReset(values)}
              className={`flex-1 px-4 py-3 rounded-lg border ${borderColor}`}
            >
              <Text className="text-gray-600 text-center font-medium">Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSubmit()}
              disabled={isSubmitting}
              className={`flex-1 px-4 py-3 rounded-lg bg-emerald-600 flex-row items-center justify-center gap-2 ${isSubmitting ? "opacity-50" : ""
                }`}
            >
              {isSubmitting ? (
                <>
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-medium">Submitting...</Text>
                </>
              ) : (
                <>
                  <MaterialIcons name="check" size={18} color="white" />
                  <Text className="text-white font-medium">Submit</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
