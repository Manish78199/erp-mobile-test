// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native"
// import Icon from "react-native-vector-icons/MaterialIcons"
// import { Link } from "expo-router"

// const { width } = Dimensions.get("window")

// const TransportScreen: React.FC = () => {
//   const [isTracking, setIsTracking] = useState(false)
//   const [currentLocation, setCurrentLocation] = useState({ latitude: 28.6345, longitude: 77.2023 })
//   const [lastUpdated, setLastUpdated] = useState(new Date())

//   const transportData = {
//     vehicle: {
//       number: "DL-8C-1234",
//       type: "School Bus",
//       route: "Route 15A",
//       driver: "Mr. Rajesh Kumar",
//       contact: "+91 98765 43210",
//       capacity: 45,
//       currentOccupancy: 32,
//       model: "Tata LP 909",
//       year: "2020",
//       fuelType: "Diesel",
//       insurance: "Valid till March 2025",
//       fitness: "Valid till June 2025",
//       lastService: "2024-11-15",
//       nextService: "2025-02-15",
//     },
//     route: {
//       totalDistance: "12.5 km",
//       estimatedTime: "35 minutes",
//       stops: [
//         {
//           name: "Main Gate",
//           time: "07:30 AM",
//           status: "completed",
//           coordinates: { latitude: 28.6139, longitude: 77.209 },
//           studentsCount: 8,
//         },
//         {
//           name: "City Center",
//           time: "07:45 AM",
//           status: "completed",
//           coordinates: { latitude: 28.6289, longitude: 77.2065 },
//           studentsCount: 12,
//         },
//         {
//           name: "Park Avenue",
//           time: "08:00 AM",
//           status: "current",
//           coordinates: { latitude: 28.6345, longitude: 77.2023 },
//           studentsCount: 7,
//         },
//         {
//           name: "Green Valley",
//           time: "08:08 AM",
//           status: "upcoming",
//           coordinates: { latitude: 28.6401, longitude: 77.1987 },
//           studentsCount: 5,
//         },
//         {
//           name: "School",
//           time: "08:15 AM",
//           status: "upcoming",
//           coordinates: { latitude: 28.6456, longitude: 77.1945 },
//           studentsCount: 0,
//         },
//       ],
//     },
//     tracking: {
//       currentLocation: "Park Avenue",
//       estimatedArrival: "8 minutes",
//       speed: "25 km/h",
//       lastUpdated: "2 minutes ago",
//       coordinates: { latitude: 28.6345, longitude: 77.2023 },
//       nextStop: "Green Valley",
//       distanceToNextStop: "1.2 km",
//     },
//   }

//   // Simulate live tracking updates
//   useEffect(() => {
//     let interval: NodeJS.Timeout
//     if (isTracking) {
//       interval = setInterval(() => {
//         // Simulate movement along the route
//         setCurrentLocation((prev) => ({
//           latitude: prev.latitude + (Math.random() - 0.5) * 0.0005,
//           longitude: prev.longitude + (Math.random() - 0.5) * 0.0005,
//         }))
//         setLastUpdated(new Date())
//       }, 3000) // Update every 3 seconds
//     }
//     return () => {
//       if (interval) clearInterval(interval)
//     }
//   }, [isTracking])

//   const getStopStatusColor = (status: string) => {
//     switch (status) {
//       case "completed":
//         return "#2ECC71"
//       case "current":
//         return "#F39C12"
//       case "upcoming":
//         return "#BDC3C7"
//       default:
//         return "#BDC3C7"
//     }
//   }

//   const getStopStatusIcon = (status: string) => {
//     switch (status) {
//       case "completed":
//         return "check-circle"
//       case "current":
//         return "location-on"
//       case "upcoming":
//         return "schedule"
//       default:
//         return "help"
//     }
//   }

//   const formatLastUpdated = (date: Date) => {
//     const now = new Date()
//     const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

//     if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
//     if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
//     return `${Math.floor(diffInSeconds / 3600)} hours ago`
//   }

//   // Calculate relative positions for map visualization
//   const getRelativePosition = (coordinates: { latitude: number; longitude: number }) => {
//     const minLat = Math.min(...transportData.route.stops.map((s) => s.coordinates.latitude))
//     const maxLat = Math.max(...transportData.route.stops.map((s) => s.coordinates.latitude))
//     const minLng = Math.min(...transportData.route.stops.map((s) => s.coordinates.longitude))
//     const maxLng = Math.max(...transportData.route.stops.map((s) => s.coordinates.longitude))

//     const x = ((coordinates.longitude - minLng) / (maxLng - minLng)) * 0.8 + 0.1
//     const y = ((maxLat - coordinates.latitude) / (maxLat - minLat)) * 0.8 + 0.1

//     return { x: x * 100, y: y * 100 }
//   }

