"use client"

import { createContext } from "react"


interface DashType{
    loading:boolean
    refetch:Function
    dashboardData:any | null
}


const DashboardDataContext = createContext<DashType| null>(null)

export {
    DashboardDataContext
}