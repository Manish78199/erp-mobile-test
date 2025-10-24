"use client"

import { useRouter } from "expo-router"
import type React from "react"
import { View, ScrollView, TouchableOpacity, Dimensions, RefreshControl } from "react-native"
import { useContext, useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import LogoutButton from "@/components/LogoutButton"
import { Typography } from "@/components/Typography"
import { StudentAppDataContext } from "@/context/Student/context"
import Premium3DIcon from "@/components/Premium3DIcon"
import { LinearGradient } from "expo-linear-gradient"

const { width, height } = Dimensions.get("window")

interface RecentModule {
  title: string
  icon: string
  colors: string[]
  screen: string
  lastUsed: number
}

interface ModuleSection {
  title: string
  modules: Array<{
    title: string
    icon: string
    colors: string[]
    screen: string
    description: string
  }>
}

const ManagementDashboard: React.FC = () => {
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)
  const [recentModules, setRecentModules] = useState<RecentModule[]>([])

  const { profile: Profile, refresh: refreshProfile } = useContext(StudentAppDataContext)

  const onRefresh = () => {
    setRefreshing(true)

  }

  const managementSections: ModuleSection[] = [
    {
      title: "Communication",
      modules: [
        {
          title: "Birthday",
          icon: "cake",
          colors: ["#ff6b6b", "#ee5a6f"],
          screen: "/management/communication/birthday",
          description: "Student birthdays",
        },
        {
          title: "Calendar",
          icon: "event",
          colors: ["#fdbb2d", "#22c1c3"],
          screen: "/management/communication/calendar",
          description: "Academic calendar",
        },
        {
          title: "Circulars",
          icon: "notifications",
          colors: ["#4facfe", "#00f2fe"],
          screen: "/management/notice",
          description: "School notices",
        },
        {
          title: "Image Gallery",
          icon: "photo-library",
          colors: ["#89f7fe", "#66a6ff"],
          screen: "/management/communication/gallery",
          description: "Event photos",
        },
        {
          title: "Mailbox",
          icon: "mail",
          colors: ["#fa709a", "#fee140"],
          screen: "/management/communication/mailbox",
          description: "Messages",
        },
        {
          title: "Quiz",
          icon: "quiz",
          colors: ["#a8edea", "#fed6e3"],
          screen: "/management/communication/quiz",
          description: "Create quizzes",
        },
        {
          title: "School News",
          icon: "newspaper",
          colors: ["#667eea", "#764ba2"],
          screen: "/management/communication/news",
          description: "News updates",
        },
        {
          title: "SMS History",
          icon: "sms",
          colors: ["#f093fb", "#f5576c"],
          screen: "/management/communication/sms",
          description: "SMS logs",
        },
      ],
    },
    {
      title: "My Workspace",
      modules: [
        {
          title: "Attendance",
          icon: "check-circle",
          colors: ["#ffecd2", "#fcb69f"],
          screen: "/management/workspace/attendance",
          description: "Subject-wise attendance",
        },
        {
          title: "Homework",
          icon: "assignment",
          colors: ["#f093fb", "#f5576c"],
          screen: "/management/workspace/homework",
          description: "Manage assignments",
        },
        {
          title: "Hostel Attendance",
          icon: "domain",
          colors: ["#a1c4fd", "#c2e9fb"],
          screen: "/management/workspace/hostel",
          description: "Hostel records",
        },
        {
          title: "Lesson Planning",
          icon: "book",
          colors: ["#d299c2", "#fef9d7"],
          screen: "/management/workspace/lesson",
          description: "Plan lessons",
        },
        {
          title: "Mark Entry",
          icon: "grade",
          colors: ["#11998e", "#38ef7d"],
          screen: "/management/workspace/marks",
          description: "Enter student marks",
        },
        {
          title: "My Attendance",
          icon: "event-available",
          colors: ["#ff9a9e", "#fecfef"],
          screen: "/management/workspace/my-attendance",
          description: "Staff attendance",
        },
        {
          title: "Remarks",
          icon: "comment",
          colors: ["#ffecd2", "#fcb69f"],
          screen: "/management/workspace/remarks",
          description: "Student remarks",
        },
        {
          title: "Service Requests",
          icon: "support-agent",
          colors: ["#4facfe", "#00f2fe"],
          screen: "/management/workspace/requests",
          description: "Complaints & grievances",
        },
        {
          title: "Syllabus",
          icon: "library-books",
          colors: ["#667eea", "#764ba2"],
          screen: "/management/workspace/syllabus",
          description: "Course curriculum",
        },
        {
          title: "Task Management",
          icon: "task-alt",
          colors: ["#fdbb2d", "#22c1c3"],
          screen: "/management/workspace/tasks",
          description: "Manage tasks",
        },
        {
          title: "Teacher Diary",
          icon: "diary",
          colors: ["#a8edea", "#fed6e3"],
          screen: "/management/workspace/diary",
          description: "Load management",
        },
      ],
    },
    {
      title: "Approvals & Alerts",
      modules: [
        {
          title: "Student Leave",
          icon: "assignment-late",
          colors: ["#fa709a", "#fee140"],
          screen: "/management/approvals/leave",
          description: "Approve leave requests",
        },
        {
          title: "Time Table",
          icon: "schedule",
          colors: ["#89f7fe", "#66a6ff"],
          screen: "/management/timetable",
          description: "Class schedules",
        },
      ],
    },
    {
      title: "Others",
      modules: [
        {
          title: "Downloads",
          icon: "download",
          colors: ["#11998e", "#38ef7d"],
          screen: "/management/others/downloads",
          description: "Download resources",
        },
        {
          title: "Library",
          icon: "local-library",
          colors: ["#667eea", "#764ba2"],
          screen: "/management/others/library",
          description: "Issued books",
        },
        {
          title: "Student Details",
          icon: "person",
          colors: ["#f093fb", "#f5576c"],
          screen: "/management/others/students",
          description: "Student information",
        },
        {
          title: "Student Location",
          icon: "location-on",
          colors: ["#ff9a9e", "#fecfef"],
          screen: "/management/others/location",
          description: "Track students",
        },
        {
          title: "Transport",
          icon: "directions-bus",
          colors: ["#ffecd2", "#fcb69f"],
          screen: "/management/others/transport",
          description: "Bus routes",
        },
      ],
    },
  ]

  const quickStats = [
    {
      title: "Total Students",
      value: "--",
      icon: "people",
      colors: ["#11998e", "#38ef7d"],
    },
    {
      title: "Pending Tasks",
      value: "0",
      icon: "task-alt",
      colors: ["#f093fb", "#f5576c"],
    },
    {
      title: "Approvals",
      value: "--",
      icon: "approval",
      colors: ["#a8edea", "#fed6e3"],
    },
    {
      title: "Messages",
      value: "0",
      icon: "mail",
      colors: ["#667eea", "#764ba2"],
    },
  ]

  // Load recent modules from AsyncStorage
  const loadRecentModules = async () => {
    try {
      const stored = await AsyncStorage.getItem("recentModulesManagement")
      if (stored) {
        const parsed = JSON.parse(stored)
        setRecentModules(parsed.slice(0, 4))
      }
    } catch (error) {
      console.error("Error loading recent modules:", error)
    }
  }

  // Save recent modules to AsyncStorage
  const saveRecentModules = async (modules: RecentModule[]) => {
    try {
      await AsyncStorage.setItem("recentModulesManagement", JSON.stringify(modules))
    } catch (error) {
      console.error("Error saving recent modules:", error)
    }
  }

  // Handle module press and update recent modules
  const handleModulePress = (module: any) => {
    const recentModule: RecentModule = {
      title: module.title,
      icon: module.icon,
      colors: module.colors,
      screen: module.screen,
      lastUsed: Date.now(),
    }

    const updatedRecent = [recentModule, ...recentModules.filter((item) => item.screen !== module.screen)].slice(0, 4)

    setRecentModules(updatedRecent)
    saveRecentModules(updatedRecent)

    router.push(module.screen as any)
  }

  const getGreeting = (): { period: "morning" | "afternoon" | "evening"; message: string } => {
    const hour = new Date().getHours()
    if (hour < 12) {
      return { period: "morning", message: "Good Morning" }
    } else if (hour < 17) {
      return { period: "afternoon", message: "Good Afternoon" }
    } else {
      return { period: "evening", message: "Good Evening" }
    }
  }

  useEffect(() => {
    loadRecentModules()
  }, [])

  return (
    <ScrollView
      className="flex-1 bg-[#F0F4F8]"
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header with Gradient */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingHorizontal: 20,
          paddingTop: 32,
          paddingBottom: 40,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}
      >
        <View className="flex flex-row items-center justify-between">
          <Typography className="font-extrabold text-white mb-2 text-center">
            {getGreeting().message} , {Profile?.full_name}
          </Typography>
          <LogoutButton />
        </View>
      </LinearGradient>

      {/* Quick Stats */}
      <View className="flex-row flex-wrap justify-between px-4 -mt-8 mb-6">
        {quickStats.map((stat, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white rounded-2xl px-2 py-4 items-center mb-3"
            style={{
              width: (width - 48) / 2,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Premium3DIcon name={stat.icon} size={40} colors={stat.colors} />
            <Typography className="text-2xl font-extrabold text-[#2C3E50] mt-3">{stat.value}</Typography>
            <Typography className="text-xs text-[#7F8C8D] mt-1">{stat.title}</Typography>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Module Uses Section */}
      {recentModules.length > 0 && (
        <View className="px-4 mb-6">
          <Typography className="text-[22px] font-bold text-[#2C3E50] mb-4">Recently Used</Typography>
          <View className="flex-row justify-between">
            {recentModules.map((module, index) => (
              <TouchableOpacity
                key={index}
                className="bg-white rounded-2xl p-3 items-center"
                style={{
                  width: (width - 80) / 4,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  elevation: 6,
                }}
                onPress={() => router.push(module.screen as any)}
              >
                <Premium3DIcon name={module.icon} size={32} colors={module.colors} />
                <Typography className="text-xs font-semibold text-[#2C3E50] text-center mt-2">
                  {module.title}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Module Sections */}
      {managementSections.map((section, sectionIndex) => (
        <View key={sectionIndex} className="px-4 mb-8">
          <Typography className="text-[22px] font-bold text-[#2C3E50] mb-4">{section.title}</Typography>
          <View className="flex-row flex-wrap justify-between">
            {section.modules.map((module, moduleIndex) => (
              <TouchableOpacity
                key={moduleIndex}
                className="bg-white rounded-[20px] p-4 items-center mb-4"
                style={{
                  width: (width - 64) / 3,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.1,
                  shadowRadius: 10,
                  elevation: 10,
                }}
                onPress={() => handleModulePress(module)}
              >
                <Premium3DIcon
                  name={module.icon}
                  size={48}
                  colors={module.colors}
                  containerStyle={{ marginBottom: 8 }}
                />
                <Typography className="text-xs font-bold text-[#2C3E50] text-center mb-1">{module.title}</Typography>
                <Typography className="text-xs text-[#7F8C8D] text-center">{module.description}</Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Bottom Padding */}
      <View className="h-8" />
    </ScrollView>
  )
}

export default ManagementDashboard
