// "use client"

// import type React from "react"
// import { useState } from "react"
// import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native"
// import Icon from "react-native-vector-icons/MaterialIcons"

// interface LibraryScreenProps {
//   navigation: any
// }

// const LibraryScreen: React.FC<LibraryScreenProps> = ({ navigation }) => {
//   const [selectedTab, setSelectedTab] = useState("search")
//   const [searchQuery, setSearchQuery] = useState("")

//   const libraryData = {
//     issuedBooks: [
//       {
//         id: 1,
//         title: "Advanced Mathematics",
//         author: "Dr. R.K. Sharma",
//         isbn: "978-0123456789",
//         issueDate: "2024-11-15",
//         dueDate: "2024-12-15",
//         status: "issued",
//         renewals: 1,
//       },
//       {
//         id: 2,
//         title: "Physics Fundamentals",
//         author: "Prof. A.K. Singh",
//         isbn: "978-0987654321",
//         issueDate: "2024-11-20",
//         dueDate: "2024-12-20",
//         status: "overdue",
//         renewals: 0,
//       },
//     ],
//     availableBooks: [
//       {
//         id: 3,
//         title: "Organic Chemistry",
//         author: "Dr. M.S. Chauhan",
//         isbn: "978-0456789123",
//         category: "Science",
//         location: "Section A, Shelf 3",
//         copies: 5,
//         rating: 4.5,
//       },
//       {
//         id: 4,
//         title: "World History",
//         author: "Prof. K.L. Verma",
//         isbn: "978-0789123456",
//         category: "History",
//         location: "Section B, Shelf 1",
//         copies: 3,
//         rating: 4.2,
//       },
//     ],
//   }

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     })
//   }

//   const getDaysUntilDue = (dueDate: string) => {
//     const today = new Date()
//     const due = new Date(dueDate)
//     const diffTime = due.getTime() - today.getTime()
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
//     return diffDays
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "issued":
//         return "#2ECC71"
//       case "overdue":
//         return "#E74C3C"
//       case "reserved":
//         return "#F39C12"
//       default:
//         return "#BDC3C7"
//     }
//   }

//   return (
//     <ScrollView className="flex-1 bg-[#F0F4F8]" showsVerticalScrollIndicator={false}>
//       {/* Header */}
//       <View className="flex-row items-center justify-between bg-[#6A5ACD] pt-12 pb-5 px-4 rounded-b-[25px]">
//         <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
//           <Icon name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
//         <Typography className="text-xl font-bold text-white">Library</Typography> 
//         <TouchableOpacity className="p-2">
//           <Icon name="qr-code-scanner" size={20} color="white" />
//         </TouchableOpacity>
//       </View>

//       {/* Summary Cards */}
//       <View className="flex-row justify-between px-4 -mt-8 mb-5">
//         <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
//           <Icon name="menu-book" size={28} color="#6A5ACD" />
//           <Typography className="text-2xl font-extrabold text-[#2C3E50] mt-2">{libraryData.issuedBooks.length}</Typography> 
//           <Typography className="text-xs text-[#7F8C8D] mt-1">Issued</Typography> 
//         </View>
//         <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
//           <Icon name="library-books" size={28} color="#2ECC71" />
//           <Typography className="text-2xl font-extrabold text-[#2C3E50] mt-2">
//             {libraryData.availableBooks.reduce((sum, book) => sum + book.copies, 0)}
//           </Typography> 
//           <Typography className="text-xs text-[#7F8C8D] mt-1">Available</Typography> 
//         </View>
//         <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
//           <Icon name="schedule" size={28} color="#E74C3C" />
//           <Typography className="text-2xl font-extrabold text-[#2C3E50] mt-2">
//             {libraryData.issuedBooks.filter((book) => book.status === "overdue").length}
//           </Typography> 
//           <Typography className="text-xs text-[#7F8C8D] mt-1">Overdue</Typography> 
//         </View>
//       </View>

//       {/* Tab Navigation */}
//       <View className="flex-row px-4 mb-5">
//         {["search", "issued", "history"].map((tab) => (
//           <TouchableOpacity
//             key={tab}
//             className={`flex-1 py-3 items-center mx-1 rounded-xl border ${
//               selectedTab === tab ? "bg-[#6A5ACD] border-[#6A5ACD]" : "bg-white border-[#DDE4EB]"
//             }`}
//             onPress={() => setSelectedTab(tab)}
//           >
//             <Typography className={`text-sm font-semibold ${selectedTab === tab ? "text-white" : "text-[#7F8C8D]"}`}>
//               {tab.charAt(0).toUpperCase() + tab.slice(1)}
//             </Typography> 
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Search Tab */}
//       {selectedTab === "search" && (
//         <View className="p-4">
//           <View className="relative mb-5">
//             <TextInput
//               className="bg-white border border-[#DDE4EB] rounded-xl pl-12 pr-4 py-3 text-sm text-[#2C3E50]"
//               placeholder="Search books, authors, ISBN..."
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//             />
//             <Icon name="search" size={20} color="#7F8C8D" className="absolute left-4 top-3.5" />
//           </View>

