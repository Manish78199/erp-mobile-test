"use client"

import type React from "react"
import { useContext } from "react"
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView } from "react-native"
import { StudentAppDataContext } from "@/context/Student/context"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { useRouter } from "expo-router"

const ProfilePage: React.FC = () => {
  const { profile: myProfile } = useContext(StudentAppDataContext)!

  const InfoCard = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
    <View className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 flex-1 mx-1">
      <View className="flex-row items-center mb-2">
        <MaterialIcons name={icon} size={20} color="#3B82F6" style={{ marginRight: 8 }} />
        <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</Text>
      </View>
      <Text className="text-lg font-semibold text-gray-900">{value}</Text>
    </View>
  )

  const StatusBadge = () => (
    <View className="flex-row items-center bg-green-100 px-3 py-2 rounded-full">
      <MaterialIcons name="check-circle" size={16} color="#10B981" style={{ marginRight: 4 }} />
      <Text className="text-green-800 font-medium text-sm">Active Student</Text>
    </View>
  )

  const router=useRouter()
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 pt-8" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white px-4 py-4 shadow-sm border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={()=>router.push("/student")} className="p-2">
              <MaterialIcons name="arrow-back" size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-900">My Profile</Text>
            <View style={{ width: 24 }} />
          </View>
        </View>

        {/* Profile Card */}
        <View className="mx-4 mt-6 mb-8 bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Profile Image Section */}
          <View className="relative h-64">
            <Image
              source={{
                uri:
                  myProfile?.profileImage ||
                  "https://img.freepik.com/free-vector/young-man-with-glasses-avatar_1308-173760.jpg",
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
            {/* Gradient Overlay */}
            <View
              className="absolute inset-0"
              style={{
                backgroundColor: "rgba(0,0,0,0.4)",
              }}
            />

            {/* Profile Info Overlay */}
            <View className="absolute bottom-4 left-4 right-4">
              <Text className="text-white text-2xl font-bold mb-1">{myProfile?.full_name}</Text>
              <Text className="text-white/80 text-sm">Student ID: {myProfile?.admission_no}</Text>
            </View>
          </View>

          {/* Profile Details Section */}
          <View className="p-6">
            {/* First Row */}
            <View className="flex-row mb-4">
              <InfoCard label="Class" value={myProfile?.class_name || "N/A"} icon="school" />
              <InfoCard label="Age" value={`${myProfile?.age} years`} icon="cake" />
            </View>

            {/* Second Row */}
            <View className="flex-row mb-4">
              <InfoCard label="Session" value={myProfile?.session || "2024-2025"} icon="event" />
              <InfoCard label="Roll Number" value={myProfile?.roll_no || "N/A"} icon="format-list-numbered" />
            </View>

            {/* Third Row - Full Width */}
            <View className="mb-4">
              <View className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                <View className="flex-row items-center mb-2">
                  <MaterialIcons name="person" size={20} color="#3B82F6" style={{ marginRight: 8 }} />
                  <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide">Father's Name</Text>
                </View>
                <Text className="text-lg font-semibold text-gray-900">{myProfile?.father_name || "N/A"}</Text>
              </View>
            </View>

            {/* Status */}
            <View className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
              <View className="flex-row items-center mb-3">
                <MaterialIcons name="verified" size={20} color="#10B981" style={{ marginRight: 8 }} />
                <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</Text>
              </View>
              <StatusBadge />
            </View>
          </View>
        </View>

     
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProfilePage
