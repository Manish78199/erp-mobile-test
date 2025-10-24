"use client"

import { useState, useMemo } from "react"
import { View, Text, ScrollView, TouchableOpacity, FlatList, RefreshControl, Modal, TextInput } from "react-native"
import { useRouter } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useTimeTables } from "@/hooks/management/timetable"

export default function TimetableScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { data: timetables = [], isError, isLoading } = useTimeTables()
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterClass, setFilterClass] = useState("all")
  const [previewTt, setPreviewTt] = useState<any | null>(null)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      // Refetch data - the hook will handle the API call
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      console.error("Error refreshing timetables:", error)
    } finally {
      setRefreshing(false)
    }
  }

  const filteredTimetables = useMemo(() => {
    return timetables.filter((timetable: any) => {
      const matchesSearch =
        timetable.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        timetable.section_name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesClass = filterClass === "all" || timetable.class_name === filterClass
      return matchesSearch && matchesClass
    })
  }, [timetables, searchTerm, filterClass])

  const uniqueClasses = useMemo(() => {
    return ["all", ...new Set(timetables.map((t: any) => t.class_name))]
  }, [timetables])

  const isActiveTimetable = (timetable: any) => {
    return Object.values(timetable.timetable).some((day: any) => day.length > 0)
  }

  const getTotalStats = () => {
    const totalSubjects = new Set(
      timetables.flatMap((t: any) =>
        Object.values(t.timetable).flatMap((day: any) => day.map((p: any) => p.subject_name)),
      ),
    ).size
    const totalSlots = Math.max(
      ...timetables.map((t: any) => Math.max(...Object.values(t.timetable).map((day: any) => day.length))),
    )
    const activeTimetables = timetables.filter(isActiveTimetable).length
    return { totalSubjects, totalSlots, activeTimetables }
  }

  const stats = getTotalStats()

  const renderStatCard = (icon: string, label: string, value: number) => (
    <View className="flex-1 rounded-lg p-3 border mr-2" style={{ backgroundColor: "#ffffff", borderColor: "#e4e4e4" }}>
      <Text className="text-xs mb-2" style={{ color: "#050109" }}>
        {label}
      </Text>
      <View className="flex-row items-center">
        <MaterialIcons name={icon as any} size={24} color="#6366f1" />
        <Text className="text-xl font-bold ml-2" style={{ color: "#050109" }}>
          {value}
        </Text>
      </View>
    </View>
  )

  const renderTimetableCard = ({ item }: { item: any }) => (
    <View className="rounded-lg p-4 mb-4 border" style={{ backgroundColor: "#ffffff", borderColor: "#e4e4e4" }}>
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="font-semibold text-base" style={{ color: "#050109" }}>
            {item.class_name} - Section {item.section_name}
          </Text>
        </View>
        <View className={`px-2 py-1 rounded ${isActiveTimetable(item) ? "bg-green-100" : "bg-red-100"}`}>
          <Text className={`text-xs font-medium ${isActiveTimetable(item) ? "text-green-700" : "text-red-700"}`}>
            {isActiveTimetable(item) ? "Active" : "Inactive"}
          </Text>
        </View>
      </View>

      {/* Weekly Schedule Preview */}
      <View className="mb-4">
        <Text className="text-xs font-medium mb-2" style={{ color: "#050109" }}>
          Weekly Schedule
        </Text>
        <View className="flex-row flex-wrap gap-1">
          {Object.keys(item.timetable).map((day) => (
            <View key={day} className="rounded px-2 py-1 flex-1 min-w-[45px]" style={{ backgroundColor: "#f3f5f7" }}>
              <Text className="text-xs text-center font-medium" style={{ color: "#050109" }}>
                {day.substring(0, 3)}
              </Text>
              <Text className="text-[10px] text-center mt-1" style={{ color: "#050109" }}>
                {item.timetable[day]?.length || 0}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* View Button */}
      <TouchableOpacity
        onPress={() => setPreviewTt(item)}
        className="rounded-lg p-3 flex-row items-center justify-center"
        style={{ backgroundColor: "#f3f5f7" }}
      >
        <MaterialIcons name="visibility" size={16} color="#6366f1" />
        <Text className="text-sm font-medium ml-2" style={{ color: "#6366f1" }}>
          View Details
        </Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View className="flex-1" style={{ backgroundColor: "#f3f5f7", paddingTop: insets.top }}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#6366f1"
            progressBackgroundColor="#e4e4e4"
          />
        }
      >
        {/* Header */}
        <LinearGradient
          colors={["#4f46e5", "#6366f1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-4 py-6"
        >
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-white text-2xl font-bold">Timetables</Text>
              <Text className="text-indigo-100 text-sm mt-1">Manage class schedules</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/management/timetable/create")}
              className="px-3 py-2 rounded-lg flex-row items-center"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              <MaterialIcons name="add" size={20} color="white" />
              <Text className="text-white text-sm font-medium ml-1">New</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Stats Cards */}
        <View className="px-4 py-4">
          <View className="flex-row mb-2">
            {renderStatCard("calendar-today", "Total", timetables.length)}
            {renderStatCard("book", "Subjects", stats.totalSubjects)}
          </View>
          <View className="flex-row">
            {renderStatCard("schedule", "Slots", stats.totalSlots)}
            {renderStatCard("check-circle", "Active", stats.activeTimetables)}
          </View>
        </View>

        {/* Search and Filter */}
        <View className="px-4 py-3">
          <View
            className="rounded-lg border px-3 py-2 flex-row items-center mb-3"
            style={{ backgroundColor: "#ffffff", borderColor: "#e4e4e4" }}
          >
            <MaterialIcons name="search" size={18} color="#050109" />
            <TextInput
              placeholder="Search by class or section..."
              placeholderTextColor="#050109"
              value={searchTerm}
              onChangeText={setSearchTerm}
              className="flex-1 ml-2 text-sm"
              style={{ color: "#050109" }}
            />
          </View>

          {/* Class Filter Dropdown */}
          <TouchableOpacity
            onPress={() => setShowFilterDropdown(!showFilterDropdown)}
            className="rounded-lg border px-3 py-3 flex-row items-center justify-between"
            style={{ backgroundColor: "#ffffff", borderColor: "#e4e4e4" }}
          >
            <Text className="text-sm" style={{ color: "#050109" }}>
              {filterClass === "all" ? "All Classes" : filterClass}
            </Text>
            <MaterialIcons name={showFilterDropdown ? "expand-less" : "expand-more"} size={20} color="#050109" />
          </TouchableOpacity>

          {/* Filter Dropdown Menu */}
          {showFilterDropdown && (
            <View
              className="border rounded-lg mt-2 overflow-hidden"
              style={{ backgroundColor: "#ffffff", borderColor: "#e4e4e4" }}
            >
              {uniqueClasses.map((cls) => (
                <TouchableOpacity
                  key={cls}
                  onPress={() => {
                    setFilterClass(cls)
                    setShowFilterDropdown(false)
                  }}
                  className="px-4 py-3 border-b"
                  style={{ borderColor: "#e4e4e4" }}
                >
                  <Text
                    className={cls === filterClass ? "font-medium" : ""}
                    style={{ color: cls === filterClass ? "#6366f1" : "#050109" }}
                  >
                    {cls === "all" ? "All Classes" : cls}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Timetables List */}
        <View className="px-4 pb-6">
          {isLoading ? (
            <View className="py-8 items-center">
              <Text style={{ color: "#050109" }}>Loading timetables...</Text>
            </View>
          ) : isError ? (
            <View className="py-8 items-center">
              <MaterialIcons name="error-outline" size={48} color="#e74c3c" />
              <Text style={{ color: "#050109" }} className="mt-2">
                Error loading timetables
              </Text>
            </View>
          ) : filteredTimetables.length > 0 ? (
            <FlatList
              data={filteredTimetables}
              renderItem={renderTimetableCard}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
            />
          ) : (
            <View className="py-8 items-center">
              <MaterialIcons name="schedule" size={48} color="#050109" />
              <Text style={{ color: "#050109" }} className="mt-2">
                No timetables found
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Preview Modal */}
      <Modal visible={previewTt !== null} transparent animationType="fade" onRequestClose={() => setPreviewTt(null)}>
        <View className="flex-1 bg-black/70 justify-center items-center p-4">
          <View
            className="rounded-lg w-full max-h-[80%] border"
            style={{ backgroundColor: "#ffffff", borderColor: "#e4e4e4" }}
          >
            {/* Modal Header */}
            <View className="flex-row justify-between items-center p-4 border-b" style={{ borderColor: "#e4e4e4" }}>
              <Text className="font-bold text-lg" style={{ color: "#050109" }}>
                {previewTt?.class_name} - Section {previewTt?.section_name}
              </Text>
              <TouchableOpacity onPress={() => setPreviewTt(null)}>
                <MaterialIcons name="close" size={24} color="#050109" />
              </TouchableOpacity>
            </View>

            {/* Modal Content - Timetable Table */}
            <ScrollView className="p-4" horizontal showsHorizontalScrollIndicator={false}>
              {previewTt &&
                (() => {
                  const days = Object.keys(previewTt.timetable)
                  const shortDays = days.map((d) => d.substring(0, 3))
                  const maxSlots = Math.max(...Object.values(previewTt.timetable).map((day: any) => day.length))

                  return (
                    <View>
                      {/* Table Header */}
                      <View className="flex-row mb-2">
                        <View
                          className="w-16 rounded-t-lg p-2 border"
                          style={{ backgroundColor: "#f3f5f7", borderColor: "#e4e4e4" }}
                        >
                          <Text className="text-xs font-bold text-center" style={{ color: "#050109" }}>
                            Slot
                          </Text>
                        </View>
                        {shortDays.map((day, idx) => (
                          <View
                            key={idx}
                            className="w-24 rounded-t-lg p-2 border"
                            style={{ backgroundColor: "#f3f5f7", borderColor: "#e4e4e4" }}
                          >
                            <Text className="text-xs font-bold text-center" style={{ color: "#050109" }}>
                              {day}
                            </Text>
                          </View>
                        ))}
                      </View>

                      {/* Table Rows */}
                      {Array.from({ length: maxSlots }).map((_, slotIdx) => (
                        <View key={slotIdx} className="flex-row mb-1">
                          <View
                            className="w-16 p-2 border"
                            style={{ backgroundColor: "#f3f5f7", borderColor: "#e4e4e4" }}
                          >
                            <Text className="text-xs text-center" style={{ color: "#050109" }}>
                              {slotIdx + 1}
                            </Text>
                          </View>
                          {days.map((day) => {
                            const period = previewTt.timetable[day]?.[slotIdx]
                            return (
                              <View
                                key={day}
                                className="w-24 p-2 border"
                                style={{ backgroundColor: "#ffffff", borderColor: "#e4e4e4" }}
                              >
                                {period ? (
                                  <View>
                                    <Text className="text-xs font-semibold" style={{ color: "#050109" }}>
                                      {period.subject_name}
                                    </Text>
                                    <Text className="text-[10px] mt-1" style={{ color: "#050109" }}>
                                      {period.start_time}
                                    </Text>
                                    <Text className="text-[9px]" style={{ color: "#050109" }}>
                                      {period.teacher_name}
                                    </Text>
                                  </View>
                                ) : (
                                  <Text className="text-xs" style={{ color: "#050109" }}>
                                    -
                                  </Text>
                                )}
                              </View>
                            )
                          })}
                        </View>
                      ))}
                    </View>
                  )
                })()}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}
