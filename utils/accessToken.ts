import AsyncStorage from "@react-native-async-storage/async-storage"


const get_access_token = async () => {
    const token = await AsyncStorage.getItem("access_token")
    return token || null
}
export {
    get_access_token
}

