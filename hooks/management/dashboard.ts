import useSWR from "swr"
import { managementFetcher } from "./fetcher"
import routes from "@/config/route"

const useRecentActivites = () => {
    const { data, error, isLoading } = useSWR(routes.DASHBOARD.recent_activities, managementFetcher)
    return { data, error, isLoading }
}


const useQuickStats = () => {
    const { data, error, isLoading } = useSWR(routes.DASHBOARD.quick_stats, managementFetcher)
    return { data, error, isLoading }
}


const useDashboardHook={
    useRecentActivites,
    useQuickStats
}

export  {useDashboardHook}