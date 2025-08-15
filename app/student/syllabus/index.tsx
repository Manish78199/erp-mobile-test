

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Share,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native"
import { WebView } from "react-native-webview"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useRouter } from "expo-router"
import { getMySyllabus } from "@/service/student/syllabus"
import { Typography } from "@/components/Typography"



interface Syllabus {
  _id?: string
  path: string
  title?: string
  subject?: string
  class_name?: string
  session?: string
  uploaded_date?: string
  file_size?: string
  description?: string
 
}


const { width, height } = Dimensions.get("window")

const SyllabusScreen: React.FC = () => {
  const router = useRouter()
  const [syllabus, setSyllabus] = useState<Syllabus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)
  const [showPdfModal, setShowPdfModal] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(true)
  const [showFullPdf, setShowFullPdf] = useState(false)

  // Fetch syllabus data
  const fetchSyllabus = async (showLoader = true) => {
    if (showLoader) setIsLoading(true)
    setPdfError(null)

    try {
      const syllabusData = await getMySyllabus()
      setSyllabus(syllabusData)
    } catch (error) {
      console.error("Failed to fetch syllabus:", error)
      Alert.alert("Error", "Failed to fetch syllabus. Please try again.")
      setSyllabus(null)
    } finally {
      if (showLoader) setIsLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchSyllabus()
  }, [])

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true)
    fetchSyllabus(false)
  }

  // Retry PDF loading
  const retryPdfLoad = async () => {
    setIsRetrying(true)
    setPdfError(null)
    setPdfLoading(true)

    setTimeout(() => {
      setIsRetrying(false)
      if (syllabus?.path) {
        const timestamp = Date.now()
        setSyllabus({
          ...syllabus,
          path: syllabus.path.includes("?") ? `${syllabus.path}&t=${timestamp}` : `${syllabus.path}?t=${timestamp}`,
        })
      }
    }, 1000)
  }

  // Download/Open PDF
  const handlePdfAction = async (action: "download" | "open" | "share") => {
    if (!syllabus?.path) return

    try {
      switch (action) {
        case "download":
        case "open":
          const supported = await Linking.canOpenURL(syllabus.path)
          if (supported) {
            await Linking.openURL(syllabus.path)
          } else {
            Alert.alert("Error", "Cannot open PDF. Please check if you have a PDF viewer installed.")
          }
          break

        case "share":
          await Share.share({
            message: `Check out the syllabus: ${syllabus.title || "Course Syllabus"}`,
            url: syllabus.path,
            title: syllabus.title || "Course Syllabus",
          })
          break
      }
    } catch (error) {
      console.error(`Error ${action}ing PDF:`, error)
      Alert.alert("Error", `Failed to ${action} PDF. Please try again.`)
    }
  }

  // Format file size
  const formatFileSize = (bytes: string | number) => {
    if (!bytes) return "Unknown size"
    const size = typeof bytes === "string" ? Number.parseInt(bytes) : bytes
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Date not available"
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      return "Invalid date"
    }
  }

  // Get status color
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "ACTIVE":
        return "#2ECC71"
      case "DRAFT":
        return "#F39C12"
      case "ARCHIVED":
        return "#7F8C8D"
      default:
        return "#6A5ACD"
    }
  }

  // Empty state illustration
  const EmptyStateIllustration = () => (
    <View className="items-center justify-center py-12">
      <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-6">
        <Icon name="description" size={48} color="#BDC3C7" />
      </View>
      <Typography className="text-xl font-bold text-[#2C3E50] mb-2 text-center">No Syllabus Available</Typography> 
      <Typography className="text-sm text-[#7F8C8D] text-center px-8 leading-5">
        The syllabus for your class has not been uploaded yet. Please check back later or contact your teacher.
      </Typography> 
      <View className="flex-row items-center mt-4">
        <Icon name="schedule" size={16} color="#7F8C8D" />
        <Typography className="text-xs text-[#7F8C8D] ml-2">Last checked: {new Date().toLocaleTimeString()}</Typography> 
      </View>
    </View>
  )

  // PDF Error illustration
  const PdfErrorIllustration = () => (
    <View className="items-center justify-center py-8">
      <View className="w-20 h-20 bg-red-100 rounded-full items-center justify-center mb-4">
        <Icon name="error-outline" size={40} color="#E74C3C" />
      </View>
      <Typography className="text-lg font-bold text-[#E74C3C] mb-2 text-center">PDF Loading Error</Typography> 
      <Typography className="text-sm text-[#7F8C8D] text-center px-6 mb-6 leading-5">
        The PDF document could not be displayed. This might be due to network issues or file corruption.
      </Typography> 
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={retryPdfLoad}
          disabled={isRetrying}
          className="bg-[#E74C3C] px-4 py-2 rounded-xl flex-row items-center"
        >
          <Icon
            name="refresh"
            size={16}
            color="white"
            style={{ transform: [{ rotate: isRetrying ? "360deg" : "0deg" }] }}
          />
          <Typography className="text-white font-semibold ml-2">{isRetrying ? "Retrying..." : "Retry"}</Typography> 
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handlePdfAction("download")}
          className="bg-[#6A5ACD] px-4 py-2 rounded-xl flex-row items-center"
        >
          <Icon name="download" size={16} color="white" />
          <Typography className="text-white font-semibold ml-2">Download</Typography> 
        </TouchableOpacity>
      </View>
    </View>
  )

  const PDFViewer = ({ pdfUrl, height: viewerHeight = 400 }: { pdfUrl: string; height?: number }) => {
    const [webViewError, setWebViewError] = useState(false)

    // Create Google Docs viewer URL for better PDF rendering
    const googleDocsUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`

    console.log("Google Docs Viewer URL:", googleDocsUrl)
   
    return (
      <View style={{ height: viewerHeight }} className="rounded-xl overflow-hidden border border-gray-200">
        {pdfLoading && (
          <View className="absolute inset-0 bg-[#F8F9FA] items-center justify-center z-10">
            <ActivityIndicator size="large" color="#6A5ACD" />
            <Typography className="text-[#7F8C8D] mt-2">Loading PDF...</Typography> 
          </View>
        )}

        {webViewError ? (
          <View className="flex-1 items-center justify-center bg-[#F8F9FA]">
            <Icon name="error-outline" size={48} color="#E74C3C" />
            <Typography className="text-lg font-bold text-[#E74C3C] mt-4 mb-2">Failed to Load PDF</Typography> 
            <Typography className="text-sm text-[#7F8C8D] text-center px-4 mb-4">
              The PDF viewer encountered an error. Try opening in external app.
            </Typography> 
            <TouchableOpacity onPress={() => handlePdfAction("open")} className="bg-[#6A5ACD] px-4 py-2 rounded-xl">
              <Typography className="text-white font-semibold">Open Externally</Typography> 
            </TouchableOpacity>
          </View>
        ) : (
          <WebView
        
            source={{ uri: googleDocsUrl }}
            style={{ flex: 1 }}
            // onLoadStart={() => setPdfLoading(true)}
            onLoadEnd={() => setPdfLoading(false)}
            onError={() => {
              setPdfLoading(false)
              setWebViewError(true)
              setPdfError("Failed to load PDF in viewer")
            }}
            // onHttpError={() => {
            //   setPdfLoading(false)
            //   setWebViewError(true)
            //   setPdfError("HTTP error loading PDF")
            // }}
            // startInLoadingState={true}
            // scalesPageToFit={true}
            // showsHorizontalScrollIndicator={false}
            // showsVerticalScrollIndicator={true}
            // // allowsInlineMediaPlayback={true}
            // mediaPlaybackRequiresUserAction={false}

        
       
        originWhitelist={["*"]}
        allowFileAccess
        allowUniversalAccessFromFileURLs
          />
        )}
      </View>
    )
  }

  return (
    <ScrollView
      className="flex-1 bg-[#F0F4F8]"
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between bg-[#6A5ACD] py-12 px-4 rounded-b-[25px]">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Typography className="text-xl font-bold text-white"> Syllabus</Typography> 
        <TouchableOpacity onPress={() => fetchSyllabus()} disabled={isLoading} className="p-2">
          <Icon
            name="refresh"
            size={20}
            color="white"
            style={{ transform: [{ rotate: isLoading ? "360deg" : "0deg" }] }}
          />
        </TouchableOpacity>
      </View>

      {/* Loading State */}
      {isLoading && (
        <View className="px-4 -mt-8 mb-5">
          <View className="bg-white rounded-2xl p-6 shadow-lg elevation-5">
            <View className="items-center">
              <ActivityIndicator size="large" color="#6A5ACD" />
              <Typography className="text-[#7F8C8D] mt-4">Loading syllabus...</Typography> 
            </View>
          </View>
        </View>
      )}

      {/* Syllabus Content */}
      {!isLoading && (
        <>
          {syllabus ? (
            <>
           

              {/* PDF Preview Card */}
              <View className="px-4 -mt-8 mb-5">
                <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
                  <View className="flex-row items-center justify-between mb-4">
                    <Typography className="text-lg font-bold text-[#2C3E50]">Document Preview</Typography> 
                    <View className="flex-row items-center gap-2">
                      <TouchableOpacity onPress={() => setShowFullPdf(!showFullPdf)} className="p-2">
                        <Icon name={showFullPdf ? "fullscreen-exit" : "fullscreen"} size={20} color="#6A5ACD" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handlePdfAction("share")} className="p-2">
                        <Icon name="share" size={20} color="#6A5ACD" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {syllabus.path ? (
                    <View>
                      <PDFViewer pdfUrl={syllabus.path} height={showFullPdf ? height * 0.7 : 400} />

                      {/* PDF Controls */}
                      <View className="flex-row justify-between items-center mt-4 p-3 bg-[#F8F9FA] rounded-xl">
                        <View className="flex-row items-center">
                          <Icon name="picture-as-pdf" size={20} color="#E74C3C" />
                          <Typography className="text-sm font-semibold text-[#2C3E50] ml-2">
                            {syllabus.title || "Course Syllabus"}
                          </Typography> 
                        </View>
                        <View className="flex-row items-center gap-2">
                          <TouchableOpacity onPress={retryPdfLoad} disabled={isRetrying} className="p-2">
                            <Icon
                              name="refresh"
                              size={18}
                              color="#6A5ACD"
                              style={{ transform: [{ rotate: isRetrying ? "360deg" : "0deg" }] }}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => handlePdfAction("open")} className="p-2">
                            <Icon name="open-in-new" size={18} color="#6A5ACD" />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* PDF Info */}
                      <View className="mt-3 p-3 bg-blue-50 rounded-xl">
                        <View className="flex-row items-center mb-2">
                          <Icon name="info-outline" size={16} color="#6A5ACD" />
                          <Typography className="text-sm font-semibold text-[#6A5ACD] ml-2">PDF Viewer Tips</Typography> 
                        </View>
                        <Typography className="text-xs text-[#7F8C8D] leading-4">
                          • Pinch to zoom in/out • Scroll to navigate pages • Tap fullscreen for better view
                        </Typography> 
                      </View>
                    </View>
                  ) : (
                    <View className="bg-[#F8F9FA] rounded-xl p-6 items-center justify-center min-h-[200px]">
                      <View className="w-16 h-20 bg-white rounded-lg shadow-md items-center justify-center mb-4">
                        <Icon name="picture-as-pdf" size={32} color="#E74C3C" />
                      </View>
                      <Typography className="text-base font-semibold text-[#2C3E50] mb-2">No PDF Available</Typography> 
                      <Typography className="text-sm text-[#7F8C8D] text-center mb-4">
                        PDF path not found. Please contact your teacher.
                      </Typography> 
                    </View>
                  )}
                </View>
              </View>

              {/* Quick Actions */}
              <View className="px-4 mb-5">
                <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
                  <Typography className="text-lg font-bold text-[#2C3E50] mb-4">Quick Actions</Typography> 
                  <View className="gap-3">
                    <TouchableOpacity
                      onPress={() => handlePdfAction("download")}
                      className="flex-row items-center p-3 bg-[#F8F9FA] rounded-xl"
                    >
                      <Icon name="download" size={20} color="#6A5ACD" />
                      <Typography className="text-[#2C3E50] font-semibold ml-3 flex-1">Download PDF</Typography> 
                      <Icon name="chevron-right" size={20} color="#BDC3C7" />
                    </TouchableOpacity>
                   
                    <TouchableOpacity
                      onPress={() => handlePdfAction("open")}
                      className="flex-row items-center p-3 bg-[#F8F9FA] rounded-xl"
                    >
                      <Icon name="open-in-new" size={20} color="#6A5ACD" />
                      <Typography className="text-[#2C3E50] font-semibold ml-3 flex-1">Open in Browser</Typography> 
                      <Icon name="chevron-right" size={20} color="#BDC3C7" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Troubleshooting Tips */}
              {pdfError && (
                <View className="px-4 mb-5">
                  <View className="bg-red-50 border border-red-200 rounded-2xl p-4">
                    <View className="flex-row items-center mb-3">
                      <Icon name="help-outline" size={20} color="#E74C3C" />
                      <Typography className="text-lg font-bold text-red-800 ml-2">Troubleshooting Tips</Typography> 
                    </View>
                    <Typography className="text-sm text-red-700 mb-3">
                      <Typography className="font-semibold">If the PDF won't load, try:</Typography> 
                    </Typography> 
                    <View className="space-y-2">
                      <Typography className="text-sm text-red-700">• Refreshing the page and trying again</Typography> 
                      <Typography className="text-sm text-red-700">• Downloading the file directly instead</Typography> 
                      <Typography className="text-sm text-red-700">• Checking your internet connection</Typography> 
                      <Typography className="text-sm text-red-700">• Installing a PDF viewer app</Typography> 
                    </View>
                    <Typography className="text-sm text-red-700 mt-3">
                      <Typography className="font-semibold">Still having issues?</Typography>  Contact your teacher or IT support.
                    </Typography> 
                  </View>
                </View>
              )}
            </>
          ) : (
            /* No Syllabus Available */
            <View className="px-4 -mt-8 mb-5">
              <View className="bg-white rounded-2xl shadow-lg elevation-5">
                <EmptyStateIllustration />
              </View>
            </View>
          )}
        </>
      )}
    </ScrollView>
  )
}

export default SyllabusScreen

