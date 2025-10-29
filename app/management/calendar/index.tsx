
// import type React from "react"
// import { useContext, useEffect, useState } from "react"
// import { View, ScrollView, TouchableOpacity, Modal, TextInput, Alert, Dimensions } from "react-native"
// import { LinearGradient } from "expo-linear-gradient"
// import { Typography } from "@/components/Typography"
// // import { PermitPage } from "@/components/management/Authorization/PermitPage"
// // import { PermitComponent } from "@/components/management/Authorization/PermitComponent"
// import { AlertContext } from "@/context/Alert/context"
// import Premium3DIcon from "@/components/Premium3DIcon"
// import { SafeAreaView } from "react-native-safe-area-context"
// import { useRouter } from "expo-router"

// const { width } = Dimensions.get("window")

// interface CalendarEvent {
//   event_date: string
//   title: string
//   description: string
//   is_holiday: boolean
// }

// const getDaysInMonth = (year: number, month: number) => {
//   const date = new Date(year, month, 1)
//   const days = []
//   while (date.getMonth() === month) {
//     days.push(new Date(date))
//     date.setDate(date.getDate() + 1)
//   }
//   return days
// }

// const getMonthName = (monthIndex: number) =>
//   [
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
//   ][monthIndex]

// const Calendar: React.FC = () => {
//   const { showAlert } = useContext(AlertContext)
//   const [events, setEvents] = useState<CalendarEvent[]>([])
//   const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
//   const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
//   const [currentDate, setCurrentDate] = useState(new Date())
//   const [currentDateEvents, setCurrentDateEvents] = useState<CalendarEvent[]>([])
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [isCreating, setIsCreating] = useState(false)
//   const [eventDetails, setEventDetails] = useState({
//     title: "",
//     description: "",
//     is_holiday: false,
//   })

//   const router = useRouter()

//   const mockEvents: CalendarEvent[] = [
//     {
//       event_date: new Date().toISOString().split("T")[0],
//       title: "School Assembly",
//       description: "Morning assembly for all students",
//       is_holiday: false,
//     },
//     {
//       event_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
//       title: "Independence Day",
//       description: "National holiday",
//       is_holiday: true,
//     },
//   ]

//   useEffect(() => {
//     // Replace with actual API call: const events = await getCallenderEvent(currentYear, currentMonth + 1)
//     setEvents(mockEvents)
//   }, [currentMonth, currentYear])

//   const days = getDaysInMonth(currentYear, currentMonth)
//   const firstDay = new Date(currentYear, currentMonth, 1).getDay()

//   const handlePrevMonth = () => {
//     const newDate = new Date(currentYear, currentMonth - 1)
//     setCurrentMonth(newDate.getMonth())
//     setCurrentYear(newDate.getFullYear())
//   }

//   const handleNextMonth = () => {
//     const newDate = new Date(currentYear, currentMonth + 1)
//     setCurrentMonth(newDate.getMonth())
//     setCurrentYear(newDate.getFullYear())
//   }

//   const getEventForDate = (date: Date) => {
//     let isHoliday = false
//     const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
//     const allEvents = events.filter((e) => e.event_date === dateStr)
//     allEvents.forEach((e) => {
//       if (e.is_holiday) isHoliday = true
//     })
//     return { events: allEvents, isHoliday }
//   }

//   const handleDatePress = (date: Date) => {
//     setCurrentDate(date)
//     const dateEvents = getEventForDate(date)
//     setCurrentDateEvents(dateEvents.events)
//   }

//   const handleCreateEvent = async () => {
//     if (!eventDetails.title.trim()) {
//       Alert.alert("Error", "Please enter event title")
//       return
//     }

//     setIsCreating(true)
//     try {
//       const eventDate = new Date(currentDate)
//       eventDate.setDate(eventDate.getDate() + 1)
//       const data = {
//         ...eventDetails,
//         event_date: eventDate.toISOString().split("T")[0],
//       }

//       // Mock success
//       setEvents([...events, data as CalendarEvent])
//       showAlert("SUCCESS", "Event Added Successfully")
//       handleCloseModal()
//     } catch (error: any) {
//       showAlert("ERROR", error?.message || "Failed to add event")
//     } finally {
//       setIsCreating(false)
//     }
//   }

