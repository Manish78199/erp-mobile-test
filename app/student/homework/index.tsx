

import type React from "react"
import { useState, useEffect, useContext } from "react"
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, RefreshControl, useWindowDimensions } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { Link } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getMyHomework } from "@/service/student/homework"
import { AlertContext } from "@/context/Alert/context"
import { Typography } from "@/components/Typography"



interface Homework {
  _id: string
  title: string
  description: string
  subject: string
  due_date: string
  created_at: string
  status?: "PENDING" | "SUBMITTED" | "OVERDUE" | "GRADED"
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  attachments?: string[]
  teacher?: string
  marks?: number
  total_marks?: number
  feedback?: string
  submission_date?: string
}

const HomeworkScreen: React.FC = () => {


  const { showAlert } = useContext(AlertContext)

  // State management
  const [allHomework, setAllHomework] = useState<Homework[]>([])
  const [filteredHomework, setFilteredHomework] = useState<Homework[]>([])
  const [submittedHomework, setSubmittedHomework] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  // Modal states
  const [showHomeworkModal, setShowHomeworkModal] = useState(false)
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null)
  const [showSubmissionModal, setShowSubmissionModal] = useState(false)

  const subjects = [
    { id: "all", label: "All Subjects", icon: "school", color: "#6A5ACD" },
    { id: "mathematics", label: "Mathematics", icon: "calculate", color: "#E91E63" },
    { id: "science", label: "Science", icon: "science", color: "#4CAF50" },
    { id: "english", label: "English", icon: "menu-book", color: "#FF9800" },
    { id: "history", label: "History", icon: "history-edu", color: "#9C27B0" },
    { id: "geography", label: "Geography", icon: "public", color: "#00BCD4" },
    { id: "physics", label: "Physics", icon: "psychology", color: "#F44336" },
    { id: "chemistry", label: "Chemistry", icon: "biotech", color: "#795548" },
    { id: "biology", label: "Biology", icon: "eco", color: "#8BC34A" },
    { id: "computer", label: "Computer", icon: "computer", color: "#607D8B" },
    { id: "art", label: "Art", icon: "palette", color: "#E91E63" },
    { id: "music", label: "Music", icon: "music-note", color: "#673AB7" },
    { id: "physical", label: "Physical Ed", icon: "fitness-center", color: "#FF5722" },
    { id: "social", label: "Social Studies", icon: "groups", color: "#3F51B5" },
  ]

  const getRandomColor = () => {
    const colors = [
      "#E91E63",
      "#9C27B0",
      "#673AB7",
      "#3F51B5",
      "#2196F3",
      "#00BCD4",
      "#009688",
      "#4CAF50",
      "#8BC34A",
      "#CDDC39",
      "#FFEB3B",
      "#FFC107",
      "#FF9800",
      "#FF5722",
      "#795548",
      "#607D8B",
      "#F44336",
      "#E91E63",
      "#9C27B0",
      "#673AB7",
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const getRandomIcon = () => {
    const icons = [
      "school",
      "book",
      "library-books",
      "assignment",
      "quiz",
      "science",
      "calculate",
      "psychology",
      "biotech",
      "eco",
      "computer",
      "palette",
      "music-note",
      "fitness-center",
      "groups",
      "language",
      "public",
      "history-edu",
      "menu-book",
      "edit",
    ]
    return icons[Math.floor(Math.random() * icons.length)]
  }

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

  const getStatusColor = (status?: string) => {
    switch (status?.toUpperCase()) {
      case "SUBMITTED":
        return "#2ECC71"
      case "GRADED":
        return "#6A5ACD"
      case "OVERDUE":
        return "#E74C3C"
      case "PENDING":
      default:
        return "#F39C12"
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

  const getSubjectColor = (subject?: string) => {
    // Create a simple hash from the subject name to ensure consistent colors
    if (!subject) return getRandomColor()

    let hash = 0
    for (let i = 0; i < subject.length; i++) {
      const char = subject.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }

    const colors = [
      "#E91E63",
      "#9C27B0",
      "#673AB7",
      "#3F51B5",
      "#2196F3",
      "#00BCD4",
      "#009688",
      "#4CAF50",
      "#8BC34A",
      "#CDDC39",
      "#FFC107",
      "#FF9800",
      "#FF5722",
      "#795548",
      "#607D8B",
      "#F44336",
      "#E91E63",
      "#9C27B0",
      "#673AB7",
      "#3F51B5",
    ]

    const index = Math.abs(hash) % colors.length
    return colors[index]
  }

  const getSubjectIcon = (subject?: string) => {
    const subjectObj = subjects.find((sub) => sub.id === subject?.toLowerCase())
    if (subjectObj) return subjectObj.icon

    // Return appropriate icon based on subject name keywords
    const subjectLower = subject?.toLowerCase() || ""
    if (subjectLower.includes("math")) return "calculate"
    if (subjectLower.includes("science") || subjectLower.includes("physics") || subjectLower.includes("chemistry"))
      return "science"
    if (subjectLower.includes("english") || subjectLower.includes("language")) return "menu-book"
    if (subjectLower.includes("history")) return "history-edu"
    if (subjectLower.includes("geography")) return "public"
    if (subjectLower.includes("computer")) return "computer"
    if (subjectLower.includes("art")) return "palette"
    if (subjectLower.includes("music")) return "music-note"
    if (subjectLower.includes("sport") || subjectLower.includes("physical")) return "fitness-center"
    if (subjectLower.includes("biology")) return "eco"

    return "school" // Default icon
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

  const getDaysUntilDue = (dueDateString?: string) => {
    const dueDate = safeParseDateString(dueDateString)
    if (!dueDate) return null

    const now = new Date()
    const diffTime = dueDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  const isOverdue = (dueDateString?: string, status?: string) => {
    if (status === "SUBMITTED" || status === "GRADED") return false
    const dueDate = safeParseDateString(dueDateString)
    if (!dueDate) return false
    return new Date() > dueDate
  }

  // Fetch homework
  const getHomeworkRequest = async () => {
    setIsLoading(true)
    try {
      const homeworkData = await getMyHomework()

      // Enhance homework with status and UI-compatible fields
      const enhancedHomework = homeworkData.map((hw: any) => {
        const daysUntilDue = getDaysUntilDue(hw.due_date)
        let status = hw.status || "PENDING"

        // Auto-determine status based on due date if not provided
        if (!hw.status) {
          if (submittedHomework.has(hw._id)) {
            status = "SUBMITTED"
          } else if (daysUntilDue !== null && daysUntilDue < 0) {
            status = "OVERDUE"
          } else {
            status = "PENDING"
          }
        }

        return {
          ...hw,
          status: status as Homework["status"],
          teacher: hw.teacher || "Teacher",
          priority: hw.priority || (daysUntilDue !== null && daysUntilDue <= 2 ? "HIGH" : "MEDIUM"),
        }
      })

      setAllHomework(enhancedHomework)
      setFilteredHomework(enhancedHomework)

      // Load submitted homework from AsyncStorage
      const savedSubmittedHomework = await AsyncStorage.getItem("submittedHomework")
      if (savedSubmittedHomework) {
        try {
          const submittedIds = JSON.parse(savedSubmittedHomework)
          setSubmittedHomework(new Set(submittedIds))
        } catch (error) {
          console.warn("Error loading submitted homework:", error)
        }
      }
    } catch (error) {
      showAlert("ERROR", "Failed to fetch homework")
      console.error("Homework fetch error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true)
    await getHomeworkRequest()
    setRefreshing(false)
  }

  useEffect(() => {
    getHomeworkRequest()
  }, [])

  // Filter homework
  useEffect(() => {
    let filtered = [...allHomework]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (hw) =>
          hw.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hw.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hw.subject.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply subject filter
    if (selectedFilter !== "all") {
      filtered = filtered.filter((hw) => hw.subject.toLowerCase() === selectedFilter)
    }

    setFilteredHomework(filtered)
  }, [allHomework, searchTerm, selectedFilter, submittedHomework])

  // Handle homework submission
  const handleSubmitHomework = async (homeworkId: string) => {
    // try {
    //   await submitHomework(homeworkId)
    //   const newSubmittedHomework = new Set(submittedHomework)
    //   newSubmittedHomework.add(homeworkId)
    //   setSubmittedHomework(newSubmittedHomework)

    //   // Update homework status
    //   setAllHomework((prev) => prev.map((hw) => (hw._id === homeworkId ? { ...hw, status: "SUBMITTED" as const } : hw)))

    //   await AsyncStorage.setItem("submittedHomework", JSON.stringify([...newSubmittedHomework]))
    //   showAlert("SUCCESS", "Homework submitted successfully!")
    // } catch (error) {
    //   showAlert("ERROR", "Failed to submit homework")
    //   console.error("Homework submission error:", error)
    // }
  }

  const getHomeworkStats = () => {
    const total = allHomework.length
    const pending = allHomework.filter((hw) => hw.status === "PENDING").length
    const submitted = allHomework.filter((hw) => hw.status === "SUBMITTED").length
    const overdue = allHomework.filter((hw) => hw.status === "OVERDUE").length

    return { total, pending, submitted, overdue }
  }

  const stats = getHomeworkStats()

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
          <Typography className="text-xl font-bold text-white">Homework</Typography>
        </View>
        <TouchableOpacity className="p-2" onPress={getHomeworkRequest}>
          <Icon name="refresh" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View className="px-4 -mt-8 mb-5">
        <View className="flex-row justify-between">
          <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
            <View className="w-12 h-12 bg-[#6A5ACD20] rounded-full items-center justify-center mb-2">
              <Icon name="assignment" size={24} color="#6A5ACD" />
            </View>
            <Typography className="text-2xl font-extrabold text-[#2C3E50]">{stats.total}</Typography>
            <Typography className="text-xs text-[#7F8C8D] text-center">Total</Typography>
          </View>
          <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
            <View className="w-12 h-12 bg-[#F39C1220] rounded-full items-center justify-center mb-2">
              <Icon name="pending-actions" size={24} color="#F39C12" />
            </View>
            <Typography className="text-2xl font-extrabold text-[#2C3E50]">{stats.pending}</Typography>
            <Typography className="text-xs text-[#7F8C8D] text-center">Pending</Typography>
          </View>
          <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
            <View className="w-12 h-12 bg-[#2ECC7120] rounded-full items-center justify-center mb-2">
              <Icon name="assignment-turned-in" size={24} color="#2ECC71" />
            </View>
            <Typography className="text-2xl font-extrabold text-[#2C3E50]">{stats.submitted}</Typography>
            <Typography className="text-xs text-[#7F8C8D] text-center">Submitted</Typography>
          </View>
          <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
            <View className="w-12 h-12 bg-[#E74C3C20] rounded-full items-center justify-center mb-2">
              <Icon name="assignment-late" size={24} color="#E74C3C" />
            </View>
            <Typography className="text-2xl font-extrabold text-[#2C3E50]">{stats.overdue}</Typography>
            <Typography className="text-xs text-[#7F8C8D] text-center">Overdue</Typography>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View className="px-4 mb-5">
        <View className="bg-white rounded-2xl p-3 shadow-lg elevation-5 flex-row items-center">
          <Icon name="search" size={20} color="#7F8C8D" />
          <TextInput
            className="flex-1 ml-3 text-[#2C3E50]"
            placeholder="Search homework..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#7F8C8D"
          />
        </View>
      </View>

      {/* Subject Filter */}
      <View className="px-4 mb-5">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {subjects.map((subject) => (
            <TouchableOpacity
              key={subject.id}
              className={`flex-row items-center px-4 py-2.5 mr-3 rounded-[20px] border ${selectedFilter === subject.id ? "border-[#6A5ACD]" : "bg-white border-[#DDE4EB]"
                }`}
              style={selectedFilter === subject.id ? { backgroundColor: `${subject.color}20` } : {}}
              onPress={() => setSelectedFilter(subject.id)}
            >
              <Icon name={subject.icon} size={16} color={subject.color} />
              <Typography
                className={`text-sm font-semibold ml-2 ${selectedFilter === subject.id ? "text-[#2C3E50]" : "text-[#7F8C8D]"
                  }`}
              >
                {subject.label}
              </Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Loading State */}
      {isLoading && (
        <View className="flex-1 items-center justify-center py-8">
          <Icon name="refresh" size={32} color="#6A5ACD" />
          <Typography className="text-[#7F8C8D] mt-2">Loading homework...</Typography>
        </View>
      )}

      {/* Homework List */}
      {!isLoading && (
        <View className="px-4 mb-8">
          <Typography className="text-xl font-bold text-[#2C3E50] mb-4">
            {selectedFilter === "all" ? "All Homework" : subjects.find((sub) => sub.id === selectedFilter)?.label}
          </Typography>
          {filteredHomework.length > 0 ? (
            <View className="gap-4">
              {filteredHomework.map((homework) => {
                const daysUntilDue = getDaysUntilDue(homework.due_date)

                return (
                  <TouchableOpacity
                    key={homework._id}
                    className="bg-white rounded-2xl p-4 shadow-lg elevation-5"
                    onPress={() => {
                      setSelectedHomework(homework)
                      setShowSubmissionModal(true)
                    }}
                  >
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center flex-1">
                        {/* <View
                          className="w-10 h-10 rounded-full items-center justify-center mr-3"
                          style={{ backgroundColor: `${getSubjectColor(homework.subject)}20` }}
                        >
                          <Icon
                            name={getSubjectIcon(homework.subject)}
                            size={20}
                            color={getSubjectColor(homework.subject)}
                          />
                        </View> */}
                        <View className="flex-1">
                          <Typography className="text-base font-bold text-[#2C3E50]" numberOfLines={1}>
                            {homework.title}
                          </Typography>

                          <View className="flex flex-row items-center">
                            <Typography className={`text-xs p-[2px] bg-gray-100  shadow-sm ring-gray-300 capitalize text-[#4d5965] rounded-md  `}>
                              {homework.subject}
                            </Typography>
                            <Typography className={`text-xs p-[2px] text-[#4d5965] rounded-md  `}>
                              |  {homework.teacher}
                            </Typography>
                          </View>





                        </View>
                      </View>
                      <View className="items-end">
                        <View
                          className="px-2 py-1 rounded-lg mb-1"
                          style={{ backgroundColor: `${getStatusColor(homework.status)}20` }}
                        >
                          <Typography className="text-[10px] font-bold" style={{ color: getStatusColor(homework.status) }}>
                            {homework.status?.toUpperCase() || "PENDING"}
                          </Typography>
                        </View>
                        {daysUntilDue !== null && (
                          <Typography className={`text-xs ${daysUntilDue < 0 ? "text-[#E74C3C]" : "text-[#7F8C8D]"}`}>
                            {daysUntilDue < 0
                              ? `${Math.abs(daysUntilDue)} days overdue`
                              : daysUntilDue === 0
                                ? "Due today"
                                : `${daysUntilDue} days left`}
                          </Typography>
                        )}
                      </View>
                    </View>

                    {/* Content Preview */}
                    <Typography className="text-sm text-[#7F8C8D] leading-5 mb-3" numberOfLines={2}>
                      {homework.description}
                    </Typography>

                    {/* Footer */}
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <View
                          className="px-2 py-1 rounded-lg mr-2"
                          style={{ backgroundColor: `${getPriorityColor(homework.priority)}20` }}
                        >
                          <Typography
                            className="text-[10px] font-bold"
                            style={{ color: getPriorityColor(homework.priority) }}
                          >
                            {homework.priority?.toUpperCase() || "MEDIUM"}
                          </Typography>
                        </View>
                        {homework.attachments && homework.attachments.length > 0 && (
                          <>
                            <Icon name="attachment" size={16} color="#6A5ACD" />
                            <Typography className="text-xs text-[#6A5ACD] ml-1">{homework.attachments.length}</Typography>
                          </>
                        )}
                      </View>
                      <Typography className="text-xs text-[#7F8C8D]">Due: {formatDate(homework.due_date)}</Typography>
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>
          ) : (
            <View className="text-center py-8">
              <Icon name="assignment" size={48} color="#BDC3C7" />
              <Typography className="text-[#7F8C8D] mt-4">
                {searchTerm || selectedFilter !== "all"
                  ? "No homework found matching your criteria."
                  : "No homework assignments yet."}
              </Typography>
            </View>
          )}
        </View>
      )}

      {/* Homework Submission Modal */}

      <Modal
        visible={showSubmissionModal}
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
        onRequestClose={() => setShowSubmissionModal(false)}
      >
        <View className={`flex-1   bg-black/50  justify-end`}>
          <View className="bg-white rounded-t-[25px] p-5 max-h-[90%]">

            <View className="flex-row justify-between items-center mb-5">
              <Typography className="text-xl font-bold text-[#2C3E50] flex-1 mr-4">Assignment Details</Typography>
              <TouchableOpacity onPress={() => setShowSubmissionModal(false)}>
                <Icon name="close" size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>

            {selectedHomework && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Assignment Header */}
                <View className="items-center mb-6">
                  <View
                    className="w-16 h-16 rounded-full items-center justify-center mb-3"
                    style={{ backgroundColor: `${getStatusColor(selectedHomework.status)}20` }}
                  >
                    <Icon name="assignment" size={32} color={getStatusColor(selectedHomework.status)} />
                  </View>
                  <Typography className="text-xl font-bold text-[#2C3E50] text-center mb-2">{selectedHomework.title}</Typography>
                  <Typography className="text-sm text-[#7F8C8D] text-center">
                    {selectedHomework.subject} • {selectedHomework.teacher || "Teacher"}
                  </Typography>
                </View>

                {/* Assignment Info */}
                <View className="bg-[#F8F9FA] rounded-2xl p-4 mb-6">
                  <View className="flex-row justify-between mb-3">
                    <View>
                      <Typography className="text-xs text-[#7F8C8D] mb-1">Assigned Date</Typography>
                      <Typography className="text-sm font-semibold text-[#2C3E50]">
                        {formatDate(selectedHomework.created_at)}
                      </Typography>
                    </View>
                    <View>
                      <Typography className="text-xs text-[#7F8C8D] mb-1">Due Date</Typography>
                      <Typography
                        className={`text-sm font-semibold ${isOverdue(selectedHomework.due_date, selectedHomework.status)
                          ? "text-[#E74C3C]"
                          : "text-[#2C3E50]"
                          }`}
                      >
                        {formatDate(selectedHomework.due_date)}
                      </Typography>
                    </View>
                  </View>
                  <View className="flex-row justify-between">
                    <View>
                      <Typography className="text-xs text-[#7F8C8D] mb-1">Status</Typography>
                      <Typography
                        className="text-sm font-semibold"
                        style={{ color: getStatusColor(selectedHomework.status) }}
                      >
                        {selectedHomework.status || "PENDING"}
                      </Typography>
                    </View>
                    {selectedHomework.priority && (
                      <View>
                        <Typography className="text-xs text-[#7F8C8D] mb-1">Priority</Typography>
                        <Typography
                          className="text-sm font-semibold"
                          style={{ color: getPriorityColor(selectedHomework.priority) }}
                        >
                          {selectedHomework.priority}
                        </Typography>
                      </View>
                    )}
                  </View>
                </View>

                {/* Description */}
                <View className="mb-6">
                  <Typography className="text-lg font-bold text-[#2C3E50] mb-3">Description</Typography>
                  <Typography className="text-sm text-[#2C3E50] leading-6">{selectedHomework.description}</Typography>
                </View>

                {/* Attachments */}
                {selectedHomework.attachments && selectedHomework.attachments.length > 0 && (
                  <View className="mb-6">
                    <Typography className="text-lg font-bold text-[#2C3E50] mb-3">Attachments</Typography>
                    <View className="gap-2">
                      {selectedHomework.attachments.map((attachment: string, index: number) => (
                        <TouchableOpacity key={index} className="flex-row items-center p-3 bg-[#F8F9FA] rounded-xl">
                          <Icon name="attach-file" size={20} color="#6A5ACD" />
                          <Typography className="text-sm text-[#2C3E50] ml-2 flex-1">{attachment}</Typography>
                          <Icon name="download" size={16} color="#6A5ACD" />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {/* Submission Status */}
                {selectedHomework.status === "SUBMITTED" && selectedHomework.submission_date ? (
                  <View className="mb-6">
                    <Typography className="text-lg font-bold text-[#2C3E50] mb-3">Submission Details</Typography>
                    <View className="bg-[#2ECC7110] border border-[#2ECC7130] rounded-2xl p-4">
                      <View className="flex-row items-center">
                        <Icon name="check-circle" size={20} color="#2ECC71" />
                        <Typography className="text-sm font-semibold text-[#2ECC71] ml-2">
                          Submitted on {formatDate(selectedHomework.submission_date)}
                        </Typography>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View className="mb-6">
                    <Typography className="text-lg font-bold text-[#2C3E50] mb-3">Submit Assignment</Typography>
                    <TouchableOpacity className="border-2 border-dashed border-[#6A5ACD] rounded-xl p-6 items-center">
                      <Icon name="cloud-upload" size={32} color="#6A5ACD" />
                      <Typography className="text-sm text-[#6A5ACD] mt-2">Click to upload your assignment</Typography>
                      <Typography className="text-xs text-[#7F8C8D] mt-1">PDF, DOC, DOCX, JPG, PNG (Max 10MB)</Typography>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Grading Info */}
                {selectedHomework.status === "GRADED" && selectedHomework.marks !== undefined && (
                  <View className="bg-[#6A5ACD10] border border-[#6A5ACD30] rounded-2xl p-4 mb-6">
                    <Typography className="text-lg font-bold text-[#2C3E50] mb-2">Grade</Typography>
                    <View className="flex-row justify-between items-center mb-2">
                      <Typography className="text-sm text-[#7F8C8D]">Score:</Typography>
                      <Typography className="text-lg font-bold text-[#6A5ACD]">
                        {selectedHomework.marks}/{selectedHomework.total_marks || 100}
                      </Typography>
                    </View>
                    {selectedHomework.feedback && (
                      <View>
                        <Typography className="text-sm text-[#7F8C8D] mb-1">Feedback:</Typography>
                        <Typography className="text-sm text-[#2C3E50]">{selectedHomework.feedback}</Typography>
                      </View>
                    )}
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>


    </ScrollView>
  )
}

export default HomeworkScreen
