"use client"

import type React from "react"
import { useContext, useEffect, useState } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native"
import { useRouter } from "expo-router"
import { useClasses } from "@/hooks/management/classes"
import { getHomeWorkByClassId, deletStudentHomework } from "@/service/management/studenthomework"
import { AlertContext } from "@/context/Alert/context"
import { PermitComponent } from "@/components/management/Authorization/PermitComponent"
import {
  BookOpen,
  Plus,
  GraduationCap,
  Calendar,
  TrendingUp,
  FileText,
  Search,
  Users,
  ChevronDown,
} from "lucide-react-native"
import { cn } from "@/utils/cn"

export default function HomeworkPage() {
  const router = useRouter()
  const { showAlert } = useContext(AlertContext)
  const [allHomework, setHomework] = useState([])
  const [currentClass, setCurrentClass] = useState<string | null>(null)
  const [currentClassName, setClassName] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [showClassPicker, setShowClassPicker] = useState<boolean>(false)

  const { classes: allClass } = useClasses()

  const selectClass = (classId: string) => {
    const selectedClass = allClass.find((cls) => cls._id === classId)
    setCurrentClass(classId)
    setClassName(selectedClass?.name || "")
    setShowClassPicker(false)
  }

  const getClassHomework = async () => {
    if (currentClass) {
      setLoading(true)
      try {
        const homeWork = await getHomeWorkByClassId(currentClass)
        setHomework(homeWork)
      } catch (error) {
        showAlert("ERROR", "Failed to load homework")
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    if (currentClass) {
      getClassHomework()
    }
  }, [currentClass])

  const onRefresh = async () => {
    setRefreshing(true)
    await getClassHomework()
    setRefreshing(false)
  }

  const deleteHomeWork = (homeWorkId: string) => {
    Alert.alert("Delete Homework", "Are you sure you want to delete this homework?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Delete",
        onPress: async () => {
          const previousHomeWorks = allHomework
          const homeWorkFilter = previousHomeWorks.filter((homework) => homework?._id !== homeWorkId)
          setHomework(homeWorkFilter)

          try {
            await deletStudentHomework(homeWorkId)
            showAlert("SUCCESS", "Homework deleted successfully.")
          } catch (error) {
            setHomework(previousHomeWorks)
            showAlert("ERROR", error?.response?.data?.message || "Error in deleting homework.")
          }
        },
      },
    ])
  }

  const filteredHomework = allHomework.filter(
    (homework) =>
      homework.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      homework.subject?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalHomework = allHomework.length
  const overdueHomework = allHomework.filter((hw) => new Date(hw.due_date) < new Date()).length
  const upcomingHomework = allHomework.filter((hw) => {
    const dueDate = new Date(hw.due_date)
    const today = new Date()
    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)
    return dueDate >= today && dueDate <= threeDaysFromNow
  }).length

  const renderStatCard = (icon: React.ReactNode, label: string, value: number, bgColor: string) => (
    <View className={cn("flex-1 rounded-lg p-4 mb-3", bgColor)}>
      <View className="flex-row items-center">
        <View className="mr-3">{icon}</View>
        <View className="flex-1">
          <Text className="text-2xl font-bold text-foreground">{value}</Text>
          <Text className="text-xs text-muted-foreground">{label}</Text>
        </View>
      </View>
    </View>
  )

  const renderHomeworkItem = ({ item }: { item: any }) => {
    const dueDate = new Date(item?.due_date || "")
    const isOverdue = dueDate < new Date()
    const isDueSoon = !isOverdue && dueDate <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)

    return (
      <View className="bg-card border border-border rounded-lg p-4 mb-3">
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-base font-semibold text-foreground">{item.title}</Text>
            <Text className="text-sm text-muted-foreground mt-1">{item.subject}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              Alert.alert("Actions", "Choose an action", [
                {
                  text: "View Details",
                  onPress: () => router.push(`/management/homework/view/${item?._id}`),
                },
                {
                  text: "Delete",
                  onPress: () => deleteHomeWork(item?._id),
                  style: "destructive",
                },
                { text: "Cancel", onPress: () => {} },
              ])
            }}
            className="p-2"
          >
            <Text className="text-primary font-semibold">⋮</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center mb-2">
          <Users size={14} className="text-muted-foreground mr-2" />
          <Text className="text-xs text-muted-foreground">{item.assigned_to}</Text>
        </View>

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Calendar size={14} className="text-muted-foreground mr-1" />
            <Text className="text-xs text-muted-foreground">
              {dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </Text>
          </View>

          <View
            className={cn(
              "px-2 py-1 rounded",
              isOverdue ? "bg-destructive/10" : isDueSoon ? "bg-yellow-100" : "bg-green-100",
            )}
          >
            <Text
              className={cn(
                "text-xs font-medium",
                isOverdue ? "text-destructive" : isDueSoon ? "text-yellow-700" : "text-green-700",
              )}
            >
              {isOverdue ? "Overdue" : isDueSoon ? "Due Soon" : "On Track"}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* Hero Section */}
        <View className="bg-primary rounded-2xl p-6 m-4 mb-6">
          <View className="flex-row items-center  mb-3">
            <View className="bg-white/20 rounded-lg p-3 mr-3">
              <GraduationCap size={24} className="text-primary-foreground" />
            </View>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-primary-foreground">Homework Management</Text>
              <Text className="text-sm text-primary-foreground/80 mt-1">
                Streamline assignments and track student progress
              </Text>
            </View>
          </View>
        </View>

        {/* Class Selection */}
        <View className="px-4 mb-6">
          <View className="bg-white border border-border rounded-lg p-4 mb-4">
            <View className="flex-row items-center mb-2">
              <BookOpen size={18} className="text-primary mr-2" />
              <Text className="text-lg font-semibold text-foreground">Select Class</Text>
            </View>
            <Text className="text-sm text-muted-foreground mb-3">Choose a class to manage homework assignments</Text>

            <TouchableOpacity
              onPress={() => setShowClassPicker(!showClassPicker)}
              className="border border-border rounded-lg p-3 flex-row items-center justify-between bg-input"
            >
              <Text className={cn("text-base", currentClassName ? "text-foreground" : "text-muted-foreground")}>
                {currentClassName || "Choose a class to get started"}
              </Text>
              <ChevronDown size={20} className="text-muted-foreground" />
            </TouchableOpacity>

            {showClassPicker && (
              <View className="mt-2 border border-border rounded-lg bg-card">
                {allClass.map((item) => (
                  <TouchableOpacity
                    key={item._id}
                    onPress={() => selectClass(item._id)}
                    className="p-3 border-b border-border flex-row items-center justify-between"
                  >
                    <View className="flex-1">
                      <Text className="font-semibold text-foreground">{item.name}</Text>
                      <Text className="text-xs text-muted-foreground">Code: {item.classCode}</Text>
                    </View>
                    {currentClass === item._id && <View className="w-2 h-2 bg-primary rounded-full" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Stats */}
          <View className="flex-row mb-4">
            <View className="flex-1 mr-2">
              {renderStatCard(<FileText size={20} className="text-green-600" />, "Total", totalHomework, "bg-green-50")}
            </View>
            <View className="flex-1">
              {renderStatCard(
                <TrendingUp size={20} className="text-yellow-600" />,
                "Due Soon",
                upcomingHomework,
                "bg-yellow-50",
              )}
            </View>
          </View>
        </View>

        {/* Homework List */}
        {currentClass ? (
          <View className="px-4 pb-6">
            <View className="flex-row items-center mb-4">
              <View className="flex-1 bg-input border border-border rounded-lg flex-row items-center px-3">
                <Search size={18} className="text-muted-foreground mr-2" />
                <TextInput
                  placeholder="Search homework..."
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                  className="flex-1 py-2 text-foreground"
                  placeholderTextColor="#999"
                />
              </View>
              <PermitComponent module={"HOMEWORK"} action={"CREATE"}>
                <TouchableOpacity
                  onPress={() => router.push("/management/homework/create")}
                  className="bg-primary rounded-lg p-3 ml-2"
                >
                  <Plus size={20} className="text-primary-foreground" />
                </TouchableOpacity>
              </PermitComponent>
            </View>

            {loading ? (
              <View className="items-center justify-center py-8">
                <ActivityIndicator size="large" color="#000" />
              </View>
            ) : filteredHomework.length > 0 ? (
              <PermitComponent module={"HOMEWORK"} action={"VIEW"}>
                <FlatList
                  data={filteredHomework}
                  renderItem={renderHomeworkItem}
                  keyExtractor={(item) => item._id}
                  scrollEnabled={false}
                  ListHeaderComponent={
                    <View className="mb-2">
                      <Text className="text-lg font-semibold text-foreground mb-2">{currentClassName} Homework</Text>
                      <View className="flex-row items-center">
                        <Text className="text-sm text-muted-foreground">{totalHomework} total assignments</Text>
                        {overdueHomework > 0 && (
                          <View className="bg-destructive/10 rounded px-2 py-1 ml-2">
                            <Text className="text-xs text-destructive font-semibold">{overdueHomework} overdue</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  }
                />
              </PermitComponent>
            ) : (
              <View className="bg-card border border-border rounded-lg p-6 items-center">
                <FileText size={32} className="text-muted-foreground mb-3" />
                <Text className="text-lg font-semibold text-foreground mb-1">No Homework Found</Text>
                <Text className="text-sm text-muted-foreground text-center">
                  No homework assignments match your search criteria.
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View className="px-4 pb-6">
            <View className="bg-white border border-border rounded-lg p-8 items-center">
              <View className="bg-primary/10 rounded-full p-4 mb-4">
                <GraduationCap size={32} className="text-primary" />
              </View>
              <Text className="text-lg font-semibold text-foreground mb-2">Select a Class to Begin</Text>
              <Text className="text-sm text-muted-foreground text-center">
                Choose a class from the dropdown above to view and manage homework assignments for your students.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}
