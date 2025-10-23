
// import type React from "react"
// import { useState, useEffect, useRef, useCallback } from "react"
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   RefreshControl,
//   Dimensions,
//   Linking,
// } from "react-native"
// import { WebView } from "react-native-webview"
// import Icon from "react-native-vector-icons/MaterialIcons"
// import { useRouter } from "expo-router"
// import { get_trasnport_details } from "@/service/student/transport"
// import type { TransportDetails, Position, TRACK_DATA } from "@/types/transport"
// import { get_access_token } from "@/utils/accessToken"

// import { io, Socket } from "socket.io-client"
// import { Typography } from "@/components/Typography"

// import MapView, { Marker } from "react-native-maps"
// import { ApiRoute } from "@/constants/apiRoute"
// const { width, height } = Dimensions.get("window")

// const TransportScreen: React.FC = () => {
//   const router = useRouter()
//   const [transport, setTransport] = useState<TransportDetails | null>(null)
//   const [position, setPosition] = useState<Position>({
//     latitude: 0,
//     longitude: 0,
//     speed: 0,
//     timestamp: 0,
//   })
//   const [loading, setLoading] = useState(false)
//   const [refreshing, setRefreshing] = useState(false)
//   const [isTracking, setIsTracking] = useState(false)
//   const [trackVehicleId, setTrackVehicleId] = useState<string | null>(null)
//   const trackVehicleIdRef = useRef<string | null>(null)
//   const [isConnected, setIsConnected] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [mapView, setMapView] = useState<"street" | "satellite" | "hybrid">("street")
//   const [socket, setSocket] = useState<Socket | null>(null)


//   const mapRef = useRef<MapView | null>(null)

//   // Fetch transport data
//   const fetchTransportData = async (showLoader = true) => {
//     if (showLoader) setLoading(true)
//     setError(null)

//     try {
//       const res = await get_trasnport_details()
//       setTransport(res)
//       setPosition({
//         latitude: res?.vehicle_details?.latitude || 0,
//         longitude: res?.vehicle_details?.longitude || 0,
//         speed: res?.vehicle_details?.speed || 0,
//         timestamp: res?.vehicle_details?.timestamp || 0,
//       })

//       const vehicleId = res?.vehicle_id
//       setTrackVehicleId(vehicleId)
//       trackVehicleIdRef.current = vehicleId
//       setIsTracking(res?.vehicle_details?.tracking || false)
//     } catch (error) {
//       console.error("Failed to fetch transport details:", error)
//       setError("Failed to fetch transport details")
//       // Alert.alert("Error", "Failed to fetch transport details. Please try again.")
//     } finally {
//       if (showLoader) setLoading(false)
//       setRefreshing(false)
//     }
//   }

//   // Socket connection (commented out for now - uncomment when socket.io is available)

//   const makeConnection = async () => {
//     console.log("staguiiur")
//     const accessToken = await get_access_token()
//     const newSocket = io(ApiRoute?.BaseUrl, {
//       reconnection: false,
//       transports: ["websocket"],
//       auth: {
//         token: `Bearer ${accessToken}`,
//         role: "STUDENT"
//       },
//     })

//     newSocket.on("connect", () => {
//       console.log("Connected to server")
//       setError(null)
//       setIsConnected(true)
//     })

//     newSocket.on("disconnect", () => {
//       console.log("Disconnected from server")
//       setIsConnected(false)
//     })

//     newSocket.on("TRACK_START", (data: TRACK_DATA) => {
//       if (trackVehicleIdRef?.current === data?.vehicle_id) {
//         setIsTracking(true)
//         setPosition({
//           latitude: data?.latitude,
//           longitude: data?.longitude,
//           speed: data.speed,
//           timestamp: data?.timestamp,
//         })
//       }
//     })

//     newSocket.on("TRACK_UPDATE", (data: TRACK_DATA) => {
//       console.log("trcj update",data)
//       if (trackVehicleIdRef?.current === data?.vehicle_id) {
//         setIsTracking(true)
//         setPosition({
//           latitude: data?.latitude,
//           longitude: data?.longitude,
//           speed: data.speed,
//           timestamp: data?.timestamp,
//         })
//       }
//     })

//     newSocket.on("TRACK_STOP", (data: any) => {
//       console.log("tracj stop")
//       if (trackVehicleIdRef?.current === data?.vehicle_id) {
//         setIsTracking(false)
//       }
//     })

//     newSocket.on("connect_error", (error) => {
//       setIsConnected(false)
//       setError("You are not connected to the server.")
//     })

//     setSocket(newSocket)
//   }


//   useEffect(() => {
//     fetchTransportData()
//     console.log("snjkjbfbjjbjdbbo")
//     makeConnection() // Uncomment when socket.io is available
//   }, [])

//   // Handle refresh
//   const onRefresh = () => {
//     setRefreshing(true)
//     fetchTransportData(false)
//   }

//   // Call driver
//   const callDriver = () => {
//     if (transport?.driver_phone) {
//       Linking.openURL(`tel:${transport.driver_phone}`)
//     } else {
//       Alert.alert("Info", "Driver contact not available")
//     }
//   }

//   // Get map URL based on view type
//   const getMapUrl = () => {
//     const lat = position.latitude || 25.5941
//     const lng = position.longitude || 85.1376
//     const zoom = 15

//     switch (mapView) {
//       case "satellite":
//         return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&t=k&output=embed`
//       case "hybrid":
//         return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&t=h&output=embed`
//       default:
//         return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`
//     }
//   }



//   useEffect(() => {
//   if (position.latitude && position.longitude && mapRef?.current) {
//     mapRef.current?.animateToRegion(
//       {
//         latitude: position.latitude,
//         longitude: position.longitude,
//         latitudeDelta: 0.01,
//         longitudeDelta: 0.01,
//       },
//       1000 // duration in ms
//     )
//   }
// }, [position])


//   // Format timestamp
//   const formatTimestamp = (timestamp: number) => {
//     if (!timestamp) return "N/A"
//     return new Date(timestamp * 1000).toLocaleTimeString()
//   }

