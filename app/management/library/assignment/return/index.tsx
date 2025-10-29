
import { useContext, useEffect, useMemo, useState } from "react"
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, FlatList } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import RNPickerSelect from "react-native-picker-select"
import { format, differenceInDays, isPast } from "date-fns"
import { AlertContext } from "@/context/Alert/context"
import { Typography } from "@/components/Typography"
import { getAllClass } from "@/service/management/class/classBasic"
import { getClassStudents } from "@/service/management/student"
import { get_borrowed_books, return_book } from "@/service/management/library"
import { useClasses } from "@/hooks/management/classes"

interface BorrowedBook {
  assignment_id: string
  title: string
  author: string
  isbn: string
  code: string
  cover?: string
  issue_date: string
  due_date: string
  fine_amount?: number
  status: "issued" | "overdue"
}

interface Student {
  _id: string
  first_name: string
  middle_name?: string
  last_name?: string
  admission_no: string
}

interface Class {
  _id: string
  name: string
  classCode: string
}

interface BorrowedData {
  student_id: string
  student_name: string
  borrowed_books: BorrowedBook[]
  total_fine?: number
}

type FilterType = "ALL" | "OVERDUE" | "DUE_TODAY" | "DUE_SOON"
type ViewType = "GRID" | "LIST"

export default function ReturnBooksPage() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { showAlert } = useContext(AlertContext)

  const { classes: allClass } = useClasses()
  const [allStudent, setAllStudent] = useState<Student[]>([])
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [borrowed, setBorrowed] = useState<BorrowedData | null>(null)
  const [filteredBooks, setFilteredBooks] = useState<BorrowedBook[]>([])

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<FilterType>("ALL")
  const [viewType, setViewType] = useState<ViewType>("GRID")
  const [isLoading, setIsLoading] = useState(false)
  const [isReturning, setIsReturning] = useState<string | null>(null)

  // Memoized student options
  const studentOptions = useMemo(() => {
    return allStudent.map((student) => ({
      label:
        `(${student.admission_no}) ${student.first_name} ${student.middle_name || ""} ${student.last_name || ""}`.trim(),
      value: student._id,
    }))
  }, [allStudent])

  // Memoized class options
  const classList = useMemo(() => {
    return allClass.map((cls) => ({
      label: `${cls.name} (${cls.classCode})`,
      value: cls._id,
    }))
  }, [allClass])

  // Safe date parsing
  const safeParseDateString = (dateString: string | undefined | null): Date | null => {
    if (!dateString) return null
    try {
      const date = new Date(dateString)
      if (!isNaN(date.getTime())) {
        return date
      }
      return null
    } catch (error) {
      return null
    }
  }

  // Get book status
  const getBookStatus = (
    dueDate: string,
  ): { status: "issued" | "overdue" | "due_today" | "due_soon"; color: string; days: number } => {
    const due = safeParseDateString(dueDate)
    if (!due) return { status: "issued", color: "bg-blue-500", days: 0 }

    const today = new Date()
    const daysDiff = differenceInDays(due, today)

    if (isPast(due)) {
      return { status: "overdue", color: "bg-red-500", days: Math.abs(daysDiff) }
    } else if (daysDiff === 0) {
      return { status: "due_today", color: "bg-orange-500", days: 0 }
    } else if (daysDiff <= 3) {
      return { status: "due_soon", color: "bg-yellow-500", days: daysDiff }
    } else {
      return { status: "issued", color: "bg-blue-500", days: daysDiff }
    }
  }

  // Format date display
  const formatDateDisplay = (dateString: string) => {
    const date = safeParseDateString(dateString)
    if (!date) return "Date not available"

    try {
      return format(date, "dd MMM yyyy")
    } catch (error) {
      return "Invalid date"
    }
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount)
  }



  // Fetch students when class changes
  const handleClassChange = async (classId: string) => {
    setSelectedClass(classId)
    setSelectedStudent(null)
    setBorrowed(null)
    setAllStudent([])

    if (classId) {
      try {
        const students = await getClassStudents(classId)
        setAllStudent(students)
      } catch (error) {
        showAlert("ERROR", "Failed to fetch students")
      }
    }
  }

  // Fetch borrowed books when student changes
  const handleStudentChange = (studentId: string) => {
    const student = allStudent.find((s) => s._id === studentId)
    setSelectedStudent(student || null)

    if (student) {
      getBorrowedRequest(student._id)
    } else {
      setBorrowed(null)
    }
  }

  // Get borrowed books
  const getBorrowedRequest = async (studentId: string) => {
    setIsLoading(true)
    try {
      const borrowedDetails = await get_borrowed_books(studentId)
      setBorrowed(borrowedDetails)
    } catch (error) {
      showAlert("ERROR", "Failed to fetch borrowed books")
      setBorrowed(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter books
  useEffect(() => {
    if (!borrowed?.borrowed_books) {
      setFilteredBooks([])
      return
    }

    let filtered = [...borrowed.borrowed_books]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.isbn.includes(searchTerm) ||
          book.code.includes(searchTerm),
      )
    }

    // Apply status filter
    switch (filterType) {
      case "OVERDUE":
        filtered = filtered.filter((book) => {
          const due = safeParseDateString(book.due_date)
          return due ? isPast(due) : false
        })
        break
      case "DUE_TODAY":
        filtered = filtered.filter((book) => {
          const due = safeParseDateString(book.due_date)
          return due ? differenceInDays(due, new Date()) === 0 : false
        })
        break
      case "DUE_SOON":
        filtered = filtered.filter((book) => {
          const due = safeParseDateString(book.due_date)
          if (!due) return false
          const days = differenceInDays(due, new Date())
          return days > 0 && days <= 3
        })
        break
    }

    // Sort by due date (overdue first)
    filtered.sort((a, b) => {
      const dateA = safeParseDateString(a.due_date)
      const dateB = safeParseDateString(b.due_date)
      if (!dateA && !dateB) return 0
      if (!dateA) return 1
      if (!dateB) return -1
      return dateA.getTime() - dateB.getTime()
    })

    setFilteredBooks(filtered)
  }, [borrowed, searchTerm, filterType])

  // Handle book return
  const handleReturnBook = async (assignmentId: string) => {
    setIsReturning(assignmentId)
    try {
      await return_book({ assignment_id: assignmentId })
      showAlert("SUCCESS", "Book returned successfully")
      if (selectedStudent) {
        getBorrowedRequest(selectedStudent._id)
      }
    } catch (error: any) {
      showAlert("ERROR", error?.response?.data?.message || "Error in returning book")
    } finally {
      setIsReturning(null)
    }
  }

  // Get statistics
  const getStats = () => {
    if (!borrowed?.borrowed_books) return { total: 0, overdue: 0, dueToday: 0, dueSoon: 0, totalFine: 0 }

    const books = borrowed.borrowed_books
    const total = books.length
    const overdue = books.filter((book) => {
      const due = safeParseDateString(book.due_date)
      return due ? isPast(due) : false
    }).length
    const dueToday = books.filter((book) => {
      const due = safeParseDateString(book.due_date)
      return due ? differenceInDays(due, new Date()) === 0 : false
    }).length
    const dueSoon = books.filter((book) => {
      const due = safeParseDateString(book.due_date)
      if (!due) return false
      const days = differenceInDays(due, new Date())
      return days > 0 && days <= 3
    }).length
    const totalFine = books.reduce((sum, book) => sum + (book.fine_amount || 0), 0)

    return { total, overdue, dueToday, dueSoon, totalFine }
  }

  const stats = getStats()

  // Book Card Component for Grid View
  const BookGridCard = ({ book }: { book: BorrowedBook }) => {
    const bookStatus = getBookStatus(book.due_date)
    return (
      <View className="rounded-lg border border-border bg-card p-3 flex-1">
        <View className="h-32 bg-gray-100 rounded-lg mb-3 items-center justify-center">
          <MaterialCommunityIcons name="book" size={48} color="#3b82f6" />
        </View>

        <Typography className="text-sm font-medium text-foreground mb-1 line-clamp-2">{book.title}</Typography>
        <Typography className="text-xs text-muted-foreground mb-2">by {book.author}</Typography>

        <View className="space-y-1 mb-3">
          <Typography className="text-xs text-muted-foreground">ISBN: {book.isbn}</Typography>
          <Typography className="text-xs text-muted-foreground">Code: {book.code}</Typography>
          <Typography className="text-xs text-muted-foreground">Due: {formatDateDisplay(book.due_date)}</Typography>
        </View>

        <View className={`rounded-full   px-2 py-1 mb-3 ${bookStatus.color}`}>
          <Typography className="text-xs  font-medium text-white">
            {bookStatus.status === "overdue"
              ? `${bookStatus.days} days overdue`
              : bookStatus.status === "due_today"
                ? "Due today"
                : bookStatus.status === "due_soon"
                  ? `Due in ${bookStatus.days} days`
                  : "Issued"}
          </Typography>
        </View>

        {book.fine_amount && book.fine_amount > 0 && (
          <View className="bg-red-50 rounded-lg p-2 mb-3 flex-row items-center gap-1">
            <MaterialCommunityIcons name="alert" size={14} color="#dc2626" />
            <Typography className="text-xs font-medium text-red-800">
              Fine: {formatCurrency(book.fine_amount)}
            </Typography>
          </View>
        )}

        <TouchableOpacity
          onPress={() => handleReturnBook(book.assignment_id)}
          disabled={isReturning === book.assignment_id}
          className={`flex-row items-center justify-center rounded-lg py-2 ${isReturning === book.assignment_id ? "bg-gray-800" : "bg-purple-600"
            }`}
        >
          {isReturning === book.assignment_id ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <MaterialCommunityIcons name="rotate-360" size={16} color="white" />
              <Typography className="text-white font-semibold ml-1">Return</Typography>
            </>
          )}
        </TouchableOpacity>
      </View>
    )
  }

  // Book List Item Component for List View
  const BookListItem = ({ book }: { book: BorrowedBook }) => {
    const bookStatus = getBookStatus(book.due_date)
    return (
      <View className="rounded-lg border border-border bg-card p-4 mb-4 flex-row">
        <View className="w-16 h-20 bg-gray-100 rounded-lg items-center justify-center mr-4">
          <MaterialCommunityIcons name="book" size={32} color="#3b82f6" />
        </View>

        <View className="flex-1">
          <Typography className="text-base font-semibold text-foreground mb-1">{book.title}</Typography>
          <Typography className="text-sm text-muted-foreground mb-2">by {book.author}</Typography>

          <View className="mb-2">
            <View className="flex-row items-center gap-2 mb-1">
              <MaterialCommunityIcons name="book-marker" size={14} color="#999" />
              <Typography className="text-sm text-foreground">ISBN: {book.isbn}</Typography>
            </View>
            <View className="flex-row items-center gap-2 mb-1">
              <MaterialCommunityIcons name="book-open-page-variant" size={14} color="#999" />
              <Typography className="text-sm text-foreground">Code: {book.code}</Typography>
            </View>
            <View className="flex-row items-center gap-2 mb-1">
              <MaterialCommunityIcons name="calendar" size={14} color="#999" />
              <Typography className="text-sm text-foreground">Issued: {formatDateDisplay(book.issue_date)}</Typography>
            </View>
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons name="clock" size={14} color="#999" />
              <Typography className="text-sm text-foreground">Due: {formatDateDisplay(book.due_date)}</Typography>
            </View>
          </View>

          {book.fine_amount && book.fine_amount > 0 && (
            <View className="bg-red-50 rounded-lg p-2 mb-2 flex-row items-center gap-2">
              <MaterialCommunityIcons name="alert" size={16} color="#dc2626" />
              <Typography className="text-sm font-medium text-red-800">
                Fine: {formatCurrency(book.fine_amount)}
              </Typography>
            </View>
          )}
        </View>

        <View className="items-end gap-2">
          {/* <View className={`rounded-full px-2 py-1 ${getBookStatus(book.due_date).color}`}>
            <Typography className="text-xs font-medium text-white">
              {getBookStatus(book.due_date).status === "overdue"
                ? `${getBookStatus(book.due_date).days}d`
                : getBookStatus(book.due_date).status === "due_today"
                  ? "Today"
                  : getBookStatus(book.due_date).status === "due_soon"
                    ? `${getBookStatus(book.due_date).days}d`
                    : "OK"}
            </Typography>
          </View> */}
          <TouchableOpacity
            onPress={() => handleReturnBook(book.assignment_id)}
            disabled={isReturning === book.assignment_id}
            activeOpacity={0.7}
            className={`flex-row items-center justify-center rounded-lg px-3 py-2 ${isReturning === book.assignment_id ? "bg-gray-400" : "bg-purple-600"
              }`}
          >
            {isReturning === book.assignment_id ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <MaterialCommunityIcons name="logout" size={16} color="white" />
                <Typography className="text-white font-semibold ml-1 text-xs">
                  Vacate
                </Typography>
              </>
            )}
          </TouchableOpacity>

        </View>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false}>

        <View className="flex-row items-center p-4">
          <TouchableOpacity
            onPress={() => router.push("/management/library")}
            className="flex-row items-center bg-white border border-border rounded-lg px-3 py-2 mr-2"
          >
            <Typography className="text-primary font-semibold">← Back</Typography>
          </TouchableOpacity>
          <Typography className="text-lg font-bold text-foreground">Return Books</Typography>
        </View>

        <View className="px-4 pb-6">

          <View className="mb-6 rounded-lg bg-white border border-border bg-card p-4">
            <Typography className="text-lg font-semibold text-foreground mb-4">Select Student</Typography>


            <View className="mb-4">
              <Typography className="text-sm font-medium text-foreground mb-2">
                Class <Text className="text-red-500">*</Text>
              </Typography>
              <RNPickerSelect
                items={classList}
                onValueChange={handleClassChange}
                value={selectedClass}
                placeholder={{ label: "-- Select Class --", value: null }}
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


            <View>
              <Typography className="text-sm font-medium text-foreground mb-2">
                Student <Text className="text-red-500">*</Text>
              </Typography>
              <RNPickerSelect
                items={studentOptions}
                onValueChange={handleStudentChange}
                value={selectedStudent?._id || ""}
                placeholder={{ label: "-- Select Student --", value: null }}
                disabled={!selectedClass}
                style={{
                  inputIOS: {
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    backgroundColor: "#f9fafb",
                    color: "#000",
                    opacity: !selectedClass ? 0.5 : 1,
                  },
                  inputAndroid: {
                    paddingVertical: 0,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    backgroundColor: "#f9fafb",
                    color: "#000",
                    opacity: !selectedClass ? 0.5 : 1,
                  },
                }}
              />
            </View>
          </View>

          {/* Loading State */}
          {isLoading && (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color="#10b981" />
              <Typography className="mt-2 text-muted-foreground">Loading borrowed books...</Typography>
            </View>
          )}

          {/* Borrowed Books Section */}
          {borrowed && !isLoading && (
            <>
              {/* Stats */}
              <View className="mb-6 bg-white rounded-lg border border-border bg-card p-4">
                <Typography className="text-lg font-semibold text-foreground mb-3">
                  Borrowed Books - {borrowed.student_name}
                </Typography>
                <View className="space-y-2">
                  <View className="flex-row justify-between">
                    <Typography className="text-sm text-muted-foreground">Total: {stats.total}</Typography>
                    <Typography className="text-sm text-muted-foreground">Overdue: {stats.overdue}</Typography>
                  </View>
                  <View className="flex-row justify-between">
                    <Typography className="text-sm text-muted-foreground">Due Today: {stats.dueToday}</Typography>
                    <Typography className="text-sm text-muted-foreground">Due Soon: {stats.dueSoon}</Typography>
                  </View>
                  {stats.totalFine > 0 && (
                    <Typography className="text-sm font-medium text-red-600">
                      Total Fine: {formatCurrency(stats.totalFine)}
                    </Typography>
                  )}
                </View>
              </View>

              {/* Search and Filters */}
              <View className="mb-6 bg-white rounded-lg border border-border bg-card p-4">
                {/* Search Input */}
                <View className="mb-4 flex-row items-center rounded-lg border border-border bg-background px-3">
                  <MaterialCommunityIcons name="magnify" size={18} color="#999" />
                  <TextInput
                    placeholder="Search by title, author, ISBN..."
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    className="flex-1 px-2 py-2 text-foreground"
                    placeholderTextColor="#999"
                  />
                </View>

                {/* View Type Selector */}
                <View className="mb-4">
                  <RNPickerSelect
                    items={[
                      { label: "Grid View", value: "GRID" },
                      { label: "List View", value: "LIST" },
                    ]}
                    onValueChange={(value) => setViewType(value as ViewType)}
                    value={viewType}
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

                {/* Filter Buttons */}
                <View className="flex-row flex-wrap gap-2">
                  {(["ALL", "OVERDUE", "DUE_TODAY", "DUE_SOON"] as FilterType[]).map((filter) => (
                    <TouchableOpacity
                      key={filter}
                      onPress={() => setFilterType(filter)}
                      className={`rounded-lg px-3 py-2 flex-row items-center gap-1 ${filterType === filter ? "bg-indigo-600" : "bg-card border border-border"
                        }`}
                    >
                      <Typography
                        className={`text-xs font-medium ${filterType === filter ? "text-white" : "text-foreground"}`}
                      >
                        {filter.replace(/_/g, " ")}
                      </Typography>
                      {filter === "OVERDUE" && stats.overdue > 0 && (
                        <View className="bg-red-500 rounded-full px-2 py-0.5">
                          <Typography className="text-xs font-medium text-white">{stats.overdue}</Typography>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Books Display */}
              {filteredBooks.length === 0 ? (
                <View className="rounded-lg border border-border bg-card p-8 items-center">
                  <MaterialCommunityIcons name="book-open" size={48} color="#999" />
                  <Typography className="text-lg font-semibold text-foreground mt-4 mb-2">No Books Found</Typography>
                  <Typography className="text-muted-foreground text-center">
                    {searchTerm || filterType !== "ALL"
                      ? "No books match your search criteria."
                      : "This student has no borrowed books."}
                  </Typography>
                </View>
              ) : viewType === "GRID" ? (
                <View className="gap-3 bg-white">
                  <FlatList
                    scrollEnabled={false}
                    data={filteredBooks}
                    keyExtractor={(item) => item.assignment_id}
                    numColumns={2}
                    columnWrapperStyle={{ gap: 12 }}
                    renderItem={({ item }) => (
                      <View className="flex-1">
                        <BookGridCard book={item} />
                      </View>
                    )}
                  />
                </View>
              ) : (
                <FlatList
                  scrollEnabled={false}
                  data={filteredBooks}
                  keyExtractor={(item) => item.assignment_id}
                  renderItem={({ item }) => <BookListItem book={item} />}
                />
              )}
            </>
          )}

          {/* No Student Selected */}
          {!borrowed && !isLoading && selectedStudent && (
            <View className="rounded-lg border border-border bg-card p-8 items-center">
              <MaterialCommunityIcons name="account" size={48} color="#999" />
              <Typography className="text-lg font-semibold text-foreground mt-4 mb-2">No Borrowed Books</Typography>
              <Typography className="text-muted-foreground">This student has no borrowed books to return.</Typography>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
