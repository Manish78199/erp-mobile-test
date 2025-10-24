import { get_access_token } from "@/utils/accessToken"
import axios from "axios"

const managementFetcher = async (url: string) => {
  const access_token =await get_access_token()
  const res = await axios.get(url, {
    headers: {
      "Authorization": `Bearer ${access_token}`,
    },
  })
  return res.data?.data
}

export  {managementFetcher};