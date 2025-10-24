import routes from "@/config/route";
import axios from "axios";

const getStudentDetails = async (student_id: string) => {
    const access_token = localStorage.getItem("access_token")

    const response = await axios.get(`${routes.fee.getStudentFeeDetails}?student_id=${student_id}`,

        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );
    return response

}


const getFeeHistory = async (class_id: string = null, student_id: string = null) => {
    let route = routes.fee.history
    if (class_id) {
        route = `${routes.fee.history}?class_id=${class_id}`
    }
    if (student_id) {
        route = `${routes.fee.history}?student_id=${student_id}`
    }

    const access_token = localStorage.getItem("access_token")
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
    let route = `${routes.fee.history}/${deposit_id}`
   

    const access_token = localStorage.getItem("access_token")
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
        return  null
    }
}


const depositFee = async (depositDetails: any) => {
    const access_token = localStorage.getItem("access_token")

    const response = await axios.post(routes.fee.deposit,
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