//   // Empty state illustration
//   const EmptyStateIllustration = () => (
//     <View className="items-center justify-center py-12">
//       <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-6">
//         <Icon name="directions-bus" size={48} color="#BDC3C7" />
//       </View>
//       <Typography className="text-xl font-bold text-[#2C3E50] mb-2 text-center">No Transport Assigned</Typography>
//       <Typography className="text-sm text-[#7F8C8D] text-center px-8 leading-5">
//         You don't have any transport assigned yet. Please contact the school administration.
//       </Typography>
//     </View>
//   )






//   const getMapHtml = useCallback(() => {
//     const lat = position.latitude || 25.5941
//     const lng = position.longitude || 85.1376
//     const zoom = 15
//     const type =
//       mapView === "satellite" ? "k" :
//         mapView === "hybrid" ? "h" :
//           "m"

//     return `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta name="viewport" content="initial-scale=1.0, width=device-width" />
//       <style>
//         body, html { margin:0; padding:0; height:100%; }
//         iframe { border:0; width:100%; height:100%; }
//       </style>
//     </head>
//     <body>
//       <iframe
//         src="https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&t=${type}&output=embed"
//         allowfullscreen
//       ></iframe>
//     </body>
//     </html>
//   `
//   }, [position?.latitude])


//   return (
//     <ScrollView
//       className="flex-1 bg-[#F0F4F8] "
//       showsVerticalScrollIndicator={false}
//       refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//     >
//       {/* Header */}
//       <View className="flex-row items-center justify-between bg-[#6A5ACD] py-12 px-4 rounded-b-[25px]">
//         <TouchableOpacity onPress={() => router.back()} className="p-2">
//           <Icon name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
//         <Typography className="text-xl font-bold text-white">Transport</Typography>
//         <TouchableOpacity onPress={() => fetchTransportData()} disabled={loading} className="p-2">
//           <Icon
//             name="refresh"
//             size={20}
//             color="white"
//             style={{ transform: [{ rotate: loading ? "360deg" : "0deg" }] }}
//           />
//         </TouchableOpacity>
//       </View>

//       {/* Loading State */}
//       {loading && (
//         <View className="px-4 -mt-8 mb-5">
//           <View className="bg-white rounded-2xl p-6 shadow-lg elevation-5">
//             <View className="items-center">
//               <ActivityIndicator size="large" color="#6A5ACD" />
//               <Typography className="text-[#7F8C8D] mt-4">Loading transport details...</Typography>
//             </View>
//           </View>
//         </View>
//       )}

//       {/* Transport Content */}
//       {!loading && (
//         <>
//           {transport ? (
//             <>
//               {/* Transport Details Card */}
//               <View className="px-4 -mt-8 mb-5">
//                 <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
//                   {/* Header */}
//                   <View className="flex-row items-center justify-between mb-4">
//                     <View className="flex-row items-center">
//                       <View className="w-12 h-12 bg-[#6A5ACD] rounded-xl items-center justify-center mr-3">
//                         <Icon name="directions-bus" size={24} color="white" />
//                       </View>
//                       <View>
//                         <Typography className="text-lg font-bold text-[#2C3E50]">Assigned Transport</Typography>
//                         <Typography className="text-sm text-[#7F8C8D]">Your current transport details</Typography>
//                       </View>
//                     </View>
//                     <View className="items-center">
//                       <View
//                         className={`w-3 h-3 rounded-full ${isTracking ? "bg-[#2ECC71]" : "bg-[#BDC3C7]"}`}
//                         style={{
//                           shadowColor: isTracking ? "#2ECC71" : "#BDC3C7",
//                           shadowOffset: { width: 0, height: 0 },
//                           shadowOpacity: isTracking ? 0.8 : 0,
//                           shadowRadius: 4,
//                         }}
//                       />
//                       <Typography className="text-xs text-[#7F8C8D] mt-1">{isTracking ? "Active" : "Inactive"}</Typography>
//                     </View>
//                   </View>

//                   {/* Transport Info */}
//                   <View className="bg-[#F8F9FA] rounded-xl p-4 mb-4">
//                     <View className="space-y-3">
//                       <View className="flex-row items-center">
//                         <Icon name="directions-bus" size={16} color="#6A5ACD" />
//                         <Typography className="text-sm text-[#7F8C8D] ml-2 flex-1">Vehicle:</Typography>
//                         <Typography className="text-sm font-semibold text-[#2C3E50]">{transport.vehicle_number}</Typography>
//                       </View>
//                       <View className="flex-row items-center">
//                         <Icon name="route" size={16} color="#6A5ACD" />
//                         <Typography className="text-sm text-[#7F8C8D] ml-2 flex-1">Route:</Typography>
//                         <Typography className="text-sm font-semibold text-[#2C3E50]">{transport.route_name}</Typography>
//                       </View>
//                       <View className="flex-row items-center">
//                         <Icon name="person" size={16} color="#6A5ACD" />
//                         <Typography className="text-sm text-[#7F8C8D] ml-2 flex-1">Driver:</Typography>
//                         <Typography className="text-sm font-semibold text-[#2C3E50]">{transport.driver_name}</Typography>
//                       </View>
//                       <View className="flex-row items-center">
//                         <Icon name="location-on" size={16} color="#6A5ACD" />
//                         <Typography className="text-sm text-[#7F8C8D] ml-2 flex-1">Pickup:</Typography>
//                         <Typography className="text-sm font-semibold text-[#2C3E50]">{transport.pickUp_point_name}</Typography>
//                       </View>
//                     </View>
//                   </View>

//                   {/* Time Info */}
//                   <View className="flex-row gap-3">
//                     <View className="flex-1 bg-[#E3F2FD] rounded-xl p-3 items-center">
//                       <Icon name="schedule" size={20} color="#1976D2" />
//                       <Typography className="text-xs text-[#1976D2] mt-1">Pickup Time</Typography>
//                       <Typography className="text-sm font-bold text-[#1976D2]">{transport.departure_time}</Typography>
//                     </View>
//                     <View className="flex-1 bg-[#E8F5E8] rounded-xl p-3 items-center">
//                       <Icon name="schedule" size={20} color="#388E3C" />
//                       <Typography className="text-xs text-[#388E3C] mt-1">Drop Time</Typography>
//                       <Typography className="text-sm font-bold text-[#388E3C]">{transport.arrival_time}</Typography>
//                     </View>
//                   </View>
//                 </View>
//               </View>