//   return (
//     <ScrollView className="flex-1 bg-[#F0F4F8]" showsVerticalScrollIndicator={false}>
//       {/* Header */}
//       <View className="flex-row items-center justify-between bg-[#6A5ACD] pt-12 pb-5 px-4 rounded-b-[25px]">
//         <Link href="/student" asChild>
//           <TouchableOpacity className="p-2">
//             <Icon name="arrow-back" size={24} color="white" />
//           </TouchableOpacity>
//         </Link>
//         <View className="flex-1 items-center">
//           <Text className="text-xl font-bold text-white">Transport Tracking</Text>
//         </View>
//         <TouchableOpacity className="p-2">
//           <Icon name="refresh" size={20} color="white" />
//         </TouchableOpacity>
//       </View>

//       {/* Live Map Section */}
//       <View className="px-4 -mt-8 mb-5">
//         <View className="bg-white rounded-2xl shadow-lg elevation-5 overflow-hidden">
//           {/* Map Header */}
//           <View className="flex-row justify-between items-center p-4 bg-[#6A5ACD10]">
//             <Text className="text-lg font-bold text-[#2C3E50]">Live Location</Text>
//             <TouchableOpacity
//               className={`px-4 py-2 rounded-xl ${isTracking ? "bg-[#E74C3C]" : "bg-[#2ECC71]"}`}
//               onPress={() => setIsTracking(!isTracking)}
//             >
//               <Text className="text-sm font-semibold text-white">
//                 {isTracking ? "Stop Tracking" : "Start Tracking"}
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* Custom Map Visualization */}
//           <View className="h-80 bg-[#E8F4FD] relative overflow-hidden">
//             {/* Map Grid Background */}
//             <View className="absolute inset-0 opacity-10">
//               {Array.from({ length: 12 }).map((_, i) => (
//                 <View key={`h-${i}`} className="absolute w-full h-px bg-[#BDC3C7]" style={{ top: `${i * 8.33}%` }} />
//               ))}
//               {Array.from({ length: 8 }).map((_, i) => (
//                 <View key={`v-${i}`} className="absolute h-full w-px bg-[#BDC3C7]" style={{ left: `${i * 12.5}%` }} />
//               ))}
//             </View>

//             {/* Route Path */}
//             <View className="absolute inset-0">
//               {transportData.route.stops.map((stop, index) => {
//                 if (index === transportData.route.stops.length - 1) return null
//                 const currentPos = getRelativePosition(stop.coordinates)
//                 const nextPos = getRelativePosition(transportData.route.stops[index + 1].coordinates)

//                 const distance = Math.sqrt(
//                   Math.pow(nextPos.x - currentPos.x, 2) + Math.pow(nextPos.y - currentPos.y, 2),
//                 )
//                 const angle = (Math.atan2(nextPos.y - currentPos.y, nextPos.x - currentPos.x) * 180) / Math.PI

//                 return (
//                   <View
//                     key={`path-${index}`}
//                     className="absolute h-1 bg-[#6A5ACD] opacity-60 rounded-full"
//                     style={{
//                       left: `${currentPos.x}%`,
//                       top: `${currentPos.y}%`,
//                       width: `${distance}%`,
//                       transform: [{ rotate: `${angle}deg` }],
//                       transformOrigin: "0 50%",
//                     }}
//                   />
//                 )
//               })}
//             </View>

//             {/* Stop Markers */}
//             {transportData.route.stops.map((stop, index) => {
//               const position = getRelativePosition(stop.coordinates)
//               return (
//                 <View
//                   key={`stop-${index}`}
//                   className="absolute"
//                   style={{
//                     left: `${position.x}%`,
//                     top: `${position.y}%`,
//                     transform: [{ translateX: -12 }, { translateY: -12 }],
//                   }}
//                 >
//                   <View
//                     className="w-6 h-6 rounded-full items-center justify-center border-2 border-white shadow-md"
//                     style={{ backgroundColor: getStopStatusColor(stop.status) }}
//                   >
//                     <Icon name={getStopStatusIcon(stop.status)} size={12} color="white" />
//                   </View>
//                   <View className="absolute -bottom-6 -left-8 w-16">
//                     <Text className="text-[8px] text-[#2C3E50] text-center font-semibold" numberOfLines={1}>
//                       {stop.name}
//                     </Text>
//                   </View>
//                 </View>
//               )
//             })}

