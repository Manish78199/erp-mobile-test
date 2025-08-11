import type React from "react"
import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"

interface EventsScreenProps {
  navigation: any
}

const EventsScreen: React.FC<EventsScreenProps> = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState("all")

  const eventsData = [
    {
      id: 1,
      title: "Annual Sports Day",
      description: "Inter-house sports competition with various athletic events",
      date: "2024-12-20",
      time: "09:00 AM",
      location: "School Ground",
      type: "sports",
      status: "upcoming",
      participants: 250,
    },
    {
      id: 2,
      title: "Science Exhibition",
      description: "Students showcase their innovative science projects",
      date: "2024-12-18",
      time: "10:00 AM",
      location: "Science Lab",
      type: "academic",
      status: "upcoming",
      participants: 120,
    },
    {
      id: 3,
      title: "Cultural Fest",
      description: "Annual cultural program featuring dance, music and drama",
      date: "2024-12-15",
      time: "06:00 PM",
      location: "Auditorium",
      type: "cultural",
      status: "completed",
      participants: 300,
    },
    {
      id: 4,
      title: "Parent-Teacher Meeting",
      description: "Discussion about student progress and development",
      date: "2024-12-22",
      time: "02:00 PM",
      location: "Classrooms",
      type: "meeting",
      status: "upcoming",
      participants: 180,
    },
  ]

  const getTypeColor = (type: string) => {
    const colorMap: { [key: string]: string } = {
      sports: "#2ECC71",
      academic: "#6A5ACD",
      cultural: "#F39C12",
      meeting: "#00BCD4",
    }
    return colorMap[type] || "#BDC3C7"
  }

  const getTypeIcon = (type: string) => {
    const iconMap: { [key: string]: string } = {
      sports: "sports-soccer",
      academic: "school",
      cultural: "theater-comedy",
      meeting: "people",
    }
    return iconMap[type] || "event"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const filteredEvents = eventsData.filter((event) => {
    if (selectedFilter === "all") return true
    return event.type === selectedFilter
  })

  return (
    <ScrollView className="flex-1 bg-[#F0F4F8]" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="flex-row items-center justify-between bg-[#6A5ACD] pt-12 pb-5 px-4 rounded-b-[25px]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white">Events & Activities</Text>
        <TouchableOpacity className="p-2">
          <Icon name="calendar-today" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View className="flex-row justify-between px-4 -mt-8 mb-5">
        <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
          <Icon name="event" size={28} color="#6A5ACD" />
          <Text className="text-2xl font-extrabold text-[#2C3E50] mt-2">
            {eventsData.filter(e => e.status === "upcoming").length}
          </Text>
          <Text className="text-xs text-[#7F8C8D] mt-1">Upcoming</Text>
        </View>
        <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
          <Icon name="people" size={28} color="#2ECC71" />
          <Text className="text-2xl font-extrabold text-[#2C3E50] mt-2">
            {eventsData.reduce((sum, e) => sum + e.participants, 0)}
          </Text>
          <Text className="text-xs text-[#7F8C8D] mt-1">Participants</Text>
        </View>
        <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
          <Icon name="check-circle" size={28} color="#F39C12" />
          <Text className="text-2xl font-extrabold text-[#2C3E50] mt-2">
            {eventsData.filter(e => e.status === "completed").length}
          </Text>
          <Text className="text-xs text-[#7F8C8D] mt-1">Completed</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="px-4 mb-5">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {["all", "sports", "academic", "cultural", "meeting"].map((filter) => (
            <TouchableOpacity
              key={filter}
              className={`px-5 py-2.5 mr-3 rounded-[20px] border ${
                selectedFilter === filter ? "bg-[#6A5ACD] border-[#6A5ACD]" : "bg-white border-[#DDE4EB]"
              }`}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text className={`text-sm font-semibold ${selectedFilter === filter ? "text-white" : "text-[#7F8C8D]"}`}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Events List */}
      <View className="p-4">
        <Text className="text-xl font-bold text-[#2C3E50] mb-4">School Events</Text>
        <View className="gap-4">
          {filteredEvents.map((event) => (
            <View key={event.id} className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center">
                  <View
                    className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                    style={{ backgroundColor: `${getTypeColor(event.type)}20` }}
                  >
                    <Icon name={getTypeIcon(event.type)} size={20} color={getTypeColor(event.type)} />
                  </View>
                  <View>
                    <Text className="text-base font-bold text-[#2C3E50]">{event.title}</Text>
                    <Text className="text-xs text-[#7F8C8D] capitalize">{event.type}</Text>
                  </View>
                </View>
                <View
                  className="px-2 py-1 rounded-xl"
                  style={{ backgroundColor: event.status === "upcoming" ? "#F39C1220" : "#2ECC7120" }}
                >
                  <Text
                    className="text-[10px] font-bold"
                    style={{ color: event.status === "upcoming" ? "#F39C12" : "#2ECC71" }}
                  >
                    {event.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text className="text-sm text-[#7F8C8D] leading-5 mb-3">{event.description}</Text>

              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center">
                  <Icon name="event" size={16} color="#7F8C8D" />
                  <Text className="text-xs text-[#7F8C8D] ml-1">{formatDate(event.date)}</Text>
                </View>
                <View className="flex-row items-center">
                  <Icon name="access-time" size={16} color="#7F8C8D" />
                  <Text className="text-xs text-[#7F8C8D] ml-1">{event.time}</Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Icon name="location-on" size={16} color="#6A5ACD" />
                  <Text className="text-xs text-[#6A5ACD] ml-1">{event.location}</Text>
                </View>
                <View className="flex-row items-center">
                  <Icon name="people" size={16} color="#2ECC71" />
                  <Text className="text-xs text-[#2ECC71] ml-1">{event.participants} participants</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

export default EventsScreen
