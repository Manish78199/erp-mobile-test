"use client"

import { useState } from "react"
import { View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import RNPickerSelect from "react-native-picker-select"
import { cn } from "@/utils/cn"
import { Typography } from "@/components/Typography"
import { useRouter } from "expo-router"

interface TransportAssignment {
  _id: string
  student_name: string
  admission_no: string
  pickup_point: string
  route: string
  monthly_fee: number
  status: "active" | "inactive"
}

export default function TransportSearchForm() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<TransportAssignment[]>([])

  // Mock data
  const classes = [
    { _id: "1", name: "Class 1", classCode: "A" },
    { _id: "2", name: "Class 2", classCode: "B" },
  ]

  const mockResults: TransportAssignment[] = [
    {
      _id: "1",
      student_name: "John Doe",
      admission_no: "ADM001",
      pickup_point: "Point A",
      route: "Route A",
      monthly_fee: 500,
      status: "active",
    },
    {
      _id: "2",
      student_name: "Jane Smith",
      admission_no: "ADM002",
      pickup_point: "Point B",
      route: "Route B",
      monthly_fee: 600,
      status: "active",
    },
  ]

  const handleSearch = async () => {
    if (!searchQuery.trim() && !selectedClass) {
      return
    }

    setIsSearching(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setResults(mockResults)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center p-4">
        <TouchableOpacity
          onPress={() => router.push("/management/transport")}
          className="flex-row items-center bg-white border border-border rounded-lg px-3 py-2 mr-2"
        >
          <Typography className="text-primary font-semibold">← Back</Typography>
        </TouchableOpacity>
        <Typography className="text-lg font-bold text-foreground"> Transport Assignment</Typography>
      </View>

      <ScrollView className="flex-1 bg-background">
        <View className="px-4 mt-3 pb-6 space-y-6">
          <View>
            <Typography className="text-2xl font-bold text-gray-900">Search Transport Assignments</Typography>
            <Typography className="text-sm mt-1 text-gray-600">
              Find transport assignments by student or class
            </Typography>
          </View>

          <View className="rounded-lg p-4 border border-gray-200 bg-white space-y-4">
            <View className="flex-row items-center gap-2 mb-4">
              <View className="p-2 bg-orange-500 rounded-lg">
                <MaterialCommunityIcons name="magnify" size={18} color="white" />
              </View>
              <Typography className="text-lg font-semibold text-gray-900">Search Criteria</Typography>
            </View>

            <View>
              <Typography className="text-sm font-medium text-gray-700 mb-2">Search by Student Name or ID</Typography>
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Enter student name or admission number"
                placeholderTextColor="#9ca3af"
                className="px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-gray-50"
              />
            </View>

            <View>
              <Typography className="text-sm font-medium text-gray-700 mb-2">Or Select Class</Typography>
              <RNPickerSelect
                items={classes.map((c) => ({ label: c.name, value: c._id }))}
                onValueChange={setSelectedClass}
                placeholder={{ label: "-- Select Class --" }}
                value={selectedClass}
                style={{
                  inputIOS: {
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    backgroundColor: "#f9fafb",
                    color: "#000",
                  },
                  inputAndroid: {
                    paddingVertical: 0,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    backgroundColor: "#f9fafb",
                    color: "#000",
                  },
                }}
              />
            </View>

            <TouchableOpacity
              onPress={handleSearch}
              disabled={isSearching}
              className="bg-orange-600 rounded-lg p-3 flex-row items-center justify-center gap-2 mt-4"
            >
              {isSearching ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <MaterialCommunityIcons name="magnify" size={18} color="white" />
                  <Typography className="text-white font-medium">Search</Typography>
                </>
              )}
            </TouchableOpacity>
          </View>

          {results.length > 0 && (
            <View className="rounded-lg p-4 border border-gray-200 bg-white space-y-3">
              <Typography className="text-lg font-semibold text-gray-900">Results ({results.length})</Typography>

              {results.map((result) => (
                <View key={result._id} className="p-3 border border-gray-200 rounded-lg">
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-1">
                      <Typography className="font-semibold text-gray-900">{result.student_name}</Typography>
                      <Typography className="text-xs text-gray-600">{result.admission_no}</Typography>
                    </View>
                    <View
                      className={cn("px-2 py-1 rounded", result.status === "active" ? "bg-green-100" : "bg-gray-100")}
                    >
                      <Typography
                        className={cn(
                          "text-xs font-medium",
                          result.status === "active" ? "text-green-800" : "text-gray-800",
                        )}
                      >
                        {result.status === "active" ? "Active" : "Inactive"}
                      </Typography>
                    </View>
                  </View>

                  <View className="space-y-1">
                    <View className="flex-row items-center gap-2">
                      <MaterialCommunityIcons name="route" size={14} color="#6b7280" />
                      <Typography className="text-sm text-gray-700">{result.route}</Typography>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <MaterialCommunityIcons name="map-marker" size={14} color="#6b7280" />
                      <Typography className="text-sm text-gray-700">{result.pickup_point}</Typography>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <MaterialCommunityIcons name="currency-inr" size={14} color="#6b7280" />
                      <Typography className="text-sm text-gray-700">₹{result.monthly_fee}/month</Typography>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {!isSearching && results.length === 0 && searchQuery === "" && selectedClass === "" && (
            <View className="rounded-lg p-8 border border-gray-200 bg-gray-50 items-center">
              <MaterialCommunityIcons name="magnify" size={48} color="#d1d5db" />
              <Typography className="text-gray-600 mt-4 text-center">
                Enter search criteria to find transport assignments
              </Typography>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
