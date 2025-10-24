import axios from "axios";
import {ApiRoute} from "@/constants/apiRoute"
import { get_access_token } from "@/utils/accessToken";


const createStudentHomework = async (homeworkDetails: any) => {
    const access_token = await get_access_token()
    return await axios.post(ApiRoute.stuentHomeWork.create,
        homeworkDetails,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );

}


const getHomeWorkByClassId = async (classId: string) => {
    const access_token = await get_access_token()
    try {
        const res = await axios.get(`${ApiRoute.stuentHomeWork.getByClass}/${classId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },

            }
        );
        return res.data.data
    } catch (error) {
        console.log(error)
        return []
    }
}




const deletStudentHomework = async (homeWorkId: string) => {
    const access_token = await get_access_token()
    return await axios.delete(`${ApiRoute.stuentHomeWork.deleteHomeWork}/${homeWorkId}`,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );

}


const getHomeWorkById = async (homeWorkId: string) => {
    const access_token = await get_access_token()
    try {
        const res = await axios.get(`${ApiRoute.stuentHomeWork.create}/${homeWorkId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },

            }
        );
        return res.data.data
    } catch (error) {
        console.log(error)
        return null
    }
}


export {
    createStudentHomework,
    getHomeWorkByClassId,
    deletStudentHomework,
    getHomeWorkById
}