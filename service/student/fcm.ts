import { ApiRoute } from "@/constants/apiRoute";
import { get_access_token } from "@/utils/accessToken";
import axios from "axios";

const savefcmToken = async (token: string | null) => {
    if (!token){
        return ;
    }
    const data = {
        "fcm_token": token
    }
    const access_token = await get_access_token()
    return await axios.post(ApiRoute.STUDENT.save_fcm_token,
        data,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );

}


export {
    savefcmToken
};

