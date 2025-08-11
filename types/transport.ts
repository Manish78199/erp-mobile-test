export interface TRACK_DATA {
  vehicle_id: string
  latitude: number
  longitude: number
  speed: number
  timestamp: number
}

export interface TransportDetails {
  vehicle_id: string
  vehicle_number: string
  route_name: string
  driver_name: string
  driver_phone?: string
  pickUp_point_name: string
  departure_time: string
  arrival_time: string
  vehicle_details: {
    latitude: number
    longitude: number
    speed: number
    timestamp: number
    tracking: boolean
  }
}

export interface Position {
  latitude: number
  longitude: number
  speed: number | string
  timestamp: number
}
