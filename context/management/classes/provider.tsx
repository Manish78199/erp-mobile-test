
import { useContext, useEffect, useState } from "react"
import { ClassContext } from "./context"
import axios from "axios"
import {ApiRoute} from "@/constants/apiRoute"

export interface SchoolClass {
     _id: string
    name: string
    classCode: string
    studentCount: number,
    subjectCount: number
}
export const ClassProvider = ({ children }: { children: React.ReactNode }) => {
    const [classes, setClasses] = useState<SchoolClass[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchClasses = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem("access_token")
            const res = await axios.get(ApiRoute.classService.getAllClass, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setClasses(res.data.data || [])
            setError(null)
        } catch (err) {
            console.error(err)
            setError("Failed to fetch classes")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchClasses()
    }, [])

    return (
        <ClassContext.Provider value={{ classes, loading, error, refetch: fetchClasses }}>
            {children}
        </ClassContext.Provider>
    )
}

export const useClassContext = () => {
    const context = useContext(ClassContext)
    if (!context) {
        throw new Error("useClassContext must be used within a ClassProvider")
    }
    return context
}
