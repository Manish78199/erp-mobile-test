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
import { cn } from "@/utils/cn"
import { SafeAreaView } from "react-native-safe-area-context"
import { Typography } from "@/components/Typography"

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
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 ">
        <View className="flex-row items-center p-4">
          <TouchableOpacity
            onPress={() => router.push("/management/timetable")}
            className="flex-row items-center bg-input border border-border rounded-lg px-3 py-2 mr-2"
          >
            <Typography className="text-primary font-semibold">← Back</Typography>
          </TouchableOpacity>

          <Typography className=" font-bold text-foreground">New Timetable</Typography>
        </View>
        <View className="p-4">

          <View className="flex-1">
            <Typography className="text-2xl font-bold text-gray-900 ">Create New Timetable</Typography>
            <Typography className="text-sm mt-1 text-gray-600 ">
              Manage class Timetable
            </Typography>
          </View>
          {/* Basic Information Card */}
          <View className="mt-3 border border-gray-200  rounded-lg p-4 mb-6 bg-white ">
            <Typography className="text-lg font-semibold mb-4 text-gray-900 ">Basic Information</Typography>

            {/* Class Select */}
            <View className="mb-4">
              <Typography className="text-sm font-medium mb-2 text-gray-900 ">Class *</Typography>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2 ">
                {classes.map((item) => (
                  <TouchableOpacity
                    key={item._id}
                    onPress={() => handleInputChange("class_id", item._id)}
                    className={cn(
                      "px-4 py-2 rounded-lg border mx-2",
                      formData.class_id === item._id
                        ? "bg-indigo-600 border-indigo-600"
                        : "bg-white  border-gray-200 ",
                    )}
                  >
                    <Typography
                      className={cn(
                        "text-sm font-medium",
                        formData.class_id === item._id ? "text-white" : "text-gray-900 ",
                      )}
                    >
                      {item?.name} ({item?.classCode})
                    </Typography>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Section Select */}
            <View>
              <Typography className="text-sm font-medium mb-2 text-gray-900 ">Section *</Typography>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                {sections?.map((item: any) => (
                  <TouchableOpacity
                    key={item._id}
                    onPress={() => handleInputChange("section_id", item._id)}
                    className={cn(
                      "px-4 py-2 rounded-lg border mx-1",
                      formData.section_id === item._id
                        ? "bg-indigo-600 border-indigo-600"
                        : "bg-white  border-gray-200 ",
                    )}
                  >
                    <Typography
                      className={cn(
                        "text-sm font-medium",
                        formData.section_id === item._id ? "text-white" : "text-gray-900 ",
                      )}
                    >
                      {item?.name}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Time Slots Card */}
          <View className="border border-gray-200  rounded-lg p-4 mb-6 bg-white ">
            <View className="flex-row justify-between items-center mb-4">
              <Typography className="text-lg font-semibold text-gray-900 ">Time Slots</Typography>
              <TouchableOpacity
                onPress={addTimeSlot}
                className="px-3 py-2 rounded-lg flex-row items-center gap-1 bg-indigo-600"
              >
                <Plus size={16} color="white" />
                <Typography className="text-sm font-medium text-white">Add</Typography>
              </TouchableOpacity>
            </View>

            <FlatList
              data={timeSlots}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item: slot, index }) => (
                <View className="p-3 border border-gray-200  rounded-lg mb-3 bg-gray-50 ">
                  <View className="flex-row justify-between items-center mb-3">
                    <Typography className="text-sm font-medium text-gray-900 ">Period {index + 1}</Typography>
                    <TouchableOpacity onPress={() => removeTimeSlot(slot.id)} className="p-2 rounded-lg bg-red-600">
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
                          className="flex-1 border border-gray-200  rounded px-2 py-1 text-gray-900 "
                        />
                        <TouchableOpacity onPress={() => setEditingTimeSlot(null)} className="p-2 rounded bg-indigo-600">
                          <Check size={14} color="white" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => setEditingTimeSlot(`${slot.id}-start`)}
                        className="flex-row items-center gap-2 p-2"
                      >
                        <Typography className="text-sm font-mono text-gray-900 ">{slot.start_time}</Typography>
                        <Edit2 size={12} color="#9ca3af" />
                      </TouchableOpacity>
                    )}
                  </View>

                  <Typography className="text-xs text-center mb-2 text-gray-600 ">to</Typography>

                  {/* End Time */}
                  <View>
                    {editingTimeSlot === `${slot.id}-end` ? (
                      <View className="flex-row items-center gap-2">
                        <TextInput
                          value={slot.end_time}
                          onChangeText={(value) => handleTimeSlotEdit(slot.id, "end_time", value)}
                          placeholder="HH:MM"
                          className="flex-1 border border-gray-200  rounded px-2 py-1 text-gray-900 "
                        />
                        <TouchableOpacity onPress={() => setEditingTimeSlot(null)} className="p-2 rounded bg-indigo-600">
                          <Check size={14} color="white" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => setEditingTimeSlot(`${slot.id}-end`)}
                        className="flex-row items-center gap-2 p-2"
                      >
                        <Typography className="text-sm font-mono text-gray-900 ">{slot.end_time}</Typography>
                        <Edit2 size={12} color="#9ca3af" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
            />
          </View>

       
          <View className="mb-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2 py-2">
              {daysOfWeek.map((day) => (
                <View key={day.id} className="relative">
                  <TouchableOpacity
                    onPress={() => setSelectedDay(day.id)}
                    className={cn(
                      "px-4 py-2 rounded-lg border min-w-20 items-center mx-2 ",
                      selectedDay === day.id
                        ? "bg-indigo-600 border-indigo-600"
                        : "bg-white  border-gray-200 ",
                    )}
                  >
                    <Typography
                      className={cn(
                        "text-xs font-medium",
                        selectedDay === day.id ? "text-white" : "text-gray-900 ",
                      )}
                    >
                      {day.name.slice(0, 3)}
                    </Typography>
                  </TouchableOpacity>

                 
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
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full items-center justify-center bg-red-600"
                  >
                    <Typography className="text-white text-xs font-bold">×</Typography>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>

        
          <View className="flex-row gap-2 mb-4 justify-end">
            {selectedDay > 1 && (
              <TouchableOpacity
                onPress={copyPreviousDay}
                className="px-3 py-2 rounded-lg flex-row items-center gap-1 bg-gray-100 "
              >
                <Copy size={14} color="#6b7280" />
                <Typography className="text-xs font-medium text-gray-900 ">Copy Prev</Typography>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={fillAllDaysLikeCurrent}
              className="px-3 py-2 rounded-lg flex-row items-center gap-1 bg-gray-100 "
            >
              <Typography className="text-xs font-medium text-gray-900 ">Apply All</Typography>
            </TouchableOpacity>
          </View>

         
          <View className="border border-gray-200  rounded-lg p-4 mb-6 bg-white ">
            <Typography className="text-lg font-semibold mb-4 text-gray-900 ">Periods</Typography>

            <FlatList
              data={timeSlots}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item: slot, index }) => {
                const key = `${selectedDay}-${slot.id}`
                const entry = timetableEntries[key]

                return (
                  <View className="border border-gray-200  rounded-lg p-3 mb-3 bg-gray-50 ">
                    <Typography className="text-xs font-medium mb-3 text-gray-900 ">
                      Period {index + 1}: {slot.start_time} - {slot.end_time}
                    </Typography>

                   
                    <View className="mb-2">
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                        {subjects.map((s: any) => (
                          <TouchableOpacity
                            key={s.id ?? s._id}
                            onPress={() => handleEntryChange(selectedDay, slot.id, "subject_id", s.id ?? s._id)}
                            className={cn(
                              "px-3 py-2 rounded-lg border flex-row items-center gap-1 mx-1 ",
                              entry?.subject_id === (s.id ?? s._id)
                                ? "bg-indigo-600 border-indigo-600"
                                : "bg-white  border-gray-200 ",
                            )}
                          >
                            <View className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color ?? "#666" }} />
                            <Typography
                              className={cn(
                                "text-xs capitalize font-medium",
                                entry?.subject_id === (s.id ?? s._id) ? "text-white" : "text-gray-900  ",
                              )}
                            >
                              {s.name}
                            </Typography>
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
                          className={cn(
                            "px-3 mx-1 py-2 rounded-lg border",
                            entry?.teacher_id === t._id
                              ? "bg-indigo-600 border-indigo-600"
                              : "bg-white  border-gray-200 ",
                          )}
                        >
                          <Typography
                            className={cn(
                              "text-xs capitalize font-medium",
                              entry?.teacher_id === t._id ? "text-white" : "text-gray-900 ",
                            )}
                          >
                            {t.name}
                          </Typography>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )
              }}
            />
          </View>

          {/* Preview Table */}
          <View className="border border-gray-200  rounded-lg p-4 mb-6 bg-white ">
            <Typography className="text-lg font-semibold mb-4 text-gray-900 ">Preview Timetable</Typography>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>
              
                <View className="flex-row border-b border-gray-200 ">
                  <View className="w-20 p-2 border-r border-gray-200 ">
                    <Typography className="text-xs font-bold text-gray-900 ">Day</Typography>
                  </View>
                  {timeSlots.map((slot, i) => (
                    <View key={slot.id} className="w-24 p-2 items-center border-r border-gray-200 ">
                      <Typography className="text-xs font-bold text-gray-900 ">Period {i + 1}</Typography>
                      <Typography className="text-sm text-gray-600 ">
                        {slot.start_time} - {slot.end_time}
                      </Typography>
                    </View>
                  ))}
                </View>

                {/* Table Body */}
                {daysOfWeek.map((day) => (
                  <View key={day.id} className="flex-row border-b border-gray-200 ">
                    <View className="w-20 p-2 justify-center border-r border-gray-200 ">
                      <Typography className="text-xs font-medium text-gray-900 ">{day.name.slice(0, 3)}</Typography>
                    </View>
                    {timeSlots.map((slot) => {
                      const key = `${day.id}-${slot.id}`
                      const entry = timetableEntries[key]
                      const subject = subjects.find((s) => s._id === entry?.subject_id)
                      const teacher = teachers.find((t) => t._id === entry?.teacher_id)

                      return (
                        <View
                          key={key}
                          className="w-24 p-2 items-center justify-center border-r border-gray-200 "
                        >
                          {entry ? (
                            <View className="items-center gap-1">
                              <Typography className="text-[10px] font-medium text-gray-900 ">
                                {subject?.name ?? "—"}
                              </Typography>
                              <Typography className="text-[8px] text-gray-600 ">{teacher?.name ?? "—"}</Typography>
                            </View>
                          ) : (
                            <Typography className="text-xs text-gray-400 dark:text-gray-500">—</Typography>
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
              className="flex-1 border border-gray-200  rounded-lg py-3 items-center bg-white "
            >
              <Typography className="font-medium text-gray-900 ">Cancel</Typography>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting || !formData.class_id || !formData.section_id}
              className={cn(
                "flex-1 rounded-lg py-3 items-center flex-row justify-center gap-2",
                isSubmitting || !formData.class_id || !formData.section_id
                  ? "bg-gray-200 "
                  : "bg-indigo-600",
              )}
            >
              <Save size={16} color={isSubmitting || !formData.class_id || !formData.section_id ? "#9ca3af" : "white"} />
              <Typography
                className={cn(
                  "font-medium",
                  isSubmitting || !formData.class_id || !formData.section_id
                    ? "text-gray-600 "
                    : "text-white",
                )}
              >
                {isSubmitting ? "Creating..." : "Create Timetable"}
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
