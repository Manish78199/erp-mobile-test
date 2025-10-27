import { ApiRoute } from "@/constants/apiRoute";
import { get_access_token } from "@/utils/accessToken";
import axios from "axios";

const getStudentDetails = async (student_id: string) => {
    const access_token = await get_access_token()

    const response = await axios.get(`${ApiRoute.fee.getStudentFeeDetails}?student_id=${student_id}`,

        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );
    return response

}


const getFeeHistory = async (class_id: string | null = null, student_id: string | null = null) => {
    let route = ApiRoute.fee.history
    if (class_id) {
        route = `${ApiRoute.fee.history}?class_id=${class_id}`
    }
    if (student_id) {
        route = `${ApiRoute.fee.history}?student_id=${student_id}`
    }

    const access_token = await get_access_token()
    try {

        const response = await axios.get(route,

            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },

            }
        );
        return response.data.data

    } catch (error) {
        console.log(error)
        return []
    }
}


const getFeeSlip = async (deposit_id: string) => {
    let route = `${ApiRoute.fee.history}/${deposit_id}`


    const access_token = await get_access_token()
    try {

        const response = await axios.get(route,

            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },

            }
        );
        return response.data.data

    } catch (error) {
        console.log(error)
        return null
    }
}


const depositFee = async (depositDetails: any) => {
    const access_token = await get_access_token()

    const response = await axios.post(ApiRoute.fee.deposit,
        depositDetails,

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
    getStudentDetails,
    depositFee,
    getFeeHistory,
    getFeeSlip
}