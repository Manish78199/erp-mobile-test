

// import React, { useState, useEffect, useContext } from 'react';
// import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert, RefreshControl } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { Link } from 'expo-router';
// import { getMyHomework } from '@/service/student/homework';
// import { AlertContext } from '@/context/Alert/context';

// interface Homework {
//   _id: string;
//   title: string;
//   description: string;
//   subject: string;
//   assigned_date: string;
//   due_date: string;
//   status: "PENDING" | "COMPLETED" | "OVERDUE";
//   attachments: string[];
//   teacher_name?: string;
//   class_name?: string;
//   priority?: "LOW" | "MEDIUM" | "HIGH";
//   submission_date?: string;
//   created_at: string;
// }

// type FilterStatus = "ALL" | "PENDING" | "COMPLETED" | "OVERDUE";
// type SortBy = "DUE_DATE" | "ASSIGN_DATE" | "SUBJECT" | "STATUS";

// const HomeWorkScreen: React.FC = () => {
//   const { showAlert } = useContext(AlertContext);

//   // State management
//   const [homeworkData, setHomeworkData] = useState<Homework[]>([]);
//   const [filteredHomework, setFilteredHomework] = useState<Homework[]>([]);
//   const [selectedFilter, setSelectedFilter] = useState<FilterStatus>("ALL");
//   const [sortBy, setSortBy] = useState<SortBy>("DUE_DATE");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   // Modal states
//   const [showSubmissionModal, setShowSubmissionModal] = useState(false);
//   const [selectedAssignment, setSelectedAssignment] = useState<Homework | null>(null);

//   // Fetch homework data
//   const getHomeworkRequest = async () => {
//     setIsLoading(true);
//     try {
//       const allHomework = await getMyHomework();
//       setHomeworkData(allHomework);
//       setFilteredHomework(allHomework);
//     } catch (error) {
//       showAlert("ERROR", "Failed to fetch homework data");
//       console.error('Homework fetch error:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Pull to refresh
//   const onRefresh = async () => {
//     setRefreshing(true);
//     await getHomeworkRequest();
//     setRefreshing(false);
//   };

//   useEffect(() => {
//     getHomeworkRequest();
//   }, []);

//   // Filter and sort homework
//   useEffect(() => {
//     let filtered = [...homeworkData];

//     // Filter by status
//     if (selectedFilter !== "ALL") {
//       filtered = filtered.filter((work) => work.status === selectedFilter);
//     }

//     // Filter by search term
//     if (searchTerm) {
//       filtered = filtered.filter(
//         (work) =>
//           work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           work.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           work.description.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Sort homework
//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case "DUE_DATE":
//           return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
//         case "ASSIGN_DATE":
//           return new Date(b.assigned_date).getTime() - new Date(a.assigned_date).getTime();
//         case "SUBJECT":
//           return a.subject.localeCompare(b.subject);
//         case "STATUS":
//           return a.status.localeCompare(b.status);
//         default:
//           return 0;
//       }
//     });

//     setFilteredHomework(filtered);
//   }, [homeworkData, selectedFilter, searchTerm, sortBy]);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "PENDING":
//         return "#F39C12";
//       case "COMPLETED":
//         return "#2ECC71";
//       case "OVERDUE":
//         return "#E74C3C";
//       default:
//         return "#BDC3C7";
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "COMPLETED":
//         return "check-circle";
//       case "PENDING":
//         return "schedule";
//       case "OVERDUE":
//         return "warning";
//       default:
//         return "help";
//     }
//   };

