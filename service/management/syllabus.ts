import {ApiRoute} from "@/constants/apiRoute";
import { get_access_token } from "@/utils/accessToken";
import axios from "axios";

const getAllSylllabus = async () => {
   const access_token = await get_access_token()
    try {
        const response = await axios.get(ApiRoute.syllabus.getAllSylllabus,

            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },

            }
        );
        return response.data.data
    } catch (error) {
        return []
    }
}



const addSyllabus = async (data: { description: string; class_id: string; file: any }) => {
  const formData = new FormData();

  formData.append("description", data.description);
  formData.append("class_id", data.class_id);
  formData.append("file", {
    uri: data.file.uri,
    name: data.file.name || "syllabus.pdf",
    type: data.file.type || "application/pdf",
  } as any);

  const access_token = await get_access_token();

  const response = await axios.post(ApiRoute.syllabus.create, formData, {
    headers: {
      "Authorization": `Bearer ${access_token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};




export {
    getAllSylllabus,
    addSyllabus
}