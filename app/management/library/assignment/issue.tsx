
import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import RNPickerSelect from "react-native-picker-select"
import DateTimePicker from "@react-native-community/datetimepicker"

interface Student {
  id: string
  name: string
  rollNo: number
  admissionNo: string
}

interface Book {
  id: string
  title: string
  author: string
  availableCopies: number
}

// Mock API functions - replace with actual API calls
const getStudents = async (): Promise<Student[]> => {
  return [
    { id: "1", name: "Rahul Sharma", rollNo: 1, admissionNo: "ADM001" },
    { id: "2", name: "Priya Patel", rollNo: 2, admissionNo: "ADM002" },
  ]
}

const getAvailableBooks = async (): Promise<Book[]> => {
  return [
    { id: "1", title: "Data Structures", author: "Cormen", availableCopies: 3 },
    { id: "2", title: "Clean Code", author: "Martin", availableCopies: 2 },
  ]
}

const issueBook = async (data: any) => {
  return { success: true }
}

export default function BookIssueForm() {
  const insets = useSafeAreaInsets()
  const [students, setStudents] = useState<Student[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [selectedBook, setSelectedBook] = useState<string | null>(null)
  const [issueDate, setIssueDate] = useState(new Date())
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000))
  const [showIssueDatePicker, setShowIssueDatePicker] = useState(false)
  const [showDueDatePicker, setShowDueDatePicker] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsData, booksData] = await Promise.all([getStudents(), getAvailableBooks()])
        setStudents(studentsData)
        setBooks(booksData)
      } catch (error) {
        Alert.alert("Error", "Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleIssueBook = async () => {
    if (!selectedStudent || !selectedBook) {
      Alert.alert("Error", "Please select both student and book")
      return
    }

    setIsSubmitting(true)
    try {
      await issueBook({
        studentId: selectedStudent,
        bookId: selectedBook,
        issueDate: issueDate.toISOString().split("T")[0],
        dueDate: dueDate.toISOString().split("T")[0],
      })
      Alert.alert("Success", "Book issued successfully")
      setSelectedStudent(null)
      setSelectedBook(null)
    } catch (error) {
      Alert.alert("Error", "Failed to issue book")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    )
  }

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-gray-900"
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-4 py-6 space-y-6">
        <View>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Issue Book</Text>
          <Text className="text-sm mt-1 text-gray-600 dark:text-gray-400">Issue a book to a student</Text>
        </View>

        <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
          <View>
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Student</Text>
            <RNPickerSelect
              items={students.map((s) => ({ label: `${s.name} (${s.admissionNo})`, value: s.id }))}
              onValueChange={setSelectedStudent}
              value={selectedStudent}
              placeholder={{ label: "Select a student", value: null }}
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
                  paddingVertical: 12,
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

          <View>
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Book</Text>
            <RNPickerSelect
              items={books.map((b) => ({ label: `${b.title} (${b.availableCopies} available)`, value: b.id }))}
              onValueChange={setSelectedBook}
              value={selectedBook}
              placeholder={{ label: "Select a book", value: null }}
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
                  paddingVertical: 12,
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

          <View>
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Issue Date</Text>
            <TouchableOpacity
              onPress={() => setShowIssueDatePicker(true)}
              className="flex-row items-center p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
            >
              <MaterialCommunityIcons name="calendar" size={20} color="#6b7280" />
              <Text className="ml-2 font-medium text-gray-700 dark:text-gray-300">
                {issueDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showIssueDatePicker && (
              <DateTimePicker
                value={issueDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  if (date) setIssueDate(date)
                  setShowIssueDatePicker(false)
                }}
              />
            )}
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Due Date</Text>
            <TouchableOpacity
              onPress={() => setShowDueDatePicker(true)}
              className="flex-row items-center p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
            >
              <MaterialCommunityIcons name="calendar" size={20} color="#6b7280" />
              <Text className="ml-2 font-medium text-gray-700 dark:text-gray-300">{dueDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showDueDatePicker && (
              <DateTimePicker
                value={dueDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  if (date) setDueDate(date)
                  setShowDueDatePicker(false)
                }}
              />
            )}
          </View>
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-3">
            <Text className="text-center font-medium text-gray-700 dark:text-gray-300">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleIssueBook}
            disabled={isSubmitting}
            className="flex-1 bg-green-600 rounded-lg p-3 flex-row items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <MaterialCommunityIcons name="book-plus" size={18} color="white" />
                <Text className="text-white font-medium">Issue Book</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
