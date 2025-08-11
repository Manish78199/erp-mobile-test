import { ApiRoute } from "@/constants/apiRoute";
import { get_access_token } from "@/utils/accessToken";
import axios from "axios";



export interface EventActivity {
  image_path: string | undefined;
  likes: number;
  comments: [];
  id: string
  title: string
  description: string
  date: string
  category: string
  location: string
  participants: number
  images: string[]
  status: "upcoming" | "ongoing" | "completed"
}

export interface EventResponse {
  data: {
    message: string
    data: EventActivity[]
    total: number
    page: number
    limit: number
  }
}

const getEventActivity=async ()=>{
    const access_token=await get_access_token()
    try {
        const allClass = await axios.get(ApiRoute.STUDENT.event.activity_photos,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },
    
            }
        );
        return allClass.data.data
    } catch (error) {
        return []
    }
}


const getAllEventActivity=async ()=>{
    const access_token=await get_access_token()
    try {
        const allClass = await axios.get(ApiRoute.STUDENT.event.all_activity_photos,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },
    
            }
        );
        return allClass.data.data
    } catch (error) {
        return []
    }
}



export {
    getAllEventActivity, getEventActivity
};

