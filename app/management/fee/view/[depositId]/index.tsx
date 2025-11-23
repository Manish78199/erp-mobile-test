import { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Typography } from "@/components/Typography"
import { getFeeSlip } from "@/service/management/fee"
import { printAsync } from "expo-print"

interface FeeSlipData {
  slip_code: string
  school_logo: string
  student_name: string
  father_name: string
  admission_no: string
  school_address: string
  roll_number: string
  class_name: string
  deposit_at: string
  paid_amount: number
  payment_mode: string
  reference_no: string
  remarks: string
  session: string
  school_name: string
}

export default function FeeSlipPage() {
  const { depositId } = useLocalSearchParams()
  const [data, setData] = useState<FeeSlipData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchDataRequest = async () => {
      try {
        const fetchedData = await getFeeSlip(depositId as string)
        setData(fetchedData)
      } catch (error) {
        console.error("Error fetching fee slip:", error)
        Alert.alert("Error", "Failed to load fee slip data.")
      } finally {
        setLoading(false)
      }
    }
    fetchDataRequest()
  }, [depositId])

  // 🖨️ Print Function
  const handlePrint = async () => {
    if (!data) return

    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Fee Slip - ${data.slip_code}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #111827;
              background: #fff;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header img {
              max-height: 80px;
              margin-bottom: 10px;
            }
            .school-name {
              font-size: 20px;
              font-weight: bold;
              color: #111827;
            }
            .section {
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 16px;
              margin-top: 20px;
            }
            .row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 6px;
              font-size: 13px;
            }
            .label {
              font-weight: 600;
              color: #374151;
            }
            .value {
              color: #4b5563;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 12px;
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <div class="header">
            ${data.school_logo ? `<img src="${data.school_logo}" />` : ""}
            <div class="school-name">${data.school_name}</div>
            <div>${data.school_address}</div>
            <div>Session: ${data.session}</div>
          </div>

          <div class="section">
            <div class="row"><span class="label">Slip ID:</span><span class="value">${data.slip_code}</span></div>
            <div class="row"><span class="label">Student Name:</span><span class="value">${data.student_name}</span></div>
            <div class="row"><span class="label">Admission No:</span><span class="value">${data.admission_no}</span></div>
            <div class="row"><span class="label">Father's Name:</span><span class="value">${data.father_name}</span></div>
            <div class="row"><span class="label">Class:</span><span class="value">${data.class_name}</span></div>
            <div class="row"><span class="label">Roll No:</span><span class="value">${data.roll_number || "--"}</span></div>
          </div>

          <div class="section">
            <div class="row"><span class="label">Payment Date:</span><span class="value">${new Date(data.deposit_at).toLocaleString()}</span></div>
            <div class="row"><span class="label">Payment Mode:</span><span class="value">${data.payment_mode}</span></div>
            <div class="row"><span class="label">Reference No:</span><span class="value">${data.reference_no || "--"}</span></div>
            <div class="row"><span class="label">Amount Paid:</span><span class="value">₹${data.paid_amount.toFixed(2)}</span></div>
            <div class="row"><span class="label">Remarks:</span><span class="value">${data.remarks || "--"}</span></div>
          </div>

          <div class="footer">
            <div>Printed On: ${new Date().toLocaleString()}</div>
            <div style="margin-top: 10px;">Authorized By: ___________________________</div>
            <div style="margin-top: 20px; font-style: italic;">This is a system-generated slip.</div>
          </div>
        </body>
      </html>
    `

    try {
      await printAsync({ html })
    } catch (error) {
      console.error("Print error:", error)
      Alert.alert("Error", "Failed to print slip.")
    }
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#10b981" />
        <Typography className="mt-2 text-muted-foreground">Loading fee slip...</Typography>
      </SafeAreaView>
    )
  }

  if (!data) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <MaterialCommunityIcons name="alert-circle" size={48} color="#ef4444" />
        <Typography className="mt-2 text-muted-foreground">Failed to load fee slip</Typography>
      </SafeAreaView>
    )
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
        <Typography className="text-xl font-bold text-foreground">Fee Slip</Typography>
      </View>
      <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false}>
        {/* Header */}


        {/* Print Button */}
        <View className="flex-row items-center justify-between p-4">
          <Typography className="text-lg font-bold text-foreground">Fee Slip Details</Typography>
          <TouchableOpacity
            onPress={handlePrint}
            className="flex-row items-center gap-2 rounded-lg bg-blue-600 px-3 py-2"
          >
            <MaterialCommunityIcons name="printer" size={16} color="white" />
            <Typography className="text-sm font-semibold text-white">Print</Typography>
          </TouchableOpacity>
        </View>

        {/* Fee Slip Content */}
        <View className="m-4 rounded-lg border border-border bg-white p-4">
          <View className="mb-6 flex-row gap-4">
            {data.school_logo && (
              <Image source={{ uri: data.school_logo }} className="h-24 w-24 rounded-lg" />
            )}
            <View className="flex-1">
              <Typography className="text-2xl font-bold text-foreground">{data.school_name}</Typography>
              <Typography className="mt-1 text-sm text-muted-foreground">{data.school_address}</Typography>
              <Typography className="mt-1 text-xs text-muted-foreground">Session : {data.session}</Typography>
            </View>
          </View>

          {/* Student Info */}
          <View className="mb-4 border-b border-border pb-4">
            <Typography className="text-sm text-muted-foreground">
              <Text className="font-semibold text-foreground">Slip Id: </Text>{data.slip_code}
            </Typography>
            <Typography className="text-sm text-muted-foreground mt-1">
              <Text className="font-semibold text-foreground">Student Name: </Text>{data.student_name}
            </Typography>
            <Typography className="text-sm text-muted-foreground mt-1">
              <Text className="font-semibold text-foreground">Admission No: </Text>{data.admission_no}
            </Typography>
            <Typography className="text-sm text-muted-foreground mt-1">
              <Text className="font-semibold text-foreground">Father's Name: </Text>{data.father_name}
            </Typography>
            <Typography className="text-sm text-muted-foreground mt-1">
              <Text className="font-semibold text-foreground">Class: </Text>{data.class_name}
            </Typography>
            <Typography className="text-sm text-muted-foreground mt-1">
              <Text className="font-semibold text-foreground">Roll Number: </Text>{data.roll_number || "--"}
            </Typography>
          </View>

          {/* Payment Info */}
          <View className="border-b border-border pb-4">
            <Typography className="text-sm text-muted-foreground mt-1">
              <Text className="font-semibold text-foreground">Payment Date: </Text>
              {new Date(data.deposit_at).toLocaleString()}
            </Typography>
            <Typography className="text-sm text-muted-foreground mt-1">
              <Text className="font-semibold text-foreground">Payment Mode: </Text>{data.payment_mode}
            </Typography>
            <Typography className="text-sm text-muted-foreground mt-1">
              <Text className="font-semibold text-foreground">Reference No: </Text>{data.reference_no || "--"}
            </Typography>
            <Typography className="text-sm text-muted-foreground mt-1">
              <Text className="font-semibold text-foreground">Amount Paid: </Text>
              <Text className="font-semibold text-emerald-600">₹{data.paid_amount.toFixed(2)}</Text>
            </Typography>
            <Typography className="text-sm text-muted-foreground mt-1">
              <Text className="font-semibold text-foreground">Remarks: </Text>{data.remarks || "--"}
            </Typography>
          </View>

          {/* Footer */}
          <View className="mt-4">
            <Typography className="text-xs text-muted-foreground">
              Printed On: {new Date().toLocaleString()}
            </Typography>
            <Typography className="mt-2 text-xs text-muted-foreground">
              Authorized By: ___________________________
            </Typography>
            <Typography className="mt-4 text-center text-xs italic text-muted-foreground">
              This is a system-generated slip.
            </Typography>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
