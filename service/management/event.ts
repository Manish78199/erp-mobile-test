import routes from "@/config/route";
import axios from "axios";

const uploadEventActivityImage = async (eventActivityDetials: any) => {
    const access_token = localStorage.getItem("access_token")
    return await axios.post(routes.event.uploadEventImages,
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
    const access_token = localStorage.getItem("access_token")
    try {
        const allImages = await axios.get(routes.event.get_activity_image,
            
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