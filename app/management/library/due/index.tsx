"use client"

import { useContext, useMemo, useState } from "react"
import { View, ScrollView, TextInput, TouchableOpacity, FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import RNPickerSelect from "react-native-picker-select"
import { AlertContext } from "@/context/Alert/context"
import { Typography } from "@/components/Typography"

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

export default function DueBooksManagement() {
  const router = useRouter()
  const { showAlert } = useContext(AlertContext)

  const [searchTerm, setSearchTerm] = useState("")
  const [filterDays, setFilterDays] = useState("all")
  const [selectedBooks, setSelectedBooks] = useState<string[]>([])

  const overdueBooks: OverdueBook[] = [
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
    {
      id: "3",
      bookId: "B003",
      bookTitle: "Database System Concepts",
      bookAuthor: "Henry F. Korth",
      isbn: "978-0072958867",
      studentId: "ST003",
      studentName: "Amit Kumar",
      studentEmail: "amit.kumar@email.com",
      studentPhone: "+91 9876543214",
      studentRoom: "101",
      issueDate: "2024-01-20",
      dueDate: "2024-02-03",
      daysOverdue: 28,
      fineAmount: 280,
      lastReminderSent: "2024-02-25",
      status: "overdue",
    },
  ]

  const fineRates = {
    perDay: 10,
    maxFine: 500,
    gracePeriod: 3,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "overdue":
        return "bg-red-100"
      case "fine_paid":
        return "bg-yellow-100"
      case "returned_with_fine":
        return "bg-green-100"
      default:
        return "bg-gray-100"
    }
  }

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "overdue":
        return "text-red-800"
      case "fine_paid":
        return "text-yellow-800"
      case "returned_with_fine":
        return "text-green-800"
      default:
        return "text-gray-800"
    }
  }

  const getPriorityColor = (daysOverdue: number) => {
    if (daysOverdue >= 30) return "bg-red-500"
    if (daysOverdue >= 14) return "bg-orange-500"
    if (daysOverdue >= 7) return "bg-yellow-500"
    return "bg-blue-500"
  }

  const filteredBooks = useMemo(() => {
    return overdueBooks.filter((book) => {
      const matchesSearch =
        book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.includes(searchTerm)

      const matchesDays =
        filterDays === "all" ||
        (filterDays === "1-7" && book.daysOverdue <= 7) ||
        (filterDays === "8-14" && book.daysOverdue >= 8 && book.daysOverdue <= 14) ||
        (filterDays === "15-30" && book.daysOverdue >= 15 && book.daysOverdue <= 30) ||
        (filterDays === "30+" && book.daysOverdue > 30)

      return matchesSearch && matchesDays
    })
  }, [searchTerm, filterDays])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleSelectBook = (bookId: string) => {
    setSelectedBooks((prev) => (prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]))
  }

  const handleSelectAll = () => {
    if (selectedBooks.length === filteredBooks.length) {
      setSelectedBooks([])
    } else {
      setSelectedBooks(filteredBooks.map((book) => book.id))
    }
  }

  const handleSendReminder = (bookIds: string[]) => {
    showAlert("SUCCESS", `Reminder sent to ${bookIds.length} student(s)`)
    setSelectedBooks([])
  }

  const handleCollectFine = (bookId: string) => {
    showAlert("SUCCESS", `Fine collected for book ${bookId}`)
  }

  const totalFineAmount = filteredBooks.reduce((sum, book) => sum + book.fineAmount, 0)
  const criticalCount = overdueBooks.filter((book) => book.daysOverdue >= 30).length
  const averageFine = totalFineAmount / (overdueBooks.length || 1)

  const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    color,
  }: {
    title: string
    value: string | number
    subtitle: string
    icon: string
    color: string
  }) => (
    <View className="flex-1 rounded-lg border border-border bg-card p-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Typography className="text-xs text-muted-foreground mb-1">{title}</Typography>
          <Typography className={`text-lg font-bold ${color}`}>{value}</Typography>
          <Typography className="text-xs text-muted-foreground mt-1">{subtitle}</Typography>
        </View>
        <View className={`rounded-lg p-2 ${color.replace("text-", "bg-").replace("-600", "-100")}`}>
          <MaterialCommunityIcons name={icon as any} size={20} color={color.replace("text-", "#").replace("-600", "")} />
        </View>
      </View>
    </View>
  )

  const OverdueBookItem = ({ book }: { book: OverdueBook }) => {
    const isSelected = selectedBooks.includes(book.id)

    return (
      <View className="mb-4 rounded-lg border border-border bg-card p-4">
        <View className="flex-row items-start gap-3">
          {/* Checkbox */}
          <TouchableOpacity
            onPress={() => handleSelectBook(book.id)}
            className={`mt-1 h-5 w-5 rounded border-2 items-center justify-center ${
              isSelected ? "bg-blue-600 border-blue-600" : "border-border bg-background"
            }`}
          >
            {isSelected && <MaterialCommunityIcons name="check" size={14} color="white" />}
          </TouchableOpacity>

          {/* Book Icon */}
          <View className="rounded-lg bg-red-100 p-2">
            <MaterialCommunityIcons name="book-open" size={20} color="#ef4444" />
          </View>

          {/* Content */}
          <View className="flex-1">
            {/* Title and Status */}
            <View className="flex-row items-start justify-between mb-2">
              <View className="flex-1">
                <Typography className="text-sm font-semibold text-foreground mb-1">{book.bookTitle}</Typography>
                <Typography className="text-xs text-muted-foreground mb-2">by {book.bookAuthor}</Typography>
                <View className="flex-row gap-2 mb-3">
                  <View className={`rounded-full px-2 py-1 ${getStatusColor(book.status)}`}>
                    <Typography className={`text-xs font-medium ${getStatusTextColor(book.status)}`}>
                      {book.status.replace("_", " ").toUpperCase()}
                    </Typography>
                  </View>
                  <View className="rounded-full bg-red-100 px-2 py-1">
                    <Typography className="text-xs font-medium text-red-800">{book.daysOverdue} days</Typography>
                  </View>
                </View>
              </View>

              {/* Fine Amount */}
              <View className="items-end">
                <View className="flex-row items-center gap-1 mb-2">
                  <View className={`w-2 h-2 rounded-full ${getPriorityColor(book.daysOverdue)}`} />
                  <Typography className="text-base font-bold text-red-600">
                    {formatCurrency(book.fineAmount)}
                  </Typography>
                </View>
              </View>
            </View>

            {/* Student Info */}
            <View className="mb-3 space-y-2">
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons name="account" size={14} color="#999" />
                <Typography className="text-xs text-foreground">
                  {book.studentName} - Room {book.studentRoom}
                </Typography>
              </View>
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons name="email" size={14} color="#999" />
                <Typography className="text-xs text-foreground">{book.studentEmail}</Typography>
              </View>
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons name="phone" size={14} color="#999" />
                <Typography className="text-xs text-foreground">{book.studentPhone}</Typography>
              </View>
            </View>

            {/* Dates */}
            <View className="mb-3 space-y-2">
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons name="calendar" size={14} color="#999" />
                <Typography className="text-xs text-foreground">Issued: {formatDate(book.issueDate)}</Typography>
              </View>
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons name="clock" size={14} color="#999" />
                <Typography className="text-xs text-foreground">Due: {formatDate(book.dueDate)}</Typography>
              </View>
              {book.lastReminderSent && (
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons name="send" size={14} color="#999" />
                  <Typography className="text-xs text-foreground">
                    Last reminder: {formatDate(book.lastReminderSent)}
                  </Typography>
                </View>
              )}
            </View>

            {/* Fine Calculation */}
            <View className="mb-3 rounded-lg bg-red-50 p-3">
              <Typography className="text-xs font-medium text-red-800 mb-1">Fine Calculation</Typography>
              <Typography className="text-xs text-red-600">
                {book.daysOverdue} days × ₹{fineRates.perDay}/day = {formatCurrency(book.fineAmount)}
              </Typography>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => handleSendReminder([book.id])}
                className="flex-1 flex-row items-center justify-center rounded-lg border border-orange-500 py-2"
              >
                <MaterialCommunityIcons name="send" size={14} color="#f97316" />
                <Typography className="ml-1 text-xs font-medium text-orange-600">Reminder</Typography>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleCollectFine(book.id)}
                className="flex-1 flex-row items-center justify-center rounded-lg bg-green-600 py-2"
              >
                <MaterialCommunityIcons name="check-circle" size={14} color="white" />
                <Typography className="ml-1 text-xs font-medium text-white">Collect</Typography>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-border">
          <View>
            <Typography className="text-xl font-bold text-foreground">Due Books Management</Typography>
            <Typography className="text-xs text-muted-foreground mt-1">Track overdue books and manage fines</Typography>
          </View>
          <TouchableOpacity
            onPress={() => handleSendReminder(selectedBooks)}
            disabled={selectedBooks.length === 0}
            className={`flex-row items-center gap-2 rounded-lg px-3 py-2 ${
              selectedBooks.length === 0 ? "bg-gray-300" : "bg-orange-600"
            }`}
          >
            <MaterialCommunityIcons name="send" size={14} color="white" />
            <Typography className="text-xs font-medium text-white">Send ({selectedBooks.length})</Typography>
          </TouchableOpacity>
        </View>

        <View className="p-4">
          {/* Summary Cards */}
          <View className="mb-6">
            <View className="flex-row gap-2 mb-2">
              <StatCard
                title="Overdue Books"
                value={overdueBooks.length}
                subtitle="Requires attention"
                icon="alert-triangle"
                color="text-red-600"
              />
              <StatCard
                title="Total Fines"
                value={formatCurrency(totalFineAmount)}
                subtitle="Pending collection"
                icon="cash"
                color="text-orange-600"
              />
            </View>
            <View className="flex-row gap-2">
              <StatCard
                title="Critical (30+)"
                value={criticalCount}
                subtitle="Immediate action"
                icon="clock-alert"
                color="text-red-600"
              />
              <StatCard
                title="Average Fine"
                value={formatCurrency(averageFine)}
                subtitle="Per book"
                icon="cash-multiple"
                color="text-purple-600"
              />
            </View>
          </View>

          {/* Filters */}
          <View className="mb-6 rounded-lg border border-border bg-card p-4">
            {/* Search */}
            <View className="mb-4 flex-row items-center rounded-lg border border-border bg-background px-3">
              <MaterialCommunityIcons name="magnify" size={18} color="#999" />
              <TextInput
                placeholder="Search by title, student, ISBN..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                className="flex-1 px-2 py-2 text-foreground"
                placeholderTextColor="#999"
              />
            </View>

            {/* Filter and Select All */}
            <View className="flex-row gap-2">
              <View className="flex-1">
                <RNPickerSelect
                  items={[
                    { label: "All Overdue", value: "all" },
                    { label: "1-7 days", value: "1-7" },
                    { label: "8-14 days", value: "8-14" },
                    { label: "15-30 days", value: "15-30" },
                    { label: "30+ days", value: "30+" },
                  ]}
                  onValueChange={setFilterDays}
                  value={filterDays}
                  style={{
                    inputIOS: {
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#e5e7eb",
                      backgroundColor: "#f9fafb",
                      color: "#000",
                      fontSize: 14,
                    },
                    inputAndroid: {
                      paddingVertical: 8,
                      paddingHorizontal: 10,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#e5e7eb",
                      backgroundColor: "#f9fafb",
                      color: "#000",
                      fontSize: 14,
                    },
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={handleSelectAll}
                className="rounded-lg border border-border bg-background px-3 py-2"
              >
                <Typography className="text-xs font-medium text-foreground">
                  {selectedBooks.length === filteredBooks.length ? "Deselect All" : "Select All"}
                </Typography>
              </TouchableOpacity>
            </View>
          </View>

          {/* Overdue Books List */}
          {filteredBooks.length > 0 ? (
            <FlatList
              scrollEnabled={false}
              data={filteredBooks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <OverdueBookItem book={item} />}
            />
          ) : (
            <View className="rounded-lg border border-border bg-card p-8 items-center">
              <MaterialCommunityIcons name="check-circle" size={48} color="#10b981" />
              <Typography className="text-base font-semibold text-foreground mt-4">No Overdue Books</Typography>
              <Typography className="text-xs text-muted-foreground mt-2 text-center">
                All books are returned on time or no books match your search criteria.
              </Typography>
            </View>
          )}

          {/* Fine Settings */}
          <View className="mt-8 rounded-lg border border-border bg-card p-4">
            <Typography className="text-base font-semibold text-foreground mb-4">Fine Settings</Typography>
            <View className="flex-row gap-2">
              <View className="flex-1 rounded-lg bg-blue-50 p-3">
                <Typography className="text-xs font-medium text-blue-800 mb-1">Fine per Day</Typography>
                <Typography className="text-base font-bold text-blue-900">
                  {formatCurrency(fineRates.perDay)}
                </Typography>
              </View>
              <View className="flex-1 rounded-lg bg-purple-50 p-3">
                <Typography className="text-xs font-medium text-purple-800 mb-1">Maximum Fine</Typography>
                <Typography className="text-base font-bold text-purple-900">
                  {formatCurrency(fineRates.maxFine)}
                </Typography>
              </View>
              <View className="flex-1 rounded-lg bg-green-50 p-3">
                <Typography className="text-xs font-medium text-green-800 mb-1">Grace Period</Typography>
                <Typography className="text-base font-bold text-green-900">{fineRates.gracePeriod} days</Typography>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
