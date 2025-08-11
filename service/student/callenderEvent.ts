import { ApiRoute } from "@/constants/apiRoute";
import { get_access_token } from "@/utils/accessToken";
import axios from "axios";


export interface CalendarEvent {
  school_id: string
  title: string
  description: string
  event_date: string // Format: "YYYY-MM-DD"
  is_holiday: boolean
  month: string // Format: "MM"
  year: string // Format: "YYYY"
}

export interface CalendarEventsResponse {
  status: number
  message: string
  data: CalendarEvent[]
  pagination: null
}


const getCallenderEvent=async (year:any,month:any=null)=>{
    let url=`${ApiRoute.STUDENT.event.yearly_callender_event}?year=${year}`
    if (month){
    url=`${ApiRoute.STUDENT.event.yearly_callender_event}?year=${year}&month=${month}`

    }
    const access_token=await get_access_token()
    try {
        const allClass = await axios.get(url,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },
    
            }
        );
        return allClass.data.data
    } catch (error) {
        return []
    }
}

export {
    getCallenderEvent
};

