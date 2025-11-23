
import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, SafeAreaView } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"

interface GradeScale {
  grade: string
  min_percentage: number
  max_percentage: number
  remark: string
}

interface DivisionScale {
  division: string
  min_percentage: number
  max_percentage: number
}

const scoreTypeList = [
  { title: "Percentage", value: "PERCENTAGE" },
  { title: "Grade", value: "GRADE" },
  { title: "GPA", value: "GPA" },
  { title: "CGPA", value: "CGPA" },
]

export default function ResultProcessing() {
  const [creating, setCreating] = useState(false)
  const [showScoreTypeDropdown, setShowScoreTypeDropdown] = useState(false)

  const [resultScoreType, setResultScoreType] = useState("")
  const [overallPassingPercentage, setOverallPassingPercentage] = useState("0")
  const [gradeScale, setGradeScale] = useState<GradeScale[]>([
    { grade: "", min_percentage: 0, max_percentage: 0, remark: "" },
  ])
  const [divisionScale, setDivisionScale] = useState<DivisionScale[]>([
    { division: "", min_percentage: 0, max_percentage: 0 },
  ])

  const addGrade = () => {
    setGradeScale([...gradeScale, { grade: "", min_percentage: 0, max_percentage: 0, remark: "" }])
  }

  const removeGrade = (index: number) => {
    setGradeScale(gradeScale.filter((_, i) => i !== index))
  }

  const updateGrade = (index: number, field: keyof GradeScale, value: any) => {
    const updated = [...gradeScale]
    updated[index] = { ...updated[index], [field]: value }
    setGradeScale(updated)
  }

  const addDivision = () => {
    setDivisionScale([...divisionScale, { division: "", min_percentage: 0, max_percentage: 0 }])
  }

  const removeDivision = (index: number) => {
    setDivisionScale(divisionScale.filter((_, i) => i !== index))
  }

  const updateDivision = (index: number, field: keyof DivisionScale, value: any) => {
    const updated = [...divisionScale]
    updated[index] = { ...updated[index], [field]: value }
    setDivisionScale(updated)
  }

  const handleSubmit = () => {
    setCreating(true)
    // Mock API call
    setTimeout(() => {
      console.log("Result setting saved:", {
        resultScoreType,
        overallPassingPercentage,
        gradeScale,
        divisionScale,
      })
      setCreating(false)
    }, 1000)
  }

  const DropdownButton = ({ value, onPress }: any) => (
    <TouchableOpacity
      onPress={onPress}
      className="bg-background border border-zinc-700 rounded-md px-3 py-2 flex-row items-center justify-between"
    >
      <Text className="text-white text-sm flex-1">{value || "-- Select Score Type --"}</Text>
      <MaterialCommunityIcons name="chevron-down" size={20} color="#999" />
    </TouchableOpacity>
  )

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4 py-4">
        <View className="mb-6">
          <Text className=" text-2xl font-bold">Result Setting</Text>
          <Text className="text-gray-400 text-sm mt-2">Set result process config.</Text>
        </View>

        <View className="bg-white border border-gray-200 rounded-lg p-4 gap-4">
          {/* Score Type Dropdown */}
          <View>
            <Text className="text-gray-400 text-sm mb-2">Result Score Type</Text>
            <DropdownButton value={resultScoreType} onPress={() => setShowScoreTypeDropdown(!showScoreTypeDropdown)} />
            {showScoreTypeDropdown && (
              <View className="bg-white border border-gray-200 rounded-md mt-1">
                {scoreTypeList.map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    onPress={() => {
                      setResultScoreType(item.value)
                      setShowScoreTypeDropdown(false)
                    }}
                    className="px-3 py-2 border-b border-gray-200"
                  >
                    <Text className="text-white text-sm">{item.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Overall Passing Percentage */}
          <View>
            <Text className="text-gray-400 text-sm mb-2">Overall Passing Percentage</Text>
            <TextInput
              keyboardType="number-pad"
              value={overallPassingPercentage}
              onChangeText={setOverallPassingPercentage}
              placeholder="Enter percentage"
              placeholderTextColor="#666"
              className="bg-white border border-gray-200 rounded-md px-3 py-2 text-white"
            />
          </View>

          {/* Grade Scale Section */}
          <View className="mt-6 pt-4 border-t border-zinc-700">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white font-semibold">Result Grading</Text>
              <View className="bg-indigo-600 px-2 py-1 rounded-full">
                <Text className="text-white text-xs font-semibold">{gradeScale.length}</Text>
              </View>
            </View>

            {gradeScale.map((grade, index) => (
              <View key={index} className="bg-white p-3 rounded-md mb-3 gap-3">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-gray-400 text-xs mb-1">Grade Name</Text>
                    <TextInput
                      value={grade.grade}
                      onChangeText={(value) => updateGrade(index, "grade", value)}
                      placeholder="A, A+, B etc."
                      placeholderTextColor="#666"
                      className="bg-background border border-gray-200 rounded-md px-2 py-1 text-white text-sm"
                    />
                  </View>
                  <TouchableOpacity onPress={() => removeGrade(index)} className="ml-2 p-2 bg-red-600/20 rounded-md">
                    <MaterialCommunityIcons name="close" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>

                <View className="flex-row gap-2">
                  <View className="flex-1">
                    <Text className="text-gray-400 text-xs mb-1">Min %</Text>
                    <TextInput
                      keyboardType="number-pad"
                      value={grade.min_percentage.toString()}
                      onChangeText={(value) => updateGrade(index, "min_percentage", Number(value))}
                      placeholder="0"
                      placeholderTextColor="#666"
                      className="bg-background border border-gray-200 rounded-md px-2 py-1 text-white text-sm"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-400 text-xs mb-1">Max %</Text>
                    <TextInput
                      keyboardType="number-pad"
                      value={grade.max_percentage.toString()}
                      onChangeText={(value) => updateGrade(index, "max_percentage", Number(value))}
                      placeholder="100"
                      placeholderTextColor="#666"
                      className="bg-background border border-gray-200 rounded-md px-2 py-1 text-white text-sm"
                    />
                  </View>
                </View>

                <View>
                  <Text className="text-gray-400 text-xs mb-1">Remark</Text>
                  <TextInput
                    value={grade.remark}
                    onChangeText={(value) => updateGrade(index, "remark", value)}
                    placeholder="Excellent, Good, etc."
                    placeholderTextColor="#666"
                    className="bg-background border border-gray-200 rounded-md px-2 py-1 text-white text-sm"
                  />
                </View>
              </View>
            ))}

            <TouchableOpacity
              onPress={addGrade}
              className="bg-indigo-600 px-3 py-2 rounded-md flex-row items-center justify-center gap-2"
            >
              <MaterialCommunityIcons name="plus" size={16} color="white" />
              <Text className="text-white font-semibold">Add Grade</Text>
            </TouchableOpacity>
          </View>

          {/* Division Scale Section */}
          <View className="mt-6 pt-4 border-t border-zinc-700">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white font-semibold">Division Scale</Text>
              <View className="bg-indigo-600 px-2 py-1 rounded-full">
                <Text className="text-white text-xs font-semibold">{divisionScale.length}</Text>
              </View>
            </View>

            {divisionScale.map((division, index) => (
              <View key={index} className="bg-white p-3 rounded-md mb-3 gap-3">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-gray-400 text-xs mb-1">Division Name</Text>
                    <TextInput
                      value={division.division}
                      onChangeText={(value) => updateDivision(index, "division", value)}
                      placeholder="First, Second, Third etc."
                      placeholderTextColor="#666"
                      className="bg-background border border-gray-200 rounded-md px-2 py-1 text-white text-sm"
                    />
                  </View>
                  <TouchableOpacity onPress={() => removeDivision(index)} className="ml-2 p-2 bg-red-600/20 rounded-md">
                    <MaterialCommunityIcons name="close" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>

                <View className="flex-row gap-2">
                  <View className="flex-1">
                    <Text className="text-gray-400 text-xs mb-1">Min %</Text>
                    <TextInput
                      keyboardType="number-pad"
                      value={division.min_percentage.toString()}
                      onChangeText={(value) => updateDivision(index, "min_percentage", Number(value))}
                      placeholder="0"
                      placeholderTextColor="#666"
                      className="bg-background border border-gray-200 rounded-md px-2 py-1 text-white text-sm"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-400 text-xs mb-1">Max %</Text>
                    <TextInput
                      keyboardType="number-pad"
                      value={division.max_percentage.toString()}
                      onChangeText={(value) => updateDivision(index, "max_percentage", Number(value))}
                      placeholder="100"
                      placeholderTextColor="#666"
                      className="bg-background border border-gray-200 rounded-md px-2 py-1 text-white text-sm"
                    />
                  </View>
                </View>
              </View>
            ))}

            <TouchableOpacity
              onPress={addDivision}
              className="bg-indigo-600 px-3 py-2 rounded-md flex-row items-center justify-center gap-2"
            >
              <MaterialCommunityIcons name="plus" size={16} color="white" />
              <Text className="text-white font-semibold">Add Division</Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <View className="flex-row justify-end mt-6 gap-2">
            {!creating && (
              <TouchableOpacity onPress={handleSubmit} className="bg-indigo-600 px-4 py-2 rounded-md">
                <Text className="text-white font-semibold">Save</Text>
              </TouchableOpacity>
            )}
            {creating && <ActivityIndicator size="large" color="#6366f1" />}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
