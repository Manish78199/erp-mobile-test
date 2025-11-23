"use client"

import { useContext, useEffect, useMemo, useState } from "react"
import { View, ScrollView, TouchableOpacity, ActivityIndicator, FlatList, Modal } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import RNPickerSelect from "react-native-picker-select"
import { getAllClass } from "@/service/management/class/classBasic"
import { getFeeHistory } from "@/service/management/fee"
import { getClassStudents } from "@/service/management/student"
import { AlertContext } from "@/context/Alert/context"
import { Typography } from "@/components/Typography"
import { useClasses } from "@/hooks/management/classes"
import { Link, useRouter } from "expo-router"

interface FeeHistoryItem {
  _id: string
  student_id: string
  first_name: string
  middle_name: string
  last_name: string
  father_name: string
  class_name: string
  deposit_at: string
  paid_amount: number
  payment_mode: string
  reference_no: string
  remarks: string
}

interface ClassItem {
  _id: string
  name: string
}

interface StudentItem {
  _id: string
  admission_no: string
  first_name: string
}

export default function FeeHistoryPage() {
  const { showAlert } = useContext(AlertContext)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [allHistory, setHistory] = useState<FeeHistoryItem[]>([])

  const [allStudent, setStudent] = useState<StudentItem[]>([])
  const [selectedClass, setSelectClass] = useState<string>("")
  const [selectedStudent, setSelectStudent] = useState<string>("")

  const router = useRouter()

  const { classes: allClass } = useClasses()
  const [filter, setFilter] = useState({
    studentId: "",
    classId: "",
  })

  const classList = useMemo(() => {
    return allClass.map((item) => ({
      label: item?.name,
      value: item?._id,
    }))
  }, [allClass])

  const studentList = useMemo(() => {
    return allStudent.map((item) => ({
      label: `${item?.admission_no} - ${item?.first_name}`,
      value: item?._id,
    }))
  }, [allStudent])

  const totalAmount = useMemo(() => {
    return allHistory.reduce((sum, record) => sum + record.paid_amount, 0)
  }, [allHistory])

  const clearFilter = async () => {
    setLoading(true)
    setSelectClass("")
    setSelectStudent("")
    setFilter({ classId: "", studentId: "" })
    const feeHistory = await getFeeHistory(null, null)
    setHistory(feeHistory)
    setLoading(false)
  }

  const applyFilter = async () => {
    setLoading(true)
    setSelectClass(filter.classId)
    setSelectStudent(filter.studentId)
    setIsFilterOpen(false)
    const feeHistory = await getFeeHistory(filter.classId, filter.studentId)
    setHistory(feeHistory)
    setLoading(false)
  }

  const fetchClassStudent = async (classId: string) => {
    if (classId) {
      const student = await getClassStudents(classId)
      setStudent(student)
    } else {
      setStudent([])
    }
  }

  useEffect(() => {
    const getFeehistoryRequest = async () => {
      setLoading(true)
      const feeHistory = await getFeeHistory(selectedClass, selectedStudent)
      setHistory(feeHistory)
      setLoading(false)
    }
    getFeehistoryRequest()
  }, [])



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const getPaymentModeColor = (mode: string) => {
    switch (mode.toLowerCase()) {
      case "cash":
        return "bg-emerald-100"
      case "card":
        return "bg-blue-100"
      case "online":
        return "bg-purple-100"
      default:
        return "bg-gray-100"
    }
  }

  const getPaymentModeIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case "cash":
        return "cash"
      case "card":
        return "credit-card"
      case "online":
        return "wifi"
      default:
        return "cash"
    }
  }

  const PaymentCard = ({ record }: { record: FeeHistoryItem }) => (
    <View className="mb-3 rounded-lg border border-border bg-white p-4">
      <View className="mb-3 flex-row items-start justify-between">
        <View className="flex-1">
          <Typography className="text-sm font-semibold text-foreground">
            {record.first_name} {record.middle_name} {record.last_name}
          </Typography>
          <Typography className="mt-1 text-xs text-muted-foreground">Father: {record.father_name}</Typography>
        </View>
        <Link href={`/management/fee/view/${record?._id}`} className="rounded-lg bg-blue-100 p-2">
          <MaterialCommunityIcons name="eye" size={16} color="#3b82f6" />
        </Link>
      </View>

      <View className="mb-3 flex-row items-center justify-between">
        <View className="rounded-full bg-blue-100 px-3 py-1">
          <Typography className="text-xs font-medium text-blue-800">{record.class_name}</Typography>
        </View>
        <Typography className="text-lg font-bold text-emerald-600">{formatCurrency(record.paid_amount)}</Typography>
      </View>

      <View className="flex-row items-center justify-between">
        <View
          className={`flex-row items-center gap-1 rounded-full ${getPaymentModeColor(record.payment_mode)} px-3 py-1`}
        >
          <MaterialCommunityIcons name={getPaymentModeIcon(record.payment_mode)} size={12} color="#666" />
          <Typography className="text-xs font-medium text-gray-700">{record.payment_mode}</Typography>
        </View>
        <Typography className="text-xs text-muted-foreground">{formatDate(record.deposit_at)}</Typography>
      </View>

      {record.reference_no && (
        <View className="mt-2 rounded-sm bg-background px-2 py-1">
          <Typography className="text-xs text-muted-foreground">Ref: {record.reference_no}</Typography>
        </View>
      )}
    </View>
  )

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 " showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center p-4">
          <TouchableOpacity
            onPress={() => router.push("/management")}
            className="flex-row items-center bg-white border border-border rounded-lg px-3 py-2 mr-2"
          >
            <Typography className="text-primary font-semibold">← Back</Typography>
          </TouchableOpacity>

          <Typography className="text-xl font-bold text-foreground"> Fee History</Typography>
        </View>
        <View className=" p-4">
          <Typography className="text-2xl font-bold text-foreground">Fee Deposit History</Typography>
          <Typography className="mt-1 text-sm text-muted-foreground">Manage fee payment records</Typography>
        </View>

        {/* Stats Cards */}
        <View className="gap-3 p-4">
          <View className="flex-row gap-3">
            <View className="flex-1 rounded-lg border border-border bg-white p-3">
              <View className="flex-row items-center gap-2">
                <View className="rounded-lg bg-blue-100 p-2">
                  <MaterialCommunityIcons name="file-document" size={16} color="#3b82f6" />
                </View>
                <View className="flex-1">
                  <Typography className="text-xs text-muted-foreground">Total Records</Typography>
                  <Typography className="text-lg font-semibold text-foreground">{allHistory.length}</Typography>
                </View>
              </View>
            </View>

            <View className="flex-1 rounded-lg border border-border bg-white p-3">
              <View className="flex-row items-center gap-2">
                <View className="rounded-lg bg-emerald-100 p-2">
                  <MaterialCommunityIcons name="cash" size={16} color="#10b981" />
                </View>
                <View className="flex-1">
                  <Typography className="text-xs text-muted-foreground">Total Amount</Typography>
                  <Typography className="text-lg font-semibold text-emerald-600">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </Typography>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Filter Section */}
        <View className=" p-4">
          <View className="flex-row items-center justify-between">
            {(selectedClass || selectedStudent) && (
              <View className="flex-row items-center gap-2 rounded-full bg-blue-100 px-3 py-2">
                <Typography className="text-xs font-medium text-blue-800">Active Filters</Typography>
                <TouchableOpacity onPress={clearFilter}>
                  <MaterialCommunityIcons name="close" size={14} color="#0369a1" />
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity
              onPress={() => setIsFilterOpen(true)}
              className="flex-row items-center gap-2 rounded-lg border border-border bg-indigo-500 px-3 py-2"
            >
              <MaterialCommunityIcons name="filter" size={16} color="#ffffff" />
              <Typography className="text-sm font-medium text-white">Filter</Typography>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter Modal */}
        <Modal visible={isFilterOpen} transparent animationType="slide">
          <View className="flex-1 bg-black/50">
            <View className="absolute bottom-0 w-full rounded-t-2xl bg-white p-4">
              <View className="mb-4 flex-row items-center justify-between">
                <Typography className="text-lg font-semibold text-foreground">Filter Fee History</Typography>
                <TouchableOpacity onPress={() => setIsFilterOpen(false)}>
                  <MaterialCommunityIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View className="mb-4">
                <Typography className="mb-2 text-sm font-medium text-foreground">Class</Typography>
                <RNPickerSelect
                  items={classList}
                  onValueChange={(value) => {
                    setFilter((prev) => ({ ...prev, classId: value }))
                    fetchClassStudent(value)
                    if (!value) {
                      setFilter((prev) => ({ ...prev, studentId: "" }))
                    }
                  }}
                  value={filter.classId}
                  placeholder={{ label: "-- Select Class --", value: null }}
                  style={{
                    inputIOS: {
                      paddingVertical: 12,
                      paddingHorizontal: 10,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#e5e7eb",
                      backgroundColor: "#f9fafb",
                      color: "#000",
                    },
                    inputAndroid: {
                      paddingVertical: 0,
                      paddingHorizontal: 10,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#e5e7eb",
                      backgroundColor: "#f9fafb",
                      color: "#000",
                    },
                  }}
                />
              </View>

              <View className="mb-4">
                <Typography className="mb-2 text-sm font-medium text-foreground">Student</Typography>
                <RNPickerSelect
                  items={studentList}
                  onValueChange={(value) => {
                    setFilter((prev) => ({ ...prev, studentId: value }))
                  }}
                  value={filter.studentId}
                  placeholder={{ label: "-- Select Student --", value: null }}
                  disabled={!filter.classId}
                  style={{
                    inputIOS: {
                      paddingVertical: 12,
                      paddingHorizontal: 10,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#e5e7eb",
                      backgroundColor: "#f9fafb",
                      color: "#000",
                    },
                    inputAndroid: {
                      paddingVertical: 0,
                      paddingHorizontal: 10,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#e5e7eb",
                      backgroundColor: "#f9fafb",
                      color: "#000",
                    },
                  }}
                />
              </View>

              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => setIsFilterOpen(false)}
                  className="flex-1 rounded-lg border border-border bg-background py-3"
                >
                  <Typography className="text-center font-semibold text-foreground">Cancel</Typography>
                </TouchableOpacity>
                <TouchableOpacity onPress={applyFilter} className="flex-1 rounded-lg bg-blue-600 py-3">
                  <Typography className="text-center font-semibold text-white">Apply</Typography>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Payment History List */}
        <View className="p-4">
          {loading ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color="#10b981" />
              <Typography className="mt-2 text-muted-foreground">Loading...</Typography>
            </View>
          ) : allHistory.length === 0 ? (
            <View className="items-center py-8">
              <MaterialCommunityIcons name="file-document" size={48} color="#d1d5db" />
              <Typography className="mt-2 text-muted-foreground">No payment records found</Typography>
              <Typography className="text-xs text-muted-foreground">Try adjusting your filters</Typography>
            </View>
          ) : (
            <>
              <Typography className="mb-3 text-sm text-muted-foreground">
                {allHistory.length} payment{allHistory.length !== 1 ? "s" : ""} found
              </Typography>
              <FlatList
                scrollEnabled={false}
                data={allHistory}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <PaymentCard record={item} />}
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
