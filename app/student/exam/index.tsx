

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert, RefreshControl } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { Link } from "expo-router"
import { get_latest_exam_schedule } from "@/service/student/exam"
import { format, isToday, isTomorrow, differenceInDays, isPast } from "date-fns"
import { Typography } from "@/components/Typography"

// Custom SVG Illustrations
const NoScheduleIllustration = () => (
  <View className="items-center justify-center p-8">
    <View className="relative">
      {/* Calendar Base */}
      <View className="w-24 h-20 bg-gray-200 rounded-lg border-2 border-gray-300">
        {/* Calendar Header */}
        <View className="h-4 bg-gray-400 rounded-t-md flex-row justify-center items-center">
          <View className="w-1 h-3 bg-white rounded-full mx-1" />
          <View className="w-1 h-3 bg-white rounded-full mx-1" />
        </View>
        {/* Calendar Grid */}
        <View className="flex-1 p-2">
          <View className="flex-row justify-between mb-1">
            <View className="w-2 h-2 bg-gray-300 rounded-sm" />
            <View className="w-2 h-2 bg-gray-300 rounded-sm" />
            <View className="w-2 h-2 bg-gray-300 rounded-sm" />
          </View>
          <View className="flex-row justify-between mb-1">
            <View className="w-2 h-2 bg-gray-300 rounded-sm" />
            <View className="w-2 h-2 bg-red-300 rounded-sm" />
            <View className="w-2 h-2 bg-gray-300 rounded-sm" />
          </View>
          <View className="flex-row justify-between">
            <View className="w-2 h-2 bg-gray-300 rounded-sm" />
            <View className="w-2 h-2 bg-gray-300 rounded-sm" />
            <View className="w-2 h-2 bg-gray-300 rounded-sm" />
          </View>
        </View>
      </View>
      {/* Question Mark */}
      <View className="absolute -top-2 -right-2 w-8 h-8 bg-orange-400 rounded-full items-center justify-center">
        <Typography className="text-white font-bold text-lg">?</Typography> 
      </View>
      {/* Floating Elements */}
      <View className="absolute -left-4 top-2 w-3 h-3 bg-blue-300 rounded-full opacity-60" />
      <View className="absolute -right-1 bottom-2 w-2 h-2 bg-purple-300 rounded-full opacity-60" />
    </View>
  </View>
)

const NoExamsFoundIllustration = () => (
  <View className="items-center justify-center p-8">
    <View className="relative">
      {/* Search Glass */}
      <View className="w-16 h-16 border-4 border-gray-300 rounded-full items-center justify-center">
        <View className="w-8 h-8 border-2 border-gray-400 rounded-full" />
      </View>
      {/* Search Handle */}
      <View className="absolute bottom-2 right-2 w-6 h-1 bg-gray-400 rounded-full transform rotate-45" />
      {/* Cross/X mark inside */}
      <View className="absolute inset-0 items-center justify-center">
        <View className="w-6 h-0.5 bg-red-400 rounded-full transform rotate-45" />
        <View className="w-6 h-0.5 bg-red-400 rounded-full transform -rotate-45 absolute" />
      </View>
      {/* Floating dots */}
      <View className="absolute -top-2 -left-2 w-2 h-2 bg-blue-300 rounded-full opacity-60" />
      <View className="absolute -bottom-1 -left-3 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-60" />
      <View className="absolute -top-1 right-6 w-1 h-1 bg-green-300 rounded-full opacity-60" />
    </View>
  </View>
)

