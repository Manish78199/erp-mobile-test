import { ApiRoute } from "@/constants/apiRoute";
import { get_access_token } from "@/utils/accessToken";
import axios from "axios";

const getAllNotice = async () => {
    const access_token=await get_access_token()
    try {
        const allClass = await axios.get(`${ApiRoute.STUDENT.getAllnotice}`,
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
    getAllNotice
};