//   const handleCloseModal = () => {
//     setIsModalOpen(false)
//     setEventDetails({ title: "", description: "", is_holiday: false })
//   }

//   const today = new Date()
//   today.setDate(today.getDate() - 1)

//   return (
//     <SafeAreaView className="flex-1">
//       {/* <PermitPage module="CALENDER" action="VIEW"> */}
//       <View className="flex-row items-center p-4">
//         <TouchableOpacity
//           onPress={() => router.push("/management")}
//           className="flex-row items-center bg-input border border-border rounded-lg px-3 py-2 mr-2"
//         >
//           <Typography className="text-primary font-semibold">← Back</Typography>
//         </TouchableOpacity>

//         <Typography className="text-lg font-bold text-foreground">Calendar</Typography>
//       </View>
//       <ScrollView className="flex-1 bg-[#F0F4F8]" showsVerticalScrollIndicator={false}>
//         {/* Header */}


//         <View className="px-4">
//           <Typography className="text-2xl font-bold text-gray-900 ">Calender</Typography>
//           <Typography className="text-sm mt-1 text-gray-600 ">Manage school's acedmic calendar</Typography>
//         </View>
//         {/* Calendar Grid */}
//         <View className="px-4 mt-6 mb-6 bg-white rounded-2xl p-4" style={{ marginHorizontal: 16 }}>
//           {/* Month Navigation */}
//           <View className="flex-row justify-between items-center mb-6">
//             <TouchableOpacity onPress={handlePrevMonth} className="bg-[#667eea]/10 px-4 py-2 rounded-lg">
//               <Typography className="text-[#667eea] font-semibold">← Prev</Typography>
//             </TouchableOpacity>

//             <Typography className="text-lg font-bold text-[#2C3E50]">
//               {getMonthName(currentMonth)} {currentYear}
//             </Typography>

//             <TouchableOpacity onPress={handleNextMonth} className="bg-[#667eea]/10 px-4 py-2 rounded-lg">
//               <Typography className="text-[#667eea] font-semibold">Next →</Typography>
//             </TouchableOpacity>
//           </View>

//           {/* Day Headers */}
//           <View className="flex-row justify-between mb-2">
//             {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
//               <View key={day} style={{ width: (width - 80) / 7 }}>
//                 <Typography className="text-xs font-bold text-[#7F8C8D] text-center">{day}</Typography>
//               </View>
//             ))}
//           </View>

//           {/* Calendar Days */}
//           <View className="flex-row flex-wrap">
//             {Array.from({ length: firstDay }).map((_, i) => (
//               <View key={`empty-${i}`} style={{ width: (width - 80) / 7, height: 80 }} />
//             ))}

//             {days.map((day) => {
//               const eventsForDate = getEventForDate(day)
//               const isToday = today.toISOString().split("T")[0] === day.toISOString().split("T")[0]
//               const isHoliday = eventsForDate.isHoliday

//               return (
//                 <TouchableOpacity
//                   key={day.toISOString()}
//                   onPress={() => handleDatePress(day)}
//                   className={`border rounded-lg p-2 mb-2 ${isToday
//                     ? "border-[#667eea] bg-[#667eea]/5"
//                     : isHoliday
//                       ? "border-[#10b981] bg-[#10b981]/5"
//                       : "border-[#E0E0E0] bg-white"
//                     }`}
//                   style={{ width: (width - 80) / 7, height: 80 }}
//                 >
//                   <Typography className={`text-sm font-bold ${isToday ? "text-[#667eea]" : "text-[#2C3E50]"}`}>
//                     {day.getDate()}
//                   </Typography>

//                   {eventsForDate.events.slice(0, 1).map((event, idx) => (
//                     <Typography
//                       key={idx}
//                       className="text-xs text-[#667eea] font-semibold mt-1 truncate"
//                       numberOfLines={1}
//                     >
//                       {event.title}
//                     </Typography>
//                   ))}

//                   {eventsForDate.events.length > 1 && (
//                     <Typography className="text-xs text-[#7F8C8D] mt-1">
//                       +{eventsForDate.events.length - 1} more
//                     </Typography>
//                   )}
//                 </TouchableOpacity>
//               )
//             })}
//           </View>
//         </View>

