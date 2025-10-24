import {ApiRoute} from "@/constants/apiRoute";
import { employeeFormikType } from "@/schema/employee";
import axios from "axios";

const createEmployee = async (employeeDetails: employeeFormikType) => {
    const access_token = localStorage.getItem("access_token")
    return await axios.post(ApiRoute.employeeRoutes.create,
        employeeDetails,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );

}




const geAllEmployee = async (designation: string| null = null ) => {
    const access_token = localStorage.getItem("access_token")

    let route = designation ? `${ApiRoute.employeeRoutes.getAll}?designation=${designation}` : `${ApiRoute.employeeRoutes.getAll}`
    try {
        const res = await axios.get(route,
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

const getEmployeeDetails = async (staff_id: string) => {
    const access_token = localStorage.getItem("access_token")

    let route = `${ApiRoute.employeeRoutes.getStaffDetails}/${staff_id}`
    try {
        const res = await axios.get(route,
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



const getAllTeacherForAttendance = async (date: string) => {
    const access_token = localStorage.getItem("access_token")


    try {
        const res = await axios.get(`${ApiRoute.employeeRoutes.attendance.getAllEmployeeForAttendance}?attendanceDate=${date}`,
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



const markEmployeeAttendance = async (attendaneDetails: any) => {
    const access_token = localStorage.getItem("access_token")
    return await axios.post(ApiRoute.employeeRoutes.attendance.markAttendance,
        attendaneDetails,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );

}




const changeStaffPassword = async (data: {
    employee_id: string,
    password: string
}) => {

    const access_token = localStorage.getItem("access_token")

    const response = await axios.post(`${ApiRoute.employeeRoutes.update_password}`,
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
    createEmployee,
    geAllEmployee,
    getAllTeacherForAttendance,

    markEmployeeAttendance,
    getEmployeeDetails,


    changeStaffPassword
}