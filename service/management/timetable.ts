import { get_headers } from "@/utils/Authentication/getApiHeader";
import {ApiRoute} from "@/constants/apiRoute";
import axios from "axios";
import { get_access_token } from "@/utils/accessToken";

const createTimeTable = async (data: any,class_id:string) => {
    return await axios.post(`${ApiRoute.CLASS_PERIOD_SCHEDULE.timetable}/${class_id}/create`,
        data,
        {
            headers: get_headers(),
        }
    );
}



const addSyllabus = async (data: { description: string, class_id: string, file: File }) => {
    const formData = new FormData()
    formData.append('description', data?.description)
    formData.append('class_id', data?.class_id)
    formData.append('file', data?.file)

    const access_token = await get_access_token()

    const response = await axios.post(ApiRoute.syllabus.create,
        formData,
        {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );
    return response

}



export {
    createTimeTable,
    addSyllabus
}