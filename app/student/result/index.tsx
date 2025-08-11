// "use client"

// import type React from "react"
// import { useState } from "react"
// import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native"
// import Icon from "react-native-vector-icons/MaterialIcons"
// import { Link } from "expo-router"

// const ResultScreen: React.FC = () => {
//   const [selectedExam, setSelectedExam] = useState("mid-term")
//   const [showResultModal, setShowResultModal] = useState(false)
//   const [selectedResult, setSelectedResult] = useState<any>(null)

//   const resultData = {
//     "mid-term": {
//       name: "Mid-Term Examination",
//       date: "December 2024",
//       status: "published",
//       overallGrade: "A-",
//       percentage: 85.5,
//       totalMarks: 600,
//       obtainedMarks: 513,
//       rank: 5,
//       totalStudents: 120,
//       subjects: [
//         {
//           subject: "Mathematics",
//           obtainedMarks: 88,
//           totalMarks: 100,
//           grade: "A",
//           percentage: 88,
//           teacher: "Mrs. Sarah Johnson",
//           remarks: "Excellent performance in algebra",
//           color: "#6A5ACD",
//         },
//         {
//           subject: "Physics",
//           obtainedMarks: 82,
//           totalMarks: 100,
//           grade: "A",
//           percentage: 82,
//           teacher: "Dr. Michael Brown",
//           remarks: "Good understanding of concepts",
//           color: "#00BCD4",
//         },
//         {
//           subject: "Chemistry",
//           obtainedMarks: 90,
//           totalMarks: 100,
//           grade: "A+",
//           percentage: 90,
//           teacher: "Prof. Lisa Anderson",
//           remarks: "Outstanding work in organic chemistry",
//           color: "#2ECC71",
//         },
//         {
//           subject: "Biology",
//           obtainedMarks: 85,
//           totalMarks: 100,
//           grade: "A",
//           percentage: 85,
//           teacher: "Dr. Robert Wilson",
//           remarks: "Strong grasp of biological processes",
//           color: "#FFC107",
//         },
//         {
//           subject: "English",
//           obtainedMarks: 87,
//           totalMarks: 100,
//           grade: "A",
//           percentage: 87,
//           teacher: "Ms. Emily Davis",
//           remarks: "Excellent essay writing skills",
//           color: "#E91E63",
//         },
//         {
//           subject: "History",
//           obtainedMarks: 81,
//           totalMarks: 100,
//           grade: "A",
//           percentage: 81,
//           teacher: "Mr. James Smith",
//           remarks: "Good analytical skills",
//           color: "#795548",
//         },
//       ],
//     },
//     "unit-test": {
//       name: "Unit Test",
//       date: "November 2024",
//       status: "published",
//       overallGrade: "B+",
//       percentage: 78.2,
//       totalMarks: 250,
//       obtainedMarks: 195,
//       rank: 8,
//       totalStudents: 120,
//       subjects: [
//         {
//           subject: "Mathematics",
//           obtainedMarks: 42,
//           totalMarks: 50,
//           grade: "A",
//           percentage: 84,
//           teacher: "Mrs. Sarah Johnson",
//           remarks: "Good progress",
//           color: "#6A5ACD",
//         },
//         {
//           subject: "Physics",
//           obtainedMarks: 38,
//           totalMarks: 50,
//           grade: "B+",
//           percentage: 76,
//           teacher: "Dr. Michael Brown",
//           remarks: "Need more practice",
//           color: "#00BCD4",
//         },
//         {
//           subject: "Chemistry",
//           obtainedMarks: 45,
//           totalMarks: 50,
//           grade: "A+",
//           percentage: 90,
//           teacher: "Prof. Lisa Anderson",
//           remarks: "Excellent work",
//           color: "#2ECC71",
//         },
//         {
//           subject: "Biology",
//           obtainedMarks: 35,
//           totalMarks: 50,
//           grade: "B",
//           percentage: 70,
//           teacher: "Dr. Robert Wilson",
//           remarks: "Average performance",
//           color: "#FFC107",
//         },
//         {
//           subject: "English",
//           obtainedMarks: 35,
//           totalMarks: 50,
//           grade: "B",
//           percentage: 70,
//           teacher: "Ms. Emily Davis",
//           remarks: "Focus on grammar",
//           color: "#E91E63",
//         },
//       ],
//     },
//     final: {
//       name: "Final Examination",
//       date: "March 2024",
//       status: "awaited",
//       overallGrade: "-",
//       percentage: 0,
//       totalMarks: 800,
//       obtainedMarks: 0,
//       rank: 0,
//       totalStudents: 120,
//       subjects: [],
//     },
//   }

