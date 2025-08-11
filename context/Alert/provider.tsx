
import Alert from "@/components/Alert";
import React, { useState } from "react";
import { AlertContext } from "./context";


export default function AlertProvider({ children }: { children: React.ReactNode }) {
    const [isShow, setShow] = useState(false)
    const [alertType, setAlertType] = useState("")
    const [alertMessage, setAlertMessage] = useState("")

    const showAlert = (type:string, message: string="Error") => {
        console.log("alerting....")
        setShow(() => true)
        setAlertType(() => type)
        setAlertMessage(() => message)
        setTimeout(() => {
            setShow(()=> false)
            
        }, 3000)

    }
    return (
        <AlertContext.Provider value={{showAlert}}>
            {isShow && <Alert type={alertType} message={alertMessage}/>}
            {children}
        </AlertContext.Provider>
    )
}