"use client"

import { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useFormik } from "formik"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { cn } from "@/utils/cn"
import { changeStaffPassword, getEmployeeDetails } from "@/service/management/employee"

export default function StaffView() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { staff_id } = useLocalSearchParams()

  const [activeSection, setActiveSection] = useState("personal")
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [staffData, setStaffData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        setLoading(true)
        const details = await getEmployeeDetails(staff_id as string)
        setStaffData(details)
      } catch (error) {
        Alert.alert("Error", "Failed to fetch staff details")
      } finally {
        setLoading(false)
      }
    }
    fetchStaffDetails()
  }, [staff_id])

  const update_staff_password = (data: any) => {
    if (data?.newPassword !== data?.confirmPassword) {
      Alert.alert("Error", "Passwords must match")
      return
    }

    setIsChangingPassword(true)
    const requestData = {
      password: data?.newPassword,
      employee_id: staff_id,
    }
    changeStaffPassword(requestData)
      .then(() => {
        Alert.alert("Success", "Password changed successfully")
        passwordFormik.resetForm()
      })
      .catch((error) => {
        Alert.alert("Error", error?.response?.data?.message || "Error changing password")
      })
      .finally(() => {
        setIsChangingPassword(false)
      })
  }

  const passwordFormik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: update_staff_password,
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusBadgeColor = (status: string) => {
    return status === "ACTIVE" ? "bg-emerald-100 dark:bg-emerald-900" : "bg-red-100 dark:bg-red-900"
  }

  const getStatusTextColor = (status: string) => {
    return status === "ACTIVE" ? "text-emerald-800 dark:text-emerald-200" : "text-red-800 dark:text-red-200"
  }

  const sections = [
    { id: "personal", label: "Personal", icon: "account" },
    { id: "education", label: "Education", icon: "school" },
    { id: "experience", label: "Experience", icon: "briefcase" },
    { id: "leaves", label: "Leaves", icon: "heart" },
    { id: "bank", label: "Bank", icon: "credit-card" },
    { id: "password", label: "Password", icon: "lock" },
  ]

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
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
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-900 ">Staff Details</Text>
            <Text className="text-sm mt-1 text-gray-600 ">View and manage staff information</Text>
          </View>
          <TouchableOpacity className="bg-emerald-600 rounded-lg p-3">
            <MaterialCommunityIcons name="pencil" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View className="rounded-lg p-4 border border-gray-200  bg-white ">
          <View className="flex-row items-start">
            <View className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 items-center justify-center">
              <Text className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                {staffData?.employee?.name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </Text>
            </View>
            <View className="ml-4 flex-1">
              <View className="flex-row items-center gap-2 mb-2">
                <Text className="text-lg font-semibold text-gray-900 ">{staffData?.employee?.name}</Text>
                <View className={cn("px-2 py-1 rounded", getStatusBadgeColor(staffData?.employee?.status))}>
                  <Text className={cn("text-xs font-medium", getStatusTextColor(staffData?.employee?.status))}>
                    {staffData?.employee?.status}
                  </Text>
                </View>
              </View>
              <View className="space-y-1">
                <Text className="text-xs text-gray-600 ">
                  ID: {staffData?.employee?.employee_code}
                </Text>
                <Text className="text-xs text-gray-600 ">{staffData?.employee?.designation}</Text>
                <Text className="text-xs text-gray-600 ">
                  Joined: {formatDate(staffData?.employee?.joining_date)}
                </Text>
              </View>
            </View>
          </View>
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
                    : "border-gray-200  bg-white ",
                )}
              >
                <MaterialCommunityIcons
                  name={section.icon}
                  size={16}
                  color={activeSection === section.id ? "white" : "#6b7280"}
                />
                <Text
                  className={cn(
                    "text-sm font-medium",
                    activeSection === section.id ? "text-white" : "text-gray-700 ",
                  )}
                >
                  {section.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {activeSection === "personal" && (
          <View className="rounded-lg p-4 border border-gray-200  bg-white  space-y-4">
            <Text className="text-lg font-semibold text-gray-900 ">Personal Details</Text>
            <View className="space-y-3">
              <View>
                <Text className="text-xs font-medium text-gray-600  mb-1">Full Name</Text>
                <Text className="text-sm text-gray-900 ">{staffData?.employee?.name}</Text>
              </View>
              <View>
                <Text className="text-xs font-medium text-gray-600  mb-1">Father's Name</Text>
                <Text className="text-sm text-gray-900 ">{staffData?.employee?.father_name}</Text>
              </View>
              <View>
                <Text className="text-xs font-medium text-gray-600  mb-1">Mother's Name</Text>
                <Text className="text-sm text-gray-900 ">{staffData?.employee?.mother_name}</Text>
              </View>
              <View>
                <Text className="text-xs font-medium text-gray-600  mb-1">Date of Birth</Text>
                <Text className="text-sm text-gray-900 ">
                  {formatDate(staffData?.employee?.date_of_birth)}
                </Text>
              </View>
              <View>
                <Text className="text-xs font-medium text-gray-600  mb-1">Gender</Text>
                <Text className="text-sm text-gray-900 ">{staffData?.employee?.gender}</Text>
              </View>
              <View>
                <Text className="text-xs font-medium text-gray-600  mb-1">Marital Status</Text>
                <Text className="text-sm text-gray-900 ">{staffData?.employee?.marital_status}</Text>
              </View>
              <View>
                <Text className="text-xs font-medium text-gray-600  mb-1">Mobile Number</Text>
                <Text className="text-sm text-gray-900 ">{staffData?.employee?.phone}</Text>
              </View>
              <View>
                <Text className="text-xs font-medium text-gray-600  mb-1">Email</Text>
                <Text className="text-sm text-gray-900 ">{staffData?.employee?.email}</Text>
              </View>
              <View>
                <Text className="text-xs font-medium text-gray-600  mb-1">Address</Text>
                <Text className="text-sm text-gray-900 ">{staffData?.employee?.address}</Text>
              </View>
            </View>
          </View>
        )}

        {activeSection === "education" && (
          <View className="space-y-4">
            {staffData?.education?.map((edu: any, index: number) => (
              <View
                key={index}
                className="rounded-lg p-4 border border-gray-200  bg-white "
              >
                <Text className="font-semibold text-gray-900  mb-3">Education {index + 1}</Text>
                <View className="space-y-2">
                  <View>
                    <Text className="text-xs font-medium text-gray-600 ">Degree</Text>
                    <Text className="text-sm text-gray-900 ">{edu.degree}</Text>
                  </View>
                  <View>
                    <Text className="text-xs font-medium text-gray-600 ">Institution</Text>
                    <Text className="text-sm text-gray-900 ">{edu.institution}</Text>
                  </View>
                  <View>
                    <Text className="text-xs font-medium text-gray-600 ">Roll Number</Text>
                    <Text className="text-sm text-gray-900 ">{edu.roll_no || "N/A"}</Text>
                  </View>
                  <View>
                    <Text className="text-xs font-medium text-gray-600 ">Duration</Text>
                    <Text className="text-sm text-gray-900 ">
                      {formatDate(edu.start_date)} - {edu.end_date ? formatDate(edu.end_date) : "Present"}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeSection === "experience" && (
          <View className="space-y-4">
            {staffData?.experience?.map((exp: any, index: number) => (
              <View
                key={index}
                className="rounded-lg p-4 border border-gray-200  bg-white "
              >
                <Text className="font-semibold text-gray-900  mb-3">Experience {index + 1}</Text>
                <View className="space-y-2">
                  <View>
                    <Text className="text-xs font-medium text-gray-600 ">Designation</Text>
                    <Text className="text-sm text-gray-900 ">{exp.designation}</Text>
                  </View>
                  <View>
                    <Text className="text-xs font-medium text-gray-600 ">Organization</Text>
                    <Text className="text-sm text-gray-900 ">{exp.organization}</Text>
                  </View>
                  <View>
                    <Text className="text-xs font-medium text-gray-600 ">Duration</Text>
                    <Text className="text-sm text-gray-900 ">
                      {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : "Present"}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeSection === "leaves" && (
          <View className="rounded-lg p-4 border border-gray-200  bg-white  space-y-4">
            <Text className="text-lg font-semibold text-gray-900 ">Leave Policy</Text>
            <View className="space-y-3">
              <View className="flex-row justify-between items-center p-3 rounded-lg bg-gray-50 ">
                <Text className="text-sm text-gray-600 ">Medical Leaves</Text>
                <Text className="font-semibold text-gray-900 ">
                  {staffData?.leave?.mediacal_leaves || 0}
                </Text>
              </View>
              <View className="flex-row justify-between items-center p-3 rounded-lg bg-gray-50 ">
                <Text className="text-sm text-gray-600 ">Casual Leaves</Text>
                <Text className="font-semibold text-gray-900 ">
                  {staffData?.leave?.casual_leaves || 0}
                </Text>
              </View>
              <View className="flex-row justify-between items-center p-3 rounded-lg bg-gray-50 ">
                <Text className="text-sm text-gray-600 ">Maternity Leaves</Text>
                <Text className="font-semibold text-gray-900 ">
                  {staffData?.leave?.maternity_leaves || 0}
                </Text>
              </View>
              <View className="flex-row justify-between items-center p-3 rounded-lg bg-gray-50 ">
                <Text className="text-sm text-gray-600 ">Sick Leaves</Text>
                <Text className="font-semibold text-gray-900 ">
                  {staffData?.leave?.sick_leaves || 0}
                </Text>
              </View>
            </View>
          </View>
        )}

        {activeSection === "bank" && (
          <View className="rounded-lg p-4 border border-gray-200  bg-white  space-y-4">
            <Text className="text-lg font-semibold text-gray-900 ">Bank Details</Text>
            <View className="space-y-3">
              <View>
                <Text className="text-xs font-medium text-gray-600  mb-1">Account Type</Text>
                <Text className="text-sm text-gray-900 ">{staffData?.bank?.account_type || "N/A"}</Text>
              </View>
              <View>
                <Text className="text-xs font-medium text-gray-600  mb-1">Account Number</Text>
                <Text className="text-sm text-gray-900  font-mono">
                  ****{staffData?.bank?.account_no?.slice(-4)}
                </Text>
              </View>
              <View>
                <Text className="text-xs font-medium text-gray-600  mb-1">Bank Name</Text>
                <Text className="text-sm text-gray-900 ">{staffData?.bank?.bank_name || "N/A"}</Text>
              </View>
              <View>
                <Text className="text-xs font-medium text-gray-600  mb-1">IFSC Code</Text>
                <Text className="text-sm text-gray-900  font-mono">
                  {staffData?.bank?.ifsc_code || "N/A"}
                </Text>
              </View>
              <View>
                <Text className="text-xs font-medium text-gray-600  mb-1">Branch Name</Text>
                <Text className="text-sm text-gray-900 ">{staffData?.bank?.branch_name || "N/A"}</Text>
              </View>
            </View>
          </View>
        )}

        {activeSection === "password" && (
          <View className="rounded-lg p-4 border border-gray-200  bg-white  space-y-4">
            <Text className="text-lg font-semibold text-gray-900 ">Change Password</Text>

            <View>
              <Text className="text-xs font-medium text-gray-600  mb-2">User ID</Text>
              <View className="p-3 rounded-lg bg-gray-50 ">
                <Text className="text-sm text-gray-900 ">{staffData?.employee?.userId || "*****"}</Text>
              </View>
            </View>

            <View>
              <Text className="text-xs font-medium text-gray-600  mb-2">New Password</Text>
              <View className="flex-row items-center border border-gray-300  rounded-lg px-3">
                <TextInput
                  secureTextEntry={!showNewPassword}
                  placeholder="Enter new password"
                  placeholderTextColor="#9ca3af"
                  value={passwordFormik.values.newPassword}
                  onChangeText={passwordFormik.handleChange("newPassword")}
                  className="flex-1 py-3 text-sm text-gray-900 "
                  editable={!isChangingPassword}
                />
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                  <MaterialCommunityIcons name={showNewPassword ? "eye-off" : "eye"} size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text className="text-xs font-medium text-gray-600  mb-2">Confirm Password</Text>
              <View className="flex-row items-center border border-gray-300  rounded-lg px-3">
                <TextInput
                  secureTextEntry={!showConfirmPassword}
                  placeholder="Confirm new password"
                  placeholderTextColor="#9ca3af"
                  value={passwordFormik.values.confirmPassword}
                  onChangeText={passwordFormik.handleChange("confirmPassword")}
                  className="flex-1 py-3 text-sm text-gray-900 "
                  editable={!isChangingPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <MaterialCommunityIcons name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => passwordFormik.handleSubmit()}
              disabled={isChangingPassword}
              className="bg-emerald-600 dark:bg-emerald-600 rounded-lg p-3 flex-row items-center justify-center"
            >
              {isChangingPassword ? (
                <>
                  <ActivityIndicator size="small" color="white" />
                  <Text className="ml-2 text-white font-medium">Updating...</Text>
                </>
              ) : (
                <>
                  <MaterialCommunityIcons name="check" size={18} color="white" />
                  <Text className="ml-2 text-white font-medium">Update Password</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  )
}
