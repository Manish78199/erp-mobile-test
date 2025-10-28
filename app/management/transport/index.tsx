
import { useState } from "react"
import { View, Text, ScrollView, FlatList, TouchableOpacity } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import RNPickerSelect from "react-native-picker-select"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { cn } from "@/utils/cn"
import { Typography } from "@/components/Typography"

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
        return "bg-emerald-100 "
      case "stopped":
        return "bg-yellow-100 "
      default:
        return "bg-gray-100 "
    }
  }

  const StatCard = ({ icon, title, value, color }: any) => (
    <View className="flex-1 p-4 rounded-lg border border-gray-200  bg-white ">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Typography className="text-xs font-medium text-gray-600 ">{title}</Typography>
          <Typography className="text-xl font-bold mt-1 text-gray-900 ">{value}</Typography>
        </View>
        <View className={cn("p-2 rounded-lg", color)}>
          <MaterialCommunityIcons name={icon} size={20} color="white" />
        </View>
      </View>
    </View>
  )

  return (
    <ScrollView
      className="flex-1 bg-white "
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-4 py-6 space-y-6">
        <View className="flex-row items-center justify-between">
          <View>
            <Typography className="text-2xl font-bold text-gray-900 ">Transport Dashboard</Typography>
            <Typography className="text-sm mt-1 text-gray-600 ">Real-time overview of operations</Typography>
          </View>

        </View>

        <View className="space-y-3 mt-3 space-x-3">
          <View className="flex-row gap-2">
            <StatCard icon="truck" title="Total Vehicles" value={dashboardStats.vehicles.total} color="bg-blue-500" />
            <StatCard
              icon="account-multiple"
              title="Total Drivers"
              value={dashboardStats.drivers.total}
              color="bg-emerald-500"
            />
          </View>
          <View className="flex-row gap-2 mt-3">
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

        <View className="rounded-lg p-4 mt-3 border border-gray-200  bg-white ">
          <View className="flex-row items-center justify-between mb-4">
            <Typography className="text-lg font-semibold text-gray-900 ">Live Vehicle Status</Typography>
            <TouchableOpacity>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <FlatList
            scrollEnabled={false}
            data={liveVehicles}
            keyExtractor={(item) => item.id}
            renderItem={({ item: vehicle }) => (
              <View className="p-3 rounded-lg bg-gray-100  mb-2">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center flex-1">
                    <View className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-2">
                      <MaterialCommunityIcons name="truck" size={16} color="#2563eb" />
                    </View>
                    <View className="flex-1">
                      <Typography className="font-medium text-gray-900 ">{vehicle.registration}</Typography>
                      <Typography className="text-xs text-gray-600 ">{vehicle.driver}</Typography>
                    </View>
                  </View>
                  <View className={cn("px-2 py-1 rounded", getStatusColor(vehicle.status))}>
                    <Typography className="text-xs font-medium text-gray-800 dark:text-gray-200">
                      {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                    </Typography>
                  </View>
                </View>
                <View className="flex-row justify-between text-xs">
                  <Typography className="text-gray-600 ">Location: {vehicle.location}</Typography>
                  <Typography className="text-gray-600 ">Speed: {vehicle.speed} km/h</Typography>
                </View>
              </View>
            )}
          />
        </View>

        <View className="rounded-lg p-4 mt-3 border border-gray-200  bg-white ">
          <View className="flex-row items-center justify-between mb-4">
            <Typography className="text-lg font-semibold text-gray-900 ">Recent Alerts</Typography>
            <TouchableOpacity>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <FlatList
            scrollEnabled={false}
            data={recentAlerts}
            keyExtractor={(item) => item.id}
            renderItem={({ item: alert }) => (
              <View className="flex-row items-start gap-2 p-2 rounded-lg bg-gray-100  mb-2">
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
                  <Typography className="text-xs text-gray-900 ">{alert.message}</Typography>
                  <Typography className="text-xs mt-1 text-gray-600 ">{alert.time}</Typography>
                </View>
              </View>
            )}
          />
        </View>

        <View className="rounded-lg p-4 mt-3 border border-gray-200  bg-white ">
          <Typography className="text-lg font-semibold mb-4 text-gray-900 ">Fuel Analytics</Typography>
          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Typography className="text-sm text-gray-600 ">Monthly Consumption</Typography>
              <Typography className="text-sm font-medium text-gray-900 ">
                {dashboardStats.fuel.totalConsumption}L
              </Typography>
            </View>
            <View className="h-2 bg-gray-200  rounded-full overflow-hidden">
              <View
                className="h-full bg-orange-500"
                style={{ width: `${(dashboardStats.fuel.totalConsumption / 3000) * 100}%` }}
              />
            </View>
            <View className="flex-row justify-between">
              <Typography className="text-sm text-gray-600 ">Average Efficiency</Typography>
              <Typography className="text-sm font-medium text-gray-900 ">
                {dashboardStats.fuel.averageEfficiency} km/l
              </Typography>
            </View>
            <View className="flex-row justify-between">
              <Typography className="text-sm text-gray-600 ">Total Cost</Typography>
              <Typography className="text-sm font-medium text-gray-900 ">
                ₹{dashboardStats.fuel.totalCost.toLocaleString()}
              </Typography>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
