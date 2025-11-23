
import { useEffect, useState, useRef } from "react"
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useLocalSearchParams } from "expo-router"
import * as Location from "expo-location"
import { io, type Socket } from "socket.io-client"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { ApiRoute } from "@/constants/apiRoute"
import { get_access_token } from "@/utils/accessToken"

interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
  speed: number | null
  heading: number | null
  timestamp: number
}

export default function VehicleTracking() {
  const { vehicle_id } = useLocalSearchParams()
  const [vehicleDetails, setVehicleDetails] = useState<any>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null)
  const [locationHistory, setLocationHistory] = useState<LocationData[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(true)
  const [trackingDuration, setTrackingDuration] = useState(0)
  const [totalDistance, setTotalDistance] = useState(0)
  const [mapView, setMapView] = useState<"street" | "satellite">("street")
  const [loading, setLoading] = useState(false)

  const watchIdRef = useRef<Location.LocationSubscription | null>(null)
  const trackingStartTimeRef = useRef<number | null>(null)
  const mapRef = useRef<MapView>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const locationIntervalRef = useRef<NodeJS.Timeout | null>(null)


      const makeConnection =async () => {
      const access_token = await get_access_token() 
      const newSocket = io(ApiRoute.BaseUrl, {
        reconnection: false,
        transports: ["websocket"],
        auth: {
          token: `Bearer ${access_token}`,
          role: "MANAGEMENT",
        },
      })

      newSocket.on("connect", () => {
        console.log("[v0] Connected to server")
        setError(null)
        setIsConnected(true)
      })

      newSocket.on("disconnect", () => {
        console.log("[v0] Disconnected from server")
        setIsConnected(false)
      })

      newSocket.on("connect_error", (error) => {
        console.error("[v0] Connection error:", error)
        setIsConnected(false)
      })

      setSocket(newSocket)
      return () => newSocket.close()
    }

  useEffect(() => {


    makeConnection()
  }, [])

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        setLoading(true)
        // Replace with actual API call
        setVehicleDetails({ vehicle_number: "TN-01-AB-1234" })
      } catch (err) {
        setError("Failed to fetch vehicle details")
      } finally {
        setLoading(false)
      }
    }

    if (vehicle_id) {
      fetchVehicleDetails()
    }
  }, [vehicle_id])

  const sendLocationUpdate = (locationData: LocationData) => {
    if (socket && isConnected && locationData.accuracy < 150) {
      socket.emit("location_update", { ...locationData, vehicle_id }, (data: any) => {
        console.log("[v0] Location update response:", data)
      })
    }
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const startTracking = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        setError("Location permission denied")
        return
      }

      if (!socket || !isConnected) {
        setError("Not connected to server")
        return
      }

      setError(null)
      setIsTracking(true)
      trackingStartTimeRef.current = Date.now()

      socket.emit("tracking_started", {
        vehicle_id,
        latitude: 0,
        longitude: 0,
        accuracy: 0,
        speed: 0,
        heading: 0,
        timestamp: Date.now(),
      })

      watchIdRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 10,
        },
        (location) => {
          const locationData: LocationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy || 0,
            speed: location.coords.speed,
            heading: location.coords.heading,
            timestamp: Date.now(),
          }

          setCurrentLocation(locationData)
          setLocationHistory((prev) => {
            const newHistory = [...prev, locationData]
            if (prev.length > 0) {
              const lastLocation = prev[prev.length - 1]
              const distance = calculateDistance(
                lastLocation.latitude,
                lastLocation.longitude,
                locationData.latitude,
                locationData.longitude,
              )
              setTotalDistance((prevDistance) => prevDistance + distance)
            }
            return newHistory.slice(-100)
          })

          sendLocationUpdate(locationData)
        },
      )

      locationIntervalRef.current = setInterval(() => {
        if (currentLocation) {
          sendLocationUpdate(currentLocation)
        }
      }, 3000)
    } catch (err) {
      setError("Failed to start tracking")
      console.error("[v0] Tracking error:", err)
    }
  }

  const stopTracking = () => {
    if (watchIdRef.current) {
      watchIdRef.current.remove()
      watchIdRef.current = null
    }

    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current)
      locationIntervalRef.current = null
    }

    setIsTracking(false)
    trackingStartTimeRef.current = null
    setTrackingDuration(0)

    if (socket && isConnected) {
      socket.emit("tracking_stopped", { vehicle_id })
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isTracking && trackingStartTimeRef.current) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - trackingStartTimeRef.current!) / 1000)
        setTrackingDuration(elapsed)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTracking])

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatSpeed = (speed: number | null) => {
    if (speed === null) return "N/A"
    return `${Math.round(speed * 3.6)} km/h`
  }

  const centerMapOnLocation = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      })
    }
  }

  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        watchIdRef.current.remove()
      }
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current)
      }
    }
  }, [])

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 py-6">
          <Text className="text-2xl font-bold text-gray-900">Vehicle Tracking</Text>
          <Text className="text-gray-600 mt-2">Real-time location tracking for {vehicleDetails?.vehicle_number}</Text>

          {/* Connection Status */}
          <View className="flex-row items-center gap-2 mt-4">
            {isConnected ? (
              <>
                <MaterialCommunityIcons name="wifi" size={16} color="#16a34a" />
                <Text className="text-sm text-green-600">Connected</Text>
              </>
            ) : (
              <>
                <MaterialCommunityIcons name="wifi-off" size={16} color="#dc2626" />
                <Text className="text-sm text-red-600">Disconnected</Text>
                <TouchableOpacity
                  className="ml-auto px-3 py-1 bg-blue-500 rounded"
                  onPress={makeConnection}
                >
                  <Text className="text-white text-xs font-medium">Retry</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Vehicle Info Card */}
        <View className="mx-4 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Vehicle Information</Text>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-sm text-gray-600">Registration</Text>
              <Text className="font-semibold text-gray-900">{vehicleDetails?.vehicle_number}</Text>
            </View>
          </View>
        </View>

        {/* Tracking Controls */}
        <View className="mx-4 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-2">
              <View className={`w-3 h-3 rounded-full ${isTracking ? "bg-green-500" : "bg-gray-400"}`} />
              <Text className="font-medium text-gray-900">{isTracking ? "Tracking Active" : "Tracking Inactive"}</Text>
            </View>
            {isTracking && (
              <View className="px-3 py-1 bg-green-100 rounded">
                <Text className="text-xs font-medium text-green-800">{formatDuration(trackingDuration)}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            className={`py-3 px-4 rounded-lg ${isTracking ? "bg-red-500" : "bg-green-500"}`}
            onPress={isTracking ? stopTracking : startTracking}
          >
            <Text className="text-white font-semibold text-center">
              {isTracking ? "Stop Tracking" : "Start Tracking"}
            </Text>
          </TouchableOpacity>

          {error && (
            <View className="mt-4 p-3 bg-red-50 rounded-lg flex-row items-center gap-2">
              <MaterialCommunityIcons name="alert-circle" size={16} color="#dc2626" />
              <Text className="text-red-700 text-sm flex-1">{error}</Text>
            </View>
          )}
        </View>

        {/* Location Stats */}
        {currentLocation && (
          <View className="mx-4 mb-4 gap-3">
            <View className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <View className="flex-row items-center gap-2 mb-2">
                <MaterialCommunityIcons name="map-marker" size={20} color="#2563eb" />
                <Text className="text-sm text-gray-600">Current Location</Text>
              </View>
              <Text className="font-mono text-xs text-gray-900">
                {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
              </Text>
            </View>

            <View className="p-4 bg-green-50 rounded-lg border border-green-200">
              <View className="flex-row items-center gap-2 mb-2">
                <MaterialCommunityIcons name="speedometer" size={20} color="#16a34a" />
                <Text className="text-sm text-gray-600">Current Speed</Text>
              </View>
              <Text className="text-lg font-bold text-gray-900">{formatSpeed(currentLocation.speed)}</Text>
            </View>

            <View className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <View className="flex-row items-center gap-2 mb-2">
                <MaterialCommunityIcons name="navigation" size={20} color="#9333ea" />
                <Text className="text-sm text-gray-600">Accuracy</Text>
              </View>
              <Text className="text-lg font-bold text-gray-900">±{Math.round(currentLocation.accuracy)}m</Text>
            </View>
          </View>
        )}

        {/* Map */}
        <View className="mx-4 mb-6 h-96 rounded-lg overflow-hidden border border-gray-200">
          {currentLocation ? (
            <>
              {/* <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                className="flex-1"
                initialRegion={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                  }}
                  title={vehicleDetails?.vehicle_number}
                  description={`Speed: ${formatSpeed(currentLocation.speed)}`}
                />
              </MapView> */}

              <TouchableOpacity
                className="absolute bottom-4 right-4 bg-white p-3 rounded-lg border border-gray-200"
                onPress={centerMapOnLocation}
              >
                <MaterialCommunityIcons name="navigation" size={20} color="#3b82f6" />
              </TouchableOpacity>
            </>
          ) : (
            <View className="flex-1 justify-center items-center bg-gray-100">
              <MaterialCommunityIcons name="map-marker" size={48} color="#d1d5db" />
              <Text className="text-gray-600 mt-4">Start tracking to view live location</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
