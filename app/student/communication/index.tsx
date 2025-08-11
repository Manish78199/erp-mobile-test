import type React from "react"
import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"

interface MessagesScreenProps {
  navigation: any
}

const MessagesScreen: React.FC<MessagesScreenProps> = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState("all")
  const [showComposeModal, setShowComposeModal] = useState(false)

  const messagesData = [
    {
      id: 1,
      sender: "Mrs. Sarah Johnson",
      role: "Mathematics Teacher",
      subject: "Assignment Submission Reminder",
      message: "Please submit your algebra homework by tomorrow. Don't forget to show all working steps.",
      timestamp: "2024-12-12 10:30 AM",
      isRead: false,
      type: "teacher",
      priority: "high",
    },
    {
      id: 2,
      sender: "Admin Office",
      role: "Administration",
      subject: "Fee Payment Due",
      message: "Your term fee payment is due on December 31st. Please make the payment to avoid late charges.",
      timestamp: "2024-12-11 02:15 PM",
      isRead: true,
      type: "admin",
      priority: "medium",
    },
    {
      id: 3,
      sender: "Dr. Michael Brown",
      role: "Physics Teacher",
      subject: "Lab Session Rescheduled",
      message: "Tomorrow's physics lab has been rescheduled to Friday 2 PM due to equipment maintenance.",
      timestamp: "2024-12-10 04:45 PM",
      isRead: true,
      type: "teacher",
      priority: "medium",
    },
    {
      id: 4,
      sender: "Principal's Office",
      role: "Principal",
      subject: "Parent-Teacher Meeting",
      message: "You are invited to attend the parent-teacher meeting on December 22nd at 2 PM.",
      timestamp: "2024-12-09 09:00 AM",
      isRead: false,
      type: "admin",
      priority: "high",
    },
  ]

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "teacher":
        return "#6A5ACD"
      case "admin":
        return "#00BCD4"
      default:
        return "#BDC3C7"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "teacher":
        return "school"
      case "admin":
        return "admin-panel-settings"
      default:
        return "person"
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const filteredMessages = messagesData.filter((message) => {
    if (selectedTab === "all") return true
    if (selectedTab === "unread") return !message.isRead
    return message.type === selectedTab
  })

  return (
    <ScrollView className="flex-1 bg-[#F0F4F8]" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="flex-row items-center justify-between bg-[#6A5ACD] pt-12 pb-5 px-4 rounded-b-[25px]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white">Messages</Text>
        <TouchableOpacity className="p-2" onPress={() => setShowComposeModal(true)}>
          <Icon name="edit" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View className="flex-row justify-between px-4 -mt-8 mb-5">
        <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
          <Icon name="mail" size={28} color="#6A5ACD" />
          <Text className="text-2xl font-extrabold text-[#2C3E50] mt-2">{messagesData.length}</Text>
          <Text className="text-xs text-[#7F8C8D] mt-1">Total</Text>
        </View>
        <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
          <Icon name="mark-email-unread" size={28} color="#E74C3C" />
          <Text className="text-2xl font-extrabold text-[#2C3E50] mt-2">
            {messagesData.filter(m => !m.isRead).length}
          </Text>
          <Text className="text-xs text-[#7F8C8D] mt-1">Unread</Text>
        </View>
        <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
          <Icon name="priority-high" size={28} color="#F39C12" />
          <Text className="text-2xl font-extrabold text-[#2C3E50] mt-2">
            {messagesData.filter(m => m.priority === "high").length}
          </Text>
          <Text className="text-xs text-[#7F8C8D] mt-1">Priority</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="px-4 mb-5">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {["all", "unread", "teacher", "admin"].map((tab) => (
            <TouchableOpacity
              key={tab}
              className={`px-5 py-2.5 mr-3 rounded-[20px] border ${
                selectedTab === tab ? "bg-[#6A5ACD] border-[#6A5ACD]" : "bg-white border-[#DDE4EB]"
              }`}
              onPress={() => setSelectedTab(tab)}
            >
              <Text className={`text-sm font-semibold ${selectedTab === tab ? "text-white" : "text-[#7F8C8D]"}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Messages List */}
      <View className="p-4">
        <Text className="text-xl font-bold text-[#2C3E50] mb-4">Inbox</Text>
        <View className="gap-3">
          {filteredMessages.map((message) => (
            <TouchableOpacity key={message.id} className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center flex-1">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: `${getTypeColor(message.type)}20` }}
                  >
                    <Icon name={getTypeIcon(message.type)} size={20} color={getTypeColor(message.type)} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-[#2C3E50]">{message.sender}</Text>
                    <Text className="text-xs text-[#7F8C8D]">{message.role}</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-xs text-[#7F8C8D]">{formatDate(message.timestamp)}</Text>
                  <Text className="text-xs text-[#7F8C8D]">{formatTime(message.timestamp)}</Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between mb-2">
                <Text className={`text-sm font-semibold flex-1 ${!message.isRead ? "text-[#2C3E50]" : "text-[#7F8C8D]"}`}>
                  {message.subject}
                </Text>
                <View className="flex-row items-center ml-2">
                  {!message.isRead && (
                    <View className="w-2 h-2 bg-[#E74C3C] rounded-full mr-2" />
                  )}
                  <View
                    className="px-2 py-1 rounded-lg"
                    style={{ backgroundColor: `${getPriorityColor(message.priority)}20` }}
                  >
                    <Text
                      className="text-[10px] font-bold"
                      style={{ color: getPriorityColor(message.priority) }}
                    >
                      {message.priority.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>

              <Text className="text-sm text-[#7F8C8D] leading-5" numberOfLines={2}>
                {message.message}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Compose Modal */}
      <Modal
        visible={showComposeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowComposeModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[25px] p-5 max-h-[80%]">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-xl font-bold text-[#2C3E50]">Compose Message</Text>
              <TouchableOpacity onPress={() => setShowComposeModal(false)}>
                <Icon name="close" size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-[#2C3E50] mb-2">To:</Text>
              <TouchableOpacity className="border border-[#DDE4EB] rounded-xl p-3 flex-row items-center justify-between">
                <Text className="text-sm text-[#7F8C8D]">Select recipient</Text>
                <Icon name="keyboard-arrow-down" size={20} color="#7F8C8D" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-[#2C3E50] mb-2">Subject:</Text>
              <TextInput
                className="border border-[#DDE4EB] rounded-xl p-3 text-sm text-[#2C3E50]"
                placeholder="Enter subject"
              />
            </View>

            <View className="mb-5">
              <Text className="text-sm font-semibold text-[#2C3E50] mb-2">Message:</Text>
              <TextInput
                className="border border-[#DDE4EB] rounded-xl p-3 text-sm text-[#2C3E50] min-h-[100px]"
                placeholder="Type your message here..."
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity className="bg-[#6A5ACD] rounded-xl py-4 items-center">
              <Text className="text-base font-bold text-white">Send Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

export default MessagesScreen
