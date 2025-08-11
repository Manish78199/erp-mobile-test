// "use client"

// import type React from "react"
// import { useState } from "react"
// import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native"
// import Icon from "react-native-vector-icons/MaterialIcons"
// import { Link } from "expo-router"

// const AttendanceScreen: React.FC = () => {
//   const [selectedMonth, setSelectedMonth] = useState(new Date())
//   const [selectedView, setSelectedView] = useState<"monthly" | "weekly" | "daily">("monthly")
//   const [showDetailsModal, setShowDetailsModal] = useState(false)
//   const [selectedDate, setSelectedDate] = useState<any>(null)
//   const [selectedSubject, setSelectedSubject] = useState("all")

//   const attendanceData = {
//     overall: {
//       totalDays: 180,
//       presentDays: 162,
//       absentDays: 18,
//       percentage: 90,
//       lateArrivals: 5,
//       earlyDepartures: 2,
//     },
//     subjects: [
//       { name: "Mathematics", present: 45, total: 50, percentage: 90, color: "#6A5ACD" },
//       { name: "Physics", present: 42, total: 48, percentage: 87.5, color: "#00BCD4" },
//       { name: "Chemistry", present: 46, total: 49, percentage: 93.9, color: "#2ECC71" },
//       { name: "Biology", present: 44, total: 47, percentage: 93.6, color: "#FFC107" },
//       { name: "English", present: 48, total: 50, percentage: 96, color: "#E91E63" },
//     ],
//     monthly: [
//       {
//         date: "2024-12-01",
//         status: "present",
//         subjects: [
//           { name: "Mathematics", status: "present", time: "09:00 AM" },
//           { name: "Physics", status: "present", time: "10:30 AM" },
//           { name: "Chemistry", status: "present", time: "12:00 PM" },
//         ],
//       },
//       {
//         date: "2024-12-02",
//         status: "present",
//         subjects: [
//           { name: "Biology", status: "present", time: "09:00 AM" },
//           { name: "English", status: "present", time: "10:30 AM" },
//           { name: "Mathematics", status: "present", time: "12:00 PM" },
//         ],
//       },
//       {
//         date: "2024-12-03",
//         status: "absent",
//         reason: "Medical Leave",
//         subjects: [
//           { name: "Physics", status: "absent", time: "09:00 AM" },
//           { name: "Chemistry", status: "absent", time: "10:30 AM" },
//           { name: "Biology", status: "absent", time: "12:00 PM" },
//         ],
//       },
//       {
//         date: "2024-12-04",
//         status: "late",
//         arrivalTime: "09:15 AM",
//         subjects: [
//           { name: "Mathematics", status: "late", time: "09:00 AM" },
//           { name: "English", status: "present", time: "10:30 AM" },
//           { name: "Physics", status: "present", time: "12:00 PM" },
//         ],
//       },
//       {
//         date: "2024-12-05",
//         status: "present",
//         subjects: [
//           { name: "Chemistry", status: "present", time: "09:00 AM" },
//           { name: "Biology", status: "present", time: "10:30 AM" },
//           { name: "English", status: "present", time: "12:00 PM" },
//         ],
//       },
//       {
//         date: "2024-12-06",
//         status: "half-day",
//         departureTime: "12:00 PM",
//         reason: "Doctor Appointment",
//         subjects: [
//           { name: "Mathematics", status: "present", time: "09:00 AM" },
//           { name: "Physics", status: "present", time: "10:30 AM" },
//           { name: "Chemistry", status: "absent", time: "12:00 PM" },
//         ],
//       },
//       {
//         date: "2024-12-07",
//         status: "present",
//         subjects: [
//           { name: "Biology", status: "present", time: "09:00 AM" },
//           { name: "English", status: "present", time: "10:30 AM" },
//           { name: "Mathematics", status: "present", time: "12:00 PM" },
//         ],
//       },
//       {
//         date: "2024-12-08",
//         status: "holiday",
//         reason: "Weekend",
//         subjects: [],
//       },
//       {
//         date: "2024-12-09",
//         status: "present",
//         subjects: [
//           { name: "Physics", status: "present", time: "09:00 AM" },
//           { name: "Chemistry", status: "present", time: "10:30 AM" },
//           { name: "Biology", status: "present", time: "12:00 PM" },
//         ],
//       },
//       {
//         date: "2024-12-10",
//         status: "present",
//         subjects: [
//           { name: "Mathematics", status: "present", time: "09:00 AM" },
//           { name: "English", status: "present", time: "10:30 AM" },
//           { name: "Physics", status: "present", time: "12:00 PM" },
//         ],
//       },
//     ],
//   }

//   const monthNames = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ]

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "present":
//         return "#2ECC71"
//       case "absent":
//         return "#E74C3C"
//       case "late":
//         return "#F39C12"
//       case "half-day":
//         return "#9B59B6"
//       case "holiday":
//         return "#95A5A6"
//       default:
//         return "#BDC3C7"
//     }
//   }

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "present":
//         return "check-circle"
//       case "absent":
//         return "cancel"
//       case "late":
//         return "access-time"
//       case "half-day":
//         return "schedule"
//       case "holiday":
//         return "event"
//       default:
//         return "help"
//     }
//   }

//   const getDaysInMonth = (date: Date) => {
//     return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
//   }

