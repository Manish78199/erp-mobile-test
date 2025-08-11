"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { Link } from "expo-router"

const ResultScreen: React.FC = () => {
  const [selectedExam, setSelectedExam] = useState("mid-term")
  const [showResultModal, setShowResultModal] = useState(false)
  const [selectedResult, setSelectedResult] = useState<any>(null)

  const resultData = {
    "mid-term": {
      name: "Mid-Term Examination",
      date: "December 2024",
      status: "published",
      overallGrade: "A-",
      percentage: 85.5,
      totalMarks: 600,
      obtainedMarks: 513,
      rank: 5,
      totalStudents: 120,
      subjects: [
        {
          subject: "Mathematics",
          obtainedMarks: 88,
          totalMarks: 100,
          grade: "A",
          percentage: 88,
          teacher: "Mrs. Sarah Johnson",
          remarks: "Excellent performance in algebra",
          color: "#6A5ACD",
        },
        {
          subject: "Physics",
          obtainedMarks: 82,
          totalMarks: 100,
          grade: "A",
          percentage: 82,
          teacher: "Dr. Michael Brown",
          remarks: "Good understanding of concepts",
          color: "#00BCD4",
        },
        {
          subject: "Chemistry",
          obtainedMarks: 90,
          totalMarks: 100,
          grade: "A+",
          percentage: 90,
          teacher: "Prof. Lisa Anderson",
          remarks: "Outstanding work in organic chemistry",
          color: "#2ECC71",
        },
        {
          subject: "Biology",
          obtainedMarks: 85,
          totalMarks: 100,
          grade: "A",
          percentage: 85,
          teacher: "Dr. Robert Wilson",
          remarks: "Strong grasp of biological processes",
          color: "#FFC107",
        },
        {
          subject: "English",
          obtainedMarks: 87,
          totalMarks: 100,
          grade: "A",
          percentage: 87,
          teacher: "Ms. Emily Davis",
          remarks: "Excellent essay writing skills",
          color: "#E91E63",
        },
        {
          subject: "History",
          obtainedMarks: 81,
          totalMarks: 100,
          grade: "A",
          percentage: 81,
          teacher: "Mr. James Smith",
          remarks: "Good analytical skills",
          color: "#795548",
        },
      ],
    },
    "unit-test": {
      name: "Unit Test",
      date: "November 2024",
      status: "published",
      overallGrade: "B+",
      percentage: 78.2,
      totalMarks: 250,
      obtainedMarks: 195,
      rank: 8,
      totalStudents: 120,
      subjects: [
        {
          subject: "Mathematics",
          obtainedMarks: 42,
          totalMarks: 50,
          grade: "A",
          percentage: 84,
          teacher: "Mrs. Sarah Johnson",
          remarks: "Good progress",
          color: "#6A5ACD",
        },
        {
          subject: "Physics",
          obtainedMarks: 38,
          totalMarks: 50,
          grade: "B+",
          percentage: 76,
          teacher: "Dr. Michael Brown",
          remarks: "Need more practice",
          color: "#00BCD4",
        },
        {
          subject: "Chemistry",
          obtainedMarks: 45,
          totalMarks: 50,
          grade: "A+",
          percentage: 90,
          teacher: "Prof. Lisa Anderson",
          remarks: "Excellent work",
          color: "#2ECC71",
        },
        {
          subject: "Biology",
          obtainedMarks: 35,
          totalMarks: 50,
          grade: "B",
          percentage: 70,
          teacher: "Dr. Robert Wilson",
          remarks: "Average performance",
          color: "#FFC107",
        },
        {
          subject: "English",
          obtainedMarks: 35,
          totalMarks: 50,
          grade: "B",
          percentage: 70,
          teacher: "Ms. Emily Davis",
          remarks: "Focus on grammar",
          color: "#E91E63",
        },
      ],
    },
    final: {
      name: "Final Examination",
      date: "March 2024",
      status: "awaited",
      overallGrade: "-",
      percentage: 0,
      totalMarks: 800,
      obtainedMarks: 0,
      rank: 0,
      totalStudents: 120,
      subjects: [],
    },
  }

  const examTypes = [
    { id: "mid-term", label: "Mid-Term", icon: "quiz", color: "#6A5ACD" },
    { id: "unit-test", label: "Unit Test", icon: "assignment", color: "#F39C12" },
    { id: "final", label: "Final", icon: "school", color: "#E74C3C" },
  ]

  const getGradeColor = (grade: string) => {
    if (grade.includes("A")) return "#2ECC71"
    if (grade.includes("B")) return "#F39C12"
    if (grade.includes("C")) return "#FF9800"
    if (grade.includes("D")) return "#E74C3C"
    return "#BDC3C7"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "#2ECC71"
      case "awaited":
        return "#F39C12"
      case "pending":
        return "#6A5ACD"
      default:
        return "#BDC3C7"
    }
  }

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { level: "Excellent", color: "#2ECC71" }
    if (percentage >= 80) return { level: "Very Good", color: "#6A5ACD" }
    if (percentage >= 70) return { level: "Good", color: "#F39C12" }
    if (percentage >= 60) return { level: "Average", color: "#FF9800" }
    return { level: "Needs Improvement", color: "#E74C3C" }
  }

  const currentResult = resultData[selectedExam as keyof typeof resultData]
  const performance = getPerformanceLevel(currentResult.percentage)

  return (
    <ScrollView className="flex-1 bg-[#F0F4F8]" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="flex-row items-center justify-between bg-[#6A5ACD] pt-12 pb-5 px-4 rounded-b-[25px]">
        <Link href="/student" asChild>
          <TouchableOpacity className="p-2">
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </Link>
        <View className="flex-1 items-center">
          <Text className="text-xl font-bold text-white">Results</Text>
        </View>
        <TouchableOpacity className="p-2">
          <Icon name="download" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Result Overview Card */}
      <View className="px-4 -mt-8 mb-5">
        <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-lg font-bold text-[#2C3E50]">{currentResult.name}</Text>
              <Text className="text-sm text-[#7F8C8D]">{currentResult.date}</Text>
            </View>
            <View
              className="px-4 py-2 rounded-xl"
              style={{ backgroundColor: `${getStatusColor(currentResult.status)}20` }}
            >
              <Text className="text-sm font-bold" style={{ color: getStatusColor(currentResult.status) }}>
                {currentResult.status.toUpperCase()}
              </Text>
            </View>
          </View>

          {currentResult.status === "published" ? (
            <>
              <View className="flex-row justify-between items-center mb-4">
                <View className="items-center">
                  <Text className="text-3xl font-bold text-[#6A5ACD]">{currentResult.percentage}%</Text>
                  <Text className="text-xs text-[#7F8C8D]">Overall</Text>
                </View>
                <View className="items-center">
                  <Text className="text-3xl font-bold" style={{ color: getGradeColor(currentResult.overallGrade) }}>
                    {currentResult.overallGrade}
                  </Text>
                  <Text className="text-xs text-[#7F8C8D]">Grade</Text>
                </View>
                <View className="items-center">
                  <Text className="text-3xl font-bold text-[#F39C12]">#{currentResult.rank}</Text>
                  <Text className="text-xs text-[#7F8C8D]">Rank</Text>
                </View>
              </View>

              <View className="bg-[#F8F9FA] rounded-xl p-3">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-sm text-[#7F8C8D]">Marks Obtained:</Text>
                  <Text className="text-sm font-bold text-[#2C3E50]">
                    {currentResult.obtainedMarks}/{currentResult.totalMarks}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-sm text-[#7F8C8D]">Class Rank:</Text>
                  <Text className="text-sm font-bold text-[#6A5ACD]">
                    {currentResult.rank} out of {currentResult.totalStudents}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-[#7F8C8D]">Performance:</Text>
                  <Text className="text-sm font-bold" style={{ color: performance.color }}>
                    {performance.level}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <View className="items-center py-8">
              <Icon name="schedule" size={48} color="#F39C12" />
              <Text className="text-lg font-bold text-[#F39C12] mt-3">Results Awaited</Text>
              <Text className="text-sm text-[#7F8C8D] text-center mt-2">
                Results will be published soon. You will be notified once available.
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Exam Type Selector */}
      <View className="px-4 mb-5">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {examTypes.map((exam) => (
            <TouchableOpacity
              key={exam.id}
              className={`flex-row items-center px-4 py-2.5 mr-3 rounded-[20px] border ${
                selectedExam === exam.id ? "border-[#6A5ACD]" : "bg-white border-[#DDE4EB]"
              }`}
              style={selectedExam === exam.id ? { backgroundColor: `${exam.color}20` } : {}}
              onPress={() => setSelectedExam(exam.id)}
            >
              <Icon name={exam.icon} size={16} color={exam.color} />
              <Text
                className={`text-sm font-semibold ml-2 ${
                  selectedExam === exam.id ? "text-[#2C3E50]" : "text-[#7F8C8D]"
                }`}
              >
                {exam.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Subject-wise Results */}
      {currentResult.status === "published" && currentResult.subjects.length > 0 && (
        <View className="px-4 mb-8">
          <Text className="text-xl font-bold text-[#2C3E50] mb-4">Subject-wise Performance</Text>
          <View className="gap-4">
            {currentResult.subjects.map((subject, index) => (
              <TouchableOpacity
                key={index}
                className="bg-white rounded-2xl p-4 shadow-lg elevation-5"
                onPress={() => {
                  setSelectedResult(subject)
                  setShowResultModal(true)
                }}
              >
                {/* Header */}
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center flex-1">
                    <View className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: subject.color }} />
                    <View className="flex-1">
                      <Text className="text-base font-bold text-[#2C3E50]">{subject.subject}</Text>
                      <Text className="text-sm text-[#7F8C8D]">{subject.teacher}</Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <View
                      className="px-3 py-1 rounded-xl mb-1"
                      style={{ backgroundColor: `${getGradeColor(subject.grade)}20` }}
                    >
                      <Text className="text-sm font-bold" style={{ color: getGradeColor(subject.grade) }}>
                        {subject.grade}
                      </Text>
                    </View>
                    <Text className="text-xs text-[#7F8C8D]">{subject.percentage}%</Text>
                  </View>
                </View>

                {/* Marks */}
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-lg font-bold text-[#2C3E50]">
                    {subject.obtainedMarks}/{subject.totalMarks}
                  </Text>
                  <Text className="text-sm text-[#6A5ACD] font-semibold">{subject.percentage}%</Text>
                </View>

                {/* Progress Bar */}
                <View className="h-2 bg-[#EAECEE] rounded-full overflow-hidden mb-2">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${subject.percentage}%`,
                      backgroundColor: getGradeColor(subject.grade),
                    }}
                  />
                </View>

                {/* Remarks */}
                <Text className="text-sm text-[#7F8C8D] italic">{subject.remarks}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Result Detail Modal */}
      <Modal
        visible={showResultModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowResultModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[25px] p-5 max-h-[80%]">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-xl font-bold text-[#2C3E50] flex-1 mr-4">Subject Details</Text>
              <TouchableOpacity onPress={() => setShowResultModal(false)}>
                <Icon name="close" size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>

            {selectedResult && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Subject Header */}
                <View className="items-center mb-6">
                  <View
                    className="w-16 h-16 rounded-full items-center justify-center mb-3"
                    style={{ backgroundColor: `${selectedResult.color}20` }}
                  >
                    <Icon name="grade" size={32} color={selectedResult.color} />
                  </View>
                  <Text className="text-xl font-bold text-[#2C3E50] text-center mb-2">{selectedResult.subject}</Text>
                  <Text className="text-sm text-[#7F8C8D] text-center">{selectedResult.teacher}</Text>
                </View>

                {/* Grade & Marks */}
                <View className="bg-[#F8F9FA] rounded-2xl p-4 mb-6">
                  <View className="flex-row justify-between items-center mb-4">
                    <View className="items-center">
                      <Text className="text-3xl font-bold" style={{ color: getGradeColor(selectedResult.grade) }}>
                        {selectedResult.grade}
                      </Text>
                      <Text className="text-xs text-[#7F8C8D]">Grade</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-3xl font-bold text-[#6A5ACD]">{selectedResult.percentage}%</Text>
                      <Text className="text-xs text-[#7F8C8D]">Percentage</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-3xl font-bold text-[#2C3E50]">
                        {selectedResult.obtainedMarks}/{selectedResult.totalMarks}
                      </Text>
                      <Text className="text-xs text-[#7F8C8D]">Marks</Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View className="h-3 bg-[#EAECEE] rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${selectedResult.percentage}%`,
                        backgroundColor: getGradeColor(selectedResult.grade),
                      }}
                    />
                  </View>
                </View>

                {/* Teacher's Remarks */}
                <View className="mb-6">
                  <Text className="text-lg font-bold text-[#2C3E50] mb-3">Teacher's Remarks</Text>
                  <View className="bg-[#F8F9FA] rounded-2xl p-4">
                    <Text className="text-sm text-[#2C3E50] leading-6 italic">"{selectedResult.remarks}"</Text>
                  </View>
                </View>

                {/* Performance Analysis */}
                <View className="mb-6">
                  <Text className="text-lg font-bold text-[#2C3E50] mb-3">Performance Analysis</Text>
                  <View className="gap-3">
                    <View className="flex-row items-center justify-between p-3 bg-[#F8F9FA] rounded-xl">
                      <Text className="text-sm text-[#7F8C8D]">Marks Obtained</Text>
                      <Text className="text-sm font-bold text-[#2C3E50]">{selectedResult.obtainedMarks}</Text>
                    </View>
                    <View className="flex-row items-center justify-between p-3 bg-[#F8F9FA] rounded-xl">
                      <Text className="text-sm text-[#7F8C8D]">Total Marks</Text>
                      <Text className="text-sm font-bold text-[#2C3E50]">{selectedResult.totalMarks}</Text>
                    </View>
                    <View className="flex-row items-center justify-between p-3 bg-[#F8F9FA] rounded-xl">
                      <Text className="text-sm text-[#7F8C8D]">Percentage</Text>
                      <Text className="text-sm font-bold text-[#6A5ACD]">{selectedResult.percentage}%</Text>
                    </View>
                    <View className="flex-row items-center justify-between p-3 bg-[#F8F9FA] rounded-xl">
                      <Text className="text-sm text-[#7F8C8D]">Grade</Text>
                      <Text className="text-sm font-bold" style={{ color: getGradeColor(selectedResult.grade) }}>
                        {selectedResult.grade}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Actions */}
                <View className="flex-row gap-3">
                  <TouchableOpacity className="flex-1 bg-[#6A5ACD] rounded-xl py-4 items-center">
                    <Text className="text-base font-bold text-white">Download Report</Text>
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

export default ResultScreen