//           <Typography className="text-xl font-bold text-[#2C3E50] mb-4">Available Books</Typography> 
//           <View className="gap-4">
//             {libraryData.availableBooks.map((book) => (
//               <View key={book.id} className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
//                 <View className="flex-row justify-between items-start mb-3">
//                   <View className="flex-1">
//                     <Typography className="text-base font-bold text-[#2C3E50] mb-1">{book.title}</Typography> 
//                     <Typography className="text-sm text-[#7F8C8D] mb-1">by {book.author}</Typography> 
//                     <Typography className="text-xs text-[#6A5ACD]">{book.category}</Typography> 
//                   </View>
//                   <View className="items-end">
//                     <View className="flex-row items-center mb-1">
//                       <Icon name="star" size={14} color="#F39C12" />
//                       <Typography className="text-xs text-[#7F8C8D] ml-1">{book.rating}</Typography> 
//                     </View>
//                     <Typography className="text-xs text-[#2ECC71] font-semibold">{book.copies} copies</Typography> 
//                   </View>
//                 </View>

//                 <View className="flex-row justify-between items-center mb-3">
//                   <View className="flex-row items-center">
//                     <Icon name="location-on" size={16} color="#7F8C8D" />
//                     <Typography className="text-xs text-[#7F8C8D] ml-1">{book.location}</Typography> 
//                   </View>
//                   <Typography className="text-xs text-[#7F8C8D]">ISBN: {book.isbn}</Typography> 
//                 </View>

//                 <View className="flex-row gap-2">
//                   <TouchableOpacity className="flex-1 bg-[#6A5ACD] py-2 rounded-xl items-center">
//                     <Typography className="text-sm font-semibold text-white">Reserve</Typography> 
//                   </TouchableOpacity>
//                   <TouchableOpacity className="flex-1 bg-[#EAECEE] py-2 rounded-xl items-center">
//                     <Typography className="text-sm font-semibold text-[#2C3E50]">Details</Typography> 
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             ))}
//           </View>
//         </View>
//       )}

//       {/* Issued Tab */}
//       {selectedTab === "issued" && (
//         <View className="p-4">
//           <Typography className="text-xl font-bold text-[#2C3E50] mb-4">My Issued Books</Typography> 
//           <View className="gap-4">
//             {libraryData.issuedBooks.map((book) => (
//               <View key={book.id} className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
//                 <View className="flex-row justify-between items-center mb-3">
//                   <Typography className="text-base font-bold text-[#2C3E50] flex-1">{book.title}</Typography> 
//                   <View
//                     className="px-2 py-1 rounded-xl"
//                     style={{ backgroundColor: `${getStatusColor(book.status)}20` }}
//                   >
//                     <Typography className="text-[10px] font-bold" style={{ color: getStatusColor(book.status) }}>
//                       {book.status.toUpperCase()}
//                     </Typography> 
//                   </View>
//                 </View>

//                 <Typography className="text-sm text-[#7F8C8D] mb-3">by {book.author}</Typography> 

//                 <View className="flex-row justify-between items-center mb-3">
//                   <View>
//                     <Typography className="text-xs text-[#7F8C8D]">Issued: {formatDate(book.issueDate)}</Typography> 
//                     <Typography className="text-xs text-[#7F8C8D]">Due: {formatDate(book.dueDate)}</Typography> 
//                   </View>
//                   <View className="items-end">
//                     <Typography className="text-xs text-[#7F8C8D]">Renewals: {book.renewals}/2</Typography> 
//                     <Text
//                       className={`text-xs font-semibold ${
//                         getDaysUntilDue(book.dueDate) < 0 ? "text-[#E74C3C]" : "text-[#2ECC71]"
//                       }`}
//                     >
//                       {getDaysUntilDue(book.dueDate) < 0
//                         ? `${Math.abs(getDaysUntilDue(book.dueDate))} days overdue`
//                         : `${getDaysUntilDue(book.dueDate)} days left`}
//                     </Typography> 
//                   </View>
//                 </View>

//                 <View className="flex-row gap-2">
//                   <TouchableOpacity className="flex-1 bg-[#2ECC71] py-2 rounded-xl items-center">
//                     <Typography className="text-sm font-semibold text-white">Renew</Typography> 
//                   </TouchableOpacity>
//                   <TouchableOpacity className="flex-1 bg-[#F39C12] py-2 rounded-xl items-center">
//                     <Typography className="text-sm font-semibold text-white">Return</Typography> 
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             ))}
//           </View>
//         </View>
//       )}
//     </ScrollView>
//   )
// }

