
import React, { useState } from "react";

import { roleAuth } from "@/service/roleAuth";
import { get_access_token } from "@/utils/accessToken";
import { UserTypeContext } from "./context";
export default function UserTypeProvider({ children }: { children: React.ReactNode }) {

    const [isloading, setLoading] = useState(false)
    const [isChecked, setChecked] = useState(false)
    const [userType, setUserType] = useState<"STUDENT" | "MANAGEMENT" | null>(null)

    const VerifyToken = async () => {
        const access_token = await get_access_token()
        if (!access_token) {
            setChecked(true)
            return null
        }
        setLoading(true)
        const response = await roleAuth(access_token)
        setLoading(false)
        setChecked(true)

        if (!response) {

            return null
        }
        setUserType(response?.role)
        return response?.role
    }
    return (
        <UserTypeContext.Provider value={{ USER_TYPE: userType, loading: isloading, checked: isChecked, VerifyToken: VerifyToken }}>
            {children}
        </UserTypeContext.Provider>
    )
}