//               {/* Live Tracking Card */}
//               <View className="px-4 mb-5">
//                 <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
//                   {/* Header */}
//                   <View className="flex-row items-center justify-between mb-4">
//                     <View className="flex-row items-center">
//                       <Icon name="navigation" size={20} color="#6A5ACD" />
//                       <Typography className="text-lg font-bold text-[#2C3E50] ml-2">Live Vehicle Tracking</Typography>
//                     </View>
//                     {!isConnected && (
//                       <TouchableOpacity
//                         // onPress={makeConnection} // Uncomment when socket.io is available
//                         className="bg-[#E74C3C] px-3 py-1 rounded-lg"
//                       >
//                         <Icon name="refresh" size={16} color="white" />
//                       </TouchableOpacity>
//                     )}
//                   </View>

//                   {/* Vehicle Status */}
//                   <View className="bg-[#F8F9FA] rounded-xl p-3 mb-4">
//                     <View className="flex-row items-center justify-between">
//                       <View className="flex-row items-center">
//                         <View className={`w-3 h-3 rounded-full mr-3 ${isTracking ? "bg-[#2ECC71]" : "bg-[#BDC3C7]"}`} />
//                         <View>
//                           <Typography className="text-sm font-semibold text-[#2C3E50]">{transport.vehicle_number}</Typography>
//                           <Typography className="text-xs text-[#7F8C8D]">Driver: {transport.driver_name}</Typography>
//                         </View>
//                       </View>
//                       <View className="items-end">
//                         <Typography className="text-sm font-bold text-[#2C3E50]">{position.speed} km/h</Typography>
//                         <Typography className="text-xs text-[#7F8C8D]">{formatTimestamp(position.timestamp)}</Typography>
//                       </View>
//                     </View>
//                   </View>

//                   {/* Map */}
//                   <View className="rounded-xl overflow-hidden border border-[#E5E5E5] mb-4">
                 

//                     {/* <WebView
//                     key={`${position?.latitude}-${position?.longitude}`}
//                       originWhitelist={['*']}
//                       source={{ html: getMapHtml() }}
//                       style={{ height: 300 }}
//                       javaScriptEnabled={true}
//                       domStorageEnabled={true}
//                       startInLoadingState={true}
//                       renderLoading={() => (
//                         <View className="absolute inset-0 items-center justify-center bg-[#F8F9FA]">
//                           <ActivityIndicator size="large" color="#6A5ACD" />
//                           <Typography className="text-[#7F8C8D] mt-2">Loading map...</Typography> 
//                         </View>
//                       )}
//                     /> */}

//                      {/* <MapView
//                        ref={mapRef}

//                       style={{ height: 300, width: "100%" }}
//                       region={{
//                         latitude: position.latitude,
//                         longitude: position.longitude,
//                         latitudeDelta: 0.01,
//                         longitudeDelta: 0.01,
//                       }}
//                     >
//                       <Marker
//                         coordinate={{
//                           latitude: position.latitude,
//                           longitude: position.longitude,
//                         }}
//                         title={transport.vehicle_number}
//                         description={`Speed: ${position.speed} km/h`}
//                       />
//                     </MapView>  */}


// <MapView
//   style={{ height: 300, width: "100%" }}
//   region={{
//     latitude: 28.6139,    // Delhi
//     longitude: 77.2090,
//     latitudeDelta: 0.01,
//     longitudeDelta: 0.01,
//   }}
// >
//   <Marker
//     coordinate={{
//       latitude: 28.6139,
//       longitude: 77.2090,
//     }}
//     title="Test Bus"
//     description="Speed: 40 km/h"
//   />
// </MapView>

//                   </View>

//                   {/* Map Controls */}
//                   <View className="flex-row rounded-lg overflow-hidden border border-[#E5E5E5]">
//                     {["street", "satellite", "hybrid"].map((view) => (
//                       <TouchableOpacity
//                         key={view}
//                         onPress={() => setMapView(view as any)}
//                         className={`flex-1 py-2 items-center ${mapView === view ? "bg-[#6A5ACD]" : "bg-[#F8F9FA]"}`}
//                       >
//                         <Typography
//                           className={`text-xs font-semibold capitalize ${mapView === view ? "text-white" : "text-[#2C3E50]"
//                             }`}
//                         >
//                           {view}
//                         </Typography>
//                       </TouchableOpacity>
//                     ))}
//                   </View>
//                 </View>
//               </View>

//               {/* Quick Actions */}
//               <View className="px-4 mb-5">
//                 <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
//                   <Typography className="text-lg font-bold text-[#2C3E50] mb-4">Quick Actions</Typography>
//                   <View className="gap-3">
//                     <TouchableOpacity
//                       onPress={callDriver}
//                       className="flex-row items-center p-3 bg-[#E8F5E8] rounded-xl"
//                     >
//                       <Icon name="phone" size={20} color="#2ECC71" />
//                       <Typography className="text-[#2C3E50] font-semibold ml-3 flex-1">Call Driver</Typography>
//                       <Icon name="chevron-right" size={20} color="#BDC3C7" />
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                       onPress={() => fetchTransportData()}
//                       className="flex-row items-center p-3 bg-[#E3F2FD] rounded-xl"
//                     >
//                       <Icon name="refresh" size={20} color="#1976D2" />
//                       <Typography className="text-[#2C3E50] font-semibold ml-3 flex-1">Refresh Location</Typography>
//                       <Icon name="chevron-right" size={20} color="#BDC3C7" />
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </View>

