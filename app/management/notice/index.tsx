
import { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, FlatList } from "react-native"
import { useRouter } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function NoticeListScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [allNotice, setAllNotice] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getAllNoticeRequest = async () => {
      try {
        // Replace with your actual API call
        // const notices = await getNotice();
        // setAllNotice(notices);

        // Mock data for now
        setAllNotice([
          {
            _id: "1",
            title: "School Closure",
            message: "School will be closed on Monday",
            created_at: new Date().toISOString(),
            audience_type: "ALL",
          },
          {
            _id: "2",
            title: "Sports Day",
            message: "Annual sports day on Friday",
            created_at: new Date().toISOString(),
            audience_type: "CLASS",
          },
        ])
      } catch (error) {
        console.error("Error fetching notices:", error)
      } finally {
        setLoading(false)
      }
    }
    getAllNoticeRequest()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderNoticeCard = ({ item }: { item: any }) => (
    <View className="bg-slate-800 rounded-lg p-4 mb-3 border border-slate-700">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-white font-semibold text-base">{item.title}</Text>
          <Text className="text-slate-400 text-xs mt-1">{formatDate(item.created_at)}</Text>
        </View>
        <TouchableOpacity className="p-2">
          <MaterialIcons name="more-vert" size={20} color="#94a3b8" />
        </TouchableOpacity>
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-slate-300 text-sm">{item.audience_type}</Text>
        <View className="bg-indigo-600/20 px-2 py-1 rounded">
          <Text className="text-indigo-400 text-xs font-medium">View</Text>
        </View>
      </View>
    </View>
  )

  return (
    <View className="flex-1 bg-slate-900" style={{ paddingTop: insets.top }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={["#4f46e5", "#6366f1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-4 py-6"
        >
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-white text-2xl font-bold">Notices</Text>
              <Text className="text-indigo-100 text-sm mt-1">Manage announcements</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/management/notice/create")}
              className="bg-white/20 px-3 py-2 rounded-lg flex-row items-center"
            >
              <MaterialIcons name="add" size={20} color="white" />
              <Text className="text-white text-sm font-medium ml-1">New</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Filter and Export Buttons */}
        <View className="px-4 py-4 flex-row gap-2">
          <TouchableOpacity className="flex-1 bg-slate-800 rounded-lg p-3 flex-row items-center justify-center border border-slate-700">
            <MaterialIcons name="filter-list" size={18} color="#94a3b8" />
            <Text className="text-slate-300 text-sm font-medium ml-2">Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-slate-800 rounded-lg p-3 flex-row items-center justify-center border border-slate-700">
            <MaterialIcons name="download" size={18} color="#94a3b8" />
            <Text className="text-slate-300 text-sm font-medium ml-2">Export</Text>
          </TouchableOpacity>
        </View>

        {/* Notices List */}
        <View className="px-4 pb-6">
          {loading ? (
            <View className="py-8 items-center">
              <Text className="text-slate-400">Loading notices...</Text>
            </View>
          ) : allNotice.length > 0 ? (
            <FlatList
              data={allNotice}
              renderItem={renderNoticeCard}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
            />
          ) : (
            <View className="py-8 items-center">
              <MaterialIcons name="mail-outline" size={48} color="#64748b" />
              <Text className="text-slate-400 mt-2">No notices yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
