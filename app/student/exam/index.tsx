// "use client"

// import type React from "react"
// import { useState } from "react"
// import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native"
// import Icon from "react-native-vector-icons/MaterialIcons"

// interface ExamScreenProps {
//   navigation: any
// }

// const ExamScreen: React.FC<ExamScreenProps> = ({ navigation }) => {
//   const [selectedTab, setSelectedTab] = useState("upcoming")
//   const [showResultModal, setShowResultModal] = useState(false)
//   const [selectedResult, setSelectedResult] = useState<any>(null)

//   const upcomingExams = [
//     {
//       id: 1,
//       subject: "Mathematics",
//       type: "Mid-term Exam",
//       date: "2024-12-20",
//       time: "09:00 AM - 12:00 PM",
//       duration: "3 hours",
//       room: "Room 101",
//       syllabus: ["Algebra", "Geometry", "Trigonometry"],
//       instructions: "Bring calculator, ruler, and compass",
//     },
//     {
//       id: 2,
//       subject: "Physics",
//       type: "Practical Exam",
//       date: "2024-12-22",
//       time: "02:00 PM - 05:00 PM",
//       duration: "3 hours",
//       room: "Physics Lab",
//       syllabus: ["Mechanics", "Optics", "Electricity"],
//       instructions: "Lab coat mandatory",
//     },
//     {
//       id: 3,
//       subject: "Chemistry",
//       type: "Theory Exam",
//       date: "2024-12-25",
//       time: "10:00 AM - 01:00 PM",
//       duration: "3 hours",
//       room: "Room 203",
//       syllabus: ["Organic Chemistry", "Inorganic Chemistry"],
//       instructions: "Periodic table will be provided",
//     },
//   ]

//   const examResults = [
//     {
//       id: 1,
//       subject: "English",
//       type: "Unit Test",
//       date: "2024-11-15",
//       totalMarks: 100,
//       obtainedMarks: 85,
//       grade: "A",
//       percentage: 85,
//       rank: 5,
//       remarks: "Excellent performance",
//     },
//     {
//       id: 2,
//       subject: "Biology",
//       type: "Mid-term",
//       date: "2024-11-20",
//       totalMarks: 100,
//       obtainedMarks: 78,
//       grade: "B+",
//       percentage: 78,
//       rank: 12,
//       remarks: "Good work, focus on diagrams",
//     },
//     {
//       id: 3,
//       subject: "History",
//       type: "Assignment",
//       date: "2024-11-25",
//       totalMarks: 50,
//       obtainedMarks: 42,
//       grade: "B",
//       percentage: 84,
//       rank: 8,
//       remarks: "Well researched content",
//     },
//   ]

//   const reportCards = [
//     {
//       term: "First Term 2024",
//       subjects: [
//         { name: "Mathematics", marks: 85, grade: "A", remarks: "Excellent" },
//         { name: "Physics", marks: 78, grade: "B+", remarks: "Good" },
//         { name: "Chemistry", marks: 82, grade: "A-", remarks: "Very Good" },
//         { name: "Biology", marks: 88, grade: "A", remarks: "Outstanding" },
//         { name: "English", marks: 85, grade: "A", remarks: "Excellent" },
//       ],
//       overall: { percentage: 83.6, grade: "A", rank: 7 },
//     },
//   ]

//   const getSubjectColor = (subject: string) => {
//     const colorMap: { [key: string]: string } = {
//       Mathematics: "#6A5ACD",
//       Physics: "#00BCD4",
//       Chemistry: "#2ECC71",
//       Biology: "#FFC107",
//       English: "#5B4BBD",
//       History: "#E74C3C",
//     }
//     return colorMap[subject] || "#BDC3C7"
//   }

//   const getGradeColor = (grade: string) => {
//     if (grade === "A" || grade === "A+") return "#2ECC71"
//     if (grade === "A-" || grade === "B+") return "#6A5ACD"
//     if (grade === "B" || grade === "B-") return "#F39C12"
//     return "#E74C3C"
//   }

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     })
//   }

