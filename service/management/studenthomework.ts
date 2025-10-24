import axios from "axios";
import routes from "@/config/route"


const createStudentHomework = async (homeworkDetails: any) => {
    const access_token = localStorage.getItem("access_token")
    return await axios.post(routes.stuentHomeWork.create,
        homeworkDetails,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );

}


const getHomeWorkByClassId = async (classId: string) => {
    const access_token = localStorage.getItem("access_token")
    try {
        const res = await axios.get(`${routes.stuentHomeWork.getByClass}/${classId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },

            }
        );
        return res.data.data
    } catch (error) {
        console.log(error)
        return []
    }
}




const deletStudentHomework = async (homeWorkId: string) => {
    const access_token = localStorage.getItem("access_token")
    return await axios.delete(`${routes.stuentHomeWork.deleteHomeWork}/${homeWorkId}`,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );

}


const getHomeWorkById = async (homeWorkId: string) => {
    const access_token = localStorage.getItem("access_token")
    try {
        const res = await axios.get(`${routes.stuentHomeWork.create}/${homeWorkId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },

            }
        );
        return res.data.data
    } catch (error) {
        console.log(error)
        return null
    }
}


export {
    createStudentHomework,
    getHomeWorkByClassId,
    deletStudentHomework,
    getHomeWorkById
}