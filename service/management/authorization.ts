import {ApiRoute} from "@/constants/apiRoute";
import { get_access_token } from "@/utils/accessToken";
import axios from "axios";

const get_all_auth_user = async () => {
    const access_token = await get_access_token()


    try {
        const res = await axios.get(ApiRoute.AUTHORIZATION.get_all_auth_user,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },

            }
        );
        return res.data.data
    } catch (error) {
        console.log(error)
        return []
    }
}





const get_all_permission = async () => {
    const access_token = await get_access_token()


    try {
        const res = await axios.get(ApiRoute.AUTHORIZATION.get_all_permission,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },

            }
        );
        return res.data.data
    } catch (error) {
        console.log(error)
        return null
    }
}



const get_all_roles = async () => {
    const access_token = await get_access_token()


    try {
        const res = await axios.get(ApiRoute.AUTHORIZATION.get_all_roles,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },

            }
        );
        return res.data.data
    } catch (error) {
        console.log(error)
        return []
    }
}


const create_role = async (roleDetails: any) => {
    const access_token = await get_access_token()

    return await axios.post(ApiRoute.AUTHORIZATION.create_role,
        roleDetails,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );

}

const get_role = async (roleId: string) => {
    const access_token = await get_access_token()


    try {
        const res = await axios.get(`${ApiRoute.AUTHORIZATION.get_all_roles}/${roleId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },

            }
        );
        return res.data.data
    } catch (error) {
        console.log(error)
        return null
    }
}


const delete_role = async (roleId: string) => {
    const access_token = await get_access_token()


    return await axios.delete(`${ApiRoute.AUTHORIZATION.create_role}/${roleId}`,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );

}

const update_role = async (roleId: string, roleDetails: any) => {
    const access_token = await get_access_token()

    return await axios.put(`${ApiRoute.AUTHORIZATION.create_role}/${roleId}`,
        roleDetails,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );
}


const get_my_auth_profile = async () => {
    const access_token = await get_access_token()


    try {
        const res = await axios.get(ApiRoute.AUTHORIZATION.get_my_auth_profile,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },

            }
        );
        return res.data.data
    } catch (error) {
        console.log(error)
        return null
    }
}




const get_user_permission_and_role = async (employee_id: string) => {
    const access_token = await get_access_token()

    try {
        const res = await axios.get(`${ApiRoute.AUTHORIZATION.get_user_permission_and_role}?employee_id=${employee_id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },

            }
        );
        return res.data.data
    } catch (error) {
        console.log(error)
        return null
    }
}



const assign_role_and_permission = async (assignDetails: any) => {
    const access_token = await get_access_token()

    return await axios.put(ApiRoute.AUTHORIZATION.assign_role_and_permission,
        assignDetails,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },

        }
    );

}


export {
    get_all_auth_user,
    get_all_permission,
    get_all_roles,
    get_my_auth_profile,
    create_role,
    get_user_permission_and_role,
    assign_role_and_permission,
    get_role,
    update_role,
    delete_role
}