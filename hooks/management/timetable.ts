import {ApiRoute} from "@/constants/apiRoute"
import useSWR from "swr"
import { managementFetcher } from "./fetcher"




const useTimeTables = () => {
    const route = `${ApiRoute.CLASS_PERIOD_SCHEDULE.timetable}/all`

    const { data, error, isLoading } = useSWR(route, managementFetcher, { revalidateIfStale: false, })

    return {
        data: data ?? [],
        isLoading,
        isError: error
    }
}


export {
    useTimeTables
}