//   const getDaysUntilExam = (examDate: string) => {
//     const today = new Date()
//     const exam = new Date(examDate)
//     const diffTime = exam.getTime() - today.getTime()
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
//     return diffDays
//   }

//   return (
//     <ScrollView className="flex-1 bg-[#F0F4F8]" showsVerticalScrollIndicator={false}>
//       {/* Header */}
//       <View className="flex-row items-center justify-between bg-[#6A5ACD] pt-12 pb-5 px-4 rounded-b-[25px]">
//         <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
//           <Icon name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
//         <Text className="text-xl font-bold text-white">Exams & Results</Text>
//         <TouchableOpacity className="p-2">
//           <Icon name="calendar-today" size={20} color="white" />
//         </TouchableOpacity>
//       </View>

//       {/* Tab Navigation */}
//       <View className="flex-row px-4 mt-5 mb-5">
//         {["upcoming", "results", "reports"].map((tab) => (
//           <TouchableOpacity
//             key={tab}
//             className={`flex-1 py-3 items-center mx-1 rounded-xl border ${
//               selectedTab === tab ? "bg-[#6A5ACD] border-[#6A5ACD]" : "bg-white border-[#DDE4EB]"
//             }`}
//             onPress={() => setSelectedTab(tab)}
//           >
//             <Text className={`text-sm font-semibold ${selectedTab === tab ? "text-white" : "text-[#7F8C8D]"}`}>
//               {tab.charAt(0).toUpperCase() + tab.slice(1)}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Upcoming Exams */}
//       {selectedTab === "upcoming" && (
//         <View className="p-4">
//           <Text className="text-xl font-bold text-[#2C3E50] mb-4">Upcoming Exams</Text>
//           <View className="gap-4">
//             {upcomingExams.map((exam) => (
//               <View key={exam.id} className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
//                 <View className="flex-row justify-between items-center mb-2">
//                   <View className="flex-row items-center">
//                     <View
//                       className="w-1 h-4 rounded-sm mr-2"
//                       style={{ backgroundColor: getSubjectColor(exam.subject) }}
//                     />
//                     <Text className="text-sm font-semibold text-[#2C3E50]">{exam.subject}</Text>
//                   </View>
//                   <View className="bg-[#F39C12]/20 px-2 py-1 rounded-xl">
//                     <Text className="text-[10px] font-bold text-[#F39C12]">{getDaysUntilExam(exam.date)} days</Text>
//                   </View>
//                 </View>

//                 <Text className="text-base font-bold text-[#2C3E50] mb-3">{exam.type}</Text>

//                 <View className="mb-3">
//                   <View className="flex-row items-center mb-1">
//                     <Icon name="event" size={16} color="#7F8C8D" />
//                     <Text className="text-xs text-[#7F8C8D] ml-2">{formatDate(exam.date)}</Text>
//                   </View>
//                   <View className="flex-row items-center mb-1">
//                     <Icon name="access-time" size={16} color="#7F8C8D" />
//                     <Text className="text-xs text-[#7F8C8D] ml-2">{exam.time}</Text>
//                   </View>
//                   <View className="flex-row items-center">
//                     <Icon name="room" size={16} color="#7F8C8D" />
//                     <Text className="text-xs text-[#7F8C8D] ml-2">{exam.room}</Text>
//                   </View>
//                 </View>

//                 <View className="mb-3">
//                   <Text className="text-xs font-semibold text-[#2C3E50] mb-2">Syllabus:</Text>
//                   <View className="flex-row flex-wrap gap-2">
//                     {exam.syllabus.map((topic, index) => (
//                       <View key={index} className="bg-[#6A5ACD]/10 px-2 py-1 rounded-lg">
//                         <Text className="text-[10px] text-[#6A5ACD] font-semibold">{topic}</Text>
//                       </View>
//                     ))}
//                   </View>
//                 </View>

//                 <View className="flex-row items-center bg-[#6A5ACD]/10 p-2 rounded-lg">
//                   <Icon name="info" size={16} color="#6A5ACD" />
//                   <Text className="text-xs text-[#6A5ACD] ml-2 flex-1">{exam.instructions}</Text>
//                 </View>
//               </View>
//             ))}
//           </View>
//         </View>
//       )}

