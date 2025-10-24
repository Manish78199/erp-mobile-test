"use client"
import { useEffect, useState } from "react"
import { View, Text, ScrollView, FlatList, TouchableOpacity, TextInput, Alert } from "react-native"
import { useRouter } from "expo-router"
import { Plus, Trash2, Edit2, Check, Copy, Save } from "lucide-react-native"
import type { TimeSlot, TimetableEntry } from "@/types/timetable"
import { getClassSubject } from "@/service/management/subject"
import { useClasses } from "@/hooks/management/classes"
import { geAllEmployee } from "@/service/management/employee"
import { useClassSections } from "@/hooks/management/section"
import { createTimeTable } from "@/service/management/timetable"

// Default timeslots
const defaultTimeSlots: TimeSlot[] = [
  { id: "1", start_time: "08:00", end_time: "08:45", duration: 45 },
  { id: "2", start_time: "08:45", end_time: "09:30", duration: 45 },
  { id: "3", start_time: "09:45", end_time: "10:30", duration: 45 },
  { id: "4", start_time: "10:30", end_time: "11:15", duration: 45 },
  { id: "5", start_time: "11:30", end_time: "12:15", duration: 45 },
]

export default function NewTimetablePage() {
  const [daysOfWeek, setDaysOfWeeK] = useState([
    { id: 1, name: "MONDAY" },
    { id: 2, name: "TUESDAY" },
    { id: 3, name: "WEDNESDAY" },
    { id: 4, name: "THURSDAY" },
    { id: 5, name: "FRIDAY" },
    { id: 6, name: "SATURDAY" },
    { id: 7, name: "SUNDAY" },
  ])
  const router = useRouter()
  const [subjects, setSubjects] = useState<any[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(defaultTimeSlots)
  const [editingTimeSlot, setEditingTimeSlot] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number>(1)
  const [teachers, setTeachers] = useState<any[]>([])
  const { classes } = useClasses()

  const [formData, setFormData] = useState({
    sequence: 0,
    class_id: "",
    section_id: "",
  })

  const { sections, isLoading, isError } = useClassSections(formData?.class_id)

  useEffect(() => {
    const fetchClassSubject = async () => {
      if (!formData.class_id) return
      const allSubject = await getClassSubject(formData.class_id)
      setSubjects(allSubject || [])
    }
    fetchClassSubject()
  }, [formData.class_id])

  useEffect(() => {
    const fetchTeacher = async () => {
      const allTeacher = await geAllEmployee("TEACHER")
      setTeachers(allTeacher || [])
    }
    fetchTeacher()
  }, [])

  const [timetableEntries, setTimetableEntries] = useState<{ [key: string]: TimetableEntry }>({})

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTimeSlotEdit = (timeSlotId: string, field: "start_time" | "end_time", value: string) => {
    setTimeSlots((prev) => prev.map((slot) => (slot.id === timeSlotId ? { ...slot, [field]: value } : slot)))
    setTimetableEntries((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((k) => {
        if (k.endsWith(`-${timeSlotId}`)) {
          next[k] = { ...next[k], [field]: value }
        }
      })
      return next
    })
  }

  const addTimeSlot = () => {
    const newId = `${Date.now()}`
    const lastSlot = timeSlots[timeSlots.length - 1]
    const newStart = lastSlot ? lastSlot.end_time : "16:00"
    const newEnd = "16:45"
    setTimeSlots((prev) => [...prev, { id: newId, start_time: newStart, end_time: newEnd, duration: 45 }])
  }

  const removeTimeSlot = (timeSlotId: string) => {
    setTimeSlots((prev) => prev.filter((s) => s.id !== timeSlotId))
    setTimetableEntries((prev) => {
      const copy = { ...prev }
      Object.keys(copy).forEach((k) => {
        if (k.endsWith(`-${timeSlotId}`)) delete copy[k]
      })
      return copy
    })
  }

  const handleEntryChange = (day: number, timeSlotId: string, field: string, value: string) => {
    const slot = timeSlots.find((s) => s.id === timeSlotId)
    if (!slot) return
    const sequence = timeSlots.findIndex((s) => s.id === timeSlotId) + 1
    const key = `${day}-${timeSlotId}`

    let teacherId = timetableEntries[key]?.teacher_id ?? null
    if (field === "subject_id") {
      const subject = subjects.find((s: any) => s.id === value || s._id === value)
      teacherId = subject?.teacher ?? teacherId
    }

    setTimetableEntries((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        sequence,
        class_id: formData.class_id,
        section_id: formData.section_id,
        start_time: slot.start_time,
        end_time: slot.end_time,
        day: daysOfWeek.find((d) => d.id === day)?.name,
        subject_id: field === "subject_id" ? value : prev[key]?.subject_id,
        teacher_id: field === "teacher_id" ? value : teacherId,
      } as TimetableEntry,
    }))
  }

  const copyPreviousDay = () => {
    if (selectedDay <= 1) return
    const prevDay = selectedDay - 1
    const newEntries = { ...timetableEntries }
    timeSlots.forEach((slot) => {
      const prevKey = `${prevDay}-${slot.id}`
      const newKey = `${selectedDay}-${slot.id}`
      if (timetableEntries[prevKey]) {
        newEntries[newKey] = {
          ...timetableEntries[prevKey],
          day: daysOfWeek.find((d) => d.id === selectedDay)?.name as string,
        }
      }
    })
    setTimetableEntries(newEntries)
  }

  const fillAllDaysLikeCurrent = () => {
    const currentDayEntries = Object.entries(timetableEntries).filter(([key]) => key.startsWith(`${selectedDay}-`))
    if (currentDayEntries.length === 0) return

    const newEntries = { ...timetableEntries }
    daysOfWeek.forEach((day) => {
      if (day.id === selectedDay) return
      timeSlots.forEach((slot) => {
        const currentKey = `${selectedDay}-${slot.id}`
        const newKey = `${day.id}-${slot.id}`
        if (timetableEntries[currentKey]) {
          newEntries[newKey] = { ...timetableEntries[currentKey], day: day.name }
        }
      })
    })
    setTimetableEntries(newEntries)
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      const data = Object.values(timetableEntries)
      console.log("[TimetableCreate] payload:", data)
      await createTimeTable(data, formData?.class_id)
      Alert.alert("Success", "Timetable created successfully")
      router.back()
    } catch (err) {
      console.error(err)
      Alert.alert("Error", "Failed to create timetable")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: "var(--background-color)" }}>
      <View className="p-4">
        {/* Header */}
        <Text className="text-2xl font-bold mb-6" style={{ color: "var(--text-color)" }}>
          Create New Timetable
        </Text>

        {/* Basic Information Card */}
        <View
          className="border rounded-lg p-4 mb-6"
          style={{
            backgroundColor: "var(--card-background-color)",
            borderColor: "var(--card-border-color)",
          }}
        >
          <Text className="text-lg font-semibold mb-4" style={{ color: "var(--text-color)" }}>
            Basic Information
          </Text>

          {/* Class Select */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>
              Class *
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
              {classes.map((item) => (
                <TouchableOpacity
                  key={item._id}
                  onPress={() => handleInputChange("class_id", item._id)}
                  className="px-4 py-2 rounded-lg border"
                  style={{
                    backgroundColor: formData.class_id === item._id ? "#2563eb" : "var(--card-background-color)",
                    borderColor: formData.class_id === item._id ? "#2563eb" : "var(--card-border-color)",
                  }}
                >
                  <Text
                    className="text-sm font-medium"
                    style={{
                      color: formData.class_id === item._id ? "#ffffff" : "var(--text-color)",
                    }}
                  >
                    {item?.name} ({item?.classCode})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Section Select */}
          <View>
            <Text className="text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>
              Section *
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
              {sections?.map((item: any) => (
                <TouchableOpacity
                  key={item._id}
                  onPress={() => handleInputChange("section_id", item._id)}
                  className="px-4 py-2 rounded-lg border"
                  style={{
                    backgroundColor: formData.section_id === item._id ? "#2563eb" : "var(--card-background-color)",
                    borderColor: formData.section_id === item._id ? "#2563eb" : "var(--card-border-color)",
                  }}
                >
                  <Text
                    className="text-sm font-medium"
                    style={{
                      color: formData.section_id === item._id ? "#ffffff" : "var(--text-color)",
                    }}
                  >
                    {item?.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Time Slots Card */}
        <View
          className="border rounded-lg p-4 mb-6"
          style={{
            backgroundColor: "var(--card-background-color)",
            borderColor: "var(--card-border-color)",
          }}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold" style={{ color: "var(--text-color)" }}>
              Time Slots
            </Text>
            <TouchableOpacity
              onPress={addTimeSlot}
              className="px-3 py-2 rounded-lg flex-row items-center gap-1"
              style={{ backgroundColor: "#2563eb" }}
            >
              <Plus size={16} color="white" />
              <Text className="text-sm font-medium" style={{ color: "#ffffff" }}>
                Add
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={timeSlots}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item: slot, index }) => (
              <View
                className="p-3 border rounded-lg mb-3"
                style={{
                  backgroundColor: "var(--field-background-color)",
                  borderColor: "var(--card-border-color)",
                }}
              >
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-sm font-medium" style={{ color: "var(--text-color)" }}>
                    Period {index + 1}
                  </Text>
                  <TouchableOpacity
                    onPress={() => removeTimeSlot(slot.id)}
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: "#dc2626" }}
                  >
                    <Trash2 size={14} color="white" />
                  </TouchableOpacity>
                </View>

                {/* Start Time */}
                <View className="mb-2">
                  {editingTimeSlot === `${slot.id}-start` ? (
                    <View className="flex-row items-center gap-2">
                      <TextInput
                        value={slot.start_time}
                        onChangeText={(value) => handleTimeSlotEdit(slot.id, "start_time", value)}
                        placeholder="HH:MM"
                        className="flex-1 border rounded px-2 py-1"
                        style={{
                          borderColor: "var(--card-border-color)",
                          color: "var(--text-color)",
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => setEditingTimeSlot(null)}
                        className="p-2 rounded"
                        style={{ backgroundColor: "#2563eb" }}
                      >
                        <Check size={14} color="white" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setEditingTimeSlot(`${slot.id}-start`)}
                      className="flex-row items-center gap-2 p-2"
                    >
                      <Text className="text-sm font-mono" style={{ color: "var(--text-color)" }}>
                        {slot.start_time}
                      </Text>
                      <Edit2 size={12} color="gray" />
                    </TouchableOpacity>
                  )}
                </View>

                <Text className="text-xs text-center mb-2" style={{ color: "var(--nav-text-color)" }}>
                  to
                </Text>

                {/* End Time */}
                <View>
                  {editingTimeSlot === `${slot.id}-end` ? (
                    <View className="flex-row items-center gap-2">
                      <TextInput
                        value={slot.end_time}
                        onChangeText={(value) => handleTimeSlotEdit(slot.id, "end_time", value)}
                        placeholder="HH:MM"
                        className="flex-1 border rounded px-2 py-1"
                        style={{
                          borderColor: "var(--card-border-color)",
                          color: "var(--text-color)",
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => setEditingTimeSlot(null)}
                        className="p-2 rounded"
                        style={{ backgroundColor: "#2563eb" }}
                      >
                        <Check size={14} color="white" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setEditingTimeSlot(`${slot.id}-end`)}
                      className="flex-row items-center gap-2 p-2"
                    >
                      <Text className="text-sm font-mono" style={{ color: "var(--text-color)" }}>
                        {slot.end_time}
                      </Text>
                      <Edit2 size={12} color="gray" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          />
        </View>

        {/* Day Selector */}
        <View className="mb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
            {daysOfWeek.map((day) => (
              <View key={day.id} className="relative">
                <TouchableOpacity
                  onPress={() => setSelectedDay(day.id)}
                  className="px-4 py-2 rounded-lg border min-w-20 items-center"
                  style={{
                    backgroundColor: selectedDay === day.id ? "#2563eb" : "var(--card-background-color)",
                    borderColor: selectedDay === day.id ? "#2563eb" : "var(--card-border-color)",
                  }}
                >
                  <Text
                    className="text-xs font-medium"
                    style={{
                      color: selectedDay === day.id ? "#ffffff" : "var(--text-color)",
                    }}
                  >
                    {day.name.slice(0, 3)}
                  </Text>
                </TouchableOpacity>

                {/* Remove Day Button */}
                <TouchableOpacity
                  onPress={() => {
                    setDaysOfWeeK((prev) => prev.filter((d) => d.id !== day.id))
                    setTimetableEntries((prev) => {
                      const copy = { ...prev }
                      Object.keys(copy).forEach((k) => {
                        if (k.startsWith(`${day.id}-`)) delete copy[k]
                      })
                      return copy
                    })
                    if (selectedDay === day.id && daysOfWeek.length > 1) {
                      const remainingDays = daysOfWeek.filter((d) => d.id !== day.id)
                      setSelectedDay(remainingDays[0].id)
                    }
                  }}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full items-center justify-center"
                  style={{ backgroundColor: "#dc2626" }}
                >
                  <Text className="text-white text-xs font-bold">×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Copy & Fill Buttons */}
        <View className="flex-row gap-2 mb-4 justify-end">
          {selectedDay > 1 && (
            <TouchableOpacity
              onPress={copyPreviousDay}
              className="px-3 py-2 rounded-lg flex-row items-center gap-1"
              style={{ backgroundColor: "var(--field-background-color)" }}
            >
              <Copy size={14} color="var(--text-color)" />
              <Text className="text-xs font-medium" style={{ color: "var(--text-color)" }}>
                Copy Prev
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={fillAllDaysLikeCurrent}
            className="px-3 py-2 rounded-lg flex-row items-center gap-1"
            style={{ backgroundColor: "var(--field-background-color)" }}
          >
            <Text className="text-xs font-medium" style={{ color: "var(--text-color)" }}>
              Apply All
            </Text>
          </TouchableOpacity>
        </View>

        {/* Periods Card */}
        <View
          className="border rounded-lg p-4 mb-6"
          style={{
            backgroundColor: "var(--card-background-color)",
            borderColor: "var(--card-border-color)",
          }}
        >
          <Text className="text-lg font-semibold mb-4" style={{ color: "var(--text-color)" }}>
            Periods
          </Text>

          <FlatList
            data={timeSlots}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item: slot, index }) => {
              const key = `${selectedDay}-${slot.id}`
              const entry = timetableEntries[key]

              return (
                <View className="border rounded-lg p-3 mb-3" style={{ borderColor: "var(--card-border-color)" }}>
                  <Text className="text-xs font-medium mb-3" style={{ color: "var(--text-color)" }}>
                    Period {index + 1}: {slot.start_time} - {slot.end_time}
                  </Text>

                  {/* Subject Select */}
                  <View className="mb-2">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                      {subjects.map((s: any) => (
                        <TouchableOpacity
                          key={s.id ?? s._id}
                          onPress={() => handleEntryChange(selectedDay, slot.id, "subject_id", s.id ?? s._id)}
                          className="px-3 py-2 rounded-lg border flex-row items-center gap-1"
                          style={{
                            backgroundColor:
                              entry?.subject_id === (s.id ?? s._id) ? "#2563eb" : "var(--card-background-color)",
                            borderColor: entry?.subject_id === (s.id ?? s._id) ? "#2563eb" : "var(--card-border-color)",
                          }}
                        >
                          <View className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color ?? "#666" }} />
                          <Text
                            className="text-xs font-medium"
                            style={{
                              color: entry?.subject_id === (s.id ?? s._id) ? "#ffffff" : "var(--text-color)",
                            }}
                          >
                            {s.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Teacher Select */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                    {teachers.map((t) => (
                      <TouchableOpacity
                        key={t._id}
                        onPress={() => handleEntryChange(selectedDay, slot.id, "teacher_id", t._id)}
                        className="px-3 py-2 rounded-lg border"
                        style={{
                          backgroundColor: entry?.teacher_id === t._id ? "#2563eb" : "var(--card-background-color)",
                          borderColor: entry?.teacher_id === t._id ? "#2563eb" : "var(--card-border-color)",
                        }}
                      >
                        <Text
                          className="text-xs font-medium"
                          style={{
                            color: entry?.teacher_id === t._id ? "#ffffff" : "var(--text-color)",
                          }}
                        >
                          {t.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )
            }}
          />
        </View>

        {/* Preview Table */}
        <View
          className="border rounded-lg p-4 mb-6"
          style={{
            backgroundColor: "var(--card-background-color)",
            borderColor: "var(--card-border-color)",
          }}
        >
          <Text className="text-lg font-semibold mb-4" style={{ color: "var(--text-color)" }}>
            Preview Timetable
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              {/* Table Header */}
              <View
                className="flex-row"
                style={{ borderBottomColor: "var(--card-border-color)", borderBottomWidth: 1 }}
              >
                <View
                  className="w-20 p-2"
                  style={{
                    borderRightColor: "var(--card-border-color)",
                    borderRightWidth: 1,
                  }}
                >
                  <Text className="text-xs font-bold" style={{ color: "var(--text-color)" }}>
                    Day
                  </Text>
                </View>
                {timeSlots.map((slot, i) => (
                  <View
                    key={slot.id}
                    className="w-24 p-2 items-center"
                    style={{
                      borderRightColor: "var(--card-border-color)",
                      borderRightWidth: 1,
                    }}
                  >
                    <Text className="text-xs font-bold" style={{ color: "var(--text-color)" }}>
                      Period {i + 1}
                    </Text>
                    <Text className="text-[10px]" style={{ color: "var(--nav-text-color)" }}>
                      {slot.start_time} - {slot.end_time}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Table Body */}
              {daysOfWeek.map((day) => (
                <View
                  key={day.id}
                  className="flex-row"
                  style={{
                    borderBottomColor: "var(--card-border-color)",
                    borderBottomWidth: 1,
                  }}
                >
                  <View
                    className="w-20 p-2 justify-center"
                    style={{
                      borderRightColor: "var(--card-border-color)",
                      borderRightWidth: 1,
                    }}
                  >
                    <Text className="text-xs font-medium" style={{ color: "var(--text-color)" }}>
                      {day.name.slice(0, 3)}
                    </Text>
                  </View>
                  {timeSlots.map((slot) => {
                    const key = `${day.id}-${slot.id}`
                    const entry = timetableEntries[key]
                    const subject = subjects.find((s) => s._id === entry?.subject_id)
                    const teacher = teachers.find((t) => t._id === entry?.teacher_id)

                    return (
                      <View
                        key={key}
                        className="w-24 p-2 items-center justify-center"
                        style={{
                          borderRightColor: "var(--card-border-color)",
                          borderRightWidth: 1,
                        }}
                      >
                        {entry ? (
                          <View className="items-center gap-1">
                            <Text className="text-[10px] font-medium" style={{ color: "var(--text-color)" }}>
                              {subject?.name ?? "—"}
                            </Text>
                            <Text className="text-[8px]" style={{ color: "var(--nav-text-color)" }}>
                              {teacher?.name ?? "—"}
                            </Text>
                          </View>
                        ) : (
                          <Text className="text-xs" style={{ color: "var(--nav-text-color)" }}>
                            —
                          </Text>
                        )}
                      </View>
                    )
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 border rounded-lg py-3 items-center"
            style={{ borderColor: "var(--card-border-color)" }}
          >
            <Text className="font-medium" style={{ color: "var(--text-color)" }}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting || !formData.class_id || !formData.section_id}
            className="flex-1 rounded-lg py-3 items-center flex-row justify-center gap-2"
            style={{
              backgroundColor:
                isSubmitting || !formData.class_id || !formData.section_id
                  ? "var(--field-background-color)"
                  : "#2563eb",
            }}
          >
            <Save size={16} color={isSubmitting || !formData.class_id || !formData.section_id ? "gray" : "white"} />
            <Text
              className="font-medium"
              style={{
                color: isSubmitting || !formData.class_id || !formData.section_id ? "var(--nav-text-color)" : "#ffffff",
              }}
            >
              {isSubmitting ? "Creating..." : "Create Timetable"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
