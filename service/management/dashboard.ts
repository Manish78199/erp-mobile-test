import {ApiRoute} from "@/constants/apiRoute"
import { get_access_token } from "@/utils/accessToken"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"

const get_headers = async () => {
  const access_token =await get_access_token()
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${access_token}`,
  }
}

// Main Dashboard Data
const get_dashboard_data = async (params?: {
  session?: string
  start_date?: string
  end_date?: string
  class_ids?: string[]
  section?: string
}) => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.session) queryParams.append("session", params.session)
    if (params?.start_date) queryParams.append("start_date", params.start_date)
    if (params?.end_date) queryParams.append("end_date", params.end_date)
    if (params?.section) queryParams.append("section", params.section)
    if (params?.class_ids) {
      params.class_ids.forEach((id) => queryParams.append("class_ids", id))
    }

    const url = queryParams.toString() ? `${ApiRoute.DASHBOARD.main}?${queryParams.toString()}` : ApiRoute.DASHBOARD.main

    const res = await axios.get(url, {
      headers:await get_headers(),
    })
    return res.data.data
  } catch (error) {
    return null
  }
}

// Fee Analytics
const get_fee_analytics = async (params?: {
  session?: string
  start_date?: string
  end_date?: string
  payment_mode?: string
  class_ids?: string[]
}) => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.session) queryParams.append("session", params.session)
    if (params?.start_date) queryParams.append("start_date", params.start_date)
    if (params?.end_date) queryParams.append("end_date", params.end_date)
    if (params?.payment_mode) queryParams.append("payment_mode", params.payment_mode)
    if (params?.class_ids) {
      params.class_ids.forEach((id) => queryParams.append("class_ids", id))
    }

    const url = queryParams.toString()
      ? `${ApiRoute.DASHBOARD.fee_analytics}?${queryParams.toString()}`
      : ApiRoute.DASHBOARD.fee_analytics

    const res = await axios.get(url, {
      headers:await get_headers(),
    })
    return res.data.data
  } catch (error) {
    return null
  }
}

// Transport Tracking
const get_transport_tracking = async (params?: {
  vehicle_no?: string
  route?: string
  vehicle_status?: string
  live_tracking?: boolean
}) => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.vehicle_no) queryParams.append("vehicle_no", params.vehicle_no)
    if (params?.route) queryParams.append("route", params.route)
    if (params?.vehicle_status) queryParams.append("vehicle_status", params.vehicle_status)
    if (params?.live_tracking !== undefined) queryParams.append("live_tracking", params.live_tracking.toString())

    const url = queryParams.toString()
      ? `${ApiRoute.DASHBOARD.transport_tracking}?${queryParams.toString()}`
      : ApiRoute.DASHBOARD.transport_tracking

    const res = await axios.get(url, {
      headers:await get_headers(),
    })
    return res.data.data
  } catch (error) {
    return null
  }
}

// Academic Summary
const get_academic_summary = async (params?: {
  session?: string
  class_ids?: string[]
  subject?: string
  date_range_days?: number
}) => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.session) queryParams.append("session", params.session)
    if (params?.subject) queryParams.append("subject", params.subject)
    if (params?.date_range_days) queryParams.append("date_range_days", params.date_range_days.toString())
    if (params?.class_ids) {
      params.class_ids.forEach((id) => queryParams.append("class_ids", id))
    }

    const url = queryParams.toString()
      ? `${ApiRoute.DASHBOARD.academic_summary}?${queryParams.toString()}`
      : ApiRoute.DASHBOARD.academic_summary

    const res = await axios.get(url, {
      headers:await get_headers(),
    })
    return res.data.data
  } catch (error) {
    return null
  }
}

// Hostel Management
const get_hostel_management = async (params?: {
  hostel_id?: string
  room_type?: string
  include_mess_data?: boolean
}) => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.hostel_id) queryParams.append("hostel_id", params.hostel_id)
    if (params?.room_type) queryParams.append("room_type", params.room_type)
    if (params?.include_mess_data !== undefined)
      queryParams.append("include_mess_data", params.include_mess_data.toString())

    const url = queryParams.toString()
      ? `${ApiRoute.DASHBOARD.hostel_management}?${queryParams.toString()}`
      : ApiRoute.DASHBOARD.hostel_management

    const res = await axios.get(url, {
      headers:await get_headers(),
    })
    return res.data.data
  } catch (error) {
    return null
  }
}

// Employee Attendance
const get_employee_attendance = async (params?: {
  start_date?: string
  end_date?: string
  department?: string
  employee_type?: string
}) => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.start_date) queryParams.append("start_date", params.start_date)
    if (params?.end_date) queryParams.append("end_date", params.end_date)
    if (params?.department) queryParams.append("department", params.department)
    if (params?.employee_type) queryParams.append("employee_type", params.employee_type)

    const url = queryParams.toString()
      ? `${ApiRoute.DASHBOARD.employee_attendance}?${queryParams.toString()}`
      : ApiRoute.DASHBOARD.employee_attendance

    const res = await axios.get(url, {
      headers:await get_headers(),
    })
    return res.data.data
  } catch (error) {
    return null
  }
}

// Inventory Status
const get_inventory_status = async (params?: {
  category?: string
  low_stock_only?: boolean
  include_valuation?: boolean
}) => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.category) queryParams.append("category", params.category)
    if (params?.low_stock_only !== undefined) queryParams.append("low_stock_only", params.low_stock_only.toString())
    if (params?.include_valuation !== undefined)
      queryParams.append("include_valuation", params.include_valuation.toString())

    const url = queryParams.toString()
      ? `${ApiRoute.DASHBOARD.inventory_status}?${queryParams.toString()}`
      : ApiRoute.DASHBOARD.inventory_status

    const res = await axios.get(url, {
      headers:await get_headers(),
    })
    return res.data.data
  } catch (error) {
    return null
  }
}

// Health Medical Data
const get_health_medical_data = async (params?: {
  start_date?: string
  end_date?: string
  include_medicine_stock?: boolean
}) => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.start_date) queryParams.append("start_date", params.start_date)
    if (params?.end_date) queryParams.append("end_date", params.end_date)
    if (params?.include_medicine_stock !== undefined)
      queryParams.append("include_medicine_stock", params.include_medicine_stock.toString())

    const url = queryParams.toString()
      ? `${ApiRoute.DASHBOARD.health_medical}?${queryParams.toString()}`
      : ApiRoute.DASHBOARD.health_medical

    const res = await axios.get(url, {
      headers:await get_headers(),
    })
    return res.data.data
  } catch (error) {
    return null
  }
}

// Examination Analytics
const get_examination_analytics = async (params?: {
  session?: string
  exam_type?: string
  class_ids?: string[]
  include_results?: boolean
}) => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.session) queryParams.append("session", params.session)
    if (params?.exam_type) queryParams.append("exam_type", params.exam_type)
    if (params?.include_results !== undefined) queryParams.append("include_results", params.include_results.toString())
    if (params?.class_ids) {
      params.class_ids.forEach((id) => queryParams.append("class_ids", id))
    }

    const url = queryParams.toString()
      ? `${ApiRoute.DASHBOARD.examination_analytics}?${queryParams.toString()}`
      : ApiRoute.DASHBOARD.examination_analytics

    const res = await axios.get(url, {
      headers:await get_headers(),
    })
    return res.data.data
  } catch (error) {
    return null
  }
}

// Events Activities
const get_events_activities = async (params?: {
  start_date?: string
  end_date?: string
  event_type?: string
  status_filter?: string
}) => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.start_date) queryParams.append("start_date", params.start_date)
    if (params?.end_date) queryParams.append("end_date", params.end_date)
    if (params?.event_type) queryParams.append("event_type", params.event_type)
    if (params?.status_filter) queryParams.append("status_filter", params.status_filter)

    const url = queryParams.toString()
      ? `${ApiRoute.DASHBOARD.events_activities}?${queryParams.toString()}`
      : ApiRoute.DASHBOARD.events_activities

    const res = await axios.get(url, {
      headers:await get_headers(),
    })
    return res.data.data
  } catch (error) {
    return null
  }
}

// Recent Activities
const get_recent_activities = async (params?: {
  limit?: number
  activity_type?: string
  class_ids?: string[]
  hours_back?: number
}) => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append("limit", params.limit.toString())
    if (params?.activity_type) queryParams.append("activity_type", params.activity_type)
    if (params?.hours_back) queryParams.append("hours_back", params.hours_back.toString())
    if (params?.class_ids) {
      params.class_ids.forEach((id) => queryParams.append("class_ids", id))
    }

    const url = queryParams.toString()
      ? `${ApiRoute.DASHBOARD.recent_activities}?${queryParams.toString()}`
      : ApiRoute.DASHBOARD.recent_activities

    const res = await axios.get(url, {
      headers:await get_headers(),
    })
    return res.data.data
  } catch (error) {
    return []
  }
}

// Quick Stats
const get_quick_stats = async () => {
  try {
    const res = await axios.get(ApiRoute.DASHBOARD.quick_stats, {
      headers:await get_headers(),
    })
    return res.data.data
  } catch (error) {
    return null
  }
}

// Performance Metrics
const get_performance_metrics = async (params?: {
  session?: string
  metric_type?: string
  comparison_period?: string
}) => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.session) queryParams.append("session", params.session)
    if (params?.metric_type) queryParams.append("metric_type", params.metric_type)
    if (params?.comparison_period) queryParams.append("comparison_period", params.comparison_period)

    const url = queryParams.toString()
      ? `${ApiRoute.DASHBOARD.performance_metrics}?${queryParams.toString()}`
      : ApiRoute.DASHBOARD.performance_metrics

    const res = await axios.get(url, {
      headers:await get_headers(),
    })
    return res.data.data
  } catch (error) {
    return null
  }
}

// Export Dashboard Data
const export_dashboard_data = async (data: {
  export_format?: string
  modules?: string[]
  start_date?: string
  end_date?: string
}) => {
  return axios.post(ApiRoute.DASHBOARD.export_data, data, {
    headers:await get_headers(),
  })
}

// Alerts Notifications
const get_alerts_notifications = async (params?: {
  alert_type?: string
  priority?: string
  unread_only?: boolean
  limit?: number
}) => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.alert_type) queryParams.append("alert_type", params.alert_type)
    if (params?.priority) queryParams.append("priority", params.priority)
    if (params?.unread_only !== undefined) queryParams.append("unread_only", params.unread_only.toString())
    if (params?.limit) queryParams.append("limit", params.limit.toString())

    const url = queryParams.toString()
      ? `${ApiRoute.DASHBOARD.alerts_notifications}?${queryParams.toString()}`
      : ApiRoute.DASHBOARD.alerts_notifications

    const res = await axios.get(url, {
      headers:await get_headers(),
    })
    return res.data.data
  } catch (error) {
    return []
  }
}

export default {
  get_dashboard_data,
  get_fee_analytics,
  get_transport_tracking,
  get_academic_summary,
  get_hostel_management,
  get_employee_attendance,
  get_inventory_status,
  get_health_medical_data,
  get_examination_analytics,
  get_events_activities,
  get_recent_activities,
  get_quick_stats,
  get_performance_metrics,
  export_dashboard_data,
  get_alerts_notifications,
}