//       {/* Results */}
//       {selectedTab === "results" && (
//         <View className="p-4">
//           <Text className="text-xl font-bold text-[#2C3E50] mb-4">Recent Results</Text>
//           <View className="gap-4">
//             {examResults.map((result) => (
//               <TouchableOpacity
//                 key={result.id}
//                 className="bg-white rounded-2xl p-4 shadow-lg elevation-5"
//                 onPress={() => {
//                   setSelectedResult(result)
//                   setShowResultModal(true)
//                 }}
//               >
//                 <View className="flex-row justify-between items-center mb-2">
//                   <View className="flex-row items-center">
//                     <View
//                       className="w-1 h-4 rounded-sm mr-2"
//                       style={{ backgroundColor: getSubjectColor(result.subject) }}
//                     />
//                     <Text className="text-sm font-semibold text-[#2C3E50]">{result.subject}</Text>
//                   </View>
//                   <View
//                     className="px-3 py-1.5 rounded-xl"
//                     style={{ backgroundColor: `${getGradeColor(result.grade)}20` }}
//                   >
//                     <Text className="text-sm font-bold" style={{ color: getGradeColor(result.grade) }}>
//                       {result.grade}
//                     </Text>
//                   </View>
//                 </View>

//                 <Text className="text-base font-bold text-[#2C3E50] mb-3">{result.type}</Text>

//                 <View className="flex-row justify-between mb-2">
//                   <View className="items-center">
//                     <Text className="text-base font-bold text-[#2C3E50]">
//                       {result.obtainedMarks}/{result.totalMarks}
//                     </Text>
//                     <Text className="text-[10px] text-[#7F8C8D] mt-0.5">Marks</Text>
//                   </View>
//                   <View className="items-center">
//                     <Text className="text-base font-bold text-[#2C3E50]">{result.percentage}%</Text>
//                     <Text className="text-[10px] text-[#7F8C8D] mt-0.5">Percentage</Text>
//                   </View>
//                   <View className="items-center">
//                     <Text className="text-base font-bold text-[#2C3E50]">#{result.rank}</Text>
//                     <Text className="text-[10px] text-[#7F8C8D] mt-0.5">Rank</Text>
//                   </View>
//                 </View>

//                 <Text className="text-xs text-[#7F8C8D] text-right">{formatDate(result.date)}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>
//       )}

//       {/* Report Cards */}
//       {selectedTab === "reports" && (
//         <View className="p-4">
//           <Text className="text-xl font-bold text-[#2C3E50] mb-4">Report Cards</Text>
//           <View className="gap-4">
//             {reportCards.map((report, index) => (
//               <View key={index} className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
//                 <View className="flex-row justify-between items-center mb-4">
//                   <Text className="text-base font-bold text-[#2C3E50]">{report.term}</Text>
//                   <TouchableOpacity className="flex-row items-center px-3 py-1.5 bg-[#6A5ACD]/10 rounded-xl">
//                     <Icon name="download" size={16} color="#6A5ACD" />
//                     <Text className="text-xs text-[#6A5ACD] font-semibold ml-1">Download</Text>
//                   </TouchableOpacity>
//                 </View>

//                 <View className="flex-row justify-between bg-[#EAECEE] p-4 rounded-xl mb-4">
//                   <View className="items-center">
//                     <Text className="text-xl font-extrabold text-[#2C3E50]">{report.overall.percentage}%</Text>
//                     <Text className="text-xs text-[#7F8C8D] mt-1">Overall</Text>
//                   </View>
//                   <View className="items-center">
//                     <Text className="text-xl font-extrabold" style={{ color: getGradeColor(report.overall.grade) }}>
//                       {report.overall.grade}
//                     </Text>
//                     <Text className="text-xs text-[#7F8C8D] mt-1">Grade</Text>
//                   </View>
//                   <View className="items-center">
//                     <Text className="text-xl font-extrabold text-[#2C3E50]">#{report.overall.rank}</Text>
//                     <Text className="text-xs text-[#7F8C8D] mt-1">Rank</Text>
//                   </View>
//                 </View>

