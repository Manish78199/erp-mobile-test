import axios from "axios";
import {ApiRoute} from "@/constants/apiRoute";
import { get_access_token } from "@/utils/accessToken";

const createSubject = async (subjectDetials: object) => {
    const access_token = await get_access_token()
    return await axios.post(ApiRoute.subjectService.create,
        subjectDetials,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );

}


const getAllSubject = async () => {
    const access_token = await get_access_token()
    try {
        const response = await axios.get(ApiRoute.subjectService.getAllSubject,

            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },

            }
        );
        return response.data.data
    } catch (error) {
        return []
    }
}


const deleteSubject = async (subject_id: string) => {
    const access_token = await get_access_token()
    return await axios.delete(`${ApiRoute.subjectService.delete}/${subject_id}`,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );

}

const getClassSubject=async (class_id:string)=>{
    const access_token = await get_access_token()
    try {
        const response = await axios.get(`${ApiRoute.subjectService.getClassSubject}/${class_id}`,

            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },

            }
        );
        return response.data.data
    } catch (error) {
        return []
    }
}

export {
    createSubject,
    getAllSubject,
    getClassSubject,
    deleteSubject
}