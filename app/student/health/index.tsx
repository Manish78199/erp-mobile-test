// "use client"

// import type React from "react"
// import { useState } from "react"
// import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput } from "react-native"
// import Icon from "react-native-vector-icons/MaterialIcons"
// import { Link } from "expo-router"

// const HealthScreen: React.FC = () => {
//   const [selectedTab, setSelectedTab] = useState("overview")
//   const [showReportModal, setShowReportModal] = useState(false)

//   const healthData = {
//     profile: {
//       height: "165 cm",
//       weight: "58 kg",
//       bloodGroup: "B+",
//       bmi: 21.3,
//       lastCheckup: "2024-11-15",
//       allergies: ["Peanuts", "Dust"],
//       medications: ["Vitamin D", "Iron Supplement"],
//       emergencyContact: "+91 98765 43210",
//     },
//     vitals: [
//       { name: "Blood Pressure", value: "120/80", unit: "mmHg", status: "normal", icon: "favorite", color: "#2ECC71" },
//       { name: "Heart Rate", value: "72", unit: "bpm", status: "normal", icon: "monitor-heart", color: "#E74C3C" },
//       { name: "Temperature", value: "98.6", unit: "°F", status: "normal", icon: "thermostat", color: "#F39C12" },
//       { name: "BMI", value: "21.3", unit: "", status: "normal", icon: "fitness-center", color: "#6A5ACD" },
//     ],
//     records: [
//       {
//         id: 1,
//         date: "2024-12-10",
//         type: "checkup",
//         title: "Regular Health Checkup",
//         doctor: "Dr. Sarah Wilson",
//         notes: "All vitals normal. Continue current medication.",
//         status: "completed",
//       },
//       {
//         id: 2,
//         date: "2024-11-28",
//         type: "vaccination",
//         title: "Flu Vaccination",
//         doctor: "Nurse Mary Johnson",
//         notes: "Annual flu shot administered. No adverse reactions.",
//         status: "completed",
//       },
//       {
//         id: 3,
//         date: "2024-11-15",
//         type: "illness",
//         title: "Common Cold",
//         doctor: "Dr. Michael Brown",
//         notes: "Prescribed rest and medication. Recovery expected in 5-7 days.",
//         status: "recovered",
//       },
//     ],
//     appointments: [
//       {
//         id: 1,
//         date: "2024-12-20",
//         time: "10:30 AM",
//         doctor: "Dr. Sarah Wilson",
//         type: "Follow-up",
//         status: "scheduled",
//       },
//       {
//         id: 2,
//         date: "2024-12-25",
//         time: "02:00 PM",
//         doctor: "Dr. James Smith",
//         type: "Dental Checkup",
//         status: "scheduled",
//       },
//     ],
//     symptoms: [
//       { name: "Headache", severity: "mild", frequency: "occasional", lastReported: "2024-12-08" },
//       { name: "Fatigue", severity: "mild", frequency: "rare", lastReported: "2024-12-05" },
//     ],
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "normal":
//       case "completed":
//       case "recovered":
//         return "#2ECC71"
//       case "high":
//       case "pending":
//         return "#F39C12"
//       case "critical":
//       case "cancelled":
//         return "#E74C3C"
//       default:
//         return "#BDC3C7"
//     }
//   }

//   const getTypeIcon = (type: string) => {
//     switch (type) {
//       case "checkup":
//         return "health-and-safety"
//       case "vaccination":
//         return "vaccines"
//       case "illness":
//         return "sick"
//       case "Follow-up":
//         return "event-repeat"
//       case "Dental Checkup":
//         return "medical-services"
//       default:
//         return "medical-services"
//     }
//   }

//   const getSeverityColor = (severity: string) => {
//     switch (severity) {
//       case "mild":
//         return "#2ECC71"
//       case "moderate":
//         return "#F39C12"
//       case "severe":
//         return "#E74C3C"
//       default:
//         return "#BDC3C7"
//     }
//   }

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     })
//   }

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
//           <Text className="text-xl font-bold text-white">Health Records</Text>
//         </View>
//         <TouchableOpacity className="p-2" onPress={() => setShowReportModal(true)}>
//           <Icon name="add" size={20} color="white" />
//         </TouchableOpacity>
//       </View>

