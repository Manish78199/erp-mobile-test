

import useSWR from "swr"
import { managementFetcher } from "./fetcher"
import { ApiRoute } from "@/constants/apiRoute"

const useSubjects = () => {

    const { data, error, isLoading } = useSWR(ApiRoute.subjectService.getAllSubject, managementFetcher, { revalidateIfStale: false, })
    return {
        data: data as any[],
        isLoading,
        isError: error,
    }
}



const useClassSubjects = (class_id: string | null = null) => {
    const route = class_id ? `${ApiRoute.subjectService.getClassSubject}/${class_id}` : null

    const { data, error, isLoading } = useSWR(route, managementFetcher, { revalidateIfStale: false, })

    return {
        sections: data ?? [],
        isLoading,
        isError: error
    }
}


export { useSubjects, useClassSubjects }