import { get_headers } from "@/app/Utils/Authentication/getApiHeader";
import routes from "@/config/route";
import axios from "axios";






export const addHostel = async (payload: any) => {
  const res = await axios.post(routes.HOSTEL.add_hostel, payload, { headers: get_headers() });
  return res.data;
};


export const getHostelList = async () => {
  try {
    const res = await axios.get(routes.HOSTEL.get_hostel_list, { headers: get_headers() });
    return res.data.data
  } catch (error) {
    return []
  };
};


export const addRoom = async (payload: any) => {
  const res = await axios.post(routes.HOSTEL.room, payload, { headers: get_headers() });
  return res.data;
};


export const get_hostel_room = async (hostel_id:string=null) => {
  try {
    let route=routes.HOSTEL.room
    if (hostel_id){
      route=`${routes.HOSTEL.room}?hostel_id=${hostel_id}`
    }
    const res = await axios.get(route, { headers: get_headers() });
    return res.data.data
  } catch (error) {
    return []
  };
};

export const assignRoom = async (payload: any) => {
  const res = await axios.post(routes.HOSTEL.room_assign, payload, { headers: get_headers() });
  return res.data;
};


export const vacateRoom = async (assignment_id:string) => {
  const res = await axios.delete(`${routes.HOSTEL.room_vacant}?assignment_id=${assignment_id}`, { headers: get_headers() });
  return res.data;
};



export const get_student_assign_room = async (student_id:string) => {
  try {
    let route=`${routes.HOSTEL.asssigned_room}?student_id=${student_id}`
 
    const res = await axios.get(route, { headers: get_headers() });
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