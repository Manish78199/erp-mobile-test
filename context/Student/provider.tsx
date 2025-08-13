
import { getMyProfile } from "@/service/student/profile";
import React, { useEffect, useState } from "react";
import { StudentAppDataContext } from "./context";


export  function StudentAppDataProvider({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState(null)

    const fetchProfile = async () => {
        const myProfile = await getMyProfile()
        console.log("Profile Data:", myProfile)
        setProfile(myProfile)
    }
    useEffect(() => {
        fetchProfile()
    }, [])
    return (
        <StudentAppDataContext.Provider value={{ profile ,refresh: fetchProfile}}>

            {children}
        </StudentAppDataContext.Provider>
    )
}