const get_headers = () => {
    const access_token = localStorage.getItem("access_token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
    };
};

export {
    get_headers
}