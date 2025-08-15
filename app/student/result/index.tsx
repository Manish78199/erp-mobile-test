

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert, RefreshControl, ActivityIndicator } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { Link } from "expo-router"
import { get_sessional_exams, get_exam_result } from "@/service/student/result"
import { Typography } from "@/components/Typography"

// Types
interface Subject {
  subject_name: string
  subject_type: "THEORETICAL" | "PRACTICAL" | "BOTH"
  marks_obtained: {
    written?: number
    practical?: number
    total: number
  }
  grade: string
  status: "PASS" | "FAIL"
  absent?: boolean
}

interface ExamResult {
  subjects: Subject[]
  total_obtained: number
  total_max: number
  final_result: {
    result_type: string
    value: string
    grade: string
    remark: string
  }
}

interface Exam {
  _id: string
  name: string
}

interface SessionExams {
  [session: string]: Exam[]
}

// Custom Empty State Illustrations
const NoResultsIllustration = () => (
  <View className="items-center justify-center p-8">
    <View className="relative">
      <View className="w-20 h-16 bg-gray-200 rounded-lg border-2 border-gray-300 items-center justify-center">
        <Icon name="assessment" size={32} color="#BDC3C7" />
      </View>
      <View className="absolute -top-2 -right-2 w-8 h-8 bg-orange-400 rounded-full items-center justify-center">
        <Typography className="text-white font-bold text-lg">?</Typography> 
      </View>
      <View className="absolute -left-3 top-3 w-2 h-2 bg-blue-300 rounded-full opacity-60" />
      <View className="absolute -right-1 bottom-2 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-60" />
    </View>
  </View>
)

const LoadingResultsIllustration = () => (
  <View className="items-center justify-center p-8">
    <View className="relative">
      <View className="w-16 h-20 bg-blue-100 rounded-lg border-2 border-blue-200 items-center justify-center">
        <Icon name="grade" size={28} color="#6A5ACD" />
      </View>
      <View className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-gray-300 rounded-full items-center justify-center">
        <ActivityIndicator size="small" color="#6A5ACD" />
      </View>
      <View className="absolute -left-3 bottom-3 w-2 h-2 bg-green-300 rounded-full opacity-60" />
      <View className="absolute right-2 -bottom-1 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-60" />
    </View>
  </View>
)

