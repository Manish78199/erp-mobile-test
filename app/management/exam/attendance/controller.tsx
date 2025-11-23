
import { useState } from "react"
import { View, Text, TouchableOpacity, TextInput } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"

interface AttendanceData {
  _id: string
  attendance?: "PRESENT" | "ABSENT"
  theory_marks?: number | null
  practical_marks?: number | null
}

interface AttendanceMarkUpdateProps {
  handler: (student_id: string, status: "PRESENT" | "ABSENT", theory_marks?: number, practical_marks?: number) => void
  canMark: boolean
  data: AttendanceData
  subject_type: "THEORETICAL" | "PRACTICAL" | "BOTH" | string
}

export default function AttendanceMarkUpdate({ handler, canMark, data, subject_type }: AttendanceMarkUpdateProps) {
  const [attendance, setAttendance] = useState<"PRESENT" | "ABSENT" | null>(data?.attendance || null)
  const [theoryMarks, setTheoryMarks] = useState<string>(data?.theory_marks?.toString() || "")
  const [practicalMarks, setPracticalMarks] = useState<string>(data?.practical_marks?.toString() || "")

  const handleAttendanceChange = (status: "PRESENT" | "ABSENT") => {
    setAttendance(status)
    handler(
      data?._id,
      status,
      theoryMarks ? Number(theoryMarks) : undefined,
      practicalMarks ? Number(practicalMarks) : undefined,
    )
  }

  const handleTheoryMarksChange = (value: string) => {
    setTheoryMarks(value)
    if (attendance) {
      handler(
        data?._id,
        attendance,
        value ? Number(value) : undefined,
        practicalMarks ? Number(practicalMarks) : undefined,
      )
    }
  }

  const handlePracticalMarksChange = (value: string) => {
    setPracticalMarks(value)
    if (attendance) {
      handler(data?._id, attendance, theoryMarks ? Number(theoryMarks) : undefined, value ? Number(value) : undefined)
    }
  }

  if (canMark) {
    return (
      <View className="flex-col gap-3">
        {/* Attendance Radio Buttons */}
        <View className="flex-row gap-6">
          <TouchableOpacity onPress={() => handleAttendanceChange("PRESENT")} className="flex-row items-center gap-2">
            <View
              className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                attendance === "PRESENT" ? "border-indigo-500 bg-indigo-500" : "border-zinc-400 bg-white/10"
              }`}
            >
              {attendance === "PRESENT" && <View className="w-2 h-2 rounded-full bg-white" />}
            </View>
            <Text className="text-sm text-white">Present</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleAttendanceChange("ABSENT")} className="flex-row items-center gap-2">
            <View
              className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                attendance === "ABSENT" ? "border-indigo-500 bg-indigo-500" : "border-zinc-400 bg-white/10"
              }`}
            >
              {attendance === "ABSENT" && <View className="w-2 h-2 rounded-full bg-white" />}
            </View>
            <Text className="text-sm text-white">Absent</Text>
          </TouchableOpacity>
        </View>

        {/* Marks Input Fields */}
        {attendance === "PRESENT" && (
          <View className="flex-row gap-2">
            {(subject_type === "THEORETICAL" || subject_type === "BOTH") && (
              <TextInput
                placeholder="Theory Marks"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                value={theoryMarks}
                onChangeText={handleTheoryMarksChange}
                className="flex-1 bg-transparent px-3 py-2 rounded-md border border-zinc-700/30 text-white focus:ring-2 focus:ring-indigo-500"
              />
            )}
            {(subject_type === "PRACTICAL" || subject_type === "BOTH") && (
              <TextInput
                placeholder="Practical Marks"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                value={practicalMarks}
                onChangeText={handlePracticalMarksChange}
                className="flex-1 bg-transparent px-3 py-2 rounded-md border border-zinc-700/30 text-white focus:ring-2 focus:ring-indigo-500"
              />
            )}
          </View>
        )}
      </View>
    )
  }

  // Read-only mode
  return (
    <View className="flex-col gap-2">
      {!data?.attendance && (
        <View className="flex-row items-center gap-2">
          <MaterialCommunityIcons name="ban" size={16} color="#ef4444" />
          <Text className="text-sm text-gray-400">Not Marked</Text>
        </View>
      )}

      {data?.attendance === "PRESENT" && (
        <View className="flex-col gap-2">
          <View className="bg-emerald-200/20 px-2 py-1 rounded-md w-fit">
            <Text className="text-sm text-emerald-400">Present</Text>
          </View>
          <View className="flex-row gap-2 flex-wrap">
            {(subject_type === "THEORETICAL" || subject_type === "BOTH") && (
              <Text className="text-xs text-gray-400">
                Theory: <Text className="text-white font-semibold">{data?.theory_marks ?? "-"}</Text>
              </Text>
            )}
            {subject_type === "BOTH" && <Text className="text-xs text-gray-400">|</Text>}
            {(subject_type === "PRACTICAL" || subject_type === "BOTH") && (
              <Text className="text-xs text-gray-400">
                Practical: <Text className="text-white font-semibold">{data?.practical_marks ?? "-"}</Text>
              </Text>
            )}
            <Text className="text-xs text-gray-400">
              | Total:{" "}
              <Text className="text-white font-semibold">
                {Number(data?.practical_marks ?? 0) + Number(data?.theory_marks ?? 0)}
              </Text>
            </Text>
          </View>
        </View>
      )}

      {data?.attendance === "ABSENT" && (
        <View className="bg-red-200/20 px-2 py-1 rounded-md w-fit">
          <Text className="text-sm text-red-400">Absent</Text>
        </View>
      )}
    </View>
  )
}
