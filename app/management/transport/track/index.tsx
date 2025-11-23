
import { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Link } from "expo-router"

interface VehicleLocation {
  id: string
  registration: string
  driver: string
  route: string
  status: "moving" | "stopped" | "idle" | "emergency" | "offline"
  location: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  speed: number
  heading: number
  studentsOnBoard: number
  maxCapacity: number
  fuelLevel: number
  engineStatus: "on" | "off"
  temperature: number
  lastUpdate: string
  nextStop: string
  eta: string
  distanceToDestination: number
  tripProgress: number
}

export default function GPSTracking() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [loading, setLoading] = useState(false)

  const [vehicleLocations, setVehicleLocations] = useState<VehicleLocation[]>([
    {
      id: "1",
      registration: "TN-01-AB-1234",
      driver: "Rajesh Kumar",
      route: "Route A1",
      status: "moving",
      location: {
        address: "Anna Nagar, Chennai",
        coordinates: { lat: 13.0843, lng: 80.2705 },
      },
      speed: 35,
      heading: 180,
      studentsOnBoard: 28,
      maxCapacity: 35,
      fuelLevel: 75,
      engineStatus: "on",
      temperature: 85,
      lastUpdate: new Date().toISOString(),
      nextStop: "Kilpauk Medical College",
      eta: "8 min",
      distanceToDestination: 2.5,
      tripProgress: 65,
    },
    {
      id: "2",
      registration: "TN-01-AB-5678",
      driver: "Suresh Singh",
      route: "Route B2",
      status: "stopped",
      location: {
        address: "Guindy Metro Station, Chennai",
        coordinates: { lat: 13.0067, lng: 80.2206 },
      },
      speed: 0,
      heading: 90,
      studentsOnBoard: 15,
      maxCapacity: 40,
      fuelLevel: 45,
      engineStatus: "on",
      temperature: 78,
      lastUpdate: new Date().toISOString(),
      nextStop: "Adyar Signal",
      eta: "12 min",
      distanceToDestination: 4.2,
      tripProgress: 40,
    },
    {
      id: "3",
      registration: "TN-01-AB-9012",
      driver: "Vikash Yadav",
      route: "Route C3",
      status: "idle",
      location: {
        address: "Tambaram Railway Station, Chennai",
        coordinates: { lat: 12.9249, lng: 80.1 },
      },
      speed: 0,
      heading: 270,
      studentsOnBoard: 0,
      maxCapacity: 25,
      fuelLevel: 90,
      engineStatus: "off",
      temperature: 65,
      lastUpdate: new Date().toISOString(),
      nextStop: "Chrompet Bus Stand",
      eta: "15 min",
      distanceToDestination: 6.8,
      tripProgress: 0,
    },
    {
      id: "4",
      registration: "TN-01-AB-3456",
      driver: "Amit Sharma",
      route: "Route D4",
      status: "emergency",
      location: {
        address: "OMR, Chennai",
        coordinates: { lat: 12.9716, lng: 80.2431 },
      },
      speed: 0,
      heading: 45,
      studentsOnBoard: 22,
      maxCapacity: 30,
      fuelLevel: 25,
      engineStatus: "on",
      temperature: 95,
      lastUpdate: new Date().toISOString(),
      nextStop: "Emergency Stop",
      eta: "N/A",
      distanceToDestination: 0,
      tripProgress: 50,
    },
  ])

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastRefresh(new Date())
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "moving":
        return "bg-green-100"
      case "stopped":
        return "bg-yellow-100"
      case "idle":
        return "bg-gray-100"
      case "emergency":
        return "bg-red-100"
      case "offline":
        return "bg-red-100"
      default:
        return "bg-gray-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "moving":
        return "run"
      case "stopped":
        return "pause"
      case "idle":
        return "map-marker"
      case "emergency":
        return "alert-triangle"
      case "offline":
        return "wifi-off"
      default:
        return "map-marker"
    }
  }

  const getFuelLevelColor = (level: number) => {
    if (level > 50) return "text-green-600"
    if (level > 25) return "text-yellow-600"
    return "text-red-600"
  }

  const getTemperatureColor = (temp: number) => {
    if (temp > 90) return "text-red-600"
    if (temp > 80) return "text-yellow-600"
    return "text-green-600"
  }

  const filteredVehicles = vehicleLocations.filter((vehicle) => {
    const matchesSearch =
      vehicle.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.location.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || vehicle.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const getTimeSinceUpdate = (dateString: string) => {
    const now = new Date()
    const updateTime = new Date(dateString)
    const diffMinutes = Math.floor((now.getTime() - updateTime.getTime()) / (1000 * 60))

    if (diffMinutes < 1) return "Just now"
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    const diffHours = Math.floor(diffMinutes / 60)
    return `${diffHours}h ${diffMinutes % 60}m ago`
  }

  const renderVehicleCard = ({ item }: { item: VehicleLocation }) => (
    <View
      className={`mx-4 mb-4 p-4 rounded-lg border ${item.status === "emergency" ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"}`}
    >
      {/* Vehicle Header */}
      <View className="flex-row items-start justify-between mb-4">
        <View className="flex-row items-start gap-3 flex-1">
          <View className={`p-3 rounded-lg ${item.status === "emergency" ? "bg-red-500" : "bg-blue-500"}`}>
            <MaterialCommunityIcons name="truck" size={24} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900">{item.registration}</Text>
            <Text className="text-sm text-gray-600 mt-1">
              {item.driver} • {item.route}
            </Text>
            <View className="flex-row items-center gap-2 mt-2">
              <View className={`px-2 py-1 rounded ${getStatusColor(item.status)}`}>
                <View className="flex-row items-center gap-1">
                  <MaterialCommunityIcons name={getStatusIcon(item.status)} size={14} />
                  <Text className="text-xs font-medium capitalize">{item.status}</Text>
                </View>
              </View>
              {item.status === "emergency" && (
                <View className="px-2 py-1 rounded bg-red-100">
                  <Text className="text-xs font-medium text-red-800">EMERGENCY</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-xs text-gray-600">Last Update</Text>
          <Text className="text-sm font-medium text-gray-900">{getTimeSinceUpdate(item.lastUpdate)}</Text>
        </View>
      </View>

      {/* Location & Movement */}
      <View className="mb-4">
        <View className="flex-row items-center gap-2 mb-2">
          <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
          <Text className="text-sm font-medium text-gray-900 flex-1">{item.location.address}</Text>
        </View>
        <View className="flex-row gap-4">
          <View className="flex-row items-center gap-1">
            <MaterialCommunityIcons name="run" size={14} color="#666" />
            <Text className="text-xs text-gray-600">Speed:</Text>
            <Text className="text-xs font-medium text-gray-900">{item.speed} km/h</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <MaterialCommunityIcons name="navigation" size={14} color="#666" />
            <Text className="text-xs text-gray-600">Heading:</Text>
            <Text className="text-xs font-medium text-gray-900">{item.heading}°</Text>
          </View>
        </View>
      </View>

      {/* Students & Capacity */}
      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons name="account-multiple" size={16} color="#666" />
            <Text className="text-sm text-gray-600">Students on Board</Text>
          </View>
          <Text className="text-sm font-medium text-gray-900">
            {item.studentsOnBoard}/{item.maxCapacity}
          </Text>
        </View>
        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <View
            className="h-full bg-blue-500"
            style={{ width: `${(item.studentsOnBoard / item.maxCapacity) * 100}%` }}
          />
        </View>
      </View>

      {/* Vehicle Status Indicators */}
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1 p-3 bg-gray-50 rounded-lg">
          <View className="flex-row items-center gap-1 mb-1">
            <MaterialCommunityIcons name="fuel" size={14} color={getFuelLevelColor(item.fuelLevel)} />
            <Text className="text-xs text-gray-600">Fuel</Text>
          </View>
          <Text className={`text-sm font-medium ${getFuelLevelColor(item.fuelLevel)}`}>{item.fuelLevel}%</Text>
        </View>

        <View className="flex-1 p-3 bg-gray-50 rounded-lg">
          <View className="flex-row items-center gap-1 mb-1">
            <MaterialCommunityIcons name="thermometer" size={14} color={getTemperatureColor(item.temperature)} />
            <Text className="text-xs text-gray-600">Temp</Text>
          </View>
          <Text className={`text-sm font-medium ${getTemperatureColor(item.temperature)}`}>{item.temperature}°C</Text>
        </View>

        <View className="flex-1 p-3 bg-gray-50 rounded-lg">
          <View className="flex-row items-center gap-1 mb-1">
            <MaterialCommunityIcons
              name="lightning-bolt"
              size={14}
              color={item.engineStatus === "on" ? "#16a34a" : "#666"}
            />
            <Text className="text-xs text-gray-600">Engine</Text>
          </View>
          <Text className={`text-sm font-medium ${item.engineStatus === "on" ? "text-green-600" : "text-gray-600"}`}>
            {item.engineStatus.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Trip Progress */}
      {item.status !== "offline" && item.status !== "idle" && (
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm text-gray-600">Trip Progress</Text>
            <Text className="text-sm font-medium text-gray-900">{item.tripProgress}%</Text>
          </View>
          <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <View className="h-full bg-green-500" style={{ width: `${item.tripProgress}%` }} />
          </View>
          <View className="flex-row items-center justify-between mt-2">
            <Text className="text-xs text-gray-600">Next: {item.nextStop}</Text>
            <Text className="text-xs font-medium text-gray-900">ETA: {item.eta}</Text>
          </View>
        </View>
      )}

      {/* Actions */}
      <View className="flex-row gap-2 pt-4 border-t border-gray-200">
        <Link href={`/management/transport/track/${item?.vehicle_id}`} className="flex-1 py-2 px-3 border border-gray-300 rounded-lg items-center">
          <View className="flex-row items-center gap-1">
            <MaterialCommunityIcons name="map-marker" size={14} color="#3b82f6" />
            <Text className="text-xs font-medium text-blue-600">View Map</Text>
          </View>
        </Link>
        <TouchableOpacity className="flex-1 py-2 px-3 border border-gray-300 rounded-lg items-center">
          <View className="flex-row items-center gap-1">
            <MaterialCommunityIcons name="history" size={14} color="#3b82f6" />
            <Text className="text-xs font-medium text-blue-600">History</Text>
          </View>
        </TouchableOpacity>
        {item.status === "emergency" && (
          <TouchableOpacity className="flex-1 py-2 px-3 bg-red-600 rounded-lg items-center">
            <View className="flex-row items-center gap-1">
              <MaterialCommunityIcons name="alert-triangle" size={14} color="white" />
              <Text className="text-xs font-medium text-white">Respond</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 py-6">
          <Text className="text-2xl font-bold text-gray-900">GPS Tracking</Text>
          <Text className="text-gray-600 mt-2">Real-time vehicle location and status monitoring</Text>

          {/* Auto-refresh */}
          <View className="flex-row items-center justify-between mt-4">
            <View className="flex-row items-center gap-2">
              <Text className="text-sm text-gray-600">Auto-refresh:</Text>
              <TouchableOpacity
                className={`p-2 rounded ${autoRefresh ? "bg-green-600" : "bg-gray-300"}`}
                onPress={() => setAutoRefresh(!autoRefresh)}
              >
                <MaterialCommunityIcons name="refresh" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <Text className="text-xs text-gray-600">Last: {lastRefresh.toLocaleTimeString()}</Text>
          </View>
        </View>

        {/* Filters */}
        <View className="mx-4 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <TextInput
            placeholder="Search vehicle, driver, route..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            className="p-3 bg-white border border-gray-300 rounded-lg mb-3 text-gray-900"
            placeholderTextColor="#999"
          />

          <View className="border border-gray-300 rounded-lg overflow-hidden">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {["all", "moving", "stopped", "idle", "emergency", "offline"].map((status) => (
                <TouchableOpacity
                  key={status}
                  className={`px-4 py-2 ${filterStatus === status ? "bg-blue-500" : "bg-white"}`}
                  onPress={() => setFilterStatus(status)}
                >
                  <Text
                    className={`text-xs font-medium capitalize ${filterStatus === status ? "text-white" : "text-gray-900"}`}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Status Summary */}
        <View className="mx-4 mb-4 flex-row gap-2">
          {[
            { status: "moving", color: "bg-green-100", textColor: "text-green-600" },
            { status: "stopped", color: "bg-yellow-100", textColor: "text-yellow-600" },
            { status: "idle", color: "bg-gray-100", textColor: "text-gray-600" },
            { status: "emergency", color: "bg-red-100", textColor: "text-red-600" },
          ].map((item) => (
            <View key={item.status} className={`flex-1 p-3 rounded-lg ${item.color}`}>
              <Text className={`text-lg font-bold ${item.textColor}`}>
                {filteredVehicles.filter((v) => v.status === item.status).length}
              </Text>
              <Text className="text-xs text-gray-600 capitalize">{item.status}</Text>
            </View>
          ))}
        </View>

        {/* Vehicle List */}
        <FlatList
          data={filteredVehicles}
          renderItem={renderVehicleCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </ScrollView>
    </SafeAreaView>
  )
}