// export default LibraryScreen


"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  Modal,
  Image,
  ActivityIndicator,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { format, differenceInDays, isPast, isToday, isTomorrow } from "date-fns"
import {
  get_borrowed_book,
  // get_available_books,
  // get_library_history,
  // renew_book,
  // reserve_book,
  // return_book,
} from "@/service/student/library"
import { Typography } from "@/components/Typography"

// Types
interface BorrowedBook {
  _id: string
  title: string
  author: string
  isbn?: string
  code?: string
  status: "borrowed" | "returned" | "overdue"
  cover_photo?: string
  assign_date?: string
  due_date?: string
  fine_amount?: number
  renewal_count?: number
  max_renewals?: number
  category?: string
  publisher?: string
  class_name?: string
}

interface AvailableBook {
  _id: string
  title: string
  author: string
  isbn?: string
  code?: string
  category?: string
  publisher?: string
  cover_photo?: string
  location?: string
  copies_available?: number
  total_copies?: number
  rating?: number
  description?: string
}

interface LibraryHistory {
  _id: string
  title: string
  author: string
  isbn?: string
  assign_date: string
  return_date: string
  fine_amount?: number
  status: "returned"
}

type FilterType = "ALL" | "ACTIVE" | "OVERDUE" | "DUE_SOON"
type TabType = "search" | "issued" | "history"

interface LibraryScreenProps {
  navigation: any
}

// Custom Empty State Illustrations
const NoIssuedBooksIllustration = () => (
  <View className="items-center justify-center p-8">
    <View className="relative">
      <View className="w-20 h-16 bg-gray-200 rounded-lg border-2 border-gray-300 items-center justify-center">
        <Icon name="menu-book" size={32} color="#BDC3C7" />
      </View>
      <View className="absolute -top-2 -right-2 w-8 h-8 bg-blue-400 rounded-full items-center justify-center">
        <Typography className="text-white font-bold text-sm">0</Typography> 
      </View>
      <View className="absolute -left-3 top-3 w-2 h-2 bg-purple-300 rounded-full opacity-60" />
      <View className="absolute -right-1 bottom-2 w-1.5 h-1.5 bg-green-300 rounded-full opacity-60" />
    </View>
  </View>
)

const NoSearchResultsIllustration = () => (
  <View className="items-center justify-center p-8">
    <View className="relative">
      <View className="w-16 h-16 border-4 border-gray-300 rounded-full items-center justify-center">
        <View className="w-8 h-8 border-2 border-gray-400 rounded-full" />
      </View>
      <View className="absolute bottom-2 right-2 w-6 h-1 bg-gray-400 rounded-full transform rotate-45" />
      <View className="absolute inset-0 items-center justify-center">
        <View className="w-6 h-0.5 bg-orange-400 rounded-full transform rotate-45" />
        <View className="w-6 h-0.5 bg-orange-400 rounded-full transform -rotate-45 absolute" />
      </View>
    </View>
  </View>
)