//         {/* Events Section */}
//         <View className="px-4 mb-6">
//           <View className="flex-row justify-between items-center mb-4">
//             <Typography className="text-lg font-bold text-[#2C3E50]">Events on {currentDate.toDateString()}</Typography>

//             {/* <PermitComponent module="CALENDER" action="UPDATE"> */}
//             <TouchableOpacity onPress={() => setIsModalOpen(true)} className="bg-[#667eea] px-4 py-2 rounded-lg">
//               <Typography className="text-white font-semibold text-sm">+ Add</Typography>
//             </TouchableOpacity>
//             {/* </PermitComponent> */}
//           </View>

//           {currentDateEvents.length > 0 ? (
//             <View>
//               {currentDateEvents.map((event, idx) => (
//                 <View
//                   key={idx}
//                   className={`bg-white rounded-lg p-4 mb-3 border ${event.is_holiday ? "border-[#10b981] bg-[#10b981]/5" : "border-[#E0E0E0]"
//                     }`}
//                 >
//                   <View className="flex-row justify-between items-start mb-2">
//                     <Typography className="text-base font-bold text-[#2C3E50] flex-1">{event.title}</Typography>
//                     <View className={`px-3 py-1 rounded-full ${event.is_holiday ? "bg-[#10b981]" : "bg-[#667eea]"}`}>
//                       <Typography className="text-xs font-semibold text-white">
//                         {event.is_holiday ? "Holiday" : "Event"}
//                       </Typography>
//                     </View>
//                   </View>
//                   <Typography className="text-sm text-[#7F8C8D]">{event.description}</Typography>
//                 </View>
//               ))}
//             </View>
//           ) : (
//             <View className="items-center py-8">
//               <Premium3DIcon name="event" size={48} colors={["#667eea", "#764ba2"]} />
//               <Typography className="text-[#7F8C8D] mt-4">No events scheduled</Typography>
//             </View>
//           )}
//         </View>

//         <View className="h-8" />
//       </ScrollView>

//       {/* Add Event Modal */}
//       <Modal visible={isModalOpen} transparent animationType="slide" onRequestClose={handleCloseModal}>
//         <View className="flex-1 bg-black/50 justify-end">
//           <View className="bg-white rounded-t-3xl p-6 pb-12">
//             <Typography className="text-xl font-bold text-[#2C3E50] mb-6">
//               Add Event for {currentDate.toLocaleDateString()}
//             </Typography>

//             {/* Title Input */}
//             <View className="mb-4">
//               <Typography className="text-sm font-semibold text-[#2C3E50] mb-2">Event Title</Typography>
//               <TextInput
//                 placeholder="Enter event title"
//                 value={eventDetails.title}
//                 onChangeText={(text) => setEventDetails((prev) => ({ ...prev, title: text }))}
//                 className="border border-[#E0E0E0] rounded-lg px-4 py-3 text-[#2C3E50]"
//                 placeholderTextColor="#7F8C8D"
//               />
//             </View>

//             {/* Description Input */}
//             <View className="mb-4">
//               <Typography className="text-sm font-semibold text-[#2C3E50] mb-2">Description</Typography>
//               <TextInput
//                 placeholder="Enter event description"
//                 value={eventDetails.description}
//                 onChangeText={(text) => setEventDetails((prev) => ({ ...prev, description: text }))}
//                 multiline
//                 numberOfLines={4}
//                 className="border border-[#E0E0E0] rounded-lg px-4 py-3 text-[#2C3E50]"
//                 placeholderTextColor="#7F8C8D"
//               />
//             </View>

