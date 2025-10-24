import axios from "axios";
import routes from "@/config/route"

const createClass = async (classDetails: { name: string, section: Array<string> }) => {
    const access_token = localStorage.getItem("access_token")
    return await axios.post(routes.classService.create,
        classDetails,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );

}

const getAllClass = async () => {
    const access_token = localStorage.getItem("access_token")
    try {
        const allClass = await axios.get(routes.classService.getAllClass,
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
    createClass,
    getAllClass
}