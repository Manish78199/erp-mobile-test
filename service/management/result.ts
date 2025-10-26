import {ApiRoute} from "@/constants/apiRoute";
import { get_access_token } from "@/utils/accessToken";
import axios from "axios";


const get_exam_student_list = async (exam_id: string) => {
    let route = `${ApiRoute.RESULT.get_exam_student_list}/${exam_id}`

    const access_token = await get_access_token()

    try {
        const examDetails = await axios.get(route,

            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },
            }
        );
        return examDetails.data.data
    } catch (error) {
        return []
    }

}

const get_exam_student_detials = async (exam_id: string, student_id: string) => {
    let route = `${ApiRoute.RESULT.get_student_details}/${exam_id}?student_id=${student_id}`

        const access_token = await get_access_token()
    try {

        const examDetails = await axios.get(route,

            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },
            }
        );
        return examDetails.data.data
    } catch (error) {
        return null
    }

}

const markSubmitting = async (markDetails: any) => {
    let route = ApiRoute.RESULT.mark_submit

        const access_token = await get_access_token()

    const examDetails = await axios.post(route,
        markDetails,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },
        }
    );
    return examDetails


}



const result_declare = async (exam_id: any) => {
    let route = `${ApiRoute.RESULT.declare}/${exam_id}`

        const access_token = await get_access_token()

    const examDetails = await axios.post(route,
        null,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },
        }
    );
    return examDetails

}


const save_result_setting = async (details: any) => {

    const route = ApiRoute.RESULT.save_result_setting

        const access_token = await get_access_token()

    const examDetails = await axios.post(route,
        details,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },
        }
    );
    return examDetails
}



const get_marksheet = async (student_id: string) => {
    let route = `${ApiRoute.RESULT.view_marksheet}/${student_id}`

        const access_token = await get_access_token()
    try {

        const examDetails = await axios.get(route,
            {
                responseType: "blob",
                headers: {

                    "Authorization": `Bearer ${access_token}`,
                },
            }
        );

        return examDetails.data
    } catch (error) {
        return null
    }

}



const get_result_summary = async (exam_id: string) => {
        const access_token = await get_access_token()

    try {

        const examDetails = await axios.get(`${ApiRoute.RESULT.get_class_summary}/${exam_id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },
            }
        );

        return examDetails.data.data
    } catch (error) {
        return []
    }
}


export {
    get_exam_student_list,
    get_exam_student_detials,
    markSubmitting,
    result_declare,
    save_result_setting,


    get_marksheet,
    get_result_summary

}