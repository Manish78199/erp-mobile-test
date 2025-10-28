

import React, { useEffect, useState } from "react"
import { View, ScrollView, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert, Modal } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import { cn } from "@/utils/cn"
import { Plus, X } from "lucide-react-native"
import { Typography } from "@/components/Typography"
import { getNotice } from "@/service/management/notice"
import { useNotices } from "@/hooks/management/notice"

export default function NoticesScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()


  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedNotice, setSelectedNotice] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  const { data: notices, isError, isLoading } = useNotices()

  const filteredNotices = React.useMemo(() => {
    let filtered = notices

    if (searchTerm) {
      filtered = filtered?.filter(
        (notice: any) =>
          notice.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notice.message?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterType !== "all") {
      filtered = filtered?.filter((notice: any) => notice.audience_type === filterType)
    }

    return filtered
  }, [notices, searchTerm, filterType])

  const getAudienceLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      ALL: "School",
      CLASS: "Class",
      STUDENT: "Student",
    }
    return labels[type] || type
  }

  const getAudienceColor = (type: string) => {
    const colors: { [key: string]: string } = {
      ALL: "bg-blue-100",
      CLASS: "bg-purple-100",
      STUDENT: "bg-emerald-100",
    }
    return colors[type] || "bg-gray-100"
  }

  const getAudienceTextColor = (type: string) => {
    const colors: { [key: string]: string } = {
      ALL: "text-blue-700",
      CLASS: "text-purple-700",
      STUDENT: "text-emerald-700",
    }
    return colors[type] || "text-gray-700"
  }

  const handleViewNotice = (notice: any) => {
    setSelectedNotice(notice)
    setShowModal(true)
  }

  const NoticeModal = () => (
    <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white  rounded-t-2xl max-h-[90%]">
          {/* Modal Header */}
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200 ">
            <Typography className="text-lg font-semibold text-gray-900 ">Notice Details</Typography>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Modal Content */}
          <ScrollView className="px-4 py-4">
            {selectedNotice && (
              <View className="space-y-4">
                {/* Title */}
                <View>
                  <Typography className="text-xs font-medium text-gray-600  mb-1">Title</Typography>
                  <Typography className="text-lg font-semibold text-gray-900 ">
                    {selectedNotice.title}
                  </Typography>
                </View>

                {/* Audience Type */}
                <View>
                  <Typography className="text-xs font-medium text-gray-600  mb-2">
                    Audience
                  </Typography>
                  <View className={cn("px-3 py-2 rounded-lg w-fit", getAudienceColor(selectedNotice.audience_type))}>
                    <Typography
                      className={cn("text-sm font-medium", getAudienceTextColor(selectedNotice.audience_type))}
                    >
                      {getAudienceLabel(selectedNotice.audience_type)}
                    </Typography>
                  </View>
                </View>

                {/* Date */}
                <View>
                  <Typography className="text-xs font-medium text-gray-600  mb-1">Created</Typography>
                  <Typography className="text-sm text-gray-700 ">
                    {new Date(selectedNotice.created_at).toLocaleString()}
                  </Typography>
                </View>

                {/* Message */}
                <View>
                  <Typography className="text-xs font-medium text-gray-600  mb-2">Message</Typography>
                  <View className="p-3 rounded-lg bg-gray-50 ">
                    <Typography className="text-sm text-gray-700  leading-relaxed">
                      {selectedNotice.message}
                    </Typography>
                  </View>
                </View>

                {/* Class Info (if applicable) */}
                {selectedNotice.audience_type === "CLASS" && selectedNotice.class_id && (
                  <View>
                    <Typography className="text-xs font-medium text-gray-600  mb-1">Class</Typography>
                    <Typography className="text-sm text-gray-700 ">
                      {selectedNotice.class_id}
                    </Typography>
                  </View>
                )}

                {/* Students Info (if applicable) */}
                {selectedNotice.audience_type === "STUDENT" &&
                  selectedNotice.student_ids &&
                  selectedNotice?.student_ids?.length > 0 && (
                    <View>
                      <Typography className="text-xs font-medium text-gray-600  mb-2">
                        Recipients ({selectedNotice?.student_ids?.length})
                      </Typography>
                      <View className="space-y-1">
                        {selectedNotice.student_ids.map((studentId: string, index: number) => (
                          <Typography key={index} className="text-sm text-gray-700 ">
                            • {studentId}
                          </Typography>
                        ))}
                      </View>
                    </View>
                  )}
              </View>
            )}
          </ScrollView>

          {/* Modal Footer */}
          <View className="px-4 py-4 border-t border-gray-200 ">
            <TouchableOpacity onPress={() => setShowModal(false)} className="bg-indigo-600 rounded-lg p-3">
              <Typography className="text-center text-white font-medium">Close</Typography>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )

  const NoticeCard = ({ notice }: any) => (
    <View className="mb-4 rounded-lg p-4 border border-gray-200  bg-white ">
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Typography className="text-lg font-semibold text-gray-900 ">{notice.title}</Typography>
          <Typography className="text-xs mt-1 text-gray-500 ">
            {new Date(notice.created_at).toLocaleString()}
          </Typography>
        </View>
        <View className={cn("px-3 py-1 rounded-full", getAudienceColor(notice.audience_type))}>
          <Typography className={cn("text-xs font-medium", getAudienceTextColor(notice.audience_type))}>
            {getAudienceLabel(notice.audience_type)}
          </Typography>
        </View>
      </View>

      <Typography className="text-sm text-gray-700  mb-3 line-clamp-2">{notice.message}</Typography>

      <View className="flex-row gap-2 pt-2">
        <TouchableOpacity
          onPress={() => handleViewNotice(notice)}
          className="flex-1 rounded-lg p-2 border border-gray-200  bg-gray-50 "
        >
          <View className="flex-row items-center justify-center gap-2">
            <MaterialCommunityIcons name="eye" size={16} color="#6366f1" />
            <Typography className="text-xs font-medium text-indigo-600 dark:text-indigo-400">View</Typography>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" >

        <View className="flex-row items-center p-4">
          <TouchableOpacity
            onPress={() => router.push("/management")}
            className="flex-row items-center bg-input border border-border rounded-lg px-3 py-2 mr-2"
          >
            <Typography className="text-primary font-semibold">← Back</Typography>
          </TouchableOpacity>

          <Typography className="text-lg font-bold text-foreground">Notices</Typography>
        </View>{/* Header */}

        <View className="px-4 py-4 flex-row items-center justify-between">
          <View>
            <Typography className="text-2xl font-bold text-gray-900 ">Notices</Typography>
            <Typography className="text-sm mt-1 text-gray-600 ">
              Manage notices and announcements
            </Typography>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/management/notice/create")}
            className="bg-indigo-600 rounded-lg p-3"
          >
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View className="px-4 pb-6 space-y-4">
          {/* Stats */}
          <View className="flex-row gap-2">
            <View className="flex-1 rounded-lg p-3 border border-gray-200  bg-white ">
              <Typography className="text-xs font-medium text-gray-600  mb-1">
                Total Notices
              </Typography>
              <Typography className="text-lg font-bold text-gray-900 ">{notices?.length}</Typography>
            </View>
            <View className="flex-1 rounded-lg p-3 border border-gray-200  bg-white ">
              <Typography className="text-xs font-medium text-gray-600  mb-1">This Month</Typography>
              <Typography className="text-lg font-bold text-gray-900 ">
                {
                  notices?.filter((n: any) => {
                    const noticeDate = new Date(n.created_at)
                    const now = new Date()
                    return noticeDate.getMonth() === now.getMonth() && noticeDate.getFullYear() === now.getFullYear()
                  })?.length
                }
              </Typography>
            </View>
          </View>

          {/* Search and Filter */}
          <View className="rounded-lg p-4 border border-gray-200 mt-3  bg-white  space-y-3">
            <Typography className="text-sm font-medium text-gray-700 ">Search & Filter</Typography>

            <View className="flex-row items-center px-3 rounded-lg border border-gray-300  bg-gray-50 ">
              <MaterialCommunityIcons name="magnify" size={20} color="#6b7280" />
              <TextInput
                placeholder="Search notices..."
                placeholderTextColor="#9ca3af"
                value={searchTerm}
                onChangeText={setSearchTerm}
                className="flex-1 ml-2 py-2 text-sm text-gray-900 "
              />
            </View>

            <View className="flex-row gap-2 mt-2">
              {["all", "ALL", "CLASS", "STUDENT"].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setFilterType(type)}
                  className={cn(
                    "px-3 py-2 rounded-lg",
                    filterType === type ? "bg-indigo-600" : "bg-gray-200 ",
                  )}
                >
                  <Typography
                    className={cn(
                      "text-xs font-medium",
                      filterType === type ? "text-white" : "text-gray-700 ",
                    )}
                  >
                    {type === "all" ? "All" : getAudienceLabel(type)}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Notices List */}
          {isLoading ? (
            <View className="flex-row mt-2 items-center justify-center py-12">
              <ActivityIndicator size="large" color="#4f46e5" />
            </View>
          ) : filteredNotices?.length > 0 ? (
            <View>
              <Typography className="text-lg mt-2 font-semibold mb-4 text-gray-900 ">
                {filteredNotices?.length} Notice{filteredNotices?.length !== 1 ? "s" : ""}
              </Typography>
              <FlatList
                scrollEnabled={false}
                data={filteredNotices}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <NoticeCard notice={item} />}
              />
            </View>
          ) : (
            <View className="items-center justify-center py-12">
              <MaterialIcons name="mail-outline" size={48} color="#d1d5db" />
              <Typography className="text-gray-500  mt-2">No notices found</Typography>
            </View>
          )}
        </View>
      </ScrollView>

      <NoticeModal />
    </SafeAreaView>
  )
}
