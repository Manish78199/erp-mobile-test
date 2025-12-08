"use client"

import { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, ActivityIndicator, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Link } from "expo-router"
import { get_vehicle } from "@/service/management/transport"

interface VehicleLocation {
  _id: string
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

  const [vehicleLocations, setVehicleLocations] = useState<VehicleLocation[]>([])

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true)
        const fetchedVehicles = await get_vehicle()

        // Map vehicle data to VehicleLocation interface
        const mappedVehicles: VehicleLocation[] = fetchedVehicles.map((vehicle: any, index: number) => ({
          _id: vehicle._id || index.toString(),
          registration: vehicle.registrationNumber || "N/A",
          driver: vehicle.driver || "Unknown",
          route: vehicle.route || "Route Unknown",
          status: getRandomStatus(),
          location: {
            address: vehicle.location || "Unknown Location",
            coordinates: {
              lat: vehicle.latitude || 13.0843,
              lng: vehicle.longitude || 80.2705,
            },
          },
          speed: getRandomSpeed(),
          heading: Math.floor(Math.random() * 360),
          studentsOnBoard: Math.floor(Math.random() * vehicle.capacity),
          maxCapacity: vehicle.capacity || 35,
          fuelLevel: Math.floor(Math.random() * 100),
          engineStatus: Math.random() > 0.3 ? "on" : "off",
          temperature: 65 + Math.floor(Math.random() * 30),
          lastUpdate: new Date().toISOString(),
          nextStop: vehicle.nextStop || "Next Stop",
          eta: Math.floor(Math.random() * 30) + " min",
          distanceToDestination: (Math.random() * 10).toFixed(1),
          tripProgress: Math.floor(Math.random() * 100),
        }))

        setVehicleLocations(mappedVehicles)
      } catch (error) {
        Alert.alert("Error", "Failed to fetch vehicles")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchVehicles()
  }, [])

  // Helper functions for random data
  const getRandomStatus = (): "moving" | "stopped" | "idle" | "emergency" | "offline" => {
    const statuses: ("moving" | "stopped" | "idle" | "emergency" | "offline")[] = [
      "moving",
      "stopped",
      "idle",
      "emergency",
      "offline",
    ]
    return statuses[Math.floor(Math.random() * statuses.length)]
  }

  const getRandomSpeed = () => {
    const speeds = [0, 15, 25, 35, 45, 55]
    return speeds[Math.floor(Math.random() * speeds.length)]
  }

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
        <Link
          href={`/management/transport/track/${item?._id}`}
          className="flex-1 py-2 px-3 border border-gray-300 rounded-lg items-center"
        >
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

        {/* Loading State */}
        {loading ? (
          <View className="flex-row items-center justify-center py-12">
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        ) : (
          <>
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
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}


