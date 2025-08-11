
import type React from "react"
import { useState, useEffect } from "react"
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

type FilterType = "ALL" | "SPORTS" | "CULTURAL" | "ACADEMIC" | "SOCIAL"
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
        <Text className="text-white font-bold text-sm">0</Text>
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
  const [filteredActivities, setFilteredActivities] = useState<EventActivity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("ALL")
  const [viewType, setViewType] = useState<ViewType>("MASONRY")

  // Modal states
  const [activePhoto, setActivePhoto] = useState<EventActivity | null>(null)
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
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
      setFilteredActivities(activityData)
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

  // Filter activities
  const filterActivities = async (filterType: FilterType) => {
    // setSelectedFilter(filterType)

    // if (filterType === "ALL") {
    //   setFilteredActivities(activities)
    //   return
    // }

    // try {
    //   // You can either filter locally or fetch from API
    //   const filtered = activities.filter(
    //     (activity) =>
    //       activity.category?.toUpperCase() === filterType || activity.event_type?.toUpperCase() === filterType,
    //   )
    //   setFilteredActivities(filtered)
    // } catch (error) {
    //   console.error("Error filtering activities:", error)
    //   // Fallback to local filtering
    //   const filtered = activities.filter(
    //     (activity) =>
    //       activity.category?.toUpperCase() === filterType || activity.event_type?.toUpperCase() === filterType,
    //   )
    //   setFilteredActivities(filtered)
    // }
  }

  // Handle photo press
  const handlePhotoPress = (photo: EventActivity) => {
    setActivePhoto(photo)
    setShowPhotoModal(true)
  }

  // Handle image load start
  const handleImageLoadStart = (photoId: string) => {
    setImageLoading((prev) => ({ ...prev, [photoId]: true }))
  }

  // Handle image load end
  const handleImageLoadEnd = (photoId: string) => {
    setImageLoading((prev) => ({ ...prev, [photoId]: false }))
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

  // Get statistics
  const getStats = () => {
    const total = activities.length
    const categories = [...new Set(activities.map((a) => a.category || a.event_type).filter(Boolean))]
    const recent = activities.filter((a) => {
      const date = safeParseDateString(a.event_date || a.created_at)
      if (!date) return false
      const daysDiff = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
      return daysDiff <= 30
    }).length

    return { total, categories: categories.length, recent }
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

  useEffect(() => {
    fetchActivities()
  }, [])

  const stats = getStats()
  const filterOptions = [
    { id: "ALL", label: "All Photos", icon: "photo-library", count: activities.length },
    {
      id: "SPORTS",
      label: "Sports",
      icon: "sports",
      count: activities.filter(
        (a) => a.category?.toUpperCase() === "SPORTS" || a.event_type?.toUpperCase() === "SPORTS",
      ).length,
    },
    {
      id: "CULTURAL",
      label: "Cultural",
      icon: "theater-comedy",
      count: activities.filter(
        (a) => a.category?.toUpperCase() === "CULTURAL" || a.event_type?.toUpperCase() === "CULTURAL",
      ).length,
    },
    {
      id: "ACADEMIC",
      label: "Academic",
      icon: "school",
      count: activities.filter(
        (a) => a.category?.toUpperCase() === "ACADEMIC" || a.event_type?.toUpperCase() === "ACADEMIC",
      ).length,
    },
    {
      id: "SOCIAL",
      label: "Social",
      icon: "groups",
      count: activities.filter(
        (a) => a.category?.toUpperCase() === "SOCIAL" || a.event_type?.toUpperCase() === "SOCIAL",
      ).length,
    },
  ]

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
          <Text className="text-xl font-bold text-white">Event Gallery</Text>
        </View>
        <TouchableOpacity className="p-2" onPress={onRefresh}>
          <Icon name="refresh" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Stats Overview */}
      <View className="px-4 -mt-8 mb-5">
        <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
          <Text className="text-lg font-bold text-[#2C3E50] mb-4">Photo Gallery</Text>
          <Text className="text-sm text-[#7F8C8D] mb-4">Your event's photos and memories</Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-[#8B5CF6]">{stats.total}</Text>
              <Text className="text-xs text-[#7F8C8D]">Total Photos</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-[#10B981]">{stats.categories}</Text>
              <Text className="text-xs text-[#7F8C8D]">Categories</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-[#F59E0B]">{stats.recent}</Text>
              <Text className="text-xs text-[#7F8C8D]">Recent</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-[#EF4444]">{filteredActivities.length}</Text>
              <Text className="text-xs text-[#7F8C8D]">Filtered</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Filter and View Controls */}
      <View className="px-4 mb-5">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity
            className="bg-white rounded-xl p-3 shadow-lg elevation-5 flex-row items-center flex-1 mr-3"
            onPress={() => setShowFilterModal(true)}
          >
            <Icon name="filter-list" size={20} color="#8B5CF6" />
            <Text className="text-sm font-semibold text-[#2C3E50] ml-2">
              {filterOptions.find((f) => f.id === selectedFilter)?.label || "All Photos"}
            </Text>
            <View className="ml-auto">
              <Icon name="expand-more" size={20} color="#7F8C8D" />
            </View>
          </TouchableOpacity>

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
            <Text className="text-lg font-semibold text-[#2C3E50] mt-4">Loading Photos...</Text>
            <Text className="text-sm text-[#7F8C8D] mt-2 text-center">
              Please wait while we fetch your activity photos
            </Text>
          </View>
        </View>
      )}

      {/* Photo Gallery */}
      {!isLoading && (
        <View className="px-4">
          {filteredActivities.length > 0 ? (
            <View>
              {viewType === "MASONRY" ? (
                // Masonry Layout
                <View className="flex-row justify-between">
                  <View className="flex-1 mr-2">
                    {filteredActivities
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
                                  <Text className="text-white text-xs font-semibold" numberOfLines={1}>
                                    {photo.title}
                                  </Text>
                                  {photo.event_date && (
                                    <Text className="text-white text-xs opacity-80">
                                      {formatDateDisplay(photo.event_date)}
                                    </Text>
                                  )}
                                </View>
                              )}
                            </View>
                          </TouchableOpacity>
                        )
                      })}
                  </View>
                  <View className="flex-1 ml-2">
                    {filteredActivities
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
                                  <Text className="text-white text-xs font-semibold" numberOfLines={1}>
                                    {photo.title}
                                  </Text>
                                  {photo.event_date && (
                                    <Text className="text-white text-xs opacity-80">
                                      {formatDateDisplay(photo.event_date)}
                                    </Text>
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
                  {filteredActivities.map((photo) => (
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
                            <Text className="text-white text-xs font-semibold" numberOfLines={1}>
                              {photo.title}
                            </Text>
                            {photo.event_date && (
                              <Text className="text-white text-xs opacity-80">
                                {formatDateDisplay(photo.event_date)}
                              </Text>
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
              <Text className="text-lg font-bold text-[#2C3E50] mt-4 mb-2">No Photos Found</Text>
              <Text className="text-sm text-[#7F8C8D] text-center mb-4">
                {selectedFilter === "ALL"
                  ? "No activity photos are available at the moment."
                  : `No photos found for ${filterOptions.find((f) => f.id === selectedFilter)?.label.toLowerCase()}.`}
              </Text>
              {selectedFilter !== "ALL" && (
                <TouchableOpacity className="bg-[#8B5CF6] px-6 py-3 rounded-xl" onPress={() => filterActivities("ALL")}>
                  <Text className="text-white font-semibold">View All Photos</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[25px] p-5 max-h-[60%]">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-xl font-bold text-[#2C3E50]">Filter Photos</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Icon name="close" size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {filterOptions.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  className={`p-4 rounded-xl mb-3 flex-row items-center justify-between ${
                    selectedFilter === filter.id ? "bg-[#8B5CF6]" : "bg-[#F8F9FA]"
                  }`}
                  onPress={() => {
                    filterActivities(filter.id as FilterType)
                    setShowFilterModal(false)
                  }}
                >
                  <View className="flex-row items-center">
                    <Icon name={filter.icon} size={20} color={selectedFilter === filter.id ? "white" : "#8B5CF6"} />
                    <Text
                      className={`text-base font-semibold ml-3 ${
                        selectedFilter === filter.id ? "text-white" : "text-[#2C3E50]"
                      }`}
                    >
                      {filter.label}
                    </Text>
                  </View>
                  <View
                    className={`px-2 py-1 rounded-lg ${
                      selectedFilter === filter.id ? "bg-white/20" : "bg-[#8B5CF6]/20"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${selectedFilter === filter.id ? "text-white" : "text-[#8B5CF6]"}`}
                    >
                      {filter.count}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

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
              {activePhoto.title && <Text className="text-white text-lg font-bold mb-2">{activePhoto.title}</Text>}
              {activePhoto.description && <Text className="text-white text-sm mb-2">{activePhoto.description}</Text>}
              <View className="flex-row items-center justify-between">
                {activePhoto.event_date && (
                  <Text className="text-white text-xs opacity-80">{formatDateDisplay(activePhoto.event_date)}</Text>
                )}
                {activePhoto.location && <Text className="text-white text-xs opacity-80">{activePhoto.location}</Text>}
              </View>
              {activePhoto.tags && activePhoto.tags.length > 0 && (
                <View className="flex-row flex-wrap mt-2">
                  {activePhoto.tags.map((tag, index) => (
                    <View key={index} className="bg-white/20 rounded-full px-2 py-1 mr-2 mb-1">
                      <Text className="text-white text-xs">#{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      </Modal>

      {/* Photo Tips */}
      {filteredActivities.length > 0 && (
        <View className="mx-4 mt-6 mb-8 bg-white rounded-2xl p-4 shadow-lg elevation-5">
          <Text className="text-lg font-bold text-[#2C3E50] mb-3 flex-row items-center">
            <Icon name="info" size={20} color="#8B5CF6" />
            <Text className="ml-2">Photo Gallery Tips</Text>
          </Text>
          <View className="gap-2">
            <View className="flex-row items-center">
              <Icon name="touch-app" size={16} color="#10B981" />
              <Text className="text-sm text-[#7F8C8D] ml-2">Tap any photo to view in full screen</Text>
            </View>
            <View className="flex-row items-center">
              <Icon name="share" size={16} color="#3B82F6" />
              <Text className="text-sm text-[#7F8C8D] ml-2">Share photos with friends and family</Text>
            </View>
            <View className="flex-row items-center">
              <Icon name="download" size={16} color="#F59E0B" />
              <Text className="text-sm text-[#7F8C8D] ml-2">Download photos to your device</Text>
            </View>
            <View className="flex-row items-center">
              <Icon name="filter-list" size={16} color="#8B5CF6" />
              <Text className="text-sm text-[#7F8C8D] ml-2">Use filters to find specific event photos</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  )
}

export default ActivityGalleryScreen
