import { ApiRoute } from "@/constants/apiRoute"
import useSWR from "swr"
import { managementFetcher } from "./fetcher"

const useBooks = () => {

  const { data, error, isLoading,mutate } = useSWR(ApiRoute.LIBRARY.book_crud, managementFetcher, { revalidateIfStale: true,revalidateOnFocus:true ,revalidateOnReconnect:true })
  return {
    data: data as any[],
    isLoading,
    isError: error,
    mutate
  }
}


export {
    useBooks,
}