// Result Grid Component
const ResultGrid: React.FC<{ exam: Exam; onResultLoad?: (result: ExamResult) => void }> = ({ exam, onResultLoad }) => {
  const [result, setResult] = useState<ExamResult | null>(null)
  const [isLoaded, setLoaded] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const fetchResult = async () => {
    if (isLoaded) return
    setLoading(true)
    try {
      const examResult = await get_exam_result(exam._id)
      setResult(examResult)
      setLoaded(true)
      onResultLoad?.(examResult)
    } catch (error) {
      console.error("Failed to fetch exam result:", error)
      Alert.alert("Error", "Failed to fetch exam result")
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
    if (!isExpanded && !isLoaded) {
      fetchResult()
    }
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
        return "#10B981"
      case "A":
        return "#059669"
      case "B":
        return "#3B82F6"
      case "C":
        return "#F59E0B"
      case "D":
        return "#F97316"
      case "F":
        return "#EF4444"
      default:
        return "#6B7280"
    }
  }

  const getPercentage = () => {
    if (!result) return 0
    return Math.round(((result?.total_obtained || 0)/ (result?.total_max || 0)) * 100)
  }

  const getStatusColor = (status: string) => {
    return status === "PASS" ? "#10B981" : "#EF4444"
  }

  return (
    <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5 mb-4">
      <TouchableOpacity onPress={handleToggle}>
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center flex-1">
            <View className="w-10 h-10 bg-indigo-100 rounded-lg items-center justify-center mr-3">
              <Icon name="assessment" size={20} color="#6366F1" />
            </View>
            <View className="flex-1">
              <Typography className="text-base font-bold text-[#2C3E50]">{exam?.name}</Typography> 
              {result && (
                <Typography className="text-sm text-[#7F8C8D] mt-1">
                  {(result?.total_obtained || 0)}/{(result?.total_max || 0)} ({getPercentage()}%)
                </Typography> 
              )}
            </View>
          </View>
          <View className="flex-row items-center">
            {result && (
              <View
                className="px-3 py-1 rounded-lg mr-2"
                style={{ backgroundColor: `${getGradeColor(result?.final_result?.grade)}20` }}
              >
                <Typography className="text-xs font-bold" style={{ color: getGradeColor(result?.final_result?.grade) }}>
                  Grade {result?.final_result?.grade || "--"}
                </Typography> 
              </View>
            )}
            <Icon name={isExpanded ? "expand-less" : "expand-more"} size={24} color="#7F8C8D" />
          </View>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View>
          {isLoading && (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color="#6A5ACD" />
              <Typography className="text-sm text-[#7F8C8D] mt-2">Loading result...</Typography> 
            </View>
          )}

          {!isLoading && result && (
            <View>
              {/* Summary Cards */}
              <View className="flex-row justify-between mb-4">
                <View className="bg-[#F8F9FA] rounded-xl p-3 flex-1 mr-2 items-center">
                  <Icon name="moving" size={20} color="#3B82F6" />
                  <Typography className="text-lg font-bold text-[#2C3E50] mt-1">
                    {result?.total_obtained || 0}/{result?.total_max || 0}
                  </Typography> 
                  <Typography className="text-xs text-[#7F8C8D]">Total Score</Typography> 
                  <Typography className="text-xs text-[#7F8C8D]">{getPercentage()}%</Typography> 
                </View>
                <View className="bg-[#F8F9FA] rounded-xl p-3 flex-1 mx-1 items-center">
                  <Icon name="grade" size={20} color="#10B981" />
                  <Typography className="text-lg font-bold text-[#2C3E50] mt-1">{result?.final_result?.grade}</Typography> 
                  <Typography className="text-xs text-[#7F8C8D]">Final Grade</Typography> 
                  <Typography className="text-xs text-[#10B981]">{result?.final_result?.remark}</Typography> 
                </View>
                <View className="bg-[#F8F9FA] rounded-xl p-3 flex-1 ml-2 items-center">
                  <Icon name="emoji-events" size={20} color="#F59E0B" />
                  <Typography className="text-lg font-bold text-[#2C3E50] mt-1">{result?.final_result?.value}</Typography> 
                  <Typography className="text-xs text-[#7F8C8D]">{result?.final_result?.result_type}</Typography> 
                  <Typography className="text-xs text-[#7F8C8D]">Performance</Typography> 
                </View>
              </View>

              {/* Subjects List */}
              <View className="mb-4">
                <Typography className="text-base font-bold text-[#2C3E50] mb-3">Subject-wise Results</Typography> 
                <View className="gap-3">
                  {result?.subjects?.map((subject, idx) => (
                    <View key={idx} className="bg-[#F8F9FA] rounded-xl p-3">
                      <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-1">
                          <Typography className="text-sm font-semibold text-[#2C3E50]">{subject?.subject_name}</Typography> 
                          <Typography className="text-xs text-[#7F8C8D]">{subject?.subject_type}</Typography> 
                        </View>
                        <View className="items-end">
                          <View
                            className="px-2 py-1 rounded-lg mb-1"
                            style={{ backgroundColor: `${getGradeColor(subject?.grade)}20` }}
                          >
                            <Typography className="text-xs font-bold" style={{ color: getGradeColor(subject?.grade) }}>
                              {subject?.grade}
                            </Typography> 
                          </View>
                          <View
                            className="px-2 py-1 rounded-lg"
                            style={{ backgroundColor: `${getStatusColor(subject?.status)}20` }}
                          >
                            <Typography className="text-xs font-bold" style={{ color: getStatusColor(subject?.status) }}>
                              {subject?.status}
                            </Typography> 
                          </View>
                        </View>
                      </View>

                      <View className="flex-row justify-between items-center">
                        <View className="flex-row gap-4">
                          {["THEORETICAL", "BOTH"].includes(subject?.subject_type) && (
                            <View>
                              <Typography className="text-xs text-[#7F8C8D]">Theory</Typography> 
                              <Typography className="text-sm font-semibold text-[#2C3E50]">
                                {subject.absent ? "AB" : subject?.marks_obtained?.written || "--"}
                              </Typography> 
                            </View>
                          )}
                          {["PRACTICAL", "BOTH"].includes(subject?.subject_type) && (
                            <View>
                              <Typography className="text-xs text-[#7F8C8D]">Practical</Typography> 
                              <Typography className="text-sm font-semibold text-[#2C3E50]">
                                {subject?.marks_obtained?.practical || "--"}
                              </Typography> 
                            </View>
                          )}
                          <View>
                            <Typography className="text-xs text-[#7F8C8D]">Total</Typography> 
                            <Typography className="text-sm font-bold text-[#6A5ACD]">{subject?.marks_obtained?.total}</Typography> 
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Performance Summary */}
              <View className="bg-[#F8F9FA] rounded-xl p-4">
                <Typography className="text-sm font-bold text-[#2C3E50] mb-3 flex-row items-center">
                  <Icon name="trending-up" size={16} color="#6A5ACD" />
                  <Typography className="ml-2">Performance Summary</Typography> 
                </Typography> 
                <View className="flex-row justify-between mb-2">
                  <Typography className="text-sm text-[#7F8C8D]">Total Marks:</Typography> 
                  <Typography className="text-sm font-semibold text-[#2C3E50]">
                    {result?.total_obtained || 0}/{result?.total_max || 0}
                  </Typography> 
                </View>
                <View className="flex-row justify-between mb-2">
                  <Typography className="text-sm text-[#7F8C8D]">Percentage:</Typography> 
                  <Typography className="text-sm font-semibold text-[#2C3E50]">{getPercentage()}%</Typography> 
                </View>
                <View className="flex-row justify-between mb-2">
                  <Typography className="text-sm text-[#7F8C8D]">Grade:</Typography> 
                  <Typography className="text-sm font-semibold text-[#2C3E50]">{result?.final_result?.grade}</Typography> 
                </View>
                <View className="flex-row justify-between">
                  <Typography className="text-sm text-[#7F8C8D]">Remark:</Typography> 
                  <Typography className="text-sm font-semibold text-[#2C3E50]">{result?.final_result?.remark}</Typography> 
                </View>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  )
}

const ResultScreen: React.FC = () => {
  // State management
  const [sessionExams, setSessionExams] = useState<SessionExams | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedSession, setSelectedSession] = useState<string>("all")
  const [showSessionModal, setShowSessionModal] = useState(false)
  const [showSubjectModal, setShowSubjectModal] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [loadedResults, setLoadedResults] = useState<ExamResult[]>([])

  // Fetch sessional exams
  const fetchSessionalExams = async () => {
    setIsLoading(true)
    try {
      const examDetails = await get_sessional_exams()
      setSessionExams(examDetails)
    } catch (error) {
      console.error("Failed to fetch sessional exams:", error)
      Alert.alert("Error", "Failed to fetch exam sessions")
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh handler
  const onRefresh = async () => {
    setRefreshing(true)
    await fetchSessionalExams()
    setRefreshing(false)
  }

  // Handle result load
  const handleResultLoad = (result: ExamResult) => {
    setLoadedResults((prev) => {
      const exists = prev.find((r) => r?.final_result?.value === result?.final_result?.value)
      if (!exists) {
        return [...prev, result]
      }
      return prev
    })
  }

  // Get filtered sessions
  const getFilteredSessions = () => {
    if (!sessionExams) return {}
    if (selectedSession === "all") return sessionExams
    return { [selectedSession]: sessionExams[selectedSession] }
  }

  // Get statistics
  const getResultStats = () => {
    if (!sessionExams) return { totalSessions: 0, totalExams: 0, avgPercentage: 0, totalSubjects: 0 }

    const totalSessions = Object.keys(sessionExams).length
    const totalExams = Object.values(sessionExams).reduce((sum, exams) => sum + exams.length, 0)

    let totalPercentage = 0
    let totalSubjects = 0

    loadedResults.forEach((result) => {
      totalPercentage += Math.round(((result?.total_obtained || 0) / (result?.total_max || 0)) * 100)
      totalSubjects += result?.subjects?.length
    })

    const avgPercentage = loadedResults.length > 0 ? Math.round(totalPercentage / loadedResults.length) : 0

    return { totalSessions, totalExams, avgPercentage, totalSubjects }
  }

  // Get grade color
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
        return "#10B981"
      case "A":
        return "#059669"
      case "B":
        return "#3B82F6"
      case "C":
        return "#F59E0B"
      case "D":
        return "#F97316"
      case "F":
        return "#EF4444"
      default:
        return "#6B7280"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "PASS" ? "#10B981" : "#EF4444"
  }

  useEffect(() => {
    fetchSessionalExams()
  }, [])

  const stats = getResultStats()
  const filteredSessions = getFilteredSessions()

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
          <Typography className="text-xl font-bold text-white">Results</Typography> 
        </View>
        <TouchableOpacity className="p-2" onPress={onRefresh}>
          <Icon name="refresh" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Stats Overview */}
      <View className="px-4 -mt-8 mb-5">
        <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
          <Typography className="text-lg font-bold text-[#2C3E50] mb-4">Overview</Typography> 
          <View className="flex-row justify-between">
            <View className="items-center">
              <Typography className="text-2xl font-bold text-[#6A5ACD]">{stats.totalSessions}</Typography> 
              <Typography className="text-xs text-[#7F8C8D]">Sessions</Typography> 
            </View>
            <View className="items-center">
              <Typography className="text-2xl font-bold text-[#2ECC71]">{stats.totalExams}</Typography> 
              <Typography className="text-xs text-[#7F8C8D]">Exams</Typography> 
            </View>
            <View className="items-center">
              <Typography className="text-2xl font-bold text-[#F39C12]">{stats.avgPercentage}%</Typography> 
              <Typography className="text-xs text-[#7F8C8D]">Avg Score</Typography> 
            </View>
            <View className="items-center">
              <Typography className="text-2xl font-bold text-[#E74C3C]">{stats.totalSubjects}</Typography> 
              <Typography className="text-xs text-[#7F8C8D]">Subjects</Typography> 
            </View>
          </View>
        </View>
      </View>

      {/* Session Filter */}
      <View className="px-4 mb-5">
        <TouchableOpacity
          className="bg-white rounded-xl p-4 shadow-lg elevation-5 flex-row items-center justify-between"
          onPress={() => setShowSessionModal(true)}
        >
          <View className="flex-row items-center">
            <Icon name="filter-list" size={20} color="#6A5ACD" />
            <Typography className="text-base font-semibold text-[#2C3E50] ml-2">
              {selectedSession === "all" ? "All Sessions" : `Session ${selectedSession}`}
            </Typography> 
          </View>
          <Icon name="expand-more" size={20} color="#7F8C8D" />
        </TouchableOpacity>
      </View>

      {/* Loading State */}
      {isLoading && (
        <View className="px-4">
          <View className="bg-white rounded-2xl p-6 shadow-lg elevation-5 items-center">
            <LoadingResultsIllustration />
            <Typography className="text-lg font-semibold text-[#2C3E50] mt-4">Loading Results...</Typography> 
            <Typography className="text-sm text-[#7F8C8D] mt-2 text-center">
              Please wait while we fetch your examination results
            </Typography> 
          </View>
        </View>
      )}

      {/* Results */}
      {!isLoading && sessionExams && (
        <View className="px-4">
          {Object.keys(filteredSessions).length > 0 ? (
            <View className="gap-6">
              {Object.keys(filteredSessions).map((session, ind) => (
                <View key={ind}>
                  {/* Session Header */}
                  <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5 mb-4">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <View className="w-10 h-10 bg-blue-100 rounded-lg items-center justify-center mr-3">
                          <Icon name="school" size={20} color="#3B82F6" />
                        </View>
                        <View>
                          <Typography className="text-lg font-bold text-[#2C3E50]">Session {session}</Typography> 
                          <Typography className="text-sm text-[#7F8C8D]">
                            {filteredSessions[session].length} exam(s) available
                          </Typography> 
                        </View>
                      </View>
                      <View className="px-3 py-1 bg-blue-100 rounded-lg">
                        <Typography className="text-xs font-bold text-blue-800">
                          {filteredSessions[session].length} Exams
                        </Typography> 
                      </View>
                    </View>
                  </View>

                  {/* Exams */}
                  <View className="gap-4">
                    {filteredSessions[session].map((exam, examInd) => (
                      <ResultGrid key={examInd} exam={exam} onResultLoad={handleResultLoad} />
                    ))}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="bg-white rounded-2xl p-6 shadow-lg elevation-5 items-center">
              <NoResultsIllustration />
              <Typography className="text-lg font-bold text-[#2C3E50] mt-4 mb-2">No Results Available</Typography> 
              <Typography className="text-sm text-[#7F8C8D] text-center mb-4">
                Your examination results will appear here once they are published by your institution.
              </Typography> 
              <TouchableOpacity className="bg-[#6A5ACD] px-6 py-3 rounded-xl" onPress={onRefresh}>
                <Typography className="text-white font-semibold">Refresh</Typography> 
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Session Selection Modal */}
      <Modal
        visible={showSessionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSessionModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[25px] p-5 max-h-[60%]">
            <View className="flex-row justify-between items-center mb-5">
              <Typography className="text-xl font-bold text-[#2C3E50]">Select Session</Typography> 
              <TouchableOpacity onPress={() => setShowSessionModal(false)}>
                <Icon name="close" size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                className={`p-4 rounded-xl mb-3 ${selectedSession === "all" ? "bg-[#6A5ACD]" : "bg-[#F8F9FA]"}`}
                onPress={() => {
                  setSelectedSession("all")
                  setShowSessionModal(false)
                }}
              >
                <Typography
                  className={`text-base font-semibold ${selectedSession === "all" ? "text-white" : "text-[#2C3E50]"}`}
                >
                  All Sessions
                </Typography> 
              </TouchableOpacity>

              {sessionExams &&
                Object.keys(sessionExams).map((session) => (
                  <TouchableOpacity
                    key={session}
                    className={`p-4 rounded-xl mb-3 ${selectedSession === session ? "bg-[#6A5ACD]" : "bg-[#F8F9FA]"}`}
                    onPress={() => {
                      setSelectedSession(session)
                      setShowSessionModal(false)
                    }}
                  >
                    <View className="flex-row items-center justify-between">
                      <Typography
                        className={`text-base font-semibold ${
                          selectedSession === session ? "text-white" : "text-[#2C3E50]"
                        }`}
                      >
                        Session {session}
                      </Typography> 
                      <Typography className={`text-sm ${selectedSession === session ? "text-white" : "text-[#7F8C8D]"}`}>
                        {sessionExams[session].length} exams
                      </Typography> 
                    </View>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Subject Detail Modal */}
      <Modal
        visible={showSubjectModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSubjectModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[25px] p-5 max-h-[80%]">
            <View className="flex-row justify-between items-center mb-5">
              <Typography className="text-xl font-bold text-[#2C3E50] flex-1 mr-4">Subject Details</Typography> 
              <TouchableOpacity onPress={() => setShowSubjectModal(false)}>
                <Icon name="close" size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>

            {selectedSubject && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Subject Header */}
                <View className="items-center mb-6">
                  <View
                    className="w-16 h-16 rounded-full items-center justify-center mb-3"
                    style={{ backgroundColor: `${getGradeColor(selectedSubject.grade)}20` }}
                  >
                    <Icon name="subject" size={32} color={getGradeColor(selectedSubject.grade)} />
                  </View>
                  <Typography className="text-xl font-bold text-[#2C3E50] text-center mb-2">
                    {selectedSubject.subject_name}
                  </Typography> 
                  <Typography className="text-sm text-[#7F8C8D] text-center">{selectedSubject.subject_type}</Typography> 
                </View>

                {/* Grade & Marks */}
                <View className="bg-[#F8F9FA] rounded-2xl p-4 mb-6">
                  <View className="flex-row justify-between items-center mb-4">
                    <View className="items-center">
                      <Typography className="text-3xl font-bold" style={{ color: getGradeColor(selectedSubject.grade) }}>
                        {selectedSubject.grade}
                      </Typography> 
                      <Typography className="text-xs text-[#7F8C8D]">Grade</Typography> 
                    </View>
                    <View className="items-center">
                      <Typography className="text-3xl font-bold text-[#6A5ACD]">{selectedSubject.marks_obtained.total}</Typography> 
                      <Typography className="text-xs text-[#7F8C8D]">Total Marks</Typography> 
                    </View>
                    <View className="items-center">
                      <Typography className="text-3xl font-bold" style={{ color: getStatusColor(selectedSubject.status) }}>
                        {selectedSubject.status}
                      </Typography> 
                      <Typography className="text-xs text-[#7F8C8D]">Status</Typography> 
                    </View>
                  </View>
                </View>

                {/* Detailed Marks */}
                <View className="mb-6">
                  <Typography className="text-lg font-bold text-[#2C3E50] mb-3">Detailed Marks</Typography> 
                  <View className="gap-3">
                    {["THEORETICAL", "BOTH"].includes(selectedSubject.subject_type) && (
                      <View className="flex-row items-center justify-between p-3 bg-[#F8F9FA] rounded-xl">
                        <Typography className="text-sm text-[#7F8C8D]">Theory Marks</Typography> 
                        <Typography className="text-sm font-bold text-[#2C3E50]">
                          {selectedSubject.absent ? "Absent" : selectedSubject.marks_obtained.written || "--"}
                        </Typography> 
                      </View>
                    )}
                    {["PRACTICAL", "BOTH"].includes(selectedSubject.subject_type) && (
                      <View className="flex-row items-center justify-between p-3 bg-[#F8F9FA] rounded-xl">
                        <Typography className="text-sm text-[#7F8C8D]">Practical Marks</Typography> 
                        <Typography className="text-sm font-bold text-[#2C3E50]">
                          {selectedSubject.marks_obtained.practical || "--"}
                        </Typography> 
                      </View>
                    )}
                    <View className="flex-row items-center justify-between p-3 bg-[#F8F9FA] rounded-xl">
                      <Typography className="text-sm text-[#7F8C8D]">Total Marks</Typography> 
                      <Typography className="text-sm font-bold text-[#6A5ACD]">{selectedSubject.marks_obtained.total}</Typography> 
                    </View>
                    <View className="flex-row items-center justify-between p-3 bg-[#F8F9FA] rounded-xl">
                      <Typography className="text-sm text-[#7F8C8D]">Grade</Typography> 
                      <Typography className="text-sm font-bold" style={{ color: getGradeColor(selectedSubject.grade) }}>
                        {selectedSubject.grade}
                      </Typography> 
                    </View>
                    <View className="flex-row items-center justify-between p-3 bg-[#F8F9FA] rounded-xl">
                      <Typography className="text-sm text-[#7F8C8D]">Status</Typography> 
                      <Typography className="text-sm font-bold" style={{ color: getStatusColor(selectedSubject.status) }}>
                        {selectedSubject.status}
                      </Typography> 
                    </View>
                  </View>
                </View>

                {/* Actions */}
                <View className="flex-row gap-3">
                  <TouchableOpacity className="flex-1 bg-[#6A5ACD] rounded-xl py-4 items-center">
                    <Typography className="text-base font-bold text-white">Download Report</Typography> 
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 bg-[#F8F9FA] border border-[#DDE4EB] rounded-xl py-4 items-center">
                    <Typography className="text-base font-bold text-[#2C3E50]">Share</Typography> 
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Performance Guidelines */}
      {loadedResults.length > 0 && (
        <View className="mx-4 mt-6 mb-8 bg-white rounded-2xl p-4 shadow-lg elevation-5">
          <Typography className="text-lg font-bold text-[#2C3E50] mb-3 flex-row items-center">
            <Icon name="info" size={20} color="#6A5ACD" />
            <Typography className="ml-2">Grading System</Typography> 
          </Typography> 
          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Typography className="text-sm text-[#7F8C8D]">A+ Grade</Typography> 
              <Typography className="text-sm font-semibold text-[#10B981]">90% and above</Typography> 
            </View>
            <View className="flex-row items-center justify-between">
              <Typography className="text-sm text-[#7F8C8D]">A Grade</Typography> 
              <Typography className="text-sm font-semibold text-[#059669]">80% - 89%</Typography> 
            </View>
            <View className="flex-row items-center justify-between">
              <Typography className="text-sm text-[#7F8C8D]">B Grade</Typography> 
              <Typography className="text-sm font-semibold text-[#3B82F6]">70% - 79%</Typography> 
            </View>
            <View className="flex-row items-center justify-between">
              <Typography className="text-sm text-[#7F8C8D]">C Grade</Typography> 
              <Typography className="text-sm font-semibold text-[#F59E0B]">60% - 69%</Typography> 
            </View>
            <View className="flex-row items-center justify-between">
              <Typography className="text-sm text-[#7F8C8D]">D Grade</Typography> 
              <Typography className="text-sm font-semibold text-[#F97316]">50% - 59%</Typography> 
            </View>
            <View className="flex-row items-center justify-between">
              <Typography className="text-sm text-[#7F8C8D]">F Grade</Typography> 
              <Typography className="text-sm font-semibold text-[#EF4444]">Below 50%</Typography> 
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  )
}

export default ResultScreen