//             {/* Bus Marker */}
//             <View
//               className="absolute"
//               style={{
//                 left: `${getRelativePosition(currentLocation).x}%`,
//                 top: `${getRelativePosition(currentLocation).y}%`,
//                 transform: [{ translateX: -20 }, { translateY: -20 }],
//               }}
//             >
//               <View className="w-10 h-10 bg-[#F39C12] rounded-full items-center justify-center border-3 border-white shadow-lg">
//                 <Icon name="directions-bus" size={20} color="white" />
//                 {isTracking && (
//                   <View className="absolute -top-1 -right-1 w-4 h-4 bg-[#2ECC71] rounded-full items-center justify-center">
//                     <View className="w-2 h-2 bg-white rounded-full animate-pulse" />
//                   </View>
//                 )}
//               </View>
//               <View className="absolute -bottom-6 -left-6 w-12">
//                 <Text className="text-[8px] text-[#F39C12] text-center font-bold">BUS</Text>
//               </View>
//             </View>

//             {/* Map Legend */}
//             <View className="absolute bottom-4 left-4 bg-white/90 rounded-lg p-2">
//               <View className="flex-row items-center mb-1">
//                 <View className="w-3 h-3 bg-[#2ECC71] rounded-full mr-2" />
//                 <Text className="text-[10px] text-[#2C3E50]">Completed</Text>
//               </View>
//               <View className="flex-row items-center mb-1">
//                 <View className="w-3 h-3 bg-[#F39C12] rounded-full mr-2" />
//                 <Text className="text-[10px] text-[#2C3E50]">Current</Text>
//               </View>
//               <View className="flex-row items-center">
//                 <View className="w-3 h-3 bg-[#BDC3C7] rounded-full mr-2" />
//                 <Text className="text-[10px] text-[#2C3E50]">Upcoming</Text>
//               </View>
//             </View>

//             {/* Map Controls */}
//             <View className="absolute bottom-4 right-4 flex-col gap-2">
//               <TouchableOpacity className="w-8 h-8 bg-white rounded-lg items-center justify-center shadow-md">
//                 <Icon name="add" size={16} color="#2C3E50" />
//               </TouchableOpacity>
//               <TouchableOpacity className="w-8 h-8 bg-white rounded-lg items-center justify-center shadow-md">
//                 <Icon name="remove" size={16} color="#2C3E50" />
//               </TouchableOpacity>
//               <TouchableOpacity className="w-8 h-8 bg-white rounded-lg items-center justify-center shadow-md">
//                 <Icon name="my-location" size={16} color="#6A5ACD" />
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Live Tracking Info */}
//           {isTracking && (
//             <View className="p-4 bg-[#2ECC7110] border-t border-[#2ECC7130]">
//               <View className="flex-row items-center justify-between mb-2">
//                 <View className="flex-row items-center">
//                   <View className="w-3 h-3 bg-[#2ECC71] rounded-full mr-2">
//                     <View className="w-3 h-3 bg-[#2ECC71] rounded-full animate-pulse" />
//                   </View>
//                   <Text className="text-sm font-semibold text-[#2C3E50]">
//                     Live at {transportData.tracking.currentLocation}
//                   </Text>
//                 </View>
//                 <Text className="text-xs text-[#7F8C8D]">Updated {formatLastUpdated(lastUpdated)}</Text>
//               </View>
//               <View className="flex-row justify-between">
//                 <Text className="text-xs text-[#7F8C8D]">
//                   Next: {transportData.tracking.nextStop} ({transportData.tracking.distanceToNextStop})
//                 </Text>
//                 <Text className="text-xs text-[#7F8C8D]">Speed: {transportData.tracking.speed}</Text>
//                 <Text className="text-xs text-[#7F8C8D]">ETA: {transportData.tracking.estimatedArrival}</Text>
//               </View>
//             </View>
//           )}
//         </View>
//       </View>

//       {/* Vehicle Details */}
//       <View className="px-4 mb-5">
//         <Text className="text-xl font-bold text-[#2C3E50] mb-4">Vehicle Information</Text>
//         <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
//           {/* Vehicle Header */}
//           <View className="flex-row items-center justify-between mb-4">
//             <View className="flex-row items-center">
//               <View className="w-16 h-16 bg-[#6A5ACD20] rounded-2xl items-center justify-center mr-4">
//                 <Icon name="directions-bus" size={32} color="#6A5ACD" />
//               </View>
//               <View>
//                 <Text className="text-lg font-bold text-[#2C3E50]">{transportData.vehicle.number}</Text>
//                 <Text className="text-sm text-[#7F8C8D]">{transportData.vehicle.route}</Text>
//                 <Text className="text-xs text-[#6A5ACD] font-semibold">{transportData.vehicle.type}</Text>
//               </View>
//             </View>
//             <View className="items-end">
//               <Text className="text-2xl font-bold text-[#2ECC71]">
//                 {transportData.vehicle.currentOccupancy}/{transportData.vehicle.capacity}
//               </Text>
//               <Text className="text-xs text-[#7F8C8D]">Occupancy</Text>
//             </View>
//           </View>

