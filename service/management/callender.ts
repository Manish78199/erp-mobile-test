import routes from "@/config/route";
import axios from "axios";




const setCallenderEvent = async (eventDetails: any) => {
    const access_token = localStorage.getItem("access_token")
    return await axios.post(routes.callender.set_callender_event,
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
    let url = `${routes.callender.yearly_callender_event}?year=${year}`
    if (month) {
        url = `${routes.callender.yearly_callender_event}?year=${year}&month=${month}`

    }
    const access_token = localStorage.getItem("access_token")
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