
import { StudentAppDataContext } from "@/context/Student/context"
import { getEventActivity } from "@/service/student/eventActivity"
import { useCallback, useContext, useEffect, useState } from "react"

// Types
export interface StudentProfile {
  // id: string
  full_name: string
  class_name: string
  // age: number
  // father_name: string
  // student_id: string
  profileImage?: string
  // email: string
  // phone?: string
}

export interface Activity {
  id: string
  title: string
  image_path: string
  date: string
  description?: string
  category: string
}

export interface BMIData {
  month: string
  student_bmi: number
  avg_bmi: number
  date: string
}

export interface Notification {
  id: string
  type: "info" | "warning" | "success" | "error"
  title: string
  message: string
  time: string
  read: boolean
  actions?: string[]
}

export interface PerformanceStats {
  attendance: number
  assignments: number
  performance: number
  last_updated: string
}

interface UseStudentDataReturn {
  // Data
  profile: StudentProfile | null
  activities: Activity[]
  bmiData: BMIData[]
  stats: PerformanceStats | null
  notifications: Notification[]

  // Loading states
  loading: boolean
  activitiesLoading: boolean

  // Error states
  error: string | null


  // Actions
  refreshData: () => Promise<void>
  refreshActivities: () => Promise<void>
  markNotificationRead: (id: string) => Promise<void>
}

// Dummy Data (will be replaced with API calls)
const DUMMY_PROFILE: StudentProfile = {
  // id: "1",
  full_name: "Alex Johnson",
  class_name: "Grade 10A",
  // age: 16,
  // father_name: "Michael Johnson",
  // student_id: "ST2024001",
  profileImage: "https://img.freepik.com/free-vector/young-man-with-glasses-avatar_1308-173760.jpg",
  // email: "alex.johnson@school.edu",
  // phone: "+1 (555) 123-4567",
}

const DUMMY_BMI_DATA: BMIData[] = [
  { month: "Jul", student_bmi: 20.5, avg_bmi: 21.2, date: "2024-07-01" },
  { month: "Aug", student_bmi: 21.1, avg_bmi: 21.3, date: "2024-08-01" },
  { month: "Sep", student_bmi: 21.8, avg_bmi: 21.1, date: "2024-09-01" },
  { month: "Oct", student_bmi: 22.2, avg_bmi: 21.0, date: "2024-10-01" },
  { month: "Nov", student_bmi: 22.0, avg_bmi: 20.9, date: "2024-11-01" },
  { month: "Dec", student_bmi: 21.7, avg_bmi: 21.1, date: "2024-12-01" },
]

const DUMMY_STATS: PerformanceStats = {
  attendance: 95,
  assignments: 88,
  performance: 92,
  last_updated: "2024-12-29T10:30:00Z",
}

const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "info",
    title: "Data export ready!",
    message: "Your requested academic report is now available for download.",
    time: "2 min ago",
    read: false,
    actions: ["Download", "View Details"],
  },
  {
    id: "2",
    type: "success",
    title: "Assignment submitted successfully",
    message: "Your Mathematics homework has been submitted and is under review.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "warning",
    title: "Upcoming deadline reminder",
    message: "Science project submission deadline is tomorrow at 5:00 PM.",
    time: "3 hours ago",
    read: true,
    actions: ["View Assignment"],
  },
]

export function useStudentData(): UseStudentDataReturn {
  
  // const [profile, setProfile] = useState<StudentProfile | null>(null)
  const {profile}=useContext(StudentAppDataContext)
  const [activities, setActivities] = useState<Activity[]>([])
  const [bmiData, setBmiData] = useState<BMIData[]>([])
  const [stats, setStats] = useState<PerformanceStats | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])


  const [loading, setLoading] = useState(true)
  const [activitiesLoading, setActivitiesLoading] = useState(false)


  const [error, setError] = useState<string | null>(null)



  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Set static data (replace with API calls)

      setBmiData(DUMMY_BMI_DATA)
      setStats(DUMMY_STATS)
      setNotifications(DUMMY_NOTIFICATIONS)


      // getMyProfile().then((profile)=>{
      //   setProfile(profile)
      // })
      // Fetch activities from API
      setActivitiesLoading(true)
      getEventActivity().then((activity) => {
        setActivities(activity.slice(0, 6))
      }).finally(() => setActivitiesLoading(false))

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch dashboard data")
      console.error("Dashboard data fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Refresh activities
  const refreshActivities = useCallback(async () => {
    try {
      setActivitiesLoading(true)


      const activity = await getEventActivity()
      setActivities(activity)
    } catch (err) {

    } finally {
      setActivitiesLoading(false)
    }
  }, [])

  const refreshData = useCallback(async () => {
    await fetchDashboardData()
  }, [fetchDashboardData])

  const markNotificationRead = useCallback(async (notificationId: string) => {
    try {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification,
        ),
      )
    } catch (err) {
      console.error("Failed to mark notification as read:", err)
    }
  }, [])

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  return {
    // Data
    profile,
    activities,
    bmiData,
    stats,
    notifications,

    // Loading states
    loading,
    activitiesLoading,

    // Error states
    error,


    // Actions
    refreshData,
    refreshActivities,
    markNotificationRead,
  }
}
