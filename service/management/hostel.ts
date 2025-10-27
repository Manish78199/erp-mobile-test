import { get_headers } from "@/utils/Authentication/getApiHeader";
import {ApiRoute} from "@/constants/apiRoute";
import axios from "axios";






export const addHostel = async (payload: any) => {
  const res = await axios.post(ApiRoute.HOSTEL.add_hostel, payload, { headers:await get_headers() });
  return res.data;
};


export const getHostelList = async () => {
  try {
    const res = await axios.get(ApiRoute.HOSTEL.get_hostel_list, { headers:await get_headers() });
    return res.data.data
  } catch (error) {
    return []
  };
};


export const addRoom = async (payload: any) => {
  const res = await axios.post(ApiRoute.HOSTEL.room, payload, { headers:await get_headers() });
  return res.data;
};


export const get_hostel_room = async (hostel_id:string |null =null) => {
  try {
    let route=ApiRoute.HOSTEL.room
    if (hostel_id){
      route=`${ApiRoute.HOSTEL.room}?hostel_id=${hostel_id}`
    }
    const res = await axios.get(route, { headers:await get_headers() });
    return res.data.data
  } catch (error) {
    return []
  };
};

export const assignRoom = async (payload: any) => {
  const res = await axios.post(ApiRoute.HOSTEL.room_assign, payload, { headers:await get_headers() });
  return res.data;
};


export const vacateRoom = async (assignment_id:string) => {
  const res = await axios.delete(`${ApiRoute.HOSTEL.room_vacant}?assignment_id=${assignment_id}`, { headers:await get_headers() });
  return res.data;
};



export const get_student_assign_room = async (student_id:string) => {
  try {
    let route=`${ApiRoute.HOSTEL.asssigned_room}?student_id=${student_id}`
 
    const res = await axios.get(route, { headers:await get_headers() });
    return res.data.data
  } catch (error) {
    return null
  };
};






export const hostelService = {
  addHostel,
  getHostelList,
  get_hostel_room,
  addRoom,
  assignRoom,
  vacateRoom,
  get_student_assign_room

}