//   const getFirstDayOfMonth = (date: Date) => {
//     return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
//   }

//   const formatDateKey = (date: Date) => {
//     const year = date.getFullYear()
//     const month = String(date.getMonth() + 1).padStart(2, "0")
//     const day = String(date.getDate()).padStart(2, "0")
//     return `${year}-${month}-${day}`
//   }

//   const getAttendanceForDate = (date: Date) => {
//     const dateKey = formatDateKey(date)
//     return attendanceData.monthly.find((record) => record.date === dateKey)
//   }

//   const navigateMonth = (direction: number) => {
//     const newMonth = new Date(selectedMonth)
//     newMonth.setMonth(selectedMonth.getMonth() + direction)
//     setSelectedMonth(newMonth)
//   }

//   const renderCalendarDays = () => {
//     const daysInMonth = getDaysInMonth(selectedMonth)
//     const firstDay = getFirstDayOfMonth(selectedMonth)
//     const weeks = []
//     let currentWeek = []

//     // Empty cells for days before the first day of the month
//     for (let i = 0; i < firstDay; i++) {
//       currentWeek.push(<View key={`empty-${i}`} className="flex-1 aspect-square items-center justify-center m-0.5" />)
//     }

//     // Days of the month
//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day)
//       const attendance = getAttendanceForDate(date)
//       const isToday = date.toDateString() === new Date().toDateString()

//       currentWeek.push(
//         <TouchableOpacity
//           key={day}
//           className={`flex-1 aspect-square items-center justify-center m-0.5 rounded-lg min-h-[45px] ${
//             isToday ? "border-2 border-[#6A5ACD]" : ""
//           }`}
//           style={{
//             backgroundColor: attendance ? `${getStatusColor(attendance.status)}20` : "transparent",
//           }}
//           onPress={() => {
//             if (attendance) {
//               setSelectedDate({ date, ...attendance })
//               setShowDetailsModal(true)
//             }
//           }}
//         >
//           <Text className={`text-sm font-semibold ${isToday ? "text-[#6A5ACD]" : "text-[#2C3E50]"}`}>{day}</Text>
//           {attendance && (
//             <View className="mt-1">
//               <Icon name={getStatusIcon(attendance.status)} size={12} color={getStatusColor(attendance.status)} />
//             </View>
//           )}
//         </TouchableOpacity>,
//       )

//       if (currentWeek.length === 7) {
//         weeks.push(
//           <View key={`week-${weeks.length}`} className="flex-row">
//             {currentWeek}
//           </View>,
//         )
//         currentWeek = []
//       }
//     }

//     // Fill the last week if it's not complete
//     if (currentWeek.length > 0) {
//       while (currentWeek.length < 7) {
//         currentWeek.push(
//           <View
//             key={`empty-end-${currentWeek.length}`}
//             className="flex-1 aspect-square items-center justify-center m-0.5"
//           />,
//         )
//       }
//       weeks.push(
//         <View key={`week-${weeks.length}`} className="flex-row">
//           {currentWeek}
//         </View>,
//       )
//     }

//     return weeks
//   }

//   const getAttendanceStreak = () => {
//     const recent = attendanceData.monthly.slice(-10).reverse()
//     let streak = 0
//     for (const record of recent) {
//       if (record.status === "present") {
//         streak++
//       } else {
//         break
//       }
//     }
//     return streak
//   }

//   const getMonthlyStats = () => {
//     const monthData = attendanceData.monthly.filter((record) => {
//       const recordDate = new Date(record.date)
//       return (
//         recordDate.getMonth() === selectedMonth.getMonth() && recordDate.getFullYear() === selectedMonth.getFullYear()
//       )
//     })

//     const present = monthData.filter((r) => r.status === "present").length
//     const absent = monthData.filter((r) => r.status === "absent").length
//     const late = monthData.filter((r) => r.status === "late").length
//     const halfDay = monthData.filter((r) => r.status === "half-day").length
//     const total = monthData.filter((r) => r.status !== "holiday").length

//     return { present, absent, late, halfDay, total, percentage: total > 0 ? (present / total) * 100 : 0 }
//   }

//   const monthlyStats = getMonthlyStats()

//   return (
//     <ScrollView className="flex-1 bg-[#F0F4F8]" showsVerticalScrollIndicator={false}>
//       {/* Header */}
//       <View className="flex-row items-center justify-between bg-[#6A5ACD] pt-12 pb-5 px-4 rounded-b-[25px]">
//         <Link href="/student" asChild>
//           <TouchableOpacity className="p-2">
//             <Icon name="arrow-back" size={24} color="white" />
//           </TouchableOpacity>
//         </Link>
//         <View className="flex-1 items-center">
//           <Text className="text-xl font-bold text-white">Attendance Tracker</Text>
//         </View>
//         <TouchableOpacity className="p-2">
//           <Icon name="analytics" size={20} color="white" />
//         </TouchableOpacity>
//       </View>