//   const examTypes = [
//     { id: "mid-term", label: "Mid-Term", icon: "quiz", color: "#6A5ACD" },
//     { id: "unit-test", label: "Unit Test", icon: "assignment", color: "#F39C12" },
//     { id: "final", label: "Final", icon: "school", color: "#E74C3C" },
//   ]

//   const getGradeColor = (grade: string) => {
//     if (grade.includes("A")) return "#2ECC71"
//     if (grade.includes("B")) return "#F39C12"
//     if (grade.includes("C")) return "#FF9800"
//     if (grade.includes("D")) return "#E74C3C"
//     return "#BDC3C7"
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "published":
//         return "#2ECC71"
//       case "awaited":
//         return "#F39C12"
//       case "pending":
//         return "#6A5ACD"
//       default:
//         return "#BDC3C7"
//     }
//   }

//   const getPerformanceLevel = (percentage: number) => {
//     if (percentage >= 90) return { level: "Excellent", color: "#2ECC71" }
//     if (percentage >= 80) return { level: "Very Good", color: "#6A5ACD" }
//     if (percentage >= 70) return { level: "Good", color: "#F39C12" }
//     if (percentage >= 60) return { level: "Average", color: "#FF9800" }
//     return { level: "Needs Improvement", color: "#E74C3C" }
//   }

//   const currentResult = resultData[selectedExam as keyof typeof resultData]
//   const performance = getPerformanceLevel(currentResult.percentage)

//   return (
//     <ScrollView className="flex-1 bg-[#F0F4F8]" showsVerticalScrollIndicator={false}>
//       {/* Header */}
//       <View className="flex-row items-center justify-between bg-[#6A5ACD] pt-12 pb-5 px-4 rounded-b-[25px]">
//         <Link href="/student" asChild>
//           <TouchableOpacity className="p-2">
//             <Icon name="arrow-back" size={24} color="white" />
//           </TouchableOpacity>
//         </Link>
//         <View className="flex-1 items-center">
//           <Text className="text-xl font-bold text-white">Results</Text>
//         </View>
//         <TouchableOpacity className="p-2">
//           <Icon name="download" size={20} color="white" />
//         </TouchableOpacity>
//       </View>

//       {/* Result Overview Card */}
//       <View className="px-4 -mt-8 mb-5">
//         <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
//           <View className="flex-row items-center justify-between mb-4">
//             <View>
//               <Text className="text-lg font-bold text-[#2C3E50]">{currentResult.name}</Text>
//               <Text className="text-sm text-[#7F8C8D]">{currentResult.date}</Text>
//             </View>
//             <View
//               className="px-4 py-2 rounded-xl"
//               style={{ backgroundColor: `${getStatusColor(currentResult.status)}20` }}
//             >
//               <Text className="text-sm font-bold" style={{ color: getStatusColor(currentResult.status) }}>
//                 {currentResult.status.toUpperCase()}
//               </Text>
//             </View>
//           </View>

//           {currentResult.status === "published" ? (
//             <>
//               <View className="flex-row justify-between items-center mb-4">
//                 <View className="items-center">
//                   <Text className="text-3xl font-bold text-[#6A5ACD]">{currentResult.percentage}%</Text>
//                   <Text className="text-xs text-[#7F8C8D]">Overall</Text>
//                 </View>
//                 <View className="items-center">
//                   <Text className="text-3xl font-bold" style={{ color: getGradeColor(currentResult.overallGrade) }}>
//                     {currentResult.overallGrade}
//                   </Text>
//                   <Text className="text-xs text-[#7F8C8D]">Grade</Text>
//                 </View>
//                 <View className="items-center">
//                   <Text className="text-3xl font-bold text-[#F39C12]">#{currentResult.rank}</Text>
//                   <Text className="text-xs text-[#7F8C8D]">Rank</Text>
//                 </View>
//               </View>