//   const getPriorityColor = (priority?: string) => {
//     switch (priority) {
//       case "HIGH":
//         return "#E74C3C";
//       case "MEDIUM":
//         return "#F39C12";
//       case "LOW":
//         return "#2ECC71";
//       default:
//         return "#BDC3C7";
//     }
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   const getDaysUntilDue = (dueDate: string) => {
//     const today = new Date();
//     const due = new Date(dueDate);
//     const diffTime = due.getTime() - today.getTime();
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays;
//   };

//   const isOverdue = (dueDate: string, status: string) => {
//     return new Date(dueDate) < new Date() && status === "PENDING";
//   };

//   const getHomeworkStats = () => {
//     const total = homeworkData.length;
//     const pending = homeworkData.filter((h) => h.status === "PENDING").length;
//     const completed = homeworkData.filter((h) => h.status === "COMPLETED").length;
//     const overdue = homeworkData.filter((h) => isOverdue(h.due_date, h.status)).length;

//     return { total, pending, completed, overdue };
//   };

//   const stats = getHomeworkStats();

//   return (
//     <ScrollView 
//       className="flex-1 bg-[#F0F4F8]" 
//       showsVerticalScrollIndicator={false}
//       refreshControl={
//         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//       }
//     >
//       {/* Header */}
//       <View className="flex-row items-center justify-between bg-[#6A5ACD] pt-12 pb-5 px-4 rounded-b-[25px]">
//         <Link href="/student" asChild>
//           <TouchableOpacity className="p-2">
//             <Icon name="arrow-back" size={24} color="white" />
//           </TouchableOpacity>
//         </Link>
//         <View className="flex-1 items-center">
//           <Text className="text-xl font-bold text-white">Homework</Text>
//         </View>
//         <TouchableOpacity className="p-2" onPress={getHomeworkRequest}>
//           <Icon name="refresh" size={20} color="white" />
//         </TouchableOpacity>
//       </View>

//       {/* Stats Cards */}
//       <View className="px-4 -mt-8 mb-5">
//         <View className="flex-row justify-between">
//           <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
//             <View className="w-12 h-12 bg-[#6A5ACD20] rounded-full items-center justify-center mb-2">
//               <Icon name="assignment" size={24} color="#6A5ACD" />
//             </View>
//             <Text className="text-2xl font-extrabold text-[#2C3E50]">{stats.total}</Text>
//             <Text className="text-xs text-[#7F8C8D] text-center">Total</Text>
//           </View>
//           <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
//             <View className="w-12 h-12 bg-[#2ECC7120] rounded-full items-center justify-center mb-2">
//               <Icon name="check-circle" size={24} color="#2ECC71" />
//             </View>
//             <Text className="text-2xl font-extrabold text-[#2C3E50]">{stats.completed}</Text>
//             <Text className="text-xs text-[#7F8C8D] text-center">Completed</Text>
//           </View>
//           <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
//             <View className="w-12 h-12 bg-[#F39C1220] rounded-full items-center justify-center mb-2">
//               <Icon name="schedule" size={24} color="#F39C12" />
//             </View>
//             <Text className="text-2xl font-extrabold text-[#2C3E50]">{stats.pending}</Text>
//             <Text className="text-xs text-[#7F8C8D] text-center">Pending</Text>
//           </View>
//           <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
//             <View className="w-12 h-12 bg-[#E74C3C20] rounded-full items-center justify-center mb-2">
//               <Icon name="warning" size={24} color="#E74C3C" />
//             </View>
//             <Text className="text-2xl font-extrabold text-[#2C3E50]">{stats.overdue}</Text>
//             <Text className="text-xs text-[#7F8C8D] text-center">Overdue</Text>
//           </View>
//         </View>
//       </View>

//       {/* Search Bar */}
//       <View className="px-4 mb-5">
//         <View className="bg-white rounded-2xl p-3 shadow-lg elevation-5 flex-row items-center">
//           <Icon name="search" size={20} color="#7F8C8D" />
//           <TextInput
//             className="flex-1 ml-3 text-[#2C3E50]"
//             placeholder="Search homework..."
//             value={searchTerm}
//             onChangeText={setSearchTerm}
//             placeholderTextColor="#7F8C8D"
//           />
//         </View>
//       </View>

//       {/* Filter Tabs */}
//       <View className="px-4 mb-5">
//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//           {(["ALL", "PENDING", "COMPLETED", "OVERDUE"] as FilterStatus[]).map((filter) => (
//             <TouchableOpacity
//               key={filter}
//               className={`px-5 py-2.5 mr-3 rounded-[20px] border ${
//                 selectedFilter === filter ? "bg-[#6A5ACD] border-[#6A5ACD]" : "bg-white border-[#DDE4EB]"
//               }`}
//               onPress={() => setSelectedFilter(filter)}
//             >
//               <Text className={`text-sm font-semibold ${selectedFilter === filter ? "text-white" : "text-[#7F8C8D]"}`}>
//                 {filter === "ALL" ? `All (${stats.total})` : 
//                  filter === "PENDING" ? `Pending (${stats.pending})` :
//                  filter === "COMPLETED" ? `Completed (${stats.completed})` :
//                  `Overdue (${stats.overdue})`}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       {/* Loading State */}
//       {isLoading && (
//         <View className="flex-1 items-center justify-center py-8">
//           <Icon name="refresh" size={32} color="#6A5ACD" />
//           <Text className="text-[#7F8C8D] mt-2">Loading homework...</Text>
//         </View>
//       )}

//       {/* Homework List */}
//       {!isLoading && (
//         <View className="px-4 mb-8">
//           <Text className="text-xl font-bold text-[#2C3E50] mb-4">Assignments</Text>
//           {filteredHomework.length > 0 ? (
//             <View className="gap-4">
//               {filteredHomework.map((homework) => {
//                 const isHomeworkOverdue = isOverdue(homework.due_date, homework.status);

//                 return (
//                   <TouchableOpacity
//                     key={homework._id}
//                     className={`bg-white rounded-2xl p-4 shadow-lg elevation-5 ${
//                       homework.status === "COMPLETED" ? "border-l-4 border-[#2ECC71]" : 
//                       isHomeworkOverdue ? "" : ""
//                     }`}
//                     onPress={() => {
//                       setSelectedAssignment(homework);
//                       setShowSubmissionModal(true);
//                     }}
//                   >
//                     {/* Header */}
//                     <View className="flex-row items-center justify-between mb-3">
//                       <View className="flex-row items-center flex-1">
//                         <View className="flex-1">
//                           <Text className="text-base font-bold text-[#2C3E50]" numberOfLines={2}>
//                             {homework.title}
//                           </Text>
//                           <Text className="text-sm text-[#7F8C8D]">
//                             {homework.subject} • {homework.teacher_name || "Teacher"}
//                           </Text>
//                         </View>
//                       </View>
//                       <View className="flex-row items-center">
//                         {homework.priority && (
//                           <View
//                             className="px-2 py-1 rounded-lg mr-2"
//                             style={{ backgroundColor: `${getPriorityColor(homework.priority)}20` }}
//                           >
//                             <Text className="text-[10px] font-bold" style={{ color: getPriorityColor(homework.priority) }}>
//                               {homework.priority}
//                             </Text>
//                           </View>
//                         )}
//                         <View
//                           className="px-2 py-1 rounded-lg"
//                           style={{ backgroundColor: `${getStatusColor(homework.status)}20` }}
//                         >
//                           <Text className="text-[10px] font-bold" style={{ color: getStatusColor(homework.status) }}>
//                             {homework.status}
//                           </Text>
//                         </View>
//                       </View>
//                     </View>

//                     {/* Description */}
//                     <Text className="text-sm text-[#7F8C8D] leading-5 mb-3" numberOfLines={2}>
//                       {homework.description}
//                     </Text>

//                     {/* Details */}
//                     <View className="space-y-2">
//                       <View className="flex-row justify-between items-center text-sm">
//                         <Text className="text-[#7F8C8D]">Assigned:</Text>
//                         <Text className="text-[#2C3E50] font-medium text-xs">{formatDate(homework.assigned_date)}</Text>
//                       </View>
//                       <View className={`flex-row justify-between items-center ${isHomeworkOverdue ? "text-red-500" : ""}`}>
//                         <Text className="text-[#7F8C8D]">Due:</Text>
//                         <Text className={`font-medium text-xs ${isHomeworkOverdue ? "text-[#E74C3C]" : "text-[#2C3E50]"}`}>
//                           {formatDate(homework.due_date)}
//                           {isHomeworkOverdue && " (Overdue)"}
//                         </Text>
//                       </View>
//                       {homework.attachments && homework.attachments.length > 0 && (
//                         <View className="flex-row items-center">
//                           <Icon name="attachment" size={16} color="#7F8C8D" />
//                           <Text className="text-xs text-[#7F8C8D] ml-1">{homework.attachments.length} attachment(s)</Text>
//                         </View>
//                       )}
//                     </View>

//                     {/* Submission Info */}
//                     {homework.status === "COMPLETED" && homework.submission_date && (
//                       <View className="mt-3 pt-3 border-t border-[#EAECEE]">
//                         <View className="flex-row items-center">
//                           <Icon name="check-circle" size={16} color="#2ECC71" />
//                           <Text className="text-xs text-[#2ECC71] ml-1">
//                             Submitted on {formatDate(homework.submission_date)}
//                           </Text>
//                         </View>
//                       </View>
//                     )}
//                   </TouchableOpacity>
//                 );
//               })}
//             </View>
//           ) : (
//             <View className="text-center py-8">
//               <Icon name="assignment" size={48} color="#BDC3C7" />
//               <Text className="text-[#7F8C8D] mt-4">
//                 {searchTerm || selectedFilter !== "ALL"
//                   ? "No homework found matching your criteria."
//                   : "No homework assigned yet."}
//               </Text>
//             </View>
//           )}
//         </View>
//       )}

//       {/* Assignment Detail Modal */}
//       <Modal
//         visible={showSubmissionModal}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowSubmissionModal(false)}
//       >
//         <View className="flex-1 bg-black/50 justify-end">
//           <View className="bg-white rounded-t-[25px] p-5 max-h-[90%]">
//             <View className="flex-row justify-between items-center mb-5">
//               <Text className="text-xl font-bold text-[#2C3E50] flex-1 mr-4">Assignment Details</Text>
//               <TouchableOpacity onPress={() => setShowSubmissionModal(false)}>
//                 <Icon name="close" size={24} color="#2C3E50" />
//               </TouchableOpacity>
//             </View>

//             {selectedAssignment && (
//               <ScrollView showsVerticalScrollIndicator={false}>
//                 {/* Assignment Header */}
//                 <View className="items-center mb-6">
//                   <View
//                     className="w-16 h-16 rounded-full items-center justify-center mb-3"
//                     style={{ backgroundColor: `${getStatusColor(selectedAssignment.status)}20` }}
//                   >
//                     <Icon name="assignment" size={32} color={getStatusColor(selectedAssignment.status)} />
//                   </View>
//                   <Text className="text-xl font-bold text-[#2C3E50] text-center mb-2">{selectedAssignment.title}</Text>
//                   <Text className="text-sm text-[#7F8C8D] text-center">
//                     {selectedAssignment.subject} • {selectedAssignment.teacher_name || "Teacher"}
//                   </Text>
//                 </View>

//                 {/* Assignment Info */}
//                 <View className="bg-[#F8F9FA] rounded-2xl p-4 mb-6">
//                   <View className="flex-row justify-between mb-3">
//                     <View>
//                       <Text className="text-xs text-[#7F8C8D] mb-1">Assigned Date</Text>
//                       <Text className="text-sm font-semibold text-[#2C3E50]">
//                         {formatDate(selectedAssignment.assigned_date)}
//                       </Text>
//                     </View>
//                     <View>
//                       <Text className="text-xs text-[#7F8C8D] mb-1">Due Date</Text>
//                       <Text className={`text-sm font-semibold ${
//                         isOverdue(selectedAssignment.due_date, selectedAssignment.status) ? "text-[#E74C3C]" : "text-[#2C3E50]"
//                       }`}>
//                         {formatDate(selectedAssignment.due_date)}
//                       </Text>
//                     </View>
//                   </View>
//                   <View className="flex-row justify-between">
//                     <View>
//                       <Text className="text-xs text-[#7F8C8D] mb-1">Status</Text>
//                       <Text className="text-sm font-semibold" style={{ color: getStatusColor(selectedAssignment.status) }}>
//                         {selectedAssignment.status}
//                       </Text>
//                     </View>
//                     {selectedAssignment.priority && (
//                       <View>
//                         <Text className="text-xs text-[#7F8C8D] mb-1">Priority</Text>
//                         <Text className="text-sm font-semibold" style={{ color: getPriorityColor(selectedAssignment.priority) }}>
//                           {selectedAssignment.priority}
//                         </Text>
//                       </View>
//                     )}
//                   </View>
//                 </View>

//                 {/* Description */}
//                 <View className="mb-6">
//                   <Text className="text-lg font-bold text-[#2C3E50] mb-3">Description</Text>
//                   <Text className="text-sm text-[#2C3E50] leading-6">{selectedAssignment.description}</Text>
//                 </View>

//                 {/* Attachments */}
//                 {selectedAssignment.attachments && selectedAssignment.attachments.length > 0 && (
//                   <View className="mb-6">
//                     <Text className="text-lg font-bold text-[#2C3E50] mb-3">Attachments</Text>
//                     <View className="gap-2">
//                       {selectedAssignment.attachments.map((attachment: string, index: number) => (
//                         <TouchableOpacity key={index} className="flex-row items-center p-3 bg-[#F8F9FA] rounded-xl">
//                           <Icon name="attach-file" size={20} color="#6A5ACD" />
//                           <Text className="text-sm text-[#2C3E50] ml-2 flex-1">{attachment}</Text>
//                           <Icon name="download" size={16} color="#6A5ACD" />
//                         </TouchableOpacity>
//                       ))}
//                     </View>
//                   </View>
//                 )}

//                 {/* Submission Status */}
//                 {selectedAssignment.status === "COMPLETED" && selectedAssignment.submission_date ? (
//                   <View className="mb-6">
//                     <Text className="text-lg font-bold text-[#2C3E50] mb-3">Submission Details</Text>
//                     <View className="bg-[#2ECC7110] border border-[#2ECC7130] rounded-2xl p-4">
//                       <View className="flex-row items-center">
//                         <Icon name="check-circle" size={20} color="#2ECC71" />
//                         <Text className="text-sm font-semibold text-[#2ECC71] ml-2">
//                           Submitted on {formatDate(selectedAssignment.submission_date)}
//                         </Text>
//                       </View>
//                     </View>
//                   </View>
//                 ) : (
//                   <View className="mb-6">
//                     <Text className="text-lg font-bold text-[#2C3E50] mb-3">Submit Assignment</Text>
//                     <TouchableOpacity className="border-2 border-dashed border-[#6A5ACD] rounded-xl p-6 items-center">
//                       <Icon name="cloud-upload" size={32} color="#6A5ACD" />
//                       <Text className="text-sm text-[#6A5ACD] mt-2">Click to upload your assignment</Text>
//                       <Text className="text-xs text-[#7F8C8D] mt-1">PDF, DOC, DOCX, JPG, PNG (Max 10MB)</Text>
//                     </TouchableOpacity>
//                   </View>
//                 )}
//               </ScrollView>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// };

// export default HomeWorkScreen;


"use client"

import type React from "react"
import { useState, useEffect, useContext } from "react"
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, RefreshControl } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { Link } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getMyHomework } from "@/service/student/homework"
import { AlertContext } from "@/context/Alert/context"

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
          <Text className="text-xl font-bold text-white">Homework</Text>
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
            <Text className="text-2xl font-extrabold text-[#2C3E50]">{stats.total}</Text>
            <Text className="text-xs text-[#7F8C8D] text-center">Total</Text>
          </View>
          <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
            <View className="w-12 h-12 bg-[#F39C1220] rounded-full items-center justify-center mb-2">
              <Icon name="pending-actions" size={24} color="#F39C12" />
            </View>
            <Text className="text-2xl font-extrabold text-[#2C3E50]">{stats.pending}</Text>
            <Text className="text-xs text-[#7F8C8D] text-center">Pending</Text>
          </View>
          <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
            <View className="w-12 h-12 bg-[#2ECC7120] rounded-full items-center justify-center mb-2">
              <Icon name="assignment-turned-in" size={24} color="#2ECC71" />
            </View>
            <Text className="text-2xl font-extrabold text-[#2C3E50]">{stats.submitted}</Text>
            <Text className="text-xs text-[#7F8C8D] text-center">Submitted</Text>
          </View>
          <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
            <View className="w-12 h-12 bg-[#E74C3C20] rounded-full items-center justify-center mb-2">
              <Icon name="assignment-late" size={24} color="#E74C3C" />
            </View>
            <Text className="text-2xl font-extrabold text-[#2C3E50]">{stats.overdue}</Text>
            <Text className="text-xs text-[#7F8C8D] text-center">Overdue</Text>
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
              <Text
                className={`text-sm font-semibold ml-2 ${selectedFilter === subject.id ? "text-[#2C3E50]" : "text-[#7F8C8D]"
                  }`}
              >
                {subject.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Loading State */}
      {isLoading && (
        <View className="flex-1 items-center justify-center py-8">
          <Icon name="refresh" size={32} color="#6A5ACD" />
          <Text className="text-[#7F8C8D] mt-2">Loading homework...</Text>
        </View>
      )}

      {/* Homework List */}
      {!isLoading && (
        <View className="px-4 mb-8">
          <Text className="text-xl font-bold text-[#2C3E50] mb-4">
            {selectedFilter === "all" ? "All Homework" : subjects.find((sub) => sub.id === selectedFilter)?.label}
          </Text>
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
                        <View
                          className="w-10 h-10 rounded-full items-center justify-center mr-3"
                          style={{ backgroundColor: `${getSubjectColor(homework.subject)}20` }}
                        >
                          <Icon
                            name={getSubjectIcon(homework.subject)}
                            size={20}
                            color={getSubjectColor(homework.subject)}
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-base font-bold text-[#2C3E50]" numberOfLines={1}>
                            {homework.title}
                          </Text>
                          <View className="flex items-center flex-row">
                            <Text style={{ backgroundColor: getSubjectColor(homework.subject) }} className={`text-xs p-[2px] text-white rounded-md  `}>
                              {homework.subject}
                            </Text>
                            <Text> {homework.teacher}</Text>

                          </View>

                        </View>
                      </View>
                      <View className="items-end">
                        <View
                          className="px-2 py-1 rounded-lg mb-1"
                          style={{ backgroundColor: `${getStatusColor(homework.status)}20` }}
                        >
                          <Text className="text-[10px] font-bold" style={{ color: getStatusColor(homework.status) }}>
                            {homework.status?.toUpperCase() || "PENDING"}
                          </Text>
                        </View>
                        {daysUntilDue !== null && (
                          <Text className={`text-xs ${daysUntilDue < 0 ? "text-[#E74C3C]" : "text-[#7F8C8D]"}`}>
                            {daysUntilDue < 0
                              ? `${Math.abs(daysUntilDue)} days overdue`
                              : daysUntilDue === 0
                                ? "Due today"
                                : `${daysUntilDue} days left`}
                          </Text>
                        )}
                      </View>
                    </View>

                    {/* Content Preview */}
                    <Text className="text-sm text-[#7F8C8D] leading-5 mb-3" numberOfLines={2}>
                      {homework.description}
                    </Text>

                    {/* Footer */}
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <View
                          className="px-2 py-1 rounded-lg mr-2"
                          style={{ backgroundColor: `${getPriorityColor(homework.priority)}20` }}
                        >
                          <Text
                            className="text-[10px] font-bold"
                            style={{ color: getPriorityColor(homework.priority) }}
                          >
                            {homework.priority?.toUpperCase() || "MEDIUM"}
                          </Text>
                        </View>
                        {homework.attachments && homework.attachments.length > 0 && (
                          <>
                            <Icon name="attachment" size={16} color="#6A5ACD" />
                            <Text className="text-xs text-[#6A5ACD] ml-1">{homework.attachments.length}</Text>
                          </>
                        )}
                      </View>
                      <Text className="text-xs text-[#7F8C8D]">Due: {formatDate(homework.due_date)}</Text>
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>
          ) : (
            <View className="text-center py-8">
              <Icon name="assignment" size={48} color="#BDC3C7" />
              <Text className="text-[#7F8C8D] mt-4">
                {searchTerm || selectedFilter !== "all"
                  ? "No homework found matching your criteria."
                  : "No homework assignments yet."}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Homework Submission Modal */}
      <Modal
        visible={showSubmissionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSubmissionModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[25px] p-5 max-h-[90%]">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-xl font-bold text-[#2C3E50] flex-1 mr-4">Assignment Details</Text>
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
                  <Text className="text-xl font-bold text-[#2C3E50] text-center mb-2">{selectedHomework.title}</Text>
                  <Text className="text-sm text-[#7F8C8D] text-center">
                    {selectedHomework.subject} • {selectedHomework.teacher || "Teacher"}
                  </Text>
                </View>

                {/* Assignment Info */}
                <View className="bg-[#F8F9FA] rounded-2xl p-4 mb-6">
                  <View className="flex-row justify-between mb-3">
                    <View>
                      <Text className="text-xs text-[#7F8C8D] mb-1">Assigned Date</Text>
                      <Text className="text-sm font-semibold text-[#2C3E50]">
                        {formatDate(selectedHomework.created_at)}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-xs text-[#7F8C8D] mb-1">Due Date</Text>
                      <Text
                        className={`text-sm font-semibold ${isOverdue(selectedHomework.due_date, selectedHomework.status)
                          ? "text-[#E74C3C]"
                          : "text-[#2C3E50]"
                          }`}
                      >
                        {formatDate(selectedHomework.due_date)}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row justify-between">
                    <View>
                      <Text className="text-xs text-[#7F8C8D] mb-1">Status</Text>
                      <Text
                        className="text-sm font-semibold"
                        style={{ color: getStatusColor(selectedHomework.status) }}
                      >
                        {selectedHomework.status || "PENDING"}
                      </Text>
                    </View>
                    {selectedHomework.priority && (
                      <View>
                        <Text className="text-xs text-[#7F8C8D] mb-1">Priority</Text>
                        <Text
                          className="text-sm font-semibold"
                          style={{ color: getPriorityColor(selectedHomework.priority) }}
                        >
                          {selectedHomework.priority}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Description */}
                <View className="mb-6">
                  <Text className="text-lg font-bold text-[#2C3E50] mb-3">Description</Text>
                  <Text className="text-sm text-[#2C3E50] leading-6">{selectedHomework.description}</Text>
                </View>

                {/* Attachments */}
                {selectedHomework.attachments && selectedHomework.attachments.length > 0 && (
                  <View className="mb-6">
                    <Text className="text-lg font-bold text-[#2C3E50] mb-3">Attachments</Text>
                    <View className="gap-2">
                      {selectedHomework.attachments.map((attachment: string, index: number) => (
                        <TouchableOpacity key={index} className="flex-row items-center p-3 bg-[#F8F9FA] rounded-xl">
                          <Icon name="attach-file" size={20} color="#6A5ACD" />
                          <Text className="text-sm text-[#2C3E50] ml-2 flex-1">{attachment}</Text>
                          <Icon name="download" size={16} color="#6A5ACD" />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {/* Submission Status */}
                {selectedHomework.status === "SUBMITTED" && selectedHomework.submission_date ? (
                  <View className="mb-6">
                    <Text className="text-lg font-bold text-[#2C3E50] mb-3">Submission Details</Text>
                    <View className="bg-[#2ECC7110] border border-[#2ECC7130] rounded-2xl p-4">
                      <View className="flex-row items-center">
                        <Icon name="check-circle" size={20} color="#2ECC71" />
                        <Text className="text-sm font-semibold text-[#2ECC71] ml-2">
                          Submitted on {formatDate(selectedHomework.submission_date)}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View className="mb-6">
                    <Text className="text-lg font-bold text-[#2C3E50] mb-3">Submit Assignment</Text>
                    <TouchableOpacity className="border-2 border-dashed border-[#6A5ACD] rounded-xl p-6 items-center">
                      <Icon name="cloud-upload" size={32} color="#6A5ACD" />
                      <Text className="text-sm text-[#6A5ACD] mt-2">Click to upload your assignment</Text>
                      <Text className="text-xs text-[#7F8C8D] mt-1">PDF, DOC, DOCX, JPG, PNG (Max 10MB)</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Grading Info */}
                {selectedHomework.status === "GRADED" && selectedHomework.marks !== undefined && (
                  <View className="bg-[#6A5ACD10] border border-[#6A5ACD30] rounded-2xl p-4 mb-6">
                    <Text className="text-lg font-bold text-[#2C3E50] mb-2">Grade</Text>
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-sm text-[#7F8C8D]">Score:</Text>
                      <Text className="text-lg font-bold text-[#6A5ACD]">
                        {selectedHomework.marks}/{selectedHomework.total_marks || 100}
                      </Text>
                    </View>
                    {selectedHomework.feedback && (
                      <View>
                        <Text className="text-sm text-[#7F8C8D] mb-1">Feedback:</Text>
                        <Text className="text-sm text-[#2C3E50]">{selectedHomework.feedback}</Text>
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
