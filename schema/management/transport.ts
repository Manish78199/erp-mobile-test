import * as Yup from 'yup';


type VehicleFormData = {
    driver_id: string
    maker:string
    model: string
    vehicle_number:string
    model_year: number
    type: string
    capacity: number
    fuelType: string
    engineNumber: string
    chassisNumber: string
    color: string
    insuranceProvider: string
    insuranceNumber: string
    insuranceExpiry: string
    fitnessExpiry: string
    pollutionExpiry: string
    roadTaxExpiry: string
    permitExpiry: string
    fuelEfficiency: string
    wheelchairAccessible: boolean
    airConditioned: boolean
    gpsEnabled: boolean
    cctv: boolean
    firstAidKit: boolean
    fireExtinguisher: boolean
    emergencyExit: boolean
    notes: string
}


interface PickupPointType {
    name: string
    sequence: number
    address: string
    latitude: number | string
    longitude: number | string
    estimated_students: number
    arrival_time: string
    departure_time: string
    monthly_fee: number
}

interface RouteFormType {
    vehicle_id?: string | null
    name: string
    code: string
    route_type: "PICKUP" | "DROP" | "BOTH"
    description: string
    start_location: string
    end_location: string
    total_distance_km: number 
    estimated_duration_minutes: number 
    monthly_fuel_budget: number 
    daily_toll_charges: number
    notes: string
    pickup_points: PickupPointType[]
}




const VehicleSchema = Yup.object({
    model: Yup.string().required("Model is required").min(2, "Model must be at least 2 characters"),
    model_year: Yup.number()
        .required("Model year is required")
        .min(1990, "Year must be 1990 or later")
        .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
    type: Yup.string().required("Vehicle type is required"),
    vehicle_number:Yup.string().required("Vehicle number is required"),
    maker:Yup.string().required("Vehicle type is required"),
    fuelType: Yup.string().required("Fuel type is required"),
    engineNumber: Yup.string()
        .required("Engine number is required")
        .min(5, "Engine number must be at least 5 characters"),
    chassisNumber: Yup.string()
        .required("Chassis number is required")
        .min(5, "Chassis number must be at least 5 characters"),
    insuranceExpiry: Yup.date()
        .required("Insurance expiry date is required")
        .min(new Date(), "Insurance expiry date must be in the future"),
    fitnessExpiry: Yup.date()
        .required("Fitness expiry date is required")
        .min(new Date(), "Fitness expiry date must be in the future"),
    pollutionExpiry: Yup.date()
        .required("Pollution expiry date is required")
        .min(new Date(), "Pollution expiry date must be in the future"),
    roadTaxExpiry: Yup.date().required("Road tax expiry date is required"),
    permitExpiry: Yup.date().required("Permit expiry date is required"),
})




const RouteSchema = Yup.object({
    vehicle_id: Yup.string().nullable(),
    name: Yup.string().required("Route name is required").min(3, "Route name must be at least 3 characters"),
    code: Yup.string().required("Route code is required").min(2, "Route code must be at least 2 characters"),
    route_type: Yup.string().required("Route type is required"),
    start_location: Yup.string().required("Start location is required"),
    end_location: Yup.string().required("End location is required"),
    total_distance_km: Yup.number(),
    estimated_duration_minutes: Yup.number(),
    pickup_points: Yup.array(Yup.object().shape({
        name: Yup.string().required("Point name is required."),
        sequence: Yup.number().required("Sequence is required."),
        address: Yup.string(),
        latitude: Yup.string(),
        longitude: Yup.string(),
        estimated_students: Yup.number(),
        arrival_time: Yup.string(),
        departure_time: Yup.string(),
        monthly_fee: Yup.number()
    })),
    monthly_fuel_budget: Yup.number(),
    daily_toll_charges: Yup.number(),
    notes: Yup.string()
})

export {
    VehicleSchema,
    RouteSchema,

};
export type { VehicleFormData,PickupPointType,RouteFormType };

