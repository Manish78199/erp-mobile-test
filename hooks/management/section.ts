import useSWR from "swr"
import { managementFetcher } from "./fetcher"
import {ApiRoute} from "@/constants/apiRoute"

const useSections = () => {

  const { data, error, isLoading } = useSWR(ApiRoute.section.get_all, managementFetcher, { revalidateIfStale: false, })
  return {
    sections: data,
    isLoading,
    isError: error,
  }
}



const useClassSections = (class_id: string) => {
 const route = class_id ? `${ApiRoute.section.get_class_section}/${class_id}` : null

  const { data, error, isLoading } = useSWR(route, managementFetcher, { revalidateIfStale: false, })

  return {
    sections: data ?? [],
    isLoading,
    isError: error
  }
}


export { useSections, useClassSections }