//           {/* Vehicle Specs */}
//           <View className="bg-[#F8F9FA] rounded-xl p-3 mb-4">
//             <Text className="text-sm font-semibold text-[#2C3E50] mb-3">Vehicle Specifications</Text>
//             <View className="flex-row flex-wrap">
//               <View className="w-1/2 mb-2">
//                 <Text className="text-xs text-[#7F8C8D]">Model</Text>
//                 <Text className="text-sm font-semibold text-[#2C3E50]">{transportData.vehicle.model}</Text>
//               </View>
//               <View className="w-1/2 mb-2">
//                 <Text className="text-xs text-[#7F8C8D]">Year</Text>
//                 <Text className="text-sm font-semibold text-[#2C3E50]">{transportData.vehicle.year}</Text>
//               </View>
//               <View className="w-1/2 mb-2">
//                 <Text className="text-xs text-[#7F8C8D]">Fuel Type</Text>
//                 <Text className="text-sm font-semibold text-[#2C3E50]">{transportData.vehicle.fuelType}</Text>
//               </View>
//               <View className="w-1/2 mb-2">
//                 <Text className="text-xs text-[#7F8C8D]">Capacity</Text>
//                 <Text className="text-sm font-semibold text-[#2C3E50]">{transportData.vehicle.capacity} seats</Text>
//               </View>
//             </View>
//           </View>

//           {/* Compliance Status */}
//           <View className="bg-[#F8F9FA] rounded-xl p-3">
//             <Text className="text-sm font-semibold text-[#2C3E50] mb-3">Compliance & Maintenance</Text>
//             <View className="gap-2">
//               <View className="flex-row items-center justify-between">
//                 <View className="flex-row items-center">
//                   <Icon name="verified" size={16} color="#2ECC71" />
//                   <Text className="text-sm text-[#2C3E50] ml-2">Insurance</Text>
//                 </View>
//                 <Text className="text-xs text-[#2ECC71] font-semibold">{transportData.vehicle.insurance}</Text>
//               </View>
//               <View className="flex-row items-center justify-between">
//                 <View className="flex-row items-center">
//                   <Icon name="verified" size={16} color="#2ECC71" />
//                   <Text className="text-sm text-[#2C3E50] ml-2">Fitness Certificate</Text>
//                 </View>
//                 <Text className="text-xs text-[#2ECC71] font-semibold">{transportData.vehicle.fitness}</Text>
//               </View>
//               <View className="flex-row items-center justify-between">
//                 <View className="flex-row items-center">
//                   <Icon name="build" size={16} color="#F39C12" />
//                   <Text className="text-sm text-[#2C3E50] ml-2">Last Service</Text>
//                 </View>
//                 <Text className="text-xs text-[#7F8C8D]">{transportData.vehicle.lastService}</Text>
//               </View>
//               <View className="flex-row items-center justify-between">
//                 <View className="flex-row items-center">
//                   <Icon name="schedule" size={16} color="#6A5ACD" />
//                   <Text className="text-sm text-[#2C3E50] ml-2">Next Service</Text>
//                 </View>
//                 <Text className="text-xs text-[#6A5ACD] font-semibold">{transportData.vehicle.nextService}</Text>
//               </View>
//             </View>
//           </View>
//         </View>
//       </View>

//       {/* Route Information */}
//       <View className="px-4 mb-5">
//         <Text className="text-xl font-bold text-[#2C3E50] mb-4">Route Details</Text>
//         <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
//           {/* Route Summary */}
//           <View className="flex-row justify-between items-center mb-4 p-3 bg-[#6A5ACD10] rounded-xl">
//             <View className="items-center">
//               <Icon name="straighten" size={24} color="#6A5ACD" />
//               <Text className="text-lg font-bold text-[#2C3E50] mt-1">{transportData.route.totalDistance}</Text>
//               <Text className="text-xs text-[#7F8C8D]">Total Distance</Text>
//             </View>
//             <View className="items-center">
//               <Icon name="access-time" size={24} color="#00BCD4" />
//               <Text className="text-lg font-bold text-[#2C3E50] mt-1">{transportData.route.estimatedTime}</Text>
//               <Text className="text-xs text-[#7F8C8D]">Est. Time</Text>
//             </View>
//             <View className="items-center">
//               <Icon name="location-on" size={24} color="#2ECC71" />
//               <Text className="text-lg font-bold text-[#2C3E50] mt-1">{transportData.route.stops.length}</Text>
//               <Text className="text-xs text-[#7F8C8D]">Total Stops</Text>
//             </View>
//           </View>