const LoadingIllustration = () => (
  <View className="items-center justify-center p-8">
    <View className="relative">
      {/* Books Stack */}
      <View className="relative">
        <View className="w-20 h-3 bg-blue-400 rounded-sm mb-1 transform -rotate-2" />
        <View className="w-20 h-3 bg-green-400 rounded-sm mb-1 transform rotate-1" />
        <View className="w-20 h-3 bg-purple-400 rounded-sm transform -rotate-1" />
      </View>
      {/* Clock */}
      <View className="absolute -top-2 -right-4 w-12 h-12 bg-white border-2 border-gray-300 rounded-full items-center justify-center">
        <View className="w-0.5 h-3 bg-gray-600 rounded-full absolute" style={{ transform: [{ rotate: "90deg" }] }} />
        <View className="w-0.5 h-2 bg-gray-600 rounded-full absolute" style={{ transform: [{ rotate: "180deg" }] }} />
        <View className="w-1 h-1 bg-gray-600 rounded-full" />
      </View>
      {/* Loading dots */}
      <View className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex-row">
        <View className="w-2 h-2 bg-blue-400 rounded-full mx-1 animate-pulse" />
        <View className="w-2 h-2 bg-green-400 rounded-full mx-1 animate-pulse" style={{ animationDelay: "0.2s" }} />
        <View className="w-2 h-2 bg-purple-400 rounded-full mx-1 animate-pulse" style={{ animationDelay: "0.4s" }} />
      </View>
    </View>
  </View>
)

const EmptyFilterIllustration = ({ filterType }: { filterType: FilterType }) => {
  const getFilterSpecificElements = () => {
    switch (filterType) {
      case "TODAY":
        return (
          <>
            <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center border-2 border-red-200">
              <Typography className="text-2xl">📅</Typography> 
            </View>
            <View className="absolute -top-1 -right-1 w-6 h-6 bg-red-400 rounded-full items-center justify-center">
              <Typography className="text-white text-xs font-bold">0</Typography> 
            </View>
          </>
        )
      case "UPCOMING":
        return (
          <>
            <View className="w-16 h-16 bg-orange-100 rounded-full items-center justify-center border-2 border-orange-200">
              <Typography className="text-2xl">⏰</Typography> 
            </View>
            <View className="absolute -top-1 -right-1 w-6 h-6 bg-orange-400 rounded-full items-center justify-center">
              <Typography className="text-white text-xs font-bold">0</Typography> 
            </View>
          </>
        )
      case "COMPLETED":
        return (
          <>
            <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center border-2 border-green-200">
              <Typography className="text-2xl">✅</Typography> 
            </View>
            <View className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full items-center justify-center">
              <Typography className="text-white text-xs font-bold">0</Typography> 
            </View>
          </>
        )
      default:
        return (
          <>
            <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center border-2 border-gray-200">
              <Typography className="text-2xl">📋</Typography> 
            </View>
            <View className="absolute -top-1 -right-1 w-6 h-6 bg-gray-400 rounded-full items-center justify-center">
              <Typography className="text-white text-xs font-bold">0</Typography> 
            </View>
          </>
        )
    }
  }

  return (
    <View className="items-center justify-center p-8">
      <View className="relative">
        {getFilterSpecificElements()}
        {/* Floating elements */}
        <View className="absolute -left-3 top-3 w-2 h-2 bg-blue-300 rounded-full opacity-60" />
        <View className="absolute -right-2 bottom-4 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-60" />
        <View className="absolute left-6 -bottom-2 w-1 h-1 bg-green-300 rounded-full opacity-60" />
      </View>
    </View>
  )
}

// Types from the service
interface ExamSchedule {
  exam_id: string
  exam_name: string
  session: string
  start_date: string | null
  end_date: string | null
  subjects: Subject[]
  total_subjects?: number
  exam_type?: string
  instructions?: string
}

interface Subject {
  _id: string
  subject_id: string
  subject_name: string
  subject_code: string
  subject_type: "THEORETICAL" | "PRACTICAL" | "BOTH"
  max_marks: number
  pass_marks: number | null
  schedule_at: string
}

type FilterType = "ALL" | "TODAY" | "UPCOMING" | "COMPLETED"

