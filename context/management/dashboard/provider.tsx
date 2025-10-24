"use client"

import { useContext, useEffect, useState } from "react"
import { DashboardDataContext } from "./context"
import dashboardService from "@/service/management/dashboard"
export interface SchoolClass {
    _id: string
    name: string
    classCode: string
    studentCount: number,
    subjectCount: number
}
export const DashoardProvider = ({ children }: { children: React.ReactNode }) => {

    const [quickStats, setQuickStats] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchQuickStat = async () => {
        const data = await dashboardService.get_dashboard_data()
        setQuickStats(data ?? null)
        setLoading(false)
    }
    useEffect(() => {

        fetchQuickStat()
    }, [])





    return (
        <DashboardDataContext.Provider value={{ dashboardData:quickStats,loading:loading,refetch: fetchQuickStat }}>
            {children}
        </DashboardDataContext.Provider>
    )
}

export const useDashboardContext = () => {
    const context = useContext(DashboardDataContext)
    if (!context) {
        throw new Error("useClassContext must be used within a DashoardProvider")
    }
    return context
}
