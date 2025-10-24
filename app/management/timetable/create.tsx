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
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        {/* Header */}
        <Text className="text-2xl font-bold text-foreground mb-6">Create New Timetable</Text>

        {/* Basic Information Card */}
        <View className="bg-card border border-border rounded-lg p-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">Basic Information</Text>

          {/* Class Select */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-foreground mb-2">Class *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
              {classes.map((item) => (
                <TouchableOpacity
                  key={item._id}
                  onPress={() => handleInputChange("class_id", item._id)}
                  className={`px-4 py-2 rounded-lg border ${
                    formData.class_id === item._id ? "bg-primary border-primary" : "bg-card border-border"
                  }`}
                >
                  <Text className={formData.class_id === item._id ? "text-primary-foreground" : "text-foreground"}>
                    {item?.name} ({item?.classCode})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Section Select */}
          <View>
            <Text className="text-sm font-medium text-foreground mb-2">Section *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
              {sections?.map((item: any) => (
                <TouchableOpacity
                  key={item._id}
                  onPress={() => handleInputChange("section_id", item._id)}
                  className={`px-4 py-2 rounded-lg border ${
                    formData.section_id === item._id ? "bg-primary border-primary" : "bg-card border-border"
                  }`}
                >
                  <Text className={formData.section_id === item._id ? "text-primary-foreground" : "text-foreground"}>
                    {item?.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Time Slots Card */}
        <View className="bg-card border border-border rounded-lg p-4 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-foreground">Time Slots</Text>
            <TouchableOpacity
              onPress={addTimeSlot}
              className="bg-primary px-3 py-2 rounded-lg flex-row items-center gap-1"
            >
              <Plus size={16} color="white" />
              <Text className="text-primary-foreground text-sm font-medium">Add</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={timeSlots}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item: slot, index }) => (
              <View className="p-3 border border-border rounded-lg bg-muted mb-3">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-sm font-medium text-foreground">Period {index + 1}</Text>
                  <TouchableOpacity onPress={() => removeTimeSlot(slot.id)} className="bg-destructive p-2 rounded-lg">
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
                        className="flex-1 border border-border rounded px-2 py-1 text-foreground"
                      />
                      <TouchableOpacity onPress={() => setEditingTimeSlot(null)} className="bg-primary p-2 rounded">
                        <Check size={14} color="white" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setEditingTimeSlot(`${slot.id}-start`)}
                      className="flex-row items-center gap-2 p-2"
                    >
                      <Text className="text-sm font-mono text-foreground">{slot.start_time}</Text>
                      <Edit2 size={12} color="gray" />
                    </TouchableOpacity>
                  )}
                </View>

                <Text className="text-xs text-muted-foreground text-center mb-2">to</Text>

                {/* End Time */}
                <View>
                  {editingTimeSlot === `${slot.id}-end` ? (
                    <View className="flex-row items-center gap-2">
                      <TextInput
                        value={slot.end_time}
                        onChangeText={(value) => handleTimeSlotEdit(slot.id, "end_time", value)}
                        placeholder="HH:MM"
                        className="flex-1 border border-border rounded px-2 py-1 text-foreground"
                      />
                      <TouchableOpacity onPress={() => setEditingTimeSlot(null)} className="bg-primary p-2 rounded">
                        <Check size={14} color="white" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setEditingTimeSlot(`${slot.id}-end`)}
                      className="flex-row items-center gap-2 p-2"
                    >
                      <Text className="text-sm font-mono text-foreground">{slot.end_time}</Text>
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
                  className={`px-4 py-2 rounded-lg border min-w-20 items-center ${
                    selectedDay === day.id ? "bg-primary border-primary" : "bg-card border-border"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      selectedDay === day.id ? "text-primary-foreground" : "text-foreground"
                    }`}
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
                  className="absolute -top-2 -right-2 w-5 h-5 bg-destructive rounded-full items-center justify-center"
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
              className="bg-secondary px-3 py-2 rounded-lg flex-row items-center gap-1"
            >
              <Copy size={14} color="black" />
              <Text className="text-secondary-foreground text-xs font-medium">Copy Prev</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={fillAllDaysLikeCurrent}
            className="bg-secondary px-3 py-2 rounded-lg flex-row items-center gap-1"
          >
            <Text className="text-secondary-foreground text-xs font-medium">Apply All</Text>
          </TouchableOpacity>
        </View>

        {/* Periods Card */}
        <View className="bg-card border border-border rounded-lg p-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">Periods</Text>

          <FlatList
            data={timeSlots}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item: slot, index }) => {
              const key = `${selectedDay}-${slot.id}`
              const entry = timetableEntries[key]

              return (
                <View className="border border-border rounded-lg p-3 mb-3">
                  <Text className="text-xs font-medium text-foreground mb-3">
                    Period {index + 1}: {slot.start_time} - {slot.end_time}
                  </Text>

                  {/* Subject Select */}
                  <View className="mb-2">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                      {subjects.map((s: any) => (
                        <TouchableOpacity
                          key={s.id ?? s._id}
                          onPress={() => handleEntryChange(selectedDay, slot.id, "subject_id", s.id ?? s._id)}
                          className={`px-3 py-2 rounded-lg border flex-row items-center gap-1 ${
                            entry?.subject_id === (s.id ?? s._id)
                              ? "bg-primary border-primary"
                              : "bg-card border-border"
                          }`}
                        >
                          <View className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color ?? "#666" }} />
                          <Text
                            className={`text-xs font-medium ${
                              entry?.subject_id === (s.id ?? s._id) ? "text-primary-foreground" : "text-foreground"
                            }`}
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
                        className={`px-3 py-2 rounded-lg border ${
                          entry?.teacher_id === t._id ? "bg-primary border-primary" : "bg-card border-border"
                        }`}
                      >
                        <Text
                          className={`text-xs font-medium ${
                            entry?.teacher_id === t._id ? "text-primary-foreground" : "text-foreground"
                          }`}
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
        <View className="bg-card border border-border rounded-lg p-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">Preview Timetable</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              {/* Table Header */}
              <View className="flex-row border-b border-border">
                <View className="w-20 p-2 border-r border-border">
                  <Text className="text-xs font-bold text-foreground">Day</Text>
                </View>
                {timeSlots.map((slot, i) => (
                  <View key={slot.id} className="w-24 p-2 border-r border-border items-center">
                    <Text className="text-xs font-bold text-foreground">Period {i + 1}</Text>
                    <Text className="text-[10px] text-muted-foreground">
                      {slot.start_time} - {slot.end_time}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Table Body */}
              {daysOfWeek.map((day) => (
                <View key={day.id} className="flex-row border-b border-border">
                  <View className="w-20 p-2 border-r border-border justify-center">
                    <Text className="text-xs font-medium text-foreground">{day.name.slice(0, 3)}</Text>
                  </View>
                  {timeSlots.map((slot) => {
                    const key = `${day.id}-${slot.id}`
                    const entry = timetableEntries[key]
                    const subject = subjects.find((s) => s._id === entry?.subject_id)
                    const teacher = teachers.find((t) => t._id === entry?.teacher_id)

                    return (
                      <View key={key} className="w-24 p-2 border-r border-border items-center justify-center">
                        {entry ? (
                          <View className="items-center gap-1">
                            <Text className="text-[10px] font-medium text-foreground">{subject?.name ?? "—"}</Text>
                            <Text className="text-[8px] text-muted-foreground">{teacher?.name ?? "—"}</Text>
                          </View>
                        ) : (
                          <Text className="text-xs text-muted-foreground">—</Text>
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
            className="flex-1 border border-border rounded-lg py-3 items-center"
          >
            <Text className="text-foreground font-medium">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting || !formData.class_id || !formData.section_id}
            className={`flex-1 rounded-lg py-3 items-center flex-row justify-center gap-2 ${
              isSubmitting || !formData.class_id || !formData.section_id ? "bg-muted" : "bg-primary"
            }`}
          >
            <Save size={16} color={isSubmitting || !formData.class_id || !formData.section_id ? "gray" : "white"} />
            <Text
              className={
                isSubmitting || !formData.class_id || !formData.section_id
                  ? "text-muted-foreground font-medium"
                  : "text-primary-foreground font-medium"
              }
            >
              {isSubmitting ? "Creating..." : "Create Timetable"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