const ExamScheduleScreen: React.FC = () => {
  // State management
  const [examData, setExamData] = useState<ExamSchedule | null>(null)
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([])
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("ALL")
  const [showExamModal, setShowExamModal] = useState(false)
  const [selectedExamDetail, setSelectedExamDetail] = useState<Subject | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Safe date parsing
  const safeParseDateString = (dateString: string | undefined | null): Date | null => {
    if (!dateString) return null
    try {
      const date = new Date(dateString)
      if (!isNaN(date.getTime())) {
        return date
      }
      return null
    } catch (error) {
      return null
    }
  }

  // Get exam status
  const getExamStatus = (scheduleAt: string) => {
    const examDate = safeParseDateString(scheduleAt)
    if (!examDate) return { status: "unknown", color: "#BDC3C7", days: 0 }

    if (isPast(examDate)) {
      return { status: "completed", color: "#2ECC71", days: 0 }
    } else if (isToday(examDate)) {
      return { status: "today", color: "#E74C3C", days: 0 }
    } else if (isTomorrow(examDate)) {
      return { status: "tomorrow", color: "#F39C12", days: 1 }
    } else {
      const days = differenceInDays(examDate, new Date())
      return { status: "upcoming", color: "#6A5ACD", days }
    }
  }

  // Format date display
  const formatDateDisplay = (scheduleAt: string) => {
    const date = safeParseDateString(scheduleAt)
    if (!date) return "Date not available"

    try {
      if (isToday(date)) {
        return "Today"
      } else if (isTomorrow(date)) {
        return "Tomorrow"
      } else {
        return format(date, "dd MMM yyyy")
      }
    } catch (error) {
      return format(date, "dd/MM/yyyy")
    }
  }

  // Format time display
  const formatTimeDisplay = (scheduleAt: string) => {
    const date = safeParseDateString(scheduleAt)
    if (!date) return "Time not available"

    try {
      return format(date, "hh:mm a")
    } catch (error) {
      return "Time not available"
    }
  }

  // Get subject color
  const getSubjectColor = (subject: string) => {
    const colorMap: { [key: string]: string } = {
      Mathematics: "#6A5ACD",
      Physics: "#00BCD4",
      Chemistry: "#2ECC71",
      Biology: "#FFC107",
      English: "#E91E63",
      History: "#795548",
    }
    return colorMap[subject] || "#BDC3C7"
  }

  // Fetch exam schedule
  const fetchExamSchedule = async () => {
    setIsLoading(true)
    try {
      const scheduleData = await get_latest_exam_schedule()
      setExamData(scheduleData)
      if (scheduleData?.subjects) {
        // Set initial filtered subjects based on current filter
        const initialFiltered = scheduleData.subjects.sort((a:any, b:any) => {
          const dateA = safeParseDateString(a.schedule_at)
          const dateB = safeParseDateString(b.schedule_at)
          if (!dateA && !dateB) return 0
          if (!dateA) return 1
          if (!dateB) return -1
          return dateA.getTime() - dateB.getTime()
        })
        setFilteredSubjects(initialFiltered)
      }
    } catch (error) {
      console.error("Error fetching exam schedule:", error)
      Alert.alert("Error", "Failed to fetch exam schedule. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh handler
  const onRefresh = async () => {
    setRefreshing(true)
    await fetchExamSchedule()
    setRefreshing(false)
  }

  // Filter subjects
  const filterSubjects = (filterType: FilterType) => {
    // if (!examData?.subjects) {
    //   setFilteredSubjects([])
    //   setSelectedFilter(filterType)
    //   return
    // }

    // let filtered = [...examData.subjects]

    // switch (filterType) {
    //   case "TODAY":
    //     filtered = filtered.filter((subject) => {
    //       const date = safeParseDateString(subject.schedule_at)
    //       return date ? isToday(date) : false
    //     })
    //     break
    //   case "UPCOMING":
    //     filtered = filtered.filter((subject) => {
    //       const date = safeParseDateString(subject.schedule_at)
    //       return date ? !isPast(date) && !isToday(date) : false
    //     })
    //     break
    //   case "COMPLETED":
    //     filtered = filtered.filter((subject) => {
    //       const date = safeParseDateString(subject.schedule_at)
    //       return date ? isPast(date) : false
    //     })
    //     break
    //   default:
    //     // ALL - no filtering needed
    //     break
    // }

    // // Sort by date
    // filtered.sort((a, b) => {
    //   const dateA = safeParseDateString(a.schedule_at)
    //   const dateB = safeParseDateString(b.schedule_at)
    //   if (!dateA && !dateB) return 0
    //   if (!dateA) return 1
    //   if (!dateB) return -1
    //   return dateA.getTime() - dateB.getTime()
    // })

    // setFilteredSubjects(filtered)
    // setSelectedFilter(filterType)
  }

  // Get schedule stats
  const getScheduleStats = () => {
    if (!examData?.subjects) return { total: 0, today: 0, upcoming: 0, completed: 0 }

    const total = examData.subjects.length
    const today = examData.subjects.filter((subject) => {
      const date = safeParseDateString(subject.schedule_at)
      return date ? isToday(date) : false
    }).length
    const upcoming = examData.subjects.filter((subject) => {
      const date = safeParseDateString(subject.schedule_at)
      return date ? !isPast(date) && !isToday(date) : false
    }).length
    const completed = examData.subjects.filter((subject) => {
      const date = safeParseDateString(subject.schedule_at)
      return date ? isPast(date) : false
    }).length

    return { total, today, upcoming, completed }
  }

  // Set reminder handler
  const handleSetReminder = async (subject: Subject) => {
    // try {
    //   if (!examData) return

    //   // Set reminder for 1 day before the exam
    //   const examDate = safeParseDateString(subject.schedule_at)
    //   if (!examDate) return

    //   const reminderDate = new Date(examDate)
    //   reminderDate.setDate(reminderDate.getDate() - 1)

    //   await set_exam_reminder(examData.exam_id, subject.subject_id, reminderDate.toISOString())
    //   Alert.alert("Success", "Reminder set successfully!")
    // } catch (error) {
    //   console.error("Error setting reminder:", error)
    //   Alert.alert("Error", "Failed to set reminder. Please try again.")
    // }
  }

  // Download admit card handler (placeholder - you'll need to implement file download)
  const handleDownloadAdmitCard = async (subject: Subject) => {
    try {
      // This is a placeholder - you'll need to implement actual file download
      Alert.alert(
        "Info",
        "Admit card download functionality will be implemented based on your file handling requirements.",
      )
    } catch (error) {
      console.error("Error downloading admit card:", error)
      Alert.alert("Error", "Failed to download admit card. Please try again.")
    }
  }

  useEffect(() => {
    fetchExamSchedule()
  }, [])

  useEffect(() => {
    if (examData) {
      filterSubjects(selectedFilter)
    }
  }, [examData])

  // Add a separate useEffect for when selectedFilter changes
  useEffect(() => {
    if (examData) {
      filterSubjects(selectedFilter)
    }
  }, [selectedFilter])

  const stats = getScheduleStats()
  const examTypes = [
    { id: "ALL", label: "All", icon: "list", color: "#6A5ACD" },
    { id: "TODAY", label: "Today", icon: "today", color: "#E74C3C" },
    { id: "UPCOMING", label: "Upcoming", icon: "schedule", color: "#F39C12" },
    { id: "COMPLETED", label: "Completed", icon: "check-circle", color: "#2ECC71" },
  ]

  if (isLoading && !examData) {
    return (
      <View className="flex-1 bg-[#F0F4F8] justify-center items-center">
        <LoadingIllustration />
        <Typography className="text-lg font-semibold text-[#2C3E50] mt-4">Loading exam schedule...</Typography> 
        <Typography className="text-sm text-[#7F8C8D] mt-2 text-center px-8">
          Please wait while we fetch your latest exam information
        </Typography> 
      </View>
    )
  }

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
          <Typography className="text-xl font-bold text-white">Exam Schedule</Typography> 
        </View>
        <TouchableOpacity className="p-2" onPress={onRefresh}>
          <Icon name="refresh" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {!examData ? (
        <View className="px-4 mt-8">
          <View className="bg-white rounded-2xl p-6 shadow-lg elevation-5 items-center">
            <NoScheduleIllustration />
            <Typography className="text-lg font-bold text-[#2C3E50] mt-4 mb-2">No Exam Schedule Available</Typography> 
            <Typography className="text-sm text-[#7F8C8D] text-center mb-4">
              The exam schedule has not been published yet. Please check back later or contact your academic office.
            </Typography> 
            <TouchableOpacity className="bg-[#6A5ACD] px-6 py-3 rounded-xl" onPress={onRefresh}>
              <Typography className="text-white font-semibold">Refresh</Typography> 
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          {/* Exam Overview Card */}
          <View className="px-4 -mt-8 mb-5">
            <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <Typography className="text-lg font-bold text-[#2C3E50]">{examData.exam_name}</Typography> 
                  <Typography className="text-sm text-[#7F8C8D]">Session: {examData.session}</Typography> 
                  {examData.start_date && examData.end_date && (
                    <Typography className="text-xs text-[#7F8C8D] mt-1">
                      {format(new Date(examData.start_date), "dd MMM")} -{" "}
                      {format(new Date(examData.end_date), "dd MMM yyyy")}
                    </Typography> 
                  )}
                </View>
              </View>
              <View className="flex-row justify-between">
                <View className="items-center">
                  <Typography className="text-2xl font-bold text-[#6A5ACD]">{stats.total}</Typography> 
                  <Typography className="text-xs text-[#7F8C8D]">Total Subjects</Typography> 
                </View>
                <View className="items-center">
                  <Typography className="text-2xl font-bold text-[#2ECC71]">{stats.completed}</Typography> 
                  <Typography className="text-xs text-[#7F8C8D]">Completed</Typography> 
                </View>
                <View className="items-center">
                  <Typography className="text-2xl font-bold text-[#F39C12]">{stats.upcoming}</Typography> 
                  <Typography className="text-xs text-[#7F8C8D]">Upcoming</Typography> 
                </View>
                <View className="items-center">
                  <Typography className="text-2xl font-bold text-[#E74C3C]">{stats.today}</Typography> 
                  <Typography className="text-xs text-[#7F8C8D]">Today</Typography> 
                </View>
              </View>
            </View>
          </View>

          {/* Filter Selector */}
          <View className="px-4 mb-5">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {examTypes.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  className={`flex-row items-center px-4 py-2.5 mr-3 rounded-[20px] border ${
                    selectedFilter === filter.id ? "border-[#6A5ACD]" : "bg-white border-[#DDE4EB]"
                  }`}
                  style={selectedFilter === filter.id ? { backgroundColor: `${filter.color}20` } : {}}
                  onPress={() => filterSubjects(filter.id as FilterType)}
                >
                  <Icon name={filter.icon} size={16} color={filter.color} />
                  <Typography
                    className={`text-sm font-semibold ml-2 ${
                      selectedFilter === filter.id ? "text-[#2C3E50]" : "text-[#7F8C8D]"
                    }`}
                  >
                    {filter.label}
                  </Typography> 
                  {filter.id === "TODAY" && stats.today > 0 && (
                    <View className="ml-2 bg-[#E74C3C] rounded-full px-2 py-0.5">
                      <Typography className="text-xs text-white font-bold">{stats.today}</Typography> 
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Exam Schedule */}
          <View className="px-4 mb-8">
            <Typography className="text-xl font-bold text-[#2C3E50] mb-4"> Scheduled Subjects</Typography> 
            {filteredSubjects.length === 0 ? (
              <View className="bg-white rounded-2xl p-6 shadow-lg elevation-5 items-center">
                <EmptyFilterIllustration filterType={selectedFilter} />
                <Typography className="text-lg font-bold text-[#2C3E50] mt-4 mb-2">
                  {selectedFilter === "ALL"
                    ? "No Exams Scheduled"
                    : selectedFilter === "TODAY"
                      ? "No Exams Today"
                      : selectedFilter === "UPCOMING"
                        ? "No Upcoming Exams"
                        : "No Completed Exams"}
                </Typography> 
                <Typography className="text-sm text-[#7F8C8D] text-center mb-4">
                  {selectedFilter === "ALL"
                    ? "There are no exams scheduled at the moment."
                    : selectedFilter === "TODAY"
                      ? "You don't have any exams scheduled for today. Enjoy your free time!"
                      : selectedFilter === "UPCOMING"
                        ? "All your exams are either completed or scheduled for today."
                        : "You haven't completed any exams yet. Keep preparing!"}
                </Typography> 
                {selectedFilter !== "ALL" && (
                  <TouchableOpacity className="bg-[#6A5ACD] px-6 py-3 rounded-xl" onPress={() => filterSubjects("ALL")}>
                    <Typography className="text-white font-semibold">View All Exams</Typography> 
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View className="gap-4">
                {filteredSubjects.map((exam, index) => {
                  const examStatus = getExamStatus(exam.schedule_at)
                  return (
                    <TouchableOpacity
                      key={exam.subject_id}
                      className="bg-white rounded-2xl p-4 shadow-lg elevation-5"
                      onPress={() => {
                        setSelectedExamDetail(exam)
                        setShowExamModal(true)
                      }}
                    >
                      {/* Header */}
                      <View className="flex-row items-center justify-between mb-3">
                        <View className="flex-row items-center flex-1">
                          <View
                            className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                            style={{ backgroundColor: `${getSubjectColor(exam.subject_name)}20` }}
                          >
                            <Typography className="text-lg font-bold" style={{ color: getSubjectColor(exam.subject_name) }}>
                              {index + 1}
                            </Typography> 
                          </View>
                          <View className="flex-1">
                            <Typography className="text-base font-bold text-[#2C3E50]">{exam.subject_name}</Typography> 
                            <Typography className="text-sm text-[#7F8C8D]">{exam.subject_code}</Typography> 
                          </View>
                        </View>
                        <View className="items-end">
                          <View
                            className="px-2 py-1 rounded-lg mb-1"
                            style={{ backgroundColor: `${examStatus.color}20` }}
                          >
                            <Typography className="text-[10px] font-bold" style={{ color: examStatus.color }}>
                              {examStatus.status.toUpperCase()}
                            </Typography> 
                          </View>
                          {examStatus.status === "upcoming" && examStatus.days > 0 && (
                            <Typography className="text-xs text-[#F39C12] font-semibold">{examStatus.days} days left</Typography> 
                          )}
                        </View>
                      </View>

                      {/* Date & Time */}
                      <View className="bg-[#F8F9FA] rounded-xl p-3 mb-3">
                        <View className="flex-row justify-between items-center mb-2">
                          <View className="flex-row items-center">
                            <Icon name="event" size={16} color="#6A5ACD" />
                            <Typography className="text-sm font-semibold text-[#2C3E50] ml-2">
                              {formatDateDisplay(exam.schedule_at)}
                            </Typography> 
                          </View>
                          <View className="flex-row items-center">
                            <Icon name="access-time" size={16} color="#F39C12" />
                            <Typography className="text-sm font-semibold text-[#2C3E50] ml-2">
                              {formatTimeDisplay(exam.schedule_at)}
                            </Typography> 
                          </View>
                        </View>
                        <View className="flex-row justify-between items-center">
                          <View className="flex-row items-center">
                            <Icon name="category" size={16} color="#2ECC71" />
                            <Typography className="text-sm text-[#2C3E50] ml-2">{exam.subject_type}</Typography> 
                          </View>
                          <View className="flex-row items-center">
                            <Icon name="grade" size={16} color="#E74C3C" />
                            <Typography className="text-sm text-[#2C3E50] ml-2">{exam.max_marks} marks</Typography> 
                          </View>
                        </View>
                      </View>

                      {/* Quick Info */}
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <Icon name="info" size={16} color="#7F8C8D" />
                          <Typography className="text-sm text-[#7F8C8D] ml-2">
                            {exam.pass_marks ? `Pass: ${exam.pass_marks}` : "No pass marks"}
                          </Typography> 
                        </View>
                        <Icon name="chevron-right" size={16} color="#7F8C8D" />
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </View>
            )}
          </View>
        </>
      )}

      {/* Exam Detail Modal */}
      <Modal
        visible={showExamModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowExamModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[25px] p-5 max-h-[90%]">
            <View className="flex-row justify-between items-center mb-5">
              <Typography className="text-xl font-bold text-[#2C3E50] flex-1 mr-4">Exam Details</Typography> 
              <TouchableOpacity onPress={() => setShowExamModal(false)}>
                <Icon name="close" size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>
            {selectedExamDetail && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Subject Header */}
                <View className="items-center mb-6">
                  <View
                    className="w-16 h-16 rounded-full items-center justify-center mb-3"
                    style={{ backgroundColor: `${getSubjectColor(selectedExamDetail.subject_name)}20` }}
                  >
                    <Icon name="quiz" size={32} color={getSubjectColor(selectedExamDetail.subject_name)} />
                  </View>
                  <Typography className="text-xl font-bold text-[#2C3E50] text-center mb-2">
                    {selectedExamDetail.subject_name}
                  </Typography> 
                  <Typography className="text-sm text-[#7F8C8D] text-center mb-2">{selectedExamDetail.subject_code}</Typography> 
                  <View
                    className="px-4 py-2 rounded-xl"
                    style={{ backgroundColor: `${getExamStatus(selectedExamDetail.schedule_at).color}20` }}
                  >
                    <Typography
                      className="text-sm font-bold"
                      style={{ color: getExamStatus(selectedExamDetail.schedule_at).color }}
                    >
                      {getExamStatus(selectedExamDetail.schedule_at).status.toUpperCase()}
                    </Typography> 
                  </View>
                </View>

                {/* Exam Info */}
                <View className="bg-[#F8F9FA] rounded-2xl p-4 mb-6">
                  <View className="flex-row justify-between mb-3">
                    <View>
                      <Typography className="text-xs text-[#7F8C8D] mb-1">Date</Typography> 
                      <Typography className="text-sm font-semibold text-[#2C3E50]">
                        {formatDateDisplay(selectedExamDetail.schedule_at)}
                      </Typography> 
                    </View>
                    <View>
                      <Typography className="text-xs text-[#7F8C8D] mb-1">Time</Typography> 
                      <Typography className="text-sm font-semibold text-[#2C3E50]">
                        {formatTimeDisplay(selectedExamDetail.schedule_at)}
                      </Typography> 
                    </View>
                  </View>
                  <View className="flex-row justify-between mb-3">
                    <View>
                      <Typography className="text-xs text-[#7F8C8D] mb-1">Type</Typography> 
                      <Typography className="text-sm font-semibold text-[#2C3E50]">{selectedExamDetail.subject_type}</Typography> 
                    </View>
                    <View>
                      <Typography className="text-xs text-[#7F8C8D] mb-1">Max Marks</Typography> 
                      <Typography className="text-sm font-semibold text-[#6A5ACD]">{selectedExamDetail.max_marks}</Typography> 
                    </View>
                  </View>
                  {selectedExamDetail.pass_marks && (
                    <View>
                      <Typography className="text-xs text-[#7F8C8D] mb-1">Pass Marks</Typography> 
                      <Typography className="text-sm font-semibold text-[#2C3E50]">{selectedExamDetail.pass_marks}</Typography> 
                    </View>
                  )}
                </View>

                {/* Countdown */}
                {getExamStatus(selectedExamDetail.schedule_at).status === "upcoming" && (
                  <View className="bg-[#F39C1210] border border-[#F39C1230] rounded-2xl p-4 mb-6">
                    <View className="items-center">
                      <Icon name="schedule" size={32} color="#F39C12" />
                      <Typography className="text-2xl font-bold text-[#F39C12] mt-2">
                        {getExamStatus(selectedExamDetail.schedule_at).days} Days Left
                      </Typography> 
                      <Typography className="text-sm text-[#7F8C8D] text-center mt-1">
                        Make sure to prepare well and arrive 15 minutes early
                      </Typography> 
                    </View>
                  </View>
                )}

                {/* Actions */}
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    className="flex-1 bg-[#6A5ACD] rounded-xl py-4 items-center"
                    onPress={() => handleDownloadAdmitCard(selectedExamDetail)}
                  >
                    <Typography className="text-base font-bold text-white">Download Admit Card</Typography> 
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 bg-[#F8F9FA] border border-[#DDE4EB] rounded-xl py-4 items-center"
                    onPress={() => handleSetReminder(selectedExamDetail)}
                  >
                    <Typography className="text-base font-bold text-[#2C3E50]">Set Reminder</Typography> 
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

export default ExamScheduleScreen