//               <View className="bg-[#F8F9FA] rounded-xl p-3">
//                 <View className="flex-row justify-between items-center mb-2">
//                   <Text className="text-sm text-[#7F8C8D]">Marks Obtained:</Text>
//                   <Text className="text-sm font-bold text-[#2C3E50]">
//                     {currentResult.obtainedMarks}/{currentResult.totalMarks}
//                   </Text>
//                 </View>
//                 <View className="flex-row justify-between items-center mb-2">
//                   <Text className="text-sm text-[#7F8C8D]">Class Rank:</Text>
//                   <Text className="text-sm font-bold text-[#6A5ACD]">
//                     {currentResult.rank} out of {currentResult.totalStudents}
//                   </Text>
//                 </View>
//                 <View className="flex-row justify-between items-center">
//                   <Text className="text-sm text-[#7F8C8D]">Performance:</Text>
//                   <Text className="text-sm font-bold" style={{ color: performance.color }}>
//                     {performance.level}
//                   </Text>
//                 </View>
//               </View>
//             </>
//           ) : (
//             <View className="items-center py-8">
//               <Icon name="schedule" size={48} color="#F39C12" />
//               <Text className="text-lg font-bold text-[#F39C12] mt-3">Results Awaited</Text>
//               <Text className="text-sm text-[#7F8C8D] text-center mt-2">
//                 Results will be published soon. You will be notified once available.
//               </Text>
//             </View>
//           )}
//         </View>
//       </View>

//       {/* Exam Type Selector */}
//       <View className="px-4 mb-5">
//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//           {examTypes.map((exam) => (
//             <TouchableOpacity
//               key={exam.id}
//               className={`flex-row items-center px-4 py-2.5 mr-3 rounded-[20px] border ${
//                 selectedExam === exam.id ? "border-[#6A5ACD]" : "bg-white border-[#DDE4EB]"
//               }`}
//               style={selectedExam === exam.id ? { backgroundColor: `${exam.color}20` } : {}}
//               onPress={() => setSelectedExam(exam.id)}
//             >
//               <Icon name={exam.icon} size={16} color={exam.color} />
//               <Text
//                 className={`text-sm font-semibold ml-2 ${
//                   selectedExam === exam.id ? "text-[#2C3E50]" : "text-[#7F8C8D]"
//                 }`}
//               >
//                 {exam.label}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       {/* Subject-wise Results */}
//       {currentResult.status === "published" && currentResult.subjects.length > 0 && (
//         <View className="px-4 mb-8">
//           <Text className="text-xl font-bold text-[#2C3E50] mb-4">Subject-wise Performance</Text>
//           <View className="gap-4">
//             {currentResult.subjects.map((subject, index) => (
//               <TouchableOpacity
//                 key={index}
//                 className="bg-white rounded-2xl p-4 shadow-lg elevation-5"
//                 onPress={() => {
//                   setSelectedResult(subject)
//                   setShowResultModal(true)
//                 }}
//               >
//                 {/* Header */}
//                 <View className="flex-row items-center justify-between mb-3">
//                   <View className="flex-row items-center flex-1">
//                     <View className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: subject.color }} />
//                     <View className="flex-1">
//                       <Text className="text-base font-bold text-[#2C3E50]">{subject.subject}</Text>
//                       <Text className="text-sm text-[#7F8C8D]">{subject.teacher}</Text>
//                     </View>
//                   </View>
//                   <View className="items-end">
//                     <View
//                       className="px-3 py-1 rounded-xl mb-1"
//                       style={{ backgroundColor: `${getGradeColor(subject.grade)}20` }}
//                     >
//                       <Text className="text-sm font-bold" style={{ color: getGradeColor(subject.grade) }}>
//                         {subject.grade}
//                       </Text>
//                     </View>
//                     <Text className="text-xs text-[#7F8C8D]">{subject.percentage}%</Text>
//                   </View>
//                 </View>