//                 <View className="gap-2">
//                   {report.subjects.map((subject, subIndex) => (
//                     <View
//                       key={subIndex}
//                       className="flex-row justify-between items-center py-2 border-b border-[#DDE4EB]"
//                     >
//                       <Text className="text-sm text-[#2C3E50] flex-1">{subject.name}</Text>
//                       <Text className="text-sm font-semibold text-[#2C3E50] mr-4">{subject.marks}</Text>
//                       <Text
//                         className="text-sm font-bold min-w-[30px] text-center"
//                         style={{ color: getGradeColor(subject.grade) }}
//                       >
//                         {subject.grade}
//                       </Text>
//                     </View>
//                   ))}
//                 </View>
//               </View>
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
//         <View className="flex-1 bg-black/50 justify-center items-center">
//           <View className="bg-white rounded-[20px] p-5 w-[90%] max-h-[80%]">
//             <View className="flex-row justify-between items-center mb-5">
//               <Text className="text-xl font-bold text-[#2C3E50]">Result Details</Text>
//               <TouchableOpacity onPress={() => setShowResultModal(false)}>
//                 <Icon name="close" size={24} color="#2C3E50" />
//               </TouchableOpacity>
//             </View>

//             {selectedResult && (
//               <>
//                 <View className="items-center mb-5">
//                   <Text className="text-lg font-bold text-[#6A5ACD]">{selectedResult.subject}</Text>
//                   <Text className="text-sm text-[#7F8C8D] mt-1">{selectedResult.type}</Text>
//                 </View>

//                 <View className="flex-row justify-between mb-5">
//                   <View className="items-center bg-[#EAECEE] p-4 rounded-xl flex-1 mx-1">
//                     <Text className="text-lg font-bold text-[#2C3E50]">{selectedResult.obtainedMarks}</Text>
//                     <Text className="text-[10px] text-[#7F8C8D] mt-1 text-center">Marks Obtained</Text>
//                   </View>
//                   <View className="items-center bg-[#EAECEE] p-4 rounded-xl flex-1 mx-1">
//                     <Text className="text-lg font-bold text-[#2C3E50]">{selectedResult.totalMarks}</Text>
//                     <Text className="text-[10px] text-[#7F8C8D] mt-1 text-center">Total Marks</Text>
//                   </View>
//                   <View className="items-center bg-[#EAECEE] p-4 rounded-xl flex-1 mx-1">
//                     <Text className="text-lg font-bold" style={{ color: getGradeColor(selectedResult.grade) }}>
//                       {selectedResult.grade}
//                     </Text>
//                     <Text className="text-[10px] text-[#7F8C8D] mt-1 text-center">Grade</Text>
//                   </View>
//                 </View>

//                 <View className="bg-[#EAECEE] p-4 rounded-xl">
//                   <Text className="text-sm font-semibold text-[#2C3E50] mb-2">Teacher's Remarks:</Text>
//                   <Text className="text-sm text-[#7F8C8D] leading-5">{selectedResult.remarks}</Text>
//                 </View>
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   )
// }

// export default ExamScreen


"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { Link } from "expo-router"

