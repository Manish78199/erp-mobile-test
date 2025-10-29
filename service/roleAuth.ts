import { ApiRoute } from "@/constants/apiRoute";
import axios from "axios";

const roleAuth = async (token:string ):Promise<{user:{_id:string},role:"STUDENT"|"MANAGEMENT"} | null> => {
    try {
        const allClass = await axios.get(ApiRoute.ROLE_AUTH,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },

            }
        );
        return allClass.data.data
    } catch (error) {
        return null
    }
}


export { roleAuth };

