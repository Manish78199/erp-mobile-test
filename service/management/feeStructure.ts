import routes from "@/config/route";
import axios from "axios";

const createFeeStructure = async (feestructureDetails: any) => {
    const access_token = localStorage.getItem("access_token")
    return await axios.post(routes.feeStructure.create,
        feestructureDetails,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );

}



const updateFeeStructure = async (feestructureDetails: any) => {
    const access_token = localStorage.getItem("access_token")
    return await axios.put(routes.feeStructure.update,
        feestructureDetails,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );

}



const getAllFeeStructure = async () => {
    const access_token = localStorage.getItem("access_token")
    try {

        const allFeeStructure = await axios.get(routes.feeStructure.getAll,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },

            }
        );
        return allFeeStructure.data.data

    } catch (error) {
        return []

    }

}



const getFeeStructureByClass = async (class_id: any) => {
    const access_token = localStorage.getItem("access_token")

    try {
        const feeStructure = await axios.get(`${routes.feeStructure.getByClassId}/${class_id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },

            }
        );
        return feeStructure.data.data
    } catch (error) {
        return null
    }

}




export {
    createFeeStructure,
    updateFeeStructure,
    getAllFeeStructure,
    getFeeStructureByClass
}