//             {/* Holiday Toggle */}
//             <View className="mb-6">
//               <Typography className="text-sm font-semibold text-[#2C3E50] mb-3">Is this a holiday?</Typography>
//               <View className="flex-row gap-4">
//                 <TouchableOpacity
//                   onPress={() => setEventDetails((prev) => ({ ...prev, is_holiday: true }))}
//                   className={`flex-1 py-3 rounded-lg border-2 ${eventDetails.is_holiday ? "border-[#10b981] bg-[#10b981]/10" : "border-[#E0E0E0]"
//                     }`}
//                 >
//                   <Typography
//                     className={`text-center font-semibold ${eventDetails.is_holiday ? "text-[#10b981]" : "text-[#7F8C8D]"
//                       }`}
//                   >
//                     Yes
//                   </Typography>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   onPress={() => setEventDetails((prev) => ({ ...prev, is_holiday: false }))}
//                   className={`flex-1 py-3 rounded-lg border-2 ${!eventDetails.is_holiday ? "border-[#667eea] bg-[#667eea]/10" : "border-[#E0E0E0]"
//                     }`}
//                 >
//                   <Typography
//                     className={`text-center font-semibold ${!eventDetails.is_holiday ? "text-[#667eea]" : "text-[#7F8C8D]"
//                       }`}
//                   >
//                     No
//                   </Typography>
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* Action Buttons */}
//             <View className="flex-row gap-3">
//               <TouchableOpacity onPress={handleCloseModal} className="flex-1 bg-[#E0E0E0] py-3 rounded-lg">
//                 <Typography className="text-center font-semibold text-[#2C3E50]">Cancel</Typography>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={handleCreateEvent}
//                 disabled={isCreating}
//                 className="flex-1 bg-[#667eea] py-3 rounded-lg"
//               >
//                 <Typography className="text-center font-semibold text-white">
//                   {isCreating ? "Adding..." : "Add Event"}
//                 </Typography>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//       {/*  </PermitPage> */}
//     </SafeAreaView>
//   )
// }

// export default Calendar


"use client"

import type React from "react"
import { useContext, useEffect, useState } from "react"
import { View, ScrollView, TouchableOpacity, Modal, TextInput, Alert, Dimensions, RefreshControl } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Typography } from "@/components/Typography"
import { AlertContext } from "@/context/Alert/context"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import Icon from "react-native-vector-icons/MaterialIcons"

const { width } = Dimensions.get("window")

interface CalendarEvent {
  _id?: string
  event_date: string
  title: string
  description: string
  is_holiday: boolean
  event_type?: string
  location?: string
  time?: string
}

const getDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1)
  const days = []
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

const getMonthName = (monthIndex: number) =>
  [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][monthIndex]

