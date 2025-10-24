import routes from "@/config/route";
import axios from "axios";

const createNotice = async (noticeDetails: any) => {
    const access_token = localStorage.getItem("access_token")
    return await axios.post(routes.noticeService.newNotice,
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
    const access_token = localStorage.getItem("access_token")
    try {

        const repsonse = await axios.get(routes.noticeService.getNotice,
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