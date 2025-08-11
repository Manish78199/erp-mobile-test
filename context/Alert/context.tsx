import { createContext } from "react";




interface AlertContextType {
  showAlert: (type: "SUCCESS" | "INFO" | "ERROR", message: string,) => void;
}
const AlertContext = createContext<AlertContextType>({
  showAlert: (type: "SUCCESS" | "INFO" | "ERROR", message: string) => {}
})

export { AlertContext };

