
import { createContext } from "react"

export interface SchoolClass {
    _id: string
    name: string
    classCode: string
    studentCount: number,
    subjectCount: number
}

interface ClassContextType {
    classes: SchoolClass[]
    loading: boolean
    error: string | null
    refetch: () => Promise<void>
}

const ClassContext = createContext<ClassContextType | null>(null)

export {
    ClassContext
}