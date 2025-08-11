
import { ApiRoute } from "@/constants/apiRoute";
import axios from "axios";



const studentLoginRequest = async (
    EmployeLoginDetails: {
        school_code: string,
        userId: string,
        password: string
    }
) => {

    return await axios.post(ApiRoute.STUDENT.login,
        EmployeLoginDetails,
        {
            headers: {
                "Content-Type": "application/json",
            },
            
        }
    );
};


export {
    studentLoginRequest
};

