import axios from "axios";
import routes from "@/config/route"

const uploadImage = async (image: File) => {
    const access_token = localStorage.getItem("access_token")
    const formData = new FormData()
    formData.append("file", image)
    return await axios.post(routes.uploader.image,
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
    const access_token = localStorage.getItem("access_token")
    const formData = new FormData()
    for (let file of images){
        formData.append("files", file)

    }

    return await axios.post(routes.uploader.multipleImages,
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