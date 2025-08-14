



import { useRouter } from "expo-router"
import type React from "react"
import { View, ScrollView, TouchableOpacity, Dimensions, RefreshControl } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useContext, useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import LogoutButton from "@/components/LogoutButton"
import { Typography } from "@/components/Typography"
import { StudentAppDataContext } from "@/context/Student/context"
import Premium3DIcon from "@/components/Premium3DIcon"
import { LinearGradient } from "expo-linear-gradient"
import { check_update } from "@/service/mobile_app"


import * as FileSystem from "expo-file-system";
// import RNFS from "react-native-fs";



import { Linking, Platform, Alert } from "react-native";
import { setParams } from "expo-router/build/global-state/routing"

const { width, height } = Dimensions.get("window")

interface RecentModule {
  title: string
  icon: string
  colors: string[]
  screen: string
  lastUsed: number
}

const StudentDashboard: React.FC = () => {
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)
  const [recentModules, setRecentModules] = useState<RecentModule[]>([])

  const [progress, setProgress] = useState(0)

  const { profile: Profile, refresh: refreshProfile } = useContext(StudentAppDataContext)

  const onRefresh = () => {
    setRefreshing(true)
    refreshProfile()
    setTimeout(() => setRefreshing(false), 1000)
  }

  const studentModules = [
    {
      title: "Announcements",
      icon: "campaign",
      colors: ["#4facfe", "#00f2fe"],
      screen: "/student/notice",
      description: "Stay updated with school news",
    },
    {
      title: "Attendance",
      icon: "check-circle",
      colors: ["#ffecd2", "#fcb69f"],
      screen: "/student/attendance",
      description: "Monitor your class attendance",
    },
    {
      title: "Calendar",
      icon: "event",
      colors: ["#fdbb2d", "#22c1c3"],
      screen: "/student/calendar",
      description: "Important academic dates",
    },
    {
      title: "Event Gallery",
      icon: "photo-library",
      colors: ["#89f7fe", "#66a6ff"],
      screen: "/student/events/gallery",
      description: "View event photos",
    },
    {
      title: "Exam Schedule",
      icon: "quiz",
      colors: ["#a8edea", "#fed6e3"],
      screen: "/student/exam",
      description: "View upcoming examinations",
    },
    {
      title: "Health",
      icon: "local-hospital",
      colors: ["#a1c4fd", "#c2e9fb"],
      screen: "/student/health",
      description: "Medical records and checkups",
    },
    {
      title: "Homework",
      icon: "assignment",
      colors: ["#f093fb", "#f5576c"],
      screen: "/student/homework",
      description: "Track homework and deadlines",
    },
    {
      title: "Library",
      icon: "local-library",
      colors: ["#667eea", "#764ba2"],
      screen: "/student/library",
      description: "Manage your borrowed books",
    },
    {
      title: "Profile",
      icon: "account-circle",
      colors: ["#11998e", "#38ef7d"],
      screen: "/student/profile",
      description: "View your academic profile",
    },
    {
      title: "Results",
      icon: "grade",
      colors: ["#11998e", "#38ef7d"],
      screen: "/student/result",
      description: "Check your academic performance",
    },
    {
      title: "Syllabus",
      icon: "book",
      colors: ["#d299c2", "#fef9d7"],
      screen: "/student/syllabus",
      description: "Access course curriculum",
    },
    {
      title: "Transport",
      icon: "directions-bus",
      colors: ["#ff9a9e", "#fecfef"],
      screen: "/student/transport",
      description: "Bus routes and schedules",
    },
  ]

  const quickStats = [
    {
      title: "Attendance",
      value: "--",
      icon: "event-available",
      colors: ["#11998e", "#38ef7d"],
    },
    {
      title: "New Homework",
      value: "0",
      icon: "assignment",
      colors: ["#f093fb", "#f5576c"],
    },
    {
      title: "Next Exam",
      value: "--",
      icon: "quiz",
      colors: ["#a8edea", "#fed6e3"],
    },
    {
      title: "Fees Due",
      value: " -- ",
      icon: "payment",
      colors: ["#667eea", "#764ba2"],
    },
  ]

  const appUpdates = [

    {
      title: "Performance Improvements",
      description: "Faster loading times and smoother animations",
      version: "v2.0.8",
    },

  ]
  const [appUpdate, setAppUpdate] = useState<{
    name: string,
    version: string,
    description: string,
    download_link: string,
    mandatory: boolean
    platform: string
    release_at: string

  } | null>(
   null
  )
  useEffect(() => {
    const fetch_app_update = async () => {
      check_update().then((update) => setAppUpdate(update)).catch(() => { })
    }
    fetch_app_update()

  }, [])

  // Load recent modules from AsyncStorage
  const loadRecentModules = async () => {
    try {
      const stored = await AsyncStorage.getItem("recentModules")
      if (stored) {
        const parsed = JSON.parse(stored)
        setRecentModules(parsed.slice(0, 4)) // Only keep top 4
      }
    } catch (error) {
      console.error("Error loading recent modules:", error)
    }
  }

  // Save recent modules to AsyncStorage
  const saveRecentModules = async (modules: RecentModule[]) => {
    try {
      await AsyncStorage.setItem("recentModules", JSON.stringify(modules))
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

    // Update recent modules list
    const updatedRecent = [recentModule, ...recentModules.filter((item) => item.screen !== module.screen)].slice(0, 4) // Keep only top 4

    setRecentModules(updatedRecent)
    saveRecentModules(updatedRecent)

    // Navigate to the module
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
    console.log(Profile, "Profile Data")
    loadRecentModules()
  }, [])








  const handleUpdateClick = async (apkUrl: string) => {
    if (Platform.OS !== "android") {
      Alert.alert("Not Supported", "App installation is only supported on Android.");
      return;
    }

    try {
      const downloadDest = FileSystem.cacheDirectory + "vedatron.apk";

      const downloadResumable = FileSystem.createDownloadResumable(
        apkUrl,
        downloadDest,
        {},
        ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
          const progress = totalBytesWritten / totalBytesExpectedToWrite;
          setProgress(progress);
        }
      );

      const result = await downloadResumable.downloadAsync();

      if (result && result.status === 200) {
        const canOpen = await Linking.canOpenURL(result.uri);
        if (canOpen) {
          await Linking.openURL(result.uri); // Open Android installer
        } else {
          Alert.alert("Error", "Cannot open the downloaded APK.");
        }
      } else {
        Alert.alert("Error", "Download failed.");
      }
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Failed");
    }
  };



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
            {getGreeting().message} 👋, {Profile?.full_name}
          </Typography>
          <LogoutButton />
        </View>
      </LinearGradient>

      {/* Quick Stats with 3D Icons */}
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

      {/* Module Grid with 3D Icons */}
      <View className="px-4 mb-6">
        <Typography className="text-[22px] font-bold text-[#2C3E50] mb-4">Quick Access</Typography>
        <View className="flex-row flex-wrap justify-between">
          {studentModules.map((module, index) => (
            <TouchableOpacity
              key={index}
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
              <Premium3DIcon name={module.icon} size={48} colors={module.colors} containerStyle={{ marginBottom: 8 }} />
              <Typography className="text-xs font-bold text-[#2C3E50] text-center mb-1">{module.title}</Typography>
              <Typography className="text-xs text-[#7F8C8D] text-center">{module.description}</Typography>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* App Updates Section */}
      <View className="px-4 pb-6">
        <Typography className="text-[22px] font-bold text-[#2C3E50] mb-4">App Updates</Typography>
        <View
          className="bg-white rounded-2xl p-4"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          {appUpdate && (
            <TouchableOpacity
              onPress={() => handleUpdateClick(appUpdate?.download_link)}
              className="flex-row items-center py-3 border-b border-[#DDE4EB] last:border-b-0"
            >
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <Typography className="text-base font-semibold text-[#2C3E50]">
                    {appUpdate.name}
                  </Typography>
                </View>
                <Typography className="text-[13px] text-[#7F8C8D] mb-1">
                  {appUpdate.description}
                </Typography>
                <Typography className="text-xs text-[#BDC3C7]">
                  {appUpdate.version}
                </Typography>
              </View>
              <Icon name="chevron-right" size={20} color="#BDC3C7" />
            </TouchableOpacity>
          )}


          {!appUpdate &&
            <Typography className="text-xs text-[#BDC3C7]">You are using latest version of Vedatron ERP</Typography>


          }
        </View>
      </View>
    </ScrollView>
  )
}

export default StudentDashboard