//           {/* Stops List */}
//           {transportData.route.stops.map((stop, index) => (
//             <View key={index} className="flex-row items-center mb-4 last:mb-0">
//               <View
//                 className="w-12 h-12 rounded-full items-center justify-center mr-4"
//                 style={{ backgroundColor: `${getStopStatusColor(stop.status)}20` }}
//               >
//                 <Icon name={getStopStatusIcon(stop.status)} size={20} color={getStopStatusColor(stop.status)} />
//               </View>
//               <View className="flex-1">
//                 <View className="flex-row items-center justify-between mb-1">
//                   <Text className="text-base font-semibold text-[#2C3E50]">{stop.name}</Text>
//                   <Text className="text-sm font-semibold text-[#6A5ACD]">{stop.time}</Text>
//                 </View>
//                 <View className="flex-row items-center justify-between">
//                   <View
//                     className="px-2 py-1 rounded-lg"
//                     style={{ backgroundColor: `${getStopStatusColor(stop.status)}20` }}
//                   >
//                     <Text className="text-[10px] font-bold" style={{ color: getStopStatusColor(stop.status) }}>
//                       {stop.status.toUpperCase()}
//                     </Text>
//                   </View>
//                   <Text className="text-xs text-[#7F8C8D]">
//                     {stop.studentsCount > 0 ? `${stop.studentsCount} students` : "Destination"}
//                   </Text>
//                 </View>
//               </View>
//               {index < transportData.route.stops.length - 1 && (
//                 <View className="absolute left-6 top-12 w-0.5 h-6 bg-[#DDE4EB]" />
//               )}
//             </View>
//           ))}
//         </View>
//       </View>

//       {/* Driver Contact */}
//       <View className="px-4 mb-5">
//         <Text className="text-xl font-bold text-[#2C3E50] mb-4">Driver Information</Text>
//         <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
//           <View className="flex-row items-center justify-between">
//             <View className="flex-row items-center flex-1">
//               <View className="w-16 h-16 rounded-full bg-[#6A5ACD20] items-center justify-center mr-4">
//                 <Icon name="person" size={28} color="#6A5ACD" />
//               </View>
//               <View className="flex-1">
//                 <Text className="text-lg font-semibold text-[#2C3E50]">{transportData.vehicle.driver}</Text>
//                 <Text className="text-sm text-[#7F8C8D] mb-1">{transportData.vehicle.contact}</Text>
//                 <View className="flex-row items-center">
//                   <Icon name="star" size={14} color="#F39C12" />
//                   <Icon name="star" size={14} color="#F39C12" />
//                   <Icon name="star" size={14} color="#F39C12" />
//                   <Icon name="star" size={14} color="#F39C12" />
//                   <Icon name="star" size={14} color="#F39C12" />
//                   <Text className="text-xs text-[#7F8C8D] ml-2">5.0 Rating</Text>
//                 </View>
//               </View>
//             </View>
//             <View className="flex-row gap-2">
//               <TouchableOpacity className="bg-[#2ECC71] p-3 rounded-xl">
//                 <Icon name="phone" size={20} color="white" />
//               </TouchableOpacity>
//               <TouchableOpacity className="bg-[#00BCD4] p-3 rounded-xl">
//                 <Icon name="message" size={20} color="white" />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </View>

//       {/* Emergency Contacts */}
//       <View className="px-4 pb-8">
//         <Text className="text-xl font-bold text-[#2C3E50] mb-4">Emergency Contacts</Text>
//         <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
//           <View className="flex-row justify-between mb-3">
//             <View className="flex-row items-center flex-1">
//               <Icon name="local-hospital" size={20} color="#E74C3C" />
//               <Text className="text-sm font-semibold text-[#2C3E50] ml-2">School Office</Text>
//             </View>
//             <TouchableOpacity className="bg-[#E74C3C] px-4 py-2 rounded-lg">
//               <Text className="text-xs font-semibold text-white">Call Now</Text>
//             </TouchableOpacity>
//           </View>
//           <View className="flex-row justify-between">
//             <View className="flex-row items-center flex-1">
//               <Icon name="security" size={20} color="#F39C12" />
//               <Text className="text-sm font-semibold text-[#2C3E50] ml-2">Transport Coordinator</Text>
//             </View>
//             <TouchableOpacity className="bg-[#F39C12] px-4 py-2 rounded-lg">
//               <Text className="text-xs font-semibold text-white">Call Now</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   )
// }

// export default TransportScreen



import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Linking,
} from "react-native"
import { WebView } from "react-native-webview"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useRouter } from "expo-router"
import { get_trasnport_details } from "@/service/student/transport"
import type { TransportDetails, Position, TRACK_DATA } from "@/types/transport"
import { get_access_token } from "@/utils/accessToken"

import { io, Socket } from "socket.io-client"
const { width, height } = Dimensions.get("window")