//       {/* Health Overview Cards */}
//       <View className="px-4 -mt-8 mb-5">
//         <View className="flex-row justify-between mb-4">
//           <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
//             <View className="w-12 h-12 bg-[#2ECC7120] rounded-full items-center justify-center mb-2">
//               <Icon name="health-and-safety" size={24} color="#2ECC71" />
//             </View>
//             <Text className="text-lg font-bold text-[#2C3E50]">Excellent</Text>
//             <Text className="text-xs text-[#7F8C8D] text-center">Overall Health</Text>
//           </View>
//           <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
//             <View className="w-12 h-12 bg-[#6A5ACD20] rounded-full items-center justify-center mb-2">
//               <Icon name="fitness-center" size={24} color="#6A5ACD" />
//             </View>
//             <Text className="text-lg font-bold text-[#2C3E50]">{healthData.profile.bmi}</Text>
//             <Text className="text-xs text-[#7F8C8D] text-center">BMI Score</Text>
//           </View>
//           <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
//             <View className="w-12 h-12 bg-[#F39C1220] rounded-full items-center justify-center mb-2">
//               <Icon name="event" size={24} color="#F39C12" />
//             </View>
//             <Text className="text-lg font-bold text-[#2C3E50]">{healthData.appointments.length}</Text>
//             <Text className="text-xs text-[#7F8C8D] text-center">Upcoming</Text>
//           </View>
//         </View>
//       </View>

//       {/* Tab Navigation */}
//       <View className="px-4 mb-5">
//         <View className="flex-row bg-white rounded-2xl p-1 shadow-lg elevation-5">
//           {["overview", "records", "appointments", "symptoms"].map((tab) => (
//             <TouchableOpacity
//               key={tab}
//               className={`flex-1 py-3 items-center rounded-xl ${
//                 selectedTab === tab ? "bg-[#6A5ACD]" : "bg-transparent"
//               }`}
//               onPress={() => setSelectedTab(tab)}
//             >
//               <Text className={`text-sm font-semibold ${selectedTab === tab ? "text-white" : "text-[#7F8C8D]"}`}>
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       {/* Overview Tab */}
//       {selectedTab === "overview" && (
//         <View className="px-4">
//           {/* Health Profile */}
//           <View className="bg-white rounded-2xl p-4 mb-5 shadow-lg elevation-5">
//             <Text className="text-lg font-bold text-[#2C3E50] mb-4">Health Profile</Text>
//             <View className="flex-row flex-wrap">
//               <View className="w-1/2 mb-4">
//                 <Text className="text-sm text-[#7F8C8D] mb-1">Height</Text>
//                 <Text className="text-base font-semibold text-[#2C3E50]">{healthData.profile.height}</Text>
//               </View>
//               <View className="w-1/2 mb-4">
//                 <Text className="text-sm text-[#7F8C8D] mb-1">Weight</Text>
//                 <Text className="text-base font-semibold text-[#2C3E50]">{healthData.profile.weight}</Text>
//               </View>
//               <View className="w-1/2 mb-4">
//                 <Text className="text-sm text-[#7F8C8D] mb-1">Blood Group</Text>
//                 <Text className="text-base font-semibold text-[#E74C3C]">{healthData.profile.bloodGroup}</Text>
//               </View>
//               <View className="w-1/2 mb-4">
//                 <Text className="text-sm text-[#7F8C8D] mb-1">Last Checkup</Text>
//                 <Text className="text-base font-semibold text-[#2C3E50]">{formatDate(healthData.profile.lastCheckup)}</Text>
//               </View>
//             </View>

//             <View className="border-t border-[#EAECEE] pt-4 mt-2">
//               <View className="mb-3">
//                 <Text className="text-sm font-semibold text-[#2C3E50] mb-2">Allergies</Text>
//                 <View className="flex-row flex-wrap">
//                   {healthData.profile.allergies.map((allergy, index) => (
//                     <View key={index} className="bg-[#E74C3C20] px-3 py-1 rounded-xl mr-2 mb-2">
//                       <Text className="text-sm text-[#E74C3C]">{allergy}</Text>
//                     </View>
//                   ))}
//                 </View>
//               </View>

