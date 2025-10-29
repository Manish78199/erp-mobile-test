
import { useState, useEffect } from "react"
import { View, Text, ScrollView, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { cn } from "@/utils/cn"
import { Typography } from "@/components/Typography"
import { useRouter } from "expo-router"

interface OverdueBook {
  id: string
  bookId: string
  bookTitle: string
  bookAuthor: string
  isbn: string
  studentId: string
  studentName: string
  studentEmail: string
  studentPhone: string
  studentRoom: string
  issueDate: string
  dueDate: string
  daysOverdue: number
  fineAmount: number
  lastReminderSent?: string
  status: "overdue" | "fine_paid" | "returned_with_fine"
}

// Mock API functions - replace with actual API calls
const getOverdueBooks = async (): Promise<OverdueBook[]> => {
  return [
    {
      id: "1",
      bookId: "B001",
      bookTitle: "Introduction to Algorithms",
      bookAuthor: "Thomas H. Cormen",
      isbn: "978-0262033848",
      studentId: "ST001",
      studentName: "Rahul Sharma",
      studentEmail: "rahul.sharma@email.com",
      studentPhone: "+91 9876543210",
      studentRoom: "101",
      issueDate: "2024-02-01",
      dueDate: "2024-02-15",
      daysOverdue: 15,
      fineAmount: 150,
      lastReminderSent: "2024-02-20",
      status: "overdue",
    },
    {
      id: "2",
      bookId: "B002",
      bookTitle: "Clean Code",
      bookAuthor: "Robert C. Martin",
      isbn: "978-0132350884",
      studentId: "ST002",
      studentName: "Priya Patel",
      studentEmail: "priya.patel@email.com",
      studentPhone: "+91 9876543212",
      studentRoom: "103",
      issueDate: "2024-02-10",
      dueDate: "2024-02-24",
      daysOverdue: 8,
      fineAmount: 80,
      status: "overdue",
    },
  ]
}

export default function DueBooks() {
  const insets = useSafeAreaInsets()
  const [overdueBooks, setOverdueBooks] = useState<OverdueBook[]>([])
  const [filteredBooks, setFilteredBooks] = useState<OverdueBook[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDays, setFilterDays] = useState("all")
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set())

  const router = useRouter()

  const fineRates = {
    perDay: 10,
    maxFine: 500,
    gracePeriod: 3,
  }

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getOverdueBooks()
        setOverdueBooks(data)
        setFilteredBooks(data)
      } catch (error) {
        Alert.alert("Error", "Failed to fetch overdue books")
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [])

  useEffect(() => {
    let filtered = overdueBooks

    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.isbn.includes(searchTerm),
      )
    }

    if (filterDays !== "all") {
      filtered = filtered.filter((book) => {
        if (filterDays === "1-7") return book.daysOverdue <= 7
        if (filterDays === "8-14") return book.daysOverdue >= 8 && book.daysOverdue <= 14
        if (filterDays === "15-30") return book.daysOverdue >= 15 && book.daysOverdue <= 30
        if (filterDays === "30+") return book.daysOverdue > 30
        return true
      })
    }

    setFilteredBooks(filtered)
  }, [searchTerm, filterDays, overdueBooks])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getPriorityColor = (daysOverdue: number) => {
    if (daysOverdue >= 30) return "bg-red-500"
    if (daysOverdue >= 14) return "bg-orange-500"
    if (daysOverdue >= 7) return "bg-yellow-500"
    return "bg-blue-500"
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

  const handleSelectAll = () => {
    if (selectedBooks.size === filteredBooks.length) {
      setSelectedBooks(new Set())
    } else {
      setSelectedBooks(new Set(filteredBooks.map((b) => b.id)))
    }
  }

  const totalFineAmount = filteredBooks.reduce((sum, book) => sum + book.fineAmount, 0)

  const OverdueBookCard = ({ book }: { book: OverdueBook }) => (
    <View className="rounded-lg p-4 border border-gray-200  bg-white  mb-3">
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
              <Typography className="text-lg font-semibold text-gray-900 ">{book.bookTitle}</Typography>
              <Typography className="text-sm text-gray-600  mt-1">by {book.bookAuthor}</Typography>
            </View>
            <View className="flex-row items-center gap-2">
              <View className={cn("w-3 h-3 rounded-full", getPriorityColor(book.daysOverdue))} />
              <Typography className="text-lg font-bold text-red-600">{formatCurrency(book.fineAmount)}</Typography>
            </View>
          </View>

          <View className="space-y-2 mb-3">
            <View className="flex-row justify-between">
              <Typography className="text-xs text-gray-600 ">Student:</Typography>
              <Typography className="text-xs font-medium text-gray-900 ">
                {book.studentName} - Room {book.studentRoom}
              </Typography>
            </View>
            <View className="flex-row justify-between">
              <Typography className="text-xs text-gray-600 ">Days Overdue:</Typography>
              <Typography className="text-xs font-medium text-red-600">{book.daysOverdue} days</Typography>
            </View>
            <View className="flex-row justify-between">
              <Typography className="text-xs text-gray-600 ">Email:</Typography>
              <Typography className="text-xs font-medium text-gray-900 ">{book.studentEmail}</Typography>
            </View>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity className="flex-1 bg-orange-600 rounded-lg p-2">
              <Typography className="text-white text-center text-xs font-medium">Send Reminder</Typography>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-green-600 rounded-lg p-2">
              <Typography className="text-white text-center text-xs font-medium">Collect Fine</Typography>
            </TouchableOpacity>
          </View>
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
    <SafeAreaView className="flex-1 bg-background">

      <View className="flex-row items-center p-4">
        <TouchableOpacity
          onPress={() => router.push("/management")}
          className="flex-row items-center bg-white border border-border rounded-lg px-3 py-2 mr-2"
        >
          <Typography className="text-primary font-semibold">← Back</Typography>
        </TouchableOpacity>

        <Typography className="text-lg font-bold text-foreground">Due Books</Typography>
      </View>
      <ScrollView
        className="flex-1 bg-white dark:bg-gray-900"
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <View className="px-4 py-6 space-y-6">
          <View>
            <Typography className="text-2xl font-bold text-gray-900 ">Due Books Management</Typography>
            <Typography className="text-sm mt-1 text-gray-600 ">Track overdue books and manage fines</Typography>
          </View>

          <View className="space-y-3">
            <View className="rounded-lg p-4 border border-gray-200  bg-white ">
              <View className="flex-row items-center justify-between mb-2">
                <Typography className="text-sm font-medium text-gray-700 ">Overdue Books</Typography>
                <Typography className="text-2xl font-bold text-red-600">{overdueBooks.length}</Typography>
              </View>
              <Typography className="text-xs text-gray-600 ">Requires attention</Typography>
            </View>

            <View className="rounded-lg p-4 border border-gray-200  bg-white ">
              <View className="flex-row items-center justify-between mb-2">
                <Typography className="text-sm font-medium text-gray-700 ">Total Fines</Typography>
                <Typography className="text-2xl font-bold text-orange-600">{formatCurrency(totalFineAmount)}</Typography>
              </View>
              <Typography className="text-xs text-gray-600 ">Pending collection</Typography>
            </View>

            <View className="rounded-lg p-4 border border-gray-200  bg-white ">
              <View className="flex-row items-center justify-between mb-2">
                <Typography className="text-sm font-medium text-gray-700 ">Critical (30+ days)</Typography>
                <Typography className="text-2xl font-bold text-red-600">
                  {overdueBooks.filter((b) => b.daysOverdue >= 30).length}
                </Typography>
              </View>
              <Typography className="text-xs text-gray-600 ">Immediate action</Typography>
            </View>
          </View>

          <View className="rounded-lg p-4 border border-gray-200  bg-white  space-y-3">
            <View className="flex-row items-center px-3 rounded-lg border border-gray-300 ">
              <MaterialCommunityIcons name="magnify" size={20} color="#6b7280" />
              <TextInput
                placeholder="Search books or students..."
                placeholderTextColor="#9ca3af"
                value={searchTerm}
                onChangeText={setSearchTerm}
                className="flex-1 ml-2 py-2 text-sm text-gray-900 "
              />
            </View>

            <View className="flex-row gap-2">
              {["all", "1-7", "8-14", "15-30", "30+"].map((period) => (
                <TouchableOpacity
                  key={period}
                  onPress={() => setFilterDays(period)}
                  className={cn(
                    "py-2 px-3 rounded-lg border",
                    filterDays === period
                      ? "bg-indigo-600 border-indigo-600"
                      : "bg-white  border-gray-200 ",
                  )}
                >
                  <Typography
                    className={cn(
                      "text-xs font-medium",
                      filterDays === period ? "text-white" : "text-gray-700 ",
                    )}
                  >
                    {period === "all" ? "All" : `${period} days`}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleSelectAll}
              className="flex-row items-center p-2 rounded-lg border border-gray-200  bg-gray-50 "
            >
              <MaterialCommunityIcons
                name={
                  selectedBooks.size === filteredBooks.length && filteredBooks.length > 0
                    ? "checkbox-marked"
                    : "checkbox-blank-outline"
                }
                size={20}
                color="#10b981"
              />
              <Typography className="ml-2 text-sm font-medium text-gray-700 ">
                Select All ({filteredBooks.length})
              </Typography>
            </TouchableOpacity>
          </View>

          {selectedBooks.size > 0 && (
            <TouchableOpacity className="bg-orange-600 rounded-lg p-3 flex-row items-center justify-center gap-2">
              <MaterialCommunityIcons name="send" size={18} color="white" />
              <Typography className="text-white font-semibold">Send Reminder ({selectedBooks.size})</Typography>
            </TouchableOpacity>
          )}

          {filteredBooks.length > 0 ? (
            <FlatList
              scrollEnabled={false}
              data={filteredBooks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <OverdueBookCard book={item} />}
            />
          ) : (
            <View className="items-center justify-center py-12">
              <MaterialCommunityIcons name="check-circle" size={48} color="#10b981" />
              <Typography className="text-gray-500  mt-2">No overdue books</Typography>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
