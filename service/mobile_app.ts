import { ApiRoute } from "@/constants/apiRoute";
import { get_access_token } from "@/utils/accessToken";
import axios from "axios";
import { Platform } from "react-native";
import * as Application from "expo-application";
const check_update = async () => {
    try {


        const platform = Platform.OS;
        const current_version = Application.nativeApplicationVersion;


        const access_token = await get_access_token()
        const allClass = await axios.post(ApiRoute.app_check,
            {
                platform:String(platform).toUpperCase(),
                current_version:String(current_version).toUpperCase()
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },

            }
        );
        return allClass.data.data
    } catch (error) {
        return null
    }
}


export { check_update };

