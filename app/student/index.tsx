import { useRouter } from "expo-router"
import type React from "react"
import { use } from "react"
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"

const { width } = Dimensions.get("window")


const HomePage = () => {
  const router=useRouter()
  const studentModules = [
    {
      title: "My Schedule",
      icon: "calendar-today",
      color: "#6A5ACD",
      screen: "/student/timetable",
      description: "View your daily timetable",
    },
    {
      title: "Grades & Results",
      icon: "grade",
      color: "#2ECC71",
      screen: "/student/exam",
      description: "Check your academic performance",
    },
    {
      title: "Assignments",
      icon: "assignment",
      color: "#F39C12",
      screen: "/student/homework",
      description: "Track homework and deadlines",
    },
    {
      title: "Announcements",
      icon: "campaign",
      color: "#00BCD4",
      screen: "/notice",
      description: "Stay updated with school news",
    },
    {
      title: "Library",
      icon: "local-library",
      color: "#5B4BBD",
      screen: "/library",
      description: "Manage your borrowed books",
    },
    {
      title: "Attendance",
      icon: "check-circle",
      color: "#FFC107",
      screen: "/student/attendance",
      description: "Monitor your class attendance",
    },
    {
      title: "Fees & Billing",
      icon: "payment",
      color: "#E74C3C",
      screen: "/student/fee",
      description: "View and pay your fees",
    },
    {
      title: "Messages",
      icon: "message",
      color: "#0097A7",
      screen: "/messages",
      description: "Communicate with teachers",
    },
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

  return (
    <ScrollView className="flex-1 bg-[#F0F4F8]" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="p-5 bg-[#6A5ACD] rounded-b-[30px] pb-10 items-center justify-center">
        <Text className="text-[32px] font-extrabold text-white mb-2 text-center">Hello, Alex!</Text>
        <Text className="text-lg text-[#EAECEE] text-center">Your school journey starts here</Text>
      </View>

      {/* Module Grid */}
      <View className="flex-row flex-wrap justify-between p-4 -mt-8">
        {studentModules.map((module, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white rounded-[20px] p-5 items-center shadow-lg elevation-8 mb-4"
            style={{ width: (width - 48) / 2 }}
            onPress={() => router.push(module.screen as any)}
          >
            <View
              className="w-[70px] h-[70px] rounded-[35px] justify-center items-center mb-3"
              style={{ backgroundColor: `${module.color}15` }}
            >
              <Icon name={module.icon} size={36} color={module.color} />
            </View>
            <Text className="text-lg font-bold text-[#2C3E50] text-center mb-1">{module.title}</Text>
            <Text className="text-xs text-[#7F8C8D] text-center">{module.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Upcoming Events Section */}
      <View className="p-4">
        <Text className="text-[22px] font-bold text-[#2C3E50] mb-4">Upcoming Events</Text>
        <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
          {upcomingEvents.map((event, index) => (
            <View key={index} className="flex-row items-center py-3 border-b border-[#DDE4EB]">
              <View
                className="w-11 h-11 rounded-[22px] justify-center items-center mr-3"
                style={{ backgroundColor: `${event.color}15` }}
              >
                <Icon name={event.icon} size={24} color={event.color} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-[#2C3E50] mb-0.5">{event.title}</Text>
                <Text className="text-[13px] text-[#BDC3C7]">
                  {event.date} • {event.time}
                </Text>
              </View>
              <Icon name="chevron-right" size={20} color="#BDC3C7" />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

export default HomePage



// import React from 'react';
// import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const { width } = Dimensions.get('window');

// interface DashboardScreenProps {
//   navigation: any;
// }

// const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
//   const studentInfo = {
//     name: "John Doe",
//     class: "Class 12-A",
//     rollNumber: "2024001",
//     profileImage: "https://via.placeholder.com/100"
//   };

//   const quickStats = [
//     { title: "Attendance", value: "85%", icon: "event-available", color: "#2ECC71", screen: "Attendance" },
//     { title: "Pending HW", value: "3", icon: "assignment", color: "#F39C12", screen: "Homework" },
//     { title: "Next Exam", value: "5 days", icon: "quiz", color: "#E74C3C", screen: "Exam" },
//     { title: "Fees Due", value: "₹15K", icon: "payment", color: "#6A5ACD", screen: "Fees" }
//   ];

//   const menuItems = [
//     { title: "Profile", icon: "person", color: "#6A5ACD", screen: "Profile" },
//     { title: "Attendance", icon: "event-available", color: "#2ECC71", screen: "Attendance" },
//     { title: "Timetable", icon: "schedule", color: "#00BCD4", screen: "Timetable" },
//     { title: "Homework", icon: "assignment", color: "#F39C12", screen: "Homework" },
//     { title: "Exams", icon: "quiz", color: "#E74C3C", screen: "Exam" },
//     { title: "Fees", icon: "payment", color: "#9C27B0", screen: "Fees" },
//     { title: "Notices", icon: "notifications", color: "#FF5722", screen: "Notices" },
//     { title: "Study Materials", icon: "library-books", color: "#4CAF50", screen: "StudyMaterials" },
//     { title: "Messages", icon: "message", color: "#2196F3", screen: "Messages" },
//     { title: "Library", icon: "local-library", color: "#795548", screen: "Library" },
//     { title: "Transport", icon: "directions-bus", color: "#FF9800", screen: "Transport" },
//     { title: "Events", icon: "event", color: "#E91E63", screen: "EventCalendar" },
//     { title: "Hostel", icon: "home", color: "#607D8B", screen: "Hostel" },
//     { title: "Syllabus", icon: "book", color: "#3F51B5", screen: "Syllabus" }
//   ];

//   const recentActivities = [
//     { title: "Math Assignment submitted", time: "2 hours ago", icon: "check-circle", color: "#2ECC71" },
//     { title: "Physics exam scheduled", time: "1 day ago", icon: "schedule", color: "#F39C12" },
//     { title: "Fee payment reminder", time: "2 days ago", icon: "payment", color: "#E74C3C" }
//   ];

//   return (
//     <ScrollView className="flex-1 bg-[#F0F4F8]" showsVerticalScrollIndicator={false}>
//       {/* Header */}
//       <View className="bg-[#6A5ACD] pt-12 pb-8 px-4 rounded-b-[25px]">
//         <View className="flex-row items-center justify-between mb-4">
//           <View className="flex-row items-center">
//             <View className="w-12 h-12 bg-white rounded-full items-center justify-center mr-3">
//               <Icon name="person" size={24} color="#6A5ACD" />
//             </View>
//             <View>
//               <Text className="text-white text-lg font-bold">{studentInfo.name}</Text>
//               <Text className="text-white/80 text-sm">{studentInfo.class} • Roll: {studentInfo.rollNumber}</Text>
//             </View>
//           </View>
//           <TouchableOpacity className="p-2">
//             <Icon name="notifications" size={24} color="white" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Quick Stats */}
//       <View className="flex-row flex-wrap justify-between px-4 -mt-6 mb-6">
//         {quickStats.map((stat, index) => (
//           <TouchableOpacity
//             key={index}
//             className="bg-white rounded-2xl p-4 items-center shadow-lg elevation-5 mb-3"
//             style={{ width: (width - 48) / 2 }}
//             onPress={() => navigation.navigate(stat.screen)}
//           >
//             <Icon name={stat.icon} size={28} color={stat.color} />
//             <Text className="text-2xl font-extrabold text-[#2C3E50] mt-2">{stat.value}</Text>
//             <Text className="text-xs text-[#7F8C8D] mt-1">{stat.title}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Menu Grid */}
//       <View className="px-4 mb-6">
//         <Text className="text-xl font-bold text-[#2C3E50] mb-4">Quick Access</Text>
//         <View className="flex-row flex-wrap justify-between">
//           {menuItems.map((item, index) => (
//             <TouchableOpacity
//               key={index}
//               className="bg-white rounded-2xl p-4 items-center shadow-lg elevation-5 mb-4"
//               style={{ width: (width - 64) / 3 }}
//               onPress={() => navigation.navigate(item.screen)}
//             >
//               <View 
//                 className="w-12 h-12 rounded-2xl items-center justify-center mb-2"
//                 style={{ backgroundColor: `${item.color}20` }}
//               >
//                 <Icon name={item.icon} size={24} color={item.color} />
//               </View>
//               <Text className="text-xs font-semibold text-[#2C3E50] text-center">{item.title}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       {/* Recent Activities */}
//       <View className="px-4 mb-6">
//         <Text className="text-xl font-bold text-[#2C3E50] mb-4">Recent Activities</Text>
//         <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
//           {recentActivities.map((activity, index) => (
//             <View key={index} className="flex-row items-center py-3 border-b border-[#EAECEE] last:border-b-0">
//               <Icon name={activity.icon} size={20} color={activity.color} />
//               <View className="flex-1 ml-3">
//                 <Text className="text-sm font-semibold text-[#2C3E50]">{activity.title}</Text>
//                 <Text className="text-xs text-[#7F8C8D] mt-1">{activity.time}</Text>
//               </View>
//             </View>
//           ))}
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// export default DashboardScreen;