//                 {/* Marks */}
//                 <View className="flex-row justify-between items-center mb-3">
//                   <Text className="text-lg font-bold text-[#2C3E50]">
//                     {subject.obtainedMarks}/{subject.totalMarks}
//                   </Text>
//                   <Text className="text-sm text-[#6A5ACD] font-semibold">{subject.percentage}%</Text>
//                 </View>

//                 {/* Progress Bar */}
//                 <View className="h-2 bg-[#EAECEE] rounded-full overflow-hidden mb-2">
//                   <View
//                     className="h-full rounded-full"
//                     style={{
//                       width: `${subject.percentage}%`,
//                       backgroundColor: getGradeColor(subject.grade),
//                     }}
//                   />
//                 </View>

//                 {/* Remarks */}
//                 <Text className="text-sm text-[#7F8C8D] italic">{subject.remarks}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>
//       )}

//       {/* Result Detail Modal */}
//       <Modal
//         visible={showResultModal}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowResultModal(false)}
//       >
//         <View className="flex-1 bg-black/50 justify-end">
//           <View className="bg-white rounded-t-[25px] p-5 max-h-[80%]">
//             <View className="flex-row justify-between items-center mb-5">
//               <Text className="text-xl font-bold text-[#2C3E50] flex-1 mr-4">Subject Details</Text>
//               <TouchableOpacity onPress={() => setShowResultModal(false)}>
//                 <Icon name="close" size={24} color="#2C3E50" />
//               </TouchableOpacity>
//             </View>

//             {selectedResult && (
//               <ScrollView showsVerticalScrollIndicator={false}>
//                 {/* Subject Header */}
//                 <View className="items-center mb-6">
//                   <View
//                     className="w-16 h-16 rounded-full items-center justify-center mb-3"
//                     style={{ backgroundColor: `${selectedResult.color}20` }}
//                   >
//                     <Icon name="grade" size={32} color={selectedResult.color} />
//                   </View>
//                   <Text className="text-xl font-bold text-[#2C3E50] text-center mb-2">{selectedResult.subject}</Text>
//                   <Text className="text-sm text-[#7F8C8D] text-center">{selectedResult.teacher}</Text>
//                 </View>

//                 {/* Grade & Marks */}
//                 <View className="bg-[#F8F9FA] rounded-2xl p-4 mb-6">
//                   <View className="flex-row justify-between items-center mb-4">
//                     <View className="items-center">
//                       <Text className="text-3xl font-bold" style={{ color: getGradeColor(selectedResult.grade) }}>
//                         {selectedResult.grade}
//                       </Text>
//                       <Text className="text-xs text-[#7F8C8D]">Grade</Text>
//                     </View>
//                     <View className="items-center">
//                       <Text className="text-3xl font-bold text-[#6A5ACD]">{selectedResult.percentage}%</Text>
//                       <Text className="text-xs text-[#7F8C8D]">Percentage</Text>
//                     </View>
//                     <View className="items-center">
//                       <Text className="text-3xl font-bold text-[#2C3E50]">
//                         {selectedResult.obtainedMarks}/{selectedResult.totalMarks}
//                       </Text>
//                       <Text className="text-xs text-[#7F8C8D]">Marks</Text>
//                     </View>
//                   </View>

//                   {/* Progress Bar */}
//                   <View className="h-3 bg-[#EAECEE] rounded-full overflow-hidden">
//                     <View
//                       className="h-full rounded-full"
//                       style={{
//                         width: `${selectedResult.percentage}%`,
//                         backgroundColor: getGradeColor(selectedResult.grade),
//                       }}
//                     />
//                   </View>
//                 </View>

//                 {/* Teacher's Remarks */}
//                 <View className="mb-6">
//                   <Text className="text-lg font-bold text-[#2C3E50] mb-3">Teacher's Remarks</Text>
//                   <View className="bg-[#F8F9FA] rounded-2xl p-4">
//                     <Text className="text-sm text-[#2C3E50] leading-6 italic">"{selectedResult.remarks}"</Text>
//                   </View>
//                 </View>

