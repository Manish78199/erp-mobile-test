"use client"

import { useContext, useMemo, useState } from "react"
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import RNPickerSelect from "react-native-picker-select"
import { depositFee, getStudentDetails } from "@/service/management/fee"
import { getClassStudents } from "@/service/management/student"
import { AlertContext } from "@/context/Alert/context"
import { Typography } from "@/components/Typography"
import { useClasses } from "@/hooks/management/classes"

interface StudentFeeDetails {
  admission_no: string
  first_name: string
  middle_name?: string
  last_name: string
  father_name: string
  total_fee: number
  paid_fee: number
  remaining_fee: number
}

export default function FeePayment() {
  const { showAlert } = useContext(AlertContext)
  const router = useRouter()
  const { classes } = useClasses()

  const [creating, setCreating] = useState(false)
  const [allStudent, setAllStudent] = useState<any[]>([])
  const [studentFeeDetails, setStudentFeeDetails] = useState<StudentFeeDetails | null>(null)
  const [currentClass, setCurrentClass] = useState("")
  const [currentStudent, setCurrentStudent] = useState("")

  const [formData, setFormData] = useState({
    student_id: "",
    remarks: "",
    payment_mode: "CASH",
    reference_no: "",
    paid_amount: 0,
  })

  const paymentModes = [
    { label: "CASH", value: "CASH" },
    { label: "UPI", value: "UPI" },
    { label: "CARD", value: "CARD" },
    { label: "BANK TRANSFER", value: "BANK_TRANSFER" },
    { label: "OTHER", value: "OTHER" },
  ]

  const classList = useMemo(() => classes.map((c: any) => ({
    label: `${c.name} (${c.classCode})`,
    value: c._id,
  })), [classes])

  const studentOptions = allStudent.map((student: any) => ({
    label: `(${student?.admission_no}) ${student?.first_name}`,
    value: student["_id"],
  }))

  const handleClassChange = (value: string) => {
    if (!value) return;
    setCurrentClass(value)
    setStudentFeeDetails(null)
    setCurrentStudent("")
    getClassStudents(value).then((data: any[]) => {

      setAllStudent(data)
    })
  }

  const handleStudentChange = (value: string) => {
    if (!value) {
      setStudentFeeDetails(null)
      return;
    }
    setCurrentStudent(value)
    setFormData((prev) => ({ ...prev, student_id: value }))
    getStudentDetails(value)
      .then((res) => {
        setStudentFeeDetails(res.data.data)
      })
      .catch((error) => {
        showAlert("ERROR", error.response?.data?.message)
      })
  }

  const handleSubmit = async () => {
    if (!formData.student_id) {
      showAlert("ERROR", "Please select a student")
      return
    }

    if (formData.paid_amount <= 0) {
      showAlert("ERROR", "Please enter a valid amount")
      return
    }

    setCreating(true)
    try {
      const res = await depositFee(formData)
      showAlert("SUCCESS", res?.data.message)
      router.push(`/management/fee/view/${res?.data.data}`)
    } catch (error: any) {
      showAlert("ERROR", error.response?.data.message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center p-4">
        <TouchableOpacity
          onPress={() => router.push("/management")}
          className="flex-row items-center bg-white border border-border rounded-lg px-3 py-2 mr-2"
        >
          <Typography className="text-primary font-semibold">← Back</Typography>
        </TouchableOpacity>

        <Typography className="text-xl font-bold text-foreground">Deposit Fee</Typography>
      </View>
      <ScrollView className="flex-1 " showsVerticalScrollIndicator={false}>

        <View className=" p-4">
          <Typography className="text-2xl font-bold text-foreground">Fee Deposit</Typography>
          <Typography className="mt-1 text-sm text-muted-foreground">
            Deposit student's fees .
          </Typography>
        </View>

        <View className="p-4">

          <View className="mb-6 rounded-lg bg-white  border border-border  p-4">
            <View className="mb-4 flex-row items-center gap-2">
              <View className="rounded-lg bg-emerald-600 p-2">
                <MaterialCommunityIcons name="receipt" size={20} color="white" />
              </View>
              <Typography className="text-lg font-semibold text-foreground">Fee Payment</Typography>
            </View>

            <View className="mb-4">
              <Typography className="mb-2 text-sm font-medium text-foreground">
                Class <Text className="text-red-500">*</Text>
              </Typography>
              <RNPickerSelect
                items={classList}
                onValueChange={handleClassChange}
                value={currentClass}
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
              <Typography className="mb-2 text-sm font-medium text-foreground">
                Student <Text className="text-red-500">*</Text>
              </Typography>
              <RNPickerSelect
                items={studentOptions}
                onValueChange={handleStudentChange}
                value={currentStudent}
                placeholder={{ label: "-- Select Student --", value: null }}
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
          </View>

          {/* Student Details Section */}
          {studentFeeDetails && (
            <>
              <View className="mb-6 rounded-lg border border-border bg-white p-4">
                <View className="mb-4 flex-row items-center gap-2">
                  <View className="rounded-lg bg-blue-600 p-2">
                    <MaterialCommunityIcons name="account-check" size={20} color="white" />
                  </View>
                  <Typography className="text-lg font-semibold text-foreground">Student Information</Typography>
                </View>

                <View className="mb-3 rounded-lg border border-border bg-background p-3">
                  <Typography className="text-xs text-muted-foreground">Admission No</Typography>
                  <Typography className="mt-1 font-semibold text-foreground">
                    {studentFeeDetails?.admission_no || "--"}
                  </Typography>
                </View>

                <View className="mb-3 rounded-lg border border-border bg-background p-3">
                  <Typography className="text-xs text-muted-foreground">Student Name</Typography>
                  <Typography className="mt-1 font-semibold text-foreground">
                    {`${studentFeeDetails?.first_name} ${studentFeeDetails?.middle_name || ""} ${studentFeeDetails?.last_name}`.trim()}
                  </Typography>
                </View>

                <View className="rounded-lg border border-border bg-background p-3">
                  <Typography className="text-xs text-muted-foreground">Father's Name</Typography>
                  <Typography className="mt-1 font-semibold text-foreground">
                    {studentFeeDetails?.father_name || "--"}
                  </Typography>
                </View>
              </View>

              {/* Fee Summary */}
              <View className="mb-6 gap-3">
                <View className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <Typography className="text-xs text-muted-foreground">Total Fee</Typography>
                  <View className="mt-2 flex-row items-center gap-1">
                    <MaterialCommunityIcons name="currency-inr" size={16} color="#3b82f6" />
                    <Typography className="text-lg font-bold text-blue-600">
                      {studentFeeDetails["total_fee"]?.toLocaleString("en-IN")}
                    </Typography>
                  </View>
                </View>

                <View className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <Typography className="text-xs text-muted-foreground">Paid Fee</Typography>
                  <View className="mt-2 flex-row items-center gap-1">
                    <MaterialCommunityIcons name="currency-inr" size={16} color="#10b981" />
                    <Typography className="text-lg font-bold text-emerald-600">
                      {studentFeeDetails["paid_fee"]?.toLocaleString("en-IN")}
                    </Typography>
                  </View>
                </View>

                <View className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                  <Typography className="text-xs text-muted-foreground">Remaining Fee</Typography>
                  <View className="mt-2 flex-row items-center gap-1">
                    <MaterialCommunityIcons name="currency-inr" size={16} color="#f97316" />
                    <Typography className="text-lg font-bold text-orange-600">
                      {studentFeeDetails["remaining_fee"]?.toLocaleString("en-IN")}
                    </Typography>
                  </View>
                </View>
              </View>

              {/* Payment Details */}
              <View className="mb-6 rounded-lg border border-border bg-white p-4">
                <View className="mb-4 flex-row items-center gap-2">
                  <View className="rounded-lg bg-purple-600 p-2">
                    <MaterialCommunityIcons name="credit-card" size={20} color="white" />
                  </View>
                  <Typography className="text-lg font-semibold text-foreground">Payment Details</Typography>
                </View>

                <View className="mb-4">
                  <Typography className="mb-2 text-sm font-medium text-foreground">
                    Deposit Amount <Text className="text-red-500">*</Text>
                  </Typography>
                  <View className="flex-row items-center rounded-lg border border-border bg-background px-3">
                    <MaterialCommunityIcons name="currency-inr" size={16} color="#999" />
                    <TextInput
                      placeholder="Enter amount"
                      value={formData.paid_amount.toString()}
                      onChangeText={(text) =>
                        setFormData((prev) => ({ ...prev, paid_amount: Number.parseFloat(text) || 0 }))
                      }
                      keyboardType="decimal-pad"
                      className="flex-1 px-2 py-3 text-foreground"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                <View className="mb-4">
                  <Typography className="mb-2 text-sm font-medium text-foreground">
                    Payment Type <Text className="text-red-500">*</Text>
                  </Typography>
                  <RNPickerSelect
                    items={paymentModes}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, payment_mode: value }))}
                    value={formData.payment_mode}
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
                  <Typography className="mb-2 text-sm font-medium text-foreground">Remarks</Typography>
                  <TextInput
                    placeholder="Add payment remarks..."
                    value={formData.remarks}
                    onChangeText={(text) => setFormData((prev) => ({ ...prev, remarks: text }))}
                    multiline
                    numberOfLines={3}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                    placeholderTextColor="#999"
                  />
                </View>

                {formData.payment_mode !== "CASH" && (
                  <View>
                    <Typography className="mb-2 text-sm font-medium text-foreground">Reference Number</Typography>
                    <TextInput
                      placeholder="Enter transaction reference number"
                      value={formData.reference_no}
                      onChangeText={(text) => setFormData((prev) => ({ ...prev, reference_no: text }))}
                      className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                      placeholderTextColor="#999"
                    />
                  </View>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={creating}
                className={`mb-6 flex-row items-center justify-center rounded-lg py-3 ${creating ? "bg-gray-400" : "bg-indigo-600"
                  }`}
              >
                {creating ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <MaterialCommunityIcons name="check" size={20} color="white" />
                    <Typography className="ml-2 font-semibold text-white">Submit Payment</Typography>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
