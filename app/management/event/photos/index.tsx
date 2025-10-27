
import { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Modal,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"

// Mock API function - replace with actual API call
const getEventActivityImages = async () => {
  return [
    { _id: "1", image_path: "/vibrant-indoor-event.png" },
    { _id: "2", image_path: "/event-photo-2.jpg" },
    { _id: "3", image_path: "/event-photo-3.jpg" },
  ]
}

export default function EventPhotoGallery() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const [activities, setActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [activePhoto, setActivePhoto] = useState(null)

  useEffect(() => {
    const fetchMyActivity = async () => {
      try {
        setLoading(true)
        const activity = await getEventActivityImages()
        setActivity(activity)
      } catch (error) {
        console.error("Error fetching activities:", error)
        Alert.alert("Error", "Failed to fetch photos")
      } finally {
        setLoading(false)
      }
    }
    fetchMyActivity()
  }, [])

  const handleDownload = async (imageUrl: string, filename: string) => {
    try {
      Alert.alert("Download", `Downloading ${filename}...`)
      // In React Native, you would use a library like react-native-fs or expo-file-system
      // For now, we'll just show an alert
    } catch (error) {
      console.error("Error downloading image:", error)
      Alert.alert("Error", "Failed to download image")
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-gray-900"
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-4 py-6 space-y-6">
        {/* Header Section */}
        <View>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Photo Gallery</Text>
          <Text className="text-sm mt-1 text-gray-600 dark:text-gray-400">Your event's photos collection</Text>
        </View>

        {/* Header Card */}
        <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900">
                <MaterialCommunityIcons name="camera" size={24} color="#4f46e5" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="font-semibold text-gray-900 dark:text-white">Event Photos</Text>
                <Text className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                  {activities.length} {activities.length === 1 ? "photo" : "photos"}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/add-event-photos")}
              className="bg-indigo-600 rounded-lg px-3 py-2 flex-row items-center"
            >
              <MaterialCommunityIcons name="plus" size={18} color="white" />
              <Text className="text-white font-medium ml-1 text-sm">Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Photo Gallery */}
        {loading ? (
          <View className="flex-row items-center justify-center py-12">
            <ActivityIndicator size="large" color="#10b981" />
          </View>
        ) : activities.length > 0 ? (
          <View className="space-y-3">
            <FlatList
              scrollEnabled={false}
              data={activities}
              keyExtractor={(item) => item._id}
              numColumns={2}
              columnWrapperStyle={{ gap: 12 }}
              renderItem={({ item: photo }) => (
                <TouchableOpacity
                  onPress={() => setActivePhoto(photo)}
                  className="flex-1 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  <Image source={{ uri: photo.image_path }} className="w-full h-40" resizeMode="cover" />
                  <View className="absolute inset-0 bg-black/0 hover:bg-black/20 flex items-center justify-center">
                    <TouchableOpacity onPress={() => setActivePhoto(photo)} className="bg-white/90 rounded-full p-2">
                      <MaterialCommunityIcons name="magnify-plus" size={20} color="black" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        ) : (
          <View className="rounded-lg p-8 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 items-center justify-center">
            <View className="p-4 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
              <MaterialCommunityIcons name="image-off" size={32} color="#9ca3af" />
            </View>
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Photos Yet</Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
              Start building your photo gallery by adding some event photos.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/add-event-photos")}
              className="bg-indigo-600 rounded-lg px-4 py-2 flex-row items-center"
            >
              <MaterialCommunityIcons name="plus" size={18} color="white" />
              <Text className="text-white font-medium ml-1">Add Photo</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Lightbox Modal */}
        <Modal visible={activePhoto !== null} transparent={true} animationType="fade">
          <View className="flex-1 bg-black/90 flex items-center justify-center">
            <View className="w-full h-full flex items-center justify-center p-4">
              {activePhoto && (
                <>
                  <View className="flex-row items-center justify-between w-full mb-4 px-4">
                    <View className="flex-row items-center">
                      <View className="bg-white/10 rounded-full px-3 py-1">
                        <Text className="text-white text-xs font-medium">Event Photo</Text>
                      </View>
                    </View>
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={() => handleDownload(activePhoto.image_path, "event-photo.jpg")}
                        className="bg-white/10 rounded-full p-2"
                      >
                        <MaterialCommunityIcons name="download" size={20} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setActivePhoto(null)} className="bg-white/10 rounded-full p-2">
                        <MaterialCommunityIcons name="close" size={20} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Image source={{ uri: activePhoto.image_path }} className="w-full h-96" resizeMode="contain" />
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  )
}