//                 {/* Performance Analysis */}
//                 <View className="mb-6">
//                   <Text className="text-lg font-bold text-[#2C3E50] mb-3">Performance Analysis</Text>
//                   <View className="gap-3">
//                     <View className="flex-row items-center justify-between p-3 bg-[#F8F9FA] rounded-xl">
//                       <Text className="text-sm text-[#7F8C8D]">Marks Obtained</Text>
//                       <Text className="text-sm font-bold text-[#2C3E50]">{selectedResult.obtainedMarks}</Text>
//                     </View>
//                     <View className="flex-row items-center justify-between p-3 bg-[#F8F9FA] rounded-xl">
//                       <Text className="text-sm text-[#7F8C8D]">Total Marks</Text>
//                       <Text className="text-sm font-bold text-[#2C3E50]">{selectedResult.totalMarks}</Text>
//                     </View>
//                     <View className="flex-row items-center justify-between p-3 bg-[#F8F9FA] rounded-xl">
//                       <Text className="text-sm text-[#7F8C8D]">Percentage</Text>
//                       <Text className="text-sm font-bold text-[#6A5ACD]">{selectedResult.percentage}%</Text>
//                     </View>
//                     <View className="flex-row items-center justify-between p-3 bg-[#F8F9FA] rounded-xl">
//                       <Text className="text-sm text-[#7F8C8D]">Grade</Text>
//                       <Text className="text-sm font-bold" style={{ color: getGradeColor(selectedResult.grade) }}>
//                         {selectedResult.grade}
//                       </Text>
//                     </View>
//                   </View>
//                 </View>

//                 {/* Actions */}
//                 <View className="flex-row gap-3">
//                   <TouchableOpacity className="flex-1 bg-[#6A5ACD] rounded-xl py-4 items-center">
//                     <Text className="text-base font-bold text-white">Download Report</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity className="flex-1 bg-[#F8F9FA] border border-[#DDE4EB] rounded-xl py-4 items-center">
//                     <Text className="text-base font-bold text-[#2C3E50]">Share</Text>
//                   </TouchableOpacity>
//                 </View>
//               </ScrollView>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   )
// }

// export default ResultScreen