const ExamScheduleScreen: React.FC = () => {
  const [selectedExam, setSelectedExam] = useState("mid-term")
  const [showExamModal, setShowExamModal] = useState(false)
  const [selectedExamDetail, setSelectedExamDetail] = useState<any>(null)

  const examData = {
    "mid-term": {
      name: "Mid-Term Examination",
      duration: "December 16-22, 2024",
      status: "upcoming",
      totalSubjects: 6,
      completedSubjects: 0,
      schedule: [
        {
          id: 1,
          subject: "Mathematics",
          date: "2024-12-16",
          time: "09:00 AM - 12:00 PM",
          duration: "3 hours",
          room: "Room 101",
          invigilator: "Mrs. Sarah Johnson",
          syllabus: ["Quadratic Equations", "Trigonometry", "Statistics"],
          marks: 100,
          status: "upcoming",
        },
        {
          id: 2,
          subject: "Physics",
          date: "2024-12-17",
          time: "09:00 AM - 12:00 PM",
          duration: "3 hours",
          room: "Room 102",
          invigilator: "Dr. Michael Brown",
          syllabus: ["Light", "Electricity", "Magnetism"],
          marks: 100,
          status: "upcoming",
        },
        {
          id: 3,
          subject: "Chemistry",
          date: "2024-12-18",
          time: "09:00 AM - 12:00 PM",
          duration: "3 hours",
          room: "Room 103",
          invigilator: "Prof. Lisa Anderson",
          syllabus: ["Organic Chemistry", "Acids and Bases", "Metals"],
          marks: 100,
          status: "upcoming",
        },
        {
          id: 4,
          subject: "Biology",
          date: "2024-12-19",
          time: "09:00 AM - 12:00 PM",
          duration: "3 hours",
          room: "Room 104",
          invigilator: "Dr. Robert Wilson",
          syllabus: ["Cell Division", "Genetics", "Evolution"],
          marks: 100,
          status: "upcoming",
        },
        {
          id: 5,
          subject: "English",
          date: "2024-12-20",
          time: "09:00 AM - 12:00 PM",
          duration: "3 hours",
          room: "Room 105",
          invigilator: "Ms. Emily Davis",
          syllabus: ["Literature", "Grammar", "Essay Writing"],
          marks: 100,
          status: "upcoming",
        },
        {
          id: 6,
          subject: "History",
          date: "2024-12-22",
          time: "09:00 AM - 12:00 PM",
          duration: "3 hours",
          room: "Room 106",
          invigilator: "Mr. James Smith",
          syllabus: ["World Wars", "Indian Independence", "Modern History"],
          marks: 100,
          status: "upcoming",
        },
      ],
    },
    final: {
      name: "Final Examination",
      duration: "March 15-25, 2025",
      status: "scheduled",
      totalSubjects: 8,
      completedSubjects: 0,
      schedule: [
        {
          id: 7,
          subject: "Mathematics",
          date: "2025-03-15",
          time: "09:00 AM - 12:00 PM",
          duration: "3 hours",
          room: "Room 101",
          invigilator: "Mrs. Sarah Johnson",
          syllabus: ["Complete Syllabus"],
          marks: 100,
          status: "scheduled",
        },
        {
          id: 8,
          subject: "Physics",
          date: "2025-03-17",
          time: "09:00 AM - 12:00 PM",
          duration: "3 hours",
          room: "Room 102",
          invigilator: "Dr. Michael Brown",
          syllabus: ["Complete Syllabus"],
          marks: 100,
          status: "scheduled",
        },
      ],
    },
    "unit-test": {
      name: "Unit Test",
      duration: "January 20-25, 2025",
      status: "scheduled",
      totalSubjects: 5,
      completedSubjects: 0,
      schedule: [
        {
          id: 9,
          subject: "Mathematics",
          date: "2025-01-20",
          time: "10:00 AM - 11:30 AM",
          duration: "1.5 hours",
          room: "Room 101",
          invigilator: "Mrs. Sarah Johnson",
          syllabus: ["Recent Chapters"],
          marks: 50,
          status: "scheduled",
        },
      ],
    },
  }

  const examTypes = [
    { id: "mid-term", label: "Mid-Term", icon: "quiz", color: "#6A5ACD" },
    { id: "final", label: "Final", icon: "school", color: "#E74C3C" },
    { id: "unit-test", label: "Unit Test", icon: "assignment", color: "#F39C12" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "#F39C12"
      case "completed":
        return "#2ECC71"
      case "scheduled":
        return "#6A5ACD"
      case "ongoing":
        return "#00BCD4"
      default:
        return "#BDC3C7"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return "schedule"
      case "completed":
        return "check-circle"
      case "scheduled":
        return "event"
      case "ongoing":
        return "play-circle-filled"
      default:
        return "help"
    }
  }

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    return timeString
  }

  const getDaysUntilExam = (dateString: string) => {
    const today = new Date()
    const examDate = new Date(dateString)
    const diffTime = examDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const currentExamData = examData[selectedExam as keyof typeof examData]

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
          <Text className="text-xl font-bold text-white">Exam Schedule</Text>
        </View>
        <TouchableOpacity className="p-2">
          <Icon name="download" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Exam Overview Card */}
      <View className="px-4 -mt-8 mb-5">
        <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-lg font-bold text-[#2C3E50]">{currentExamData.name}</Text>
              <Text className="text-sm text-[#7F8C8D]">{currentExamData.duration}</Text>
            </View>
            <View
              className="px-4 py-2 rounded-xl"
              style={{ backgroundColor: `${getStatusColor(currentExamData.status)}20` }}
            >
              <Text className="text-sm font-bold" style={{ color: getStatusColor(currentExamData.status) }}>
                {currentExamData.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-[#6A5ACD]">{currentExamData.totalSubjects}</Text>
              <Text className="text-xs text-[#7F8C8D]">Total Subjects</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-[#2ECC71]">{currentExamData.completedSubjects}</Text>
              <Text className="text-xs text-[#7F8C8D]">Completed</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-[#F39C12]">
                {currentExamData.totalSubjects - currentExamData.completedSubjects}
              </Text>
              <Text className="text-xs text-[#7F8C8D]">Remaining</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-[#E74C3C]">
                {Math.round((currentExamData.completedSubjects / currentExamData.totalSubjects) * 100)}%
              </Text>
              <Text className="text-xs text-[#7F8C8D]">Progress</Text>
            </View>
          </View>
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

      {/* Exam Schedule */}
      <View className="px-4 mb-8">
        <Text className="text-xl font-bold text-[#2C3E50] mb-4">Examination Schedule</Text>
        <View className="gap-4">
          {currentExamData.schedule.map((exam, index) => (
            <TouchableOpacity
              key={exam.id}
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
                    style={{ backgroundColor: `${getSubjectColor(exam.subject)}20` }}
                  >
                    <Text className="text-lg font-bold" style={{ color: getSubjectColor(exam.subject) }}>
                      {index + 1}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-[#2C3E50]">{exam.subject}</Text>
                    <Text className="text-sm text-[#7F8C8D]">{exam.invigilator}</Text>
                  </View>
                </View>
                <View className="items-end">
                  <View
                    className="px-2 py-1 rounded-lg mb-1"
                    style={{ backgroundColor: `${getStatusColor(exam.status)}20` }}
                  >
                    <Text className="text-[10px] font-bold" style={{ color: getStatusColor(exam.status) }}>
                      {exam.status.toUpperCase()}
                    </Text>
                  </View>
                  {exam.status === "upcoming" && (
                    <Text className="text-xs text-[#F39C12] font-semibold">
                      {getDaysUntilExam(exam.date)} days left
                    </Text>
                  )}
                </View>
              </View>

              {/* Date & Time */}
              <View className="bg-[#F8F9FA] rounded-xl p-3 mb-3">
                <View className="flex-row justify-between items-center mb-2">
                  <View className="flex-row items-center">
                    <Icon name="event" size={16} color="#6A5ACD" />
                    <Text className="text-sm font-semibold text-[#2C3E50] ml-2">{formatDate(exam.date)}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Icon name="access-time" size={16} color="#F39C12" />
                    <Text className="text-sm font-semibold text-[#2C3E50] ml-2">{formatTime(exam.time)}</Text>
                  </View>
                </View>
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <Icon name="location-on" size={16} color="#2ECC71" />
                    <Text className="text-sm text-[#2C3E50] ml-2">{exam.room}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Icon name="schedule" size={16} color="#E74C3C" />
                    <Text className="text-sm text-[#2C3E50] ml-2">{exam.duration}</Text>
                  </View>
                </View>
              </View>

              {/* Syllabus Preview */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Icon name="menu-book" size={16} color="#7F8C8D" />
                  <Text className="text-sm text-[#7F8C8D] ml-2">
                    {exam.syllabus.length} topics • {exam.marks} marks
                  </Text>
                </View>
                <Icon name="chevron-right" size={16} color="#7F8C8D" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

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
              <Text className="text-xl font-bold text-[#2C3E50] flex-1 mr-4">Exam Details</Text>
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
                    style={{ backgroundColor: `${getSubjectColor(selectedExamDetail.subject)}20` }}
                  >
                    <Icon name="quiz" size={32} color={getSubjectColor(selectedExamDetail.subject)} />
                  </View>
                  <Text className="text-xl font-bold text-[#2C3E50] text-center mb-2">
                    {selectedExamDetail.subject}
                  </Text>
                  <View
                    className="px-4 py-2 rounded-xl"
                    style={{ backgroundColor: `${getStatusColor(selectedExamDetail.status)}20` }}
                  >
                    <Text className="text-sm font-bold" style={{ color: getStatusColor(selectedExamDetail.status) }}>
                      {selectedExamDetail.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Exam Info */}
                <View className="bg-[#F8F9FA] rounded-2xl p-4 mb-6">
                  <View className="flex-row justify-between mb-3">
                    <View>
                      <Text className="text-xs text-[#7F8C8D] mb-1">Date</Text>
                      <Text className="text-sm font-semibold text-[#2C3E50]">
                        {formatDate(selectedExamDetail.date)}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-xs text-[#7F8C8D] mb-1">Time</Text>
                      <Text className="text-sm font-semibold text-[#2C3E50]">{selectedExamDetail.time}</Text>
                    </View>
                  </View>
                  <View className="flex-row justify-between mb-3">
                    <View>
                      <Text className="text-xs text-[#7F8C8D] mb-1">Duration</Text>
                      <Text className="text-sm font-semibold text-[#2C3E50]">{selectedExamDetail.duration}</Text>
                    </View>
                    <View>
                      <Text className="text-xs text-[#7F8C8D] mb-1">Room</Text>
                      <Text className="text-sm font-semibold text-[#2C3E50]">{selectedExamDetail.room}</Text>
                    </View>
                  </View>
                  <View className="flex-row justify-between">
                    <View>
                      <Text className="text-xs text-[#7F8C8D] mb-1">Invigilator</Text>
                      <Text className="text-sm font-semibold text-[#2C3E50]">{selectedExamDetail.invigilator}</Text>
                    </View>
                    <View>
                      <Text className="text-xs text-[#7F8C8D] mb-1">Total Marks</Text>
                      <Text className="text-sm font-semibold text-[#6A5ACD]">{selectedExamDetail.marks}</Text>
                    </View>
                  </View>
                </View>

                {/* Syllabus */}
                <View className="mb-6">
                  <Text className="text-lg font-bold text-[#2C3E50] mb-3">Syllabus Coverage</Text>
                  <View className="gap-2">
                    {selectedExamDetail.syllabus.map((topic: string, index: number) => (
                      <View key={index} className="flex-row items-center p-3 bg-[#F8F9FA] rounded-xl">
                        <View className="w-6 h-6 rounded-full bg-[#6A5ACD20] items-center justify-center mr-3">
                          <Text className="text-xs font-bold text-[#6A5ACD]">{index + 1}</Text>
                        </View>
                        <Text className="text-sm text-[#2C3E50] flex-1">{topic}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Countdown */}
                {selectedExamDetail.status === "upcoming" && (
                  <View className="bg-[#F39C1210] border border-[#F39C1230] rounded-2xl p-4 mb-6">
                    <View className="items-center">
                      <Icon name="schedule" size={32} color="#F39C12" />
                      <Text className="text-2xl font-bold text-[#F39C12] mt-2">
                        {getDaysUntilExam(selectedExamDetail.date)} Days Left
                      </Text>
                      <Text className="text-sm text-[#7F8C8D] text-center mt-1">
                        Make sure to prepare well and arrive 15 minutes early
                      </Text>
                    </View>
                  </View>
                )}

                {/* Actions */}
                <View className="flex-row gap-3">
                  <TouchableOpacity className="flex-1 bg-[#6A5ACD] rounded-xl py-4 items-center">
                    <Text className="text-base font-bold text-white">Download Admit Card</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 bg-[#F8F9FA] border border-[#DDE4EB] rounded-xl py-4 items-center">
                    <Text className="text-base font-bold text-[#2C3E50]">Set Reminder</Text>
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
