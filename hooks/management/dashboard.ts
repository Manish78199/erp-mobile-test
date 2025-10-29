import useSWR from "swr"
import { managementFetcher } from "./fetcher"
import {ApiRoute} from "@/constants/apiRoute"

const useRecentActivites = () => {
    const { data, error, isLoading } = useSWR(ApiRoute.DASHBOARD.recent_activities, managementFetcher)
    return { data, error, isLoading }
}


const useQuickStats = () => {
    const { data, error, isLoading } = useSWR(ApiRoute.DASHBOARD.quick_stats, managementFetcher)
    return { data, error, isLoading }
}


const useDashboardHook={
    useRecentActivites,
    useQuickStats
}

export  {useDashboardHook}