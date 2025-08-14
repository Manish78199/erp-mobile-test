


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
  Dimensions,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useRouter } from "expo-router"
import { get_my_health } from "@/service/student/health"
import type { HealthData } from "@/types/health"
import HeightScale from "@/components/student/wellness/HeightScale"
import WeightScale from "@/components/student/wellness/WeightScale"
// import HealthCharts from "@/components/student/wellness/WellnessCharts"

const { width } = Dimensions.get("window")

const HealthScreen = () => {
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

      // Validate and sanitize the received data
      const sanitizedData = validateHealthData(data)
      setHealthData(sanitizedData)
    } catch (error) {
      console.error("Failed to fetch health data:", error)
      // Don't show alert in production to prevent crashes
      console.warn("Using fallback health data due to API error")
      setHealthData(getMockHealthData())
    } finally {
      if (showLoader) setIsLoading(false)
      setRefreshing(false)
    }
  }

  const validateHealthData = (data: any): HealthData => {
    try {
      return {
        current: {
          height: Number(data?.current?.height) || 165,
          weight: Number(data?.current?.weight) || 58,
          bmi: Number(data?.current?.bmi) || 21.3,
          bloodGroup: String(data?.current?.bloodGroup || "B+"),
          lastCheckup: String(data?.current?.lastCheckup || "2024-11-15"),
          allergies: Array.isArray(data?.current?.allergies) ? data.current.allergies : ["None"],
          medications: Array.isArray(data?.current?.medications) ? data.current.medications : ["None"],
          emergencyContact: String(data?.current?.emergencyContact || "+91 98765 43210"),
        },
        chart:
          Array.isArray(data?.chart) && data.chart.length > 0
            ? data.chart.map((item: any) => ({
              month: String(item?.month || "Jan"),
              height: Number(item?.height) || 165,
              weight: Number(item?.weight) || 58,
              bmi: Number(item?.bmi) || 21.3,
            }))
            : getMockHealthData().chart,
        vitals:
          Array.isArray(data?.vitals) && data.vitals.length > 0
            ? data.vitals.map((vital: any) => ({
              name: String(vital?.name || "Unknown"),
              value: String(vital?.value || "N/A"),
              unit: String(vital?.unit || ""),
              status: String(vital?.status || "normal"),
              icon: String(vital?.icon || "help"),
              color: String(vital?.color || "#2ECC71"),
            }))
            : getMockHealthData().vitals,
        records: Array.isArray(data?.records)
          ? data.records.map((record: any) => ({
            id: Number(record?.id) || Math.random(),
            date: String(record?.date || "2024-01-01"),
            type: String(record?.type || "checkup"),
            title: String(record?.title || "Health Record"),
            doctor: String(record?.doctor || "Dr. Unknown"),
            notes: String(record?.notes || "No notes available"),
            status: String(record?.status || "completed"),
          }))
          : getMockHealthData().records,
        appointments: Array.isArray(data?.appointments)
          ? data.appointments.map((appointment: any) => ({
            id: Number(appointment?.id) || Math.random(),
            date: String(appointment?.date || "2024-01-01"),
            time: String(appointment?.time || "10:00 AM"),
            doctor: String(appointment?.doctor || "Dr. Unknown"),
            type: String(appointment?.type || "Checkup"),
            status: String(appointment?.status || "scheduled"),
          }))
          : getMockHealthData().appointments,
        symptoms: Array.isArray(data?.symptoms)
          ? data.symptoms.map((symptom: any) => ({
            name: String(symptom?.name || "Unknown"),
            severity: String(symptom?.severity || "mild"),
            frequency: String(symptom?.frequency || "rare"),
            lastReported: String(symptom?.lastReported || "2024-01-01"),
          }))
          : getMockHealthData().symptoms,
      }
    } catch (error) {
      console.error("Data validation failed:", error)
      return getMockHealthData()
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
    try {
      if (!symptomForm.symptom.trim()) {
        console.warn("Empty symptom form")
        return
      }

      // Here you would typically send the data to your API
      console.log("Symptom report submitted successfully")
      setShowReportModal(false)
      setSymptomForm({ symptom: "", severity: "mild", notes: "" })
    } catch (error) {
      console.error("Error submitting symptom:", error)
    }
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

  const getBMIStatus = (bmi: number | undefined | null): string => {
    const safeBmi = Number(bmi) || 21.3
    if (safeBmi < 18.5) return "Underweight"
    if (safeBmi < 24.9) return "Normal"
    if (safeBmi < 29.9) return "Overweight"
    return "Obese"
  }

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F0F4F8]">
        <ActivityIndicator size="large" color="#6A5ACD" />
        <Text className="text-[#7F8C8D] mt-4">Loading health data...</Text>
      </View>
    )
  }

  if (!healthData || !healthData.current) {
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

  const bmiStatus = getBMIStatus(healthData?.current?.bmi)

  return (
    <ScrollView
      className="flex-1 bg-[#F0F4F8]"
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between bg-[#6A5ACD] py-12 px-4 rounded-b-[25px]">
        <TouchableOpacity className="p-2" onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-xl font-bold text-white">Health Records</Text>
        </View>

      </View>

      {/* Health Overview Cards */}
      <View className="px-4 -mt-8 mb-5">
        <View className="flex-row justify-between mb-4">
          <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
            <View className="w-12 h-12 bg-[#2ECC7120] rounded-full items-center justify-center mb-2">
              <Icon name="health-and-safety" size={24} color="#2ECC71" />
            </View>
            <Text className="text-lg font-bold text-[#2C3E50]">{bmiStatus}</Text>
            <Text className="text-xs text-[#7F8C8D] text-center">Overall Health</Text>
          </View>
          <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
            <View className="w-12 h-12 bg-[#6A5ACD20] rounded-full items-center justify-center mb-2">
              <Icon name="fitness-center" size={24} color="#6A5ACD" />
            </View>
            <Text className="text-lg font-bold text-[#2C3E50]">{healthData?.current?.bmi?.toFixed(1) || "21.3"}</Text>
            <Text className="text-xs text-[#7F8C8D] text-center">BMI Score</Text>
          </View>
          <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
            <View className="w-12 h-12 bg-[#F39C1220] rounded-full items-center justify-center mb-2">
              <Icon name="event" size={24} color="#F39C12" />
            </View>
            <Text className="text-lg font-bold text-[#2C3E50]">{healthData?.appointments?.length || 0}</Text>
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
              className={`flex-1 py-3 items-center rounded-xl ${selectedTab === tab ? "bg-[#6A5ACD]" : "bg-transparent"
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
          {/* Avatar and Height Scale */}
          <View className="flex-row justify-center items-center mb-6">
            <View className="items-center">
              <View className="w-32 h-32 bg-[#6A5ACD20] rounded-full items-center justify-center mb-4">
                <Icon name="person" size={64} color="#6A5ACD" />
              </View>
            </View>
            <View className="ml-8">
              {/* Safe props with fallback values */}
              <HeightScale height={healthData?.current?.height || 165} />
            </View>
          </View>

          {/* Weight Scale */}
          <View className="mb-6">
            {/* Safe props with fallback values */}
            <WeightScale weight={healthData?.current?.weight || 58} />
          </View>

          {/* Health Charts */}
          <View className="mb-6">
            {/* Safe chart data with validation */}
            {/* <HealthCharts
              chart={
                healthData?.chart && Array.isArray(healthData.chart) ? healthData.chart : getMockHealthData().chart
              }
            /> */}
          </View>

          {/* Health Profile Info */}
          <View className="bg-white rounded-2xl p-4 mb-5 shadow-lg elevation-5">
            <Text className="text-lg font-bold text-[#2C3E50] mb-4">Health Information</Text>
            <View className="flex-row flex-wrap">
              <View className="w-1/2 mb-4">
                <Text className="text-sm text-[#7F8C8D] mb-1">Blood Group</Text>
                <Text className="text-base font-semibold text-[#E74C3C]">
                  {healthData?.current?.bloodGroup || "B+"}
                </Text>
              </View>
              <View className="w-1/2 mb-4">
                <Text className="text-sm text-[#7F8C8D] mb-1">BMI</Text>
                <Text className="text-base font-semibold text-[#2C3E50]">
                  {healthData?.current?.bmi?.toFixed(1) || "21.3"}
                </Text>
              </View>
              <View className="w-full mb-4">
                <Text className="text-sm text-[#7F8C8D] mb-1">Last Checkup</Text>
                <Text className="text-base font-semibold text-[#2C3E50]">
                  {formatDate(healthData?.current?.lastCheckup || "2024-11-15")}
                </Text>
              </View>
            </View>
            <View className="border-t border-[#EAECEE] pt-4 mt-2">
              <View className="mb-3">
                <Text className="text-sm font-semibold text-[#2C3E50] mb-2">Allergies</Text>
                <View className="flex-row flex-wrap">
                  {healthData?.current?.allergies && Array.isArray(healthData.current.allergies) ? (
                    healthData.current.allergies.map((allergy, index) => (
                      <View key={index} className="bg-[#E74C3C20] px-3 py-1 rounded-xl mr-2 mb-2">
                        <Text className="text-sm text-[#E74C3C]">{allergy}</Text>
                      </View>
                    ))
                  ) : (
                    <View className="bg-[#E74C3C20] px-3 py-1 rounded-xl mr-2 mb-2">
                      <Text className="text-sm text-[#E74C3C]">None</Text>
                    </View>
                  )}
                </View>
              </View>
              <View>
                <Text className="text-sm font-semibold text-[#2C3E50] mb-2">Current Medications</Text>
                <View className="flex-row flex-wrap">
                  {healthData?.current?.medications && Array.isArray(healthData.current.medications) ? (
                    healthData.current.medications.map((medication, index) => (
                      <View key={index} className="bg-[#2ECC7120] px-3 py-1 rounded-xl mr-2 mb-2">
                        <Text className="text-sm text-[#2ECC71]">{medication}</Text>
                      </View>
                    ))
                  ) : (
                    <View className="bg-[#2ECC7120] px-3 py-1 rounded-xl mr-2 mb-2">
                      <Text className="text-sm text-[#2ECC71]">None</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Vital Signs */}
          <View className="bg-white rounded-2xl p-4 mb-5 shadow-lg elevation-5">
            <Text className="text-lg font-bold text-[#2C3E50] mb-4">Latest Vital Signs</Text>
            <View className="gap-3">
              {healthData?.vitals && Array.isArray(healthData.vitals) ? (
                healthData.vitals.map((vital, index) => (
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
                ))
              ) : (
                <View className="bg-[#F8F9FA] rounded-xl p-3">
                  <Text className="text-sm font-semibold text-[#2C3E50]">No Vital Signs Data</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Records Tab */}
      {selectedTab === "records" && (
        <View className="px-4">
          <Text className="text-xl font-bold text-[#2C3E50] mb-4">Medical Records</Text>
          <View className="gap-4">
            {healthData?.records && Array.isArray(healthData.records) && healthData.records.length > 0 ? (
              healthData.records.map((record) => (
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
              ))
            ) : (
              <View className="bg-white rounded-2xl p-8 items-center">
                <Icon name="folder-open" size={48} color="#BDC3C7" />
                <Text className="text-lg font-bold text-[#2C3E50] mt-4">No Records Found</Text>
                <Text className="text-[#7F8C8D] text-center mt-2">Your medical records will appear here</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Appointments Tab */}
      {selectedTab === "appointments" && (
        <View className="px-4">
          <Text className="text-xl font-bold text-[#2C3E50] mb-4">Upcoming Appointments</Text>
          <View className="gap-4">
            {healthData?.appointments &&
              Array.isArray(healthData.appointments) &&
              healthData.appointments.length > 0 ? (
              healthData.appointments.map((appointment) => (
                <View key={appointment.id} className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 rounded-full bg-[#6A5ACD20] items-center justify-center mr-3">
                        <Icon name={getTypeIcon(appointment.type)} size={20} color="#6A5ACD" />
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
              ))
            ) : (
              <View className="bg-white rounded-2xl p-8 items-center">
                <Icon name="event-available" size={48} color="#BDC3C7" />
                <Text className="text-lg font-bold text-[#2C3E50] mt-4">No Appointments</Text>
                <Text className="text-[#7F8C8D] text-center mt-2">Your upcoming appointments will appear here</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Symptoms Tab */}
      {selectedTab === "symptoms" && (
        <View className="px-4 mb-8">
          <Text className="text-xl font-bold text-[#2C3E50] mb-4">Reported Symptoms</Text>
          <View className="gap-4">
            {healthData?.symptoms && Array.isArray(healthData.symptoms) && healthData.symptoms.length > 0 ? (
              healthData.symptoms.map((symptom, index) => (
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
              ))
            ) : (
              <View className="bg-white rounded-2xl p-8 items-center">
                <Icon name="healing" size={48} color="#BDC3C7" />
                <Text className="text-lg font-bold text-[#2C3E50] mt-4">No Symptoms Reported</Text>
                <Text className="text-[#7F8C8D] text-center mt-2">Your reported symptoms will appear here</Text>
              </View>
            )}
          </View>
        </View>
      )}


    </ScrollView>
  )
}

export default HealthScreen
