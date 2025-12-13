
import { useEffect, useState, useMemo } from "react"
import { View, Text, ScrollView, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import RNPickerSelect from "react-native-picker-select"
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import { cn } from "@/utils/cn"
import { getAllRoutes } from "@/service/management/transport"
import { Typography } from "@/components/Typography"

export default function RouteManagement() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [transportRoutes, setTransportRoutes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true)
        const fetchedRoutes = await getAllRoutes()
        setTransportRoutes(fetchedRoutes)
      } catch (error) {
        Alert.alert("Error", "Failed to fetch routes")
      } finally {
        setLoading(false)
      }
    }
    fetchRoutes()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 "
      case "inactive":
        return "bg-gray-100 "
      case "maintenance":
        return "bg-orange-100 "
      default:
        return "bg-gray-100 "
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "pickup":
        return "bg-blue-100 "
      case "drop":
        return "bg-purple-100 "
      case "both":
        return "bg-emerald-100 "
      default:
        return "bg-gray-100 "
    }
  }

  const filteredRoutes = useMemo(() => {
    return transportRoutes.filter((route) => {
      const matchesSearch = route.name?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === "all" || route.status === filterStatus
      const matchesType = filterType === "all" || route.type === filterType
      return matchesSearch && matchesStatus && matchesType
    })
  }, [transportRoutes, searchTerm, filterStatus, filterType])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getOccupancyPercentage = (assigned: number, capacity: number) => {
    return Math.round((assigned / capacity) * 100)
  }

  return (
    <ScrollView
      className="flex-1 bg-background "

    >
      <View className="flex-row items-center p-4">
        <TouchableOpacity
          onPress={() => router.push("/management/transport")}
          className="flex-row items-center bg-white border border-border rounded-lg px-3 py-2 mr-2"
        >
          <Typography className="text-primary font-semibold">← Back</Typography>
        </TouchableOpacity>

        <Typography className="text-lg font-bold text-foreground">Routes</Typography>
      </View>
      <View className="px-4  py-6 space-y-6">
        <View>
          <Text className="text-2xl font-bold text-gray-900 ">Route Management</Text>
          <Text className="text-sm mt-1 text-gray-600 ">
            Manage transport routes, stops, and schedules
          </Text>
        </View>

        <View className="mt-3 rounded-lg mb-3 p-4 border border-gray-200  bg-white  space-y-3">
          <View className="flex-row items-center px-3 rounded-lg border border-gray-300 ">
            <MaterialCommunityIcons name="magnify" size={20} color="#6b7280" />
            <TextInput
              placeholder="Search by route name, code..."
              placeholderTextColor="#9ca3af"
              value={searchTerm}
              onChangeText={setSearchTerm}
              className="flex-1 ml-2 py-2 text-sm text-gray-900 "
            />
          </View>

          <View className="flex-row gap-2 mt-3">
            <View className="flex-1">
              <RNPickerSelect
                items={[
                  { label: "All Status", value: "all" },
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                  { label: "Maintenance", value: "maintenance" },
                ]}
                onValueChange={setFilterStatus}
                value={filterStatus}
                style={{
                  inputIOS: {
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    backgroundColor: "#f9fafb",
                    color: "#000",
                    fontSize: 14,
                  },
                  inputAndroid: {
                    paddingVertical: 0,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    backgroundColor: "#f9fafb",
                    color: "#000",
                    fontSize: 14,
                  },
                }}
              />
            </View>
            <View className="flex-1">
              <RNPickerSelect
                items={[
                  { label: "All Types", value: "all" },
                  { label: "Pickup Only", value: "pickup" },
                  { label: "Drop Only", value: "drop" },
                  { label: "Pickup & Drop", value: "both" },
                ]}
                onValueChange={setFilterType}
                value={filterType}
                style={{
                  inputIOS: {
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    backgroundColor: "#f9fafb",
                    color: "#000",
                    fontSize: 14,
                  },
                  inputAndroid: {
                    paddingVertical: 0,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    backgroundColor: "#f9fafb",
                    color: "#000",
                    fontSize: 14,
                  },
                }}
              />
            </View>
          </View>
        </View>

        {loading ? (
          <View className="flex-row items-center justify-center py-12">
            <ActivityIndicator size="large" color="#10b981" />
          </View>
        ) : filteredRoutes.length > 0 ? (
          <FlatList
            scrollEnabled={false}
            data={filteredRoutes}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item: route }) => (
              <View className="mb-4 rounded-lg p-4 border border-gray-200  bg-white ">
                <View className="flex-row items-start justify-between mb-4">
                  <View className="flex-row items-start flex-1">
                    <View className="p-3 bg-purple-500 rounded-lg mr-3">
                      <MaterialCommunityIcons name="map-marker" size={24} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-900 ">{route.name}</Text>
                      <Text className="text-sm mt-1 text-gray-600 ">Code: {route.code}</Text>
                      <View className="flex-row gap-2 mt-2">
                        <View className={cn("px-2 py-1 rounded", getStatusColor(route.status))}>
                          <Text className="text-xs font-medium text-gray-800 ">
                            {route?.status?.charAt(0).toUpperCase() + route?.status?.slice(1)}
                          </Text>
                        </View>
                        <View className={cn("px-2 py-1 rounded", getTypeColor(route.type))}>
                          <Text className="text-xs font-medium text-gray-800 ">
                            {route?.type?.charAt(0).toUpperCase() + route?.type?.slice(1)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-sm font-medium text-gray-900 ">
                      {route.occupancy}/{route.total_capacity}
                    </Text>
                    <View className="w-16 h-2 bg-gray-200  rounded-full mt-1 overflow-hidden">
                      <View
                        className="h-full bg-blue-500"
                        style={{ width: `${getOccupancyPercentage(route.occupancy, route.total_capacity)}%` }}
                      />
                    </View>
                    <Text className="text-xs mt-1 text-gray-600 ">
                      {route.occupancy_percentage}% occupied
                    </Text>
                  </View>
                </View>

                <View className="space-y-2 mb-4">
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-600 ">Distance:</Text>
                    <Text className="text-sm font-medium text-gray-900 ">{route.distance} km</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-600 ">Duration:</Text>
                    <Text className="text-sm font-medium text-gray-900 ">{route.duration} min</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-600 ">Stops:</Text>
                    <Text className="text-sm font-medium text-gray-900 ">
                      {route.route_stops?.length || 0}
                    </Text>
                  </View>
                </View>

                {/* <View className="flex-row gap-2 pt-4 border-t border-gray-200 ">
                  <TouchableOpacity className="flex-1 p-2 rounded-lg border border-gray-300 ">
                    <Text className="text-center text-sm font-medium text-gray-700 ">View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 p-2 rounded-lg border border-gray-300 ">
                    <Text className="text-center text-sm font-medium text-gray-700 ">Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 p-2 rounded-lg border border-blue-300 ">
                    <Text className="text-center text-sm font-medium text-blue-600 ">Track</Text>
                  </TouchableOpacity>
                </View> */}
              </View>
            )}
          />
        ) : (
          <View className="items-center justify-center py-12">
            <MaterialIcons name="folder-open" size={48} color="#d1d5db" />
            <Text className="text-gray-500  mt-2">No routes found</Text>
          </View>
        )}

        <View className="flex-row gap-2 mt-4">
          <View className="flex-1 p-3 rounded-lg border border-gray-200  bg-white ">
            <Text className="text-2xl font-bold text-emerald-600">
              {filteredRoutes.filter((r) => r.status === "active").length}
            </Text>
            <Text className="text-xs mt-1 text-gray-600 ">Active Routes</Text>
          </View>
          <View className="flex-1 p-3 rounded-lg border border-gray-200  bg-white ">
            <Text className="text-2xl font-bold text-blue-600">
              {filteredRoutes.reduce((sum, r) => sum + r.occupancy, 0)}
            </Text>
            <Text className="text-xs mt-1 text-gray-600 ">Students Assigned</Text>
          </View>
          <View className="flex-1 p-3 rounded-lg border border-gray-200  bg-white ">
            <Text className="text-2xl font-bold text-orange-600">
              {Math.round(filteredRoutes.reduce((sum, r) => sum + r.distance, 0))} km
            </Text>
            <Text className="text-xs mt-1 text-gray-600 ">Total Distance</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