//               <View>
//                 <Text className="text-sm font-semibold text-[#2C3E50] mb-2">Current Medications</Text>
//                 <View className="flex-row flex-wrap">
//                   {healthData.profile.medications.map((medication, index) => (
//                     <View key={index} className="bg-[#2ECC7120] px-3 py-1 rounded-xl mr-2 mb-2">
//                       <Text className="text-sm text-[#2ECC71]">{medication}</Text>
//                     </View>
//                   ))}
//                 </View>
//               </View>
//             </View>
//           </View>

//           {/* Vital Signs */}
//           <View className="bg-white rounded-2xl p-4 mb-5 shadow-lg elevation-5">
//             <Text className="text-lg font-bold text-[#2C3E50] mb-4">Latest Vital Signs</Text>
//             <View className="gap-3">
//               {healthData.vitals.map((vital, index) => (
//                 <View key={index} className="flex-row items-center justify-between p-3 bg-[#F8F9FA] rounded-xl">
//                   <View className="flex-row items-center">
//                     <View
//                       className="w-10 h-10 rounded-full items-center justify-center mr-3"
//                       style={{ backgroundColor: `${vital.color}20` }}
//                     >
//                       <Icon name={vital.icon} size={20} color={vital.color} />
//                     </View>
//                     <View>
//                       <Text className="text-sm font-semibold text-[#2C3E50]">{vital.name}</Text>
//                       <Text className="text-xs text-[#7F8C8D]">
//                         {vital.value} {vital.unit}
//                       </Text>
//                     </View>
//                   </View>
//                   <View
//                     className="px-3 py-1 rounded-xl"
//                     style={{ backgroundColor: `${getStatusColor(vital.status)}20` }}
//                   >
//                     <Text className="text-xs font-bold" style={{ color: getStatusColor(vital.status) }}>
//                       {vital.status.toUpperCase()}
//                     </Text>
//                   </View>
//                 </View>
//               ))}
//             </View>
//           </View>
//         </View>
//       )}

//       {/* Records Tab */}
//       {selectedTab === "records" && (
//         <View className="px-4">
//           <Text className="text-xl font-bold text-[#2C3E50] mb-4">Medical Records</Text>
//           <View className="gap-4">
//             {healthData.records.map((record) => (
//               <View key={record.id} className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
//                 <View className="flex-row items-center justify-between mb-3">
//                   <View className="flex-row items-center">
//                     <View
//                       className="w-10 h-10 rounded-full items-center justify-center mr-3"
//                       style={{ backgroundColor: `${getStatusColor(record.status)}20` }}
//                     >
//                       <Icon name={getTypeIcon(record.type)} size={20} color={getStatusColor(record.status)} />
//                     </View>
//                     <View>
//                       <Text className="text-base font-bold text-[#2C3E50]">{record.title}</Text>
//                       <Text className="text-sm text-[#7F8C8D]">{record.doctor}</Text>
//                     </View>
//                   </View>
//                   <View className="items-end">
//                     <Text className="text-sm text-[#7F8C8D]">{formatDate(record.date)}</Text>
//                     <View
//                       className="px-2 py-1 rounded-lg mt-1"
//                       style={{ backgroundColor: `${getStatusColor(record.status)}20` }}
//                     >
//                       <Text className="text-xs font-bold" style={{ color: getStatusColor(record.status) }}>
//                         {record.status.toUpperCase()}
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//                 <Text className="text-sm text-[#7F8C8D] leading-5">{record.notes}</Text>
//               </View>
//             ))}
//           </View>
//         </View>
//       )}

