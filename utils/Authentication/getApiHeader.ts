import { get_access_token } from "../accessToken";

const get_headers = () => {
    const access_token = get_access_token()
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
    };
};

export {
    get_headers
}