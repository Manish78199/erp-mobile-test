
import { useState, useEffect } from "react"
import { View, Text, ScrollView, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { cn } from "@/utils/cn"

interface LibraryStats {
  totalBooks: number
  availableBooks: number
  issuedBooks: number
  overdueBooks: number
  totalStudents: number
  activeMembers: number
  todayIssues: number
  todayReturns: number
  pendingFines: number
  totalFinesCollected: number
}

interface RecentActivity {
  id: number
  type: "issue" | "return" | "overdue" | "fine_paid"
  message: string
  student: string
  timestamp: string
  fine?: number
  amount?: number
}

interface PopularBook {
  id: number
  title: string
  author: string
  category: string
  issueCount: number
  available: number
  total: number
}

// Mock API functions - replace with actual API calls
const getLibraryStats = async (): Promise<LibraryStats> => {
  return {
    totalBooks: 15420,
    availableBooks: 12850,
    issuedBooks: 2570,
    overdueBooks: 145,
    totalStudents: 284,
    activeMembers: 267,
    todayIssues: 23,
    todayReturns: 18,
    pendingFines: 12500,
    totalFinesCollected: 45000,
  }
}

const getRecentActivities = async (): Promise<RecentActivity[]> => {
  return [
    {
      id: 1,
      type: "issue",
      message: "Book issued: 'Data Structures and Algorithms'",
      student: "Rahul Sharma",
      timestamp: "2 hours ago",
      bookId: "CS001",
    },
    {
      id: 2,
      type: "return",
      message: "Book returned: 'Operating Systems'",
      student: "Priya Patel",
      timestamp: "3 hours ago",
      bookId: "CS045",
    },
    {
      id: 3,
      type: "overdue",
      message: "Book overdue: 'Database Management'",
      student: "Amit Kumar",
      timestamp: "1 day ago",
      fine: 50,
    },
    {
      id: 4,
      type: "fine_paid",
      message: "Fine payment received",
      student: "Sneha Singh",
      timestamp: "2 days ago",
      amount: 100,
    },
  ]
}

const getPopularBooks = async (): Promise<PopularBook[]> => {
  return [
    {
      id: 1,
      title: "Data Structures and Algorithms",
      author: "Thomas H. Cormen",
      category: "Computer Science",
      issueCount: 45,
      available: 3,
      total: 8,
    },
    {
      id: 2,
      title: "Operating System Concepts",
      author: "Abraham Silberschatz",
      category: "Computer Science",
      issueCount: 38,
      available: 2,
      total: 6,
    },
    {
      id: 3,
      title: "Database System Concepts",
      author: "Henry F. Korth",
      category: "Computer Science",
      issueCount: 32,
      available: 1,
      total: 5,
    },
    {
      id: 4,
      title: "Computer Networks",
      author: "Andrew S. Tanenbaum",
      category: "Computer Science",
      issueCount: 28,
      available: 4,
      total: 7,
    },
  ]
}

export default function LibraryDashboard() {
  const insets = useSafeAreaInsets()
  const [stats, setStats] = useState<LibraryStats | null>(null)
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [popularBooks, setPopularBooks] = useState<PopularBook[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("current")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, activitiesData, booksData] = await Promise.all([
          getLibraryStats(),
          getRecentActivities(),
          getPopularBooks(),
        ])
        setStats(statsData)
        setActivities(activitiesData)
        setPopularBooks(booksData)
      } catch (error) {
        Alert.alert("Error", "Failed to fetch library data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const StatCard = ({ icon, title, value, subtitle, color }: any) => (
    <View className={cn("flex-1 rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800")}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">{title}</Text>
          <Text className="text-xl font-bold text-gray-900 dark:text-white">{value}</Text>
          {subtitle && <Text className="text-xs mt-1 text-gray-500 dark:text-gray-500">{subtitle}</Text>}
        </View>
        <View className={cn("p-3 rounded-lg", color)}>
          <MaterialCommunityIcons name={icon} size={20} color="white" />
        </View>
      </View>
    </View>
  )

  const ActivityItem = ({ activity }: { activity: RecentActivity }) => {
    const getActivityColor = () => {
      switch (activity.type) {
        case "issue":
          return "bg-green-100 dark:bg-green-900"
        case "return":
          return "bg-blue-100 dark:bg-blue-900"
        case "overdue":
          return "bg-red-100 dark:bg-red-900"
        case "fine_paid":
          return "bg-purple-100 dark:bg-purple-900"
        default:
          return "bg-gray-100 dark:bg-gray-900"
      }
    }

    const getActivityIcon = () => {
      switch (activity.type) {
        case "issue":
          return "book-plus"
        case "return":
          return "check-circle"
        case "overdue":
          return "alert-triangle"
        case "fine_paid":
          return "cash-check"
        default:
          return "information"
      }
    }

    return (
      <View className="flex-row items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
        <View className={cn("p-2 rounded-lg", getActivityColor())}>
          <MaterialCommunityIcons name={getActivityIcon() as any} size={16} color="#6b7280" />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-900 dark:text-white">{activity.message}</Text>
          <Text className="text-xs mt-1 text-gray-600 dark:text-gray-400">
            {activity.student} • {activity.timestamp}
          </Text>
        </View>
        {activity.fine && <Text className="text-sm font-semibold text-red-600">{formatCurrency(activity.fine)}</Text>}
        {activity.amount && (
          <Text className="text-sm font-semibold text-green-600">{formatCurrency(activity.amount)}</Text>
        )}
      </View>
    )
  }

  const PopularBookItem = ({ book, index }: { book: PopularBook; index: number }) => (
    <View className="flex-row items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
      <View className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full items-center justify-center">
        <Text className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">#{index + 1}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-sm font-medium text-gray-900 dark:text-white">{book.title}</Text>
        <Text className="text-xs mt-1 text-gray-600 dark:text-gray-400">
          by {book.author} • {book.category}
        </Text>
        <View className="flex-row gap-4 mt-2">
          <Text className="text-xs text-gray-600 dark:text-gray-400">Issues: {book.issueCount}</Text>
          <Text className="text-xs text-gray-600 dark:text-gray-400">
            Available: {book.available}/{book.total}
          </Text>
        </View>
      </View>
      <View className="w-12 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <View className="h-2 bg-indigo-500" style={{ width: `${(book.issueCount / 50) * 100}%` }} />
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
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Library Dashboard</Text>
          <Text className="text-sm mt-1 text-gray-600 dark:text-gray-400">
            Manage books, memberships, and library operations
          </Text>
        </View>

        {stats && (
          <>
            <View className="space-y-3">
              <View className="flex-row gap-3">
                <StatCard
                  icon="book-multiple"
                  title="Total Books"
                  value={stats.totalBooks.toLocaleString()}
                  subtitle={`${stats.availableBooks} available`}
                  color="bg-blue-500"
                />
                <StatCard
                  icon="book-open"
                  title="Issued Books"
                  value={stats.issuedBooks}
                  subtitle={`+${stats.todayIssues} today`}
                  color="bg-green-500"
                />
              </View>

              <View className="flex-row gap-3">
                <StatCard
                  icon="account-multiple"
                  title="Active Members"
                  value={stats.activeMembers}
                  subtitle={`of ${stats.totalStudents} students`}
                  color="bg-purple-500"
                />
                <StatCard
                  icon="alert-triangle"
                  title="Overdue Books"
                  value={stats.overdueBooks}
                  subtitle="Requires attention"
                  color="bg-red-500"
                />
              </View>
            </View>

            <View className="space-y-2">
              <View className="flex-row gap-2">
                <View className="flex-1 rounded-lg p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <View className="flex-row items-center gap-2">
                    <View className="p-2 bg-emerald-500 rounded-lg">
                      <MaterialCommunityIcons name="check-circle" size={16} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-gray-600 dark:text-gray-400">Today's Returns</Text>
                      <Text className="text-lg font-semibold text-gray-900 dark:text-white">{stats.todayReturns}</Text>
                    </View>
                  </View>
                </View>

                <View className="flex-1 rounded-lg p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <View className="flex-row items-center gap-2">
                    <View className="p-2 bg-orange-500 rounded-lg">
                      <MaterialCommunityIcons name="clock" size={16} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-gray-600 dark:text-gray-400">Today's Issues</Text>
                      <Text className="text-lg font-semibold text-gray-900 dark:text-white">{stats.todayIssues}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View className="flex-row gap-2">
                <View className="flex-1 rounded-lg p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <View className="flex-row items-center gap-2">
                    <View className="p-2 bg-red-500 rounded-lg">
                      <MaterialCommunityIcons name="cash-multiple" size={16} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-gray-600 dark:text-gray-400">Pending Fines</Text>
                      <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(stats.pendingFines)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="flex-1 rounded-lg p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <View className="flex-row items-center gap-2">
                    <View className="p-2 bg-green-500 rounded-lg">
                      <MaterialCommunityIcons name="trending-up" size={16} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-gray-600 dark:text-gray-400">Fines Collected</Text>
                      <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(stats.totalFinesCollected)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <Text className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</Text>
              <View className="space-y-2">
                <TouchableOpacity className="flex-row items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <View className="p-2 bg-blue-500 rounded-lg">
                    <MaterialCommunityIcons name="plus" size={16} color="white" />
                  </View>
                  <View>
                    <Text className="font-semibold text-gray-900 dark:text-white">Add New Book</Text>
                    <Text className="text-xs text-gray-600 dark:text-gray-400">Register new books</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <View className="p-2 bg-green-500 rounded-lg">
                    <MaterialCommunityIcons name="book-plus" size={16} color="white" />
                  </View>
                  <View>
                    <Text className="font-semibold text-gray-900 dark:text-white">Issue Book</Text>
                    <Text className="text-xs text-gray-600 dark:text-gray-400">Issue books to students</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <View className="p-2 bg-purple-500 rounded-lg">
                    <MaterialCommunityIcons name="check-circle" size={16} color="white" />
                  </View>
                  <View>
                    <Text className="font-semibold text-gray-900 dark:text-white">Return Book</Text>
                    <Text className="text-xs text-gray-600 dark:text-gray-400">Process book returns</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <View className="p-2 bg-red-500 rounded-lg">
                    <MaterialCommunityIcons name="alert-circle" size={16} color="white" />
                  </View>
                  <View>
                    <Text className="font-semibold text-gray-900 dark:text-white">Due Books</Text>
                    <Text className="text-xs text-gray-600 dark:text-gray-400">Manage overdue books</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View className="space-y-4">
              <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activities</Text>
                  <TouchableOpacity>
                    <Text className="text-sm font-medium text-indigo-600 dark:text-indigo-400">View All</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  scrollEnabled={false}
                  data={activities}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => <ActivityItem activity={item} />}
                />
              </View>

              <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-lg font-semibold text-gray-900 dark:text-white">Popular Books</Text>
                  <TouchableOpacity>
                    <Text className="text-sm font-medium text-indigo-600 dark:text-indigo-400">View All</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  scrollEnabled={false}
                  data={popularBooks}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item, index }) => <PopularBookItem book={item} index={index} />}
                />
              </View>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  )
}
