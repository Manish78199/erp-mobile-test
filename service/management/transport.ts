import routes from "@/config/route";
import axios from "axios";

const get_headers = () => {
    const access_token = localStorage.getItem("access_token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
    };
};
const createVehicle = (payload: any) => {
    return axios.post(routes.TRANSPORT.vehicle, payload, { headers: get_headers() });
};

const get_vehicle = async () => {
    try {
        const repsonse = await axios.get(routes.TRANSPORT.vehicle, { headers: get_headers() });
        return repsonse?.data?.data
    } catch (error) {
        console.log(error,"error")
        return []
    }
}
const get_vehicle_details = async (vehicle_id:string) => {
    try {
        const repsonse = await axios.get(`${routes.TRANSPORT.vehicle}/${vehicle_id}`, { headers: get_headers() });
        return repsonse?.data?.data
    } catch (error) {
        return null
    }
}

const createRoute = (payload: any) => {
    return axios.post(routes.TRANSPORT.route, payload, { headers: get_headers() });
};


const getAllRoutes = async () => {
    try {
        const repsonse = await axios.get(routes.TRANSPORT.route, { headers: get_headers() });
        return repsonse?.data?.data
    } catch (error) {
        console.log(error,"error")
        return []
    }
};

const assignDriver = (vehicleId: string, payload: any) => {
    return axios.patch(`${routes.TRANSPORT.vehicle}/${vehicleId}/driver`, payload, { headers: get_headers() });
};

const assignRoute = (vehicleId: string, payload: any) => {
    return axios.patch(`${routes.TRANSPORT.vehicle}/${vehicleId}/route`, payload, { headers: get_headers() });
};


const searchPickUpPoint = async (query: string) => {
    try {
        const reponse = await axios.get(`${routes.TRANSPORT.searchPickUpPoint}?query=${query}`, { headers: get_headers() });
        return reponse?.data?.data
    } catch (error) {
        return []
    }
}



const assignTransportToStudent = (assignData: any) => {
    return axios.post(`${routes.TRANSPORT.assignToStudent}`, assignData, { headers: get_headers() });
};

const getAssignedTransport = async (student_id: string) => {
    try {
        const reponse = await axios.get(`${routes.TRANSPORT.getAssignTransport}?student_id=${student_id}`, { headers: get_headers() });
        return reponse?.data?.data
    } catch (error) {
        return []
    }
}


const releaseTransportToStudent = (releaseData: any) => {
    return axios.patch(`${routes.TRANSPORT.releaseTransport}`, releaseData, { headers: get_headers() });
};



// vehicle and routes

const assignVehicleToRoutes = (assignData: any) => {
    return axios.post(`${routes.TRANSPORT.assign_vehicle_route}`, assignData, { headers: get_headers() });

}


const getRouteVehicles = async (route_id: string) => {
    try {
        const reponse = await axios.get(`${routes.TRANSPORT.get_route_vehicles}/${route_id}`, { headers: get_headers() });
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