const TransportScreen: React.FC = () => {
  const router = useRouter()
  const [transport, setTransport] = useState<TransportDetails | null>(null)
  const [position, setPosition] = useState<Position>({
    latitude: 0,
    longitude: 0,
    speed: 0,
    timestamp: 0,
  })
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [isTracking, setIsTracking] = useState(false)
  const [trackVehicleId, setTrackVehicleId] = useState<string | null>(null)
  const trackVehicleIdRef = useRef<string | null>(null)
  const [isConnected, setIsConnected] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mapView, setMapView] = useState<"street" | "satellite" | "hybrid">("street")
  const [socket, setSocket] = useState<Socket | null>(null)

  // Fetch transport data
  const fetchTransportData = async (showLoader = true) => {
    if (showLoader) setLoading(true)
    setError(null)

    try {
      const res = await get_trasnport_details()
      setTransport(res)
      setPosition({
        latitude: res?.vehicle_details?.latitude || 0,
        longitude: res?.vehicle_details?.longitude || 0,
        speed: res?.vehicle_details?.speed || 0,
        timestamp: res?.vehicle_details?.timestamp || 0,
      })

      const vehicleId = res?.vehicle_id
      setTrackVehicleId(vehicleId)
      trackVehicleIdRef.current = vehicleId
      setIsTracking(res?.vehicle_details?.tracking || false)
    } catch (error) {
      console.error("Failed to fetch transport details:", error)
      setError("Failed to fetch transport details")
      // Alert.alert("Error", "Failed to fetch transport details. Please try again.")
    } finally {
      if (showLoader) setLoading(false)
      setRefreshing(false)
    }
  }

  // Socket connection (commented out for now - uncomment when socket.io is available)

  const makeConnection = async () => {
    const accessToken = await get_access_token()
    const newSocket = io(process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000', {
      reconnection: false,
      transports: ["websocket"],
      auth: {
        token: `Bearer ${accessToken}`,
        role: "STUDENT"
      },
    })

    newSocket.on("connect", () => {
      console.log("Connected to server")
      setError(null)
      setIsConnected(true)
    })

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server")
      setIsConnected(false)
    })

    newSocket.on("TRACK_START", (data: TRACK_DATA) => {
      if (trackVehicleIdRef?.current === data?.vehicle_id) {
        setIsTracking(true)
        setPosition({
          latitude: data?.latitude,
          longitude: data?.longitude,
          speed: data.speed,
          timestamp: data?.timestamp,
        })
      }
    })

    newSocket.on("TRACK_UPDATE", (data: TRACK_DATA) => {
      if (trackVehicleIdRef?.current === data?.vehicle_id) {
        setIsTracking(true)
        setPosition({
          latitude: data?.latitude,
          longitude: data?.longitude,
          speed: data.speed,
          timestamp: data?.timestamp,
        })
      }
    })

    newSocket.on("TRACK_STOP", (data: any) => {
      if (trackVehicleIdRef?.current === data?.vehicle_id) {
        setIsTracking(false)
      }
    })

    newSocket.on("connect_error", (error) => {
      setIsConnected(false)
      setError("You are not connected to the server.")
    })

    setSocket(newSocket)
  }


  useEffect(() => {
    fetchTransportData()
    makeConnection() // Uncomment when socket.io is available
  }, [])

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true)
    fetchTransportData(false)
  }

  // Call driver
  const callDriver = () => {
    if (transport?.driver_phone) {
      Linking.openURL(`tel:${transport.driver_phone}`)
    } else {
      Alert.alert("Info", "Driver contact not available")
    }
  }

  // Get map URL based on view type
  const getMapUrl = () => {
    const lat = position.latitude || 25.5941
    const lng = position.longitude || 85.1376
    const zoom = 15

    switch (mapView) {
      case "satellite":
        return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&t=k&output=embed`
      case "hybrid":
        return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&t=h&output=embed`
      default:
        return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`
    }
  }

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    if (!timestamp) return "N/A"
    return new Date(timestamp * 1000).toLocaleTimeString()
  }

  // Empty state illustration
  const EmptyStateIllustration = () => (
    <View className="items-center justify-center py-12">
      <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-6">
        <Icon name="directions-bus" size={48} color="#BDC3C7" />
      </View>
      <Text className="text-xl font-bold text-[#2C3E50] mb-2 text-center">No Transport Assigned</Text>
      <Text className="text-sm text-[#7F8C8D] text-center px-8 leading-5">
        You don't have any transport assigned yet. Please contact the school administration.
      </Text>
    </View>
  )






  const getMapHtml = useCallback(() => {
    const lat = position.latitude || 25.5941
    const lng = position.longitude || 85.1376
    const zoom = 15
    const type =
      mapView === "satellite" ? "k" :
        mapView === "hybrid" ? "h" :
          "m"

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <style>
        body, html { margin:0; padding:0; height:100%; }
        iframe { border:0; width:100%; height:100%; }
      </style>
    </head>
    <body>
      <iframe
        src="https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&t=${type}&output=embed"
        allowfullscreen
      ></iframe>
    </body>
    </html>
  `
  }, [position])


  return (
    <ScrollView
      className="flex-1 bg-[#F0F4F8] "
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between bg-[#6A5ACD] py-12 px-4 rounded-b-[25px]">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white">Transport</Text>
        <TouchableOpacity onPress={() => fetchTransportData()} disabled={loading} className="p-2">
          <Icon
            name="refresh"
            size={20}
            color="white"
            style={{ transform: [{ rotate: loading ? "360deg" : "0deg" }] }}
          />
        </TouchableOpacity>
      </View>

      {/* Loading State */}
      {loading && (
        <View className="px-4 -mt-8 mb-5">
          <View className="bg-white rounded-2xl p-6 shadow-lg elevation-5">
            <View className="items-center">
              <ActivityIndicator size="large" color="#6A5ACD" />
              <Text className="text-[#7F8C8D] mt-4">Loading transport details...</Text>
            </View>
          </View>
        </View>
      )}

      {/* Transport Content */}
      {!loading && (
        <>
          {transport ? (
            <>
              {/* Transport Details Card */}
              <View className="px-4 -mt-8 mb-5">
                <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
                  {/* Header */}
                  <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center">
                      <View className="w-12 h-12 bg-[#6A5ACD] rounded-xl items-center justify-center mr-3">
                        <Icon name="directions-bus" size={24} color="white" />
                      </View>
                      <View>
                        <Text className="text-lg font-bold text-[#2C3E50]">Assigned Transport</Text>
                        <Text className="text-sm text-[#7F8C8D]">Your current transport details</Text>
                      </View>
                    </View>
                    <View className="items-center">
                      <View
                        className={`w-3 h-3 rounded-full ${isTracking ? "bg-[#2ECC71]" : "bg-[#BDC3C7]"}`}
                        style={{
                          shadowColor: isTracking ? "#2ECC71" : "#BDC3C7",
                          shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: isTracking ? 0.8 : 0,
                          shadowRadius: 4,
                        }}
                      />
                      <Text className="text-xs text-[#7F8C8D] mt-1">{isTracking ? "Active" : "Inactive"}</Text>
                    </View>
                  </View>

                  {/* Transport Info */}
                  <View className="bg-[#F8F9FA] rounded-xl p-4 mb-4">
                    <View className="space-y-3">
                      <View className="flex-row items-center">
                        <Icon name="directions-bus" size={16} color="#6A5ACD" />
                        <Text className="text-sm text-[#7F8C8D] ml-2 flex-1">Vehicle:</Text>
                        <Text className="text-sm font-semibold text-[#2C3E50]">{transport.vehicle_number}</Text>
                      </View>
                      <View className="flex-row items-center">
                        <Icon name="route" size={16} color="#6A5ACD" />
                        <Text className="text-sm text-[#7F8C8D] ml-2 flex-1">Route:</Text>
                        <Text className="text-sm font-semibold text-[#2C3E50]">{transport.route_name}</Text>
                      </View>
                      <View className="flex-row items-center">
                        <Icon name="person" size={16} color="#6A5ACD" />
                        <Text className="text-sm text-[#7F8C8D] ml-2 flex-1">Driver:</Text>
                        <Text className="text-sm font-semibold text-[#2C3E50]">{transport.driver_name}</Text>
                      </View>
                      <View className="flex-row items-center">
                        <Icon name="location-on" size={16} color="#6A5ACD" />
                        <Text className="text-sm text-[#7F8C8D] ml-2 flex-1">Pickup:</Text>
                        <Text className="text-sm font-semibold text-[#2C3E50]">{transport.pickUp_point_name}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Time Info */}
                  <View className="flex-row gap-3">
                    <View className="flex-1 bg-[#E3F2FD] rounded-xl p-3 items-center">
                      <Icon name="schedule" size={20} color="#1976D2" />
                      <Text className="text-xs text-[#1976D2] mt-1">Pickup Time</Text>
                      <Text className="text-sm font-bold text-[#1976D2]">{transport.departure_time}</Text>
                    </View>
                    <View className="flex-1 bg-[#E8F5E8] rounded-xl p-3 items-center">
                      <Icon name="schedule" size={20} color="#388E3C" />
                      <Text className="text-xs text-[#388E3C] mt-1">Drop Time</Text>
                      <Text className="text-sm font-bold text-[#388E3C]">{transport.arrival_time}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Live Tracking Card */}
              <View className="px-4 mb-5">
                <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
                  {/* Header */}
                  <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center">
                      <Icon name="navigation" size={20} color="#6A5ACD" />
                      <Text className="text-lg font-bold text-[#2C3E50] ml-2">Live Vehicle Tracking</Text>
                    </View>
                    {!isConnected && (
                      <TouchableOpacity
                        // onPress={makeConnection} // Uncomment when socket.io is available
                        className="bg-[#E74C3C] px-3 py-1 rounded-lg"
                      >
                        <Icon name="refresh" size={16} color="white" />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Vehicle Status */}
                  <View className="bg-[#F8F9FA] rounded-xl p-3 mb-4">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <View className={`w-3 h-3 rounded-full mr-3 ${isTracking ? "bg-[#2ECC71]" : "bg-[#BDC3C7]"}`} />
                        <View>
                          <Text className="text-sm font-semibold text-[#2C3E50]">{transport.vehicle_number}</Text>
                          <Text className="text-xs text-[#7F8C8D]">Driver: {transport.driver_name}</Text>
                        </View>
                      </View>
                      <View className="items-end">
                        <Text className="text-sm font-bold text-[#2C3E50]">{position.speed} km/h</Text>
                        <Text className="text-xs text-[#7F8C8D]">{formatTimestamp(position.timestamp)}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Map */}
                  <View className="rounded-xl overflow-hidden border border-[#E5E5E5] mb-4">
                    {/* <WebView
                      source={{ uri: getMapUrl() }}
                      style={{ height: 300 }}
                      javaScriptEnabled={true}
                      domStorageEnabled={true}
                      startInLoadingState={true}
                      renderLoading={() => (
                        <View className="absolute inset-0 items-center justify-center bg-[#F8F9FA]">
                          <ActivityIndicator size="large" color="#6A5ACD" />
                          <Text className="text-[#7F8C8D] mt-2">Loading map...</Text>
                        </View>
                      )}
                    /> */}

                    <WebView
                      originWhitelist={['*']}
                      source={{ html: getMapHtml() }}
                      style={{ height: 300 }}
                      javaScriptEnabled={true}
                      domStorageEnabled={true}
                      startInLoadingState={true}
                      renderLoading={() => (
                        <View className="absolute inset-0 items-center justify-center bg-[#F8F9FA]">
                          <ActivityIndicator size="large" color="#6A5ACD" />
                          <Text className="text-[#7F8C8D] mt-2">Loading map...</Text>
                        </View>
                      )}
                    />

                  </View>

                  {/* Map Controls */}
                  <View className="flex-row rounded-lg overflow-hidden border border-[#E5E5E5]">
                    {["street", "satellite", "hybrid"].map((view) => (
                      <TouchableOpacity
                        key={view}
                        onPress={() => setMapView(view as any)}
                        className={`flex-1 py-2 items-center ${mapView === view ? "bg-[#6A5ACD]" : "bg-[#F8F9FA]"}`}
                      >
                        <Text
                          className={`text-xs font-semibold capitalize ${mapView === view ? "text-white" : "text-[#2C3E50]"
                            }`}
                        >
                          {view}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              {/* Quick Actions */}
              <View className="px-4 mb-5">
                <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
                  <Text className="text-lg font-bold text-[#2C3E50] mb-4">Quick Actions</Text>
                  <View className="gap-3">
                    <TouchableOpacity
                      onPress={callDriver}
                      className="flex-row items-center p-3 bg-[#E8F5E8] rounded-xl"
                    >
                      <Icon name="phone" size={20} color="#2ECC71" />
                      <Text className="text-[#2C3E50] font-semibold ml-3 flex-1">Call Driver</Text>
                      <Icon name="chevron-right" size={20} color="#BDC3C7" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => fetchTransportData()}
                      className="flex-row items-center p-3 bg-[#E3F2FD] rounded-xl"
                    >
                      <Icon name="refresh" size={20} color="#1976D2" />
                      <Text className="text-[#2C3E50] font-semibold ml-3 flex-1">Refresh Location</Text>
                      <Icon name="chevron-right" size={20} color="#BDC3C7" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Connection Status */}
              {error && (
                <View className="px-4 mb-5">
                  <View className="bg-red-50 border border-red-200 rounded-2xl p-4">
                    <View className="flex-row items-center mb-2">
                      <Icon name="error-outline" size={20} color="#E74C3C" />
                      <Text className="text-lg font-bold text-red-800 ml-2">Connection Issue</Text>
                    </View>
                    <Text className="text-sm text-red-700">{error}</Text>
                    <TouchableOpacity
                      onPress={() => fetchTransportData()}
                      className="bg-[#E74C3C] px-4 py-2 rounded-lg mt-3 self-start"
                    >
                      <Text className="text-white font-semibold">Retry</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </>
          ) : (
            /* No Transport Available */
            <View className="px-4 -mt-8 mb-5">
              <View className="bg-white rounded-2xl shadow-lg elevation-5">
                <EmptyStateIllustration />
              </View>
            </View>
          )}
        </>
      )}
    </ScrollView>
  )
}

export default TransportScreen