//       {/* Overall Stats Cards */}
//       <View className="px-4 -mt-8 mb-5">
//         <View className="flex-row justify-between mb-4">
//           <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
//             <View className="w-12 h-12 bg-[#2ECC7120] rounded-full items-center justify-center mb-2">
//               <Icon name="check-circle" size={24} color="#2ECC71" />
//             </View>
//             <Text className="text-2xl font-extrabold text-[#2C3E50]">{attendanceData.overall.percentage}%</Text>
//             <Text className="text-xs text-[#7F8C8D] text-center">Overall Attendance</Text>
//           </View>
//           <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
//             <View className="w-12 h-12 bg-[#F39C1220] rounded-full items-center justify-center mb-2">
//               <Icon name="local-fire-department" size={24} color="#F39C12" />
//             </View>
//             <Text className="text-2xl font-extrabold text-[#2C3E50]">{getAttendanceStreak()}</Text>
//             <Text className="text-xs text-[#7F8C8D] text-center">Day Streak</Text>
//           </View>
//           <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
//             <View className="w-12 h-12 bg-[#E74C3C20] rounded-full items-center justify-center mb-2">
//               <Icon name="event-busy" size={24} color="#E74C3C" />
//             </View>
//             <Text className="text-2xl font-extrabold text-[#2C3E50]">{attendanceData.overall.absentDays}</Text>
//             <Text className="text-xs text-[#7F8C8D] text-center">Days Absent</Text>
//           </View>
//         </View>

//         {/* Additional Stats */}
//         <View className="flex-row justify-between">
//           <View className="bg-white rounded-2xl p-3 items-center flex-1 mx-1 shadow-lg elevation-5">
//             <Icon name="access-time" size={20} color="#F39C12" />
//             <Text className="text-lg font-bold text-[#2C3E50] mt-1">{attendanceData.overall.lateArrivals}</Text>
//             <Text className="text-[10px] text-[#7F8C8D] text-center">Late Arrivals</Text>
//           </View>
//           <View className="bg-white rounded-2xl p-3 items-center flex-1 mx-1 shadow-lg elevation-5">
//             <Icon name="exit-to-app" size={20} color="#9B59B6" />
//             <Text className="text-lg font-bold text-[#2C3E50] mt-1">{attendanceData.overall.earlyDepartures}</Text>
//             <Text className="text-[10px] text-[#7F8C8D] text-center">Early Exits</Text>
//           </View>
//           <View className="bg-white rounded-2xl p-3 items-center flex-1 mx-1 shadow-lg elevation-5">
//             <Icon name="school" size={20} color="#6A5ACD" />
//             <Text className="text-lg font-bold text-[#2C3E50] mt-1">{attendanceData.overall.totalDays}</Text>
//             <Text className="text-[10px] text-[#7F8C8D] text-center">Total Days</Text>
//           </View>
//         </View>
//       </View>

//       {/* View Toggle */}
//       <View className="px-4 mb-5">
//         <View className="flex-row bg-white rounded-2xl p-1 shadow-lg elevation-5">
//           {["monthly", "weekly", "daily"].map((view) => (
//             <TouchableOpacity
//               key={view}
//               className={`flex-1 py-3 items-center rounded-xl ${
//                 selectedView === view ? "bg-[#6A5ACD]" : "bg-transparent"
//               }`}
//               onPress={() => setSelectedView(view as any)}
//             >
//               <Text className={`text-sm font-semibold ${selectedView === view ? "text-white" : "text-[#7F8C8D]"}`}>
//                 {view.charAt(0).toUpperCase() + view.slice(1)}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       {/* Monthly Calendar View */}
//       {selectedView === "monthly" && (
//         <View className="px-4 mb-5">
//           <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
//             {/* Calendar Header */}
//             <View className="flex-row items-center justify-between mb-4">
//               <TouchableOpacity onPress={() => navigateMonth(-1)} className="p-2">
//                 <Icon name="chevron-left" size={24} color="#6A5ACD" />
//               </TouchableOpacity>
//               <Text className="text-lg font-bold text-[#2C3E50]">
//                 {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
//               </Text>
//               <TouchableOpacity onPress={() => navigateMonth(1)} className="p-2">
//                 <Icon name="chevron-right" size={24} color="#6A5ACD" />
//               </TouchableOpacity>
//             </View>

//             {/* Month Stats */}
//             <View className="bg-[#F8F9FA] rounded-xl p-3 mb-4">
//               <View className="flex-row justify-between items-center">
//                 <View className="items-center">
//                   <Text className="text-lg font-bold text-[#2ECC71]">{monthlyStats.present}</Text>
//                   <Text className="text-xs text-[#7F8C8D]">Present</Text>
//                 </View>
//                 <View className="items-center">
//                   <Text className="text-lg font-bold text-[#E74C3C]">{monthlyStats.absent}</Text>
//                   <Text className="text-xs text-[#7F8C8D]">Absent</Text>
//                 </View>
//                 <View className="items-center">
//                   <Text className="text-lg font-bold text-[#F39C12]">{monthlyStats.late}</Text>
//                   <Text className="text-xs text-[#7F8C8D]">Late</Text>
//                 </View>
//                 <View className="items-center">
//                   <Text className="text-lg font-bold text-[#6A5ACD]">{monthlyStats.percentage.toFixed(1)}%</Text>
//                   <Text className="text-xs text-[#7F8C8D]">Rate</Text>
//                 </View>
//               </View>
//             </View>

//             {/* Day Headers */}
//             <View className="flex-row mb-2">
//               {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
//                 <View key={day} className="flex-1 items-center py-2">
//                   <Text className="text-xs font-semibold text-[#7F8C8D]">{day}</Text>
//                 </View>
//               ))}
//             </View>

