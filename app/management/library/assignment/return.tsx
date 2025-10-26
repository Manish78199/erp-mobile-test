
import { useState, useEffect } from "react"
import { View, Text, ScrollView, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { cn } from "@/utils/cn"

interface IssuedBook {
  id: string
  bookId: string
  bookTitle: string
  bookAuthor: string
  isbn: string
  studentId: string
  studentName: string
  studentRoom: string
  issueDate: string
  dueDate: string
  returnDate?: string
  status: "issued" | "returned" | "overdue"
  fineAmount?: number
}

// Mock API functions - replace with actual API calls
const getIssuedBooks = async (): Promise<IssuedBook[]> => {
  return [
    {
      id: "1",
      bookId: "B001",
      bookTitle: "Introduction to Algorithms",
      bookAuthor: "Thomas H. Cormen",
      isbn: "978-0262033848",
      studentId: "ST001",
      studentName: "Rahul Sharma",
      studentRoom: "101",
      issueDate: "2024-03-01",
      dueDate: "2024-03-15",
      status: "issued",
    },
    {
      id: "2",
      bookId: "B002",
      bookTitle: "Clean Code",
      bookAuthor: "Robert C. Martin",
      isbn: "978-0132350884",
      studentId: "ST002",
      studentName: "Priya Patel",
      studentRoom: "103",
      issueDate: "2024-02-20",
      dueDate: "2024-03-05",
      status: "overdue",
      fineAmount: 50,
    },
  ]
}

export default function ReturnBooks() {
  const insets = useSafeAreaInsets()
  const [issuedBooks, setIssuedBooks] = useState<IssuedBook[]>([])
  const [filteredBooks, setFilteredBooks] = useState<IssuedBook[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getIssuedBooks()
        setIssuedBooks(data)
        setFilteredBooks(data)
      } catch (error) {
        Alert.alert("Error", "Failed to fetch issued books")
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [])

  useEffect(() => {
    let filtered = issuedBooks

    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.isbn.includes(searchTerm),
      )
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((book) => book.status === filterStatus)
    }

    setFilteredBooks(filtered)
  }, [searchTerm, filterStatus, issuedBooks])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "issued":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
      case "returned":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
      case "overdue":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
    }
  }

  const handleSelectBook = (bookId: string) => {
    const newSelected = new Set(selectedBooks)
    if (newSelected.has(bookId)) {
      newSelected.delete(bookId)
    } else {
      newSelected.add(bookId)
    }
    setSelectedBooks(newSelected)
  }

  const BookCard = ({ book }: { book: IssuedBook }) => (
    <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mb-3">
      <View className="flex-row items-start gap-3 mb-3">
        <TouchableOpacity onPress={() => handleSelectBook(book.id)}>
          <MaterialCommunityIcons
            name={selectedBooks.has(book.id) ? "checkbox-marked" : "checkbox-blank-outline"}
            size={24}
            color="#10b981"
          />
        </TouchableOpacity>

        <View className="flex-1">
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">{book.bookTitle}</Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">by {book.bookAuthor}</Text>
            </View>
            <View className={cn("px-2 py-1 rounded-full", getStatusColor(book.status))}>
              <Text className="text-xs font-medium capitalize">{book.status}</Text>
            </View>
          </View>

          <View className="space-y-2 mb-3">
            <View className="flex-row justify-between">
              <Text className="text-xs text-gray-600 dark:text-gray-400">Student:</Text>
              <Text className="text-xs font-medium text-gray-900 dark:text-white">
                {book.studentName} - Room {book.studentRoom}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs text-gray-600 dark:text-gray-400">Issue Date:</Text>
              <Text className="text-xs font-medium text-gray-900 dark:text-white">{book.issueDate}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs text-gray-600 dark:text-gray-400">Due Date:</Text>
              <Text className="text-xs font-medium text-gray-900 dark:text-white">{book.dueDate}</Text>
            </View>
            {book.fineAmount && (
              <View className="flex-row justify-between">
                <Text className="text-xs text-gray-600 dark:text-gray-400">Fine:</Text>
                <Text className="text-xs font-medium text-red-600">{formatCurrency(book.fineAmount)}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity className="bg-green-600 rounded-lg p-2">
            <Text className="text-white text-center text-sm font-medium">Process Return</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

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
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Return Books</Text>
          <Text className="text-sm mt-1 text-gray-600 dark:text-gray-400">Process book returns from students</Text>
        </View>

        <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-3">
          <View className="flex-row items-center px-3 rounded-lg border border-gray-300 dark:border-gray-600">
            <MaterialCommunityIcons name="magnify" size={20} color="#6b7280" />
            <TextInput
              placeholder="Search books or students..."
              placeholderTextColor="#9ca3af"
              value={searchTerm}
              onChangeText={setSearchTerm}
              className="flex-1 ml-2 py-2 text-sm text-gray-900 dark:text-white"
            />
          </View>

          <View className="flex-row gap-2">
            {["all", "issued", "overdue", "returned"].map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => setFilterStatus(status)}
                className={cn(
                  "py-2 px-3 rounded-lg border",
                  filterStatus === status
                    ? "bg-indigo-600 border-indigo-600"
                    : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600",
                )}
              >
                <Text
                  className={cn(
                    "text-xs font-medium capitalize",
                    filterStatus === status ? "text-white" : "text-gray-700 dark:text-gray-300",
                  )}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {selectedBooks.size > 0 && (
          <TouchableOpacity className="bg-green-600 rounded-lg p-3 flex-row items-center justify-center gap-2">
            <MaterialCommunityIcons name="check-circle" size={18} color="white" />
            <Text className="text-white font-semibold">Process Return ({selectedBooks.size})</Text>
          </TouchableOpacity>
        )}

        {filteredBooks.length > 0 ? (
          <FlatList
            scrollEnabled={false}
            data={filteredBooks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <BookCard book={item} />}
          />
        ) : (
          <View className="items-center justify-center py-12">
            <MaterialCommunityIcons name="book-check" size={48} color="#10b981" />
            <Text className="text-gray-500 dark:text-gray-400 mt-2">No books found</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}