import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert, RefreshControl, ActivityIndicator } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { Link } from "expo-router"
import { get_sessional_exams, get_exam_result } from "@/service/student/result"

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
        <Text className="text-white font-bold text-lg">?</Text>
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
    return Math.round((result.total_obtained / result.total_max) * 100)
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
              <Text className="text-base font-bold text-[#2C3E50]">{exam.name}</Text>
              {result && (
                <Text className="text-sm text-[#7F8C8D] mt-1">
                  {result.total_obtained}/{result.total_max} ({getPercentage()}%)
                </Text>
              )}
            </View>
          </View>
          <View className="flex-row items-center">
            {result && (
              <View
                className="px-3 py-1 rounded-lg mr-2"
                style={{ backgroundColor: `${getGradeColor(result.final_result.grade)}20` }}
              >
                <Text className="text-xs font-bold" style={{ color: getGradeColor(result.final_result.grade) }}>
                  Grade {result.final_result.grade}
                </Text>
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
              <Text className="text-sm text-[#7F8C8D] mt-2">Loading result...</Text>
            </View>
          )}

          {!isLoading && result && (
            <View>
              {/* Summary Cards */}
              <View className="flex-row justify-between mb-4">
                <View className="bg-[#F8F9FA] rounded-xl p-3 flex-1 mr-2 items-center">
                  <Icon name="moving" size={20} color="#3B82F6" />
                  <Text className="text-lg font-bold text-[#2C3E50] mt-1">
                    {result.total_obtained}/{result.total_max}
                  </Text>
                  <Text className="text-xs text-[#7F8C8D]">Total Score</Text>
                  <Text className="text-xs text-[#7F8C8D]">{getPercentage()}%</Text>
                </View>
                <View className="bg-[#F8F9FA] rounded-xl p-3 flex-1 mx-1 items-center">
                  <Icon name="grade" size={20} color="#10B981" />
                  <Text className="text-lg font-bold text-[#2C3E50] mt-1">{result.final_result.grade}</Text>
                  <Text className="text-xs text-[#7F8C8D]">Final Grade</Text>
                  <Text className="text-xs text-[#10B981]">{result.final_result.remark}</Text>
                </View>
                <View className="bg-[#F8F9FA] rounded-xl p-3 flex-1 ml-2 items-center">
                  <Icon name="emoji-events" size={20} color="#F59E0B" />
                  <Text className="text-lg font-bold text-[#2C3E50] mt-1">{result.final_result.value}</Text>
                  <Text className="text-xs text-[#7F8C8D]">{result.final_result.result_type}</Text>
                  <Text className="text-xs text-[#7F8C8D]">Performance</Text>
                </View>
              </View>

              {/* Subjects List */}
              <View className="mb-4">
                <Text className="text-base font-bold text-[#2C3E50] mb-3">Subject-wise Results</Text>
                <View className="gap-3">
                  {result.subjects.map((subject, idx) => (
                    <View key={idx} className="bg-[#F8F9FA] rounded-xl p-3">
                      <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-1">
                          <Text className="text-sm font-semibold text-[#2C3E50]">{subject.subject_name}</Text>
                          <Text className="text-xs text-[#7F8C8D]">{subject.subject_type}</Text>
                        </View>
                        <View className="items-end">
                          <View
                            className="px-2 py-1 rounded-lg mb-1"
                            style={{ backgroundColor: `${getGradeColor(subject.grade)}20` }}
                          >
                            <Text className="text-xs font-bold" style={{ color: getGradeColor(subject.grade) }}>
                              {subject.grade}
                            </Text>
                          </View>
                          <View
                            className="px-2 py-1 rounded-lg"
                            style={{ backgroundColor: `${getStatusColor(subject.status)}20` }}
                          >
                            <Text className="text-xs font-bold" style={{ color: getStatusColor(subject.status) }}>
                              {subject.status}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View className="flex-row justify-between items-center">
                        <View className="flex-row gap-4">
                          {["THEORETICAL", "BOTH"].includes(subject.subject_type) && (
                            <View>
                              <Text className="text-xs text-[#7F8C8D]">Theory</Text>
                              <Text className="text-sm font-semibold text-[#2C3E50]">
                                {subject.absent ? "AB" : subject.marks_obtained.written || "--"}
                              </Text>
                            </View>
                          )}
                          {["PRACTICAL", "BOTH"].includes(subject.subject_type) && (
                            <View>
                              <Text className="text-xs text-[#7F8C8D]">Practical</Text>
                              <Text className="text-sm font-semibold text-[#2C3E50]">
                                {subject.marks_obtained.practical || "--"}
                              </Text>
                            </View>
                          )}
                          <View>
                            <Text className="text-xs text-[#7F8C8D]">Total</Text>
                            <Text className="text-sm font-bold text-[#6A5ACD]">{subject.marks_obtained.total}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Performance Summary */}
              <View className="bg-[#F8F9FA] rounded-xl p-4">
                <Text className="text-sm font-bold text-[#2C3E50] mb-3 flex-row items-center">
                  <Icon name="trending-up" size={16} color="#6A5ACD" />
                  <Text className="ml-2">Performance Summary</Text>
                </Text>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-sm text-[#7F8C8D]">Total Marks:</Text>
                  <Text className="text-sm font-semibold text-[#2C3E50]">
                    {result.total_obtained}/{result.total_max}
                  </Text>
                </View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-sm text-[#7F8C8D]">Percentage:</Text>
                  <Text className="text-sm font-semibold text-[#2C3E50]">{getPercentage()}%</Text>
                </View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-sm text-[#7F8C8D]">Grade:</Text>
                  <Text className="text-sm font-semibold text-[#2C3E50]">{result.final_result.grade}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-[#7F8C8D]">Remark:</Text>
                  <Text className="text-sm font-semibold text-[#2C3E50]">{result.final_result.remark}</Text>
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
      const exists = prev.find((r) => r.final_result.value === result.final_result.value)
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
      totalPercentage += Math.round((result.total_obtained / result.total_max) * 100)
      totalSubjects += result.subjects.length
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
          <Text className="text-xl font-bold text-white">Results</Text>
        </View>
        <TouchableOpacity className="p-2" onPress={onRefresh}>
          <Icon name="refresh" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Stats Overview */}
      <View className="px-4 -mt-8 mb-5">
        <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
          <Text className="text-lg font-bold text-[#2C3E50] mb-4">Overview</Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-[#6A5ACD]">{stats.totalSessions}</Text>
              <Text className="text-xs text-[#7F8C8D]">Sessions</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-[#2ECC71]">{stats.totalExams}</Text>
              <Text className="text-xs text-[#7F8C8D]">Exams</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-[#F39C12]">{stats.avgPercentage}%</Text>
              <Text className="text-xs text-[#7F8C8D]">Avg Score</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-[#E74C3C]">{stats.totalSubjects}</Text>
              <Text className="text-xs text-[#7F8C8D]">Subjects</Text>
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
            <Text className="text-base font-semibold text-[#2C3E50] ml-2">
              {selectedSession === "all" ? "All Sessions" : `Session ${selectedSession}`}
            </Text>
          </View>
          <Icon name="expand-more" size={20} color="#7F8C8D" />
        </TouchableOpacity>
      </View>

      {/* Loading State */}
      {isLoading && (
        <View className="px-4">
          <View className="bg-white rounded-2xl p-6 shadow-lg elevation-5 items-center">
            <LoadingResultsIllustration />
            <Text className="text-lg font-semibold text-[#2C3E50] mt-4">Loading Results...</Text>
            <Text className="text-sm text-[#7F8C8D] mt-2 text-center">
              Please wait while we fetch your examination results
            </Text>
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
                          <Text className="text-lg font-bold text-[#2C3E50]">Session {session}</Text>
                          <Text className="text-sm text-[#7F8C8D]">
                            {filteredSessions[session].length} exam(s) available
                          </Text>
                        </View>
                      </View>
                      <View className="px-3 py-1 bg-blue-100 rounded-lg">
                        <Text className="text-xs font-bold text-blue-800">
                          {filteredSessions[session].length} Exams
                        </Text>
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
              <Text className="text-lg font-bold text-[#2C3E50] mt-4 mb-2">No Results Available</Text>
              <Text className="text-sm text-[#7F8C8D] text-center mb-4">
                Your examination results will appear here once they are published by your institution.
              </Text>
              <TouchableOpacity className="bg-[#6A5ACD] px-6 py-3 rounded-xl" onPress={onRefresh}>
                <Text className="text-white font-semibold">Refresh</Text>
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
              <Text className="text-xl font-bold text-[#2C3E50]">Select Session</Text>
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
                <Text
                  className={`text-base font-semibold ${selectedSession === "all" ? "text-white" : "text-[#2C3E50]"}`}
                >
                  All Sessions
                </Text>
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
                      <Text
                        className={`text-base font-semibold ${
                          selectedSession === session ? "text-white" : "text-[#2C3E50]"
                        }`}
                      >
                        Session {session}
                      </Text>
                      <Text className={`text-sm ${selectedSession === session ? "text-white" : "text-[#7F8C8D]"}`}>
                        {sessionExams[session].length} exams
                      </Text>
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
              <Text className="text-xl font-bold text-[#2C3E50] flex-1 mr-4">Subject Details</Text>
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
                  <Text className="text-xl font-bold text-[#2C3E50] text-center mb-2">
                    {selectedSubject.subject_name}
                  </Text>
                  <Text className="text-sm text-[#7F8C8D] text-center">{selectedSubject.subject_type}</Text>
                </View>

                {/* Grade & Marks */}
                <View className="bg-[#F8F9FA] rounded-2xl p-4 mb-6">
                  <View className="flex-row justify-between items-center mb-4">
                    <View className="items-center">
                      <Text className="text-3xl font-bold" style={{ color: getGradeColor(selectedSubject.grade) }}>
                        {selectedSubject.grade}
                      </Text>
                      <Text className="text-xs text-[#7F8C8D]">Grade</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-3xl font-bold text-[#6A5ACD]">{selectedSubject.marks_obtained.total}</Text>
                      <Text className="text-xs text-[#7F8C8D]">Total Marks</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-3xl font-bold" style={{ color: getStatusColor(selectedSubject.status) }}>
                        {selectedSubject.status}
                      </Text>
                      <Text className="text-xs text-[#7F8C8D]">Status</Text>
                    </View>
                  </View>
                </View>

                {/* Detailed Marks */}
                <View className="mb-6">
                  <Text className="text-lg font-bold text-[#2C3E50] mb-3">Detailed Marks</Text>
                  <View className="gap-3">
                    {["THEORETICAL", "BOTH"].includes(selectedSubject.subject_type) && (
                      <View className="flex-row items-center justify-between p-3 bg-[#F8F9FA] rounded-xl">
                        <Text className="text-sm text-[#7F8C8D]">Theory Marks</Text>
                        <Text className="text-sm font-bold text-[#2C3E50]">
                          {selectedSubject.absent ? "Absent" : selectedSubject.marks_obtained.written || "--"}
                        </Text>
                      </View>
                    )}
                    {["PRACTICAL", "BOTH"].includes(selectedSubject.subject_type) && (
                      <View className="flex-row items-center justify-between p-3 bg-[#F8F9FA] rounded-xl">
                        <Text className="text-sm text-[#7F8C8D]">Practical Marks</Text>
                        <Text className="text-sm font-bold text-[#2C3E50]">
                          {selectedSubject.marks_obtained.practical || "--"}
                        </Text>
                      </View>
                    )}
                    <View className="flex-row items-center justify-between p-3 bg-[#F8F9FA] rounded-xl">
                      <Text className="text-sm text-[#7F8C8D]">Total Marks</Text>
                      <Text className="text-sm font-bold text-[#6A5ACD]">{selectedSubject.marks_obtained.total}</Text>
                    </View>
                    <View className="flex-row items-center justify-between p-3 bg-[#F8F9FA] rounded-xl">
                      <Text className="text-sm text-[#7F8C8D]">Grade</Text>
                      <Text className="text-sm font-bold" style={{ color: getGradeColor(selectedSubject.grade) }}>
                        {selectedSubject.grade}
                      </Text>
                    </View>
                    <View className="flex-row items-center justify-between p-3 bg-[#F8F9FA] rounded-xl">
                      <Text className="text-sm text-[#7F8C8D]">Status</Text>
                      <Text className="text-sm font-bold" style={{ color: getStatusColor(selectedSubject.status) }}>
                        {selectedSubject.status}
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

      {/* Performance Guidelines */}
      {loadedResults.length > 0 && (
        <View className="mx-4 mt-6 mb-8 bg-white rounded-2xl p-4 shadow-lg elevation-5">
          <Text className="text-lg font-bold text-[#2C3E50] mb-3 flex-row items-center">
            <Icon name="info" size={20} color="#6A5ACD" />
            <Text className="ml-2">Grading System</Text>
          </Text>
          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-[#7F8C8D]">A+ Grade</Text>
              <Text className="text-sm font-semibold text-[#10B981]">90% and above</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-[#7F8C8D]">A Grade</Text>
              <Text className="text-sm font-semibold text-[#059669]">80% - 89%</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-[#7F8C8D]">B Grade</Text>
              <Text className="text-sm font-semibold text-[#3B82F6]">70% - 79%</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-[#7F8C8D]">C Grade</Text>
              <Text className="text-sm font-semibold text-[#F59E0B]">60% - 69%</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-[#7F8C8D]">D Grade</Text>
              <Text className="text-sm font-semibold text-[#F97316]">50% - 59%</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-[#7F8C8D]">F Grade</Text>
              <Text className="text-sm font-semibold text-[#EF4444]">Below 50%</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  )
}

export default ResultScreen