const CalendarStudent: React.FC = () => {
  const { showAlert } = useContext(AlertContext)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentDateEvents, setCurrentDateEvents] = useState<CalendarEvent[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [refreshing, setRefreshing] = useState(false)
  const [eventDetails, setEventDetails] = useState({
    title: "",
    description: "",
    is_holiday: false,
    event_type: "academic",
  })

  const router = useRouter()

  const eventTypes = [
    { id: "all", label: "All Events", color: "#6A5ACD" },
    { id: "holiday", label: "Holidays", color: "#E74C3C" },
    { id: "academic", label: "Academic", color: "#6A5ACD" },
    { id: "sports", label: "Sports", color: "#2ECC71" },
    { id: "cultural", label: "Cultural", color: "#F39C12" },
    { id: "meeting", label: "Meetings", color: "#00BCD4" },
    { id: "exam", label: "Exams", color: "#9C27B0" },
  ]

  const mockEvents: CalendarEvent[] = [
    {
      event_date: new Date().toISOString().split("T")[0],
      title: "School Assembly",
      description: "Morning assembly for all students",
      is_holiday: false,
      event_type: "academic",
    },
    {
      event_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      title: "Independence Day",
      description: "National holiday",
      is_holiday: true,
      event_type: "holiday",
    },
  ]

  useEffect(() => {
    setEvents(mockEvents)
  }, [currentMonth, currentYear])

  const days = getDaysInMonth(currentYear, currentMonth)
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()

  const handlePrevMonth = () => {
    const newDate = new Date(currentYear, currentMonth - 1)
    setCurrentMonth(newDate.getMonth())
    setCurrentYear(newDate.getFullYear())
  }

  const handleNextMonth = () => {
    const newDate = new Date(currentYear, currentMonth + 1)
    setCurrentMonth(newDate.getMonth())
    setCurrentYear(newDate.getFullYear())
  }

  const formatDateKey = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const getEventForDate = (date: Date) => {
    let isHoliday = false
    const dateStr = formatDateKey(date)
    const allEvents = events.filter((e) => e.event_date === dateStr)
    allEvents.forEach((e) => {
      if (e.is_holiday) isHoliday = true
    })
    return { events: allEvents, isHoliday }
  }

  const getFilteredEventsForDate = (date: Date) => {
    const dateStr = formatDateKey(date)
    return events.filter((event) => {
      const matchesDate = event.event_date === dateStr
      const matchesFilter =
        selectedFilter === "all" ||
        (event.is_holiday && selectedFilter === "holiday") ||
        event.event_type === selectedFilter
      return matchesDate && matchesFilter
    })
  }

  const handleDatePress = (date: Date) => {
    setCurrentDate(date)
    const dateEvents = getFilteredEventsForDate(date)
    setCurrentDateEvents(dateEvents)
  }

  const handleCreateEvent = async () => {
    if (!eventDetails.title.trim()) {
      Alert.alert("Error", "Please enter event title")
      return
    }

    setIsCreating(true)
    try {
      const eventDate = new Date(currentDate)
      const data = {
        ...eventDetails,
        event_date: eventDate.toISOString().split("T")[0],
      }

      setEvents([...events, data as CalendarEvent])
      showAlert("SUCCESS", "Event Added Successfully")
      handleCloseModal()
    } catch (error: any) {
      showAlert("ERROR", error?.message || "Failed to add event")
    } finally {
      setIsCreating(false)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEventDetails({ title: "", description: "", is_holiday: false, event_type: "academic" })
  }

  const onRefresh = async () => {
    setRefreshing(true)
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 500))
    setRefreshing(false)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelectedDate = (date: Date) => {
    return date.toDateString() === currentDate.toDateString()
  }

  const getEventColor = (event: CalendarEvent) => {
    if (event.is_holiday) return "#E74C3C"
    const typeColor = eventTypes.find((type) => type.id === event.event_type)?.color
    return typeColor || "#6A5ACD"
  }

  const getCalendarStats = () => {
    const totalEvents = events.length
    const holidays = events.filter((e) => e.is_holiday).length
    const regularEvents = totalEvents - holidays
    const todayEvents = getEventForDate(new Date()).events.length

    return { totalEvents, holidays, regularEvents, todayEvents }
  }

  const stats = getCalendarStats()

  const upcomingEvents = events
    .filter((event) => {
      const eventDate = new Date(event.event_date)
      const today = new Date()
      const matchesFilter =
        selectedFilter === "all" ||
        (event.is_holiday && selectedFilter === "holiday") ||
        event.event_type === selectedFilter
      return eventDate >= today && matchesFilter
    })
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
    .slice(0, 5)

  return (
    <SafeAreaView className="flex-1 bg-[#F0F4F8]">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <LinearGradient colors={["#6A5ACD", "#7B68EE"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View className="flex-row items-center justify-between py-12 px-4">
            <TouchableOpacity onPress={() => router.push("/management")} className="p-2">
              <Icon name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View className="flex-1 items-center">
              <Typography className="text-xl font-bold text-white">Calendar</Typography>
            </View>
            <TouchableOpacity onPress={onRefresh} className="p-2">
              <Icon name="refresh" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View className="px-4 -mt-8 mb-5">
          <View className="flex-row justify-between">
            <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
              <View className="w-12 h-12 bg-[#6A5ACD20] rounded-full items-center justify-center mb-2">
                <Icon name="event" size={24} color="#6A5ACD" />
              </View>
              <Typography className="text-2xl font-extrabold text-[#2C3E50]">{stats.totalEvents}</Typography>
              <Typography className="text-xs text-[#7F8C8D] text-center">Total Events</Typography>
            </View>
            <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
              <View className="w-12 h-12 bg-[#E74C3C20] rounded-full items-center justify-center mb-2">
                <Icon name="celebration" size={24} color="#E74C3C" />
              </View>
              <Typography className="text-2xl font-extrabold text-[#2C3E50]">{stats.holidays}</Typography>
              <Typography className="text-xs text-[#7F8C8D] text-center">Holidays</Typography>
            </View>
            <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
              <View className="w-12 h-12 bg-[#2ECC7120] rounded-full items-center justify-center mb-2">
                <Icon name="school" size={24} color="#2ECC71" />
              </View>
              <Typography className="text-2xl font-extrabold text-[#2C3E50]">{stats.regularEvents}</Typography>
              <Typography className="text-xs text-[#7F8C8D] text-center">Academic</Typography>
            </View>
            <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
              <View className="w-12 h-12 bg-[#F39C1220] rounded-full items-center justify-center mb-2">
                <Icon name="today" size={24} color="#F39C12" />
              </View>
              <Typography className="text-2xl font-extrabold text-[#2C3E50]">{stats.todayEvents}</Typography>
              <Typography className="text-xs text-[#7F8C8D] text-center">Today</Typography>
            </View>
          </View>
        </View>

        <View className="px-4 mb-5">
          <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
            <View className="flex-row items-center justify-between mb-4">
              <TouchableOpacity onPress={handlePrevMonth} className="p-2">
                <Icon name="chevron-left" size={24} color="#6A5ACD" />
              </TouchableOpacity>
              <Typography className="text-lg font-bold text-[#2C3E50]">
                {getMonthName(currentMonth)} {currentYear}
              </Typography>
              <TouchableOpacity onPress={handleNextMonth} className="p-2">
                <Icon name="chevron-right" size={24} color="#6A5ACD" />
              </TouchableOpacity>
            </View>

            {/* Day Headers */}
            <View className="flex-row mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <View key={day} className="flex-1 items-center py-2">
                  <Typography className="text-xs font-semibold text-[#7F8C8D]">{day}</Typography>
                </View>
              ))}
            </View>

            {/* Calendar Days */}
            <View className="flex-row flex-wrap">
              {Array.from({ length: firstDay }).map((_, i) => (
                <View key={`empty-${i}`} style={{ width: (width - 80) / 7, height: 80 }} />
              ))}

              {days.map((day) => {
                const eventsForDate = getEventForDate(day)
                const allEvents = eventsForDate.events
                const hasEvents = allEvents.length > 0
                const hasHoliday = eventsForDate.isHoliday

                return (
                  <TouchableOpacity
                    key={day.toISOString()}
                    onPress={() => handleDatePress(day)}
                    className={`border rounded-lg p-2 mb-2 items-center justify-center ${
                      isSelectedDate(day)
                        ? "border-[#6A5ACD] bg-[#6A5ACD]"
                        : isToday(day)
                          ? "border-[#6A5ACD] bg-[#6A5ACD20]"
                          : hasHoliday
                            ? "border-[#E74C3C20] bg-[#E74C3C20]"
                            : hasEvents
                              ? "border-[#2ECC7120] bg-[#2ECC7120]"
                              : "border-[#E0E0E0] bg-white"
                    }`}
                    style={{ width: (width - 80) / 7, height: 80 }}
                  >
                    <Typography
                      className={`text-sm font-bold ${
                        isSelectedDate(day) ? "text-white" : isToday(day) ? "text-[#6A5ACD]" : "text-[#2C3E50]"
                      }`}
                    >
                      {day.getDate()}
                    </Typography>

                    {hasEvents && (
                      <View className="flex-row mt-1 flex-wrap justify-center max-w-[90%]">
                        {allEvents.slice(0, 3).map((event, index) => (
                          <View
                            key={`${event._id || event.title}-${index}`}
                            className="w-1.5 h-1.5 rounded-full mx-0.5 mb-0.5"
                            style={{ backgroundColor: getEventColor(event) }}
                          />
                        ))}
                        {allEvents.length > 3 && (
                          <Typography className="text-[8px] text-[#7F8C8D] ml-1 font-bold">
                            +{allEvents.length - 3}
                          </Typography>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        </View>

        <View className="px-4 mb-5">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {eventTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                className={`flex-row items-center px-4 py-2.5 mr-3 rounded-[20px] border ${
                  selectedFilter === type.id ? "border-[#6A5ACD]" : "bg-white border-[#DDE4EB]"
                }`}
                style={selectedFilter === type.id ? { backgroundColor: `${type.color}20` } : {}}
                onPress={() => setSelectedFilter(type.id)}
              >
                <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: type.color }} />
                <Typography
                  className={`text-sm font-semibold ${
                    selectedFilter === type.id ? "text-[#2C3E50]" : "text-[#7F8C8D]"
                  }`}
                >
                  {type.label}
                </Typography>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {currentDateEvents.length > 0 && (
          <View className="px-4 mb-5">
            <View className="flex-row justify-between items-center mb-4">
              <Typography className="text-lg font-bold text-[#2C3E50]">
                Events on {currentDate.toLocaleDateString()}
              </Typography>
              <TouchableOpacity onPress={() => setIsModalOpen(true)} className="bg-[#6A5ACD] px-4 py-2 rounded-lg">
                <Typography className="text-white font-semibold text-sm">+ Add</Typography>
              </TouchableOpacity>
            </View>

            <View className="gap-3">
              {currentDateEvents.map((event, idx) => (
                <View
                  key={idx}
                  className={`bg-white rounded-2xl p-4 shadow-lg elevation-5 border ${
                    event.is_holiday ? "border-[#E74C3C20]" : "border-[#E0E0E0]"
                  }`}
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-row items-center flex-1">
                      <View className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: getEventColor(event) }} />
                      <Typography className="text-base font-bold text-[#2C3E50] flex-1">{event.title}</Typography>
                    </View>
                    <View className="flex-row items-center">
                      {event.is_holiday && (
                        <View className="bg-[#E74C3C20] px-2 py-1 rounded-lg mr-2">
                          <Typography className="text-[10px] font-bold text-[#E74C3C]">HOLIDAY</Typography>
                        </View>
                      )}
                      <View className="px-2 py-1 rounded-lg" style={{ backgroundColor: `${getEventColor(event)}20` }}>
                        <Typography className="text-[10px] font-bold" style={{ color: getEventColor(event) }}>
                          {event.event_type?.toUpperCase() || "EVENT"}
                        </Typography>
                      </View>
                    </View>
                  </View>
                  <Typography className="text-sm text-[#7F8C8D]">{event.description}</Typography>
                  {event.time && (
                    <View className="flex-row items-center mt-2">
                      <Icon name="access-time" size={16} color="#7F8C8D" />
                      <Typography className="text-xs text-[#7F8C8D] ml-1">{event.time}</Typography>
                    </View>
                  )}
                  {event.location && (
                    <View className="flex-row items-center mt-1">
                      <Icon name="location-on" size={16} color="#7F8C8D" />
                      <Typography className="text-xs text-[#7F8C8D] ml-1">{event.location}</Typography>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        <View className="px-4 mb-8">
          <Typography className="text-lg font-bold text-[#2C3E50] mb-4">Upcoming Events</Typography>
          {upcomingEvents.length > 0 ? (
            <View className="gap-3">
              {upcomingEvents.map((event, idx) => (
                <View key={idx} className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center flex-1">
                      <View className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: getEventColor(event) }} />
                      <View className="flex-1">
                        <Typography className="text-base font-bold text-[#2C3E50]">{event.title}</Typography>
                        <Typography className="text-xs text-[#7F8C8D]">
                          {new Date(event.event_date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })}
                        </Typography>
                      </View>
                    </View>
                    <View className="flex-row items-center">
                      {event.is_holiday && (
                        <View className="bg-[#E74C3C20] px-2 py-1 rounded-lg mr-2">
                          <Typography className="text-[10px] font-bold text-[#E74C3C]">HOLIDAY</Typography>
                        </View>
                      )}
                      <View className="px-2 py-1 rounded-lg" style={{ backgroundColor: `${getEventColor(event)}20` }}>
                        <Typography className="text-[10px] font-bold" style={{ color: getEventColor(event) }}>
                          {event.event_type?.toUpperCase() || "EVENT"}
                        </Typography>
                      </View>
                    </View>
                  </View>
                  <Typography className="text-sm text-[#7F8C8D]" numberOfLines={2}>
                    {event.description}
                  </Typography>
                </View>
              ))}
            </View>
          ) : (
            <View className="items-center py-8">
              <Icon name="event" size={48} color="#BDC3C7" />
              <Typography className="text-[#7F8C8D] mt-4">No upcoming events found.</Typography>
            </View>
          )}
        </View>

        <View className="h-8" />
      </ScrollView>

      <Modal visible={isModalOpen} transparent animationType="slide" onRequestClose={handleCloseModal}>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 pb-12">
            <View className="flex-row justify-between items-center mb-6">
              <Typography className="text-xl font-bold text-[#2C3E50]">
                Add Event for {currentDate.toLocaleDateString()}
              </Typography>
              <TouchableOpacity onPress={handleCloseModal}>
                <Icon name="close" size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Title Input */}
              <View className="mb-4">
                <Typography className="text-sm font-semibold text-[#2C3E50] mb-2">Event Title</Typography>
                <TextInput
                  placeholder="Enter event title"
                  value={eventDetails.title}
                  onChangeText={(text) => setEventDetails((prev) => ({ ...prev, title: text }))}
                  className="border border-[#E0E0E0] rounded-lg px-4 py-3 text-[#2C3E50]"
                  placeholderTextColor="#7F8C8D"
                />
              </View>

              {/* Description Input */}
              <View className="mb-4">
                <Typography className="text-sm font-semibold text-[#2C3E50] mb-2">Description</Typography>
                <TextInput
                  placeholder="Enter event description"
                  value={eventDetails.description}
                  onChangeText={(text) => setEventDetails((prev) => ({ ...prev, description: text }))}
                  multiline
                  numberOfLines={4}
                  className="border border-[#E0E0E0] rounded-lg px-4 py-3 text-[#2C3E50]"
                  placeholderTextColor="#7F8C8D"
                />
              </View>

              {/* Event Type Selection */}
              <View className="mb-4">
                <Typography className="text-sm font-semibold text-[#2C3E50] mb-3">Event Type</Typography>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {eventTypes
                    .filter((t) => t.id !== "all")
                    .map((type) => (
                      <TouchableOpacity
                        key={type.id}
                        onPress={() => setEventDetails((prev) => ({ ...prev, event_type: type.id }))}
                        className={`px-4 py-2 rounded-lg mr-2 border ${
                          eventDetails.event_type === type.id
                            ? "border-[#6A5ACD] bg-[#6A5ACD20]"
                            : "border-[#E0E0E0] bg-white"
                        }`}
                      >
                        <Typography
                          className={`text-sm font-semibold ${
                            eventDetails.event_type === type.id ? "text-[#6A5ACD]" : "text-[#7F8C8D]"
                          }`}
                        >
                          {type.label}
                        </Typography>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </View>

              {/* Holiday Toggle */}
              <View className="mb-6">
                <Typography className="text-sm font-semibold text-[#2C3E50] mb-3">Is this a holiday?</Typography>
                <View className="flex-row gap-4">
                  <TouchableOpacity
                    onPress={() => setEventDetails((prev) => ({ ...prev, is_holiday: true }))}
                    className={`flex-1 py-3 rounded-lg border-2 ${
                      eventDetails.is_holiday ? "border-[#10b981] bg-[#10b981]/10" : "border-[#E0E0E0]"
                    }`}
                  >
                    <Typography
                      className={`text-center font-semibold ${
                        eventDetails.is_holiday ? "text-[#10b981]" : "text-[#7F8C8D]"
                      }`}
                    >
                      Yes
                    </Typography>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setEventDetails((prev) => ({ ...prev, is_holiday: false }))}
                    className={`flex-1 py-3 rounded-lg border-2 ${
                      !eventDetails.is_holiday ? "border-[#667eea] bg-[#667eea]/10" : "border-[#E0E0E0]"
                    }`}
                  >
                    <Typography
                      className={`text-center font-semibold ${
                        !eventDetails.is_holiday ? "text-[#667eea]" : "text-[#7F8C8D]"
                      }`}
                    >
                      No
                    </Typography>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-3">
                <TouchableOpacity onPress={handleCloseModal} className="flex-1 bg-[#E0E0E0] py-3 rounded-lg">
                  <Typography className="text-center font-semibold text-[#2C3E50]">Cancel</Typography>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleCreateEvent}
                  disabled={isCreating}
                  className="flex-1 bg-[#6A5ACD] py-3 rounded-lg"
                >
                  <Typography className="text-center font-semibold text-white">
                    {isCreating ? "Adding..." : "Add Event"}
                  </Typography>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default CalendarStudent
