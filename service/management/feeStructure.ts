import {ApiRoute} from "@/constants/apiRoute";
import { get_access_token } from "@/utils/accessToken";
import axios from "axios";

const createFeeStructure = async (feestructureDetails: any) => {
    const access_token = await get_access_token()
    return await axios.post(ApiRoute.feeStructure.create,
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
    const access_token = await get_access_token()
    return await axios.put(ApiRoute.feeStructure.update,
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
    const access_token = await get_access_token()
    try {

        const allFeeStructure = await axios.get(ApiRoute.feeStructure.getAll,
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
    const access_token = await get_access_token()

    try {
        const feeStructure = await axios.get(`${ApiRoute.feeStructure.getByClassId}/${class_id}`,
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