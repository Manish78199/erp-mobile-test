
import { useEffect, useState } from "react"
import { View, Text, ScrollView, ActivityIndicator, Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useLocalSearchParams } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { get_marksheet } from "@/service/management/result"

export default function Marksheet() {
  const insets = useSafeAreaInsets()
  const { student_id } = useLocalSearchParams()
  const [loading, setLoading] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchPDF = async () => {
      setLoading(true)
      try {
        const studentIdStr = typeof student_id === "string" ? student_id : ""
        const pdfBlob = await get_marksheet(studentIdStr)
        if (!pdfBlob) throw new Error("Failed to fetch PDF")

        const url = URL.createObjectURL(pdfBlob)
        setPdfUrl(url)
      } catch (err) {
        console.error(err)
        Alert.alert("Error", "Failed to load marksheet")
      } finally {
        setLoading(false)
      }
    }

    if (student_id) {
      fetchPDF()
    }

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    }
  }, [student_id])

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-gray-900"
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-4 py-6 space-y-6">
        <View>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">View Marksheet</Text>
          <Text className="text-sm mt-1 text-gray-600 dark:text-gray-400">
            Student marksheet and performance details
          </Text>
        </View>

        {loading ? (
          <View className="flex-row items-center justify-center py-12">
            <ActivityIndicator size="large" color="#10b981" />
            <Text className="ml-3 font-medium text-gray-600 dark:text-gray-400">Loading marksheet...</Text>
          </View>
        ) : pdfUrl ? (
          <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 items-center justify-center py-12">
            <MaterialCommunityIcons name="file-pdf-box" size={64} color="#dc2626" />
            <Text className="mt-4 font-semibold text-gray-900 dark:text-white">PDF Marksheet</Text>
            <Text className="text-sm mt-2 text-gray-600 dark:text-gray-400 text-center">
              Marksheet loaded successfully. Open in PDF viewer to view details.
            </Text>
          </View>
        ) : (
          <View className="rounded-lg p-4 border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900 items-center justify-center py-12">
            <MaterialCommunityIcons name="alert-circle" size={48} color="#dc2626" />
            <Text className="mt-4 font-semibold text-red-900 dark:text-red-200">Failed to Load</Text>
            <Text className="text-sm mt-2 text-red-700 dark:text-red-300 text-center">
              Unable to load the marksheet. Please try again.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}