//       {/* Appointments Tab */}
//       {selectedTab === "appointments" && (
//         <View className="px-4">
//           <Text className="text-xl font-bold text-[#2C3E50] mb-4">Upcoming Appointments</Text>
//           <View className="gap-4">
//             {healthData.appointments.map((appointment) => (
//               <View key={appointment.id} className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
//                 <View className="flex-row items-center justify-between mb-3">
//                   <View className="flex-row items-center">
//                     <View className="w-10 h-10 rounded-full bg-[#6A5ACD20] items-center justify-center mr-3">
//                       <Icon name={getTypeIcon(appointment.type)} size={20} color="#6A5ACD" />
//                     </View>
//                     <View>
//                       <Text className="text-base font-bold text-[#2C3E50]">{appointment.type}</Text>
//                       <Text className="text-sm text-[#7F8C8D]">{appointment.doctor}</Text>
//                     </View>
//                   </View>
//                   <View className="items-end">
//                     <Text className="text-sm font-semibold text-[#2C3E50]">{formatDate(appointment.date)}</Text>
//                     <Text className="text-sm text-[#6A5ACD]">{appointment.time}</Text>
//                   </View>
//                 </View>
//                 <View className="flex-row justify-between items-center">
//                   <View
//                     className="px-3 py-1 rounded-xl"
//                     style={{ backgroundColor: `${getStatusColor(appointment.status)}20` }}
//                   >
//                     <Text className="text-xs font-bold" style={{ color: getStatusColor(appointment.status) }}>
//                       {appointment.status.toUpperCase()}
//                     </Text>
//                   </View>
//                   <View className="flex-row gap-2">
//                     <TouchableOpacity className="bg-[#6A5ACD] px-4 py-2 rounded-xl">
//                       <Text className="text-xs font-semibold text-white">Reschedule</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity className="bg-[#E74C3C] px-4 py-2 rounded-xl">
//                       <Text className="text-xs font-semibold text-white">Cancel</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </View>
//             ))}
//           </View>
//         </View>
//       )}

//       {/* Symptoms Tab */}
//       {selectedTab === "symptoms" && (
//         <View className="px-4 mb-8">
//           <Text className="text-xl font-bold text-[#2C3E50] mb-4">Reported Symptoms</Text>
//           <View className="gap-4">
//             {healthData.symptoms.map((symptom, index) => (
//               <View key={index} className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
//                 <View className="flex-row items-center justify-between mb-2">
//                   <Text className="text-base font-bold text-[#2C3E50]">{symptom.name}</Text>
//                   <View
//                     className="px-3 py-1 rounded-xl"
//                     style={{ backgroundColor: `${getSeverityColor(symptom.severity)}20` }}
//                   >
//                     <Text className="text-xs font-bold" style={{ color: getSeverityColor(symptom.severity) }}>
//                       {symptom.severity.toUpperCase()}
//                     </Text>
//                   </View>
//                 </View>
//                 <View className="flex-row justify-between">
//                   <Text className="text-sm text-[#7F8C8D]">Frequency: {symptom.frequency}</Text>
//                   <Text className="text-sm text-[#7F8C8D]">Last: {formatDate(symptom.lastReported)}</Text>
//                 </View>
//               </View>
//             ))}
//           </View>
//         </View>
//       )}

//       {/* Report Symptom Modal */}
//       <Modal
//         visible={showReportModal}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowReportModal(false)}
//       >
//         <View className="flex-1 bg-black/50 justify-end">
//           <View className="bg-white rounded-t-[25px] p-5 max-h-[80%]">
//             <View className="flex-row justify-between items-center mb-5">
//               <Text className="text-xl font-bold text-[#2C3E50]">Report Health Issue</Text>
//               <TouchableOpacity onPress={() => setShowReportModal(false)}>
//                 <Icon name="close" size={24} color="#2C3E50" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView showsVerticalScrollIndicator={false}>
//               <View className="mb-4">
//                 <Text className="text-sm font-semibold text-[#2C3E50] mb-2">Symptom/Issue</Text>
//                 <TextInput
//                   className="border border-[#DDE4EB] rounded-xl p-3 text-sm text-[#2C3E50]"
//                   placeholder="Describe your symptom or health issue"
//                   multiline
//                   numberOfLines={3}
//                 />
//               </View>

//               <View className="mb-4">
//                 <Text className="text-sm font-semibold text-[#2C3E50] mb-2">Severity</Text>
//                 <View className="flex-row gap-2">
//                   {["Mild", "Moderate", "Severe"].map((severity) => (
//                     <TouchableOpacity
//                       key={severity}
//                       className="flex-1 border border-[#DDE4EB] rounded-xl p-3 items-center"
//                     >
//                       <Text className="text-sm text-[#2C3E50]">{severity}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>

//               <View className="mb-6">
//                 <Text className="text-sm font-semibold text-[#2C3E50] mb-2">Additional Notes</Text>
//                 <TextInput
//                   className="border border-[#DDE4EB] rounded-xl p-3 text-sm text-[#2C3E50] min-h-[80px]"
//                   placeholder="Any additional information..."
//                   multiline
//                   numberOfLines={4}
//                   textAlignVertical="top"
//                 />
//               </View>

