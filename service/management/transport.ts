import {ApiRoute} from "@/constants/apiRoute";
import { get_access_token } from "@/utils/accessToken";
import axios from "axios";

const get_headers = async() => {
  const access_token = await get_access_token()
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
    };
};
const createVehicle =async (payload: any) => {
    return axios.post(ApiRoute.TRANSPORT.vehicle, payload, { headers: await get_headers() });
};

const get_vehicle = async () => {
    try {
        const repsonse = await axios.get(ApiRoute.TRANSPORT.vehicle, { headers:await get_headers() });
        return repsonse?.data?.data
    } catch (error) {
        console.log(error,"error")
        return []
    }
}
const get_vehicle_details = async (vehicle_id:string) => {
    try {
        const repsonse = await axios.get(`${ApiRoute.TRANSPORT.vehicle}/${vehicle_id}`, { headers:await get_headers() });
        return repsonse?.data?.data
    } catch (error) {
        return null
    }
}

const createRoute =async (payload: any) => {
    return axios.post(ApiRoute.TRANSPORT.route, payload, { headers:await get_headers() });
};


const getAllRoutes = async () => {
    try {
        const repsonse = await axios.get(ApiRoute.TRANSPORT.route, { headers:await get_headers() });
        return repsonse?.data?.data
    } catch (error) {
        console.log(error,"error")
        return []
    }
};

const assignDriver = async (vehicleId: string, payload: any) => {
    return axios.patch(`${ApiRoute.TRANSPORT.vehicle}/${vehicleId}/driver`, payload, { headers:await get_headers() });
};

const assignRoute =async (vehicleId: string, payload: any) => {
    return axios.patch(`${ApiRoute.TRANSPORT.vehicle}/${vehicleId}/route`, payload, { headers:await get_headers() });
};


const searchPickUpPoint = async (query: string) => {
    try {
        const reponse = await axios.get(`${ApiRoute.TRANSPORT.searchPickUpPoint}?query=${query}`, { headers:await get_headers() });
        return reponse?.data?.data
    } catch (error) {
        return []
    }
}



const assignTransportToStudent =async (assignData: any) => {
    return axios.post(`${ApiRoute.TRANSPORT.assignToStudent}`, assignData, { headers:await get_headers() });
};

const getAssignedTransport = async (student_id: string) => {
    try {
        const reponse = await axios.get(`${ApiRoute.TRANSPORT.getAssignTransport}?student_id=${student_id}`, { headers: get_headers() });
        return reponse?.data?.data
    } catch (error) {
        return []
    }
}


const releaseTransportToStudent = async (releaseData: any) => {
    return axios.patch(`${ApiRoute.TRANSPORT.releaseTransport}`, releaseData, { headers:await get_headers() });
};



// vehicle and routes

const assignVehicleToRoutes =async (assignData: any) => {
    return axios.post(`${ApiRoute.TRANSPORT.assign_vehicle_route}`, assignData, { headers:await get_headers() });

}


const getRouteVehicles = async (route_id: string) => {
    try {
        const reponse = await axios.get(`${ApiRoute.TRANSPORT.get_route_vehicles}/${route_id}`, { headers:await get_headers() });
        return reponse?.data?.data
    } catch (error) {
        return []
    }
}


export {
    createVehicle,
    get_vehicle,
    get_vehicle_details,


    createRoute,
    assignDriver,
    assignRoute,
    searchPickUpPoint,
    getAllRoutes,
    assignTransportToStudent,
    getAssignedTransport,
    releaseTransportToStudent,

    // vehicle and routes
    assignVehicleToRoutes,
    getRouteVehicles
};
