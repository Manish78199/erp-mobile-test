
import { useState } from "react"
import { View, Text, ScrollView, FlatList, TouchableOpacity } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import RNPickerSelect from "react-native-picker-select"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { cn } from "@/utils/cn"

export default function TransportDashboard() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState("today")

  const dashboardStats = {
    vehicles: { total: 15, active: 12, maintenance: 2, outOfService: 1 },
    drivers: { total: 18, active: 15, onLeave: 2, suspended: 1 },
    routes: { total: 8, active: 7, inactive: 1 },
    students: { total: 450, transported: 425, pending: 25 },
    fuel: { totalConsumption: 2450, averageEfficiency: 9.2, totalCost: 245000, monthlyBudget: 300000 },
    performance: { onTimePercentage: 94.5, safetyScore: 92.8, customerSatisfaction: 4.6 },
  }

  const recentAlerts = [
    { id: "1", type: "warning", message: "Vehicle TN-01-AB-5678 insurance expires in 15 days", time: "2 hours ago" },
    { id: "2", type: "error", message: "Driver Amit Sharma's license expired yesterday", time: "1 day ago" },
    { id: "3", type: "info", message: "Route RT-C3 maintenance completed successfully", time: "3 hours ago" },
  ]

  const liveVehicles = [
    {
      id: "1",
      registration: "TN-01-AB-1234",
      driver: "Rajesh Kumar",
      route: "Route A1",
      status: "moving",
      location: "Anna Nagar",
      speed: 35,
      studentsOnBoard: 28,
    },
    {
      id: "2",
      registration: "TN-01-AB-5678",
      driver: "Suresh Singh",
      route: "Route B2",
      status: "stopped",
      location: "Guindy Metro Station",
      speed: 0,
      studentsOnBoard: 15,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "moving":
        return "bg-emerald-100 dark:bg-emerald-900"
      case "stopped":
        return "bg-yellow-100 dark:bg-yellow-900"
      default:
        return "bg-gray-100 dark:bg-gray-800"
    }
  }

  const StatCard = ({ icon, title, value, color }: any) => (
    <View className="flex-1 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-xs font-medium text-gray-600 dark:text-gray-400">{title}</Text>
          <Text className="text-xl font-bold mt-1 text-gray-900 dark:text-white">{value}</Text>
        </View>
        <View className={cn("p-2 rounded-lg", color)}>
          <MaterialCommunityIcons name={icon} size={20} color="white" />
        </View>
      </View>
    </View>
  )

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-gray-900"
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-4 py-6 space-y-6">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">Transport Dashboard</Text>
            <Text className="text-sm mt-1 text-gray-600 dark:text-gray-400">Real-time overview of operations</Text>
          </View>
          <RNPickerSelect
            items={[
              { label: "Today", value: "today" },
              { label: "This Week", value: "week" },
              { label: "This Month", value: "month" },
            ]}
            onValueChange={setSelectedPeriod}
            value={selectedPeriod}
            style={{
              inputIOS: {
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: "#e5e7eb",
                backgroundColor: "#f9fafb",
                color: "#000",
                fontSize: 12,
              },
              inputAndroid: {
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: "#e5e7eb",
                backgroundColor: "#f9fafb",
                color: "#000",
                fontSize: 12,
              },
            }}
          />
        </View>

        <View className="space-y-3">
          <View className="flex-row gap-2">
            <StatCard icon="truck" title="Total Vehicles" value={dashboardStats.vehicles.total} color="bg-blue-500" />
            <StatCard
              icon="account-multiple"
              title="Total Drivers"
              value={dashboardStats.drivers.total}
              color="bg-emerald-500"
            />
          </View>
          <View className="flex-row gap-2">
            <StatCard
              icon="map-marker"
              title="Active Routes"
              value={dashboardStats.routes.active}
              color="bg-purple-500"
            />
            <StatCard
              icon="trending-up"
              title="On-Time %"
              value={`${dashboardStats.performance.onTimePercentage}%`}
              color="bg-orange-500"
            />
          </View>
        </View>

        <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">Live Vehicle Status</Text>
            <TouchableOpacity>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <FlatList
            scrollEnabled={false}
            data={liveVehicles}
            keyExtractor={(item) => item.id}
            renderItem={({ item: vehicle }) => (
              <View className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 mb-2">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center flex-1">
                    <View className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-2">
                      <MaterialCommunityIcons name="truck" size={16} color="#2563eb" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-medium text-gray-900 dark:text-white">{vehicle.registration}</Text>
                      <Text className="text-xs text-gray-600 dark:text-gray-400">{vehicle.driver}</Text>
                    </View>
                  </View>
                  <View className={cn("px-2 py-1 rounded", getStatusColor(vehicle.status))}>
                    <Text className="text-xs font-medium text-gray-800 dark:text-gray-200">
                      {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                    </Text>
                  </View>
                </View>
                <View className="flex-row justify-between text-xs">
                  <Text className="text-gray-600 dark:text-gray-400">Location: {vehicle.location}</Text>
                  <Text className="text-gray-600 dark:text-gray-400">Speed: {vehicle.speed} km/h</Text>
                </View>
              </View>
            )}
          />
        </View>

        <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">Recent Alerts</Text>
            <TouchableOpacity>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <FlatList
            scrollEnabled={false}
            data={recentAlerts}
            keyExtractor={(item) => item.id}
            renderItem={({ item: alert }) => (
              <View className="flex-row items-start gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 mb-2">
                <MaterialCommunityIcons
                  name={
                    alert.type === "error"
                      ? "alert-circle"
                      : alert.type === "warning"
                        ? "clock-outline"
                        : "check-circle"
                  }
                  size={16}
                  color={alert.type === "error" ? "#ef4444" : alert.type === "warning" ? "#f97316" : "#3b82f6"}
                />
                <View className="flex-1">
                  <Text className="text-xs text-gray-900 dark:text-white">{alert.message}</Text>
                  <Text className="text-xs mt-1 text-gray-600 dark:text-gray-400">{alert.time}</Text>
                </View>
              </View>
            )}
          />
        </View>

        <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <Text className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Fuel Analytics</Text>
          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-600 dark:text-gray-400">Monthly Consumption</Text>
              <Text className="text-sm font-medium text-gray-900 dark:text-white">
                {dashboardStats.fuel.totalConsumption}L
              </Text>
            </View>
            <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <View
                className="h-full bg-orange-500"
                style={{ width: `${(dashboardStats.fuel.totalConsumption / 3000) * 100}%` }}
              />
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-600 dark:text-gray-400">Average Efficiency</Text>
              <Text className="text-sm font-medium text-gray-900 dark:text-white">
                {dashboardStats.fuel.averageEfficiency} km/l
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-600 dark:text-gray-400">Total Cost</Text>
              <Text className="text-sm font-medium text-gray-900 dark:text-white">
                ₹{dashboardStats.fuel.totalCost.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
