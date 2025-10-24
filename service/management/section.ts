import { get_headers } from "@/app/Utils/Authentication/getApiHeader"
import routes from "@/config/route"
import axios from "axios"

const createSection = (sectionDetails: any) => {
    return axios.post(routes?.section.create, sectionDetails, { headers: get_headers() })
}

const get_class_section = async (class_id: string) => {
    try {
        const response = await axios.get(`${routes?.section.get_class_section}/${class_id}`, { headers: get_headers() })
        return response?.data?.data
    } catch (error) {
        return []
    }
}

const assign_section_stdent = async (section_id: string, students: string[]) => {
    return axios.patch(`${routes?.section.create}/${section_id}/students`, students, { headers: get_headers() })
}

export {
    createSection,
    get_class_section,
    assign_section_stdent
}