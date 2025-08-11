import { createContext } from "react";




interface StudentAppDataType {
  profile:{
    full_name:string,
    class_name:string,
    profileImage:string
  } |null
}
const StudentAppDataContext = createContext<StudentAppDataType>({
  profile: null
})

export { StudentAppDataContext };

