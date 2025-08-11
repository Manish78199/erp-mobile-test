import { createContext } from "react";




interface UserRoleType {
    USER_TYPE: "STUDENT" | "MANAGEMENT" | null
    VerifyToken: () => {};
    loading: boolean,
    checked: boolean
}
const funType = ()=> {
    return ""
}
const UserTypeContext = createContext<UserRoleType>({
    USER_TYPE: null,
    VerifyToken: funType,
    loading: false,
    checked: false
})

export { UserTypeContext };

