import routes from "@/config/route";
import axios from "axios";

const changeStudentPassword = async (data:{
    student_id: string,
     password: string}) => {

    const access_token = localStorage.getItem("access_token")

    const response = await axios.post(`${routes.studentService.change_password}`,
        data,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );
    return response

}

export {
    changeStudentPassword
}