//             {/* Calendar Grid */}
//             <View>{renderCalendarDays()}</View>

//             {/* Legend */}
//             <View className="mt-4 pt-4 border-t border-[#EAECEE]">
//               <Text className="text-sm font-semibold text-[#2C3E50] mb-3">Legend</Text>
//               <View className="flex-row flex-wrap">
//                 {[
//                   { status: "present", label: "Present" },
//                   { status: "absent", label: "Absent" },
//                   { status: "late", label: "Late" },
//                   { status: "half-day", label: "Half Day" },
//                   { status: "holiday", label: "Holiday" },
//                 ].map((item) => (
//                   <View key={item.status} className="flex-row items-center mr-4 mb-2">
//                     <Icon name={getStatusIcon(item.status)} size={16} color={getStatusColor(item.status)} />
//                     <Text className="text-xs text-[#7F8C8D] ml-1">{item.label}</Text>
//                   </View>
//                 ))}
//               </View>
//             </View>
//           </View>
//         </View>
//       )}

//       {/* Subject-wise Attendance */}
//       <View className="px-4 mb-5">
//         <Text className="text-xl font-bold text-[#2C3E50] mb-4">Subject-wise Attendance</Text>
//         <View className="gap-3">
//           {attendanceData.subjects.map((subject, index) => (
//             <View key={index} className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
//               <View className="flex-row items-center justify-between mb-3">
//                 <View className="flex-row items-center">
//                   <View className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: subject.color }} />
//                   <Text className="text-base font-bold text-[#2C3E50]">{subject.name}</Text>
//                 </View>
//                 <View className="items-end">
//                   <Text className="text-lg font-bold text-[#6A5ACD]">{subject.percentage.toFixed(1)}%</Text>
//                   <Text className="text-xs text-[#7F8C8D]">
//                     {subject.present}/{subject.total}
//                   </Text>
//                 </View>
//               </View>

//               {/* Progress Bar */}
//               <View className="h-2 bg-[#EAECEE] rounded-full overflow-hidden mb-2">
//                 <View
//                   className="h-full rounded-full"
//                   style={{
//                     width: `${subject.percentage}%`,
//                     backgroundColor: subject.color,
//                   }}
//                 />
//               </View>

//               {/* Subject Stats */}
//               <View className="flex-row justify-between">
//                 <Text className="text-xs text-[#2ECC71]">Present: {subject.present}</Text>
//                 <Text className="text-xs text-[#E74C3C]">Absent: {subject.total - subject.present}</Text>
//                 <Text className="text-xs text-[#7F8C8D]">Total: {subject.total}</Text>
//               </View>
//             </View>
//           ))}
//         </View>
//       </View>

//       {/* Recent Activity */}
//       <View className="px-4 mb-8">
//         <Text className="text-xl font-bold text-[#2C3E50] mb-4">Recent Activity</Text>
//         <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
//           {attendanceData.monthly
//             .slice(-5)
//             .reverse()
//             .map((record, index) => (
//               <TouchableOpacity
//                 key={index}
//                 className="flex-row items-center justify-between py-3 border-b border-[#EAECEE] last:border-b-0"
//                 onPress={() => {
//                   setSelectedDate({ date: new Date(record.date), ...record })
//                   setShowDetailsModal(true)
//                 }}
//               >
//                 <View className="flex-row items-center flex-1">
//                   <View
//                     className="w-10 h-10 rounded-full items-center justify-center mr-3"
//                     style={{ backgroundColor: `${getStatusColor(record.status)}20` }}
//                   >
//                     <Icon name={getStatusIcon(record.status)} size={20} color={getStatusColor(record.status)} />
//                   </View>
//                   <View>
//                     <Text className="text-base font-semibold text-[#2C3E50]">
//                       {new Date(record.date).toLocaleDateString("en-US", {
//                         weekday: "long",
//                         month: "short",
//                         day: "numeric",
//                       })}
//                     </Text>
//                     <Text className="text-sm text-[#7F8C8D]" style={{ color: getStatusColor(record.status) }}>
//                       {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
//                     </Text>
//                   </View>
//                 </View>
//                 <View className="items-end">
//                   <Text className="text-sm font-semibold text-[#2C3E50]">{record.subjects.length} classes</Text>
//                   <Icon name="chevron-right" size={16} color="#7F8C8D" />
//                 </View>
//               </TouchableOpacity>
//             ))}
//         </View>
//       </View>

//       {/* Attendance Details Modal */}
//       <Modal
//         visible={showDetailsModal}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowDetailsModal(false)}
//       >
//         <View className="flex-1 bg-black/50 justify-end">
//           <View className="bg-white rounded-t-[25px] p-5 max-h-[80%]">
//             <View className="flex-row justify-between items-center mb-5">
//               <Text className="text-xl font-bold text-[#2C3E50]">Attendance Details</Text>
//               <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
//                 <Icon name="close" size={24} color="#2C3E50" />
//               </TouchableOpacity>
//             </View>

