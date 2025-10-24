import routes from "@/config/route";
import axios from "axios";

const save_student_health = async (health: any) => {
    const access_token = localStorage.getItem("access_token")

    const response = await axios.post(`${routes.studentService.student_health}`,
        health,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );
    return response

}

const get_student_health = async (student_id: string) => {
    const access_token = localStorage.getItem("access_token")
    try {
        const response = await axios.get(`${routes.studentService.student_health}/${student_id}`,

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
    save_student_health,
    get_student_health
}