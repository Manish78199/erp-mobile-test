import { get_headers } from "@/utils/Authentication/getApiHeader"
import {ApiRoute} from "@/constants/apiRoute"
import axios from "axios"

const createSection =async (sectionDetails: any) => {

    return axios.post(ApiRoute?.section.create, sectionDetails, { headers: await get_headers() })
}

const get_class_section = async (class_id: string) => {
    try {
        const response = await axios.get(`${ApiRoute?.section.get_class_section}/${class_id}`, { headers: await get_headers() })
        return response?.data?.data
    } catch (error) {
        return []
    }
}

const assign_section_stdent = async (section_id: string, students: string[]) => {
    return axios.patch(`${ApiRoute?.section.create}/${section_id}/students`, students, { headers: await get_headers() })
}

export {
    createSection,
    get_class_section,
    assign_section_stdent
}