//             {selectedDate && (
//               <ScrollView showsVerticalScrollIndicator={false}>
//                 {/* Date Header */}
//                 <View className="items-center mb-6">
//                   <View
//                     className="w-16 h-16 rounded-full items-center justify-center mb-3"
//                     style={{ backgroundColor: `${getStatusColor(selectedDate.status)}20` }}
//                   >
//                     <Icon
//                       name={getStatusIcon(selectedDate.status)}
//                       size={32}
//                       color={getStatusColor(selectedDate.status)}
//                     />
//                   </View>
//                   <Text className="text-xl font-bold text-[#2C3E50] mb-1">
//                     {selectedDate.date.toLocaleDateString("en-US", {
//                       weekday: "long",
//                       year: "numeric",
//                       month: "long",
//                       day: "numeric",
//                     })}
//                   </Text>
//                   <View
//                     className="px-4 py-2 rounded-xl"
//                     style={{ backgroundColor: `${getStatusColor(selectedDate.status)}20` }}
//                   >
//                     <Text className="text-sm font-bold" style={{ color: getStatusColor(selectedDate.status) }}>
//                       {selectedDate.status.toUpperCase()}
//                     </Text>
//                   </View>
//                 </View>

//                 {/* Additional Info */}
//                 {(selectedDate.reason || selectedDate.arrivalTime || selectedDate.departureTime) && (
//                   <View className="bg-[#F8F9FA] rounded-2xl p-4 mb-6">
//                     {selectedDate.reason && (
//                       <View className="flex-row items-center mb-2">
//                         <Icon name="info" size={16} color="#6A5ACD" />
//                         <Text className="text-sm text-[#2C3E50] ml-2">Reason: {selectedDate.reason}</Text>
//                       </View>
//                     )}
//                     {selectedDate.arrivalTime && (
//                       <View className="flex-row items-center mb-2">
//                         <Icon name="login" size={16} color="#F39C12" />
//                         <Text className="text-sm text-[#2C3E50] ml-2">Arrived at: {selectedDate.arrivalTime}</Text>
//                       </View>
//                     )}
//                     {selectedDate.departureTime && (
//                       <View className="flex-row items-center">
//                         <Icon name="logout" size={16} color="#9B59B6" />
//                         <Text className="text-sm text-[#2C3E50] ml-2">Left at: {selectedDate.departureTime}</Text>
//                       </View>
//                     )}
//                   </View>
//                 )}

//                 {/* Subject Details */}
//                 {selectedDate.subjects.length > 0 && (
//                   <View>
//                     <Text className="text-lg font-bold text-[#2C3E50] mb-4">Class-wise Attendance</Text>
//                     <View className="gap-3">
//                       {selectedDate.subjects.map((subject: any, index: number) => (
//                         <View key={index} className="bg-[#F8F9FA] rounded-xl p-3">
//                           <View className="flex-row items-center justify-between">
//                             <View className="flex-row items-center">
//                               <Icon
//                                 name={getStatusIcon(subject.status)}
//                                 size={16}
//                                 color={getStatusColor(subject.status)}
//                               />
//                               <Text className="text-sm font-semibold text-[#2C3E50] ml-2">{subject.name}</Text>
//                             </View>
//                             <View className="items-end">
//                               <Text className="text-xs text-[#7F8C8D]">{subject.time}</Text>
//                               <Text className="text-xs font-semibold" style={{ color: getStatusColor(subject.status) }}>
//                                 {subject.status.toUpperCase()}
//                               </Text>
//                             </View>
//                           </View>
//                         </View>
//                       ))}
//                     </View>
//                   </View>
//                 )}
//               </ScrollView>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   )
// }

// export default AttendanceScreen


import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
    RefreshControl,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import { AlertContext } from '@/context/Alert/context';

// Import services
import { 
    getAttendanceSummary, 
    getAttendanceDetails, 
 
} from '@/service/student/attendance';

interface AttendanceSummary {
    session: string;
    total_days: number;
    PRESENT: { count: number; percentage: number; change_from_last_session: number };
    ABSENT: { count: number; percentage: number; change_from_last_session: number };
    LEAVE: { count: number; percentage: number; change_from_last_session: number };
    LATE: { count: number; percentage: number; change_from_last_session: number };
}

interface AttendanceData {
    [key: string]: "PRESENT" | "ABSENT" | "LATE" | "LEAVE" | "HOLIDAY";
}

interface SubjectAttendance {
    name: string;
    present: number;
    total: number;
    percentage: number;
    color: string;
}

