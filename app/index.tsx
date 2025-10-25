

import { useState, useEffect, useContext } from "react"
import {
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFormik } from "formik"
import { Typography } from "@/components/Typography"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import * as Notifications from 'expo-notifications'
import LoadingAnimation from "@/components/LoadingAnimation"

// Import your services
import { studentLoginRequest } from "@/service/student/login"
import { LoginSchema } from "@/schema/login"
import { registerForPushNotificationsAsync } from "@/utils/notifications"
import { savefcmToken } from "@/service/student/fcm"
import { AlertContext } from "@/context/Alert/context"
import { StudentAppDataContext } from "@/context/Student/context"
import { EmployeeLoginRequest } from "@/service/management/login"
// import { AlertContext } from '@/context/Alert/context';
// import { UserTypeContext } from '@/context/RoleAuth/context';

const { width, height } = Dimensions.get("window")

interface LoginFormData {
  userId: string
  school_code: string
  password: string
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({

    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
  }),
});



export default function Login() {
  const router = useRouter()

  const loginImage = require("@/assets/images/login/login_child.png")

  const [userRole, setUserRole] = useState<"STUDENT" | "MANAGEMENT">("MANAGEMENT")

  const [requesting, setRequesting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  const [checked, setChecked] = useState(false)


  const { refresh: refreshProfile } = useContext(StudentAppDataContext)
  const { showAlert } = useContext(AlertContext)



  // Mock token verification function
  const VerifyToken = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token")
      if (token) {
        // Here you would verify the token with your backend
        // For now, we'll just return "STUDENT" if token exists
        return null
      }
      return null
    } catch (error) {
      console.error("Token verification error:", error)
      return null
    }
  }

  useEffect(() => {
    const checkLogged = async () => {
      setLoading(true)
      try {
        const role = await VerifyToken()
        if (role === "STUDENT") {
          // refreshProfile()
          router.replace("/student") 
        } else if (role === "MANAGEMENT") {
          router.replace("/management")
        } else {
          setChecked(true)
          setLoading(false)
          return
        }
      } catch (error) {
        console.error("Login check error:", error)
      } finally {
        setChecked(true)
        setLoading(false)
      }
    }

    checkLogged()
  }, [])


  // FCM Token Save Function
  const saveFcmTokenRequest = async () => {
    try {
      const newToken = await registerForPushNotificationsAsync();
      console.log(newToken, 'newToken');
      if (newToken) {
        const savedToken = await savefcmToken(String(newToken));
        console.log('FCM token saved successfully');
      }
    } catch (error) {
      console.log("FCM token save error", error);
    }
  }



  const submitForm = async (values: LoginFormData) => {
    setRequesting(true)
    try {
      if (userRole === "STUDENT") {
        const response = await studentLoginRequest(values)
        await AsyncStorage.setItem("access_token", response?.data?.data.access_token)
        await saveFcmTokenRequest()
        router.push("/student")

      } else if (userRole === "MANAGEMENT") {
        const response = await EmployeeLoginRequest(values)
        await AsyncStorage.setItem("access_token", response?.data?.data.access_token)
        router.push("/management")
      }
    } catch (error: any) {
      console.log(error)
      showAlert("ERROR", error.response?.data?.message || "Login failed");
    } finally {
      setRequesting(false)
    }
  }

  // Formik Configuration
  const { handleChange, values, errors, touched, handleSubmit, setFieldValue, handleBlur } = useFormik<LoginFormData>({
    initialValues: {
      userId: "",
      school_code: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: submitForm,
  })





  useEffect(() => {

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log("Foreground notification received:", notification);
    });

    return () => subscription.remove();
  }, []);




  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("Notification tapped / background:", response);
    });

    return () => subscription.remove();
  }, []);


  // Show loading animation while verifying token
  if (loading || !checked) {
    return <LoadingAnimation />
  }













  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="light-content" backgroundColor="#5B7FE5" />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Background with gradient effect */}
          <View className="flex-1 bg-blue-500">
            {/* Decorative Elements */}
            <View className="absolute top-20 left-8">
              <View className="w-12 h-12 bg-yellow-400 rounded-full"></View>
            </View>
            <View className="absolute top-16 right-12">
              <View className="w-2 h-2 bg-white rounded-full"></View>
            </View>
            <View className="absolute top-32 right-8">
              <View className="w-1 h-1 bg-white rounded-full"></View>
            </View>
            <View className="absolute top-24 left-20">
              <View className="w-1 h-1 bg-white rounded-full"></View>
            </View>
            {/* Clouds */}
            <View className="absolute top-28 left-16">
              <View className="w-8 h-4 bg-white rounded-full"></View>
            </View>
            <View className="absolute top-36 right-20">
              <View className="w-6 h-3 bg-white rounded-full"></View>
            </View>
            {/* Paper Planes */}
            <View className="absolute top-20 right-24">
              <View
                style={{
                  width: 0,
                  height: 0,
                  borderLeftWidth: 8,
                  borderRightWidth: 8,
                  borderBottomWidth: 16,
                  borderLeftColor: "transparent",
                  borderRightColor: "transparent",
                  borderBottomColor: "white",
                  transform: [{ rotate: "20deg" }],
                }}
              />
            </View>
            {/* Planet */}
            <View className="absolute top-16 right-4">
              <View className="w-8 h-8 bg-purple-400 rounded-full">
                <View className="w-10 h-1 bg-purple-300 absolute top-3 -left-1 rounded-full transform rotate-12"></View>
              </View>
            </View>

            {/* Student Character Image */}
            <View className="items-center mt-16">
              <Image source={loginImage} className="w-56 h-40" resizeMode="contain" />
            </View>

            {/* Main Content Card */}
            <View className="flex-1 mt-16">
              <View className="bg-white rounded-t-3xl flex-1 px-6 pt-8">
                {/* Title */}
                <Typography className="text-3xl font-bold text-gray-900 mb-2">Hi Student</Typography>
                <Typography className="text-gray-500 text-base mb-8">Login to continue</Typography>

                {/* Form */}
                <View>
                  {/* School Code Input */}
                  <View className="mb-4">
                    <Typography className="text-gray-700 text-sm mb-2 font-medium">School Code</Typography>
                    <TextInput
                      value={values.school_code}
                      onChangeText={handleChange("school_code")}
                      onBlur={handleBlur("school_code")}
                      className={`text-gray-900 py-3 px-4 rounded-lg text-base border ${errors.school_code && touched.school_code ? "border-red-500" : "border-gray-200"
                        } bg-gray-50`}
                      placeholder="Enter your school code"
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="none"
                    />
                    {errors.school_code && touched.school_code && (
                      <Typography className="text-red-500 text-xs mt-1">{errors.school_code}</Typography>
                    )}
                  </View>

                  {/* User ID Input */}
                  <View className="mb-4">
                    <Typography className="text-gray-700 text-sm mb-2 font-medium">User ID</Typography>
                    <TextInput
                      value={values.userId}
                      onChangeText={handleChange("userId")}
                      onBlur={handleBlur("userId")}
                      className={`text-gray-900 py-3 px-4 rounded-lg text-base border ${errors.userId && touched.userId ? "border-red-500" : "border-gray-200"
                        } bg-gray-50`}
                      placeholder="Enter your user ID"
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="none"
                    />
                    {errors.userId && touched.userId && (
                      <Typography className="text-red-500 text-xs mt-1">{errors.userId}</Typography>
                    )}
                  </View>

                  {/* Password Input */}
                  <View className="mb-6">
                    <Typography className="text-gray-700 text-sm mb-2 font-medium">Password</Typography>
                    <View className="relative">
                      <TextInput
                        value={values.password}
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        secureTextEntry={!showPassword}
                        className={`text-gray-900 py-3 px-4 pr-12 rounded-lg text-base border ${errors.password && touched.password ? "border-red-500" : "border-gray-200"
                          } bg-gray-50`}
                        placeholder="Enter your password"
                        placeholderTextColor="#9CA3AF"
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3"
                      >
                        <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#9CA3AF" />
                      </TouchableOpacity>
                    </View>
                    {errors.password && touched.password && (
                      <Typography className="text-red-500 text-xs mt-1">{errors.password}</Typography>
                    )}
                  </View>

                  {/* Login Button */}
                  {requesting ? (
                    <TouchableOpacity
                      disabled={true}
                      className="rounded-xl py-4 mb-6 flex-row items-center justify-center bg-gray-400"
                    >
                      <ActivityIndicator size="small" color="white" />
                      <Typography className="text-white font-semibold text-base ml-2">Login</Typography>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleSubmit()}
                      className="rounded-xl py-4 mb-6 flex-row items-center justify-center bg-blue-500"
                      style={{ backgroundColor: "#5B7FE5" }}
                    >
                      <Typography className="text-white font-semibold text-base mr-2">Login</Typography>
                      <Ionicons name="arrow-forward" size={20} color="white" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Footer */}
                <View className="items-center pb-6">
                  <Typography className="text-gray-400 text-xs">© 2024 VEDATRON. All rights reserved.</Typography>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
