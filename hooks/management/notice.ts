import { ApiRoute } from "@/constants/apiRoute"
import useSWR from "swr"
import { managementFetcher } from "./fetcher"

const useNotices = () => {

  const { data, error, isLoading } = useSWR(ApiRoute.noticeService.getNotice, managementFetcher, { revalidateIfStale: false, })
  return {
    data: data as any[],
    isLoading,
    isError: error,
  }
}


export {
    useNotices
}