//               {/* Connection Status */}
//               {error && (
//                 <View className="px-4 mb-5">
//                   <View className="bg-red-50 border border-red-200 rounded-2xl p-4">
//                     <View className="flex-row items-center mb-2">
//                       <Icon name="error-outline" size={20} color="#E74C3C" />
//                       <Typography className="text-lg font-bold text-red-800 ml-2">Connection Issue</Typography>
//                     </View>
//                     <Typography className="text-sm text-red-700">{error}</Typography>
//                     <TouchableOpacity
//                       onPress={() => fetchTransportData()}
//                       className="bg-[#E74C3C] px-4 py-2 rounded-lg mt-3 self-start"
//                     >
//                       <Typography className="text-white font-semibold">Retry</Typography>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               )}
//             </>
//           ) : (
//             /* No Transport Available */
//             <View className="px-4 -mt-8 mb-5">
//               <View className="bg-white rounded-2xl shadow-lg elevation-5">
//                 <EmptyStateIllustration />
//               </View>
//             </View>
//           )}
//         </>
//       )}
//     </ScrollView>
//   )
// }

// export default TransportScreen



// import type React from "react"
// import { useState, useEffect, useRef, useCallback } from "react"
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   RefreshControl,
//   Dimensions,
//   Linking,
// } from "react-native"
// import { WebView } from "react-native-webview"
// import Icon from "react-native-vector-icons/MaterialIcons"
// import { useRouter } from "expo-router"
// import { get_trasnport_details } from "@/service/student/transport"
// import type { TransportDetails, Position, TRACK_DATA } from "@/types/transport"
// import { get_access_token } from "@/utils/accessToken"

// import { io, Socket } from "socket.io-client"
// import { Typography } from "@/components/Typography"

// import MapView, { Marker } from "react-native-maps"
// import { ApiRoute } from "@/constants/apiRoute"
// const { width, height } = Dimensions.get("window")

// const TransportScreen: React.FC = () => {
//   const router = useRouter()
//   const [transport, setTransport] = useState<TransportDetails | null>(null)
//   const [position, setPosition] = useState<Position>({
//     latitude: 0,
//     longitude: 0,
//     speed: 0,
//     timestamp: 0,
//   })
//   const [loading, setLoading] = useState(false)
//   const [refreshing, setRefreshing] = useState(false)
//   const [isTracking, setIsTracking] = useState(false)
//   const [trackVehicleId, setTrackVehicleId] = useState<string | null>(null)
//   const trackVehicleIdRef = useRef<string | null>(null)
//   const [isConnected, setIsConnected] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [mapView, setMapView] = useState<"street" | "satellite" | "hybrid">("street")
//   const [socket, setSocket] = useState<Socket | null>(null)


//   const mapRef = useRef<MapView | null>(null)

//   // Fetch transport data
//   const fetchTransportData = async (showLoader = true) => {
//     if (showLoader) setLoading(true)
//     setError(null)

//     try {
//       const res = await get_trasnport_details()
//       setTransport(res)
//       setPosition({
//         latitude: res?.vehicle_details?.latitude || 0,
//         longitude: res?.vehicle_details?.longitude || 0,
//         speed: res?.vehicle_details?.speed || 0,
//         timestamp: res?.vehicle_details?.timestamp || 0,
//       })

//       const vehicleId = res?.vehicle_id
//       setTrackVehicleId(vehicleId)
//       trackVehicleIdRef.current = vehicleId
//       setIsTracking(res?.vehicle_details?.tracking || false)
//     } catch (error) {
//       console.error("Failed to fetch transport details:", error)
//       setError("Failed to fetch transport details")
//       // Alert.alert("Error", "Failed to fetch transport details. Please try again.")
//     } finally {
//       if (showLoader) setLoading(false)
//       setRefreshing(false)
//     }
//   }

//   // Socket connection (commented out for now - uncomment when socket.io is available)

//   const makeConnection = async () => {
//     console.log("staguiiur")
//     const accessToken = await get_access_token()
//     const newSocket = io(ApiRoute?.BaseUrl, {
//       reconnection: false,
//       transports: ["websocket"],
//       auth: {
//         token: `Bearer ${accessToken}`,
//         role: "STUDENT"
//       },
//     })

//     newSocket.on("connect", () => {
//       console.log("Connected to server")
//       setError(null)
//       setIsConnected(true)
//     })

//     newSocket.on("disconnect", () => {
//       console.log("Disconnected from server")
//       setIsConnected(false)
//     })

//     newSocket.on("TRACK_START", (data: TRACK_DATA) => {
//       if (trackVehicleIdRef?.current === data?.vehicle_id) {
//         setIsTracking(true)
//         setPosition({
//           latitude: data?.latitude,
//           longitude: data?.longitude,
//           speed: data.speed,
//           timestamp: data?.timestamp,
//         })
//       }
//     })

//     newSocket.on("TRACK_UPDATE", (data: TRACK_DATA) => {
//       console.log("trcj update",data)
//       if (trackVehicleIdRef?.current === data?.vehicle_id) {
//         setIsTracking(true)
//         setPosition({
//           latitude: data?.latitude,
//           longitude: data?.longitude,
//           speed: data.speed,
//           timestamp: data?.timestamp,
//         })
//       }
//     })

//     newSocket.on("TRACK_STOP", (data: any) => {
//       console.log("tracj stop")
//       if (trackVehicleIdRef?.current === data?.vehicle_id) {
//         setIsTracking(false)
//       }
//     })

//     newSocket.on("connect_error", (error) => {
//       setIsConnected(false)
//       setError("You are not connected to the server.")
//     })

//     setSocket(newSocket)
//   }


//   useEffect(() => {
//     fetchTransportData()
//     console.log("snjkjbfbjjbjdbbo")
//     makeConnection() // Uncomment when socket.io is available
//   }, [])

//   // Handle refresh
//   const onRefresh = () => {
//     setRefreshing(true)
//     fetchTransportData(false)
//   }

//   // Call driver
//   const callDriver = () => {
//     if (transport?.driver_phone) {
//       Linking.openURL(`tel:${transport.driver_phone}`)
//     } else {
//       Alert.alert("Info", "Driver contact not available")
//     }
//   }

//   // Get map URL based on view type
//   const getMapUrl = () => {
//     const lat = position.latitude || 25.5941
//     const lng = position.longitude || 85.1376
//     const zoom = 15

