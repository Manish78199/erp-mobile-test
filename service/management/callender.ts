import {ApiRoute} from "@/constants/apiRoute";
import { get_access_token } from "@/utils/accessToken";
import axios from "axios";




const setCallenderEvent = async (eventDetails: any) => {
    const access_token = await get_access_token()
    return await axios.post(ApiRoute.callender.set_callender_event,
        eventDetails,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );
}












const getCallenderEvent = async (year: any, month: any = null) => {
    let url = `${ApiRoute.callender.yearly_callender_event}?year=${year}`
    if (month) {
        url = `${ApiRoute.callender.yearly_callender_event}?year=${year}&month=${month}`

    }
    const access_token =  await get_access_token()
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
    getCallenderEvent,
    setCallenderEvent
}