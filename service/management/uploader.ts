import axios from "axios";
import {ApiRoute} from "@/constants/apiRoute"
import { get_access_token } from "@/utils/accessToken";

const uploadImage = async (image: File) => {
    const access_token = await get_access_token()
    const formData = new FormData()
    formData.append("file", image)
    return await axios.post(ApiRoute.uploader.image,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );

}


const uploadMultipleImages = async (images: [File]) => {
    const access_token = await get_access_token()
    const formData = new FormData()
    for (let file of images){
        formData.append("files", file)

    }

    return await axios.post(ApiRoute.uploader.multipleImages,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );

}





export {
    uploadImage,
    uploadMultipleImages
}