//     switch (mapView) {
//       case "satellite":
//         return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&t=k&output=embed`
//       case "hybrid":
//         return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&t=h&output=embed`
//       default:
//         return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`
//     }
//   }



//   useEffect(() => {
//   if (position.latitude && position.longitude && mapRef?.current) {
//     mapRef.current?.animateToRegion(
//       {
//         latitude: position.latitude,
//         longitude: position.longitude,
//         latitudeDelta: 0.01,
//         longitudeDelta: 0.01,
//       },
//       1000 // duration in ms
//     )
//   }
// }, [position])


//   // Format timestamp
//   const formatTimestamp = (timestamp: number) => {
//     if (!timestamp) return "N/A"
//     return new Date(timestamp * 1000).toLocaleTimeString()
//   }

//   // Empty state illustration
//   const EmptyStateIllustration = () => (
//     <View className="items-center justify-center py-12">
//       <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-6">
//         <Icon name="directions-bus" size={48} color="#BDC3C7" />
//       </View>
//       <Typography className="text-xl font-bold text-[#2C3E50] mb-2 text-center">No Transport Assigned</Typography>
//       <Typography className="text-sm text-[#7F8C8D] text-center px-8 leading-5">
//         You don't have any transport assigned yet. Please contact the school administration.
//       </Typography>
//     </View>
//   )






//   const getMapHtml = useCallback(() => {
//     const lat = position.latitude || 25.5941
//     const lng = position.longitude || 85.1376
//     const zoom = 15
//     const type =
//       mapView === "satellite" ? "k" :
//         mapView === "hybrid" ? "h" :
//           "m"

//     return `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta name="viewport" content="initial-scale=1.0, width=device-width" />
//       <style>
//         body, html { margin:0; padding:0; height:100%; }
//         iframe { border:0; width:100%; height:100%; }
//       </style>
//     </head>
//     <body>
//       <iframe
//         src="https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&t=${type}&output=embed"
//         allowfullscreen
//       ></iframe>
//     </body>
//     </html>
//   `
//   }, [position?.latitude])


//   return (
//     <ScrollView
//       className="flex-1 bg-[#F0F4F8] "
//       showsVerticalScrollIndicator={false}
//       refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//     >
//       {/* Header */}
//       <View className="flex-row items-center justify-between bg-[#6A5ACD] py-12 px-4 rounded-b-[25px]">
//         <TouchableOpacity onPress={() => router.back()} className="p-2">
//           <Icon name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
//         <Typography className="text-xl font-bold text-white">Transport</Typography>
//         <TouchableOpacity onPress={() => fetchTransportData()} disabled={loading} className="p-2">
//           <Icon
//             name="refresh"
//             size={20}
//             color="white"
//             style={{ transform: [{ rotate: loading ? "360deg" : "0deg" }] }}
//           />
//         </TouchableOpacity>
//       </View>

//       {/* Loading State */}
//       {loading && (
//         <View className="px-4 -mt-8 mb-5">
//           <View className="bg-white rounded-2xl p-6 shadow-lg elevation-5">
//             <View className="items-center">
//               <ActivityIndicator size="large" color="#6A5ACD" />
//               <Typography className="text-[#7F8C8D] mt-4">Loading transport details...</Typography>
//             </View>
//           </View>
//         </View>
//       )}

//       {/* Transport Content */}
//       {!loading && (
//         <>
//           {transport ? (
//             <>
//               {/* Transport Details Card */}
//               <View className="px-4 -mt-8 mb-5">
//                 <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
//                   {/* Header */}
//                   <View className="flex-row items-center justify-between mb-4">
//                     <View className="flex-row items-center">
//                       <View className="w-12 h-12 bg-[#6A5ACD] rounded-xl items-center justify-center mr-3">
//                         <Icon name="directions-bus" size={24} color="white" />
//                       </View>
//                       <View>
//                         <Typography className="text-lg font-bold text-[#2C3E50]">Assigned Transport</Typography>
//                         <Typography className="text-sm text-[#7F8C8D]">Your current transport details</Typography>
//                       </View>
//                     </View>
//                     <View className="items-center">
//                       <View
//                         className={`w-3 h-3 rounded-full ${isTracking ? "bg-[#2ECC71]" : "bg-[#BDC3C7]"}`}
//                         style={{
//                           shadowColor: isTracking ? "#2ECC71" : "#BDC3C7",
//                           shadowOffset: { width: 0, height: 0 },
//                           shadowOpacity: isTracking ? 0.8 : 0,
//                           shadowRadius: 4,
//                         }}
//                       />
//                       <Typography className="text-xs text-[#7F8C8D] mt-1">{isTracking ? "Active" : "Inactive"}</Typography>
//                     </View>
//                   </View>

//                   {/* Transport Info */}
//                   <View className="bg-[#F8F9FA] rounded-xl p-4 mb-4">
//                     <View className="space-y-3">
//                       <View className="flex-row items-center">
//                         <Icon name="directions-bus" size={16} color="#6A5ACD" />
//                         <Typography className="text-sm text-[#7F8C8D] ml-2 flex-1">Vehicle:</Typography>
//                         <Typography className="text-sm font-semibold text-[#2C3E50]">{transport.vehicle_number}</Typography>
//                       </View>
//                       <View className="flex-row items-center">
//                         <Icon name="route" size={16} color="#6A5ACD" />
//                         <Typography className="text-sm text-[#7F8C8D] ml-2 flex-1">Route:</Typography>
//                         <Typography className="text-sm font-semibold text-[#2C3E50]">{transport.route_name}</Typography>
//                       </View>
//                       <View className="flex-row items-center">
//                         <Icon name="person" size={16} color="#6A5ACD" />
//                         <Typography className="text-sm text-[#7F8C8D] ml-2 flex-1">Driver:</Typography>
//                         <Typography className="text-sm font-semibold text-[#2C3E50]">{transport.driver_name}</Typography>
//                       </View>
//                       <View className="flex-row items-center">
//                         <Icon name="location-on" size={16} color="#6A5ACD" />
//                         <Typography className="text-sm text-[#7F8C8D] ml-2 flex-1">Pickup:</Typography>
//                         <Typography className="text-sm font-semibold text-[#2C3E50]">{transport.pickUp_point_name}</Typography>
//                       </View>
//                     </View>
//                   </View>

