import type React from "react"
import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"

interface HostelScreenProps {
  navigation: any
}

const HostelScreen: React.FC<HostelScreenProps> = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState("room")

  const hostelData = {
    room: {
      number: "A-204",
      block: "Block A",
      floor: "2nd Floor",
      type: "Double Sharing",
      warden: "Mrs. Priya Sharma",
      wardenContact: "+91 98765 43210",
    },
    roommates: [
      {
        id: 1,
        name: "Arjun Patel",
        class: "Class 12-A",
        contact: "+91 87654 32109",
        hometown: "Mumbai",
      },
    ],
    facilities: [
      { name: "Wi-Fi", available: true, icon: "wifi" },
      { name: "AC", available: true, icon: "ac-unit" },
      { name: "Study Table", available: true, icon: "desk" },
      { name: "Wardrobe", available: true, icon: "checkroom" },
      { name: "Attached Bathroom", available: true, icon: "bathroom" },
      { name: "Balcony", available: false, icon: "balcony" },
    ],
    rules: [
      "Lights out by 10:30 PM on weekdays",
      "No visitors after 8:00 PM",
      "Keep room clean and tidy",
      "No loud music or noise",
      "Report any maintenance issues immediately",
      "Respect roommate's privacy and belongings",
    ],
    maintenance: [
      {
        id: 1,
        issue: "AC not cooling properly",
        status: "pending",
        reportedDate: "2024-12-10",
        priority: "medium",
      },
      {
        id: 2,
        issue: "Bathroom tap leaking",
        status: "resolved",
        reportedDate: "2024-12-05",
        resolvedDate: "2024-12-07",
        priority: "low",
      },
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "#2ECC71"
      case "pending":
        return "#F39C12"
      case "in-progress":
        return "#00BCD4"
      default:
        return "#BDC3C7"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#E74C3C"
      case "medium":
        return "#F39C12"
      case "low":
        return "#2ECC71"
      default:
        return "#BDC3C7"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <ScrollView className="flex-1 bg-[#F0F4F8]" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="flex-row items-center justify-between bg-[#6A5ACD] pt-12 pb-5 px-4 rounded-b-[25px]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white">Hostel Information</Text>
        <TouchableOpacity className="p-2">
          <Icon name="help" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Room Info Card */}
      <View className="px-4 -mt-8 mb-5">
        <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-[#2C3E50]">My Room</Text>
            <View className="bg-[#6A5ACD20] px-3 py-1 rounded-xl">
              <Text className="text-sm font-bold text-[#6A5ACD]">{hostelData.room.number}</Text>
            </View>
          </View>

          <View className="flex-row justify-between mb-4">
            <View className="items-center flex-1">
              <Icon name="business" size={24} color="#6A5ACD" />
              <Text className="text-sm font-semibold text-[#2C3E50] mt-1">{hostelData.room.block}</Text>
              <Text className="text-xs text-[#7F8C8D]">Block</Text>
            </View>
            <View className="items-center flex-1">
              <Icon name="layers" size={24} color="#00BCD4" />
              <Text className="text-sm font-semibold text-[#2C3E50] mt-1">{hostelData.room.floor}</Text>
              <Text className="text-xs text-[#7F8C8D]">Floor</Text>
            </View>
            <View className="items-center flex-1">
              <Icon name="people" size={24} color="#2ECC71" />
              <Text className="text-sm font-semibold text-[#2C3E50] mt-1">{hostelData.room.type}</Text>
              <Text className="text-xs text-[#7F8C8D]">Type</Text>
            </View>
          </View>

          <View className="bg-[#EAECEE] rounded-xl p-3">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm font-semibold text-[#2C3E50]">Warden: {hostelData.room.warden}</Text>
                <Text className="text-xs text-[#7F8C8D]">{hostelData.room.wardenContact}</Text>
              </View>
              <TouchableOpacity className="bg-[#2ECC71] p-2 rounded-lg">
                <Icon name="phone" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row px-4 mb-5">
        {["room", "facilities", "rules", "maintenance"].map((tab) => (
          <TouchableOpacity
            key={tab}
            className={`flex-1 py-3 items-center mx-1 rounded-xl border ${
              selectedTab === tab ? "bg-[#6A5ACD] border-[#6A5ACD]" : "bg-white border-[#DDE4EB]"
            }`}
            onPress={() => setSelectedTab(tab)}
          >
            <Text className={`text-xs font-semibold ${selectedTab === tab ? "text-white" : "text-[#7F8C8D]"}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Roommates Tab */}
      {selectedTab === "room" && (
        <View className="p-4">
          <Text className="text-xl font-bold text-[#2C3E50] mb-4">Roommates</Text>
          <View className="gap-3">
            {hostelData.roommates.map((roommate) => (
              <View key={roommate.id} className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View className="w-12 h-12 rounded-full bg-[#6A5ACD20] items-center justify-center mr-3">
                      <Icon name="person" size={24} color="#6A5ACD" />
                    </View>
                    <View>
                      <Text className="text-base font-semibold text-[#2C3E50]">{roommate.name}</Text>
                      <Text className="text-sm text-[#7F8C8D]">{roommate.class}</Text>
                      <Text className="text-xs text-[#7F8C8D]">From {roommate.hometown}</Text>
                    </View>
                  </View>
                  <TouchableOpacity className="bg-[#2ECC71] p-2 rounded-lg">
                    <Icon name="message" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Facilities Tab */}
      {selectedTab === "facilities" && (
        <View className="p-4">
          <Text className="text-xl font-bold text-[#2C3E50] mb-4">Room Facilities</Text>
          <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
            <View className="flex-row flex-wrap">
              {hostelData.facilities.map((facility, index) => (
                <View key={index} className="w-1/2 mb-4">
                  <View className="flex-row items-center">
                    <View
                      className="w-8 h-8 rounded-lg items-center justify-center mr-3"
                      style={{ backgroundColor: facility.available ? "#2ECC7120" : "#E74C3C20" }}
                    >
                      <Icon
                        name={facility.available ? "check" : "close"}
                        size={16}
                        color={facility.available ? "#2ECC71" : "#E74C3C"}
                      />
                    </View>
                    <Text className="text-sm text-[#2C3E50] font-medium">{facility.name}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Rules Tab */}
      {selectedTab === "rules" && (
        <View className="p-4">
          <Text className="text-xl font-bold text-[#2C3E50] mb-4">Hostel Rules</Text>
          <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
            {hostelData.rules.map((rule, index) => (
              <View key={index} className="flex-row items-start mb-3 last:mb-0">
                <View className="w-6 h-6 rounded-full bg-[#6A5ACD20] items-center justify-center mr-3 mt-0.5">
                  <Text className="text-xs font-bold text-[#6A5ACD]">{index + 1}</Text>
                </View>
                <Text className="text-sm text-[#2C3E50] leading-5 flex-1">{rule}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Maintenance Tab */}
      {selectedTab === "maintenance" && (
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-[#2C3E50]">Maintenance Requests</Text>
            <TouchableOpacity className="bg-[#6A5ACD] px-4 py-2 rounded-xl">
              <Text className="text-sm font-semibold text-white">Report Issue</Text>
            </TouchableOpacity>
          </View>
          <View className="gap-3">
            {hostelData.maintenance.map((request) => (
              <View key={request.id} className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-base font-semibold text-[#2C3E50] flex-1">{request.issue}</Text>
                  <View
                    className="px-2 py-1 rounded-lg"
                    style={{ backgroundColor: `${getStatusColor(request.status)}20` }}
                  >
                    <Text
                      className="text-[10px] font-bold"
                      style={{ color: getStatusColor(request.status) }}
                    >
                      {request.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-xs text-[#7F8C8D]">Reported: {formatDate(request.reportedDate)}</Text>
                    {request.resolvedDate && (
                      <Text className="text-xs text-[#2ECC71]">Resolved: {formatDate(request.resolvedDate)}</Text>
                    )}
                  </View>
                  <View
                    className="px-2 py-1 rounded-lg"
                    style={{ backgroundColor: `${getPriorityColor(request.priority)}20` }}
                  >
                    <Text
                      className="text-[10px] font-bold"
                      style={{ color: getPriorityColor(request.priority) }}
                    >
                      {request.priority.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  )
}

export default HostelScreen
