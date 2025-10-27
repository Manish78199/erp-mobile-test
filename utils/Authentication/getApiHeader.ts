import { get_access_token } from "../accessToken";

const get_headers = async () => {
    const access_token =await get_access_token()
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
    };
};

export {
    get_headers
}