//                   {/* Time Info */}
//                   <View className="flex-row gap-3">
//                     <View className="flex-1 bg-[#E3F2FD] rounded-xl p-3 items-center">
//                       <Icon name="schedule" size={20} color="#1976D2" />
//                       <Typography className="text-xs text-[#1976D2] mt-1">Pickup Time</Typography>
//                       <Typography className="text-sm font-bold text-[#1976D2]">{transport.departure_time}</Typography>
//                     </View>
//                     <View className="flex-1 bg-[#E8F5E8] rounded-xl p-3 items-center">
//                       <Icon name="schedule" size={20} color="#388E3C" />
//                       <Typography className="text-xs text-[#388E3C] mt-1">Drop Time</Typography>
//                       <Typography className="text-sm font-bold text-[#388E3C]">{transport.arrival_time}</Typography>
//                     </View>
//                   </View>
//                 </View>
//               </View>

//               {/* Live Tracking Card */}
//               <View className="px-4 mb-5">
//                 <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
//                   {/* Header */}
//                   <View className="flex-row items-center justify-between mb-4">
//                     <View className="flex-row items-center">
//                       <Icon name="navigation" size={20} color="#6A5ACD" />
//                       <Typography className="text-lg font-bold text-[#2C3E50] ml-2">Live Vehicle Tracking</Typography>
//                     </View>
//                     {!isConnected && (
//                       <TouchableOpacity
//                         // onPress={makeConnection} // Uncomment when socket.io is available
//                         className="bg-[#E74C3C] px-3 py-1 rounded-lg"
//                       >
//                         <Icon name="refresh" size={16} color="white" />
//                       </TouchableOpacity>
//                     )}
//                   </View>

//                   {/* Vehicle Status */}
//                   <View className="bg-[#F8F9FA] rounded-xl p-3 mb-4">
//                     <View className="flex-row items-center justify-between">
//                       <View className="flex-row items-center">
//                         <View className={`w-3 h-3 rounded-full mr-3 ${isTracking ? "bg-[#2ECC71]" : "bg-[#BDC3C7]"}`} />
//                         <View>
//                           <Typography className="text-sm font-semibold text-[#2C3E50]">{transport.vehicle_number}</Typography>
//                           <Typography className="text-xs text-[#7F8C8D]">Driver: {transport.driver_name}</Typography>
//                         </View>
//                       </View>
//                       <View className="items-end">
//                         <Typography className="text-sm font-bold text-[#2C3E50]">{position.speed} km/h</Typography>
//                         <Typography className="text-xs text-[#7F8C8D]">{formatTimestamp(position.timestamp)}</Typography>
//                       </View>
//                     </View>
//                   </View>

//                   {/* Map */}
//                   <View className="rounded-xl overflow-hidden border border-[#E5E5E5] mb-4">
                 

//                     {/* <WebView
//                     key={`${position?.latitude}-${position?.longitude}`}
//                       originWhitelist={['*']}
//                       source={{ html: getMapHtml() }}
//                       style={{ height: 300 }}
//                       javaScriptEnabled={true}
//                       domStorageEnabled={true}
//                       startInLoadingState={true}
//                       renderLoading={() => (
//                         <View className="absolute inset-0 items-center justify-center bg-[#F8F9FA]">
//                           <ActivityIndicator size="large" color="#6A5ACD" />
//                           <Typography className="text-[#7F8C8D] mt-2">Loading map...</Typography> 
//                         </View>
//                       )}
//                     /> */}

//                      {/* <MapView
//                        ref={mapRef}

//                       style={{ height: 300, width: "100%" }}
//                       region={{
//                         latitude: position.latitude,
//                         longitude: position.longitude,
//                         latitudeDelta: 0.01,
//                         longitudeDelta: 0.01,
//                       }}
//                     >
//                       <Marker
//                         coordinate={{
//                           latitude: position.latitude,
//                           longitude: position.longitude,
//                         }}
//                         title={transport.vehicle_number}
//                         description={`Speed: ${position.speed} km/h`}
//                       />
//                     </MapView>  */}


// <MapView
//   style={{ height: 300, width: "100%" }}
//   region={{
//     latitude: 28.6139,    // Delhi
//     longitude: 77.2090,
//     latitudeDelta: 0.01,
//     longitudeDelta: 0.01,
//   }}
// >
//   <Marker
//     coordinate={{
//       latitude: 28.6139,
//       longitude: 77.2090,
//     }}
//     title="Test Bus"
//     description="Speed: 40 km/h"
//   />
// </MapView>

//                   </View>

//                   {/* Map Controls */}
//                   <View className="flex-row rounded-lg overflow-hidden border border-[#E5E5E5]">
//                     {["street", "satellite", "hybrid"].map((view) => (
//                       <TouchableOpacity
//                         key={view}
//                         onPress={() => setMapView(view as any)}
//                         className={`flex-1 py-2 items-center ${mapView === view ? "bg-[#6A5ACD]" : "bg-[#F8F9FA]"}`}
//                       >
//                         <Typography
//                           className={`text-xs font-semibold capitalize ${mapView === view ? "text-white" : "text-[#2C3E50]"
//                             }`}
//                         >
//                           {view}
//                         </Typography>
//                       </TouchableOpacity>
//                     ))}
//                   </View>
//                 </View>
//               </View>

//               {/* Quick Actions */}
//               <View className="px-4 mb-5">
//                 <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
//                   <Typography className="text-lg font-bold text-[#2C3E50] mb-4">Quick Actions</Typography>
//                   <View className="gap-3">
//                     <TouchableOpacity
//                       onPress={callDriver}
//                       className="flex-row items-center p-3 bg-[#E8F5E8] rounded-xl"
//                     >
//                       <Icon name="phone" size={20} color="#2ECC71" />
//                       <Typography className="text-[#2C3E50] font-semibold ml-3 flex-1">Call Driver</Typography>
//                       <Icon name="chevron-right" size={20} color="#BDC3C7" />
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                       onPress={() => fetchTransportData()}
//                       className="flex-row items-center p-3 bg-[#E3F2FD] rounded-xl"
//                     >
//                       <Icon name="refresh" size={20} color="#1976D2" />
//                       <Typography className="text-[#2C3E50] font-semibold ml-3 flex-1">Refresh Location</Typography>
//                       <Icon name="chevron-right" size={20} color="#BDC3C7" />
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </View>

