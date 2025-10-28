import {ApiRoute} from "@/constants/apiRoute";
import { get_access_token } from "@/utils/accessToken";
import axios from "axios";

const createNotice = async (noticeDetails: any) => {
    const access_token = await get_access_token()
    return await axios.post(ApiRoute.noticeService.newNotice,
        noticeDetails,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );

}



const getNotice = async () => {
    const access_token = await get_access_token()
    try {

        const repsonse = await axios.get(ApiRoute.noticeService.getNotice,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },

            }
        );
        return repsonse?.data?.data

    } catch (error) {
        return []

    }

}




export {
    createNotice,
    getNotice
}