import { useRouter } from "expo-router"
import React, { useContext, useEffect, useState } from "react"
import {
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import LogoutButton from "@/components/LogoutButton"
import { Typography } from "@/components/Typography"
import { StudentAppDataContext } from "@/context/Student/context"
import Premium3DIcon from "@/components/Premium3DIcon"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

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
  const { profile: Profile } = useContext(StudentAppDataContext)

  const onRefresh = () => setRefreshing(true)

  /** 🧠 Map of icon names to proper library */
  const renderIcon = (name: string, size: number, color: string) => {
    // MaterialCommunityIcons list
    const materialCommunity = ["clipboard", "bus", "library"]
    const ionicons = [
      "calendar",
      "chatbubble-ellipses",
      "book-outline",
      "document-text",
      "trophy",
      "time",
      "megaphone",
      "people",
      "mail",
      "bookmarks",
      "document-text-outline",
      "document-text",
      "library",
      "checkmark-done",
      "reader",
      "list"
      // "stats-chart"
    ]
    const material = ["school", "layers", "checkmark-done", "account-balance","history","grade","task","description"]

    if (materialCommunity.includes(name))
      return <MaterialCommunityIcons name={name as any} size={size} color={color} />
    if (ionicons.includes(name))
      return <Ionicons name={name as any} size={size} color={color} />
    if (material.includes(name))
      return <MaterialIcons name={name as any} size={size} color={color} />

    // fallback
    return <Ionicons name="alert-circle-outline" size={size} color={color} />
  }

  /** ===== Sections ===== */
  const managementSections: ModuleSection[] = [
    {
      title: "Communication",
      modules: [
        {
          title: "Circulars",
          icon: "megaphone",
          colors: ["#4facfe", "#00f2fe"],
          screen: "/management/notice",
          description: "School announcements",
        },
        {
          title: "Calendar",
          icon: "calendar",
          colors: ["#fa709a", "#fee140"],
          screen: "/management/calendar",
          description: "Academic Calendar",
        },
        // {
        //   title: "SMS History",
        //   icon: "chatbubble-ellipses",
        //   colors: ["#f093fb", "#f5576c"],
        //   screen: "/management/communication/sms",
        //   description: "SMS logs",
        // },
      ],
    },
    {
      title: "My Workspace",
      modules: [
        {
          title: "Attendance",
          icon: "calendar",
          colors: ["#34d399", "#10b981"],
          screen: "/management/student/attendance",
          description: "Class-wise attendance",
        },
        {
          title: "Homework",
          icon: "task",
          colors: ["#f97316", "#fb923c"],
          screen: "/management/homework",
          description: "Manage assignments",
        },
        {
          title: "Mark Entry",
          icon: "clipboard",
          colors: ["#22c55e", "#16a34a"],
          screen: "/management/exam",
          description: "Enter marks & results",
        },
        {
          title: "Syllabus",
          icon: "description",
          colors: ["#6366f1", "#818cf8"],
          screen: "/management/syllabus",
          description: "Course curriculum",
        },
      ],
    },
    {
      title: "Management & Setup",
      modules: [
        {
          title: "Classes",
          icon: "school",
          colors: ["#60a5fa", "#3b82f6"],
          screen: "/management/classes",
          description: "Class list & setup",
        },
        {
          title: "Sections",
          icon: "layers",
          colors: ["#f87171", "#ef4444"],
          screen: "/management/section",
          description: "Manage sections",
        },
        {
          title: "Subjects",
          icon: "reader",
          colors: ["#a78bfa", "#8b5cf6"],
          screen: "/management/subject",
          description: "Subjects setup",
        },
        {
          title: "Exam",
          icon: "trophy",
          colors: ["#facc15", "#eab308"],
          screen: "/management/exam",
          description: "Exam management",
        },
        {
          title: "Result",
          icon: "grade",
          colors: ["#10b981", "#059669"],
          screen: "/management/result",
          description: "View student results",
        },
      ],
    },
    {
      title: "Library & Transport",
      modules: [
        {
          title: "Library",
          icon: "library",
          colors: ["#FF8B5D", "#FF5A37"],
          screen: "/management/library",
          description: "Library management",
        },
        {
          title: "Transport",
          icon: "bus",
          colors: ["#f43f5e", "#e11d48"],
          screen: "/management/transport",
          description: "Bus routes & vehicle info",
        },
      ],
    },
        {
      title: "Fee Management",
      modules: [
        {
          title: "Deposit",
          icon: "account-balance",
          colors:["#00C9A7", "#008F7A"],
          screen: "/management/fee/deposit",
          description: "Student Fee",
        },
         {
          title: "Fee History",
          icon: "history",
          colors: ["#FACC15", "#FB923C"],
          screen: "/management/fee/history",
          description: " Fee history",
        },
         {
          title: "Fee",
          icon: "list",
          colors: ["#6366f1", "#4338ca"],
          screen: "/management/fee/structure",
          description: "Fee Structure",
        },
        
       
      ],
    },
    {
      title: "Others",
      modules: [
        {
          title: "Student Details",
          icon: "people",
          colors: ["#06b6d4", "#0891b2"],
          screen: "/management/student",
          description: "Student information",
        },
        {
          title: "Time Table",
          icon: "time",
          colors: ["#f59e0b", "#d97706"],
          screen: "/management/timetable",
          description: "Class schedules",
        },
      ],
    },
  ]

  const quickStats = [
    { title: "Total Students", value: "--", icon: "people", colors: ["#22c55e", "#16a34a"] },
    { title: "Pending Tasks", value: "0", icon: "clipboard", colors: ["#f97316", "#fb923c"] },
    { title: "Approvals", value: "--", icon: "checkmark-done", colors: ["#3b82f6", "#2563eb"] },
    { title: "Messages", value: "0", icon: "mail", colors: ["#a855f7", "#7e22ce"] },
  ]

  const loadRecentModules = async () => {
    try {
      const stored = await AsyncStorage.getItem("recentModulesManagement")
      if (stored) setRecentModules(JSON.parse(stored).slice(0, 4))
    } catch (error) {
      console.error("Error loading recent modules:", error)
    }
  }

  const saveRecentModules = async (modules: RecentModule[]) => {
    try {
      await AsyncStorage.setItem("recentModulesManagement", JSON.stringify(modules))
    } catch (error) {
      console.error("Error saving recent modules:", error)
    }
  }

  const handleModulePress = (module: any) => {
    const recentModule: RecentModule = { ...module, lastUsed: Date.now() }
    const updated = [recentModule, ...recentModules.filter((m) => m.screen !== module.screen)].slice(0, 4)
    setRecentModules(updated)
    saveRecentModules(updated)
    router.push(module.screen as any)
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
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
      {/* ===== Header ===== */}
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
            {getGreeting()}, {Profile?.full_name}
          </Typography>
          <LogoutButton />
        </View>
      </LinearGradient>

      {/* ===== Quick Stats ===== */}
      <View className="flex-row flex-wrap justify-between px-4 -mt-8 mb-6">
        {quickStats.map((stat, i) => (
          <TouchableOpacity
            key={i}
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
            {renderIcon(stat.icon, 40, stat.colors[0])}
            <Typography className="text-2xl font-extrabold text-[#2C3E50] mt-3">{stat.value}</Typography>
            <Typography className="text-xs text-[#7F8C8D] mt-1">{stat.title}</Typography>
          </TouchableOpacity>
        ))}
      </View>

      {/* ===== Recently Used ===== */}
      {recentModules.length > 0 && (
        <View className="px-4 mb-6">
          <Typography className="text-[22px] font-bold text-[#2C3E50] mb-4">Recently Used</Typography>
          <View className="flex-row justify-between">
            {recentModules.map((module, i) => (
              <TouchableOpacity
                key={i}
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
                {renderIcon(module.icon, 32, module.colors[0])}
                <Typography className="text-xs font-semibold text-[#2C3E50] text-center mt-2">
                  {module.title}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* ===== All Sections ===== */}
      {managementSections.map((section, i) => (
        <View key={i} className="px-4 mb-8">
          <Typography className="text-[22px] font-bold text-[#2C3E50] mb-4">{section.title}</Typography>
          <View className="flex-row flex-wrap justify-between">
            {section.modules.map((module, j) => (
              <TouchableOpacity
                key={j}
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
                {renderIcon(module.icon, 48, module.colors[0])}
                <Typography className="text-xs font-bold text-[#2C3E50] text-center mb-1">{module.title}</Typography>
                <Typography className="text-xs text-[#7F8C8D] text-center">{module.description}</Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <View className="h-8" />
    </ScrollView>
  )
}

export default ManagementDashboard
