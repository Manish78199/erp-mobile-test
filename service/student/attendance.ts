import { ApiRoute } from "@/constants/apiRoute";
import { get_access_token } from "@/utils/accessToken";
import axios from "axios";




const getAttendanceSummary=async ()=>{
    const access_token =await get_access_token()
    try {
        const allClass = await axios.get(ApiRoute.STUDENT.attendance.summary,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },
    
            }
        );
        return allClass.data.data
    } catch (error) {
        return null
    }
}



const getAttendanceDetails=async (startDate:string,endDate:string)=>{
    const access_token=await get_access_token()
    try {
        const allClass = await axios.get(`${ApiRoute.STUDENT.attendance.details}?start_date=${startDate}&end_date=${endDate}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },
    
            }
        );
        return allClass.data.data
    } catch (error) {
        return null
    }
}

export {
    getAttendanceDetails, getAttendanceSummary
};

