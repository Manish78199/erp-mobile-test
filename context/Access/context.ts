import { createContext } from "react";


interface  PermissionMap {
  [module: string]: string[];
}
interface SetProfileAuthrization {
    Role: string;
    Permission:PermissionMap
    setAuthorization:(role:string,permissions:any)=>void;
  }
export const UserAuthorization = createContext<SetProfileAuthrization | undefined>(undefined);
