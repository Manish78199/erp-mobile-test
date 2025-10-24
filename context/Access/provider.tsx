"use client";

import React, { useState, useEffect } from "react";
import { UserAuthorization } from "./context";
import { get_all_permission, get_my_auth_profile } from "@/service/management/authorization";
import {PERMISSION} from "@/constants/permission"

interface  PermissionMap {
    [module: string]: string[];
  }

export default function ManagementAuthorization({ children }: { children: React.ReactNode }) {
    const [Role, setRole] = useState("")
    const [Permission, setPermission] = useState<PermissionMap | null>(
        PERMISSION
    );


    useEffect(() => {
        const geAuthPermissionRequest = async () => {
            const authProfile = await get_my_auth_profile()
            console.log(authProfile,"authProfile")
            if (authProfile){
                setRole(authProfile?.role)
                const fetchedPermission=authProfile?.permission
            
                if(fetchedPermission){
                    const allModule=Object.keys(fetchedPermission)

                    const ALL_MODULE_PERMISSION={...PERMISSION}
                    for(let module of allModule){
                     
                        ALL_MODULE_PERMISSION[module]=fetchedPermission[module]
                    }
                    setPermission(()=>ALL_MODULE_PERMISSION)
                 
                }
               

            }
        }
        geAuthPermissionRequest()
    }, [])


    const setAuthorizationHandler = (role: string, permissions: PermissionMap) => {
        setRole(role)
        setPermission(()=>permissions)
    }
    return (


        <UserAuthorization.Provider value={{ Role, Permission, setAuthorization: setAuthorizationHandler }}>
            {children}
        </UserAuthorization.Provider>

    );
}
