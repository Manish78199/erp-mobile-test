import { createContext } from "react";




interface StudentAppDataType {
  profile: any | null
  refresh: () => void 
}
const StudentAppDataContext = createContext<StudentAppDataType>({
  profile: null,
  refresh: () => void 0 
})

export { StudentAppDataContext };