//               {/* Connection Status */}
//               {error && (
//                 <View className="px-4 mb-5">
//                   <View className="bg-red-50 border border-red-200 rounded-2xl p-4">
//                     <View className="flex-row items-center mb-2">
//                       <Icon name="error-outline" size={20} color="#E74C3C" />
//                       <Typography className="text-lg font-bold text-red-800 ml-2">Connection Issue</Typography>
//                     </View>
//                     <Typography className="text-sm text-red-700">{error}</Typography>
//                     <TouchableOpacity
//                       onPress={() => fetchTransportData()}
//                       className="bg-[#E74C3C] px-4 py-2 rounded-lg mt-3 self-start"
//                     >
//                       <Typography className="text-white font-semibold">Retry</Typography>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               )}
//             </>
//           ) : (
//             /* No Transport Available */
//             <View className="px-4 -mt-8 mb-5">
//               <View className="bg-white rounded-2xl shadow-lg elevation-5">
//                 <EmptyStateIllustration />
//               </View>
//             </View>
//           )}
//         </>
//       )}
//     </ScrollView>
//   )
// }

// export default TransportScreen



import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Linking,
} from "react-native"
import { WebView } from 'react-native-webview';
import Icon from "react-native-vector-icons/MaterialIcons"
import { useRouter } from "expo-router"
import { get_trasnport_details } from "@/service/student/transport"
import type { TransportDetails, Position, TRACK_DATA } from "@/types/transport"
import { get_access_token } from "@/utils/accessToken"
import { io, Socket } from "socket.io-client"
import { Typography } from "@/components/Typography"
import { ApiRoute } from "@/constants/apiRoute"

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
  const [socket, setSocket] = useState<Socket | null>(null)
  const webViewRef = useRef<WebView>(null);

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
      
      // Update marker position
      updateMarkerPosition(res?.vehicle_details?.latitude || 0, res?.vehicle_details?.longitude || 0);
    } catch (error) {
      console.error("Failed to fetch transport details:", error)
      setError("Failed to fetch transport details")
    } finally {
      if (showLoader) setLoading(false)
      setRefreshing(false)
    }
  }

  // Function to update marker position via WebView messaging
  const updateMarkerPosition = (lat: number, lng: number) => {
    if (webViewRef.current && lat !== 0 && lng !== 0) {
      const message = JSON.stringify({
        type: 'UPDATE_MARKER',
        latitude: lat,
        longitude: lng
      });
      webViewRef.current.postMessage(message);
    }
  };

  const makeConnection = async () => {
    console.log("staguiiur")
    const accessToken = await get_access_token()
    const newSocket = io(ApiRoute?.BaseUrl, {
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
        updateMarkerPosition(data?.latitude, data?.longitude);
      }
    })

    newSocket.on("TRACK_UPDATE", (data: TRACK_DATA) => {
      console.log("trcj update",data)
      if (trackVehicleIdRef?.current === data?.vehicle_id) {
        setIsTracking(true)
        setPosition({
          latitude: data?.latitude,
          longitude: data?.longitude,
          speed: data.speed,
          timestamp: data?.timestamp,
        })
        updateMarkerPosition(data?.latitude, data?.longitude);
      }
    })

    newSocket.on("TRACK_STOP", (data: any) => {
      console.log("tracj stop")
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
    console.log("snjkjbfbjjbjdbbo")
    makeConnection()
    
    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
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
      <Typography className="text-xl font-bold text-[#2C3E50] mb-2 text-center">No Transport Assigned</Typography>
      <Typography className="text-sm text-[#7F8C8D] text-center px-8 leading-5">
        You don't have any transport assigned yet. Please contact the school administration.
      </Typography>
    </View>
  )


  const getMapHtml = useCallback(() => {
    const lat = position.latitude || 25.5941
    const lng = position.longitude || 85.1376
    const zoom = 15
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <style>
          body, html { margin: 0; padding: 0; height: 100%; width: 100%; }
          #map { height: 100%; width: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map').setView([${lat}, ${lng}], ${zoom});
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);
          
          var marker = L.marker([${lat}, ${lng}]).addTo(map);
          marker.bindPopup('Vehicle Location').openPopup();
          
          window.addEventListener('message', function(event) {
            try {
              const data = JSON.parse(event.data);
              
              if (data.type === 'UPDATE_MARKER') {
                // Update marker position
                const newLatLng = L.latLng(data.latitude, data.longitude);
                marker.setLatLng(newLatLng);
                
                // Pan map to new position
                map.panTo(newLatLng);
                
                // Update popup content
                marker.bindPopup('Vehicle Location<br>Lat: ' + data.latitude.toFixed(6) + '<br>Lng: ' + data.longitude.toFixed(6)).openPopup();
              }
            } catch (e) {
              console.error('Error processing message:', e);
            }
          });
        </script>
      </body>
      </html>
    `;
  }, [position.latitude, position.longitude]);

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
        <Typography className="text-xl font-bold text-white">Transport</Typography>
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
              <Typography className="text-[#7F8C8D] mt-4">Loading transport details...</Typography>
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
                        <Typography className="text-lg font-bold text-[#2C3E50]">Assigned Transport</Typography>
                        <Typography className="text-sm text-[#7F8C8D]">Your current transport details</Typography>
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
                      <Typography className="text-xs text-[#7F8C8D] mt-1">{isTracking ? "Active" : "Inactive"}</Typography>
                    </View>
                  </View>

                  {/* Transport Info */}
                  <View className="bg-[#F8F9FA] rounded-xl p-4 mb-4">
                    <View className="space-y-3">
                      <View className="flex-row items-center">
                        <Icon name="directions-bus" size={16} color="#6A5ACD" />
                        <Typography className="text-sm text-[#7F8C8D] ml-2 flex-1">Vehicle:</Typography>
                        <Typography className="text-sm font-semibold text-[#2C3E50]">{transport.vehicle_number}</Typography>
                      </View>
                      <View className="flex-row items-center">
                        <Icon name="route" size={16} color="#6A5ACD" />
                        <Typography className="text-sm text-[#7F8C8D] ml-2 flex-1">Route:</Typography>
                        <Typography className="text-sm font-semibold text-[#2C3E50]">{transport.route_name}</Typography>
                      </View>
                      <View className="flex-row items-center">
                        <Icon name="person" size={16} color="#6A5ACD" />
                        <Typography className="text-sm text-[#7F8C8D] ml-2 flex-1">Driver:</Typography>
                        <Typography className="text-sm font-semibold text-[#2C3E50]">{transport.driver_name}</Typography>
                      </View>
                      <View className="flex-row items-center">
                        <Icon name="location-on" size={16} color="#6A5ACD" />
                        <Typography className="text-sm text-[#7F8C8D] ml-2 flex-1">Pickup:</Typography>
                        <Typography className="text-sm font-semibold text-[#2C3E50]">{transport.pickUp_point_name}</Typography>
                      </View>
                    </View>
                  </View>

                  {/* Time Info */}
                  <View className="flex-row gap-3">
                    <View className="flex-1 bg-[#E3F2FD] rounded-xl p-3 items-center">
                      <Icon name="schedule" size={20} color="#1976D2" />
                      <Typography className="text-xs text-[#1976D2] mt-1">Pickup Time</Typography>
                      <Typography className="text-sm font-bold text-[#1976D2]">{transport.departure_time}</Typography>
                    </View>
                    <View className="flex-1 bg-[#E8F5E8] rounded-xl p-3 items-center">
                      <Icon name="schedule" size={20} color="#388E3C" />
                      <Typography className="text-xs text-[#388E3C] mt-1">Drop Time</Typography>
                      <Typography className="text-sm font-bold text-[#388E3C]">{transport.arrival_time}</Typography>
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
                      <Typography className="text-lg font-bold text-[#2C3E50] ml-2">Live Vehicle Tracking</Typography>
                    </View>
                    {!isConnected && (
                      <TouchableOpacity
                        onPress={makeConnection}
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
                          <Typography className="text-sm font-semibold text-[#2C3E50]">{transport.vehicle_number}</Typography>
                          <Typography className="text-xs text-[#7F8C8D]">Driver: {transport.driver_name}</Typography>
                        </View>
                      </View>
                      <View className="items-end">
                        <Typography className="text-sm font-bold text-[#2C3E50]">{position.speed} km/h</Typography>
                        <Typography className="text-xs text-[#7F8C8D]">{formatTimestamp(position.timestamp)}</Typography>
                      </View>
                    </View>
                  </View>

                  {/* Map */}
                  <View className="rounded-xl overflow-hidden border border-[#E5E5E5] mb-4" style={{ height: 300 }}>
                    {position.latitude !== 0 && position.longitude !== 0 ? (
                      <View style={{ flex: 1 }}>
                        <WebView
                          ref={webViewRef}
                          originWhitelist={['*']}
                          source={{ html: getMapHtml() }}
                          style={{ flex: 1 }}
                          javaScriptEnabled={true}
                          domStorageEnabled={true}
                          startInLoadingState={true}
                          renderLoading={() => (
                            <View className="absolute inset-0 items-center justify-center bg-[#F8F9FA]">
                              <ActivityIndicator size="large" color="#6A5ACD" />
                              <Typography className="text-[#7F8C8D] mt-2">Loading map...</Typography>
                            </View>
                          )}
                        />
                      </View>
                    ) : (
                      <View className="flex-1 items-center justify-center bg-[#F8F9FA]">
                        <Icon name="location-off" size={48} color="#BDC3C7" />
                        <Typography className="text-[#7F8C8D] mt-2">Location not available</Typography>
                      </View>
                    )}
                  </View>

                  {/* Coordinates Display */}
                  <View className="bg-[#F8F9FA] rounded-xl p-3">
                    <View className="flex-row justify-between">
                      <View>
                        <Typography className="text-sm text-[#7F8C8D]">Latitude</Typography>
                        <Typography className="text-sm font-semibold text-[#2C3E50]">
                          {position.latitude ? position.latitude.toFixed(6) : "N/A"}
                        </Typography>
                      </View>
                      
                      <View>
                        <Typography className="text-sm text-[#7F8C8D]">Longitude</Typography>
                        <Typography className="text-sm font-semibold text-[#2C3E50]">
                          {position.longitude ? position.longitude.toFixed(6) : "N/A"}
                        </Typography>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* Quick Actions */}
              <View className="px-4 mb-5">
                <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
                  <Typography className="text-lg font-bold text-[#2C3E50] mb-4">Quick Actions</Typography>
                  <View className="gap-3">
                    <TouchableOpacity
                      onPress={callDriver}
                      className="flex-row items-center p-3 bg-[#E8F5E8] rounded-xl"
                    >
                      <Icon name="phone" size={20} color="#2ECC71" />
                      <Typography className="text-[#2C3E50] font-semibold ml-3 flex-1">Call Driver</Typography>
                      <Icon name="chevron-right" size={20} color="#BDC3C7" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => fetchTransportData()}
                      className="flex-row items-center p-3 bg-[#E3F2FD] rounded-xl"
                    >
                      <Icon name="refresh" size={20} color="#1976D2" />
                      <Typography className="text-[#2C3E50] font-semibold ml-3 flex-1">Refresh Location</Typography>
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
                      <Typography className="text-lg font-bold text-red-800 ml-2">Connection Issue</Typography>
                    </View>
                    <Typography className="text-sm text-red-700">{error}</Typography>
                    <TouchableOpacity
                      onPress={() => fetchTransportData()}
                      className="bg-[#E74C3C] px-4 py-2 rounded-lg mt-3 self-start"
                    >
                      <Typography className="text-white font-semibold">Retry</Typography>
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