const LibraryScreen: React.FC<LibraryScreenProps> = ({ navigation }) => {
  // State management
  const [selectedTab, setSelectedTab] = useState<TabType>("search")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("ALL")
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [isRenewing, setIsRenewing] = useState<string | null>(null)
  const [isReserving, setIsReserving] = useState<string | null>(null)
  const [isReturning, setIsReturning] = useState<string | null>(null)

  // Data states
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([])
  const [availableBooks, setAvailableBooks] = useState<AvailableBook[]>([])
  const [libraryHistory, setLibraryHistory] = useState<LibraryHistory[]>([])
  const [filteredBorrowedBooks, setFilteredBorrowedBooks] = useState<BorrowedBook[]>([])

  // Modal states
  const [showBookModal, setShowBookModal] = useState(false)
  const [selectedBook, setSelectedBook] = useState<BorrowedBook | AvailableBook | null>(null)

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
  const getBookStatus = (book: BorrowedBook) => {
    const dueDate = safeParseDateString(book.due_date)
    if (!dueDate) return { status: "unknown", color: "#BDC3C7", label: "Unknown", days: 0 }

    const today = new Date()
    const daysDiff = differenceInDays(dueDate, today)

    if (isPast(dueDate)) {
      return {
        status: "overdue",
        color: "#E74C3C",
        label: `${Math.abs(daysDiff)} days overdue`,
        days: Math.abs(daysDiff),
      }
    } else if (isToday(dueDate)) {
      return { status: "due_today", color: "#F39C12", label: "Due today", days: 0 }
    } else if (isTomorrow(dueDate)) {
      return { status: "due_tomorrow", color: "#F39C12", label: "Due tomorrow", days: 1 }
    } else if (daysDiff <= 3) {
      return { status: "due_soon", color: "#F39C12", label: `Due in ${daysDiff} days`, days: daysDiff }
    } else {
      return { status: "active", color: "#2ECC71", label: `${daysDiff} days left`, days: daysDiff }
    }
  }

  // Format date display
  const formatDateDisplay = (dateString: string | undefined | null) => {
    const date = safeParseDateString(dateString)
    if (!date) return "Date not available"

    try {
      if (isToday(date)) {
        return "Today"
      } else if (isTomorrow(date)) {
        return "Tomorrow"
      } else {
        return format(date, "dd MMM yyyy")
      }
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

  // Fetch data functions
  const fetchBorrowedBooks = async () => {
    try {
      const books = await get_borrowed_book()
      setBorrowedBooks(books)
      setFilteredBorrowedBooks(books)
    } catch (error) {
      console.error("Error fetching borrowed books:", error)
      Alert.alert("Error", "Failed to fetch borrowed books")
    }
  }

  const fetchAvailableBooks = async (query?: string) => {
    // try {
    //   const books = await get_available_books(query)
    //   setAvailableBooks(books)
    // } catch (error) {
    //   console.error("Error fetching available books:", error)
    //   Alert.alert("Error", "Failed to fetch available books")
    // }
  }

  const fetchLibraryHistory = async () => {
    // try {
    //   const history = await get_library_history()
    //   setLibraryHistory(history)
    // } catch (error) {
    //   console.error("Error fetching library history:", error)
    //   Alert.alert("Error", "Failed to fetch library history")
    // }
  }

  const fetchAllData = async () => {
    setIsLoading(true)
    try {
      await Promise.all([fetchBorrowedBooks(), fetchAvailableBooks(), fetchLibraryHistory()])
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh handler
  const onRefresh = async () => {
    setRefreshing(true)
    await fetchAllData()
    setRefreshing(false)
  }

  // Filter borrowed books
  const filterBorrowedBooks = (filterType: FilterType) => {
    let filtered = [...borrowedBooks]

    switch (filterType) {
      case "ACTIVE":
        filtered = filtered.filter((book) => {
          const status = getBookStatus(book)
          return status.status === "active"
        })
        break
      case "OVERDUE":
        filtered = filtered.filter((book) => {
          const status = getBookStatus(book)
          return status.status === "overdue"
        })
        break
      case "DUE_SOON":
        filtered = filtered.filter((book) => {
          const status = getBookStatus(book)
          return ["due_today", "due_tomorrow", "due_soon"].includes(status.status)
        })
        break
    }

    // Sort by due date
    filtered.sort((a, b) => {
      const dateA = safeParseDateString(a.due_date)
      const dateB = safeParseDateString(b.due_date)
      if (!dateA && !dateB) return 0
      if (!dateA) return 1
      if (!dateB) return -1
      return dateA.getTime() - dateB.getTime()
    })

    setFilteredBorrowedBooks(filtered)
    setSelectedFilter(filterType)
  }

  // Handle book actions
  const handleRenewBook = async (bookId: string) => {
    // setIsRenewing(bookId)
    // try {
    //   await renew_book(bookId)
    //   Alert.alert("Success", "Book renewed successfully!")
    //   await fetchBorrowedBooks()
    // } catch (error) {
    //   Alert.alert("Error", "Failed to renew book. Please try again.")
    // } finally {
    //   setIsRenewing(null)
    // }
  }

  const handleReserveBook = async (bookId: string) => {
    // setIsReserving(bookId)
    // try {
    //   await reserve_book(bookId)
    //   Alert.alert("Success", "Book reserved successfully!")
    //   await fetchAvailableBooks()
    // } catch (error) {
    //   Alert.alert("Error", "Failed to reserve book. Please try again.")
    // } finally {
    //   setIsReserving(null)
    // }
  }

  const handleReturnBook = async (bookId: string) => {
    // Alert.alert("Return Book", "Are you sure you want to return this book?", [
    //   { text: "Cancel", style: "cancel" },
    //   {
    //     text: "Return",
    //     onPress: async () => {
    //       setIsReturning(bookId)
    //       try {
    //         await return_book(bookId)
    //         Alert.alert("Success", "Book returned successfully!")
    //         await fetchBorrowedBooks()
    //       } catch (error) {
    //         Alert.alert("Error", "Failed to return book. Please try again.")
    //       } finally {
    //         setIsReturning(null)
    //       }
    //     },
    //   },
    // ])
  }

  // Get statistics
  const getStats = () => {
    const total = borrowedBooks.length
    const overdue = borrowedBooks.filter((book) => getBookStatus(book).status === "overdue").length
    const dueSoon = borrowedBooks.filter((book) => {
      const status = getBookStatus(book).status
      return ["due_today", "due_tomorrow", "due_soon"].includes(status)
    }).length
    const totalFines = borrowedBooks.reduce((sum, book) => sum + (book.fine_amount || 0), 0)
    const availableCount = availableBooks.reduce((sum, book) => sum + (book.copies_available || 0), 0)

    return { total, overdue, dueSoon, totalFines, availableCount }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      fetchAvailableBooks(searchQuery)
    } else {
      fetchAvailableBooks()
    }
  }, [searchQuery])

  useEffect(() => {
    filterBorrowedBooks(selectedFilter)
  }, [borrowedBooks, selectedFilter])

  const stats = getStats()

  return (
    <ScrollView
      className="flex-1 bg-[#F0F4F8]"
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between bg-[#6A5ACD] py-12 px-4 rounded-b-[25px]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Typography className="text-xl font-bold text-white">Library</Typography> 
        <TouchableOpacity className="p-2" onPress={onRefresh}>
          <Icon name="refresh" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View className="flex-row justify-between px-4 -mt-8 mb-5">
        <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
          <Icon name="menu-book" size={28} color="#6A5ACD" />
          <Typography className="text-2xl font-extrabold text-[#2C3E50] mt-2">{stats.total}</Typography> 
          <Typography className="text-xs text-[#7F8C8D] mt-1">Issued</Typography> 
        </View>
        <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
          <Icon name="library-books" size={28} color="#2ECC71" />
          <Typography className="text-2xl font-extrabold text-[#2C3E50] mt-2">{stats.availableCount}</Typography> 
          <Typography className="text-xs text-[#7F8C8D] mt-1">Available</Typography> 
        </View>
        <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
          <Icon name="schedule" size={28} color="#E74C3C" />
          <Typography className="text-2xl font-extrabold text-[#2C3E50] mt-2">{stats.overdue}</Typography> 
          <Typography className="text-xs text-[#7F8C8D] mt-1">Overdue</Typography> 
        </View>
      </View>

      {/* Fines Alert */}
      {stats.totalFines > 0 && (
        <View className="mx-4 mb-5 bg-red-50 border border-red-200 rounded-2xl p-4">
          <View className="flex-row items-center">
            <Icon name="warning" size={20} color="#E74C3C" />
            <Typography className="text-sm font-semibold text-red-800 ml-2">
              Total Outstanding Fines: {formatCurrency(stats.totalFines)}
            </Typography> 
          </View>
          <Typography className="text-xs text-red-600 mt-1">Please clear your fines to continue borrowing books.</Typography> 
        </View>
      )}

      {/* Tab Navigation */}
      <View className="flex-row px-4 mb-5">
        {[
          { id: "search", label: "Search", icon: "search" },
          { id: "issued", label: "Issued", icon: "menu-book" },
          { id: "history", label: "History", icon: "history" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            className={`flex-1 py-3 items-center mx-1 rounded-xl border ${
              selectedTab === tab.id ? "bg-[#6A5ACD] border-[#6A5ACD]" : "bg-white border-[#DDE4EB]"
            }`}
            onPress={() => setSelectedTab(tab.id as TabType)}
          >
            <Icon name={tab.icon} size={16} color={selectedTab === tab.id ? "white" : "#7F8C8D"} />
            <Typography className={`text-sm font-semibold mt-1 ${selectedTab === tab.id ? "text-white" : "text-[#7F8C8D]"}`}>
              {tab.label}
            </Typography> 
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Tab */}
      {selectedTab === "search" && (
        <View className="px-4">
          {/* Search Bar */}
          <View className="relative mb-5">
            <TextInput
              className="bg-white border border-[#DDE4EB] rounded-xl pl-12 pr-4 py-3 text-sm text-[#2C3E50]"
              placeholder="Search books, authors, ISBN..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Icon name="search" size={20} color="#7F8C8D" style={{ position: "absolute", left: 16, top: 12 }} />
          </View>

          <Typography className="text-xl font-bold text-[#2C3E50] mb-4">Available Books</Typography> 

          {isLoading ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color="#6A5ACD" />
              <Typography className="text-sm text-[#7F8C8D] mt-2">Loading books...</Typography> 
            </View>
          ) : availableBooks.length === 0 ? (
            <View className="bg-white rounded-2xl p-6 shadow-lg elevation-5 items-center">
              <NoSearchResultsIllustration />
              <Typography className="text-lg font-bold text-[#2C3E50] mt-4 mb-2">No Books Found</Typography> 
              <Typography className="text-sm text-[#7F8C8D] text-center mb-4">
                {searchQuery ? "No books match your search criteria." : "No books available at the moment."}
              </Typography> 
              {searchQuery && (
                <TouchableOpacity className="bg-[#6A5ACD] px-6 py-3 rounded-xl" onPress={() => setSearchQuery("")}>
                  <Typography className="text-white font-semibold">Clear Search</Typography> 
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View className="gap-4">
              {availableBooks.map((book) => (
                <View key={book._id} className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Typography className="text-base font-bold text-[#2C3E50] mb-1">{book.title}</Typography> 
                      <Typography className="text-sm text-[#7F8C8D] mb-1">by {book.author}</Typography> 
                      {book.category && <Typography className="text-xs text-[#6A5ACD]">{book.category}</Typography> }
                    </View>
                    <View className="items-end">
                      {book.rating && (
                        <View className="flex-row items-center mb-1">
                          <Icon name="star" size={14} color="#F39C12" />
                          <Typography className="text-xs text-[#7F8C8D] ml-1">{book.rating}</Typography> 
                        </View>
                      )}
                      <Typography className="text-xs text-[#2ECC71] font-semibold">
                        {book.copies_available || 0} available
                      </Typography> 
                    </View>
                  </View>

                  {book.location && (
                    <View className="flex-row items-center mb-3">
                      <Icon name="location-on" size={16} color="#7F8C8D" />
                      <Typography className="text-xs text-[#7F8C8D] ml-1">{book.location}</Typography> 
                    </View>
                  )}

                  {book.isbn && <Typography className="text-xs text-[#7F8C8D] mb-3">ISBN: {book.isbn}</Typography> }

                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      className="flex-1 bg-[#6A5ACD] py-2 rounded-xl items-center"
                      onPress={() => handleReserveBook(book._id)}
                      disabled={isReserving === book._id || (book.copies_available || 0) === 0}
                    >
                      {isReserving === book._id ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Typography className="text-sm font-semibold text-white">
                          {(book.copies_available || 0) > 0 ? "Reserve" : "Not Available"}
                        </Typography> 
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 bg-[#EAECEE] py-2 rounded-xl items-center"
                      onPress={() => {
                        setSelectedBook(book)
                        setShowBookModal(true)
                      }}
                    >
                      <Typography className="text-sm font-semibold text-[#2C3E50]">Details</Typography> 
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Issued Tab */}
      {selectedTab === "issued" && (
        <View className="px-4">
          {/* Filter Buttons */}
          <View className="flex-row flex-wrap gap-2 mb-4">
            {[
              { id: "ALL", label: "All", count: borrowedBooks.length },
              {
                id: "ACTIVE",
                label: "Active",
                count: borrowedBooks.filter((b) => getBookStatus(b).status === "active").length,
              },
              { id: "OVERDUE", label: "Overdue", count: stats.overdue },
              { id: "DUE_SOON", label: "Due Soon", count: stats.dueSoon },
            ].map((filter) => (
              <TouchableOpacity
                key={filter.id}
                className={`px-4 py-2 rounded-xl border ${
                  selectedFilter === filter.id ? "bg-[#6A5ACD] border-[#6A5ACD]" : "bg-white border-[#DDE4EB]"
                }`}
                onPress={() => filterBorrowedBooks(filter.id as FilterType)}
              >
                <Typography
                  className={`text-sm font-semibold ${selectedFilter === filter.id ? "text-white" : "text-[#7F8C8D]"}`}
                >
                  {filter.label} ({filter.count})
                </Typography> 
              </TouchableOpacity>
            ))}
          </View>

          <Typography className="text-xl font-bold text-[#2C3E50] mb-4">My Issued Books</Typography> 

          {isLoading ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color="#6A5ACD" />
              <Typography className="text-sm text-[#7F8C8D] mt-2">Loading books...</Typography> 
            </View>
          ) : filteredBorrowedBooks.length === 0 ? (
            <View className="bg-white rounded-2xl p-6 shadow-lg elevation-5 items-center">
              <NoIssuedBooksIllustration />
              <Typography className="text-lg font-bold text-[#2C3E50] mt-4 mb-2">
                {selectedFilter === "ALL"
                  ? "No Issued Books"
                  : `No ${selectedFilter.toLowerCase().replace("_", " ")} Books`}
              </Typography> 
              <Typography className="text-sm text-[#7F8C8D] text-center mb-4">
                {selectedFilter === "ALL"
                  ? "You haven't borrowed any books yet."
                  : `No books match the ${selectedFilter.toLowerCase().replace("_", " ")} filter.`}
              </Typography> 
              {selectedFilter !== "ALL" && (
                <TouchableOpacity
                  className="bg-[#6A5ACD] px-6 py-3 rounded-xl"
                  onPress={() => filterBorrowedBooks("ALL")}
                >
                  <Typography className="text-white font-semibold">View All Books</Typography> 
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View className="gap-4">
              {filteredBorrowedBooks.map((book) => {
                const bookStatus = getBookStatus(book)
                const canRenew = (book.renewal_count || 0) < (book.max_renewals || 3) && bookStatus.status !== "overdue"

                return (
                  <View key={book._id} className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
                    <View className="flex-row justify-between items-center mb-3">
                      <Typography className="text-base font-bold text-[#2C3E50] flex-1">{book.title}</Typography> 
                      <View className="px-2 py-1 rounded-xl" style={{ backgroundColor: `${bookStatus.color}20` }}>
                        <Typography className="text-[10px] font-bold" style={{ color: bookStatus.color }}>
                          {bookStatus.label.toUpperCase()}
                        </Typography> 
                      </View>
                    </View>

                    <Typography className="text-sm text-[#7F8C8D] mb-3">by {book.author}</Typography> 

                    <View className="flex-row justify-between items-center mb-3">
                      <View>
                        <Typography className="text-xs text-[#7F8C8D]">Issued: {formatDateDisplay(book.assign_date)}</Typography> 
                        <Typography className="text-xs text-[#7F8C8D]">Due: {formatDateDisplay(book.due_date)}</Typography> 
                        {book.isbn && <Typography className="text-xs text-[#7F8C8D]">ISBN: {book.isbn}</Typography> }
                      </View>
                      <View className="items-end">
                        <Typography className="text-xs text-[#7F8C8D]">
                          Renewals: {book.renewal_count || 0}/{book.max_renewals || 3}
                        </Typography> 
                        <Typography
                          className={`text-xs font-semibold ${
                            bookStatus.status === "overdue" ? "text-[#E74C3C]" : "text-[#2ECC71]"
                          }`}
                        >
                          {bookStatus.label}
                        </Typography> 
                      </View>
                    </View>

                    {book.fine_amount && book.fine_amount > 0 && (
                      <View className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3">
                        <View className="flex-row items-center">
                          <Icon name="warning" size={16} color="#E74C3C" />
                          <Typography className="text-sm font-semibold text-red-800 ml-2">
                            Fine: {formatCurrency(book.fine_amount)}
                          </Typography> 
                        </View>
                      </View>
                    )}

                    <View className="flex-row gap-2">
                      {canRenew && (
                        <TouchableOpacity
                          className="flex-1 bg-[#2ECC71] py-2 rounded-xl items-center"
                          onPress={() => handleRenewBook(book._id)}
                          disabled={isRenewing === book._id}
                        >
                          {isRenewing === book._id ? (
                            <ActivityIndicator size="small" color="white" />
                          ) : (
                            <Typography className="text-sm font-semibold text-white">Renew</Typography> 
                          )}
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        className="flex-1 bg-[#F39C12] py-2 rounded-xl items-center"
                        onPress={() => handleReturnBook(book._id)}
                        disabled={isReturning === book._id}
                      >
                        {isReturning === book._id ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Typography className="text-sm font-semibold text-white">Return</Typography> 
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="flex-1 bg-[#EAECEE] py-2 rounded-xl items-center"
                        onPress={() => {
                          setSelectedBook(book)
                          setShowBookModal(true)
                        }}
                      >
                        <Typography className="text-sm font-semibold text-[#2C3E50]">Details</Typography> 
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              })}
            </View>
          )}
        </View>
      )}

      {/* History Tab */}
      {selectedTab === "history" && (
        <View className="px-4">
          <Typography className="text-xl font-bold text-[#2C3E50] mb-4">Library History</Typography> 

          {isLoading ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color="#6A5ACD" />
              <Typography className="text-sm text-[#7F8C8D] mt-2">Loading history...</Typography> 
            </View>
          ) : libraryHistory.length === 0 ? (
            <View className="bg-white rounded-2xl p-6 shadow-lg elevation-5 items-center">
              <Icon name="history" size={48} color="#BDC3C7" />
              <Typography className="text-lg font-bold text-[#2C3E50] mt-4 mb-2">No History Available</Typography> 
              <Typography className="text-sm text-[#7F8C8D] text-center">
                Your library history will appear here once you start borrowing books.
              </Typography> 
            </View>
          ) : (
            <View className="gap-4">
              {libraryHistory.map((book) => (
                <View key={book._id} className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Typography className="text-base font-bold text-[#2C3E50] mb-1">{book.title}</Typography> 
                      <Typography className="text-sm text-[#7F8C8D] mb-1">by {book.author}</Typography> 
                      {book.isbn && <Typography className="text-xs text-[#7F8C8D]">ISBN: {book.isbn}</Typography> }
                    </View>
                    <View className="px-2 py-1 rounded-xl bg-green-100">
                      <Typography className="text-[10px] font-bold text-green-800">RETURNED</Typography> 
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center">
                    <View>
                      <Typography className="text-xs text-[#7F8C8D]">Borrowed: {formatDateDisplay(book.assign_date)}</Typography> 
                      <Typography className="text-xs text-[#7F8C8D]">Returned: {formatDateDisplay(book.return_date)}</Typography> 
                    </View>
                    {book.fine_amount && book.fine_amount > 0 && (
                      <View className="items-end">
                        <Typography className="text-xs text-red-600 font-semibold">
                          Fine Paid: {formatCurrency(book.fine_amount)}
                        </Typography> 
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Book Detail Modal */}
      <Modal
        visible={showBookModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBookModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[25px] p-5 max-h-[80%]">
            <View className="flex-row justify-between items-center mb-5">
              <Typography className="text-xl font-bold text-[#2C3E50] flex-1 mr-4">Book Details</Typography> 
              <TouchableOpacity onPress={() => setShowBookModal(false)}>
                <Icon name="close" size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>

            {selectedBook && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Book Cover */}
                {selectedBook.cover_photo && (
                  <View className="items-center mb-4">
                    <Image
                      source={{ uri: selectedBook.cover_photo }}
                      className="w-32 h-40 rounded-lg"
                      resizeMode="contain"
                    />
                  </View>
                )}

                {/* Book Info */}
                <View className="bg-[#F8F9FA] rounded-2xl p-4 mb-4">
                  <Typography className="text-lg font-bold text-[#2C3E50] mb-2">{selectedBook.title}</Typography> 
                  <Typography className="text-sm text-[#7F8C8D] mb-2">by {selectedBook.author}</Typography> 

                  {selectedBook.isbn && <Typography className="text-sm text-[#7F8C8D] mb-2">ISBN: {selectedBook.isbn}</Typography> }

                  {selectedBook.category && (
                    <Typography className="text-sm text-[#7F8C8D] mb-2">Category: {selectedBook.category}</Typography> 
                  )}

                  {selectedBook.publisher && (
                    <Typography className="text-sm text-[#7F8C8D] mb-2">Publisher: {selectedBook.publisher}</Typography> 
                  )}

                  {"location" in selectedBook && selectedBook.location && (
                    <Typography className="text-sm text-[#7F8C8D] mb-2">Location: {selectedBook.location}</Typography> 
                  )}

                  {"description" in selectedBook && selectedBook.description && (
                    <Typography className="text-sm text-[#2C3E50] mt-2">{selectedBook.description}</Typography> 
                  )}
                </View>

                {/* Borrowed Book Specific Info */}
                {"due_date" in selectedBook && selectedBook.due_date && (
                  <View className="bg-[#F8F9FA] rounded-2xl p-4 mb-4">
                    <Typography className="text-sm font-semibold text-[#2C3E50] mb-2">Borrowing Details</Typography> 
                    <Typography className="text-sm text-[#7F8C8D] mb-1">
                      Issued: {formatDateDisplay(selectedBook.assign_date)}
                    </Typography> 
                    <Typography className="text-sm text-[#7F8C8D] mb-1">Due: {formatDateDisplay(selectedBook.due_date)}</Typography> 
                    <Typography className="text-sm text-[#7F8C8D]">
                      Renewals: {selectedBook.renewal_count || 0}/{selectedBook.max_renewals || 3}
                    </Typography> 
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Renewal Guidelines */}
      {selectedTab === "issued" && filteredBorrowedBooks.length > 0 && (
        <View className="mx-4 mt-6 mb-8 bg-white rounded-2xl p-4 shadow-lg elevation-5">
          <Typography className="text-lg font-bold text-[#2C3E50] mb-3 flex-row items-center">
            <Icon name="info" size={20} color="#6A5ACD" />
            <Typography className="ml-2">Renewal Guidelines</Typography> 
          </Typography> 
          <View className="space-y-2">
            <View className="flex-row items-center">
              <Icon name="check-circle" size={16} color="#2ECC71" />
              <Typography className="text-sm text-[#7F8C8D] ml-2">Books can be renewed up to 3 times</Typography> 
            </View>
            <View className="flex-row items-center">
              <Icon name="check-circle" size={16} color="#2ECC71" />
              <Typography className="text-sm text-[#7F8C8D] ml-2">Renewal extends due date by 14 days</Typography> 
            </View>
            <View className="flex-row items-center">
              <Icon name="cancel" size={16} color="#E74C3C" />
              <Typography className="text-sm text-[#7F8C8D] ml-2">Overdue books cannot be renewed</Typography> 
            </View>
            <View className="flex-row items-center">
              <Icon name="cancel" size={16} color="#E74C3C" />
              <Typography className="text-sm text-[#7F8C8D] ml-2">Books with pending fines cannot be renewed</Typography> 
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  )
}

export default LibraryScreen
