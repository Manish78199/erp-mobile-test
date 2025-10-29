"use client"

import { useContext, useEffect, useMemo, useState } from "react"
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import RNPickerSelect from "react-native-picker-select"
import { getAllClass } from "@/service/management/class/classBasic"
import { getClassSubject } from "@/service/management/subject"
import { createExam } from "@/service/management/exam"
import { AlertContext } from "@/context/Alert/context"
import { Typography } from "@/components/Typography"

interface SubjectInput {
  subject_id: string
  max_practical: number | null
  min_practical: number | null
  max_theory: number | null
  min_theory: number | null
  schedule_at?: string | null
  practical_at?: string | null
}

interface ExamFormInput {
  name: string
  duration: number
  class_id: string
  subjects: SubjectInput[]
}

export default function CreateExam() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { showAlert } = useContext(AlertContext)

  const [isCreating, setCreating] = useState(false)
  const [allClass, setClass] = useState<Array<{ label: string; value: string }>>([])
  const [allSubject, setAllSubject] = useState<Array<any>>([])
  const [subjectList, setSubjectList] = useState<Array<{ label: string; value: string }>>([])

  const [values, setValues] = useState<ExamFormInput>({
    name: "",
    duration: 0,
    class_id: "",
    subjects: [],
  })

  useEffect(() => {
    const getAllClassRequest = async () => {
      try {
        const allClass = await getAllClass()
        const filteredClass = allClass.map((item: any) => ({
          label: `${item.name} (${item.classCode})`,
          value: item._id,
        }))
        setClass(filteredClass)
      } catch (error) {
        showAlert("ERROR", "Failed to fetch classes")
      }
    }
    getAllClassRequest()
  }, [])

  const classList = useMemo(() => [{ label: "-- Select Class --", value: "" }, ...allClass], [allClass])

  useEffect(() => {
    const getAllSubjectRequest = async () => {
      if (values.class_id) {
        try {
          const allsub = await getClassSubject(values.class_id)
          setAllSubject(allsub)
          const filteredSubject = allsub.map((item: any) => ({
            label: `${item.name} (${item.code})`,
            value: item._id,
          }))
          setSubjectList([{ label: "-- Select Subject --", value: "" }, ...filteredSubject])
        } catch (error) {
          showAlert("ERROR", "Failed to fetch subjects")
        }
      }
    }
    getAllSubjectRequest()
  }, [values.class_id])

  const getCurrentDateTimeForInput = (schedule: any) => {
    const now = new Date(schedule)
    const offset = now.getTimezoneOffset()
    const localDate = new Date(now.getTime() - offset * 60000)
    return localDate.toISOString().slice(0, 16)
  }

  const examCreateRequest = (examData: any) => {
    setCreating(true)
    createExam(examData)
      .then(() => {
        showAlert("SUCCESS", "Exam created successfully.")
        setValues({
          name: "",
          duration: 0,
          class_id: "",
          subjects: [],
        })
        router.push("/management/exam")
      })
      .catch((error) => {
        showAlert("ERROR", error?.response?.data?.message || "Exam creation failed.")
      })
      .finally(() => {
        setCreating(false)
      })
  }

  const handleAddSubject = () => {
    const prev = values?.subjects || []
    const time = prev.length > 0 && prev[0].schedule_at ? new Date(prev[0].schedule_at) : new Date()
    prev.push({
      subject_id: "",
      max_practical: 0,
      min_practical: 0,
      max_theory: 0,
      min_theory: 0,
      schedule_at: getCurrentDateTimeForInput(time),
    })
    setValues({
      ...values,
      subjects: prev,
    })
  }

  const handleRemoveSubject = (index: number) => {
    const prev = values?.subjects || []
    setValues({
      ...values,
      subjects: prev.filter((_, i) => i !== index),
    })
  }

  const handleSubjectSelection = (ind: number, value: string) => {
    const allExamSubject = [...values.subjects]
    allExamSubject[ind].subject_id = value
    setValues({
      ...values,
      subjects: allExamSubject,
    })
  }

  const getResultType = (id: string) => {
    const subject = allSubject.find((item) => item?._id === id)
    return subject?.result_type || null
  }

  const getSubjectType = (id: string) => {
    const subject = allSubject.find((item) => item?._id === id)
    return subject?.subject_type || null
  }

  return (
    <SafeAreaView className="flex-1 bg-background" >

      <View className="flex-row items-center p-4">
        <TouchableOpacity
          onPress={() => router.push("/management")}
          className="flex-row items-center bg-white border border-border rounded-lg px-3 py-2 mr-2"
        >
          <Typography className=" text-primary font-semibold">← Back</Typography>
        </TouchableOpacity>

        <Typography className="text-lg font-bold text-foreground">New Exam </Typography>
      </View>

      <ScrollView className="flex-1 bg-background">
        <View className="px-4">
          <Typography className="text-2xl font-bold text-gray-900 ">Create New Exams</Typography>
          <Typography className="text-sm mt-1 text-gray-600 ">Manage exams</Typography>
        </View>

        <View className="p-4">

          <View className="mb-6 rounded-lg border border-border bg-white p-4">
            <View className="mb-4 flex-row items-center">
              <MaterialCommunityIcons name="file-document" size={20} color="#10b981" />
              <Typography className="ml-2 text-lg font-semibold text-foreground">Exam Details</Typography>
            </View>


            <View className="mb-4">
              <Typography className="mb-2 text-sm font-medium text-foreground">
                Exam Name <Text className="text-red-500">*</Text>
              </Typography>
              <TextInput
                className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                placeholder="Enter exam name"
                placeholderTextColor="#999"
                value={values.name}
                onChangeText={(text) => setValues({ ...values, name: text })}
              />
            </View>

            {/* Class Selection */}
            <View className="mb-4">
              <Typography className="mb-2 text-sm font-medium text-foreground">Class</Typography>
              <RNPickerSelect
                items={classList}
                onValueChange={(value) => setValues({ ...values, class_id: value })}
                value={values.class_id}
                placeholder={{ label: "Choose a class...", value: null }}
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

            {/* Duration */}
            <View>
              <Typography className="mb-2 text-sm font-medium text-foreground">Exam Duration (Minutes)</Typography>
              <TextInput
                className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                placeholder="90"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                value={String(values.duration)}
                onChangeText={(text) => setValues({ ...values, duration: Number.parseInt(text) || 0 })}
              />
            </View>
          </View>

          {/* Exam Subjects Section */}
          <View className="mb-6 rounded-lg border border-border bg-white p-4">
            <View className="mb-4 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="book-multiple" size={20} color="#10b981" />
                <Typography className="ml-2 text-lg font-semibold text-foreground">Exam Subjects</Typography>
              </View>
              <View className="rounded-full bg-blue-600 px-2 py-1">
                <Typography className="text-xs font-semibold text-white">{values.subjects.length}</Typography>
              </View>
            </View>

            {/* Subject Items */}
            {values.subjects.map((subject, ind) => (
              <View key={ind} className="mb-4 rounded-lg border border-border bg-background p-3">
                {/* Subject Selection */}
                <View className="mb-3 flex-row items-start justify-between">
                  <View className="flex-1">
                    <Typography className="mb-2 text-sm font-medium text-foreground">Subject</Typography>
                    <RNPickerSelect
                      items={subjectList}
                      onValueChange={(value) => handleSubjectSelection(ind, value)}
                      value={subject.subject_id}
                      placeholder={{ label: "Choose a subject...", value: null }}
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
                  <TouchableOpacity onPress={() => handleRemoveSubject(ind)} className="ml-2 rounded-full p-2">
                    <MaterialCommunityIcons name="close" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>

                {/* Result Type Display */}
                <View className="mb-3">
                  <Typography className="mb-2 text-sm font-medium text-foreground">Result Type</Typography>
                  <View className="rounded-lg border border-border bg-background px-3 py-2">
                    <Typography className="text-foreground">{getResultType(subject?.subject_id) || "--"}</Typography>
                  </View>
                </View>

                {/* Marks Fields - Percentage Type */}
                {getResultType(subject?.subject_id) === "PERCENTAGE" && (
                  <>
                    {/* Practical Marks */}
                    {["BOTH", "PRACTICAL"].includes(getSubjectType(subject?.subject_id)) && (
                      <>
                        <View className="mb-3">
                          <Typography className="mb-2 text-sm font-medium text-foreground">
                            Max Practical Marks
                          </Typography>
                          <TextInput
                            className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                            placeholder="30"
                            placeholderTextColor="#999"
                            keyboardType="number-pad"
                            value={String(subject.max_practical || "")}
                            onChangeText={(text) => {
                              const newSubjects = [...values.subjects]
                              newSubjects[ind].max_practical = Number.parseInt(text) || 0
                              setValues({ ...values, subjects: newSubjects })
                            }}
                          />
                        </View>
                        <View className="mb-3">
                          <Typography className="mb-2 text-sm font-medium text-foreground">
                            Passing Practical Marks
                          </Typography>
                          <TextInput
                            className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                            placeholder="13"
                            placeholderTextColor="#999"
                            keyboardType="number-pad"
                            value={String(subject.min_practical || "")}
                            onChangeText={(text) => {
                              const newSubjects = [...values.subjects]
                              newSubjects[ind].min_practical = Number.parseInt(text) || 0
                              setValues({ ...values, subjects: newSubjects })
                            }}
                          />
                        </View>
                      </>
                    )}

                    {/* Theory Marks */}
                    {["BOTH", "THEORETICAL"].includes(getSubjectType(subject?.subject_id)) && (
                      <>
                        <View className="mb-3">
                          <Typography className="mb-2 text-sm font-medium text-foreground">Max Theory Marks</Typography>
                          <TextInput
                            className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                            placeholder="70"
                            placeholderTextColor="#999"
                            keyboardType="number-pad"
                            value={String(subject.max_theory || "")}
                            onChangeText={(text) => {
                              const newSubjects = [...values.subjects]
                              newSubjects[ind].max_theory = Number.parseInt(text) || 0
                              setValues({ ...values, subjects: newSubjects })
                            }}
                          />
                        </View>
                        <View className="mb-3">
                          <Typography className="mb-2 text-sm font-medium text-foreground">
                            Passing Theory Marks
                          </Typography>
                          <TextInput
                            className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                            placeholder="23"
                            placeholderTextColor="#999"
                            keyboardType="number-pad"
                            value={String(subject.min_theory || "")}
                            onChangeText={(text) => {
                              const newSubjects = [...values.subjects]
                              newSubjects[ind].min_theory = Number.parseInt(text) || 0
                              setValues({ ...values, subjects: newSubjects })
                            }}
                          />
                        </View>
                      </>
                    )}
                  </>
                )}

                {/* DateTime Fields */}
                {["BOTH", "THEORETICAL"].includes(getSubjectType(subject?.subject_id)) && (
                  <View className="mb-3">
                    <Typography className="mb-2 text-sm font-medium text-foreground">Written At</Typography>
                    <TextInput
                      className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                      placeholder="YYYY-MM-DDTHH:MM"
                      placeholderTextColor="#999"
                      value={String(subject.schedule_at || "")}
                      onChangeText={(text) => {
                        const newSubjects = [...values.subjects]
                        newSubjects[ind].schedule_at = text
                        setValues({ ...values, subjects: newSubjects })
                      }}
                    />
                  </View>
                )}

                {["BOTH", "PRACTICAL"].includes(getSubjectType(subject?.subject_id)) && (
                  <View>
                    <Typography className="mb-2 text-sm font-medium text-foreground">Practical At</Typography>
                    <TextInput
                      className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                      placeholder="YYYY-MM-DDTHH:MM"
                      placeholderTextColor="#999"
                      value={String(subject.practical_at || "")}
                      onChangeText={(text) => {
                        const newSubjects = [...values.subjects]
                        newSubjects[ind].practical_at = text
                        setValues({ ...values, subjects: newSubjects })
                      }}
                    />
                  </View>
                )}
              </View>
            ))}

            {/* Add Subject Button */}
            <TouchableOpacity
              onPress={handleAddSubject}
              className="flex-row items-center justify-center rounded-lg border border-dashed border-blue-500 bg-blue-50 py-3"
            >
              <MaterialCommunityIcons name="plus" size={20} color="#3b82f6" />
              <Typography className="ml-2 font-semibold text-blue-600">Add Subject</Typography>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={() => examCreateRequest(values)}
            disabled={isCreating}
            className={`mb-6 flex-row items-center justify-center rounded-lg py-3 ${isCreating ? "bg-gray-400" : "bg-emerald-600"
              }`}
          >
            {isCreating ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <MaterialCommunityIcons name="check" size={20} color="white" />
                <Typography className="ml-2 font-semibold text-white">Submit</Typography>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
