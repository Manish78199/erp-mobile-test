
import type React from "react"
import { useState, useEffect, useMemo } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Share,
  Linking,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { Link } from "expo-router"
import { getAllEventActivity } from "@/service/student/eventActivity"
import { format } from "date-fns"
import { Typography } from "@/components/Typography"

// Types
interface EventActivity {
  _id: string
  title?: string
  description?: string
  image_path: string
  event_date?: string
  event_type?: string
  location?: string
  created_at?: string
  tags?: string[]
  photographer?: string
  category?: string
}


type ViewType = "MASONRY" | "GRID"

// Get screen dimensions
const { width: screenWidth } = Dimensions.get("window")

// Custom Empty State Illustrations
const NoPhotosIllustration = () => (
  <View className="items-center justify-center p-8">
    <View className="relative">
      <View className="w-20 h-16 bg-gray-200 rounded-lg border-2 border-gray-300 items-center justify-center">
        <Icon name="photo-library" size={32} color="#BDC3C7" />
      </View>
      <View className="absolute -top-2 -right-2 w-8 h-8 bg-purple-400 rounded-full items-center justify-center">
        <Typography className="text-white font-bold text-sm">0</Typography>
      </View>
      <View className="absolute -left-3 top-3 w-2 h-2 bg-blue-300 rounded-full opacity-60" />
      <View className="absolute -right-1 bottom-2 w-1.5 h-1.5 bg-green-300 rounded-full opacity-60" />
    </View>
  </View>
)

const LoadingPhotosIllustration = () => (
  <View className="items-center justify-center p-8">
    <View className="relative">
      <View className="w-16 h-16 bg-purple-100 rounded-lg border-2 border-purple-200 items-center justify-center">
        <Icon name="photo-camera" size={28} color="#8B5CF6" />
      </View>
      <View className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-gray-300 rounded-full items-center justify-center">
        <ActivityIndicator size="small" color="#8B5CF6" />
      </View>
      <View className="absolute -left-3 bottom-3 w-2 h-2 bg-pink-300 rounded-full opacity-60" />
      <View className="absolute right-2 -bottom-1 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-60" />
    </View>
  </View>
)

