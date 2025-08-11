import axios from "axios"

import { ApiRoute } from "@/constants/apiRoute"

export interface LoginRequest {
  userId: string
  school_code: string
  password: string
}

export interface LoginResponse {
  data: {
    message: string
    data: {
      access_token: string
      user: any
    }
  }
}

export const EmployeeLoginRequest = async (data: LoginRequest): Promise<LoginResponse> => {

    const response = await axios.post(ApiRoute.login.employeeLogin, data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response
}
