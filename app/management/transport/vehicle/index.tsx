"use client"

import { useEffect, useState, useMemo } from "react"
import { View, Text, ScrollView, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import RNPickerSelect from "react-native-picker-select"
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import { cn } from "@/utils/cn"
import { get_vehicle } from "@/service/management/transport"

export default function VehicleManagement() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true)
        const fetchedVehicles = await get_vehicle()
        setVehicles(fetchedVehicles)
      } catch (error) {
        Alert.alert("Error", "Failed to fetch vehicles")
      } finally {
        setLoading(false)
      }
    }
    fetchVehicles()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 "
      case "maintenance":
        return "bg-orange-100 "
      case "out_of_service":
        return "bg-red-100 "
      case "inspection_due":
        return "bg-yellow-100 "
      default:
        return "bg-gray-100 "
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bus":
        return "bg-blue-100 "
      case "van":
        return "bg-purple-100 "
      case "car":
        return "bg-emerald-100 "
      default:
        return "bg-gray-100 "
    }
  }

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const matchesSearch = vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === "all" || vehicle.status === filterStatus
      const matchesType = filterType === "all" || vehicle.type === filterType
      return matchesSearch && matchesStatus && matchesType
    })
  }, [vehicles, searchTerm, filterStatus, filterType])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const isExpiringSoon = (dateString: string, days = 30) => {
    const expiryDate = new Date(dateString)
    const today = new Date()
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= days && diffDays > 0
  }

  const isExpired = (dateString: string) => {
    const expiryDate = new Date(dateString)
    const today = new Date()
    return expiryDate < today
  }

  return (
    <ScrollView
      className="flex-1 bg-white "
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-4 py-6 space-y-6">
        <View>
          <Text className="text-2xl font-bold text-gray-900 ">Vehicle Management</Text>
          <Text className="text-sm mt-1 text-gray-600 ">
            Manage fleet vehicles, maintenance, and documentation
          </Text>
        </View>

        <View className="rounded-lg p-4 border border-gray-200  bg-white  space-y-3">
          <View className="flex-row items-center px-3 rounded-lg border border-gray-300 ">
            <MaterialCommunityIcons name="magnify" size={20} color="#6b7280" />
            <TextInput
              placeholder="Search by registration, make, model..."
              placeholderTextColor="#9ca3af"
              value={searchTerm}
              onChangeText={setSearchTerm}
              className="flex-1 ml-2 py-2 text-sm text-gray-900 "
            />
          </View>

          <View className="flex-row gap-2">
            <View className="flex-1">
              <RNPickerSelect
                items={[
                  { label: "All Status", value: "all" },
                  { label: "Active", value: "active" },
                  { label: "Maintenance", value: "maintenance" },
                  { label: "Out of Service", value: "out_of_service" },
                  { label: "Inspection Due", value: "inspection_due" },
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
                    paddingVertical: 10,
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
                  { label: "Bus", value: "bus" },
                  { label: "Van", value: "van" },
                  { label: "Car", value: "car" },
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
                    paddingVertical: 10,
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
        ) : filteredVehicles.length > 0 ? (
          <FlatList
            scrollEnabled={false}
            data={filteredVehicles}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item: vehicle }) => (
              <View className="mb-4 rounded-lg p-4 border border-gray-200  bg-white ">
                <View className="flex-row items-start justify-between mb-4">
                  <View className="flex-row items-start flex-1">
                    <View className="p-3 bg-blue-500 rounded-lg mr-3">
                      <MaterialCommunityIcons name="truck" size={24} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-900 ">
                        {vehicle.registrationNumber}
                      </Text>
                      <Text className="text-sm mt-1 text-gray-600 ">
                        {vehicle.make} {vehicle.model} ({vehicle.year})
                      </Text>
                      <View className="flex-row gap-2 mt-2">
                        <View className={cn("px-2 py-1 rounded", getStatusColor(vehicle.status))}>
                          <Text className="text-xs font-medium text-gray-800 ">
                            {vehicle?.status?.charAt(0).toUpperCase() + vehicle?.status?.slice(1)}
                          </Text>
                        </View>
                        <View className={cn("px-2 py-1 rounded", getTypeColor(vehicle.type))}>
                          <Text className="text-xs font-medium text-gray-800 ">
                            {vehicle?.type?.charAt(0).toUpperCase() + vehicle?.type?.slice(1)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  {vehicle.gpsEnabled && (
                    <View className="p-2 bg-emerald-100  rounded-lg">
                      <MaterialCommunityIcons name="map-marker" size={16} color="#059669" />
                    </View>
                  )}
                </View>

                <View className="space-y-2 mb-4">
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-600 ">Capacity:</Text>
                    <Text className="text-sm font-medium text-gray-900 ">
                      {vehicle.capacity} passengers
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-600 ">Fuel Efficiency:</Text>
                    <Text className="text-sm font-medium text-gray-900 ">
                      {vehicle.fuelEfficiency} km/l
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-600 ">Last Maintenance:</Text>
                    <Text className="text-sm font-medium text-gray-900 ">
                      {formatDate(vehicle.lastMaintenance)}
                    </Text>
                  </View>
                </View>

                <View className="mb-4">
                  <Text className="text-sm font-medium mb-2 text-gray-900 ">Document Status</Text>
                  <View className="flex-row gap-2">
                    <View className="flex-1 p-2 rounded-lg bg-gray-100 ">
                      <View className="flex-row items-center gap-1">
                        {isExpired(vehicle.insuranceExpiry) ? (
                          <MaterialCommunityIcons name="alert-circle" size={14} color="#ef4444" />
                        ) : isExpiringSoon(vehicle.insuranceExpiry) ? (
                          <MaterialCommunityIcons name="clock-outline" size={14} color="#f97316" />
                        ) : (
                          <MaterialCommunityIcons name="check-circle" size={14} color="#22c55e" />
                        )}
                        <Text className="text-xs text-gray-700 ">Insurance</Text>
                      </View>
                      <Text className="text-xs mt-1 text-gray-600 ">
                        {formatDate(vehicle.insuranceExpiry)}
                      </Text>
                    </View>
                    <View className="flex-1 p-2 rounded-lg bg-gray-100 ">
                      <View className="flex-row items-center gap-1">
                        {isExpired(vehicle.fitnessExpiry) ? (
                          <MaterialCommunityIcons name="alert-circle" size={14} color="#ef4444" />
                        ) : isExpiringSoon(vehicle.fitnessExpiry) ? (
                          <MaterialCommunityIcons name="clock-outline" size={14} color="#f97316" />
                        ) : (
                          <MaterialCommunityIcons name="check-circle" size={14} color="#22c55e" />
                        )}
                        <Text className="text-xs text-gray-700 ">Fitness</Text>
                      </View>
                      <Text className="text-xs mt-1 text-gray-600 ">
                        {formatDate(vehicle.fitnessExpiry)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row gap-2 pt-4 border-t border-gray-200 ">
                  <TouchableOpacity className="flex-1 p-2 rounded-lg border border-gray-300 ">
                    <Text className="text-center text-sm font-medium text-gray-700 ">View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 p-2 rounded-lg border border-gray-300 ">
                    <Text className="text-center text-sm font-medium text-gray-700 ">Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 p-2 rounded-lg border border-red-300 ">
                    <Text className="text-center text-sm font-medium text-red-600 ">Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        ) : (
          <View className="items-center justify-center py-12">
            <MaterialIcons name="folder-open" size={48} color="#d1d5db" />
            <Text className="text-gray-500  mt-2">No vehicles found</Text>
          </View>
        )}

        <View className="flex-row gap-2 mt-4">
          <View className="flex-1 p-3 rounded-lg border border-gray-200  bg-white ">
            <Text className="text-2xl font-bold text-emerald-600">
              {filteredVehicles.filter((v) => v.status === "active").length}
            </Text>
            <Text className="text-xs mt-1 text-gray-600 ">Active Vehicles</Text>
          </View>
          <View className="flex-1 p-3 rounded-lg border border-gray-200  bg-white ">
            <Text className="text-2xl font-bold text-orange-600">
              {filteredVehicles.filter((v) => v.status === "maintenance").length}
            </Text>
            <Text className="text-xs mt-1 text-gray-600 ">In Maintenance</Text>
          </View>
          <View className="flex-1 p-3 rounded-lg border border-gray-200  bg-white ">
            <Text className="text-2xl font-bold text-blue-600">
              {filteredVehicles.reduce((sum, v) => sum + v.capacity, 0)}
            </Text>
            <Text className="text-xs mt-1 text-gray-600 ">Total Capacity</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
