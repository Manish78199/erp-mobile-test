
import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { cn } from "@/utils/cn"

export default function BookIssueReturn() {
  const insets = useSafeAreaInsets()
  const [activeTab, setActiveTab] = useState<"issue" | "return">("issue")

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-gray-900"
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-4 py-6 space-y-6">
        <View>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Book Issue & Return</Text>
          <Text className="text-sm mt-1 text-gray-600 dark:text-gray-400">
            Issue books to students and process returns
          </Text>
        </View>

        <View className="flex-row gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <TouchableOpacity
            onPress={() => setActiveTab("issue")}
            className={cn("flex-1 py-3 px-4 rounded-md", activeTab === "issue" ? "bg-indigo-600" : "bg-transparent")}
          >
            <View className="flex-row items-center justify-center gap-2">
              <MaterialCommunityIcons name="book-plus" size={18} color={activeTab === "issue" ? "white" : "#6b7280"} />
              <Text
                className={cn(
                  "font-medium text-sm",
                  activeTab === "issue" ? "text-white" : "text-gray-600 dark:text-gray-400",
                )}
              >
                Issue Book
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("return")}
            className={cn("flex-1 py-3 px-4 rounded-md", activeTab === "return" ? "bg-indigo-600" : "bg-transparent")}
          >
            <View className="flex-row items-center justify-center gap-2">
              <MaterialCommunityIcons
                name="book-check"
                size={18}
                color={activeTab === "return" ? "white" : "#6b7280"}
              />
              <Text
                className={cn(
                  "font-medium text-sm",
                  activeTab === "return" ? "text-white" : "text-gray-600 dark:text-gray-400",
                )}
              >
                Return Book
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="rounded-lg p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 items-center justify-center py-12">
          <MaterialCommunityIcons name={activeTab === "issue" ? "book-plus" : "book-check"} size={48} color="#10b981" />
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mt-4">
            {activeTab === "issue" ? "Issue Book" : "Return Book"}
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
            {activeTab === "issue" ? "Select a student and book to issue" : "Select a student to process book return"}
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}