const AttendanceScreen: React.FC = () => {
    const { showAlert } = useContext(AlertContext);
    
    // State management
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [selectedView, setSelectedView] = useState<"monthly" | "weekly" | "daily">("monthly");
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<any>(null);
    
    // API Data State
    const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary | null>(null);
    const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null);
    const [subjectAttendance, setSubjectAttendance] = useState<SubjectAttendance[]>([]);
    
    // Loading States
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [calendarLoading, setCalendarLoading] = useState(false);

    // Fetch attendance summary
    const fetchAttendanceSummary = async () => {
        try {
            setIsLoading(true);
            const summary = await getAttendanceSummary();
            setAttendanceSummary(summary);
        } catch (error: any) {
            showAlert("ERROR", error.response?.data?.message || "Failed to fetch attendance summary");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch attendance details for calendar
    const fetchAttendanceDetails = async (year: number, month: number) => {
        try {
            setCalendarLoading(true);
            const monthStr = String(month + 1).padStart(2, "0");
            const startDate = `${year}-${monthStr}-01`;
            const lastDay = new Date(year, month + 1, 0).getDate();
            const endDate = `${year}-${monthStr}-${String(lastDay).padStart(2, "0")}`;

            const details = await getAttendanceDetails(startDate, endDate);
            setAttendanceData(details);
        } catch (error: any) {
            showAlert("ERROR", error.response?.data?.message || "Failed to fetch attendance details");
            setAttendanceData(null);
        } finally {
            setCalendarLoading(false);
        }
    };


    // Get color for subjects
    const getSubjectColor = (index: number) => {
        const colors = ["#6A5ACD", "#00BCD4", "#2ECC71", "#FFC107", "#E91E63", "#FF5722", "#9C27B0"];
        return colors[index % colors.length];
    };

    // Initial data fetch
    useEffect(() => {
        fetchAttendanceSummary();
      
    }, []);

    // Fetch calendar data when month changes
    useEffect(() => {
        fetchAttendanceDetails(selectedMonth.getFullYear(), selectedMonth.getMonth());
    }, [selectedMonth]);

    // Refresh handler
    const onRefresh = async () => {
        setIsRefreshing(true);
        await Promise.all([
            fetchAttendanceSummary(),
            fetchAttendanceDetails(selectedMonth.getFullYear(), selectedMonth.getMonth()),
        
        ]);
        setIsRefreshing(false);
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PRESENT": return "#2ECC71";
            case "ABSENT": return "#E74C3C";
            case "LATE": return "#F39C12";
            case "LEAVE": return "#9B59B6";
            case "HOLIDAY": return "#95A5A6";
            default: return "#BDC3C7";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "PRESENT": return "check-circle";
            case "ABSENT": return "cancel";
            case "LATE": return "access-time";
            case "LEAVE": return "schedule";
            case "HOLIDAY": return "event";
            default: return "help";
        }
    };

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatDateKey = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const getAttendanceForDate = (date: Date) => {
        const dateKey = formatDateKey(date);
        return attendanceData?.[dateKey] || null;
    };

    const navigateMonth = (direction: number) => {
        const newMonth = new Date(selectedMonth);
        newMonth.setMonth(selectedMonth.getMonth() + direction);
        setSelectedMonth(newMonth);
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(selectedMonth);
        const firstDay = getFirstDayOfMonth(selectedMonth);
        const weeks = [];
        let currentWeek = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            currentWeek.push(
                <View key={`empty-${i}`} className="flex-1 aspect-square items-center justify-center m-0.5" />
            );
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
            const attendance = getAttendanceForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();

            currentWeek.push(
                <TouchableOpacity
                    key={day}
                    className={`flex-1 aspect-square items-center justify-center m-0.5 rounded-lg min-h-[45px] ${
                        isToday ? "border-2 border-[#6A5ACD]" : ""
                    }`}
                    style={{
                        backgroundColor: attendance ? `${getStatusColor(attendance)}20` : "transparent",
                    }}
                    onPress={() => {
                        if (attendance) {
                            setSelectedDate({ date, status: attendance });
                            setShowDetailsModal(true);
                        }
                    }}
                >
                    <Text className={`text-sm font-semibold ${isToday ? "text-[#6A5ACD]" : "text-[#2C3E50]"}`}>
                        {day}
                    </Text>
                    {attendance && (
                        <View className="mt-1">
                            <Icon name={getStatusIcon(attendance)} size={12} color={getStatusColor(attendance)} />
                        </View>
                    )}
                </TouchableOpacity>
            );

            if (currentWeek.length === 7) {
                weeks.push(
                    <View key={`week-${weeks.length}`} className="flex-row">
                        {currentWeek}
                    </View>
                );
                currentWeek = [];
            }
        }

        // Fill the last week if it's not complete
        if (currentWeek.length > 0) {
            while (currentWeek.length < 7) {
                currentWeek.push(
                    <View
                        key={`empty-end-${currentWeek.length}`}
                        className="flex-1 aspect-square items-center justify-center m-0.5"
                    />
                );
            }
            weeks.push(
                <View key={`week-${weeks.length}`} className="flex-row">
                    {currentWeek}
                </View>
            );
        }

        return weeks;
    };

    const getMonthlyStats = () => {
        if (!attendanceData) return { present: 0, absent: 0, late: 0, leave: 0, total: 0, percentage: 0 };

        const monthData = Object.entries(attendanceData).filter(([dateKey]) => {
            const recordDate = new Date(dateKey);
            return (
                recordDate.getMonth() === selectedMonth.getMonth() && 
                recordDate.getFullYear() === selectedMonth.getFullYear()
            );
        });

        const present = monthData.filter(([, status]) => status === "PRESENT").length;
        const absent = monthData.filter(([, status]) => status === "ABSENT").length;
        const late = monthData.filter(([, status]) => status === "LATE").length;
        const leave = monthData.filter(([, status]) => status === "LEAVE").length;
        const total = monthData.filter(([, status]) => status !== "HOLIDAY").length;

        return { present, absent, late, leave, total, percentage: total > 0 ? (present / total) * 100 : 0 };
    };

    const monthlyStats = getMonthlyStats();

    if (isLoading) {
        return (
            <View className="flex-1 bg-[#F0F4F8] items-center justify-center">
                <ActivityIndicator size="large" color="#6A5ACD" />
                <Text className="text-[#2C3E50] mt-4">Loading attendance data...</Text>
            </View>
        );
    }

    return (
        <ScrollView 
            className="flex-1 bg-[#F0F4F8]" 
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={["#6A5ACD"]} />
            }
        >
            {/* Header */}
            <View className="flex-row items-center justify-between bg-[#6A5ACD] py-12 px-4 rounded-b-[25px]">
                <Link href="/student" asChild>
                    <TouchableOpacity className="p-2">
                        <Icon name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                </Link>
                <View className="flex-1 items-center">
                    <Text className="text-xl font-bold text-white">Attendance </Text>
                </View>
                <TouchableOpacity className="p-2" onPress={onRefresh}>
                    <Icon name="refresh" size={20} color="white" />
                </TouchableOpacity>
            </View>

            {/* Overall Stats Cards */}
            <View className="px-4 -mt-8 mb-5">
                <View className="flex-row justify-between mb-4">
                    <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
                        <View className="w-12 h-12 bg-[#2ECC7120] rounded-full items-center justify-center mb-2">
                            <Icon name="check-circle" size={24} color="#2ECC71" />
                        </View>
                        <Text className="text-2xl font-extrabold text-[#2C3E50]">
                            {attendanceSummary?.PRESENT.percentage.toFixed(1) || 0}%
                        </Text>
                        <Text className="text-xs text-[#7F8C8D] text-center">Overall Attendance</Text>
                    </View>
                    <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
                        <View className="w-12 h-12 bg-[#F39C1220] rounded-full items-center justify-center mb-2">
                            <Icon name="local-fire-department" size={24} color="#F39C12" />
                        </View>
                        <Text className="text-2xl font-extrabold text-[#2C3E50]">
                            {attendanceSummary?.PRESENT.count || 0}
                        </Text>
                        <Text className="text-xs text-[#7F8C8D] text-center">Present Days</Text>
                    </View>
                    <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
                        <View className="w-12 h-12 bg-[#E74C3C20] rounded-full items-center justify-center mb-2">
                            <Icon name="event-busy" size={24} color="#E74C3C" />
                        </View>
                        <Text className="text-2xl font-extrabold text-[#2C3E50]">
                            {attendanceSummary?.ABSENT.count || 0}
                        </Text>
                        <Text className="text-xs text-[#7F8C8D] text-center">Days Absent</Text>
                    </View>
                </View>

                {/* Additional Stats */}
                <View className="flex-row justify-between">
                    <View className="bg-white rounded-2xl p-3 items-center flex-1 mx-1 shadow-lg elevation-5">
                        <Icon name="access-time" size={20} color="#F39C12" />
                        <Text className="text-lg font-bold text-[#2C3E50] mt-1">
                            {attendanceSummary?.LATE.count || 0}
                        </Text>
                        <Text className="text-[10px] text-[#7F8C8D] text-center">Late Arrivals</Text>
                    </View>
                    <View className="bg-white rounded-2xl p-3 items-center flex-1 mx-1 shadow-lg elevation-5">
                        <Icon name="exit-to-app" size={20} color="#9B59B6" />
                        <Text className="text-lg font-bold text-[#2C3E50] mt-1">
                            {attendanceSummary?.LEAVE.count || 0}
                        </Text>
                        <Text className="text-[10px] text-[#7F8C8D] text-center">Leave Days</Text>
                    </View>
                    <View className="bg-white rounded-2xl p-3 items-center flex-1 mx-1 shadow-lg elevation-5">
                        <Icon name="school" size={20} color="#6A5ACD" />
                        <Text className="text-lg font-bold text-[#2C3E50] mt-1">
                            {attendanceSummary?.total_days || 0}
                        </Text>
                        <Text className="text-[10px] text-[#7F8C8D] text-center">Total Days</Text>
                    </View>
                </View>
            </View>

            {/* View Toggle */}
            <View className="px-4 mb-5">
                <View className="flex-row bg-white rounded-2xl p-1 shadow-lg elevation-5">
                    {["monthly", "weekly", "daily"].map((view) => (
                        <TouchableOpacity
                            key={view}
                            className={`flex-1 py-3 items-center rounded-xl ${
                                selectedView === view ? "bg-[#6A5ACD]" : "bg-transparent"
                            }`}
                            onPress={() => setSelectedView(view as any)}
                        >
                            <Text className={`text-sm font-semibold ${
                                selectedView === view ? "text-white" : "text-[#7F8C8D]"
                            }`}>
                                {view.charAt(0).toUpperCase() + view.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Monthly Calendar View */}
            {selectedView === "monthly" && (
                <View className="px-4 mb-5">
                    <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
                        {/* Calendar Header */}
                        <View className="flex-row items-center justify-between mb-4">
                            <TouchableOpacity onPress={() => navigateMonth(-1)} className="p-2">
                                <Icon name="chevron-left" size={24} color="#6A5ACD" />
                            </TouchableOpacity>
                            <Text className="text-lg font-bold text-[#2C3E50]">
                                {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
                            </Text>
                            <TouchableOpacity onPress={() => navigateMonth(1)} className="p-2">
                                <Icon name="chevron-right" size={24} color="#6A5ACD" />
                            </TouchableOpacity>
                        </View>

                        {/* Month Stats */}
                        <View className="bg-[#F8F9FA] rounded-xl p-3 mb-4">
                            <View className="flex-row justify-between items-center">
                                <View className="items-center">
                                    <Text className="text-lg font-bold text-[#2ECC71]">{monthlyStats.present}</Text>
                                    <Text className="text-xs text-[#7F8C8D]">Present</Text>
                                </View>
                                <View className="items-center">
                                    <Text className="text-lg font-bold text-[#E74C3C]">{monthlyStats.absent}</Text>
                                    <Text className="text-xs text-[#7F8C8D]">Absent</Text>
                                </View>
                                <View className="items-center">
                                    <Text className="text-lg font-bold text-[#F39C12]">{monthlyStats.late}</Text>
                                    <Text className="text-xs text-[#7F8C8D]">Late</Text>
                                </View>
                                <View className="items-center">
                                    <Text className="text-lg font-bold text-[#6A5ACD]">
                                        {monthlyStats.percentage.toFixed(1)}%
                                    </Text>
                                    <Text className="text-xs text-[#7F8C8D]">Rate</Text>
                                </View>
                            </View>
                        </View>

                        {/* Day Headers */}
                        <View className="flex-row mb-2">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <View key={day} className="flex-1 items-center py-2">
                                    <Text className="text-xs font-semibold text-[#7F8C8D]">{day}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Calendar Grid */}
                        {calendarLoading ? (
                            <View className="items-center py-8">
                                <ActivityIndicator size="small" color="#6A5ACD" />
                                <Text className="text-[#7F8C8D] mt-2">Loading calendar...</Text>
                            </View>
                        ) : (
                            <View>{renderCalendarDays()}</View>
                        )}

                        {/* Legend */}
                        <View className="mt-4 pt-4 border-t border-[#EAECEE]">
                            <Text className="text-sm font-semibold text-[#2C3E50] mb-3">Legend</Text>
                            <View className="flex-row flex-wrap">
                                {[
                                    { status: "PRESENT", label: "Present" },
                                    { status: "ABSENT", label: "Absent" },
                                    { status: "LATE", label: "Late" },
                                    { status: "LEAVE", label: "Leave" },
                                    { status: "HOLIDAY", label: "Holiday" },
                                ].map((item) => (
                                    <View key={item.status} className="flex-row items-center mr-4 mb-2">
                                        <Icon name={getStatusIcon(item.status)} size={16} color={getStatusColor(item.status)} />
                                        <Text className="text-xs text-[#7F8C8D] ml-1">{item.label}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>
            )}

            {/* Subject-wise Attendance */}
            {subjectAttendance.length > 0 && (
                <View className="px-4 mb-5">
                    <Text className="text-xl font-bold text-[#2C3E50] mb-4">Subject-wise Attendance</Text>
                    <View className="gap-3">
                        {subjectAttendance.map((subject, index) => (
                            <View key={index} className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
                                <View className="flex-row items-center justify-between mb-3">
                                    <View className="flex-row items-center">
                                        <View className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: subject.color }} />
                                        <Text className="text-base font-bold text-[#2C3E50]">{subject.name}</Text>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-lg font-bold text-[#6A5ACD]">
                                            {subject.percentage.toFixed(1)}%
                                        </Text>
                                        <Text className="text-xs text-[#7F8C8D]">
                                            {subject.present}/{subject.total}
                                        </Text>
                                    </View>
                                </View>

                                {/* Progress Bar */}
                                <View className="h-2 bg-[#EAECEE] rounded-full overflow-hidden mb-2">
                                    <View
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${subject.percentage}%`,
                                            backgroundColor: subject.color,
                                        }}
                                    />
                                </View>

                                {/* Subject Stats */}
                                <View className="flex-row justify-between">
                                    <Text className="text-xs text-[#2ECC71]">Present: {subject.present}</Text>
                                    <Text className="text-xs text-[#E74C3C]">Absent: {subject.total - subject.present}</Text>
                                    <Text className="text-xs text-[#7F8C8D]">Total: {subject.total}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Attendance Details Modal */}
            <Modal
                visible={showDetailsModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowDetailsModal(false)}
            >
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-[25px] p-5 max-h-[80%]">
                        <View className="flex-row justify-between items-center mb-5">
                            <Text className="text-xl font-bold text-[#2C3E50]">Attendance Details</Text>
                            <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                                <Icon name="close" size={24} color="#2C3E50" />
                            </TouchableOpacity>
                        </View>

                        {selectedDate && (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {/* Date Header */}
                                <View className="items-center mb-6">
                                    <View
                                        className="w-16 h-16 rounded-full items-center justify-center mb-3"
                                        style={{ backgroundColor: `${getStatusColor(selectedDate.status)}20` }}
                                    >
                                        <Icon
                                            name={getStatusIcon(selectedDate.status)}
                                            size={32}
                                            color={getStatusColor(selectedDate.status)}
                                        />
                                    </View>
                                    <Text className="text-xl font-bold text-[#2C3E50] mb-1">
                                        {selectedDate.date.toLocaleDateString("en-US", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </Text>
                                    <View
                                        className="px-4 py-2 rounded-xl"
                                        style={{ backgroundColor: `${getStatusColor(selectedDate.status)}20` }}
                                    >
                                        <Text className="text-sm font-bold" style={{ color: getStatusColor(selectedDate.status) }}>
                                            {selectedDate.status}
                                        </Text>
                                    </View>
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

export default AttendanceScreen;