import axios from "axios";
import {ApiRoute} from "@/constants/apiRoute"
import { get_access_token } from "@/utils/accessToken";

const createClass = async (classDetails: { name: string, section: Array<string> }) => {
    const access_token = await get_access_token()
    return await axios.post(ApiRoute.classService.create,
        classDetails,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );

}

const getAllClass = async () => {
    const access_token = await get_access_token()
    try {
        const allClass = await axios.get(ApiRoute.classService.getAllClass,
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
    createClass,
    getAllClass
}