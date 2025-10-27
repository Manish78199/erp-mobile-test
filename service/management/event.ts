import {ApiRoute} from "@/constants/apiRoute";
import { get_access_token } from "@/utils/accessToken";
import axios from "axios";

const uploadEventActivityImage = async (eventActivityDetials: any) => {
    const access_token = await get_access_token()
    return await axios.post(ApiRoute.event.uploadEventImages,
        eventActivityDetials,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },


        }
    );

}


const getEventActivityImages = async () => {
    const access_token = await get_access_token()
    try {
        const allImages = await axios.get(ApiRoute.event.get_activity_image,
            
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },


            }
        );
        return allImages.data.data
    } catch (error) {
        return []
    }

}









export {
    uploadEventActivityImage,
    getEventActivityImages
}