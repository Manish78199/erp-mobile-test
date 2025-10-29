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
    <View className="flex-1 rounded-lg p-3 border border-gray-200  bg-white  mr-2">
      <Typography className="text-xs font-medium text-gray-600  mb-2">{label}</Typography>
      <View className="flex-row items-center">
        <MaterialIcons name={icon as any} size={24} color="#6366f1" />
        <Typography className="text-xl font-bold ml-2 text-gray-900 ">{value}</Typography>
      </View>
    </View>
  )

  const renderTimetableCard = ({ item }: { item: any }) => (
    <View className="rounded-lg p-4 mb-4 border border-gray-200  bg-white ">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Typography className="font-semibold text-base text-gray-900 ">
            {item.class_name} - Section {item.section_name}
          </Typography>
        </View>
        <View
          className={cn(
            "px-2 py-1 rounded",
            isActiveTimetable(item) ? "bg-green-100 " : "bg-red-100 ",
          )}
        >
          <Typography
            className={cn(
              "text-xs font-medium",
              isActiveTimetable(item) ? "text-green-700 " : "text-red-700 ",
            )}
          >
            {isActiveTimetable(item) ? "Active" : "Inactive"}
          </Typography>
        </View>
      </View>

      {/* Weekly Schedule Preview */}
      <View className="mb-4">
        <Typography className="text-xs font-medium text-gray-900  mb-2">Weekly Schedule</Typography>
        <View className="flex-row flex-wrap gap-1">
          {Object.keys(item.timetable).map((day) => (
            <View key={day} className="rounded px-2 py-1 flex-1 min-w-[45px] bg-gray-100 ">
              <Typography className="text-xs text-center font-medium text-gray-900 ">
                {day.substring(0, 3)}
              </Typography>
              <Typography className="text-[10px] text-center mt-1 text-gray-600 ">
                {item.timetable[day]?.length || 0}
              </Typography>
            </View>
          ))}
        </View>
      </View>

      {/* View Button */}
      <TouchableOpacity
        onPress={() => setPreviewTt(item)}
        className="rounded-lg p-3 flex-row items-center justify-center bg-gray-100 "
      >
        <MaterialIcons name="visibility" size={16} color="#6366f1" />
        <Typography className="text-sm font-medium ml-2 text-indigo-600 ">View Details</Typography>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        <View className="flex-row items-center p-4">
          <TouchableOpacity
            onPress={() => router.push("/management")}
            className="flex-row items-center bg-white border border-border rounded-lg px-3 py-2 mr-2"
          >
            <Typography className="text-primary font-semibold">← Back</Typography>
          </TouchableOpacity>

          <Typography className="text-lg font-bold text-foreground">Class Timetables</Typography>
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
                <Typography className="text-2xl font-bold text-gray-900 ">Timetables</Typography>
                <Typography className="text-sm mt-1 text-gray-600 ">
                  Manage class timetables
                </Typography>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/management/timetable/create")}
                className="px-3 py-2 rounded-lg flex-row items-center bg-indigo-600"
              >
                <MaterialIcons name="add" size={20} color="white" />
                <Typography className="text-white text-sm font-medium ml-1">New</Typography>
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
            <View className="rounded-lg border border-gray-200  px-3 py-2 flex-row items-center mb-3 bg-white ">
              <MaterialIcons name="search" size={18} color="#6b7280" />
              <TextInput
                placeholder="Search by class or section..."
                placeholderTextColor="#9ca3af"
                value={searchTerm}
                onChangeText={setSearchTerm}
                className="flex-1 ml-2 text-sm text-gray-900 "
              />
            </View>

            <View className="bg-white p-2 rounded-md">
              <StyledPickerSelect
                items={classPickerItems}
                value={filterClass}
                onValueChange={(value) => setFilterClass(value)}
                placeholder={{ label: "-- Select class --", value: null }}
              />
            </View>

          </View>

          {/* Timetables List */}
          <View className="px-4 pb-6">
            {isLoading ? (
              <View className="py-8 items-center">
                <Typography className="text-gray-600 ">Loading timetables...</Typography>
              </View>
            ) : isError ? (
              <View className="py-8 items-center">
                <MaterialIcons name="error-outline" size={48} color="#ef4444" />
                <Typography className="text-gray-600  mt-2">Error loading timetables</Typography>
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
                <Typography className="text-gray-600  mt-2">No timetables found</Typography>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Preview Modal */}
        <Modal visible={previewTt !== null} transparent animationType="fade" onRequestClose={() => setPreviewTt(null)}>
          <View className="flex-1 bg-black/70 justify-center items-center p-4">
            <View className="rounded-lg w-full max-h-[80%] border border-gray-200  bg-white ">
              {/* Modal Header */}
              <View className="flex-row justify-between items-center p-4 border-b border-gray-200 ">
                <Typography className="font-bold text-lg text-gray-900 ">
                  {previewTt?.class_name} - Section {previewTt?.section_name}
                </Typography>
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
                          <View className="w-16 rounded-t-lg p-2 border border-gray-200  bg-gray-100 ">
                            <Typography className="text-xs font-bold text-center text-gray-900 ">Slot</Typography>
                          </View>
                          {shortDays.map((day, idx) => (
                            <View
                              key={idx}
                              className="w-24 rounded-t-lg p-2 border border-gray-200  bg-gray-100 "
                            >
                              <Typography className="text-xs font-bold text-center text-gray-900 ">{day}</Typography>
                            </View>
                          ))}
                        </View>

                        {/* Table Rows */}
                        {Array.from({ length: maxSlots }).map((_, slotIdx) => (
                          <View key={slotIdx} className="flex-row mb-1">
                            <View className="w-16 p-2 border border-gray-200  bg-gray-100 ">
                              <Typography className="text-xs text-center text-gray-900 ">{slotIdx + 1}</Typography>
                            </View>
                            {days.map((day,ind) => {
                              const period = previewTt.timetable[day]?.[slotIdx]
                              return (
                                <View
                                  key={ind}
                                  className="w-24 p-2 border border-gray-200  bg-white "
                                >
                                  {period ? (
                                    <View>
                                      <Typography className="text-xs font-semibold text-gray-900 ">
                                        {period.subject_name}
                                      </Typography>
                                      <Typography className="text-[10px] mt-1 text-gray-600 ">
                                        {period.start_time}
                                      </Typography>
                                      <Typography className="text-[9px] text-gray-600 ">
                                        {period.teacher_name}
                                      </Typography>
                                    </View>
                                  ) : (
                                    <Typography className="text-xs text-gray-400">-</Typography>
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
