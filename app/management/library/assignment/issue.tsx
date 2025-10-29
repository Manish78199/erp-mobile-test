"use client"

import { useContext, useEffect, useMemo, useState } from "react"
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, FlatList } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import RNPickerSelect from "react-native-picker-select"
import DateTimePicker from "@react-native-community/datetimepicker"
import { getAllClass } from "@/service/management/class/classBasic"
import { getClassStudents } from "@/service/management/student"
import { assign_book, search_books } from "@/service/management/library"
import { AlertContext } from "@/context/Alert/context"
import { Typography } from "@/components/Typography"
import { useClasses } from "@/hooks/management/classes"

interface Book {
  _id: string
  title: string
  author: string
  isbn: string
  code: string
  total_copies: number
  borrow_copy: number
  cover_photo?: string
  category?: string
  description?: string
}

interface SelectedBook extends Book {
  quantity: number
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

export default function BookIssueForm() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { showAlert } = useContext(AlertContext)

  // Form states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("")
  const [selectedBooks, setSelectedBooks] = useState<SelectedBook[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [currentClass, setCurrentClass] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [dueDate, setDueDate] = useState("")
  const [showDatePicker, setShowDatePicker] = useState(false)

  // Data states

  const [allStudents, setAllStudents] = useState<Student[]>([])
  const [availableBooks, setAvailableBooks] = useState<Book[]>([])

  // Loading states
  const [isFetching, setIsFetching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { classes: allClasses } = useClasses()

  // Memoized classes
  const classList = useMemo(
    () =>
      allClasses.map((c) => ({
        label: `${c.name} (${c.classCode})`,
        value: c._id,
      })),
    [allClasses],
  )


  const studentOptions = useMemo(() => {
    const students = allStudents.map((student) => ({
      label: `(${student.admission_no}) ${student.first_name} ${student.middle_name || ""} ${student.last_name}`.trim(),
      value: student._id,
    }))
    return students
  }, [allStudents])

  // Fetch classes on component mount


  // Handle class change and fetch students
  const handleClassChange = async (classId: string) => {
    setCurrentClass(classId)
    setSelectedStudent("")

    if (classId) {
      try {
        const students = await getClassStudents(classId)
        setAllStudents(students)
      } catch (error) {
        showAlert("ERROR", "Failed to fetch students")
      }
    } else {
      setAllStudents([])
    }
  }

  // Search books with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchBooks(searchTerm)
      } else {
        setAvailableBooks([])
        setFilteredBooks([])
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const fetchBooks = async (query: string) => {
    setIsFetching(true)
    try {
      const books = await search_books(query)
      setAvailableBooks(books)
      setFilteredBooks(books)
    } catch (error) {
      showAlert("ERROR", "Failed to search books")
      setAvailableBooks([])
      setFilteredBooks([])
    } finally {
      setIsFetching(false)
    }
  }

  // Filter books based on category
  useEffect(() => {
    let filtered = availableBooks

    if (selectedCategory !== "all") {
      filtered = filtered.filter((book) => book.category === selectedCategory)
    }

    setFilteredBooks(filtered)
  }, [availableBooks, selectedCategory])

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(availableBooks.map((book) => book.category).filter((cat): cat is string => cat !== undefined)))
    return ["all", ...uniqueCategories]
  }, [availableBooks])

  const handleDateChange = (event: any, selectedDate: any) => {
    setShowDatePicker(false)
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split("T")[0]
      setDueDate(dateString)
    }
  }

  // Handle book issue
  const handleIssueBooks = async () => {
    if (!selectedStudent) {
      showAlert("ERROR", "Please select a student")
      return
    }

    if (!dueDate) {
      showAlert("ERROR", "Please select due date")
      return
    }

    if (selectedBooks.length === 0) {
      showAlert("ERROR", "Please select at least one book")
      return
    }

    setIsSubmitting(true)

    try {
      const data = {
        student_id: selectedStudent,
        due_date: dueDate,
        book_ids: selectedBooks.flatMap((book) => Array(book.quantity).fill(book._id)),
      }

      const response = await assign_book(data)
      showAlert("SUCCESS", response?.data?.message || "Books issued successfully!")

      // Reset form
      setSelectedStudent("")
      setSelectedBooks([])
      setDueDate("")
      setCurrentClass("")
      setAllStudents([])
      setSearchTerm("")
      setAvailableBooks([])
      setFilteredBooks([])
    } catch (error: any) {
      showAlert("ERROR", error?.response?.data?.message || "Error in assigning books")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleBookSelection = (book: Book) => {
    const existingBook = selectedBooks.find((b) => b._id === book._id)
    const availableCopies = book.total_copies - book.borrow_copy

    if (availableCopies <= 0) {
      showAlert("ERROR", "This book is not available")
      return
    }

    if (existingBook) {
      setSelectedBooks((prev) => prev.filter((b) => b._id !== book._id))
    } else {
      setSelectedBooks((prev) => [...prev, { ...book, quantity: 1 }])
    }
  }

  const removeBookFromSelection = (bookId: string) => {
    setSelectedBooks((prev) => prev.filter((book) => book._id !== bookId))
  }

  const updateBookQuantity = (bookId: string, change: number) => {
    setSelectedBooks((prev) =>
      prev.map((book) => {
        if (book._id === bookId) {
          const newQuantity = book.quantity + change
          const availableCopies = book.total_copies - book.borrow_copy

          if (newQuantity <= 0) return book
          if (newQuantity > availableCopies) {
            showAlert("ERROR", `Only ${availableCopies} copies available`)
            return book
          }
          return { ...book, quantity: newQuantity }
        }
        return book
      }),
    )
  }

  const SelectedBookItem = ({ book }: { book: SelectedBook }) => (
    <View className="mb-2 flex-row items-center justify-between rounded-lg bg-card p-3">
      <View className="flex-1 flex-row items-center gap-3">
        <View className="h-10 w-8 items-center justify-center rounded-sm bg-blue-100">
          <MaterialCommunityIcons name="book" size={16} color="#3b82f6" />
        </View>
        <View className="flex-1">
          <Typography className="text-sm font-medium text-foreground">{book.title}</Typography>
          <Typography className="text-xs text-muted-foreground">by {book.author}</Typography>
        </View>
      </View>
      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          onPress={() => updateBookQuantity(book._id, -1)}
          disabled={book.quantity <= 1}
          className="rounded-lg border border-border bg-background p-2"
        >
          <MaterialCommunityIcons name="minus" size={14} color="#10b981" />
        </TouchableOpacity>
        <Typography className="w-6 text-center text-sm font-medium text-foreground">{book.quantity}</Typography>
        <TouchableOpacity
          onPress={() => updateBookQuantity(book._id, 1)}
          disabled={book.quantity >= book.total_copies - book.borrow_copy}
          className="rounded-lg border border-border bg-background p-2"
        >
          <MaterialCommunityIcons name="plus" size={14} color="#10b981" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeBookFromSelection(book._id)} className="rounded-lg bg-red-100 p-2">
          <MaterialCommunityIcons name="close" size={14} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  )

  const BookCard = ({ book }: { book: Book }) => {
    const isSelected = selectedBooks.some((b) => b._id === book._id)
    const selectedQuantity = selectedBooks.find((b) => b._id === book._id)?.quantity || 0
    const availableCopies = book.total_copies - book.borrow_copy

    return (
      <TouchableOpacity
        onPress={() => toggleBookSelection(book)}
        className={`rounded-lg border p-3 ${isSelected ? "border-emerald-500 bg-emerald-50" : "border-border bg-card"
          } ${availableCopies <= 0 ? "opacity-50" : ""}`}
      >
        <View className="items-center">
          <View className="mb-2 h-28 w-20 items-center justify-center rounded-md bg-blue-100">
            <MaterialCommunityIcons name="book-open-page-variant" size={48} color="#3b82f6" />
          </View>
          <Typography className="mb-1 line-clamp-2 text-center text-sm font-medium text-foreground">
            {book.title}
          </Typography>
          <Typography className="mb-1 text-center text-xs text-muted-foreground">by {book.author}</Typography>
          <Typography className="mb-1 text-center text-xs text-muted-foreground">Code: {book.code}</Typography>
          <Typography className="mb-2 text-center text-xs text-muted-foreground">ISBN: {book.isbn}</Typography>

          {book.category && (
            <View className="mb-2 rounded-full bg-blue-100 px-2 py-1">
              <Typography className="text-xs font-medium text-blue-800">{book.category}</Typography>
            </View>
          )}

          <View className="w-full flex-row items-center justify-between">
            <View className={`rounded-full px-2 py-1 ${availableCopies > 0 ? "bg-emerald-100" : "bg-red-100"}`}>
              <Typography
                className={`text-xs font-medium ${availableCopies > 0 ? "text-emerald-800" : "text-red-800"}`}
              >
                {availableCopies} available
              </Typography>
            </View>
            {isSelected && (
              <View className="rounded-full bg-emerald-500 px-2 py-1">
                <Typography className="text-xs font-medium text-white">Selected: {selectedQuantity}</Typography>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center p-4">
          <TouchableOpacity
            onPress={() => router.push("/management/library")}
            className="flex-row items-center bg-white border border-border rounded-lg px-3 py-2 mr-2"
          >
            <Typography className="text-primary font-semibold">← Back</Typography>
          </TouchableOpacity>

          <Typography className="text-lg font-bold text-foreground">Book Issue</Typography>
        </View>

        <View className="p-4">
          {/* Issue Book Form Section */}
          <View className="mb-6 rounded-lg bg-white border border-border bg-card p-4">
            <View className="mb-4 flex-row items-center gap-3">
              <View className="rounded-lg bg-emerald-600 p-2">
                <MaterialCommunityIcons name="account-check" size={20} color="white" />
              </View>
              <Typography className="text-lg font-semibold text-foreground">Issue New Books</Typography>
            </View>

            {/* Class Selection */}
            <View className="mb-4">
              <Typography className="mb-2 text-sm font-medium text-foreground">
                Class <Text className="text-red-500">*</Text>
              </Typography>
              <RNPickerSelect
                items={classList}
                onValueChange={handleClassChange}
                value={currentClass}
                placeholder={{ label: "-- Select class --", value: null }}
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

            {/* Student Selection */}
            <View className="mb-4">
              <Typography className="mb-2 text-sm font-medium text-foreground">
                Student <Text className="text-red-500">*</Text>
              </Typography>
              <RNPickerSelect
                items={studentOptions}
                onValueChange={setSelectedStudent}
                value={selectedStudent}
                placeholder={{ label: "-- Select student --", value: null }}
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

            {/* Selected Books List */}
            {selectedBooks.length > 0 && (
              <View className="mb-4">
                <Typography className="mb-3 text-base font-medium text-foreground">
                  Selected Books ({selectedBooks.length})
                </Typography>
                <View className="max-h-40">
                  <FlatList
                    scrollEnabled={false}
                    data={selectedBooks}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => <SelectedBookItem book={item} />}
                  />
                </View>
              </View>
            )}

            {/* Due Date and Issue Button */}
            {selectedBooks.length > 0 && selectedStudent && (
              <View className="mb-4">
                <Typography className="mb-2 text-sm font-medium text-foreground">
                  Due Date <Text className="text-red-500">*</Text>
                </Typography>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="rounded-lg border border-border bg-background px-3 py-2"
                >
                  <Typography className="text-foreground">{dueDate || "Select due date"}</Typography>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={dueDate ? new Date(dueDate) : new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
              </View>
            )}

            <TouchableOpacity
              onPress={handleIssueBooks}
              disabled={!selectedStudent || selectedBooks.length === 0 || isSubmitting}
              className={`flex-row items-center justify-center rounded-lg py-3 ${isSubmitting || !selectedStudent || selectedBooks.length === 0 ? "bg-gray-400" : "bg-blue-700"
                }`}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <MaterialCommunityIcons name="book-check" size={20} color="white" />
                  <Typography className="ml-2 font-semibold text-white">
                    Issue {selectedBooks.reduce((sum, book) => sum + book.quantity, 0)} Book(s)
                  </Typography>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Book Search and Filter Section */}
          <View className="mb-6 rounded-lg border bg-white border-border bg-card p-4">
            <View className="mb-4 flex-row items-center gap-3">
              <View className="rounded-lg bg-blue-600 p-2">
                <MaterialCommunityIcons name="magnify" size={20} color="white" />
              </View>
              <Typography className="text-lg font-semibold text-foreground">Available Books</Typography>
            </View>

            {/* Search Input */}
            <View className="mb-4 flex-row items-center rounded-lg border border-border bg-background px-3">
              <MaterialCommunityIcons name="magnify" size={18} color="#999" />
              <TextInput
                placeholder="Search by ISBN, title, author..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                className="flex-1 px-2 py-2 text-foreground"
                placeholderTextColor="#999"
              />
            </View>

            {/* Category Filter */}
            <View className="mb-4">
              <RNPickerSelect
                items={categories.map((cat) => ({
                  label: cat === "all" ? "All Categories" : cat,
                  value: cat,
                }))}
                onValueChange={setSelectedCategory}
                value={selectedCategory}
                placeholder={{ label: "Category", value: null }}
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

            {/* Loading State */}
            {isFetching && (
              <View className="items-center py-8">
                <ActivityIndicator size="large" color="#10b981" />
                <Typography className="mt-2 text-muted-foreground">Searching books...</Typography>
              </View>
            )}

            {/* Books Grid */}
            {!isFetching && filteredBooks.length > 0 && (
              <>
                <Typography className="mb-4 text-sm text-muted-foreground">
                  Search Result: {filteredBooks.length} Books
                </Typography>
                <View className="gap-3">
                  <FlatList
                    scrollEnabled={false}
                    data={filteredBooks}
                    keyExtractor={(item) => item._id}
                    numColumns={2}
                    columnWrapperStyle={{ gap: 12 }}
                    renderItem={({ item }) => (
                      <View className="flex-1">
                        <BookCard book={item} />
                      </View>
                    )}
                  />
                </View>
              </>
            )}

            {/* No Results */}
            {!isFetching && searchTerm && filteredBooks.length === 0 && (
              <View className="items-center py-8">
                <MaterialCommunityIcons name="folder-open" size={48} color="#d1d5db" />
                <Typography className="mt-2 text-muted-foreground">
                  No books found matching your search criteria.
                </Typography>
              </View>
            )}

            {/* Initial State */}
            {!searchTerm && (
              <View className="items-center py-8">
                <MaterialCommunityIcons name="book-search" size={48} color="#d1d5db" />
                <Typography className="mt-2 text-muted-foreground">Start typing to search for books...</Typography>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
