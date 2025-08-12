
import { useRouter } from "expo-router"
import type React from "react"
import { View, Text, ScrollView, TouchableOpacity, Dimensions, RefreshControl } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useEffect, useState } from "react"
import { useStudentData } from "@/hooks/useStudentData"
import LogoutButton from "@/components/LogoutButton"
import { Typography } from "@/components/Typography"
const { width } = Dimensions.get("window")

const StudentDashboard: React.FC = () => {
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = () => {
    setRefreshing(true)
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000)
  }

  const {profile:Profile}=useStudentData()

  const studentModules = [
    // {
    //   title: "Time Table",
    //   icon: "calendar-today",
    //   color: "#6A5ACD",
    //   screen: "/student/timetable",
    //   description: "View your daily timetable",
    // },
    {
      title: "Results",
      icon: "grade",
      color: "#2ECC71",
      screen: "/student/result",
      description: "Check your academic performance",
    },
    {
      title: "Homework",
      icon: "assignment",
      color: "#F39C12",
      screen: "/student/homework",
      description: "Track homework and deadlines",
    },
    {
      title: "Announcements",
      icon: "campaign",
      color: "#00BCD4",
      screen: "/student/notice",
      description: "Stay updated with school news",
    },
    {
      title: "Library",
      icon: "local-library",
      color: "#5B4BBD",
      screen: "/student/library",
      description: "Manage your borrowed books",
    },
    {
      title: "Attendance",
      icon: "check-circle",
      color: "#FFC107",
      screen: "/student/attendance",
      description: "Monitor your class attendance",
    },
    // {
    //   title: "Fees",
    //   icon: "payment",
    //   color: "#E74C3C",
    //   screen: "/student/fee",
    //   description: "View and pay your fees",
    // },
    // {
    //   title: "Messages",
    //   icon: "message",
    //   color: "#0097A7",
    //   screen: "/student/communication",
    //   description: "Communicate with teachers",
    // },
    {
      title: "Exam Schedule",
      icon: "quiz",
      color: "#9C27B0",
      screen: "/student/exam",
      description: "View upcoming examinations",
    },
    {
      title: "Syllabus",
      icon: "book",
      color: "#3F51B5",
      screen: "/student/syllabus",
      description: "Access course curriculum",
    },
    {
      title: "Event Gallery",
      icon: "photo-library",
      color: "#E91E63",
      screen: "/student/events/gallery",
      description: "View event photos",
    },
    {
      title: "Calendar",
      icon: "event",
      color: "#FF5722",
      screen: "/student/calendar",
      description: "Important academic dates",
    },
    {
      title: "Transport",
      icon: "directions-bus",
      color: "#FF9800",
      screen: "/student/transport",
      description: "Bus routes and schedules",
    },
    // {
    //   title: "Hostel",
    //   icon: "home",
    //   color: "#607D8B",
    //   screen: "/student/hostel",
    //   description: "Hostel services and info",
    // },
    {
      title: "Health",
      icon: "local-hospital",
      color: "#4CAF50",
      screen: "/student/health",
      description: "Medical records and checkups",
    },
    // {
    //   title: "Profile",
    //   icon: "person",
    //   color: "#795548",
    //   screen: "/student/profile",
    //   description: "Manage your profile",
    // },
  ]

  const quickStats = [
    { title: "Attendance", value: "--", icon: "event-available", color: "#2ECC71" },
    { title: "New Homwork", value: "0", icon: "assignment", color: "#F39C12" },
    { title: "Next Exam", value: "--", icon: "quiz", color: "#E74C3C" },
    { title: "Fees Due", value: " -- ", icon: "payment", color: "#6A5ACD" },
  ]

  const upcomingEvents = [
    {
      title: "Math Exam",
      date: "Dec 15, 2024",
      time: "10:00 AM",
      icon: "event",
      color: "#6A5ACD",
    },
    {
      title: "Science Fair",
      date: "Dec 20, 2024",
      time: "All Day",
      icon: "science",
      color: "#00BCD4",
    },
    {
      title: "Winter Break Starts",
      date: "Dec 22, 2024",
      time: "All Day",
      icon: "beach-access",
      color: "#2ECC71",
    },
  
  ]

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
 console.log(Profile,"Profile Data")
}, [])

  return (
    <ScrollView
      className="flex-1 bg-[#F0F4F8]"
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View className="p-5 mt-8 flex flex-row  items-center bg-[#6A5ACD] rounded-b-[30px] pb-10  justify-between">
        <Typography className="  font-extrabold text-white mb-2 text-center">{getGreeting().message} 👋, {Profile?.full_name} </Typography> 
        {/* <Typography className="text-lg text-[#EAECEE] text-center">Your school journey starts here</Typography>  */}
      <LogoutButton/>
      </View>

      {/* Quick Stats */}
      <View className="flex-row flex-wrap justify-between px-4 -mt-8 mb-6">
        {quickStats.map((stat, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white rounded-2xl px-2 py-3 items-center shadow-lg elevation-5 mb-3"
            style={{ width: (width - 48) / 2 }}
          >
            <Icon name={stat.icon} size={28} color={stat.color} />
            <Typography className="text-2xl font-extrabold text-[#2C3E50] mt-2">{stat.value}</Typography> 
            <Typography className="text-xs text-[#7F8C8D] mt-1">{stat.title}</Typography> 
          </TouchableOpacity>
        ))}
      </View>

      {/* Module Grid */}
      <View className="px-4 mb-6">
        <Typography className="text-[22px] font-bold text-[#2C3E50] mb-4">Quick Access</Typography> 
        <View className="flex-row flex-wrap justify-between">
          {studentModules.map((module, index) => (
            <TouchableOpacity
              key={index}
              className="bg-white rounded-[20px] p-4 items-center shadow-lg elevation-8 mb-4"
              style={{ width: (width - 64) / 3 }}
              onPress={() => router.push(module.screen as any)}
            >
              <View
                className="w-12 h-12 rounded-2xl justify-center items-center mb-2"
                style={{ backgroundColor: `${module.color}15` }}
              >
                <Icon name={module.icon} size={24} color={module.color} />
              </View>
              <Typography className="text-xs font-bold text-[#2C3E50] text-center mb-1">{module.title}</Typography> 
              <Typography className="text-xs  text-[#7F8C8D] text-center">{module.description}</Typography> 
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Upcoming Events Section */}
      <View className="px-4 pb-6">
        <Typography className="text-[22px] font-bold text-[#2C3E50] mb-4">Upcoming Events</Typography> 
        <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
          {upcomingEvents.map((event, index) => (
            <View key={index} className="flex-row items-center py-3 border-b border-[#DDE4EB] last:border-b-0">
              <View
                className="w-11 h-11 rounded-[22px] justify-center items-center mr-3"
                style={{ backgroundColor: `${event.color}15` }}
              >
                <Icon name={event.icon} size={24} color={event.color} />
              </View>
              <View className="flex-1">
                <Typography className="text-base font-semibold text-[#2C3E50] mb-0.5">{event.title}</Typography> 
                <Typography className="text-[13px] text-[#BDC3C7]">
                  {event.date} • {event.time}
                </Typography> 
              </View>
              <Icon name="chevron-right" size={20} color="#BDC3C7" />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

export default StudentDashboard

