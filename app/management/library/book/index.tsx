
import { useState, useEffect } from "react"
import { View, Text, ScrollView, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { cn } from "@/utils/cn"

interface Book {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  totalCopies: number
  availableCopies: number
  price: number
  location: string
  status: "available" | "out_of_stock" | "discontinued"
}

// Mock API functions - replace with actual API calls
const getAllBooks = async (): Promise<Book[]> => {
  return [
    {
      id: "1",
      title: "Data Structures and Algorithms",
      author: "Thomas H. Cormen",
      isbn: "978-0262033848",
      category: "Computer Science",
      totalCopies: 8,
      availableCopies: 3,
      price: 1200,
      location: "CS-A-001",
      status: "available",
    },
    {
      id: "2",
      title: "Operating System Concepts",
      author: "Abraham Silberschatz",
      isbn: "978-1118063330",
      category: "Computer Science",
      totalCopies: 6,
      availableCopies: 2,
      price: 1500,
      location: "CS-A-002",
      status: "available",
    },
  ]
}

export default function BookManagement() {
  const insets = useSafeAreaInsets()
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getAllBooks()
        setBooks(data)
        setFilteredBooks(data)
      } catch (error) {
        Alert.alert("Error", "Failed to fetch books")
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [])

  useEffect(() => {
    let filtered = books

    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.isbn.includes(searchTerm),
      )
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((book) => book.status === filterStatus)
    }

    setFilteredBooks(filtered)
  }, [searchTerm, filterStatus, books])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
      case "out_of_stock":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
      case "discontinued":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
    }
  }

  const BookCard = ({ book }: { book: Book }) => (
    <View className="rounded-lg p-4 border border-gray-200  bg-white  mb-3">
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900 ">{book.title}</Text>
          <Text className="text-sm text-gray-600  mt-1">by {book.author}</Text>
        </View>
        <View className={cn("px-2 py-1 rounded-full", getStatusColor(book.status))}>
          <Text className="text-xs font-medium capitalize">{book.status.replace("_", " ")}</Text>
        </View>
      </View>

      <View className="space-y-2 mb-3">
        <View className="flex-row justify-between">
          <Text className="text-xs text-gray-600 ">ISBN:</Text>
          <Text className="text-xs font-medium text-gray-900 ">{book.isbn}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-xs text-gray-600 ">Category:</Text>
          <Text className="text-xs font-medium text-gray-900 ">{book.category}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-xs text-gray-600 ">Location:</Text>
          <Text className="text-xs font-medium text-gray-900 ">{book.location}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-xs text-gray-600 ">Copies:</Text>
          <Text className="text-xs font-medium text-gray-900 ">
            {book.availableCopies}/{book.totalCopies}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-2">
        <TouchableOpacity className="flex-1 bg-indigo-600 rounded-lg p-2">
          <Text className="text-white text-center text-sm font-medium">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-red-600 rounded-lg p-2">
          <Text className="text-white text-center text-sm font-medium">Delete</Text>
        </TouchableOpacity>
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
          <Text className="text-2xl font-bold text-gray-900 ">Book Management</Text>
          <Text className="text-sm mt-1 text-gray-600 ">Manage library books and inventory</Text>
        </View>

        <View className="rounded-lg p-4 border border-gray-200  bg-white  space-y-3">
          <View className="flex-row items-center px-3 rounded-lg border border-gray-300 ">
            <MaterialCommunityIcons name="magnify" size={20} color="#6b7280" />
            <TextInput
              placeholder="Search books..."
              placeholderTextColor="#9ca3af"
              value={searchTerm}
              onChangeText={setSearchTerm}
              className="flex-1 ml-2 py-2 text-sm text-gray-900 "
            />
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setFilterStatus("all")}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg border",
                filterStatus === "all"
                  ? "bg-indigo-600 border-indigo-600"
                  : "bg-white  border-gray-200 ",
              )}
            >
              <Text
                className={cn(
                  "text-center text-sm font-medium",
                  filterStatus === "all" ? "text-white" : "text-gray-700 ",
                )}
              >
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFilterStatus("available")}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg border",
                filterStatus === "available"
                  ? "bg-green-600 border-green-600"
                  : "bg-white  border-gray-200 ",
              )}
            >
              <Text
                className={cn(
                  "text-center text-sm font-medium",
                  filterStatus === "available" ? "text-white" : "text-gray-700 ",
                )}
              >
                Available
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFilterStatus("out_of_stock")}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg border",
                filterStatus === "out_of_stock"
                  ? "bg-yellow-600 border-yellow-600"
                  : "bg-white  border-gray-200 ",
              )}
            >
              <Text
                className={cn(
                  "text-center text-sm font-medium",
                  filterStatus === "out_of_stock" ? "text-white" : "text-gray-700 ",
                )}
              >
                Out of Stock
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setViewMode("list")}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg border flex-row items-center justify-center gap-2",
                viewMode === "list"
                  ? "bg-indigo-600 border-indigo-600"
                  : "bg-white  border-gray-200 ",
              )}
            >
              <MaterialCommunityIcons
                name="format-list-bulleted"
                size={16}
                color={viewMode === "list" ? "white" : "#6b7280"}
              />
              <Text
                className={cn(
                  "text-sm font-medium",
                  viewMode === "list" ? "text-white" : "text-gray-700 ",
                )}
              >
                List
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setViewMode("grid")}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg border flex-row items-center justify-center gap-2",
                viewMode === "grid"
                  ? "bg-indigo-600 border-indigo-600"
                  : "bg-white  border-gray-200 ",
              )}
            >
              <MaterialCommunityIcons name="view-grid" size={16} color={viewMode === "grid" ? "white" : "#6b7280"} />
              <Text
                className={cn(
                  "text-sm font-medium",
                  viewMode === "grid" ? "text-white" : "text-gray-700 ",
                )}
              >
                Grid
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity className="bg-indigo-600 rounded-lg p-3 flex-row items-center justify-center gap-2">
          <MaterialCommunityIcons name="plus" size={20} color="white" />
          <Text className="text-white font-semibold">Add New Book</Text>
        </TouchableOpacity>

        {filteredBooks.length > 0 ? (
          <FlatList
            scrollEnabled={false}
            data={filteredBooks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <BookCard book={item} />}
          />
        ) : (
          <View className="items-center justify-center py-12">
            <MaterialCommunityIcons name="book-open-blank-variant" size={48} color="#d1d5db" />
            <Text className="text-gray-500  mt-2">No books found</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}