//               <TouchableOpacity className="bg-[#6A5ACD] rounded-xl py-4 items-center">
//                 <Text className="text-base font-bold text-white">Submit Report</Text>
//               </TouchableOpacity>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   )
// }

// export default HealthScreen


"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Dimensions,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useRouter } from "expo-router"
import { get_my_health } from "@/service/student/health"
import type { HealthData } from "@/types/health"

const { width } = Dimensions.get("window")

const HealthScreen: React.FC = () => {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState("overview")
  const [showReportModal, setShowReportModal] = useState(false)
  const [healthData, setHealthData] = useState<HealthData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [symptomForm, setSymptomForm] = useState({
    symptom: "",
    severity: "mild",
    notes: "",
  })

  const fetchHealthData = async (showLoader = true) => {
    if (showLoader) setIsLoading(true)
    try {
      const data = await get_my_health()
      setHealthData(data)
    } catch (error) {
      console.error("Failed to fetch health data:", error)
      Alert.alert("Error", "Failed to fetch health data. Please try again.")
      setHealthData(getMockHealthData())
    } finally {
      if (showLoader) setIsLoading(false)
      setRefreshing(false)
    }
  }

  const getMockHealthData = (): HealthData => ({
    current: {
      height: 165,
      weight: 58,
      bmi: 21.3,
      bloodGroup: "B+",
      lastCheckup: "2024-11-15",
      allergies: ["Peanuts", "Dust"],
      medications: ["Vitamin D", "Iron Supplement"],
      emergencyContact: "+91 98765 43210",
    },
    chart: [
      { month: "Jan", height: 160, weight: 55, bmi: 21.5 },
      { month: "Feb", height: 161, weight: 56, bmi: 21.6 },
      { month: "Mar", height: 162, weight: 57, bmi: 21.7 },
      { month: "Apr", height: 163, weight: 57.5, bmi: 21.6 },
      { month: "May", height: 164, weight: 58, bmi: 21.5 },
      { month: "Jun", height: 165, weight: 58, bmi: 21.3 },
    ],
    vitals: [
      { name: "Blood Pressure", value: "120/80", unit: "mmHg", status: "normal", icon: "favorite", color: "#2ECC71" },
      { name: "Heart Rate", value: "72", unit: "bpm", status: "normal", icon: "monitor-heart", color: "#E74C3C" },
      { name: "Temperature", value: "98.6", unit: "°F", status: "normal", icon: "thermostat", color: "#F39C12" },
      { name: "BMI", value: "21.3", unit: "", status: "normal", icon: "fitness-center", color: "#6A5ACD" },
    ],
    records: [
      {
        id: 1,
        date: "2024-12-10",
        type: "checkup",
        title: "Regular Health Checkup",
        doctor: "Dr. Sarah Wilson",
        notes: "All vitals normal. Continue current medication.",
        status: "completed",
      },
      {
        id: 2,
        date: "2024-11-28",
        type: "vaccination",
        title: "Flu Vaccination",
        doctor: "Nurse Mary Johnson",
        notes: "Annual flu shot administered. No adverse reactions.",
        status: "completed",
      },
    ],
    appointments: [
      {
        id: 1,
        date: "2024-12-20",
        time: "10:30 AM",
        doctor: "Dr. Sarah Wilson",
        type: "Follow-up",
        status: "scheduled",
      },
      {
        id: 2,
        date: "2024-12-25",
        time: "02:00 PM",
        doctor: "Dr. James Smith",
        type: "Dental Checkup",
        status: "scheduled",
      },
    ],
    symptoms: [
      { name: "Headache", severity: "mild", frequency: "occasional", lastReported: "2024-12-08" },
      { name: "Fatigue", severity: "mild", frequency: "rare", lastReported: "2024-12-05" },
    ],
  })

  useEffect(() => {
    fetchHealthData()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    fetchHealthData(false)
  }

  const handleSubmitSymptom = () => {
    if (!symptomForm.symptom.trim()) {
      Alert.alert("Error", "Please describe your symptom")
      return
    }

    // Here you would typically send the data to your API
    Alert.alert("Success", "Symptom report submitted successfully")
    setShowReportModal(false)
    setSymptomForm({ symptom: "", severity: "mild", notes: "" })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
      case "completed":
      case "recovered":
        return "#2ECC71"
      case "high":
      case "pending":
        return "#F39C12"
      case "critical":
      case "cancelled":
        return "#E74C3C"
      default:
        return "#BDC3C7"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "checkup":
        return "health-and-safety"
      case "vaccination":
        return "vaccines"
      case "illness":
        return "sick"
      case "Follow-up":
        return "event-repeat"
      case "Dental Checkup":
        return "medical-services"
      default:
        return "medical-services"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild":
        return "#2ECC71"
      case "moderate":
        return "#F39C12"
      case "severe":
        return "#E74C3C"
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

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { status: "Underweight", color: "#F39C12" }
    if (bmi < 24.9) return { status: "Normal", color: "#2ECC71" }
    if (bmi < 29.9) return { status: "Overweight", color: "#F39C12" }
    return { status: "Obese", color: "#E74C3C" }
  }

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F0F4F8]">
        <ActivityIndicator size="large" color="#6A5ACD" />
        <Text className="text-[#7F8C8D] mt-4">Loading health data...</Text>
      </View>
    )
  }

  if (!healthData) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F0F4F8]">
        <Icon name="error-outline" size={48} color="#E74C3C" />
        <Text className="text-xl font-bold text-[#2C3E50] mt-4">No Health Data</Text>
        <Text className="text-[#7F8C8D] mt-2 text-center px-8">
          Unable to load health information. Please try again later.
        </Text>
        <TouchableOpacity onPress={() => fetchHealthData()} className="bg-[#6A5ACD] px-6 py-3 rounded-xl mt-4">
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const bmiStatus = getBMIStatus(healthData.current.bmi)

  return (
    <ScrollView
      className="flex-1 bg-[#F0F4F8]"
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between bg-[#6A5ACD] pt-12 pb-5 px-4 rounded-b-[25px]">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-xl font-bold text-white">Health Records</Text>
        </View>
        <TouchableOpacity className="p-2" onPress={() => setShowReportModal(true)}>
          <Icon name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Health Overview Cards */}
      <View className="px-4 -mt-8 mb-5">
        <View className="flex-row justify-between mb-4">
          <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
            <View className="w-12 h-12 bg-[#2ECC7120] rounded-full items-center justify-center mb-2">
              <Icon name="health-and-safety" size={24} color="#2ECC71" />
            </View>
            <Text className="text-lg font-bold text-[#2C3E50]">{bmiStatus.status}</Text>
            <Text className="text-xs text-[#7F8C8D] text-center">Overall Health</Text>
          </View>
          <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
            <View className="w-12 h-12 bg-[#6A5ACD20] rounded-full items-center justify-center mb-2">
              <Icon name="fitness-center" size={24} color="#6A5ACD" />
            </View>
            <Text className="text-lg font-bold text-[#2C3E50]">{healthData.current.bmi}</Text>
            <Text className="text-xs text-[#7F8C8D] text-center">BMI Score</Text>
          </View>
          <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
            <View className="w-12 h-12 bg-[#F39C1220] rounded-full items-center justify-center mb-2">
              <Icon name="event" size={24} color="#F39C12" />
            </View>
            <Text className="text-lg font-bold text-[#2C3E50]">{healthData.appointments.length}</Text>
            <Text className="text-xs text-[#7F8C8D] text-center">Upcoming</Text>
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View className="px-4 mb-5">
        <View className="flex-row bg-white rounded-2xl p-1 shadow-lg elevation-5">
          {["overview", "records", "appointments", "symptoms"].map((tab) => (
            <TouchableOpacity
              key={tab}
              className={`flex-1 py-3 items-center rounded-xl ${
                selectedTab === tab ? "bg-[#6A5ACD]" : "bg-transparent"
              }`}
              onPress={() => setSelectedTab(tab)}
            >
              <Text className={`text-sm font-semibold ${selectedTab === tab ? "text-white" : "text-[#7F8C8D]"}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Overview Tab */}
      {selectedTab === "overview" && (
        <View className="px-4">
          {/* Health Profile */}
          <View className="bg-white rounded-2xl p-4 mb-5 shadow-lg elevation-5">
            <Text className="text-lg font-bold text-[#2C3E50] mb-4">Health Profile</Text>
            <View className="flex-row flex-wrap">
              <View className="w-1/2 mb-4">
                <Text className="text-sm text-[#7F8C8D] mb-1">Height</Text>
                <Text className="text-base font-semibold text-[#2C3E50]">{healthData.current.height} cm</Text>
              </View>
              <View className="w-1/2 mb-4">
                <Text className="text-sm text-[#7F8C8D] mb-1">Weight</Text>
                <Text className="text-base font-semibold text-[#2C3E50]">{healthData.current.weight} kg</Text>
              </View>
              <View className="w-1/2 mb-4">
                <Text className="text-sm text-[#7F8C8D] mb-1">Blood Group</Text>
                <Text className="text-base font-semibold text-[#E74C3C]">{healthData.current.bloodGroup}</Text>
              </View>
              <View className="w-1/2 mb-4">
                <Text className="text-sm text-[#7F8C8D] mb-1">Last Checkup</Text>
                <Text className="text-base font-semibold text-[#2C3E50]">
                  {formatDate(healthData.current.lastCheckup)}
                </Text>
              </View>
            </View>
            <View className="border-t border-[#EAECEE] pt-4 mt-2">
              <View className="mb-3">
                <Text className="text-sm font-semibold text-[#2C3E50] mb-2">Allergies</Text>
                <View className="flex-row flex-wrap">
                  {healthData.current.allergies.map((allergy, index) => (
                    <View key={index} className="bg-[#E74C3C20] px-3 py-1 rounded-xl mr-2 mb-2">
                      <Text className="text-sm text-[#E74C3C]">{allergy}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View>
                <Text className="text-sm font-semibold text-[#2C3E50] mb-2">Current Medications</Text>
                <View className="flex-row flex-wrap">
                  {healthData.current.medications.map((medication, index) => (
                    <View key={index} className="bg-[#2ECC7120] px-3 py-1 rounded-xl mr-2 mb-2">
                      <Text className="text-sm text-[#2ECC71]">{medication}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Vital Signs */}
          <View className="bg-white rounded-2xl p-4 mb-5 shadow-lg elevation-5">
            <Text className="text-lg font-bold text-[#2C3E50] mb-4">Latest Vital Signs</Text>
            <View className="gap-3">
              {healthData.vitals.map((vital, index) => (
                <View key={index} className="flex-row items-center justify-between p-3 bg-[#F8F9FA] rounded-xl">
                  <View className="flex-row items-center">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: `${vital.color}20` }}
                    >
                      <Icon name={vital.icon} size={20} color={vital.color} />
                    </View>
                    <View>
                      <Text className="text-sm font-semibold text-[#2C3E50]">{vital.name}</Text>
                      <Text className="text-xs text-[#7F8C8D]">
                        {vital.value} {vital.unit}
                      </Text>
                    </View>
                  </View>
                  <View
                    className="px-3 py-1 rounded-xl"
                    style={{ backgroundColor: `${getStatusColor(vital.status)}20` }}
                  >
                    <Text className="text-xs font-bold" style={{ color: getStatusColor(vital.status) }}>
                      {vital.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Records Tab */}
      {selectedTab === "records" && (
        <View className="px-4">
          <Text className="text-xl font-bold text-[#2C3E50] mb-4">Medical Records</Text>
          <View className="gap-4">
            {healthData.records.map((record) => (
              <View key={record.id} className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: `${getStatusColor(record.status)}20` }}
                    >
                      <Icon name={getTypeIcon(record.type)} size={20} color={getStatusColor(record.status)} />
                    </View>
                    <View>
                      <Text className="text-base font-bold text-[#2C3E50]">{record.title}</Text>
                      <Text className="text-sm text-[#7F8C8D]">{record.doctor}</Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-sm text-[#7F8C8D]">{formatDate(record.date)}</Text>
                    <View
                      className="px-2 py-1 rounded-lg mt-1"
                      style={{ backgroundColor: `${getStatusColor(record.status)}20` }}
                    >
                      <Text className="text-xs font-bold" style={{ color: getStatusColor(record.status) }}>
                        {record.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text className="text-sm text-[#7F8C8D] leading-5">{record.notes}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Appointments Tab */}
      {selectedTab === "appointments" && (
        <View className="px-4">
          <Text className="text-xl font-bold text-[#2C3E50] mb-4">Upcoming Appointments</Text>
          <View className="gap-4">
            {healthData.appointments.map((appointment) => (
              <View key={appointment.id} className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-[#6A5ACD20] items-center justify-center mr-3">
                      <Icon name={getTypeIcon(appointment.type)} size={24} color="#6A5ACD" />
                    </View>
                    <View>
                      <Text className="text-base font-bold text-[#2C3E50]">{appointment.type}</Text>
                      <Text className="text-sm text-[#7F8C8D]">{appointment.doctor}</Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-sm font-semibold text-[#2C3E50]">{formatDate(appointment.date)}</Text>
                    <Text className="text-sm text-[#6A5ACD]">{appointment.time}</Text>
                  </View>
                </View>
                <View className="flex-row justify-between items-center">
                  <View
                    className="px-3 py-1 rounded-xl"
                    style={{ backgroundColor: `${getStatusColor(appointment.status)}20` }}
                  >
                    <Text className="text-xs font-bold" style={{ color: getStatusColor(appointment.status) }}>
                      {appointment.status.toUpperCase()}
                    </Text>
                  </View>
                  <View className="flex-row gap-2">
                    <TouchableOpacity className="bg-[#6A5ACD] px-4 py-2 rounded-xl">
                      <Text className="text-xs font-semibold text-white">Reschedule</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-[#E74C3C] px-4 py-2 rounded-xl">
                      <Text className="text-xs font-semibold text-white">Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Symptoms Tab */}
      {selectedTab === "symptoms" && (
        <View className="px-4 mb-8">
          <Text className="text-xl font-bold text-[#2C3E50] mb-4">Reported Symptoms</Text>
          <View className="gap-4">
            {healthData.symptoms.map((symptom, index) => (
              <View key={index} className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-base font-bold text-[#2C3E50]">{symptom.name}</Text>
                  <View
                    className="px-3 py-1 rounded-xl"
                    style={{ backgroundColor: `${getSeverityColor(symptom.severity)}20` }}
                  >
                    <Text className="text-xs font-bold" style={{ color: getSeverityColor(symptom.severity) }}>
                      {symptom.severity.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-[#7F8C8D]">Frequency: {symptom.frequency}</Text>
                  <Text className="text-sm text-[#7F8C8D]">Last: {formatDate(symptom.lastReported)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Report Symptom Modal */}
      <Modal
        visible={showReportModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReportModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[25px] p-5 max-h-[80%]">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-xl font-bold text-[#2C3E50]">Report Health Issue</Text>
              <TouchableOpacity onPress={() => setShowReportModal(false)}>
                <Icon name="close" size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-4">
                <Text className="text-sm font-semibold text-[#2C3E50] mb-2">Symptom/Issue</Text>
                <TextInput
                  className="border border-[#DDE4EB] rounded-xl p-3 text-sm text-[#2C3E50]"
                  placeholder="Describe your symptom or health issue"
                  multiline
                  numberOfLines={3}
                  value={symptomForm.symptom}
                  onChangeText={(text) => setSymptomForm({ ...symptomForm, symptom: text })}
                />
              </View>
              <View className="mb-4">
                <Text className="text-sm font-semibold text-[#2C3E50] mb-2">Severity</Text>
                <View className="flex-row gap-2">
                  {["mild", "moderate", "severe"].map((severity) => (
                    <TouchableOpacity
                      key={severity}
                      className={`flex-1 border rounded-xl p-3 items-center ${
                        symptomForm.severity === severity ? "border-[#6A5ACD] bg-[#6A5ACD20]" : "border-[#DDE4EB]"
                      }`}
                      onPress={() => setSymptomForm({ ...symptomForm, severity })}
                    >
                      <Text
                        className={`text-sm ${symptomForm.severity === severity ? "text-[#6A5ACD] font-semibold" : "text-[#2C3E50]"}`}
                      >
                        {severity.charAt(0).toUpperCase() + severity.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View className="mb-6">
                <Text className="text-sm font-semibold text-[#2C3E50] mb-2">Additional Notes</Text>
                <TextInput
                  className="border border-[#DDE4EB] rounded-xl p-3 text-sm text-[#2C3E50] min-h-[80px]"
                  placeholder="Any additional information..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={symptomForm.notes}
                  onChangeText={(text) => setSymptomForm({ ...symptomForm, notes: text })}
                />
              </View>
              <TouchableOpacity className="bg-[#6A5ACD] rounded-xl py-4 items-center" onPress={handleSubmitSymptom}>
                <Text className="text-base font-bold text-white">Submit Report</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

export default HealthScreen
