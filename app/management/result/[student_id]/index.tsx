import { useEffect, useState } from "react"
import { View, ActivityIndicator, Alert, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useLocalSearchParams, useRouter } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { WebView } from "react-native-webview"
import { get_marksheet } from "@/service/management/result"
import { Typography } from "@/components/Typography"

export default function Marksheet() {
  const { student_id } = useLocalSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [pdfBase64, setPdfBase64] = useState<string | null>(null)

  const fetchPDF = async () => {
    setLoading(true)
    try {
      const studentIdStr = typeof student_id === "string" ? student_id : ""
      const response = await get_marksheet(studentIdStr)

      // ensure we get a blob (binary PDF)
      const blob = response instanceof Blob ? response : await response.blob()
      const base64 = await blobToBase64(blob)
      setPdfBase64(`data:application/pdf;base64,${base64}`)
    } catch (err) {
      console.error(err)
      Alert.alert("Error", "Failed to load marksheet")
    } finally {
      setLoading(false)
    }
  }

  // helper: convert Blob → base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result?.toString().split(",")[1] || "")
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  useEffect(() => {
    if (student_id) fetchPDF()
  }, [student_id])

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center p-4">
        <TouchableOpacity
          onPress={() => router.push("/management/result")}
          className="flex-row items-center bg-white border border-border rounded-lg px-3 py-2 mr-2"
        >
          <Typography className="text-primary font-semibold">← Back</Typography>
        </TouchableOpacity>

        <Typography className="text-lg font-bold text-foreground">Marksheet</Typography>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#10b981" />
          <Typography className="mt-3 text-gray-600 font-medium">Loading marksheet...</Typography>
        </View>
      ) : pdfBase64 ? (
        <WebView
          originWhitelist={["*"]}
          source={{ uri: pdfBase64 }}
          style={{ flex: 1 }}
          startInLoadingState
          renderLoading={() => (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#10b981" />
              <Typography className="mt-3 text-gray-600 font-medium">Opening PDF...</Typography>
            </View>
          )}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <MaterialCommunityIcons name="alert-circle" size={48} color="#dc2626" />
          <Typography className="mt-4 font-semibold text-red-900">Failed to Load</Typography>
          <Typography className="text-sm mt-2 text-red-700 text-center">
            Unable to load the marksheet. Please try again.
          </Typography>
        </View>
      )}
    </SafeAreaView>
  )
}
