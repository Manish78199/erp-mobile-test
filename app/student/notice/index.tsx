
import type React from "react"
import { useState, useEffect, useContext } from "react"
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, RefreshControl } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { Link } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getAllNotice } from "@/service/student/notice"
import { AlertContext } from "@/context/Alert/context"

interface Notice {
  _id: string
  title: string
  message: string
  subject?: string
  created_at: string
  updated_at?: string
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  category?: string
  author?: string
  attachments?: string[]
  // Additional fields for UI compatibility
  publishedBy?: string
  publishedDate?: string
  readBy?: number
  totalStudents?: number
  isPinned?: boolean
}

type FilterType = "ALL" | "UNREAD" | "TODAY" | "THIS_WEEK"

const NoticesScreen: React.FC = () => {
  const { showAlert } = useContext(AlertContext)

  // State management
  const [allNotice, setAllNotice] = useState<Notice[]>([])
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>([])
  const [readNotices, setReadNotices] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Modal states
  const [showNoticeModal, setShowNoticeModal] = useState(false)
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null)

  const categories = [
    { id: "all", label: "All Notices", icon: "notifications", color: "#6A5ACD" },
    { id: "general", label: "General", icon: "info", color: "#2ECC71" },
    { id: "academic", label: "Academic", icon: "school", color: "#3498DB" },
    { id: "sports", label: "Sports", icon: "sports", color: "#F39C12" },
    { id: "library", label: "Library", icon: "menu-book", color: "#E91E63" },
    { id: "exam", label: "Exams", icon: "quiz", color: "#9C27B0" },
    { id: "event", label: "Events", icon: "event", color: "#FF5722" },
  ]

  // Safe date parsing function
  const safeParseDateString = (dateString: string | undefined | null): Date | null => {
    if (!dateString) return null
    try {
      const date = new Date(dateString)
      return !isNaN(date.getTime()) ? date : null
    } catch (error) {
      return null
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toUpperCase()) {
      case "URGENT":
      case "HIGH":
        return "#E74C3C"
      case "MEDIUM":
        return "#F39C12"
      case "LOW":
        return "#2ECC71"
      default:
        return "#BDC3C7"
    }
  }

  const getCategoryColor = (category?: string) => {
    const categoryObj = categories.find((cat) => cat.id === category?.toLowerCase())
    return categoryObj ? categoryObj.color : "#6A5ACD"
  }

  const getCategoryIcon = (category?: string) => {
    const categoryObj = categories.find((cat) => cat.id === category?.toLowerCase())
    return categoryObj ? categoryObj.icon : "notifications"
  }

  const formatDate = (dateString?: string) => {
    const date = safeParseDateString(dateString)
    if (!date) return "Date not available"

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getTimeAgo = (dateString?: string) => {
    const date = safeParseDateString(dateString)
    if (!date) return "Date not available"

    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  // Fetch notices
  const getNoticeRequest = async () => {
    setIsLoading(true)
    try {
      const allNotices = await getAllNotice()

      // Enhance notices with UI-compatible fields
      const enhancedNotices = allNotices.map((notice:any) => ({
        ...notice,
        publishedBy: notice.author || "Administration",
        publishedDate: notice.created_at,
        readBy: Math.floor(Math.random() * 250) + 50, // Mock read count
        totalStudents: 300, // Mock total students
        isPinned: notice.priority === "HIGH" || notice.priority === "URGENT",
      }))

      setAllNotice(enhancedNotices)
      setFilteredNotices(enhancedNotices)

      // Load read notices from AsyncStorage
      const savedReadNotices = await AsyncStorage.getItem("readNotices")
      if (savedReadNotices) {
        try {
          const readIds = JSON.parse(savedReadNotices)
          setReadNotices(new Set(readIds))
        } catch (error) {
          console.warn("Error loading read notices:", error)
        }
      }
    } catch (error) {
      showAlert("ERROR", "Failed to fetch notices")
      console.error("Notice fetch error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true)
    await getNoticeRequest()
    setRefreshing(false)
  }

  useEffect(() => {
    getNoticeRequest()
  }, [])

  // Filter notices
  useEffect(() => {
    let filtered = [...allNotice]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (notice) =>
          notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notice.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (notice.category && notice.category.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((notice) => notice.category?.toLowerCase() === selectedCategory)
    }

    setFilteredNotices(filtered)
  }, [allNotice, searchTerm, selectedCategory, readNotices])

  // Handle notice click
  const handleNoticeClick = async (notice: Notice) => {
    setSelectedNotice(notice)
    setShowNoticeModal(true)

    // Mark as read
    if (!readNotices.has(notice._id)) {
      const newReadNotices = new Set(readNotices)
      newReadNotices.add(notice._id)
      setReadNotices(newReadNotices)

      try {
        await AsyncStorage.setItem("readNotices", JSON.stringify([...newReadNotices]))
        // await markNoticeAsRead(notice._id)
      } catch (error) {
        console.warn("Error saving read status:", error)
      }
    }
  }

  const getNoticeStats = () => {
    const total = allNotice.length
    const unread = allNotice.filter((notice) => !readNotices.has(notice._id)).length
    const pinned = allNotice.filter((notice) => notice.isPinned).length
    const highPriority = allNotice.filter((notice) => notice.priority === "HIGH" || notice.priority === "URGENT").length

    return { total, unread, pinned, highPriority }
  }

  const stats = getNoticeStats()

  return (
    <ScrollView
      className="flex-1 bg-[#F0F4F8]"
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between bg-[#6A5ACD] py-12 px-4 rounded-b-[25px]">
        <Link href="/student" asChild>
          <TouchableOpacity className="p-2">
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </Link>
        <View className="flex-1 items-center">
          <Text className="text-xl font-bold text-white">Notice Board</Text>
        </View>
        <TouchableOpacity className="p-2" onPress={getNoticeRequest}>
          <Icon name="refresh" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View className="px-4 -mt-8 mb-5">
        <View className="flex-row justify-between">
          <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
            <View className="w-12 h-12 bg-[#6A5ACD20] rounded-full items-center justify-center mb-2">
              <Icon name="notifications" size={24} color="#6A5ACD" />
            </View>
            <Text className="text-2xl font-extrabold text-[#2C3E50]">{stats.total}</Text>
            <Text className="text-xs text-[#7F8C8D] text-center">Total</Text>
          </View>
          <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
            <View className="w-12 h-12 bg-[#E74C3C20] rounded-full items-center justify-center mb-2">
              <Icon name="mark-email-unread" size={24} color="#E74C3C" />
            </View>
            <Text className="text-2xl font-extrabold text-[#2C3E50]">{stats.unread}</Text>
            <Text className="text-xs text-[#7F8C8D] text-center">Unread</Text>
          </View>
          <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
            <View className="w-12 h-12 bg-[#F39C1220] rounded-full items-center justify-center mb-2">
              <Icon name="push-pin" size={24} color="#F39C12" />
            </View>
            <Text className="text-2xl font-extrabold text-[#2C3E50]">{stats.pinned}</Text>
            <Text className="text-xs text-[#7F8C8D] text-center">Pinned</Text>
          </View>
          <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
            <View className="w-12 h-12 bg-[#E74C3C20] rounded-full items-center justify-center mb-2">
              <Icon name="priority-high" size={24} color="#E74C3C" />
            </View>
            <Text className="text-2xl font-extrabold text-[#2C3E50]">{stats.highPriority}</Text>
            <Text className="text-xs text-[#7F8C8D] text-center">Priority</Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View className="px-4 mb-5">
        <View className="bg-white rounded-2xl p-3 shadow-lg elevation-5 flex-row items-center">
          <Icon name="search" size={20} color="#7F8C8D" />
          <TextInput
            className="flex-1 ml-3 text-[#2C3E50]"
            placeholder="Search notices..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#7F8C8D"
          />
        </View>
      </View>

      {/* Category Filter */}
      <View className="px-4 mb-5">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              className={`flex-row items-center px-4 py-2.5 mr-3 rounded-[20px] border ${
                selectedCategory === category.id ? "border-[#6A5ACD]" : "bg-white border-[#DDE4EB]"
              }`}
              style={selectedCategory === category.id ? { backgroundColor: `${category.color}20` } : {}}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Icon name={category.icon} size={16} color={category.color} />
              <Text
                className={`text-sm font-semibold ml-2 ${
                  selectedCategory === category.id ? "text-[#2C3E50]" : "text-[#7F8C8D]"
                }`}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Loading State */}
      {isLoading && (
        <View className="flex-1 items-center justify-center py-8">
          <Icon name="refresh" size={32} color="#6A5ACD" />
          <Text className="text-[#7F8C8D] mt-2">Loading notices...</Text>
        </View>
      )}

      {/* Notices List */}
      {!isLoading && (
        <View className="px-4 mb-8">
          <Text className="text-xl font-bold text-[#2C3E50] mb-4">
            {selectedCategory === "all" ? "All Notices" : categories.find((cat) => cat.id === selectedCategory)?.label}
          </Text>
          {filteredNotices.length > 0 ? (
            <View className="gap-4">
              {filteredNotices.map((notice) => {
                const isUnread = !readNotices.has(notice._id)

                return (
                  <TouchableOpacity
                    key={notice._id}
                    className="bg-white rounded-2xl p-4 shadow-lg elevation-5"
                    onPress={() => handleNoticeClick(notice)}
                  >
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center flex-1">
                        <View
                          className="w-10 h-10 rounded-full items-center justify-center mr-3"
                          style={{ backgroundColor: `${getCategoryColor(notice.category)}20` }}
                        >
                          <Icon
                            name={getCategoryIcon(notice.category)}
                            size={20}
                            color={getCategoryColor(notice.category)}
                          />
                        </View>
                        <View className="flex-1">
                          <View className="flex-row items-center">
                            {notice.isPinned && <Icon name="push-pin" size={14} color="#F39C12" />}
                            {isUnread && <View className="w-2 h-2 bg-[#E74C3C] rounded-full mr-2" />}
                            <Text
                              className={`text-base font-bold flex-1 ${isUnread ? "text-[#2C3E50]" : "text-[#7F8C8D]"}`}
                              numberOfLines={1}
                            >
                              {notice.title}
                            </Text>
                          </View>
                          <Text className="text-sm text-[#7F8C8D]">{notice.publishedBy}</Text>
                        </View>
                      </View>
                      <View className="items-end">
                        <View
                          className="px-2 py-1 rounded-lg mb-1"
                          style={{ backgroundColor: `${getPriorityColor(notice.priority)}20` }}
                        >
                          <Text className="text-[10px] font-bold" style={{ color: getPriorityColor(notice.priority) }}>
                            {(notice.priority || "MEDIUM").toUpperCase()}
                          </Text>
                        </View>
                        <Text className="text-xs text-[#7F8C8D]">{getTimeAgo(notice.created_at)}</Text>
                      </View>
                    </View>

                    {/* Content Preview */}
                    <Text className="text-sm text-[#7F8C8D] leading-5 mb-3" numberOfLines={2}>
                      {notice.message}
                    </Text>

                    {/* Footer */}
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Icon name="visibility" size={16} color="#7F8C8D" />
                        <Text className="text-xs text-[#7F8C8D] ml-1">
                          {notice.readBy || 0}/{notice.totalStudents || 300} read
                        </Text>
                        {notice.attachments && notice.attachments.length > 0 && (
                          <>
                            <Icon name="attachment" size={16} color="#6A5ACD" style={{ marginLeft: 12 }} />
                            <Text className="text-xs text-[#6A5ACD] ml-1">{notice.attachments.length}</Text>
                          </>
                        )}
                      </View>
                      <Text className="text-xs text-[#7F8C8D]">{formatDate(notice.created_at)}</Text>
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>
          ) : (
            <View className="text-center py-8">
              <Icon name="notifications" size={48} color="#BDC3C7" />
              <Text className="text-[#7F8C8D] mt-4">
                {searchTerm || selectedCategory !== "all"
                  ? "No notices found matching your criteria."
                  : "No announcements yet."}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Notice Detail Modal */}
      <Modal
        visible={showNoticeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNoticeModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[25px] p-5 max-h-[90%]">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-xl font-bold text-[#2C3E50] flex-1 mr-4">Notice Details</Text>
              <TouchableOpacity onPress={() => setShowNoticeModal(false)}>
                <Icon name="close" size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>

            {selectedNotice && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Notice Header */}
                <View className="items-center mb-6">
                  <View
                    className="w-16 h-16 rounded-full items-center justify-center mb-3"
                    style={{ backgroundColor: `${getCategoryColor(selectedNotice.category)}20` }}
                  >
                    <Icon
                      name={getCategoryIcon(selectedNotice.category)}
                      size={32}
                      color={getCategoryColor(selectedNotice.category)}
                    />
                  </View>
                  <View className="flex-row items-center mb-2">
                    {selectedNotice.isPinned && (
                      <Icon name="push-pin" size={16} color="#F39C12" style={{ marginRight: 8 }} />
                    )}
                    <Text className="text-xl font-bold text-[#2C3E50] text-center">{selectedNotice.title}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <View
                      className="px-3 py-1 rounded-xl mr-2"
                      style={{ backgroundColor: `${getPriorityColor(selectedNotice.priority)}20` }}
                    >
                      <Text className="text-sm font-bold" style={{ color: getPriorityColor(selectedNotice.priority) }}>
                        {(selectedNotice.priority || "MEDIUM").toUpperCase()}
                      </Text>
                    </View>
                    <View
                      className="px-3 py-1 rounded-xl"
                      style={{ backgroundColor: `${getCategoryColor(selectedNotice.category)}20` }}
                    >
                      <Text className="text-sm font-bold" style={{ color: getCategoryColor(selectedNotice.category) }}>
                        {(selectedNotice.category || "GENERAL").toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Notice Info */}
                <View className="bg-[#F8F9FA] rounded-2xl p-4 mb-6">
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-sm text-[#7F8C8D]">Published by:</Text>
                    <Text className="text-sm font-semibold text-[#2C3E50]">{selectedNotice.publishedBy}</Text>
                  </View>
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-sm text-[#7F8C8D]">Published on:</Text>
                    <Text className="text-sm font-semibold text-[#2C3E50]">
                      {formatDate(selectedNotice.created_at)}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-[#7F8C8D]">Read by:</Text>
                    <Text className="text-sm font-semibold text-[#6A5ACD]">
                      {selectedNotice.readBy || 0}/{selectedNotice.totalStudents || 300} students
                    </Text>
                  </View>
                </View>

                {/* Notice Content */}
                <View className="mb-6">
                  <Text className="text-lg font-bold text-[#2C3E50] mb-3">Notice Content</Text>
                  <Text className="text-sm text-[#2C3E50] leading-6">{selectedNotice.message}</Text>
                </View>

                {/* Attachments */}
                {selectedNotice.attachments && selectedNotice.attachments.length > 0 && (
                  <View className="mb-6">
                    <Text className="text-lg font-bold text-[#2C3E50] mb-3">Attachments</Text>
                    <View className="gap-2">
                      {selectedNotice.attachments.map((attachment: string, index: number) => (
                        <TouchableOpacity key={index} className="flex-row items-center p-3 bg-[#F8F9FA] rounded-xl">
                          <Icon name="attach-file" size={20} color="#6A5ACD" />
                          <Text className="text-sm text-[#2C3E50] ml-2 flex-1">{attachment}</Text>
                          <Icon name="download" size={16} color="#6A5ACD" />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {/* Actions */}
                <View className="flex-row gap-3">
                  <TouchableOpacity className="flex-1 bg-[#6A5ACD] rounded-xl py-4 items-center">
                    <Text className="text-base font-bold text-white">Mark as Read</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 bg-[#F8F9FA] border border-[#DDE4EB] rounded-xl py-4 items-center">
                    <Text className="text-base font-bold text-[#2C3E50]">Share</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

export default NoticesScreen