const ActivityGalleryScreen: React.FC = () => {
  // State management
  const [activities, setActivities] = useState<EventActivity[]>([])
  // const [filteredActivities, setFilteredActivities] = useState<EventActivity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const [viewType, setViewType] = useState<ViewType>("MASONRY")

  // Modal states
  const [activePhoto, setActivePhoto] = useState<EventActivity | null>(null)
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>({})

  // Safe date parsing
  const safeParseDateString = (dateString: string | undefined | null): Date | null => {
    if (!dateString) return null
    try {
      const date = new Date(dateString)
      if (!isNaN(date.getTime())) {
        return date
      }
      return null
    } catch (error) {
      return null
    }
  }

  // Format date display
  const formatDateDisplay = (dateString: string | undefined | null) => {
    const date = safeParseDateString(dateString)
    if (!date) return "Date not available"

    try {
      return format(date, "dd MMM yyyy")
    } catch (error) {
      return "Invalid date"
    }
  }

  // Fetch activities
  const fetchActivities = async () => {
    setIsLoading(true)
    try {
      const activityData = await getAllEventActivity()
      setActivities(activityData)
      // setFilteredActivities(activityData)
    } catch (error) {
      console.error("Error fetching activities:", error)
      Alert.alert("Error", "Failed to fetch activity photos")
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh handler
  const onRefresh = async () => {
    setRefreshing(true)
    await fetchActivities()
    setRefreshing(false)
  }



  // Handle photo press
  const handlePhotoPress = (photo: EventActivity) => {
    setActivePhoto(photo)
    setShowPhotoModal(true)
  }

  const handleImageLoadStart = (photoId: string) => {
    setImageLoading((prev) => {
      if (prev[photoId]) return prev // already loading
      return { ...prev, [photoId]: true }
    })
  }

  const handleImageLoadEnd = (photoId: string) => {
    setImageLoading((prev) => {
      if (prev[photoId] === false) return prev // already done
      return { ...prev, [photoId]: false }
    })
  }


  // Share photo
  const sharePhoto = async (photo: EventActivity) => {
    try {
      await Share.share({
        message: `Check out this photo from ${photo.title || "our event"}!`,
        url: photo.image_path,
      })
    } catch (error) {
      console.error("Error sharing photo:", error)
      Alert.alert("Error", "Failed to share photo")
    }
  }

  // Download photo
  const downloadPhoto = async (photo: EventActivity) => {
    try {
      // Open the image URL in browser for download
      await Linking.openURL(photo.image_path)
    } catch (error) {
      console.error("Error downloading photo:", error)
      Alert.alert("Error", "Failed to download photo")
    }
  }



  // Calculate image dimensions for masonry layout
  const getImageDimensions = (index: number) => {
    const columnWidth = (screenWidth - 48) / 2 // 2 columns with padding
    const heights = [200, 250, 180, 220, 190, 240] // Varied heights for masonry effect
    return {
      width: columnWidth,
      height: heights[index % heights.length],
    }
  }

  // const dimensions = useMemo(() => getImageDimensions(actualIndex), [actualIndex])



  useEffect(() => {
    fetchActivities()
  }, [])


  useEffect(()=>{
    console.log("render")
  },[])

  return (
    <ScrollView
      className="flex-1 bg-[#F0F4F8]"
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between bg-[#8B5CF6] py-12 px-4 rounded-b-[25px]">
        <Link href="/student" asChild>
          <TouchableOpacity className="p-2">
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </Link>
        <View className="flex-1 items-center">
          
          <Typography className="text-xl font-bold text-white">Event Gallery</Typography>
        </View>
        <TouchableOpacity className="p-2" onPress={onRefresh}>
          <Icon name="refresh" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Stats Overview */}
      <View className="px-4 -mt-8 mb-5">
        <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
          <Typography className="text-lg font-bold text-[#2C3E50] mb-4">Photo Gallery</Typography>
          <Typography className="text-sm text-[#7F8C8D] mb-4">Your event's photos and memories</Typography>

        </View>
      </View>

      {/* Filter and View Controls */}
      <View className="px-4 mb-5">
        <View className="flex-row justify-between items-center">


          <TouchableOpacity
            className="bg-white rounded-xl p-3 shadow-lg elevation-5"
            onPress={() => setViewType(viewType === "MASONRY" ? "GRID" : "MASONRY")}
          >
            <Icon name={viewType === "MASONRY" ? "view-module" : "grid-view"} size={20} color="#8B5CF6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading State */}
      {isLoading && (
        <View className="px-4">
          <View className="bg-white rounded-2xl p-6 shadow-lg elevation-5 items-center">
            <LoadingPhotosIllustration />
            <Typography className="text-lg font-semibold text-[#2C3E50] mt-4">Loading Photos...</Typography>
            <Typography className="text-sm text-[#7F8C8D] mt-2 text-center">
              Please wait while we fetch your activity photos
            </Typography>
          </View>
        </View>
      )}

      {/* Photo Gallery */}
      {!isLoading && (
        <View className="px-4">
          {activities.length > 0 ? (
            <View>
              {viewType === "MASONRY" ? (
                // Masonry Layout
                <View className="flex-row justify-between">
                  <View className="flex-1 mr-2">
                    {activities
                      .filter((_, index) => index % 2 === 0)
                      .map((photo, index) => {
                        const actualIndex = index * 2
                        const dimensions = getImageDimensions(actualIndex)
                        return (
                          <TouchableOpacity
                            key={index}
                            className="mb-3 bg-white rounded-2xl overflow-hidden shadow-lg elevation-5"
                            onPress={() => handlePhotoPress(photo)}
                          >
                            <View className="relative">
                              <Image
                                source={{ uri: photo.image_path }}
                                style={{ width: dimensions.width, height: dimensions.height }}
                                className="w-full"
                                resizeMode="cover"
                                onLoadStart={() => handleImageLoadStart(photo._id)}
                                onLoadEnd={() => handleImageLoadEnd(photo._id)}
                              />
                              {imageLoading[photo._id] && (
                                <View className="absolute inset-0 bg-gray-200 items-center justify-center">
                                  <ActivityIndicator size="small" color="#8B5CF6" />
                                </View>
                              )}
                              {photo.title && (
                                <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                                  <Typography className="text-white text-xs font-semibold" numberOfLines={1}>
                                    {photo.title}
                                  </Typography>
                                  {photo.event_date && (
                                    <Typography className="text-white text-xs opacity-80">
                                      {formatDateDisplay(photo.event_date)}
                                    </Typography>
                                  )}
                                </View>
                              )}
                            </View>
                          </TouchableOpacity>
                        )
                      })}
                  </View>
                  <View className="flex-1 ml-2">
                    {activities
                      .filter((_, index) => index % 2 === 1)
                      .map((photo, index) => {
                        const actualIndex = index * 2 + 1
                        const dimensions = getImageDimensions(actualIndex)
                        return (
                          <TouchableOpacity
                            key={index}
                            className="mb-3 bg-white rounded-2xl overflow-hidden shadow-lg elevation-5"
                            onPress={() => handlePhotoPress(photo)}
                          >
                            <View className="relative">
                              <Image
                                source={{ uri: photo.image_path }}
                                style={{ width: dimensions.width, height: dimensions.height }}
                                className="w-full"
                                resizeMode="cover"
                                onLoadStart={() => handleImageLoadStart(photo._id)}
                                onLoadEnd={() => handleImageLoadEnd(photo._id)}
                              />
                              {imageLoading[photo._id] && (
                                <View className="absolute inset-0 bg-gray-200 items-center justify-center">
                                  <ActivityIndicator size="small" color="#8B5CF6" />
                                </View>
                              )}
                              {photo.title && (
                                <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                                  <Typography className="text-white text-xs font-semibold" numberOfLines={1}>
                                    {photo.title}
                                  </Typography>
                                  {photo.event_date && (
                                    <Typography className="text-white text-xs opacity-80">
                                      {formatDateDisplay(photo.event_date)}
                                    </Typography>
                                  )}
                                </View>
                              )}
                            </View>
                          </TouchableOpacity>
                        )
                      })}
                  </View>
                </View>
              ) : (
                // Grid Layout
                <View className="flex-row flex-wrap justify-between">
                  {activities.map((photo) => (
                    <TouchableOpacity
                      key={photo._id}
                      className="w-[48%] mb-4 bg-white rounded-2xl overflow-hidden shadow-lg elevation-5"
                      onPress={() => handlePhotoPress(photo)}
                    >
                      <View className="relative">
                        <Image
                          source={{ uri: photo.image_path }}
                          className="w-full h-40"
                          resizeMode="cover"
                          onLoadStart={() => handleImageLoadStart(photo?._id)}
                          onLoadEnd={() => handleImageLoadEnd(photo?._id)}
                        />
                        {imageLoading[photo._id] && (
                          <View className="absolute inset-0 bg-gray-200 items-center justify-center">
                            <ActivityIndicator size="small" color="#8B5CF6" />
                          </View>
                        )}
                        {photo.title && (
                          <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                            <Typography className="text-white text-xs font-semibold" numberOfLines={1}>
                              {photo.title}
                            </Typography>
                            {photo.event_date && (
                              <Typography className="text-white text-xs opacity-80">
                                {formatDateDisplay(photo.event_date)}
                              </Typography>
                            )}
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ) : (
            <View className="bg-white rounded-2xl p-6 shadow-lg elevation-5 items-center">
              <NoPhotosIllustration />
              <Typography className="text-lg font-bold text-[#2C3E50] mt-4 mb-2">No Photos Found</Typography>
              <Typography className="text-sm text-[#7F8C8D] text-center mb-4">

                No activity photos are available at the moment

              </Typography>

            </View>
          )}
        </View>
      )}



      {/* Photo Detail Modal */}
      <Modal
        visible={showPhotoModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <View className="flex-1 bg-black">
          {/* Header */}
          <View className="flex-row items-center justify-between pt-12 pb-4 px-4 bg-black/80">
            <TouchableOpacity onPress={() => setShowPhotoModal(false)}>
              <Icon name="close" size={24} color="white" />
            </TouchableOpacity>
            <View className="flex-row items-center gap-4">
              {activePhoto && (
                <>
                  <TouchableOpacity onPress={() => sharePhoto(activePhoto)}>
                    <Icon name="share" size={24} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => downloadPhoto(activePhoto)}>
                    <Icon name="download" size={24} color="white" />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          {/* Photo */}
          <View className="flex-1 items-center justify-center">
            {activePhoto && (
              <Image source={{ uri: activePhoto.image_path }} className="w-full h-full" resizeMode="contain" />
            )}
          </View>

          {/* Photo Info */}
          {activePhoto && (activePhoto.title || activePhoto.description || activePhoto.event_date) && (
            <View className="bg-black/80 p-4">
              {activePhoto.title && <Typography className="text-white text-lg font-bold mb-2">{activePhoto.title}</Typography>}
              {activePhoto.description && <Typography className="text-white text-sm mb-2">{activePhoto.description}</Typography>}
              <View className="flex-row items-center justify-between">
                {activePhoto.event_date && (
                  <Typography className="text-white text-xs opacity-80">{formatDateDisplay(activePhoto.event_date)}</Typography>
                )}
                {activePhoto.location && <Typography className="text-white text-xs opacity-80">{activePhoto.location}</Typography>}
              </View>
              {activePhoto.tags && activePhoto.tags.length > 0 && (
                <View className="flex-row flex-wrap mt-2">
                  {activePhoto.tags.map((tag, index) => (
                    <View key={index} className="bg-white/20 rounded-full px-2 py-1 mr-2 mb-1">
                      <Typography className="text-white text-xs">#{tag}</Typography>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      </Modal>


    </ScrollView>
  )
}

export default ActivityGalleryScreen
