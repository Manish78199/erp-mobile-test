"use client"

import type React from "react"
import { useContext, useEffect, useState } from "react"
import { View, ScrollView, TouchableOpacity, Modal, TextInput, Alert, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Typography } from "@/components/Typography"
// import { PermitPage } from "@/components/management/Authorization/PermitPage"
// import { PermitComponent } from "@/components/management/Authorization/PermitComponent"
import { AlertContext } from "@/context/Alert/context"
import Premium3DIcon from "@/components/Premium3DIcon"

const { width } = Dimensions.get("window")

interface CalendarEvent {
  event_date: string
  title: string
  description: string
  is_holiday: boolean
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

const Calendar: React.FC = () => {
  const { showAlert } = useContext(AlertContext)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentDateEvents, setCurrentDateEvents] = useState<CalendarEvent[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [eventDetails, setEventDetails] = useState({
    title: "",
    description: "",
    is_holiday: false,
  })

  const mockEvents: CalendarEvent[] = [
    {
      event_date: new Date().toISOString().split("T")[0],
      title: "School Assembly",
      description: "Morning assembly for all students",
      is_holiday: false,
    },
    {
      event_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      title: "Independence Day",
      description: "National holiday",
      is_holiday: true,
    },
  ]

  useEffect(() => {
    // Replace with actual API call: const events = await getCallenderEvent(currentYear, currentMonth + 1)
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

  const getEventForDate = (date: Date) => {
    let isHoliday = false
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    const allEvents = events.filter((e) => e.event_date === dateStr)
    allEvents.forEach((e) => {
      if (e.is_holiday) isHoliday = true
    })
    return { events: allEvents, isHoliday }
  }

  const handleDatePress = (date: Date) => {
    setCurrentDate(date)
    const dateEvents = getEventForDate(date)
    setCurrentDateEvents(dateEvents.events)
  }

  const handleCreateEvent = async () => {
    if (!eventDetails.title.trim()) {
      Alert.alert("Error", "Please enter event title")
      return
    }

    setIsCreating(true)
    try {
      const eventDate = new Date(currentDate)
      eventDate.setDate(eventDate.getDate() + 1)
      const data = {
        ...eventDetails,
        event_date: eventDate.toISOString().split("T")[0],
      }

      // Mock success
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
    setEventDetails({ title: "", description: "", is_holiday: false })
  }

  const today = new Date()
  today.setDate(today.getDate() - 1)

  return (
    <>
    {/* <PermitPage module="CALENDER" action="VIEW"> */}
      <ScrollView className="flex-1 bg-[#F0F4F8]" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingHorizontal: 20,
            paddingTop: 32,
            paddingBottom: 24,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}
        >
          <View className="flex-row items-center">
            <Premium3DIcon name="event" size={32} colors={["#667eea", "#764ba2"]} />
            <Typography className="text-2xl font-bold text-white ml-3">Calendar</Typography>
          </View>
        </LinearGradient>

        {/* Calendar Grid */}
        <View className="px-4 mt-6 mb-6 bg-white rounded-2xl p-4" style={{ marginHorizontal: 16 }}>
          {/* Month Navigation */}
          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity onPress={handlePrevMonth} className="bg-[#667eea]/10 px-4 py-2 rounded-lg">
              <Typography className="text-[#667eea] font-semibold">← Prev</Typography>
            </TouchableOpacity>

            <Typography className="text-lg font-bold text-[#2C3E50]">
              {getMonthName(currentMonth)} {currentYear}
            </Typography>

            <TouchableOpacity onPress={handleNextMonth} className="bg-[#667eea]/10 px-4 py-2 rounded-lg">
              <Typography className="text-[#667eea] font-semibold">Next →</Typography>
            </TouchableOpacity>
          </View>

          {/* Day Headers */}
          <View className="flex-row justify-between mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <View key={day} style={{ width: (width - 80) / 7 }}>
                <Typography className="text-xs font-bold text-[#7F8C8D] text-center">{day}</Typography>
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
              const isToday = today.toISOString().split("T")[0] === day.toISOString().split("T")[0]
              const isHoliday = eventsForDate.isHoliday

              return (
                <TouchableOpacity
                  key={day.toISOString()}
                  onPress={() => handleDatePress(day)}
                  className={`border rounded-lg p-2 mb-2 ${
                    isToday
                      ? "border-[#667eea] bg-[#667eea]/5"
                      : isHoliday
                        ? "border-[#10b981] bg-[#10b981]/5"
                        : "border-[#E0E0E0] bg-white"
                  }`}
                  style={{ width: (width - 80) / 7, height: 80 }}
                >
                  <Typography className={`text-sm font-bold ${isToday ? "text-[#667eea]" : "text-[#2C3E50]"}`}>
                    {day.getDate()}
                  </Typography>

                  {eventsForDate.events.slice(0, 1).map((event, idx) => (
                    <Typography
                      key={idx}
                      className="text-xs text-[#667eea] font-semibold mt-1 truncate"
                      numberOfLines={1}
                    >
                      {event.title}
                    </Typography>
                  ))}

                  {eventsForDate.events.length > 1 && (
                    <Typography className="text-xs text-[#7F8C8D] mt-1">
                      +{eventsForDate.events.length - 1} more
                    </Typography>
                  )}
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Events Section */}
        <View className="px-4 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Typography className="text-lg font-bold text-[#2C3E50]">Events on {currentDate.toDateString()}</Typography>

            {/* <PermitComponent module="CALENDER" action="UPDATE"> */}
              <TouchableOpacity onPress={() => setIsModalOpen(true)} className="bg-[#667eea] px-4 py-2 rounded-lg">
                <Typography className="text-white font-semibold text-sm">+ Add</Typography>
              </TouchableOpacity>
            {/* </PermitComponent> */}
          </View>

          {currentDateEvents.length > 0 ? (
            <View>
              {currentDateEvents.map((event, idx) => (
                <View
                  key={idx}
                  className={`bg-white rounded-lg p-4 mb-3 border ${
                    event.is_holiday ? "border-[#10b981] bg-[#10b981]/5" : "border-[#E0E0E0]"
                  }`}
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <Typography className="text-base font-bold text-[#2C3E50] flex-1">{event.title}</Typography>
                    <View className={`px-3 py-1 rounded-full ${event.is_holiday ? "bg-[#10b981]" : "bg-[#667eea]"}`}>
                      <Typography className="text-xs font-semibold text-white">
                        {event.is_holiday ? "Holiday" : "Event"}
                      </Typography>
                    </View>
                  </View>
                  <Typography className="text-sm text-[#7F8C8D]">{event.description}</Typography>
                </View>
              ))}
            </View>
          ) : (
            <View className="items-center py-8">
              <Premium3DIcon name="event" size={48} colors={["#667eea", "#764ba2"]} />
              <Typography className="text-[#7F8C8D] mt-4">No events scheduled</Typography>
            </View>
          )}
        </View>

        <View className="h-8" />
      </ScrollView>

      {/* Add Event Modal */}
      <Modal visible={isModalOpen} transparent animationType="slide" onRequestClose={handleCloseModal}>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 pb-12">
            <Typography className="text-xl font-bold text-[#2C3E50] mb-6">
              Add Event for {currentDate.toLocaleDateString()}
            </Typography>

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
                className="flex-1 bg-[#667eea] py-3 rounded-lg"
              >
                <Typography className="text-center font-semibold text-white">
                  {isCreating ? "Adding..." : "Add Event"}
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    {/*  </PermitPage> */}
    </>
  )
}

export default Calendar
