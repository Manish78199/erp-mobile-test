
import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { useFormik } from "formik"
import RNPickerSelect from "react-native-picker-select"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { cn } from "@/utils/cn"
import { createEmployee } from "@/service/management/employee"

const initialValue = {
  name: "",
  email: "",
  phone: "",
  father_name: "",
  mother_name: "",
  date_of_birth: "",
  address: "",
  gender: "MALE",
  designation: "TEACHER",
  joining_date: "",
  marital_status: "OTHER",
  leaves: {
    mediacal_leaves: 0,
    casual_leaves: 0,
    maternity_leaves: 0,
    sick_leaves: 0,
  },
  bank_details: {
    account_type: "",
    account_no: "",
    bank_name: "",
    ifsc_code: "",
    branch_name: "",
  },
  userId: "",
  password: "",
  experience: [],
  education: [],
}

const designationOptions = [
  { label: "Teacher", value: "TEACHER" },
  { label: "Transport Staff", value: "TRANSPORT" },
  { label: "Other", value: "OTHER" },
]

export default function AddStaff() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const [creating, setCreating] = useState(false)
  const [activeSection, setActiveSection] = useState("personal")

  const addEmployeeRequest = (data: any) => {
    setCreating(true)
    createEmployee(data)
      .then((res) => {
        Alert.alert("Success", res.data.message || "Staff registration successful")
        router.push("/management/staff/index")
      })
      .catch((error) => {
        Alert.alert("Error", error.response?.data?.message || "Error in staff registration")
      })
      .finally(() => {
        setCreating(false)
      })
  }

  const { handleChange, handleSubmit, errors, values, setFieldValue, touched } = useFormik({
    initialValues: initialValue,
    onSubmit: addEmployeeRequest,
  })

  const addNewEducation = () => {
    const educationTemplate = {
      institution: "",
      roll_no: "",
      degree: "",
      institiion_address: "",
      start_date: "",
      end_date: "",
    }
    const previousEducation = [...values.education]
    previousEducation.push(educationTemplate)
    setFieldValue("education", previousEducation)
  }

  const addNewExperience = () => {
    const experienceTemplate = {
      organization: "",
      designation: "",
      address: "",
      start_date: "",
      end_date: "",
    }
    const previousExperience = [...values.experience]
    previousExperience.push(experienceTemplate)
    setFieldValue("experience", previousExperience)
  }

  const removeExperience = (ind: number) => {
    const filterExp = values.experience.filter((_: any, index: number) => index !== ind)
    setFieldValue("experience", filterExp)
  }

  const removeEducation = (ind: number) => {
    const filterEdu = values.education.filter((_: any, index: number) => index !== ind)
    setFieldValue("education", filterEdu)
  }

  const sections = [
    { id: "personal", label: "Personal", icon: "account" },
    { id: "education", label: "Education", icon: "school" },
    { id: "experience", label: "Experience", icon: "briefcase" },
    { id: "leaves", label: "Leaves", icon: "heart" },
    { id: "bank", label: "Bank", icon: "credit-card" },
    { id: "credentials", label: "Login", icon: "lock" },
  ]

  const InputField = ({ label, value, onChangeText, placeholder, error, required = false }: any) => (
    <View className="mb-4">
      <Text className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        editable={!creating}
        className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
      {error && <Text className="text-xs text-red-600 mt-1">{error}</Text>}
    </View>
  )

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-gray-900"
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-4 py-6 space-y-6">
        <View>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Add Staff Member</Text>
          <Text className="text-sm mt-1 text-gray-600 dark:text-gray-400">
            Register new staff with complete details
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="flex-row gap-2">
            {sections.map((section) => (
              <TouchableOpacity
                key={section.id}
                onPress={() => setActiveSection(section.id)}
                className={cn(
                  "flex-row items-center gap-2 px-4 py-2 rounded-lg border",
                  activeSection === section.id
                    ? "bg-emerald-600 dark:bg-emerald-600 border-emerald-600"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800",
                )}
              >
                <MaterialCommunityIcons
                  name={section.icon as any}
                  size={16}
                  color={activeSection === section.id ? "white" : "#6b7280"}
                />
                <Text
                  className={cn(
                    "text-sm font-medium",
                    activeSection === section.id ? "text-white" : "text-gray-700 dark:text-gray-300",
                  )}
                >
                  {section.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {activeSection === "personal" && (
          <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <InputField
              label="Full Name"
              value={values.name}
              onChangeText={handleChange("name")}
              placeholder="Enter full name"
              error={touched.name && errors.name}
              required
            />
            <InputField
              label="Father's Name"
              value={values.father_name}
              onChangeText={handleChange("father_name")}
              placeholder="Enter father's name"
              error={touched.father_name && errors.father_name}
              required
            />
            <InputField
              label="Mother's Name"
              value={values.mother_name}
              onChangeText={handleChange("mother_name")}
              placeholder="Enter mother's name"
            />
            <View className="mb-4">
              <Text className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Date of Birth *</Text>
              <TextInput
                value={values.date_of_birth}
                onChangeText={handleChange("date_of_birth")}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9ca3af"
                editable={!creating}
                className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </View>
            <View className="mb-4">
              <Text className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Gender *</Text>
              <RNPickerSelect
                items={[
                  { label: "Male", value: "MALE" },
                  { label: "Female", value: "FEMALE" },
                  { label: "Other", value: "OTHER" },
                ]}
                onValueChange={(value) => setFieldValue("gender", value)}
                value={values.gender}
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
            <View className="mb-4">
              <Text className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Designation *</Text>
              <RNPickerSelect
                items={designationOptions}
                onValueChange={(value) => setFieldValue("designation", value)}
                value={values.designation}
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
            <View className="mb-4">
              <Text className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Marital Status</Text>
              <RNPickerSelect
                items={[
                  { label: "Single", value: "SINGLE" },
                  { label: "Married", value: "MARRIED" },
                  { label: "Other", value: "OTHER" },
                ]}
                onValueChange={(value) => setFieldValue("marital_status", value)}
                value={values.marital_status}
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
            <InputField
              label="Mobile Number"
              value={values.phone}
              onChangeText={handleChange("phone")}
              placeholder="+91 9876543210"
              error={touched.phone && errors.phone}
              required
            />
            <InputField
              label="Email"
              value={values.email}
              onChangeText={handleChange("email")}
              placeholder="email@example.com"
              error={touched.email && errors.email}
              required
            />
            <InputField
              label="Joining Date"
              value={values.joining_date}
              onChangeText={handleChange("joining_date")}
              placeholder="YYYY-MM-DD"
              error={touched.joining_date && errors.joining_date}
              required
            />
            <InputField
              label="Address"
              value={values.address}
              onChangeText={handleChange("address")}
              placeholder="Enter complete address"
              error={touched.address && errors.address}
              required
            />
          </View>
        )}

        {activeSection === "education" && (
          <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">Education Details</Text>
              <TouchableOpacity onPress={addNewEducation} disabled={creating} className="bg-emerald-600 rounded-lg p-2">
                <MaterialCommunityIcons name="plus" size={18} color="white" />
              </TouchableOpacity>
            </View>
            {values.education.length === 0 ? (
              <Text className="text-center text-gray-600 dark:text-gray-400 py-8">No education records added</Text>
            ) : (
              values.education.map((edu: any, ind: number) => (
                <View key={ind} className="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <View className="flex-row items-center justify-between mb-3">
                    <Text className="font-medium text-gray-900 dark:text-white">Education {ind + 1}</Text>
                    <TouchableOpacity onPress={() => removeEducation(ind)} disabled={creating}>
                      <MaterialCommunityIcons name="trash-can" size={18} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                  <InputField
                    label="Degree"
                    value={edu.degree}
                    onChangeText={(text) => {
                      const newEdu = [...values.education]
                      newEdu[ind].degree = text
                      setFieldValue("education", newEdu)
                    }}
                    placeholder="M.Sc, B.Sc"
                    required
                  />
                  <InputField
                    label="Institution"
                    value={edu.institution}
                    onChangeText={(text) => {
                      const newEdu = [...values.education]
                      newEdu[ind].institution = text
                      setFieldValue("education", newEdu)
                    }}
                    placeholder="Institution name"
                  />
                  <InputField
                    label="Roll Number"
                    value={edu.roll_no}
                    onChangeText={(text) => {
                      const newEdu = [...values.education]
                      newEdu[ind].roll_no = text
                      setFieldValue("education", newEdu)
                    }}
                    placeholder="Roll number"
                  />
                  <InputField
                    label="Start Date"
                    value={edu.start_date}
                    onChangeText={(text) => {
                      const newEdu = [...values.education]
                      newEdu[ind].start_date = text
                      setFieldValue("education", newEdu)
                    }}
                    placeholder="YYYY-MM-DD"
                  />
                  <InputField
                    label="End Date"
                    value={edu.end_date}
                    onChangeText={(text) => {
                      const newEdu = [...values.education]
                      newEdu[ind].end_date = text
                      setFieldValue("education", newEdu)
                    }}
                    placeholder="YYYY-MM-DD"
                  />
                </View>
              ))
            )}
          </View>
        )}

        {activeSection === "experience" && (
          <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">Experience Details</Text>
              <TouchableOpacity
                onPress={addNewExperience}
                disabled={creating}
                className="bg-emerald-600 rounded-lg p-2"
              >
                <MaterialCommunityIcons name="plus" size={18} color="white" />
              </TouchableOpacity>
            </View>
            {values.experience.length === 0 ? (
              <Text className="text-center text-gray-600 dark:text-gray-400 py-8">No experience records added</Text>
            ) : (
              values.experience.map((exp: any, ind: number) => (
                <View key={ind} className="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <View className="flex-row items-center justify-between mb-3">
                    <Text className="font-medium text-gray-900 dark:text-white">Experience {ind + 1}</Text>
                    <TouchableOpacity onPress={() => removeExperience(ind)} disabled={creating}>
                      <MaterialCommunityIcons name="trash-can" size={18} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                  <InputField
                    label="Designation"
                    value={exp.designation}
                    onChangeText={(text) => {
                      const newExp = [...values.experience]
                      newExp[ind].designation = text
                      setFieldValue("experience", newExp)
                    }}
                    placeholder="Job title"
                    required
                  />
                  <InputField
                    label="Organization"
                    value={exp.organization}
                    onChangeText={(text) => {
                      const newExp = [...values.experience]
                      newExp[ind].organization = text
                      setFieldValue("experience", newExp)
                    }}
                    placeholder="Organization name"
                  />
                  <InputField
                    label="Start Date"
                    value={exp.start_date}
                    onChangeText={(text) => {
                      const newExp = [...values.experience]
                      newExp[ind].start_date = text
                      setFieldValue("experience", newExp)
                    }}
                    placeholder="YYYY-MM-DD"
                  />
                  <InputField
                    label="End Date"
                    value={exp.end_date}
                    onChangeText={(text) => {
                      const newExp = [...values.experience]
                      newExp[ind].end_date = text
                      setFieldValue("experience", newExp)
                    }}
                    placeholder="YYYY-MM-DD"
                  />
                  <InputField
                    label="Address"
                    value={exp.address}
                    onChangeText={(text) => {
                      const newExp = [...values.experience]
                      newExp[ind].address = text
                      setFieldValue("experience", newExp)
                    }}
                    placeholder="Organization address"
                  />
                </View>
              ))
            )}
          </View>
        )}

        {activeSection === "leaves" && (
          <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Leave Policy</Text>
            <InputField
              label="Medical Leaves"
              value={values.leaves.mediacal_leaves.toString()}
              onChangeText={(text) => setFieldValue("leaves.mediacal_leaves", Number.parseInt(text) || 0)}
              placeholder="12"
            />
            <InputField
              label="Casual Leaves"
              value={values.leaves.casual_leaves.toString()}
              onChangeText={(text) => setFieldValue("leaves.casual_leaves", Number.parseInt(text) || 0)}
              placeholder="12"
            />
            <InputField
              label="Maternity Leaves"
              value={values.leaves.maternity_leaves.toString()}
              onChangeText={(text) => setFieldValue("leaves.maternity_leaves", Number.parseInt(text) || 0)}
              placeholder="90"
            />
            <InputField
              label="Sick Leaves"
              value={values.leaves.sick_leaves.toString()}
              onChangeText={(text) => setFieldValue("leaves.sick_leaves", Number.parseInt(text) || 0)}
              placeholder="7"
            />
          </View>
        )}

        {activeSection === "bank" && (
          <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bank Details</Text>
            <InputField
              label="Account Type"
              value={values.bank_details.account_type}
              onChangeText={handleChange("bank_details.account_type")}
              placeholder="Savings"
              required
            />
            <InputField
              label="Account Number"
              value={values.bank_details.account_no}
              onChangeText={handleChange("bank_details.account_no")}
              placeholder="Account number"
            />
            <InputField
              label="Bank Name"
              value={values.bank_details.bank_name}
              onChangeText={handleChange("bank_details.bank_name")}
              placeholder="Bank name"
            />
            <InputField
              label="IFSC Code"
              value={values.bank_details.ifsc_code}
              onChangeText={handleChange("bank_details.ifsc_code")}
              placeholder="IFSC code"
            />
            <InputField
              label="Branch Name"
              value={values.bank_details.branch_name}
              onChangeText={handleChange("bank_details.branch_name")}
              placeholder="Branch name"
            />
          </View>
        )}

        {activeSection === "credentials" && (
          <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Login Credentials</Text>
            <InputField
              label="User ID"
              value={values.userId}
              onChangeText={handleChange("userId")}
              placeholder="User ID"
              required
            />
            <InputField
              label="Password"
              value={values.password}
              onChangeText={handleChange("password")}
              placeholder="Password"
              required
            />
          </View>
        )}

        <View className="flex-row gap-3 mb-4">
          <TouchableOpacity
            onPress={() => {
              const currentIndex = sections.findIndex((s) => s.id === activeSection)
              if (currentIndex > 0) {
                setActiveSection(sections[currentIndex - 1].id)
              }
            }}
            disabled={activeSection === "personal" || creating}
            className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600"
          >
            <Text className="text-center font-medium text-gray-700 dark:text-gray-300">Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              const currentIndex = sections.findIndex((s) => s.id === activeSection)
              if (currentIndex < sections.length - 1) {
                setActiveSection(sections[currentIndex + 1].id)
              }
            }}
            disabled={activeSection === "credentials" || creating}
            className="flex-1 p-3 rounded-lg bg-emerald-600 dark:bg-emerald-600"
          >
            <Text className="text-center font-medium text-white">Next</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => handleSubmit()}
          disabled={creating}
          className="p-3 rounded-lg bg-emerald-600 dark:bg-emerald-600 flex-row items-center justify-center"
        >
          {creating ? (
            <>
              <ActivityIndicator size="small" color="white" />
              <Text className="ml-2 text-white font-medium">Creating...</Text>
            </>
          ) : (
            <>
              <MaterialCommunityIcons name="check" size={18} color="white" />
              <Text className="ml-2 text-white font-medium">Create Staff Member</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
