"use client"

import { useState, useMemo } from "react"
import { View, Text, ScrollView, TouchableOpacity, FlatList, RefreshControl, Modal, TextInput } from "react-native"
import { useRouter } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useTimeTables } from "@/hooks/management/timetable"
import { cn } from "@/utils/cn"
import { StyledPickerSelect } from "@/components/styled-picker-select"
import { Typography } from "@/components/Typography"

export default function TimetableScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { data: timetables = [], isError, isLoading } = useTimeTables()
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterClass, setFilterClass] = useState("all")
  const [previewTt, setPreviewTt] = useState<any | null>(null)

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
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

  const classPickerItems = uniqueClasses.map((cls) => ({
    label: cls === "all" ? "All Classes" : cls,
    value: cls,
  }))

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
    <View className="flex-1 rounded-lg p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mr-2">
      <Text className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">{label}</Text>
      <View className="flex-row items-center">
        <MaterialIcons name={icon as any} size={24} color="#6366f1" />
        <Text className="text-xl font-bold ml-2 text-gray-900 dark:text-white">{value}</Text>
      </View>
    </View>
  )

  const renderTimetableCard = ({ item }: { item: any }) => (
    <View className="rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="font-semibold text-base text-gray-900 dark:text-white">
            {item.class_name} - Section {item.section_name}
          </Text>
        </View>
        <View
          className={cn(
            "px-2 py-1 rounded",
            isActiveTimetable(item) ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900",
          )}
        >
          <Text
            className={cn(
              "text-xs font-medium",
              isActiveTimetable(item) ? "text-green-700 dark:text-green-200" : "text-red-700 dark:text-red-200",
            )}
          >
            {isActiveTimetable(item) ? "Active" : "Inactive"}
          </Text>
        </View>
      </View>

      {/* Weekly Schedule Preview */}
      <View className="mb-4">
        <Text className="text-xs font-medium text-gray-900 dark:text-white mb-2">Weekly Schedule</Text>
        <View className="flex-row flex-wrap gap-1">
          {Object.keys(item.timetable).map((day) => (
            <View key={day} className="rounded px-2 py-1 flex-1 min-w-[45px] bg-gray-100 dark:bg-gray-700">
              <Text className="text-xs text-center font-medium text-gray-900 dark:text-white">
                {day.substring(0, 3)}
              </Text>
              <Text className="text-[10px] text-center mt-1 text-gray-600 dark:text-gray-400">
                {item.timetable[day]?.length || 0}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* View Button */}
      <TouchableOpacity
        onPress={() => setPreviewTt(item)}
        className="rounded-lg p-3 flex-row items-center justify-center bg-gray-100 dark:bg-gray-700"
      >
        <MaterialIcons name="visibility" size={16} color="#6366f1" />
        <Text className="text-sm font-medium ml-2 text-indigo-600 dark:text-indigo-400">View Details</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        <View className="flex-row items-center p-4">
          <TouchableOpacity
            onPress={() => router.push("/management")}
            className="flex-row items-center bg-input border border-border rounded-lg px-3 py-2 mr-2"
          >
            <Typography className="text-primary font-semibold">← Back</Typography>
          </TouchableOpacity>

          <Typography className=" font-bold text-foreground">Class Timetables</Typography>
        </View>
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#6366f1"
              progressBackgroundColor="#e5e7eb"
            />
          }
        >
          <View className="px-4 py-6 ">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Typography className="text-2xl font-bold text-gray-900 dark:text-white">Timetables</Typography>
                <Typography className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                  Manage class schedules
                </Typography>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/management/timetable/create")}
                className="px-3 py-2 rounded-lg flex-row items-center bg-indigo-600"
              >
                <MaterialIcons name="add" size={20} color="white" />
                <Text className="text-white text-sm font-medium ml-1">New</Text>
              </TouchableOpacity>
            </View>
          </View>

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
            <View className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 flex-row items-center mb-3 bg-white dark:bg-gray-800">
              <MaterialIcons name="search" size={18} color="#6b7280" />
              <TextInput
                placeholder="Search by class or section..."
                placeholderTextColor="#9ca3af"
                value={searchTerm}
                onChangeText={setSearchTerm}
                className="flex-1 ml-2 text-sm text-gray-900 dark:text-white"
              />
            </View>

            <View className="bg-white p-2 rounded-md">
              <StyledPickerSelect
                items={classPickerItems}
                value={filterClass}
                onValueChange={(value) => setFilterClass(value)}
                placeholder={{ label: "Select a class...", value: null }}
              />
            </View>

          </View>

          {/* Timetables List */}
          <View className="px-4 pb-6">
            {isLoading ? (
              <View className="py-8 items-center">
                <Text className="text-gray-600 dark:text-gray-400">Loading timetables...</Text>
              </View>
            ) : isError ? (
              <View className="py-8 items-center">
                <MaterialIcons name="error-outline" size={48} color="#ef4444" />
                <Text className="text-gray-600 dark:text-gray-400 mt-2">Error loading timetables</Text>
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
                <MaterialIcons name="schedule" size={48} color="#d1d5db" />
                <Text className="text-gray-600 dark:text-gray-400 mt-2">No timetables found</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Preview Modal */}
        <Modal visible={previewTt !== null} transparent animationType="fade" onRequestClose={() => setPreviewTt(null)}>
          <View className="flex-1 bg-black/70 justify-center items-center p-4">
            <View className="rounded-lg w-full max-h-[80%] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              {/* Modal Header */}
              <View className="flex-row justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <Text className="font-bold text-lg text-gray-900 dark:text-white">
                  {previewTt?.class_name} - Section {previewTt?.section_name}
                </Text>
                <TouchableOpacity onPress={() => setPreviewTt(null)}>
                  <MaterialIcons name="close" size={24} color="#6b7280" />
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
                          <View className="w-16 rounded-t-lg p-2 border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700">
                            <Text className="text-xs font-bold text-center text-gray-900 dark:text-white">Slot</Text>
                          </View>
                          {shortDays.map((day, idx) => (
                            <View
                              key={idx}
                              className="w-24 rounded-t-lg p-2 border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700"
                            >
                              <Text className="text-xs font-bold text-center text-gray-900 dark:text-white">{day}</Text>
                            </View>
                          ))}
                        </View>

                        {/* Table Rows */}
                        {Array.from({ length: maxSlots }).map((_, slotIdx) => (
                          <View key={slotIdx} className="flex-row mb-1">
                            <View className="w-16 p-2 border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700">
                              <Text className="text-xs text-center text-gray-900 dark:text-white">{slotIdx + 1}</Text>
                            </View>
                            {days.map((day) => {
                              const period = previewTt.timetable[day]?.[slotIdx]
                              return (
                                <View
                                  key={day}
                                  className="w-24 p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                                >
                                  {period ? (
                                    <View>
                                      <Text className="text-xs font-semibold text-gray-900 dark:text-white">
                                        {period.subject_name}
                                      </Text>
                                      <Text className="text-[10px] mt-1 text-gray-600 dark:text-gray-400">
                                        {period.start_time}
                                      </Text>
                                      <Text className="text-[9px] text-gray-600 dark:text-gray-400">
                                        {period.teacher_name}
                                      </Text>
                                    </View>
                                  ) : (
                                    <Text className="text-xs text-gray-400 dark:text-gray-500">-</Text>
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
    </SafeAreaView>
  )
}
