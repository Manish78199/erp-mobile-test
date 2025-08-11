import { ApiRoute } from "@/constants/apiRoute";
import { get_access_token } from "@/utils/accessToken";
import axios from "axios";

const get_my_health = async (session:string|null=null) => {
    const access_token=await get_access_token()
    try {
        const response = await axios.get(`${ApiRoute.STUDENT.health}`,

            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },

            }
        );
        return response.data.data
    } catch (error) {
        return null
    }
}

export {
    get_my_health
};

